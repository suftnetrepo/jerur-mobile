import { useCallback, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router";

export type NotificationPermissionStatus = "granted" | "denied" | "undetermined" | "loading";

/**
 * Read-only view of the device notification permission for the
 * Notifications settings screen. Deliberately never calls
 * requestPermissionsAsync() itself - "request only when needed" means the
 * actual ask still only happens from PrayerReminderControl when a member
 * taps a reminder option (see ensureNotificationPermission() in
 * prayer-reminders.ts). This just reports the current status, re-checking
 * on focus so returning from the system Settings app (after the member
 * flips the toggle there) reflects immediately.
 */
export function useNotificationPermissionStatus() {
  const [status, setStatus] = useState<NotificationPermissionStatus>("loading");

  const refresh = useCallback(() => {
    Notifications.getPermissionsAsync().then((result) => {
      setStatus(result.granted ? "granted" : result.canAskAgain ? "undetermined" : "denied");
    });
  }, []);

  useEffect(refresh, [refresh]);
  useFocusEffect(refresh);

  return { status, refresh };
}
