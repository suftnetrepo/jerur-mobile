import { useState } from "react";
import { Animated, Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledForm,
  Stack,
} from "fluent-styles";
import { Text } from "../../src/components/text";
import { FeatureGate } from "../../src/components/FeatureGate";
import { AppBackHeader } from "../../src/components/AppBackHeader";
import { FormSubmitButton } from "../../src/components/FormSubmitButton";
import { ContactInfoRow } from "../../src/components/ContactInfoRow";
import { useFadeUp } from "../../src/hooks/useFadeUp";
import { useSettings } from "../../src/hooks/useChurchData";
import { openChurchEmailDraft } from "../../src/lib/church-email";
import { COLORS } from "../../src/theme/colors";
import { SHADOW_SOFT } from "../../src/theme/shadows";

export default function ContactScreen() {
  return (
    <FeatureGate feature="contact-us">
      <ContactScreenContent />
    </FeatureGate>
  );
}

function ContactScreenContent() {
  const { data: settings } = useSettings();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const address = settings?.address;
  const email =
    settings?.email ||
    "";
  const phone = settings?.mobile || "";
  const primaryPhone = phone.split(" / ")[0].trim();

  // Both awaited + guarded with canOpenURL — a bare `Linking.openURL(...)`
  // call left unhandled here means a rejection (no mail/phone handler
  // registered, e.g. no telephony on the iOS Simulator) surfaces as an
  // "Uncaught (in promise...)" error instead of a message the member can
  // actually read. Reuses the same error banner the message form already
  // shows below.
  async function handleEmailPress() {
    const to = email.trim();
    if (!to) return;
    try {
      const url = `mailto:${to}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        setError("No email app is available on this device.");
        return;
      }
      await Linking.openURL(url);
    } catch {
      setError("Couldn't open your email app. Please try again.");
    }
  }

  async function handlePhonePress() {
    const dialablePhone = primaryPhone.replace(/[^+\d]/g, "");
    if (!dialablePhone) return;
    try {
      const url = `tel:${dialablePhone}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        setError("This device can't make phone calls.");
        return;
      }
      await Linking.openURL(url);
    } catch {
      setError("Couldn't start the call. Please try again.");
    }
  }

  const heroAnim = useFadeUp(0);
  const detailsAnim = useFadeUp(120);
  const formAnim = useFadeUp(220);

  async function handleSubmit() {
    setError(null);
    if (!form.first_name || !form.last_name || !form.email || !form.message) {
      setError("Please fill in every field.");
      return;
    }
    setIsPending(true);
    try {
      await openChurchEmailDraft({
        recipient: settings?.support_email || settings?.email,
        subject: `Contact enquiry — ${form.first_name} ${form.last_name}`,
        heading: "A new contact enquiry has been prepared for the church team.",
        fields: [
          { label: "Name", value: `${form.first_name} ${form.last_name}` },
          { label: "Email", value: form.email },
          { label: "Message", value: form.message },
        ],
      });
      setSuccess(true);
      setForm({ first_name: "", last_name: "", email: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't open your email app. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <AppBackHeader  />
      <StyledScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
      >
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 20 }, heroAnim]}>
          <Stack
            horizontal
            alignItems="flex-start"
            justifyContent="space-between"
            gap={12}
          >
            <Stack flex={1}>
              <Stack
                horizontal
                alignItems="center"
                gap={8}
                style={{ marginBottom: 12 }}
              >
                <Stack
                  width={34}
                  height={34}
                  borderRadius={17}
                  backgroundColor={COLORS.goldPale}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon name="mail" size={16} color={COLORS.gold} />
                </Stack>
                <Text
                  variant="overline"
                  fontSize={11}
                  letterSpacing={1}
                  color={COLORS.gold}
                >
                  CONTACT
                </Text>
              </Stack>
              <Text
                variant="header"
                fontSize={26}
                fontWeight="800"
                color={COLORS.ink}
                style={{ lineHeight: 32 }}
              >
                Got any{" "}
                <Text
                  variant="header"
                  fontSize={26}
                  fontWeight="800"
                  color={COLORS.gold}
                  style={{ lineHeight: 32 }}
                >
                  questions?
                </Text>
              </Text>
              <Text
                fontSize={14}
                color={COLORS.inkSoft}
                style={{ marginTop: 8, lineHeight: 21 }}
              >
                Don't hesitate to get in touch — we'd love to hear from you.
              </Text>
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Address + channels card ──────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 20 }, detailsAnim]}>
          <Stack
            backgroundColor={COLORS.paper}
            borderRadius={20}
            padding={18}
            style={SHADOW_SOFT}
          >
            <ContactInfoRow
              icon="map-pin"
              label="Address"
              value={`${address?.completeAddress} `}
            />

            <Stack
              height={1}
              backgroundColor={COLORS.chromeBorder}
              marginVertical={ 18}
            />

            <Text
              variant="overline"
              fontSize={11}
              letterSpacing={1}
              color={COLORS.inkSoft}
              style={{ marginBottom: 14 }}
            >
              Get in touch
            </Text>

            <ContactInfoRow icon="mail" label="Email" value={email} onPress={handleEmailPress} showChevron />
            <Stack height={1} backgroundColor={COLORS.chromeBorder} style={{ marginLeft: 58, marginVertical: 14 }} />
            <ContactInfoRow icon="phone" label="Call" value={primaryPhone} onPress={handlePhonePress} showChevron />
          </Stack>
        </Animated.View>

        {success && (
          <Stack
            horizontal
            alignItems="center"
            gap={10}
            backgroundColor={COLORS.sageSoft}
            borderRadius={12}
            padding={14}
            marginBottom={16}
          >
            <Icon name="check-circle" size={16} color={COLORS.sage} />
            <Text
              variant="label"
              fontSize={13.5}
              color={COLORS.sage}
              style={{ flex: 1 }}
            >
              Your email draft is ready. Review it and tap send in your email app.
            </Text>
          </Stack>
        )}
        {error && (
          <Stack
            horizontal
            alignItems="center"
            gap={10}
            backgroundColor={COLORS.errorLight}
            borderRadius={12}
            padding={14}
            marginBottom={16}
          >
            <Icon name="alert-circle" size={16} color={COLORS.error} />
            <Text
              variant="label"
              fontSize={13.5}
              color={COLORS.error}
              style={{ flex: 1 }}
            >
              {error}
            </Text>
          </Stack>
        )}

        {/* ── Message form card ────────────────────────────────────────── */}
        <Animated.View style={formAnim}>
          <Stack
            backgroundColor={COLORS.paper}
            borderRadius={20}
            padding={20}
            style={SHADOW_SOFT}
          >
            <Text
              variant="title"
              fontSize={17}
              fontWeight="800"
              color={COLORS.ink}
              style={{ marginBottom: 4 }}
            >
              Send us a message
            </Text>
            <Text
              fontSize={13}
              color={COLORS.inkSoft}
              style={{ marginBottom: 18, lineHeight: 19 }}
            >
              Fill in the form below and our team will get back to you.
            </Text>

            <StyledForm gap={16} avoidKeyboard={false}>
              <StyledForm.Row gap={12}>
                <StyledForm.Input
                  label="First name"
                  value={form.first_name}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, first_name: v }))
                  }
                  style={{ flex: 1 }}
                />
                <StyledForm.Input
                  label="Last name"
                  value={form.last_name}
                  onChangeText={(v) => setForm((f) => ({ ...f, last_name: v }))}
                  style={{ flex: 1 }}
                />
              </StyledForm.Row>
              <StyledForm.Input
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
              />
              <StyledForm.Input
                label="Message"
                placeholder="Your message"
                multiline
                style={{ minHeight: 120 }}
                value={form.message}
                onChangeText={(v) => setForm((f) => ({ ...f, message: v }))}
              />
              <StyledForm.Actions>
                <FormSubmitButton label="Send message" loadingLabel="Sending…" loading={isPending} onPress={handleSubmit} />
              </StyledForm.Actions>
            </StyledForm>
          </Stack>
        </Animated.View>
      </StyledScrollView>
    </StyledPage>
  );
}
