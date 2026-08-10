import { useMemo, useState } from "react";
import { Linking, TouchableOpacity } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  StyledTextInput,
  Stack,
  Popup,
  StyledSpacer,
  StyledShape,
} from "fluent-styles";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import { FeatureGate } from "../../src/components/FeatureGate";
import { useFellowship } from "../../src/hooks/useChurchData";
import { COLORS } from "../../src/theme/colors";
import { SHADOW_CARD, SHADOW_CHIP } from "../../src/theme/shadows";
import { ScalePressable } from "../../src/components/ScalePressable";

// ── Per-card accent palette — cycles by index ────────────────────────────────
const CARD_ACCENTS = [
  { pale: "#FFF3E0", accent: "#F97316" },
  { pale: "#EEF2FF", accent: "#4F6BF6" },
  { pale: "#ECFDF5", accent: "#10B981" },
  { pale: "#F5F3FF", accent: "#8B5CF6" },
  { pale: "#FEF2F2", accent: "#EF4444" },
  { pale: "#F0FDF4", accent: "#16A34A" },
  { pale: "#FFF1F2", accent: "#F43F5E" },
  { pale: "#FFFBEB", accent: "#D97706" },
] as const;

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
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const active = useMemo(
    () => (groups ?? []).filter((g) => g.status !== false),
    [groups],
  );

  const cities = useMemo(() => {
    const set = new Set<string>();
    active.forEach((g) => {
      if (g.town) set.add(g.town);
    });
    return Array.from(set).sort();
  }, [active]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return active.filter((g) => {
      const matchesSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.town?.toLowerCase().includes(q) ||
        g.addressLine1?.toLowerCase().includes(q);
      const matchesCity = !cityFilter || g.town === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [active, query, cityFilter]);

  function openInMaps(group: (typeof active)[0]) {
    const coords = group.location?.coordinates;
    if (coords) {
      const [lng, lat] = coords;
      Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
    } else if (group.addressLine1) {
      Linking.openURL(
        `https://maps.google.com/?q=${encodeURIComponent(`${group.addressLine1}, ${group.town ?? ""}`)}`,
      );
    }
  }

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <Stack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
        <StyledText
          fontSize={11}
          fontWeight="700"
          letterSpacing={1}
          color={COLORS.gold}
          style={{ marginBottom: 8 }}
        >
          FELLOWSHIP
        </StyledText>
        <StyledText
          fontSize={26}
          fontWeight="800"
          color={COLORS.ink}
          style={{ marginBottom: 6 }}
        >
          Find your people
        </StyledText>
        <StyledText
          fontSize={13.5}
          color={COLORS.inkSoft}
          style={{ marginBottom: 18, lineHeight: 20 }}
        >
          Small groups meeting through the week for prayer, Bible study, and
          friendship.
        </StyledText>

        {/* Search + Filter row */}
        <Stack horizontal alignItems="center" gap={10}>
          <Stack flex={1}>
            <StyledTextInput
              variant="outline"
              placeholder="Search fellowships (e.g. Manchester, Leeds)"
              leftIcon={<Icon name="search" size={15} color={COLORS.inkSoft} />}
              value={query}
              onChangeText={setQuery}
              clearable
              maxLength={50}
            />
          </Stack>
          <ScalePressable onPress={() => setFilterOpen(true)}>
            <StyledShape
              cycle
              size={48}
              borderWidth={1.5}
              borderColor={cityFilter ? COLORS.gold : COLORS.chromeBorder}
              backgroundColor={cityFilter ? COLORS.goldPale : COLORS.white}
              style={{
                ...SHADOW_CHIP,
              }}
            >
              <Icon
                name="filter"
                size={24}
                color={cityFilter ? COLORS.goldDeep : COLORS.inkSoft}
              />
            </StyledShape>
          </ScalePressable>
        </Stack>
        {/* Count badge */}
        <Stack
          horizontal
          alignItems="center"
          gap={7}
          marginTop={16}
          alignSelf="flex-start"
          paddingHorizontal={12}
          paddingVertical={7}
          borderRadius={50}
          backgroundColor={COLORS.goldPale}
        >
          <Icon name="users" size={13} color={COLORS.goldDeep} />
          <StyledText fontSize={13} fontWeight="700" color={COLORS.goldDeep}>
            {filtered.length} fellowship{filtered.length === 1 ? "" : "s"}
          </StyledText>
        </Stack>
      </Stack>

      <StyledScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 32,
         
        }}
      >
        <Stack gap={14}>
          {filtered.length === 0 && (
            <StyledText
              fontSize={14}
              color={COLORS.inkSoft}
              textAlign="center"
              paddingVertical={32}
            >
              No fellowship groups match your search.
            </StyledText>
          )}
          {filtered.map((group, i) => {
            const tone = CARD_ACCENTS[i % CARD_ACCENTS.length];
            const address = [group.addressLine1, group.postcode]
              .filter(Boolean)
              .join(", ");

            return (
              <ScalePressable
                key={group._id ?? i}
                onPress={() => openInMaps(group)}
              >
                <Stack
                  backgroundColor={COLORS.white}
                  borderRadius={22}
                  padding={16}
                  horizontal
                  alignItems="center"
                  gap={14}
                  style={SHADOW_CARD}
                >
                  {/* Left circle icon */}
                  <StyledShape
                    size={48}
                    cycle
                    backgroundColor={tone.pale}
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Icon name="home" size={24} color={tone.accent} />
                  </StyledShape>

                  {/* Content */}
                  <Stack flex={1} gap={3}>
                    <StyledText
                      fontSize={16}
                      fontWeight="800"
                      color={COLORS.ink}
                      style={{ lineHeight: 22 }}
                    >
                      {group.name}
                    </StyledText>
                    {group.town && (
                      <StyledText
                        fontSize={13}
                        fontWeight="700"
                        color={tone.accent}
                      >
                        {group.town}
                      </StyledText>
                    )}
                    {address ? (
                      <Stack
                        horizontal
                        alignItems="flex-start"
                        gap={6}
                        marginTop={2}
                      >
                        <Icon
                          name="map-pin"
                          size={12}
                          color={COLORS.inkSoft}
                          style={{ marginTop: 2 }}
                        />
                        <StyledText
                          fontSize={12.5}
                          color={COLORS.inkSoft}
                          style={{ flex: 1, lineHeight: 18 }}
                        >
                          {address}
                        </StyledText>
                      </Stack>
                    ) : null}
                    {group.mobile ? (
                      <Stack horizontal alignItems="center" gap={6}>
                        <Icon name="phone" size={12} color={COLORS.inkSoft} />
                        <StyledText fontSize={12.5} color={COLORS.inkSoft}>
                          {group.mobile}
                        </StyledText>
                      </Stack>
                    ) : null}
                  </Stack>

                  {/* Right: map pin button + chevron */}
                  <Stack horizontal alignItems="center" gap={6} flexShrink={0}>
                    <Icon
                      name="chevron-right"
                      size={16}
                      color={COLORS.inkSoft}
                    />
                  </Stack>
                </Stack>
              </ScalePressable>
            );
          })}
        </Stack>
      </StyledScrollView>

      {/* City Filter Popup */}
      <Popup
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter by City"
        showClose
        safeAreaBottom
      >
        <Stack padding={20} gap={10}>
          <TouchableOpacity
            onPress={() => {
              setCityFilter(null);
              setFilterOpen(false);
            }}
            activeOpacity={0.75}
          >
            <Stack
              paddingHorizontal={16}
              paddingVertical={12}
              borderRadius={12}
              backgroundColor={!cityFilter ? COLORS.goldPale : COLORS.chrome}
              style={
                !cityFilter
                  ? { borderWidth: 1.5, borderColor: COLORS.gold }
                  : undefined
              }
            >
              <StyledText
                fontSize={14}
                fontWeight="700"
                color={!cityFilter ? COLORS.goldDeep : COLORS.ink}
              >
                All cities
              </StyledText>
            </Stack>
          </TouchableOpacity>

          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              onPress={() => {
                setCityFilter(city);
                setFilterOpen(false);
              }}
              activeOpacity={0.75}
            >
              <Stack
                paddingHorizontal={16}
                paddingVertical={12}
                borderRadius={12}
                backgroundColor={
                  cityFilter === city ? COLORS.goldPale : COLORS.chrome
                }
                style={
                  cityFilter === city
                    ? { borderWidth: 1.5, borderColor: COLORS.gold }
                    : undefined
                }
              >
                <StyledText
                  fontSize={14}
                  fontWeight="700"
                  color={cityFilter === city ? COLORS.goldDeep : COLORS.ink}
                >
                  {city}
                </StyledText>
              </Stack>
            </TouchableOpacity>
          ))}
        </Stack>
      </Popup>

      <BottomTabBar active="more" />
    </StyledPage>
  );
}
