import { Platform } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledPressable, StyledScrollView, Stack } from "fluent-styles";
import { AppBackHeader } from "../../src/components/AppBackHeader";
import { Text } from "../../src/components/text";
import { useMobileTheme } from "../../src/theme/ThemeContext";
import { THEME_LIST, THEMES, type ThemeId } from "../../src/theme/themes";

export default function AppearanceScreen() {
  const { colors: Colors, activeThemeId, churchThemeId, memberThemeId, setMemberTheme } = useMobileTheme();
  const churchTheme = THEMES[churchThemeId];

  const renderChoice = ({
    id,
    label,
    description,
    icon,
    preview,
    override,
  }: {
    id: string;
    label: string;
    description: string;
    icon: string;
    preview: readonly string[];
    override: ThemeId | null;
  }) => {
    const selected = memberThemeId === override;
    return (
      <StyledPressable
        key={id}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={`${label}. ${description}`}
        onPress={() => setMemberTheme(override)}
        padding={16}
        borderRadius={18}
        backgroundColor={selected ? Colors.goldSoft : Colors.white}
        style={{ borderWidth: 1.5, borderColor: selected ? Colors.gold : Colors.chromeBorder }}
      >
        <Stack horizontal alignItems="center" gap={12}>
          <Stack
            width={40}
            height={40}
            borderRadius={12}
            alignItems="center"
            justifyContent="center"
            backgroundColor={selected ? Colors.goldPale : Colors.chrome}
          >
            <Icon name={icon as any} size={18} color={selected ? Colors.goldDeep : Colors.ink} />
          </Stack>

          <Stack flex={1} gap={4}>
            <Text variant="label" fontSize={14.5} fontWeight="800" color={Colors.ink}>{label}</Text>
            <Text fontSize={11} color={Colors.inkSoft} >
              {description}
            </Text>
            <Stack horizontal gap={5} marginTop={3}>
              {preview.map((color) => (
                <Stack
                  key={color}
                  width={18}
                  height={18}
                  borderRadius={9}
                  backgroundColor={color}
                  style={{ borderWidth: 1, borderColor: Colors.border }}
                />
              ))}
            </Stack>
          </Stack>

          <Stack
            width={25}
            height={25}
            borderRadius={12.5}
            alignItems="center"
            justifyContent="center"
            backgroundColor={selected ? Colors.indigo : "transparent"}
            style={{ borderWidth: 1, borderColor: selected ? Colors.indigo : Colors.chromeBorder }}
          >
            {selected ? <Icon name="check" size={14} color={Colors.onPrimary} /> : null}
          </Stack>
        </Stack>
      </StyledPressable>
    );
  };

  return (
    <StyledPage
      showStatusBar
      statusBarStyle={activeThemeId === "dark" ? "light-content" : "dark-content"}
      statusBarBackgroundColor={Platform.OS === "android" ? Colors.paperSoft : undefined}
      flex={1}
      backgroundColor={Colors.paperSoft}
    >
      <AppBackHeader title="Appearance" backgroundColor={Colors.paperSoft} />
      <StyledScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 48 }}>
        <Stack marginBottom={16}>
          <Text fontSize={13.5} color={Colors.inkSoft} style={{ lineHeight: 21 }}>
            Use your church’s recommended appearance or choose a personal theme for this device.
          </Text>
        </Stack>

        <Stack
          padding={16}
          borderRadius={18}
          backgroundColor={Colors.paper}
          marginBottom={22}
          style={{ borderWidth: 1, borderColor: Colors.chromeBorder }}
        >
          <Stack horizontal alignItems="center" justifyContent="space-between" gap={16}>
            <Stack flex={1}>
              <Text variant="overline" fontSize={9.5} fontWeight="800" letterSpacing={1.1} color={Colors.goldDeep}>
                CURRENT APPEARANCE
              </Text>
              <Text variant="title" fontSize={18} fontWeight="800" color={Colors.ink} style={{ marginTop: 4 }}>
                {THEMES[activeThemeId].label}
              </Text>
              <Text fontSize={11.5} color={Colors.inkSoft} style={{ marginTop: 3 }}>
                {memberThemeId ? "Your personal selection" : `Church default · ${churchTheme.label}`}
              </Text>
            </Stack>
            <Stack horizontal gap={5}>
              {THEMES[activeThemeId].preview.map((color) => (
                <Stack key={color} width={25} height={25} borderRadius={12.5} backgroundColor={color} />
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Text variant="overline" fontSize={10} fontWeight="800" letterSpacing={1.2} color={Colors.inkSoft} style={{ marginBottom: 10 }}>
          THEME PREFERENCE
        </Text>
        <Stack gap={10} accessibilityRole="radiogroup">
          {renderChoice({
            id: "church-default",
            label: "Use Church Theme",
            description: `Follow your church’s ${churchTheme.label} theme automatically.`,
            icon: "home",
            preview: churchTheme.preview,
            override: null,
          })}
          {THEME_LIST.map((theme) => renderChoice({
            id: theme.id,
            label: theme.label,
            description: theme.description,
            icon: theme.icon,
            preview: theme.preview,
            override: theme.id,
          }))}
        </Stack>

        <Stack horizontal alignItems="flex-start" gap={8} marginTop={18} paddingHorizontal={3}>
          <Icon name="shield" size={13} color={Colors.inkSoft} style={{ marginTop: 2 }} />
          <Text flex={1} fontSize={10.5} color={Colors.inkSoft} style={{ lineHeight: 16 }}>
            Your personal theme is stored only on this device and never changes the experience for other members.
          </Text>
        </Stack>
      </StyledScrollView>
    </StyledPage>
  );
}
