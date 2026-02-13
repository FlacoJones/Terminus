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
			poster="/transformer_first_frame.png"
		>
			<source src="/transformer.mp4" type="video/mp4" />
		</video>
	);
}
