import { useState } from "react";
import { Image, Linking } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  StyledPressable,
  Stack,
} from "fluent-styles";
import { WelcomeMessageCard } from "../../src/components/WelcomeMessageCard";
import { useSettings } from "../../src/hooks/useChurchData";
import { COLORS } from "../../src/theme/colors";
import { SHADOW_SOFT } from "../../src/theme/shadows";

/**
 * "Meet the Pastor" - a standalone read of settings.pastor_section, the
 * same data Home's "A word of welcome" card already pulls from. Reuses
 * that exact card (WelcomeMessageCard.tsx) rather than a re-typed plain
 * version, so the welcome message looks identical wherever it appears.
 */
export default function PastorScreen() {
  const { data: settings } = useSettings();
  const pastor = settings?.pastor_section;

  const name = pastor
    ? `${pastor.first_name} ${pastor.last_name}`
    : "The pastoral team";
  const title = pastor?.title ?? "Lead Pastor";
  const churchName = settings?.name?.trim() || "your church";
  const initials = pastor
    ? `${pastor.first_name[0] ?? ""}${pastor.last_name[0] ?? ""}`
    : "WC";

  // pastor_section has no email or phone of its own (see jerur-next's
  // church.js model / Settings > Pastor admin form - just title/name/
  // description/photo) - these are the church's general contact details,
  // the same ones Contact screen uses, presented here as the way to reach
  // the pastor.
  const email =
    settings?.email ||
    "WinnersChapel.InternationalPeterborough@winners-chapel.org.uk";
  const phone = settings?.mobile || "07888 230 650 / 07776 696 504";
  // The fallback carries two numbers separated by " / " - dial the first.
  const primaryPhone = phone.split(" / ")[0].trim();

  // Falls back to the initials badge if the photo fails to load (bad URL,
  // offline, etc.) instead of leaving a blank circle - Image renders
  // nothing on error by default, it doesn't fall through on its own.
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = !!pastor?.secure_url && !photoFailed;

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
      <StyledScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 18, paddingBottom: 60 }}
      >
        <Stack alignItems="center" marginBottom={22}>
          {showPhoto ? (
            <Image
              source={{ uri: pastor!.secure_url }}
              style={{ width: 92, height: 92, borderRadius: 46 }}
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            <Stack
              width={92}
              height={92}
              borderRadius={46}
              backgroundColor={COLORS.goldPale}
              alignItems="center"
              justifyContent="center"
            >
              <StyledText
                fontSize={29}
                fontWeight="800"
                color={COLORS.goldDeep}
              >
                {initials}
              </StyledText>
            </Stack>
          )}
          <StyledText
            fontSize={20}
            fontWeight="800"
            color={COLORS.ink}
            style={{ marginTop: 12 }}
          >
            {name}
          </StyledText>
          <StyledText
            fontSize={13}
            color={COLORS.inkSoft}
            style={{ marginTop: 2 }}
          >
            {title}, {churchName}
          </StyledText>
        </Stack>

        <Stack marginBottom={22}>
          <WelcomeMessageCard pastor={pastor} showAttribution={false} plain />
        </Stack>

        <Stack
          backgroundColor={COLORS.paper}
          borderRadius={18}
          overflow="hidden"
          style={SHADOW_SOFT}
        >
          <ContactRow
            icon="mail"
            label="Email"
            value={email}
            onPress={() => Linking.openURL(`mailto:${email}`)}
          />
          <Stack
            height={1}
            backgroundColor={COLORS.chromeBorder}
            style={{ marginLeft: 66 }}
          />
          <ContactRow
            icon="phone"
            label="Call"
            value={primaryPhone}
            onPress={() =>
              Linking.openURL(`tel:${primaryPhone.replace(/[^\d+]/g, "")}`)
            }
          />
        </Stack>
      </StyledScrollView>
    </StyledPage>
  );
}

function ContactRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <StyledPressable
      onPress={onPress}
      flexDirection="row"
      alignItems="center"
      gap={14}
      paddingHorizontal={18}
      paddingVertical={16}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
    >
      <Stack
        width={38}
        height={38}
        borderRadius={19}
        backgroundColor={COLORS.goldPale}
        alignItems="center"
        justifyContent="center"
      >
        <Icon name={icon as any} size={16} color={COLORS.goldDeep} />
      </Stack>
      <Stack flex={1}>
        <StyledText
          fontSize={13}
          fontWeight="700"
          color={COLORS.ink}
          style={{ marginBottom: 1 }}
        >
          {label}
        </StyledText>
        <StyledText fontSize={13} color={COLORS.inkSoft} numberOfLines={1}>
          {value}
        </StyledText>
      </Stack>
      <Icon name="chevron-right" size={17} color={COLORS.inkSoft} />
    </StyledPressable>
  );
}
