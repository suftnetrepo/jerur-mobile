import batch01 from "../assets/data/bible-discovery-batch-01/batch-01.json";
import batch02 from "../assets/data/bible-discovery-batch-02/batch-02.json";
import batch03 from "../assets/data/bible-discovery-batch-03/batch-03.json";
import batch04 from "../assets/data/bible-discovery-batch-04/batch-04.json";
import { applyQuizResult, discoveryProgressStorageKey, EMPTY_DISCOVERY_PROGRESS, nextFlashcardIndex, scoreQuiz } from "../src/bible-discovery/logic";
import type { DiscoveryStory } from "../src/bible-discovery/types";
import { MOBILE_FEATURES } from "../src/config/mobileFeatures";

function assert(condition: boolean, message: string) { if (!condition) throw new Error(message); }
const stories = [...batch01.stories, ...batch02.stories, ...batch03.stories, ...batch04.stories] as DiscoveryStory[];
const ids = stories.map((story) => story.id);
assert(stories.length === 20 && new Set(ids).size === 20, "All 20 stories must load without duplicate IDs");
assert(nextFlashcardIndex(0, 6, -1) === 0 && nextFlashcardIndex(4, 6, 1) === 5 && nextFlashcardIndex(5, 6, 1) === 5, "Flashcard navigation bounds failed");
const story = stories[0];
const perfectAnswers = Object.fromEntries(story.quiz.map((question) => [question.id, question.correctOptionIndex]));
assert(scoreQuiz(story.quiz, perfectAnswers) === story.quiz.length && scoreQuiz(story.quiz, {}) === 0, "Quiz scoring or retry reset failed");
const completed = applyQuizResult(EMPTY_DISCOVERY_PROGRESS, story, story.quiz.length);
const retried = applyQuizResult(completed, story, 1);
assert(completed.points === story.completion.points && retried.points === completed.points && retried.stories[story.id].quizAttempts === 2, "Quiz progress must persist without awarding duplicate points");
assert(discoveryProgressStorageKey("church-a", "member-a") !== discoveryProgressStorageKey("church-b", "member-a"), "Church progress keys must be isolated");
assert(JSON.parse(JSON.stringify(completed)).stories[story.id].completed, "Progress must survive JSON persistence");
const discoveryFeature = MOBILE_FEATURES.find((feature) => feature.id === "bible-discovery");
assert(discoveryFeature?.route === "/bible-discovery", "Mobile and backend feature IDs/routes must match");
console.log("Bible Discovery logic tests passed.");
