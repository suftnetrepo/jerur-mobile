import { useState } from "react";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledCard, StyledForm, StyledButton, Stack } from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { useRegularServices } from "../../src/hooks/useChurchData";
import { useMemberSession } from "../../src/member/MemberSessionContext";
import { submitAttendance } from "../../src/api/attendance";
import { apiErrorMessage } from "../../src/api/client";
import { COLORS } from "../../src/theme/colors";
import type { AttendanceStatus } from "../../src/api/types";

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; icon: string }[] = [
  { value: "PRESENT_IN_CHURCH", label: "I'm in church", icon: "home" },
  { value: "JOINED_ONLINE", label: "Joining online", icon: "wifi" },
  { value: "TRAVELLING", label: "Travelling", icon: "map" },
  { value: "WORKING", label: "Working", icon: "briefcase" },
  { value: "SICK", label: "Sick", icon: "thermometer" },
  { value: "FAMILY_COMMITMENT", label: "Family commitment", icon: "users" },
  { value: "NEEDS_PRAYER", label: "I need prayer", icon: "heart" },
  { value: "ABSENT", label: "Won't make it", icon: "x-circle" },
  { value: "OTHER", label: "Other", icon: "more-horizontal" },
];

export default function CheckInScreen() {
  return (
    <FeatureGate feature="attendance">
      <CheckInScreenContent />
    </FeatureGate>
  );
}

function CheckInScreenContent() {
  const { member } = useMemberSession();
  const { data: services } = useRegularServices();

  const [serviceId, setServiceId] = useState<string | null>(null);
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [message, setMessage] = useState("");
  const [wantsPastorContact, setWantsPastorContact] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!member) {
    return (
      <StyledPage flex={1} backgroundColor={COLORS.paper}>
        <StyledPage.Header title="Submit attendance" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
        <Stack flex={1} alignItems="center" justifyContent="center" padding={24}>
          <StyledText fontSize={14.5} color={COLORS.inkSoft} style={{ textAlign: "center", marginBottom: 16 }}>
            Log in to submit your attendance.
          </StyledText>
          <StyledButton primary onPress={() => router.push("/account")}>
            <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
              Go to account
            </StyledButton.Text>
          </StyledButton>
        </Stack>
      </StyledPage>
    );
  }

  async function handleSubmit() {
    setError(null);
    if (!serviceId || !status) {
      setError("Choose a service and how you're joining.");
      return;
    }
    setSubmitting(true);
    try {
      await submitAttendance({ serviceId, status, message: message || undefined, wantsPastorContact, checkedInVia: "ONLINE" });
      setSuccess(true);
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't submit attendance. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <StyledPage flex={1} backgroundColor={COLORS.paper}>
        <StyledPage.Header title="Submit attendance" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
        <Stack flex={1} alignItems="center" justifyContent="center" padding={24}>
          <Stack width={56} height={56} borderRadius={28} backgroundColor={COLORS.sageSoft} alignItems="center" justifyContent="center" marginBottom={16}>
            <Icon name="check" size={24} color={COLORS.sage} />
          </Stack>
          <StyledText fontSize={18} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6, textAlign: "center" }}>
            You're checked in
          </StyledText>
          <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
            Thanks for letting us know.
          </StyledText>
        </Stack>
      </StyledPage>
    );
  }

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header title="Submit attendance" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <StyledText fontSize={13} fontWeight="700" color={COLORS.inkSoft} style={{ marginBottom: 10 }}>
          WHICH SERVICE
        </StyledText>
        <Stack gap={8} marginBottom={26}>
          {(!services || services.length === 0) && (
            <StyledText fontSize={13.5} color={COLORS.inkSoft}>
              No services available right now.
            </StyledText>
          )}
          {services?.map((service) => (
            <StyledCard
              key={service._id}
              shadow="light"
              padding={14}
              borderRadius={10}
              pressable
              pressableProps={{ onPress: () => setServiceId(service._id ?? null) }}
              style={serviceId === service._id ? { borderWidth: 2, borderColor: COLORS.gold } : undefined}
            >
              <Stack horizontal alignItems="center" justifyContent="space-between">
                <Stack>
                  <StyledText fontSize={14} fontWeight="700" color={COLORS.ink}>
                    {service.title}
                  </StyledText>
                  <StyledText fontSize={12.5} color={COLORS.inkSoft}>
                    {service.start_time} – {service.end_time}
                  </StyledText>
                </Stack>
                {serviceId === service._id && <Icon name="check-circle" size={18} color={COLORS.gold} />}
              </Stack>
            </StyledCard>
          ))}
        </Stack>

        <StyledText fontSize={13} fontWeight="700" color={COLORS.inkSoft} style={{ marginBottom: 10 }}>
          HOW ARE YOU JOINING
        </StyledText>
        <Stack horizontal flexWrap="wrap" gap={8} marginBottom={26}>
          {STATUS_OPTIONS.map((option) => (
            <StyledCard
              key={option.value}
              shadow="light"
              padding={12}
              borderRadius={10}
              pressable
              pressableProps={{ onPress: () => setStatus(option.value) }}
              style={{
                width: "47%",
                ...(status === option.value ? { borderWidth: 2, borderColor: COLORS.gold } : {}),
              }}
            >
              <Stack horizontal alignItems="center" gap={8}>
                <Icon name={option.icon as any} size={15} color={status === option.value ? COLORS.goldDeep : COLORS.inkSoft} />
                <StyledText fontSize={12.5} fontWeight="600" color={COLORS.ink}>
                  {option.label}
                </StyledText>
              </Stack>
            </StyledCard>
          ))}
        </Stack>

        {error && (
          <Stack backgroundColor={COLORS.errorLight} borderRadius={8} padding={14} marginBottom={16}>
            <StyledText fontSize={13.5} fontWeight="600" color={COLORS.error}>
              {error}
            </StyledText>
          </Stack>
        )}

        <StyledForm gap={16} avoidKeyboard={false}>
          <StyledForm.Input
            label="Anything you'd like to share (optional)"
            placeholder="A prayer need, a note for the pastoral team…"
            multiline
            style={{ minHeight: 90 }}
            value={message}
            onChangeText={setMessage}
          />
          <StyledCard
            shadow="light"
            padding={14}
            borderRadius={10}
            pressable
            pressableProps={{ onPress: () => setWantsPastorContact((v) => !v) }}
          >
            <Stack horizontal alignItems="center" justifyContent="space-between">
              <StyledText fontSize={13.5} fontWeight="600" color={COLORS.ink} style={{ flex: 1 }}>
                I'd like a pastor to reach out to me
              </StyledText>
              <Icon name={wantsPastorContact ? "check-square" : "square"} size={19} color={wantsPastorContact ? COLORS.gold : COLORS.inkSoft} />
            </Stack>
          </StyledCard>
          <StyledForm.Actions>
            <StyledButton primary block loading={submitting} onPress={handleSubmit}>
              <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                {submitting ? "Submitting…" : "Submit attendance"}
              </StyledButton.Text>
            </StyledButton>
          </StyledForm.Actions>
        </StyledForm>
      </StyledScrollView>
    </StyledPage>
  );
}
