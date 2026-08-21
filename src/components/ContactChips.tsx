import { Linking, ScrollView } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledPressable, Loader } from "fluent-styles";
import { Text } from "./text";
import { COLORS } from "../theme/colors";

// A chip that runs an arbitrary action instead of opening a contact
// method — e.g. a church search result card's Select/Share/Route. Passed
// via `leading` so it renders as part of the SAME row/ScrollView as the
// contact chips, not a separate one above/below it.
export type LeadingChip = {
  key: string;
  icon: string;
  label: string;
  onPress: () => void;
  /** Dark/filled treatment (e.g. Select) instead of the default light pill. */
  primary?: boolean;
  /** Swaps the label+icon for a spinner — e.g. while Select is in flight. */
  loading?: boolean;
};

export type ContactChipsProps = {
  leading?: LeadingChip[];
  phone?: string;
  email?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
};

type Chip = { key: string; icon: string; label: string; onPress: () => void; primary?: boolean; loading?: boolean };

/**
 * Horizontal, non-wrapping row of tappable chips. Pure/presentational:
 * callers pass whichever values they already have, nothing is fetched in
 * here. A contact chip is simply omitted when its value is missing —
 * never a broken/empty chip. `leading` chips (if any) always render, since
 * they're actions, not data-dependent contact methods.
 *
 * HARD REQUIREMENT — never wraps to a second line, and `leading` +
 * contact chips are ALWAYS siblings in the one ScrollView below, never
 * two separate rows: plain horizontal ScrollView, showsHorizontalScrollIndicator=false,
 * no flexWrap, no flex:1 anywhere, `gap` on the content container for
 * spacing instead of per-chip margins, each chip sized to its own content.
 * `numberOfLines={1}` on contact labels is extra insurance so a long phone
 * number/email can't wrap internally and break the single-line look even
 * within one chip.
 */
export function ContactChips({ leading = [], phone, email, websiteUrl, facebookUrl, instagramUrl, youtubeUrl }: ContactChipsProps) {
  const chips: Chip[] = [...leading];

  if (phone) chips.push({ key: "phone", icon: "phone", label: phone, onPress: () => Linking.openURL(`tel:${phone.replace(/[^\d+]/g, "")}`) });
  if (email) chips.push({ key: "email", icon: "mail", label: email, onPress: () => Linking.openURL(`mailto:${email}`) });
  if (websiteUrl) chips.push({ key: "website", icon: "globe", label: "Website", onPress: () => Linking.openURL(websiteUrl) });
  if (facebookUrl) chips.push({ key: "facebook", icon: "facebook", label: "Facebook", onPress: () => Linking.openURL(facebookUrl) });
  if (instagramUrl) chips.push({ key: "instagram", icon: "instagram", label: "Instagram", onPress: () => Linking.openURL(instagramUrl) });
  if (youtubeUrl) chips.push({ key: "youtube", icon: "youtube", label: "YouTube", onPress: () => Linking.openURL(youtubeUrl) });

  if (chips.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: "row", alignItems: "center", gap: 10 }}
    >
      {chips.map((chip) => (
        <StyledPressable key={chip.key} onPress={chip.onPress}>
          <Stack
            horizontal
            alignItems="center"
            justifyContent="center"
            gap={chip.primary ? 6 : 7}
            backgroundColor={chip.primary ? COLORS.indigo : COLORS.chrome}
            borderRadius={999}
            paddingHorizontal={chip.primary ? 18 : 14}
            paddingVertical={11}
            style={chip.primary ? undefined : { borderWidth: 1, borderColor: COLORS.chromeBorder }}
          >
            {chip.loading ? (
              <Loader variant="spinner" color={COLORS.white} />
            ) : chip.primary ? (
              <>
                <Text variant="button" fontSize={13} color={COLORS.white}>
                  {chip.label}
                </Text>
                <Icon name={chip.icon as any} size={13} color={COLORS.white} />
              </>
            ) : (
              <>
                <Icon name={chip.icon as any} size={14} color={COLORS.ink} />
                <Text variant="button" fontSize={12.5} color={COLORS.ink} numberOfLines={1}>
                  {chip.label}
                </Text>
              </>
            )}
          </Stack>
        </StyledPressable>
      ))}
    </ScrollView>
  );
}
