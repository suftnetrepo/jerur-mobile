import { inspirationData } from "../inspiration/data";
import type { InspirationVerse } from "../inspiration/types";
import { devotionalData } from "./data";
import type { DevotionalData, DevotionalEntry, MonthlyDevotionalCollection } from "./types";

/**
 * Resolves a real calendar date to the devotional for that day-of-month,
 * rather than converting to a 1-365 day-of-year number. This sidesteps
 * leap-year arithmetic entirely instead of needing an offset after
 * February: every month's devotionals are indexed by `monthDay` (1-31),
 * and a date's day-of-month is clamped to however many devotionals that
 * month actually has.
 *
 * February 29 therefore clamps to 28 and reuses February 28's devotional —
 * it does not shift any devotional in March onward, and December 31 always
 * resolves because December has a full 31 entries.
 *
 * Uses the device's local date (getMonth/getDate), never UTC.
 */
export function getDevotionalForDate(data: DevotionalData, date: Date): DevotionalEntry | undefined {
  const month = date.getMonth() + 1;
  const collection = data.collectionsByMonth[month];
  if (!collection || !collection.devotionals.length) return undefined;
  const clampedDay = Math.min(date.getDate(), collection.devotionals.length);
  return collection.devotionals.find((devotional) => devotional.monthDay === clampedDay);
}

export function getTodayDevotional(date: Date = new Date()): DevotionalEntry | undefined {
  if (!devotionalData) return undefined;
  return getDevotionalForDate(devotionalData, date);
}

export function getDevotionalForSelectedDate(date: Date): DevotionalEntry | undefined {
  if (!devotionalData) return undefined;
  return getDevotionalForDate(devotionalData, date);
}

export function getDevotionalByDay(day: number): DevotionalEntry | undefined {
  return devotionalData?.allDevotionals.find((devotional) => devotional.day === day);
}

export function getDevotionalById(id: string): DevotionalEntry | undefined {
  return devotionalData?.devotionalsById[id];
}

export function getDevotionalsByMonth(month: number): DevotionalEntry[] {
  return devotionalData?.collectionsByMonth[month]?.devotionals ?? [];
}

export function getMonthCollection(month: number): MonthlyDevotionalCollection | undefined {
  return devotionalData?.collectionsByMonth[month];
}

export function getSeasonalCollection(seasonalCollectionId: string): DevotionalEntry[] {
  return devotionalData?.allDevotionals.filter((devotional) => devotional.seasonalCollectionId === seasonalCollectionId) ?? [];
}

export function getVerseById(verseId: string): InspirationVerse | undefined {
  return inspirationData?.verses[verseId];
}

/** Local-date `YYYY-MM-DD` key — used for calendar-strip comparisons, never a UTC ISO string. */
export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return toLocalDateKey(a) === toLocalDateKey(b);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

/** Seven local-date entries centred on `weekStart` (a Monday), for the week strip. */
export function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

/** The Monday on or before `date`, at local midnight. */
export function getWeekStart(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const isoWeekday = (start.getDay() + 6) % 7; // Mon=0 ... Sun=6
  start.setDate(start.getDate() - isoWeekday);
  return start;
}

export function monthProgress(month: number, completedIds: string[]): { completed: number; total: number } {
  const devotionals = getDevotionalsByMonth(month);
  const completedSet = new Set(completedIds);
  return { completed: devotionals.filter((devotional) => completedSet.has(devotional.id)).length, total: devotionals.length };
}

export function toggleId(ids: string[], id: string): string[] {
  const unique = [...new Set(ids)];
  return unique.includes(id) ? unique.filter((existing) => existing !== id) : [...unique, id];
}
