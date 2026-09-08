import { useRef } from "react";
import { Animated, type StyleProp, type ViewStyle } from "react-native";
import { Stack, StyledPressable } from "fluent-styles";
import { Text } from "./text";
import { COLORS } from "../theme/colors";

/**
 * Pill-shaped toggle chip with a springy press animation - shared by any
 * screen that needs a small set of filter/section chips (currently the
 * Bible book list's Old/New Testament jump chips). Bounces down on
 * press-in and springs back past rest on press-out (two chained
 * Animated.spring calls, not a timing curve), so picking a chip reads as a
 * tactile "pop" rather than a flat state change - same idea as
 * ScalePressable, but bouncier and pill/toggle-shaped rather than a plain
 * scale-on-press wrapper.
 */
export function SpringChip({
  label,
  count,
  active = false,
  disabled = false,
  onPress,
  style,
}: {
  label: string;
  count?: number;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, { toValue: 0.9, friction: 5, tension: 300, useNativeDriver: true }).start();
  }
  function pressOut() {
    // Overshoots past 1 before settling - friction/tension tuned low-ish so
    // the bounce is felt, not just a snap back.
    Animated.spring(scale, { toValue: 1, friction: 3.5, tension: 250, useNativeDriver: true }).start();
  }

  return (
    <Animated.View style={[{ flex: 1, transform: [{ scale }] }, style]}>
      <StyledPressable
        onPress={disabled ? undefined : onPress}
        onPressIn={disabled ? undefined : pressIn}
        onPressOut={disabled ? undefined : pressOut}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap={6}
        paddingHorizontal={8}
        paddingVertical={8}
        borderRadius={50}
        backgroundColor={disabled ? COLORS.chrome : active ? COLORS.indigo : COLORS.white}
        style={{ borderWidth: 1, borderColor: active ? COLORS.indigo : COLORS.chromeBorder }}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, selected: active }}
      >
        <Stack horizontal alignItems="center" gap={6} flex={1}>
          <Text variant="subLabel" fontSize={10.5} color={disabled ? COLORS.inkSoft : active ? COLORS.onPrimary : COLORS.ink}>
            {label}
          </Text>
        </Stack>
        {typeof count === "number" ? (
          <Stack
            minWidth={22}
            height={22}
            paddingHorizontal={5}
            borderRadius={50}
            alignItems="center"
            justifyContent="center"
            backgroundColor={active ? "rgba(255,255,255,0.18)" : COLORS.paperAlt}
          >
            <Text fontSize={9.5} fontWeight="800" color={active ? COLORS.onPrimary : COLORS.inkSoft}>
              {count}
            </Text>
          </Stack>
        ) : null}
      </StyledPressable>
    </Animated.View>
  );
}
