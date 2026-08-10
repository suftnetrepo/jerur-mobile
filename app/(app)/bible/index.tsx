import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledTextInput, Stack } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { BibleBookRow } from "../../../src/components/BibleBookRow";
import { getBooks } from "../../../src/bible/bible-lookup";
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

  // getBooks() returns the same array reference every call (module-level
  // constant) - no need to memoize the call itself. Only the filtering
  // below is derived per-render and worth memoizing.
  const books = getBooks();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((book) => book.name.toLowerCase().includes(q));
  }, [books, query]);

  const oldTestament = useMemo(() => filtered.filter((b) => b.testament === "OT"), [filtered]);
  const newTestament = useMemo(() => filtered.filter((b) => b.testament === "NT"), [filtered]);

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.chrome}>
      <StyledPage.Header showBackArrow onBackPress={() => router.back()} backgroundColor={COLORS.chrome} />

      <Stack paddingHorizontal={24} paddingTop={4} paddingBottom={16}>
        <StyledText fontSize={26} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Bible
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 18, lineHeight: 20 }}>
          Read and meditate on God's Word
        </StyledText>

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

      <StyledScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        {filtered.length === 0 ? (
          <StyledText fontSize={14} color={COLORS.inkSoft} style={{ textAlign: "center", paddingVertical: 32 }}>
            No books match "{query}".
          </StyledText>
        ) : (
          <>
            <BookSection title="Old Testament" books={oldTestament} />
            <BookSection title="New Testament" books={newTestament} />
          </>
        )}
      </StyledScrollView>
    </StyledPage>
  );
}

function BookSection({ title, books }: { title: string; books: ReturnType<typeof getBooks> }) {
  if (books.length === 0) return null;
  return (
    <Stack marginBottom={22}>
      <StyledText
        fontSize={11}
        fontWeight="700"
        letterSpacing={1}
        color={COLORS.inkSoft}
        style={{ marginBottom: 10, textTransform: "uppercase" }}
      >
        {title}
      </StyledText>
      <Stack gap={9}>
        {books.map((book) => (
          <BibleBookRow
            key={book.number}
            book={book}
            tone={ICON_TONES[(book.number - 1) % ICON_TONES.length]}
            onPress={() => router.push(`/bible/${book.number}` as any)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
