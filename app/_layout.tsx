import { useEffect, type ReactNode } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalPortalProvider, PortalManager } from "fluent-styles";
import { SelectedChurchProvider, useSelectedChurch } from "../src/church/SelectedChurchContext";
import { MemberSessionProvider } from "../src/member/MemberSessionContext";
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
                <Stack screenOptions={{ headerShown: false }} />
              </RouteGuard>
            </PortalManager>
          </GlobalPortalProvider>
        </MemberSessionProvider>
      </SelectedChurchProvider>
    </QueryClientProvider>
  );
}
