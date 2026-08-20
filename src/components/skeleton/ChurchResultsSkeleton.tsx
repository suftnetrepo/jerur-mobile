import { Stack } from "fluent-styles";
import { Skeleton, SkeletonCircle, SkeletonText } from "./Skeleton";
import { COLORS } from "../../theme/colors";
import { SHADOW_CARD } from "../../theme/shadows";

const RESULT_COUNT = 3;

/** One card matching ChurchResultCard's geometry (180px banner, name +
 * logo row, address, 2-line description, two action buttons). */
function ChurchResultCardSkeleton() {
  return (
    <Stack backgroundColor={COLORS.white} borderRadius={22} overflow="hidden" style={SHADOW_CARD}>
      <Skeleton width="100%" height={180} borderRadius={0} />
      <Stack padding={18} gap={10}>
        <Stack horizontal alignItems="center" justifyContent="space-between" gap={10}>
          <Skeleton width="60%" height={19} borderRadius={5} />
          <SkeletonCircle size={44} />
        </Stack>
        <Skeleton width="45%" height={13} borderRadius={4} />
        <SkeletonText lines={2} lineHeight={12.5} lastLineWidth="80%" />
        <Stack horizontal gap={10} marginTop={4}>
          <Skeleton width="100%" height={44} borderRadius={14} style={{ flex: 1 }} />
          <Skeleton width="100%" height={44} borderRadius={14} color={COLORS.paperAlt} style={{ flex: 1 }} />
        </Stack>
      </Stack>
    </Stack>
  );
}

/** Find Your Church results list — shown while a search/near-me request is
 * on its first fetch and there's no previous result set to keep showing
 * (see app/select-church/index.tsx: `loading && results.length === 0`). */
export function ChurchResultsSkeleton() {
  return (
    <Stack gap={16} marginTop={20}>
      {Array.from({ length: RESULT_COUNT }).map((_, i) => (
        <ChurchResultCardSkeleton key={i} />
      ))}
    </Stack>
  );
}
