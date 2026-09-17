import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";
import type { DevotionalArtworkVariant } from "./types";

/**
 * Lightweight abstract SVG artwork for the monthly theme card — no stock
 * photography, per the product spec. One shared renderer parameterised by
 * `variant` + the month's own primary/secondary/accent colors (see
 * month-themes.ts), rather than 12 near-identical bespoke components, so a
 * palette tweak in one place updates every month's artwork consistently.
 *
 * Renders full-bleed (`width`/`height` default to "100%", `preserveAspectRatio="none"`)
 * so it behaves as a true background layer filling the card behind the text,
 * not a small decorative icon boxed into one corner.
 */
export function DevotionalArtwork({
  variant,
  primaryColor,
  secondaryColor,
  accentColor,
  width = "100%",
  height = "100%",
}: {
  variant: DevotionalArtworkVariant;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  width?: number | string;
  height?: number | string;
}) {
  const gradientId = `devotional-artwork-${variant}`;
  return (
    <Svg width={width} height={height} viewBox="0 0 140 120" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={primaryColor} stopOpacity={0.85} />
          <Stop offset="1" stopColor={secondaryColor} stopOpacity={0.9} />
        </LinearGradient>
      </Defs>
      {variant === "sunrise" && (
        <>
          <Circle cx={100} cy={78} r={30} fill={accentColor} fillOpacity={0.55} />
          <Path d="M0 100 C 30 70, 60 130, 90 95 S 150 75, 140 100 L 140 120 L 0 120 Z" fill={`url(#${gradientId})`} fillOpacity={0.6} />
        </>
      )}
      {variant === "bloom" && (
        <>
          <Circle cx={40} cy={40} r={16} fill={accentColor} fillOpacity={0.35} />
          <Circle cx={70} cy={30} r={22} fill={accentColor} fillOpacity={0.22} />
          <Path d="M0 90 C 40 60, 100 60, 140 90 L 140 120 L 0 120 Z" fill={`url(#${gradientId})`} fillOpacity={0.6} />
        </>
      )}
      {variant === "wave" && (
        <>
          <Path d="M0 70 C 30 50, 60 90, 90 70 S 150 50, 140 70 L 140 120 L 0 120 Z" fill={`url(#${gradientId})`} fillOpacity={0.6} />
          <Path d="M0 95 C 35 75, 75 115, 140 90 L 140 120 L 0 120 Z" fill={accentColor} fillOpacity={0.25} />
        </>
      )}
      {variant === "sparkle" && (
        <>
          <Circle cx={104} cy={34} r={4} fill={accentColor} fillOpacity={0.6} />
          <Circle cx={120} cy={54} r={2.4} fill={accentColor} fillOpacity={0.45} />
          <Circle cx={88} cy={50} r={2} fill={accentColor} fillOpacity={0.4} />
          <Path d="M0 88 C 40 60, 90 100, 140 78 L 140 120 L 0 120 Z" fill={`url(#${gradientId})`} fillOpacity={0.6} />
        </>
      )}
    </Svg>
  );
}
