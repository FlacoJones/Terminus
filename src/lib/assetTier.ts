export type AssetTier = "small" | "medium" | "large";

interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
}

export function getAssetTier(): AssetTier {
  const ua = navigator.userAgent || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  const deviceMemoryGB =
    (navigator as NavigatorWithDeviceMemory).deviceMemory ?? null;
  const cores = navigator.hardwareConcurrency ?? null;
  const w = Math.min(window.innerWidth || 0, screen.width || 0);

  if (isMobile) {
    const lowMem = deviceMemoryGB !== null && deviceMemoryGB <= 2;
    const lowCores = cores !== null && cores <= 2;
    const smallScreen = w < 360;

    if (lowMem || (lowCores && smallScreen)) return "small";
    return "medium";
  }

  const weakDesktop =
    (deviceMemoryGB !== null && deviceMemoryGB <= 2) ||
    (cores !== null && cores <= 2);

  if (weakDesktop) return "medium";
  return "large";
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
