import { Navbar, Footer } from '@/components';
import { HeroVideo } from '@/components/HeroVideo';
import styles from './page.module.css';

export default function HomePage() {
	return (
		<>
			<Navbar />

			{/* Hero Section with Centered Video */}
			<div className={styles.heroContainer}>
				<HeroVideo />
			</div>

			<Footer fixed />
		</>
	);
}
