import { useState } from "react";
import { TextInput } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack } from "fluent-styles";
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
        <Text
          variant="overline"
          paddingHorizontal={4}
          fontSize={10.5}
          fontWeight="800"
          letterSpacing={0.8}
          color={COLORS.inkSoft}
        >
          TITLE · OPTIONAL
        </Text>

        <Stack
          backgroundColor={COLORS.white}
          borderRadius={18}
          style={{
            borderWidth: titleFocused ? 1.5 : 1,
            borderColor: titleFocused ? COLORS.gold : COLORS.chromeBorder,
            ...SHADOW_SOFT,
          }}
        >
          <TextInput
            placeholder="Give your note a title"
            placeholderTextColor={COLORS.inkSoft}
            value={title}
            onChangeText={onTitleChange}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            maxLength={120}
            returnKeyType="next"
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: COLORS.ink,
              paddingHorizontal: 18,
              paddingVertical: 16,
            }}
          />
        </Stack>
      </Stack>

      {/* Premium writing surface */}
      <Stack flex={1} gap={7}>
        <Stack horizontal alignItems="center" justifyContent="space-between" paddingHorizontal={4}>
          <Text
            variant="overline"
            fontSize={10.5}
            fontWeight="800"
            letterSpacing={0.8}
            color={COLORS.inkSoft}
          >
            NOTE
          </Text>

          <Stack horizontal alignItems="center" gap={5}>
            <Icon name="edit-3" size={11} color={COLORS.goldDeep} />
            <Text variant="subLabel" fontSize={10.5} fontWeight="700" color={COLORS.goldDeep}>
              Writing
            </Text>
          </Stack>
        </Stack>

        <Stack
          flex={1}
          minHeight={320}
          backgroundColor={COLORS.white}
          borderRadius={22}
          overflow="hidden"
          style={{
            borderWidth: contentFocused ? 1.5 : 1,
            borderColor: contentFocused ? COLORS.gold : COLORS.chromeBorder,
            ...SHADOW_SOFT,
          }}
        >
          {/* Warm notebook accent */}
          <Stack
            position="absolute"
            left={0}
            top={22}
            bottom={22}
            width={3}
            borderRadius={2}
            backgroundColor={COLORS.goldPale}
          />

          <TextInput
            placeholder="Start writing your thoughts, reflections or Bible notes…"
            placeholderTextColor={COLORS.inkSoft}
            value={content}
            onChangeText={onContentChange}
            onFocus={() => setContentFocused(true)}
            onBlur={() => setContentFocused(false)}
            multiline
            textAlignVertical="top"
            scrollEnabled
            style={{
              flex: 1,
              fontSize: 16.5,
              lineHeight: 27,
              color: COLORS.ink,
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 18,
            }}
          />

          <Stack
            horizontal
            alignItems="center"
            justifyContent="flex-end"
            paddingHorizontal={16}
            paddingVertical={10}
            style={{
              borderTopWidth: 1,
              borderTopColor: COLORS.paperAlt,
            }}
          >
            <Text variant="caption" fontSize={10.5} color={COLORS.inkSoft}>
              {content.length} character{content.length === 1 ? "" : "s"}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}