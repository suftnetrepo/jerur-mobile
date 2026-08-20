import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * Mirrors the OS-level "Reduce Motion" accessibility setting (iOS Settings
 * > Accessibility > Motion; Android Settings > Accessibility > Remove
 * animations). Starts `false` (never blocks the first paint on this async
 * check) and flips true as soon as `isReduceMotionEnabled()` resolves or
 * the user toggles the setting while the app is open — used by the
 * skeleton/shimmer system (src/components/skeleton/) to fall back to
 * static placeholders instead of a looping opacity animation.
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReducedMotion(value);
    });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (value: boolean) => setReducedMotion(value),
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reducedMotion;
}
