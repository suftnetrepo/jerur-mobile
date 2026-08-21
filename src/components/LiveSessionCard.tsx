import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledPressable } from "fluent-styles";
import { Text } from "./text";
import type { LiveSession } from "../utils/liveSessions";
import { formatSessionTimeRange } from "../utils/liveSessions";
import { SHADOW_CARD } from "../theme/shadows";
import { COLORS } from "../theme/colors";

export function LiveSessionCard({ item }: { item: LiveSession }) {
  const isPrayer = item.kind === "prayer";
  const accent = isPrayer ? "#0F766E" : "#2563EB";
  const surface = isPrayer ? "#F0FDFA" : "#EFF6FF";
  const status = item.isLive ? "Happening now" : `Starting in ${item.minutesUntilStart} min`;
  const route = isPrayer ? "/prayers" : "/service-times";

  return (
    <Stack
      backgroundColor={surface}
      borderRadius={20}
      padding={17}
      gap={12}
      style={[SHADOW_CARD, { borderWidth: 1, borderColor: `${accent}2E` }]}
    >
      <Stack horizontal alignItems="center" justifyContent="space-between" gap={12}>
        <Stack width={40} height={40} borderRadius={13} alignItems="center" justifyContent="center" backgroundColor={`${accent}16`}>
          <Icon name={isPrayer ? "sunrise" : "calendar"} size={19} color={accent} />
        </Stack>
        <Stack horizontal alignItems="center" gap={6} borderRadius={999} paddingHorizontal={10} paddingVertical={6} backgroundColor={`${accent}14`}>
          <Icon name="bell" size={12} color={accent} />
          <Text variant="overline" fontSize={10.5} fontWeight="800" letterSpacing={0.35} color={accent}>
            {status}
          </Text>
        </Stack>
      </Stack>

      <Stack gap={5}>
        <Text variant="title" fontSize={17} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 22 }}>
          {item.session.title}
        </Text>
        {!!item.session.description?.trim() && (
          <Text variant="body" fontSize={13} color={COLORS.inkSoft} numberOfLines={3} style={{ lineHeight: 19 }}>
            {item.session.description}
          </Text>
        )}
      </Stack>

      <Stack horizontal alignItems="center" gap={6}>
        <Icon name="clock" size={13} color={accent} />
        <Text variant="button" fontSize={12} color={COLORS.inkSoft}>
          Today · {formatSessionTimeRange(item.startsAt, item.endsAt)}
        </Text>
      </Stack>

      <StyledPressable onPress={() => router.push(route as any)} accessibilityRole="button">
        <Stack horizontal alignItems="center" gap={6} paddingVertical={2}>
          <Text variant="button" fontSize={13} fontWeight="800" color={accent}>
            {isPrayer ? "View prayer hours" : "View service"}
          </Text>
          <Icon name="arrow-right" size={14} color={accent} />
        </Stack>
      </StyledPressable>
    </Stack>
  );
}
