import Image from 'next/image';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.madeInUsa}>100% Made in USA</span>
      <a
        href="https://x.com/TerminusIndstrl"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.socialLink}
      >
        <Image
          src="/public/x.png"
          alt="X (Twitter)"
          className={styles.xLogo}
          width={24}
          height={24}
        />
      </a>
    </footer>
  );
}
