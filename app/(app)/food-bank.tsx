import { Linking } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, Stack } from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { COLORS } from "../../src/theme/colors";

export default function FoodBankScreen() {
  return (
    <FeatureGate feature="community-food-bank">
      <FoodBankScreenContent />
    </FeatureGate>
  );
}

function FoodBankScreenContent() {
  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header title="Food Bank" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.sage} style={{ marginBottom: 8 }}>
          COMMUNITY · FOOD BANK
        </StyledText>
        <StyledText fontSize={22} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          It only takes a little to make a lot
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 24, lineHeight: 20 }}>
          Just like the two fish and five loaves, your small gift can make a huge impact.
        </StyledText>

        <StyledText fontSize={14} color={COLORS.inkSoft} style={{ marginBottom: 22, lineHeight: 21 }}>
          Every third Sunday, Winners Chapel Peterborough extends a hand of hope through our food bank at Ormiston Bushfield
          Academy. Your generous donation helps fill bags with essential food items for those in need.
        </StyledText>

        <Stack gap={18}>
          <Stack horizontal gap={14}>
            <Stack width={40} height={40} borderRadius={20} backgroundColor={COLORS.sageSoft} alignItems="center" justifyContent="center">
              <Icon name="shopping-bag" size={17} color={COLORS.sage} />
            </Stack>
            <Stack flex={1}>
              <StyledText fontSize={14.5} fontWeight="700" color={COLORS.ink} style={{ marginBottom: 4 }}>
                Bring essential non-perishable food items
              </StyledText>
              <StyledText fontSize={13} color={COLORS.inkSoft} style={{ lineHeight: 19 }}>
                Such as rice, pasta, tinned foods, cereals, and toiletries — dropped off directly at the church.
              </StyledText>
            </Stack>
          </Stack>

          <Stack horizontal gap={14}>
            <Stack width={40} height={40} borderRadius={20} backgroundColor={COLORS.sageSoft} alignItems="center" justifyContent="center">
              <Icon name="home" size={17} color={COLORS.sage} />
            </Stack>
            <Stack flex={1}>
              <StyledText fontSize={14.5} fontWeight="700" color={COLORS.ink} style={{ marginBottom: 4 }}>
                Or give financially
              </StyledText>
              <StyledText fontSize={13} color={COLORS.inkSoft} style={{ lineHeight: 19 }}>
                Speak to any church official, or contact us to arrange your donation:
              </StyledText>
              <Stack marginTop={6} gap={2}>
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
