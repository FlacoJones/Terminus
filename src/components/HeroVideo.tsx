'use client';

import { useState, useEffect } from 'react';
import styles from './HeroVideo.module.css';

export function HeroVideo() {
	const [fixedSize, setFixedSize] = useState<{ width: number; height: number } | null>(null);

	useEffect(() => {
		// Capture viewport size once on mount and lock the video to it
		setFixedSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	}, []);

	return (
		<video
			className={styles.heroVideo}
			style={
				fixedSize
					? { width: `${fixedSize.width}px`, height: `${fixedSize.height}px` }
					: { width: '100vw', height: '100vh' }
			}
			autoPlay
			muted
			loop
			playsInline
			preload="auto"
		>
			<source src="/transformer.mp4" type="video/mp4" />
		</video>
	);
}
