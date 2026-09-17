import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { toggleVerseId } from "./logic";

const STORAGE_KEY = "bible-inspiration-saved-verse-ids";

export function useSavedVerses() {
  const [savedVerseIds, setSavedVerseIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) setSavedVerseIds([...new Set(parsed)]);
      })
      .catch(() => active && setError("Saved verses could not be loaded on this device."))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  const toggleSaved = useCallback(async (verseId: string) => {
    const previous = savedVerseIds;
    const next = toggleVerseId(previous, verseId);
    setSavedVerseIds(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setError(null);
    } catch {
      setSavedVerseIds(previous);
      setError("Your bookmark could not be saved. Please try again.");
    }
  }, [savedVerseIds]);

  const isSaved = useCallback((verseId: string) => savedVerseIds.includes(verseId), [savedVerseIds]);
  return { savedVerseIds, isSaved, toggleSaved, isLoading, error };
}
