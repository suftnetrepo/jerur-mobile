import { useCallback, useEffect, useRef, useState } from "react";
import type { RegularService } from "../api/types";
import {
  ensureNotificationPermission,
  reconcilePrayerReminders,
  removeReminder as removeReminderRecord,
  scheduleReminder,
  sessionKey,
  type PrayerReminder,
} from "./prayer-reminders";

export type SetReminderResult = { ok: true } | { ok: false; reason: "permission-denied" | "schedule-failed" };

/**
 * Screen-level hook for the Prayer Hours reminder feature. Loads the
 * persisted reminders once `meetings` (the prayer times query result)
 * arrives, reconciling any whose start_time has drifted since it was set
 * (see reconcilePrayerReminders), then exposes set/remove actions that keep
 * this in-memory map and AsyncStorage in sync with the OS-scheduled
 * notifications.
 */
export function usePrayerReminders(meetings: RegularService[] | undefined) {
  const [reminders, setReminders] = useState<Record<string, PrayerReminder>>({});
  // Reconciliation only needs to run once per set of sessions, not on every
  // re-render react-query happens to trigger - guards against re-running it
  // for the same meetings reference/content repeatedly.
  const reconciledForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!meetings || meetings.length === 0) return;
    const fingerprint = meetings.map((m) => `${sessionKey(m)}:${m.start_time}`).join("|");
    if (reconciledForRef.current === fingerprint) return;
    reconciledForRef.current = fingerprint;

    let cancelled = false;
    reconcilePrayerReminders(meetings).then((map) => {
      if (!cancelled) setReminders(map);
    });
    return () => {
      cancelled = true;
    };
  }, [meetings]);

  const setReminder = useCallback(async (meeting: RegularService, offsetMinutes: number): Promise<SetReminderResult> => {
    const { granted } = await ensureNotificationPermission();
    if (!granted) return { ok: false, reason: "permission-denied" };

    const record = await scheduleReminder(meeting, offsetMinutes);
    if (!record) return { ok: false, reason: "schedule-failed" };

    setReminders((current) => ({ ...current, [sessionKey(meeting)]: record }));
    return { ok: true };
  }, []);

  const clearReminder = useCallback(async (meeting: RegularService) => {
    const key = sessionKey(meeting);
    await removeReminderRecord(key);
    setReminders((current) => {
      const { [key]: _removed, ...rest } = current;
      return rest;
    });
  }, []);

  return { reminders, setReminder, clearReminder };
}
