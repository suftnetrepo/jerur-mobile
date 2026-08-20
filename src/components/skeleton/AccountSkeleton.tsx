import { Stack } from "fluent-styles";
import { Skeleton, SkeletonCircle } from "./Skeleton";
import { COLORS } from "../../theme/colors";
import { SHADOW_SOFT } from "../../theme/shadows";

/** Shown while MemberSessionContext is still hydrating the stored member
 * session (isLoading) — before it's known whether to render the signed-in
 * profile or the login/register forms. Mirrors account.tsx's general
 * shape (hero text block + a rounded content card) without committing to
 * either variant's exact contents. */
export function AccountSkeleton() {
  return (
    <Stack>
      <Stack
        width={42}
        height={4}
        borderRadius={999}
        backgroundColor={COLORS.paperAlt}
        marginHorizontal={24}
      />
      <Stack paddingHorizontal={24} paddingTop={16} paddingBottom={44} gap={10}>
        <SkeletonCircle size={46} />
        <Skeleton width="60%" height={24} borderRadius={6} style={{ marginTop: 8 }} />
        <Skeleton width="85%" height={13} borderRadius={4} />
      </Stack>
      <Stack marginHorizontal={20} marginTop={-28} backgroundColor={COLORS.paper} borderRadius={24} padding={22} style={SHADOW_SOFT}>
        <Stack alignItems="center" gap={12}>
          <SkeletonCircle size={84} />
          <Skeleton width={150} height={18} borderRadius={5} />
          <Skeleton width="100%" height={48} borderRadius={14} style={{ marginTop: 12 }} />
          <Skeleton width="100%" height={48} borderRadius={14} color={COLORS.errorLight} />
        </Stack>
      </Stack>
    </Stack>
  );
}
