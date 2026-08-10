#!/usr/bin/env node
/**
 * One-time (re-runnable) generator: produces src/bible/data/kjv.json and
 * src/bible/data/books.ts from the old Jerur app's Bible source.
 *
 * NOT bundled into the app — this only runs at data-prep time, from a
 * developer machine that has the old /Users/appdev/jerur checkout available.
 *
 * WHY THIS SCRIPT EXISTS INSTEAD OF COPYING THE PRE-BUILT JSON:
 *
 * The old app ships two parallel copies of each translation:
 *   assets/data/bibles/t_kjv.js        (JS module, `export const KJV = [...]`)
 *   assets/data/bibles json/t_kjv.json (pre-converted JSON)
 *
 * The JSON copy is corrupted. Its converter appears to have done a blind
 * find-and-replace of the bare word "field" (the property name used in the
 * `{ field: [id, book, chapter, verse, text] }` row shape) and wrapped EVERY
 * occurrence of that word with quotes — including inside verse text, e.g.
 * Genesis 2:5 becomes:
 *   "And every plant of the "field" before it was in the earth, ..."
 * which is not valid JSON (breaks JSON.parse) and, worse, is not the actual
 * KJV text even if it did parse. This affects every verse containing the
 * word "field" (fields, battlefield, etc. are unaffected — whole-word only,
 * but still dozens+ of verses: Gen 2:5, 3:1, 3:18, 25:27, 27:3, 27:5, 27:27,
 * 34:5, 34:7, 34:28, Ex 9:3, 9:19, 9:22, 9:25, and many more throughout).
 *
 * The .js file does NOT have this corruption (verified against Gen 2:5) —
 * it is the authoritative source. This script parses that .js file (a
 * trusted, local, non-user-controlled file — safe to evaluate) and emits a
 * clean, valid, minified JSON file with the flattened row shape the new
 * app's types expect. No verse text is altered, regenerated, or
 * paraphrased; this only fixes the prior conversion bug and reshapes the
 * wrapper object.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OLD_APP_BIBLES_DIR = "/Users/appdev/jerur/assets/data/bibles";
const OUT_DIR = path.join(__dirname, "..", "src", "bible", "data");

/** Evaluates a trusted local `export const NAME = [...]` JS file and returns the array. */
function loadJsArrayExport(filePath, exportName) {
  const src = fs.readFileSync(filePath, "utf8");
  const marker = `export const ${exportName} = `;
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`Could not find "${marker}" in ${filePath}`);
  let literal = src.slice(start + marker.length).trim();
  if (literal.endsWith(";")) literal = literal.slice(0, -1);
  // eslint-disable-next-line no-new-func -- trusted local source file, build-time only, never shipped.
  return new Function(`"use strict"; return (${literal});\n`)();
}

function main() {
  // ---- KJV verses ----------------------------------------------------
  const kjvRaw = loadJsArrayExport(path.join(OLD_APP_BIBLES_DIR, "t_kjv.js"), "KJV");
  if (!Array.isArray(kjvRaw) || kjvRaw.length === 0) {
    throw new Error("Parsed KJV data is empty or not an array");
  }

  const verses = kjvRaw.map((row, i) => {
    const f = row.field;
    if (!Array.isArray(f) || f.length !== 5) {
      throw new Error(`Row ${i} has unexpected shape: ${JSON.stringify(row)}`);
    }
    const [id, book, chapter, verse, text] = f;
    if (typeof text !== "string" || text.length === 0) {
      throw new Error(`Row ${i} (id ${id}) has empty/non-string text`);
    }
    return { id, book, chapter, verse, text };
  });

  // Sanity: same word should now appear unmangled.
  const gen2v5 = verses.find((v) => v.book === 1 && v.chapter === 2 && v.verse === 5);
  if (!gen2v5 || gen2v5.text.includes('"field"')) {
    throw new Error(`Corruption check failed — Genesis 2:5 reads: ${gen2v5?.text}`);
  }

  const bookNumbers = new Set(verses.map((v) => v.book));
  if (bookNumbers.size !== 66) {
    throw new Error(`Expected 66 distinct books, found ${bookNumbers.size}`);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "kjv.json"), JSON.stringify(verses));
  console.log(`Wrote ${verses.length} verses across ${bookNumbers.size} books -> src/bible/data/kjv.json`);

  // ---- Book metadata ---------------------------------------------------
  const keyEnglishRaw = loadJsArrayExport(path.join(OLD_APP_BIBLES_DIR, "key_english.js"), "KEY_ENGLISH");
  if (!Array.isArray(keyEnglishRaw) || keyEnglishRaw.length !== 66) {
    throw new Error(`Expected 66 book entries in key_english.js, found ${keyEnglishRaw?.length}`);
  }

  const books = keyEnglishRaw
    .map((b) => ({
      number: b.b,
      name: b.n,
      chapterCount: b.c,
      testament: b.t === "NT" ? "NT" : "OT",
      group: b.g,
    }))
    .sort((a, b) => a.number - b.number);

  const bookMismatch = books.find((b) => {
    const actualMax = Math.max(...verses.filter((v) => v.book === b.number).map((v) => v.chapter));
    return actualMax !== b.chapterCount;
  });
  if (bookMismatch) {
    throw new Error(
      `Book "${bookMismatch.name}" claims ${bookMismatch.chapterCount} chapters but verse data has a different max chapter`
    );
  }

  const booksTs = `// AUTO-GENERATED by scripts/generate-bible-data.mjs — do not hand-edit.
// Source: /Users/appdev/jerur/assets/data/bibles/key_english.js (old Jerur app), reshaped.
import type { BibleBook } from "../types";

export const BIBLE_BOOKS: BibleBook[] = ${JSON.stringify(books, null, 2)};
`;
  fs.writeFileSync(path.join(OUT_DIR, "books.ts"), booksTs);
  console.log(`Wrote ${books.length} books -> src/bible/data/books.ts`);
}

main();
