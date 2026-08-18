import { Animated } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  Stack,
} from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { useFadeUp } from "../../../src/hooks/useFadeUp";
import { COLORS } from "../../../src/theme/colors";
import { SHADOW_CARD, SHADOW_SOFT } from "../../../src/theme/shadows";

export default function BfcScreen() {
  return (
    <FeatureGate feature="believers-foundation-class">
      <BfcScreenContent />
    </FeatureGate>
  );
}

function BfcScreenContent() {
  const heroAnim = useFadeUp(0);
  const aboutAnim = useFadeUp(140);
  const scheduleAnim = useFadeUp(260);

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <AppBackHeader title="Believers Foundation Class" />

      <StyledScrollView
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
          marginBottom={18}
        />

        {/* ── Premium scripture hero ───────────────────────────────────── */}
      

        {/* ── Purpose ──────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 28 }, aboutAnim]}>
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={22}
            padding={20}
            style={SHADOW_SOFT}
          >
            <Stack horizontal alignItems="center" gap={12} marginBottom={16}>
              <Stack
                width={44}
                height={44}
                borderRadius={22}
                backgroundColor={COLORS.sageSoft}
                alignItems="center"
                justifyContent="center"
              >
                <Icon name="anchor" size={19} color={COLORS.sage} />
              </Stack>

              <Stack flex={1}>
                <StyledText
                  fontSize={17}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 2 }}
                >
                  Build on solid ground
                </StyledText>
                <StyledText fontSize={11.5} color={COLORS.inkSoft}>
                  Grounded in the foundations of faith
                </StyledText>
              </Stack>
            </Stack>

            <StyledText
              fontSize={13.5}
              color={COLORS.inkSoft}
              style={{ lineHeight: 21, marginBottom: 14 }}
            >
              In the journey of life, foundations are vitally important to
              destiny. To make the most of one's Christian adventure, it is
              important to address the foundations of the faith. We are
              admonished to contend for the faith that was once delivered to the
              saints — Jude 3.
            </StyledText>

            <Stack
              height={1}
              backgroundColor={COLORS.chromeBorder}
              marginBottom={14}
            />

            <StyledText
              fontSize={13.5}
              color={COLORS.inkSoft}
              style={{ lineHeight: 21 }}
            >
              The purpose of the Believers Foundation Class is to ensure that we
              are all grounded in the foundations of faith that will ensure a
              profitable and colorful adventure in the Lord.
            </StyledText>
          </Stack>
        </Animated.View>

        {/* ── Schedule ─────────────────────────────────────────────────── */}
        <Animated.View style={scheduleAnim}>
          <Stack
            backgroundColor={COLORS.sageSoft}
            borderRadius={24}
            padding={20}
            overflow="hidden"
            style={SHADOW_SOFT}
          >
            <Stack horizontal alignItems="center" gap={12} marginBottom={18}>
              <Stack
                width={46}
                height={46}
                borderRadius={23}
                backgroundColor={COLORS.sage}
                alignItems="center"
                justifyContent="center"
              >
                <Icon name="calendar" size={19} color={COLORS.white} />
              </Stack>

              <Stack flex={1}>
                <StyledText
                  fontSize={10.5}
                  fontWeight="800"
                  letterSpacing={1}
                  color={COLORS.sage}
                  style={{ marginBottom: 3 }}
                >
                  WEEKLY CLASS
                </StyledText>
                <StyledText
                  fontSize={18}
                  fontWeight="800"
                  color={COLORS.ink}
                >
                  Every Tuesday · 7PM
                </StyledText>
              </Stack>
            </Stack>

            <Stack
              backgroundColor={COLORS.white}
              borderRadius={18}
              padding={17}
            >
              <StyledText
                fontSize={16}
                fontWeight="800"
                color={COLORS.ink}
                style={{ marginBottom: 7 }}
              >
                Join the foundation class
              </StyledText>

              <StyledText
                fontSize={13}
                color={COLORS.inkSoft}
                style={{ lineHeight: 20 }}
              >
                See how to connect with the blessings that come from building
                your life on solid ground.
              </StyledText>

              <Stack
                horizontal
                alignItems="center"
                gap={7}
                marginTop={14}
              >
                <Icon name="clock" size={13} color={COLORS.goldDeep} />
                <StyledText
                  fontSize={11.5}
                  fontWeight="700"
                  color={COLORS.goldDeep}
                >
                  Tuesdays at 7PM
                </StyledText>
              </Stack>
            </Stack>
          </Stack>
        </Animated.View>
      </StyledScrollView>
    </StyledPage>
  );
}