import { memo } from "react";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Stack, StyledPressable } from "fluent-styles";
import { Text } from "./text";
import { ThemeHeader } from "./ThemeHeader";
import { COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";
import { DevotionalArtwork } from "../devotional/DevotionalArtwork";
import { MONTH_NAMES } from "../devotional/month-themes";
import { toLocalDateKey } from "../devotional/logic";
import type { DevotionalEntry, DevotionalMonthTheme } from "../devotional/types";
import type { InspirationVerse } from "../inspiration/types";

const WEEKDAY_LETTERS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/** Tints a "#RRGGBB" hex with an alpha — used to derive a premium, theme-matched progress track from each month's own accent color instead of a flat gray. */
function withAlpha(hex: string, alpha: number): string {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) return hex;
  const value = parseInt(match[1], 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function HeaderIconButton({ icon, color, accessibilityLabel, onPress }: { icon: string; color: string; accessibilityLabel: string; onPress: () => void }) {
  return (
    <StyledPressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} hitSlop={8} onPress={onPress}>
      <Stack width={40} height={40} borderRadius={20} alignItems="center" justifyContent="center" backgroundColor={COLORS.paperAlt}>
        <Feather name={icon as any} size={18} color={color} />
      </Stack>
    </StyledPressable>
  );
}

export function DevotionalHeader({
  isFavorite,
  onToggleFavorite,
}: {
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <ThemeHeader
      showBackArrow
      shapeProps={{ cycle: true, size: 48, borderRadius: 24, borderWidth: 1, borderColor: COLORS.chromeBorder }}
      title="Daily Devotional"
      titleAlignment="center"
      onBackPress={() => router.back()}
      backgroundColor={COLORS.paperSoft}
      marginHorizontal={16}
      rightIcon={
        <HeaderIconButton icon="heart" color={isFavorite ? COLORS.error : COLORS.ink} accessibilityLabel={isFavorite ? "Remove from favourites" : "Add to favourites"} onPress={onToggleFavorite} />
      }
    />
  );
}

export const DevotionalDayItem = memo(function DevotionalDayItem({
  date,
  isSelected,
  isToday,
  isCompleted,
  onPress,
}: {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  isCompleted: boolean;
  onPress: () => void;
}) {
  const weekdayIndex = (date.getDay() + 6) % 7; // Mon=0
  return (
    <StyledPressable
      accessibilityRole="button"
      accessibilityLabel={date.toDateString()}
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={{ minWidth: 44 }}
    >
      <Stack
        alignItems="center"
        gap={6}
        paddingVertical={10}
        paddingHorizontal={4}
        borderRadius={16}
        minHeight={64}
        justifyContent="center"
        backgroundColor={isSelected ? COLORS.indigo : "transparent"}
      >
        <Text fontSize={11} fontWeight="700" color={isSelected ? COLORS.onPrimary : COLORS.inkSoftest}>{WEEKDAY_LETTERS[weekdayIndex]}</Text>
        <Text fontSize={17} fontWeight="800" color={isSelected ? COLORS.onPrimary : COLORS.ink}>{date.getDate()}</Text>
        {isCompleted ? (
          <Stack width={16} height={16} borderRadius={8} alignItems="center" justifyContent="center" backgroundColor={isSelected ? "rgba(255,255,255,0.25)" : COLORS.sageSoft}>
            <Feather name="check" size={10} color={isSelected ? COLORS.onPrimary : COLORS.sage} />
          </Stack>
        ) : isToday ? (
          <Stack width={5} height={5} borderRadius={2.5} backgroundColor={isSelected ? COLORS.onPrimary : COLORS.gold} />
        ) : (
          <Stack width={16} height={16} />
        )}
      </Stack>
    </StyledPressable>
  );
});

export function DevotionalWeekStrip({
  weekDates,
  selectedDate,
  today,
  isDateCompleted,
  onSelectDate,
  onPreviousWeek,
  onNextWeek,
}: {
  weekDates: Date[];
  selectedDate: Date;
  today: Date;
  isDateCompleted: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}) {
  const visibleMonth = weekDates[3] ?? weekDates[0];
  return (
    <Stack paddingHorizontal={20} paddingTop={4} paddingBottom={10} gap={10}>
      <Text fontSize={16} fontWeight="800" color={COLORS.ink}>{MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</Text>
      <Stack horizontal alignItems="center" gap={2}>
        <StyledPressable accessibilityRole="button" accessibilityLabel="Previous week" hitSlop={8} onPress={onPreviousWeek}>
          <Stack width={28} height={44} alignItems="center" justifyContent="center"><Feather name="chevron-left" size={18} color={COLORS.inkSoft} /></Stack>
        </StyledPressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
          {weekDates.map((date) => (
            <DevotionalDayItem
              key={toLocalDateKey(date)}
              date={date}
              isSelected={toLocalDateKey(date) === toLocalDateKey(selectedDate)}
              isToday={toLocalDateKey(date) === toLocalDateKey(today)}
              isCompleted={isDateCompleted(date)}
              onPress={() => onSelectDate(date)}
            />
          ))}
        </ScrollView>
        <StyledPressable accessibilityRole="button" accessibilityLabel="Next week" hitSlop={8} onPress={onNextWeek}>
          <Stack width={28} height={44} alignItems="center" justifyContent="center"><Feather name="chevron-right" size={18} color={COLORS.inkSoft} /></Stack>
        </StyledPressable>
      </Stack>
    </Stack>
  );
}

export function MonthlyThemeCard({ theme, completed, total }: { theme: DevotionalMonthTheme; completed: number; total: number }) {
  const progress = total > 0 ? Math.min(1, completed / total) : 0;
  return (
    <Stack
      marginHorizontal={20}
      marginBottom={18}
      borderRadius={22}
      padding={22}
      gap={14}
      overflow="hidden"
      backgroundColor={theme.secondaryColor}
      style={SHADOW_SOFT}
    >
      <Stack position="absolute" top={0} left={0} right={0} bottom={0}>
        <DevotionalArtwork variant={theme.artworkVariant} primaryColor={theme.primaryColor} secondaryColor={theme.secondaryColor} accentColor={theme.accentColor} />
      </Stack>
      <Text variant="overline" fontSize={11} letterSpacing={1.4} color={theme.accentColor}>{MONTH_NAMES[theme.month - 1].toUpperCase()} THEME</Text>
      <Stack gap={4}>
        <Text fontSize={25} fontWeight="800" color={COLORS.onPrimary} style={{ lineHeight: 31 }}>{theme.title}</Text>
        <Text fontSize={13.5} color="rgba(255,255,255,0.82)">{theme.description}</Text>
      </Stack>
      <Stack gap={6}>
        <Stack height={5} borderRadius={2.5} backgroundColor={withAlpha(theme.accentColor, 0.24)}>
          <Stack height={5} borderRadius={2.5} backgroundColor={theme.accentColor} style={{ width: `${Math.round(progress * 100)}%` }} />
        </Stack>
        <Text fontSize={12} fontWeight="600" color="rgba(255,255,255,0.75)">{completed} of {total} days</Text>
      </Stack>
    </Stack>
  );
}

export function DevotionalContentCard({
  devotional,
  verse,
  isToday,
  selectedDateLabel,
  isFavorite,
  onToggleFavorite,
}: {
  devotional: DevotionalEntry;
  verse: InspirationVerse | undefined;
  isToday: boolean;
  selectedDateLabel: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <Stack marginHorizontal={20} marginBottom={16} padding={22} borderRadius={24} gap={16} backgroundColor={COLORS.white} borderWidth={0.1} borderColor={COLORS.chromeBorder} style={SHADOW_SOFT}>
      <Stack horizontal alignItems="center" justifyContent="space-between">
        <Text variant="overline" fontSize={11} letterSpacing={1.2} color={COLORS.sage}>{isToday ? `TODAY · ${devotional.estimatedReadMinutes} MIN` : selectedDateLabel}</Text>
        <StyledPressable accessibilityRole="button" accessibilityLabel={isFavorite ? "Remove bookmark" : "Bookmark this devotional"} hitSlop={8} onPress={onToggleFavorite}>
          <Feather name="bookmark" size={20} color={isFavorite ? COLORS.goldDeep : COLORS.inkSoft} />
        </StyledPressable>
      </Stack>
      <Text fontSize={23} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 29 }}>{devotional.title}</Text>
      {verse ? (
        <>
          <Text fontSize={16.5} color={COLORS.ink} style={{ lineHeight: 27 }}>&ldquo;{verse.text}&rdquo;</Text>
          <Stack horizontal alignItems="center" gap={8}>
            <Text fontSize={15} fontWeight="700" color={COLORS.indigo}>{verse.reference}</Text>
            <Stack paddingHorizontal={9} paddingVertical={3} borderRadius={999} backgroundColor={COLORS.sageSoft}>
              <Text fontSize={10.5} fontWeight="800" color={COLORS.sage}>{verse.translation}</Text>
            </Stack>
          </Stack>
        </>
      ) : (
        <Text fontSize={13} color={COLORS.inkSoftest}>Scripture unavailable for this devotional.</Text>
      )}
    </Stack>
  );
}

