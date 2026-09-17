import rawData from "../../assets/data/bible-inspiration.json";
import type { BibleInspirationData, InspirationCategory, InspirationVerse } from "./types";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isCategory(value: unknown): value is InspirationCategory {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.title === "string" &&
    typeof item.description === "string" && typeof item.icon === "string" &&
    isStringArray(item.relatedCategories) && isStringArray(item.verseIds);
}

function isVerse(value: unknown): value is InspirationVerse {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.reference === "string" &&
    typeof item.book === "string" && typeof item.chapter === "number" &&
    typeof item.startVerse === "number" && typeof item.endVerse === "number" &&
    typeof item.text === "string" && typeof item.translation === "string" &&
    typeof item.featured === "boolean" && isStringArray(item.keywords) && isStringArray(item.categoryIds);
}

function isMetadata(value: unknown): value is BibleInspirationData["metadata"] {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const translation = item.translation as Record<string, unknown> | undefined;
  return typeof item.name === "string" && typeof item.version === "string" &&
    typeof item.generatedAt === "string" && typeof item.categoryCount === "number" &&
    typeof item.uniqueVerseCount === "number" && typeof item.categoryVerseAssociations === "number" &&
    !!translation && typeof translation.id === "string" && typeof translation.name === "string" &&
    typeof translation.language === "string";
}

function parseData(value: unknown): BibleInspirationData | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (!isMetadata(item.metadata) || !Array.isArray(item.categories) ||
      !item.verses || typeof item.verses !== "object") return null;
  if (!item.categories.every(isCategory) || !Object.entries(item.verses).every(([id, verse]) => isVerse(verse) && verse.id === id)) return null;
  return value as BibleInspirationData;
}

export const inspirationData = parseData(rawData);
