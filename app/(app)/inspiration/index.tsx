import { useMemo, useState } from "react";
import { Platform, ScrollView, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { StyledPage, StyledPressable, StyledButton, Stack } from "fluent-styles";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { ReaderFontSizePopup } from "../../../src/components/ReaderFontSizePopup";
import { Text } from "../../../src/components/text";
import { FeaturedVerseCard, InspirationCategoryCard, InspirationDataError } from "../../../src/components/inspiration";
import { inspirationData } from "../../../src/inspiration/data";
import { selectDailyFeaturedVerse } from "../../../src/inspiration/logic";
import { useReaderFontSize } from "../../../src/inspiration/use-reader-font-size";
import { useSavedVerses } from "../../../src/inspiration/useSavedVerses";
import { COLORS, isDarkTheme } from "../../../src/theme/colors";

export default function InspirationScreen() {
  return <FeatureGate feature="bible-inspiration"><InspirationContent /></FeatureGate>;
}

function InspirationContent() {
  const { width } = useWindowDimensions();
  const dailyVerse = useMemo(() => inspirationData ? selectDailyFeaturedVerse(inspirationData) : undefined, []);
  const { isSaved, toggleSaved, error } = useSavedVerses();
  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } = useReaderFontSize();
  const [fontSizePopupVisible, setFontSizePopupVisible] = useState(false);
  if (!inspirationData || !dailyVerse) return <InspirationDataError />;
  const categories = inspirationData.categories.slice(0, 6);
  const categoryCardWidth = Math.max(120, (width - 52) / 2);

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paperSoft} statusBarStyle={isDarkTheme ? "light-content" : "dark-content"} statusBarBackgroundColor={Platform.OS === "android" ? COLORS.paperSoft : undefined}>
      <AppBackHeader
        title="Inspiration"
        backgroundColor={COLORS.paperSoft}
        rightIcon={
          <StyledButton icon compact backgroundColor={COLORS.goldPale} onPress={() => setFontSizePopupVisible(true)} accessibilityLabel="Change text size">
            <Feather name="type" size={18} color={COLORS.goldDeep} />
          </StyledButton>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36 }}>
        <Stack paddingHorizontal={16} marginTop={16} marginBottom={20} gap={1}>
          <Text fontSize={16} fontWeight="800" color={COLORS.ink}>What do you need today?</Text>
          <Text fontSize={14} color={COLORS.inkSoft}>Find God&apos;s Word for every season of life.</Text>
        </Stack>
        <FeaturedVerseCard verse={dailyVerse} isSaved={isSaved(dailyVerse.id)} onToggleSaved={() => void toggleSaved(dailyVerse.id)} fontSize={fontSize} />
        {error ? <Text accessibilityRole="alert" marginTop={10} fontSize={12} color={COLORS.error}>{error}</Text> : null}
        <Stack paddingHorizontal={16} horizontal alignItems="center" justifyContent="space-between" marginTop={14} marginBottom={14}>
          <Text variant="body"  color={COLORS.inkSoftest}>Inspirations</Text>
          <StyledPressable accessibilityLabel="View all inspiration topics" onPress={() => router.push("/inspiration/all")}><Stack horizontal alignItems="center" gap={4} minHeight={44}><Text fontSize={13} fontWeight="800" color={COLORS.indigo}>View all</Text><Feather name="arrow-right" size={16} color={COLORS.indigo} /></Stack></StyledPressable>
        </Stack>
        <Stack horizontal flexWrap="wrap" gap={12} paddingBottom={14}>
          {categories.map((category) => <InspirationCategoryCard key={category.id} width={categoryCardWidth} category={category} onPress={() => router.push(`/inspiration/${category.id}` as never)} />)}
        </Stack>
      </ScrollView>
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
