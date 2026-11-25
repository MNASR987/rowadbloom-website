import { settings } from './content';

const c = settings.contact ?? {};
export const phone: string = c.phone ?? '';
export const email: string = c.email ?? '';
export const whatsappNumber: string = String(c.whatsapp ?? '').replace(/\D/g, '');
export const whatsappNumber2: string = String(c.whatsapp2 ?? '').replace(/\D/g, '');
/** "966541834359" → "054 183 4359" (how Saudi numbers are usually written). */
export const localNumber = (n: string) => (n.startsWith('966') ? `0${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : n);
export const whatsappLink2 = whatsappNumber2 ? `https://wa.me/${whatsappNumber2}` : '';
const socialOrder: [string, string][] = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['snapchat', 'Snapchat'], ['youtube', 'YouTube'], ['x', 'X'], ['linkedin', 'LinkedIn']];
/** Social media accounts that have a link in settings, in a fixed order. */
export const socialLinks = socialOrder
  .map(([key, name]) => ({ key, name, url: String((settings.links ?? {})[key] ?? '') }))
  .filter((s) => s.url);

export const telLink = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '';
export const mailLink = email ? `mailto:${email}` : '';
export const whatsappLink = (text = '') =>
  whatsappNumber ? `https://wa.me/${whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}` : '';
