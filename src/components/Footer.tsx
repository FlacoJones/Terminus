import styles from './Footer.module.css';

export function Footer() {
	return (
		<footer className={styles.footer}>
			<span className={styles.tagline}>
				RELIABLE POWER STARTS WITH HOW IT&apos;S BUILT.
			</span>
			<span className={styles.copyright}>
				&copy; 2026 TERMINUS INDUSTRIALS, INC.
			</span>
		</footer>
	);
}
