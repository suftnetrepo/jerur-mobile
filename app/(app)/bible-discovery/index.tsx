import { useMemo } from "react";
import { Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { StyledPage, StyledPressable, Stack } from "fluent-styles";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { Text } from "../../../src/components/text";
import {
  DiscoveryArtwork,
  DiscoveryCollectionCard,
  DiscoveryProgressRing,
  DiscoveryStoryCard,
  ProgressBar,
} from "../../../src/components/BibleDiscovery";
import { STORY_ARTWORK } from "../../../src/bible-discovery/assets";
import {
  DISCOVERY_COLLECTIONS,
  DISCOVERY_STORIES,
  getDiscoveryStory,
  getStoriesForCollection,
} from "../../../src/bible-discovery/data";
import {
  overallPercent,
  storyPercent,
} from "../../../src/bible-discovery/logic";
import { useDiscoveryProgress } from "../../../src/bible-discovery/progress";
import { COLORS, isDarkTheme } from "../../../src/theme/colors";
import { SHADOW_CARD } from "../../../src/theme/shadows";

export default function BibleDiscoveryScreen() {
  return (
    <FeatureGate feature="bible-discovery">
      <DiscoveryHome />
    </FeatureGate>
  );
}

function DiscoveryHome() {
  const { progress, error } = useDiscoveryProgress();
  const featured =
    getDiscoveryStory(progress.lastStoryId) ??
    DISCOVERY_STORIES.find((story) => story.featured) ??
    DISCOVERY_STORIES[0];
  const percent = overallPercent(DISCOVERY_STORIES, progress);
  const continueStories = DISCOVERY_STORIES.filter(
    (story) =>
      storyPercent(story, progress) > 0 &&
      storyPercent(story, progress) < 100 &&
      story.id !== featured.id,
  );
  const challengeStory = useMemo(
    () => DISCOVERY_STORIES[new Date().getDate() % DISCOVERY_STORIES.length],
    [],
  );
  return (
    <StyledPage
      showStatusBar
      flex={1}
      backgroundColor={COLORS.paperSoft}
      statusBarStyle={isDarkTheme ? "light-content" : "dark-content"}
      statusBarBackgroundColor={
        Platform.OS === "android" ? COLORS.paperSoft : undefined
      }
    >
      <AppBackHeader
        title="Bible Discovery"
        backgroundColor={COLORS.paperSoft}
        rightIcon=<DiscoveryProgressRing percent={percent} />
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 42,
          marginTop: 16,
        }}
      >
        <StyledPressable
          accessibilityRole="button"
          accessibilityLabel={`Continue ${featured.title}`}
          onPress={() =>
            router.push(`/bible-discovery/story/${featured.id}` as never)
          }
          style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
        >
          <Stack
            overflow="hidden"
            borderRadius={22}
            backgroundColor={COLORS.white}
            borderWidth={1}
            borderColor={COLORS.border}
            style={SHADOW_CARD}
          >
            <DiscoveryArtwork
              source={STORY_ARTWORK[featured.id]}
              height={220}
            />
            <Stack
              paddingHorizontal={20}
              paddingTop={16}
              paddingBottom={17}
              gap={5}
            >
              <Text
                variant="overline"
                fontSize={10.5}
                fontWeight="800"
                letterSpacing={1.2}
                color={COLORS.indigo}
              >
                CONTINUE YOUR JOURNEY
              </Text>
              <Text fontSize={23} fontWeight="800" color={COLORS.ink}>
                {featured.title}
              </Text>
              <Text fontSize={13} color={COLORS.inkSoft}>
                {featured.subtitle} · {featured.estimatedMinutes} min
              </Text>
              <ProgressBar percent={storyPercent(featured, progress)} />
              <Stack horizontal alignItems="center" gap={7} marginTop={2}>
                <Text fontSize={13} fontWeight="800" color={COLORS.indigo}>
                  Continue
                </Text>
                <Feather name="arrow-right" size={16} color={COLORS.indigo} />
              </Stack>
            </Stack>
          </Stack>
        </StyledPressable>
        {error ? (
          <Text
            accessibilityRole="alert"
            marginTop={10}
            fontSize={12}
            color={COLORS.error}
          >
            {error}
          </Text>
        ) : null}
        <SectionHeader
          title="Discover by collection"
          action="View all"
          onPress={() => router.push("/bible-discovery/collections")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
        >
          {DISCOVERY_COLLECTIONS.map((collection) => (
            <DiscoveryCollectionCard
              key={collection.id}
              collection={collection}
              storyCount={getStoriesForCollection(collection.id).length}
              onPress={() =>
                router.push(
                  `/bible-discovery/collection/${collection.id}` as never,
                )
              }
            />
          ))}
        </ScrollView>
        <Stack
          marginTop={24}
          padding={19}
          borderRadius={22}
          backgroundColor={COLORS.sageSoft}
          borderWidth={1}
          borderColor={COLORS.border}
          gap={13}
        >
          <Stack horizontal alignItems="center" gap={12}>
            <Stack
              width={46}
              height={46}
              borderRadius={23}
              alignItems="center"
              justifyContent="center"
              backgroundColor={COLORS.goldPale}
            >
              <Feather name="award" size={22} color={COLORS.goldDeep} />
            </Stack>
            <Stack flex={1}>
              <Text fontSize={18} fontWeight="800" color={COLORS.ink}>
                Today&apos;s Bible Challenge
              </Text>
              <Text fontSize={12.5} color={COLORS.inkSoft}>
                {challengeStory.quiz.length} questions · About 2 minutes
              </Text>
            </Stack>
          </Stack>
          <StyledPressable
            accessibilityLabel="Start today's Bible challenge"
            onPress={() =>
              router.push(`/bible-discovery/quiz/${challengeStory.id}` as never)
            }
          >
            <Stack
              minHeight={46}
              borderRadius={23}
              alignItems="center"
              justifyContent="center"
              backgroundColor={COLORS.indigo}
            >
              <Text fontSize={13} fontWeight="800" color={COLORS.onPrimary}>
                Start challenge →
              </Text>
            </Stack>
          </StyledPressable>
        </Stack>
        {continueStories.length ? (
          <>
            <SectionHeader title="Continue learning" />
            <DiscoveryStoryCard
              story={continueStories[0]}
              percent={storyPercent(continueStories[0], progress)}
              compact
              onPress={() =>
                router.push(
                  `/bible-discovery/story/${continueStories[0].id}` as never,
                )
              }
            />
          </>
        ) : null}
      </ScrollView>
    </StyledPage>
  );
}

function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <Stack
      horizontal
      alignItems="center"
      justifyContent="space-between"
      marginTop={16}
      marginBottom={13}
    >
      <Text variant="body" color={COLORS.inkSoftest}>
        {title}
      </Text>
      {action && onPress ? (
        <StyledPressable onPress={onPress} accessibilityLabel={action}>
          <Stack minHeight={44} justifyContent="center">
            <Text fontSize={13} fontWeight="800" color={COLORS.indigo}>
              {action} →
            </Text>
          </Stack>
        </StyledPressable>
      ) : null}
    </Stack>
  );
}
