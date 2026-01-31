import type { Metadata } from 'next';
import { Navbar } from '@/components';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Terminus Industrials',
  description: 'Contact Terminus Industrials - Defense-Grade Advanced Manufacturing',
  openGraph: {
    title: 'Contact Us | Terminus Industrials',
    description: 'Contact Terminus Industrials - Defense-Grade Advanced Manufacturing',
    images: ['/public/logo.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Terminus Industrials',
    description: 'Contact Terminus Industrials - Defense-Grade Advanced Manufacturing',
    images: ['/public/logo.svg'],
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
    </>
  );
}
