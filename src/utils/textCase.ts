/**
 * Normalizes a short label (e.g. a scripture reference like "JEREMIAH
 * 29:11" or "jeremiah 29:11") to proper/title case ("Jeremiah 29:11"),
 * regardless of how it was typed in the admin portal. Lowercases
 * everything first, then capitalizes the first letter of each
 * whitespace-separated word — digits/punctuation are left untouched
 * since `.toUpperCase()` on a non-letter is a no-op.
 */
export function toTitleCase(value: string): string {
  return value.toLowerCase().replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}

/**
 * Normalizes a full statement (e.g. "THIS SEASON IS ABOUT BREAKTHROUGH"
 * or "this season is about breakthrough") to sentence case — only the
 * very first letter capitalized, everything else lowercase — regardless
 * of how it was typed in the admin portal.
 */
export function toSentenceCase(value: string): string {
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
