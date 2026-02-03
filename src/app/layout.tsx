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
		siteName: 'Terminus Industrials',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'Terminus Industrials Logo',
				type: 'image/png',
			},
		],
		type: 'website',
		locale: 'en_US',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Terminus Industrials',
		description: 'Defense-Grade Advanced Manufacturing',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'Terminus Industrials Logo',
			},
		],
		creator: '@TerminusIndstrl',
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${roboto.variable} ${robotoMono.variable}`} suppressHydrationWarning>
			<body suppressHydrationWarning>{children}</body>
		</html>
	);
}
