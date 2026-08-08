import { Linking } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, Stack } from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { COLORS } from "../../src/theme/colors";

const STEPS = [
  { icon: "truck", title: "Book your taxi", desc: "Arrange your own taxi to attend the service at a time that suits you best." },
  { icon: "file-text", title: "Pay the fare", desc: "Pay the taxi driver as usual and make sure to ask for a printed or digital receipt." },
  { icon: "refresh-cw", title: "Submit your receipt", desc: "Give us your taxi receipt after the service and we'll fully refund your fare." },
];

export default function FreeTransportScreen() {
  return (
    <FeatureGate feature="free-transport">
      <FreeTransportScreenContent />
    </FeatureGate>
  );
}

function FreeTransportScreenContent() {
  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header title="Free Transport" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <StyledText fontSize={22} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Need a ride? We've got you!
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 26, lineHeight: 20 }}>
          Book a taxi, bring the receipt, and we'll refund your fare — it's that simple.
        </StyledText>

        <Stack gap={20}>
          {STEPS.map((step) => (
            <Stack key={step.title} horizontal gap={14}>
              <Stack width={40} height={40} borderRadius={20} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center">
                <Icon name={step.icon as any} size={17} color={COLORS.goldDeep} />
              </Stack>
              <Stack flex={1}>
                <StyledText fontSize={14.5} fontWeight="700" color={COLORS.ink} style={{ marginBottom: 4 }}>
                  {step.title}
                </StyledText>
                <StyledText fontSize={13} color={COLORS.inkSoft} style={{ lineHeight: 19 }}>
                  {step.desc}
                </StyledText>
              </Stack>
            </Stack>
          ))}
          <Stack horizontal gap={14}>
            <Stack width={40} height={40} borderRadius={20} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center">
              <Icon name="phone" size={17} color={COLORS.goldDeep} />
            </Stack>
            <Stack flex={1}>
              <StyledText fontSize={14.5} fontWeight="700" color={COLORS.ink} style={{ marginBottom: 4 }}>
                Need help?
              </StyledText>
              <StyledText fontSize={13} color={COLORS.inkSoft} style={{ lineHeight: 19, marginBottom: 6 }}>
                If you need assistance with booking or claiming, call:
              </StyledText>
              <Stack gap={2}>
                <StyledText fontSize={13.5} fontWeight="700" color={COLORS.goldDeep} onPress={() => Linking.openURL("tel:07888230650")}>
                  07888 230 650
                </StyledText>
                <StyledText fontSize={13.5} fontWeight="700" color={COLORS.goldDeep} onPress={() => Linking.openURL("tel:07776696504")}>
                  07776 696 504
                </StyledText>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </StyledScrollView>
    </StyledPage>
  );
}
