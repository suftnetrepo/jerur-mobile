import { useState } from "react";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledCard, StyledForm, StyledButton, Stack } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { useWofbiRegistration } from "../../../src/hooks/useSubmissions";
import { apiErrorMessage } from "../../../src/api/client";
import { COLORS } from "../../../src/theme/colors";

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
  const { mutateAsync, isPending } = useWofbiRegistration();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [campus, setCampus] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !campus) {
      setError("Please fill in every field and choose a campus.");
      return;
    }
    try {
      await mutateAsync({ ...form, campus });
      setSuccess(true);
    } catch (err) {
      setError(apiErrorMessage(err, "Registration failed. Please try again."));
    }
  }

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header title="WOFBI" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.gold} style={{ marginBottom: 8 }}>
          RESOURCES · WOFBI
        </StyledText>
        <StyledText fontSize={22} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Basic Certificate Course
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 22 }}>
          Transform your life through deep spiritual enlightenment.
        </StyledText>

        <StyledCard shadow="light" padding={18} borderRadius={14} style={{ marginBottom: 24 }}>
          <StyledText fontSize={15} fontWeight="700" color={COLORS.ink} style={{ marginBottom: 12 }}>
            Are you depressed, oppressed, stagnated, and harassed by life's challenges?
          </StyledText>
          <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ lineHeight: 20, marginBottom: 14 }}>
            Is life fuzzy and unpredictable for you? You struggle in one area or the other — finance, business, health,
            family, career — and you don't really seem to understand what is going on.
          </StyledText>
          <Stack backgroundColor={COLORS.goldPale} borderRadius={8} padding={12}>
            <StyledText fontSize={12.5} color={COLORS.ink} style={{ lineHeight: 18 }}>
              At WOFBI, we do not offer mere secular education; we also provide deep spiritual enlightenment, as well as
              mental empowerment for exploits.
            </StyledText>
          </Stack>
        </StyledCard>

        <StyledText fontSize={16} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 12 }}>
          Choose a campus
        </StyledText>
        <Stack gap={10} marginBottom={26}>
          {CAMPUSES.map((c) => (
            <StyledCard
              key={c.label}
              shadow="light"
              padding={14}
              borderRadius={10}
              pressable
              pressableProps={{ onPress: () => setCampus(`${c.label} — ${c.dates}`) }}
              style={campus === `${c.label} — ${c.dates}` ? { borderWidth: 2, borderColor: COLORS.gold } : undefined}
            >
              <Stack horizontal alignItems="center" gap={10}>
                <Icon name="map-pin" size={15} color={COLORS.goldDeep} />
                <Stack flex={1}>
                  <StyledText fontSize={13.5} fontWeight="700" color={COLORS.ink}>
                    {c.label}
                  </StyledText>
                  <StyledText fontSize={12} color={COLORS.inkSoft}>
                    {c.dates}
                  </StyledText>
                </Stack>
                {campus === `${c.label} — ${c.dates}` && <Icon name="check-circle" size={16} color={COLORS.gold} />}
              </Stack>
            </StyledCard>
          ))}
        </Stack>

        {success ? (
          <Stack backgroundColor={COLORS.sageSoft} borderRadius={8} padding={14}>
            <StyledText fontSize={13.5} fontWeight="600" color={COLORS.sage}>
              Thank you for registering — we'll be in touch soon.
            </StyledText>
          </Stack>
        ) : (
          <>
            {error && (
              <Stack backgroundColor={COLORS.errorLight} borderRadius={8} padding={14} marginBottom={16}>
                <StyledText fontSize={13.5} fontWeight="600" color={COLORS.error}>
                  {error}
                </StyledText>
              </Stack>
            )}
            <StyledForm gap={14} avoidKeyboard={false}>
              <StyledForm.Row gap={12}>
                <StyledForm.Input label="First name" value={form.firstName} onChangeText={(v) => setForm((f) => ({ ...f, firstName: v }))} style={{ flex: 1 }} />
                <StyledForm.Input label="Last name" value={form.lastName} onChangeText={(v) => setForm((f) => ({ ...f, lastName: v }))} style={{ flex: 1 }} />
              </StyledForm.Row>
              <StyledForm.Input label="Email" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(v) => setForm((f) => ({ ...f, email: v }))} />
              <StyledForm.Input label="Phone number" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))} />
              <StyledForm.Actions>
                <StyledButton primary block loading={isPending} onPress={handleSubmit}>
                  <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                    {isPending ? "Submitting…" : "Submit"}
                  </StyledButton.Text>
                </StyledButton>
              </StyledForm.Actions>
            </StyledForm>
          </>
        )}
      </StyledScrollView>
    </StyledPage>
  );
}
