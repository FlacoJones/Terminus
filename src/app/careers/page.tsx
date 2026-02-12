import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components';
import styles from './Careers.module.css';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cad.terminusindustrials.com';

export const metadata: Metadata = {
	title: 'Careers | Terminus Industrials',
	description: 'Join Terminus Industrials - Career opportunities in defense-grade advanced manufacturing',
	openGraph: {
		title: 'Careers | Terminus Industrials',
		description: 'Join Terminus Industrials - Career opportunities in defense-grade advanced manufacturing',
		images: [
			{
				url: `${baseUrl}/terminus_logo_og.png`,
				width: 1200,
				height: 630,
				alt: 'Careers - Terminus Industrials',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		site: '@TerminusIndstrl',
		title: 'Careers | Terminus Industrials',
		description: 'Join Terminus Industrials - Career opportunities in defense-grade advanced manufacturing',
		images: [
			{
				url: `${baseUrl}/terminus_logo_og.png`,
				width: 1200,
				height: 630,
				alt: 'Careers - Terminus Industrials',
			},
		],
	},
};

const openPositions = [
	{
		title: 'Chief Technology Officer',
		slug: 'chief-technology-officer',
		location: 'Central Texas (Greater Austin region)',
		description: 'Founding executive responsible for defining and owning Terminus\' full technology stack—from transformer design software and digital twins to factory automation, controls, data systems, and AI-driven optimization.',
	},
	{
		title: 'Head of Product Engineering – Large Power Transformers',
		slug: 'head-of-product-engineering',
		location: 'Central Texas (Greater Austin region)',
		description: 'Lead all design, materials, and manufacturability initiatives for Terminus\' transformer product line. Define the company\'s technical DNA by translating decades of power-engineering know-how into modern, automated, and scalable production.',
	},
	{
		title: 'Head of Quality and Test Compliance – Large Power Transformers',
		slug: 'head-of-quality-and-test-compliance',
		location: 'Central Texas (Greater Austin region)',
		description: 'Design, implement, and own laboratory accreditation, testing procedures, and compliance systems. Take transformer test facilities from greenfield to ISO/IEC 17025-accredited.',
	},
];

export default function CareersPage() {
	return (
		<>
			<Navbar />

			<div className="form-page-container">
				<div className="form-wrapper">
					<div className={styles.careersContent}>
						<h1 className={styles.title}>Careers</h1>

						<p className={styles.intro}>
							Join the founding team at Terminus Industrials and help build the future of
							American manufacturing infrastructure.
						</p>

						<div className={styles.positionsList}>
							<h2 className={styles.sectionTitle}>Open Positions</h2>

							{openPositions.map((position) => (
								<Link
									key={position.slug}
									href={`/careers/${position.slug}`}
									className={styles.positionCard}
								>
									<h3 className={styles.positionTitle}>{position.title}</h3>
									<p className={styles.positionLocation}>{position.location}</p>
									<p className={styles.positionDescription}>{position.description}</p>
									<span className={styles.viewDetails}>View Details →</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}
