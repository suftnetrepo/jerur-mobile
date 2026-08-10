/**
 * Formats a verse reference / share message for the reader — pure
 * functions, no React, so they're easy to reason about independent of any
 * screen. KJV is hardcoded as the version label (the only version in v1 —
 * see architecture notes, no translation switcher yet).
 */
import type { BibleBook, BibleVerse } from "./types";

const VERSION_LABEL = "KJV";

/** e.g. "John 3" (whole chapter), "John 3:16" (one verse), "John 3:16-18" (a range). */
export function formatVerseReference(
  book: BibleBook,
  chapter: number,
  verses: BibleVerse[],
  options?: { wholeChapter?: boolean }
): string {
  if (options?.wholeChapter || verses.length === 0) return `${book.name} ${chapter}`;
  const first = verses[0].verse;
  const last = verses[verses.length - 1].verse;
  return first === last ? `${book.name} ${chapter}:${first}` : `${book.name} ${chapter}:${first}-${last}`;
}

/**
 * e.g.
 *   "For God so loved the world..."
 *
 *   John 3:16 (KJV)
 *
 * For more than one verse, each line is prefixed with its verse number so
 * the passage stays legible once shared out of the app's own typography.
 */
export function formatShareText(book: BibleBook, chapter: number, verses: BibleVerse[], options?: { wholeChapter?: boolean }): string {
  const reference = `${formatVerseReference(book, chapter, verses, options)} (${VERSION_LABEL})`;
  if (verses.length === 0) return reference;
  if (verses.length === 1) {
    return `"${verses[0].text}"\n\n${reference}`;
  }
  const body = verses.map((v) => `${v.verse} ${v.text}`).join("\n");
  return `${body}\n\n${reference}`;
}

/**
 * The passage block appended to a Bible Note (see
 * src/notes/marked-note.ts's appendToMarkedNote, which handles spacing
 * this block into the note's existing content) — reference on its own
 * line, then the verse text, so it reads standalone inside the note:
 *
 *   John 3:16
 *
 *   For God so loved the world...
 *
 * A range numbers each line so the passage stays legible on its own:
 *
 *   John 3:16-18
 *
 *   16. For God so loved the world...
 *   17. For God sent not his Son...
 *   18. He that believeth on him is not condemned...
 */
export function formatNoteAppendText(book: BibleBook, chapter: number, verses: BibleVerse[]): string {
  const reference = formatVerseReference(book, chapter, verses);
  if (verses.length <= 1) {
    const text = verses[0]?.text ?? "";
    return `${reference}\n\n${text}`;
  }
  const body = verses.map((v) => `${v.verse}. ${v.text}`).join("\n");
  return `${reference}\n\n${body}`;
}
