import type { ReactNode } from "react";
import { StyledText, StyledImageBackground, Stack, StyledSpacer } from "fluent-styles";
import { COLORS } from "../theme/colors";
import { SHADOW_CARD } from "../theme/shadows";
import type { ChurchSettings } from "../api/types";

const WELCOME_BG = require("../../assets/welcome_message.png");

const FALLBACK_DESCRIPTION =
  "Whatever season you’re walking through, you don’t have to walk through it alone. Come as you are — we’ll believe with you for what’s next.";

// welcome_message.png is a fixed 624×400 piece of artwork (leaf sprig +
// gradient in its corners) - fine under resizeMode="cover" for a card a
// few lines tall, but a long pastor bio pushes the card's height well past
// that aspect ratio, forcing "cover" to zoom into a tiny slice of the
// image rather than showing the artwork. Past this rough character count
// (~5-6 lines at the card's width), swap to PlainQuoteCard below instead
// of letting the background stretch into an ugly crop.
const LONG_TEXT_THRESHOLD = 260;

/**
 * Renders the pastor quote, highlighting "Come as you are" in gold/italic
 * when that phrase appears in the description.
 */
function WelcomeQuoteText({ text }: { text: string }) {
  const PHRASE = "Come as you are";
  const idx = text.indexOf(PHRASE);
  if (idx === -1) {
    return (
      <StyledText fontSize={18} color={COLORS.ink} style={{ lineHeight: 29 }}>
        {text}
      </StyledText>
    );
  }
  return (
    <StyledText fontSize={18} color={COLORS.ink} style={{ lineHeight: 29 }}>
      {text.slice(0, idx)}
      <StyledText fontSize={18} fontWeight="700" color={COLORS.gold} style={{ fontStyle: "italic" }}>
        {PHRASE}
      </StyledText>
      {text.slice(idx + PHRASE.length)}
    </StyledText>
  );
}

/**
 * The "A word of welcome" premium quote card - background artwork
 * (assets/welcome_message.png), the pastor's description with "Come as you
 * are" highlighted, optionally followed by a gold rule + their name/title.
 * Originally Home-only (app/(app)/index.tsx); pulled out here so the
 * Pastor screen can show the exact same card instead of a re-typed plain
 * version.
 *
 * `showAttribution` defaults to true (Home has no other pastor byline on
 * screen, so the card is the only place the name/title appears). The
 * Pastor screen passes false - it already has its own avatar/name/title
 * header above this card, so repeating them here would just be the same
 * information twice.
 */
export function WelcomeMessageCard({
  pastor,
  heading = "",
  showAttribution = true,
}: {
  pastor?: ChurchSettings["pastor_section"];
  heading?: string;
  showAttribution?: boolean;
}) {
  const text = pastor?.description ?? FALLBACK_DESCRIPTION;
  const attribution = showAttribution && (
    <>
      <Stack width={56} height={1.5} backgroundColor={COLORS.gold} marginTop={24} marginBottom={16} />
      <StyledText fontSize={14} fontWeight="800" color={COLORS.ink}>
        {pastor ? `${pastor.first_name} ${pastor.last_name}` : "The pastoral team"}
      </StyledText>
      <StyledText fontSize={12} color={COLORS.inkSoft} style={{ marginTop: 3 }}>
        {pastor?.title ?? "Lead Pastor"}, Winners Chapel Peterborough
      </StyledText>
    </>
  );

  return (
    <Stack gap={12}>
      {heading && (
        <StyledText fontSize={16} fontWeight="800" color={COLORS.ink}>
          {heading}
        </StyledText>
      )}

      {text.length > LONG_TEXT_THRESHOLD ? (
        <PlainQuoteCard text={text} attribution={attribution} showAttribution={showAttribution} />
      ) : (
        <StyledImageBackground source={WELCOME_BG} borderRadius={22} resizeMode="cover" style={SHADOW_CARD}>
          <Stack marginVertical={8} padding={26} paddingBottom={showAttribution ? 8 : 22}>
            <StyledSpacer marginVertical={8} />
            <WelcomeQuoteText text={text} />
            {attribution}
          </Stack>
        </StyledImageBackground>
      )}
    </Stack>
  );
}

/**
 * Same card, no background artwork - a flat warm card with a large
 * decorative quote glyph instead, so it stays premium at any height a long
 * message needs rather than stretching a fixed-aspect image to fit.
 */
function PlainQuoteCard({ text, attribution, showAttribution }: { text: string; attribution: ReactNode; showAttribution: boolean }) {
  return (
    <Stack backgroundColor={COLORS.paperAlt} borderRadius={22} padding={26} paddingTop={34} paddingBottom={showAttribution ? 8 : 26} style={[{ overflow: "hidden" }, SHADOW_CARD]}>
      <StyledText
        style={{ position: "absolute", top: -6, left: 18, fontSize: 84, fontWeight: "800", color: COLORS.gold, opacity: 0.16 }}
      >
        “
      </StyledText>
      <WelcomeQuoteText text={text} />
      {attribution}
    </Stack>
  );
}
