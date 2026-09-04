import { SITE_CONFIG } from '../site.config';
import { ACTIVE_LOCALES } from '../i18n/config';

export async function GET() {
	// Discover guide pages by reading the directory during build/runtime
	// We'll discover the English guide pages and then replicate them across locales
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

	// Combine all paths for English base
	const basePaths = [...staticPages, ...guideSlugs, ...durationPages];

	// Generate all localized paths
	const allPaths: string[] = [];
	for (const locale of ACTIVE_LOCALES) {
		for (const pagePath of basePaths) {
			const prefix = locale.prefix;
			// Combine prefix and pagePath appropriately
			let fullPath = prefix;
			if (pagePath !== '') {
				fullPath = prefix === '' ? pagePath : `${prefix}/${pagePath}`;
			}

			// Remove leading slash for URL constructor
			if (fullPath.startsWith('/')) {
				fullPath = fullPath.slice(1);
			}
			allPaths.push(fullPath);
		}
	}

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
