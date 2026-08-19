import { Linking } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  StyledButton,
  Stack,
} from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { AppBackHeader } from "../../src/components/AppBackHeader";
import {
  ChurchIllustration,
  BibleIllustration,
  WorshipIllustration,
  SERVICE_ILLUSTRATIONS,
} from "../../src/components/illustrations/ServiceIllustrations";
import { useRegularServices } from "../../src/hooks/useChurchData";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import {
  formatServiceDayNames,
  isServiceDay,
} from "../../src/lib/service-days";
import { COLORS, ICON_TONES } from "../../src/theme/colors";
import { SHADOW_CARD } from "../../src/theme/shadows";
import type { RegularService } from "../../src/api/types";

// ── Helpers ──────────────────────────────────────────────────────────────────────────

function formatRecurrence(days: number[] | undefined): string | null {
  const names = formatServiceDayNames(days);
  return names ? `Every ${names}` : null;
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

  function handleJoinOnline(remoteLink: string) {
    const url = /^https?:\/\//i.test(remoteLink)
      ? remoteLink
      : `https://${remoteLink}`;
    Linking.openURL(url);
  }

  return (
    <StyledPage showStatusBar backgroundColor={COLORS.paper}>
      <AppBackHeader title="Service Times" />
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
          marginBottom={12}
        />
        {/* Tagline */}
        <StyledText
          fontSize={14}
          color={COLORS.inkSoft}
          style={{
            textAlign: "center",
            lineHeight: 22,
            marginBottom: 30,
            paddingHorizontal: 10,
          }}
        >
          Come and be refreshed in God&apos;s presence{"\n"}during our uplifting
          service times.
        </StyledText>

        {/* Empty state */}
        {(!services || services.length === 0) && (
          <StyledText
            fontSize={14}
            color={COLORS.inkSoft}
            style={{ textAlign: "center" }}
          >
            Service times are being updated — please check back shortly.
          </StyledText>
        )}

        {/* Service cards */}
        <Stack gap={20}>
          {services?.map((service, i) => {
            const tone = ICON_TONES[i % ICON_TONES.length];
            const recurrence = formatRecurrence(service.days);
            const Illustration =
              SERVICE_ILLUSTRATIONS[i % SERVICE_ILLUSTRATIONS.length];
            const canCheckIn = isServiceDay(service.days);

            return (
              <Stack
                key={service._id ?? i}
                backgroundColor={COLORS.white}
                borderRadius={18}
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: tone.fg,
                  ...SHADOW_CARD,
                }}
              >
                <Stack padding={18}>
                  {/* ── Card header: clock badge + title + faded illustration ── */}
                  <Stack
                    horizontal
                    alignItems="flex-start"
                    marginBottom={14}
                  >
                    <Stack
                      horizontal
                      alignItems="center"
                      gap={12}
                      style={{ flex: 1 }}
                    >
                      <Stack
                        width={50}
                        height={50}
                        borderRadius={25}
                        backgroundColor={tone.bg}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon name="clock" size={21} color={tone.fg} />
                      </Stack>
                      <Stack style={{ flex: 1 }}>
                        <StyledText
                          fontSize={18}
                          fontWeight="800"
                          color={COLORS.ink}
                          numberOfLines={2}
                        >
                          {service.title}
                        </StyledText>
                        {recurrence ? (
                          <StyledText
                            fontSize={12.5}
                            fontWeight="700"
                            color={tone.fg}
                            style={{ marginTop: 2 }}
                          >
                            {recurrence}
                          </StyledText>
                        ) : null}
                      </Stack>
                    </Stack>
                    {/* Faded decorative illustration — never blocks text */}
                    <Stack
                      opacity={0.17}
                      marginTop={-6}
                      marginRight={-4}
                      marginLeft={4}
                    >
                      <Illustration color={tone.fg} />
                    </Stack>
                  </Stack>

                  {/* ── Detail rows with icons ── */}
                  <Stack gap={8} style={{ marginBottom: 14 }}>
                    {recurrence ? (
                      <Stack horizontal alignItems="center" gap={9}>
                        <Icon name="calendar" size={13} color={tone.fg} />
                        <StyledText fontSize={13} color={COLORS.inkSoft}>
                          {recurrence}
                        </StyledText>
                      </Stack>
                    ) : null}
                    <Stack horizontal alignItems="center" gap={9}>
                      <Icon name="clock" size={13} color={tone.fg} />
                      <StyledText fontSize={13} color={COLORS.inkSoft}>
                        {service.start_time} – {service.end_time}
                      </StyledText>
                    </Stack>
                    {!service.remote ? (
                      <Stack horizontal alignItems="flex-start" gap={9}>
                        <Icon
                          name="map-pin"
                          size={13}
                          color={tone.fg}
                          style={{ marginTop: 1 }}
                        />
                        <StyledText
                          fontSize={13}
                          color={COLORS.inkSoft}
                          style={{ flex: 1, lineHeight: 18 }}
                        >
                          Ormiston Bushfield Academy, Peterborough PE2 5RQ
                          
                        </StyledText>
                      </Stack>
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
                  <Stack
                    height={1}
                    backgroundColor={COLORS.chromeBorder}
                    marginBottom={14}
                  />

                  {/* ── Action buttons: equal width, side by side ── */}
                  <Stack horizontal gap={10}>
                    {service.remote && service.remote_link?.trim() && (
                      <StyledButton
                        backgroundColor={COLORS.gold}
                        compact
                        onPress={() =>
                          handleJoinOnline(service.remote_link!.trim())
                        }
                        accessibilityLabel={`Join ${service.title} online`}
                        style={{ flex: 1 }}
                      >
                        <Stack
                          horizontal
                          alignItems="center"
                          justifyContent="center"
                          gap={6}
                        >
                          <Icon
                            name="external-link"
                            size={14}
                            color={COLORS.indigoDeep}
                          />
                          <StyledText
                            fontSize={12.5}
                            fontWeight="700"
                            color={COLORS.ink}
                          >
                            Join online
                          </StyledText>
                        </Stack>
                      </StyledButton>
                    )}
                    {hasFeature("attendance") && (
                      <StyledButton
                        backgroundColor={COLORS.chrome}
                        compact
                        disabled={!canCheckIn}
                        onPress={() => handleSubmitAttendance(service)}
                        accessibilityLabel={
                          canCheckIn
                            ? `Submit attendance for ${service.title}`
                            : `Check-in for ${service.title} is only available on ${formatServiceDayNames(service.days) ?? "its service day"}`
                        }
                        borderColor={tone.fg}
                        style={{ flex: 1 }}
                      >
                        <Stack
                          horizontal
                          alignItems="center"
                          justifyContent="center"
                          gap={6}
                        >
                          <Icon name="check-circle" size={14} color={tone.fg} />
                          <StyledText
                            fontSize={12.5}
                            fontWeight="700"
                            color={tone.fg}
                          >
                            Check In
                          </StyledText>
                        </Stack>
                      </StyledButton>
                    )}
                    {!service.remote && (
                      <StyledButton
                        outline
                        compact
                        onPress={handleViewAgenda}
                        accessibilityLabel={`View agenda for ${service.title}`}
                        borderColor={tone.fg}
                        style={{ flex: 1 }}
                      >
                        <Stack
                          horizontal
                          alignItems="center"
                          justifyContent="center"
                          gap={6}
                        >
                          <Icon name="calendar" size={14} color={tone.fg} />
                          <StyledText
                            fontSize={12.5}
                            fontWeight="700"
                            color={tone.fg}
                          >
                            View agenda
                          </StyledText>
                        </Stack>
                      </StyledButton>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            );
          })}
        </Stack>

        {/* Footer disclaimer */}
        <Stack
          horizontal
          alignItems="center"
          justifyContent="center"
          gap={7}
          marginTop={28}
        >
          <Icon name="shield" size={13} color={COLORS.inkSoft} />
          <StyledText fontSize={12} color={COLORS.inkSoft}>
            Service times may be subject to change.
          </StyledText>
        </Stack>
      </StyledScrollView>
    </StyledPage>
  );
}
