import { useState } from "react";
import { router } from "expo-router";
import { StyledPage, StyledScrollView, StyledText, StyledCard, StyledForm, StyledButton, Stack } from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { useTestimonySubmission } from "../../src/hooks/useSubmissions";
import { apiErrorMessage } from "../../src/api/client";
import { COLORS } from "../../src/theme/colors";

// NOTE: same gap as the website — Jerur has no GET endpoint for approved
// testimonies yet, only the POST below to submit one. Swap this static
// example for a real fetch once that endpoint exists.
const FEATURED = {
  quote:
    "I walked in during the hardest season of my life. This church didn't just pray for me — they stood with me until I could stand on my own.",
  name: "A member of our church family",
};

export default function TestimoniesScreen() {
  return (
    <FeatureGate feature="testimony">
      <TestimoniesScreenContent />
    </FeatureGate>
  );
}

function TestimoniesScreenContent() {
  const { mutateAsync, isPending } = useTestimonySubmission();
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
      <StyledPage.Header title="Testimonies" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <StyledText fontSize={22} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Celebrate the goodness of God
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 20 }}>
          Share testimonies that reveal God's love, power, and faithfulness.
        </StyledText>

        <StyledCard shadow="light" padding={18} borderRadius={14} backgroundColor={COLORS.paperAlt} style={{ marginBottom: 28 }}>
          <StyledText fontSize={15} color={COLORS.ink} style={{ fontStyle: "italic", lineHeight: 22, marginBottom: 10 }}>
            "{FEATURED.quote}"
          </StyledText>
          <StyledText fontSize={12.5} fontWeight="700" color={COLORS.inkSoft}>
            — {FEATURED.name}
          </StyledText>
        </StyledCard>

        <StyledText fontSize={14} fontWeight="700" color={COLORS.ink} style={{ marginBottom: 16, textAlign: "center" }}>
          Have a testimony to share? We'd love to hear it!
        </StyledText>

        {success && (
          <Stack backgroundColor={COLORS.sageSoft} borderRadius={8} padding={14} marginBottom={16}>
            <StyledText fontSize={13.5} fontWeight="600" color={COLORS.sage}>
              Thank you for sharing — your testimony has been received.
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
            <StyledForm.Input label="First name" value={form.first_name} onChangeText={(v) => setForm((f) => ({ ...f, first_name: v }))} style={{ flex: 1 }} />
            <StyledForm.Input label="Last name" value={form.last_name} onChangeText={(v) => setForm((f) => ({ ...f, last_name: v }))} style={{ flex: 1 }} />
          </StyledForm.Row>
          <StyledForm.Input label="Email" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(v) => setForm((f) => ({ ...f, email: v }))} />
          <StyledForm.Input label="Your testimony" placeholder="Tell us what God has done…" multiline style={{ minHeight: 120 }} value={form.message} onChangeText={(v) => setForm((f) => ({ ...f, message: v }))} />
          <StyledForm.Actions>
            <StyledButton primary block loading={isPending} onPress={handleSubmit}>
              <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                {isPending ? "Sending…" : "Share testimony"}
              </StyledButton.Text>
            </StyledButton>
          </StyledForm.Actions>
        </StyledForm>
      </StyledScrollView>
    </StyledPage>
  );
}
