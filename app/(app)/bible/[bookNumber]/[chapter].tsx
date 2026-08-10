import { useEffect, useMemo, useState } from "react";
import { Share, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StyledPage, StyledScrollView, StyledText, Stack, Popup, useToast } from "fluent-styles";
import { FeatureGate } from "../../../../src/components/FeatureGate";
import { BibleReaderToolbar } from "../../../../src/components/BibleReaderToolbar";
import { BibleVerseSelectionBar } from "../../../../src/components/BibleVerseSelectionBar";
import { ReaderFontSizePopup } from "../../../../src/components/ReaderFontSizePopup";
import { BibleChapterGrid, useBibleGridWidth } from "../../../../src/components/BibleChapterGrid";
import { getBook, getVerse, getVerses, getPreviousChapterRef, getNextChapterRef } from "../../../../src/bible/bible-lookup";
import { formatShareText, formatVerseReference, formatNoteAppendText } from "../../../../src/bible/share-text";
import { useReaderFontSize } from "../../../../src/bible/use-reader-font-size";
import { appendToMarkedNote } from "../../../../src/notes/marked-note";
import { COLORS } from "../../../../src/theme/colors";
import type { BibleVerse } from "../../../../src/bible/types";

const H_PAD = 24;

export default function BibleChapterReaderScreen() {
  return (
    <FeatureGate feature="bible">
      <BibleChapterReaderScreenContent />
    </FeatureGate>
  );
}

type Selection = { anchor: number; start: number; end: number };

