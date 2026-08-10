import Svg, { Path, Rect, Ellipse, Defs, LinearGradient, Stop } from "react-native-svg";

// ── Free Transport screen illustrations ───────────────────────────────────

/** Hero card right column: car on a golden sunset road. */
export function CarIllustration() {
  return (
    <Svg width={138} height={220} viewBox="0 0 138 220">
      <Defs>
        <LinearGradient id="tSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FBD786" stopOpacity={0.55} />
          <Stop offset="0.55" stopColor="#E89B3A" stopOpacity={0.4} />
          <Stop offset="1" stopColor="#4B5563" stopOpacity={0.55} />
        </LinearGradient>
        <LinearGradient id="tCar" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#374151" />
          <Stop offset="1" stopColor="#111827" />
        </LinearGradient>
        <LinearGradient id="tRoad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#4B5563" />
          <Stop offset="1" stopColor="#374151" />
        </LinearGradient>
      </Defs>

      {/* Sky/background */}
      <Rect width={138} height={220} fill="url(#tSky)" />

      {/* Sun glow */}
      <Ellipse cx={106} cy={52} rx={38} ry={32} fill="#FBD786" opacity={0.22} />
      <Ellipse cx={106} cy={52} rx={22} ry={18} fill="#F4A435" opacity={0.2} />
      <Ellipse cx={106} cy={52} rx={11} ry={9} fill="#F4A435" opacity={0.22} />

      {/* Tree silhouettes — left */}
      <Path d="M0 168 L0 128 Q6 116 10 128 L12 124 Q18 106 22 124 L24 128 L24 168 Z" fill="#1F2937" opacity={0.38} />

      {/* Tree silhouettes — right */}
      <Path d="M116 168 L116 118 Q122 105 126 118 L128 114 Q133 98 138 114 L138 168 Z" fill="#1F2937" opacity={0.38} />

      {/* Road */}
      <Rect x={0} y={176} width={138} height={44} fill="url(#tRoad)" />
      {/* Road horizon edge */}
      <Rect x={0} y={176} width={138} height={5} fill="#6B7280" opacity={0.5} />
      {/* Lane markers */}
      <Rect x={60} y={188} width={18} height={5} rx={2} fill="white" opacity={0.28} />
      <Rect x={60} y={203} width={18} height={5} rx={2} fill="white" opacity={0.28} />

      {/* Car — rear 3/4 view */}
      {/* Lower body / chassis */}
      <Path d="M13 174 L13 150 Q16 134 28 128 L110 126 Q122 128 126 144 L126 174 Z" fill="url(#tCar)" />
      {/* Upper cabin */}
      <Path d="M34 128 Q42 108 62 105 Q79 103 96 107 Q112 112 116 128 Z" fill="#2D3748" />
      {/* Rear windshield */}
      <Path d="M42 128 Q50 110 64 107 Q80 105 94 109 Q104 114 108 128 Z" fill="#374151" opacity={0.65} />

      {/* Tail lights — left */}
      <Rect x={14} y={148} width={22} height={13} rx={3} fill="#DC2626" opacity={0.92} />
      <Rect x={14} y={148} width={22} height={5} rx={2} fill="#FCA5A5" opacity={0.55} />

      {/* Tail lights — right */}
      <Rect x={103} y={148} width={22} height={13} rx={3} fill="#DC2626" opacity={0.92} />
      <Rect x={103} y={148} width={22} height={5} rx={2} fill="#FCA5A5" opacity={0.55} />

      {/* Trunk strip */}
      <Rect x={13} y={158} width={114} height={16} rx={2} fill="#111827" />

      {/* Bumper */}
      <Rect x={16} y={170} width={107} height={7} rx={3} fill="#0F172A" />

      {/* Wheels */}
      <Ellipse cx={35} cy={176} rx={20} ry={8} fill="#0F172A" />
      <Ellipse cx={35} cy={176} rx={12} ry={5} fill="#1F2937" />
      <Ellipse cx={35} cy={176} rx={5} ry={2.5} fill="#374151" />

      <Ellipse cx={103} cy={176} rx={20} ry={8} fill="#0F172A" />
      <Ellipse cx={103} cy={176} rx={12} ry={5} fill="#1F2937" />
      <Ellipse cx={103} cy={176} rx={5} ry={2.5} fill="#374151" />

      {/* Roof shine */}
      <Path d="M52 110 Q69 106 88 110" stroke="#FBD786" strokeWidth={1.5} strokeLinecap="round" opacity={0.45} fill="none" />
    </Svg>
  );
}

/** Support card right decoration: phone handset + chat bubble. */
export function SupportIllustration() {
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      {/* Chat bubble */}
      <Path
        d="M12 6 Q8 6 6 10 L6 36 Q6 40 10 40 L20 40 L16 50 L28 40 L60 40 Q64 40 64 36 L64 10 Q64 6 60 6 Z"
        fill="#5E7052"
        opacity={0.4}
      />
      {/* Bubble dots */}
      <Ellipse cx={26} cy={24} rx={3} ry={3} fill="white" opacity={0.75} />
      <Ellipse cx={35} cy={24} rx={3} ry={3} fill="white" opacity={0.75} />
      <Ellipse cx={44} cy={24} rx={3} ry={3} fill="white" opacity={0.75} />

      {/* Phone handset */}
      <Path
        d="M12 44 Q11 37 16 30 L22 36 Q24 39 21 42 Q19 44 21 47 Q27 56 33 59 Q36 61 39 58 L44 53 Q47 50 51 53 Q57 59 56 63 Q50 70 42 68 Q24 64 12 44 Z"
        fill="#5E7052"
        opacity={0.78}
      />

      {/* Leaf accent */}
      <Path d="M54 8 Q62 2 66 10 Q60 5 54 8" fill="#5E7052" opacity={0.55} />
      <Path d="M60 4 Q67 6 65 14 Q62 8 60 4" fill="#4A5A40" opacity={0.45} />
    </Svg>
  );
}

/** Footer card right decoration: faded church silhouette. */
export function FooterChurchIllustration() {
  return (
    <Svg width={52} height={62} viewBox="0 0 52 62">
      {/* Cross */}
      <Rect x={23} y={1} width={6} height={15} rx={2} fill="#4F46E5" opacity={0.28} />
      <Rect x={18} y={5} width={16} height={5} rx={2} fill="#4F46E5" opacity={0.28} />
      {/* Steeple shaft */}
      <Rect x={22} y={14} width={8} height={10} fill="#4F46E5" opacity={0.22} />
      {/* Steeple cap */}
      <Path d="M15 16 L26 4 L37 16 Z" fill="#4F46E5" opacity={0.26} />
      {/* Roof */}
      <Path d="M2 28 L26 15 L50 28 Z" fill="#4F46E5" opacity={0.2} />
      {/* Body */}
      <Rect x={4} y={26} width={44} height={36} rx={2} fill="#4F46E5" opacity={0.16} />
      {/* Arched door */}
      <Rect x={19} y={40} width={14} height={22} rx={7} fill="#4F46E5" opacity={0.25} />
      {/* Windows */}
      <Rect x={7} y={30} width={11} height={13} rx={5} fill="#4F46E5" opacity={0.2} />
      <Rect x={34} y={30} width={11} height={13} rx={5} fill="#4F46E5" opacity={0.2} />
    </Svg>
  );
}
