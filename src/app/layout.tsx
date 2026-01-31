import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const robotoMono = Roboto_Mono({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://terminusindustrials.com'),
  title: 'Terminus Industrials',
  description: 'Defense-Grade Advanced Manufacturing',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Terminus Industrials',
    description: 'Defense-Grade Advanced Manufacturing',
    images: ['/public/logo.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terminus Industrials',
    description: 'Defense-Grade Advanced Manufacturing',
    images: ['/public/logo.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
