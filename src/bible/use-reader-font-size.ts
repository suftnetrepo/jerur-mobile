import { useCallback, useEffect, useState } from "react";
import { loadReaderFontSize, saveReaderFontSize } from "./reader-preferences-storage";

/** Reading font sizes, small to large — matches steps of ~2px used across the old app's reader (screens/Verse.js). */
export const READER_FONT_SIZES = [15, 17, 19, 21, 23, 25] as const;
export const DEFAULT_READER_FONT_SIZE = 19;

/**
 * Persisted reader font size. No loading spinner: this is a local
 * preference (AsyncStorage read is a few ms, not a network call) — the
 * hook simply renders with DEFAULT_READER_FONT_SIZE until the stored
 * value (if any) resolves, then updates in place. Same "don't fake a
 * network loading state for local data" principle the Bible/Hymns data
 * itself follows.
 */
export function useReaderFontSize() {
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_READER_FONT_SIZE);

  useEffect(() => {
    let isMounted = true;
    loadReaderFontSize().then((stored) => {
      if (isMounted && stored && READER_FONT_SIZES.includes(stored as (typeof READER_FONT_SIZES)[number])) {
        setFontSizeState(stored);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setFontSize = useCallback((size: number) => {
    setFontSizeState(size);
    saveReaderFontSize(size);
  }, []);

  const increase = useCallback(() => {
    setFontSizeState((current) => {
      const next = READER_FONT_SIZES.find((size) => size > current) ?? current;
      saveReaderFontSize(next);
      return next;
    });
  }, []);

  const decrease = useCallback(() => {
    setFontSizeState((current) => {
      const next = [...READER_FONT_SIZES].reverse().find((size) => size < current) ?? current;
      saveReaderFontSize(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => setFontSize(DEFAULT_READER_FONT_SIZE), [setFontSize]);

  return {
    fontSize,
    setFontSize,
    increase,
    decrease,
    reset,
    canIncrease: fontSize < READER_FONT_SIZES[READER_FONT_SIZES.length - 1],
    canDecrease: fontSize > READER_FONT_SIZES[0],
  };
}
