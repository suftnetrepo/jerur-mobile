import type { ComponentProps } from "react";
import { StyledPage } from "fluent-styles";
import { COLORS } from "../theme/colors";

type ThemeHeaderProps = ComponentProps<typeof StyledPage.Header>;

/** Theme-aware wrapper for Fluent's page header chrome. */
export function ThemeHeader({
  titleProps,
  backArrowProps,
  shapeProps,
  ...props
}: ThemeHeaderProps) {
  return (
    <StyledPage.Header
      {...props}
      titleProps={{ color: COLORS.ink, ...titleProps }}
      backArrowProps={{ color: COLORS.ink, ...backArrowProps }}
      shapeProps={shapeProps ? { borderColor: COLORS.chromeBorder, ...shapeProps } : shapeProps}
    />
  );
}
