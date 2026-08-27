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
// rendered with just a light dark-fade wash (see churchBannerFade below),
// no caption text/icon on top of it (there's no short_message/verse to
// show for a church that hasn't set one up). Same `require`-a-local-asset
// pattern as _layout.tsx's SPLASH_LOGO.
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
 * image with its caption text, or DEFAULT_BANNER above on its own), so
 * unlike NotificationCard this never collapses to nothing; Home always has
 * a hero slot to show.
 */
export function ChurchBanner({ settings }: { settings: ChurchSettings | null | undefined }) {
  const imageUri = settings?.secure_url;
  const shortMessage = settings?.short_message?.trim();
  const verse = settings?.verse?.trim();
  const bannerSource = imageUri ? { uri: imageUri } : DEFAULT_BANNER;

  return (
    <Stack paddingHorizontal={H_PAD}>
      <Stack
        width={SCREEN_WIDTH - H_PAD * 2}
        height={BANNER_HEIGHT}
        borderRadius={BANNER_RADIUS}
        overflow="hidden"
        style={SHADOW_HERO}
      >
        <Image source={bannerSource} style={{ width: "100%", height: "100%" }} resizeMode="cover" />

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
              <Stop offset="0" stopColor="#0C0A09" stopOpacity={imageUri ? 0.95 : 0.35} />
              <Stop offset="0.5" stopColor="#0C0A09" stopOpacity={imageUri ? 0.6 : 0.15} />
              <Stop offset="1" stopColor="#0C0A09" stopOpacity={imageUri ? 0.95 : 0.35} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#churchBannerFade)" />
        </Svg>

        {/* Caption text overlay — only for a real church photo, which is
            the only case with short_message/verse to show. Deliberately
            positioned via a `style` object rather than fluent-styles' flat
            props (position/top/bottom/left/right/alignItems/
            justifyContent all at once). That flat-prop combination
            silently drops the layout in the installed fluent-styles
            version — confirmed by swapping this exact JSX between the two
            forms on a real device: `style={{...}}` renders correctly, the
            flat-prop form doesn't render at all. Filed as a library bug;
            this is the workaround. */}
        {imageUri && (
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
              <Text variant="header" fontSize={20} color={COLORS.white} numberOfLines={2} style={{ textAlign: "center", lineHeight: 26 }}>
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
