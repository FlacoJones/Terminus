import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components';
import { APIForm } from './APIForm';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cad.terminusindustrials.com';

export const metadata: Metadata = {
	title: 'Request Advance Purchase Indication - Terminus Industrials',
	description: 'Request Advance Purchase Indication - Terminus Industrials',
	openGraph: {
		title: 'Request Advance Purchase Indication - Terminus Industrials',
		description: 'Defense-Grade Advanced Manufacturing',
		images: [
			{
				url: `${baseUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: 'Request Advance Purchase Indication - Terminus Industrials',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		site: '@TerminusIndstrl',
		title: 'Request Advance Purchase Indication - Terminus Industrials',
		description: 'Defense-Grade Advanced Manufacturing',
		images: [
			{
				url: `${baseUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: 'Request Advance Purchase Indication - Terminus Industrials',
			},
		],
	},
};

function FormLoadingFallback() {
	return (
		<div style={{ textAlign: 'center', padding: '2rem', color: 'var(--brand-gray)' }}>
			Loading form...
		</div>
	);
}

export default function CadPage() {
	return (
		<>
			<Navbar />

			<main className="form-page-container">
				<div className="form-wrapper">
					{/* Document Header */}
					<header className="document-header">
						<h1 className="document-title">Advance Purchase Indication (API)</h1>
						<p className="document-parties">
							between
							<br />
							<strong>TERMINUS INDUSTRIALS, INC</strong>
							<br />
							&amp; Your Company
						</p>
					</header>

					{/* Section I: Purpose */}
					<section className="text-section">
						<h2 className="section-title">I. Purpose</h2>
						<p className="small-text">
							The purpose of this Advance Purchase Indication (&quot;API&quot;) is solely to
							support preliminary planning, capacity forecasting, and commercial discussions
							between the Requestor and Terminus Industrials. This API is a non-binding
							expression of interest and does not create any obligation for either party to
							enter into a definitive agreement, purchase product, reserve manufacturing
							capacity, or commit to any financial transaction. It is not an offer,
							acceptance, purchase order, or contract. Terminus Industrials, Inc. will
							contact you directly regarding additional terms including indicative pricing
							and delivery.
						</p>
					</section>

					{/* Section II: Technical Requirements Form */}
					<section className="form-section">
						<h2 className="section-title">II. Indicative Technical Requirements</h2>
						<p className="section-note">
							Note that specifications are indicative and subject to final engineering
							design at time of formal purchase order.
						</p>

						<Suspense fallback={<FormLoadingFallback />}>
							<APIForm />
						</Suspense>
					</section>
				</div>
			</main>
		</>
	);
}
