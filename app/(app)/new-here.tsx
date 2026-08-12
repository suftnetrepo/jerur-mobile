import { router } from "expo-router";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  Collapse,
  Stack,
} from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { COLORS } from "../../src/theme/colors";

const FAQ = [
  {
    q: "How long are the services?",
    a: "Sunday and midweek services are 90 minutes long.",
  },
  {
    q: "What are the service times?",
    a: "We run services every Sunday at 9:00 and 11:00. On Wednesdays, our midweek service starts at 19:00.",
  },
  {
    q: "Who is Jesus Christ?",
    a: 'Jesus is the son of God, who came into the world to die for you and me, so that we could have a relationship with our Father God. John 3:16 says: "For God so loved the world that He gave His only begotten son, that whosoever believes in Him shall not perish but have everlasting life."',
  },
  {
    q: "What if I need prayer or counselling?",
    a: "There are pastors available to counsel and pray with you after every service. Just speak to an usher and they'll be happy to direct you.",
  },
  {
    q: "Do you provide childcare?",
    a: "Yes — our children's church (ages 2–12) and teens church (ages 13–19) run alongside every main service.",
  },
  {
    q: "Where can I park?",
    a: "Free parking is available on-site at Ormiston Bushfield Academy. Friendly ushers will be there to guide you as you arrive.",
  },
];

export default function NewHereScreen() {
  return (
    <FeatureGate feature="register-member">
      <NewHereScreenContent />
    </FeatureGate>
  );
}

function NewHereScreenContent() {
  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header
        shapeProps={{
          cycle: true,
          size: 48,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.chromeBorder,
        }}
        marginHorizontal={16}
        showBackArrow
        onBackPress={() => router.back()}
      />
      <StyledScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
      >
        <StyledText
          fontSize={11}
          fontWeight="700"
          letterSpacing={1}
          color={COLORS.gold}
          style={{ marginBottom: 8 }}
        >
          NEW HERE?
        </StyledText>
        <StyledText
          fontSize={22}
          fontWeight="800"
          color={COLORS.ink}
          style={{ marginBottom: 6 }}
        >
          You're welcome here.
        </StyledText>
        <StyledText
          fontSize={13.5}
          color={COLORS.inkSoft}
          style={{ marginBottom: 22, lineHeight: 20 }}
        >
          We're excited to meet you. Discover what to expect and how to get
          connected.
        </StyledText>
        <Stack gap={10}>
          {FAQ.map((item) => (
            <Collapse key={item.q} title={item.q} variant="bordered">
              <StyledText
                fontSize={13.5}
                color={COLORS.inkSoft}
                style={{ padding: 14, lineHeight: 20 }}
              >
                {item.a}
              </StyledText>
            </Collapse>
          ))}
        </Stack>
      </StyledScrollView>
    </StyledPage>
  );
}
