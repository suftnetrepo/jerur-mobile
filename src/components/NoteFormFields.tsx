import { useState } from "react";
import { TextInput } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledScrollView, StyledTextInput } from "fluent-styles";
import { Text } from "./text";
import { COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";

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
  const [titleFocused, setTitleFocused] = useState(false);
  const [contentFocused, setContentFocused] = useState(false);

  return (
    <Stack flex={1} gap={18}>
      {/* Document-style title */}
      <Stack gap={7}>
        <Stack backgroundColor={COLORS.white} borderRadius={18}>
          <StyledTextInput
            variant="outline"
            placeholder="Give your note a title"
            placeholderTextColor={COLORS.inkSoft}
            value={title}
            onChangeText={onTitleChange}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
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

        <StyledScrollView showsVerticalScrollIndicator={false}>
          <Stack borderRadius={22} overflow="hidden">
            <StyledTextInput
              variant="filled"
              placeholder="Start writing your thoughts, reflections or Bible notes…"
              placeholderTextColor={COLORS.inkSoft}
              value={content}
              onChangeText={onContentChange}
              onFocus={() => setContentFocused(true)}
              onBlur={() => setContentFocused(false)}
              multiline
              textAlignVertical="top"
              scrollEnabled
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
      </Stack>
    </Stack>
  );
}
