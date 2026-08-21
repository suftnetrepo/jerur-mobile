import { useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledPressable, Popup, useToast } from "fluent-styles";
import { Text } from "./text";
import { ScalePressable } from "./ScalePressable";
import { REMINDER_OFFSETS, offsetLabel, reminderClockLabel, type PrayerReminder } from "../notifications/prayer-reminders";
import type { SetReminderResult } from "../notifications/use-prayer-reminders";
import { COLORS } from "../theme/colors";

/**
 * Per-session "Remind me" control for the Prayer Hours screen. Shows a
 * bell pill until a reminder exists, then a "✓ Reminder set · HH:MM" pill;
 * either one opens the same popup (offset picker + a Remove action once a
 * reminder is already set). Purely presentational - actual
 * scheduling/persistence lives in useReminders()/prayer-reminders.ts, this
 * just calls the callbacks it's handed and surfaces the result as a toast.
 */
export function PrayerReminderControl({
  sessionTitle,
  tone,
  reminder,
  onSetReminder,
  onRemoveReminder,
}: {
  sessionTitle: string;
  tone: { bg: string; fg: string };
  reminder?: PrayerReminder;
  onSetReminder: (offsetMinutes: number) => Promise<SetReminderResult>;
  onRemoveReminder: () => Promise<void>;
}) {
  const toast = useToast();
  const [visible, setVisible] = useState(false);
  const [busyOffset, setBusyOffset] = useState<number | null>(null);
  const clockLabel = reminder ? reminderClockLabel(reminder) : null;

  async function handlePick(offset: number) {
    setBusyOffset(offset);
    const result = await onSetReminder(offset);
    setBusyOffset(null);
    if (result.ok) {
      setVisible(false);
      toast.success("Reminder set", `We'll remind you ${offsetLabel(offset).toLowerCase()}.`);
    } else if (result.reason === "permission-denied") {
      toast.info("Notifications are off", "Enable notifications for this app in your device Settings to get prayer reminders.");
    } else {
      toast.error("Couldn't set reminder", "Please try again.");
    }
  }

  async function handleRemove() {
    await onRemoveReminder();
    setVisible(false);
    toast.info("Reminder removed");
  }

  return (
    <>
      <ScalePressable
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={reminder && clockLabel ? `Reminder set for ${clockLabel}. Tap to change or remove it.` : `Remind me for ${sessionTitle}`}
      >
        <Stack
          flexDirection="row"
          alignItems="center"
          gap={6}
          paddingHorizontal={12}
          paddingVertical={8}
          borderRadius={999}
          backgroundColor={reminder ? tone.bg : COLORS.chrome}
          style={!reminder ? { borderWidth: 1, borderColor: COLORS.chromeBorder } : undefined}
        >
          <Icon name={reminder ? "check-circle" : "bell"} size={13} color={reminder ? tone.fg : COLORS.ink} />
          <Text variant="button" fontSize={12} color={reminder ? tone.fg : COLORS.ink}>
            {reminder && clockLabel ? `Reminder set · ${clockLabel}` : "Remind me"}
          </Text>
        </Stack>
      </ScalePressable>

      <Popup visible={visible} onClose={() => setVisible(false)} title={`${sessionTitle} reminder`} showClose safeAreaBottom>
        <Stack padding={20} gap={10}>
          <Text variant="body" fontSize={13} color={COLORS.inkSoft} style={{ marginBottom: 4 }}>
            {reminder ? "Change when we remind you, or turn it off." : "We'll send a daily reminder on this device."}
          </Text>

          {REMINDER_OFFSETS.map((offset) => {
            const selected = reminder?.offsetMinutes === offset;
            return (
              <StyledPressable
                key={offset}
                onPress={() => handlePick(offset)}
                disabled={busyOffset !== null}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                paddingHorizontal={16}
                paddingVertical={14}
                borderRadius={12}
                backgroundColor={selected ? COLORS.goldPale : COLORS.chrome}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text variant="label" color={COLORS.ink}>
                  {offsetLabel(offset)}
                </Text>
                {selected && <Icon name="check" size={16} color={COLORS.goldDeep} />}
              </StyledPressable>
            );
          })}

          {reminder && (
            <StyledPressable
              onPress={handleRemove}
              alignItems="center"
              justifyContent="center"
              paddingVertical={14}
              borderRadius={12}
              style={{ marginTop: 6, borderWidth: 1, borderColor: COLORS.error }}
              accessibilityRole="button"
              accessibilityLabel="Remove reminder"
            >
              <Text variant="button" color={COLORS.error}>
                Remove reminder
              </Text>
            </StyledPressable>
          )}
        </Stack>
      </Popup>
    </>
  );
}
