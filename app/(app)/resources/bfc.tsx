import { Animated, Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledPressable,
  Stack,
  useToast,
} from "fluent-styles";
import { Text } from "../../../src/components/text";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { useFadeUp } from "../../../src/hooks/useFadeUp";
import { useSettings } from "../../../src/hooks/useChurchData";
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
  const { data: settings } = useSettings();
  const toast = useToast();
  const conferenceLink = settings?.conference_link?.trim();

  const heroAnim = useFadeUp(0);
  const aboutAnim = useFadeUp(140);
  const scheduleAnim = useFadeUp(260);

  async function handleJoinOnline() {
    if (!conferenceLink) return;
    try {
      const url = /^https?:\/\//i.test(conferenceLink)
        ? conferenceLink
        : `https://${conferenceLink}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        toast.error("Couldn't open the conference link.");
        return;
      }
      await Linking.openURL(url);
    } catch {
      toast.error("Couldn't open the conference link.");
    }
  }

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
                <Text
                  variant="title"
                  fontSize={17}
                  fontWeight="800"
                  color={COLORS.ink}
                  style={{ marginBottom: 2 }}
                >
                  Build on solid ground
                </Text>
                <Text fontSize={11.5} color={COLORS.inkSoft}>
                  Grounded in the foundations of faith
                </Text>
              </Stack>
            </Stack>

            <Text
              fontSize={13.5}
              color={COLORS.inkSoft}
              style={{ lineHeight: 21, marginBottom: 14 }}
            >
              In the journey of life, foundations are vitally important to
              destiny. To make the most of one's Christian adventure, it is
              important to address the foundations of the faith. We are
              admonished to contend for the faith that was once delivered to the
              saints — Jude 3.
            </Text>

            <Stack
              height={1}
              backgroundColor={COLORS.chromeBorder}
              marginBottom={14}
            />

            <Text
              fontSize={13.5}
              color={COLORS.inkSoft}
              style={{ lineHeight: 21 }}
            >
              The purpose of the Believers Foundation Class is to ensure that we
              are all grounded in the foundations of faith that will ensure a
              profitable and colorful adventure in the Lord.
            </Text>
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
                <Text
                  variant="overline"
                  fontSize={10.5}
                  fontWeight="800"
                  letterSpacing={1}
                  color={COLORS.sage}
                  style={{ marginBottom: 3 }}
                >
                  WEEKLY CLASS
                </Text>
                <Text
                  variant="title"
                  fontSize={18}
                  fontWeight="800"
                  color={COLORS.ink}
                >
                  Every Tuesday · 7PM
                </Text>
              </Stack>
            </Stack>

            <Stack
              backgroundColor={COLORS.white}
              borderRadius={18}
              padding={17}
            >
              <Text
                variant="subtitle"
                fontWeight="800"
                color={COLORS.ink}
                style={{ marginBottom: 7 }}
              >
                Join the foundation class
              </Text>

              <Text
                fontSize={13}
                color={COLORS.inkSoft}
                style={{ lineHeight: 20 }}
              >
                See how to connect with the blessings that come from building
                your life on solid ground.
              </Text>

              <Stack
                horizontal
                alignItems="center"
                gap={7}
                marginTop={14}
              >
                <Icon name="clock" size={13} color={COLORS.goldDeep} />
                <Text
                  variant="subLabel"
                  fontSize={11.5}
                  fontWeight="700"
                  color={COLORS.goldDeep}
                >
                  Tuesdays at 7PM
                </Text>
              </Stack>

              {/* Church-wide conference link (Settings -> Config in the
                  admin portal) — hidden entirely when the church hasn't
                  set one, same as every other optional link in the app. */}
              {conferenceLink ? (
                <StyledPressable
                  onPress={handleJoinOnline}
                  accessibilityRole="button"
                  accessibilityLabel="Join the foundation class online"
                  style={{ marginTop: 16 }}
                >
                  <Stack
                    horizontal
                    alignItems="center"
                    justifyContent="center"
                    gap={8}
                    backgroundColor={COLORS.gold}
                    borderRadius={14}
                    paddingVertical={13}
                  >
                    <Icon
                      name="video"
                      size={16}
                      color={COLORS.indigoDeep}
                    />
                    <Text
                      variant="button"
                      fontSize={13.5}
                      color={COLORS.indigoDeep}
                    >
                      Join online
                    </Text>
                  </Stack>
                </StyledPressable>
              ) : null}
            </Stack>
          </Stack>
        </Animated.View>
      </StyledScrollView>
    </StyledPage>
  );
}