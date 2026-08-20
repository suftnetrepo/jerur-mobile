import type { ReactNode } from "react";
import {
  StyledText,
  Stack,
  StyledSpacer,
} from "fluent-styles";
import { COLORS } from "../theme/colors";
import { SHADOW_CARD, SHADOW_SOFT } from "../theme/shadows";
import type { ChurchSettings } from "../api/types";

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

// The one phrase Home's two quote-card treatments (background artwork and
// PlainQuoteCard) have always highlighted — unchanged. Never auto-guessed:
// it's a fixed constant, same as before this file introduced
// HighlightableText below.
const HOME_HIGHLIGHT_PHRASE = "Come as you are";

/**
 * Renders `text` as plain body copy, optionally highlighting one exact
 * `phrase` (gold/italic) if it's found inside it. No highlighting happens
 * unless a `phrase` is explicitly passed in — this never guesses which
 * words matter in someone else's message.
 */
function HighlightableText({
  text,
  phrase,
  fontSize = 18,
  color = COLORS.ink,
  style,
}: {
  text: string;
  phrase?: string;
  fontSize?: number;
  color?: string;
  style?: object;
}) {
  const idx = phrase ? text.indexOf(phrase) : -1;
  if (!phrase || idx === -1) {
    return (
      <StyledText fontSize={fontSize} color={color} style={style}>
        {text}
      </StyledText>
    );
  }
  return (
    <StyledText fontSize={fontSize} color={color} style={style}>
      {text.slice(0, idx)}
      <StyledText
        fontSize={fontSize}
        fontWeight="700"
        color={COLORS.gold}
        style={{ fontStyle: "italic" }}
      >
        {phrase}
      </StyledText>
      {text.slice(idx + phrase.length)}
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
 *
 * `plain` opts a caller out of the quote-card treatment entirely (no
 * background artwork, no giant decorative watermark glyph) in favour of a
 * simple warm/cream card: a small gold quote mark, the message as plain
 * body text, optionally highlighting `highlightPhrase` (gold/italic) if
 * it's explicitly given and actually found in the text — never guessed.
 * Home doesn't pass either (its own request was specifically "in the
 * pastor page"); Pastor does.
 */
export function WelcomeMessageCard({
  pastor,
  heading = "",
  showAttribution = true,
  plain = false,
  highlightPhrase,
}: {
  pastor?: ChurchSettings["pastor_section"];
  heading?: string;
  showAttribution?: boolean;
  plain?: boolean;
  highlightPhrase?: string;
}) {
  const text = pastor?.description ?? FALLBACK_DESCRIPTION;
  const attribution = showAttribution && (
    <>
      <Stack
        width={56}
        height={1.5}
        backgroundColor={COLORS.gold}
        marginTop={24}
        marginBottom={16}
      />
      <StyledText fontSize={14} fontWeight="800" color={COLORS.ink}>
        {pastor
          ? `${pastor.first_name} ${pastor.last_name}`
          : "The pastoral team"}
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

      {plain ? (
        <Stack
          backgroundColor={COLORS.paperWarm}
          borderRadius={22}
          padding={24}
          style={SHADOW_SOFT}
        >
          <StyledText
            fontSize={26}
            fontWeight="800"
            color={COLORS.gold}
            style={{ lineHeight: 22, marginBottom: 8 }}
          >
            “
          </StyledText>
          <HighlightableText
            text={text}
            phrase={highlightPhrase}
            fontSize={15}
            color={COLORS.inkSoft}
            style={{ lineHeight: 23 }}
          />
          {attribution}
        </Stack>
      ) : text.length > LONG_TEXT_THRESHOLD ? (
        <PlainQuoteCard
          text={text}
          attribution={attribution}
          showAttribution={showAttribution}
        />
      ) : (
        <Stack
          marginVertical={8}
          padding={26}
          paddingBottom={showAttribution ? 8 : 22}
        >
          <StyledSpacer marginVertical={8} />
          <HighlightableText
            text={text}
            phrase={HOME_HIGHLIGHT_PHRASE}
            fontSize={18}
            style={{ lineHeight: 29 }}
          />
          {attribution}
        </Stack>
      )}
    </Stack>
  );
}

/**
 * Same card, no background artwork - a flat warm card with a large
 * decorative quote glyph instead, so it stays premium at any height a long
 * message needs rather than stretching a fixed-aspect image to fit.
 */
function PlainQuoteCard({
  text,
  attribution,
  showAttribution,
}: {
  text: string;
  attribution: ReactNode;
  showAttribution: boolean;
}) {
  return (
    <Stack
      backgroundColor={COLORS.paperAlt}
      borderRadius={22}
      padding={26}
      paddingTop={34}
      paddingBottom={showAttribution ? 8 : 26}
      style={[{ overflow: "hidden" }, SHADOW_CARD]}
    >
      <StyledText
        style={{
          position: "absolute",
          top: -6,
          left: 18,
          fontSize: 84,
          fontWeight: "800",
          color: COLORS.gold,
          opacity: 0.16,
        }}
      >
        “
      </StyledText>
      <HighlightableText
        text={text}
        phrase={HOME_HIGHLIGHT_PHRASE}
        fontSize={18}
        style={{ lineHeight: 29 }}
      />
      {attribution}
    </Stack>
  );
}
