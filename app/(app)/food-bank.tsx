import { Animated, Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, Stack } from "fluent-styles";
import { Text } from "../../src/components/text";
import { FeatureGate } from "../../src/components/FeatureGate";
import { AppBackHeader } from "../../src/components/AppBackHeader";
import { ScalePressable } from "../../src/components/ScalePressable";
import {
  FoodBoxIllustration,
  HeartHandsSvg,
  GroceryIllustration,
  DonationHandsIllustration,
} from "../../src/components/illustrations/FoodBankIllustrations";
import { useFadeUp } from "../../src/hooks/useFadeUp";
import { COLORS } from "../../src/theme/colors";
import { SHADOW_SOFT, SHADOW_CARD } from "../../src/theme/shadows";

// ── Screen ─────────────────────────────────────────────────────────────────

export default function FoodBankScreen() {
  return (
    <FeatureGate feature="community-food-bank">
      <FoodBankScreenContent />
    </FeatureGate>
  );
}

function FoodBankScreenContent() {
  const heroAnim = useFadeUp(0);
  const missionAnim = useFadeUp(120);
  const waysAnim = useFadeUp(220);
  const donateAnim = useFadeUp(300);
  const giveAnim = useFadeUp(380);
  const footerAnim = useFadeUp(460);

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <AppBackHeader title="Food Bank" />
      <StyledScrollView contentContainerStyle={{  paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 60,}}>
        <Stack
          width={42}
          height={4}
          borderRadius={999}
          backgroundColor={COLORS.gold}
          marginBottom={12}
        />

        {/* ── Hero Card ─────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 16 }, heroAnim]}>
          <Stack backgroundColor={COLORS.white} borderRadius={26} overflow="hidden" style={SHADOW_CARD}>
            <Stack horizontal minHeight={232} backgroundColor={COLORS.goldPale}>
              {/* Left: text column */}
              <Stack flex={1} padding={20} paddingRight={10} justifyContent="center">
                <Text variant="display" fontSize={25} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 30, marginBottom: 2 }}>
                  It only takes a little to{" "}
                </Text>
                <Text variant="display" fontSize={25} fontWeight="800" color={COLORS.goldDeep} style={{ lineHeight: 30, marginBottom: 10 }}>
                  make a lot
                </Text>
                {/* Gold accent underline */}
                <Stack width={34} height={3} backgroundColor={COLORS.gold} borderRadius={2} marginBottom={12} />
                <Text fontSize={12.5} color={COLORS.inkSoft} style={{ lineHeight: 18 }}>
                  Just like the two fish and five loaves, your small gift can make a huge impact.
                </Text>
              </Stack>
              {/* Right: food illustration */}
              <FoodBoxIllustration />
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Mission Card ──────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 28 }, missionAnim]}>
          <Stack backgroundColor={COLORS.white} borderRadius={22} padding={18} style={SHADOW_SOFT}>
            <Stack horizontal alignItems="flex-start" gap={14}>
              {/* Icon badge */}
              <Stack
                width={50}
                height={50}
                borderRadius={25}
                backgroundColor={COLORS.sageSoft}
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <HeartHandsSvg color={COLORS.sage} size={24} />
              </Stack>
              {/* Mission text */}
              <Stack flex={1}>
                <Text fontSize={13.5} color={COLORS.inkSoft} style={{ lineHeight: 21 }}>
                  Every third Sunday, Winners Chapel Peterborough extends a hand of hope through our food bank at Ormiston Bushfield
                  Academy. Your generous donation helps fill bags with essential food items for those in need.
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Section Header: Ways you can help ─────────────────────────── */}
        <Animated.View style={[{ marginBottom: 20, alignItems: "center" }, waysAnim]}>
          <Icon name="heart" size={20} color={COLORS.gold} style={{ marginBottom: 8 }} />
          <Stack horizontal alignItems="center" gap={10}>
            <Stack flex={1} height={1.5} backgroundColor={COLORS.gold} opacity={0.5} />
            <Text variant="title" fontSize={18} fontWeight="800" color={COLORS.sage}>
              Ways you can help
            </Text>
            <Stack flex={1} height={1.5} backgroundColor={COLORS.gold} opacity={0.5} />
          </Stack>
        </Animated.View>

        {/* ── Donate Food Card ──────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 16 }, donateAnim]}>
          <Stack backgroundColor={COLORS.sageSoft} borderRadius={22} padding={18} style={SHADOW_SOFT}>
            <Stack horizontal alignItems="flex-start" gap={14}>
              {/* Left: icon + content */}
              <Stack flex={1}>
                <Stack horizontal alignItems="center" gap={12} marginBottom={12}>
                  <Stack
                    width={46}
                    height={46}
                    borderRadius={23}
                    backgroundColor={COLORS.sageSoft}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon name="shopping-bag" size={19} color={COLORS.sage} />
                  </Stack>
                  <Text variant="subtitle" fontSize={15} fontWeight="800" color={COLORS.ink} style={{ flex: 1, lineHeight: 21 }}>
                    Donate Food
                  </Text>
                </Stack>
                <Text fontSize={13} color={COLORS.inkSoft} style={{ lineHeight: 19 }}>
                  Such as rice, pasta, tinned foods, cereals, and toiletries — dropped off directly at the church.
                </Text>
              </Stack>
              {/* Right: grocery illustration */}
              <Stack opacity={0.9} marginTop={-4}>
                <GroceryIllustration />
              </Stack>
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Give Financially Card ─────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 28 }, giveAnim]}>
          <Stack backgroundColor={COLORS.goldPale} borderRadius={22} padding={18} style={SHADOW_SOFT}>
            <Stack horizontal alignItems="flex-start" gap={14} marginBottom={16}>
              {/* Left: icon + title + description */}
              <Stack flex={1}>
                <Stack horizontal alignItems="center" gap={12} marginBottom={10}>
                  <Stack
                    width={46}
                    height={46}
                    borderRadius={23}
                    backgroundColor="rgba(217,164,65,0.2)"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Icon name="home" size={20} color={COLORS.goldDeep} />
                  </Stack>
                  <Text variant="subtitle" fontSize={15} fontWeight="800" color={COLORS.ink} style={{ flex: 1, lineHeight: 21 }}>
                    Give financially
                  </Text>
                </Stack>
                <Text fontSize={13} color={COLORS.inkSoft} style={{ lineHeight: 19 }}>
                  Speak to any church official, or contact us to arrange your donation:
                </Text>
              </Stack>
              {/* Right: donation illustration */}
              <Stack opacity={0.85} marginTop={-4}>
                <DonationHandsIllustration />
              </Stack>
            </Stack>

            {/* Phone buttons — side by side, full card width */}
            <Stack gap={10}>
              {[
                { number: "07888 230 650", tel: "07888230650" },
                { number: "07776 696 504", tel: "07776696504" },
              ].map(({ number, tel }) => (
                <ScalePressable
                  key={tel}
                  onPress={() => Linking.openURL(`tel:${tel}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${number}`}
                  style={{
                    paddingVertical: 13,
                    paddingHorizontal: 8,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: COLORS.goldPale,
                    backgroundColor: COLORS.white,
                  }}
                >
                  <Stack horizontal alignItems="center" justifyContent="space-between" gap={8}>
                    <Stack horizontal alignItems="center" gap={8}>
                      <Icon name="phone" size={14} color={COLORS.goldDeep} />
                      <Text variant="button" fontSize={13} color={COLORS.ink}>
                      {number}
                      </Text>
                    </Stack>
                    <Icon name="chevron-right" size={18} color={COLORS.goldDeep} />
                  </Stack>
                </ScalePressable>
              ))}
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Thank You Footer Card ─────────────────────────────────────── */}
        <Animated.View style={footerAnim}>
          <Stack backgroundColor={COLORS.white} borderRadius={18} padding={16} style={SHADOW_SOFT}>
            <Stack horizontal alignItems="center" gap={12}>
              <Stack
                width={38}
                height={38}
                borderRadius={19}
                backgroundColor="rgba(94,112,82,0.15)"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon name="shield" size={16} color={COLORS.sage} />
              </Stack>
              <Text fontSize={13} color={COLORS.sage} style={{ flex: 1, lineHeight: 20 }}>
                Your kindness makes a difference.{"\n"}Thank you for being a blessing to our community.
              </Text>
            </Stack>
          </Stack>
        </Animated.View>

      </StyledScrollView>
    </StyledPage>
  );
}