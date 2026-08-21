import { Animated, Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  Stack,
} from "fluent-styles";
import { Text } from "../../src/components/text";
import { FeatureGate } from "../../src/components/FeatureGate";
import { AppBackHeader } from "../../src/components/AppBackHeader";
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
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <AppBackHeader title="Free Transport" />
      <StyledScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 60 }}
      >
         <Stack
          width={42}
          height={4}
          borderRadius={999}
          backgroundColor={COLORS.gold}
          marginBottom={12}
        />
        {/* ── Hero Card ─────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 28 }, heroAnim]}>
          <Stack
            backgroundColor={COLORS.goldPale}
            borderRadius={26}
            overflow="hidden"
            style={SHADOW_CARD}
          >
            <Stack horizontal minHeight={220}>
              {/* Left: headline + badge */}
              <Stack
                flex={1}
                padding={22}
                paddingRight={8}
                alignItems="flex-start"
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
                    <Text
                      variant="display"
                      fontSize={25}
                      fontWeight="800"
                      color={COLORS.ink}
                      style={{ lineHeight: 30, marginBottom: 2 }}
                    >
                      Need a ride?
                    </Text>
                    <Text
                      variant="display"
                      fontSize={25}
                      fontWeight="800"
                      color={COLORS.goldDeep}
                      style={{ lineHeight: 30, marginBottom: 12}}
                    >
                      We’ve got you!
                    </Text>
                    <Text
                      fontSize={12.5}
                      color={COLORS.inkSoft}
                      style={{ lineHeight: 18 }}
                    >
                      Book a taxi, bring the receipt, and we’ll refund your fare
                      — it’s that simple.
                    </Text>
                  </Stack>
                </Stack>
                {/* Reassurance badge */}
              </Stack>
              {/* Right: car illustration */}
              <CarIllustration />
            </Stack>
            <Stack horizontal alignItems="center" gap={8} paddingHorizontal={20} paddingBottom={18}>
              <Icon name="shield" size={14} color={COLORS.goldDeep} />
              <Text
                fontSize={11.5}
                color={COLORS.inkSoft}
                style={{ flex: 1, lineHeight: 16 }}
              >
                We’re here to make your journey to church stress-free.
              </Text>
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── “How it works” header ──────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 16 }, headerAnim]}>
          <Stack horizontal alignItems="center" gap={10}>
            <Stack flex={1} height={1} backgroundColor={COLORS.goldPale} />
            <Stack alignItems="center">
              <Stack width={30} height={30} borderRadius={15} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center" marginBottom={5}>
                <Icon name="map" size={13} color={COLORS.goldDeep} />
              </Stack>
              <Text variant="title" fontSize={18} fontWeight="800" color={COLORS.ink}>
                How it works
              </Text>
            </Stack>
            <Stack flex={1} height={1} backgroundColor={COLORS.goldPale} />
          </Stack>
        </Animated.View>

        {/* ── Step 1 ───────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 12 }, step1Anim]}>
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={20}
            padding={18}
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
</Stack>
              <Stack flex={1}>
                <Text
                  variant="subtitle"
                  fontSize={15}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 4 }}
                >
                  Book your taxi
                </Text>
                <Text
                  fontSize={13}
                  color={COLORS.inkSoft}
                  style={{ lineHeight: 19 }}
                >
                  Arrange your own taxi to attend the service at a time that
                  suits you best.
                </Text>
              </Stack>
              <Stack
                  width={26}
                  height={26}
                  borderRadius={13}
                  backgroundColor={COLORS.goldDeep}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    fontSize={11}
                    fontWeight="800"
                    color={COLORS.white}
                  >
                    1
                  </Text>
                </Stack>
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Step 2 ───────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 12 }, step2Anim]}>
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={20}
            padding={18}
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
</Stack>

              <Stack flex={1}>
                <Text
                  variant="subtitle"
                  fontSize={15}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 4 }}
                >
                  Pay the fare
                </Text>
                <Text
                  fontSize={13}
                  color={COLORS.inkSoft}
                  style={{ lineHeight: 19 }}
                >
                  Pay the taxi driver as usual and make sure to ask for a
                  printed or digital receipt.
                </Text>
              </Stack>
             <Stack
                  width={26}
                  height={26}
                  borderRadius={13}
                  backgroundColor={COLORS.goldDeep}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    fontSize={11}
                    fontWeight="800"
                    color={COLORS.white}
                  >
                    2
                  </Text>
                </Stack>
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Step 3 ───────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 24 }, step3Anim]}>
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={20}
            padding={18}
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
</Stack>
              <Stack flex={1}>
                <Text
                  variant="subtitle"
                  fontSize={15}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 4 }}
                >
                  Submit your receipt
                </Text>
                <Text
                  fontSize={13}
                  color={COLORS.inkSoft}
                  style={{ lineHeight: 19 }}
                >
                  Give us your taxi receipt after the service and we’ll fully
                  refund your fare.
                </Text>
              </Stack>
             <Stack
                  width={26}
                  height={26}
                  borderRadius={13}
                  backgroundColor={COLORS.goldDeep}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    fontSize={11}
                    fontWeight="800"
                    color={COLORS.white}
                  >
                    3
                  </Text>
                </Stack>
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Help / Contact Card ───────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 20 }, helpAnim]}>
          <Stack
            backgroundColor={COLORS.sageSoft}
            borderRadius={22}
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
                <Text
                  variant="subtitle"
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 4 }}
                >
                  Need help?
                </Text>
                <Text
                  fontSize={13}
                  color={COLORS.inkSoft}
                  style={{ lineHeight: 19 }}
                >
                  If you need assistance with booking or claiming, call:
                </Text>
              </Stack>
              <Stack opacity={0.85} marginTop={-4}>
                <SupportIllustration />
              </Stack>
            </Stack>

            {/* Premium full-width phone actions */}
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
                    paddingHorizontal: 14,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "rgba(66,122,93,0.16)",
                    backgroundColor: COLORS.white,
                  }}
                >
                  <Stack horizontal alignItems="center" gap={11}>
                    <Stack width={34} height={34} borderRadius={17} backgroundColor={COLORS.sageSoft} alignItems="center" justifyContent="center">
                      <Icon name="phone" size={14} color={COLORS.sage} />
                    </Stack>
                    <Stack flex={1}>
                      <Text variant="overline" fontSize={10.5} color={COLORS.inkSoft} style={{ marginBottom: 1 }}>
                        CALL US
                      </Text>
                      <Text variant="button" fontSize={13.5} fontWeight="800" color={COLORS.ink}>
                        {number}
                      </Text>
                    </Stack>
                    <Icon name="chevron-right" size={19} color={COLORS.sage} />
                  </Stack>
                </ScalePressable>
              ))}
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Footer Info Card ────────────────────────────────────────────── */}
        <Animated.View style={footerAnim}>
          <Stack backgroundColor={COLORS.goldPale} borderRadius={20} padding={16} style={SHADOW_SOFT}>
            <Stack horizontal alignItems="center" gap={12}>
              <Stack
                width={38}
                height={38}
                borderRadius={19}
                backgroundColor={COLORS.white}
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon name="info" size={16} color={COLORS.goldDeep} />
              </Stack>
              <Text
                fontSize={13}
                color={COLORS.goldDeep}
                style={{ flex: 1, lineHeight: 20 }}
              >
                This service is provided to help you attend church.{"\n"}We’re
                happy to support you!
              </Text>
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