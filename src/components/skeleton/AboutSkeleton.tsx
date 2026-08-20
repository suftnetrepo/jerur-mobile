import { Stack } from "fluent-styles";
import { Skeleton, SkeletonCircle, SkeletonText } from "./Skeleton";
import { COLORS } from "../../theme/colors";
import { SHADOW_CARD } from "../../theme/shadows";

/** Mirrors about.tsx's section-by-section layout: banner + floating logo,
 * "Our story" heading/copy, verse card, contact rows, description card.
 * Shown while useSettings() is on its first fetch. */
export function AboutSkeleton() {
  return (
    <Stack>
      <Stack paddingHorizontal={20} marginBottom={44}>
        <Stack>
          <Stack style={{ aspectRatio: 2.2 }}>
            <Skeleton width="100%" height="100%" borderRadius={24} />
          </Stack>
          <Stack style={{ position: "absolute", bottom: -32, right: 28 }}>
            <SkeletonCircle size={72} color={COLORS.paperAlt} />
          </Stack>
        </Stack>
      </Stack>

      <Stack paddingHorizontal={24} gap={22}>
        <Stack gap={10}>
          <Skeleton width={90} height={11} borderRadius={4} />
          <Skeleton width="80%" height={22} borderRadius={6} />
          <SkeletonText lines={2} lineHeight={13} lastLineWidth="65%" />
        </Stack>

        <Stack
          horizontal
          alignItems="flex-start"
          gap={14}
          backgroundColor={COLORS.paperWarm}
          borderRadius={18}
          padding={16}
        >
          <SkeletonCircle size={40} />
          <Stack style={{ flex: 1 }} gap={8}>
            <Skeleton width={50} height={11} borderRadius={4} />
            <SkeletonText lines={2} lineHeight={13} lastLineWidth="70%" />
          </Stack>
        </Stack>

        <Stack backgroundColor={COLORS.white} borderRadius={18} padding={16} style={SHADOW_CARD} gap={16}>
          {[0, 1, 2].map((i) => (
            <Stack key={i} horizontal alignItems="center" gap={14}>
              <SkeletonCircle size={38} />
              <Stack style={{ flex: 1 }} gap={6}>
                <Skeleton width={60} height={11} borderRadius={4} />
                <Skeleton width="70%" height={13} borderRadius={4} />
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Stack backgroundColor={COLORS.white} borderRadius={18} padding={18} style={SHADOW_CARD}>
          <SkeletonText lines={4} lineHeight={13} lastLineWidth="55%" />
        </Stack>
      </Stack>
    </Stack>
  );
}
