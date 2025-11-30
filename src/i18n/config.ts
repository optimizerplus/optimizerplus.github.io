export const locales = ['en', 'fr', 'de', 'es', 'it', 'pt', 'pl', 'ru', 'uk', 'cs', 'sk', 'hu', 'ro', 'tr', 'sv'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  pl: 'Polski',
  ru: 'Русский',
  uk: 'Українська',
  cs: 'Čeština',
  sk: 'Slovenčina',
  hu: 'Magyar',
  ro: 'Română',
  tr: 'Türkçe',
  sv: 'Svenska',
};

export const localeCodes: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  es: 'ES',
  it: 'IT',
  pt: 'PT',
  pl: 'PL',
  ru: 'RU',
  uk: 'UK',
  cs: 'CS',
  sk: 'SK',
  hu: 'HU',
  ro: 'RO',
  tr: 'TR',
  sv: 'SV',
};
