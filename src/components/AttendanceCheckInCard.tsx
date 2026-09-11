import { Feather as Icon } from "@expo/vector-icons";
import { router } from "expo-router";
import { Stack, StyledPressable } from "fluent-styles";
import type { AttendanceReminder } from "../api/attendance";
import { COLORS, isDarkTheme } from "../theme/colors";
import { SHADOW_HERO } from "../theme/shadows";
import { Text } from "./text";

type Props = { reminder?: AttendanceReminder; isMemberSignedIn: boolean };

export function AttendanceCheckInCard({ reminder, isMemberSignedIn }: Props) {
  if (!reminder?.showReminder || !reminder.serviceId || !reminder.title) return null;

  const isLive = reminder.state === "LIVE";

  function handleCheckIn() {
    const params = {
      serviceId: reminder!.serviceId!,
      title: reminder!.title!,
      startTime: reminder!.startTime ?? "",
      endTime: reminder!.endTime ?? "",
      days: JSON.stringify(reminder!.days ?? []),
    };

    if (!isMemberSignedIn) {
      router.push({
        pathname: "/account",
        params: { ...params, returnTo: "check-in" },
      });
      return;
    }

    router.push({
      pathname: "/check-in",
      params,
    });
  }

  return (
    <Stack paddingHorizontal={20} marginBottom={20}>
      <Stack
        borderRadius={24}
        padding={20}
        gap={16}
        backgroundColor={isDarkTheme ? "#053B39" : COLORS.indigoDeep}
        style={[SHADOW_HERO, { overflow: "hidden" }]}
      >
        <Stack
          position="absolute"
          width={190}
          height={190}
          borderRadius={999}
          backgroundColor={COLORS.gold}
          style={{ opacity: 0.12, right: -75, top: -95 }}
        />

        <Stack horizontal alignItems="center" justifyContent="space-between" gap={12}>
          <Stack
            horizontal
            alignItems="center"
            gap={7}
            borderRadius={999}
            paddingHorizontal={11}
            paddingVertical={7}
            backgroundColor="rgba(255,255,255,0.13)"
          >
            <Stack width={7} height={7} borderRadius={999} backgroundColor={isLive ? "#FB7185" : COLORS.gold} />
            <Text variant="overline" fontSize={10} fontWeight="800" color={COLORS.onPrimary}>
              {reminder.eyebrow ?? "Check in available"}
            </Text>
          </Stack>
          <Stack width={40} height={40} borderRadius={14} alignItems="center" justifyContent="center" backgroundColor="rgba(255,255,255,0.13)">
            <Icon name="check-circle" size={20} color={COLORS.gold} />
          </Stack>
        </Stack>

        <Stack gap={7}>
          <Text variant="title" fontSize={21} fontWeight="800" color={COLORS.onPrimary}>
            {reminder.title}
          </Text>
          <Stack horizontal alignItems="center" gap={7}>
            <Icon name="clock" size={14} color={COLORS.gold} />
            <Text variant="subLabel" color="rgba(255,255,255,0.78)">
              Today · {reminder.startTime} – {reminder.endTime}
            </Text>
          </Stack>
          <Text variant="body" color="rgba(255,255,255,0.82)" style={{ lineHeight: 20 }}>
            {reminder.message ?? "Let your church know you are here."}
          </Text>
        </Stack>

        <StyledPressable onPress={handleCheckIn} accessibilityRole="button" accessibilityLabel={`Check in for ${reminder.title}`}>
          <Stack
            horizontal
            alignItems="center"
            justifyContent="space-between"
            borderRadius={16}
            paddingHorizontal={17}
            paddingVertical={14}
            backgroundColor={COLORS.white}
          >
            <Stack horizontal alignItems="center" gap={10}>
              <Stack width={30} height={30} borderRadius={10} alignItems="center" justifyContent="center" backgroundColor={COLORS.goldPale}>
                <Icon name="check" size={17} color={COLORS.goldDeep} />
              </Stack>
              <Text variant="button" fontSize={15} fontWeight="800" color={COLORS.indigo}>
                {isMemberSignedIn ? reminder.actionLabel ?? "Check in" : "Log in to check in"}
              </Text>
            </Stack>
            <Icon name="arrow-right" size={18} color={COLORS.indigo} />
          </Stack>
        </StyledPressable>
      </Stack>
    </Stack>
  );
}
