import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import themeJson from '../../theme.json';

export type Lang = 'en' | 'ar';
export const languages: Record<Lang, { dir: 'ltr' | 'rtl'; label: string }> = {
  en: { dir: 'ltr', label: 'English' },
  ar: { dir: 'rtl', label: 'العربية' },
};

const root = join(process.cwd(), 'content');

function readYaml(path: string) {
  return parse(readFileSync(path, 'utf8')) ?? {};
}

/** Loads content/<lang>/<name>.yaml, falling back to English if a translation is missing. */
export function getPage<T = any>(name: string, lang: Lang = 'en'): T {
  const file = join(root, lang, `${name}.yaml`);
  return readYaml(existsSync(file) ? file : join(root, 'en', `${name}.yaml`)) as T;
}

export const settings = readYaml(join(root, 'settings.yaml')) as any;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Language of the page being built, read from its address (/ar/... is Arabic). */
export const langOf = (url: URL): Lang => (/^\/ar(\/|$)/.test(url.pathname.slice(base.length)) ? 'ar' : 'en');

/** The same page in the other language (used by the language switch). */
export function switchLangPath(url: URL): { lang: Lang; path: string } {
  const lang = langOf(url);
  const rest = url.pathname.slice(base.length).replace(/^\/ar(?=\/|$)/, '') || '/';
  return lang === 'en' ? { lang: 'ar', path: `${base}/ar${rest === '/' ? '/' : rest}` } : { lang: 'en', path: `${base}${rest}` };
}

/** Short fixed phrases (section labels, captions): English in the code, Arabic in content/ar/strings.yaml. */
const strings: Record<string, string> = existsSync(join(root, 'ar', 'strings.yaml')) ? readYaml(join(root, 'ar', 'strings.yaml')) : {};
export const tr = (s: string, lang: Lang = 'en') => (lang === 'en' ? s : strings[s] ?? s);

/** School settings with the Arabic wording (the "ar:" block in settings.yaml) applied on Arabic pages. */
export function localSettings(lang: Lang = 'en') {
  const o = lang === 'en' ? {} : settings[lang] ?? {};
  return { ...settings, ...o, contact: { ...settings.contact, ...(o.contact ?? {}) } };
}
export const theme = themeJson;
