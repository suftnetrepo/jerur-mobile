import { Stack } from "fluent-styles";
import { Skeleton } from "./Skeleton";
import { COLORS } from "../../theme/colors";

const H_PAD = 20;
const PILL_WIDTHS = [92, 110, 84, 100, 76];

/**
 * Shown in place of Home's quick-actions row and hero slot while
 * useSettings() is on its first fetch (settingsLoading, see
 * app/(app)/index.tsx). Deliberately doesn't include the greeting title
 * above it — that already reads `church?.name` from the already-hydrated
 * selected church, not from settings, so it has real content to show
 * immediately and skeletoning it would hide valid data for no reason.
 * Hero block is sized to match ChurchBanner's BANNER_HEIGHT so nothing
 * jumps once real content swaps in. The Latest Sermon and Articles
 * sections skeleton themselves independently (SermonCardSkeleton /
 * ArticlesSection's own isLoading).
 */
export function HomeSkeletonPills() {
  return (
    <Stack horizontal gap={10} paddingHorizontal={H_PAD} marginBottom={20}>
      {PILL_WIDTHS.map((w, i) => (
        <Skeleton key={i} width={w} height={42} borderRadius={999} color={COLORS.paperAlt} />
      ))}
    </Stack>
  );
}

export function HomeSkeletonHero() {
  return (
    <Stack paddingHorizontal={H_PAD}>
      <Skeleton width="100%" height={210} borderRadius={22} />
    </Stack>
  );
}
