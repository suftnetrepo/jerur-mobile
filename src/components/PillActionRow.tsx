import { ScrollView } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { router } from "expo-router";
import { Stack, StyledText, StyledPressable } from "fluent-styles";
import { COLORS } from "../theme/colors";

export type PillAction = { key: string; label: string; icon: string; route: string };

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
            <StyledText fontSize={13} fontWeight="700" color={COLORS.ink}>
              {action.label}
            </StyledText>
          </Stack>
        </StyledPressable>
      ))}
    </ScrollView>
  );
}
