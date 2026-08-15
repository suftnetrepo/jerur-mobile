import type { RegularService } from "../api/types";

export const DEFAULT_HOME_NOTICE_MINUTES = 15;

export type LiveSession = {
  key: string;
  kind: "service" | "prayer";
  session: RegularService;
  startsAt: Date;
  endsAt: Date;
  minutesUntilStart: number;
  isLive: boolean;
};

function timeParts(value: string): [number, number] | null {
  const match = /^(\d{1,2}):(\d{2})/.exec(value?.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return [hours, minutes];
}

function occurrence(session: RegularService, day: Date): { startsAt: Date; endsAt: Date } | null {
  const start = timeParts(session.start_time);
  const end = timeParts(session.end_time);
  if (!start || !end || !session.days?.includes(day.getDay())) return null;

  const startsAt = new Date(day);
  startsAt.setHours(start[0], start[1], 0, 0);
  const endsAt = new Date(day);
  endsAt.setHours(end[0], end[1], 0, 0);
  if (endsAt <= startsAt) endsAt.setDate(endsAt.getDate() + 1);
  return { startsAt, endsAt };
}

export function findLiveSessions(
  services: RegularService[] = [],
  prayers: RegularService[] = [],
  now = new Date(),
): LiveSession[] {
  const candidates = [
    ...services.map((session) => ({ kind: "service" as const, session })),
    ...prayers.map((session) => ({ kind: "prayer" as const, session })),
  ];

  return candidates.flatMap(({ kind, session }, index) => {
    const leadMinutes = Number.isFinite(session.home_notice_minutes)
      ? Math.max(0, session.home_notice_minutes as number)
      : DEFAULT_HOME_NOTICE_MINUTES;
    const days = [new Date(now), new Date(now)];
    days[1].setDate(days[1].getDate() - 1); // catches sessions crossing midnight

    for (const day of days) {
      const range = occurrence(session, day);
      if (!range) continue;
      const noticeStartsAt = new Date(range.startsAt.getTime() - leadMinutes * 60_000);
      if (now >= noticeStartsAt && now <= range.endsAt) {
        const minutesUntilStart = Math.max(0, Math.ceil((range.startsAt.getTime() - now.getTime()) / 60_000));
        return [{
          key: session._id ?? `${kind}-${session.title}-${index}`,
          kind,
          session,
          ...range,
          minutesUntilStart,
          isLive: now >= range.startsAt,
        }];
      }
    }
    return [];
  }).sort((a, b) => Number(b.isLive) - Number(a.isLive) || a.startsAt.getTime() - b.startsAt.getTime());
}

export function formatSessionTimeRange(startsAt: Date, endsAt: Date): string {
  const format = (date: Date) => date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).toUpperCase();
  return `${format(startsAt)} – ${format(endsAt)}`;
}
