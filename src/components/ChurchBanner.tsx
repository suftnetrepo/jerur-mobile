import { useState } from "react";
import { Dimensions, Image } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { Stack } from "fluent-styles";
import { Text } from "./text";
import { SHADOW_HERO } from "../theme/shadows";
import { COLORS } from "../theme/colors";
import type { ChurchSettings } from "../api/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const H_PAD = 20; // must match Home's own H_PAD — same card width as before
const BANNER_HEIGHT = 210; // same height as the old slider card
const BANNER_RADIUS = 22; // same radius as the old slider card

// Stands in for a church's own secure_url when they haven't uploaded one —
// rendered with a light wash when no copy exists, or a stronger readable
// overlay when the church has configured a message or verse without an
// image. Same `require`-a-local-asset pattern as _layout.tsx's SPLASH_LOGO.
const DEFAULT_BANNER = require("../../assets/default-banner.png");

/**
 * Home screen's church banner/hero — driven entirely by the selected
 * church's About Us data (`secure_url`, `short_message`, `verse` on
 * ChurchSettings, from the existing GET /church/get query Home already
 * calls via useSettings() — no new fetch here). Replaces the old
 * `sliders`-array carousel; `settings.sliders` is intentionally never
 * read by this component.
 *
 * Owns its own outer spacing (paddingHorizontal/marginBottom, matching
 * the old slider card's) — always renders something here (the church's own
 * image with its caption text, or DEFAULT_BANNER with any available copy), so
 * unlike NotificationCard this never collapses to nothing; Home always has
 * a hero slot to show.
 */
export function ChurchBanner({ settings }: { settings: ChurchSettings | null | undefined }) {
  const imageUri = settings?.secure_url?.trim() || null;
  const [failedImageUri, setFailedImageUri] = useState<string | null>(null);
  const shortMessage = settings?.short_message?.trim();
  const verse = settings?.verse?.trim();
  const hasCaption = Boolean(shortMessage || verse);
  const useRemoteImage = Boolean(imageUri && failedImageUri !== imageUri);
  const bannerSource = useRemoteImage ? { uri: imageUri! } : DEFAULT_BANNER;

  return (
    <Stack paddingHorizontal={H_PAD}>
      <Stack
        width={SCREEN_WIDTH - H_PAD * 2}
        height={BANNER_HEIGHT}
        borderRadius={BANNER_RADIUS}
        overflow="hidden"
        backgroundColor={COLORS.paperAlt}
      >
        <Image
          key={useRemoteImage ? imageUri : "default-banner"}
          source={bannerSource}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          onError={() => {
            if (useRemoteImage) setFailedImageUri(imageUri);
          }}
        />

        {/* Subtle dark gradient, darker at the top/bottom edges than the
            center — content below (when present) is vertically centered,
            unlike the old bottom-anchored flyer text, so a bottom-only
            fade wouldn't help legibility here the way it did before. Over
            a real church photo this also carries caption text, so it's
            stronger; over DEFAULT_BANNER it's just a light wash with
            nothing on top of it. */}
        <Svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
          <Defs>
            <LinearGradient id="churchBannerFade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#0C0A09" stopOpacity={useRemoteImage ? 0.88 : hasCaption ? 0.62 : 0.25} />
              <Stop offset="0.5" stopColor="#0C0A09" stopOpacity={useRemoteImage ? 0.5 : hasCaption ? 0.3 : 0.08} />
              <Stop offset="1" stopColor="#0C0A09" stopOpacity={useRemoteImage ? 0.88 : hasCaption ? 0.62 : 0.25} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#churchBannerFade)" />
        </Svg>

        {/* Caption text overlay — uses the church photo when available and
            the bundled default banner when only text has been configured. Deliberately
            positioned via a `style` object rather than fluent-styles' flat
            props (position/top/bottom/left/right/alignItems/
            justifyContent all at once). That flat-prop combination
            silently drops the layout in the installed fluent-styles
            version — confirmed by swapping this exact JSX between the two
            forms on a real device: `style={{...}}` renders correctly, the
            flat-prop form doesn't render at all. Filed as a library bug;
            this is the workaround. */}
        {hasCaption && (
          <Stack
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 24,
              gap: 10,
            }}
          >
            {shortMessage && (
              <Text variant="header" fontSize={20} color={COLORS.onPrimary} numberOfLines={2} style={{ textAlign: "center", lineHeight: 26 }}>
                {shortMessage}
              </Text>
            )}
            {verse && (
              <Text variant="body" fontSize={13} color="rgba(255,255,255,0.85)" numberOfLines={3} style={{ textAlign: "center", lineHeight: 18 }}>
                {verse}
              </Text>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
