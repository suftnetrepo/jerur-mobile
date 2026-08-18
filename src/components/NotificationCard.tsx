import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Image } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledText, StyledPressable } from "fluent-styles";
import { FullScreenImageViewer } from "./FullScreenImageViewer";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { getFeatureById } from "../config/mobileFeatures";
import {
  getNotificationType,
  getNotificationPriority,
} from "../config/notificationTypes";
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
const TYPE_CTA: Record<
  string,
  { featureId: string; label: string } | undefined
> = {
  event: { featureId: "upcoming-events", label: "View events" },
  promotion: { featureId: "giving", label: "Give now" },
  welcome: { featureId: "register-member", label: "Get started" },
};

function formatDatePart(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimePart(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
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
export function isNotificationActive(
  notification: ChurchNotification | null | undefined,
): boolean {
  if (!notification) return false;
  if (!notification.status) return false;
  // A church that has never configured a notification still has
  // status: true and empty title/message (the schema's own defaults) -
  // treat "no title" as "nothing to show", not as "show an empty card".
  if (!notification.title?.trim()) return false;

  const now = Date.now();
  if (
    notification.start_date &&
    new Date(notification.start_date).getTime() > now
  )
    return false;
  if (
    notification.expiry_date &&
    new Date(notification.expiry_date).getTime() < now
  )
    return false;
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
export function NotificationCard({
  notification,
}: {
  notification: ChurchNotification | null | undefined;
}) {
  const { hasFeature } = useFeatureFlags();
  const isActive = useMemo(
    () => isNotificationActive(notification),
    [notification],
  );
  const shouldRender = hasFeature("notifications") && isActive;

  // Fades in specifically when the card transitions to active (e.g. once
  // useSettings() resolves), not on component mount — this component is
  // always mounted by Home regardless of whether it's currently visible.
  const opacity = useRef(new Animated.Value(0)).current;
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const imageUri = notification?.secure_url?.trim() ?? "";

  useEffect(() => {
    if (shouldRender) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
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

  const dateRange = formatRange(
    formatDatePart(notification!.start_date),
    formatDatePart(notification!.expiry_date),
  );
  const timeRange = formatRange(
    formatTimePart(notification!.start_date),
    formatTimePart(notification!.expiry_date),
  );

  const ctaConfig = TYPE_CTA[type.id];
  const ctaFeature =
    ctaConfig && hasFeature(ctaConfig.featureId)
      ? getFeatureById(ctaConfig.featureId)
      : undefined;
  const cta = ctaFeature?.route
    ? { label: ctaConfig!.label, route: ctaFeature.route }
    : null;

  return (
    // Keep the same horizontal footprint as ChurchBanner so swapping the
    // shared home hero slot does not move surrounding content.
    <Animated.View style={{ opacity, paddingHorizontal: 20, marginBottom: 22 }}>
      <Stack
        backgroundColor="#FFFFFF"
        borderRadius={28}
        overflow="hidden"
        style={[
          SHADOW_CARD,
          {
            borderWidth: 1,
            borderColor: `${type.color}18`,
          },
        ]}
      >
        <Stack
          height={5}
          backgroundColor={type.color}
          accessibilityElementsHidden
        />

        <Stack padding={20} gap={18}>
          {/* Notification identity + priority */}
          <Stack
            horizontal
            alignItems="center"
            justifyContent="space-between"
            gap={12}
          >
            <Stack
              width={48}
              height={48}
              borderRadius={16}
              alignItems="center"
              justifyContent="center"
              backgroundColor={`${type.color}12`}
              accessibilityLabel={`${type.label} notification`}
            >
              <Icon name={type.icon as any} size={22} color={type.color} />
            </Stack>

            {(priority.id === "high" || priority.id === "urgent") && (
              <Stack
                horizontal
                alignItems="center"
                gap={7}
                borderRadius={999}
                paddingHorizontal={13}
                paddingVertical={8}
                backgroundColor={`${priority.color}10`}
                style={{
                  borderWidth: 1,
                  borderColor: `${priority.color}1F`,
                }}
              >
                <Icon name="bell" size={16} color={priority.color} />
                <StyledText
                  fontSize={11}
                  fontWeight="800"
                  letterSpacing={0.7}
                  color={priority.color}
                  style={{ textTransform: "uppercase" }}
                >
                  {priority.id === "urgent" ? "Urgent" : "Important"}
                </StyledText>
              </Stack>
            )}
          </Stack>

          {/* Primary content */}
          <Stack gap={7}>
            <StyledText
              fontSize={23}
              fontWeight="800"
              color={COLORS.ink}
              style={{ lineHeight: 29, letterSpacing: -0.35 }}
            >
              {notification!.title}
            </StyledText>

            {notification!.message?.trim() ? (
              <StyledText
                fontSize={14}
                color={COLORS.inkSoft}
                numberOfLines={4}
                style={{ lineHeight: 21 }}
              >
                {notification!.message}
              </StyledText>
            ) : null}
          </Stack>

          {/* Optional flyer preview. The existing full-screen viewer remains the
              single image interaction; this is only a premium visual preview. */}
          {!!imageUri && (
            <StyledPressable
              onPress={() => setImageViewerVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={`View ${notification!.title} image full screen`}
            >
              <Stack
                height={154}
                borderRadius={20}
                overflow="hidden"
                backgroundColor={`${type.color}0D`}
                style={{
                  borderWidth: 1,
                  borderColor: `${type.color}14`,
                }}
              >
                <Image
                  source={{ uri: imageUri }}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                />
                <Stack
                  horizontal
                  alignItems="center"
                  gap={6}
                  borderRadius={999}
                  paddingHorizontal={11}
                  paddingVertical={7}
                  backgroundColor="rgba(255,255,255,0.94)"
                  style={{
                    position: "absolute",
                    right: 10,
                    bottom: 10,
                    borderWidth: 1,
                    borderColor: `${type.color}1A`,
                  }}
                >
                  <Icon name="maximize-2" size={13} color={type.color} />
                </Stack>
              </Stack>
            </StyledPressable>
          )}

          {/* Date/time presented as premium information rows rather than pills. */}
          {(dateRange || timeRange) && (
            <Stack
              borderRadius={20}
              overflow="hidden"
              backgroundColor={`${type.color}08`}
              style={{
                borderWidth: 1,
                borderColor: `${type.color}10`,
              }}
            >
              {dateRange && (
                <Stack
                  horizontal
                  alignItems="center"
                  gap={12}
                  paddingHorizontal={14}
                  paddingVertical={13}
                >
                  <Stack
                    width={38}
                    height={38}
                    borderRadius={13}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={type.color}
                  >
                    <Icon name="calendar" size={18} color="#FFFFFF" />
                  </Stack>
                  <Stack gap={1} style={{ flex: 1 }}>
                    <StyledText
                      fontSize={9.5}
                      fontWeight="800"
                      letterSpacing={0.9}
                      color={COLORS.inkSoft}
                      style={{ textTransform: "uppercase" }}
                    >
                      Date
                    </StyledText>
                    <StyledText
                      fontSize={14.5}
                      fontWeight="700"
                      color={COLORS.ink}
                      style={{ lineHeight: 20 }}
                    >
                      {dateRange}
                    </StyledText>
                  </Stack>
                </Stack>
              )}

              {dateRange && timeRange && (
                <Stack
                  height={1}
                  marginHorizontal={14}
                  backgroundColor={`${type.color}14`}
                />
              )}

              {timeRange && (
                <Stack
                  horizontal
                  alignItems="center"
                  gap={12}
                  paddingHorizontal={14}
                  paddingVertical={13}
                >
                  <Stack
                    width={38}
                    height={38}
                    borderRadius={13}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={type.color}
                  >
                    <Icon name="clock" size={18} color="#FFFFFF" />
                  </Stack>
                  <Stack gap={1} style={{ flex: 1 }}>
                    <StyledText
                      fontSize={9.5}
                      fontWeight="800"
                      letterSpacing={0.9}
                      color={COLORS.inkSoft}
                      style={{ textTransform: "uppercase" }}
                    >
                      Time
                    </StyledText>
                    <StyledText
                      fontSize={14.5}
                      fontWeight="700"
                      color={COLORS.ink}
                      style={{ lineHeight: 20 }}
                    >
                      {timeRange}
                    </StyledText>
                  </Stack>
                </Stack>
              )}
            </Stack>
          )}

          {/* Keep the existing feature-aware CTA logic, but give it a clearer
              premium action treatment. Image-only notifications already expose
              their action on the preview, so there is no duplicate button. */}
          {cta && (
            <StyledPressable
              onPress={() => router.push(cta.route as any)}
              accessibilityRole="link"
            >
              <Stack
                horizontal
                alignItems="center"
                justifyContent="center"
                gap={8}
                minHeight={48}
                borderRadius={16}
                paddingHorizontal={16}
                backgroundColor={type.color}
                style={SHADOW_CARD}
              >
                <StyledText
                  fontSize={14}
                  fontWeight="800"
                  color="#FFFFFF"
                >
                  {cta.label}
                </StyledText>
                <Icon name="arrow-right" size={16} color="#FFFFFF" />
              </Stack>
            </StyledPressable>
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