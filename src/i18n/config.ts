export const LOCALES = {
  en: {
    id: 'en',
    lang: 'en',
    prefix: '',
    name: 'English',
    isActive: true,
    isDefault: true,
  },
  es: {
    id: 'es',
    lang: 'es',
    prefix: '/es',
    name: 'Español',
    isActive: false,
    isDefault: false,
  },
  ja: {
    id: 'ja',
    lang: 'ja',
    prefix: '/ja',
    name: '日本語',
    isActive: false,
    isDefault: false,
  },
  fr: {
    id: 'fr',
    lang: 'fr',
    prefix: '/fr',
    name: 'Français',
    isActive: true,
    isDefault: false,
  },
  de: {
    id: 'de',
    lang: 'de',
    prefix: '/de',
    name: 'Deutsch',
    isActive: false,
    isDefault: false,
  },
  'pt-br': {
    id: 'pt-br',
    lang: 'pt-BR',
    prefix: '/pt-br',
    name: 'Português',
    isActive: true,
    isDefault: false,
  },
  ko: {
    id: 'ko',
    lang: 'ko',
    prefix: '/ko',
    name: '한국어',
    isActive: false,
    isDefault: false,
  },
  it: {
    id: 'it',
    lang: 'it',
    prefix: '/it',
    name: 'Italiano',
    isActive: false,
    isDefault: false,
  },
} as const;

export const DEFAULT_LOCALE = 'en';

export type LocaleId = keyof typeof LOCALES;

// Helper to get only active locales (currently just English)
export const ACTIVE_LOCALES = Object.values(LOCALES).filter(locale => locale.isActive);
