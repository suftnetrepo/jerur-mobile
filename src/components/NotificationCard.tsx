import { useEffect, useMemo, useRef } from "react";
import { Animated, Image } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledPressable } from "fluent-styles";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { getFeatureById } from "../config/mobileFeatures";
import { getNotificationType, getNotificationPriority } from "../config/notificationTypes";
import { SHADOW_CARD } from "../theme/shadows";
import { COLORS } from "../theme/colors";
import type { ChurchNotification } from "../api/types";

// Which mobile feature (and route) each notification type's CTA opens —
// deliberately not every type: "Only show a CTA when the notification
// type naturally supports one." Types not listed here (announcement,
// scripture, emergency, sermon — none of which map onto a single
// obviously-correct screen) render with no action row at all. The
// destination itself is never hardcoded here — it's looked up from
// src/config/mobileFeatures.ts via `featureId`, so a CTA also
// automatically disappears if the church has that feature disabled.
const TYPE_CTA: Record<string, { featureId: string; label: string } | undefined> = {
  event: { featureId: "upcoming-events", label: "View events" },
  promotion: { featureId: "giving", label: "Give now" },
  welcome: { featureId: "register-member", label: "Get started" },
};

function formatDatePart(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTimePart(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
}

function formatRange(start: string | null, end: string | null): string | null {
  if (start && end) return `${start} – ${end}`;
  return start || end || null;
}

/**
 * Pure data check: does this notification object itself qualify to be
 * shown (status/title/date window) — deliberately NOT including the
 * "notifications" feature flag, so callers that need to combine this
 * with other feature-gated decisions (e.g. Home picking between this
 * card and ChurchBanner for the hero slot) can do
 * `hasFeature("notifications") && isNotificationActive(notification)`
 * without duplicating the status/date logic itself. NotificationCard
 * uses this exact function internally too — one source of truth.
 */
export function isNotificationActive(notification: ChurchNotification | null | undefined): boolean {
  if (!notification) return false;
  if (!notification.status) return false;
  // A church that has never configured a notification still has
  // status: true and empty title/message (the schema's own defaults) -
  // treat "no title" as "nothing to show", not as "show an empty card".
  if (!notification.title?.trim()) return false;

  const now = Date.now();
  if (notification.start_date && new Date(notification.start_date).getTime() > now) return false;
  if (notification.expiry_date && new Date(notification.expiry_date).getTime() < now) return false;
  return true;
}

/**
 * Home screen's notification card — the enriched Church.notification
 * model (type/title/message/secure_url/priority/status/start_date/
 * expiry_date), styled to match the admin's live preview
 * (NotificationPreview.jsx): image with an overlaid type badge, title,
 * message, a type-colored accent bar, a Date/Time info panel, an
 * optional type-inferred CTA, and a priority-colored strip along the
 * bottom edge.
 *
 * Fully self-contained: Home just passes the notification object
 * straight from its existing useSettings() call (no fetching in here),
 * and this component owns every visibility/layout decision, including
 * collapsing to literally nothing (not even a wrapper) when inactive.
 * Home also uses isNotificationActive() (above) directly to decide
 * whether this card or ChurchBanner takes the shared hero slot — see
 * app/(app)/index.tsx.
 */
export function NotificationCard({ notification }: { notification: ChurchNotification | null | undefined }) {
  const { hasFeature } = useFeatureFlags();
  const isActive = useMemo(() => isNotificationActive(notification), [notification]);
  const shouldRender = hasFeature("notifications") && isActive;

  // Fades in specifically when the card transitions to active (e.g. once
  // useSettings() resolves), not on component mount — this component is
  // always mounted by Home regardless of whether it's currently visible.
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (shouldRender) {
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } else {
      opacity.setValue(0);
    }
  }, [shouldRender, opacity]);

  if (!shouldRender) return null;

  const type = getNotificationType(notification!.type);
  const priority = getNotificationPriority(notification!.priority);
  const imageUri = notification!.secure_url?.trim();

  const dateRange = formatRange(formatDatePart(notification!.start_date), formatDatePart(notification!.expiry_date));
  const timeRange = formatRange(formatTimePart(notification!.start_date), formatTimePart(notification!.expiry_date));

  const ctaConfig = TYPE_CTA[type.id];
  const ctaFeature = ctaConfig && hasFeature(ctaConfig.featureId) ? getFeatureById(ctaConfig.featureId) : undefined;
  const cta = ctaFeature?.route ? { label: ctaConfig!.label, route: ctaFeature.route } : null;

  const TypeBadge = ({ overlay }: { overlay?: boolean }) => (
    <Stack
      horizontal
      alignItems="center"
      gap={6}
      borderRadius={999}
      paddingHorizontal={12}
      paddingVertical={6}
      backgroundColor={overlay ? `${type.color}E6` : `${type.color}1A`}
      style={{ alignSelf: "flex-start" }}
    >
      <Icon name={type.icon as any} size={13} color={overlay ? COLORS.white : type.color} />
      <StyledText fontSize={11.5} fontWeight="700" color={overlay ? COLORS.white : type.color}>
        {type.label}
      </StyledText>
    </Stack>
  );

  return (
    // marginBottom/paddingHorizontal deliberately match ChurchBanner's
    // exactly (H_PAD=20, marginBottom=22) — the two are mutually
    // exclusive in the same hero slot (see app/(app)/index.tsx), so
    // switching between them must not shift surrounding layout.
    <Animated.View style={{ opacity, marginBottom: 22, paddingHorizontal: 20 }}>
      <Stack backgroundColor={COLORS.white} borderRadius={20} overflow="hidden" style={SHADOW_CARD}>
        {imageUri ? (
          <Stack style={{ height: 180, overflow: "hidden" }}>
            <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            {/* `style` object, not flat props — see the note on ChurchBanner's
                overlay for why: this fluent-styles version silently drops
                `position="absolute"` (+ friends) passed as flat props. */}
            <Stack style={{ position: "absolute", top: 14, left: 14 }}>
              <TypeBadge overlay />
            </Stack>
          </Stack>
        ) : null}

        <Stack padding={18} gap={12}>
          <Stack horizontal alignItems="flex-start" justifyContent="space-between" gap={12}>
            <Stack flex={1} gap={8}>
              {!imageUri && <TypeBadge />}
              <StyledText fontSize={17} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 22 }}>
                {notification!.title}
              </StyledText>
              {notification!.message?.trim() ? (
                <StyledText fontSize={13} color={COLORS.inkSoft} numberOfLines={4} style={{ lineHeight: 19 }}>
                  {notification!.message}
                </StyledText>
              ) : null}
            </Stack>
            {imageUri && (
              <Stack width={40} height={40} borderRadius={20} alignItems="center" justifyContent="center" backgroundColor={`${type.color}1A`}>
                <Icon name={type.icon as any} size={17} color={type.color} />
              </Stack>
            )}
          </Stack>

          <Stack width={44} height={3} borderRadius={2} backgroundColor={type.color} />

          {(dateRange || timeRange) && (
            <Stack backgroundColor={COLORS.chrome} borderRadius={12} paddingHorizontal={14}>
              {dateRange && (
                <Stack
                  horizontal
                  alignItems="center"
                  gap={12}
                  paddingVertical={10}
                  style={timeRange ? { borderBottomWidth: 1, borderColor: COLORS.chromeBorder } : undefined}
                >
                  <Stack width={30} height={30} borderRadius={15} alignItems="center" justifyContent="center" backgroundColor={`${type.color}1A`}>
                    <Icon name="calendar" size={13} color={type.color} />
                  </Stack>
                  <Stack gap={1}>
                    <StyledText fontSize={10.5} color={COLORS.inkSoft}>
                      Date
                    </StyledText>
                    <StyledText fontSize={12.5} fontWeight="700" color={COLORS.ink}>
                      {dateRange}
                    </StyledText>
                  </Stack>
                </Stack>
              )}
              {timeRange && (
                <Stack horizontal alignItems="center" gap={12} paddingVertical={10}>
                  <Stack width={30} height={30} borderRadius={15} alignItems="center" justifyContent="center" backgroundColor={`${type.color}1A`}>
                    <Icon name="clock" size={13} color={type.color} />
                  </Stack>
                  <Stack gap={1}>
                    <StyledText fontSize={10.5} color={COLORS.inkSoft}>
                      Time
                    </StyledText>
                    <StyledText fontSize={12.5} fontWeight="700" color={COLORS.ink}>
                      {timeRange}
                    </StyledText>
                  </Stack>
                </Stack>
              )}
            </Stack>
          )}

          {cta && (
            <StyledPressable onPress={() => router.push(cta.route as any)}>
              <Stack
                horizontal
                alignItems="center"
                justifyContent="center"
                gap={6}
                borderRadius={999}
                paddingVertical={12}
                backgroundColor={type.color}
              >
                <StyledText fontSize={13.5} fontWeight="700" color={COLORS.white}>
                  {cta.label}
                </StyledText>
                <Icon name="arrow-right" size={14} color={COLORS.white} />
              </Stack>
            </StyledPressable>
          )}
        </Stack>

        {/* Priority accent strip — low/normal/high/urgent, see src/config/notificationTypes.ts */}
        <Stack height={4} backgroundColor={priority.color} />
      </Stack>
    </Animated.View>
  );
}
