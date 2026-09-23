import batch01 from "../../assets/data/bible-discovery-batch-01/batch-01.json";
import batch02 from "../../assets/data/bible-discovery-batch-02/batch-02.json";
import batch03 from "../../assets/data/bible-discovery-batch-03/batch-03.json";
import batch04 from "../../assets/data/bible-discovery-batch-04/batch-04.json";
import type { DiscoveryCollection, DiscoveryStory } from "./types";

const rawStories: unknown[] = [...batch01.stories, ...batch02.stories, ...batch03.stories, ...batch04.stories];

function isStory(value: unknown): value is DiscoveryStory {
  if (!value || typeof value !== "object") return false;
  const story = value as Record<string, unknown>;
  return typeof story.id === "string" && typeof story.title === "string" && typeof story.subtitle === "string" && typeof story.description === "string" &&
    Array.isArray(story.collectionIds) && Array.isArray(story.scriptureReferences) && typeof story.illustration === "string" &&
    typeof story.estimatedMinutes === "number" && !!story.introduction && Array.isArray(story.storySections) &&
    story.storySections.length > 0 && Array.isArray(story.flashcards) && story.flashcards.length > 0 &&
    Array.isArray(story.quiz) && story.quiz.length > 0 && Array.isArray(story.keyLessons) && !!story.reflection && !!story.completion;
}

const byId = new Map<string, DiscoveryStory>();
for (const value of rawStories) {
  if (!isStory(value)) {
    if ((globalThis as typeof globalThis & { __DEV__?: boolean }).__DEV__) console.warn("Bible Discovery ignored a malformed story record.");
    continue;
  }
  if (byId.has(value.id)) {
    if ((globalThis as typeof globalThis & { __DEV__?: boolean }).__DEV__) console.warn(`Bible Discovery ignored duplicate story: ${value.id}`);
    continue;
  }
  byId.set(value.id, value);
}

export const DISCOVERY_STORIES = [...byId.values()];
export const DISCOVERY_STORY_BY_ID = Object.fromEntries(DISCOVERY_STORIES.map((story) => [story.id, story])) as Record<string, DiscoveryStory>;

export const DISCOVERY_COLLECTIONS: DiscoveryCollection[] = [
  { id: "foundations-of-faith", title: "Foundations of Faith", description: "Where God’s great story begins", storyIds: ["creation", "noah-and-the-ark", "abraham", "moses", "birth-of-jesus"] },
  { id: "heroes-of-faith", title: "Heroes of Faith", description: "Courage, trust and faithful lives", storyIds: ["joseph", "joshua-jericho", "ruth", "samuel", "david-and-goliath", "solomon", "elijah", "jonah", "daniel-and-the-lions", "esther"] },
  { id: "women-of-faith", title: "Women of Faith", description: "Courageous women who shaped the story", storyIds: ["ruth", "esther", "birth-of-jesus"] },
  { id: "miracles-of-jesus", title: "Miracles of Jesus", description: "Power, compassion and transforming hope", storyIds: ["jesus-calms-storm", "resurrection"] },
  { id: "parables-of-jesus", title: "Parables of Jesus", description: "Truth revealed through memorable stories", storyIds: ["good-samaritan", "prodigal-son"] },
  { id: "easter-journey", title: "Easter Journey", description: "From the Cross to the empty tomb", storyIds: ["crucifixion", "resurrection"] },
];

export function getDiscoveryStory(id: string | undefined) { return id ? DISCOVERY_STORY_BY_ID[id] : undefined; }
export function getStoriesForCollection(id: string) {
  const collection = DISCOVERY_COLLECTIONS.find((item) => item.id === id);
  if (!collection) return [];
  return collection.storyIds.map((storyId) => DISCOVERY_STORY_BY_ID[storyId]).filter((story): story is DiscoveryStory => Boolean(story));
}
export function getFeaturedStories() { return DISCOVERY_STORIES.filter((story) => story.featured); }
