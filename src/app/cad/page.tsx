import { Suspense } from 'react';
import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import { APIForm } from './APIForm';
import styles from './APIForm.module.css';
import { ThemeToggle } from '@/components';

export const metadata: Metadata = generateMetadata({
	title: 'CAD - Terminus Industrials',
	description: 'CAD - Terminus Industrials',
	ogDescription: 'Defense-Grade Advanced Manufacturing',
});

function FormLoadingFallback() {
	return (
		<div style={{ textAlign: 'center', padding: '2rem', color: 'var(--brand-gray)' }}>
			Loading...
		</div>
	);
}

export default function CadPage() {
	return (
		<>
			<ThemeToggle />
			<main className={styles.cadLayout}>
				{/* Left Panel: Sidebar with form */}
				<aside className={styles.sidebar}>
					<div className={styles.sidebarHeader}>
						<h1 className={styles.sidebarTitle}>Transformer Spec</h1>
						<p className={styles.sidebarSubtitle}>Advance Purchase Indication</p>
					</div>

					<div className={styles.sidebarContent}>
						<Suspense fallback={<FormLoadingFallback />}>
							<APIForm />
						</Suspense>
					</div>
				</aside>

				{/* Right Panel: Canvas / Viewport */}
				<div className={styles.canvas}>
					<div className={styles.canvasPlaceholder}>
						<span className={styles.canvasLabel}>VIEWPORT</span>
					</div>
				</div>
			</main>
		</>
	);
}
