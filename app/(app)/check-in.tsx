import { useRef, useState } from "react";
import { Dimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledForm, StyledButton, StyledPressable, Stack, useToast } from "fluent-styles";
import { FeatureGate } from "../../src/components/FeatureGate";
import { useMemberSession } from "../../src/member/MemberSessionContext";
import { submitAttendance } from "../../src/api/attendance";
import { apiErrorMessage } from "../../src/api/client";
import { SHADOW_SOFT } from "../../src/theme/shadows";
import { COLORS } from "../../src/theme/colors";
import type { AttendanceStatus } from "../../src/api/types";

// Primary selection accent — matches the mock's bright indigo/violet.
const ACCENT = "#5B6CF9";

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; icon: string; iconColor: string }[] = [
  { value: "PRESENT_IN_CHURCH", label: "I'm in church",      icon: "home",           iconColor: ACCENT },
  { value: "JOINED_ONLINE",     label: "Joining online",    icon: "wifi",           iconColor: ACCENT },
  { value: "TRAVELLING",        label: "Travelling",        icon: "map",            iconColor: "#22A06B" },
  { value: "WORKING",           label: "Working",           icon: "briefcase",      iconColor: "#F59E0B" },
  { value: "SICK",              label: "Sick",              icon: "thermometer",    iconColor: "#EF4444" },
  { value: "FAMILY_COMMITMENT", label: "Family commitment", icon: "users",          iconColor: "#0EA5E9" },
  { value: "NEEDS_PRAYER",      label: "I need prayer",     icon: "heart",          iconColor: "#EC4899" },
  { value: "ABSENT",            label: "Won't make it",     icon: "x-circle",       iconColor: "#9CA3AF" },
  { value: "OTHER",             label: "Other",             icon: "more-horizontal", iconColor: "#9CA3AF" },
];

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// "Today" only when the service's own recurrence (ServiceTime.days, 0=Sun..
// 6=Sat) actually includes today — never assumed just because a card says
// "Sunday Service". Falls back to naming the day instead of guessing.
function formatServiceDayLabel(days: number[]): string | null {
  if (!days.length) return null;
  const todayIndex = new Date().getDay();
  if (days.includes(todayIndex)) return "Today";
  return WEEKDAY_NAMES[days[0]] ?? null;
}

const SCREEN_PAD = 20;
const CHIP_GAP = 10;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHIP_WIDTH = (SCREEN_WIDTH - SCREEN_PAD * 2 - CHIP_GAP) / 2;

export default function CheckInScreen() {
  return (
    <FeatureGate feature="attendance">
      <CheckInScreenContent />
    </FeatureGate>
  );
}

