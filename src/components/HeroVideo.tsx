"use client";

import { useEffect, useState } from "react";
import { getAssetTier, pickHeroAssets } from "@/lib/assetTier";
import type { AssetTier } from "@/lib/assetTier";
import styles from "./HeroVideo.module.css";

const DEFAULT_TIER: AssetTier = "medium";

export function HeroVideo() {
	const [assets, setAssets] = useState(() => pickHeroAssets(DEFAULT_TIER));

	useEffect(() => {
		const tier = getAssetTier();
		setAssets(pickHeroAssets(tier));
	}, []);

	if (!assets.videoSrc) {
		return (
			<img
				className={styles.heroVideo}
				src={assets.poster}
				alt=""
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
