/* eslint-disable @next/next/no-img-element */
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
        <img
          src="/x.png"
          alt="X (Twitter)"
          className={styles.xLogo}
        />
      </a>
    </footer>
  );
}
