import type { Metadata } from 'next';
import './globals.css';
import { defaultMetadata } from '@/lib/metadata';
import { MobileGate } from '@/components';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning>
				<MobileGate>{children}</MobileGate>
			</body>
		</html>
	);
}
