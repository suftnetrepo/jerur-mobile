import Svg, { Path, Ellipse } from "react-native-svg";

// ── Welcome / "A word of welcome" section illustrations ───────────────────

/**
 * Decorative botanical leaf placed at the top-right corner of the quote card.
 * Rendered at low opacity (0.18–0.22) as a background accent only.
 */
export function WelcomeLeafIllustration() {
  return (
    <Svg width={120} height={130} viewBox="0 0 120 130">
      {/* Soft blob background */}
      <Ellipse cx={90} cy={28} rx={58} ry={52} fill="#F4E3C1" />

      {/* Central stem */}
      <Path
        d="M96 4 Q78 36 60 68 Q50 88 44 118"
        stroke="#C49035"
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />

      {/* Leaf pair 1 — top */}
      <Path d="M92 10 Q108 6 112 22 Q100 24 92 10 Z" fill="none" stroke="#C49035" strokeWidth={1.2} />
      <Path d="M88 18 Q100 10 106 28 Q94 32 88 18 Z" fill="none" stroke="#C49035" strokeWidth={1.2} />

      {/* Leaf pair 2 */}
      <Path d="M82 30 Q98 26 102 44 Q88 46 82 30 Z" fill="none" stroke="#C49035" strokeWidth={1.2} />
      <Path d="M78 40 Q90 30 96 48 Q82 54 78 40 Z" fill="none" stroke="#C49035" strokeWidth={1.2} />

      {/* Leaf pair 3 — mid */}
      <Path d="M72 52 Q86 48 90 66 Q74 68 72 52 Z" fill="none" stroke="#C49035" strokeWidth={1.1} />
      <Path d="M66 60 Q56 48 50 52 Q54 66 66 60 Z" fill="none" stroke="#C49035" strokeWidth={1.1} />

      {/* Leaf pair 4 — lower */}
      <Path d="M62 74 Q76 70 78 88 Q62 90 62 74 Z" fill="none" stroke="#C49035" strokeWidth={1} />
      <Path d="M54 80 Q44 68 38 74 Q42 88 54 80 Z" fill="none" stroke="#C49035" strokeWidth={1} />
    </Svg>
  );
}
