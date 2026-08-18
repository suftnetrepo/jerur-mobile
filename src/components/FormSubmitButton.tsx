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
      backgroundColor={COLORS.goldPale}
  
      borderColor={COLORS.goldPale}
      onPress={onPress}
    >
      <StyledButton.Text color={COLORS.indigo} fontWeight="700">
        {loading ? loadingLabel : label}
      </StyledButton.Text>
    </StyledButton>
  );
}
