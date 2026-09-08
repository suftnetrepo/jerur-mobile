import { ThemeHeader } from "@/src/components/ThemeHeader";
import { useEffect, useMemo, useRef, useState } from "react";
import { InteractionManager } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledTextInput,
  StyledButton,
  Stack,
} from "fluent-styles";
import { Text } from "../../../src/components/text";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { BottomTabBar } from "../../../src/components/BottomTabBar";
import { BibleBookRow } from "../../../src/components/BibleBookRow";
import { ReaderFontSizePopup } from "../../../src/components/ReaderFontSizePopup";
import { SpringChip } from "../../../src/components/SpringChip";
import { getBooks } from "../../../src/bible/bible-books";
import type { BibleBook } from "../../../src/bible/types";
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
  const [activeTestament, setActiveTestament] = useState<"ALL" | "OT" | "NT">(
    "ALL",
  );

  const [books, setBooks] = useState<BibleBook[]>([]);

  // Let the navigation transition and page chrome paint first. The book
  // catalogue is local and lightweight, but rendering all rows during the
  // tab transition makes the interaction feel slower on modest devices.
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setBooks(getBooks());
    });
    return () => task.cancel();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((book) => book.name.toLowerCase().includes(q));
  }, [books, query]);

  const oldTestament = useMemo(
    () => filtered.filter((book) => book.testament === "OT"),
    [filtered],
  );
  const newTestament = useMemo(
    () => filtered.filter((book) => book.testament === "NT"),
    [filtered],
  );
  const oldTestamentCount = useMemo(
    () => books.filter((book) => book.testament === "OT").length,
    [books],
  );
  const newTestamentCount = books.length - oldTestamentCount;

  const scrollRef = useRef<{
    scrollTo: (opts: { y: number; animated: boolean }) => void;
  } | null>(null);

  function selectTestament(testament: "ALL" | "OT" | "NT") {
    setActiveTestament(testament);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
      <ThemeHeader
        showBackArrow
        shapeProps={{
          cycle: true,
          size: 48,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.chromeBorder,
        }}
        title="Bible"
        titleAlignment="center"
        onBackPress={() => router.push("/")}
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

      <Stack paddingHorizontal={24} marginTop={16} paddingBottom={16}>
        <StyledTextInput
          variant="outline"
          placeholder="Search books..."
          leftIcon={<Icon name="search" size={15} color={COLORS.inkSoft} />}
          value={query}
          onChangeText={setQuery}
          clearable
          maxLength={30}
        />
      </Stack>
      <Stack height={48} marginBottom={10}>
        <StyledScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 10,
            alignItems: "center",
          }}
        >
          <SpringChip
            label="All"
            style={{ flex: 0, width: 88, height: 46 }}
            count={books.length}
            active={activeTestament === "ALL"}
            disabled={books.length === 0}
            onPress={() => selectTestament("ALL")}
          />
          <SpringChip
            label="Old Testament"
            style={{ flex: 0, width: 144, height: 46 }}
            count={oldTestamentCount}
            active={activeTestament === "OT"}
            disabled={oldTestamentCount === 0}
            onPress={() => selectTestament("OT")}
          />
          <SpringChip
            label="New Testament"
            style={{ flex: 0, width: 148, height: 46 }}
            count={newTestamentCount}
            active={activeTestament === "NT"}
            disabled={newTestamentCount === 0}
            onPress={() => selectTestament("NT")}
          />
        </StyledScrollView>
      </Stack>

      <StyledScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
      >
        {books.length === 0 ? (
          <BibleBooksLoading />
        ) : filtered.length === 0 ? (
          <Text
            fontSize={14}
            color={COLORS.inkSoft}
            style={{ textAlign: "center", paddingVertical: 32 }}
          >
            No books match "{query}".
          </Text>
        ) : (
          <>
            {activeTestament !== "NT" ? (
              <BookSection
                title="Old Testament"
                books={oldTestament}
                fontSize={fontSize}
              />
            ) : null}
            {activeTestament !== "OT" ? (
              <BookSection
                title="New Testament"
                books={newTestament}
                fontSize={fontSize}
              />
            ) : null}
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
      <BottomTabBar active="bible" />
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
  books: BibleBook[];
  fontSize: number;
  onLayout?: (e: any) => void;
}) {
  if (books.length === 0) return null;
  return (
    <Stack marginBottom={22} onLayout={onLayout}>
      <Text
        variant="overline"
        fontSize={11}
        letterSpacing={1}
        color={COLORS.inkSoft}
        marginBottom={10}
        paddingHorizontal={8}
      >
        {title}
      </Text>
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

function BibleBooksLoading() {
  return (
    <Stack gap={9} paddingTop={4} accessibilityLabel="Loading Bible books">
      {Array.from({ length: 6 }).map((_, index) => (
        <Stack
          key={index}
          horizontal
          alignItems="center"
          height={76}
          paddingHorizontal={14}
          borderRadius={18}
          backgroundColor={COLORS.white}
          style={{ borderWidth: 1, borderColor: COLORS.paperAlt }}
        >
          <Stack
            width={46}
            height={46}
            borderRadius={14}
            backgroundColor={COLORS.chrome}
            marginRight={13}
          />
          <Stack flex={1} gap={8}>
            <Stack
              width="46%"
              height={12}
              borderRadius={6}
              backgroundColor={COLORS.chromeBorder}
            />
            <Stack
              width="30%"
              height={9}
              borderRadius={5}
              backgroundColor={COLORS.chrome}
            />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
