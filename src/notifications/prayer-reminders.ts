/**
 * Local, on-device reminders for prayer sessions (Chop/Midday/KAPS, whatever
 * a church has configured under /regularService/get/prayer). No backend
 * involvement at all — the reminder is a recurring OS-scheduled local
 * notification (expo-notifications), and "which sessions have a reminder,
 * at what offset" is a device-local AsyncStorage preference, same shape as
 * src/bible/reader-preferences-storage.ts.
 *
 * Scheduling a DAILY trigger (SchedulableTriggerInputTypes.DAILY) hands the
 * repeat off to the OS (UNUserNotificationCenter on iOS, AlarmManager on
 * Android) - it keeps firing whether or not the app is running, which is
 * what "must work even when the app is closed" requires. No TaskManager /
 * background fetch needed for that part.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { RegularService } from "../api/types";

const STORAGE_KEY = "prayer-reminders";
const ANDROID_CHANNEL_ID = "prayer-reminders";

/** The only offsets the picker exposes - minutes before the session's start_time, 0 = at start time. */
export const REMINDER_OFFSETS = [0, 10, 15, 30] as const;
export type ReminderOffset = (typeof REMINDER_OFFSETS)[number];

export function offsetLabel(offsetMinutes: number): string {
  return offsetMinutes === 0 ? "At start time" : `${offsetMinutes} minutes before`;
}

export type PrayerReminder = {
  offsetMinutes: number;
  notificationId: string;
  /** The session's start_time this reminder was scheduled against - lets reconcilePrayerReminders() notice the admin moved the time and needs re-scheduling. */
  startTime: string;
  title: string;
};

type PrayerReminderMap = Record<string, PrayerReminder>;

/** Stable key for a prayer session - falls back to title since RegularService._id is typed optional (see api/types.ts), though the API always sends one in practice. */
export function sessionKey(meeting: Pick<RegularService, "_id" | "title">): string {
  return meeting._id ?? meeting.title;
}

async function loadMap(): Promise<PrayerReminderMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PrayerReminderMap) : {};
  } catch {
    return {};
  }
}

async function saveMap(map: PrayerReminderMap): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/** "05:30" -> { hour: 5, minute: 30 }. Returns null for anything that isn't a plain 24-hour HH:MM (the admin form's <input type="time"> shape - see jerur-next regular-services/form.jsx). */
function parseClock(value: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

function formatClock(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** Start-of-session clock time minus the offset, wrapping back over midnight. */
function triggerClockFor(startTime: string, offsetMinutes: number): { hour: number; minute: number } | null {
  const start = parseClock(startTime);
  if (!start) return null;
  const totalMinutes = (start.hour * 60 + start.minute - offsetMinutes + 24 * 60) % (24 * 60);
  return { hour: Math.floor(totalMinutes / 60), minute: totalMinutes % 60 };
}

/** What the "✓ Reminder set · 05:15" pill shows - the actual clock time the notification fires at. */
export function reminderClockLabel(reminder: Pick<PrayerReminder, "startTime" | "offsetMinutes">): string | null {
  const clock = triggerClockFor(reminder.startTime, reminder.offsetMinutes);
  return clock ? formatClock(clock.hour, clock.minute) : null;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "Prayer reminders",
    importance: Notifications.AndroidImportance.HIGH,
  });
}

/** Requests permission only if it hasn't been decided yet - never re-prompts after a decline (the OS wouldn't show a dialog for that anyway). */
export async function ensureNotificationPermission(): Promise<{ granted: boolean; canAskAgain: boolean }> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return { granted: true, canAskAgain: current.canAskAgain };
  if (!current.canAskAgain) return { granted: false, canAskAgain: false };
  const requested = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } });
  return { granted: requested.granted, canAskAgain: requested.canAskAgain };
}

/** Schedules (replacing any previous one for this session) a daily reminder, persists it, and returns the new record. Does NOT request permission - call ensureNotificationPermission() first. */
export async function scheduleReminder(meeting: RegularService, offsetMinutes: number): Promise<PrayerReminder | null> {
  const clock = triggerClockFor(meeting.start_time, offsetMinutes);
  if (!clock) return null;

  await ensureAndroidChannel();

  const map = await loadMap();
  const key = sessionKey(meeting);
  const existing = map[key];
  if (existing) {
    // Cancel before rescheduling so a changed time/offset never leaves a stale duplicate behind.
    await Notifications.cancelScheduledNotificationAsync(existing.notificationId).catch(() => {});
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: offsetMinutes === 0 ? `${meeting.title} Prayer is starting now` : `${meeting.title} Prayer starts in ${offsetMinutes} minutes`,
      body: "Prepare to join the prayer session.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: clock.hour,
      minute: clock.minute,
      ...(Platform.OS === "android" ? { channelId: ANDROID_CHANNEL_ID } : null),
    },
  });

  const record: PrayerReminder = { offsetMinutes, notificationId, startTime: meeting.start_time, title: meeting.title };
  await saveMap({ ...map, [key]: record });
  return record;
}

/** Cancels the OS notification and removes the stored preference for one session. */
export async function removeReminder(key: string): Promise<void> {
  const map = await loadMap();
  const existing = map[key];
  if (!existing) return;
  await Notifications.cancelScheduledNotificationAsync(existing.notificationId).catch(() => {});
  const { [key]: _removed, ...rest } = map;
  await saveMap(rest);
}

/**
 * Loads stored reminders and, for whichever of `meetings` have drifted from
 * the start_time they were scheduled against (the admin edited the prayer
 * time since), re-schedules them at the new time/offset - cancelling the
 * stale OS notification in the process so nothing duplicate is left
 * behind. Reminders for sessions no longer present in `meetings` are left
 * alone in storage (their OS notification is still valid/harmless; they'll
 * reconcile again once that session reappears) rather than silently
 * cancelled out from under the member.
 */
export async function reconcilePrayerReminders(meetings: RegularService[]): Promise<PrayerReminderMap> {
  const map = await loadMap();

  for (const meeting of meetings) {
    const key = sessionKey(meeting);
    const existing = map[key];
    if (existing && existing.startTime !== meeting.start_time) {
      // scheduleReminder() persists the updated record itself - mirror it
      // into our in-memory copy so the map we return here is current too.
      const updated = await scheduleReminder(meeting, existing.offsetMinutes);
      if (updated) map[key] = updated;
    }
  }

  return map;
}
