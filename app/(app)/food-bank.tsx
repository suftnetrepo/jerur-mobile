import { Animated, Linking } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import Svg, { Path, Rect, Defs, LinearGradient, Stop, Ellipse, Polygon } from "react-native-svg";
import { StyledPage, StyledScrollView, StyledText, Stack } from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { ScalePressable } from "../../src/components/ScalePressable";
import { useFadeUp } from "../../src/hooks/useFadeUp";
import { COLORS } from "../../src/theme/colors";
import { SHADOW_SOFT, SHADOW_CARD } from "../../src/theme/shadows";

// ── SVG Illustrations ──────────────────────────────────────────────────────

/** Hero card right column: cardboard box with jars, bottle, tin. */
function FoodBoxIllustration() {
  return (
    <Svg width={118} height={220} viewBox="0 0 118 220">
      <Defs>
        <LinearGradient id="heroBg" x1="0" y1="0" x2="0.6" y2="1">
          <Stop offset="0" stopColor="#FDF6EC" stopOpacity={1} />
          <Stop offset="1" stopColor="#F4E3C1" stopOpacity={1} />
        </LinearGradient>
      </Defs>
      {/* Warm background */}
      <Rect width={118} height={220} fill="url(#heroBg)" />

      {/* Cardboard box body */}
      <Rect x={8} y={140} width={102} height={68} rx={7} fill="#D9A441" />
      {/* Box top flap */}
      <Rect x={8} y={140} width={102} height={14} rx={7} fill="#C49035" />
      <Path d="M59 140 L59 154" stroke="#B8832A" strokeWidth={1.5} />

      {/* Olive oil bottle */}
      <Rect x={14} y={78} width={22} height={66} rx={6} fill="#5E7052" />
      <Rect x={17} y={66} width={16} height={16} rx={4} fill="#4A5A40" />
      <Rect x={21} y={57} width={8} height={13} rx={3} fill="#4A5A40" />
      {/* Label */}
      <Rect x={15} y={95} width={20} height={22} rx={2} fill="#E6EBDD" opacity={0.45} />

      {/* Glass pasta jar */}
      <Rect x={44} y={82} width={30} height={62} rx={6} fill="#F4E3C1" opacity={0.9} />
      {/* Lid */}
      <Rect x={45} y={76} width={28} height={10} rx={4} fill="#D9A441" />
      {/* Pasta strands inside */}
      <Rect x={53} y={92} width={3} height={32} rx={1.5} fill="#C49035" opacity={0.65} />
      <Rect x={59} y={90} width={3} height={34} rx={1.5} fill="#C49035" opacity={0.65} />
      <Rect x={65} y={92} width={3} height={32} rx={1.5} fill="#C49035" opacity={0.65} />

      {/* Tin can */}
      <Rect x={82} y={94} width={26} height={50} rx={5} fill="#8B9E6E" />
      <Ellipse cx={95} cy={94} rx={13} ry={4} fill="#7A8D5D" />
      <Ellipse cx={95} cy={144} rx={13} ry={4} fill="#7A8D5D" />
      {/* Can label strip */}
      <Rect x={83} y={108} width={24} height={18} rx={1} fill="white" opacity={0.2} />

      {/* Heart-hands icon at bottom of illustration */}
      <Path
        d="M59 196 Q42 186 38 172 Q34 155 47 151 Q54 148 59 157 Q64 148 71 151 Q84 155 80 172 Q76 186 59 196 Z"
        fill="#D9A441"
        opacity={0.75}
      />
    </Svg>
  );
}

/** Icon badge SVG: cupped hands holding a heart. */
function HeartHandsSvg({ color, size = 22 }: { color: string; size?: number }) {
  const s = size / 22;
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22">
      {/* Heart */}
      <Path
        d="M11 8.5 Q8 4 4.5 5.5 Q1 7 2.5 11 Q4 15 11 19 Q18 15 19.5 11 Q21 7 17.5 5.5 Q14 4 11 8.5 Z"
        fill={color}
      />
      {/* Left hand */}
      <Path d="M4 21 Q2 17 3 13 Q4 10 6 11 Q7 9 9 11 Q9 14 8 21 Z" fill={color} opacity={0.65} />
      {/* Right hand */}
      <Path d="M18 21 Q20 17 19 13 Q18 10 16 11 Q15 9 13 11 Q13 14 14 21 Z" fill={color} opacity={0.65} />
    </Svg>
  );
}

