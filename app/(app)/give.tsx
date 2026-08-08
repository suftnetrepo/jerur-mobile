import { useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledCard, StyledButton, Popup, Stack } from "fluent-styles";
import { BottomTabBar } from "../../src/components/BottomTabBar";
import { FeatureGate } from "../../src/components/FeatureGate";
import { useSettings } from "../../src/hooks/useChurchData";
import { COLORS } from "../../src/theme/colors";

const REFERENCE = "WCI Peterborough";

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
      // Lazy-required rather than imported at the top of the file: if the
      // native module isn't linked (e.g. Expo Go needs an update, or the
      // dev client needs a rebuild after this dependency was added), this
      // fails silently on tap instead of crashing the whole screen at
      // import time — which is what a top-level `import * as Clipboard`
      // would do.
      const Clipboard = await import("expo-clipboard");
      await Clipboard.setStringAsync(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable — the value is still visible on screen to copy manually.
    }
  }
  return (
    <Stack horizontal alignItems="center" justifyContent="space-between" paddingVertical={14} style={{ borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
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

  const bankName = settings?.bank_name || "World Mission Agency";
  const accountName = settings?.name || "Winners Chapel International";

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 28 }}>
        <StyledText fontSize={11} fontWeight="700" letterSpacing={1} color={COLORS.gold} style={{ marginBottom: 8 }}>
          GIVING
        </StyledText>
        <StyledText fontSize={26} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Covenant of blessing
        </StyledText>
        <StyledText fontSize={14.5} color={COLORS.inkSoft} style={{ marginBottom: 24, lineHeight: 21 }}>
          When you give your tithe and offering, you unlock kingdom blessings — prepare for divine provision.
        </StyledText>

        <Stack gap={14}>
          <StyledCard shadow="light" padding={18} borderRadius={14}>
            <IconBadge icon="cloud" />
            <StyledText fontSize={16} fontWeight="700" color={COLORS.ink} style={{ marginTop: 12, marginBottom: 4 }}>
              Give online
            </StyledText>
            <StyledText fontSize={13.5} color={COLORS.inkSoft}>
              Via the Tithe.ly app or website. It's quick, easy, and secure.
            </StyledText>
          </StyledCard>

          <StyledCard shadow="light" padding={18} borderRadius={14} pressable pressableProps={{ onPress: () => setBankOpen(true) }}>
            <IconBadge icon="home" />
            <StyledText fontSize={16} fontWeight="700" color={COLORS.ink} style={{ marginTop: 12, marginBottom: 4 }}>
              Bank transfer
            </StyledText>
            <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 10 }}>
              Give directly from your bank using our account details.
            </StyledText>
            <StyledText fontSize={13} fontWeight="700" color={COLORS.goldDeep}>
              View bank details →
            </StyledText>
          </StyledCard>

          <StyledCard shadow="light" padding={18} borderRadius={14}>
            <IconBadge icon="mail" />
            <StyledText fontSize={16} fontWeight="700" color={COLORS.ink} style={{ marginTop: 12, marginBottom: 4 }}>
              Use a giving envelope
            </StyledText>
            <StyledText fontSize={13.5} color={COLORS.inkSoft}>
              Available during any of our services — you'll find these at the back of the church.
            </StyledText>
          </StyledCard>
        </Stack>
      </StyledScrollView>

      <Popup
        visible={bankOpen}
        onClose={() => setBankOpen(false)}
        position="center"
        round
        showClose
        colors={{ background: COLORS.indigo, closeIcon: "#C7CBDA", closeIconBg: "rgba(255,255,255,0.08)" }}
      >
        <Stack padding={22}>
          <Stack width={48} height={48} borderRadius={24} backgroundColor="rgba(255,255,255,0.1)" alignItems="center" justifyContent="center" marginBottom={16}>
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

function IconBadge({ icon }: { icon: string }) {
  return (
    <Stack width={40} height={40} borderRadius={20} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center">
      <Icon name={icon as any} size={18} color={COLORS.goldDeep} />
    </Stack>
  );
}
