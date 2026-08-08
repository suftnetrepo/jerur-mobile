import { useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledPressable, StyledShape, Popup } from "fluent-styles";
import { useSettings } from "../hooks/useChurchData";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { COLORS } from "../theme/colors";

// Beyond this length the message collapses to 3 lines on the card, with a
// tap opening the full text in a modal instead of stretching the Home
// screen. Short messages just render in full inline — no modal needed.
const LONG_MESSAGE_THRESHOLD = 140;

/**
 * Home screen's replacement for the old hardcoded Giving promo card —
 * shows the church's single admin-authored announcement
 * (Church.notification, see jerur-next app/models/church.js), reusing the
 * same visual layout (rounded card, icon badge, eyebrow/title/body) as the
 * Giving CalloutBanner it displaced.
 *
 * Self-contained by design: reads settings via the same useSettings()
 * query the Home screen already uses (no extra fetch, no new endpoint —
 * GET /church/get already returns `notification`), decides on its own
 * whether to render, and returns null otherwise. Callers just do
 * `<ChurchNotificationCard />`.
 */
export function ChurchNotificationCard() {
  const { data: settings } = useSettings();
  const { hasFeature } = useFeatureFlags();
  const [expanded, setExpanded] = useState(false);

  const notification = settings?.notification;
  const title = notification?.title?.trim();
  const message = notification?.message?.trim();
  const expiryDate = notification?.expiry_date ? new Date(notification.expiry_date) : null;

  // "Exists" means an admin actually authored one (both title and message
  // present) with an expiry date, and that date hasn't passed yet.
  const isActive = Boolean(title && message && expiryDate && expiryDate.getTime() > Date.now());

  // Returning null here means literally nothing renders — no wrapper, no
  // margin — so an inactive/disabled notification leaves zero footprint
  // on the Home screen layout, not just an invisible/collapsed card. The
  // outer horizontal padding + bottom margin below (matching the Give
  // card it replaced) live inside this component rather than in the
  // caller precisely so that guarantee holds without the caller needing
  // to know or care whether a notification is currently active.
  if (!hasFeature("notifications") || !isActive) return null;

  const isLong = message!.length > LONG_MESSAGE_THRESHOLD;

  return (
    <>
      <Stack paddingHorizontal={20} marginBottom={26}>
        <StyledPressable onPress={() => isLong && setExpanded(true)}>
          <Stack horizontal backgroundColor={COLORS.goldPale} borderRadius={20} padding={20} alignItems="center" gap={16}>
            <Stack flex={1} gap={6}>
              <StyledText fontSize={11} fontWeight="700" letterSpacing={0.8} color={COLORS.goldDeep} style={{ textTransform: "uppercase" }}>
                Announcement
              </StyledText>
              <StyledText fontSize={17} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 22 }}>
                {title}
              </StyledText>
              <StyledText fontSize={12.5} color={COLORS.inkSoft} numberOfLines={isLong ? 3 : undefined} style={{ lineHeight: 18 }}>
                {message}
              </StyledText>
              {isLong && (
                <Stack horizontal alignItems="center" gap={5} marginTop={4}>
                  <StyledText fontSize={13} fontWeight="700" color={COLORS.goldDeep}>
                    Read more
                  </StyledText>
                  <Icon name="arrow-right" size={13} color={COLORS.goldDeep} />
                </Stack>
              )}
            </Stack>
            <StyledShape size={54} cycle backgroundColor="rgba(255,255,255,0.5)">
              <Icon name="bell" size={22} color={COLORS.goldDeep} />
            </StyledShape>
          </Stack>
        </StyledPressable>
      </Stack>

      {isLong && (
        <Popup visible={expanded} onClose={() => setExpanded(false)} title="Announcement" subtitle={title} showClose safeAreaBottom>
          <Stack padding={20}>
            <StyledText fontSize={14.5} color={COLORS.ink} style={{ lineHeight: 21 }}>
              {message}
            </StyledText>
          </Stack>
        </Popup>
      )}
    </>
  );
}
