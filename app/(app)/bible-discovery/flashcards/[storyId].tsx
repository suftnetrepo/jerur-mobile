import { useRef, useState } from "react";
import { Animated, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { StyledPage, StyledPressable, Stack } from "fluent-styles";
import { AppBackHeader } from "../../../../src/components/AppBackHeader";
import { FeatureGate } from "../../../../src/components/FeatureGate";
import { ReaderFontSizePopup } from "../../../../src/components/ReaderFontSizePopup";
import { Text } from "../../../../src/components/text";
import { DiscoveryEmpty, DiscoveryFontSizeButton, ProgressBar } from "../../../../src/components/BibleDiscovery";
import { getDiscoveryStory } from "../../../../src/bible-discovery/data";
import { nextFlashcardIndex } from "../../../../src/bible-discovery/logic";
import { useDiscoveryProgress } from "../../../../src/bible-discovery/progress";
import { useReaderFontSize } from "../../../../src/bible/use-reader-font-size";
import { COLORS, isDarkTheme } from "../../../../src/theme/colors";
import { SHADOW_CARD } from "../../../../src/theme/shadows";

export default function FlashcardsScreen() { return <FeatureGate feature="bible-discovery"><Content /></FeatureGate>; }
function Content() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const story = getDiscoveryStory(storyId);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [fontSizePopupVisible, setFontSizePopupVisible] = useState(false);
  const flip = useRef(new Animated.Value(0)).current;
  const { completeFlashcards } = useDiscoveryProgress();
  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } = useReaderFontSize();
  const fontScale = fontSize / 19;

  if (!story) return <DiscoveryEmpty title="Flashcards unavailable" />;

  const card = story.flashcards[index];
  const last = index === story.flashcards.length - 1;
  const frontRotation = flip.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const backRotation = flip.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] });

  function toggleCard() {
    const nextRevealed = !revealed;
    setRevealed(nextRevealed);
    Animated.spring(flip, {
      toValue: nextRevealed ? 1 : 0,
      friction: 9,
      tension: 55,
      useNativeDriver: true,
    }).start();
  }

  function move(direction: 1 | -1) {
    flip.stopAnimation();
    flip.setValue(0);
    setIndex(nextFlashcardIndex(index, story!.flashcards.length, direction));
    setRevealed(false);
  }

  async function finish() {
    await completeFlashcards(story!.id);
    router.push(`/bible-discovery/quiz/${story!.id}` as never);
  }

  return <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paperSoft} statusBarStyle={isDarkTheme ? "light-content" : "dark-content"} statusBarBackgroundColor={Platform.OS === "android" ? COLORS.paperSoft : undefined}><AppBackHeader title="Flashcards" backgroundColor={COLORS.paperSoft} rightIcon={<DiscoveryFontSizeButton onPress={() => setFontSizePopupVisible(true)} />} /><Stack flex={1} padding={20} gap={20}><Stack gap={8}><Stack horizontal justifyContent="space-between"><Text fontSize={13 * fontScale} fontWeight="800" color={COLORS.indigo}>{story.title}</Text><Text fontSize={12 * fontScale} color={COLORS.inkSoft}>{index + 1} of {story.flashcards.length}</Text></Stack><ProgressBar percent={Math.round(((index + 1) / story.flashcards.length) * 100)} /></Stack><StyledPressable accessibilityRole="button" accessibilityLabel={revealed ? "Answer shown. Tap to show the question" : "Question shown. Tap to reveal the answer"} accessibilityState={{ expanded: revealed }} onPress={toggleCard} style={{ flex: 1, minHeight: 330 }}><Animated.View style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: [{ perspective: 1000 }, { rotateY: frontRotation }] }}><CardFace answer={false} text={card.front} reference={card.scriptureReference} fontScale={fontScale} /></Animated.View><Animated.View style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: [{ perspective: 1000 }, { rotateY: backRotation }] }}><CardFace answer text={card.back} reference={card.scriptureReference} fontScale={fontScale} /></Animated.View></StyledPressable><Stack horizontal gap={12}><ControlButton label="Previous" icon="arrow-left" disabled={index === 0} onPress={() => move(-1)} /><ControlButton label={last ? "Start quiz" : "Next"} icon="arrow-right" onPress={() => last ? void finish() : move(1)} primary /></Stack></Stack><ReaderFontSizePopup visible={fontSizePopupVisible} onClose={() => setFontSizePopupVisible(false)} fontSize={fontSize} canDecrease={canDecrease} canIncrease={canIncrease} onDecrease={decrease} onIncrease={increase} onReset={reset} /></StyledPage>;
}

function CardFace({ answer, text, reference, fontScale }: { answer: boolean; text: string; reference: string; fontScale: number }) {
  return <Stack flex={1} minHeight={330} padding={24} justifyContent="center" alignItems="center" gap={16} borderRadius={28} backgroundColor={answer ? COLORS.sageSoft : COLORS.white} borderWidth={1} borderColor={COLORS.chromeBorder} style={SHADOW_CARD}><Stack width={52} height={52} borderRadius={26} alignItems="center" justifyContent="center" backgroundColor={answer ? COLORS.goldPale : COLORS.paperAlt}><Feather name={answer ? "check" : "help-circle"} size={23} color={answer ? COLORS.goldDeep : COLORS.indigo} /></Stack><Text textAlign="center" fontSize={11 * fontScale} fontWeight="800" letterSpacing={1.1} color={COLORS.inkSoft}>{answer ? "ANSWER" : "QUESTION"}</Text><Text textAlign="center" fontSize={22 * fontScale} fontWeight="700" color={COLORS.ink} style={{ lineHeight: 33 * fontScale }}>{text}</Text><Text textAlign="center" fontSize={12 * fontScale} color={COLORS.indigo}>{reference}</Text><Text textAlign="center" fontSize={11.5 * fontScale} color={COLORS.inkSoftest}>{answer ? "Tap to see the question" : "Tap card to flip"}</Text></Stack>;
}
function ControlButton({ label, icon, disabled, primary, onPress }: { label: string; icon: string; disabled?: boolean; primary?: boolean; onPress: () => void }) { return <StyledPressable disabled={disabled} accessibilityLabel={label} onPress={onPress} style={{ flex: 1, opacity: disabled ? 0.4 : 1 }}><Stack horizontal minHeight={50} justifyContent="center" alignItems="center" gap={7} borderRadius={25} backgroundColor={primary ? COLORS.indigo : COLORS.paperAlt}><Text fontSize={13} fontWeight="800" color={primary ? COLORS.onPrimary : COLORS.ink}>{label}</Text><Feather name={icon as never} size={16} color={primary ? COLORS.onPrimary : COLORS.ink} /></Stack></StyledPressable>; }
