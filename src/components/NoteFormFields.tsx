import { TextInput } from "react-native";
import { StyledText, Stack } from "fluent-styles";
import { COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";

/**
 * The note editor's two fields, shared between Create and Edit — a single
 * editable body, whether the member typed it or it grew from Bible verses
 * appended via appendToMarkedNote() (see src/notes/marked-note.ts). There
 * is no separate read-only verse block anywhere: everything in `content`
 * is plain text in this one TextInput.
 *
 * Both fields use plain RN TextInput in explicitly bordered/boxed
 * containers (not fluent-styles' StyledTextInput) so their height is
 * fully predictable — an earlier version used StyledTextInput's `ghost`
 * variant for the title, whose internal spacing left a large dead gap
 * above the note body that made the editor read as two disconnected
 * zones instead of one note.
 */
export function NoteFormFields({
  title,
  onTitleChange,
  content,
  onContentChange,
}: {
  title: string;
  onTitleChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
}) {
  return (
    <Stack flex={1} gap={16}>
      <Stack gap={6}>
        <StyledText paddingHorizontal={16} fontSize={11} fontWeight="700" letterSpacing={0.5} color={COLORS.inkSoft} >
          Title (Optional)
        </StyledText>
        <TextInput
          placeholder="Sunday Service Notes"
          placeholderTextColor={COLORS.inkSoft}
          value={title}
          onChangeText={onTitleChange}
          maxLength={120}
          returnKeyType="next"
          style={{
            fontSize: 16.5,
            fontWeight: "700",
            color: COLORS.ink,
            backgroundColor: COLORS.white,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.paperAlt,
            paddingHorizontal: 16,
            paddingVertical: 13,
          }}
        />
      </Stack>

      <Stack flex={1} gap={6}>
        <StyledText paddingHorizontal={16} fontSize={11} fontWeight="700" letterSpacing={0.5} color={COLORS.inkSoft} >
          Note
        </StyledText>
        <Stack flex={1} backgroundColor={COLORS.white} borderRadius={16} style={{ borderWidth: 1, borderColor: COLORS.chromeBorder, ...SHADOW_SOFT }}>
          <TextInput
            placeholder="Start writing..."
            placeholderTextColor={COLORS.inkSoft}
            value={content}
            onChangeText={onContentChange}
            multiline
            textAlignVertical="top"
            style={{ flex: 1, fontSize: 16.5, lineHeight: 25, color: COLORS.ink, backgroundColor: COLORS.white,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.paperAlt,
            paddingHorizontal: 16,
            paddingVertical: 13 }}
          />
          <StyledText fontSize={11} color={COLORS.inkSoft} style={{ textAlign: "right", paddingHorizontal: 16, paddingBottom: 10 }}>
            {content.length} character{content.length === 1 ? "" : "s"}
          </StyledText>
        </Stack>
      </Stack>
    </Stack>
  );
}
