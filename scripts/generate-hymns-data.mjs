#!/usr/bin/env node
/**
 * One-time (re-runnable) generator: produces src/hymns/data/hymns.json from
 * the old Jerur app's hymn source.
 *
 * NOT bundled into the app — this only runs at data-prep time, from a
 * developer machine that has the old /Users/appdev/jerur checkout available.
 *
 * Unlike the Bible data (see generate-bible-data.mjs), there is no parallel
 * pre-built JSON copy of the hymns to worry about being corrupted — this is
 * the only copy, so it's a straight reshape/validate of
 * assets/data/hymns/index.js's `HYMNS` export. No lyrics are altered.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OLD_APP_HYMNS_FILE = "/Users/appdev/jerur/assets/data/hymns/index.js";
const OUT_DIR = path.join(__dirname, "..", "src", "hymns", "data");

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
  const raw = loadJsArrayExport(OLD_APP_HYMNS_FILE, "HYMNS");
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error("Parsed HYMNS data is empty or not an array");
  }

  const seenIds = new Set();
  const hymns = raw.map((h, i) => {
    if (typeof h.id !== "string" || typeof h.title !== "string" || typeof h.content !== "string") {
      throw new Error(`Hymn at index ${i} has unexpected shape: ${JSON.stringify(h).slice(0, 120)}`);
    }
    if (seenIds.has(h.id)) throw new Error(`Duplicate hymn id ${h.id}`);
    seenIds.add(h.id);
    return { id: h.id, title: h.title.trim(), content: h.content };
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "hymns.json"), JSON.stringify(hymns));
  console.log(`Wrote ${hymns.length} hymns -> src/hymns/data/hymns.json`);
}

main();
