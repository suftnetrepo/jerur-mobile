import { router } from "expo-router";
import { COLORS } from "../theme/colors";
import { ThemeHeader } from "./ThemeHeader";

/** Shared detail-screen chrome, aligned with the Bible and Notes headers. */
export function AppBackHeader({
  title,
  backgroundColor = COLORS.paper,
}: {
  title?: string;
  backgroundColor?: string;
}) {
  return (
    <ThemeHeader
      showBackArrow
      shapeProps={{
        cycle: true,
        size: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.chromeBorder,
      }}
      title={title}
      titleAlignment="center"
      onBackPress={() => router.back()}
      backgroundColor={backgroundColor}
      marginHorizontal={16}
    />
  );
}
