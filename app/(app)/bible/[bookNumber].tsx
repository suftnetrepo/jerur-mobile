import { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledShape, Stack } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { BibleChapterGrid, useBibleGridWidth } from "../../../src/components/BibleChapterGrid";
import { getBook } from "../../../src/bible/bible-lookup";
import { COLORS, ICON_TONES } from "../../../src/theme/colors";
import { SHADOW_CARD } from "../../../src/theme/shadows";

const H_PAD = 24;

export default function BibleBookScreen() {
  return (
    <FeatureGate feature="bible">
      <BibleBookScreenContent />
    </FeatureGate>
  );
}

function BibleBookScreenContent() {
  const { bookNumber: bookNumberParam } = useLocalSearchParams<{ bookNumber: string }>();
  const bookNumber = Number(bookNumberParam);
  const book = useMemo(() => getBook(bookNumber), [bookNumber]);
  const gridWidth = useBibleGridWidth(H_PAD);

  if (!book) {
    return (
      <StyledPage showStatusBar flex={1} backgroundColor={COLORS.chrome}>
        <StyledPage.Header showBackArrow onBackPress={() => router.back()} title="Bible" titleAlignment="center" />
        <Stack flex={1} alignItems="center" justifyContent="center" paddingHorizontal={32}>
          <StyledText fontSize={14} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
            That book couldn't be found.
          </StyledText>
        </Stack>
      </StyledPage>
    );
  }

  const tone = ICON_TONES[(book.number - 1) % ICON_TONES.length];

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.chrome}>
      <StyledPage.Header showBackArrow onBackPress={() => router.back()} title={book.name} titleAlignment="center" backgroundColor={COLORS.chrome} />

      <StyledScrollView contentContainerStyle={{ paddingHorizontal: H_PAD, paddingTop: 12, paddingBottom: 32 }}>
        {/* Premium book info card */}
        <Stack
          horizontal
          alignItems="center"
          gap={14}
          backgroundColor={COLORS.white}
          borderRadius={22}
          padding={18}
          marginBottom={26}
          style={SHADOW_CARD}
        >
          <StyledShape size={54} cycle backgroundColor={tone.bg}>
            <Icon name="book" size={24} color={tone.fg} />
          </StyledShape>
          <Stack flex={1} gap={4}>
            <StyledText fontSize={19} fontWeight="800" color={COLORS.ink}>
              {book.name}
            </StyledText>
            <Stack horizontal alignItems="center" gap={8}>
              <StyledText fontSize={13} color={COLORS.inkSoft}>
                {book.chapterCount} Chapters
              </StyledText>
              <Stack width={3} height={3} borderRadius={2} backgroundColor={COLORS.inkSoft} />
              <StyledText fontSize={13} color={COLORS.inkSoft}>
                {book.testament === "OT" ? "Old Testament" : "New Testament"}
              </StyledText>
            </Stack>
          </Stack>
        </Stack>

        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.inkSoft} style={{ marginBottom: 12, textTransform: "uppercase" }}>
          Select a Chapter
        </StyledText>

        <BibleChapterGrid
          chapterCount={book.chapterCount}
          tone={tone}
          containerWidth={gridWidth}
          onSelect={(chapter) => router.push(`/bible/${book.number}/${chapter}` as any)}
        />
      </StyledScrollView>
    </StyledPage>
  );
}
