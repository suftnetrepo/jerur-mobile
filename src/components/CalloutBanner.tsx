import { Feather as Icon } from "@expo/vector-icons";
import { router } from "expo-router";
import { Stack, StyledText, StyledPressable, StyledShape } from "fluent-styles";
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
            <StyledText fontSize={11} fontWeight="700" letterSpacing={0.8} color={accentColor} style={{ textTransform: "uppercase" }}>
              {eyebrow}
            </StyledText>
          )}
          <StyledText fontSize={17} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 22 }}>
            {title}
          </StyledText>
          <StyledText fontSize={12.5} color={COLORS.inkSoft} style={{ lineHeight: 18 }}>
            {body}
          </StyledText>
          <Stack horizontal alignItems="center" gap={5} marginTop={4}>
            <StyledText fontSize={13} fontWeight="700" color={accentColor}>
              {linkLabel}
            </StyledText>
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
