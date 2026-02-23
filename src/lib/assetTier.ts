export type AssetTier = "small" | "medium" | "large";

const SESSION_KEY = "asset-tier";
const VALID_TIERS: AssetTier[] = ["small", "medium", "large"];

declare global {
  interface Window {
    __assetTier?: AssetTier;
  }
}

/**
 * Inline script for <head>. Runs synchronously before the browser parses
 * <body>, so no wrong-tier asset URLs ever make it into the DOM.
 *
 * Sets window.__assetTier and sessionStorage["asset-tier"].
 * On return visits sessionStorage is read first (no re-probe).
 */
export const assetTierProbeScript = /* js */ `(function(){
  var K="asset-tier",T=["small","medium","large"];
  function idx(v){for(var i=0;i<T.length;i++)if(T[i]===v)return i;return-1}
  function mn(a,b){return idx(a)<=idx(b)?a:b}
  try{
    var c;try{c=sessionStorage.getItem(K)}catch(e){}
    if(c&&idx(c)>=0){window.__assetTier=c;return}
    var mob=/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");
    var tier=mob?"medium":"large";
    var n=navigator.connection;
    if(n){
      if(n.saveData){tier="small"}
      else{
        var e=n.effectiveType;
        if(e==="slow-2g"||e==="2g"){tier="small"}
        else{
          if(e==="3g")tier=mn(tier,"medium");
          var d=n.downlink;
          if(d!=null&&d>0){if(d<1.5)tier=mn(tier,"small");else if(d<8)tier=mn(tier,"medium")}
          var r=n.rtt;
          if(r!=null&&r>300){var i=idx(tier);if(i>0)tier=T[i-1]}
        }
      }
    }
    try{sessionStorage.setItem(K,tier)}catch(e){}
    window.__assetTier=tier;
  }catch(e){window.__assetTier="medium"}
})()`;

// ---------------------------------------------------------------------------
// Runtime helpers (used as fallback if the head script didn't run)
// ---------------------------------------------------------------------------

interface NetworkInformation {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

const TIER_RANK: Record<AssetTier, number> = { small: 0, medium: 1, large: 2 };
const RANK_TIER: AssetTier[] = ["small", "medium", "large"];

function minTier(a: AssetTier, b: AssetTier): AssetTier {
  return TIER_RANK[a] <= TIER_RANK[b] ? a : b;
}

function downgradeTier(t: AssetTier): AssetTier {
  return RANK_TIER[Math.max(0, TIER_RANK[t] - 1)] ?? "small";
}

function getConnection(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
}

function probeTier(): AssetTier {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent || "",
  );
  let tier: AssetTier = isMobile ? "medium" : "large";

  const conn = getConnection();
  if (!conn) return tier;

  if (conn.saveData) return "small";

  const { effectiveType, downlink, rtt } = conn;

  if (effectiveType === "slow-2g" || effectiveType === "2g") return "small";
  if (effectiveType === "3g") tier = minTier(tier, "medium");

  if (downlink != null && downlink > 0) {
    if (downlink < 1.5) tier = minTier(tier, "small");
    else if (downlink < 8) tier = minTier(tier, "medium");
  }

  if (rtt != null && rtt > 300) {
    tier = downgradeTier(tier);
  }

  return tier;
}

/**
 * Read the asset tier. Fast path: reads from `window.__assetTier` set by
 * the head probe script. Falls back to sessionStorage, then a live probe.
 * During SSR returns "medium" (conservative — never "large").
 */
export function getAssetTier(): AssetTier {
  if (typeof window === "undefined") return "medium";

  if (window.__assetTier) return window.__assetTier;

  try {
    const stored = sessionStorage.getItem(SESSION_KEY) as AssetTier | null;
    if (stored && VALID_TIERS.includes(stored)) {
      window.__assetTier = stored;
      return stored;
    }
  } catch { /* sessionStorage unavailable */ }

  const tier = probeTier();
  window.__assetTier = tier;
  try {
    sessionStorage.setItem(SESSION_KEY, tier);
  } catch { /* sessionStorage unavailable */ }
  return tier;
}

const VIDEO_DOWNLINK_GATE = 4;

export function pickHeroAssets(tier: AssetTier) {
  const poster = `/hero/${tier}/transformer_poster.png`;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false);

  const conn = getConnection();
  const networkBlocksVideo =
    tier === "small" ||
    (conn?.downlink != null &&
      conn.downlink > 0 &&
      conn.downlink < VIDEO_DOWNLINK_GATE);

  const videoSrc =
    prefersReducedMotion || networkBlocksVideo
      ? null
      : `/hero/${tier}/transformer.mp4`;

  return { tier, poster, videoSrc, prefersReducedMotion };
}
