import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import { CadWorkspace } from './CadWorkspace';
import { ThemeToggle, MobileGate } from '@/components';

export const metadata: Metadata = generateMetadata({
	title: 'Advance Purchase Indication - Terminus Industrials',
	description: 'Advance Purchase Indication - Terminus Industrials',
	ogDescription: 'Defense-Grade Advanced Manufacturing',
});

export default function CadPage() {
	return (
		<MobileGate>
			<ThemeToggle />
			<CadWorkspace />
		</MobileGate>
	);
}
