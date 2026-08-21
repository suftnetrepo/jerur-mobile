import { Feather as Icon } from "@expo/vector-icons";
import {
  Stack,
  StyledPressable,
} from "fluent-styles";
import { Text } from "./text";
import { COLORS } from "../theme/colors";
import { SHADOW_CARD } from "../theme/shadows";

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
      backgroundColor={COLORS.white}
      borderRadius={24}
      padding={6}
      style={{
        borderWidth: 1,
        borderColor: COLORS.chromeBorder,
        ...SHADOW_CARD,
      }}
    >
      <ToolbarIcon
        icon="chevron-left"
        disabled={!canGoPrevious}
        onPress={onPrevious}
        accessibilityLabel="Previous chapter"
      />

      <StyledPressable
        onPress={onOpenChapterSelector}
        flex={1}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap={6}
        marginHorizontal={4}
        paddingHorizontal={10}
        paddingVertical={11}
        borderRadius={16}
        backgroundColor={COLORS.goldPale}
        accessibilityRole="button"
        accessibilityLabel={`Select chapter, currently ${chapterLabel}`}
      >
        <Text
          variant="button"
          fontSize={13}
          fontWeight="800"
          color={COLORS.goldDeep}
          numberOfLines={1}
        >
          {chapterLabel}
        </Text>

        <Icon
          name="chevron-down"
          size={14}
          color={COLORS.goldDeep}
        />
      </StyledPressable>

      <ToolbarIcon
        icon="type"
        onPress={onOpenFontSize}
        accessibilityLabel="Font size"
      />

      <ToolbarIcon
        icon="share-2"
        onPress={onShare}
        accessibilityLabel="Share chapter"
      />

      <ToolbarIcon
        icon="chevron-right"
        disabled={!canGoNext}
        onPress={onNext}
        accessibilityLabel="Next chapter"
      />
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
      width={42}
      height={42}
      borderRadius={15}
      alignItems="center"
      justifyContent="center"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      style={{
        opacity: disabled ? 0.28 : 1,
      }}
    >
      <Icon
        name={icon as any}
        size={19}
        color={COLORS.ink}
      />
    </StyledPressable>
  );
}