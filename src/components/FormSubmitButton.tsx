import { StyledButton } from "fluent-styles";
import { COLORS } from "../theme/colors";

export function FormSubmitButton({
  label,
  loadingLabel,
  loading = false,
  onPress,
}: {
  label: string;
  loadingLabel: string;
  loading?: boolean;
  onPress: () => void;
}) {
  return (
    <StyledButton
      block
      loading={loading}
      disabled={loading}
      backgroundColor={COLORS.white}
      borderWidth={1}
      borderColor={COLORS.chromeBorder}
      onPress={onPress}
    >
      <StyledButton.Text color={COLORS.ink} fontWeight="700">
        {loading ? loadingLabel : label}
      </StyledButton.Text>
    </StyledButton>
  );
}
