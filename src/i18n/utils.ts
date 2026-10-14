import { LOCALES, DEFAULT_LOCALE, type LocaleId } from './config.ts';

/**
 * Identify the locale from the current URL pathname.
 * Assumes English has no prefix and others have exactly one prefix.
 */
export function getLocaleFromUrl(url: URL): LocaleId {
  const [, prefix] = url.pathname.split('/');
  
  for (const [key, localeConfig] of Object.entries(LOCALES)) {
    // Skip empty prefix (English) in this check since we are looking at the first path segment
    if (localeConfig.prefix !== '' && localeConfig.prefix === `/${prefix}` && localeConfig.isActive) {
      return key as LocaleId;
    }
  }
  
  return DEFAULT_LOCALE;
}

export function getRelativeLocaleUrl(localeId: LocaleId, path: string): string {
  const localeConfig = LOCALES[localeId] || LOCALES[DEFAULT_LOCALE];
  
  // Clean leading slash for consistent joining
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Handle hash and query strings if present in path input
  let hashOrQuery = '';
  const hashIdx = cleanPath.indexOf('#');
  const queryIdx = cleanPath.indexOf('?');
  const splitIdx = (hashIdx !== -1 && queryIdx !== -1)
    ? Math.min(hashIdx, queryIdx)
    : (hashIdx !== -1 ? hashIdx : queryIdx);

  if (splitIdx !== -1) {
    hashOrQuery = cleanPath.slice(splitIdx);
    cleanPath = cleanPath.slice(0, splitIdx);
  }
  
  let joined: string;
  if (localeConfig.prefix === '') {
    joined = cleanPath ? `/${cleanPath}` : '/';
  } else {
    joined = cleanPath ? `${localeConfig.prefix}/${cleanPath}` : `${localeConfig.prefix}/`;
  }

  // Normalize double slashes
  joined = joined.replace(/\/{2,}/g, '/');

  // Check if filename has an extension (e.g. file.xml, file.png)
  const lastSegment = joined.split('/').pop() || '';
  if (!lastSegment.includes('.')) {
    if (!joined.endsWith('/')) {
      joined = `${joined}/`;
    }
  }
  
  return joined + hashOrQuery;
}
