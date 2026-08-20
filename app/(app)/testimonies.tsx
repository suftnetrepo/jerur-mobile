import { useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  StyledCard,
  StyledForm,
  Stack,
} from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { AppBackHeader } from "../../src/components/AppBackHeader";
import { FormSubmitButton } from "../../src/components/FormSubmitButton";
import { useSettings } from "../../src/hooks/useChurchData";
import { openChurchEmailDraft } from "../../src/lib/church-email";
import { COLORS } from "../../src/theme/colors";
import { SHADOW_CARD } from "../../src/theme/shadows";

const FEATURED = {
  quote:
    "I walked in during the hardest season of my life. This church didn't just pray for me — they stood with me until I could stand on my own.",
  name: "A member of our church family",
};

const PURPLE = "#6C45F5";
const PURPLE_SOFT = "#F3EEFF";
const PURPLE_BORDER = "#E8DEFF";

export default function TestimoniesScreen() {
  return (
    <FeatureGate feature="testimony">
      <TestimoniesScreenContent />
    </FeatureGate>
  );
}

function TestimoniesScreenContent() {
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

  async function handleSubmit() {
    setError(null);
    setSuccess(false);

    if (!form.first_name || !form.last_name || !form.email || !form.message) {
      setError("Please fill in every field.");
      return;
    }

    setIsPending(true);
    try {
      await openChurchEmailDraft({
        recipient: settings?.support_email || settings?.email,
        subject: `Testimony — ${form.first_name} ${form.last_name}`,
        heading: "A new testimony has been prepared for the church team.",
        fields: [
          { label: "Name", value: `${form.first_name} ${form.last_name}` },
          { label: "Email", value: form.email },
          { label: "Testimony", value: form.message },
        ],
      });
      setSuccess(true);
      setForm({ first_name: "", last_name: "", email: "", message: "" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't open your email app. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <AppBackHeader title="Testimonies" />

      <StyledScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 60,
        }}
      >
        <Stack marginBottom={24}>
          <Stack
            width={42}
            height={4}
            borderRadius={999}
            backgroundColor={COLORS.gold}
            marginBottom={12}
          />
          <StyledText
            fontSize={24}
            fontWeight="800"
            color={COLORS.ink}
            style={{ lineHeight: 34, marginBottom: 8 }}
          >
            Celebrate the goodness of God
          </StyledText>
          <StyledText
            fontSize={15}
            color={COLORS.inkSoft}
            style={{ lineHeight: 22 }}
          >
            Share testimonies that reveal God's love, power, and faithfulness.
          </StyledText>
        </Stack>

        <StyledCard
          padding={0}
          borderRadius={24}
          backgroundColor={COLORS.paper}
          style={[
            SHADOW_CARD,
            {
              marginBottom: 24,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: COLORS.goldSoft,
            },
          ]}
        >
          <Stack padding={22}>
            <Stack
              width={48}
              height={48}
              borderRadius={16}
              alignItems="center"
              justifyContent="center"
              backgroundColor={COLORS.goldSoft}
              marginBottom={16}
            >
              <StyledText
                fontSize={28}
                fontWeight="800"
                color={COLORS.gold}
                style={{ lineHeight: 34 }}
              >
                “
              </StyledText>
            </Stack>

            <StyledText
              fontSize={16}
              color={COLORS.ink}
              style={{ fontStyle: "italic", lineHeight: 25, marginBottom: 16 }}
            >
              "{FEATURED.quote}"
            </StyledText>

            <StyledText fontSize={13} fontWeight="700" color={COLORS.gold}>
              — {FEATURED.name}
            </StyledText>
          </Stack>
        </StyledCard>

        <Stack
          horizontal
          alignItems="center"
          gap={12}
          padding={15}
          borderRadius={18}
          backgroundColor={COLORS.goldPale}
          marginBottom={22}
        >
          <Stack
            width={42}
            height={42}
            borderRadius={21}
            alignItems="center"
            justifyContent="center"
            backgroundColor={COLORS.gold}
          >
            <Icon name="heart" size={19} color="#FFFFFF" />
          </Stack>
          <Stack flex={1}>
            <StyledText
              fontSize={15}
              fontWeight="800"
              color={COLORS.ink}
              style={{ marginBottom: 2 }}
            >
              Have a testimony to share?
            </StyledText>
            <StyledText fontSize={13} color={COLORS.inkSoft}>
              We'd love to hear it!
            </StyledText>
          </Stack>
        </Stack>

        {success && (
          <Stack
            horizontal
            alignItems="flex-start"
            gap={10}
            backgroundColor={COLORS.sageSoft}
            borderRadius={14}
            padding={14}
            marginBottom={18}
          >
            <Icon name="check-circle" size={18} color={COLORS.sage} />
            <StyledText
              flex={1}
              fontSize={13.5}
              fontWeight="600"
              color={COLORS.sage}
              style={{ lineHeight: 19 }}
            >
              Your email draft is ready. Review it and tap send in your email app.
            </StyledText>
          </Stack>
        )}

        {error && (
          <Stack
            horizontal
            alignItems="flex-start"
            gap={10}
            backgroundColor={COLORS.errorLight}
            borderRadius={14}
            padding={14}
            marginBottom={18}
          >
            <Icon name="alert-circle" size={18} color={COLORS.error} />
            <StyledText
              flex={1}
              fontSize={13.5}
              fontWeight="600"
              color={COLORS.error}
              style={{ lineHeight: 19 }}
            >
              {error}
            </StyledText>
          </Stack>
        )}

        <StyledForm gap={18} avoidKeyboard={false}>
          <StyledForm.Row gap={12}>
            <StyledForm.Input
              label="First name"
              placeholder="First name"
              value={form.first_name}
              onChangeText={(v) => setForm((f) => ({ ...f, first_name: v }))}
              style={{ flex: 1 }}
            />
            <StyledForm.Input
              label="Last name"
              placeholder="Last name"
              value={form.last_name}
              onChangeText={(v) => setForm((f) => ({ ...f, last_name: v }))}
              style={{ flex: 1 }}
            />
          </StyledForm.Row>

          <StyledForm.Input
            label="Email"
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
          />

          <Stack>
            <StyledForm.Input
              label="Your testimony"
              placeholder="Tell us what God has done…"
              multiline
              style={{ minHeight: 150 }}
              value={form.message}
              onChangeText={(v) =>
                setForm((f) => ({ ...f, message: v.slice(0, 1500) }))
              }
            />
            <StyledText
              fontSize={11.5}
              color={COLORS.inkSoft}
              style={{ textAlign: "right", marginTop: 6 }}
            >
              {form.message.length}/1500
            </StyledText>
          </Stack>

          <StyledForm.Actions>
            <FormSubmitButton
              label="Share testimony"
              loadingLabel="Preparing…"
              loading={isPending}
              onPress={handleSubmit}
            />
          </StyledForm.Actions>
        </StyledForm>

        <Stack
          horizontal
          alignItems="center"
          justifyContent="center"
          gap={7}
          marginTop={15}
          paddingHorizontal={12}
        >
          <Icon name="lock" size={13} color={COLORS.inkSoft} />
          <StyledText
            fontSize={11.5}
            color={COLORS.inkSoft}
            style={{ lineHeight: 17, textAlign: "center" }}
          >
            Your testimony is safe and will be reviewed before sharing.
          </StyledText>
        </Stack>
      </StyledScrollView>
    </StyledPage>
  );
}