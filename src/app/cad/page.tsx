import type { Metadata } from 'next';
import styles from './Cad.module.css';

export const metadata: Metadata = {
  title: 'CAD | Terminus Industrials',
  description: 'Terminus Industrials CAD',
};

export default function CadPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>CAD</h1>
    </main>
  );
}