function BibleChapterReaderScreenContent() {
  const { bookNumber: bookNumberParam, chapter: chapterParam } = useLocalSearchParams<{ bookNumber: string; chapter: string }>();
  const bookNumber = Number(bookNumberParam);
  const chapter = Number(chapterParam);

  const book = useMemo(() => getBook(bookNumber), [bookNumber]);
  // Indexed Map lookup (see bible-lookup.ts) - not a scan of the 31,103-verse dataset.
  const verses = useMemo(() => getVerses(bookNumber, chapter), [bookNumber, chapter]);
  const previousRef = useMemo(() => getPreviousChapterRef(bookNumber, chapter), [bookNumber, chapter]);
  const nextRef = useMemo(() => getNextChapterRef(bookNumber, chapter), [bookNumber, chapter]);

  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } = useReaderFontSize();
  const toast = useToast();
  const gridWidth = useBibleGridWidth(H_PAD);

  const [selection, setSelection] = useState<Selection | null>(null);
  const [fontSizePopupVisible, setFontSizePopupVisible] = useState(false);
  const [chapterPopupVisible, setChapterPopupVisible] = useState(false);

  // Selection resets whenever the chapter itself changes (navigating away
  // and back shouldn't leave a stale highlight from a different chapter).
  useEffect(() => {
    setSelection(null);
  }, [bookNumber, chapter]);

  const selectedVerses = useMemo(() => {
    if (!selection) return [];
    return verses.filter((v) => v.verse >= selection.start && v.verse <= selection.end);
  }, [selection, verses]);

  function handleVersePress(verseNumber: number) {
    setSelection((current) => {
      if (!current) return { anchor: verseNumber, start: verseNumber, end: verseNumber };
      if (current.start === current.end && current.anchor === verseNumber) return null; // toggle off a single-verse selection
      const lo = Math.min(current.anchor, verseNumber);
      const hi = Math.max(current.anchor, verseNumber);
      return { anchor: current.anchor, start: lo, end: hi };
    });
  }

  async function saveToMarkedNote(targetVerses: BibleVerse[]) {
    if (!book || targetVerses.length === 0) return;
    const text = formatNoteAppendText(book, chapter, targetVerses);
    const result = await appendToMarkedNote(text);
    if (result) {
      // Stay on the reader - the user should keep reading, not get bounced to Notes.
      toast.success("Added to Bible Note");
      setSelection(null);
    } else {
      toast.info("Choose a Bible Note first", "Open Notes and select the note where you want Bible verses saved.");
    }
  }

  function handleVerseLongPress(verseNumber: number) {
    const verse = getVerse(bookNumber, chapter, verseNumber);
    if (verse) saveToMarkedNote([verse]);
  }

  function shareChapterOrSelection() {
    if (!book) return;
    const text =
      selectedVerses.length > 0
        ? formatShareText(book, chapter, selectedVerses)
        : formatShareText(book, chapter, verses, { wholeChapter: true });
    Share.share({ message: text });
  }

  function goToPrevious() {
    if (!previousRef) return;
    router.replace(`/bible/${previousRef.book}/${previousRef.chapter}` as any);
  }
  function goToNext() {
    if (!nextRef) return;
    router.replace(`/bible/${nextRef.book}/${nextRef.chapter}` as any);
  }

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

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header
        showBackArrow
        onBackPress={() => router.push(`/bible/${bookNumber}` as any)}
        title={book.name}
        titleAlignment="center"
        backgroundColor={COLORS.paper}
        rightIcon={
          <Stack paddingHorizontal={10} paddingVertical={5} borderRadius={20} backgroundColor={COLORS.goldPale}>
            <StyledText fontSize={11} fontWeight="800" color={COLORS.goldDeep}>
              KJV
            </StyledText>
          </Stack>
        }
      />

      <Stack paddingHorizontal={H_PAD} paddingTop={2} paddingBottom={8}>
        <StyledText fontSize={21} fontWeight="800" color={COLORS.ink}>
          Chapter {chapter}
        </StyledText>
      </Stack>

      <StyledScrollView contentContainerStyle={{ paddingHorizontal: H_PAD, paddingBottom: 24 }}>
        {/* Flowing paragraph, not one row per verse - reads like scripture, not a list. */}
        <Text style={{ lineHeight: fontSize * 1.7 }}>
          {verses.map((verse) => {
            const isSelected = !!selection && verse.verse >= selection.start && verse.verse <= selection.end;
            return (
              <Text
                key={verse.verse}
                onPress={() => handleVersePress(verse.verse)}
                onLongPress={() => handleVerseLongPress(verse.verse)}
                suppressHighlighting
                style={isSelected ? { backgroundColor: "rgba(217,164,65,0.24)" } : undefined}
              >
                <Text style={{ fontSize: Math.round(fontSize * 0.6), fontWeight: "800", color: COLORS.gold }}>{`  ${verse.verse} `}</Text>
                <Text style={{ fontSize, color: COLORS.ink, fontWeight: "400" }}>{`${verse.text} `}</Text>
              </Text>
            );
          })}
        </Text>
      </StyledScrollView>

      <Stack paddingHorizontal={16} paddingBottom={16} paddingTop={8}>
        {selection ? (
          <BibleVerseSelectionBar
            referenceLabel={formatVerseReference(book, chapter, selectedVerses)}
            onShare={shareChapterOrSelection}
            onAddToNote={() => saveToMarkedNote(selectedVerses)}
            onClear={() => setSelection(null)}
          />
        ) : (
          <BibleReaderToolbar
            chapterLabel={`${book.name} ${chapter}`}
            canGoPrevious={!!previousRef}
            canGoNext={!!nextRef}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onOpenChapterSelector={() => setChapterPopupVisible(true)}
            onOpenFontSize={() => setFontSizePopupVisible(true)}
            onShare={shareChapterOrSelection}
          />
        )}
      </Stack>

      <ReaderFontSizePopup
        visible={fontSizePopupVisible}
        onClose={() => setFontSizePopupVisible(false)}
        fontSize={fontSize}
        canDecrease={canDecrease}
        canIncrease={canIncrease}
        onDecrease={decrease}
        onIncrease={increase}
        onReset={reset}
      />

      <Popup visible={chapterPopupVisible} onClose={() => setChapterPopupVisible(false)} title={`${book.name} · Jump to chapter`} showClose safeAreaBottom>
        <Stack padding={20}>
          <BibleChapterGrid
            chapterCount={book.chapterCount}
            activeChapter={chapter}
            tone={{ bg: COLORS.goldPale, fg: COLORS.goldDeep }}
            containerWidth={gridWidth - 16}
            onSelect={(newChapter) => {
              setChapterPopupVisible(false);
              router.replace(`/bible/${bookNumber}/${newChapter}` as any);
            }}
          />
        </Stack>
      </Popup>
    </StyledPage>
  );
}
