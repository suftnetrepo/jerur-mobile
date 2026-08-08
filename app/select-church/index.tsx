import { useEffect, useMemo, useState } from "react";
import { Animated, ScrollView } from "react-native";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledText, StyledShape, StyledTextInput, StyledPressable, StyledChip, Popup, Stack, Loader } from "fluent-styles";
import { useSelectedChurch } from "../../src/church/SelectedChurchContext";
import { searchChurchesByQuery, searchChurchesByRadius } from "../../src/api/churchSearch";
import { getCurrentCoordinates } from "../../src/lib/location";
import { apiErrorMessage } from "../../src/api/client";
import { ScalePressable } from "../../src/components/ScalePressable";
import { ChurchResultCard } from "../../src/components/ChurchResultCard";
import { useFadeUp } from "../../src/hooks/useFadeUp";
import { useDenominations } from "../../src/hooks/useDenominations";
import { SHADOW_SOFT, SHADOW_CARD, shadowCta } from "../../src/theme/shadows";
import { COLORS } from "../../src/theme/colors";
import type { ChurchSearchResult } from "../../src/api/types";

const DEFAULT_RADIUS_KM = 50;
const ALL_DENOMINATIONS = "all";

export default function SelectChurchScreen() {
  const { selectChurch } = useSelectedChurch();
  const { denominations } = useDenominations();
  const [query, setQuery] = useState("");
  // The raw, unmodified response from the backend — the ONLY thing that
  // ever comes from a network call. Denomination filtering never touches
  // this; it only ever reads from it (see `filteredResults` below).
  const [results, setResults] = useState<ChurchSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [selectedDenomination, setSelectedDenomination] = useState(ALL_DENOMINATIONS);
  const [filterOpen, setFilterOpen] = useState(false);

  const heroAnim = useFadeUp(0);
  const listAnim = useFadeUp(120);

  // Derived, not fetched: filtering happens entirely in memory against
  // whatever `results` already holds. No API call is made or re-made when
  // `selectedDenomination` changes — this recomputes only when `results`
  // (a new search/near-me response) or `selectedDenomination` actually
  // changes, and clearing the filter (back to "all") is just another pass
  // over the same cached `results`, not a network round-trip.
  const filteredResults = useMemo(() => {
    if (selectedDenomination === ALL_DENOMINATIONS) return results;
    return results.filter((church) => church.denomination === selectedDenomination);
  }, [results, selectedDenomination]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    const timeout = setTimeout(async () => {
      try {
        setResults(await searchChurchesByQuery(q));
      } catch (err) {
        setError(apiErrorMessage(err, "Couldn't search churches right now."));
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  async function handleNearMe() {
    setLoading(true);
    setError(null);
    try {
      const coords = await getCurrentCoordinates();
      if (!coords) {
        setError("Location permission is needed to find churches near you.");
        return;
      }
      setResults(await searchChurchesByRadius(coords.latitude, coords.longitude, DEFAULT_RADIUS_KM));
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't find churches near you right now."));
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(church: ChurchSearchResult) {
    setSelecting(church.externalId);
    await selectChurch(church);
    router.replace("/");
  }

  return (
    <StyledPage showStatusBar flex={1} backgroundColor={COLORS.chrome}>
      {/* NOTE: everything below — intro, search bar, and results — was
          previously plain Views with no scroll container at all, which is
          why a longer results list just overflowed off-screen with no way
          to scroll to it. Wrapped the whole body in a single ScrollView,
          same pattern used on every other screen in this app. */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Stack paddingHorizontal={20} paddingTop={20}>
          <Animated.View style={heroAnim}>
            <Stack alignItems="center" marginBottom={26} gap={6}>
              <StyledShape size={56} cycle backgroundColor={COLORS.goldPale} style={SHADOW_SOFT}>
                <Icon name="compass" size={24} color={COLORS.goldDeep} />
              </StyledShape>
              <StyledText fontSize={22} fontWeight="800" color={COLORS.ink} style={{ marginTop: 10 }}>
                Find your church
              </StyledText>
              <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
                Search by name, city, or postcode — or find what's near you.
              </StyledText>
            </Stack>

            <Stack horizontal alignItems="center" gap={10}>
              <Stack
                horizontal
                alignItems="center"
                gap={4}
                flex={1}
                borderRadius={999}
                paddingHorizontal={14}
                backgroundColor={COLORS.white}
                style={SHADOW_SOFT}
              >
                <Icon name="search" size={16} color={COLORS.inkSoft} />
                <StyledTextInput
                  variant="ghost"
                  placeholder="Search church, city, or postcode"
                  value={query}
                  onChangeText={setQuery}
                  clearable
                  style={{ flex: 1 }}
                />
              </Stack>

              {/* Denomination filter — opens a bottom sheet of chips built
                  from the local denomination catalogue (no backend call).
                  Filled/indigo whenever a denomination other than "All
                  Churches" is active, so the button itself shows filter
                  state at a glance. */}
              <StyledPressable
                onPress={() => setFilterOpen(true)}
                accessibilityLabel="Filter by denomination"
                accessibilityRole="button"
              >
                <Stack
                  width={44}
                  height={44}
                  borderRadius={22}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={selectedDenomination === ALL_DENOMINATIONS ? COLORS.white : COLORS.indigo}
                  style={SHADOW_SOFT}
                >
                  <Icon name="filter" size={17} color={selectedDenomination === ALL_DENOMINATIONS ? COLORS.ink : COLORS.white} />
                </Stack>
              </StyledPressable>
            </Stack>
          </Animated.View>
        </Stack>

        <Stack paddingHorizontal={20} paddingTop={20}>
          {results.length === 0 && !loading && (
            <Stack backgroundColor={COLORS.white} borderRadius={20} padding={22} alignItems="center" gap={14} style={SHADOW_CARD}>
              <Icon name="navigation" size={34} color={COLORS.indigo} />
              <StyledText fontSize={16} fontWeight="700" color={COLORS.ink}>
                Show churches near me
              </StyledText>
              <ScalePressable onPress={handleNearMe} style={{ width: "100%" }}>
                <Stack backgroundColor={COLORS.indigo} borderRadius={999} paddingVertical={15} alignItems="center" style={shadowCta(COLORS.indigo)}>
                  <StyledText fontSize={14.5} fontWeight="700" color={COLORS.white}>
                    Let's get started
                  </StyledText>
                </Stack>
              </ScalePressable>
            </Stack>
          )}

          {loading && (
            <Stack alignItems="center" paddingVertical={24}>
              <Loader color={COLORS.indigo} />
            </Stack>
          )}

          {error && (
            <Stack backgroundColor={COLORS.errorLight} borderRadius={12} padding={14} marginTop={16}>
              <StyledText fontSize={13.5} fontWeight="600" color={COLORS.error}>
                {error}
              </StyledText>
            </Stack>
          )}

          {/* Search found churches, but none of them match the selected
              denomination — distinct from the "no search yet" prompt
              above, which only depends on the raw (unfiltered) results. */}
          {!loading && results.length > 0 && filteredResults.length === 0 && (
            <Stack backgroundColor={COLORS.white} borderRadius={20} padding={22} alignItems="center" gap={10} style={SHADOW_CARD}>
              <Icon name="filter" size={26} color={COLORS.inkSoft} />
              <StyledText fontSize={14.5} fontWeight="700" color={COLORS.ink} style={{ textAlign: "center" }}>
                No {denominations.find((d) => d.id === selectedDenomination)?.label ?? ""} churches in these results
              </StyledText>
              <ScalePressable onPress={() => setSelectedDenomination(ALL_DENOMINATIONS)}>
                <StyledText fontSize={13.5} fontWeight="700" color={COLORS.goldDeep}>
                  Clear filter
                </StyledText>
              </ScalePressable>
            </Stack>
          )}

          <Animated.View style={listAnim}>
            <Stack gap={16} marginTop={filteredResults.length > 0 ? 0 : 20}>
              {filteredResults.map((church, i) => (
                <ChurchResultCard
                  key={church.externalId}
                  church={church}
                  index={i}
                  selecting={selecting === church.externalId}
                  onSelect={() => handleSelect(church)}
                />
              ))}
            </Stack>
          </Animated.View>
        </Stack>
      </ScrollView>

      <Popup
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter by denomination"
        subtitle="Applies instantly to your current search results"
        showClose
        safeAreaBottom
      >
        <Stack horizontal flexWrap="wrap" gap={10} padding={20}>
          {denominations.map((denomination) => (
            <StyledChip
              key={denomination.id}
              label={denomination.label}
              variant="ingredient"
              selected={selectedDenomination === denomination.id}
              onPress={() => {
                setSelectedDenomination(denomination.id);
                setFilterOpen(false);
              }}
            />
          ))}
        </Stack>
      </Popup>
    </StyledPage>
  );
}
