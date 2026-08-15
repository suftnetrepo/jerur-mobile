import { useEffect, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledPressable } from "fluent-styles";
import { FullScreenImageViewer } from "./FullScreenImageViewer";
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
 * expiry_date), presented as a compact, type-tinted notice rather than a
 * second hero banner. One type icon anchors the hierarchy, priority is a
 * small semantic badge, metadata stays lightweight, and an attached image
 * opens through an explicit full-screen action instead of competing with
 * the message as a cropped thumbnail.
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
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const imageUri = notification?.secure_url?.trim() ?? "";

  useEffect(() => {
    if (shouldRender) {
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } else {
      opacity.setValue(0);
    }
  }, [shouldRender, opacity]);

  // Never leave a viewer open on an image that has just been replaced by a
  // settings refresh.
  useEffect(() => {
    setImageViewerVisible(false);
  }, [imageUri]);

  if (!shouldRender) return null;

  const type = getNotificationType(notification!.type);
  const priority = getNotificationPriority(notification!.priority);

  const dateRange = formatRange(formatDatePart(notification!.start_date), formatDatePart(notification!.expiry_date));
  const timeRange = formatRange(formatTimePart(notification!.start_date), formatTimePart(notification!.expiry_date));

  const ctaConfig = TYPE_CTA[type.id];
  const ctaFeature = ctaConfig && hasFeature(ctaConfig.featureId) ? getFeatureById(ctaConfig.featureId) : undefined;
  const cta = ctaFeature?.route ? { label: ctaConfig!.label, route: ctaFeature.route } : null;

  return (
    // marginBottom/paddingHorizontal deliberately match ChurchBanner's
    // exactly (H_PAD=20, marginBottom=22) — the two are mutually
    // exclusive in the same hero slot (see app/(app)/index.tsx), so
    // switching between them must not shift surrounding layout.
    <Animated.View style={{ opacity, paddingHorizontal: 20 }}>
      <Stack
        backgroundColor={type.surfaceColor}
        borderRadius={20}
        overflow="hidden"
        style={[SHADOW_CARD, { borderWidth: 1, borderColor: `${type.color}2E` }]}
      >
        <Stack padding={17} gap={13}>
            <Stack horizontal alignItems="center" justifyContent="space-between" gap={10}>
              <Stack
                width={38}
                height={38}
                borderRadius={12}
                alignItems="center"
                justifyContent="center"
                backgroundColor={`${type.color}16`}
                accessibilityLabel={`${type.label} notification`}
              >
                <Icon name={type.icon as any} size={17} color={type.color} />
              </Stack>
              {(priority.id === "high" || priority.id === "urgent") && (
                <Stack horizontal alignItems="center" gap={5} borderRadius={999} paddingHorizontal={9} paddingVertical={5} backgroundColor={`${priority.color}16`}>
                  <Icon name="bell" size={12} color={priority.color} />
                  <StyledText fontSize={10} fontWeight="800" letterSpacing={0.4} color={priority.color} style={{ textTransform: "uppercase" }}>
                    {priority.id === "urgent" ? "Urgent" : "Important"}
                  </StyledText>
                </Stack>
              )}
            </Stack>

            <Stack gap={6}>
              <StyledText fontSize={17} fontWeight="800" color={COLORS.ink} style={{ lineHeight: 22 }}>
                {notification!.title}
              </StyledText>
              {notification!.message?.trim() ? (
                <StyledText fontSize={13} color={COLORS.inkSoft} numberOfLines={4} style={{ lineHeight: 19 }}>
                  {notification!.message}
                </StyledText>
              ) : null}
            </Stack>

            {(dateRange || timeRange) && (
              <Stack horizontal alignItems="center" gap={8} style={{ flexWrap: "wrap" }}>
                {dateRange && (
                  <Stack horizontal alignItems="center" gap={5}>
                    <Icon name="calendar" size={12} color={type.color} />
                    <StyledText fontSize={11.5} fontWeight="600" color={COLORS.inkSoft}>{dateRange}</StyledText>
                  </Stack>
                )}
                {dateRange && timeRange && <Stack width={3} height={3} borderRadius={2} backgroundColor={COLORS.chromeBorder} />}
                {timeRange && (
                  <Stack horizontal alignItems="center" gap={5}>
                    <Icon name="clock" size={12} color={type.color} />
                    <StyledText fontSize={11.5} fontWeight="600" color={COLORS.inkSoft}>{timeRange}</StyledText>
                  </Stack>
                )}
              </Stack>
            )}

            {(cta || imageUri) && (
              <Stack
                horizontal
                alignItems="center"
                justifyContent={cta && imageUri ? "space-between" : imageUri ? "flex-end" : "flex-start"}
                gap={18}
                width="100%"
                style={{ flexWrap: "wrap" }}
              >
                {cta && (
                  <StyledPressable onPress={() => router.push(cta.route as any)} accessibilityRole="link">
                    <Stack horizontal alignItems="center" gap={6} paddingVertical={3}>
                      <StyledText
                        fontSize={13}
                        fontWeight="800"
                        color={type.color}
                      >
                        {cta.label}
                      </StyledText>
                      <Icon name="arrow-right" size={14} color={type.color} />
                    </Stack>
                  </StyledPressable>
                )}
                {!!imageUri && (
                  <StyledPressable
                    onPress={() => setImageViewerVisible(true)}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${notification!.title} image full screen`}
                  >
                    <Stack horizontal alignItems="center" gap={6} paddingVertical={3}>
                      <Icon name="image" size={14} color={type.color} />
                      <StyledText
                        fontSize={13}
                        fontWeight="800"
                        color={type.color}
                      >
                        View image
                      </StyledText>
                    </Stack>
                  </StyledPressable>
                )}
              </Stack>
            )}
        </Stack>
      </Stack>

      {!!imageUri && (
        <FullScreenImageViewer
          visible={imageViewerVisible}
          imageUri={imageUri}
          accessibilityLabel={`${notification!.title} flyer`}
          onClose={() => setImageViewerVisible(false)}
        />
      )}
    </Animated.View>
  );
}
