import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledPressable } from "fluent-styles";
import { COLORS } from "../theme/colors";
import { SHADOW_CARD } from "../theme/shadows";

/** Compact bottom toolbar for the verse reader: prev/next chapter (crossing book boundaries), a chapter-jump pill, font size, and share. */
export function BibleReaderToolbar({
  chapterLabel,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onOpenChapterSelector,
  onOpenFontSize,
  onShare,
}: {
  chapterLabel: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onOpenChapterSelector: () => void;
  onOpenFontSize: () => void;
  onShare: () => void;
}) {
  return (
    <Stack
      horizontal
      alignItems="center"
      justifyContent="space-between"
      backgroundColor={COLORS.white}
      borderRadius={20}
      paddingHorizontal={8}
      paddingVertical={8}
      style={SHADOW_CARD}
    >
      <ToolbarIcon icon="chevron-left" disabled={!canGoPrevious} onPress={onPrevious} accessibilityLabel="Previous chapter" />

      <StyledPressable
        onPress={onOpenChapterSelector}
        flexDirection="row"
        alignItems="center"
        gap={4}
        paddingHorizontal={12}
        paddingVertical={9}
        borderRadius={12}
        backgroundColor={COLORS.chrome}
        accessibilityRole="button"
        accessibilityLabel={`Select chapter, currently ${chapterLabel}`}
      >
        <StyledText fontSize={13} fontWeight="700" color={COLORS.ink}>
          {chapterLabel}
        </StyledText>
        <Icon name="chevron-down" size={14} color={COLORS.inkSoft} />
      </StyledPressable>

      <ToolbarIcon icon="type" onPress={onOpenFontSize} accessibilityLabel="Font size" />
      <ToolbarIcon icon="share-2" onPress={onShare} accessibilityLabel="Share chapter" />
      <ToolbarIcon icon="chevron-right" disabled={!canGoNext} onPress={onNext} accessibilityLabel="Next chapter" />
    </Stack>
  );
}

function ToolbarIcon({
  icon,
  onPress,
  disabled,
  accessibilityLabel,
}: {
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
}) {
  return (
    <StyledPressable
      onPress={disabled ? undefined : onPress}
      width={40}
      height={40}
      borderRadius={12}
      alignItems="center"
      justifyContent="center"
      backgroundColor={disabled ? "transparent" : COLORS.chrome}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
    >
      <Icon name={icon as any} size={18} color={disabled ? COLORS.chromeBorder : COLORS.ink} />
    </StyledPressable>
  );
}
