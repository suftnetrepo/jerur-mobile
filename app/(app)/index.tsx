import { useCallback, useMemo, useState } from "react";
import { Animated, RefreshControl, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledText,
  StyledShape,
  StyledPressable,
  Stack,
  Loader,
  StyledSeperator,
} from "fluent-styles";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import {
  PillActionRow,
  type PillAction,
} from "../../src/components/PillActionRow";
import {
  NotificationCard,
  isNotificationActive,
} from "../../src/components/NotificationCard";
import { CurrentChurchHeader } from "../../src/components/CurrentChurchHeader";
import { ChurchBanner } from "../../src/components/ChurchBanner";
import { LiveSessionCard } from "../../src/components/LiveSessionCard";
import { LatestSermonCard } from "../../src/components/LatestSermonCard";
import { PropheticThemeCard } from "../../src/components/PropheticThemeCard";
import { ArticlesSection } from "../../src/components/ArticlesSection";
import { useFadeUp } from "../../src/hooks/useFadeUp";
import { useSelectedChurch } from "../../src/church/SelectedChurchContext";
import { useMemberSession } from "../../src/member/MemberSessionContext";
import {
  useSettings,
  useRegularServices,
  usePrayerTimes,
  useLatestSermon,
  useLatestArticles,
} from "../../src/hooks/useChurchData";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import { COLORS } from "../../src/theme/colors";
import { getNotificationPriority } from "../../src/config/notificationTypes";
import { findLiveSessions } from "../../src/utils/liveSessions";

const H_PAD = 20;

