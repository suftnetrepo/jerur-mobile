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
}: {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  toValue?: number;
  accessibilityRole?: "button" | "link" | "none";
  accessibilityLabel?: string;
}) {
  const anim = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.timing(anim, { toValue, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }
  function pressOut() {
    Animated.spring(anim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }

  return (
    <Animated.View style={[style, { transform: [{ scale: anim }] }]}>
      <StyledPressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </StyledPressable>
    </Animated.View>
  );
}
