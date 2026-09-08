import { DEFAULT_THEME_ID, THEMES, type AppColors, type ThemeId } from "./themes";

// Kept as a stable object so every existing `COLORS.*` call site remains
// source-compatible. ThemeProvider updates its values before remounting the
// app shell; new components can use `useColors()` directly.
export const COLORS: AppColors = { ...THEMES[DEFAULT_THEME_ID].colors };

// Cycling tones used for icon badges across list screens (fellowship,
// prayer times, service times) — mirrors the same "different tones per
// card" pattern used on the website, so cards don't all read identically.
export const ICON_TONES: Array<{ bg: string; fg: string }> = [
  { bg: COLORS.goldPale, fg: COLORS.goldDeep },
  { bg: COLORS.sageSoft, fg: COLORS.sage },
  { bg: "rgba(27,35,64,0.1)", fg: COLORS.indigo },
  { bg: "#F3DFCF", fg: "#9C5B3C" },
  { bg: "#E9D9EC", fg: "#7A4F87" },
];

export function applyThemeColors(themeId: ThemeId) {
  Object.assign(COLORS, THEMES[themeId].colors);
  ICON_TONES.splice(0, ICON_TONES.length,
    { bg: COLORS.goldPale, fg: COLORS.goldDeep },
    { bg: COLORS.sageSoft, fg: COLORS.sage },
    { bg: `${COLORS.indigo}1A`, fg: COLORS.indigo },
    { bg: COLORS.paperAlt, fg: COLORS.goldDeep },
    { bg: COLORS.goldSoft, fg: COLORS.sage }
  );
}
