import { useMemo, useState } from "react";
import { FlatList, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StyledPage, StyledPressable, Stack } from "fluent-styles";
import { AppBackHeader } from "../../../../src/components/AppBackHeader";
import { FeatureGate } from "../../../../src/components/FeatureGate";
import { Text } from "../../../../src/components/text";
import {
  DiscoveryEmpty,
  DiscoveryFontSizeButton,
  DiscoverySearch,
  DiscoveryStoryCard,
} from "../../../../src/components/BibleDiscovery";
import { ReaderFontSizePopup } from "../../../../src/components/ReaderFontSizePopup";
import {
  DISCOVERY_COLLECTIONS,
  getStoriesForCollection,
} from "../../../../src/bible-discovery/data";
import {
  searchDiscoveryStories,
  storyPercent,
} from "../../../../src/bible-discovery/logic";
import { useDiscoveryProgress } from "../../../../src/bible-discovery/progress";
import { useReaderFontSize } from "../../../../src/bible/use-reader-font-size";
import { COLORS, isDarkTheme } from "../../../../src/theme/colors";

export default function CollectionScreen() {
  return (
    <FeatureGate feature="bible-discovery">
      <Content />
    </FeatureGate>
  );
}
function Content() {
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
  const collection = DISCOVERY_COLLECTIONS.find(
    (item) => item.id === collectionId,
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "completed">("all");
  const [fontSizePopupVisible, setFontSizePopupVisible] = useState(false);
  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } =
    useReaderFontSize();
  const scale = fontSize / 19;
  const { progress } = useDiscoveryProgress();
  const results = useMemo(
    () =>
      searchDiscoveryStories(
        getStoriesForCollection(collectionId),
        query,
      ).filter(
        (story) =>
          filter === "all" ||
          (filter === "completed"
            ? storyPercent(story, progress) === 100
            : storyPercent(story, progress) < 100),
      ),
    [collectionId, query, filter, progress],
  );
  if (!collection) return <DiscoveryEmpty title="Collection unavailable" />;
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
        title={collection.title}
        backgroundColor={COLORS.paperSoft}
        rightIcon={
          <DiscoveryFontSizeButton
            onPress={() => setFontSizePopupVisible(true)}
          />
        }
      />
      <Stack paddingHorizontal={20} marginTop={8} paddingTop={8} paddingBottom={14} gap={12}>
        <DiscoverySearch value={query} onChangeText={setQuery} />
        <Stack marginTop={8} marginBottom={8} horizontal gap={8}>
          {(["all", "new", "completed"] as const).map((id) => (
            <StyledPressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === id }}
              onPress={() => setFilter(id)}
            >
              <Stack
                minHeight={48}
                justifyContent="center"
                paddingHorizontal={16}
                borderRadius={24}
                backgroundColor={
                  filter === id ? COLORS.indigo : COLORS.paperAlt
                }
              >
                <Text
                  fontSize={12 * scale}
                  fontWeight="700"
                  color={filter === id ? COLORS.onPrimary : COLORS.inkSoft}
                >
                  {id === "all"
                    ? "All"
                    : id === "new"
                      ? "To explore"
                      : "Completed"}
                </Text>
              </Stack>
            </StyledPressable>
          ))}
        </Stack>
      </Stack>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DiscoveryStoryCard
            story={item}
            percent={storyPercent(item, progress)}
            collectionLayout
            fontScale={scale}
            onPress={() =>
              router.push(`/bible-discovery/story/${item.id}` as never)
            }
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 38,
          gap: 18,
        }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<DiscoveryEmpty />}
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
