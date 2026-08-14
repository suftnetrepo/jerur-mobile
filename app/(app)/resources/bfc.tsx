import { StyledPage, StyledScrollView, StyledText, Stack } from "fluent-styles";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { COLORS } from "../../../src/theme/colors";

export default function BfcScreen() {
  return (
    <FeatureGate feature="believers-foundation-class">
      <BfcScreenContent />
    </FeatureGate>
  );
}

function BfcScreenContent() {
  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <AppBackHeader title="Foundation Class" />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <Stack alignItems="center" marginBottom={28}>
          <StyledText fontSize={19} fontWeight="700" color={COLORS.ink} style={{ fontStyle: "italic", textAlign: "center", lineHeight: 27, marginBottom: 10 }}>
            "If the foundations are destroyed, what can the righteous do?"
          </StyledText>
          <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.goldDeep}>
            PSALM 11:3
          </StyledText>
        </Stack>

        <Stack gap={14} marginBottom={28}>
          <StyledText fontSize={14} color={COLORS.inkSoft} style={{ lineHeight: 21 }}>
            In the journey of life, foundations are vitally important to destiny. To make the most of one's Christian
            adventure, it is important to address the foundations of the faith. We are admonished to contend for the faith
            that was once delivered to the saints — Jude 3. This means there is an unadulterated dimension of faith — a walk
            with God that is as God originally intended.
          </StyledText>
          <StyledText fontSize={14} color={COLORS.inkSoft} style={{ lineHeight: 21 }}>
            The purpose of the Believers Foundation Class is to ensure that we are all grounded in the foundations of faith
            that will ensure a profitable and colorful adventure in the Lord.
          </StyledText>
        </Stack>

        <Stack backgroundColor={COLORS.paperAlt} borderRadius={14} padding={20} alignItems="center">
          <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.goldDeep} style={{ marginBottom: 6 }}>
            EVERY TUESDAY · 7PM
          </StyledText>
          <StyledText fontSize={16} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6, textAlign: "center" }}>
            Join the foundation class
          </StyledText>
          <StyledText fontSize={13} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
            See how to connect with the blessings that come from building your life on solid ground.
          </StyledText>
        </Stack>
      </StyledScrollView>
    </StyledPage>
  );
}
