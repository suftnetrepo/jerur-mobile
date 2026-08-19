// Regular-service day-of-week helpers — shared between Service Times
// (listing services and their recurrence) and Check-in (gating and
// summarizing attendance submission for one specific service). Both work
// off RegularService.days / jerur-next's ServiceTime.days: 0=Sunday..
// 6=Saturday, the same convention as JS's own Date.getDay().

export const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** e.g. [0] -> "Sunday", [0, 3] -> "Sunday & Wednesday", [] -> null. */
export function formatServiceDayNames(
  days: number[] | null | undefined,
): string | null {
  if (!days?.length) return null;
  const names = days.map((d) => WEEKDAY_NAMES[d] ?? "").filter(Boolean);
  if (!names.length) return null;
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

/**
 * Whether a service recurring on the given weekdays runs today, in the
 * device's local time. Attendance can only ever be submitted on the
 * service's own day — this is the single source of truth Service Times
 * (disabling the "Check In" entry point) and Check-in (blocking the form
 * outright, in case the screen is reached any other way) both check
 * against. An empty/unknown day list is treated as "not today" rather
 * than always-allowed, matching `days` being a required field server-side.
 */
export function isServiceDay(days: number[] | null | undefined): boolean {
  if (!days?.length) return false;
  return days.includes(new Date().getDay());
}
