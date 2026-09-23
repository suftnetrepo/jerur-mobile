import type { DiscoveryProgress, DiscoveryQuizQuestion, DiscoveryStory } from "./types";

export const EMPTY_DISCOVERY_PROGRESS: DiscoveryProgress = { stories: {}, points: 0, achievements: [] };

export function storyPercent(story: DiscoveryStory, progress?: DiscoveryProgress): number {
  const item = progress?.stories[story.id];
  if (!item) return 0;
  const steps = story.storySections.length + 2;
  const complete = item.completedSectionIds.length + Number(item.completedFlashcards) + Number(item.quizAttempts > 0);
  return Math.min(100, Math.round((complete / steps) * 100));
}

export function overallPercent(stories: DiscoveryStory[], progress: DiscoveryProgress): number {
  if (!stories.length) return 0;
  return Math.round(stories.reduce((sum, story) => sum + storyPercent(story, progress), 0) / stories.length);
}

export function scoreQuiz(questions: DiscoveryQuizQuestion[], answers: Record<string, number>): number {
  return questions.reduce((score, question) => score + Number(answers[question.id] === question.correctOptionIndex), 0);
}

export function nextFlashcardIndex(current: number, length: number, direction: 1 | -1): number {
  return Math.max(0, Math.min(length - 1, current + direction));
}

export function discoveryProgressStorageKey(churchId: string, memberId?: string): string {
  return `bible-discovery:${churchId}:${memberId ?? "guest"}`;
}

export function applyQuizResult(progress: DiscoveryProgress, story: DiscoveryStory, score: number): DiscoveryProgress {
  const item = progress.stories[story.id] ?? { completedSectionIds: [], completedFlashcards: false, quizAttempts: 0, bestQuizScore: 0, completed: false, updatedAt: new Date().toISOString() };
  const firstCompletion = !item.completed;
  return {
    ...progress,
    points: progress.points + (firstCompletion ? story.completion.points : 0),
    achievements: [...new Set([...progress.achievements, story.completion.achievementId, ...(score === story.quiz.length ? ["perfect-score"] : [])])],
    stories: { ...progress.stories, [story.id]: { ...item, quizAttempts: item.quizAttempts + 1, bestQuizScore: Math.max(item.bestQuizScore, score), completed: true, updatedAt: new Date().toISOString() } },
  };
}

export function searchDiscoveryStories(stories: DiscoveryStory[], query: string): DiscoveryStory[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return stories;
  return stories.filter((story) => [story.id, story.title, story.subtitle, story.description, ...story.keywords ?? [], ...story.scriptureReferences].some((value) => value.toLowerCase().includes(needle)));
}
