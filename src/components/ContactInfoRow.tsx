import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledPressable } from "fluent-styles";
import { COLORS } from "../theme/colors";

/**
 * Shared "icon circle + label + value (+ optional chevron)" row, extracted
 * from contact.tsx's original local ContactRow so About Us (and anywhere
 * else that needs the same contact-detail pattern) doesn't reimplement it.
 * `iconBg`/`iconColor` default to the exact gold tone contact.tsx already
 * used, so its existing call sites need no prop changes to keep their
 * current look — only the import moved.
 *
 * Uses StyledPressable (proper tap detection), not onTouchEnd — onTouchEnd
 * fires on ANY touch release inside the row's bounds, including the end of
 * a scroll drag that merely passed over it, which is exactly what the
 * original ContactRow did and why scrolling a page containing these rows
 * could fire Call/Email unprompted. A row with no `onPress` (e.g.
 * Denomination) renders as a plain, non-pressable Stack.
 */
export function ContactInfoRow({
  icon,
  label,
  value,
  onPress,
  showChevron = false,
  iconBg = COLORS.goldPale,
  iconColor = COLORS.goldDeep,
}: {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
  showChevron?: boolean;
  iconBg?: string;
  iconColor?: string;
}) {
  const content = (
    <Stack horizontal gap={14} alignItems="center" style={{ minHeight: 58 }}>
      <Stack width={46} height={46} borderRadius={23} backgroundColor={iconBg} alignItems="center" justifyContent="center">
        <Icon name={icon as any} size={20} color={iconColor} />
      </Stack>
      <Stack flex={1}>
        <StyledText fontSize={14} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 2 }}>
          {label}
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} numberOfLines={2} style={{ lineHeight: 19 }}>
          {value}
        </StyledText>
      </Stack>
      {showChevron && <Icon name="chevron-right" size={22} color={COLORS.inkSoft} />}
    </Stack>
  );

  if (!onPress) return content;

  return (
    <StyledPressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      {content}
    </StyledPressable>
  );
}
