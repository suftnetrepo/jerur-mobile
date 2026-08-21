import { Dimensions, Image } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack } from "fluent-styles";
import { Text } from "./text";
import { SHADOW_HERO } from "../theme/shadows";
import { COLORS } from "../theme/colors";
import type { ChurchSettings } from "../api/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const H_PAD = 20; // must match Home's own H_PAD — same card width as before
const BANNER_HEIGHT = 210; // same height as the old slider card
const BANNER_RADIUS = 22; // same radius as the old slider card

/**
 * Home screen's church banner/hero — driven entirely by the selected
 * church's About Us data (`secure_url`, `short_message`, `verse` on
 * ChurchSettings, from the existing GET /church/get query Home already
 * calls via useSettings() — no new fetch here). Replaces the old
 * `sliders`-array carousel; `settings.sliders` is intentionally never
 * read by this component.
 *
 * Owns its own outer spacing (paddingHorizontal/marginBottom, matching
 * the old slider card's) — always renders something here (image or the
 * brand-gradient default below), so unlike NotificationCard this never
 * collapses to nothing; Home always has a hero slot to show.
 */
export function ChurchBanner({ settings }: { settings: ChurchSettings | null | undefined }) {
  const imageUri = settings?.secure_url;
  const shortMessage = settings?.short_message?.trim();
  const verse = settings?.verse?.trim();
  // No banner image set for this church — a brand-toned gradient (same
  // colors as ChurchResultCard's own image fallback) with a generic
  // welcome line stands in, rather than leaving Home's hero slot empty.
  const welcomeMessage = shortMessage || (settings?.name ? `Welcome to ${settings.name}` : "Welcome — glad you're here.");

  return (
    <Stack paddingHorizontal={H_PAD}>
      <Stack
        width={SCREEN_WIDTH - H_PAD * 2}
        height={BANNER_HEIGHT}
        borderRadius={BANNER_RADIUS}
        overflow="hidden"
        style={SHADOW_HERO}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <Svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
            <Defs>
              <LinearGradient id="churchBannerDefault" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={COLORS.indigo} />
                <Stop offset="1" stopColor={COLORS.indigoDeep} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#churchBannerDefault)" />
          </Svg>
        )}

        {/* Subtle dark gradient, darker at the top/bottom edges than the
            center — content below is vertically centered, unlike the old
            bottom-anchored flyer text, so a bottom-only fade wouldn't help
            legibility here the way it did before. Only needed over a real
            photo; the default gradient above is already dark enough for
            white text on its own. */}
        {imageUri && (
          <Svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
            <Defs>
              <LinearGradient id="churchBannerFade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#0C0A09" stopOpacity={0.95} />
                <Stop offset="0.5" stopColor="#0C0A09" stopOpacity={0.60} />
                <Stop offset="1" stopColor="#0C0A09" stopOpacity={0.95} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#churchBannerFade)" />
          </Svg>
        )}

        {/* Content overlay — deliberately positioned via a `style` object
            rather than fluent-styles' flat props (position/top/bottom/
            left/right/alignItems/justifyContent all at once). That flat-
            prop combination silently drops the layout in the installed
            fluent-styles version — confirmed by swapping this exact JSX
            between the two forms on a real device: `style={{...}}` render
            correctly, the flat-prop form doesn't render at all. Filed as
            a library bug; this is the workaround. */}
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
          {imageUri ? (
            <>
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
            </>
          ) : (
            <>
              <Icon name="home" size={30} color="rgba(255,255,255,0.85)" />
              <Text variant="header" fontSize={20} color={COLORS.white} numberOfLines={2} style={{ textAlign: "center", lineHeight: 26 }}>
                {welcomeMessage}
              </Text>
              {verse && (
                <Text variant="body" fontSize={13} color="rgba(255,255,255,0.85)" numberOfLines={3} style={{ textAlign: "center", lineHeight: 18 }}>
                  {verse}
                </Text>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
