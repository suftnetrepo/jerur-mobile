import { useWindowDimensions } from "react-native";
import { Stack, StyledText, StyledPressable } from "fluent-styles";
import { COLORS } from "../theme/colors";

const GRID_GAP = 10;
const MIN_CELL_WIDTH = 52;
const MIN_COLUMNS = 5;
const MAX_COLUMNS = 7;

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
  containerWidth: number;
}) {
  const columns = Math.min(
    MAX_COLUMNS,
    Math.max(
      MIN_COLUMNS,
      Math.floor(containerWidth / (MIN_CELL_WIDTH + GRID_GAP)),
    ),
  );

  const cellSize =
    (containerWidth - GRID_GAP * (columns - 1)) / columns;

  const chapters = Array.from(
    { length: chapterCount },
    (_, i) => i + 1,
  );

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
            borderRadius={100}
            alignItems="center"
            justifyContent="center"
            backgroundColor={isActive ? tone.fg : COLORS.white}
            style={{
              borderWidth: 1,
              borderColor: isActive
                ? tone.fg
                : COLORS.goldPale,
            }}
            accessibilityRole="button"
            accessibilityLabel={`Chapter ${chapter}`}
            accessibilityState={{ selected: isActive }}
          >
            <StyledText
              fontSize={14}
              fontWeight={isActive ? "800" : "600"}
              color={isActive ? COLORS.white : COLORS.ink}
            >
              {chapter}
            </StyledText>
          </StyledPressable>
        );
      })}
    </Stack>
  );
}

export function useBibleGridWidth(horizontalPadding: number): number {
  const { width } = useWindowDimensions();
  return width - horizontalPadding * 2;
}