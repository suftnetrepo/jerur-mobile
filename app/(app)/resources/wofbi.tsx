import { useState } from "react";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledCard, StyledForm, Stack } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { ScalePressable } from "../../../src/components/ScalePressable";
import { FormSubmitButton } from "../../../src/components/FormSubmitButton";
import { useSettings } from "../../../src/hooks/useChurchData";
import { openChurchEmailDraft } from "../../../src/lib/church-email";
import { COLORS } from "../../../src/theme/colors";
import { SHADOW_SOFT } from "../../../src/theme/shadows";

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
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [campus, setCampus] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !campus) {
      setError("Please fill in every field and choose a campus.");
      return;
    }
    setIsPending(true);
    try {
      await openChurchEmailDraft({
        recipient: settings?.email,
        subject: `WOFBI registration — ${form.firstName} ${form.lastName}`,
        heading: "A new WOFBI registration has been prepared for the church team.",
        fields: [
          { label: "Name", value: `${form.firstName} ${form.lastName}` },
          { label: "Email", value: form.email },
          { label: "Phone", value: form.phone },
          { label: "Selected campus", value: campus },
        ],
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't open your email app. Please try again.");
    } finally {
      setIsPending(false);
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
        }} marginHorizontal={16}  showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.gold} style={{ marginBottom: 8 }}>
          WOFBI
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

        <Stack marginBottom={26}>
          <Stack horizontal alignItems="flex-end" justifyContent="space-between" marginBottom={14}>
            <Stack flex={1}>
              <StyledText fontSize={18} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 3 }}>
                Choose a campus
              </StyledText>
              <StyledText fontSize={12.5} color={COLORS.inkSoft}>
                Select the location and dates that suit you.
              </StyledText>
            </Stack>
            <StyledText fontSize={11} fontWeight="700" color={COLORS.inkSoft}>
              {CAMPUSES.length} LOCATIONS
            </StyledText>
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
                    borderRadius={18}
                    backgroundColor={selected ? COLORS.paperAlt : COLORS.paper}
                    style={[
                      SHADOW_SOFT,
                      {
                        borderWidth: selected ? 1.5 : 1,
                        borderColor: selected ? COLORS.ink : COLORS.chromeBorder,
                      },
                    ]}
                  >
                    <Stack
                      width={42}
                      height={42}
                      borderRadius={21}
                      backgroundColor={selected ? COLORS.ink : COLORS.paperAlt}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <StyledText fontSize={12} fontWeight="800" color={selected ? COLORS.paper : COLORS.inkSoft}>
                        {String(index + 1).padStart(2, "0")}
                      </StyledText>
                    </Stack>

                    <Stack flex={1} gap={5}>
                      <StyledText fontSize={14.5} fontWeight="800" color={COLORS.ink}>
                        {c.label}
                      </StyledText>
                      <Stack horizontal alignItems="center" gap={6}>
                        <Icon name="calendar" size={12} color={COLORS.inkSoft} />
                        <StyledText fontSize={12.5} fontWeight="600" color={COLORS.inkSoft}>
                          {c.dates}
                        </StyledText>
                      </Stack>
                    </Stack>

                    <Stack
                      width={24}
                      height={24}
                      borderRadius={12}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor={selected ? COLORS.ink : "transparent"}
                      style={!selected ? { borderWidth: 1.5, borderColor: COLORS.chromeBorder } : undefined}
                    >
                      {selected && <Icon name="check" size={14} color={COLORS.paper} />}
                    </Stack>
                  </Stack>
                </ScalePressable>
              );
            })}
          </Stack>
        </Stack>

        {success ? (
          <Stack backgroundColor={COLORS.sageSoft} borderRadius={8} padding={14}>
            <StyledText fontSize={13.5} fontWeight="600" color={COLORS.sage}>
              Your registration email is ready. Review it and tap send in your email app.
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
                <FormSubmitButton label="Submit" loadingLabel="Submitting…" loading={isPending} onPress={handleSubmit} />
              </StyledForm.Actions>
            </StyledForm>
          </>
        )}
      </StyledScrollView>
    </StyledPage>
  );
}
