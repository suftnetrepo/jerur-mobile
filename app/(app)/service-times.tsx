import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledCard, StyledButton, Stack } from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { useRegularServices } from "../../src/hooks/useChurchData";
import { COLORS, ICON_TONES } from "../../src/theme/colors";

export default function ServiceTimesScreen() {
  return (
    <FeatureGate feature="service-times">
      <ServiceTimesScreenContent />
    </FeatureGate>
  );
}

function ServiceTimesScreenContent() {
  const { data: services } = useRegularServices();

  return (
    <StyledPage showStatusBar backgroundColor={COLORS.paper}>
      <StyledPage.Header marginHorizontal={16} title="Service times" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 20, textAlign: "center" }}>
          Come and be refreshed in God's presence during our uplifting service times.
        </StyledText>
        <Stack gap={14}>
          {(!services || services.length === 0) && (
            <StyledText fontSize={14} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
              Service times are being updated — please check back shortly.
            </StyledText>
          )}
          {services?.map((service, i) => {
            const tone = ICON_TONES[i % ICON_TONES.length];
            return (
              <StyledCard key={service._id ?? i} shadow="light" padding={18} borderRadius={14}>
                <Stack width={44} height={44} borderRadius={22} backgroundColor={tone.bg} alignItems="center" justifyContent="center" marginBottom={12}>
                  <Icon name="clock" size={19} color={tone.fg} />
                </Stack>
                <StyledText fontSize={18} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
                  {service.title}
                </StyledText>
                <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 4 }}>
                  {service.start_time} – {service.end_time}
                </StyledText>
                {!service.remote && (
                  <StyledText fontSize={13} color={COLORS.inkSoft}>
                    Ormiston Bushfield Academy, Peterborough PE2 5RQ
                  </StyledText>
                )}
                {service.description && (
                  <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginTop: 8 }}>
                    {service.description}
                  </StyledText>
                )}
              </StyledCard>
            );
          })}
        </Stack>
      </StyledScrollView>
    </StyledPage>
  );
}
