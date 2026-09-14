import { DEFAULT_THEME_ID, THEMES, type AppColors, type ThemeId } from "./themes";

// Kept as a stable object so every existing `COLORS.*` call site remains
// source-compatible. ThemeProvider updates its values before remounting the
// app shell; new components can use `useColors()` directly.
export const COLORS: AppColors = { ...THEMES[DEFAULT_THEME_ID].colors };

// Only the "dark" theme has an actual dark background — "midnight" reads
// dark by name but its paper colors are light (`#FAFBFC` etc; navy is just
// its accent). Matches the isDark check appearance.tsx already uses for
// StyledPage's statusBarStyle. Reassigned in applyThemeColors() alongside
// COLORS itself, same live-binding-on-remount contract.
export let isDarkTheme: boolean = DEFAULT_THEME_ID === "dark";

const formFieldColors = (colors: AppColors) => ({
  background: colors.paperAlt,
  border: colors.chromeBorder,
  text: colors.ink,
  placeholder: colors.inkSoftest,
  label: colors.inkDeep,
});

// Stable object for fluent-styles inputs. Theme changes mutate this object
// alongside COLORS so every form gets an elevated dark surface, readable
// labels/text, and appropriately subdued placeholders without per-screen
// colour branches.
export const FORM_FIELD_COLORS = formFieldColors(COLORS);

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
  Object.assign(FORM_FIELD_COLORS, formFieldColors(COLORS));
  isDarkTheme = themeId === "dark";
  ICON_TONES.splice(0, ICON_TONES.length,
    { bg: COLORS.goldPale, fg: COLORS.goldDeep },
    { bg: COLORS.sageSoft, fg: COLORS.sage },
    { bg: `${COLORS.indigo}1A`, fg: COLORS.indigo },
    { bg: COLORS.paperAlt, fg: COLORS.goldDeep },
    { bg: COLORS.goldSoft, fg: COLORS.sage }
  );
}
