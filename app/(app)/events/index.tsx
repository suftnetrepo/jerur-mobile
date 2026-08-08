import { useState } from "react";
import { Image } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledCard, StyledButton, StyledForm, Popup, Stack } from "fluent-styles";
import { BottomTabBar } from "../../../src/components/BottomTabBar";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { useEvents } from "../../../src/hooks/useChurchData";
import { useEventRegistration } from "../../../src/hooks/useSubmissions";
import { apiErrorMessage } from "../../../src/api/client";
import { COLORS } from "../../../src/theme/colors";
import type { ChurchEvent } from "../../../src/api/types";

function formatDate(value?: string) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function EventsScreen() {
  return (
    <FeatureGate feature="upcoming-events">
      <EventsScreenContent />
    </FeatureGate>
  );
}

function EventsScreenContent() {
  const { data: events } = useEvents();
  const [registering, setRegistering] = useState<ChurchEvent | null>(null);

  const published = (events ?? []).filter((e) => e.status !== false);

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <Stack paddingHorizontal={24} paddingTop={20} paddingBottom={12}>
        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.gold} style={{ marginBottom: 8 }}>
          EVENTS
        </StyledText>
        <StyledText fontSize={24} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          What's coming up
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft}>
          Conferences, prayer nights, and community days — see what's on.
        </StyledText>
      </Stack>

      <StyledScrollView contentContainerStyle={{ padding: 24, paddingTop: 8, paddingBottom: 28 }}>
        <Stack gap={14}>
          {published.length === 0 && (
            <StyledText fontSize={14} color={COLORS.inkSoft} style={{ textAlign: "center", paddingVertical: 24 }}>
              No upcoming events right now — check back soon.
            </StyledText>
          )}
          {published.map((event, i) => {
            const dateRange =
              event.end_date && event.end_date !== event.start_date
                ? `${formatDate(event.start_date)} – ${formatDate(event.end_date)}`
                : formatDate(event.start_date);
            const location = [event.town, event.postcode].filter(Boolean).join(", ");

            return (
              <StyledCard key={event._id ?? i} shadow="light" borderRadius={14} overflow="hidden" padding={0}>
                {event.secure_url && (
                  <Image source={{ uri: event.secure_url }} style={{ width: "100%", height: 160 }} resizeMode="cover" />
                )}
                <Stack padding={16}>
                  <StyledText fontSize={17} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 8 }}>
                    {event.title}
                  </StyledText>
                  {dateRange && (
                    <Stack horizontal alignItems="center" gap={6} marginBottom={4}>
                      <Icon name="calendar" size={13} color={COLORS.inkSoft} />
                      <StyledText fontSize={12.5} color={COLORS.inkSoft}>
                        {dateRange}
                      </StyledText>
                    </Stack>
                  )}
                  {location && (
                    <Stack horizontal alignItems="center" gap={6} marginBottom={8}>
                      <Icon name="map-pin" size={13} color={COLORS.inkSoft} />
                      <StyledText fontSize={12.5} color={COLORS.inkSoft}>
                        {location}
                      </StyledText>
                    </Stack>
                  )}
                  {event.description && (
                    <StyledText fontSize={13.5} color={COLORS.inkSoft} numberOfLines={3} style={{ marginBottom: 12, lineHeight: 19 }}>
                      {event.description}
                    </StyledText>
                  )}
                  {event.can_register && (
                    <StyledButton primary compact onPress={() => setRegistering(event)}>
                      <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                        Register
                      </StyledButton.Text>
                    </StyledButton>
                  )}
                </Stack>
              </StyledCard>
            );
          })}
        </Stack>
      </StyledScrollView>

      {registering && <EventRegisterPopup event={registering} onClose={() => setRegistering(null)} />}

      <BottomTabBar active="events" />
    </StyledPage>
  );
}

function EventRegisterPopup({ event, onClose }: { event: ChurchEvent; onClose: () => void }) {
  const { mutateAsync, isPending } = useEventRegistration();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    try {
      await mutateAsync({ event_id: event._id ?? "", ...form });
      setSuccess(true);
    } catch (err) {
      setError(apiErrorMessage(err, "Registration failed. Please try again."));
    }
  }

  return (
    <Popup visible onClose={onClose} title="Register" subtitle={event.title} showClose safeAreaBottom>
      <Stack padding={20}>
        {success ? (
          <Stack backgroundColor={COLORS.sageSoft} borderRadius={8} padding={14}>
            <StyledText fontSize={14} fontWeight="600" color={COLORS.sage}>
              You're registered — we'll see you there.
            </StyledText>
          </Stack>
        ) : (
          <StyledForm gap={14} avoidKeyboard={false}>
            {error && (
              <Stack backgroundColor={COLORS.errorLight} borderRadius={8} padding={12}>
                <StyledText fontSize={13} fontWeight="600" color={COLORS.error}>
                  {error}
                </StyledText>
              </Stack>
            )}
            <StyledForm.Input label="Full name" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
            <StyledForm.Input
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
            />
            <StyledForm.Input
              label="Phone (optional)"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
            />
            <StyledForm.Actions>
              <StyledButton primary block loading={isPending} onPress={handleSubmit}>
                <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                  {isPending ? "Registering…" : "Register"}
                </StyledButton.Text>
              </StyledButton>
            </StyledForm.Actions>
          </StyledForm>
        )}
      </Stack>
    </Popup>
  );
}
