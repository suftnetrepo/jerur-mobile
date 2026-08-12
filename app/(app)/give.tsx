import { useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyledPage, StyledScrollView, StyledText, StyledButton, Popup, Stack } from "fluent-styles";
import Svg, { Path, Circle } from "react-native-svg";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import { FeatureGate } from "../../src/components/FeatureGate";
import { useSettings } from "../../src/hooks/useChurchData";
import { COLORS } from "../../src/theme/colors";
import { SHADOW_CARD } from "../../src/theme/shadows";
import { ScalePressable } from "../../src/components/ScalePressable";

const REFERENCE = "WCI Peterborough";

// ── Accent tones per giving method ──────────────────────────────────────────
const ONLINE_TONE  = { pale: "#FFF3E0", accent: "#F97316" } as const; // orange
const BANK_TONE    = { pale: "#ECFDF5", accent: "#10B981" } as const; // green
const ENV_TONE     = { pale: "#F5F3FF", accent: "#8B5CF6" } as const; // purple

// ── Utility: bank field row ──────────────────────────────────────────────────
function formatSortCode(value?: string) {
  if (!value) return "—";
  return value.replace(/\D/g, "").match(/.{1,2}/g)?.join("-") ?? value;
}
function formatAccountNumber(value?: string) {
  if (!value) return "—";
  return value.replace(/\D/g, "").match(/.{1,4}/g)?.join(" ") ?? value;
}

