import fs from "node:fs";
const root = process.cwd();
const config = fs.readFileSync(`${root}/src/config/mobileFeatures.ts`, "utf8");
const pills = fs.readFileSync(`${root}/src/components/PillActionRow.tsx`, "utf8");
const home = fs.readFileSync(`${root}/app/(app)/index.tsx`, "utf8");
if (!config.includes('id: "bible-discovery"') || !config.includes('route: "/bible-discovery"')) throw new Error("Mobile Bible Discovery feature definition is missing");
if (!pills.includes("if (!flagsLoaded) return []")) throw new Error("Pills must stay hidden until feature flags load");
if (!home.includes("buildHomeFeatureActions(features, !settingsLoading)")) throw new Error("Home must derive pills from loaded feature flags");
for (const route of ["index.tsx", "collections.tsx", "collection/[collectionId].tsx", "story/[storyId].tsx", "flashcards/[storyId].tsx", "quiz/[storyId].tsx"]) {
  const source = fs.readFileSync(`${root}/app/(app)/bible-discovery/${route}`, "utf8");
  if (!source.includes('FeatureGate feature="bible-discovery"')) throw new Error(`Route is not feature gated: ${route}`);
}
console.log("Bible Discovery feature gating tests passed.");
