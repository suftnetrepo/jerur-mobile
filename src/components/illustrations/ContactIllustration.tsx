import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack } from "fluent-styles";
import { COLORS } from "../../theme/colors";

// ── Contact screen hero illustration ───────────────────────────────────────
// A rounded indigo card with a message-bubble glyph, a gold "reach out"
// badge overlapping its bottom-right corner, and a small sparkle accent —
// deliberately a different shape (soft square vs. the Prayer screen's arch)
// so the two hero visuals read as siblings, not the same asset recolored.
// Same "gradient + a couple of vector-icon glyphs" technique as
// illustrations/PrayerIllustration.tsx, no new image assets.

const CARD_W = 116;
const CARD_H = 148;

export function ContactHeroIllustration() {
  return (
    <Stack width={CARD_W + 14} height={CARD_H + 14}>
      <Svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${CARD_W} ${CARD_H}`}>
        <Defs>
          <LinearGradient id="contactCard" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={COLORS.indigo} stopOpacity={1} />
            <Stop offset="1" stopColor={COLORS.indigoDeep} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width={CARD_W} height={CARD_H} rx={28} fill="url(#contactCard)" />
      </Svg>

      {/* Message-bubble glyph, centered on the card */}
      <Stack position="absolute" top={0} left={0} width={CARD_W} height={CARD_H} alignItems="center" justifyContent="center">
        <Icon name="message-circle" size={42} color={COLORS.goldPale} style={{ opacity: 0.9 }} />
      </Stack>

      {/* "Reach out" badge, overlapping the bottom-right corner */}
      <Stack
        position="absolute"
        bottom={-8}
        right={-8}
        width={42}
        height={42}
        borderRadius={21}
        backgroundColor={COLORS.goldPale}
        alignItems="center"
        justifyContent="center"
        style={{ borderWidth: 3, borderColor: COLORS.paper }}
      >
        <Icon name="phone" size={17} color={COLORS.goldDeep} />
      </Stack>

      {/* Sparkle accent, top-left - echoes the Prayer hero's sparkle */}
      <Stack position="absolute" top={-4} left={-2}>
        <Icon name="star" size={14} color={COLORS.gold} />
      </Stack>
    </Stack>
  );
}
