import { useEffect, useState } from "react";
import { Platform, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { StyledButton, StyledPage, StyledPressable, Stack } from "fluent-styles";
import { AppBackHeader } from "../../../../src/components/AppBackHeader";
import { FeatureGate } from "../../../../src/components/FeatureGate";
import { ReaderFontSizePopup } from "../../../../src/components/ReaderFontSizePopup";
import { Text } from "../../../../src/components/text";
import { DiscoveryArtwork, DiscoveryEmpty, EditorialCard, ProgressBar } from "../../../../src/components/BibleDiscovery";
import { STORY_ARTWORK } from "../../../../src/bible-discovery/assets";
import { getDiscoveryStory } from "../../../../src/bible-discovery/data";
import { storyPercent } from "../../../../src/bible-discovery/logic";
import { useDiscoveryProgress } from "../../../../src/bible-discovery/progress";
import { useReaderFontSize } from "../../../../src/bible/use-reader-font-size";
import { COLORS, isDarkTheme } from "../../../../src/theme/colors";

export default function StoryScreen() { return <FeatureGate feature="bible-discovery"><StoryContent /></FeatureGate>; }
function StoryContent() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>(); const story = getDiscoveryStory(storyId); const { progress, error, openStory, completeSection } = useDiscoveryProgress(); const [advisoryAccepted, setAdvisoryAccepted] = useState(false);
  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } = useReaderFontSize();
  const [fontSizePopupVisible, setFontSizePopupVisible] = useState(false);
  const readingSize = (base: number) => Math.round(base * (fontSize / 19) * 10) / 10;
  useEffect(() => { if (story) void openStory(story.id); }, [story?.id]);
  if (!story) return <DiscoveryEmpty title="Story unavailable" message="This Bible story could not be loaded." />;
  if (story.contentAdvisory && !advisoryAccepted) return <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paperSoft}><AppBackHeader title={story.title} backgroundColor={COLORS.paperSoft} /><Stack flex={1} padding={24} justifyContent="center" gap={16}><Stack width={52} height={52} borderRadius={26} alignItems="center" justifyContent="center" backgroundColor={COLORS.goldPale}><Feather name="info" size={22} color={COLORS.goldDeep} /></Stack><Text fontSize={24} fontWeight="800" color={COLORS.ink}>Before you continue</Text><Text fontSize={15} color={COLORS.inkSoft} style={{ lineHeight: 24 }}>{story.contentAdvisory}</Text><PrimaryButton label="Continue to story" onPress={() => setAdvisoryAccepted(true)} /></Stack></StyledPage>;
  const item = progress.stories[story.id];
  return <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paperSoft} statusBarStyle={isDarkTheme ? "light-content" : "dark-content"} statusBarBackgroundColor={Platform.OS === "android" ? COLORS.paperSoft : undefined}><AppBackHeader title="Story" backgroundColor={COLORS.paperSoft} rightIcon={<StyledButton icon compact backgroundColor={COLORS.goldPale} onPress={() => setFontSizePopupVisible(true)} accessibilityLabel="Change story text size"><Feather name="type" size={18} color={COLORS.goldDeep} /></StyledButton>} /><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 42 }}><Stack marginHorizontal={20} overflow="hidden" borderRadius={24}><DiscoveryArtwork source={STORY_ARTWORK[story.id]} height={230} /></Stack><Stack paddingHorizontal={20} paddingTop={20} gap={18}><Stack gap={7}><Text numberOfLines={2} ellipsizeMode="tail" fontSize={28} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 36, paddingVertical: 2, includeFontPadding: true }}>{story.title}</Text><Text fontSize={15} color={COLORS.inkSoft}>{story.subtitle}</Text><Text fontSize={12} fontWeight="700" color={COLORS.indigo}>{story.scriptureReferences.join(" · ")} · {story.estimatedMinutes} min</Text><ProgressBar percent={storyPercent(story, progress)} /></Stack>{error ? <Text accessibilityRole="alert" fontSize={12} color={COLORS.error}>{error}</Text> : null}<EditorialCard icon="book-open" title="The story"><Text fontSize={readingSize(14.5)} color={COLORS.ink} style={{ lineHeight: readingSize(24) }}>{story.introduction.summary}</Text><Text fontSize={readingSize(13.5)} color={COLORS.inkSoft} style={{ lineHeight: readingSize(22) }}>{story.introduction.context}</Text></EditorialCard>{story.storySections.map((section, index) => { const completed = item?.completedSectionIds.includes(section.id); return <Stack key={section.id} padding={19} gap={9} borderRadius={20} backgroundColor={COLORS.white} borderWidth={1} borderColor={completed ? COLORS.sage : COLORS.chromeBorder}><Stack horizontal alignItems="center" justifyContent="space-between"><Text fontSize={11} fontWeight="800" color={COLORS.indigo}>PART {index + 1}</Text>{completed ? <Feather name="check-circle" size={18} color={COLORS.sage} /> : null}</Stack><Text fontSize={readingSize(19)} fontWeight="800" color={COLORS.ink}>{section.title}</Text><Text fontSize={readingSize(14)} color={COLORS.inkSoft} style={{ lineHeight: readingSize(24) }}>{section.content}</Text><Text fontSize={readingSize(11.5)} fontWeight="700" color={COLORS.indigo}>{section.scriptureReference}</Text>{!completed ? <StyledPressable accessibilityLabel={`Mark ${section.title} complete`} onPress={() => void completeSection(story.id, section.id)}><Stack minHeight={44} alignItems="center" justifyContent="center" borderRadius={22} backgroundColor={COLORS.paperAlt}><Text fontSize={12.5} fontWeight="800" color={COLORS.indigo}>Mark section complete</Text></Stack></StyledPressable> : null}</Stack>; })}<EditorialCard icon="users" title="People and places"><PeopleAndPlaces people={story.keyPeople ?? []} places={story.keyLocations ?? []} readingSize={readingSize} /></EditorialCard><EditorialCard icon="star" title="Key lessons">{story.keyLessons.map((lesson) => <Stack key={lesson} horizontal gap={9}><Text color={COLORS.indigo}>•</Text><Text flex={1} fontSize={readingSize(13.5)} color={COLORS.inkSoft} style={{ lineHeight: readingSize(22) }}>{lesson}</Text></Stack>)}</EditorialCard><EditorialCard icon="message-circle" title="Reflect"><Text fontSize={readingSize(14)} color={COLORS.ink} style={{ lineHeight: readingSize(22) }}>{story.reflection.question}</Text><Text fontSize={readingSize(13)} color={COLORS.inkSoft} style={{ lineHeight: readingSize(21) }}>{story.reflection.prompt}</Text></EditorialCard>{story.prayerPrompt ? <EditorialCard icon="heart" title="Prayer"><Text fontSize={readingSize(14)} color={COLORS.inkSoft} style={{ lineHeight: readingSize(23) }}>{story.prayerPrompt}</Text></EditorialCard> : null}<PrimaryButton label="Continue to flashcards" onPress={() => router.push(`/bible-discovery/flashcards/${story.id}` as never)} /></Stack></ScrollView><ReaderFontSizePopup visible={fontSizePopupVisible} onClose={() => setFontSizePopupVisible(false)} fontSize={fontSize} canDecrease={canDecrease} canIncrease={canIncrease} onDecrease={decrease} onIncrease={increase} onReset={reset} /></StyledPage>;
}

