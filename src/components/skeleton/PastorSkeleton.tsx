import { Stack } from "fluent-styles";
import { Skeleton, SkeletonCircle, SkeletonText } from "./Skeleton";
import { COLORS } from "../../theme/colors";
import { SHADOW_SOFT } from "../../theme/shadows";

/** Mirrors pastor.tsx: avatar + name/title, the welcome-message card, and
 * the Email/Call contact rows. Shown while useSettings() is on its first
 * fetch — pastor.tsx has no data of its own besides settings.pastor_section. */
export function PastorSkeleton() {
  return (
    <Stack>
      <Stack alignItems="center" marginBottom={22} gap={10}>
        <SkeletonCircle size={92} />
        <Skeleton width={160} height={20} borderRadius={6} style={{ marginTop: 4 }} />
        <Skeleton width={120} height={13} borderRadius={4} />
      </Stack>

      <Stack backgroundColor={COLORS.paperWarm} borderRadius={22} padding={24} style={SHADOW_SOFT} marginBottom={22}>
        <Skeleton width={26} height={26} borderRadius={4} style={{ marginBottom: 10 }} />
        <SkeletonText lines={4} lineHeight={14} lastLineWidth="60%" />
      </Stack>

      <Stack backgroundColor={COLORS.paper} borderRadius={18} overflow="hidden" style={SHADOW_SOFT}>
        {[0, 1].map((i) => (
          <Stack key={i}>
            <Stack horizontal alignItems="center" gap={14} paddingHorizontal={18} paddingVertical={16}>
              <SkeletonCircle size={38} color={COLORS.goldPale} />
              <Stack style={{ flex: 1 }} gap={6}>
                <Skeleton width={40} height={12} borderRadius={4} />
                <Skeleton width="55%" height={13} borderRadius={4} />
              </Stack>
            </Stack>
            {i === 0 ? <Stack height={1} backgroundColor={COLORS.chromeBorder} style={{ marginLeft: 66 }} /> : null}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
