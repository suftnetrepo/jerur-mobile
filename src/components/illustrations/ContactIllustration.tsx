import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Path,
} from "react-native-svg";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack } from "fluent-styles";
import { COLORS } from "../../theme/colors";

const CARD_W = 116;
const CARD_H = 148;

export function ContactHeroIllustration() {
  return (
    <Stack width={CARD_W + 14} height={CARD_H + 14}>
      <Svg
        width={CARD_W}
        height={CARD_H}
        viewBox={`0 0 ${CARD_W} ${CARD_H}`}
      >
        <Defs>
          <LinearGradient
            id="contactCard"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <Stop offset="0" stopColor="#FFF9ED" />
            <Stop offset="0.55" stopColor="#FFF4DB" />
            <Stop offset="1" stopColor="#F3ECFF" />
          </LinearGradient>

          <LinearGradient
            id="church"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <Stop offset="0" stopColor="#DCA33B" />
            <Stop offset="1" stopColor="#B87A18" />
          </LinearGradient>
        </Defs>

        {/* Light premium background */}
        <Rect
          x={1}
          y={1}
          width={CARD_W - 2}
          height={CARD_H - 2}
          rx={28}
          fill="url(#contactCard)"
          stroke="#F1E5C9"
          strokeWidth={1}
        />

        {/* Decorative glow */}
        <Circle
          cx={84}
          cy={35}
          r={25}
          fill="#FFFFFF"
          opacity={0.55}
        />

        <Circle
          cx={28}
          cy={116}
          r={22}
          fill="#EDE5FF"
          opacity={0.65}
        />

        {/* Ground */}
        <Path
          d="M19 122 C38 114 77 114 98 122"
          stroke="#D9C8A2"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />

        {/* Church body */}
        <Rect
          x={40}
          y={82}
          width={38}
          height={37}
          rx={5}
          fill="url(#church)"
        />

        {/* Church roof */}
        <Path
          d="M34 84 L59 62 L84 84 Z"
          fill="#C88B28"
        />

        {/* Steeple */}
        <Rect
          x={54}
          y={49}
          width={10}
          height={20}
          rx={3}
          fill="#C88B28"
        />

        {/* Cross */}
        <Path
          d="M59 36 V51 M53 42 H65"
          stroke="#B87A18"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Door */}
        <Path
          d="M52 119 V101 C52 96 55 93 59 93 C63 93 66 96 66 101 V119"
          fill="#FFF3D2"
        />

        {/* Windows */}
        <Circle cx={48} cy={91} r={3} fill="#FFF3D2" />
        <Circle cx={70} cy={91} r={3} fill="#FFF3D2" />

        {/* Small decorative stars */}
        <Circle cx={26} cy={38} r={2} fill="#DCA33B" opacity={0.8} />
        <Circle cx={91} cy={66} r={1.5} fill="#8C6CE8" opacity={0.65} />
        <Circle cx={23} cy={72} r={1.5} fill="#DCA33B" opacity={0.55} />
      </Svg>

      {/* Contact bubble */}
      <Stack
        position="absolute"
        top={17}
        right={7}
        width={38}
        height={38}
        borderRadius={19}
        backgroundColor="#FFFFFF"
        alignItems="center"
        justifyContent="center"
        style={{
          borderWidth: 1,
          borderColor: "#F0E5CE",
          shadowColor: "#8B6B35",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Icon
          name="message-circle"
          size={18}
          color={COLORS.goldDeep}
        />
      </Stack>

      {/* Reach-out badge */}
      <Stack
        position="absolute"
        bottom={-5}
        right={-6}
        width={42}
        height={42}
        borderRadius={21}
        backgroundColor={COLORS.goldPale}
        alignItems="center"
        justifyContent="center"
        style={{
          borderWidth: 3,
          borderColor: COLORS.paper,
          shadowColor: "#8B6B35",
          shadowOpacity: 0.12,
          shadowRadius: 7,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Icon name="phone" size={17} color={COLORS.goldDeep} />
      </Stack>

      {/* Small sparkle */}
      <Stack position="absolute" top={4} left={2}>
        <Icon name="star" size={14} color={COLORS.gold} />
      </Stack>
    </Stack>
  );
}