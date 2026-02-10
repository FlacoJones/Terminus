import { Suspense } from 'react';
import type { Metadata } from 'next';
import { APIForm } from './APIForm';
import styles from './APIForm.module.css';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cad.terminusindustrials.com';

export const metadata: Metadata = {
	title: 'CAD - Terminus Industrials',
	description: 'CAD - Terminus Industrials',
	openGraph: {
		title: 'CAD - Terminus Industrials',
		description: 'Defense-Grade Advanced Manufacturing',
		images: [
			{
				url: `${baseUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: 'CAD - Terminus Industrials',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		site: '@TerminusIndstrl',
		title: 'CAD - Terminus Industrials',
		description: 'Defense-Grade Advanced Manufacturing',
		images: [
			{
				url: `${baseUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: 'CAD - Terminus Industrials',
			},
		],
	},
};

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
