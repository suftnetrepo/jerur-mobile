/**
 * Mobile port of jerur-next's utils/youtube.js — same extraction logic,
 * same two candidate thumbnail URLs. The backend already derives and
 * sends a `thumbnail` (maxresdefault) for the latest sermon (see
 * GET /sermon/get), so this file's main job on the mobile side is the
 * *fallback* thumbnail: maxresdefault.jpg doesn't exist for every video
 * (mainly older/lower-resolution uploads), so LatestSermonCard swaps to
 * hqdefault.jpg on an <Image onError> rather than the backend trying to
 * guess which one exists ahead of time.
 *
 * Supports (at minimum):
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://youtube.com/shorts/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 *   https://www.youtube.com/live/VIDEO_ID
 * plus the same on m.youtube.com, with or without extra query params.
 */

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const isValidYouTubeId = (id: string | null | undefined): id is string =>
  typeof id === "string" && YOUTUBE_ID_PATTERN.test(id);

export function extractYouTubeVideoId(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    const host = url.hostname.replace(/^www\.|^m\./, "");
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (host === "youtu.be") {
      return isValidYouTubeId(pathParts[0]) ? pathParts[0] : null;
    }

    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return isValidYouTubeId(id) ? id : null;
      }
      if (["shorts", "embed", "live"].includes(pathParts[0])) {
        return isValidYouTubeId(pathParts[1]) ? pathParts[1] : null;
      }
    }
  } catch {
    // Fall through to the regex below for anything URL parsing rejects.
  }

  const match = trimmed.match(/(?:[?&]v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

export type YouTubeThumbnailUrls = { maxres: string; hq: string };

export function getYouTubeThumbnailUrls(videoId?: string | null): YouTubeThumbnailUrls | null {
  if (!isValidYouTubeId(videoId)) return null;
  return {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}
