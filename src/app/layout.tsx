import type { Metadata } from 'next';
import './globals.css';
import { defaultMetadata } from '@/lib/metadata';
import { ThemeToggle } from '@/components';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					// Set theme before paint to avoid flash.
					dangerouslySetInnerHTML={{
						__html: `
(function () {
  try {
    var key = 'terminus-theme';
    var stored = localStorage.getItem(key);
    var theme = (stored === 'light' || stored === 'dark')
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();`,
					}}
				/>
			</head>
			<body suppressHydrationWarning>
				<ThemeToggle />
				{children}
			</body>
		</html>
	);
}
