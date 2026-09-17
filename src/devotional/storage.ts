import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { toggleId } from "./logic";

const COMPLETED_IDS_KEY = "daily-devotional-completed-ids";
const FAVORITE_IDS_KEY = "daily-devotional-favorite-ids";

// Only stable devotional IDs are persisted here — never full devotional
// objects — matching the pattern in src/inspiration/useSavedVerses.ts.
function useIdListStorage(storageKey: string, unavailableMessage: string) {
  const [ids, setIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey)
      .then((raw) => {
        if (!active || !raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) setIds([...new Set(parsed)]);
      })
      .catch(() => active && setError(unavailableMessage))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, [storageKey, unavailableMessage]);

  const toggle = useCallback(async (id: string) => {
    const previous = ids;
    const next = toggleId(previous, id);
    setIds(next);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
      setError(null);
    } catch {
      setIds(previous);
      setError(unavailableMessage);
    }
  }, [ids, storageKey, unavailableMessage]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  return { ids, has, toggle, isLoading, error };
}

export function useDevotionalCompletion() {
  const { ids: completedIds, has: isCompleted, toggle: toggleCompleted, isLoading, error } =
    useIdListStorage(COMPLETED_IDS_KEY, "Your progress could not be saved. Please try again.");
  return { completedIds, isCompleted, toggleCompleted, isLoading, error };
}

export function useDevotionalFavorites() {
  const { ids: favoriteIds, has: isFavorite, toggle: toggleFavorite, isLoading, error } =
    useIdListStorage(FAVORITE_IDS_KEY, "Your bookmark could not be saved. Please try again.");
  return { favoriteIds, isFavorite, toggleFavorite, isLoading, error };
}
