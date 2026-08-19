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
    a: "Our Sunday and midweek services usually last around 90 minutes. We encourage you to arrive a little early so you have time to settle in before the service begins.",
  },
  {
    q: "What are the service times?",
    a: "We meet every Sunday at 9:00 AM and 11:00 AM. Our midweek service takes place every Wednesday at 7:00 PM.",
  },
  {
    q: "What should I expect on my first visit?",
    a: "Expect a warm welcome, uplifting worship, prayer and a Bible-based message. Our welcome team will be available to help you find your way and answer any questions you may have.",
  },
  {
    q: "What should I wear?",
    a: "Come as you are. There is no special dress code. Some people dress formally while others prefer something more casual — what matters most is that you feel comfortable and welcome.",
  },
  {
    q: "Do I need to register before attending?",
    a: "No. You are welcome to attend any of our services without registering in advance. Simply come along and our welcome team will be happy to receive you.",
  },
  {
    q: "Can I come if I'm not a Christian?",
    a: "Absolutely. Everyone is welcome. Whether you're exploring Christianity, returning to church after some time away, or simply curious about faith, we'd love to have you with us.",
  },
  {
    q: "Who is Jesus Christ?",
    a: 'Jesus Christ is the Son of God, who came into the world so that we could be reconciled to God and receive eternal life. John 3:16 says: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life."',
  },
  {
    q: "What if I need prayer or counselling?",
    a: "Our pastors and ministry team are available to pray with you and offer support. After the service, simply speak to one of our ushers and they will be happy to direct you.",
  },
  {
    q: "Do you provide childcare?",
    a: "Yes. Our children's church for ages 2–12 and teens church for ages 13–19 run alongside our main services, providing age-appropriate teaching and activities.",
  },
  {
    q: "Can I bring my children with me?",
    a: "Of course. Families are very welcome. Your children can stay with you or join the appropriate children's or teens church during the service.",
  },
  {
    q: "Where can I park?",
    a: "Free parking is available on-site at Ormiston Bushfield Academy. Our ushers will be available to guide you when you arrive.",
  },
  {
    q: "Is the church accessible?",
    a: "We want everyone to feel welcome and comfortable. If you have accessibility requirements or need assistance when you arrive, please speak to a member of our welcome team.",
  },
  {
    q: "Will I be asked to give money?",
    a: "There is an opportunity to give during our services, but giving is entirely voluntary. As a visitor, please don't feel under any obligation to give.",
  },
  {
    q: "How can I become part of the church?",
    a: "If you'd like to make this your church home, speak with our welcome team after a service. We'll help you discover the next steps, including our Foundation Class and opportunities to get connected.",
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
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 60  }}
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
        <Stack
          width={42}
          height={4}
          borderRadius={999}
          backgroundColor={COLORS.gold}
          marginBottom={12}
        />
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
            <Collapse key={item.q} title={item.q} variant="cell">
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
