import { Navbar, Footer } from '@/components';
import styles from './page.module.css';

export default function HomePage() {
	return (
		<>
			<Navbar />

			{/* Hero Section with Centered Video */}
			<div className={styles.heroContainer}>
				<video
					className={styles.heroVideo}
					autoPlay
					muted
					loop
					playsInline
					preload="auto"
				>
					<source src="/transformer.mp4" type="video/mp4" />
				</video>
			</div>

			<Footer />
		</>
	);
}
