/**
 * Brand tokens — ported 1:1 from church-site/tailwind.config.ts, so the
 * mobile app reads as the same brand rather than an independent reskin.
 * Flat hex, no theming system — one brand, one look, same as premeal-mobile.
 */
export const COLORS = {
  ink: "#211F1C",
  inkSoft: "#6B675E",
  inkSoftest: "#A39D92",
  inkDeep: "#4B453A",
  paper: "#FCFBF7",
  paperAlt: "#F2ECDE",
  paperAltSoft :"#e9e6e1",
  paperSoft: "#F9F7F2",
  paperSoftest: "#FDFCF9",
  paperWarm: "#FDF9F2",
  // Neutral cool gray-lavender used as the default screen background —
  // matches the ChurchTools/Life.Church reference screenshots' app-shell
  // feel, distinct from the warmer "paper" tone reserved for content cards
  // (pastor quote, etc.) where the church's own brand warmth should show.
  chrome: "#F1F2F6",
  chromeBorder: "#E4E6EE",
  indigo: "#1B2340",
  indigoDeep: "#12172A",
  gold: "#D9A441",
  goldDeep: "#8C6420",
  goldPale: "#F4E3C1",
  goldSoft: "#f3eadf",
  sage: "#5E7052",
  sageSoft: "#E6EBDD",
  border: "rgba(33,31,28,0.12)",
  white: "#FFFFFF",
  error: "#DC2626",
  errorLight: "#FEF2F2",
} as const;

// Cycling tones used for icon badges across list screens (fellowship,
// prayer times, service times) — mirrors the same "different tones per
// card" pattern used on the website, so cards don't all read identically.
export const ICON_TONES = [
  { bg: COLORS.goldPale, fg: COLORS.goldDeep },
  { bg: COLORS.sageSoft, fg: COLORS.sage },
  { bg: "rgba(27,35,64,0.1)", fg: COLORS.indigo },
  { bg: "#F3DFCF", fg: "#9C5B3C" },
  { bg: "#E9D9EC", fg: "#7A4F87" },
] as const;
