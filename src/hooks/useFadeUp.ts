import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export function useFadeUp(delay = 0) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 420, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    // Mount-only fade — no dependency on `anim` (stable ref).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  };
}
