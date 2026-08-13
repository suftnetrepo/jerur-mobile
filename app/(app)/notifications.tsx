import { Linking } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledButton, Stack } from "fluent-styles";
import { usePrayerTimes } from "../../src/hooks/useChurchData";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import { usePrayerReminders } from "../../src/notifications/use-prayer-reminders";
import { useNotificationPermissionStatus } from "../../src/notifications/use-notification-permission";
import { PrayerSessionCard } from "../../src/components/PrayerSessionCard";
import { COLORS, ICON_TONES } from "../../src/theme/colors";
import { SHADOW_SOFT } from "../../src/theme/shadows";

const STATUS_COPY = {
  granted: { label: "Notifications are on", tone: COLORS.sage, bg: COLORS.sageSoft, icon: "bell" as const },
  undetermined: { label: "Not yet requested", tone: COLORS.inkSoft, bg: COLORS.chrome, icon: "bell" as const },
  denied: { label: "Notifications are off", tone: COLORS.error, bg: COLORS.errorLight, icon: "bell-off" as const },
  loading: { label: "Checking…", tone: COLORS.inkSoft, bg: COLORS.chrome, icon: "bell" as const },
};

/**
 * Settings > Notifications - device notification permission status plus
 * management of the reminders this app can actually schedule today (Prayer
 * Hour reminders). Distinct from the church's own announcement banner
 * (ChurchNotification / settings.notification, shown on Home) - this
 * screen is only about on-device local notifications.
 */
export default function NotificationsScreen() {
  const { status } = useNotificationPermissionStatus();
  const { hasFeature } = useFeatureFlags();
  const { data: prayerTimes } = usePrayerTimes();
  const { reminders, setReminder, clearReminder } = usePrayerReminders(hasFeature("prayer-request") ? prayerTimes : undefined);

  const copy = STATUS_COPY[status];
  const activeReminderCount = Object.keys(reminders).length;

  return (
    <StyledPage flex={1} backgroundColor={COLORS.chrome}>
      <StyledPage.Header title="Notifications" titleAlignment="center" showBackArrow onBackPress={() => router.back()} backgroundColor={COLORS.chrome} />
      <StyledScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        {/* ── Device permission ─────────────────────────────────────────── */}
        <Stack backgroundColor={COLORS.paper} borderRadius={20} padding={18} marginBottom={22} style={SHADOW_SOFT}>
          <Stack horizontal alignItems="center" gap={12}>
            <Stack width={40} height={40} borderRadius={20} backgroundColor={copy.bg} alignItems="center" justifyContent="center">
              <Icon name={copy.icon} size={17} color={copy.tone} />
            </Stack>
            <Stack flex={1}>
              <StyledText fontSize={14.5} fontWeight="700" color={COLORS.ink}>
                {copy.label}
              </StyledText>
              <StyledText fontSize={12.5} color={COLORS.inkSoft} style={{ marginTop: 1 }}>
                {status === "denied" ? "Enable them in Settings to get reminders on this device." : "Controls whether this device can receive reminders."}
              </StyledText>
            </Stack>
          </Stack>
          {status === "denied" && (
            <StyledButton outline block onPress={() => Linking.openSettings()} style={{ marginTop: 14 }}>
              <StyledButton.Text color={COLORS.ink} fontWeight="700">
                Open Settings
              </StyledButton.Text>
            </StyledButton>
          )}
        </Stack>

        {/* ── Prayer Hour reminders ─────────────────────────────────────── */}
        {hasFeature("prayer-request") && (
          <Stack marginBottom={12}>
            <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.inkSoft} style={{ marginBottom: 4, textTransform: "uppercase" }}>
              Prayer Hour reminders
            </StyledText>
            <StyledText fontSize={13} color={COLORS.inkSoft} style={{ marginBottom: 14, lineHeight: 19 }}>
              {activeReminderCount > 0
                ? `${activeReminderCount} reminder${activeReminderCount === 1 ? "" : "s"} set on this device.`
                : "Get a daily reminder before Chop, Midday, or KAPS prayer."}
            </StyledText>

            {prayerTimes && prayerTimes.length > 0 && (
              <Stack gap={12}>
                {prayerTimes.map((meeting, i) => (
                  <PrayerSessionCard
                    key={meeting._id ?? i}
                    meeting={meeting}
                    tone={ICON_TONES[i % ICON_TONES.length]}
                    reminders={reminders}
                    onSetReminder={setReminder}
                    onRemoveReminder={clearReminder}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </StyledScrollView>
    </StyledPage>
  );
}
