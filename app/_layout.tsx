import { Fragment, useEffect, type ReactNode } from "react";
import { Image, Platform, StatusBar } from "react-native";
import { Stack as RouterStack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalPortalProvider, PortalManager, StyledPage, Stack } from "fluent-styles";
import {
  useFonts,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans'
import { SelectedChurchProvider, useSelectedChurch } from "../src/church/SelectedChurchContext";
import { MemberSessionProvider } from "../src/member/MemberSessionContext";
import { ShimmerProvider } from "../src/components/skeleton";
import { ThemeProvider, useMobileTheme } from "../src/theme/ThemeContext";
import "../src/notifications/notification-handler";

const SPLASH_LOGO = require("../assets/splash-icon.png");

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


function RouteGuard({ children }: { children: ReactNode }) {
  const { church, isLoading } = useSelectedChurch();
  const { activeThemeId, isLoading: themeLoading } = useMobileTheme();
  const segments = useSegments() as string[];
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  })

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

  useEffect(() => {
    const isDarkTheme = activeThemeId === "dark";
    StatusBar.setBarStyle(isDarkTheme ? "light-content" : "dark-content", true);
  }, [activeThemeId, segments]);

  if (isLoading || themeLoading || !fontsLoaded) {
    return (
      <StyledPage
        flex={1}
        backgroundColor="#FFFFFF"
        statusBarStyle="dark-content"
        statusBarBackgroundColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
      >
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Image
            source={SPLASH_LOGO}
            resizeMode="contain"
            style={{ width: 160, height: 160 }}
            accessibilityLabel="Jerur"
          />
        </Stack>
      </StyledPage>
    );
  }

  return <Fragment key={activeThemeId}>{children}</Fragment>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShimmerProvider>
        <SelectedChurchProvider>
          <ThemeProvider>
            <MemberSessionProvider>
              <GlobalPortalProvider>
                <PortalManager>
                  <RouteGuard>
                    <RouterStack screenOptions={{ headerShown: false }} />
                  </RouteGuard>
                </PortalManager>
              </GlobalPortalProvider>
            </MemberSessionProvider>
          </ThemeProvider>
        </SelectedChurchProvider>
      </ShimmerProvider>
    </QueryClientProvider>
  );
}
