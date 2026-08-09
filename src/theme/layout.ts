// Shared geometry for Home's full-bleed content cards (LatestSermonCard,
// ArticlesSection's article cards). Both intentionally share these exact
// values rather than each hardcoding its own copy of "20", so their edges
// line up pixel-for-pixel and a future spacing change only has to happen
// in one place. Not meant for every Home section — just the ones that
// deliberately match LatestSermonCard's card geometry.
export const CARD_H_PAD = 20;
export const CARD_RADIUS = 20;
