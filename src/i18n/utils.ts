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

/**
 * Generate a path for a specific locale based on an English/base route.
 * Assumes path input does not already have a locale prefix.
 */
export function getRelativeLocaleUrl(localeId: LocaleId, path: string): string {
  const localeConfig = LOCALES[localeId] || LOCALES[DEFAULT_LOCALE];
  
  // Clean leading slash for consistent joining
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (localeConfig.prefix === '') {
    return `/${cleanPath}`;
  }
  
  const joined = `${localeConfig.prefix}/${cleanPath}`;
  // Clean up potential trailing slash if path was empty
  return joined === `${localeConfig.prefix}/` ? localeConfig.prefix + '/' : joined;
}
