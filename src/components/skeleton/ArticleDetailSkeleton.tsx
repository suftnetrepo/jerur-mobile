import { Stack } from "fluent-styles";
import { Skeleton, SkeletonText } from "./Skeleton";
import { SHADOW_SOFT } from "../../theme/shadows";

const H_PAD = 24;
const HERO_HEIGHT = 220;

/** Mirrors article/[id].tsx: hero image, title, date, then body-copy
 * lines. Shown while useArticleDetail() is on its first fetch. */
export function ArticleDetailSkeleton() {
  return (
    <Stack>
      <Stack paddingHorizontal={H_PAD} marginTop={8}>
        <Stack height={HERO_HEIGHT} borderRadius={20} overflow="hidden" style={SHADOW_SOFT}>
          <Skeleton width="100%" height="100%" borderRadius={0} />
        </Stack>
      </Stack>

      <Stack paddingHorizontal={H_PAD} marginTop={20} gap={10}>
        <SkeletonText lines={2} lineHeight={22} lastLineWidth="70%" gap={10} />
        <Skeleton width={110} height={12} borderRadius={4} />
      </Stack>

      <Stack paddingHorizontal={H_PAD} marginTop={24}>
        <SkeletonText lines={7} lineHeight={14} lastLineWidth="50%" gap={12} />
      </Stack>
    </Stack>
  );
}
