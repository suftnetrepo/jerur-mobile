import { useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledCard, StyledForm, StyledButton, Stack } from "fluent-styles";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import { FeatureGate } from "../../src/components/FeatureGate";
import { usePrayerTimes } from "../../src/hooks/useChurchData";
import { usePrayerRequestSubmission } from "../../src/hooks/useSubmissions";
import { apiErrorMessage } from "../../src/api/client";
import { COLORS, ICON_TONES } from "../../src/theme/colors";

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
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 28 }}>
        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.gold} style={{ marginBottom: 8 }}>
          PRAYER
        </StyledText>
        <StyledText fontSize={26} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          We believe in the power of prayer
        </StyledText>
        <StyledText fontSize={14.5} color={COLORS.inkSoft} style={{ marginBottom: 24, lineHeight: 21 }}>
          Whatever you're facing, you're not alone. Let us stand with you in prayer.
        </StyledText>

        {prayerTimes && prayerTimes.length > 0 && (
          <Stack gap={12} marginBottom={28}>
            {prayerTimes.map((meeting, i) => {
              const tone = ICON_TONES[i % ICON_TONES.length];
              return (
                <StyledCard key={meeting._id ?? i} shadow="light" padding={16} borderRadius={12}>
                  <Stack width={40} height={40} borderRadius={20} backgroundColor={tone.bg} alignItems="center" justifyContent="center" marginBottom={10}>
                    <Icon name="clock" size={17} color={tone.fg} />
                  </Stack>
                  <StyledText fontSize={16} fontWeight="700" color={COLORS.ink} style={{ marginBottom: 4 }}>
                    {meeting.title}
                  </StyledText>
                  <StyledText fontSize={13} color={COLORS.inkSoft}>
                    {meeting.start_time} – {meeting.end_time}
                  </StyledText>
                  {meeting.description && (
                    <StyledText fontSize={13} color={COLORS.inkSoft} style={{ marginTop: 6 }}>
                      {meeting.description}
                    </StyledText>
                  )}
                </StyledCard>
              );
            })}
          </Stack>
        )}

        <StyledText fontSize={19} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 4 }}>
          We're praying with you
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 18, lineHeight: 20 }}>
          Share your heart, your struggles, or your praise. Our prayer team is committed to interceding on your behalf.
        </StyledText>

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