export function ReflectionCard({ reflection, reflectionQuestion }: { reflection: string; reflectionQuestion: string }) {
  return (
    <Stack marginHorizontal={20} marginBottom={16} padding={20} borderRadius={22} gap={13} backgroundColor={COLORS.white} borderWidth={0.1} borderColor={COLORS.chromeBorder} style={SHADOW_SOFT}>
      <Stack horizontal alignItems="center" gap={10}>
        <Stack width={36} height={36} borderRadius={18} alignItems="center" justifyContent="center" backgroundColor={COLORS.sageSoft}>
          <Feather name="feather" size={17} color={COLORS.sage} />
        </Stack>
        <Text fontSize={17} fontWeight="800" color={COLORS.ink}>Reflection</Text>
      </Stack>
      <Text fontSize={14.5} color={COLORS.inkSoft} style={{ lineHeight: 23 }}>{reflection}</Text>
      <Stack horizontal alignItems="flex-start" gap={10} padding={14} borderRadius={16} backgroundColor={COLORS.paperAlt}>
        <Feather name="message-circle" size={17} color={COLORS.indigo} />
        <Text flex={1} fontSize={13.5} fontWeight="600" color={COLORS.ink} style={{ lineHeight: 20 }}>{reflectionQuestion}</Text>
      </Stack>
    </Stack>
  );
}

