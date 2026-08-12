import { memo } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledShape } from "fluent-styles";
import { ScalePressable } from "./ScalePressable";
import { COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";
import type { HymnSummary } from "../hymns/types";

/**
 * A compact, premium row for one hymn — number badge, title, chevron.
 * Wrapped in React.memo since this renders inside a 694-row FlatList: a
 * row should only re-render when its own hymn/tone/onPress actually
 * change, not whenever the list's search query state changes elsewhere.
 */
function HymnRowComponent({ hymn, tone, onPress }: { hymn: HymnSummary; tone: { bg: string; fg: string }; onPress: () => void }) {
  return (
    <ScalePressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Hymn ${hymn.id}, ${hymn.title}`}>
      <Stack
        horizontal
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={COLORS.white}
        borderRadius={8}
        paddingHorizontal={14}
        paddingVertical={12}
      
      >
        <Stack horizontal alignItems="center" gap={12} flex={1}>
          <StyledShape size={44} cycle backgroundColor={tone.bg} alignItems="center" justifyContent="center" flexShrink={0}>
            <StyledText fontSize={12.5} fontWeight="800" color={tone.fg}>
              {hymn.id}
            </StyledText>
          </StyledShape>
          <Stack gap={2} flex={1}>
            <StyledText fontSize={14.5} fontWeight="700" color={COLORS.ink} style={{ lineHeight: 20 }}>
              {hymn.title}
            </StyledText>
            <StyledText fontSize={12} color={COLORS.inkSoft}>
              Hymn / Worship
            </StyledText>
          </Stack>
        </Stack>
        <Icon name="chevron-right" size={17} color={COLORS.inkSoft} style={{ marginLeft: 8 }} />
      </Stack>
    </ScalePressable>
  );
}

export const HymnRow = memo(HymnRowComponent);
