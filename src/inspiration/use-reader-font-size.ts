import { useCallback, useEffect, useState } from "react";
import { loadReaderFontSize, saveReaderFontSize } from "./reader-preferences-storage";

/** Same step scale as the Bible reader (src/bible/use-reader-font-size.ts) so the control feels identical across features. */
export const READER_FONT_SIZES = [15, 17, 19, 21, 23, 25] as const;
export const DEFAULT_READER_FONT_SIZE = 19;

/** Persisted Inspiration verse-text font size. No loading spinner — see src/bible/use-reader-font-size.ts for why. */
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
