import { useCallback, useState } from "react";
import { Animated, RefreshControl, ScrollView } from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledText, StyledShape, StyledPressable, Stack, Loader } from "fluent-styles";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import { PillActionRow, type PillAction } from "../../src/components/PillActionRow";
import { NotificationCard, isNotificationActive } from "../../src/components/NotificationCard";
import { CurrentChurchHeader } from "../../src/components/CurrentChurchHeader";
import { ChurchBanner } from "../../src/components/ChurchBanner";
import { LatestSermonCard } from "../../src/components/LatestSermonCard";
import { ArticlesSection } from "../../src/components/ArticlesSection";
import { useFadeUp } from "../../src/hooks/useFadeUp";
import { SHADOW_SOFT } from "../../src/theme/shadows";
import { useSelectedChurch } from "../../src/church/SelectedChurchContext";
import { useMemberSession } from "../../src/member/MemberSessionContext";
import { useSettings, useRegularServices, useLatestSermon, useLatestArticles } from "../../src/hooks/useChurchData";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import { COLORS } from "../../src/theme/colors";

const H_PAD = 20;

// "Ways to belong" cards — title/desc are page-specific copy (friendlier
// than the admin-facing catalogue label/description), but icon and route
// are never re-typed here: they're looked up from src/config/mobileFeatures.ts
// via `features` below, so there's one place that can drift out of sync
// with the backend. A card simply disappears once its feature is off.
const WAYS_TO_BELONG = [
  { featureId: "house-fellowship", title: "Fellowship groups", desc: "Small groups meeting through the week." },
  { featureId: "upcoming-events", title: "Upcoming events", desc: "Conferences, prayer nights, community days." },
  { featureId: "community-food-bank", title: "Community food bank", desc: "Practical support for families nearby." },
] as const;

