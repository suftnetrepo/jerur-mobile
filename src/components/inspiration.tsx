import { memo, useState, type ComponentProps } from "react";
import { Alert, ScrollView, Share, TextInput } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, StyledPressable } from "fluent-styles";
import { Text } from "./text";
import { COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";
import { INSPIRATION_FILTERS } from "../inspiration/groups";
import type { InspirationCategory, InspirationFilter, InspirationVerse } from "../inspiration/types";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const ICON_TONES = [
  { background: "#DFF4EF", foreground: "#0B7C78" },
  { background: "#E2F1FF", foreground: "#245A91" },
  { background: "#FDE8EB", foreground: "#A72B45" },
  { background: "#FFF1CF", foreground: "#8B6511" },
  { background: "#EAE7FF", foreground: "#4338A8" },
  { background: "#DCF5F7", foreground: "#0E7490" },
];

export function categoryTone(categoryId: string) {
  let hash = 0;
  for (const char of categoryId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return ICON_TONES[hash % ICON_TONES.length];
}

export function CategoryIcon({ category, size = 54 }: { category: InspirationCategory; size?: number }) {
  const tone = categoryTone(category.id);
  return (
    <Stack width={size} height={size} borderRadius={size / 2} alignItems="center" justifyContent="center" backgroundColor={tone.background}>
      <Ionicons name={category.icon as IoniconName} size={size * 0.44} color={tone.foreground} />
    </Stack>
  );
}

export const InspirationCategoryRow = memo(function InspirationCategoryRow({ category, onPress }: { category: InspirationCategory; onPress: () => void }) {
  return (
    <StyledPressable accessibilityRole="button" accessibilityLabel={`Open ${category.title}, ${category.verseIds.length} verses`} onPress={onPress}>
      <Stack horizontal alignItems="center" gap={15} padding={16} minHeight={96} borderRadius={18} backgroundColor={COLORS.white} borderWidth={1} borderColor={COLORS.chromeBorder} style={SHADOW_SOFT}>
        <CategoryIcon category={category} size={58} />
        <Stack flex={1} gap={3}>
          <Text fontSize={16} fontWeight="800" color={COLORS.ink}>{category.title}</Text>
          <Text numberOfLines={1} fontSize={13} color={COLORS.inkSoft}>{category.description}</Text>
          <Text fontSize={12} color={COLORS.inkSoftest}>{category.verseIds.length} verses</Text>
        </Stack>
        <Feather name="chevron-right" size={21} color={COLORS.inkSoft} />
      </Stack>
    </StyledPressable>
  );
});

export const InspirationCategoryCard = memo(function InspirationCategoryCard({ category, onPress, width = 148 }: { category: InspirationCategory; onPress: () => void; width?: number }) {
  return (
    <StyledPressable accessibilityRole="button" accessibilityLabel={`Open ${category.title}`} onPress={onPress} style={{ width }}>
      <Stack minHeight={158} padding={16} gap={13} borderRadius={20} backgroundColor={COLORS.white} borderWidth={0.1} borderColor={COLORS.chromeBorder} style={SHADOW_SOFT}>
        <Stack horizontal alignItems="flex-start" justifyContent="space-between">
          <CategoryIcon category={category} size={48} />
          <Feather name="arrow-up-right" size={17} color={COLORS.inkSoftest} />
        </Stack>
        <Stack gap={4}>
          <Text numberOfLines={1} fontSize={15} fontWeight="800" color={COLORS.ink}>{category.title}</Text>
          <Text fontSize={12} color={COLORS.inkSoftest}>{category.verseIds.length} verses</Text>
        </Stack>
      </Stack>
    </StyledPressable>
  );
});

export function InspirationSearchInput({ value, onChangeText, placeholder = "Search topics or verses" }: { value: string; onChangeText: (value: string) => void; placeholder?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <Stack horizontal alignItems="center" minHeight={52} borderRadius={16} paddingHorizontal={16} backgroundColor={COLORS.paperAlt} borderWidth={focused ? 1.5 : 1} borderColor={focused ? COLORS.indigo : COLORS.chromeBorder}>
      <Feather name="search" size={19} color={COLORS.inkSoft} />
      <TextInput accessibilityLabel={placeholder} value={value} onChangeText={onChangeText} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} placeholderTextColor={COLORS.inkSoftest} returnKeyType="search" style={{ flex: 1, minHeight: 50, paddingHorizontal: 12, color: COLORS.ink, fontSize: 15 }} />
      {value ? <StyledPressable accessibilityLabel="Clear search" hitSlop={10} onPress={() => onChangeText("")}><Feather name="x-circle" size={19} color={COLORS.inkSoft} /></StyledPressable> : null}
    </Stack>
  );
}

export function InspirationFilterChips({ selected, onSelect }: { selected: InspirationFilter; onSelect: (filter: InspirationFilter) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }}>
      {INSPIRATION_FILTERS.map((filter) => {
        const active = filter.id === selected;
        return <StyledPressable key={filter.id} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => onSelect(filter.id)}><Stack minHeight={44} justifyContent="center" paddingHorizontal={18} borderRadius={999} backgroundColor={active ? COLORS.indigo : COLORS.paperAlt}><Text fontSize={13} fontWeight={active ? "800" : "600"} color={active ? COLORS.onPrimary : COLORS.inkSoft}>{filter.label}</Text></Stack></StyledPressable>;
      })}
    </ScrollView>
  );
}

