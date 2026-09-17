export type BibleInspirationMetadata = {
  name: string;
  version: string;
  generatedAt: string;
  translation: { id: string; name: string; language: string };
  categoryCount: number;
  uniqueVerseCount: number;
  categoryVerseAssociations: number;
  licensingNote?: string;
};

export type InspirationCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  relatedCategories: string[];
  verseIds: string[];
};

export type InspirationVerse = {
  id: string;
  reference: string;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  text: string;
  translation: string;
  keywords: string[];
  featured: boolean;
  categoryIds: string[];
};

export type BibleInspirationData = {
  metadata: BibleInspirationMetadata;
  categories: InspirationCategory[];
  verses: Record<string, InspirationVerse>;
};

export type InspirationGroup = "emotions" | "life" | "faith" | "relationships";
export type InspirationFilter = "all" | InspirationGroup;