export default function HomeScreen() {
  const { church, changeChurch } = useSelectedChurch();
  const { member } = useMemberSession();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: services } = useRegularServices();
  const { data: latestSermon } = useLatestSermon();
  const { data: latestArticles, isLoading: articlesLoading } = useLatestArticles();
  const { features, hasFeature } = useFeatureFlags();

  const headerAnim = useFadeUp(0);
  const bodyAnim = useFadeUp(140);

  const pastor = settings?.pastor_section;
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Single hero slot: an active notification always wins over the church
  // banner — see isNotificationActive() in NotificationCard.tsx for the
  // status/title/date-window check this reuses (not duplicated here).
  const hasActiveNotification = hasFeature("notifications") && isNotificationActive(settings?.notification);

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
        queryClient.invalidateQueries({ queryKey: ["latest-sermon"] }),
        queryClient.invalidateQueries({ queryKey: ["latest-articles"] }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  // One pill per enabled feature — nothing hardcoded, nothing to update
  // here when a church enables/disables a feature or a new one ships.
  const quickActions: PillAction[] = features.map((feature) => ({
    key: feature.id,
    label: feature.label,
    icon: feature.icon,
    route: feature.route!,
  }));

  const waysToBelong = WAYS_TO_BELONG.map((item) => {
    const feature = features.find((f) => f.id === item.featureId);
    return feature ? { ...item, icon: feature.icon, route: feature.route! } : null;
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  async function handleChangeChurch() {
    await changeChurch();
    router.replace("/select-church");
  }

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.chrome}>
      {/* Top chrome — current-church selector / notifications / avatar.
          Same row/spacing as before; the only change from the hamburger
          version is this one swap (menu icon -> CurrentChurchHeader). */}
      <Stack horizontal alignItems="center" justifyContent="space-between" paddingHorizontal={H_PAD} paddingTop={12} paddingBottom={4}>
        <CurrentChurchHeader church={church} onPress={handleChangeChurch} />
        <Stack horizontal alignItems="center" gap={14}>
          <StyledPressable accessibilityLabel="Notifications">
            <Icon name="bell" size={20} color={COLORS.ink} />
          </StyledPressable>
          <StyledPressable onPress={() => router.push("/account")} accessibilityLabel="Account">
            <StyledShape size={32} cycle backgroundColor={COLORS.white} style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}>
              {member ? (
                <StyledText fontSize={12} fontWeight="800" color={COLORS.goldDeep}>
                  {member.first_name[0]}
                  {member.last_name[0]}
                </StyledText>
              ) : (
                <Icon name="user" size={15} color={COLORS.inkSoft} />
              )}
            </StyledShape>
          </StyledPressable>
        </Stack>
      </Stack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.indigo} colors={[COLORS.indigo]} />
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

          {/* Single hero slot — an active notification always wins over
              the church banner, never both (see hasActiveNotification
              above). Same outer width/spacing either way, so swapping
              between them never shifts the rest of the page. */}
          {settingsLoading ? (
            <Stack height={200} alignItems="center" justifyContent="center">
              <Loader color={COLORS.indigo} />
            </Stack>
          ) : hasActiveNotification ? (
            <NotificationCard notification={settings?.notification} />
          ) : (
            <ChurchBanner settings={settings} />
          )}

          {/* Latest Sermon — one card only, never a list. Fully
              self-contained: hides itself for hasFeature("sermons")=false,
              no published sermon, or no valid YouTube URL. */}
          <LatestSermonCard sermon={latestSermon} />

          {/* Christian Articles — up to 4 latest published articles,
              horizontally scrolling. Fully self-contained: hides itself
              for hasFeature("articles")=false or zero published articles;
              see ArticlesSection.tsx. */}
          <ArticlesSection articles={latestArticles} isLoading={articlesLoading} />
        </Animated.View>

        <Animated.View style={bodyAnim}>
          {/* Welcome / pastor */}
          <Stack paddingHorizontal={H_PAD} marginBottom={26} gap={10}>
            <StyledText fontSize={16} fontWeight="800" color={COLORS.ink}>
              A word of welcome
            </StyledText>
            <Stack backgroundColor={COLORS.white} borderRadius={18} padding={18} style={SHADOW_SOFT}>
              <StyledText fontSize={14.5} color={COLORS.ink} style={{ fontStyle: "italic", lineHeight: 21 }}>
                “{pastor?.description ??
                  "Whatever season you're walking through, you don't have to walk through it alone. Come as you are — we'll believe with you for what's next."}”
              </StyledText>
              <StyledText fontSize={12.5} fontWeight="700" color={COLORS.inkSoft} style={{ marginTop: 12 }}>
                — {pastor ? `${pastor.first_name} ${pastor.last_name}` : "The pastoral team"}
              </StyledText>
            </Stack>
          </Stack>

          {/* Get involved */}
          {waysToBelong.length > 0 && (
            <Stack paddingHorizontal={H_PAD} marginBottom={26} gap={10}>
              <StyledText fontSize={16} fontWeight="800" color={COLORS.ink}>
                Ways to belong
              </StyledText>
              {waysToBelong.map((item) => (
                <StyledPressable key={item.title} onPress={() => router.push(item.route as any)}>
                  <Stack horizontal alignItems="center" gap={14} backgroundColor={COLORS.white} borderRadius={16} padding={14} style={SHADOW_SOFT}>
                    <StyledShape size={40} cycle backgroundColor={COLORS.chrome}>
                      <Icon name={item.icon as any} size={17} color={COLORS.ink} />
                    </StyledShape>
                    <Stack flex={1} gap={2}>
                      <StyledText fontSize={14} fontWeight="700" color={COLORS.ink}>
                        {item.title}
                      </StyledText>
                      <StyledText fontSize={12} color={COLORS.inkSoft}>
                        {item.desc}
                      </StyledText>
                    </Stack>
                    <Icon name="chevron-right" size={17} color={COLORS.inkSoft} />
                  </Stack>
                </StyledPressable>
              ))}
            </Stack>
          )}

          {/* Service times summary */}
          {hasFeature("service-times") && services && services.length > 0 && (
            <Stack paddingHorizontal={H_PAD} gap={10}>
              <StyledText fontSize={16} fontWeight="800" color={COLORS.ink}>
                This week
              </StyledText>
              <Stack horizontal flexWrap="wrap" gap={8}>
                {services.map((s, i) => (
                  <Stack key={s._id ?? i} backgroundColor={COLORS.white} borderRadius={999} paddingHorizontal={14} paddingVertical={9} style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}>
                    <StyledText fontSize={12} fontWeight="700" color={COLORS.ink}>
                      {s.title} · {s.start_time}
                    </StyledText>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}
        </Animated.View>
      </ScrollView>

      <BottomTabBar active="home" />
    </StyledPage>
  );
}
