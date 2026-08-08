import axios from "axios";

/**
 * Set in .env as EXPO_PUBLIC_JERUR_BASE_URL — Jerur's own base URL. This is
 * safe to ship in the client bundle: it's just a hostname, not a secret.
 *
 * IMPORTANT ARCHITECTURE NOTE — this app talks to Jerur DIRECTLY, unlike an
 * earlier version of this file which proxied through church-site's own
 * /api/* routes. That changed once we confirmed what "nj-api-key" actually
 * is: not an account-wide secret, but a per-church identifier (an encrypted
 * version of that church's id) that Jerur hands back publicly in its own
 * /church/search results. Any church's key is visible to anyone who
 * searches for that church — it identifies WHICH church, not WHO's allowed.
 * That's a fundamentally different risk profile from a real API key, and
 * it's why this app is safe to call Jerur directly with it, the same way
 * church-site does server-side.
 *
 * The header key is intentionally attached dynamically per-request (see the
 * interceptor below) rather than fixed at client-creation time, because
 * this app lets the user search for and switch between different churches
 * (see src/church/SelectedChurchContext.tsx) — unlike church-site, which is
 * permanently locked to Winners Chapel Peterborough's one key.
 */
const JERUR_BASE_URL = process.env.EXPO_PUBLIC_JERUR_BASE_URL ?? "";

export const apiClient = axios.create({
  baseURL: JERUR_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Holds the currently selected church's key in memory. Set by
// SelectedChurchProvider whenever the user picks or switches churches —
// kept as a plain module variable (not read from React context directly)
// because axios interceptors run outside the React tree, same reasoning as
// premeal-mobile's setUnauthorizedHandler pattern in this same file.
let activeChurchKey: string | null = null;

export function setActiveChurchKey(key: string | null) {
  activeChurchKey = key;
}

// Same pattern, for the logged-in member's own session token (see
// src/member/MemberSessionContext.tsx). Only attendance submission needs
// this today, but any future member-authenticated endpoint gets it for
// free by using this same client.
let activeMemberToken: string | null = null;

export function setActiveMemberToken(token: string | null) {
  activeMemberToken = token;
}

// Jerur's own middleware requires SOME value in "nj-api-key" just to let a
// request reach its route handler at all — it doesn't distinguish "no key
// yet" from "missing header," and redirects to /login otherwise. That's a
// real problem for /church/search specifically: it's the one endpoint that
// has to work BEFORE any church is selected (it's how a church gets found
// in the first place), and the route handler itself never reads or
// decrypts this header — search doesn't scope to a church. So a dummy
// value here isn't a security shortcut, it's satisfying a gate check on a
// route that was never actually protected by the key to begin with.
const DUMMY_KEY = "public-search";

apiClient.interceptors.request.use((config) => {
  config.headers.set("nj-api-key", activeChurchKey ?? DUMMY_KEY);
  if (activeMemberToken) {
    config.headers.set("Authorization", `Bearer ${activeMemberToken}`);
  }
  return config;
});

/** Extracts a human-readable message from any API error response, with a sensible fallback. */
export function apiErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: unknown; message?: unknown } | undefined;
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;
  }
  return fallback;
}
