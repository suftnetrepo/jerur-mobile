import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Image, ScrollView } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText } from "fluent-styles";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { router } from "expo-router";
import { ScalePressable } from "./ScalePressable";
import { getFeatureById } from "../config/mobileFeatures";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { SHADOW_CARD } from "../theme/shadows";
import { COLORS } from "../theme/colors";
import { CARD_H_PAD, CARD_RADIUS } from "../theme/layout";
import type { Article } from "../api/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GAP = 16;
// Exactly matches LatestSermonCard's effective width — that card never
// declares a width of its own, it just fills whatever's left after its
// own paddingHorizontal={CARD_H_PAD} Stack. Deriving it the same way here
// (SCREEN_WIDTH minus the same padding on both sides, from the same
// shared constant) is what makes the two cards' left/right edges line up
// exactly, and keeps them in lockstep if CARD_H_PAD ever changes.
const CARD_WIDTH = SCREEN_WIDTH - CARD_H_PAD * 2;
const CARD_HEIGHT = 320;
const IMAGE_HEIGHT = 150;
const SKELETON_COUNT = 3;

// Reuses the exact accent already assigned to this feature in the shared
// catalogue (src/config/mobileFeatures.ts, mirrors jerur-next's
// constants/mobileFeatures.js) rather than inventing a new one — same
// visual identity everywhere "articles" shows up, admin portal included.
const ACCENT_COLOR = getFeatureById("articles")?.color ?? "#4F46E5";

// Cycled when an article has no secure_url, same reasoning/approach as
// ChurchResultCard's FALLBACK_GRADIENTS — a strip of placeholder cards
// shouldn't all look identical.
const FALLBACK_GRADIENTS = [
  ["#4F46E5", "#312E81"],
  ["#1B2340", "#12172A"],
  ["#8C6420", "#4F46E5"],
];

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Home screen's "Christian Articles" strip — up to 4 latest published
 * articles (see useLatestArticles/getLatestArticles), horizontally
 * scrolling like an App Store card row. Fully self-contained, same
 * "own your outer spacing, return null for zero footprint" pattern as
 * LatestSermonCard/ChurchBanner/NotificationCard: hides completely
 * (no title, no empty strip) when the "articles" feature is off or there
 * are no published articles — Home just hands over whatever
 * useLatestArticles() already returned (no fetching in here).
 */
export function ArticlesSection({
  articles,
  isLoading,
}: {
  articles: Article[] | null | undefined;
  isLoading: boolean;
}) {
  const { hasFeature } = useFeatureFlags();

  if (!hasFeature("articles")) return null;
  if (!isLoading && (!articles || articles.length === 0)) return null;

  const items = (articles ?? []).slice(0, 4);

  return (
    <Stack marginBottom={26}>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + GAP}
        snapToAlignment="start"
        contentContainerStyle={{ paddingHorizontal: CARD_H_PAD, gap: GAP }}
      >
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <ArticleCardSkeleton key={i} />)
          : items.map((article, i) => <ArticleCard key={article.id} article={article} index={i} />)}
      </ScrollView>
    </Stack>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 380,
      delay: index * 80,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // Mount-only, staggered by this card's position in the row.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [gradientFrom, gradientTo] = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
  const dateLabel = formatDate(article.publishedAt);

  function handlePress() {
    router.push({ pathname: "/article/[id]", params: { id: article.id } });
  }

  return (
    <Animated.View
      style={{ opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}
    >
      <ScalePressable
        onPress={handlePress}
        style={{ width: CARD_WIDTH }}
        accessibilityRole="button"
        accessibilityLabel={`Read article: ${article.title}`}
      >
        <Stack width={CARD_WIDTH} height={CARD_HEIGHT} backgroundColor={COLORS.white} borderRadius={CARD_RADIUS} overflow="hidden" style={SHADOW_CARD}>
          <Stack style={{ height: IMAGE_HEIGHT, overflow: "hidden" }}>
            {article.secure_url ? (
              <Image source={{ uri: article.secure_url }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            ) : (
              <Svg width="100%" height="100%">
                <Defs>
                  <LinearGradient id={`article-bg-${article.id}`} x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor={gradientFrom} />
                    <Stop offset="1" stopColor={gradientTo} />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill={`url(#article-bg-${article.id})`} />
              </Svg>
            )}
          </Stack>

          <Stack flex={1} padding={14} gap={5}>
            <StyledText fontSize={10.5} fontWeight="700" letterSpacing={0.8} color={ACCENT_COLOR} style={{ textTransform: "uppercase" }}>
              Article
            </StyledText>
            <StyledText fontSize={16} fontWeight="800" color={COLORS.ink} numberOfLines={2} style={{ lineHeight: 20 }}>
              {article.title}
            </StyledText>
            <StyledText fontSize={12.5} color={COLORS.inkSoft} numberOfLines={3} style={{ lineHeight: 17 }}>
              {article.summary}
            </StyledText>
            <Stack flex={1} />
            {dateLabel ? (
              <StyledText fontSize={11} color={COLORS.inkSoft}>
                {dateLabel}
              </StyledText>
            ) : null}
            <Stack horizontal alignItems="center" gap={5}>
              <StyledText fontSize={12.5} fontWeight="700" color={ACCENT_COLOR}>
                Read Article
              </StyledText>
              <Icon name="arrow-right" size={12} color={ACCENT_COLOR} />
            </Stack>
          </Stack>
        </Stack>
      </ScalePressable>
    </Animated.View>
  );
}

// Simple pulsing-opacity placeholder matching the final card's exact
// dimensions — no ActivityIndicator, per spec, and no layout shift once
// real cards swap in since the shape is identical.
function ArticleCardSkeleton() {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={{ opacity: pulse, width: CARD_WIDTH }}>
      <Stack width={CARD_WIDTH} height={CARD_HEIGHT} backgroundColor={COLORS.white} borderRadius={CARD_RADIUS} overflow="hidden" style={SHADOW_CARD}>
        <Stack backgroundColor={COLORS.chromeBorder} style={{ height: IMAGE_HEIGHT }} />
        <Stack flex={1} padding={14} gap={8}>
          <Stack width={60} height={10} borderRadius={4} backgroundColor={COLORS.chromeBorder} />
          <Stack width="90%" height={14} borderRadius={4} backgroundColor={COLORS.chromeBorder} />
          <Stack width="70%" height={14} borderRadius={4} backgroundColor={COLORS.chromeBorder} />
          <Stack gap={5} style={{ marginTop: 6 }}>
            <Stack width="100%" height={10} borderRadius={4} backgroundColor={COLORS.chromeBorder} />
            <Stack width="85%" height={10} borderRadius={4} backgroundColor={COLORS.chromeBorder} />
          </Stack>
        </Stack>
      </Stack>
    </Animated.View>
  );
}
