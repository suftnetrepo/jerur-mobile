import { Stack } from "fluent-styles";
import { Skeleton, SkeletonCircle, SkeletonText } from "./Skeleton";
import { COLORS } from "../../theme/colors";
import { SHADOW_CARD } from "../../theme/shadows";

const CARD_COUNT = 2;

/** Mirrors one service-times.tsx card: icon badge + title, detail rows,
 * description, divider, action buttons. Shown while useRegularServices()
 * is on its first fetch — distinct from the real "no services yet" empty
 * state, which only renders once loading has actually finished. */
export function ServiceTimesSkeleton() {
  return (
    <Stack gap={20}>
      {Array.from({ length: CARD_COUNT }).map((_, i) => (
        <Stack key={i} backgroundColor={COLORS.white} borderRadius={18} padding={18} style={SHADOW_CARD}>
          <Stack horizontal alignItems="center" gap={12} marginBottom={14}>
            <SkeletonCircle size={50} />
            <Stack style={{ flex: 1 }} gap={6}>
              <Skeleton width="70%" height={16} borderRadius={5} />
              <Skeleton width="40%" height={12} borderRadius={4} />
            </Stack>
          </Stack>
          <Stack gap={9} style={{ marginBottom: 14 }}>
            <Skeleton width="55%" height={12} borderRadius={4} />
            <Skeleton width="45%" height={12} borderRadius={4} />
            <Skeleton width="80%" height={12} borderRadius={4} />
          </Stack>
          <SkeletonText lines={2} lineHeight={12} lastLineWidth="60%" style={{ marginBottom: 14 }} />
          <Stack height={1} backgroundColor={COLORS.chromeBorder} marginBottom={14} />
          <Stack horizontal gap={10}>
            <Skeleton width="100%" height={40} borderRadius={12} color={COLORS.paperAlt} style={{ flex: 1 }} />
            <Skeleton width="100%" height={40} borderRadius={12} color={COLORS.paperAlt} style={{ flex: 1 }} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
