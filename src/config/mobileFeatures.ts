/**
 * Single source of truth for church-toggleable mobile features.
 *
 * Church administrators enable/disable these from the Jerur Admin Portal
 * (Settings -> More... -> Mobile Features). The backend only ever persists
 * the enabled `id`s, on Church.features (see
 * jerur-next/app/models/church.js) — everything else here (label,
 * description, icon, color, category) is presentation metadata that lives
 * client-side only, same as jerur-next's own copy of this file.
 *
 * This file MUST stay in sync, feature-for-feature, with
 * jerur-next/constants/mobileFeatures.js — `id`, `label`, `description`,
 * `category` and `color` are copied verbatim from there so the mobile app
 * and admin portal agree on what each feature is. `icon` differs
 * intentionally: the admin portal renders Material Symbols
 * (react-icons/md), the mobile app renders Feather icons
 * (@expo/vector-icons), so each side maps to its own icon set.
 *
 * `route` is mobile-only: which screen a feature links to. A feature can
 * exist here (and be toggleable by admins today) before its mobile screen
 * is built — leave `route` undefined and consumers should treat it as
 * "not yet available on mobile" rather than rendering a dead link.
 *
 * NOTE: the home Slider is not listed here — it is always available and is
 * not gated behind a feature flag (matches jerur-next's own note).
 */

export const FEATURE_CATEGORIES = [
  "Church",
  "Community",
  "Finance",
  "Media",
  "Communication",
  "Members",
] as const;

export type FeatureCategory = (typeof FEATURE_CATEGORIES)[number];

export type MobileFeature = {
  id: string;
  label: string;
  description: string;
  category: FeatureCategory;
  /** Feather icon name (@expo/vector-icons). */
  icon: string;
  /** Accent hex color, shared with the admin portal's feature card. */
  color: string;
  /** expo-router path this feature links to. Undefined = no mobile screen built yet. */
  route?: string;
};

export const MOBILE_FEATURES: MobileFeature[] = [
  {
    id: "giving",
    label: "Giving",
    description: "Allow members to make donations, tithes and offerings through the mobile app.",
    category: "Finance",
    icon: "heart",
    color: "#A16207",
    route: "/give",
  },
  {
    id: "campaigns",
    label: "Campaigns",
    description: "Let members view and contribute to active fundraising campaigns.",
    category: "Finance",
    icon: "trending-up",
    color: "#0E7490",
  },
  {
    id: "prayer-request",
    label: "Ask for Prayer",
    description: "Members can submit prayer requests directly to the church.",
    category: "Communication",
    icon: "message-circle",
    color: "#0D9488",
    route: "/prayers",
  },
  {
    id: "testimony",
    label: "Testimony",
    description: "Let members share testimonies of what God has done in their lives.",
    category: "Church",
    icon: "star",
    color: "#84CC16",
    route: "/testimonies",
  },
  {
    id: "house-fellowship",
    label: "House Fellowship",
    description: "Help members find and join a house fellowship group near them.",
    category: "Community",
    icon: "users",
    color: "#4338CA",
    route: "/fellowship",
  },
  {
    id: "register-member",
    label: "I'm New",
    description: "Allow visitors to register as a church member directly from the mobile app.",
    category: "Members",
    icon: "user-plus",
    color: "#0284C7",
    route: "/new-here",
  },
  {
    id: "hymns",
    label: "Hymns",
    description: "Give members access to a library of hymns and worship lyrics.",
    category: "Media",
    icon: "music",
    color: "#44403C",
    route: "/hymns",
  },
  {
    id: "attendance",
    label: "Attendance",
    description: "Let members check in and view their attendance history from the app.",
    category: "Church",
    icon: "check-circle",
    color: "#059669",
    // Not "/check-in" directly - that screen now requires a known
    // serviceId (see check-in.tsx) and never lists services itself.
    // Service Times is where a member actually picks which service to
    // submit attendance for; "Submit attendance" lives on each service
    // card there.
    route: "/service-times",
  },
  {
    id: "upcoming-events",
    label: "Upcoming Events",
    description: "Show members a calendar of upcoming church events.",
    category: "Church",
    icon: "calendar",
    color: "#7C3AED",
    route: "/events",
  },
  {
    id: "service-times",
    label: "Service Times",
    description: "Show members the church's regular service and prayer meeting times.",
    category: "Church",
    icon: "clock",
    color: "#C026D3",
    route: "/service-times",
  },
  {
    id: "contact-us",
    label: "Contact Us",
    description: "Let members reach the church office directly from the app.",
    category: "Communication",
    icon: "mail",
    color: "#E11D48",
    route: "/contact",
  },
  {
    id: "community-food-bank",
    label: "Community Food Bank",
    description: "Share food bank schedules and let members request or offer support.",
    category: "Community",
    icon: "shopping-bag",
    color: "#EA580C",
    route: "/food-bank",
  },
  {
    id: "free-transport",
    label: "Free Transport",
    description: "Let members request free transport to church services and events.",
    category: "Community",
    icon: "truck",
    color: "#2563EB",
    route: "/free-transport",
  },
  {
    id: "believers-foundation-class",
    label: "Believers Foundation Class",
    description: "New members can enrol in the Believers Foundation class.",
    category: "Church",
    icon: "book-open",
    color: "#9333EA",
    route: "/resources/bfc",
  },
  {
    id: "wofbi-basic-certificate",
    label: "Wofbi Basic Certificate Course",
    description: "Members can enrol in the Wofbi Basic Certificate course.",
    category: "Church",
    icon: "award",
    color: "#B91C1C",
    route: "/resources/wofbi",
  },
  {
    id: "note",
    label: "Note",
    description: "Let members take and save personal notes during sermons and services.",
    category: "Media",
    icon: "edit-3",
    color: "#DB2777",
    route: "/notes",
  },
  {
    id: "bible",
    label: "Bible",
    description: "Give members in-app access to a full Bible reader.",
    category: "Media",
    icon: "book",
    color: "#1E3A8A",
    route: "/bible",
  },
  {
    id: "sermons",
    label: "Sermons",
    description: "Let members watch or listen to past and recent sermons.",
    category: "Media",
    icon: "video",
    color: "#16A34A",
  },
  {
    id: "articles",
    label: "Christian Articles",
    description: "Read articles that help members grow in God's Word.",
    category: "Media",
    icon: "file-text",
    color: "#4F46E5",
  },
  {
    id: "prayer-hour",
    label: "Prayer Hour",
    description: "Notify members of and let them join the church's dedicated prayer hour sessions.",
    category: "Church",
    icon: "sunrise",
    color: "#115E59",
  },
];

export const getFeatureById = (id: string): MobileFeature | undefined =>
  MOBILE_FEATURES.find((feature) => feature.id === id);

export const groupFeaturesByCategory = (
  features: MobileFeature[] = MOBILE_FEATURES
): { category: FeatureCategory; features: MobileFeature[] }[] =>
  FEATURE_CATEGORIES.reduce<{ category: FeatureCategory; features: MobileFeature[] }[]>((groups, category) => {
    const categoryFeatures = features.filter((feature) => feature.category === category);
    if (categoryFeatures.length) {
      groups.push({ category, features: categoryFeatures });
    }
    return groups;
  }, []);
