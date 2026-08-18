import { useState } from "react";
import { Image } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  StyledButton,
  StyledForm,
  Popup,
  Stack,
} from "fluent-styles";
import { BottomTabBar } from "../../../src/components/BottomTabBar";
import { FeatureGate } from "../../../src/components/FeatureGate";
import { AppBackHeader } from "../../../src/components/AppBackHeader";
import { FormSubmitButton } from "../../../src/components/FormSubmitButton";
import { useEvents } from "../../../src/hooks/useChurchData";
import { useEventRegistration } from "../../../src/hooks/useSubmissions";
import { apiErrorMessage } from "../../../src/api/client";
import { COLORS } from "../../../src/theme/colors";
import { SHADOW_CARD } from "../../../src/theme/shadows";
import type { ChurchEvent } from "../../../src/api/types";

function formatDate(value?: string) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
      <AppBackHeader title="Upcoming Events" />
      <Stack paddingHorizontal={24} paddingTop={8} paddingBottom={12}>
       <Stack
          width={42}
          height={4}
          borderRadius={999}
          backgroundColor={COLORS.gold}
          marginBottom={12}
        />
        <StyledText
          fontSize={24}
          fontWeight="800"
          color={COLORS.ink}
          style={{ marginBottom: 6 }}
        >
          What's coming up
        </StyledText>
        <StyledText fontSize={13.5} color={COLORS.inkSoft}>
          Conferences, prayer nights, and community days — see what's on.
        </StyledText>
      </Stack>

      <StyledScrollView
      showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 24,
          paddingTop: 8,
          paddingBottom: 28,
        }}
      >
        <Stack gap={14}>
          {published.length === 0 && (
            <StyledText
              fontSize={14}
              color={COLORS.inkSoft}
              style={{ textAlign: "center", paddingVertical: 24 }}
            >
              No upcoming events right now — check back soon.
            </StyledText>
          )}
          {published.map((event, i) => {
            const dateRange =
              event.end_date && event.end_date !== event.start_date
                ? `${formatDate(event.start_date)} – ${formatDate(event.end_date)}`
                : formatDate(event.start_date);
            const location = [event.town, event.postcode]
              .filter(Boolean)
              .join(", ");

            return (
              <Stack
                key={event._id ?? i}
                backgroundColor={COLORS.white}
                borderRadius={24}
                overflow="hidden"
                style={SHADOW_CARD}
              >
                {/* Event image — edge-to-edge, rounded top corners via parent overflow */}
                {event.secure_url && (
                  <Image
                    source={{ uri: event.secure_url }}
                    style={{ width: "100%", height: 200 }}
                    resizeMode="cover"
                  />
                )}

                {/* Card body */}
                <Stack padding={20} paddingTop={18} gap={0}>
                  {/* Title */}
                  <StyledText
                    fontSize={20}
                    fontWeight="800"
                    color={COLORS.ink}
                    style={{ marginBottom: 12, lineHeight: 26 }}
                  >
                    {event.title}
                  </StyledText>

                  {/* Date row */}
                  {dateRange && (
                    <Stack
                      horizontal
                      alignItems="center"
                      gap={8}
                      marginBottom={6}
                    >
                      <Stack
                        width={28}
                        height={28}
                        borderRadius={8}
                        backgroundColor={COLORS.goldPale}
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        <Icon
                          name="calendar"
                          size={13}
                          color={COLORS.goldDeep}
                        />
                      </Stack>
                      <StyledText
                        fontSize={13}
                        color={COLORS.inkSoft}
                        style={{ flex: 1 }}
                      >
                        {dateRange}
                      </StyledText>
                    </Stack>
                  )}

                  {/* Location row */}
                  {location && (
                    <Stack
                      horizontal
                      alignItems="center"
                      gap={8}
                      marginBottom={14}
                    >
                      <Stack
                        width={28}
                        height={28}
                        borderRadius={8}
                        backgroundColor={COLORS.goldPale}
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        <Icon
                          name="map-pin"
                          size={13}
                          color={COLORS.goldDeep}
                        />
                      </Stack>
                      <StyledText
                        fontSize={13}
                        color={COLORS.inkSoft}
                        style={{ flex: 1 }}
                      >
                        {location}
                      </StyledText>
                    </Stack>
                  )}

                  {/* Description */}
                  {event.description && (
                    <StyledText
                      fontSize={13.5}
                      color={COLORS.inkSoft}
                      numberOfLines={3}
                      style={{
                        lineHeight: 20,
                        marginBottom: event.can_register ? 18 : 4,
                      }}
                    >
                      {event.description}
                    </StyledText>
                  )}

                  {/* Full-width Register CTA */}
                  {event.can_register && (
                    <StyledButton
                      onPress={() => setRegistering(event)}
                      backgroundColor={COLORS.goldPale}
                      borderWidth={0}
                      borderColor={COLORS.goldSoft}
                      borderRadius={24}
                      paddingVertical={14}
                     
                    >
                      <Stack
                        horizontal
                        alignItems="center"
                        justifyContent="center"
                        gap={8}
                      >
                        <StyledText
                          fontSize={15}
                          fontWeight="700"
                          color={COLORS.ink}
                        >
                          Register
                        </StyledText>
                        <Icon
                          name="arrow-right"
                          size={15}
                          color={COLORS.inkSoft}
                        />
                      </Stack>
                    </StyledButton>
                  )}
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </StyledScrollView>

      {registering && (
        <EventRegisterPopup
          event={registering}
          onClose={() => setRegistering(null)}
        />
      )}

      <BottomTabBar />
    </StyledPage>
  );
}

function EventRegisterPopup({
  event,
  onClose,
}: {
  event: ChurchEvent;
  onClose: () => void;
}) {
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
    <Popup
      visible
      onClose={onClose}
      title="Register"
      subtitle={event.title}
      showClose
      safeAreaBottom
    >
      <Stack padding={20}>
        {success ? (
          <Stack
            backgroundColor={COLORS.sageSoft}
            borderRadius={8}
            padding={14}
          >
            <StyledText fontSize={14} fontWeight="600" color={COLORS.sage}>
              You're registered — we'll see you there.
            </StyledText>
          </Stack>
        ) : (
          <StyledForm gap={14} avoidKeyboard={false}>
            {error && (
              <Stack
                backgroundColor={COLORS.errorLight}
                borderRadius={8}
                padding={12}
              >
                <StyledText fontSize={13} fontWeight="600" color={COLORS.error}>
                  {error}
                </StyledText>
              </Stack>
            )}
            <StyledForm.Input
              label="Full name"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
            />
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
              <FormSubmitButton label="Register" loadingLabel="Registering…" loading={isPending} onPress={handleSubmit} />
            </StyledForm.Actions>
          </StyledForm>
        )}
      </Stack>
    </Popup>
  );
}
