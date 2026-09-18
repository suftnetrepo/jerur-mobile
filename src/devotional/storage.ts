import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { toggleId } from "./logic";

const COMPLETED_IDS_KEY = "daily-devotional-completed-ids";
const FAVORITE_IDS_KEY = "daily-devotional-favorite-ids";
const FONT_SIZE_KEY = "daily-devotional-reader-font-size";

/** Same step scale as the Bible/Inspiration readers, for a consistent control everywhere. */
export const READER_FONT_SIZES = [15, 17, 19, 21, 23, 25] as const;
export const DEFAULT_READER_FONT_SIZE = 19;

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

/** Persisted devotional reading font size — applies to the verse, reflection and bottom-sheet text. No loading spinner: local preference, resolves in a few ms. */
export function useDevotionalFontSize() {
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_READER_FONT_SIZE);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(FONT_SIZE_KEY).then((raw) => {
      const stored = raw ? Number(raw) : null;
      if (active && stored && READER_FONT_SIZES.includes(stored as (typeof READER_FONT_SIZES)[number])) {
        setFontSizeState(stored);
      }
    });
    return () => { active = false; };
  }, []);

  const persist = useCallback((size: number) => {
    setFontSizeState(size);
    void AsyncStorage.setItem(FONT_SIZE_KEY, String(size));
  }, []);

  const increase = useCallback(() => {
    setFontSizeState((current) => {
      const next = READER_FONT_SIZES.find((size) => size > current) ?? current;
      void AsyncStorage.setItem(FONT_SIZE_KEY, String(next));
      return next;
    });
  }, []);

  const decrease = useCallback(() => {
    setFontSizeState((current) => {
      const next = [...READER_FONT_SIZES].reverse().find((size) => size < current) ?? current;
      void AsyncStorage.setItem(FONT_SIZE_KEY, String(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => persist(DEFAULT_READER_FONT_SIZE), [persist]);

  return {
    fontSize,
    setFontSize: persist,
    increase,
    decrease,
    reset,
    canIncrease: fontSize < READER_FONT_SIZES[READER_FONT_SIZES.length - 1],
    canDecrease: fontSize > READER_FONT_SIZES[0],
  };
}
