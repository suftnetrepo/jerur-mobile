import { memo } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText } from "fluent-styles";
import { ScalePressable } from "./ScalePressable";
import { COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";
import { getDisplayTitle, getContentPreview, formatNoteDate, formatNoteTime } from "../notes/display";
import type { Note } from "../notes/types";

/**
 * A premium library card — title (or "Untitled Note"), a short preview,
 * the last-updated date/time, and a Bible Note indicator when applicable.
 * Never renders the full note content. `accentColor` is a thin left-edge
 * bar (cycled per row by the caller) purely for visual rhythm across the
 * list — same idea as the tone-cycling already used on Bible/Hymns rows.
 */
function NoteCardComponent({ note, accentColor, onPress }: { note: Note; accentColor?: string; onPress: () => void }) {
  return (
    <ScalePressable onPress={onPress} accessibilityRole="button" accessibilityLabel={getDisplayTitle(note)}>
      <Stack
        backgroundColor={COLORS.white}
        borderRadius={20}
        padding={16}
        gap={10}
        style={{
          ...SHADOW_SOFT,
          borderLeftWidth: accentColor ? 3 : 0,
          borderLeftColor: accentColor ?? "transparent",
        }}
      >
        <Stack horizontal alignItems="flex-start" justifyContent="space-between" gap={10}>
          <Stack flex={1} gap={4}>
            <StyledText fontSize={15.5} fontWeight="800" color={COLORS.ink} numberOfLines={1}>
              {getDisplayTitle(note)}
            </StyledText>
            <StyledText fontSize={13} color={COLORS.inkSoft} numberOfLines={2} style={{ lineHeight: 18 }}>
              {getContentPreview(note.content)}
            </StyledText>
          </Stack>
          {note.isMarked && (
            <Stack
              horizontal
              alignItems="center"
              gap={4}
              paddingHorizontal={9}
              paddingVertical={4}
              borderRadius={20}
              backgroundColor={COLORS.goldPale}
              flexShrink={0}
            >
              <Icon name="book" size={11} color={COLORS.goldDeep} />
              <StyledText fontSize={10.5} fontWeight="700" color={COLORS.goldDeep}>
                Bible Note
              </StyledText>
            </Stack>
          )}
        </Stack>
        <Stack horizontal alignItems="center" justifyContent="space-between">
          <StyledText fontSize={11.5} color={COLORS.inkSoft}>
            {formatNoteDate(note.updatedAt)} · Updated {formatNoteTime(note.updatedAt)}
          </StyledText>
          <Icon name="chevron-right" size={16} color={COLORS.inkSoft} />
        </Stack>
      </Stack>
    </ScalePressable>
  );
}

export const NoteCard = memo(NoteCardComponent);
