import type { Metadata } from 'next';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cad.terminusindustrials.com';

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
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
				url: `${baseUrl}/og-image.png`,
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
		site: '@TerminusIndstrl',
		creator: '@TerminusIndstrl',
		title: 'Terminus Industrials',
		description: 'Defense-Grade Advanced Manufacturing',
		images: [
			{
				url: `${baseUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: 'Terminus Industrials Logo',
			},
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning>{children}</body>
		</html>
	);
}
