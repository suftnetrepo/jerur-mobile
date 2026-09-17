import { CATEGORY_GROUPS } from "../src/inspiration/groups";
import { resolveCategoryVerses, searchCategories, selectDailyFeaturedVerse, toggleVerseId } from "../src/inspiration/logic";
import type { BibleInspirationData } from "../src/inspiration/types";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const data: BibleInspirationData = {
  metadata: {
    name: "Test", version: "1", generatedAt: "2026-01-01",
    translation: { id: "KJV", name: "King James Version", language: "English" },
    categoryCount: 2, uniqueVerseCount: 2, categoryVerseAssociations: 2,
  },
  categories: [
    { id: "encouragement", title: "Encouragement", description: "Strength for hard days", icon: "heart", relatedCategories: [], verseIds: ["isaiah-41-10", "missing"] },
    { id: "faith", title: "Faith", description: "Trust God", icon: "sparkles", relatedCategories: [], verseIds: ["hebrews-11-1"] },
  ],
  verses: {
    "isaiah-41-10": { id: "isaiah-41-10", reference: "Isaiah 41:10", book: "Isaiah", chapter: 41, startVerse: 10, endVerse: 10, text: "Fear thou not", translation: "KJV", keywords: ["courage", "fear"], featured: true, categoryIds: ["encouragement"] },
    "hebrews-11-1": { id: "hebrews-11-1", reference: "Hebrews 11:1", book: "Hebrews", chapter: 11, startVerse: 1, endVerse: 1, text: "Faith is the substance", translation: "KJV", keywords: ["belief"], featured: true, categoryIds: ["faith"] },
  },
};

assert(resolveCategoryVerses(data.categories[0], data.verses).length === 1, "Invalid verse IDs must be ignored");
assert(selectDailyFeaturedVerse(data, new Date("2026-01-01T12:00:00Z"))?.id === selectDailyFeaturedVerse(data, new Date("2026-01-01T23:00:00Z"))?.id, "Daily selection must be stable for a UTC day");
assert(searchCategories(data, "encouragement")[0]?.id === "encouragement", "Category-title search failed");
assert(searchCategories(data, "Hebrews 11:1")[0]?.id === "faith", "Verse-reference search failed");
assert(searchCategories(data, "courage")[0]?.id === "encouragement", "Verse-keyword search failed");
assert(CATEGORY_GROUPS.encouragement === "emotions" && searchCategories(data, "", "emotions").length === 1, "Filter grouping failed");
assert(JSON.stringify(toggleVerseId(["a", "a"], "b")) === JSON.stringify(["a", "b"]), "Bookmark add must remove duplicates");
assert(toggleVerseId(["a", "b"], "a").join(",") === "b", "Bookmark toggle must remove an existing ID");

console.log("Bible Inspiration logic tests passed.");
