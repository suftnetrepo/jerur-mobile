/**
 * Mobile carbon copy of jerur-next/constants/denominations.js —
 * DENOMINATIONS there. Same ids, same labels, same ordering.
 *
 * This is a hand-maintained duplicate, not a fetch: church denominations
 * are a fixed, rarely-changing list (same reasoning as
 * src/config/mobileFeatures.ts for feature flags), so the mobile app
 * carries its own copy instead of calling the backend for it. If the
 * backend list ever changes, update both files together.
 *
 * `id` is what's persisted on Church.denomination and what every
 * church-profile-returning endpoint (GET /church/get, /church/search,
 * /church/single) actually returns — a future filter compares against
 * `id`, never `label`. `label` is display-only text, free to reword later
 * without touching any stored data or requiring a migration — that's the
 * whole point of storing the id instead of the label (see jerur-next
 * migrations/006-convert-denomination-to-ids.js for the one-time cleanup
 * that moved existing data off label strings).
 *
 * "all" is a mobile-only sentinel (not a real backend denomination value)
 * meaning "no denomination filter applied" — it has no equivalent on the
 * backend list.
 */
export type Denomination = {
  id: string;
  label: string;
};

export const DENOMINATIONS: Denomination[] = [
  { id: "all", label: "All Churches" },
  { id: "pentecostal", label: "Pentecostal" },
  { id: "evangelical", label: "Evangelical" },
  { id: "baptist", label: "Baptist" },
  { id: "methodist", label: "Methodist" },
  { id: "anglican", label: "Anglican" },
  { id: "catholic", label: "Catholic" },
  { id: "presbyterian", label: "Presbyterian" },
  { id: "reformed", label: "Reformed" },
  { id: "lutheran", label: "Lutheran" },
  { id: "orthodox", label: "Orthodox" },
  { id: "apostolic", label: "Apostolic" },
  { id: "charismatic", label: "Charismatic" },
  { id: "non-denominational", label: "Non-denominational" },
  { id: "full-gospel", label: "Full Gospel" },
  { id: "church-of-god", label: "Church of God" },
  { id: "assemblies-of-god", label: "Assemblies of God" },
  { id: "foursquare-gospel", label: "Foursquare Gospel" },
  { id: "redeemed-christian-church-of-god", label: "Redeemed Christian Church of God" },
  { id: "living-faith-church", label: "Living Faith Church (Winners Chapel)" },
  { id: "christ-embassy", label: "Christ Embassy" },
  { id: "mountain-of-fire-and-miracles", label: "Mountain of Fire and Miracles" },
  { id: "deeper-life-bible-church", label: "Deeper Life Bible Church" },
  { id: "salvation-ministries", label: "Salvation Ministries" },
  { id: "seventh-day-adventist", label: "Seventh-day Adventist" },
  { id: "jehovahs-witnesses", label: "Jehovah's Witnesses" },
  { id: "other", label: "Other" },
];