function CheckInScreenContent() {
  const { member } = useMemberSession();
  const params = useLocalSearchParams<{ serviceId?: string; title?: string; startTime?: string; endTime?: string; days?: string }>();
  const toast = useToast();

  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Belt-and-braces against a double-tap landing before `disabled` visually
  // takes effect — checked synchronously at the top of handleSubmit, not
  // just relied on via the button's own state.
  const submittingRef = useRef(false);

  const memberId = member?._id;

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

  // The service is only ever known via nav params from Service Times (see
  // service-times.tsx's handleSubmitAttendance) — this screen never lists
  // services itself. A missing serviceId means this route was opened some
  // other way (stale link, manual URL); send them to pick one properly
  // rather than rendering a form with nothing to submit against.
  if (!params.serviceId) {
    return (
      <StyledPage flex={1} backgroundColor={COLORS.paper}>
        <StyledPage.Header title="Submit attendance" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
        <Stack flex={1} alignItems="center" justifyContent="center" padding={24} gap={16}>
          <StyledText fontSize={14.5} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
            Choose a service from Service Times to submit your attendance.
          </StyledText>
          <StyledButton primary onPress={() => router.replace("/service-times")}>
            <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
              Go to Service times
            </StyledButton.Text>
          </StyledButton>
        </Stack>
      </StyledPage>
    );
  }

  const serviceId = params.serviceId;
  const serviceTitle = params.title || "Service";
  let serviceDays: number[] = [];
  try {
    serviceDays = params.days ? JSON.parse(params.days) : [];
  } catch {
    serviceDays = [];
  }
  const dayLabel = formatServiceDayLabel(serviceDays);
  const timeRange = [params.startTime, params.endTime].filter(Boolean).join(" – ");
  const summaryLine = [dayLabel, timeRange].filter(Boolean).join(" · ");

  async function handleSubmit() {
    if (submittingRef.current) return;
    if (!status) {
      toast.error("Choose how you're joining.");
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await submitAttendance({ serviceId, memberId: memberId!, status, message: message.trim() || undefined, checkedInVia: "ONLINE" });
      toast.success("Attendance submitted successfully.");
      // Back to wherever this came from — always Service Times now that
      // attendance only ever starts there.
      router.back();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't submit attendance. Please try again."));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header title="Submit attendance" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: SCREEN_PAD, paddingBottom: 60 }}>
        {/* Service summary — informational only, never selectable. The
            service is already decided; this just confirms which one. */}
        <Stack
          horizontal
          alignItems="center"
          gap={12}
          backgroundColor={COLORS.white}
          borderRadius={14}
          borderLeftWidth={4}
          borderLeftColor={ACCENT}
          padding={16}
          marginBottom={28}
          style={SHADOW_SOFT}
        >
          <Stack width={44} height={44} borderRadius={22} backgroundColor="#EEEFFE" alignItems="center" justifyContent="center">
            <Icon name="calendar" size={20} color={ACCENT} />
          </Stack>
          <Stack style={{ flex: 1 }}>
            <StyledText fontSize={15} fontWeight="800" color={COLORS.ink}>
              {serviceTitle}
            </StyledText>
            {summaryLine ? (
              <Stack horizontal alignItems="center" gap={4} style={{ marginTop: 2, flexWrap: "wrap" }}>
                <Icon name="calendar" size={11} color={COLORS.inkSoft} />
                <StyledText fontSize={12.5} color={COLORS.inkSoft}>{dayLabel ?? ""}</StyledText>
                {dayLabel && timeRange ? (
                  <StyledText fontSize={12.5} color={COLORS.inkSoft}> · </StyledText>
                ) : null}
                {timeRange ? (
                  <>
                    <Icon name="clock" size={11} color={COLORS.inkSoft} />
                    <StyledText fontSize={12.5} color={COLORS.inkSoft}> {timeRange}</StyledText>
                  </>
                ) : null}
              </Stack>
            ) : null}
          </Stack>
        </Stack>

        <StyledText fontSize={17} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 4 }}>
          How are you joining today?
        </StyledText>
        <StyledText fontSize={13} color={COLORS.inkSoft} style={{ marginBottom: 18 }}>
          Choose one option.
        </StyledText>
        <Stack style={{ flexDirection: "row", flexWrap: "wrap", gap: CHIP_GAP, marginBottom: 8 }}>
          {STATUS_OPTIONS.map((option) => {
            const selected = status === option.value;
            return (
              <StyledPressable
                key={option.value}
                onPress={() => setStatus(option.value)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={option.label}
                style={{
                  width: CHIP_WIDTH,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                  borderRadius: 14,
                  backgroundColor: selected ? "rgba(91,108,249,0.07)" : COLORS.white,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? ACCENT : COLORS.chromeBorder,
                }}
              >
                {/* Bare coloured icon — no circle badge */}
                <Icon
                  name={option.icon as any}
                  size={20}
                  color={selected ? ACCENT : option.iconColor}
                />
                {/* Label */}
                <StyledText
                  fontSize={13}
                  fontWeight={selected ? "700" : "500"}
                  color={selected ? ACCENT : COLORS.ink}
                  numberOfLines={2}
                  style={{ flex: 1, lineHeight: 17 }}
                >
                  {option.label}
                </StyledText>
                {/* Check badge */}
                {selected && (
                  <Stack
                    width={22}
                    height={22}
                    borderRadius={11}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={ACCENT}
                  >
                    <Icon name="check" size={12} color={COLORS.white} />
                  </Stack>
                )}
              </StyledPressable>
            );
          })}
        </Stack>

        {status === "NEEDS_PRAYER" && (
          <Stack horizontal alignItems="center" gap={8} marginTop={10} marginBottom={4}>
            <Icon name="heart" size={13} color={COLORS.sage} />
            <StyledText fontSize={12.5} color={COLORS.inkSoft} style={{ flex: 1 }}>
              We'll let the pastoral team know you'd like prayer.
            </StyledText>
          </Stack>
        )}

        <Stack marginTop={26}>
          <StyledForm gap={16} avoidKeyboard={false}>
            <StyledForm.Input
              label="Anything you'd like to share? (optional)"
              helperText="Add a prayer request or note for the pastoral team."
              placeholder="A prayer need, a note for the pastoral team…"
              multiline
              showCounter
              maxLength={300}
              style={{ minHeight: 100 }}
              value={message}
              onChangeText={setMessage}
            />
            <StyledForm.Actions>
              <StyledButton
                primary
                block
                loading={submitting}
                disabled={submitting}
                onPress={handleSubmit}
                leftIcon={<Icon name="send" size={16} color={COLORS.white} />}
                backgroundColor={ACCENT}
              >
                <StyledButton.Text color={COLORS.white} fontWeight="700">
                  {submitting ? "Submitting…" : "Submit attendance"}
                </StyledButton.Text>
              </StyledButton>
            </StyledForm.Actions>
          </StyledForm>
        </Stack>

        {/* Privacy reassurance */}
        <Stack horizontal alignItems="center" justifyContent="center" gap={6} marginTop={20}>
          <Icon name="lock" size={12} color={COLORS.inkSoft} />
          <StyledText fontSize={12} color={COLORS.inkSoft} style={{ textAlign: "center" }}>
            Your information is private and is only shared with the pastoral team.
          </StyledText>
        </Stack>
      </StyledScrollView>
    </StyledPage>
  );
}
