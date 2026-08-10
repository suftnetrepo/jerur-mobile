export type Testament = "OT" | "NT";

export interface BibleBook {
  /** 1-66 (Genesis..Revelation). Matches the leading digits of BibleVerse.id. */
  number: number;
  name: string;
  chapterCount: number;
  testament: Testament;
  /**
   * Book-grouping id carried over from the source dataset (key_english.js's
   * `g` field, e.g. groups books into Pentateuch/History/Wisdom/...).
   * Preserved for fidelity with the source; nothing in bible-lookup.ts
   * currently reads it.
   */
  group: number;
}

export interface BibleVerse {
  /** Stable id from the source dataset: book*1_000_000 + chapter*1_000 + verse (e.g. 1001001 = Genesis 1:1). */
  id: number;
  book: number;
  chapter: number;
  verse: number;
  text: string;
}

/** A single verse or an inclusive verse range within one chapter. */
export interface BibleReference {
  book: number;
  chapter: number;
  startVerse: number;
  endVerse: number;
}

/** Identifies a chapter without pulling in its verses — what the reader's prev/next navigation moves between. */
export interface ChapterRef {
  book: number;
  chapter: number;
}
