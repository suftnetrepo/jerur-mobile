import { TextInput } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledPressable, StyledScrollView, StyledTextInput } from "fluent-styles";
import { useState } from "react";
import { Text } from "./text";
import { COLORS, FORM_FIELD_COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";

export function NoteFormFields({
  title,
  onTitleChange,
  content,
  onContentChange,
  onContentCommit,
}: {
  title: string;
  onTitleChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  onContentCommit?: (value: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");
  const [committing, setCommitting] = useState(false);

  async function appendDraft(startNewLine = false) {
    if (committing) return;
    const nextEntry = draft.trim();
    if (!nextEntry && !startNewLine) return;

    if (!nextEntry) {
      if (!content || content.endsWith("\n")) return;
      const nextContent = `${content}\n`;
      onContentChange(nextContent);
      setCommitting(true);
      try {
        await onContentCommit?.(nextContent);
      } catch {
        onContentChange(content);
      } finally {
        setCommitting(false);
      }
      return;
    }

    const separator = content && !/\s$/.test(content) ? " " : "";
    const nextContent = `${content}${separator}${nextEntry}${startNewLine ? "\n" : ""}`;
    onContentChange(nextContent);
    setCommitting(true);
    try {
      await onContentCommit?.(nextContent);
      setDraft("");
    } catch {
      onContentChange(content);
    } finally {
      setCommitting(false);
    }
  }

  return (
    <Stack flex={1} gap={18}>
      {/* Document-style title */}
      <Stack gap={7}>
        <Stack backgroundColor={COLORS.white} borderRadius={18}>
          <StyledTextInput
            colors={FORM_FIELD_COLORS}
            variant="outline"
            placeholder="Give your note a title"
            placeholderTextColor={COLORS.inkSoft}
            value={title}
            onChangeText={onTitleChange}
            maxLength={120}
            returnKeyType="next"
          />
        </Stack>
      </Stack>

      {/* Premium writing surface */}
      <Stack flex={1} gap={7}>
        <Stack
          horizontal
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal={4}
          marginBottom={4}
        >
          <Text
            variant="overline"
            fontSize={10.5}
            fontWeight="800"
            letterSpacing={0.8}
            color={COLORS.inkSoft}
          >
            Note
          </Text>

          <Stack horizontal alignItems="center" gap={5}>
            <Icon name="edit-3" size={11} color={COLORS.goldDeep} />
            <Text
              variant="subLabel"
              fontSize={10.5}
              fontWeight="700"
              color={COLORS.goldDeep}
            >
              Writing
            </Text>
          </Stack>
        </Stack>

        <StyledScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Stack borderRadius={22} overflow="hidden">
            <StyledTextInput
              colors={{ ...FORM_FIELD_COLORS, text: COLORS.ink }}
              variant="filled"
              placeholder="Start writing your thoughts, reflections or Bible notes…"
              placeholderTextColor={COLORS.inkSoft}
              value={content}
              onChangeText={onContentChange}
              multiline
              textAlignVertical="top"
              scrollEnabled
              inputStyle={{
                minHeight: 220,
                paddingHorizontal: 18,
                paddingVertical: 16,
                color: COLORS.ink,
                fontSize: 14,
                lineHeight: 21,
              }}
            />

            <Stack
              horizontal
              alignItems="center"
              justifyContent="flex-end"
              paddingHorizontal={16}
              paddingVertical={10}
            >
              <Text variant="caption" fontSize={10.5} color={COLORS.inkSoft}>
                {content.length} character{content.length === 1 ? "" : "s"}
              </Text>
            </Stack>
          </Stack>
        </StyledScrollView>

        {/* Android-safe quick composer. Entries are appended to the editable
            note body above, keeping the control visible while the keyboard is open. */}
        <Stack
          horizontal
          alignItems="flex-end"
          gap={10}
          padding={8}
          borderRadius={20}
          backgroundColor={COLORS.paperAlt}
          style={{ borderWidth: 1, borderColor: COLORS.chromeBorder, ...SHADOW_SOFT }}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Add to your note…"
            placeholderTextColor={COLORS.inkSoftest}
            multiline
            textAlignVertical="center"
            maxLength={2000}
            selectionColor={COLORS.gold}
            style={{
              flex: 1,
              minHeight: 42,
              maxHeight: 112,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: COLORS.ink,
              fontSize: 14,
              lineHeight: 20,
            }}
          />
          <StyledPressable
            onPress={() => appendDraft(true)}
            disabled={committing || (!draft.trim() && (!content || content.endsWith("\n")))}
            width={42}
            height={42}
            borderRadius={21}
            alignItems="center"
            justifyContent="center"
            backgroundColor={COLORS.goldPale}
            accessibilityRole="button"
            accessibilityLabel="Add a new line"
            accessibilityState={{ disabled: committing || (!draft.trim() && (!content || content.endsWith("\n"))) }}
          >
            <Icon name="corner-down-left" size={17} color={COLORS.goldDeep} />
          </StyledPressable>
          <StyledPressable
            onPress={() => appendDraft(false)}
            disabled={committing || !draft.trim()}
            width={42}
            height={42}
            borderRadius={21}
            alignItems="center"
            justifyContent="center"
            backgroundColor={draft.trim() ? COLORS.indigoDeep : COLORS.chrome}
            accessibilityRole="button"
            accessibilityLabel="Add text to note"
            accessibilityState={{ disabled: committing || !draft.trim() }}
          >
            <Icon name="arrow-up" size={18} color={draft.trim() ? COLORS.onPrimary : COLORS.inkSoftest} />
          </StyledPressable>
        </Stack>
      </Stack>
    </Stack>
  );
}
