import { Popup, Stack, StyledText, StyledPressable } from "fluent-styles";
import { COLORS } from "../theme/colors";

/**
 * "A-  Aa  A+" font-size control inside the existing fluent-styles Popup —
 * no Modalize, per the migration plan. Purely presentational (the caller
 * owns the actual font-size state/persistence — see
 * src/bible/use-reader-font-size.ts and src/hymns/use-reader-font-size.ts),
 * so it's shared between the Bible and Hymns readers rather than
 * duplicated — renamed from BibleFontSizePopup once Hymns needed the same
 * control (Phase 3).
 */
export function ReaderFontSizePopup({
  visible,
  onClose,
  fontSize,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
  onReset,
}: {
  visible: boolean;
  onClose: () => void;
  fontSize: number;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onReset: () => void;
}) {
  return (
    <Popup visible={visible} onClose={onClose} title="Font Size" showClose safeAreaBottom>
      <Stack horizontal alignItems="center" justifyContent="center" gap={18} paddingHorizontal={24} paddingVertical={26}>
        <SizeButton label="A-" disabled={!canDecrease} onPress={onDecrease} />
        <StyledPressable
          onPress={onReset}
          alignItems="center"
          justifyContent="center"
          width={76}
          height={76}
          borderRadius={20}
          backgroundColor={COLORS.goldPale}
          accessibilityRole="button"
          accessibilityLabel="Reset font size to default"
        >
          <StyledText fontSize={Math.min(fontSize, 22)} fontWeight="800" color={COLORS.goldDeep}>
            Aa
          </StyledText>
        </StyledPressable>
        <SizeButton label="A+" disabled={!canIncrease} onPress={onIncrease} />
      </Stack>
    </Popup>
  );
}

function SizeButton({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
  return (
    <StyledPressable
      onPress={disabled ? undefined : onPress}
      width={56}
      height={56}
      borderRadius={16}
      alignItems="center"
      justifyContent="center"
      backgroundColor={disabled ? COLORS.chrome : COLORS.white}
      style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}
      accessibilityRole="button"
      accessibilityLabel={label === "A-" ? "Decrease font size" : "Increase font size"}
      accessibilityState={{ disabled }}
    >
      <StyledText fontSize={label === "A-" ? 15 : 21} fontWeight="800" color={disabled ? COLORS.inkSoft : COLORS.ink}>
        {label}
      </StyledText>
    </StyledPressable>
  );
}
