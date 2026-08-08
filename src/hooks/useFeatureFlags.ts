import { useMemo } from "react";
import { useSettings } from "./useChurchData";
import { MOBILE_FEATURES, type MobileFeature } from "../config/mobileFeatures";

/**
 * Central feature-flag hook. The selected church's enabled feature ids
 * live on `ChurchSettings.features` (GET /church/get, see src/api/church.ts)
 * — the backend is the source of truth, this hook just reads it and joins
 * it against the mobile feature catalogue in src/config/mobileFeatures.ts.
 *
 * Reuses useSettings() under the hood, so calling this alongside other
 * useSettings() consumers (e.g. the home screen) does not trigger an extra
 * fetch — react-query dedupes on the shared "settings" query key.
 *
 * Usage:
 *
 *   const { hasFeature } = useFeatureFlags();
 *   if (!hasFeature("giving")) return null;
 *
 * or, to render only what's enabled without any per-feature branching:
 *
 *   const { features } = useFeatureFlags();
 *   features.map((f) => <FeatureCard key={f.id} feature={f} />)
 */
export function useFeatureFlags() {
  const { data: settings, isLoading, isFetched } = useSettings();

  // Mirrors the admin portal's own `data?.features || []` fallback (see
  // jerur-next hooks/useSettings.jsx) — a church that has never saved
  // Settings -> Mobile Features has no `features` array at all, which
  // means no optional feature is enabled, not "everything enabled".
  const featureIds = useMemo(() => settings?.features ?? [], [settings?.features]);

  // Enabled features, resolved against the mobile catalogue and filtered
  // to those with a mobile screen already built (`route` set) — an admin
  // can toggle a feature on before its mobile screen ships without that
  // producing a dead link on the home screen.
  const features = useMemo<MobileFeature[]>(
    () => MOBILE_FEATURES.filter((feature) => feature.route && featureIds.includes(feature.id)),
    [featureIds]
  );

  function hasFeature(id: string): boolean {
    return featureIds.includes(id);
  }

  return {
    /** Enabled features with mobile metadata (label/icon/route/color/…), ready to render. */
    features,
    /** Raw enabled feature ids, exactly as stored on the church. */
    featureIds,
    /** The full feature catalogue, enabled or not — for future admin-style screens. */
    allFeatures: MOBILE_FEATURES,
    /** id => is this feature enabled for the selected church? */
    hasFeature,
    isLoading,
    isFetched,
  };
}
