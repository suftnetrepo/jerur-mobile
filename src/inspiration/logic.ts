import { CATEGORY_GROUPS } from "./groups";
import type { BibleInspirationData, InspirationCategory, InspirationFilter, InspirationVerse } from "./types";

export function resolveCategoryVerses(category: InspirationCategory, verses: Record<string, InspirationVerse>): InspirationVerse[] {
  return category.verseIds.flatMap((id) => {
    const verse = verses[id];
    const isDevelopment = (globalThis as typeof globalThis & { __DEV__?: boolean }).__DEV__ === true;
    if (!verse && isDevelopment) console.warn(`Bible Inspiration: missing verse "${id}" in category "${category.id}".`);
    return verse ? [verse] : [];
  });
}

export function selectDailyFeaturedVerse(data: BibleInspirationData, date = new Date()): InspirationVerse | undefined {
  const featured = Object.values(data.verses).filter((verse) => verse.featured);
  const pool = featured.length ? featured : Object.values(data.verses);
  if (!pool.length) return undefined;
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86_400_000);
  return pool[(day - 1 + pool.length) % pool.length];
}

export function searchCategories(data: BibleInspirationData, query: string, filter: InspirationFilter = "all"): InspirationCategory[] {
  const needle = query.trim().toLowerCase();
  return data.categories.filter((category) => {
    if (filter !== "all" && CATEGORY_GROUPS[category.id] !== filter) return false;
    if (!needle) return true;
    const verses = resolveCategoryVerses(category, data.verses);
    return [category.id, category.title, category.description].some((value) => value.toLowerCase().includes(needle)) ||
      verses.some((verse) => [verse.reference, verse.text, ...verse.keywords].some((value) => value.toLowerCase().includes(needle)));
  });
}

export function searchVerses(verses: InspirationVerse[], query: string): InspirationVerse[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return verses;
  return verses.filter((verse) => [verse.reference, verse.text, ...verse.keywords].some((value) => value.toLowerCase().includes(needle)));
}

export function toggleVerseId(ids: string[], verseId: string): string[] {
  const unique = [...new Set(ids)];
  return unique.includes(verseId) ? unique.filter((id) => id !== verseId) : [...unique, verseId];
}
