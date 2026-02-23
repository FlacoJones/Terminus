"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
