import { useMemo, useState } from "react";
import { Linking } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledCard, StyledTextInput, Stack } from "fluent-styles";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import { FeatureGate } from "../../src/components/FeatureGate";
import { useFellowship } from "../../src/hooks/useChurchData";
import { COLORS } from "../../src/theme/colors";

export default function FellowshipScreen() {
  return (
    <FeatureGate feature="house-fellowship">
      <FellowshipScreenContent />
    </FeatureGate>
  );
}

function FellowshipScreenContent() {
  const { data: groups } = useFellowship();
  const [query, setQuery] = useState("");

  const active = useMemo(() => (groups ?? []).filter((g) => g.status !== false), [groups]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return active;
    return active.filter((g) => g.name.toLowerCase().includes(q) || g.town?.toLowerCase().includes(q) || g.postcode?.toLowerCase().includes(q));
  }, [active, query]);

  function openInMaps(group: (typeof active)[0]) {
    const coords = group.location?.coordinates;
    if (coords) {
      // GeoJSON order is [lng, lat] — reversed for the maps URL
      const [lng, lat] = coords;
      Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
    } else if (group.addressLine1) {
      Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(`${group.addressLine1}, ${group.town ?? ""}`)}`);
    }
  }

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <Stack paddingHorizontal={24} paddingTop={20} paddingBottom={12}>
        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.gold} style={{ marginBottom: 8 }}>
          FELLOWSHIP
        </StyledText>
        <StyledText fontSize={24} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Find your people
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 16 }}>
          Small groups meeting through the week for prayer, Bible study, and friendship.
        </StyledText>
        <StyledTextInput
          variant="outline"
          placeholder="Search by name, town, or postcode"
          leftIcon={<Icon name="search" size={16} color={COLORS.inkSoft} />}
          value={query}
          onChangeText={setQuery}
          clearable
        />
      </Stack>

      <StyledScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 28 }}>
        <StyledText fontSize={12.5} color={COLORS.inkSoft} style={{ marginBottom: 12 }}>
          {filtered.length} fellowship{filtered.length === 1 ? "" : "s"}
        </StyledText>
        <Stack gap={12}>
          {filtered.length === 0 && (
            <StyledText fontSize={14} color={COLORS.inkSoft} style={{ textAlign: "center", paddingVertical: 24 }}>
              No fellowship groups match your search.
            </StyledText>
          )}
          {filtered.map((group, i) => (
            <StyledCard
              key={group._id ?? i}
              shadow="light"
              padding={16}
              borderRadius={12}
              pressable
              pressableProps={{ onPress: () => openInMaps(group) }}
            >
              <Stack horizontal alignItems="flex-start" justifyContent="space-between">
                <Stack flex={1} gap={4}>
                  <StyledText fontSize={15.5} fontWeight="700" color={COLORS.ink}>
                    {group.name}
                  </StyledText>
                  {group.town && (
                    <StyledText fontSize={12.5} fontWeight="700" color={COLORS.goldDeep}>
                      {group.town}
                    </StyledText>
                  )}
                  {(group.addressLine1 || group.postcode) && (
                    <StyledText fontSize={13} color={COLORS.inkSoft}>
                      {[group.addressLine1, group.postcode].filter(Boolean).join(", ")}
                    </StyledText>
                  )}
                  {group.mobile && (
                    <StyledText fontSize={13} color={COLORS.inkSoft}>
                      {group.mobile}
                    </StyledText>
                  )}
                </Stack>
                <Stack width={34} height={34} borderRadius={17} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center">
                  <Icon name="map-pin" size={15} color={COLORS.goldDeep} />
                </Stack>
              </Stack>
            </StyledCard>
          ))}
        </Stack>
      </StyledScrollView>

      <BottomTabBar active="more" />
    </StyledPage>
  );
}
