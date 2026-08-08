import { useState } from "react";
import { Animated, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Image } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledText, StyledShape, StyledPressable, Stack, Loader } from "fluent-styles";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import { PillActionRow, type PillAction } from "../../src/components/PillActionRow";
import { ChurchNotificationCard } from "../../src/components/ChurchNotificationCard";
import { ScalePressable } from "../../src/components/ScalePressable";
import { useFadeUp } from "../../src/hooks/useFadeUp";
import { SHADOW_SOFT, SHADOW_HERO } from "../../src/theme/shadows";
import { useSelectedChurch } from "../../src/church/SelectedChurchContext";
import { useMemberSession } from "../../src/member/MemberSessionContext";
import { useSettings, useRegularServices } from "../../src/hooks/useChurchData";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import { COLORS } from "../../src/theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const H_PAD = 20;
const CARD_WIDTH = SCREEN_WIDTH - H_PAD * 2;

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
  const { features, hasFeature } = useFeatureFlags();
  const [flyerIndex, setFlyerIndex] = useState(0);

  const headerAnim = useFadeUp(0);
  const bodyAnim = useFadeUp(140);

  const flyers = settings?.sliders?.length ? settings.sliders : [];
  const pastor = settings?.pastor_section;

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

  function onFlyerScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    setFlyerIndex(idx);
  }

  async function handleChangeChurch() {
    await changeChurch();
    router.replace("/select-church");
  }

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.chrome}>
      {/* Top chrome — hamburger / notifications / avatar, matches the
          Life.Church reference instead of a custom church-name pill */}
      <Stack horizontal alignItems="center" justifyContent="space-between" paddingHorizontal={H_PAD} paddingTop={12} paddingBottom={4}>
        <StyledPressable onPress={handleChangeChurch} accessibilityLabel="Switch church">
          <Icon name="menu" size={22} color={COLORS.ink} />
        </StyledPressable>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <Animated.View style={headerAnim}>
          <Stack paddingHorizontal={H_PAD} marginTop={10} marginBottom={18}>
            <StyledText fontSize={26} fontWeight="800" color={COLORS.ink}>
              {church?.name ?? "Your church"}
            </StyledText>
            <StyledText fontSize={13} color={COLORS.inkSoft}>
              Welcome — glad you're here.
            </StyledText>
          </Stack>

          {/* Flyer hero — full-bleed image, gradient scrim, bold overlay title */}
          {settingsLoading ? (
            <Stack height={200} alignItems="center" justifyContent="center">
              <Loader color={COLORS.indigo} />
            </Stack>
          ) : flyers.length > 0 ? (
            <Stack paddingHorizontal={H_PAD} marginBottom={22}>
              <ScrollView
                horizontal
                pagingEnabled
                snapToInterval={CARD_WIDTH}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onFlyerScroll}
              >
                {flyers.map((flyer, i) => (
                  <ScalePressable
                    key={flyer._id ?? i}
                    onPress={() => {}}
                    style={{ width: CARD_WIDTH, height: 210, borderRadius: 22, overflow: "hidden", ...SHADOW_HERO }}
                  >
                    <Image source={{ uri: flyer.secure_url }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    {!flyer.imageOnly && (
                      <>
                        <Svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
                          <Defs>
                            <LinearGradient id="flyerFade" x1="0" y1="1" x2="0" y2="0.25">
                              <Stop offset="0" stopColor="#0C0A09" stopOpacity={0.88} />
                              <Stop offset="1" stopColor="#0C0A09" stopOpacity={0} />
                            </LinearGradient>
                          </Defs>
                          <Rect width="100%" height="100%" fill="url(#flyerFade)" />
                        </Svg>
                        <Stack position="absolute" bottom={0} left={0} right={0} padding={18}>
                          <StyledText fontSize={11} fontWeight="700" letterSpacing={0.8} color={COLORS.gold} style={{ textTransform: "uppercase", marginBottom: 4 }}>
                            {flyer.title}
                          </StyledText>
                          <StyledText fontSize={16} fontWeight="800" color={COLORS.white} numberOfLines={2}>
                            {flyer.message}
                          </StyledText>
                        </Stack>
                      </>
                    )}
                  </ScalePressable>
                ))}
              </ScrollView>
              <Stack horizontal justifyContent="center" alignItems="center" gap={6} marginTop={10}>
                {flyers.map((_, i) => (
                  <Stack key={i} width={i === flyerIndex ? 20 : 6} height={6} borderRadius={3} backgroundColor={i === flyerIndex ? COLORS.gold : COLORS.chromeBorder} />
                ))}
              </Stack>
            </Stack>
          ) : null}

          {/* Quick actions — horizontal pill row, one per enabled feature */}
          {quickActions.length > 0 && (
            <Stack marginBottom={20}>
              <PillActionRow actions={quickActions} />
            </Stack>
          )}

          {/* Church notification — replaces the old hardcoded Giving promo
              card. Fully self-contained: reads settings, checks the
              "notifications" feature flag and expiry itself, and renders
              nothing (not even empty spacing) when there's no active
              notification to show. */}
          <ChurchNotificationCard />
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