function CompactActionCard({ icon, label, preview, onPress }: { icon: string; label: string; preview: string; onPress: () => void }) {
  return (
    <StyledPressable accessibilityRole="button" accessibilityLabel={`${label}: ${preview}`} onPress={onPress} style={{ flex: 1 }}>
      <Stack padding={16} borderRadius={20} gap={10} minHeight={128} backgroundColor={COLORS.white} borderWidth={0.1} borderColor={COLORS.chromeBorder} style={SHADOW_SOFT}>
        <Stack horizontal alignItems="center" justifyContent="space-between">
          <Stack width={38} height={38} borderRadius={19} alignItems="center" justifyContent="center" backgroundColor={COLORS.goldPale}>
            <Feather name={icon as any} size={17} color={COLORS.goldDeep} />
          </Stack>
          <Feather name="chevron-right" size={17} color={COLORS.inkSoftest} />
        </Stack>
        <Stack gap={3}>
          <Text fontSize={14.5} fontWeight="800" color={COLORS.ink}>{label}</Text>
          <Text numberOfLines={2} fontSize={12} color={COLORS.inkSoft} style={{ lineHeight: 17 }}>{preview}</Text>
        </Stack>
      </Stack>
    </StyledPressable>
  );
}

export function PrayerCard({ prayer, onPress }: { prayer: string; onPress: () => void }) {
  return <CompactActionCard icon="user" label="Prayer" preview={prayer} onPress={onPress} />;
}

export function DailyActionCard({ dailyAction, onPress }: { dailyAction: string; onPress: () => void }) {
  return <CompactActionCard icon="check-square" label="Daily Action" preview={dailyAction} onPress={onPress} />;
}

export function DevotionalCompleteButton({
  isCompleted,
  onToggle,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: {
  isCompleted: boolean;
  onToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}) {
  return (
    <Stack horizontal alignItems="center" gap={10} paddingHorizontal={20} paddingTop={4} paddingBottom={10}>
      <StyledPressable accessibilityRole="button" accessibilityLabel="Previous day" hitSlop={8} onPress={canGoPrevious ? onPrevious : undefined}>
        <Stack width={44} height={44} borderRadius={22} alignItems="center" justifyContent="center" backgroundColor={COLORS.paperAlt} style={{ opacity: canGoPrevious ? 1 : 0.4 }}>
          <Feather name="chevron-left" size={19} color={COLORS.ink} />
        </Stack>
      </StyledPressable>
      <StyledPressable accessibilityRole="button" accessibilityLabel={isCompleted ? "Mark today incomplete" : "Mark today complete"} onPress={onToggle} style={{ flex: 1 }}>
        <Stack horizontal flex={1} alignItems="center" justifyContent="center" gap={9} minHeight={54} borderRadius={27} backgroundColor={isCompleted ? COLORS.sage : COLORS.indigo}>
          <Feather name="check-circle" size={18} color={COLORS.onPrimary} />
          <Text fontSize={15} fontWeight="800" color={COLORS.onPrimary}>{isCompleted ? "Completed" : "Mark Today Complete"}</Text>
        </Stack>
      </StyledPressable>
      <StyledPressable accessibilityRole="button" accessibilityLabel="Next day" hitSlop={8} onPress={canGoNext ? onNext : undefined}>
        <Stack width={44} height={44} borderRadius={22} alignItems="center" justifyContent="center" backgroundColor={COLORS.paperAlt} style={{ opacity: canGoNext ? 1 : 0.4 }}>
          <Feather name="chevron-right" size={19} color={COLORS.ink} />
        </Stack>
      </StyledPressable>
    </Stack>
  );
}

export function DevotionalEmptyState() {
  return (
    <Stack alignItems="center" paddingVertical={54} paddingHorizontal={24} gap={8}>
      <Stack width={54} height={54} borderRadius={27} alignItems="center" justifyContent="center" backgroundColor={COLORS.paperAlt}>
        <Feather name="calendar" size={22} color={COLORS.inkSoft} />
      </Stack>
      <Text fontSize={16} fontWeight="800" color={COLORS.ink}>No devotional for this day</Text>
      <Text textAlign="center" fontSize={13} color={COLORS.inkSoft}>Pick another date to continue reading.</Text>
    </Stack>
  );
}

export function DevotionalDataError() {
  return (
    <Stack flex={1} alignItems="center" justifyContent="center" padding={28} gap={8} backgroundColor={COLORS.paper}>
      <Feather name="alert-circle" size={30} color={COLORS.error} />
      <Text fontSize={17} fontWeight="800" color={COLORS.ink}>Devotional is unavailable</Text>
      <Text textAlign="center" fontSize={13} color={COLORS.inkSoft}>The Daily Devotional library could not be loaded. Please update the app or try again later.</Text>
    </Stack>
  );
}
