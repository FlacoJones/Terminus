"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { getAssetTier, pickHeroAssets } from "@/lib/assetTier";
import styles from "./HeroVideo.module.css";

/**
 * SSR renders an empty placeholder (no asset URLs in the HTML).
 * The blocking <head> probe script has already determined the tier by the
 * time React hydrates. useLayoutEffect reads the cached result and renders
 * the correct assets before the browser ever paints — zero wasted downloads.
 */
export function HeroVideo() {
	const [assets, setAssets] = useState(() => {
		if (typeof window === "undefined") return null;
		return pickHeroAssets(getAssetTier());
	});

	useLayoutEffect(() => {
		setAssets(pickHeroAssets(getAssetTier()));
	}, []);

	if (!assets) {
		return <div className={styles.heroVideo} aria-hidden />;
	}

	if (!assets.videoSrc) {
		return (
			<Image
				className={styles.heroVideo}
				src={assets.poster}
				alt=""
				width={1920}
				height={1080}
				sizes="100vw"
				priority
				draggable={false}
			/>
		);
	}

	return (
		<video
			className={styles.heroVideo}
			autoPlay
			muted
			loop
			playsInline
			preload="auto"
			poster={assets.poster}
		>
			<source src={assets.videoSrc} type="video/mp4" />
		</video>
	);
}
