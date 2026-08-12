import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText } from "fluent-styles";
import { ScalePressable } from "./ScalePressable";
import { COLORS } from "../theme/colors";
import type { BibleBook } from "../bible/types";

/** A premium compact row for one Bible book — name, chapter count, tonal icon, chevron. Used on the Bible books screen. */
export function BibleBookRow({
  book,
  tone,
  onPress,
  titleFontSize = 14.5,
}: {
  book: BibleBook;
  tone: { bg: string; fg: string };
  onPress: () => void;
  /** Scales with the header's font-size control (src/bible/use-book-list-font-size.ts) — the subtitle tracks it at a fixed 2.5px smaller, matching the default 14.5/12 pairing. */
  titleFontSize?: number;
}) {
  return (
    <ScalePressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${book.name}, ${book.chapterCount} chapters`}
    >
      <Stack
        horizontal
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={COLORS.paper}
        paddingHorizontal={16}
        paddingVertical={13}
        borderBottomWidth={1}
        borderColor={COLORS.chromeBorder}
      >
        <Stack horizontal alignItems="center" gap={12} flex={1}>
          <Stack gap={2} flex={1}>
            <StyledText fontSize={titleFontSize} fontWeight="700" color={COLORS.ink}>
              {book.name}
            </StyledText>
            <StyledText fontSize={titleFontSize - 2.5} color={COLORS.inkSoft}>
              {book.chapterCount} Chapter{book.chapterCount === 1 ? "" : "s"}
            </StyledText>
          </Stack>
        </Stack>
        <Icon name="chevron-right" size={17} color={COLORS.inkSoft} />
      </Stack>
    </ScalePressable>
  );
}
