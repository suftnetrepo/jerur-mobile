import { getMonthCollection } from "./logic";
import type { DevotionalMonthTheme } from "./types";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * One central map of presentation tokens per month — the only place
 * month-specific styling lives, per "do not scatter month-specific styles
 * across components". `title` is derived from each month's own JSON
 * metadata (stripping the "<Month>[ Devotionals]: " prefix) rather than
 * re-authored, so it can never drift from the source data; `description`
 * is a short curated tagline (distinct from — and much shorter than — the
 * devotional reflections/prayers themselves, which are never rewritten).
 * Colors stay teal/gold to keep Jerur's core identity, with only a
 * restrained per-month accent and surface tint.
 */
const MONTH_DESCRIPTIONS: Record<number, string> = {
  1: "Starting fresh with God, one day at a time.",
  2: "Loving as Christ loved us, in every relationship.",
  3: "Trusting God's character above our circumstances.",
  4: "Walking in resurrection hope and new life.",
  5: "Seeking God's wisdom for every decision.",
  6: "Building homes and bonds that honour God.",
  7: "Standing firm in God's strength, not our own.",
  8: "Discovering the good work God has prepared.",
  9: "Working heartily as unto the Lord.",
  10: "Growing closer to God, one day at a time.",
  11: "Giving thanks in every season and circumstance.",
  12: "Welcoming Christ afresh this Advent season.",
};

const MONTH_PALETTE: Record<number, { primaryColor: string; secondaryColor: string; surfaceColor: string; accentColor: string; artworkVariant: DevotionalMonthTheme["artworkVariant"] }> = {
  1: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#EAF6F4", accentColor: "#D9A441", artworkVariant: "sunrise" },
  2: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#F5ECEC", accentColor: "#C2596B", artworkVariant: "bloom" },
  3: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#EDEEF6", accentColor: "#8B98D9", artworkVariant: "wave" },
  4: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#EDF5EA", accentColor: "#6E9B6A", artworkVariant: "bloom" },
  5: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#F5EFE2", accentColor: "#B08A3E", artworkVariant: "sparkle" },
  6: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#F5EDE6", accentColor: "#B06A45", artworkVariant: "wave" },
  7: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#E7F2F2", accentColor: "#E0954F", artworkVariant: "wave" },
  8: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#EFEAF3", accentColor: "#B48FD1", artworkVariant: "sparkle" },
  9: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#F3ECE2", accentColor: "#B5651D", artworkVariant: "wave" },
  10: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#EAF2F1", accentColor: "#C79A3E", artworkVariant: "sparkle" },
  11: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#F3EEE4", accentColor: "#A9772F", artworkVariant: "sunrise" },
  12: { primaryColor: "#0B7C78", secondaryColor: "#075E5B", surfaceColor: "#F3E9E9", accentColor: "#D9776B", artworkVariant: "sparkle" },
};

function deriveThemeTitle(month: number, metadataTitle: string): string {
  const monthName = MONTH_NAMES[month - 1];
  const stripped = metadataTitle.replace(new RegExp(`^${monthName}( Devotionals)?:\\s*`), "");
  return stripped || metadataTitle;
}

export function getMonthTheme(month: number): DevotionalMonthTheme | undefined {
  const collection = getMonthCollection(month);
  const palette = MONTH_PALETTE[month];
  if (!collection || !palette) return undefined;
  return {
    month,
    title: deriveThemeTitle(month, collection.metadata.title),
    description: MONTH_DESCRIPTIONS[month] ?? collection.metadata.description,
    ...palette,
  };
}
