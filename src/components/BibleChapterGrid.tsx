import { useWindowDimensions } from "react-native";
import { Stack, StyledText, StyledPressable } from "fluent-styles";
import { COLORS } from "../theme/colors";
import { SHADOW_CHIP } from "../theme/shadows";

const GRID_GAP = 10;
const MIN_CELL_WIDTH = 52;
const MIN_COLUMNS = 5;
const MAX_COLUMNS = 7;

/**
 * Responsive chapter-number grid — column count adapts to available width
 * (clamped 5-7) so it stays compact on a small iPhone and doesn't stretch
 * into oversized cells on a larger one. No FlatList: even Psalms' 150
 * chapters is a small, bounded, non-heavy grid of pressables — the parent
 * screen provides the scroll container.
 */
export function BibleChapterGrid({
  chapterCount,
  activeChapter,
  onSelect,
  tone,
  containerWidth,
}: {
  chapterCount: number;
  activeChapter?: number;
  onSelect: (chapter: number) => void;
  tone: { bg: string; fg: string };
  /** Width available to the grid (screen width minus the surrounding screen/popup padding). */
  containerWidth: number;
}) {
  const columns = Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, Math.floor(containerWidth / (MIN_CELL_WIDTH + GRID_GAP))));
  const cellSize = (containerWidth - GRID_GAP * (columns - 1)) / columns;
  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  return (
    <Stack horizontal flexWrap="wrap" gap={GRID_GAP}>
      {chapters.map((chapter) => {
        const isActive = chapter === activeChapter;
        return (
          <StyledPressable
            key={chapter}
            onPress={() => onSelect(chapter)}
            width={cellSize}
            height={cellSize}
            borderRadius={14}
            alignItems="center"
            justifyContent="center"
            backgroundColor={isActive ? tone.fg : COLORS.white}
            style={SHADOW_CHIP}
            accessibilityRole="button"
            accessibilityLabel={`Chapter ${chapter}`}
            accessibilityState={{ selected: isActive }}
          >
            <StyledText fontSize={15} fontWeight="700" color={isActive ? COLORS.white : COLORS.ink}>
              {chapter}
            </StyledText>
          </StyledPressable>
        );
      })}
    </Stack>
  );
}

/** Hook-free helper so screens can compute the same grid width they'll pass in, from a page's own known horizontal padding. */
export function useBibleGridWidth(horizontalPadding: number): number {
  const { width } = useWindowDimensions();
  return width - horizontalPadding * 2;
}
