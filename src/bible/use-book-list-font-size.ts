import { useCallback, useEffect, useState } from "react";
import { loadBookListFontSize, saveBookListFontSize } from "./reader-preferences-storage";

/** Book-row title sizes, small to large - narrower range than the chapter reader's steps since this only scales a one-line list row, not a full page of scripture. */
export const BOOK_LIST_FONT_SIZES = [13, 14.5, 16, 17.5, 19] as const;
export const DEFAULT_BOOK_LIST_FONT_SIZE = 14.5;

/**
 * Persisted font size for the Bible book list rows (index screen), separate
 * from the chapter reader's verse-text font size
 * (src/bible/use-reader-font-size.ts). Same "no loading spinner, local
 * AsyncStorage preference" shape as that hook.
 */
export function useBookListFontSize() {
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_BOOK_LIST_FONT_SIZE);

  useEffect(() => {
    let isMounted = true;
    loadBookListFontSize().then((stored) => {
      if (isMounted && stored && BOOK_LIST_FONT_SIZES.includes(stored as (typeof BOOK_LIST_FONT_SIZES)[number])) {
        setFontSizeState(stored);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setFontSize = useCallback((size: number) => {
    setFontSizeState(size);
    saveBookListFontSize(size);
  }, []);

  const increase = useCallback(() => {
    setFontSizeState((current) => {
      const next = BOOK_LIST_FONT_SIZES.find((size) => size > current) ?? current;
      saveBookListFontSize(next);
      return next;
    });
  }, []);

  const decrease = useCallback(() => {
    setFontSizeState((current) => {
      const next = [...BOOK_LIST_FONT_SIZES].reverse().find((size) => size < current) ?? current;
      saveBookListFontSize(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => setFontSize(DEFAULT_BOOK_LIST_FONT_SIZE), [setFontSize]);

  return {
    fontSize,
    setFontSize,
    increase,
    decrease,
    reset,
    canIncrease: fontSize < BOOK_LIST_FONT_SIZES[BOOK_LIST_FONT_SIZES.length - 1],
    canDecrease: fontSize > BOOK_LIST_FONT_SIZES[0],
  };
}
