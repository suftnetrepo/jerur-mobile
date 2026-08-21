import { Feather as Icon } from "@expo/vector-icons";
import { Stack } from "fluent-styles";
import { Text } from "./text";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { SHADOW_SOFT } from "../theme/shadows";
import { COLORS } from "../theme/colors";
import { CARD_H_PAD } from "../theme/layout";
import type { ChurchSettings } from "../api/types";

/**
 * Home screen's "Prophetic Theme of the Month" card — modeled on the
 * Believers Foundation Class weekly-class card (see resources/bfc.tsx),
 * repurposed for this content: the outer card's title is the month
 * itself (`prophetic_focus.month`), the inner card drops its own heading
 * entirely and shows the theme's description as plain body copy, with
 * the verse reference where a time/schedule row would otherwise sit.
 *
 * Fully self-contained: Home just hands over whatever useSettings()
 * already returned (no fetching in here), and this component owns every
 * visibility decision — collapsing to literally nothing (not even a
 * wrapper) for hasFeature("prophetic-theme")=false, or when the church
 * hasn't set a prophetic focus for any month yet (all three of
 * month/verse/description empty) — same reasoning as LatestSermonCard.
 */
export function PropheticThemeCard({
  settings,
}: {
  settings: ChurchSettings | null | undefined;
}) {
  const { hasFeature } = useFeatureFlags();
  if (!hasFeature("prophetic-theme")) return null;

  const focus = settings?.prophetic_focus;
  const month = focus?.month?.trim();
  const verse = focus?.verse?.trim();
  const description = focus?.description?.trim();
  if (!month && !verse && !description) return null;

  return (
    <>
      <Stack
        horizontal
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={32}
        marginVertical={16}
      >
        <Stack>
          <Text variant="subtitle" fontWeight="400" color={COLORS.inkSoftest}>
              Prophetic Theme
          </Text>
        </Stack>
      </Stack>
      <Stack paddingHorizontal={CARD_H_PAD}>
        <Stack
          backgroundColor={COLORS.sageSoft}
          borderRadius={24}
          padding={20}
          overflow="hidden"
          style={SHADOW_SOFT}
        >
          <Stack horizontal alignItems="center" gap={12} marginBottom={18}>
            <Stack
              width={46}
              height={46}
              borderRadius={23}
              backgroundColor={COLORS.sage}
              alignItems="center"
              justifyContent="center"
            >
              <Icon name="compass" size={19} color={COLORS.white} />
            </Stack>

            <Stack flex={1}>
              <Text
                variant="overline"
                fontSize={10.5}
                letterSpacing={1}
                color={COLORS.sage}
                style={{ marginBottom: 3 }}
              >
                Prophetic Theme of the Month
              </Text>
              {month ? (
                <Text variant="metric" color={COLORS.ink}>
                  {month}
                </Text>
              ) : null}
            </Stack>
          </Stack>

          {(description || verse) && (
            <Stack
              backgroundColor={COLORS.white}
              borderRadius={18}
              padding={17}
            >
              {description ? (
                <Text
                  variant="body"
                  fontSize={13}
                  color={COLORS.inkSoft}
                  style={{ lineHeight: 20 }}
                >
                  {description}
                </Text>
              ) : null}

              {verse ? (
                <Stack
                  horizontal
                  alignItems="center"
                  gap={7}
                  marginTop={description ? 14 : 0}
                >
                  <Icon name="book" size={13} color={COLORS.goldDeep} />
                  <Text
                    variant="button"
                    fontSize={11.5}
                    color={COLORS.goldDeep}
                  >
                    {verse}
                  </Text>
                </Stack>
              ) : null}
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
}