function PeopleAndPlaces({ people, places, readingSize }: {
  people: Array<{ name: string; role: string }>;
  places: Array<{ name: string; description: string }>;
  readingSize: (base: number) => number;
}) {
  return <Stack gap={18}>
    {people.length ? <Stack gap={10}><SectionLabel icon="user" label="People" />{people.map((person) => <DetailBullet key={`${person.name}-${person.role}`} title={person.name} detail={person.role} readingSize={readingSize} />)}</Stack> : null}
    {places.length ? <Stack gap={10}><SectionLabel icon="map-pin" label="Places" />{places.map((place) => <DetailBullet key={`${place.name}-${place.description}`} title={place.name} detail={place.description} readingSize={readingSize} />)}</Stack> : null}
  </Stack>;
}

function SectionLabel({ icon, label }: { icon: "user" | "map-pin"; label: string }) {
  return <Stack horizontal alignItems="center" gap={7}><Feather name={icon} size={13} color={COLORS.indigo} /><Text fontSize={10.5} fontWeight="800" letterSpacing={1.2} color={COLORS.indigo}>{label.toUpperCase()}</Text></Stack>;
}

function DetailBullet({ title, detail, readingSize }: { title: string; detail: string; readingSize: (base: number) => number }) {
  return <Stack horizontal alignItems="flex-start" gap={12} padding={13} borderRadius={16} backgroundColor={COLORS.paperAlt} borderWidth={1} borderColor={COLORS.chromeBorder}><Stack marginTop={7} width={7} height={7} borderRadius={4} backgroundColor={COLORS.indigo} /><Stack flex={1} gap={3}><Text fontSize={readingSize(14)} fontWeight="800" color={COLORS.ink}>{title}</Text><Text fontSize={readingSize(13)} color={COLORS.inkSoft} style={{ lineHeight: readingSize(20) }}>{detail}</Text></Stack></Stack>;
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) { return <StyledPressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}><Stack minHeight={52} borderRadius={26} alignItems="center" justifyContent="center" backgroundColor={COLORS.indigo}><Text fontSize={14} fontWeight="800" color={COLORS.onPrimary}>{label} →</Text></Stack></StyledPressable>; }
