import { useMemo } from "react";
import { Platform, ScrollView, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { StyledPage, StyledPressable, Stack } from "fluent-styles";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { Text } from "../../../src/components/text";
import { FeaturedVerseCard, InspirationCategoryCard, InspirationDataError } from "../../../src/components/inspiration";
import { inspirationData } from "../../../src/inspiration/data";
import { selectDailyFeaturedVerse } from "../../../src/inspiration/logic";
import { useSavedVerses } from "../../../src/inspiration/useSavedVerses";
import { COLORS, isDarkTheme } from "../../../src/theme/colors";

export default function InspirationScreen() {
  return <FeatureGate feature="bible-inspiration"><InspirationContent /></FeatureGate>;
}

function InspirationContent() {
  const { width } = useWindowDimensions();
  const dailyVerse = useMemo(() => inspirationData ? selectDailyFeaturedVerse(inspirationData) : undefined, []);
  const { isSaved, toggleSaved, error } = useSavedVerses();
  if (!inspirationData || !dailyVerse) return <InspirationDataError />;
  const categories = inspirationData.categories.slice(0, 6);
  const categoryCardWidth = Math.max(120, (width - 52) / 2);

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paperSoft} statusBarStyle={isDarkTheme ? "light-content" : "dark-content"} statusBarBackgroundColor={Platform.OS === "android" ? COLORS.paperSoft : undefined}>
      <AppBackHeader title="Bible Inspiration" backgroundColor={COLORS.paperSoft} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36 }}>
        <Stack marginTop={8} marginBottom={20} gap={5}>
          <Text fontSize={27} fontWeight="800" color={COLORS.ink}>What do you need today?</Text>
          <Text fontSize={14} color={COLORS.inkSoft}>Find God&apos;s Word for every season of life.</Text>
        </Stack>
        <FeaturedVerseCard verse={dailyVerse} isSaved={isSaved(dailyVerse.id)} onToggleSaved={() => void toggleSaved(dailyVerse.id)} />
        {error ? <Text accessibilityRole="alert" marginTop={10} fontSize={12} color={COLORS.error}>{error}</Text> : null}
        <Stack horizontal alignItems="center" justifyContent="space-between" marginTop={28} marginBottom={14}>
          <Text fontSize={18} fontWeight="800" color={COLORS.ink}>Browse inspiration</Text>
          <StyledPressable accessibilityLabel="View all inspiration topics" onPress={() => router.push("/inspiration/all")}><Stack horizontal alignItems="center" gap={4} minHeight={44}><Text fontSize={13} fontWeight="800" color={COLORS.indigo}>View all</Text><Feather name="arrow-right" size={16} color={COLORS.indigo} /></Stack></StyledPressable>
        </Stack>
        <Stack horizontal flexWrap="wrap" gap={12} paddingBottom={14}>
          {categories.map((category) => <InspirationCategoryCard key={category.id} width={categoryCardWidth} category={category} onPress={() => router.push(`/inspiration/${category.id}` as never)} />)}
        </Stack>
      </ScrollView>
    </StyledPage>
  );
}
