import { Image, Linking } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  Stack,
  useToast,
} from "fluent-styles";
import { Text } from "../../src/components/text";
import { ContactInfoRow } from "../../src/components/ContactInfoRow";
import { AboutSkeleton } from "../../src/components/skeleton";
import { useSettings } from "../../src/hooks/useChurchData";
import { useDenominations } from "../../src/hooks/useDenominations";
import { COLORS } from "../../src/theme/colors";
import { SHADOW_CARD } from "../../src/theme/shadows";
import { AppBackHeader } from "../../src/components/AppBackHeader";

/**
 * White-label "About Us" — every piece of content comes from the active
 * church's own settings (useSettings(), the same GET /church/get data
 * every other screen already reads — no second fetch, no separate church
 * state). Nothing here is specific to any one church; a section simply
 * doesn't render when its underlying field is empty, same convention as
 * ChurchBanner.tsx (no secure_url -> render nothing) and
 * ChurchDetailsSheet.tsx (no denomination -> no denomination line).
 */
export default function AboutScreen() {
  const { data: settings, isLoading } = useSettings();
  const { getDenominationLabel } = useDenominations();
  const toast = useToast();

  const churchName = settings?.name?.trim() || "your church";
  const bannerUri = settings?.secure_url || null;
  const logoUri = settings?.logo_url || null;
  const shortMessage = settings?.short_message?.trim() || null;
  const verse = settings?.verse?.trim() || null;
  const description = settings?.description?.trim() || null;
  const email = settings?.email?.trim() || null;
  const mobile = settings?.mobile?.trim() || null;
  const denominationLabel = settings?.denomination
    ? getDenominationLabel(settings.denomination)
    : null;

  // Same canOpenURL-guarded pattern as contact.tsx's handleEmailPress —
  // a bare Linking.openURL(...) left unhandled surfaces as an "Uncaught
  // (in promise...)" error instead of a message the member can read.
  async function handleEmailPress() {
    if (!email) return;
    try {
      const url = `mailto:${email}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        toast.error("No email app is available on this device.");
        return;
      }
      await Linking.openURL(url);
    } catch {
      toast.error("Couldn't open your email app. Please try again.");
    }
  }

  async function handlePhonePress() {
    if (!mobile) return;
    try {
      const dialablePhone = mobile.replace(/[^+\d]/g, "");
      const url = `tel:${dialablePhone}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        toast.error("This device can't make phone calls.");
        return;
      }
      await Linking.openURL(url);
    } catch {
      toast.error("Couldn't start the call. Please try again.");
    }
  }

  // Denomination is informational only (no onPress -> ContactInfoRow never
  // shows a chevron for it, so it never reads as a navigable row).
  type ContactRowData = {
    key: string;
    icon: string;
    label: string;
    value: string;
    onPress?: () => void;
    showChevron?: boolean;
    iconBg: string;
    iconColor: string;
  };
  const contactRows = [
    email
      ? {
          key: "email",
          icon: "mail",
          label: "Email",
          value: email,
          onPress: handleEmailPress,
          showChevron: true,
          iconBg: "rgba(27,35,64,0.1)",
          iconColor: COLORS.indigo,
        }
      : null,
    mobile
      ? {
          key: "mobile",
          icon: "phone",
          label: "Mobile",
          value: mobile,
          onPress: handlePhonePress,
          showChevron: true,
          iconBg: COLORS.sageSoft,
          iconColor: COLORS.sage,
        }
      : null,
    denominationLabel
      ? {
          key: "denomination",
          icon: "map-pin",
          label: "Denomination",
          value: denominationLabel,
          iconBg: COLORS.goldPale,
          iconColor: COLORS.goldDeep,
        }
      : null,
  ].filter(Boolean) as ContactRowData[];

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <AppBackHeader title="About Us" />
      <StyledScrollView
      showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 60,
        }}
      >
        <Stack
          width={60}
          height={4}
          borderRadius={999}
          backgroundColor={COLORS.gold}
          marginBottom={12}
          marginHorizontal={24}
        />
        {isLoading && !settings ? (
          <AboutSkeleton />
        ) : (
          <>
        {/* ── Banner + floating logo — no banner means no logo either;    ── */}
        {/* the floating badge is explicitly banner-relative, not a       */}
        {/* stand-alone treatment (see ChurchDetailsSheet's own logo for  */}
        {/* that case instead). */}
        {bannerUri ? (
          <Stack paddingHorizontal={20} marginBottom={logoUri ? 44 : 24}>
            <Stack>
              <Stack
                borderRadius={24}
                overflow="hidden"
                style={{ aspectRatio: 2.2 }}
              >
                <Image
                  source={{ uri: bannerUri }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </Stack>
              {logoUri ? (
                <Stack
                  width={72}
                  height={72}
                  borderRadius={36}
                  backgroundColor={COLORS.white}
                  alignItems="center"
                  justifyContent="center"
                  style={[
                    SHADOW_CARD,
                    {
                      position: "absolute",
                      bottom: -32,
                      right: 28,
                      borderWidth: 1,
                      borderColor: COLORS.chromeBorder,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: logoUri }}
                    style={{ width: "68%", height: "68%" }}
                    resizeMode="contain"
                  />
                </Stack>
              ) : null}
            </Stack>
          </Stack>
        ) : null}

        <Stack paddingHorizontal={24}>
          {/* ── Our story ──────────────────────────────────────────────── */}
          <Text
            variant="overline"
            fontSize={11}
            letterSpacing={1}
            color={COLORS.goldDeep}
            style={{ marginBottom: 8 }}
          >
            OUR STORY
          </Text>
          <Text
            variant="header"
            fontSize={22}
            fontWeight="800"
            color={COLORS.ink}
            style={{ lineHeight: 28 }}
          >
            Welcome to {churchName}.
          </Text>
          {shortMessage ? (
            <Text
              fontSize={14}
              color={COLORS.inkSoft}
              style={{ lineHeight: 21, marginTop: 8 }}
            >
              {shortMessage}
            </Text>
          ) : null}

          {/* ── Verse ──────────────────────────────────────────────────── */}
          {verse ? (
            <Stack
              horizontal
              alignItems="flex-start"
              gap={14}
              backgroundColor={COLORS.paperWarm}
              borderRadius={18}
              padding={16}
              marginTop={22}
                borderWidth={0.4}
                borderColor={COLORS.goldSoft}
            >
              <Stack
                width={40}
                height={40}
                borderRadius={14}
                backgroundColor={COLORS.goldPale}
                alignItems="center"
                justifyContent="center"
              >
                <Icon name="book-open" size={17} color={COLORS.goldDeep} />
              </Stack>
              <Stack style={{ flex: 1 }}>
                <Text
                  variant="overline"
                  fontSize={11}
                  fontWeight="800"
                  letterSpacing={0.6}
                  color={COLORS.goldDeep}
                  style={{ marginBottom: 3 }}
                >
                  Verse
                </Text>
                <Text
                  fontSize={14}
                  color={COLORS.ink}
                  style={{ lineHeight: 20 }}
                >
                  {verse}
                </Text>
              </Stack>
            </Stack>
          ) : null}
          {/* ── Contact information ────────────────────────────────────── */}
          {contactRows.length > 0 ? (
            <Stack marginTop={8}>
             
              <Stack
                backgroundColor={COLORS.white}
                borderRadius={18}
                paddingHorizontal={16}
                paddingVertical={16}
                borderWidth={0.4}
                borderColor={COLORS.goldSoft}
                
              >
                {contactRows.map((row, i) => (
                  <Stack key={row.key}>
                    <ContactInfoRow
                      icon={row.icon}
                      label={row.label}
                      value={row.value}
                      onPress={row.onPress}
                      showChevron={row.showChevron}
                      iconBg={row.iconBg}
                      iconColor={row.iconColor}
                    />
                    {i < contactRows.length - 1 ? (
                      <Stack
                        height={1}
                        backgroundColor={COLORS.goldPale}
                        style={{ marginLeft: 58 }}
                      />
                    ) : null}
                  </Stack>
                ))}
              </Stack>
            </Stack>
          ) : null}

           {/* ── About our church ───────────────────────────────────────── */}
          {description ? (
            <Stack marginTop={8}>
             
              <Stack
                backgroundColor={COLORS.white}
                borderRadius={18}
                padding={18}
                   borderWidth={0.2}
                borderColor={COLORS.goldSoft}
              >
                <Text
                  fontSize={14}
                  color={COLORS.inkSoft}
                  style={{ lineHeight: 21 }}
                >
                  {description}
                </Text>
              </Stack>
            </Stack>
          ) : null}
        </Stack>
          </>
        )}
      </StyledScrollView>
    </StyledPage>
  );
}
