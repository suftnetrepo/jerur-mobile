import { Image, Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledPressable, Popup, Loader } from "fluent-styles";
import { ScalePressable } from "./ScalePressable";
import { useDenominations } from "../hooks/useDenominations";
import { COLORS } from "../theme/colors";
import type { ChurchSearchResult } from "../api/types";

type ContactAction = {
  key: string;
  icon: string;
  accessibilityLabel: string;
  onPress: () => void;
};

/**
 * Premium public church preview — opened from ChurchResultCard's "View
 * details" action, without navigating away from Search. Pure/presentational:
 * every field it shows already exists on ChurchSearchResult (the same
 * public GET /church/search response the card itself reads from — see
 * that type for exactly which fields are public). Nothing here is
 * fetched, and nothing internal (ids, coordinates as text, status,
 * timestamps, ...) is ever rendered — coordinates are only ever used to
 * build a maps URL, never displayed.
 *
 * `onSelect`/`selecting` are handed straight through from the card — this
 * sheet never re-implements or duplicates the selection call, it just
 * gives it a second entry point (Select Church -> the same onSelect the
 * card's own Select button already calls).
 */
export function ChurchDetailsSheet({
  visible,
  onClose,
  church,
  onSelect,
  selecting,
}: {
  visible: boolean;
  onClose: () => void;
  church: ChurchSearchResult;
  onSelect: () => void;
  selecting: boolean;
}) {
  const { getDenominationLabel } = useDenominations();

  const logoUri = church.logo_url || null;
  const denominationLabel = church.denomination ? getDenominationLabel(church.denomination) : null;
  const addressLine1 = church.address?.addressLine1?.trim() || null;
  const town = church.address?.town?.trim() || null;
  const shortMessage = church.short_message?.trim() || null;
  const description = church.description?.trim() || null;
  const phone = church.mobile?.trim() || null;
  const email = church.email?.trim() || null;
  const coordinates = church.address?.location?.coordinates;
  const hasDirections = !!(coordinates || addressLine1);

  function handleCall() {
    if (!phone) return;
    Linking.openURL(`tel:${phone.replace(/[^\d+]/g, "")}`);
  }

  function handleEmail() {
    if (!email) return;
    Linking.openURL(`mailto:${email}`);
  }

  // Same mapping ChurchResultCard's own Route action already uses — GeoJSON
  // coordinates are [lng, lat], and only ever fed into the maps URL, never
  // rendered as text on screen.
  function handleDirections() {
    if (coordinates) {
      const [lng, lat] = coordinates;
      Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
    } else if (addressLine1) {
      Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(`${addressLine1}, ${town ?? ""}`)}`);
    }
  }

  const contactActions: ContactAction[] = [
    phone ? { key: "call", icon: "phone", accessibilityLabel: "Call church", onPress: handleCall } : null,
    email ? { key: "email", icon: "mail", accessibilityLabel: "Email church", onPress: handleEmail } : null,
    hasDirections ? { key: "directions", icon: "map-pin", accessibilityLabel: "Get directions", onPress: handleDirections } : null,
  ].filter((action): action is ContactAction => action !== null);

  return (
    <Popup visible={visible} onClose={onClose} safeAreaBottom roundRadius={24}>
      <Stack paddingHorizontal={24} paddingTop={4} paddingBottom={24} gap={22}>
        {/* ── Church identity ─────────────────────────────────────────── */}
        <Stack alignItems="center" gap={2}>
          <Stack
            width={76}
            height={76}
            borderRadius={38}
            backgroundColor={COLORS.chrome}
            alignItems="center"
            justifyContent="center"
            style={{ borderWidth: 1, borderColor: COLORS.chromeBorder, overflow: "hidden" }}
          >
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={{ width: "76%", height: "76%" }} resizeMode="contain" />
            ) : (
              <Icon name="home" size={28} color={COLORS.inkSoft} />
            )}
          </Stack>
          <StyledText
            fontSize={19}
            fontWeight="800"
            color={COLORS.ink}
            numberOfLines={2}
            style={{ textAlign: "center", marginTop: 10 }}
          >
            {church.name}
          </StyledText>
          {denominationLabel ? (
            <StyledText fontSize={12.5} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
              {denominationLabel}
            </StyledText>
          ) : null}
        </Stack>

        {/* ── Location ─────────────────────────────────────────────────── */}
        {addressLine1 ? (
          <Stack horizontal justifyContent="center" alignItems="flex-start" gap={8}>
            <Icon name="map-pin" size={13} color={COLORS.goldDeep} style={{ marginTop: 3 }} />
            <Stack alignItems="center">
              <StyledText fontSize={14} fontWeight="600" color={COLORS.ink} style={{ textAlign: "center" }}>
                {addressLine1}
              </StyledText>
              {town ? (
                <StyledText fontSize={13} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
                  {town}
                </StyledText>
              ) : null}
            </Stack>
          </Stack>
        ) : null}

        {/* ── Short message — capped at 2 lines, never grows the sheet ─── */}
        {shortMessage ? (
          <Stack borderRadius={16} padding={4}>
            <StyledText
              fontSize={14}
              fontWeight="600"
              color={COLORS.goldDeep}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ textAlign: "center", lineHeight: 20 }}
            >
              “{shortMessage}”
            </StyledText>
          </Stack>
        ) : null}

        {/* ── About — capped at 3 lines, plain secondary text, no heading ── */}
        {description ? (
          <StyledText
            fontSize={13.5}
            color={COLORS.inkSoft}
            numberOfLines={3}
            ellipsizeMode="tail"
            style={{ textAlign: "center", lineHeight: 20 }}
          >
            {description}
          </StyledText>
        ) : null}

        {/* ── Contact actions — icon-only, no heading, no labels below ─── */}
        {contactActions.length > 0 && (
          <Stack horizontal justifyContent="center" gap={16}>
            {contactActions.map((action) => (
              <StyledPressable
                key={action.key}
                onPress={action.onPress}
                accessibilityRole="button"
                accessibilityLabel={action.accessibilityLabel}
              >
                <Stack
                  width={50}
                  height={50}
                  borderRadius={25}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={COLORS.chrome}
                  style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}
                >
                  <Icon name={action.icon as any} size={20} color={COLORS.indigo} />
                </Stack>
              </StyledPressable>
            ))}
          </Stack>
        )}

        {/* ── Primary CTA — same onSelect the card's own Select uses ───── */}
        <ScalePressable onPress={onSelect} accessibilityRole="button" accessibilityLabel={`Select ${church.name}`} style={{ width: "100%" }}>
          <Stack
            horizontal
            backgroundColor={COLORS.indigo}
            borderRadius={16}
            height={54}
            alignItems="center"
            justifyContent="center"
            gap={8}
          >
            {selecting ? (
              <Loader variant="spinner" color={COLORS.white} />
            ) : (
              <>
                <StyledText fontSize={15} fontWeight="700" color={COLORS.white}>
                  Select Church
                </StyledText>
                <Icon name="arrow-right" size={16} color={COLORS.white} />
              </>
            )}
          </Stack>
        </ScalePressable>
      </Stack>
    </Popup>
  );
}
