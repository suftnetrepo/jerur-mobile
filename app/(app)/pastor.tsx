import { ThemeHeader } from "@/src/components/ThemeHeader";
import { useState } from "react";
import { Image, Linking, Platform } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledPressable,
  Stack,
} from "fluent-styles";
import { Text } from "../../src/components/text";
import { WelcomeMessageCard } from "../../src/components/WelcomeMessageCard";
import { PastorSkeleton } from "../../src/components/skeleton";
import { useSettings } from "../../src/hooks/useChurchData";
import { COLORS , isDarkTheme } from "../../src/theme/colors";
import { SHADOW_CARD, SHADOW_SOFT } from "../../src/theme/shadows";

/**
 * "Meet the Pastor" - a standalone read of settings.pastor_section, the
 * same data Home's "A word of welcome" card already pulls from. Reuses
 * that exact card (WelcomeMessageCard.tsx) rather than a re-typed plain
 * version, so the welcome message looks identical wherever it appears.
 */
export default function PastorScreen() {
  const { data: settings, isLoading } = useSettings();
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
    <StyledPage flex={1} backgroundColor={COLORS.paper} statusBarStyle={isDarkTheme ? "light-content" : "dark-content"} statusBarBackgroundColor={Platform.OS === "android" ? COLORS.paper : undefined}>
      <ThemeHeader
        shapeProps={{
          cycle: true,
          size: 48,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.chromeBorder,
        }}
        marginHorizontal={16}
        title="Meet the Pastor"
        titleAlignment="center"
        showBackArrow
        onBackPress={() => router.back()}
        backgroundColor={COLORS.paper}
      />
      <StyledScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 18, paddingBottom: 60 }}
      >
        {isLoading && !settings ? (
          <PastorSkeleton />
        ) : (
          <Stack gap={22}>
            <Stack
              backgroundColor={COLORS.indigoDeep}
              borderRadius={28}
              padding={22}
              overflow="hidden"
              style={SHADOW_CARD}
            >
              <Stack width={150} height={150} borderRadius={75} backgroundColor="rgba(255,255,255,0.055)" style={{ position: "absolute", right: -42, top: -54 }} />
              <Stack width={90} height={90} borderRadius={45} backgroundColor="rgba(255,255,255,0.045)" style={{ position: "absolute", left: -36, bottom: -40 }} />
              <Stack alignItems="center">
                <Stack
                  width={116}
                  height={116}
                  borderRadius={58}
                  padding={4}
                  backgroundColor="rgba(255,255,255,0.16)"
                  marginBottom={16}
                  style={SHADOW_SOFT}
                >
                  {showPhoto ? (
                    <Image
                      source={{ uri: pastor!.secure_url }}
                      resizeMode="cover"
                      style={{ width: 108, height: 108, borderRadius: 54 }}
                      onError={() => setPhotoFailed(true)}
                    />
                  ) : (
                    <Stack width={108} height={108} borderRadius={54} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center">
                      <Text fontSize={31} fontWeight="800" color={COLORS.goldDeep}>{initials}</Text>
                    </Stack>
                  )}
                </Stack>
                <Text fontSize={10.5} fontWeight="800" letterSpacing={1.2} color="rgba(255,255,255,0.66)" style={{ marginBottom: 6 }}>
                  PASTORAL LEADERSHIP
                </Text>
                <Text variant="title" fontSize={22} fontWeight="800" color={COLORS.onPrimary} style={{ textAlign: "center" }}>
                  {name}
                </Text>
                <Stack marginTop={10} paddingHorizontal={12} paddingVertical={6} borderRadius={999} backgroundColor="rgba(255,255,255,0.11)">
                  <Text fontSize={11.5} fontWeight="700" color={COLORS.onPrimary}>{title}</Text>
                </Stack>
                <Text fontSize={12} color="rgba(255,255,255,0.7)" style={{ marginTop: 10, textAlign: "center" }}>
                  {churchName}
                </Text>
              </Stack>
            </Stack>

            <Stack>
              <Stack horizontal alignItems="center" gap={8} marginBottom={11} paddingHorizontal={3}>
                <Stack width={28} height={28} borderRadius={14} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center">
                  <Icon name="message-circle" size={13} color={COLORS.goldDeep} />
                </Stack>
                <Text variant="overline" fontSize={10} fontWeight="800" letterSpacing={1} color={COLORS.inkSoft}>A WORD FROM OUR PASTOR</Text>
              </Stack>
              <WelcomeMessageCard pastor={pastor} showAttribution={false} plain />
            </Stack>

            <Stack>
              <Text variant="overline" fontSize={10} fontWeight="800" letterSpacing={1} color={COLORS.inkSoft} style={{ marginBottom: 11, marginLeft: 3 }}>
                CONNECT
              </Text>
              <Stack backgroundColor={COLORS.white} borderRadius={22} overflow="hidden" style={[SHADOW_SOFT, { borderWidth: 1, borderColor: COLORS.chromeBorder }]}>
                <ContactRow icon="mail" label="Email the church" value={email} onPress={() => Linking.openURL(`mailto:${email}`)} />
                <Stack height={1} backgroundColor={COLORS.chromeBorder} style={{ marginLeft: 70 }} />
                <ContactRow icon="phone" label="Call the church" value={primaryPhone} onPress={() => Linking.openURL(`tel:${primaryPhone.replace(/[^\d+]/g, "")}`)} />
              </Stack>
            </Stack>
          </Stack>
        )}
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
        borderRadius={12}
        backgroundColor={COLORS.goldPale}
        alignItems="center"
        justifyContent="center"
      >
        <Icon name={icon as any} size={16} color={COLORS.goldDeep} />
      </Stack>
      <Stack flex={1}>
        <Text
          variant="label"
          fontSize={13}
          fontWeight="700"
          color={COLORS.ink}
          style={{ marginBottom: 1 }}
        >
          {label}
        </Text>
        <Text fontSize={13} color={COLORS.inkSoft} numberOfLines={1}>
          {value}
        </Text>
      </Stack>
      <Stack width={28} height={28} borderRadius={14} backgroundColor={COLORS.paperAlt} alignItems="center" justifyContent="center">
        <Icon name="chevron-right" size={15} color={COLORS.inkSoft} />
      </Stack>
    </StyledPressable>
  );
}
