import { Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledText, Stack } from "fluent-styles";
import { PrayerReminderControl } from "./PrayerReminderControl";
import { ScalePressable } from "./ScalePressable";
import { sessionKey, type PrayerReminder } from "../notifications/prayer-reminders";
import type { SetReminderResult } from "../notifications/use-prayer-reminders";
import type { RegularService } from "../api/types";
import { COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";

/**
 * One prayer session row - icon, title, time, description, and its
 * reminder control. Shared by the Prayer Hours screen (prayers.tsx) and
 * the Notifications settings screen (notifications.tsx) so a member can
 * manage the same Chop/Midday/KAPS reminders from either place without
 * this card being built (and drifting) twice.
 */
export function PrayerSessionCard({
  meeting,
  tone,
  reminders,
  onSetReminder,
  onRemoveReminder,
}: {
  meeting: RegularService;
  tone: { bg: string; fg: string };
  reminders: Record<string, PrayerReminder>;
  onSetReminder: (meeting: RegularService, offsetMinutes: number) => Promise<SetReminderResult>;
  onRemoveReminder: (meeting: RegularService) => Promise<void>;
}) {
  const remoteLink = meeting.remote && meeting.remote_link?.trim() ? meeting.remote_link.trim() : null;

  function joinOnline() {
    if (!remoteLink) return;
    const url = /^https?:\/\//i.test(remoteLink) ? remoteLink : `https://${remoteLink}`;
    Linking.openURL(url);
  }

  return (
    <Stack
      backgroundColor={COLORS.paper}
      borderRadius={20}
      padding={16}
      style={[SHADOW_SOFT, { borderWidth: 1, borderColor: COLORS.chromeBorder }]}
    >
      <Stack horizontal alignItems="center" justifyContent="space-between" gap={12} marginBottom={14}>
        <Stack horizontal alignItems="center" gap={11} flex={1}>
          <Stack width={42} height={42} borderRadius={21} backgroundColor={tone.bg} alignItems="center" justifyContent="center">
            <Icon name="clock" size={17} color={tone.fg} />
          </Stack>
          <StyledText fontSize={16} fontWeight="800" color={COLORS.ink} numberOfLines={2} flex={1}>
            {meeting.title}
          </StyledText>
        </Stack>
        {remoteLink && (
          <Stack
            horizontal
            alignItems="center"
            gap={5}
            paddingHorizontal={9}
            paddingVertical={5}
            borderRadius={99}
            backgroundColor={COLORS.paper}
            style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}
          >
            <Icon name="wifi" size={10} color={COLORS.inkSoft} />
            <StyledText fontSize={9} fontWeight="800" letterSpacing={0.8} color={COLORS.inkSoft}>
              ONLINE
            </StyledText>
          </Stack>
        )}
      </Stack>

      <Stack
        horizontal
        alignItems="center"
        backgroundColor={COLORS.paperSoftest}
        borderRadius={14}
        padding={12}
        marginBottom={12}
        style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}
      >
        <Stack width={36} height={36} borderRadius={11} backgroundColor={COLORS.paperAlt} alignItems="center" justifyContent="center">
          <Icon name="clock" size={15} color={COLORS.inkSoft} />
        </Stack>
        <Stack marginLeft={11} flex={1}>
          <StyledText fontSize={9} fontWeight="800" letterSpacing={0.9} color={COLORS.inkSoft} style={{ marginBottom: 2 }}>
            PRAYER TIME
          </StyledText>
          <Stack horizontal alignItems="center" gap={9}>
            <StyledText fontSize={17} fontWeight="800" color={COLORS.ink}>{meeting.start_time}</StyledText>
            <Icon name="arrow-right" size={14} color={COLORS.inkSoft} />
            <StyledText fontSize={17} fontWeight="800" color={COLORS.ink}>{meeting.end_time}</StyledText>
          </Stack>
        </Stack>
      </Stack>

      <Stack>
        {meeting.description && (
          <StyledText fontSize={13} color={COLORS.inkSoft} style={{ marginBottom: 12, lineHeight: 19 }}>
            {meeting.description}
          </StyledText>
        )}
        <Stack horizontal alignItems="center" gap={8} style={{ flexWrap: "wrap" }}>
          <PrayerReminderControl
            sessionTitle={meeting.title}
            tone={tone}
            reminder={reminders[sessionKey(meeting)]}
            onSetReminder={(offset) => onSetReminder(meeting, offset)}
            onRemoveReminder={() => onRemoveReminder(meeting)}
          />
          {remoteLink && (
            <ScalePressable
              onPress={joinOnline}
              accessibilityRole="link"
              accessibilityLabel={`Join ${meeting.title} online`}
            >
              <Stack
                horizontal
                alignItems="center"
                gap={7}
                paddingHorizontal={14}
                paddingVertical={8}
                borderRadius={999}
                backgroundColor={COLORS.paper}
                style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}
              >
                <Icon name="video" size={13} color={COLORS.ink} />
                <StyledText fontSize={12} fontWeight="800" color={COLORS.ink}>
                  Join online
                </StyledText>
                <Icon name="external-link" size={12} color={COLORS.inkSoft} />
              </Stack>
            </ScalePressable>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
