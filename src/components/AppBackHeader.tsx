import { router } from "expo-router";
import { StyledPage, StyledText, Stack } from "fluent-styles";
import { COLORS } from "../theme/colors";

/** Shared detail-screen chrome. Keeps navigation geometry identical while
 * allowing content-led screens to omit a duplicate centered title. */
export function AppBackHeader({ title }: { title?: string }) {
  return (
    <>
      <StyledPage.Header
        shapeProps={{
          cycle: true,
          size: 48,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.chromeBorder,
        }}
        marginHorizontal={16}
        showBackArrow
        onBackPress={() => router.back()}
        backgroundColor={COLORS.paper}
      />
      {title ? (
        <Stack paddingHorizontal={24} paddingTop={18} paddingBottom={2}>
          <StyledText
            fontSize={11}
            fontWeight="700"
            letterSpacing={1}
            color={COLORS.gold}
            style={{ textTransform: "uppercase" }}
          >
            {title}
          </StyledText>
        </Stack>
      ) : null}
    </>
  );
}
