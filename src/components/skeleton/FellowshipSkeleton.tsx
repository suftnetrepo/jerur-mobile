import { Stack } from "fluent-styles";
import { Skeleton, SkeletonCircle } from "./Skeleton";
import { COLORS } from "../../theme/colors";
import { SHADOW_CARD } from "../../theme/shadows";

const ROW_COUNT = 4;

/** Mirrors one fellowship.tsx row: icon circle + name/town/address lines.
 * Shown while useFellowship() is on its first fetch — distinct from the
 * real "No fellowship groups match your search" empty state, which only
 * renders once loading has actually finished. */
export function FellowshipSkeleton() {
  return (
    <Stack gap={14}>
      {Array.from({ length: ROW_COUNT }).map((_, i) => (
        <Stack
          key={i}
          backgroundColor={COLORS.white}
          borderRadius={16}
          padding={16}
          horizontal
          alignItems="center"
          gap={14}
          style={SHADOW_CARD}
        >
          <SkeletonCircle size={48} />
          <Stack style={{ flex: 1 }} gap={7}>
            <Skeleton width="60%" height={16} borderRadius={5} />
            <Skeleton width="30%" height={12} borderRadius={4} />
            <Skeleton width="75%" height={12} borderRadius={4} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
