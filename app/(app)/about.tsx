import { router } from "expo-router";
import { Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledCard, Stack } from "fluent-styles";
import { useSettings } from "../../src/hooks/useChurchData";
import { COLORS, ICON_TONES } from "../../src/theme/colors";

function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

export default function AboutScreen() {
  const { data: settings } = useSettings();
  const team = (settings?.contacts ?? []).filter((c) => c.status !== false);

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header  shapeProps={{
                cycle: true,
                size: 48,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: COLORS.chromeBorder,
              }}
             
              marginHorizontal={16} showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.goldDeep} style={{ marginBottom: 8 }}>
          OUR STORY
        </StyledText>
        <StyledText fontSize={22} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 14 }}>
          Welcome to Winners Chapel International, Peterborough.
        </StyledText>
        <Stack gap={14} marginBottom={32}>
          <StyledText fontSize={14} color={COLORS.inkSoft} style={{ lineHeight: 21 }}>
            We are an arm of the Living Faith Church Worldwide. Our vision, as delivered to the Presiding Bishop, Dr David
            Oyedepo, is to preach the Word of Faith, liberating men everywhere from every oppression of the devil. We are
            dedicated to accomplishing this task throughout the United Kingdom, and Europe at large.
          </StyledText>
          <StyledText fontSize={14} color={COLORS.inkSoft} style={{ lineHeight: 21 }}>
            Our church in London was officially inaugurated in 2002 to spread the Word of Faith and to bring the liberation
            mandate to the United Kingdom and Europe. We have experienced diverse testimonies as individuals and as a church
            ever since.
          </StyledText>
          <StyledText fontSize={14} color={COLORS.inkSoft} style={{ lineHeight: 21 }}>
            We are glad you have come to this website because we know your life will never be the same again. Join any of our
            weekly and Sunday services and as you come to visit us, God will meet you at every point of your need.
          </StyledText>
        </Stack>

        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.goldDeep} style={{ marginBottom: 8 }}>
          LEADERSHIP
        </StyledText>
        <StyledText fontSize={19} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 16 }}>
          Meet the team
        </StyledText>
        <Stack horizontal flexWrap="wrap" gap={12}>
          {team.length === 0 && (
            <StyledText fontSize={13.5} color={COLORS.inkSoft}>
              Our team details will appear here soon.
            </StyledText>
          )}
          {team.map((person, i) => {
            const tone = ICON_TONES[i % ICON_TONES.length];
            return (
              <StyledCard key={person._id ?? i} shadow="light" padding={16} borderRadius={12} style={{ width: "47%" }}>
                <Stack alignItems="center">
                  <Stack width={56} height={56} borderRadius={28} backgroundColor={tone.bg} alignItems="center" justifyContent="center" marginBottom={10}>
                    <StyledText fontSize={17} fontWeight="800" color={tone.fg}>
                      {initials(person.first_name, person.last_name)}
                    </StyledText>
                  </Stack>
                  <StyledText fontSize={13.5} fontWeight="700" color={COLORS.ink} style={{ textAlign: "center" }}>
                    {person.first_name} {person.last_name}
                  </StyledText>
                  <StyledText fontSize={11.5} fontWeight="600" color={COLORS.goldDeep} style={{ marginBottom: 6 }}>
                    {person.title}
                  </StyledText>
                  {person.phone && (
                    <Stack horizontal alignItems="center" gap={4} onTouchEnd={() => Linking.openURL(`tel:${person.phone}`)}>
                      <Icon name="phone" size={11} color={COLORS.inkSoft} />
                      <StyledText fontSize={11.5} color={COLORS.inkSoft}>
                        {person.phone}
                      </StyledText>
                    </Stack>
                  )}
                </Stack>
              </StyledCard>
            );
          })}
        </Stack>
      </StyledScrollView>
    </StyledPage>
  );
}
