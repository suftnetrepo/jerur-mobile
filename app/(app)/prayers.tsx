import { useState } from "react";
import { Feather as Icon, MaterialCommunityIcons as MCIcon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledForm, StyledButton, Stack } from "fluent-styles";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import { FeatureGate } from "../../src/components/FeatureGate";
import { PrayerHeroIllustration } from "../../src/components/illustrations/PrayerIllustration";
import { PrayerReminderControl } from "../../src/components/PrayerReminderControl";
import { usePrayerTimes } from "../../src/hooks/useChurchData";
import { usePrayerRequestSubmission } from "../../src/hooks/useSubmissions";
import { usePrayerReminders } from "../../src/notifications/use-prayer-reminders";
import { sessionKey } from "../../src/notifications/prayer-reminders";
import { apiErrorMessage } from "../../src/api/client";
import { COLORS, ICON_TONES } from "../../src/theme/colors";
import { SHADOW_SOFT } from "../../src/theme/shadows";
import { router } from "expo-router";

export default function PrayersScreen() {
  return (
    <FeatureGate feature="prayer-request">
      <PrayersScreenContent />
    </FeatureGate>
  );
}

function PrayersScreenContent() {
  const { data: prayerTimes } = usePrayerTimes();
  const { mutateAsync, isPending } = usePrayerRequestSubmission();
  const { reminders, setReminder, clearReminder } = usePrayerReminders(prayerTimes);

  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!form.first_name || !form.last_name || !form.email || !form.message) {
      setError("Please fill in every field.");
      return;
    }
    try {
      await mutateAsync(form);
      setSuccess(true);
      setForm({ first_name: "", last_name: "", email: "", message: "" });
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header shapeProps={{
                cycle: true,
                size: 48,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: COLORS.chromeBorder,
              }}
             
              marginHorizontal={16}  titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 28 }}>
        <Stack horizontal alignItems="flex-start" justifyContent="space-between" gap={12} marginBottom={24}>
          <Stack flex={1}>
            <Stack horizontal alignItems="center" gap={8} style={{ marginBottom: 14 }}>
              <Stack width={34} height={34} borderRadius={17} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center">
                <MCIcon name="hands-pray" size={17} color={COLORS.gold} />
              </Stack>
              <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.gold}>
                PRAYER
              </StyledText>
            </Stack>
            <StyledText fontSize={28} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 34 }}>
              We believe in the{" "}
              <StyledText fontSize={28} fontWeight="800" color={COLORS.gold} style={{ lineHeight: 34 }}>
                power of prayer
              </StyledText>
            </StyledText>
            <StyledText fontSize={14} color={COLORS.inkSoft} style={{ marginTop: 10, lineHeight: 21 }}>
              Whatever you're facing, you're not alone. Let us stand with you in prayer.
            </StyledText>
          </Stack>

          <PrayerHeroIllustration />
        </Stack>

        {prayerTimes && prayerTimes.length > 0 && (
          <Stack gap={12} marginBottom={28}>
            {prayerTimes.map((meeting, i) => {
              const tone = ICON_TONES[i % ICON_TONES.length];
              return (
                <Stack
                  key={meeting._id ?? i}
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
                        onSetReminder={(offset) => setReminder(meeting, offset)}
                        onRemoveReminder={() => clearReminder(meeting)}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        )}

        <Stack marginBottom={18}>
          <StyledText fontSize={20} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 8 }}>
            We're praying with you
          </StyledText>
          <Stack width={40} height={3} borderRadius={2} backgroundColor={COLORS.gold} style={{ marginBottom: 10 }} />
          <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ lineHeight: 20 }}>
            Share your heart, your struggles, or your praise. Our prayer team is committed to interceding on your behalf.
          </StyledText>
        </Stack>

        {success && (
          <Stack backgroundColor={COLORS.sageSoft} borderRadius={8} padding={14} marginBottom={16}>
            <StyledText fontSize={13.5} fontWeight="600" color={COLORS.sage}>
              Your prayer request has been received. We'll be praying with you.
            </StyledText>
          </Stack>
        )}
        {error && (
          <Stack backgroundColor={COLORS.errorLight} borderRadius={8} padding={14} marginBottom={16}>
            <StyledText fontSize={13.5} fontWeight="600" color={COLORS.error}>
              {error}
            </StyledText>
          </Stack>
        )}

        <StyledForm gap={16} avoidKeyboard={false}>
          <StyledForm.Row gap={12}>
            <StyledForm.Input
              label="First name"
              placeholder="Jane"
              value={form.first_name}
              onChangeText={(v) => setForm((f) => ({ ...f, first_name: v }))}
              style={{ flex: 1 }}
            />
            <StyledForm.Input
              label="Last name"
              placeholder="Doe"
              value={form.last_name}
              onChangeText={(v) => setForm((f) => ({ ...f, last_name: v }))}
              style={{ flex: 1 }}
            />
          </StyledForm.Row>
          <StyledForm.Input
            label="Email"
            placeholder="jane.doe@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
          />
          <StyledForm.Input
            label="Your prayer request"
            placeholder="Describe your prayer request — whether for healing, guidance, provision, or thanksgiving…"
            multiline
            style={{ minHeight: 120 }}
            value={form.message}
            onChangeText={(v) => setForm((f) => ({ ...f, message: v }))}
          />
          <StyledForm.Actions>
            <StyledButton primary block loading={isPending} onPress={handleSubmit}>
              <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                {isPending ? "Sending…" : "Send prayer request"}
              </StyledButton.Text>
            </StyledButton>
          </StyledForm.Actions>
        </StyledForm>
      </StyledScrollView>

      <BottomTabBar active="more" />
    </StyledPage>
  );
}
