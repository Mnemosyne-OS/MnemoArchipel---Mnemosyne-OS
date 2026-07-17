import enDict from '../locales/en.json';
import frDict from '../locales/fr.json';
import esDict from '../locales/es.json';

/**
 * Custom translation helper resolving localized keys from dictionaries.
 * Fallbacks to English if key is missing in active target language.
 */
export function getTranslation(
  activeLang: 'en' | 'fr' | 'es',
  key: string,
  replacements?: Record<string, string | number>
): string {
  const dict = activeLang === 'fr' ? frDict : activeLang === 'es' ? esDict : enDict;
  let val = (dict as Record<string, string>)[key] || (enDict as Record<string, string>)[key] || key;
  if (replacements) {
    Object.entries(replacements).forEach(([k, v]) => {
      val = val.replace(`{${k}}`, String(v));
    });
  }
  return val;
}
