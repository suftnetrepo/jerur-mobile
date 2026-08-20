import { Stack } from "fluent-styles";
import { Skeleton, SkeletonCircle } from "./Skeleton";
import { COLORS } from "../../theme/colors";
import { SHADOW_SOFT } from "../../theme/shadows";

const CARD_COUNT = 2;

/** Mirrors one PrayerSessionCard: icon + title row, the time block, then a
 * description line and pill controls. Shown in prayers.tsx while
 * usePrayerTimes() is on its first fetch — that section currently renders
 * nothing at all until prayerTimes resolves, which this replaces. */
export function PrayersSkeleton() {
  return (
    <Stack gap={12} marginBottom={28}>
      {Array.from({ length: CARD_COUNT }).map((_, i) => (
        <Stack key={i} backgroundColor={COLORS.paper} borderRadius={20} padding={16} style={SHADOW_SOFT}>
          <Stack horizontal alignItems="center" gap={11} marginBottom={14}>
            <SkeletonCircle size={42} />
            <Skeleton width="55%" height={16} borderRadius={5} />
          </Stack>
          <Stack
            horizontal
            alignItems="center"
            backgroundColor={COLORS.paperSoftest}
            borderRadius={14}
            padding={12}
            marginBottom={12}
          >
            <Skeleton width={36} height={36} borderRadius={11} color={COLORS.paperAlt} />
            <Stack marginLeft={11} style={{ flex: 1 }} gap={6}>
              <Skeleton width={80} height={9} borderRadius={3} />
              <Skeleton width={120} height={17} borderRadius={5} />
            </Stack>
          </Stack>
          <Skeleton width={140} height={30} borderRadius={999} color={COLORS.paperAlt} />
        </Stack>
      ))}
    </Stack>
  );
}
