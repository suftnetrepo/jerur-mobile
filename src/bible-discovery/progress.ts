import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelectedChurch } from "../church/SelectedChurchContext";
import { useMemberSession } from "../member/MemberSessionContext";
import { applyQuizResult, discoveryProgressStorageKey, EMPTY_DISCOVERY_PROGRESS } from "./logic";
import type { DiscoveryProgress, DiscoveryStory, StoryProgress } from "./types";

const emptyStoryProgress = (): StoryProgress => ({ completedSectionIds: [], completedFlashcards: false, quizAttempts: 0, bestQuizScore: 0, completed: false, updatedAt: new Date().toISOString() });

export function useDiscoveryProgress() {
  const { church } = useSelectedChurch();
  const { member } = useMemberSession();
  const storageKey = useMemo(() => discoveryProgressStorageKey(church?.externalId ?? "none", member?._id), [church?.externalId, member?._id]);
  const [progress, setProgress] = useState<DiscoveryProgress>(EMPTY_DISCOVERY_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    AsyncStorage.getItem(storageKey).then((raw) => {
      if (!active) return;
      setProgress(raw ? JSON.parse(raw) as DiscoveryProgress : EMPTY_DISCOVERY_PROGRESS);
    }).catch(() => active && setError("Your learning progress could not be loaded.")).finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, [storageKey]);

  const update = useCallback(async (recipe: (current: DiscoveryProgress) => DiscoveryProgress) => {
    const next = recipe(progress);
    setProgress(next);
    try { await AsyncStorage.setItem(storageKey, JSON.stringify(next)); setError(null); }
    catch { setError("Your progress could not be saved, but you can continue learning."); }
  }, [progress, storageKey]);

  const openStory = useCallback((storyId: string) => update((current) => ({ ...current, lastStoryId: storyId })), [update]);
  const completeSection = useCallback((storyId: string, sectionId: string) => update((current) => {
    const item = current.stories[storyId] ?? emptyStoryProgress();
    return { ...current, lastStoryId: storyId, stories: { ...current.stories, [storyId]: { ...item, completedSectionIds: [...new Set([...item.completedSectionIds, sectionId])], updatedAt: new Date().toISOString() } } };
  }), [update]);
  const completeFlashcards = useCallback((storyId: string) => update((current) => {
    const item = current.stories[storyId] ?? emptyStoryProgress();
    return { ...current, stories: { ...current.stories, [storyId]: { ...item, completedFlashcards: true, updatedAt: new Date().toISOString() } } };
  }), [update]);
  const recordQuiz = useCallback((story: DiscoveryStory, score: number) => update((current) => applyQuizResult(current, story, score)), [update]);

  return { progress, isLoading, error, openStory, completeSection, completeFlashcards, recordQuiz };
}
