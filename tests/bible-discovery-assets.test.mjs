import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const batches = [1, 2, 3, 4].map((number) => JSON.parse(fs.readFileSync(path.join(root, `assets/data/bible-discovery-batch-0${number}/batch-0${number}.json`), "utf8")));
const stories = batches.flatMap((batch) => batch.stories);
if (stories.length !== 20 || new Set(stories.map((story) => story.id)).size !== 20) throw new Error("Expected 20 unique stories");
const expectedCollectionCovers = {
  "foundations-of-faith": "creation",
  "heroes-of-faith": "david-and-goliath",
  "women-of-faith": "esther",
  "miracles-of-jesus": "jesus-calms-storm",
  "parables-of-jesus": "good-samaritan",
  "easter-journey": "resurrection",
};
for (const story of stories) {
  if (typeof story.description !== "string" || !story.description.trim()) throw new Error(`Missing description for ${story.id}`);
  const artwork = path.join(root, "assets/images/bible-discovery/stories", `${story.id}.webp`);
  if (!fs.existsSync(artwork)) throw new Error(`Missing illustration for ${story.id}: ${artwork}`);
}
for (const [collectionId, storyId] of Object.entries(expectedCollectionCovers)) {
  const artwork = path.join(root, "assets/images/bible-discovery/stories", `${storyId}.webp`);
  if (!fs.existsSync(artwork)) throw new Error(`Missing cover for ${collectionId}: ${artwork}`);
}
for (const requiredCreditFile of ["ATTRIBUTION.md", "manifest.json"]) {
  const creditFile = path.join(root, "assets/images/bible-discovery/credits", requiredCreditFile);
  if (!fs.existsSync(creditFile)) throw new Error(`Missing image credit file: ${creditFile}`);
}
console.log("All 20 Bible Discovery stories resolve to WebP illustrations with attribution.");
