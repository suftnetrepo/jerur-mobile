import { ScrollView } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { router } from "expo-router";
import { Stack, StyledPressable } from "fluent-styles";
import { Text } from "./text";
import { COLORS } from "../theme/colors";
import type { MobileFeature } from "../config/mobileFeatures";

export type PillAction = { key: string; label: string; icon: string; route: string };

export function buildHomeFeatureActions(features: MobileFeature[], flagsLoaded: boolean): PillAction[] {
  if (!flagsLoaded) return [];
  return features
    .filter((feature) => feature.id !== "contact-us" && feature.route)
    .map((feature) => ({ key: feature.id, label: feature.label, icon: feature.icon, route: feature.route! }));
}

export function PillActionRow({ actions }: { actions: PillAction[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
      {actions.map((action) => (
        <StyledPressable key={action.key} onPress={() => router.push(action.route as any)}>
          <Stack
            horizontal
            alignItems="center"
            gap={8}
            backgroundColor={COLORS.white}
            borderRadius={999}
            paddingHorizontal={16}
            paddingVertical={11}
            borderWidth={1}
            borderColor={COLORS.paperAlt}
   
          >
            <Icon name={action.icon as any} size={15} color={COLORS.ink} />
            <Text variant="button" fontSize={13} color={COLORS.ink}>
              {action.label}
            </Text>
          </Stack>
        </StyledPressable>
      ))}
    </ScrollView>
  );
}
