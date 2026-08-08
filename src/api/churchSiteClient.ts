import axios from "axios";

/**
 * Separate from src/api/client.ts on purpose. That client talks to Jerur
 * directly for church data (settings, events, fellowship, etc.) for
 * whichever church is currently selected. This one talks to church-site's
 * own /api/* routes — specifically the Brevo-backed submission routes
 * (contact, prayer request, testimony, WOFBI registration) that only exist
 * for Winners Chapel Peterborough, not for churches in general.
 *
 * Set in .env as EXPO_PUBLIC_CHURCH_SITE_URL.
 */
const CHURCH_SITE_URL = process.env.EXPO_PUBLIC_CHURCH_SITE_URL ?? "";

export const churchSiteClient = axios.create({
  baseURL: `${CHURCH_SITE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});
