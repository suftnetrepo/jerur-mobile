import { Animated } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledPressable, StyledShape, Stack } from "fluent-styles";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import { useFadeUp } from "../../src/hooks/useFadeUp";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import { SHADOW_SOFT } from "../../src/theme/shadows";
import { COLORS } from "../../src/theme/colors";

const TONES = [
  { bg: COLORS.goldPale, fg: COLORS.goldDeep },
  { bg: COLORS.sageSoft, fg: COLORS.sage },
  { bg: "rgba(27,35,64,0.1)", fg: COLORS.indigo },
  { bg: "#F3DFCF", fg: "#9C5B3C" },
  { bg: "#E9D9EC", fg: "#7A4F87" },
];

type MoreItem = { label: string; icon: string; route: string };

// Which feature ids appear under which section, and (where the shorter nav
// label reads better than the catalogue's admin-facing one) a label
// override — icon and route always come from src/config/mobileFeatures.ts,
// never re-typed here, so there's exactly one place that can drift out of
// sync with the backend. A section simply disappears once none of its
// feature ids are enabled for the selected church.
const FEATURE_SECTIONS: { title: string; items: { featureId: string; label?: string }[] }[] = [
  {
    title: "Visit",
    items: [
      { featureId: "service-times" },
      { featureId: "register-member", label: "New here?" },
      { featureId: "house-fellowship", label: "Fellowship groups" },
      { featureId: "free-transport" },
    ],
  },
  {
    title: "Community",
    items: [
      { featureId: "testimony", label: "Testimonies" },
      { featureId: "community-food-bank", label: "Food bank" },
    ],
  },
  {
    title: "Resources",
    items: [{ featureId: "believers-foundation-class" }, { featureId: "wofbi-basic-certificate" }],
  },
  {
    title: "Get in touch",
    items: [{ featureId: "contact-us" }],
  },
];

export default function MoreScreen() {
  const listAnim = useFadeUp(0);
  const { features, hasFeature } = useFeatureFlags();
  let toneIndex = 0;

  // "My account" isn't a toggleable backend feature — Account always
  // shows; "Submit attendance" is a shortcut into the "attendance"
  // feature, so it's gated the same way any other entry point is.
  const accountSection: { title: string; items: MoreItem[] } = {
    title: "My account",
    items: [
      { label: "Account", icon: "user", route: "/account" },
      // Not "/check-in" directly - it now requires a known serviceId,
      // picked from a specific service's own "Submit attendance" button
      // on Service Times (see check-in.tsx / service-times.tsx).
      ...(hasFeature("attendance") ? [{ label: "Submit attendance", icon: "check-circle", route: "/service-times" }] : []),
    ],
  };

  const featureSections = FEATURE_SECTIONS.map((section) => ({
    title: section.title,
    items: section.items
      .map(({ featureId, label }) => {
        const feature = features.find((f) => f.id === featureId);
        return feature ? { label: label ?? feature.label, icon: feature.icon, route: feature.route! } : null;
      })
      .filter((item): item is MoreItem => item !== null),
  })).filter((section) => section.items.length > 0);

  // "About us" isn't a toggleable backend feature either — always shown.
  const aboutSection: { title: string; items: MoreItem[] } = {
    title: "About",
    items: [{ label: "About us", icon: "info", route: "/about" }],
  };

  const sections = [accountSection, ...featureSections, aboutSection];

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.chrome}>
      <StyledScrollView contentContainerStyle={{ padding: 20, paddingTop: 16, paddingBottom: 28 }}>
        <StyledText fontSize={26} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 22 }}>
          More
        </StyledText>

        <Animated.View style={listAnim}>
          {sections.map((section) => (
            <Stack key={section.title} marginBottom={24}>
              <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.inkSoft} style={{ marginBottom: 10, textTransform: "uppercase" }}>
                {section.title}
              </StyledText>
              <Stack gap={10}>
                {section.items.map((item) => {
                  const tone = TONES[toneIndex++ % TONES.length];
                  return (
                    <StyledPressable
                      key={item.label}
                      onPress={() => router.push(item.route as any)}
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      backgroundColor={COLORS.white}
                      borderRadius={16}
                      paddingHorizontal={16}
                      paddingVertical={14}
                      style={SHADOW_SOFT}
                    >
                      <Stack horizontal alignItems="center" gap={12}>
                        <StyledShape size={38} cycle backgroundColor={tone.bg}>
                          <Icon name={item.icon as any} size={16} color={tone.fg} />
                        </StyledShape>
                        <StyledText fontSize={14.5} fontWeight="700" color={COLORS.ink}>
                          {item.label}
                        </StyledText>
                      </Stack>
                      <Icon name="chevron-right" size={17} color={COLORS.inkSoft} />
                    </StyledPressable>
                  );
                })}
              </Stack>
            </Stack>
          ))}
        </Animated.View>
      </StyledScrollView>

      <BottomTabBar active="more" />
    </StyledPage>
  );
}
