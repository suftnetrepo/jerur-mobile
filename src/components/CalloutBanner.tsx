import { Feather as Icon } from "@expo/vector-icons";
import { router } from "expo-router";
import { Stack, StyledPressable, StyledShape } from "fluent-styles";
import { Text } from "./text";
import { COLORS } from "../theme/colors";

export function CalloutBanner({
  eyebrow,
  title,
  body,
  linkLabel,
  route,
  backgroundColor = COLORS.sageSoft,
  accentColor = COLORS.sage,
  icon = "heart",
}: {
  eyebrow?: string;
  title: string;
  body: string;
  linkLabel: string;
  route: string;
  backgroundColor?: string;
  accentColor?: string;
  icon?: string;
}) {
  return (
    <StyledPressable onPress={() => router.push(route as any)}>
      <Stack horizontal backgroundColor={backgroundColor} borderRadius={20} padding={20} alignItems="center" gap={16}>
        <Stack flex={1} gap={6}>
          {eyebrow && (
            <Text variant="overline" fontSize={11} letterSpacing={0.8} color={accentColor}>
              {eyebrow}
            </Text>
          )}
          <Text variant="title" fontSize={17} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 22 }}>
            {title}
          </Text>
          <Text variant="bodySmall" fontSize={12.5} color={COLORS.inkSoft}>
            {body}
          </Text>
          <Stack horizontal alignItems="center" gap={5} marginTop={4}>
            <Text variant="button" fontSize={13} color={accentColor}>
              {linkLabel}
            </Text>
            <Icon name="arrow-right" size={13} color={accentColor} />
          </Stack>
        </Stack>
        <StyledShape size={54} cycle backgroundColor="rgba(255,255,255,0.5)">
          <Icon name={icon as any} size={22} color={accentColor} />
        </StyledShape>
      </Stack>
    </StyledPressable>
  );
}
