import { Animated } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledPressable, StyledShape, Stack } from "fluent-styles";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import { useFadeUp } from "../../src/hooks/useFadeUp";
import { SHADOW_SOFT } from "../../src/theme/shadows";
import { COLORS, ICON_TONES } from "../../src/theme/colors";

type SettingsItem = { label: string; icon: string; route: string };

/**
 * Settings (tab key stays "more" - see BottomTabBar.tsx - only the label
 * changed). This used to also list every enabled feature (Visit/Community/
 * Media/Resources/Get in touch) plus a "Submit attendance" shortcut - both
 * straight duplicates of Home's PillActionRow, which already surfaces
 * every enabled feature (attendance included) one tap away. This screen is
 * app-wide settings only: your account, the pastor's welcome, notification
 * preferences, and about info - rendered as one grouped card (iOS
 * Settings-style: rounded container, inset dividers between rows) rather
 * than a stack of separately-shadowed cards.
 */
const SETTINGS_ITEMS: SettingsItem[] = [
  { label: "My account", icon: "user", route: "/account" },
  { label: "Pastor", icon: "book-open", route: "/pastor" },
  { label: "Notifications", icon: "bell", route: "/notifications" },
  { label: "About us", icon: "info", route: "/about" },
];

// Divider left-inset so it starts where the label text does, not under the
// icon - the standard iOS grouped-list look (icon width + its gap + the
// row's own left padding).
const DIVIDER_INSET = 38 + 12 + 16;

export default function MoreScreen() {
  const listAnim = useFadeUp(0);

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.chrome}>
      <StyledScrollView contentContainerStyle={{ padding: 20, paddingTop: 16, paddingBottom: 28 }}>
        <StyledText fontSize={26} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 4 }}>
          Settings
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 22 }}>
          Your account and how this app reaches you.
        </StyledText>

        <Animated.View style={listAnim}>
          <Stack backgroundColor={COLORS.white} borderRadius={18} overflow="hidden" style={SHADOW_SOFT}>
            {SETTINGS_ITEMS.map((item, i) => {
              const tone = ICON_TONES[i % ICON_TONES.length];
              return (
                <Stack key={item.label}>
                  <StyledPressable
                    onPress={() => router.push(item.route as any)}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingHorizontal={16}
                    paddingVertical={14}
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
                  {i < SETTINGS_ITEMS.length - 1 && <Stack height={1} backgroundColor={COLORS.chromeBorder} style={{ marginLeft: DIVIDER_INSET }} />}
                </Stack>
              );
            })}
          </Stack>
        </Animated.View>
      </StyledScrollView>

      <BottomTabBar active="more" />
    </StyledPage>
  );
}
