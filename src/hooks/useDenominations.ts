import { useCallback } from "react";
import { DENOMINATIONS, type Denomination } from "../config/denominations";

/**
 * Reads the local denomination catalogue (src/config/denominations.ts) —
 * no API calls, no network state. Mirrors the shape of useFeatureFlags for
 * a static, hand-maintained catalogue: a plain list plus an id -> label
 * lookup helper.
 *
 * Phase 2 prep only — nothing in this app calls this yet. It exists so
 * the upcoming filter bottom sheet (and anything that needs to render a
 * previously-selected denomination back as a label, e.g. an active-filter
 * chip) has a single place to read from.
 */
export function useDenominations() {
  const getDenominationLabel = useCallback((id: string): string => {
    return DENOMINATIONS.find((d) => d.id === id)?.label ?? id;
  }, []);

  return {
    denominations: DENOMINATIONS as Denomination[],
    getDenominationLabel,
  };
}
