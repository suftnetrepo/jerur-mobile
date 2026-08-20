import { useState } from "react";
import { Image } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledPressable, Loader } from "fluent-styles";
import { ScalePressable } from "./ScalePressable";
import { ChurchDetailsSheet } from "./ChurchDetailsSheet";
import { SHADOW_CARD } from "../theme/shadows";
import { COLORS } from "../theme/colors";
import type { ChurchSearchResult } from "../api/types";

// A couple of brand-toned gradients to cycle through when a church has no
// usable banner image, so a results list of placeholder cards doesn't look
// like the same card repeated — same reasoning as the icon-tone cycling
// used on Prayer/Service Times.
const FALLBACK_GRADIENTS = [
  ["#1B2340", "#12172A"],
  ["#3E4E37", "#1B2340"],
  ["#8C6420", "#1B2340"],
];

export function ChurchResultCard({
  church,
  index,
  selecting,
  onSelect,
}: {
  church: ChurchSearchResult;
  index: number;
  selecting: boolean;
  onSelect: () => void;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [gradientFrom, gradientTo] = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
  const addressLine = [church.address?.addressLine1, church.address?.town].filter(Boolean).join(" · ");

  // The official church banner: Church.secure_url (jerur-next
  // app/models/church.js), uploaded via the admin's About Us page — the
  // single source of truth for the church's primary image everywhere on
  // the platform, this card included. Treat the schema's `''` default the
  // same as "absent" rather than rendering a broken image, and fall
  // through to the gradient placeholder below when there isn't one.
  const bannerUri = church.secure_url || null;
  // The church's LOGO — Church.logo_url, an entirely separate asset from
  // the banner above. Small brand identifier beside the name only; never
  // substitutes for bannerUri.
  const logoUri = church.logo_url || null;

  return (
    <>
      <Stack backgroundColor={COLORS.white} borderRadius={22} overflow="hidden" style={SHADOW_CARD}>
        {/* Banner — the church's official image (secure_url) if it has one,
            otherwise a brand gradient. ~16:9 against typical phone widths. */}
        <Stack height={180}>
          {bannerUri ? (
            <Image source={{ uri: bannerUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          ) : (
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id={`bg-${church.externalId}`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={gradientFrom} />
                  <Stop offset="1" stopColor={gradientTo} />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill={`url(#bg-${church.externalId})`} />
            </Svg>
          )}
        </Stack>

        {/* Content — white section below the banner. Kept deliberately
            light — just enough to identify the church; phone/email/full
            description live in ChurchDetailsSheet ("View details") now,
            not here. */}
        <Stack padding={18} gap={10}>
          {/* Name + logo — a small brand identifier beside the name, never
              the card's hero image (that's bannerUri above). Hidden
              entirely (not a fallback icon) when the church has no logo. */}
          <Stack horizontal alignItems="center" justifyContent="space-between" gap={10}>
            <StyledText fontSize={19} fontWeight="800" color={COLORS.ink} numberOfLines={1} style={{ flex: 1 }}>
              {church.name}
            </StyledText>
            {logoUri ? (
              <Stack
                width={44}
                height={44}
                borderRadius={22}
                alignItems="center"
                justifyContent="center"
                backgroundColor={COLORS.white}
                padding={5}
                style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}
              >
                <Image source={{ uri: logoUri }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
              </Stack>
            ) : null}
          </Stack>

          {addressLine ? (
            <Stack horizontal alignItems="center" gap={5}>
              <Icon name="map-pin" size={12} color={COLORS.inkSoft} />
              <StyledText fontSize={13} color={COLORS.inkSoft}>
                {addressLine}
              </StyledText>
            </Stack>
          ) : null}
          {church.description ? (
            <StyledText fontSize={12.5} color={COLORS.inkSoft} numberOfLines={2} style={{ lineHeight: 18 }}>
              {church.description}
            </StyledText>
          ) : null}

          {/* Two fixed actions — everything else (Call/Email/Directions,
              the full description, denomination, ...) lives one tap away
              in ChurchDetailsSheet rather than crowding this card. */}
          <Stack horizontal gap={10} marginTop={4}>
            <StyledPressable
              onPress={() => setDetailsOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={`View details for ${church.name}`}
              style={{ flex: 1 }}
            >
              <Stack
                horizontal
                alignItems="center"
                justifyContent="center"
                gap={7}
                backgroundColor={COLORS.chrome}
                borderRadius={14}
                paddingVertical={13}
                style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}
              >
                <Icon name="eye" size={15} color={COLORS.ink} />
                <StyledText fontSize={13.5} fontWeight="700" color={COLORS.ink}>
                  View details
                </StyledText>
              </Stack>
            </StyledPressable>

            <ScalePressable
              onPress={onSelect}
              accessibilityRole="button"
              accessibilityLabel={`Select ${church.name}`}
              style={{ flex: 1 }}
            >
              <Stack
                horizontal
                alignItems="center"
                justifyContent="center"
                gap={7}
                backgroundColor={COLORS.indigo}
                borderRadius={14}
                paddingVertical={13}
              >
                {selecting ? (
                  <Loader variant="spinner" color={COLORS.white} />
                ) : (
                  <>
                    <StyledText fontSize={13.5} fontWeight="700" color={COLORS.white}>
                      Select
                    </StyledText>
                    <Icon name="arrow-right" size={14} color={COLORS.white} />
                  </>
                )}
              </Stack>
            </ScalePressable>
          </Stack>
        </Stack>
      </Stack>

      <ChurchDetailsSheet
        visible={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        church={church}
        onSelect={onSelect}
        selecting={selecting}
      />
    </>
  );
}
