import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledShape } from "fluent-styles";
import { ScalePressable } from "./ScalePressable";
import { COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";
import type { BibleBook } from "../bible/types";

/** A premium compact row for one Bible book — name, chapter count, tonal icon, chevron. Used on the Bible books screen. */
export function BibleBookRow({ book, tone, onPress }: { book: BibleBook; tone: { bg: string; fg: string }; onPress: () => void }) {
  return (
    <ScalePressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${book.name}, ${book.chapterCount} chapters`}>
      <Stack
        horizontal
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={COLORS.white}
        borderRadius={16}
        paddingHorizontal={16}
        paddingVertical={13}
        style={SHADOW_SOFT}
      >
        <Stack horizontal alignItems="center" gap={12} flex={1}>
          <StyledShape size={40} cycle backgroundColor={tone.bg}>
            <Icon name="book" size={17} color={tone.fg} />
          </StyledShape>
          <Stack gap={2} flex={1}>
            <StyledText fontSize={14.5} fontWeight="700" color={COLORS.ink}>
              {book.name}
            </StyledText>
            <StyledText fontSize={12} color={COLORS.inkSoft}>
              {book.chapterCount} Chapter{book.chapterCount === 1 ? "" : "s"}
            </StyledText>
          </Stack>
        </Stack>
        <Icon name="chevron-right" size={17} color={COLORS.inkSoft} />
      </Stack>
    </ScalePressable>
  );
}