/** Right-side illustration for Donate Food card (green). */
function GroceryIllustration() {
  return (
    <Svg width={90} height={100} viewBox="0 0 90 100">
      {/* Back tall box */}
      <Rect x={42} y={18} width={36} height={58} rx={5} fill="#5E7052" opacity={0.45} />
      <Rect x={42} y={18} width={36} height={11} rx={5} fill="#4A5A40" opacity={0.45} />

      {/* Front bag/box */}
      <Rect x={6} y={36} width={38} height={50} rx={5} fill="#5E7052" />
      <Rect x={6} y={36} width={38} height={11} rx={5} fill="#4A5A40" />
      {/* Bag handle */}
      <Path d="M16 36 Q16 26 25 26 Q34 26 34 36" fill="none" stroke="#4A5A40" strokeWidth={3} strokeLinecap="round" />
      {/* Lines on bag */}
      <Rect x={13} y={53} width={24} height={2.5} rx={1} fill="white" opacity={0.35} />
      <Rect x={13} y={60} width={16} height={2.5} rx={1} fill="white" opacity={0.35} />

      {/* Small tin on the right */}
      <Rect x={56} y={46} width={26} height={42} rx={4} fill="#5E7052" opacity={0.8} />
      <Ellipse cx={69} cy={46} rx={13} ry={4} fill="#4A5A40" opacity={0.8} />

      {/* Leaf / plant decoration */}
      <Path d="M72 12 Q84 4 88 14 Q80 8 72 12" fill="#5E7052" />
      <Path d="M78 6 Q88 8 86 18 Q82 12 78 6" fill="#4A5A40" />
      <Path d="M76 12 L82 30" stroke="#5E7052" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** Right-side illustration for Give Financially card (gold). */
function DonationHandsIllustration() {
  return (
    <Svg width={90} height={100} viewBox="0 0 90 100">
      {/* Heart */}
      <Path
        d="M45 42 Q36 28 26 32 Q16 36 20 50 Q24 64 45 78 Q66 64 70 50 Q74 36 64 32 Q54 28 45 42 Z"
        fill="#D9A441"
      />
      {/* Left palm — darker amber so it shows on goldPale background */}
      <Path d="M16 98 Q10 82 14 68 Q16 60 21 62 Q25 57 29 62 Q33 57 33 67 Q28 75 26 98 Z" fill="#C49035" />
      {/* Right palm */}
      <Path d="M74 98 Q80 82 76 68 Q74 60 69 62 Q65 57 61 62 Q57 57 57 67 Q62 75 64 98 Z" fill="#C49035" />
    </Svg>
  );
}

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
      <StyledPage.Header title="Food Bank" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>

        {/* ── Hero Card ─────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 16 }, heroAnim]}>
          <Stack backgroundColor={COLORS.white} borderRadius={22} overflow="hidden" style={SHADOW_CARD}>
            <Stack horizontal minHeight={218}>
              {/* Left: text column */}
              <Stack flex={1} padding={20} paddingRight={10} justifyContent="center">
                <StyledText
                  fontSize={10}
                  fontWeight="700"
                  color={COLORS.sage}
                  style={{ letterSpacing: 1.3, marginBottom: 10 }}
                >
                  COMMUNITY · FOOD BANK
                </StyledText>
                <StyledText fontSize={24} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 30, marginBottom: 2 }}>
                  It only takes a little to{" "}
                </StyledText>
                <StyledText fontSize={24} fontWeight="800" color={COLORS.sage} style={{ lineHeight: 30, marginBottom: 10 }}>
                  make a lot
                </StyledText>
                {/* Gold accent underline */}
                <Stack width={34} height={3} backgroundColor={COLORS.gold} borderRadius={2} marginBottom={12} />
                <StyledText fontSize={12.5} color={COLORS.inkSoft} style={{ lineHeight: 18 }}>
                  Just like the two fish and five loaves, your small gift can make a huge impact.
                </StyledText>
              </Stack>
              {/* Right: food illustration */}
              <FoodBoxIllustration />
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Mission Card ──────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 28 }, missionAnim]}>
          <Stack backgroundColor={COLORS.white} borderRadius={18} padding={18} style={SHADOW_SOFT}>
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
                <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ lineHeight: 21 }}>
                  Every third Sunday, Winners Chapel Peterborough extends a hand of hope through our food bank at Ormiston Bushfield
                  Academy. Your generous donation helps fill bags with essential food items for those in need.
                </StyledText>
              </Stack>
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Section Header: Ways you can help ─────────────────────────── */}
        <Animated.View style={[{ marginBottom: 20, alignItems: "center" }, waysAnim]}>
          <Icon name="heart" size={20} color={COLORS.gold} style={{ marginBottom: 8 }} />
          <Stack horizontal alignItems="center" gap={10}>
            <Stack flex={1} height={1.5} backgroundColor={COLORS.gold} opacity={0.5} />
            <StyledText fontSize={16} fontWeight="800" color={COLORS.ink}>
              Ways you can help
            </StyledText>
            <Stack flex={1} height={1.5} backgroundColor={COLORS.gold} opacity={0.5} />
          </Stack>
        </Animated.View>

        {/* ── Donate Food Card ──────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 16 }, donateAnim]}>
          <Stack backgroundColor={COLORS.white} borderRadius={18} padding={18} style={SHADOW_SOFT}>
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
                  <StyledText fontSize={15} fontWeight="800" color={COLORS.ink} style={{ flex: 1, lineHeight: 21 }}>
                    Bring essential non-perishable food items
                  </StyledText>
                </Stack>
                <StyledText fontSize={13} color={COLORS.inkSoft} style={{ lineHeight: 19 }}>
                  Such as rice, pasta, tinned foods, cereals, and toiletries — dropped off directly at the church.
                </StyledText>
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
          <Stack backgroundColor={COLORS.goldPale} borderRadius={18} padding={18} style={SHADOW_SOFT}>
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
                  <StyledText fontSize={15} fontWeight="800" color={COLORS.ink} style={{ flex: 1, lineHeight: 21 }}>
                    Or give financially
                  </StyledText>
                </Stack>
                <StyledText fontSize={13} color={COLORS.inkSoft} style={{ lineHeight: 19 }}>
                  Speak to any church official, or contact us to arrange your donation:
                </StyledText>
              </Stack>
              {/* Right: donation illustration */}
              <Stack opacity={0.85} marginTop={-4}>
                <DonationHandsIllustration />
              </Stack>
            </Stack>

            {/* Phone buttons — side by side, full card width */}
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
                    borderRadius: 16,
                    borderWidth: 0.5,
                    borderColor: COLORS.goldPale,
                    backgroundColor: COLORS.goldSoft,
                  }}
                >
                  <Stack horizontal alignItems="center" justifyContent="center" gap={8}>
                    <Icon name="phone" size={13} color={COLORS.goldDeep} />
                    <StyledText fontSize={13} fontWeight="700" color={COLORS.goldDeep}>
                      {number}
                    </StyledText>
                  </Stack>
                </ScalePressable>
              ))}
            </Stack>
          </Stack>
        </Animated.View>

        {/* ── Thank You Footer Card ─────────────────────────────────────── */}
        <Animated.View style={footerAnim}>
          <Stack backgroundColor={COLORS.sageSoft} borderRadius={16} padding={16}>
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
              <StyledText fontSize={13} color={COLORS.sage} style={{ flex: 1, lineHeight: 20 }}>
                Thank you for being a blessing to our community.{"\n"}Together we can make a difference.
              </StyledText>
            </Stack>
          </Stack>
        </Animated.View>

      </StyledScrollView>
    </StyledPage>
  );
}

