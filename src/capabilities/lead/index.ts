/**
 * LEAD capability — public surface.
 *
 * Optional conversion layer composed explicitly by pages/projects:
 *
 * Catalog Lead
 *   imports Core + Catalog + Lead
 *
 * CORE must never import from here.
 */
export { default as WaButton } from "./components/WaButton.astro";
export { buildWaLink, normalizePhoneNumber } from "./lib/whatsapp";
export type { WaLinkOptions } from "./lib/whatsapp";
export { track } from "./lib/track";
export type { LeadEventName, LeadEventPayload } from "./lib/track";
