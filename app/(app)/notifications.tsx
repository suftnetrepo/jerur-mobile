import { Linking } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledButton, Stack } from "fluent-styles";
import { Text } from "../../src/components/text";
import { useNotificationPermissionStatus } from "../../src/notifications/use-notification-permission";
import { COLORS } from "../../src/theme/colors";
import { SHADOW_SOFT } from "../../src/theme/shadows";

const STATUS_COPY = {
  granted: { label: "Notifications are on", tone: COLORS.sage, bg: COLORS.sageSoft, icon: "bell" as const },
  undetermined: { label: "Not yet requested", tone: COLORS.inkSoft, bg: COLORS.chrome, icon: "bell" as const },
  denied: { label: "Notifications are off", tone: COLORS.error, bg: COLORS.errorLight, icon: "bell-off" as const },
  loading: { label: "Checking…", tone: COLORS.inkSoft, bg: COLORS.chrome, icon: "bell" as const },
};

/**
 * Settings > Notifications - device notification permission status.
 * Distinct from the church's own announcement banner
 * (ChurchNotification / settings.notification, shown on Home) - this
 * screen is only about on-device local notifications.
 */
export default function NotificationsScreen() {
  const { status } = useNotificationPermissionStatus();

  const copy = STATUS_COPY[status];

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
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
      />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <Stack marginBottom={24}>
          <Stack width={48} height={48} borderRadius={24} backgroundColor={COLORS.paperAlt} alignItems="center" justifyContent="center" marginBottom={18}>
            <Icon name="bell" size={21} color={COLORS.ink} />
          </Stack>
          <Text variant="header" fontSize={28} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 7 }}>
            Notifications
          </Text>
          <Text fontSize={14} color={COLORS.inkSoft} style={{ lineHeight: 21, maxWidth: 320 }}>
            Manage whether this device can receive updates from the app.
          </Text>
        </Stack>


      </StyledScrollView>
    </StyledPage>
  );
}
