import { useState } from "react";
import { Image, Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Stack, StyledPressable } from "fluent-styles";
import { Text } from "./text";
import { extractYouTubeVideoId, getYouTubeThumbnailUrls } from "../lib/youtube";
import { getNotificationType } from "../config/notificationTypes";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { SHADOW_CARD } from "../theme/shadows";
import { COLORS } from "../theme/colors";
import { CARD_H_PAD, CARD_RADIUS } from "../theme/layout";
import type { LatestSermon } from "../api/types";

// Reuses the exact accent color already established for the "Sermon"
// notification type (src/config/notificationTypes.ts) rather than
// inventing a new one — same visual identity for "sermon" content
// wherever it shows up on Home.
const ACCENT_COLOR = getNotificationType("sermon").color;

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Home screen's "Latest Sermon" card — one card only, no list/carousel.
 * Fully self-contained: Home just hands over whatever useLatestSermon()
 * already returned (no fetching in here), and this component owns every
 * visibility decision, collapsing to literally nothing (not even a
 * wrapper) when there's no published sermon or no valid YouTube URL to
 * open. Tapping anywhere on the card opens `youtubeUrl` via Linking —
 * no in-app player, no WebView.
 */
export function LatestSermonCard({ sermon }: { sermon: LatestSermon | null | undefined }) {
  const { hasFeature } = useFeatureFlags();
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  if (!hasFeature("sermons")) return null;
  if (!sermon) return null;

  const videoId = extractYouTubeVideoId(sermon.youtubeUrl);
  if (!videoId) return null;

  const thumbnailUrls = getYouTubeThumbnailUrls(videoId);
  if (!thumbnailUrls) return null;

  // Prefer the backend's already-derived maxresdefault; if it 404s (not
  // every video has one), swap to hqdefault, which YouTube always has.
  const thumbnailUri = thumbnailFailed ? thumbnailUrls.hq : sermon.thumbnail || thumbnailUrls.maxres;

  const dateLabel = formatDate(sermon.preachedAt);
  const metaParts = [dateLabel, sermon.durationMinutes ? `${sermon.durationMinutes} min` : null].filter(
    (part): part is string => Boolean(part)
  );

  function handlePress() {
    Linking.openURL(sermon!.youtubeUrl);
  }

  return (
    <Stack paddingHorizontal={CARD_H_PAD}>
      <StyledPressable onPress={handlePress} accessibilityRole="button" accessibilityLabel={`Watch sermon: ${sermon.title}`}>
        <Stack backgroundColor={COLORS.white} borderRadius={CARD_RADIUS} overflow="hidden" style={SHADOW_CARD}>
          <Stack style={{ height: 190, overflow: "hidden" }}>
            <Image
              source={{ uri: thumbnailUri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              onError={() => setThumbnailFailed(true)}
            />
            {/* Play badge, bottom-right corner of the thumbnail — style
                object, not flat props: see ChurchBanner.tsx/NotificationCard.tsx
                for why (`position: "absolute"` silently no-ops as a flat
                prop in this fluent-styles version). */}
            <Stack style={{ position: "absolute", bottom: 12, right: 12 }}>
              <Stack width={40} height={40} borderRadius={20} alignItems="center" justifyContent="center" backgroundColor="rgba(12,10,9,0.6)">
                <Icon name="play" size={17} color={COLORS.white} />
              </Stack>
            </Stack>
          </Stack>

          <Stack padding={18} gap={8}>
            <Text variant="overline" fontSize={11} letterSpacing={0.8} color={ACCENT_COLOR}>
              Latest Sermon
            </Text>
            <Text variant="title" fontSize={17} fontWeight="800" color={COLORS.ink} numberOfLines={2} style={{ lineHeight: 22 }}>
              {sermon.title}
            </Text>

            <Stack gap={2}>
              {sermon.speakerName ? (
                <Text variant="label" fontSize={13} color={COLORS.inkSoft}>
                  {sermon.speakerName}
                </Text>
              ) : null}
              {metaParts.length > 0 && (
                <Text variant="bodySmall" color={COLORS.inkSoft}>
                  {metaParts.join(" · ")}
                </Text>
              )}
            </Stack>

            {sermon.summary?.trim() ? (
              <Text variant="body" fontSize={13} color={COLORS.inkSoft} numberOfLines={2} style={{ lineHeight: 18 }}>
                {sermon.summary}
              </Text>
            ) : null}

            <Stack horizontal alignItems="center" gap={6} marginTop={4}>
              <Icon name="youtube" size={14} color={ACCENT_COLOR} />
              <Text variant="button" fontSize={13} color={ACCENT_COLOR}>
                Watch on YouTube
              </Text>
              <Icon name="arrow-right" size={13} color={ACCENT_COLOR} />
            </Stack>
          </Stack>
        </Stack>
      </StyledPressable>
    </Stack>
  );
}
