import { useCallback, useMemo, useState } from "react";
import { FlatList, Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { StyledPage, StyledButton, Stack } from "fluent-styles";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { ReaderFontSizePopup } from "../../../src/components/ReaderFontSizePopup";
import { Text } from "../../../src/components/text";
import { EmptySearchState, InspirationCategoryRow, InspirationDataError, InspirationFilterChips, InspirationSearchInput } from "../../../src/components/inspiration";
import { inspirationData } from "../../../src/inspiration/data";
import { searchCategories } from "../../../src/inspiration/logic";
import type { InspirationCategory, InspirationFilter } from "../../../src/inspiration/types";
import { useReaderFontSize } from "../../../src/inspiration/use-reader-font-size";
import { COLORS, isDarkTheme } from "../../../src/theme/colors";

export default function AllInspirationScreen() {
  return <FeatureGate feature="bible-inspiration"><AllInspirationContent /></FeatureGate>;
}

function AllInspirationContent() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InspirationFilter>("all");
  const results = useMemo(() => inspirationData ? searchCategories(inspirationData, query, filter) : [], [query, filter]);
  const renderItem = useCallback(({ item }: { item: InspirationCategory }) => <InspirationCategoryRow category={item} onPress={() => router.push(`/inspiration/${item.id}` as never)} />, []);
  // Shared with the other Inspiration screens (same storage key) so a size
  // picked here also applies once the member opens a verse — this screen
  // itself only lists topics, so the control is here for discoverability/
  // consistency rather than rescaling anything on this particular screen.
  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } = useReaderFontSize();
  const [fontSizePopupVisible, setFontSizePopupVisible] = useState(false);
  if (!inspirationData) return <InspirationDataError />;

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paperSoft} statusBarStyle={isDarkTheme ? "light-content" : "dark-content"} statusBarBackgroundColor={Platform.OS === "android" ? COLORS.paperSoft : undefined}>
      <AppBackHeader
        title="Inspirations"
        backgroundColor={COLORS.paperSoft}
        rightIcon={
          <StyledButton icon compact backgroundColor={COLORS.goldPale} onPress={() => setFontSizePopupVisible(true)} accessibilityLabel="Change text size">
            <Feather name="type" size={18} color={COLORS.goldDeep} />
          </StyledButton>
        }
      />
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        <Stack paddingHorizontal={20} paddingTop={8} paddingBottom={14} gap={14}>
          <InspirationSearchInput value={query} onChangeText={setQuery} />
          <InspirationFilterChips selected={filter} onSelect={setFilter} />
          <Text fontSize={14} color={COLORS.inkSoft}>{results.length} topic{results.length === 1 ? "" : "s"}</Text>
        </Stack>
      </TouchableWithoutFeedback>
      <FlatList data={results} keyExtractor={(item) => item.id} renderItem={renderItem} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 34, gap: 11 }} initialNumToRender={10} windowSize={8} ListEmptyComponent={<EmptySearchState />} />
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
