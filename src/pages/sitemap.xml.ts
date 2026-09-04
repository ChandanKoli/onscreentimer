import { SITE_CONFIG } from '../site.config';
import fs from 'fs';
import path from 'path';

export async function GET() {
	// Discover guide pages by reading the directory during build/runtime
	// For Astro endpoint, we can use import.meta.glob
	const guideModules = import.meta.glob('./guide/*.astro');
	const guideSlugs = Object.keys(guideModules).map(filePath => {
		const basename = filePath.split('/').pop()?.replace('.astro', '');
		return basename === 'index' ? 'guide' : `guide/${basename}`;
	});

	// Defined static pages
	const staticPages = [
		'',
		'guide',
		'faq',
		'privacy',
		'terms',
		'contact',
	];

	// Duration pages
	const durations = [
		'1-minute',
		'5-minutes',
		'10-minutes',
		'15-minutes',
		'20-minutes',
		'25-minutes',
		'30-minutes',
		'60-minutes'
	];
	const durationPages = durations.map(d => `timer/${d}`);

	// Combine all paths
	const allPaths = [...staticPages, ...guideSlugs, ...durationPages];

	// Generate XML
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${allPaths.map(pagePath => {
		const url = new URL(pagePath, SITE_CONFIG.url).href;
		// Ensure trailing slash for consistency with canonical URL
		const finalUrl = url.endsWith('/') ? url : `${url}/`;
		return `
	<url>
		<loc>${finalUrl}</loc>
	</url>`;
	}).join('')}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
