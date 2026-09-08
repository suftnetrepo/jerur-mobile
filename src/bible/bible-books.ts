import { BIBLE_BOOKS } from "./data/books";
import type { BibleBook } from "./types";

const BOOKS_BY_NUMBER = new Map<number, BibleBook>(
  BIBLE_BOOKS.map((book) => [book.number, book]),
);

/** Lightweight Bible metadata. This module deliberately does not import verse text. */
export function getBooks(): BibleBook[] {
  return BIBLE_BOOKS;
}

export function getBook(bookNumber: number): BibleBook | undefined {
  return BOOKS_BY_NUMBER.get(bookNumber);
}
