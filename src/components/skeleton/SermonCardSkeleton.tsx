import { Stack } from "fluent-styles";
import { Skeleton, SkeletonText } from "./Skeleton";
import { COLORS } from "../../theme/colors";
import { SHADOW_CARD } from "../../theme/shadows";
import { CARD_H_PAD, CARD_RADIUS } from "../../theme/layout";

/**
 * Matches LatestSermonCard's exact geometry (190px thumbnail, same
 * padding/radius) so Home doesn't jump when the real card swaps in. Home
 * renders this while useLatestSermon() is on its first fetch — see
 * app/(app)/index.tsx.
 */
export function SermonCardSkeleton() {
  return (
    <Stack paddingHorizontal={CARD_H_PAD}>
      <Stack backgroundColor={COLORS.white} borderRadius={CARD_RADIUS} overflow="hidden" style={SHADOW_CARD}>
        <Skeleton width="100%" height={190} borderRadius={0} />
        <Stack padding={18} gap={10}>
          <Skeleton width={90} height={11} borderRadius={4} />
          <SkeletonText lines={2} lineHeight={16} lastLineWidth="75%" />
          <Skeleton width={130} height={12} borderRadius={4} />
          <Skeleton width={70} height={13} borderRadius={4} style={{ marginTop: 4 }} />
        </Stack>
      </Stack>
    </Stack>
  );
}
