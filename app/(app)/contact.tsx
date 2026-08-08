import { useState } from "react";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledForm, StyledButton, Stack } from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { ContactChips } from "../../src/components/ContactChips";
import { useSettings } from "../../src/hooks/useChurchData";
import { useContactSubmission } from "../../src/hooks/useSubmissions";
import { apiErrorMessage } from "../../src/api/client";
import { COLORS } from "../../src/theme/colors";

export default function ContactScreen() {
  return (
    <FeatureGate feature="contact-us">
      <ContactScreenContent />
    </FeatureGate>
  );
}

function ContactScreenContent() {
  const { data: settings } = useSettings();
  const { mutateAsync, isPending } = useContactSubmission();

  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const address = settings?.address;
  const email = settings?.email || "WinnersChapel.InternationalPeterborough@winners-chapel.org.uk";
  const phone = settings?.mobile || "07888 230 650 / 07776 696 504";
  // The fallback carries two numbers separated by " / " for display in the
  // old full-width row; a chip shows one clean, dialable number instead.
  const primaryPhone = phone.split(" / ")[0].trim();

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
      <StyledPage.Header title="Contact" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <StyledText fontSize={22} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Got any questions?
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 22 }}>
          Don't hesitate to get in touch — we'd love to hear from you.
        </StyledText>

        <Stack gap={16} marginBottom={22}>
          <ContactRow icon="map-pin" label="Address" value={`${address?.addressLine1 || "Ormiston Bushfield Academy"}\n${[address?.town, address?.postcode].filter(Boolean).join(", ") || "Peterborough, PE2 5RQ"}`} />
        </Stack>

        <Stack gap={10} marginBottom={30}>
          <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.inkSoft} style={{ textTransform: "uppercase" }}>
            Get in touch
          </StyledText>
          <ContactChips
            phone={primaryPhone}
            email={email}
            facebookUrl={settings?.facebook_url}
            instagramUrl={settings?.instagram_url}
            youtubeUrl={settings?.youtube_url}
          />
        </Stack>

        {success && (
          <Stack backgroundColor={COLORS.sageSoft} borderRadius={8} padding={14} marginBottom={16}>
            <StyledText fontSize={13.5} fontWeight="600" color={COLORS.sage}>
              Thanks for reaching out — we'll be in touch soon.
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
          <StyledForm.Input label="Message" placeholder="Your message" multiline style={{ minHeight: 120 }} value={form.message} onChangeText={(v) => setForm((f) => ({ ...f, message: v }))} />
          <StyledForm.Actions>
            <StyledButton primary block loading={isPending} onPress={handleSubmit}>
              <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                {isPending ? "Sending…" : "Send message"}
              </StyledButton.Text>
            </StyledButton>
          </StyledForm.Actions>
        </StyledForm>
      </StyledScrollView>
    </StyledPage>
  );
}

function ContactRow({ icon, label, value, onPress }: { icon: string; label: string; value: string; onPress?: () => void }) {
  return (
    <Stack horizontal gap={14} onTouchEnd={onPress}>
      <Icon name={icon as any} size={19} color={COLORS.goldDeep} style={{ marginTop: 2 }} />
      <Stack flex={1}>
        <StyledText fontSize={13} fontWeight="700" color={COLORS.ink} style={{ marginBottom: 2 }}>
          {label}
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ lineHeight: 19 }}>
          {value}
        </StyledText>
      </Stack>
    </Stack>
  );
}
