import type { Metadata } from 'next';
import { Navbar, Footer } from '@/components';
import { generateMetadata } from '@/lib/metadata';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = generateMetadata({
	title: 'Contact Us | Terminus Industrials',
	description: 'Contact Terminus Industrials - Defense-Grade Advanced Manufacturing',
});

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
