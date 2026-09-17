export type DevotionalMetadata = {
  collectionId: string;
  title: string;
  version: string;
  month: number;
  theme: string;
  devotionalCount: number;
  translation: string;
  estimatedReadMinutes: number;
  contentStatus: string;
  description: string;
};

export type DevotionalEntry = {
  id: string;
  /** 1-365 day-of-year position in a non-leap calendar, as authored in the source JSON. */
  day: number;
  /** 1-31 day-of-month position — used to resolve a real calendar date. */
  monthDay: number;
  title: string;
  theme: string;
  verseId: string;
  reflection: string;
  reflectionQuestion: string;
  prayer: string;
  dailyAction: string;
  estimatedReadMinutes: number;
  seasonalCollectionId: string | null;
};

export type MonthlyDevotionalCollection = {
  metadata: DevotionalMetadata;
  devotionals: DevotionalEntry[];
};

export type DevotionalArtworkVariant = "sunrise" | "bloom" | "wave" | "sparkle";

export type DevotionalMonthTheme = {
  month: number;
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  surfaceColor: string;
  accentColor: string;
  artworkVariant: DevotionalArtworkVariant;
};

export type DevotionalData = {
  /** All devotionals across the 12 months, sorted by `day` ascending — never relies on object/import iteration order. */
  allDevotionals: DevotionalEntry[];
  devotionalsById: Record<string, DevotionalEntry>;
  collectionsByMonth: Record<number, MonthlyDevotionalCollection>;
};
