import { useMemo, useRef, useState } from "react";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  StyledTextInput,
  StyledButton,
  Stack,
} from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { BibleBookRow } from "../../../src/components/BibleBookRow";
import { ReaderFontSizePopup } from "../../../src/components/ReaderFontSizePopup";
import { SpringChip } from "../../../src/components/SpringChip";
import { getBooks } from "../../../src/bible/bible-lookup";
import { useBookListFontSize } from "../../../src/bible/use-book-list-font-size";
import { COLORS, ICON_TONES } from "../../../src/theme/colors";

export default function BibleScreen() {
  return (
    <FeatureGate feature="bible">
      <BibleScreenContent />
    </FeatureGate>
  );
}

function BibleScreenContent() {
  const [query, setQuery] = useState("");
  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } =
    useBookListFontSize();
  const [fontSizePopupVisible, setFontSizePopupVisible] = useState(false);
  // Old Testament is the default landing section (the list opens scrolled
  // there already), so its chip starts indicated as selected.
  const [activeTestament, setActiveTestament] = useState<"OT" | "NT">("OT");

  // getBooks() returns the same array reference every call (module-level
  // constant) - no need to memoize the call itself. Only the filtering
  // below is derived per-render and worth memoizing.
  const books = getBooks();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((book) => book.name.toLowerCase().includes(q));
  }, [books, query]);

  const oldTestament = useMemo(
    () => filtered.filter((b) => b.testament === "OT"),
    [filtered],
  );
  const newTestament = useMemo(
    () => filtered.filter((b) => b.testament === "NT"),
    [filtered],
  );

  // Testament chips scroll the list rather than navigate to a different
  // screen - both testaments already render in the one ScrollView below.
  // The New Testament section's on-screen y offset (within the scroll
  // content) is captured via onLayout as it renders, so the jump stays
  // correct even as font size/search change row heights.
  const scrollRef = useRef<{
    scrollTo: (opts: { y: number; animated: boolean }) => void;
  } | null>(null);
  const newTestamentOffsetRef = useRef(0);

  function scrollToOldTestament() {
    setActiveTestament("OT");
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }
  function scrollToNewTestament() {
    setActiveTestament("NT");
    scrollRef.current?.scrollTo({
      y: newTestamentOffsetRef.current,
      animated: true,
    });
  }

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header
        showBackArrow
         shapeProps ={{ cycle: true, size : 48, borderRadius: 24, borderWidth: 1, borderColor: COLORS.chromeBorder }}
        title="Bible"
        titleAlignment="center"
        onBackPress={() => router.back()}
        backgroundColor={COLORS.paper}
        marginHorizontal={16}
        rightIcon={
          <StyledButton
            icon
            compact
            backgroundColor={COLORS.goldPale}
            onPress={() => setFontSizePopupVisible(true)}
            accessibilityLabel="Change book list text size"
          >
            <Icon name="type" size={18} color={COLORS.goldDeep} />
          </StyledButton>
        }
      />

      <Stack paddingHorizontal={24} paddingTop={4} paddingBottom={16}>
        <StyledTextInput
          variant="outline"
          placeholder="Search books..."
          leftIcon={<Icon name="search" size={15} color={COLORS.inkSoft} />}
          value={query}
          onChangeText={setQuery}
          clearable
          maxLength={30}
        />

        <Stack horizontal gap={10} marginTop={8}>
          <SpringChip
            label="Old Testament"
            active={activeTestament === "OT"}
            disabled={oldTestament.length === 0}
            onPress={scrollToOldTestament}
          />
          <SpringChip
            label="New Testament"
            active={activeTestament === "NT"}
            disabled={newTestament.length === 0}
            onPress={scrollToNewTestament}
          />
        </Stack>
      </Stack>

      <StyledScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
      >
        {filtered.length === 0 ? (
          <StyledText
            fontSize={14}
            color={COLORS.inkSoft}
            style={{ textAlign: "center", paddingVertical: 32 }}
          >
            No books match "{query}".
          </StyledText>
        ) : (
          <>
            <BookSection
              title="Old Testament"
              books={oldTestament}
              fontSize={fontSize}
            />
            <BookSection
              title="New Testament"
              books={newTestament}
              fontSize={fontSize}
              onLayout={(e) => {
                newTestamentOffsetRef.current = e.nativeEvent.layout.y;
              }}
            />
          </>
        )}
      </StyledScrollView>

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
    </StyledPage>
  );
}

function BookSection({
  title,
  books,
  fontSize,
  onLayout,
}: {
  title: string;
  books: ReturnType<typeof getBooks>;
  fontSize: number;
  onLayout?: (e: any) => void;
}) {
  if (books.length === 0) return null;
  return (
    <Stack marginBottom={22} onLayout={onLayout}>
      <StyledText
        fontSize={11}
        fontWeight="700"
        letterSpacing={1}
        color={COLORS.inkSoft}
        marginBottom={10}
        paddingHorizontal={8}
      >
        {title}
      </StyledText>
      <Stack gap={9}>
        {books.map((book) => (
          <BibleBookRow
            key={book.number}
            book={book}
            tone={ICON_TONES[(book.number - 1) % ICON_TONES.length]}
            titleFontSize={fontSize}
            onPress={() => router.push(`/bible/${book.number}` as any)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
