import type { Metadata } from 'next';
import { Navbar, Footer } from '@/components';
import { ContactForm } from './ContactForm';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cad.terminusindustrials.com';

export const metadata: Metadata = {
	title: 'Contact Us | Terminus Industrials',
	description: 'Contact Terminus Industrials - Defense-Grade Advanced Manufacturing',
	openGraph: {
		title: 'Contact Us | Terminus Industrials',
		description: 'Contact Terminus Industrials - Defense-Grade Advanced Manufacturing',
		images: [
			{
				url: `${baseUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: 'Contact Us - Terminus Industrials',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		site: '@TerminusIndstrl',
		title: 'Contact Us | Terminus Industrials',
		description: 'Contact Terminus Industrials - Defense-Grade Advanced Manufacturing',
		images: [
			{
				url: `${baseUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: 'Contact Us - Terminus Industrials',
			},
		],
	},
};

export default function ContactUsPage() {
	return (
		<>
			<Navbar />

			<div className="form-page-container">
				<div className="form-wrapper">
					<div
						className="contact-modal"
						style={{
							border: 'none',
							padding: 0,
							boxShadow: 'none',
							background: 'transparent',
						}}
					>
						<h2>Contact Us</h2>
						<ContactForm />
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}
