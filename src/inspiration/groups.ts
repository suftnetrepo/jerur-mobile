import type { InspirationGroup } from "./types";

export const CATEGORY_GROUPS: Record<string, InspirationGroup> = {
  encouragement: "emotions", hope: "emotions", peace: "emotions", comfort: "emotions",
  "anxiety-worry": "emotions", "grief-loss": "emotions", joy: "emotions", loneliness: "emotions",
  wisdom: "life", courage: "life", strength: "life", healing: "life", "purpose-calling": "life",
  "work-diligence": "life", patience: "life", "guidance-decisions": "life",
  "difficult-times": "life", "provision-finances": "life", "new-beginnings": "life",
  faith: "faith", prayer: "faith", gratitude: "faith", temptation: "faith", "trust-in-god": "faith",
  protection: "faith", "gods-promises": "faith", forgiveness: "relationships", love: "relationships",
  family: "relationships", "marriage-relationships": "relationships",
};

export const INSPIRATION_FILTERS = [
  { id: "all", label: "All" },
  { id: "emotions", label: "Emotions" },
  { id: "life", label: "Life" },
  { id: "faith", label: "Faith" },
  { id: "relationships", label: "Relationships" },
] as const;
