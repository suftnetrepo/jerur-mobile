import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing } from "react-native";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Rest/peak opacity of the shared pulse — every <Skeleton/> bone in the app
// reads its opacity off the ONE Animated.Value this provider owns, so a
// screen full of placeholders breathes in sync as a single soft wash
// rather than each block animating on its own clock (cheaper too: one
// native-driven loop for the whole tree, not one per skeleton instance).
const REST_OPACITY = 0.35;
const PEAK_OPACITY = 1;
const STATIC_OPACITY = 0.55;
const PULSE_DURATION = 750;

const ShimmerContext = createContext<Animated.Value | null>(null);

/**
 * Mount once near the root (see app/_layout.tsx) so every screen's
 * skeletons share the same animation driver. Respects the OS "Reduce
 * Motion" setting: when it's on, the shared value is pinned at a fixed
 * mid-opacity instead of looping — every <Skeleton/> automatically renders
 * as a static placeholder with no code change on its end.
 */
export function ShimmerProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(STATIC_OPACITY)).current;

  useEffect(() => {
    if (reducedMotion) {
      pulse.stopAnimation();
      pulse.setValue(STATIC_OPACITY);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: PEAK_OPACITY,
          duration: PULSE_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: REST_OPACITY,
          duration: PULSE_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reducedMotion, pulse]);

  return <ShimmerContext.Provider value={pulse}>{children}</ShimmerContext.Provider>;
}

// Module-level fallback (never animates) for the unlikely case a <Skeleton/>
// renders outside <ShimmerProvider> — same visual result as reduced motion,
// never a crash.
const STATIC_FALLBACK = new Animated.Value(STATIC_OPACITY);

export function useShimmerValue(): Animated.Value {
  return useContext(ShimmerContext) ?? STATIC_FALLBACK;
}
