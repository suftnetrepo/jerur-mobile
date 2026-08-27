import { useRef, type ReactNode } from "react";
import { Animated, Easing, type StyleProp, type ViewStyle } from "react-native";
import { StyledPressable } from "fluent-styles";

export function ScalePressable({
  onPress,
  children,
  style,
  toValue = 0.96,
  accessibilityRole,
  accessibilityLabel,
  disabled,
}: {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  toValue?: number;
  accessibilityRole?: "button" | "link" | "none";
  accessibilityLabel?: string;
  disabled?: boolean;
}) {
  const anim = useRef(new Animated.Value(1)).current;

  function pressIn() {
    if (disabled) return;
    Animated.timing(anim, { toValue, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }
  function pressOut() {
    if (disabled) return;
    Animated.spring(anim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }

  return (
    <Animated.View style={[style, { transform: [{ scale: anim }] }]}>
      <StyledPressable
        onPress={disabled ? undefined : onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </StyledPressable>
    </Animated.View>
  );
}
