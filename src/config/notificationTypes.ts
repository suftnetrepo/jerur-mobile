/**
 * Mobile carbon copy of jerur-next/constants/notificationTypes.js — same
 * ids, labels, and accent colors (hex values are portable as-is). Same
 * pattern as src/config/mobileFeatures.ts / denominations.ts: `id` is
 * what's stored on Church.notification.type / .priority and returned by
 * GET /church/get, `label`/`color` are display-only. `icon` differs
 * intentionally — the admin portal renders Material Symbols
 * (react-icons/md), the mobile app renders Feather icons
 * (@expo/vector-icons), so each side maps to its own icon set, same as
 * every other config file in this directory.
 *
 * This is the single source of truth for notification badge color/icon/
 * label — see src/components/NotificationCard.tsx, which never hardcodes
 * these itself.
 */
export type NotificationType = {
  id: string;
  label: string;
  icon: string;
  color: string;
};

export const NOTIFICATION_TYPES: NotificationType[] = [
  { id: "announcement", label: "Announcement", icon: "volume-2", color: "#7C3AED" },
  { id: "event", label: "Event", icon: "calendar", color: "#2563EB" },
  { id: "promotion", label: "Promotion", icon: "tag", color: "#EA580C" },
  { id: "scripture", label: "Scripture", icon: "book-open", color: "#059669" },
  { id: "welcome", label: "Welcome", icon: "smile", color: "#DB2777" },
  { id: "emergency", label: "Emergency", icon: "alert-triangle", color: "#DC2626" },
  { id: "sermon", label: "Sermon", icon: "video", color: "#0891B2" },
];

export const getNotificationType = (id?: string | null): NotificationType =>
  NOTIFICATION_TYPES.find((t) => t.id === id) ?? NOTIFICATION_TYPES[0];

export type NotificationPriority = {
  id: string;
  label: string;
  color: string;
};

// low/normal/high/urgent — matches Church.notification.priority's enum
// exactly (see jerur-next app/models/church.js). "urgent" is the closest
// backend equivalent of what's sometimes called "critical" severity.
export const NOTIFICATION_PRIORITIES: NotificationPriority[] = [
  { id: "low", label: "Low", color: "#94A3B8" },
  { id: "normal", label: "Normal", color: "#2563EB" },
  { id: "high", label: "High", color: "#F59E0B" },
  { id: "urgent", label: "Urgent", color: "#DC2626" },
];

export const getNotificationPriority = (id?: string | null): NotificationPriority =>
  NOTIFICATION_PRIORITIES.find((p) => p.id === id) ?? NOTIFICATION_PRIORITIES[1];
