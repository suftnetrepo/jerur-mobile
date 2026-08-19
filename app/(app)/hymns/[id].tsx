import { useMemo, useState } from "react";
import { Share, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StyledPage, StyledScrollView, StyledText, Stack, StyledShape } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { HymnReaderToolbar } from "../../../src/components/HymnReaderToolbar";
import { ReaderFontSizePopup } from "../../../src/components/ReaderFontSizePopup";
import {
  getHymnById,
  getPreviousHymn,
  getNextHymn,
} from "../../../src/hymns/hymns-lookup";
import { formatHymnShareText } from "../../../src/hymns/share-text";
import { useReaderFontSize } from "../../../src/hymns/use-reader-font-size";
import { COLORS } from "../../../src/theme/colors";

const H_PAD = 24;

export default function HymnReaderScreen() {
  return (
    <FeatureGate feature="hymns">
      <HymnReaderScreenContent />
    </FeatureGate>
  );
}

function HymnReaderScreenContent() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const hymn = useMemo(() => getHymnById(id), [id]);
  const previousHymn = useMemo(() => getPreviousHymn(id), [id]);
  const nextHymn = useMemo(() => getNextHymn(id), [id]);

  const { fontSize, increase, decrease, reset, canIncrease, canDecrease } =
    useReaderFontSize();
  const [fontSizePopupVisible, setFontSizePopupVisible] = useState(false);

  function goToPrevious() {
    if (previousHymn) router.replace(`/hymns/${previousHymn.id}` as any);
  }
  function goToNext() {
    if (nextHymn) router.replace(`/hymns/${nextHymn.id}` as any);
  }
  function share() {
    if (!hymn) return;
    Share.share({ message: formatHymnShareText(hymn) });
  }

  if (!hymn) {
    return (
      <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
        <StyledPage.Header
          showBackArrow
          onBackPress={() => router.back()}
          title="Hymns"
          titleAlignment="center"
             rightIcon ={<StyledShape size={48}></StyledShape>}
        />
        <Stack
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={32}
        >
          <StyledText
            fontSize={14}
            color={COLORS.inkSoft}
            style={{ textAlign: "center" }}
          >
            That hymn couldn't be found.
          </StyledText>
        </Stack>
      </StyledPage>
    );
  }

  // Source lyrics use \r\n line endings; normalized here for rendering
  // only (see share-text.ts's comment) - no wording, punctuation, or
  // stanza content is altered.
  const lyrics = hymn.content.replace(/\r\n/g, "\n");

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header
        shapeProps={{
          cycle: true,
          size: 48,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.chromeBorder,
        }}
        marginHorizontal={16}
        title={`HYMN ${hymn.id}`}
        titleAlignment="center"
        showBackArrow
        onBackPress={() => router.back()}
        backgroundColor={COLORS.paper}
            rightIcon ={<StyledShape size={48}></StyledShape>}
      />

      <Stack paddingHorizontal={H_PAD} marginTop={8} paddingBottom={10}>
        <StyledText
          fontSize={24}
          fontWeight="800"
          color={COLORS.ink}
          style={{ lineHeight: 30 }}
        >
          {hymn.title}
        </StyledText>
      </Stack>

      <StyledScrollView
      showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: H_PAD, paddingBottom: 24 }}
      >
        {/* One flowing text block, not a card per stanza - the source
            data's blank lines between stanzas render as natural paragraph
            spacing once \r\n is normalized to \n. */}
        <Text
          style={{ fontSize, lineHeight: fontSize * 1.7, color: COLORS.ink }}
        >
          {lyrics}
        </Text>
      </StyledScrollView>

      <Stack paddingHorizontal={16} paddingBottom={16} paddingTop={8}>
        <HymnReaderToolbar
          canGoPrevious={!!previousHymn}
          canGoNext={!!nextHymn}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onOpenFontSize={() => setFontSizePopupVisible(true)}
          onShare={share}
        />
      </Stack>

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
