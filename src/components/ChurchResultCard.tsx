import { Image, Linking, Share } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText } from "fluent-styles";
import { ContactChips, type LeadingChip } from "./ContactChips";
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
  const [gradientFrom, gradientTo] = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
  const addressLine = [church.address?.addressLine1, church.address?.town].filter(Boolean).join(" · ");

  // The official church banner: Church.secure_url (jerur-next
  // app/models/church.js), uploaded via the admin's About Us page — the
  // single source of truth for the church's primary image everywhere on
  // the platform, this card included. Treat the schema's `''` default the
  // same as "absent" rather than rendering a broken image, and fall
  // through to the gradient placeholder below when there isn't one.
  const bannerUri = church.secure_url || null;

  function handleRoute() {
    const coords = church.address?.location?.coordinates;
    if (coords) {
      const [lng, lat] = coords; // GeoJSON order is [lng, lat]
      Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
    } else if (church.address?.addressLine1) {
      Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(`${church.address.addressLine1}, ${church.address.town ?? ""}`)}`);
    }
  }

  function handleShare() {
    Share.share({ message: `${church.name}${addressLine ? ` — ${addressLine}` : ""}` });
  }

  // Select/Share/Route ride in the SAME scrollable row as the contact
  // chips below (see ContactChips.tsx's `leading` prop) rather than a
  // separate fixed row above it — one continuous horizontal strip, Select
  // first, everything else following.
  const leadingChips: LeadingChip[] = [
    { key: "select", icon: "arrow-right", label: "Select", onPress: onSelect, primary: true, loading: selecting },
    { key: "share", icon: "share-2", label: "Share", onPress: handleShare },
    { key: "route", icon: "map-pin", label: "Route", onPress: handleRoute },
  ];

  return (
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

      {/* Content — white section below the banner */}
      <Stack padding={18} gap={10}>
        <StyledText fontSize={19} fontWeight="800" color={COLORS.ink} numberOfLines={1}>
          {church.name}
        </StyledText>

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

        {/* One row: Select, Share, Route, then whichever contact/social
            chips this church has data for — swipe to reveal more. */}
        <Stack marginTop={4}>
          <ContactChips
            leading={leadingChips}
            phone={church.mobile}
            email={church.email}
            facebookUrl={church.facebook_url}
            instagramUrl={church.instagram_url}
            youtubeUrl={church.youtube_url}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
