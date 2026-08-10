import { Animated, Linking } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  Stack,
  StyledSpacer,
} from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { ScalePressable } from "../../src/components/ScalePressable";
import {
  CarIllustration,
  SupportIllustration,
  FooterChurchIllustration,
} from "../../src/components/illustrations/TransportIllustrations";
import { useFadeUp } from "../../src/hooks/useFadeUp";
import { COLORS } from "../../src/theme/colors";
import { SHADOW_SOFT, SHADOW_CARD } from "../../src/theme/shadows";

export default function FreeTransportScreen() {
  return (
    <FeatureGate feature="free-transport">
      <FreeTransportScreenContent />
    </FeatureGate>
  );
}

function FreeTransportScreenContent() {
  const heroAnim = useFadeUp(0);
  const headerAnim = useFadeUp(120);
  const step1Anim = useFadeUp(200);
  const step2Anim = useFadeUp(270);
  const step3Anim = useFadeUp(340);
  const helpAnim = useFadeUp(420);
  const footerAnim = useFadeUp(490);

  return (
    <StyledPage  backgroundColor={COLORS.paper}>
      <StyledPage.Header
        title="Free Transport"
        titleAlignment="center"
        marginHorizontal={16}
        showBackArrow
        onBackPress={() => router.back()}
      />
      <StyledScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      >
        {/* ── Hero Card ─────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 28 }, heroAnim]}>
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={22}
            overflow="hidden"
            style={SHADOW_CARD}
          >
            <Stack horizontal minHeight={220}>
              {/* Left: headline + badge */}
              <Stack
                flex={1}
                padding={20}
                paddingRight={12}
                alignItems="center"
                justifyContent="space-between"
              >
                {/* Gold accent bar + text */}
                <Stack horizontal gap={12}>
                  <Stack
                    width={4}
                    backgroundColor={COLORS.gold}
                    borderRadius={2}
                  />
                  <Stack flex={1}>
                    <StyledText
                      fontSize={25}
                      fontWeight="800"
                      color={COLORS.ink}
                      style={{ lineHeight: 30, marginBottom: 2 }}
                    >
                      Need a ride?
                    </StyledText>
                    <StyledText
                      fontSize={25}
                      fontWeight="800"
                      color={COLORS.gold}
                      style={{ lineHeight: 30, marginBottom: 12 }}
                    >
                      We’ve got you!
                    </StyledText>
                    <StyledText
                      fontSize={12.5}
                      color={COLORS.inkSoft}
                      style={{ lineHeight: 18 }}
                    >
                      Book a taxi, bring the receipt, and we’ll refund your fare
                      — it’s that simple.
                    </StyledText>
                  </Stack>
                </Stack>
                {/* Reassurance badge */}
              </Stack>
              {/* Right: car illustration */}
              <CarIllustration />
            </Stack>
            <Stack horizontal alignItems="center" gap={8} padding={10}>
              <Icon name="shield" size={14} color={COLORS.goldDeep} />
              <StyledText
                fontSize={11.5}
                color={COLORS.inkSoft}
                style={{ flex: 1, lineHeight: 16 }}
              >
                We’re here to make your journey to church stress-free.
              </StyledText>
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── “How it works” header ──────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 16 }, headerAnim]}>
          <Stack horizontal alignItems="center" gap={12}>
            <StyledText fontSize={18} fontWeight="800" color={COLORS.ink}>
              How it works
            </StyledText>
            <Stack flex={1} height={1} backgroundColor={COLORS.chromeBorder} />
          </Stack>
        </Animated.View>

        {/* ── Step 1 ───────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 12 }, step1Anim]}>
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={16}
            padding={16}
            style={SHADOW_SOFT}
          >
            <Stack
              horizontal
              alignItems="center"
              justifyContent="space-between"
              gap={14}
            >
              {/* Icon circle + number badge */}
              <Stack
                horizontal
                justifyContent="center"
                alignItems="center"
                width={66}
                height={66}
              >
                <Stack
                  width={56}
                  height={56}
                  borderRadius={28}
                  backgroundColor={COLORS.goldPale}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon name="truck" size={22} color={COLORS.goldDeep} />
                </Stack>
                <StyledSpacer marginHorizontal={8} />
                <Stack
                  width={22}
                  height={22}
                  borderRadius={11}
                  backgroundColor={COLORS.gold}
                  alignItems="center"
                  justifyContent="center"
                >
                  <StyledText
                    fontSize={11}
                    fontWeight="800"
                    color={COLORS.white}
                  >
                    1
                  </StyledText>
                </Stack>
              </Stack>
              <Stack flex={1}>
                <StyledText
                  fontSize={15}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 4 }}
                >
                  Book your taxi
                </StyledText>
                <StyledText
                  fontSize={13}
                  color={COLORS.inkSoft}
                  style={{ lineHeight: 19 }}
                >
                  Arrange your own taxi to attend the service at a time that
                  suits you best.
                </StyledText>
              </Stack>
              <Icon
                name="chevron-right"
                size={16}
                color={COLORS.chromeBorder}
              />
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Step 2 ───────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 12 }, step2Anim]}>
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={16}
            padding={16}
            style={SHADOW_SOFT}
          >
            <Stack
              horizontal
              alignItems="center"
              justifyContent="space-between"
              gap={14}
            >
              {/* Icon circle + number badge */}
              <Stack
                horizontal
                justifyContent="center"
                alignItems="center"
                width={66}
                height={66}
              >
                <Stack
                  width={56}
                  height={56}
                  borderRadius={28}
                  backgroundColor={COLORS.goldPale}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon name="file-text" size={22} color={COLORS.goldDeep} />
                </Stack>
                <StyledSpacer marginHorizontal={8} />
                <Stack
                  width={22}
                  height={22}
                  borderRadius={11}
                  backgroundColor={COLORS.gold}
                  alignItems="center"
                  justifyContent="center"
                >
                  <StyledText
                    fontSize={11}
                    fontWeight="800"
                    color={COLORS.white}
                  >
                    2
                  </StyledText>
                </Stack>
              </Stack>

              <Stack flex={1}>
                <StyledText
                  fontSize={15}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 4 }}
                >
                  Pay the fare
                </StyledText>
                <StyledText
                  fontSize={13}
                  color={COLORS.inkSoft}
                  style={{ lineHeight: 19 }}
                >
                  Pay the taxi driver as usual and make sure to ask for a
                  printed or digital receipt.
                </StyledText>
              </Stack>
              <Icon
                name="chevron-right"
                size={16}
                color={COLORS.chromeBorder}
              />
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Step 3 ───────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 24 }, step3Anim]}>
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={16}
            padding={16}
            style={SHADOW_SOFT}
          >
            <Stack
              horizontal
              alignItems="center"
              justifyContent="space-between"
              gap={14}
            >
              {/* Icon circle + number badge */}
              <Stack
                horizontal
                justifyContent="center"
                alignItems="center"
                width={66}
                height={66}
              >
                <Stack
                  width={56}
                  height={56}
                  borderRadius={28}
                  backgroundColor={COLORS.goldPale}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon name="upload" size={22} color={COLORS.goldDeep} />
                </Stack>
                <StyledSpacer marginHorizontal={16} />
                <Stack
                  width={22}
                  height={22}
                  borderRadius={11}
                  backgroundColor={COLORS.gold}
                  alignItems="center"
                  justifyContent="center"
                >
                  <StyledText
                    fontSize={11}
                    fontWeight="800"
                    color={COLORS.white}
                  >
                    3
                  </StyledText>
                </Stack>
              </Stack>
              <Stack flex={1}>
                <StyledText
                  fontSize={15}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 4 }}
                >
                  Submit your receipt
                </StyledText>
                <StyledText
                  fontSize={13}
                  color={COLORS.inkSoft}
                  style={{ lineHeight: 19 }}
                >
                  Give us your taxi receipt after the service and we’ll fully
                  refund your fare.
                </StyledText>
              </Stack>
              <Icon
                name="chevron-right"
                size={16}
                color={COLORS.chromeBorder}
              />
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Help / Contact Card ───────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 20 }, helpAnim]}>
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={18}
            padding={18}
            style={SHADOW_SOFT}
          >
            <Stack
              horizontal
              alignItems="flex-start"
              gap={14}
              marginBottom={16}
            >
              <Stack
                width={50}
                height={50}
                borderRadius={25}
                backgroundColor={COLORS.sageSoft}
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon name="headphones" size={20} color={COLORS.sage} />
              </Stack>
              <Stack flex={1}>
                <StyledText
                  fontSize={16}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 4 }}
                >
                  Need help?
                </StyledText>
                <StyledText
                  fontSize={13}
                  color={COLORS.inkSoft}
                  style={{ lineHeight: 19 }}
                >
                  If you need assistance with booking or claiming, call:
                </StyledText>
              </Stack>
              <Stack opacity={0.85} marginTop={-4}>
                <SupportIllustration />
              </Stack>
            </Stack>

            {/* Phone buttons — side by side */}
            <Stack horizontal gap={10}>
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
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderRadius: 50,
                    borderWidth: 1.5,
                    borderColor: COLORS.sage,
                    backgroundColor: COLORS.white,
                  }}
                >
                  <Stack
                    horizontal
                    alignItems="center"
                    justifyContent="center"
                    gap={6}
                  >
                    <Icon name="phone" size={13} color={COLORS.sage} />
                    <StyledText
                      fontSize={13}
                      fontWeight="700"
                      color={COLORS.sage}
                    >
                      {number}
                    </StyledText>
                  </Stack>
                </ScalePressable>
              ))}
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Footer Info Card ────────────────────────────────────────────── */}
        <Animated.View style={footerAnim}>
          <Stack backgroundColor="#EEF2FF" borderRadius={16} padding={16}>
            <Stack horizontal alignItems="center" gap={12}>
              <Stack
                width={38}
                height={38}
                borderRadius={19}
                backgroundColor="rgba(99,102,241,0.15)"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon name="info" size={16} color="#4F46E5" />
              </Stack>
              <StyledText
                fontSize={13}
                color="#4F46E5"
                style={{ flex: 1, lineHeight: 20 }}
              >
                This service is provided to help you attend church.{"\n"}We’re
                happy to support you!
              </StyledText>
              <Stack opacity={0.7}>
                <FooterChurchIllustration />
              </Stack>
            </Stack>
          </Stack>
        </Animated.View>
      </StyledScrollView>
    </StyledPage>
  );
}
