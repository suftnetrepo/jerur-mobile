import { useMemo, useState } from "react";
import { Platform, ScrollView } from "react-native";
import { POPUP_COLORS_DARK, POPUP_COLORS_LIGHT, Popup, Stack, StyledPage } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { Text } from "../../../src/components/text";
import {
  DailyActionCard,
  DevotionalCompleteButton,
  DevotionalContentCard,
  DevotionalDataError,
  DevotionalEmptyState,
  DevotionalHeader,
  DevotionalWeekStrip,
  MonthlyThemeCard,
  PrayerCard,
  ReflectionCard,
} from "../../../src/components/devotional";
import { devotionalData } from "../../../src/devotional/data";
import { getMonthTheme } from "../../../src/devotional/month-themes";
import {
  addDays,
  getDevotionalForSelectedDate,
  getVerseById,
  getWeekDates,
  getWeekStart,
  monthProgress,
  toLocalDateKey,
} from "../../../src/devotional/logic";
import { useDevotionalCompletion, useDevotionalFavorites } from "../../../src/devotional/storage";
import { COLORS, isDarkTheme } from "../../../src/theme/colors";

export default function DevotionalScreen() {
  return (
    <FeatureGate feature="daily-devotional">
      <DevotionalContent />
    </FeatureGate>
  );
}

function DevotionalContent() {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(today));
  const [expandedSheet, setExpandedSheet] = useState<"prayer" | "action" | null>(null);

  const { completedIds, isCompleted, toggleCompleted, error: completionError } = useDevotionalCompletion();
  const { favoriteIds, isFavorite, toggleFavorite, error: favoriteError } = useDevotionalFavorites();

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const devotional = useMemo(() => getDevotionalForSelectedDate(selectedDate), [selectedDate]);
  const verse = devotional ? getVerseById(devotional.verseId) : undefined;
  const theme = useMemo(() => getMonthTheme(selectedDate.getMonth() + 1), [selectedDate]);
  const progress = useMemo(() => monthProgress(selectedDate.getMonth() + 1, completedIds), [selectedDate, completedIds]);

  if (!devotionalData) return <DevotionalDataError />;

  const isToday = toLocalDateKey(selectedDate) === toLocalDateKey(today);
  const selectedDateLabel = selectedDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }).toUpperCase();

  function selectDate(date: Date) {
    setSelectedDate(date);
    setWeekStart(getWeekStart(date));
  }

  function isDateCompleted(date: Date) {
    const dayDevotional = getDevotionalForSelectedDate(date);
    return !!dayDevotional && completedIds.includes(dayDevotional.id);
  }

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paperSoft} statusBarStyle={isDarkTheme ? "light-content" : "dark-content"} statusBarBackgroundColor={Platform.OS === "android" ? COLORS.paperSoft : undefined}>
      <DevotionalHeader
        isFavorite={!!devotional && isFavorite(devotional.id)}
        onToggleFavorite={() => devotional && void toggleFavorite(devotional.id)}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>
        <DevotionalWeekStrip
          weekDates={weekDates}
          selectedDate={selectedDate}
          today={today}
          isDateCompleted={isDateCompleted}
          onSelectDate={selectDate}
          onPreviousWeek={() => setWeekStart(addDays(weekStart, -7))}
          onNextWeek={() => setWeekStart(addDays(weekStart, 7))}
        />
        {theme ? <MonthlyThemeCard theme={theme} completed={progress.completed} total={progress.total} /> : null}
        {!devotional ? (
          <DevotionalEmptyState />
        ) : (
          <>
            <DevotionalContentCard
              devotional={devotional}
              verse={verse}
              isToday={isToday}
              selectedDateLabel={selectedDateLabel}
              isFavorite={isFavorite(devotional.id)}
              onToggleFavorite={() => void toggleFavorite(devotional.id)}
            />
            {favoriteError ? <Text marginHorizontal={20} marginBottom={12} fontSize={12} color={COLORS.error}>{favoriteError}</Text> : null}
            <ReflectionCard reflection={devotional.reflection} reflectionQuestion={devotional.reflectionQuestion} />
            <Stack horizontal gap={12} marginHorizontal={20} marginBottom={16}>
              <PrayerCard prayer={devotional.prayer} onPress={() => setExpandedSheet("prayer")} />
              <DailyActionCard dailyAction={devotional.dailyAction} onPress={() => setExpandedSheet("action")} />
            </Stack>
            <DevotionalCompleteButton
              isCompleted={isCompleted(devotional.id)}
              onToggle={() => void toggleCompleted(devotional.id)}
              onPrevious={() => selectDate(addDays(selectedDate, -1))}
              onNext={() => selectDate(addDays(selectedDate, 1))}
              canGoPrevious
              canGoNext
            />
            {completionError ? <Text marginHorizontal={20} fontSize={12} color={COLORS.error}>{completionError}</Text> : null}
          </>
        )}
      </ScrollView>

      <Popup
        visible={expandedSheet === "prayer"}
        onClose={() => setExpandedSheet(null)}
        title="Prayer"
        subtitle="Pray this over your day"
        showClose
        safeAreaBottom
        colors={isDarkTheme ? POPUP_COLORS_DARK : POPUP_COLORS_LIGHT}
        headerStyle={{ paddingBottom: 8 }}
      >
        <Stack paddingHorizontal={22} paddingTop={6} paddingBottom={22}>
          <Text fontSize={16} color={COLORS.ink} style={{ lineHeight: 26 }}>{devotional?.prayer}</Text>
        </Stack>
      </Popup>
      <Popup
        visible={expandedSheet === "action"}
        onClose={() => setExpandedSheet(null)}
        title="Daily Action"
        subtitle="A simple step to live out today's devotional"
        showClose
        safeAreaBottom
        colors={isDarkTheme ? POPUP_COLORS_DARK : POPUP_COLORS_LIGHT}
        headerStyle={{ paddingBottom: 8 }}
      >
        <Stack paddingHorizontal={22} paddingTop={6} paddingBottom={22}>
          <Text fontSize={16} color={COLORS.ink} style={{ lineHeight: 26 }}>{devotional?.dailyAction}</Text>
        </Stack>
      </Popup>
    </StyledPage>
  );
}