function BankField({ label, value, copyValue }: { label: string; value: string; copyValue?: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    if (!copyValue) return;
    try {
      const Clipboard = await import("expo-clipboard");
      await Clipboard.setStringAsync(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  }
  return (
    <Stack
      horizontal
      alignItems="center"
      justifyContent="space-between"
      paddingVertical={14}
      style={{ borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
    >
      <Stack gap={3}>
        <StyledText fontSize={10} fontWeight="700" letterSpacing={1} color="#8A90AC">
          {label.toUpperCase()}
        </StyledText>
        <StyledText fontSize={16} fontWeight="600" color={COLORS.white}>
          {value}
        </StyledText>
      </Stack>
      {copyValue && (
        <StyledButton icon compact backgroundColor="rgba(255,255,255,0.08)" onPress={handleCopy}>
          <Icon name={copied ? "check" : "copy"} size={14} color={copied ? COLORS.gold : "#C7CBDA"} />
        </StyledButton>
      )}
    </Stack>
  );
}

// ── Reusable chevron circle (right side of every card) ───────────────────────
function ChevronCircle() {
  return (
    <Stack
      width={36}
      height={36}
      borderRadius={18}
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      style={{ borderWidth: 1, borderColor: COLORS.chromeBorder }}
    >
      <Icon name="chevron-right" size={16} color={COLORS.inkSoft} />
    </Stack>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────
export default function GiveScreen() {
  return (
    <FeatureGate feature="giving">
      <GiveScreenContent />
    </FeatureGate>
  );
}

function GiveScreenContent() {
  const { data: settings } = useSettings();
  const [bankOpen, setBankOpen] = useState(false);

  const bankName    = settings?.bank_name || "World Mission Agency";
  const accountName = settings?.name || "Winners Chapel International";

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
        titleAlignment="center"
        showBackArrow
        onBackPress={() => router.back()}
      />
      <StyledScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 36 }}>
        {/* ── Page header ─────────────────────────────────────────────── */}
        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.gold} style={{ marginBottom: 8 }}>
          GIVING
        </StyledText>
        <StyledText fontSize={26} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Covenant of blessing
        </StyledText>
        <StyledText fontSize={14.5} color={COLORS.inkSoft} style={{ marginBottom: 28, lineHeight: 22 }}>
          When you give your tithe and offering, you unlock kingdom blessings — prepare for divine provision.
        </StyledText>

        {/* ── Giving method cards ─────────────────────────────────────── */}
        <Stack gap={16}>

          {/* Give online */}
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={22}
            padding={18}
            horizontal
            alignItems="center"
            gap={16}
            style={SHADOW_CARD}
          >
            <Stack
              width={68}
              height={68}
              borderRadius={34}
              backgroundColor={ONLINE_TONE.pale}
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Icon name="cloud" size={26} color={ONLINE_TONE.accent} />
            </Stack>
            <Stack flex={1} gap={5}>
              <StyledText fontSize={17} fontWeight="800" color={COLORS.ink}>
                Give online
              </StyledText>
              <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ lineHeight: 20 }}>
                Via the Tithe.ly app or website. It's quick, easy, and secure.
              </StyledText>
            </Stack>
            <ChevronCircle />
          </Stack>

          {/* Bank transfer */}
          <ScalePressable onPress={() => setBankOpen(true)}>
            <Stack
              backgroundColor={COLORS.white}
              borderRadius={22}
              padding={18}
              horizontal
              alignItems="center"
              gap={16}
              style={SHADOW_CARD}
            >
              <Stack
                width={68}
                height={68}
                borderRadius={34}
                backgroundColor={BANK_TONE.pale}
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon name="home" size={26} color={BANK_TONE.accent} />
              </Stack>
              <Stack flex={1} gap={5}>
                <StyledText fontSize={17} fontWeight="800" color={COLORS.ink}>
                  Bank transfer
                </StyledText>
                <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ lineHeight: 20 }}>
                  Give directly from your bank using our account details.
                </StyledText>
                <StyledText fontSize={13} fontWeight="700" color={BANK_TONE.accent} style={{ marginTop: 2 }}>
                  View bank details →
                </StyledText>
              </Stack>
              <ChevronCircle />
            </Stack>
          </ScalePressable>

          {/* Giving envelope */}
          <Stack
            backgroundColor={COLORS.white}
            borderRadius={22}
            padding={18}
            horizontal
            alignItems="center"
            gap={16}
            style={SHADOW_CARD}
          >
            <Stack
              width={68}
              height={68}
              borderRadius={34}
              backgroundColor={ENV_TONE.pale}
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Icon name="mail" size={26} color={ENV_TONE.accent} />
            </Stack>
            <Stack flex={1} gap={5}>
              <StyledText fontSize={17} fontWeight="800" color={COLORS.ink}>
                Use a giving envelope
              </StyledText>
              <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ lineHeight: 20 }}>
                Available during any of our services — you'll find these at the back of the church.
              </StyledText>
            </Stack>
            <ChevronCircle />
          </Stack>
        </Stack>
      </StyledScrollView>

      {/* ── Bank details popup (unchanged) ──────────────────────────────── */}
      <Popup
        visible={bankOpen}
        onClose={() => setBankOpen(false)}
        position="center"
        round
        showClose
        colors={{ background: COLORS.indigo, closeIcon: "#C7CBDA", closeIconBg: "rgba(255,255,255,0.08)" }}
      >
        <Stack padding={22}>
          <Stack
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor="rgba(255,255,255,0.1)"
            alignItems="center"
            justifyContent="center"
            marginBottom={16}
          >
            <Icon name="home" size={22} color={COLORS.gold} />
          </Stack>
          <StyledText fontSize={20} fontWeight="800" color={COLORS.white} style={{ marginBottom: 4 }}>
            Bank transfer
          </StyledText>
          <StyledText fontSize={13} color="#C7CBDA" style={{ marginBottom: 8 }}>
            Use the details below to give directly from your bank.
          </StyledText>
          <BankField label="Bank name" value={bankName} />
          <BankField label="Account name" value={accountName} />
          <BankField label="Sort code" value={formatSortCode(settings?.sort_code)} copyValue={settings?.sort_code} />
          <BankField label="Account number" value={formatAccountNumber(settings?.account_number)} copyValue={settings?.account_number} />
          <BankField label="Reference" value={REFERENCE} copyValue={REFERENCE} />
        </Stack>
      </Popup>

      <BottomTabBar active="give" />
    </StyledPage>
  );
}