export function FeaturedVerseCard({ verse, isSaved, onToggleSaved }: { verse: InspirationVerse; isSaved: boolean; onToggleSaved: () => void }) {
  return (
    <Stack padding={22} borderRadius={24} gap={17} backgroundColor={COLORS.white} borderWidth={0.1} borderColor={COLORS.chromeBorder} style={SHADOW_SOFT}>
      <Stack horizontal justifyContent="space-between" alignItems="center">
        <Stack horizontal alignItems="center" gap={9}>
          <Stack width={36} height={36} borderRadius={18} alignItems="center" justifyContent="center" backgroundColor={COLORS.sageSoft}>
            <Feather name="feather" size={17} color={COLORS.sage} />
          </Stack>
          <Stack gap={1}>
            <Text variant="overline" fontSize={10.5} letterSpacing={1.15} color={COLORS.indigo}>TODAY&apos;S VERSE</Text>
            <Text fontSize={11} color={COLORS.inkSoftest}>A word for your day</Text>
          </Stack>
        </Stack>
        <StyledPressable accessibilityLabel={isSaved ? "Remove daily verse bookmark" : "Bookmark daily verse"} hitSlop={8} onPress={onToggleSaved}>
          <Stack width={44} height={44} borderRadius={22} alignItems="center" justifyContent="center" backgroundColor={isSaved ? COLORS.goldPale : COLORS.paperAlt}>
            <Feather name="bookmark" size={19} color={isSaved ? COLORS.goldDeep : COLORS.inkSoft} />
          </Stack>
        </StyledPressable>
      </Stack>
      <Stack height={1} backgroundColor={COLORS.chromeBorder} />
      <Text fontSize={19} fontWeight="600" color={COLORS.ink} style={{ lineHeight: 30 }}>“{verse.text}”</Text>
      <Stack horizontal alignItems="center" gap={8}>
        <Stack width={3} height={30} borderRadius={2} backgroundColor={COLORS.indigo} />
        <Stack gap={1}>
          <Text fontSize={13} fontWeight="800" color={COLORS.indigo}>{verse.reference}</Text>
          <Text fontSize={11} fontWeight="600" color={COLORS.inkSoftest}>{verse.translation}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}

async function shareVerse(verse: InspirationVerse) {
  try {
    await Share.share({ message: `“${verse.text}”\n\n${verse.reference} • ${verse.translation}\n\nShared from Jerur` });
  } catch {
    Alert.alert("Unable to share", "This verse could not be shared right now. Please try again.");
  }
}

export const VerseCard = memo(function VerseCard({ verse, isSaved, onToggleSaved }: { verse: InspirationVerse; isSaved: boolean; onToggleSaved: () => void }) {
  return (
    <Stack padding={19} borderRadius={18} gap={13} backgroundColor={COLORS.white} borderWidth={1} borderColor={COLORS.chromeBorder} style={SHADOW_SOFT}>
      <Text fontSize={16} color={COLORS.ink} style={{ lineHeight: 26 }}>“{verse.text}”</Text>
      <Stack horizontal alignItems="center" justifyContent="space-between" gap={12}>
        <Stack flex={1}>
          <Text fontSize={13} fontWeight="800" color={COLORS.indigo}>{verse.reference}</Text>
          <Text fontSize={11} color={COLORS.inkSoftest}>{verse.translation}</Text>
        </Stack>
        <StyledPressable accessibilityLabel={isSaved ? `Remove bookmark for ${verse.reference}` : `Bookmark ${verse.reference}`} hitSlop={8} onPress={onToggleSaved}><Stack width={44} height={44} borderRadius={22} alignItems="center" justifyContent="center" backgroundColor={isSaved ? COLORS.goldPale : COLORS.paperAlt}><Feather name="bookmark" size={18} color={isSaved ? COLORS.goldDeep : COLORS.inkSoft} /></Stack></StyledPressable>
        <StyledPressable accessibilityLabel={`Share ${verse.reference}`} hitSlop={8} onPress={() => void shareVerse(verse)}><Stack width={44} height={44} borderRadius={22} alignItems="center" justifyContent="center" backgroundColor={COLORS.paperAlt}><Feather name="share-2" size={18} color={COLORS.inkSoft} /></Stack></StyledPressable>
      </Stack>
    </Stack>
  );
});

export function EmptySearchState({ kind = "topics" }: { kind?: "topics" | "verses" }) {
  return <Stack alignItems="center" paddingVertical={54} paddingHorizontal={24} gap={8}><Stack width={54} height={54} borderRadius={27} alignItems="center" justifyContent="center" backgroundColor={COLORS.paperAlt}><Feather name="search" size={22} color={COLORS.inkSoft} /></Stack><Text fontSize={16} fontWeight="800" color={COLORS.ink}>No matching {kind}</Text><Text textAlign="center" fontSize={13} color={COLORS.inkSoft}>Try a different word or clear your search.</Text></Stack>;
}

export function InspirationDataError() {
  return <Stack flex={1} alignItems="center" justifyContent="center" padding={28} gap={8} backgroundColor={COLORS.paper}><Feather name="alert-circle" size={30} color={COLORS.error} /><Text fontSize={17} fontWeight="800" color={COLORS.ink}>Inspiration is unavailable</Text><Text textAlign="center" fontSize={13} color={COLORS.inkSoft}>The Bible Inspiration library could not be loaded. Please update the app or try again later.</Text></Stack>;
}
