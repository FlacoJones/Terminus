"use client";

import Image from "next/image";
import { getAssetTier, pickHeroAssets } from "@/lib/assetTier";
import styles from "./HeroVideo.module.css";

export function HeroVideo() {
	const assets = pickHeroAssets(getAssetTier());

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
