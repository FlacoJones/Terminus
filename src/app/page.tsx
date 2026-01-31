/* eslint-disable @next/next/no-img-element */
import { Navbar, Footer } from '@/components';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className={styles.heroContainer}>
        <img
          src="/transformer.svg"
          alt="Industrial Background"
          className={styles.backgroundImage}
        />

        {/* Overlayed Content */}
        <div className={styles.heroContent}>
          <img
            src="/wordmark.svg"
            alt="Terminus Industrials"
            className={styles.wordmark}
          />
          <img
            src="/subheader_gray.svg"
            alt="Defense-Grade Advanced Manufacturing"
            className={styles.subheader}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
