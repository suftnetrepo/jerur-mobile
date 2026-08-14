import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledPressable } from "fluent-styles";
import { COLORS } from "../theme/colors";
import { SHADOW_SOFT } from "../theme/shadows";
import { useFeatureFlags } from "../hooks/useFeatureFlags";

export type Tab = "home" | "bible" | "hymns" | "more";

// "home" and "more" are core navigation, not toggleable features — they
// always show. "bible" and "hymns" front their matching feature flags,
// features, so the bar only shows them when the selected church has that
// feature enabled (see src/config/mobileFeatures.ts).
//
// The "more" tab's label/icon read as "Settings" (more.tsx is now
// app-wide settings only, not a feature list — every feature already has
// its own pill on Home) — key stays "more" so the `active="more"` prop
// scattered across screens (prayers.tsx, fellowship.tsx, ...) doesn't need
// touching everywhere for what's just a label change.
const TABS: { key: Tab; label: string; icon: string; route: string; featureId?: string }[] = [
  { key: "home", label: "Home", icon: "home", route: "/" },
  { key: "bible", label: "Bible", icon: "book-open", route: "/bible", featureId: "bible" },
  { key: "hymns", label: "Hymns", icon: "music", route: "/hymns", featureId: "hymns" },
  { key: "more", label: "Settings", icon: "settings", route: "/more" },
];

// Flat, fixed bottom bar — icon above label, active tab bold in the brand
// color, inactive tabs muted gray. Matches the Life.Church reference
// exactly (no floating pill, no colored background chip) rather than the
// earlier premeal-style floating pill treatment.
export function BottomTabBar({ active }: { active?: Tab }) {
  const { hasFeature } = useFeatureFlags();
  const tabs = TABS.filter((tab) => !tab.featureId || hasFeature(tab.featureId));

  function go(tab: Tab) {
    const target = TABS.find((t) => t.key === tab);
    if (target) router.replace(target.route as any);
  }

  return (
    <Stack
      horizontal
      backgroundColor={COLORS.paper}
      paddingTop={8}
      paddingBottom={18}
      paddingHorizontal={10}
      alignItems="center"
      justifyContent="space-around"
      style={{ borderTopWidth: 1, borderColor: "rgba(27,35,64,0.07)", ...SHADOW_SOFT }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <StyledPressable
            key={tab.key}
            onPress={() => go(tab.key)}
            alignItems="center"
            gap={3}
            minWidth={64}
            paddingTop={6}
            paddingBottom={5}
            borderRadius={16}
            backgroundColor={isActive ? COLORS.paperAlt : "transparent"}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
          >
            <Icon name={tab.icon as any} size={20} color={isActive ? COLORS.indigo : COLORS.inkSoft} />
            <StyledText fontSize={10.5} fontWeight={isActive ? "800" : "500"} color={isActive ? COLORS.indigo : COLORS.inkSoft}>
              {tab.label}
            </StyledText>
          </StyledPressable>
        );
      })}
    </Stack>
  );
}
