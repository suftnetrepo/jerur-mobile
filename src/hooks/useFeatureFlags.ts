import { useMemo } from "react";
import { useSettings } from "./useChurchData";
import { MOBILE_FEATURES, getFeatureById, type MobileFeature } from "../config/mobileFeatures";

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
  const denomination = settings?.denomination;

  // A feature is actually available when the church has enabled it AND
  // (it carries no denomination restriction, or the church's own
  // denomination is one it's restricted to) — e.g. Prophetic Theme of the
  // Month, Wofbi, Believers Foundation Class, Community Food Bank and
  // Free Transport are all living-faith-church only (see
  // MobileFeature.denominations in src/config/mobileFeatures.ts).
  // Checked here, not just by hiding the admin's toggle, so a `features`
  // id left over from before a denomination change never resurfaces.
  function isAvailable(feature: MobileFeature): boolean {
    if (!featureIds.includes(feature.id)) return false;
    if (!feature.denominations?.length) return true;
    return !!denomination && feature.denominations.includes(denomination);
  }

  // Enabled features, resolved against the mobile catalogue and filtered
  // to those with a mobile screen already built (`route` set) — an admin
  // can toggle a feature on before its mobile screen ships without that
  // producing a dead link on the home screen.
  const features = useMemo<MobileFeature[]>(
    () => MOBILE_FEATURES.filter((feature) => feature.route && isAvailable(feature)),
    [featureIds, denomination]
  );

  function hasFeature(id: string): boolean {
    const feature = getFeatureById(id);
    return !!feature && isAvailable(feature);
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
