import { Animated, type StyleProp, type ViewStyle, type DimensionValue } from "react-native";
import { Stack } from "fluent-styles";
import { useShimmerValue } from "./ShimmerContext";
import { COLORS } from "../../theme/colors";

/**
 * Reusable premium skeleton/shimmer system. Compose these three primitives
 * (Skeleton, SkeletonText, SkeletonCircle) into a per-screen layout that
 * mirrors the real content's structure — see the *Skeleton.tsx files
 * alongside this one (HomeSkeleton, PastorSkeleton, ...) for the composed
 * versions actually used by screens.
 *
 * Every bone shares one animation driver (ShimmerContext, mounted once in
 * app/_layout.tsx) and automatically goes static under Reduce Motion — no
 * per-screen accessibility handling needed.
 */

const DEFAULT_COLOR = COLORS.chromeBorder;

export function Skeleton({
  width,
  height,
  borderRadius = 8,
  color = DEFAULT_COLOR,
  style,
}: {
  width?: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const pulse = useShimmerValue();
  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: color, opacity: pulse },
        style,
      ]}
    />
  );
}

/** A circular bone — avatars, church logos, icon badges. */
export function SkeletonCircle({
  size,
  color = DEFAULT_COLOR,
  style,
}: {
  size: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} color={color} style={style} />;
}

/** One or more text-line bones. The last line defaults to a shorter width
 * so a paragraph placeholder reads as text, not as a solid block. */
export function SkeletonText({
  lines = 1,
  width = "100%",
  lastLineWidth = "60%",
  lineHeight = 14,
  gap = 8,
  borderRadius = 4,
  color,
  style,
}: {
  lines?: number;
  width?: DimensionValue;
  lastLineWidth?: DimensionValue;
  lineHeight?: number;
  gap?: number;
  borderRadius?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Stack gap={gap} style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          borderRadius={borderRadius}
          color={color}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : width}
        />
      ))}
    </Stack>
  );
}
