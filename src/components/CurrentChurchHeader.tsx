import { Feather as Icon } from "@expo/vector-icons";
import {
  Stack,
  StyledPressable,
  StyledShape,
  StyledImage,
} from "fluent-styles";
import { Text } from "./text";
import { COLORS } from "../theme/colors";
import type { ChurchSearchResult } from "../api/types";

/**
 * Compact "current location" selector — icon badge, small secondary
 * label, the selected church's ADDRESS (not its name — the name already
 * appears as the page title below this header), trailing chevron. Sizes
 * to its own content and hugs the left edge rather than stretching full
 * width, so the chevron sits right after the address instead of being
 * pushed out to the far edge — the bell/profile icons this sits beside
 * (see app/(app)/index.tsx) are a separate, non-shrinking sibling in the
 * same row.
 *
 * This component doesn't decide what pressing it does — that's still
 * handleChangeChurch in app/(app)/index.tsx, unchanged, just handed to it
 * via `onPress`.
 *
 * The badge shows the church's own logo (ChurchSettings.logo_url) when
 * one is set, filling the exact same 48px circle the location pin icon
 * otherwise occupies — never resized up/down, just swapped in place.
 * Falls back to the pin whenever there's no logo (or none yet — Home
 * hands this over from its own useSettings() call, same source of truth
 * as everywhere else logo_url is read).
 */
export function CurrentChurchHeader({
  church,
  logoUrl,
  onPress,
}: {
  church: ChurchSearchResult | null;
  logoUrl?: string | null;
  onPress: () => void;
}) {
  const address = church?.address;
  const displayAddress = church
    ? address?.completeAddress?.trim() ||
      [address?.addressLine1, address?.town].filter(Boolean).join(", ") ||
      church.name
    : "Tap to choose a church";
  const trimmedLogoUrl = logoUrl?.trim();

  return (
    <StyledPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        church
          ? `Change church, current location: ${displayAddress}`
          : "Select a church"
      }
      flexShrink={1}
    >
      <Stack horizontal alignItems="center" gap={10} flexShrink={1}>
        <StyledShape
          size={48}
          cycle
          backgroundColor={COLORS.white}
          style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}
        >
          {trimmedLogoUrl ? (
            <StyledImage
              source={{ uri: trimmedLogoUrl }}
              cycle
              size={48}
              resizeMode="cover"
              accessibilityLabel="Church logo"
            />
          ) : (
            <Icon name="map-pin" size={24} color={COLORS.inkSoft} />
          )}
        </StyledShape>
        <Stack gap={1} flexShrink={1}>
          <Text variant="subLabel" fontSize={11.5} fontWeight="600" color={COLORS.inkSoft}>
            {church ? "Your Location" : "Select Church"}
          </Text>
          {/* Chevron lives in this row, right against the address text —
              not in the outer row's `gap`, which is what was spacing it
              away before. */}
          <Stack horizontal alignItems="center" flexShrink={1}>
            <Text
              variant="subtitle"
              fontSize={15.5}
              color={COLORS.ink}
              numberOfLines={1}
              ellipsizeMode="tail"
              flexShrink={1}
            >
              {displayAddress}
            </Text>
            <Icon
              name="chevron-down"
              size={14}
              color={COLORS.inkSoft}
              style={{ marginLeft: 2 }}
            />
          </Stack>
        </Stack>
      </Stack>
    </StyledPressable>
  );
}
