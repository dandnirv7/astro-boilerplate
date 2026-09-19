/**
 * Minimal lead-event tracking abstraction (LEAD boundary).
 *
 * - No analytics vendor dependency.
 * - Safe when `window` or `dataLayer` is absent (e.g. no tracking installed).
 * - Never throws: analytics must never break the page.
 * - Never send sensitive information — only the event name plus
 *   caller-supplied non-sensitive payload.
 */

export type LeadEventName = "lead_whatsapp_click";

export interface LeadEventPayload {
  timestamp: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    __waTrackBound?: boolean;
  }
}

export function track(event: LeadEventName, payload: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const layer = window.dataLayer;
  if (!Array.isArray(layer)) return;
  try {
    const eventPayload: LeadEventPayload = {
      timestamp: new Date().toISOString(),
      ...payload,
      event,
    };
    layer.push(eventPayload);
  } catch {
    // Intentionally silent: analytics must never break the page.
  }
}
