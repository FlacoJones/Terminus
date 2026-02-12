import Image from 'next/image';
import styles from './Footer.module.css';

interface FooterProps {
	fixed?: boolean;
}

export function Footer({ fixed = false }: FooterProps) {
	return (
		<footer className={fixed ? styles.footerFixed : styles.footer}>
			<div className={styles.footerContent}>
				<div className={styles.socialLinks}>
					<a
						href="https://x.com/TerminusIndstrl"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
						aria-label="Follow us on X"
					>
						<Image
							src="/x.png"
							alt="X (Twitter)"
							width={25}
							height={25}
							className={styles.socialLogo}
						/>
					</a>
					<a
						href="https://www.linkedin.com/company/terminusindustrials"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.socialLink}
						aria-label="Follow us on LinkedIn"
					>
						<Image
							src="/li.png"
							alt="LinkedIn"
							width={25}
							height={25}
							className={styles.socialLogo}
						/>
					</a>
				</div>
				<div className={styles.textRow}>
					<span className={styles.copyright}>
						&copy; 2026 TERMINUS INDUSTRIALS, INC.
					</span>
					<span className={styles.tagline}>
						RELIABLE POWER STARTS WITH HOW IT&apos;S BUILT.
					</span>
				</div>
			</div>
		</footer>
	);
}
