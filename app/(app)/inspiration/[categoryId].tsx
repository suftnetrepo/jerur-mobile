import { useCallback, useMemo, useState } from "react";
import { FlatList, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { StyledPage, StyledButton, Stack } from "fluent-styles";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { ReaderFontSizePopup } from "../../../src/components/ReaderFontSizePopup";
import { Text } from "../../../src/components/text";
import {
  CategoryIcon,
  EmptySearchState,
  InspirationDataError,
  InspirationSearchInput,
  VerseCard,
} from "../../../src/components/inspiration";
import { inspirationData } from "../../../src/inspiration/data";
import {
  resolveCategoryVerses,
  searchVerses,
} from "../../../src/inspiration/logic";
import type { InspirationVerse } from "../../../src/inspiration/types";
import { useReaderFontSize } from "../../../src/inspiration/use-reader-font-size";
import { useSavedVerses } from "../../../src/inspiration/useSavedVerses";
import { COLORS, isDarkTheme } from "../../../src/theme/colors";

export default function InspirationCategoryScreen() {
  return (
    <FeatureGate feature="bible-inspiration">
      <CategoryContent />
    </FeatureGate>
  );
}

function CategoryContent() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const [query, setQuery] = useState("");
  const category = inspirationData?.categories.find(
    (item) => item.id === categoryId,
  );
  const verses = useMemo(
    () =>
      inspirationData && category
        ? resolveCategoryVerses(category, inspirationData.verses)
        : [],
    [category],
  );
  const results = useMemo(() => searchVerses(verses, query), [verses, query]);
  const { isSaved, toggleSaved, error } = useSavedVerses();
  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } =
    useReaderFontSize();
  const [fontSizePopupVisible, setFontSizePopupVisible] = useState(false);
  const renderItem = useCallback(
    ({ item }: { item: InspirationVerse }) => (
      <VerseCard
        verse={item}
        isSaved={isSaved(item.id)}
        onToggleSaved={() => void toggleSaved(item.id)}
        fontSize={fontSize}
      />
    ),
    [isSaved, toggleSaved, fontSize],
  );
  if (!inspirationData || !category) return <InspirationDataError />;

  return (
    <StyledPage
      showStatusBar
      flex={1}
      backgroundColor={COLORS.paperSoft}
      statusBarStyle={isDarkTheme ? "light-content" : "dark-content"}
      statusBarBackgroundColor={
        Platform.OS === "android" ? COLORS.paperSoft : undefined
      }
    >
      <AppBackHeader
        title={category.title}
        backgroundColor={COLORS.paperSoft}
        rightIcon={
          <StyledButton
            icon
            compact
            backgroundColor={COLORS.goldPale}
            onPress={() => setFontSizePopupVisible(true)}
            accessibilityLabel="Change text size"
          >
            <Feather name="type" size={18} color={COLORS.goldDeep} />
          </StyledButton>
        }
      />
      <Stack paddingHorizontal={20} paddingTop={6} paddingBottom={14} gap={14}>
        <Stack horizontal alignItems="center" gap={14}>
          <CategoryIcon category={category} size={48} />
          <Stack flex={1} gap={4}>
           
            <Text
              fontSize={13}
              color={COLORS.inkSoft}
              style={{ lineHeight: 19 }}
            >
              {category.description}
            </Text>
            <Text fontSize={12} fontWeight="700" color={COLORS.indigo}>
              {verses.length} verses
            </Text>
          </Stack>
        </Stack>
        <InspirationSearchInput
          value={query}
          onChangeText={setQuery}
          placeholder={`Search ${category.title}`}
        />
        {error ? (
          <Text accessibilityRole="alert" fontSize={12} color={COLORS.error}>
            {error}
          </Text>
        ) : null}
      </Stack>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 34,
          gap: 12,
        }}
        initialNumToRender={8}
        windowSize={7}
        ListEmptyComponent={<EmptySearchState kind="verses" />}
      />
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
