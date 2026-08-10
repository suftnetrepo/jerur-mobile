/**
 * Hymns lookup — TypeScript rewrite of the old Jerur app's util/index.js
 * loadHymns()/fetchHymnById(), plus case-insensitive title/number search
 * (the old app's search lived inline in screens/Hymns.js; extracted here
 * so it's testable independent of any UI).
 *
 * src/hymns/data/hymns.json (~550KB, 694 hymns) is the only copy of the
 * hymn text in this app — no network requests, no external API.
 */
import hymnsData from "./data/hymns.json";
import type { Hymn, HymnSummary } from "./types";

const ALL_HYMNS = hymnsData as Hymn[];

const HYMNS_BY_ID = new Map<string, Hymn>(ALL_HYMNS.map((hymn) => [hymn.id, hymn]));

// {id, title} only, numerically sorted — matches the old app's loadHymns().
const HYMN_LIST: HymnSummary[] = ALL_HYMNS.map(({ id, title }) => ({ id, title })).sort(
  (a, b) => Number(a.id) - Number(b.id)
);

/** All hymns as {id, title} — cheap to render in a list without pulling full lyrics along. */
export function getHymns(): HymnSummary[] {
  return HYMN_LIST;
}

/** Full hymn (including lyrics) by its dataset id, e.g. "001". */
export function getHymnById(id: string): Hymn | undefined {
  return HYMNS_BY_ID.get(id);
}

/**
 * Resolves a user-typed hymn number ("1", "01", "001") to the dataset's
 * zero-padded id and returns that hymn, if it exists. Ids in the dataset
 * are 3-digit zero-padded strings (see src/hymns/data/hymns.json).
 */
export function getHymnByNumber(input: string): Hymn | undefined {
  const trimmed = input.trim();
  if (!/^\d+$/.test(trimmed)) return undefined;
  return HYMNS_BY_ID.get(trimmed.padStart(3, "0"));
}

/** Case-insensitive substring match against hymn titles. */
export function searchHymnsByTitle(query: string): HymnSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return HYMN_LIST.filter((hymn) => hymn.title.toLowerCase().includes(q));
}

/**
 * Resolves a typed hymn number, tolerant of leading zeros ("1" | "01" | "001")
 * all resolving to hymn "001" if it exists.
 */
export function searchHymnsByNumber(query: string): HymnSummary[] {
  const hymn = getHymnByNumber(query);
  return hymn ? [{ id: hymn.id, title: hymn.title }] : [];
}

/**
 * Combined search matching the old app's screens/Hymns.js behaviour:
 * purely-numeric input resolves a hymn number directly (falling back to a
 * substring match if no exact number matches), anything else is a
 * case-insensitive substring match against title or id. Empty query
 * returns no results (callers should show the full getHymns() list instead).
 */
export function searchHymns(query: string): HymnSummary[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  if (/^\d+$/.test(trimmed)) {
    const byNumber = searchHymnsByNumber(trimmed);
    if (byNumber.length > 0) return byNumber;
  }

  const q = trimmed.toLowerCase();
  return HYMN_LIST.filter((hymn) => hymn.title.toLowerCase().includes(q) || hymn.id.toLowerCase().includes(q));
}

// ---- Reader navigation ----------------------------------------------------
// The dataset's ids are NOT a dense 1..694 range (Phase 1 found ids
// 001-695 with a gap - some number in that range has no hymn). Previous/
// next must walk the actual sorted HYMN_LIST, never assume `id ± 1` exists.

/** The hymn immediately before this one in the sorted library. Undefined at the first hymn (nothing before it). */
export function getPreviousHymn(id: string): HymnSummary | undefined {
  const index = HYMN_LIST.findIndex((hymn) => hymn.id === id);
  if (index <= 0) return undefined;
  return HYMN_LIST[index - 1];
}

/** The hymn immediately after this one in the sorted library. Undefined at the last hymn (nothing after it). */
export function getNextHymn(id: string): HymnSummary | undefined {
  const index = HYMN_LIST.findIndex((hymn) => hymn.id === id);
  if (index === -1 || index === HYMN_LIST.length - 1) return undefined;
  return HYMN_LIST[index + 1];
}
