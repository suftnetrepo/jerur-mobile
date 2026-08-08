import { useEffect, type ReactNode } from "react";
import { router } from "expo-router";
import { Stack, Loader } from "fluent-styles";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { COLORS } from "../theme/colors";

/**
 * Gates an entire screen behind a mobile feature flag (see
 * src/config/mobileFeatures.ts / src/hooks/useFeatureFlags.ts).
 *
 * Hiding a feature's entry points (tabs, menu items, cards) isn't enough
 * on its own — the route itself is still directly reachable: a deep link
 * (winnerschapel://give), a stale bookmark, or someone just typing the URL
 * on web. Every feature-backed screen wraps its content in this so the
 * *route* honors the flag too, not just the links pointing at it — one
 * place to change what "disabled" does for the whole app, per screen:
 *
 *   export default function GiveScreen() {
 *     return (
 *       <FeatureGate feature="giving">
 *         <GiveScreenContent />
 *       </FeatureGate>
 *     );
 *   }
 */
export function FeatureGate({ feature, children }: { feature: string; children: ReactNode }) {
  const { hasFeature, isFetched } = useFeatureFlags();
  const enabled = hasFeature(feature);

  useEffect(() => {
    // Only redirect once settings have actually loaded — isFetched false
    // just means "don't know yet", not "disabled".
    if (isFetched && !enabled) {
      router.replace("/");
    }
  }, [isFetched, enabled]);

  if (!isFetched) {
    return (
      <Stack flex={1} alignItems="center" justifyContent="center" backgroundColor={COLORS.paper}>
        <Loader color={COLORS.indigo} />
      </Stack>
    );
  }

  if (!enabled) return null;

  return <>{children}</>;
}
