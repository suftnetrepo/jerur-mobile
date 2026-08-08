import { useQuery } from "@tanstack/react-query";
import * as churchApi from "../api/church";
import { useSelectedChurch } from "../church/SelectedChurchContext";

// Every one of these hits an endpoint that requires a real per-church
// "nj-api-key" (see src/api/client.ts) — until a church is actually
// selected AND SelectedChurchProvider has finished hydrating it from
// storage, that header is either absent or the "public-search" dummy
// value client.ts sends so /church/search alone can work pre-selection.
// Jerur's backend can't decrypt either of those into a real church id.
//
// RootLayout's RouteGuard (app/_layout.tsx) redirects away from any screen
// that needs a church once it confirms there isn't one, but that redirect
// only fires from a useEffect — it doesn't stop the initial render, so a
// screen under (app) can still mount (and these hooks fire on mount by
// default) during that one-render window before the redirect lands. On a
// cold start, the AsyncStorage read backing an *already selected* church
// hasn't resolved yet either, so this isn't just a "no church yet" case —
// it happens on every launch. `enabled` below is what actually closes that
// window: react-query holds off firing until hydration is done and a
// church id exists, then fires automatically the moment `church` becomes
// truthy.
function useChurchQueryEnabled() {
  const { church, isLoading } = useSelectedChurch();
  return !isLoading && !!church;
}

export function useSettings() {
  const enabled = useChurchQueryEnabled();
  return useQuery({ queryKey: ["settings"], queryFn: churchApi.getSettings, enabled });
}

export function useRegularServices() {
  const enabled = useChurchQueryEnabled();
  return useQuery({ queryKey: ["regular-services"], queryFn: churchApi.getRegularServices, enabled });
}

export function usePrayerTimes() {
  const enabled = useChurchQueryEnabled();
  return useQuery({ queryKey: ["prayer-times"], queryFn: churchApi.getPrayerTimes, enabled });
}

export function useFellowship() {
  const enabled = useChurchQueryEnabled();
  return useQuery({ queryKey: ["fellowship"], queryFn: churchApi.getFellowshipGroups, enabled });
}

export function useEvents() {
  const enabled = useChurchQueryEnabled();
  return useQuery({ queryKey: ["events"], queryFn: churchApi.getEvents, enabled });
}
