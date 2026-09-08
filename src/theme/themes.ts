export const THEME_IDS = ["classic", "ocean", "forest", "royal", "rose", "midnight", "dark"] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export type AppColors = {
  ink: string;
  inkSoft: string;
  inkSoftest: string;
  inkDeep: string;
  paper: string;
  paperAlt: string;
  paperAltSoft: string;
  paperSoft: string;
  paperSoftest: string;
  paperWarm: string;
  chrome: string;
  chromeBorder: string;
  indigo: string;
  indigoDeep: string;
  gold: string;
  goldDeep: string;
  goldPale: string;
  goldSoft: string;
  sage: string;
  sageSoft: string;
  border: string;
  white: string;
  onPrimary: string;
  error: string;
  errorLight: string;
};

export type ThemeDefinition = {
  id: ThemeId;
  label: string;
  description: string;
  icon: string;
  preview: readonly [string, string, string];
  colors: AppColors;
};

export const DEFAULT_THEME_ID: ThemeId = "classic";

const shared = {
  white: "#FFFFFF",
  onPrimary: "#FFFFFF",
  error: "#DC2626",
  errorLight: "#FEF2F2",
} as const;

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  classic: {
    id: "classic",
    label: "Classic",
    description: "Warm, refined and familiar — the original church experience.",
    icon: "star",
    preview: ["#1B2340", "#D9A441", "#FCFBF7"],
    colors: {
      ink: "#211F1C", inkSoft: "#6B675E", inkSoftest: "#A39D92", inkDeep: "#4B453A",
      paper: "#FCFBF7", paperAlt: "#F2ECDE", paperAltSoft: "#E9E6E1", paperSoft: "#F9F7F2",
      paperSoftest: "#FDFCF9", paperWarm: "#FDF9F2", chrome: "#F1F2F6", chromeBorder: "#E4E6EE",
      indigo: "#1B2340", indigoDeep: "#12172A", gold: "#D9A441", goldDeep: "#8C6420",
      goldPale: "#F4E3C1", goldSoft: "#F3EADF", sage: "#5E7052", sageSoft: "#E6EBDD",
      border: "rgba(33,31,28,0.12)", ...shared,
    },
  },
  ocean: {
    id: "ocean", label: "Ocean", icon: "droplet",
    description: "Calm blues and fresh cyan accents for a welcoming feel.",
    preview: ["#0369A1", "#06B6D4", "#F4FAFC"],
    colors: {
      ink: "#172A3A", inkSoft: "#5E7282", inkSoftest: "#93A5B2", inkDeep: "#25465D",
      paper: "#F8FCFD", paperAlt: "#E4F3F7", paperAltSoft: "#DCECF1", paperSoft: "#F4FAFC",
      paperSoftest: "#FBFEFF", paperWarm: "#F1FAFC", chrome: "#EEF5F8", chromeBorder: "#DCE8ED",
      indigo: "#0369A1", indigoDeep: "#075985", gold: "#06B6D4", goldDeep: "#0E7490",
      goldPale: "#CFFAFE", goldSoft: "#E6F8FB", sage: "#0F766E", sageSoft: "#CCFBF1",
      border: "rgba(3,105,161,0.14)", ...shared,
    },
  },
  forest: {
    id: "forest", label: "Forest", icon: "feather",
    description: "Natural greens and soft neutrals inspired by growth.",
    preview: ["#166534", "#84A98C", "#F7FAF5"],
    colors: {
      ink: "#203126", inkSoft: "#647268", inkSoftest: "#9AA59C", inkDeep: "#354A3B",
      paper: "#FAFCF8", paperAlt: "#E8F0E4", paperAltSoft: "#E0E9DC", paperSoft: "#F7FAF5",
      paperSoftest: "#FCFEFB", paperWarm: "#F6FAF3", chrome: "#F0F4EF", chromeBorder: "#DFE7DC",
      indigo: "#166534", indigoDeep: "#14532D", gold: "#84A98C", goldDeep: "#3F6849",
      goldPale: "#DCF0D7", goldSoft: "#ECF5E9", sage: "#4D7C57", sageSoft: "#E0F0DD",
      border: "rgba(22,101,52,0.14)", ...shared,
    },
  },
  royal: {
    id: "royal", label: "Royal", icon: "award",
    description: "Rich indigo and violet tones with a premium character.",
    preview: ["#5B21B6", "#A78BFA", "#F8F7FC"],
    colors: {
      ink: "#29223A", inkSoft: "#6D647D", inkSoftest: "#A198AF", inkDeep: "#463B5C",
      paper: "#FBFAFD", paperAlt: "#EEE9F8", paperAltSoft: "#E7E1F2", paperSoft: "#F8F7FC",
      paperSoftest: "#FDFCFF", paperWarm: "#F9F6FD", chrome: "#F2F0F7", chromeBorder: "#E5E1ED",
      indigo: "#5B21B6", indigoDeep: "#3B0764", gold: "#A78BFA", goldDeep: "#6D28D9",
      goldPale: "#EDE9FE", goldSoft: "#F3EFFF", sage: "#7C3AED", sageSoft: "#EDE9FE",
      border: "rgba(91,33,182,0.14)", ...shared,
    },
  },
  rose: {
    id: "rose", label: "Rose", icon: "heart",
    description: "Warm rose accents balanced by light, graceful surfaces.",
    preview: ["#BE185D", "#FDA4AF", "#FFF8FA"],
    colors: {
      ink: "#35232A", inkSoft: "#78636B", inkSoftest: "#AA969D", inkDeep: "#563B45",
      paper: "#FFFBFC", paperAlt: "#F9E7EC", paperAltSoft: "#F3DFE5", paperSoft: "#FFF8FA",
      paperSoftest: "#FFFCFD", paperWarm: "#FFF6F8", chrome: "#F8F1F3", chromeBorder: "#EEDFE4",
      indigo: "#BE185D", indigoDeep: "#831843", gold: "#FB7185", goldDeep: "#BE123C",
      goldPale: "#FFE4E6", goldSoft: "#FFF0F2", sage: "#9D174D", sageSoft: "#FCE7F3",
      border: "rgba(190,24,93,0.13)", ...shared,
    },
  },
  midnight: {
    id: "midnight", label: "Midnight", icon: "moon",
    description: "Deep navy accents with crisp cyan and polished light surfaces.",
    preview: ["#111827", "#22D3EE", "#F5F7FA"],
    colors: {
      ink: "#161D2A", inkSoft: "#626E7F", inkSoftest: "#97A1AF", inkDeep: "#303B4B",
      paper: "#FAFBFC", paperAlt: "#E8EDF3", paperAltSoft: "#E0E6ED", paperSoft: "#F5F7FA",
      paperSoftest: "#FDFEFF", paperWarm: "#F5F8FA", chrome: "#EEF1F5", chromeBorder: "#DDE3EA",
      indigo: "#111827", indigoDeep: "#030712", gold: "#22D3EE", goldDeep: "#0E7490",
      goldPale: "#CFFAFE", goldSoft: "#E7FAFD", sage: "#6366F1", sageSoft: "#E0E7FF",
      border: "rgba(17,24,39,0.14)", ...shared,
    },
  },
  dark: {
    id: "dark", label: "Dark", icon: "circle",
    description: "A true dark appearance with teal highlights and elevated surfaces.",
    preview: ["#08141A", "#18B7B2", "#17262D"],
    colors: {
      ink: "#F3F7F8", inkSoft: "#A9BBC1", inkSoftest: "#71868E", inkDeep: "#D6E2E5",
      paper: "#0D1B21", paperAlt: "#17282F", paperAltSoft: "#1C3038", paperSoft: "#08141A",
      paperSoftest: "#112128", paperWarm: "#102229", chrome: "#17262D", chromeBorder: "#3B5660",
      indigo: "#18B7B2", indigoDeep: "#0E817E", gold: "#52D7D2", goldDeep: "#75E4DF",
      goldPale: "#163D3E", goldSoft: "#102F31", sage: "#73C7A1", sageSoft: "#17372D",
      border: "rgba(218,236,240,0.14)", white: "#122229", onPrimary: "#FFFFFF",
      error: "#FF8178", errorLight: "#3A2021",
    },
  },
};

export const THEME_LIST = THEME_IDS.map((id) => THEMES[id]);

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

export function resolveThemeId(value: unknown): ThemeId {
  return isThemeId(value) ? value : DEFAULT_THEME_ID;
}
