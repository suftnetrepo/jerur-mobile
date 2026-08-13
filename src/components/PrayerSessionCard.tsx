import { Feather as Icon } from "@expo/vector-icons";
import { StyledText, Stack } from "fluent-styles";
import { PrayerReminderControl } from "./PrayerReminderControl";
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
  return (
    <Stack
      horizontal
      alignItems="flex-start"
      gap={14}
      backgroundColor={COLORS.paper}
      borderRadius={16}
      paddingHorizontal={16}
      paddingVertical={16}
      style={[{ borderLeftWidth: 4, borderLeftColor: tone.fg }, SHADOW_SOFT]}
    >
      <Stack width={44} height={44} borderRadius={22} backgroundColor={tone.bg} alignItems="center" justifyContent="center">
        <Icon name="clock" size={18} color={tone.fg} />
      </Stack>
      <Stack flex={1}>
        <StyledText fontSize={16} fontWeight="700" color={COLORS.ink} style={{ marginBottom: 2 }}>
          {meeting.title}
        </StyledText>
        <StyledText fontSize={13} fontWeight="700" color={tone.fg} style={{ marginBottom: 6 }}>
          {meeting.start_time} – {meeting.end_time}
        </StyledText>
        {meeting.description && (
          <StyledText fontSize={13} color={COLORS.inkSoft} style={{ marginBottom: 10 }}>
            {meeting.description}
          </StyledText>
        )}
        <Stack alignItems="flex-start">
          <PrayerReminderControl
            sessionTitle={meeting.title}
            tone={tone}
            reminder={reminders[sessionKey(meeting)]}
            onSetReminder={(offset) => onSetReminder(meeting, offset)}
            onRemoveReminder={() => onRemoveReminder(meeting)}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
