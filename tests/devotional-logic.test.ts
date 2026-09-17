import { devotionalData } from "../src/devotional/data";
import {
  getDevotionalByDay,
  getDevotionalForDate,
  getDevotionalForSelectedDate,
  getDevotionalsByMonth,
  getVerseById,
  monthProgress,
  toggleId,
  toLocalDateKey,
} from "../src/devotional/logic";
import { getMonthTheme } from "../src/devotional/month-themes";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

assert(!!devotionalData, "Devotional data failed to load/validate");
const data = devotionalData!;

// All 365 devotionals load
assert(data.allDevotionals.length === 365, `Expected 365 devotionals, got ${data.allDevotionals.length}`);

// Day IDs are unique
assert(new Set(data.allDevotionals.map((d) => d.id)).size === 365, "Devotional IDs must be unique");

// Every verseId resolves
const unresolved = data.allDevotionals.filter((d) => !getVerseById(d.verseId));
assert(unresolved.length === 0, `Unresolved verseIds: ${unresolved.map((d) => d.id).join(", ")}`);

// Month ordering is correct (day field strictly ascending, months in calendar order)
for (let index = 1; index < data.allDevotionals.length; index += 1) {
  assert(data.allDevotionals[index].day > data.allDevotionals[index - 1].day, `Day ordering broke at index ${index}`);
}
for (let month = 1; month <= 12; month += 1) {
  assert(data.collectionsByMonth[month]?.metadata.month === month, `Month ${month} metadata mismatch`);
}

// Day 1 and Day 365 boundaries
assert(data.allDevotionals[0].day === 1 && data.allDevotionals[0].monthDay === 1, "Day 1 boundary incorrect");
assert(getDevotionalByDay(1)?.id === data.allDevotionals[0].id, "getDevotionalByDay(1) mismatch");
const last = data.allDevotionals[data.allDevotionals.length - 1];
assert(last.day === 365, `Expected day 365 at the end, got ${last.day}`);
assert(getDevotionalByDay(365)?.id === last.id, "getDevotionalByDay(365) mismatch");

// February transition: Feb has 28 entries, March 1 follows immediately in day-of-year terms
const february = getDevotionalsByMonth(2);
assert(february.length === 28, `Expected 28 February devotionals, got ${february.length}`);
const march = getDevotionalsByMonth(3);
assert(march[0].day === february[february.length - 1].day + 1, "March 1 must follow February 28 with no gap");

// Leap-year behaviour: Feb 29 reuses Feb 28's devotional, and does not shift March onward
const feb28 = getDevotionalForDate(data, new Date(2028, 1, 28)); // 2028 is a leap year
const feb29 = getDevotionalForDate(data, new Date(2028, 1, 29));
assert(!!feb28 && !!feb29 && feb28.id === feb29.id, "Feb 29 must reuse Feb 28's devotional");
const mar1Leap = getDevotionalForDate(data, new Date(2028, 2, 1));
const mar1NonLeap = getDevotionalForDate(data, new Date(2027, 2, 1));
assert(!!mar1Leap && !!mar1NonLeap && mar1Leap.id === mar1NonLeap.id, "March 1 must resolve identically regardless of leap year");

// December 31 always resolves
const dec31 = getDevotionalForDate(data, new Date(2027, 11, 31));
assert(!!dec31 && dec31.monthDay === 31, "December 31 must resolve to the 31st December devotional");

// Selected date loads the correct devotional
const jan15 = getDevotionalForSelectedDate(new Date(2027, 0, 15));
assert(jan15?.monthDay === 15 && jan15.day === 15, "Selected date must resolve the matching devotional");

// Monthly progress updates correctly
const octoberIds = getDevotionalsByMonth(10).slice(0, 5).map((d) => d.id);
const progress = monthProgress(10, octoberIds);
assert(progress.completed === 5 && progress.total === 31, "Monthly progress calculation is incorrect");

// Unknown devotional IDs / verse IDs fail safely (undefined, not a throw)
assert(getVerseById("not-a-real-verse-id") === undefined, "Unknown verseId must resolve to undefined, not throw");

// Completion/favourite id toggling (shared by both storage hooks)
assert(JSON.stringify(toggleId(["a", "a"], "b")) === JSON.stringify(["a", "b"]), "Toggling must dedupe and add");
assert(toggleId(["a", "b"], "a").join(",") === "b", "Toggling an existing id must remove it");

// Month themes derive a title distinct from the raw metadata title, and reuse real data
const octoberTheme = getMonthTheme(10);
assert(octoberTheme?.title === "Prayer and Spiritual Growth", `Unexpected October theme title: ${octoberTheme?.title}`);

// Local date key formatting never uses UTC
assert(toLocalDateKey(new Date(2027, 0, 5)) === "2027-01-05", "Local date key formatting incorrect");

console.log("Daily Devotional logic tests passed.");
