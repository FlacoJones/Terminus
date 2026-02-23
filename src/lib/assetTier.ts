export type AssetTier = "medium" | "large";

export function getAssetTier(): AssetTier {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
  return isMobile ? "medium" : "large";
}

export function pickHeroAssets(tier: AssetTier) {
  const poster = `/hero/${tier}/transformer_poster.png`;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false);

  const videoSrc = prefersReducedMotion
    ? null
    : `/hero/${tier}/transformer.mp4`;

  return { tier, poster, videoSrc, prefersReducedMotion };
}
