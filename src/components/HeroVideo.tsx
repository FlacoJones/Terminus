import styles from './HeroVideo.module.css';

export function HeroVideo() {
	return (
		<video
			className={styles.heroVideo}
			autoPlay
			muted
			loop
			playsInline
			preload="auto"
			poster="/hero/large/transformer_poster.png"
		>
			<source src="/hero/large/transformer.mp4" type="video/mp4" />
		</video>
	);
}
