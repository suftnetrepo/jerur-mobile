import { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledPressable, Stack } from "fluent-styles";
import { FeatureGate } from "../../../../../src/components/FeatureGate";
import { BibleChapterGrid, useBibleGridWidth } from "../../../../../src/components/BibleChapterGrid";
import { getBook, getVerseCount } from "../../../../../src/bible/bible-lookup";
import { COLORS, ICON_TONES } from "../../../../../src/theme/colors";
import { SHADOW_CARD } from "../../../../../src/theme/shadows";

const H_PAD = 24;

/**
 * Inserted between Chapters and the reader: Books -> Chapters -> Verses ->
 * Scripture. Tapping a verse opens the reader positioned at that verse; the
 * FAB opens the reader at the top ("Read Full Chapter") - both land on the
 * same existing reader screen (app/(app)/bible/[bookNumber]/[chapter].tsx),
 * nothing about the reader or its data is duplicated here.
 */
export default function BibleVerseSelectionScreen() {
  return (
    <FeatureGate feature="bible">
      <BibleVerseSelectionScreenContent />
    </FeatureGate>
  );
}

function BibleVerseSelectionScreenContent() {
  const { bookNumber: bookNumberParam, chapter: chapterParam } = useLocalSearchParams<{ bookNumber: string; chapter: string }>();
  const bookNumber = Number(bookNumberParam);
  const chapter = Number(chapterParam);

  const book = useMemo(() => getBook(bookNumber), [bookNumber]);
  const verseCount = useMemo(() => getVerseCount(bookNumber, chapter), [bookNumber, chapter]);
  const gridWidth = useBibleGridWidth(H_PAD);

  if (!book) {
    return (
      <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
        <StyledPage.Header showBackArrow onBackPress={() => router.back()} title="Bible" titleAlignment="center" />
        <Stack flex={1} alignItems="center" justifyContent="center" paddingHorizontal={32}>
          <StyledText fontSize={14} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
            That chapter couldn't be found.
          </StyledText>
        </Stack>
      </StyledPage>
    );
  }

  const tone = ICON_TONES[(book.number - 1) % ICON_TONES.length];

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header
        showBackArrow
         shapeProps ={{ cycle: true, size : 48, borderRadius: 24, borderWidth: 1, borderColor: COLORS.chromeBorder }}
   
        marginHorizontal={16}
        onBackPress={() => router.back()}
        title={`${book.name} ${chapter}`}
        titleAlignment="center"
        backgroundColor={COLORS.paper}
      />

      <StyledScrollView contentContainerStyle={{ paddingHorizontal: H_PAD, paddingTop: 12, paddingBottom: 100 }}>
      

        <BibleChapterGrid
          chapterCount={verseCount}
          tone={tone}
          containerWidth={gridWidth}
          onSelect={(verse) => router.push(`/bible/${bookNumber}/${chapter}?verse=${verse}` as any)}
        />
      </StyledScrollView>

      <StyledPressable
        onPress={() => router.push(`/bible/${bookNumber}/${chapter}` as any)}
        alignItems="center"
        justifyContent="center"
        style={{
          position: "absolute",
          bottom: 28,
          right: 24,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: COLORS.indigo,
          ...SHADOW_CARD,
        }}
        accessibilityRole="button"
        accessibilityLabel="Read full chapter"
      >
        <Icon name="book-open" size={24} color={COLORS.white} />
      </StyledPressable>
    </StyledPage>
  );
}
