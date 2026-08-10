import { View } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledButton, Stack } from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import {
  ChurchIllustration,
  BibleIllustration,
  WorshipIllustration,
  SERVICE_ILLUSTRATIONS,
} from "../../src/components/illustrations/ServiceIllustrations";
import { useRegularServices } from "../../src/hooks/useChurchData";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import { COLORS, ICON_TONES } from "../../src/theme/colors";
import { SHADOW_CARD } from "../../src/theme/shadows";
import type { RegularService } from "../../src/api/types";

// ── Helpers ──────────────────────────────────────────────────────────────────────────

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatRecurrence(days: number[] | undefined): string | null {
  if (!days?.length) return null;
  const names = days.map((d) => WEEKDAY_NAMES[d] ?? "").filter(Boolean);
  if (!names.length) return null;
  if (names.length === 1) return `Every ${names[0]}`;
  return `Every ${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

export default function ServiceTimesScreen() {
  return (
    <FeatureGate feature="service-times">
      <ServiceTimesScreenContent />
    </FeatureGate>
  );
}

function ServiceTimesScreenContent() {
  const { data: services } = useRegularServices();
  const { hasFeature } = useFeatureFlags();

  // Attendance always starts here — service is fully known from this card's
  // data and handed over via nav params so check-in never needs to re-fetch.
  function handleSubmitAttendance(service: RegularService) {
    router.push({
      pathname: "/check-in",
      params: {
        serviceId: service._id ?? "",
        title: service.title,
        startTime: service.start_time,
        endTime: service.end_time,
        days: JSON.stringify(service.days ?? []),
      },
    });
  }

  function handleViewAgenda() {
    router.push("/events");
  }

  return (
    <StyledPage showStatusBar backgroundColor={COLORS.paper}>
      <StyledPage.Header
        marginHorizontal={16}
        title="Service times"
        titleAlignment="center"
        showBackArrow
        onBackPress={() => router.back()}
      />
      <StyledScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>

        {/* Tagline */}
        <StyledText
          fontSize={14}
          color={COLORS.inkSoft}
          style={{ textAlign: "center", lineHeight: 22, marginBottom: 30, paddingHorizontal: 10 }}
        >
          Come and be refreshed in God&apos;s presence{"\n"}during our uplifting service times.
        </StyledText>

        {/* Empty state */}
        {(!services || services.length === 0) && (
          <StyledText fontSize={14} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
            Service times are being updated — please check back shortly.
          </StyledText>
        )}

        {/* Service cards */}
        <Stack gap={20}>
          {services?.map((service, i) => {
            const tone = ICON_TONES[i % ICON_TONES.length];
            const recurrence = formatRecurrence(service.days);
            const Illustration = SERVICE_ILLUSTRATIONS[i % SERVICE_ILLUSTRATIONS.length];

            return (
              <View
                key={service._id ?? i}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 18,
                  borderLeftWidth: 4,
                  borderLeftColor: tone.fg,
                  ...SHADOW_CARD,
                }}
              >
                <View style={{ padding: 18 }}>

                  {/* ── Card header: clock badge + title + faded illustration ── */}
                  <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 14 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          backgroundColor: tone.bg,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon name="clock" size={21} color={tone.fg} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <StyledText fontSize={18} fontWeight="800" color={COLORS.ink} numberOfLines={2}>
                          {service.title}
                        </StyledText>
                        {recurrence ? (
                          <StyledText fontSize={12.5} fontWeight="700" color={tone.fg} style={{ marginTop: 2 }}>
                            {recurrence}
                          </StyledText>
                        ) : null}
                      </View>
                    </View>
                    {/* Faded decorative illustration — never blocks text */}
                    <View style={{ opacity: 0.17, marginTop: -6, marginRight: -4, marginLeft: 4 }}>
                      <Illustration color={tone.fg} />
                    </View>
                  </View>

                  {/* ── Detail rows with icons ── */}
                  <Stack gap={8} style={{ marginBottom: 14 }}>
                    {recurrence ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                        <Icon name="calendar" size={13} color={tone.fg} />
                        <StyledText fontSize={13} color={COLORS.inkSoft}>{recurrence}</StyledText>
                      </View>
                    ) : null}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                      <Icon name="clock" size={13} color={tone.fg} />
                      <StyledText fontSize={13} color={COLORS.inkSoft}>
                        {service.start_time} – {service.end_time}
                      </StyledText>
                    </View>
                    {!service.remote ? (
                      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 9 }}>
                        <Icon name="map-pin" size={13} color={tone.fg} style={{ marginTop: 1 }} />
                        <StyledText fontSize={13} color={COLORS.inkSoft} style={{ flex: 1, lineHeight: 18 }}>
                          Ormiston Bushfield Academy, Peterborough PE2 5RQ
                        </StyledText>
                      </View>
                    ) : null}
                  </Stack>

                  {/* ── Description ── */}
                  {service.description ? (
                    <StyledText
                      fontSize={13}
                      color={COLORS.inkSoft}
                      style={{ lineHeight: 19, marginBottom: 14 }}
                    >
                      {service.description}
                    </StyledText>
                  ) : null}

                  {/* ── Divider ── */}
                  <View style={{ height: 1, backgroundColor: COLORS.chromeBorder, marginBottom: 14 }} />

                  {/* ── Action buttons: equal width, side by side ── */}
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {hasFeature("attendance") && (
                      <StyledButton
                        outline
                        compact
                        onPress={() => handleSubmitAttendance(service)}
                        accessibilityLabel={`Submit attendance for ${service.title}`}
                        borderColor={tone.fg}
                        style={{ flex: 1 }}
                      >
                        <Stack horizontal alignItems="center" justifyContent="center" gap={6}>
                          <Icon name="check-circle" size={14} color={tone.fg} />
                          <StyledText fontSize={12.5} fontWeight="700" color={tone.fg}>
                            Submit attendance
                          </StyledText>
                        </Stack>
                      </StyledButton>
                    )}
                    <StyledButton
                      outline
                      compact
                      onPress={handleViewAgenda}
                      accessibilityLabel={`View agenda for ${service.title}`}
                      borderColor={tone.fg}
                      style={{ flex: 1 }}
                    >
                      <Stack horizontal alignItems="center" justifyContent="center" gap={6}>
                        <Icon name="calendar" size={14} color={tone.fg} />
                        <StyledText fontSize={12.5} fontWeight="700" color={tone.fg}>
                          View agenda
                        </StyledText>
                      </Stack>
                    </StyledButton>
                  </View>

                </View>
              </View>
            );
          })}
        </Stack>

        {/* Footer disclaimer */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            marginTop: 28,
          }}
        >
          <Icon name="shield" size={13} color={COLORS.inkSoft} />
          <StyledText fontSize={12} color={COLORS.inkSoft}>
            Service times may be subject to change.
          </StyledText>
        </View>

      </StyledScrollView>
    </StyledPage>
  );
}
