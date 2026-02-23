import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { defaultMetadata } from '@/lib/metadata';
import { assetTierProbeScript } from '@/lib/assetTier';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: assetTierProbeScript }} />
			</head>
			<body suppressHydrationWarning>
				{children}
				<SpeedInsights />
			</body>
		</html>
	);
}
