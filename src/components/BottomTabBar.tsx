import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledPressable } from "fluent-styles";
import { COLORS } from "../theme/colors";
import { useFeatureFlags } from "../hooks/useFeatureFlags";

export type Tab = "home" | "events" | "give" | "more";

// "home" and "more" are core navigation, not toggleable features — they
// always show. "events" and "give" front the "upcoming-events" / "giving"
// features, so the bar only shows them when the selected church has that
// feature enabled (see src/config/mobileFeatures.ts).
const TABS: { key: Tab; label: string; icon: string; route: string; featureId?: string }[] = [
  { key: "home", label: "Home", icon: "home", route: "/" },
  { key: "events", label: "Events", icon: "calendar", route: "/events", featureId: "upcoming-events" },
  { key: "give", label: "Give", icon: "heart", route: "/give", featureId: "giving" },
  { key: "more", label: "More", icon: "grid", route: "/more" },
];

// Flat, fixed bottom bar — icon above label, active tab bold in the brand
// color, inactive tabs muted gray. Matches the Life.Church reference
// exactly (no floating pill, no colored background chip) rather than the
// earlier premeal-style floating pill treatment.
export function BottomTabBar({ active }: { active: Tab }) {
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
      paddingTop={10}
      paddingBottom={22}
      alignItems="center"
      justifyContent="space-around"
      style={{ borderTopWidth: 1, borderColor: COLORS.chromeBorder }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <StyledPressable
            key={tab.key}
            onPress={() => go(tab.key)}
            alignItems="center"
            gap={4}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
          >
            <Icon name={tab.icon as any} size={21} color={isActive ? COLORS.indigo : COLORS.inkSoft} />
            <StyledText fontSize={11} fontWeight={isActive ? "700" : "500"} color={isActive ? COLORS.indigo : COLORS.inkSoft}>
              {tab.label}
            </StyledText>
          </StyledPressable>
        );
      })}
    </Stack>
  );
}
