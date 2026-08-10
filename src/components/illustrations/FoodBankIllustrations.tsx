import Svg, { Path, Rect, Defs, LinearGradient, Stop, Ellipse } from "react-native-svg";

// ── Food Bank screen illustrations ────────────────────────────────────────
// All components are decorative SVGs used on the Food Bank screen.

/** Hero card right column: cardboard box with jars, bottle, tin. */
export function FoodBoxIllustration() {
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

/** Icon badge SVG: cupped hands holding a heart. Used in the mission card. */
export function HeartHandsSvg({ color, size = 22 }: { color: string; size?: number }) {
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

/** Right-side illustration for the Donate Food card. */
export function GroceryIllustration() {
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

/** Right-side illustration for the Give Financially card. */
export function DonationHandsIllustration() {
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
