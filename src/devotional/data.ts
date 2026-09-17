import january from "../../assets/data/devotional/january-devotionals.json";
import february from "../../assets/data/devotional/february-devotionals.json";
import march from "../../assets/data/devotional/march-devotionals.json";
import april from "../../assets/data/devotional/april-devotionals.json";
import may from "../../assets/data/devotional/may-devotionals.json";
import june from "../../assets/data/devotional/june-devotionals.json";
import july from "../../assets/data/devotional/july-devotionals.json";
import august from "../../assets/data/devotional/august-devotionals.json";
import september from "../../assets/data/devotional/september-devotionals.json";
import october from "../../assets/data/devotional/october-devotionals.json";
import november from "../../assets/data/devotional/november-devotionals.json";
import december from "../../assets/data/devotional/december-devotionals.json";
import type { DevotionalData, DevotionalEntry, DevotionalMetadata, MonthlyDevotionalCollection } from "./types";

// Explicit calendar-order list (not `Object.values`/spread over an import
// object) so month ordering can never depend on property insertion order.
const RAW_MONTHLY_COLLECTIONS: unknown[] = [
  january, february, march, april, may, june,
  july, august, september, october, november, december,
];

function isMetadata(value: unknown, expectedMonth: number): value is DevotionalMetadata {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.collectionId === "string" && typeof item.title === "string" &&
    typeof item.version === "string" && item.month === expectedMonth &&
    typeof item.theme === "string" && typeof item.devotionalCount === "number" &&
    typeof item.translation === "string" && typeof item.estimatedReadMinutes === "number" &&
    typeof item.contentStatus === "string" && typeof item.description === "string";
}

// `monthDay` is checked separately in parseMonthlyCollection rather than
// here — January's source file omits it on every entry (a data quirk, not
// a January-specific format), so it's treated as recoverable rather than
// grounds to drop the record: see the fallback below.
function isDevotionalEntryShape(value: unknown): value is Omit<DevotionalEntry, "monthDay"> {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.day === "number" &&
    typeof item.title === "string" &&
    typeof item.theme === "string" && typeof item.verseId === "string" &&
    typeof item.reflection === "string" && typeof item.reflectionQuestion === "string" &&
    typeof item.prayer === "string" && typeof item.dailyAction === "string" &&
    typeof item.estimatedReadMinutes === "number" &&
    (item.seasonalCollectionId === null || typeof item.seasonalCollectionId === "string");
}

function parseMonthlyCollection(value: unknown, expectedMonth: number): MonthlyDevotionalCollection | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (!isMetadata(item.metadata, expectedMonth) || !Array.isArray(item.devotionals)) return null;
  const devotionals: DevotionalEntry[] = [];
  item.devotionals.forEach((raw, index) => {
    if (!isDevotionalEntryShape(raw)) return; // malformed/missing record dropped, rest of the month kept
    const rawMonthDay = (raw as Record<string, unknown>).monthDay;
    // Entries are authored in day-of-month order, so a 1-based array
    // position is a safe, correct fallback when `monthDay` itself is
    // missing from the source JSON.
    const monthDay = typeof rawMonthDay === "number" ? rawMonthDay : index + 1;
    devotionals.push({ ...raw, monthDay });
  });
  if (!devotionals.length) return null;
  return { metadata: item.metadata as DevotionalMetadata, devotionals };
}

function buildDevotionalData(): DevotionalData | null {
  const collectionsByMonth: Record<number, MonthlyDevotionalCollection> = {};
  for (let index = 0; index < RAW_MONTHLY_COLLECTIONS.length; index += 1) {
    const month = index + 1;
    const collection = parseMonthlyCollection(RAW_MONTHLY_COLLECTIONS[index], month);
    if (!collection) {
      const isDevelopment = (globalThis as typeof globalThis & { __DEV__?: boolean }).__DEV__ === true;
      if (isDevelopment) console.warn(`Daily Devotional: month ${month} failed to load or validate.`);
      continue;
    }
    collectionsByMonth[month] = collection;
  }
  if (!Object.keys(collectionsByMonth).length) return null;

  const allDevotionals = Object.keys(collectionsByMonth)
    .map(Number)
    .sort((a, b) => a - b)
    .flatMap((month) => collectionsByMonth[month].devotionals)
    .sort((a, b) => a.day - b.day);

  const devotionalsById: Record<string, DevotionalEntry> = {};
  for (const devotional of allDevotionals) devotionalsById[devotional.id] = devotional;

  return { allDevotionals, devotionalsById, collectionsByMonth };
}

export const devotionalData = buildDevotionalData();
