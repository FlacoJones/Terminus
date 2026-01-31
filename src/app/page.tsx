import Image from 'next/image';
import { Navbar, Footer } from '@/components';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className={styles.heroContainer}>
        <Image
          src="/public/transformer.svg"
          alt="Industrial Background"
          className={styles.backgroundImage}
          width={1920}
          height={1080}
          priority
        />

        {/* Overlayed Content */}
        <div className={styles.heroContent}>
          <Image
            src="/public/wordmark.svg"
            alt="Terminus Industrials"
            className={styles.wordmark}
            width={1000}
            height={200}
            priority
          />
          <Image
            src="/public/subheader_gray.svg"
            alt="Defense-Grade Advanced Manufacturing"
            className={styles.subheader}
            width={850}
            height={100}
            priority
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
