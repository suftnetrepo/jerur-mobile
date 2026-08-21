import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledPressable } from "fluent-styles";
import { Text } from "./text";
import { COLORS } from "../theme/colors";
import { SHADOW_CARD } from "../theme/shadows";

/**
 * Contextual bar that replaces BibleReaderToolbar while a verse selection
 * is active. "Add to Note" always calls onAddToNote — the caller decides
 * what that means (append to the marked note, or a toast if none is
 * marked; see bible/[bookNumber]/[chapter].tsx) so this component stays
 * free of any Notes-domain knowledge.
 */
export function BibleVerseSelectionBar({
  referenceLabel,
  onShare,
  onAddToNote,
  onClear,
}: {
  referenceLabel: string;
  onShare: () => void;
  onAddToNote: () => void;
  onClear: () => void;
}) {
  return (
    <Stack
      horizontal
      alignItems="center"
      justifyContent="space-between"
      backgroundColor={COLORS.indigo}
      borderRadius={20}
      paddingHorizontal={12}
      paddingVertical={9}
      style={SHADOW_CARD}
    >
      <Stack horizontal alignItems="center" gap={8} flex={1}>
        <StyledPressable
          onPress={onClear}
          width={28}
          height={28}
          borderRadius={14}
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(255,255,255,0.14)"
          accessibilityRole="button"
          accessibilityLabel="Clear selection"
        >
          <Icon name="x" size={15} color={COLORS.white} />
        </StyledPressable>
        <Text variant="button" fontSize={13} color={COLORS.white} numberOfLines={1} style={{ flexShrink: 1 }}>
          {referenceLabel}
        </Text>
      </Stack>
      <Stack horizontal alignItems="center" gap={6}>
        <ActionButton icon="edit-3" label="Note" onPress={onAddToNote} />
        <ActionButton icon="share-2" label="Share" onPress={onShare} />
      </Stack>
    </Stack>
  );
}

function ActionButton({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <StyledPressable
      onPress={onPress}
      flexDirection="row"
      alignItems="center"
      gap={6}
      paddingHorizontal={12}
      paddingVertical={8}
      borderRadius={12}
      backgroundColor="rgba(255,255,255,0.14)"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon name={icon as any} size={14} color={COLORS.white} />
      <Text variant="button" fontSize={12.5} color={COLORS.white}>
        {label}
      </Text>
    </StyledPressable>
  );
}
