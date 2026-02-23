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
			<div className={styles.heroImageWrapper}>
				<Image
					className={styles.heroVideo}
					src={assets.poster}
					alt=""
					fill
					sizes="100vw"
					draggable={false}
				/>
			</div>
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
