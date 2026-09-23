export type DiscoveryPerson = { name: string; role: string };
export type DiscoveryLocation = { name: string; description: string };
export type DiscoverySection = { id: string; title: string; content: string; scriptureReference: string };
export type DiscoveryFlashcard = { id: string; front: string; back: string; scriptureReference: string };
export type DiscoveryQuizQuestion = { id: string; question: string; options: string[]; correctOptionIndex: number; explanation: string; scriptureReference: string };

export type DiscoveryStory = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  collectionIds: string[];
  scriptureReferences: string[];
  illustration: string;
  estimatedMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  ageSuitability?: string;
  featured?: boolean;
  keywords?: string[];
  contentAdvisory?: string;
  introduction: { summary: string; context: string };
  storySections: DiscoverySection[];
  keyPeople?: DiscoveryPerson[];
  keyLocations?: DiscoveryLocation[];
  flashcards: DiscoveryFlashcard[];
  keyLessons: string[];
  reflection: { question: string; prompt: string };
  prayerPrompt?: string;
  quiz: DiscoveryQuizQuestion[];
  completion: { points: number; achievementId: string; nextStoryId?: string };
};

export type DiscoveryCollection = { id: string; title: string; description: string; storyIds: string[] };
export type StoryProgress = { completedSectionIds: string[]; completedFlashcards: boolean; quizAttempts: number; bestQuizScore: number; completed: boolean; updatedAt: string };
export type DiscoveryProgress = { lastStoryId?: string; stories: Record<string, StoryProgress>; points: number; achievements: string[] };
