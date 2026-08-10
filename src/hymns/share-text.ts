/**
 * Formats a hymn for sharing — a pure function, no React, easy to reason
 * about independent of any screen.
 */
import type { Hymn } from "./types";

/**
 * e.g.
 *   Amazing Grace
 *
 *   [lyrics]
 *
 *   Hymn 001
 *
 * No internal ids or implementation details beyond the hymn's own number
 * (which is user-facing already, printed on the reader itself).
 */
export function formatHymnShareText(hymn: Hymn): string {
  const lyrics = hymn.content.replace(/\r\n/g, "\n");
  return `${hymn.title}\n\n${lyrics}\n\nHymn ${hymn.id}`;
}
