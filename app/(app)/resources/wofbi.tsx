import { Animated } from "react-native";
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
import { FeatureGate } from "../../../src/components/FeatureGate";
import { ScalePressable } from "../../../src/components/ScalePressable";
import { FormSubmitButton } from "../../../src/components/FormSubmitButton";
import { useSettings } from "../../../src/hooks/useChurchData";
import { openChurchEmailDraft } from "../../../src/lib/church-email";
import { COLORS } from "../../../src/theme/colors";
import { SHADOW_SOFT, SHADOW_CARD } from "../../../src/theme/shadows";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { useFadeUp } from "../../../src/hooks/useFadeUp";

const CAMPUSES = [
  { label: "Birmingham Campus", dates: "5th – 10th August" },
  { label: "Dunford Campus", dates: "19th – 25th August" },
  { label: "Coventry Campus", dates: "26th – 31st August" },
  { label: "Leicester Campus", dates: "21st – 26th October" },
];

export default function WofbiScreen() {
  return (
    <FeatureGate feature="wofbi-basic-certificate">
      <WofbiScreenContent />
    </FeatureGate>
  );
}

function WofbiScreenContent() {
  const { data: settings } = useSettings();
  const heroAnim = useFadeUp(0);
  const campusAnim = useFadeUp(140);
  const formAnim = useFadeUp(260);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [campus, setCampus] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !campus
    ) {
      setError("Please fill in every field and choose a campus.");
      return;
    }
    setIsPending(true);
    try {
      await openChurchEmailDraft({
        recipient: settings?.support_email || settings?.email,
        subject: `WOFBI registration — ${form.firstName} ${form.lastName}`,
        heading:
          "A new WOFBI registration has been prepared for the church team.",
        fields: [
          { label: "Name", value: `${form.firstName} ${form.lastName}` },
          { label: "Email", value: form.email },
          { label: "Phone", value: form.phone },
          { label: "Selected campus", value: campus },
        ],
      });
      setSuccess(true);
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
      <AppBackHeader title="WOFBI" />

      <StyledScrollView
      showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 60,
        }}
      >
        <Stack
          width={42}
          height={4}
          borderRadius={999}
          backgroundColor={COLORS.gold}
          marginBottom={18}
        />

        {/* ── Premium hero ─────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 28 }, heroAnim]}>
          <Stack
            backgroundColor={COLORS.goldPale}
            borderRadius={26}
            padding={22}
            overflow="hidden"
            style={SHADOW_CARD}
          >
            <Stack horizontal alignItems="center" gap={7} marginBottom={14}>
              <Stack
                width={30}
                height={30}
                borderRadius={15}
                backgroundColor={COLORS.white}
                alignItems="center"
                justifyContent="center"
              >
                <Icon name="book-open" size={14} color={COLORS.goldDeep} />
              </Stack>
              <StyledText
                fontSize={10.5}
                fontWeight="800"
                letterSpacing={1}
                color={COLORS.goldDeep}
              >
                WORD OF FAITH BIBLE INSTITUTE
              </StyledText>
            </Stack>

            <StyledText
              fontSize={27}
              fontWeight="800"
              color={COLORS.ink}
              style={{ lineHeight: 32, marginBottom: 3 }}
            >
              Basic Certificate
            </StyledText>
            <StyledText
              fontSize={27}
              fontWeight="800"
              color={COLORS.goldDeep}
              style={{ lineHeight: 32, marginBottom: 13 }}
            >
              Course
            </StyledText>

            <StyledText
              fontSize={13}
              color={COLORS.inkSoft}
              style={{ lineHeight: 20, marginBottom: 18, maxWidth: 300 }}
            >
              Transform your life through deep spiritual enlightenment and
              practical empowerment for victorious living.
            </StyledText>

            <Stack
              backgroundColor={COLORS.white}
              borderRadius={18}
              padding={16}
              style={SHADOW_SOFT}
            >
              <Stack horizontal gap={12} alignItems="flex-start">
                <Stack
                  width={38}
                  height={38}
                  borderRadius={19}
                  backgroundColor={COLORS.sageSoft}
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon name="sunrise" size={17} color={COLORS.sage} />
                </Stack>
                <Stack flex={1}>
                  <StyledText
                    fontSize={13.5}
                    fontWeight="800"
                    color={COLORS.ink}
                    style={{ marginBottom: 5 }}
                  >
                    More than education
                  </StyledText>
                  <StyledText
                    fontSize={12.5}
                    color={COLORS.inkSoft}
                    style={{ lineHeight: 19 }}
                  >
                    At WOFBI, we do not offer mere secular education; we also
                    provide deep spiritual enlightenment and mental empowerment
                    for exploits.
                  </StyledText>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Course introduction ──────────────────────────────────────── */}
        <Stack
          backgroundColor={COLORS.white}
          borderRadius={20}
          padding={18}
          marginBottom={28}
          style={SHADOW_SOFT}
        >
          <Stack horizontal alignItems="center" gap={10} marginBottom={12}>
            <Stack
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor={COLORS.goldPale}
              alignItems="center"
              justifyContent="center"
            >
              <Icon name="compass" size={16} color={COLORS.goldDeep} />
            </Stack>
            <StyledText fontSize={15} fontWeight="800" color={COLORS.ink}>
              Looking for clarity and direction?
            </StyledText>
          </Stack>

          <StyledText
            fontSize={13}
            color={COLORS.inkSoft}
            style={{ lineHeight: 20 }}
          >
            Are you depressed, oppressed, stagnated, and harassed by life's
            challenges? Is life fuzzy and unpredictable for you? You struggle in
            one area or the other — finance, business, health, family, career —
            and you don't really seem to understand what is going on.
          </StyledText>
        </Stack>

        {/* ── Campus selector ──────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 30 }, campusAnim]}>
          <Stack horizontal alignItems="center" gap={10} marginBottom={18}>
            <Stack flex={1} height={1} backgroundColor={COLORS.goldPale} />
            <Stack alignItems="center">
              <Stack
                width={32}
                height={32}
                borderRadius={16}
                backgroundColor={COLORS.goldPale}
                alignItems="center"
                justifyContent="center"
                marginBottom={5}
              >
                <Icon name="map-pin" size={14} color={COLORS.goldDeep} />
              </Stack>
              <StyledText fontSize={18} fontWeight="800" color={COLORS.ink}>
                Choose a campus
              </StyledText>
              <StyledText
                fontSize={11.5}
                color={COLORS.inkSoft}
                style={{ marginTop: 2 }}
              >
                Select the location and dates that suit you.
              </StyledText>
            </Stack>
            <Stack flex={1} height={1} backgroundColor={COLORS.goldPale} />
          </Stack>

          <Stack gap={12}>
            {CAMPUSES.map((c, index) => {
              const value = `${c.label} — ${c.dates}`;
              const selected = campus === value;

              return (
                <ScalePressable
                  key={c.label}
                  onPress={() => setCampus(value)}
                  accessibilityRole="button"
                  accessibilityLabel={`${c.label}, ${c.dates}${selected ? ", selected" : ""}`}
                >
                  <Stack
                    horizontal
                    alignItems="center"
                    gap={14}
                    padding={16}
                    borderRadius={20}
                    backgroundColor={
                      selected ? COLORS.goldPale : COLORS.white
                    }
                    style={[
                      SHADOW_SOFT,
                      {
                        borderWidth: selected ? 1.5 : 1,
                        borderColor: selected
                          ? COLORS.gold
                          : COLORS.chromeBorder,
                      },
                    ]}
                  >
                    <Stack
                      width={46}
                      height={46}
                      borderRadius={23}
                      backgroundColor={
                        selected ? COLORS.gold : COLORS.paperAlt
                      }
                      alignItems="center"
                      justifyContent="center"
                    >
                      <StyledText
                        fontSize={12}
                        fontWeight="800"
                        color={selected ? COLORS.white : COLORS.inkSoft}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </StyledText>
                    </Stack>

                    <Stack flex={1}>
                      <StyledText
                        fontSize={14.5}
                        fontWeight="800"
                        color={COLORS.ink}
                        style={{ marginBottom: 5 }}
                      >
                        {c.label}
                      </StyledText>

                      <Stack horizontal alignItems="center" gap={6}>
                        <Icon
                          name="calendar"
                          size={12}
                          color={selected ? COLORS.goldDeep : COLORS.inkSoft}
                        />
                        <StyledText
                          fontSize={12.5}
                          fontWeight="600"
                          color={COLORS.inkSoft}
                        >
                          {c.dates}
                        </StyledText>
                      </Stack>
                    </Stack>

                    <Stack
                      width={28}
                      height={28}
                      borderRadius={14}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor={
                        selected ? COLORS.gold : COLORS.paper
                      }
                      style={
                        !selected
                          ? {
                              borderWidth: 1.5,
                              borderColor: COLORS.chromeBorder,
                            }
                          : undefined
                      }
                    >
                      {selected && (
                        <Icon name="check" size={15} color={COLORS.white} />
                      )}
                    </Stack>
                  </Stack>
                </ScalePressable>
              );
            })}
          </Stack>
        </Animated.View>

        {/* ── Registration ─────────────────────────────────────────────── */}
        <Animated.View style={formAnim}>
          {success ? (
            <Stack
              backgroundColor={COLORS.sageSoft}
              borderRadius={20}
              padding={20}
              style={SHADOW_SOFT}
            >
              <Stack horizontal gap={12} alignItems="center">
                <Stack
                  width={42}
                  height={42}
                  borderRadius={21}
                  backgroundColor={COLORS.white}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon name="check-circle" size={19} color={COLORS.sage} />
                </Stack>
                <Stack flex={1}>
                  <StyledText
                    fontSize={14}
                    fontWeight="800"
                    color={COLORS.sage}
                    style={{ marginBottom: 3 }}
                  >
                    Registration ready
                  </StyledText>
                  <StyledText
                    fontSize={12.5}
                    color={COLORS.inkSoft}
                    style={{ lineHeight: 18 }}
                  >
                    Your registration email is ready. Review it and tap send in
                    your email app.
                  </StyledText>
                </Stack>
              </Stack>
            </Stack>
          ) : (
            <Stack
              backgroundColor={COLORS.white}
              borderRadius={24}
              padding={20}
              style={SHADOW_CARD}
            >
              <Stack horizontal alignItems="center" gap={12} marginBottom={18}>
                <Stack
                  width={42}
                  height={42}
                  borderRadius={21}
                  backgroundColor={COLORS.goldPale}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon name="edit-3" size={17} color={COLORS.goldDeep} />
                </Stack>
                <Stack flex={1}>
                  <StyledText
                    fontSize={18}
                    fontWeight="800"
                    color={COLORS.ink}
                    style={{ marginBottom: 2 }}
                  >
                    Register your interest
                  </StyledText>
                  <StyledText fontSize={12} color={COLORS.inkSoft}>
                    Complete your details to continue.
                  </StyledText>
                </Stack>
              </Stack>

              {campus && (
                <Stack
                  horizontal
                  alignItems="center"
                  gap={9}
                  backgroundColor={COLORS.goldPale}
                  borderRadius={14}
                  padding={12}
                  marginBottom={16}
                >
                  <Icon name="map-pin" size={14} color={COLORS.goldDeep} />
                  <StyledText
                    flex={1}
                    fontSize={12}
                    fontWeight="700"
                    color={COLORS.goldDeep}
                  >
                    {campus}
                  </StyledText>
                </Stack>
              )}

              {error && (
                <Stack
                  backgroundColor={COLORS.errorLight}
                  borderRadius={12}
                  padding={14}
                  marginBottom={16}
                >
                  <StyledText
                    fontSize={13}
                    fontWeight="600"
                    color={COLORS.error}
                  >
                    {error}
                  </StyledText>
                </Stack>
              )}

              <StyledForm gap={14} avoidKeyboard={false}>
                <StyledForm.Row gap={12}>
                  <StyledForm.Input
                    label="First name"
                    value={form.firstName}
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, firstName: v }))
                    }
                    style={{ flex: 1 }}
                  />
                  <StyledForm.Input
                    label="Last name"
                    value={form.lastName}
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, lastName: v }))
                    }
                    style={{ flex: 1 }}
                  />
                </StyledForm.Row>

                <StyledForm.Input
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, email: v }))
                  }
                />

                <StyledForm.Input
                  label="Phone number"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, phone: v }))
                  }
                />

                <StyledForm.Actions>
                  <FormSubmitButton
                    label="Submit registration"
                    loadingLabel="Preparing…"
                    loading={isPending}
                    onPress={handleSubmit}
                  />
                </StyledForm.Actions>
              </StyledForm>
            </Stack>
          )}
        </Animated.View>
      </StyledScrollView>
    </StyledPage>
  );
}