import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://cad.terminusindustrials.com';

interface MetadataConfig {
	title: string;
	description: string;
	ogTitle?: string;
	ogDescription?: string;
}

export function generateMetadata(config: MetadataConfig): Metadata {
	const ogTitle = config.ogTitle || config.title;
	const ogDescription = config.ogDescription || config.description;

	return {
		title: config.title,
		description: config.description,
		openGraph: {
			title: ogTitle,
			description: ogDescription,
			images: [
				{
					url: `${baseUrl}/terminus_wide.png`,
					width: 1200,
					height: 630,
					alt: 'Terminus Industrials',
				},
			],
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			site: '@TerminusIndstrl',
			creator: '@TerminusIndstrl',
			title: ogTitle,
			description: ogDescription,
			images: [
				{
					url: `${baseUrl}/terminus_wide.png`,
					width: 1200,
					height: 630,
					alt: 'Terminus Industrials',
				},
			],
		},
	};
}

export const defaultMetadata: Metadata = {
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
				url: `${baseUrl}/terminus_wide.png`,
				width: 1200,
				height: 630,
				alt: 'Terminus Industrials',
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
				url: `${baseUrl}/terminus_wide.png`,
				width: 1200,
				height: 630,
				alt: 'Terminus Industrials',
			},
		],
	},
};
