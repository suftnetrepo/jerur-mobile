import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText } from "fluent-styles";
import { ScalePressable } from "./ScalePressable";
import { COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";
import type { BibleBook } from "../bible/types";

/**
 * Premium Bible book row.
 *
 * Keeps the existing ScalePressable interaction and dynamic reader
 * font sizing, while presenting each book as a distinct reading card.
 */
export function BibleBookRow({
  book,
  tone,
  onPress,
  titleFontSize = 14.5,
}: {
  book: BibleBook;
  tone: { bg: string; fg: string };
  onPress: () => void;
  titleFontSize?: number;
}) {
  const bookNumber = String(book.number).padStart(2, "0");

  return (
    <ScalePressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${book.name}, ${book.chapterCount} chapters`}
    >
      <Stack
        horizontal
        alignItems="center"
        backgroundColor={COLORS.white}
        borderRadius={18}
        paddingHorizontal={14}
        paddingVertical={14}
        style={{
          borderWidth: 1,
          borderColor: COLORS.paperAlt,
          ...SHADOW_SOFT,
        }}
      >
        {/* Book number */}
        <Stack
          width={46}
          height={46}
          borderRadius={14}
          backgroundColor={tone.bg}
          alignItems="center"
          justifyContent="center"
          marginRight={13}
        >
          <StyledText
            fontSize={11}
            fontWeight="800"
            letterSpacing={0.6}
            color={tone.fg}
          >
            {bookNumber}
          </StyledText>
        </Stack>

        {/* Book information */}
        <Stack flex={1} gap={3}>
          <StyledText
            fontSize={titleFontSize}
            fontWeight="800"
            color={COLORS.ink}
            numberOfLines={1}
          >
            {book.name}
          </StyledText>

          <Stack horizontal alignItems="center" gap={5}>
            <Icon
              name="book-open"
              size={11}
              color={COLORS.inkSoft}
            />

            <StyledText
              fontSize={Math.max(titleFontSize - 2.5, 10)}
              color={COLORS.inkSoft}
            >
              {book.chapterCount} chapter
              {book.chapterCount === 1 ? "" : "s"}
            </StyledText>
          </Stack>
        </Stack>

        {/* Navigation indicator */}
        <Stack
          width={32}
          height={32}
          borderRadius={16}
          backgroundColor={COLORS.paperAlt}
          alignItems="center"
          justifyContent="center"
          marginLeft={10}
        >
          <Icon
            name="chevron-right"
            size={16}
            color={COLORS.inkSoft}
          />
        </Stack>
      </Stack>
    </ScalePressable>
  );
}