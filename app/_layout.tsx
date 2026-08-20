import { useEffect, type ReactNode } from "react";
import { Stack as RouterStack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalPortalProvider, PortalManager, StyledPage, Stack, Loader } from "fluent-styles";
import { SelectedChurchProvider, useSelectedChurch } from "../src/church/SelectedChurchContext";
import { MemberSessionProvider } from "../src/member/MemberSessionContext";
import { COLORS } from "../src/theme/colors";
import "../src/notifications/notification-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Church data (settings, service times, events, fellowship) doesn't
      // need to feel real-time — a few minutes of staleness is a fine
      // tradeoff against refetching on every screen focus.
      staleTime: 5 * 60_000,
      retry: 1,
    },
  },
});

/**
 * Same pattern as premeal-mobile's RouteGuard, gated on a different fact:
 * has the user selected a church yet, rather than "have they logged in."
 * No church selected → force them into /select-church, regardless of what
 * they were trying to open. Church selected but sitting on /select-church
 * anyway (e.g. they backed into it, or it's their first launch and they
 * just picked one) → send them into the main app instead.
 *
 * /select-church is a real top-level route (not a route group like (app))
 * on purpose — an earlier version had it as (select-church) with its own
 * index.tsx, which collapses to the same "/" path as (app)/index.tsx.
 * Two route groups both claiming "/" is an actual conflict, not just a
 * style choice — Expo Router can't reliably tell them apart. Giving this
 * one a real path segment avoids that entirely.
 *
 * `isLoading` IS the hydration flag — true only for the brief window
 * before SelectedChurchProvider has read AsyncStorage's persisted church
 * (or confirmed there isn't one). The effect below already refuses to
 * redirect during that window, but that alone still let <RouterStack/>
 * (and therefore whichever screen the current URL resolves to — Home by
 * default) mount and paint before the persisted church was known. Data
 * hooks were already protected from that same window by
 * useChurchQueryEnabled() (src/hooks/useChurchData.ts), but the screen
 * itself would still flash briefly with no data. Now the navigator isn't
 * mounted at all until hydration resolves, so there's nothing to flash —
 * see the `if (isLoading)` branch below.
 */
function RouteGuard({ children }: { children: ReactNode }) {
  const { church, isLoading } = useSelectedChurch();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const onSelectChurchScreen = segments[0] === "select-church";

    if (!church && !onSelectChurchScreen) {
      router.replace("/select-church");
      return;
    }
    if (church && onSelectChurchScreen) {
      router.replace("/");
    }
  }, [church, isLoading, segments, router]);

  if (isLoading) {
    return (
      <StyledPage flex={1} backgroundColor={COLORS.paper}>
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Loader color={COLORS.indigo} />
        </Stack>
      </StyledPage>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedChurchProvider>
        <MemberSessionProvider>
          <GlobalPortalProvider>
            <PortalManager>
              <RouteGuard>
                <RouterStack screenOptions={{ headerShown: false }} />
              </RouteGuard>
            </PortalManager>
          </GlobalPortalProvider>
        </MemberSessionProvider>
      </SelectedChurchProvider>
    </QueryClientProvider>
  );
}
