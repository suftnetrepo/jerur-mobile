import { TextInput } from "react-native";
import { StyledTextInput, Stack } from "fluent-styles";
import { COLORS } from "../theme/colors";

/**
 * The note editor's two fields, shared between Create and Edit. Title
 * uses the app's StyledTextInput (consistent chrome with every other
 * input in the app); content is a plain RN TextInput — deliberately, so
 * the large writing area gets exact control over line height/top
 * alignment/flex growth rather than whatever a generic input's default
 * text styling happens to be. No rich-text editor, per the migration plan
 * — plain multiline text is the whole editor.
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
    <Stack flex={1} gap={6}>
      <StyledTextInput
        variant="ghost"
        size="lg"
        placeholder="Title (optional)"
        value={title}
        onChangeText={onTitleChange}
        maxLength={120}
        returnKeyType="next"
      />
      <TextInput
        placeholder="Start writing..."
        placeholderTextColor={COLORS.inkSoft}
        value={content}
        onChangeText={onContentChange}
        multiline
        textAlignVertical="top"
        style={{ flex: 1, fontSize: 16.5, lineHeight: 25, color: COLORS.ink, paddingTop: 12, paddingBottom: 24 }}
      />
    </Stack>
  );
}
