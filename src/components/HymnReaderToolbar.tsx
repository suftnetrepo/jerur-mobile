import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledPressable } from "fluent-styles";
import { COLORS } from "../theme/colors";
import { SHADOW_CARD } from "../theme/shadows";

/** Compact bottom toolbar for the hymn reader: prev/next hymn, font size, share. Visually consistent with BibleReaderToolbar, without the chapter-jump pill Bible needs and Hymns doesn't. */
export function HymnReaderToolbar({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onOpenFontSize,
  onShare,
}: {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onOpenFontSize: () => void;
  onShare: () => void;
}) {
  return (
    <Stack
      horizontal
      alignItems="center"
      justifyContent="space-around"
      backgroundColor={COLORS.white}
      borderRadius={20}
      paddingHorizontal={8}
      paddingVertical={8}
      style={SHADOW_CARD}
    >
      <ToolbarIcon icon="chevron-left" disabled={!canGoPrevious} onPress={onPrevious} accessibilityLabel="Previous hymn" />
      <ToolbarIcon icon="type" onPress={onOpenFontSize} accessibilityLabel="Font size" />
      <ToolbarIcon icon="share-2" onPress={onShare} accessibilityLabel="Share hymn" />
      <ToolbarIcon icon="chevron-right" disabled={!canGoNext} onPress={onNext} accessibilityLabel="Next hymn" />
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
      width={44}
      height={44}
      borderRadius={12}
      alignItems="center"
      justifyContent="center"
      backgroundColor={disabled ? "transparent" : COLORS.chrome}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
    >
      <Icon name={icon as any} size={19} color={disabled ? COLORS.chromeBorder : COLORS.ink} />
    </StyledPressable>
  );
}
