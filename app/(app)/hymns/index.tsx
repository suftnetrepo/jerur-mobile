import { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledText, StyledTextInput, Stack } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { HymnRow } from "../../../src/components/HymnRow";
import { getHymns, searchHymns } from "../../../src/hymns/hymns-lookup";
import { COLORS, ICON_TONES } from "../../../src/theme/colors";
import type { HymnSummary } from "../../../src/hymns/types";

export default function HymnsScreen() {
  return (
    <FeatureGate feature="hymns">
      <HymnsScreenContent />
    </FeatureGate>
  );
}

function HymnsScreenContent() {
  const [query, setQuery] = useState("");

  // getHymns()/searchHymns() only ever return {id, title} - full lyrics
  // are never pulled into this list (see src/hymns/hymns-lookup.ts), so
  // filtering here is cheap regardless of query.
  const results = useMemo(() => {
    const trimmed = query.trim();
    return trimmed ? searchHymns(trimmed) : getHymns();
  }, [query]);

  const renderItem = useCallback(
    ({ item }: { item: HymnSummary }) => (
      <HymnRow
        hymn={item}
        tone={ICON_TONES[(Number(item.id) - 1) % ICON_TONES.length]}
        onPress={() => router.push(`/hymns/${item.id}` as any)}
      />
    ),
    []
  );

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.chrome}>
      <StyledPage.Header showBackArrow onBackPress={() => router.back()} backgroundColor={COLORS.chrome} />

      <Stack paddingHorizontal={24} paddingTop={4} paddingBottom={16}>
        <StyledText fontSize={26} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Hymns
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 18, lineHeight: 20 }}>
          Songs of faith, worship and praise
        </StyledText>

        <StyledTextInput
          variant="outline"
          placeholder="Search hymns..."
          leftIcon={<Icon name="search" size={15} color={COLORS.inkSoft} />}
          value={query}
          onChangeText={setQuery}
          clearable
          maxLength={40}
        />

        <Stack
          horizontal
          alignItems="center"
          gap={7}
          marginTop={14}
          alignSelf="flex-start"
          paddingHorizontal={12}
          paddingVertical={7}
          borderRadius={50}
          backgroundColor={COLORS.goldPale}
        >
          <Icon name="music" size={13} color={COLORS.goldDeep} />
          <StyledText fontSize={13} fontWeight="700" color={COLORS.goldDeep}>
            {query.trim() ? `${results.length} hymn${results.length === 1 ? "" : "s"} found` : `${results.length} hymns`}
          </StyledText>
        </Stack>
      </Stack>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 32, gap: 9 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={16}
        maxToRenderPerBatch={16}
        windowSize={10}
        removeClippedSubviews
        ListEmptyComponent={
          <Stack alignItems="center" paddingVertical={48} gap={6}>
            <StyledText fontSize={15} fontWeight="700" color={COLORS.ink}>
              No hymns found
            </StyledText>
            <StyledText fontSize={13} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
              Try searching by hymn title or number.
            </StyledText>
          </Stack>
        }
      />
    </StyledPage>
  );
}
