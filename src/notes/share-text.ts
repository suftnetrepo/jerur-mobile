/**
 * Formats a note for sharing — a pure function, no React. Mirrors
 * src/bible/share-text.ts's approach for the same reason: easy to reason
 * about independent of any screen.
 */
import type { Note } from "./types";

/**
 * e.g.
 *   Wednesday Services
 *
 *   Exodus 2:1
 *
 *   And there went a man...
 *
 * "Untitled Note" is a display-only fallback (see display.ts) and is
 * never included in shared text — an empty title just means the share
 * starts straight with the content.
 */
export function formatNoteShareText(note: Pick<Note, "title" | "content">): string {
  const title = note.title.trim();
  return title ? `${title}\n\n${note.content}` : note.content;
}
