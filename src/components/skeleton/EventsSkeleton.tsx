import { Stack } from "fluent-styles";
import { Skeleton, SkeletonCircle, SkeletonText } from "./Skeleton";
import { COLORS } from "../../theme/colors";
import { SHADOW_CARD } from "../../theme/shadows";

const CARD_COUNT = 2;

/** Mirrors one events/index.tsx card: image, title, date/location rows,
 * description, Register CTA. Shown while useEvents() is on its first
 * fetch — distinct from the real "No upcoming events" empty state, which
 * only renders once loading has actually finished. */
export function EventsSkeleton() {
  return (
    <Stack gap={14}>
      {Array.from({ length: CARD_COUNT }).map((_, i) => (
        <Stack key={i} backgroundColor={COLORS.white} borderRadius={24} overflow="hidden" style={SHADOW_CARD}>
          <Skeleton width="100%" height={200} borderRadius={0} />
          <Stack padding={20} paddingTop={18} gap={12}>
            <Skeleton width="75%" height={20} borderRadius={5} />
            <Stack horizontal alignItems="center" gap={8}>
              <SkeletonCircle size={28} color={COLORS.goldPale} />
              <Skeleton width="55%" height={13} borderRadius={4} />
            </Stack>
            <Stack horizontal alignItems="center" gap={8}>
              <SkeletonCircle size={28} color={COLORS.goldPale} />
              <Skeleton width="45%" height={13} borderRadius={4} />
            </Stack>
            <SkeletonText lines={2} lineHeight={13} lastLineWidth="65%" />
            <Skeleton width="100%" height={46} borderRadius={24} color={COLORS.paperAlt} style={{ marginTop: 4 }} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
