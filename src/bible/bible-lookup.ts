/**
 * Bible (KJV) lookup engine — TypeScript rewrite of the old Jerur app's
 * util/index.js fetchByChapter/fetchByVerse/fetchByVerses/fetchByVerseChapter.
 *
 * BUNDLE-SIZE NOTE: src/bible/data/kjv.json (~5.9MB, 31,103 verses) is the
 * only copy of the Bible text in this app. We deliberately do NOT also
 * generate a second, re-indexed JSON file grouped by book/chapter — that
 * would duplicate the same ~6MB of verse text a second time in the bundle
 * for no benefit. Instead, the flat verse list is indexed once in memory
 * at module load (below), which costs a single O(n) pass over already-
 * in-memory data (a few ms, paid once per app lifetime, since this module
 * is a singleton like any other RN module) rather than a second on-disk
 * copy.
 *
 * No network requests, no external Bible API — everything here reads only
 * from the bundled JSON.
 */
import versesData from "./data/kjv.json";
import { BIBLE_BOOKS } from "./data/books";
import type { BibleBook, BibleVerse, ChapterRef } from "./types";

// resolveJsonModule infers the element shape from the JSON itself; assert
// against our hand-written type so the rest of the app deals in BibleVerse.
const ALL_VERSES = versesData as BibleVerse[];

const BOOKS_BY_NUMBER = new Map<number, BibleBook>(BIBLE_BOOKS.map((book) => [book.number, book]));

function chapterKey(book: number, chapter: number): string {
  return `${book}:${chapter}`;
}

// book+chapter -> verses (ascending verse order), built once at import time.
const VERSES_BY_CHAPTER = new Map<string, BibleVerse[]>();
for (const verse of ALL_VERSES) {
  const key = chapterKey(verse.book, verse.chapter);
  const bucket = VERSES_BY_CHAPTER.get(key);
  if (bucket) {
    bucket.push(verse);
  } else {
    VERSES_BY_CHAPTER.set(key, [verse]);
  }
}
// Source data is already verse-ordered, but sort defensively so callers
// never have to re-check ordering themselves.
for (const bucket of VERSES_BY_CHAPTER.values()) {
  bucket.sort((a, b) => a.verse - b.verse);
}

// ---- Public API ----------------------------------------------------------

/** All 66 books, Genesis → Revelation, in canonical order. */
export function getBooks(): BibleBook[] {
  return BIBLE_BOOKS;
}

export function getBook(bookNumber: number): BibleBook | undefined {
  return BOOKS_BY_NUMBER.get(bookNumber);
}

/** Chapter numbers for a book, e.g. Genesis → [1, 2, ..., 50]. Empty array for an unknown book. */
export function getChapters(bookNumber: number): number[] {
  const book = BOOKS_BY_NUMBER.get(bookNumber);
  if (!book) return [];
  return Array.from({ length: book.chapterCount }, (_, i) => i + 1);
}

/** All verses in a chapter, in verse order. Empty array if the book/chapter doesn't exist. */
export function getVerses(bookNumber: number, chapter: number): BibleVerse[] {
  return VERSES_BY_CHAPTER.get(chapterKey(bookNumber, chapter)) ?? [];
}

/** How many verses a chapter has — for building a verse picker without materializing the verses. */
export function getVerseCount(bookNumber: number, chapter: number): number {
  return getVerses(bookNumber, chapter).length;
}

/** A single verse, or undefined if out of range. */
export function getVerse(bookNumber: number, chapter: number, verse: number): BibleVerse | undefined {
  return getVerses(bookNumber, chapter).find((v) => v.verse === verse);
}

/** An inclusive verse range within one chapter (order-independent: getVerseRange(b, c, 5, 2) === getVerseRange(b, c, 2, 5)). */
export function getVerseRange(bookNumber: number, chapter: number, startVerse: number, endVerse: number): BibleVerse[] {
  const lo = Math.min(startVerse, endVerse);
  const hi = Math.max(startVerse, endVerse);
  return getVerses(bookNumber, chapter).filter((v) => v.verse >= lo && v.verse <= hi);
}

// ---- Reader navigation (crosses book boundaries) --------------------------
// BIBLE_BOOKS is already canonically ordered Genesis→Revelation (see
// generate-bible-data.mjs), so "previous/next book" is just an array index
// walk — no verse data involved.

/** The chapter before this one, crossing into the previous book's last chapter when at chapter 1. Null at Genesis 1 (nothing before it). */
export function getPreviousChapterRef(bookNumber: number, chapter: number): ChapterRef | null {
  if (chapter > 1) return { book: bookNumber, chapter: chapter - 1 };

  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.number === bookNumber);
  if (bookIndex <= 0) return null;
  const previousBook = BIBLE_BOOKS[bookIndex - 1];
  return { book: previousBook.number, chapter: previousBook.chapterCount };
}

/** The chapter after this one, crossing into the next book's chapter 1 at the end of a book. Null at Revelation 22 (nothing after it). */
export function getNextChapterRef(bookNumber: number, chapter: number): ChapterRef | null {
  const book = getBook(bookNumber);
  if (!book) return null;
  if (chapter < book.chapterCount) return { book: bookNumber, chapter: chapter + 1 };

  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.number === bookNumber);
  if (bookIndex === -1 || bookIndex >= BIBLE_BOOKS.length - 1) return null;
  const nextBook = BIBLE_BOOKS[bookIndex + 1];
  return { book: nextBook.number, chapter: 1 };
}
