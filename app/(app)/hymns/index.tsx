import { useCallback, useMemo, useState } from "react";
import { FlatList, TextInput } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledText,
  StyledPressable,
  Stack,
  StyledSpacer,
  StyledShape,
} from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { BottomTabBar } from "../../../src/components/BottomTabBar";
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
  const [searchFocused, setSearchFocused] = useState(false);

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
    [],
  );

  return (
    <StyledPage showStatusBar backgroundColor={COLORS.paper}>
      <StyledPage.Header
        showBackArrow
        shapeProps={{
          cycle: true,
          size: 48,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.chromeBorder,
        }}
        title="Hymns"
        titleAlignment="center"
        onBackPress={() => router.push("/")}
        backgroundColor={COLORS.paper}
        marginHorizontal={16}
        rightIcon ={<StyledShape size={48}></StyledShape>}
      />

      <Stack paddingHorizontal={24} paddingTop={4} paddingBottom={16}>
        <StyledText
          textAlign="center"
          fontSize={13.5}
          color={COLORS.inkSoft}
          style={{ marginBottom: 18, lineHeight: 20 }}
        >
          Songs of faith, worship and praise
        </StyledText>
        <Stack
          horizontal
          alignItems="center"
          backgroundColor="#FFFFFF"
          borderRadius={8}
          style={{
            borderWidth: searchFocused ? 1.5 : 1,
            borderColor: searchFocused ? "#6366f1" : COLORS.chromeBorder,
          }}
        >
          <Stack paddingHorizontal={4} marginLeft={4}>
            <Icon name="search" size={15} color={COLORS.inkSoft} />
          </Stack>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search hymns..."
            placeholderTextColor="#d4d4d8"
            maxLength={40}
            style={{
              flex: 1,
              fontSize: 15,
              fontWeight: "400",
              color: COLORS.ink,
              paddingHorizontal: 12,
              paddingVertical: 11,
              minHeight: 48,
              height: 48,
              textAlignVertical: "center",
              includeFontPadding: false,
            }}
          />
          {query.length > 0 && (
            <StyledPressable
              onPress={() => setQuery("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Clear input"
              style={{ paddingHorizontal: 4, marginRight: 4 }}
            >
              <Stack
                width={19}
                height={19}
                borderRadius={9.5}
                alignItems="center"
                justifyContent="center"
                backgroundColor="#f4f4f5"
              >
                <StyledText fontSize={9.75} fontWeight="700" color="#a1a1aa">
                  ✕
                </StyledText>
              </Stack>
            </StyledPressable>
          )}
        </Stack>

        {/* <StyledSpacer marginVertical={16} /> */}
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
            {query.trim()
              ? `${results.length} hymn${results.length === 1 ? "" : "s"} found`
              : `${results.length} hymns`}
          </StyledText>
        </Stack>
      </Stack>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 6,
          paddingBottom: 32,
          gap: 9,
        }}
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
            <StyledText
              fontSize={13}
              color={COLORS.inkSoft}
              style={{ textAlign: "center" }}
            >
              Try searching by hymn title or number.
            </StyledText>
          </Stack>
        }
      />
      <BottomTabBar active="hymns" />
    </StyledPage>
  );
}
