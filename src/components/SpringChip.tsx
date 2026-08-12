import { useRef } from "react";
import { Animated, type StyleProp, type ViewStyle } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPressable, StyledText } from "fluent-styles";
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
  active = false,
  disabled = false,
  onPress,
  style,
}: {
  label: string;
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
        justifyContent="center"
        gap={6}
        paddingVertical={11}
        borderRadius={1}
        backgroundColor={disabled ? COLORS.chrome : active ? COLORS.indigo : COLORS.white}
        style={{ borderWidth: 1, borderColor: active ? COLORS.indigo : COLORS.chromeBorder }}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, selected: active }}
      >
        {active ? <Icon name="check" size={12} color={COLORS.white} /> : null}
        <StyledText fontSize={12.5} fontWeight="700" color={disabled ? COLORS.inkSoft : active ? COLORS.white : COLORS.ink}>
          {label}
        </StyledText>
      </StyledPressable>
    </Animated.View>
  );
}
