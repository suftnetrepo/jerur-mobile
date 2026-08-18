import { useState } from "react";
import { Animated, Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  StyledForm,
  Stack,
} from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { AppBackHeader } from "../../src/components/AppBackHeader";
import { FormSubmitButton } from "../../src/components/FormSubmitButton";
import { ContactHeroIllustration } from "../../src/components/illustrations/ContactIllustration";
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

  const handleEmailPress = () => Linking.openURL(`mailto:${email}`);
  const handlePhonePress = () => {
    const dialablePhone = primaryPhone.replace(/[^+\d]/g, "");
    Linking.openURL(`tel:${dialablePhone}`);
  };

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
        recipient: settings?.email,
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
                <StyledText
                  fontSize={11}
                  fontWeight="700"
                  letterSpacing={1}
                  color={COLORS.gold}
                >
                  CONTACT
                </StyledText>
              </Stack>
              <StyledText
                fontSize={26}
                fontWeight="800"
                color={COLORS.ink}
                style={{ lineHeight: 32 }}
              >
                Got any{" "}
                <StyledText
                  fontSize={26}
                  fontWeight="800"
                  color={COLORS.gold}
                  style={{ lineHeight: 32 }}
                >
                  questions?
                </StyledText>
              </StyledText>
              <StyledText
                fontSize={14}
                color={COLORS.inkSoft}
                style={{ marginTop: 8, lineHeight: 21 }}
              >
                Don't hesitate to get in touch — we'd love to hear from you.
              </StyledText>
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
            <ContactRow
              icon="map-pin"
              label="Address"
              value={`${address?.completeAddress} `}
            />

            <Stack
              height={1}
              backgroundColor={COLORS.chromeBorder}
              marginVertical={ 18}
            />

            <StyledText
              fontSize={11}
              fontWeight="700"
              letterSpacing={1}
              color={COLORS.inkSoft}
              style={{ marginBottom: 14, textTransform: "uppercase" }}
            >
              Get in touch
            </StyledText>

            <ContactRow icon="mail" label="Email" value={email} onPress={handleEmailPress} showChevron />
            <Stack height={1} backgroundColor={COLORS.chromeBorder} style={{ marginLeft: 58, marginVertical: 14 }} />
            <ContactRow icon="phone" label="Call" value={primaryPhone} onPress={handlePhonePress} showChevron />
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
            <StyledText
              fontSize={13.5}
              fontWeight="600"
              color={COLORS.sage}
              style={{ flex: 1 }}
            >
              Your email draft is ready. Review it and tap send in your email app.
            </StyledText>
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
            <StyledText
              fontSize={13.5}
              fontWeight="600"
              color={COLORS.error}
              style={{ flex: 1 }}
            >
              {error}
            </StyledText>
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
            <StyledText
              fontSize={17}
              fontWeight="800"
              color={COLORS.ink}
              style={{ marginBottom: 4 }}
            >
              Send us a message
            </StyledText>
            <StyledText
              fontSize={13}
              color={COLORS.inkSoft}
              style={{ marginBottom: 18, lineHeight: 19 }}
            >
              Fill in the form below and our team will get back to you.
            </StyledText>

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

function ContactRow({
  icon,
  label,
  value,
  onPress,
  showChevron = false,
}: {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
  showChevron?: boolean;
}) {
  return (
    <Stack horizontal gap={14} alignItems="center" onTouchEnd={onPress} style={{ minHeight: 58 }}>
      <Stack width={46} height={46} borderRadius={23} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center">
        <Icon name={icon as any} size={20} color={COLORS.goldDeep} />
      </Stack>
      <Stack flex={1}>
        <StyledText fontSize={14} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 2 }}>
          {label}
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} numberOfLines={2} style={{ lineHeight: 19 }}>
          {value}
        </StyledText>
      </Stack>
      {showChevron && <Icon name="chevron-right" size={22} color={COLORS.inkSoft} />}
    </Stack>
  );
}