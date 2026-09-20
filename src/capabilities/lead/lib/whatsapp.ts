import { siteConfig } from '../../../config/site';

export interface WaLinkOptions {
  number?: string;
  text?: string;
}

/**
 * Normalize a phone number to digit-only international format.
 * Explicitly Indonesia-scoped: local `08...` / `8...` numbers are rewritten
 * with the `62` country prefix; other international numbers pass through
 * digit-stripped and unchanged. Keep this helper inside LEAD — core must
 * stay locale-agnostic.
 * E.g., '0812-3456-7890' -> '6281234567890'
 * '+62 812-3456' -> '628123456'
 */
export function normalizePhoneNumber(rawNumber: string): string {
  let cleaned = rawNumber.replace(/[^0-9]/g, '');

  if (cleaned.startsWith('08')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8') && cleaned.length >= 9) {
    cleaned = '62' + cleaned;
  }

  return cleaned;
}

/**
 * Builds a direct WhatsApp click-to-chat URL.
 * Generik tanpa copy/template bisnis.
 */
export function buildWaLink(options: WaLinkOptions = {}): string {
  const targetNumber = options.number || siteConfig.contact.whatsapp || '';
  const cleanNumber = normalizePhoneNumber(targetNumber);

  if (!cleanNumber) {
    return '#';
  }

  if (options.text && options.text.trim()) {
    const encoded = encodeURIComponent(options.text.trim());
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  }

  return `https://wa.me/${cleanNumber}`;
}