export default function HomeScreen() {
  const { church, changeChurch } = useSelectedChurch();
  const { member } = useMemberSession();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: services } = useRegularServices();
  const { data: prayerTimes } = usePrayerTimes();
  const { data: latestSermon } = useLatestSermon();
  const { data: latestArticles, isLoading: articlesLoading } =
    useLatestArticles();
  const { features, hasFeature } = useFeatureFlags();

  const headerAnim = useFadeUp(0);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [scheduleNow, setScheduleNow] = useState(() => new Date());

  // Re-evaluate the dynamic schedule whenever Home becomes visible. This
  // intentionally remains an in-app Home notice rather than a scheduled
  // device notification.
  useFocusEffect(
    useCallback(() => {
      setScheduleNow(new Date());
      // Home stays mounted behind other routes, so navigation focus must
      // refresh schedules explicitly; otherwise a newly configured session
      // can remain hidden behind the previous React Query cache entry.
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["regular-services"] }),
        queryClient.invalidateQueries({ queryKey: ["prayer-times"] }),
      ]);
    }, [queryClient]),
  );

  // Single hero slot: an active notification always wins over the church
  // banner — see isNotificationActive() in NotificationCard.tsx for the
  // status/title/date-window check this reuses (not duplicated here).
  const hasActiveNotification =
    hasFeature("notifications") && isNotificationActive(settings?.notification);
  const activeNotificationPriority = getNotificationPriority(
    settings?.notification?.priority,
  );
  const hasPriorityNotification =
    hasActiveNotification &&
    (activeNotificationPriority.id === "high" ||
      activeNotificationPriority.id === "urgent");
  const liveSessions = useMemo(
    () => findLiveSessions(services, prayerTimes, scheduleNow),
    [services, prayerTimes, scheduleNow],
  );

  // Pull-to-refresh — invalidates the exact React Query cache entries this
  // screen already reads from (useSettings' "settings" key backs the
  // banner/notification/pastor/contact/feature-flags — they're all read
  // off the one GET /church/get response — plus useRegularServices'
  // "regular-services" key for the "This week" list, useLatestSermon's
  // "latest-sermon" key, and useLatestArticles' "latest-articles" key).
  // No fetcher is ever called directly and no new query key is introduced:
  // invalidateQueries just marks these stale and lets react-query re-run
  // the same queryFn each hook already uses, then the UI updates from
  // cache automatically once state settles — no reload, no
  // AsyncStorage/church-selection logic touched.
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["settings"] }),
        queryClient.invalidateQueries({ queryKey: ["regular-services"] }),
        queryClient.invalidateQueries({ queryKey: ["prayer-times"] }),
        queryClient.invalidateQueries({ queryKey: ["latest-sermon"] }),
        queryClient.invalidateQueries({ queryKey: ["latest-articles"] }),
      ]);
      setScheduleNow(new Date());
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  // One pill per enabled feature — nothing hardcoded, nothing to update
  // here when a church enables/disables a feature or a new one ships.
  // "contact-us" is the one deliberate exception: it now lives in
  // Settings (see more.tsx, right before "About us") instead of here.
  const quickActions: PillAction[] = features
    .filter((feature) => feature.id !== "contact-us")
    .map((feature) => ({
      key: feature.id,
      label: feature.label,
      icon: feature.icon,
      route: feature.route!,
    }));

  async function handleChangeChurch() {
    await changeChurch();
    router.replace("/select-church");
  }

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
      {/* Top chrome — current-church selector / notifications / avatar.
          Same row/spacing as before; the only change from the hamburger
          version is this one swap (menu icon -> CurrentChurchHeader). */}
      <StyledPage.Header.Full>
        <Stack
          horizontal
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal={H_PAD}
          paddingTop={12}
          paddingBottom={4}
        >
          <CurrentChurchHeader church={church} onPress={handleChangeChurch} />
          <Stack marginLeft={16} horizontal alignItems="center" gap={14}>
            <StyledPressable
              onPress={() => router.push("/account")}
              accessibilityLabel="Account"
            >
              <StyledShape
                size={48}
                cycle
                backgroundColor={COLORS.white}
                borderWidth={1}
                borderColor={COLORS.chromeBorder}
              >
                <Icon name="user" size={24} color={COLORS.inkSoft} />
              </StyledShape>
            </StyledPressable>
          </Stack>
        </Stack>
      </StyledPage.Header.Full>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.indigo}
            colors={[COLORS.indigo]}
          />
        }
      >
        <Animated.View style={headerAnim}>
          <Stack paddingHorizontal={H_PAD} marginTop={10} marginBottom={18}>
            <StyledText fontSize={26} fontWeight="800" color={COLORS.ink}>
              {church?.name ?? "Your church"}
            </StyledText>
            <StyledText fontSize={13} color={COLORS.inkSoft}>
              Welcome — glad you're here.
            </StyledText>
          </Stack>

          {/* Quick actions — horizontal pill row, one per enabled feature */}
          {quickActions.length > 0 && (
            <Stack marginBottom={20}>
              <PillActionRow actions={quickActions} />
            </Stack>
          )}

          {/* Important administrator notices win. Otherwise a service or
              prayer in its configured lead-time window takes this slot,
              followed by a normal administrator notice and the banner. */}
          {settingsLoading ? (
            <Stack height={200} alignItems="center" justifyContent="center">
              <Loader color={COLORS.indigo} />
            </Stack>
          ) : hasPriorityNotification ? (
            <NotificationCard notification={settings?.notification} />
          ) : liveSessions.length > 0 ? (
            <Stack paddingHorizontal={H_PAD} gap={12}>
              {liveSessions.map((item) => (
                <LiveSessionCard key={item.key} item={item} />
              ))}
            </Stack>
          ) : hasActiveNotification ? (
            <NotificationCard notification={settings?.notification} />
          ) : (
            <ChurchBanner settings={settings} />
          )}

          {/* Just below the hero slot above (whichever of the four it
              rendered) — fully self-contained, see PropheticThemeCard.tsx
              for its own hasFeature/content visibility checks. */}
          <PropheticThemeCard settings={settings} />

          <Stack
            horizontal
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal={32}
            marginVertical={16}
          >
            <Stack>
              <StyledText fontSize={20} fontWeight="400" color={COLORS.inkSoft}>
                Latest Message
              </StyledText>

              <StyledText
                fontSize={12.5}
                color={COLORS.inkSoft}
                style={{ marginTop: 3 }}
              >
                Watch the latest word from our church
              </StyledText>
            </Stack>
          </Stack>

          {/* Latest Sermon — one card only, never a list. Fully
              self-contained: hides itself for hasFeature("sermons")=false,
              no published sermon, or no valid YouTube URL. */}
          <LatestSermonCard sermon={latestSermon} />

          <Stack
            horizontal
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal={32}
            marginVertical={16}
          >
            <Stack>
              <StyledText fontSize={20} fontWeight="400" color={COLORS.inkSoft}>
                More Article 
              </StyledText>

             
            </Stack>
          </Stack>

          {/* Christian Articles — up to 4 latest published articles,
              horizontally scrolling. Fully self-contained: hides itself
              for hasFeature("articles")=false or zero published articles;
              see ArticlesSection.tsx. */}
          <ArticlesSection
            articles={latestArticles}
            isLoading={articlesLoading}
          />
        </Animated.View>
      </ScrollView>

      <BottomTabBar active="home" />
    </StyledPage>
  );
}
