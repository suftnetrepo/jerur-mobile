import Svg, { Defs, LinearGradient, Stop, Path, Circle } from "react-native-svg";
import { MaterialCommunityIcons as MCIcon, Feather as Icon } from "@expo/vector-icons";
import { Stack } from "fluent-styles";
import { COLORS } from "../../theme/colors";

// ── Prayer screen hero illustration ────────────────────────────────────────
// Arched "sunrise" card with a raised-hand silhouette, a sparkle accent, and
// a small laurel sprig — used at the top of the Prayer screen next to the
// heading. Deliberately simple/geometric (gradient arch + a couple of
// vector-icon glyphs layered on top) rather than a photo, matching how the
// other screens' illustrations/ files favor a few SVG shapes over detail.

const ARCH_W = 132;
const ARCH_H = 176;

export function PrayerHeroIllustration() {
  return (
    <Stack width={ARCH_W} height={ARCH_H + 14}>
      <Svg width={ARCH_W} height={ARCH_H} viewBox={`0 0 ${ARCH_W} ${ARCH_H}`}>
        <Defs>
          <LinearGradient id="prayerSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FCEACB" stopOpacity={1} />
            <Stop offset="0.55" stopColor="#EFB35E" stopOpacity={1} />
            <Stop offset="1" stopColor="#D98A3D" stopOpacity={1} />
          </LinearGradient>
        </Defs>
        {/* Arch frame */}
        <Path
          d={`M4 ${ARCH_H} L4 66 Q4 4 66 4 Q128 4 128 66 L128 ${ARCH_H} Z`}
          fill="url(#prayerSky)"
        />
        {/* Sun */}
        <Circle cx={66} cy={72} r={30} fill="#FFF6E3" opacity={0.55} />
        <Circle cx={66} cy={72} r={16} fill="#FFFBF0" opacity={0.85} />
      </Svg>

      {/* Raised-hand silhouette, layered on the arch */}
      <Stack position="absolute" left={0} right={0} bottom={14} alignItems="center">
        <MCIcon name="human-handsup" size={56} color="#2A2013" style={{ opacity: 0.82 }} />
      </Stack>

      {/* Sparkle accent, top-right */}
      <Stack position="absolute" top={-6} right={-2}>
        <Icon name="star" size={16} color={COLORS.gold} />
      </Stack>

      {/* Laurel sprig, bottom-right */}
      <Stack position="absolute" bottom={-10} right={-14}>
        <Svg width={44} height={40} viewBox="0 0 44 40">
          <Path d="M2 38 Q18 26 34 2" stroke={COLORS.gold} strokeWidth={1.6} strokeLinecap="round" fill="none" />
          <Path d="M10 30 Q6 24 12 20 Q16 26 10 30 Z" fill={COLORS.gold} opacity={0.7} />
          <Path d="M18 22 Q14 16 20 12 Q24 18 18 22 Z" fill={COLORS.gold} opacity={0.7} />
          <Path d="M26 14 Q22 8 28 4 Q32 10 26 14 Z" fill={COLORS.gold} opacity={0.7} />
        </Svg>
      </Stack>
    </Stack>
  );
}
