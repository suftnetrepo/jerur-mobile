import Svg, { Path, Rect, Polygon } from "react-native-svg";

// ── Service Times screen illustrations ───────────────────────────────────
// All components accept a `color` prop so they tint to the card's accent colour.

/** Decorative church building — used on the first service card. */
export function ChurchIllustration({ color }: { color: string }) {
  return (
    <Svg width={72} height={84} viewBox="0 0 72 84">
      {/* Steeple tower */}
      <Rect x={30} y={15} width={12} height={23} fill={color} />
      {/* Steeple cap */}
      <Polygon points="24,17 36,4 48,17" fill={color} />
      {/* Cross */}
      <Rect x={34} y={3} width={4} height={18} fill={color} />
      <Rect x={30} y={8} width={12} height={4} fill={color} />
      {/* Pitched roof */}
      <Polygon points="4,40 36,22 68,40" fill={color} />
      {/* Main building body */}
      <Rect x={8} y={38} width={56} height={46} rx={3} fill={color} />
      {/* Arched door */}
      <Rect x={28} y={56} width={16} height={28} rx={8} fill="white" opacity={0.55} />
      {/* Left window */}
      <Rect x={12} y={44} width={13} height={16} rx={6} fill="white" opacity={0.45} />
      {/* Right window */}
      <Rect x={47} y={44} width={13} height={16} rx={6} fill="white" opacity={0.45} />
    </Svg>
  );
}

/** Decorative open Bible — used on the second service card. */
export function BibleIllustration({ color }: { color: string }) {
  return (
    <Svg width={74} height={72} viewBox="0 0 74 72">
      {/* Left page */}
      <Path d="M4 14 Q6 66 37 68 Q31 57 31 14 Z" fill={color} />
      {/* Right page */}
      <Path d="M70 14 Q68 66 37 68 Q43 57 43 14 Z" fill={color} />
      {/* Spine */}
      <Rect x={34} y={14} width={6} height={54} rx={2} fill={color} />
      {/* Top cover arc */}
      <Path d="M4 14 Q37 8 70 14" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      {/* Text lines – left page */}
      <Path d="M12 29 Q22 28 29 29" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.65} />
      <Path d="M12 37 Q22 36 29 37" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.65} />
      <Path d="M12 45 Q22 44 29 45" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.65} />
      {/* Text lines – right page */}
      <Path d="M45 29 Q55 28 62 29" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.65} />
      <Path d="M45 37 Q55 36 62 37" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.65} />
      <Path d="M45 45 Q55 44 62 45" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.65} />
      {/* Leaf decoration */}
      <Path d="M57 8 Q65 2 69 8 Q64 4 57 8" fill={color} />
      <Path d="M63 4 Q70 5 69 11 Q66 7 63 4" fill={color} />
    </Svg>
  );
}

/** Decorative cross with raised hands — used on the third service card. */
export function WorshipIllustration({ color }: { color: string }) {
  return (
    <Svg width={70} height={90} viewBox="0 0 70 90">
      {/* Cross – vertical */}
      <Rect x={31} y={2} width={8} height={40} rx={4} fill={color} />
      {/* Cross – horizontal */}
      <Rect x={18} y={13} width={34} height={8} rx={4} fill={color} />
      {/* Left raised hand */}
      <Path d="M13 88 Q9 70 13 56 Q15 49 19 51 Q21 46 25 49 Q28 46 28 55 Q25 62 23 88 Z" fill={color} />
      {/* Right raised hand (mirror) */}
      <Path d="M57 88 Q61 70 57 56 Q55 49 51 51 Q49 46 45 49 Q42 46 42 55 Q45 62 47 88 Z" fill={color} />
    </Svg>
  );
}

/** Cycled by service card index to vary the illustration. */
export const SERVICE_ILLUSTRATIONS = [ChurchIllustration, BibleIllustration, WorshipIllustration];
