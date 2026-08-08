import { useState } from "react";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import { StyledPage, StyledScrollView, StyledText, StyledForm, StyledButton, StyledCard, Stack } from "fluent-styles";
import { useMemberSession } from "../../src/member/MemberSessionContext";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import { apiErrorMessage } from "../../src/api/client";
import { COLORS } from "../../src/theme/colors";

export default function AccountScreen() {
  const { member, logout } = useMemberSession();

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper}>
      <StyledPage.Header title="Account" titleAlignment="center" showBackArrow onBackPress={() => router.back()} />
      <StyledScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        {member ? <LoggedInView member={member} onLogout={logout} /> : <AuthForms />}
      </StyledScrollView>
    </StyledPage>
  );
}

function LoggedInView({ member, onLogout }: { member: NonNullable<ReturnType<typeof useMemberSession>["member"]>; onLogout: () => Promise<void> }) {
  const { hasFeature } = useFeatureFlags();

  return (
    <Stack alignItems="center" paddingTop={20}>
      <Stack width={72} height={72} borderRadius={36} backgroundColor={COLORS.goldPale} alignItems="center" justifyContent="center" marginBottom={16}>
        <StyledText fontSize={24} fontWeight="800" color={COLORS.goldDeep}>
          {member.first_name[0]}
          {member.last_name[0]}
        </StyledText>
      </Stack>
      <StyledText fontSize={19} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 4 }}>
        {member.first_name} {member.last_name}
      </StyledText>
      {member.status === "provisional" && (
        <Stack backgroundColor={COLORS.goldPale} borderRadius={6} paddingHorizontal={10} paddingVertical={4} marginBottom={20}>
          <StyledText fontSize={11.5} fontWeight="700" color={COLORS.goldDeep}>
            Pending confirmation by church staff
          </StyledText>
        </Stack>
      )}
      {hasFeature("attendance") && (
        <StyledCard
          shadow="light"
          padding={16}
          borderRadius={12}
          pressable
          pressableProps={{ onPress: () => router.push("/check-in") }}
          style={{ width: "100%", marginTop: 8, marginBottom: 12 }}
        >
          <Stack horizontal alignItems="center" justifyContent="space-between">
            <Stack horizontal alignItems="center" gap={12}>
              <Icon name="check-circle" size={18} color={COLORS.sage} />
              <StyledText fontSize={14.5} fontWeight="700" color={COLORS.ink}>
                Submit attendance
              </StyledText>
            </Stack>
            <Icon name="chevron-right" size={16} color={COLORS.inkSoft} />
          </Stack>
        </StyledCard>
      )}
      <StyledButton outline block onPress={onLogout}>
        <StyledButton.Text color={COLORS.error}>Log out</StyledButton.Text>
      </StyledButton>
    </Stack>
  );
}

function AuthForms() {
  const { register, login } = useMemberSession();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({ identifier: "", pin: "" });
  const [registerForm, setRegisterForm] = useState({ first_name: "", last_name: "", mobile: "", email: "", pin: "" });

  async function handleLogin() {
    setError(null);
    if (!loginForm.identifier || !loginForm.pin) {
      setError("Enter your phone/email and PIN.");
      return;
    }
    setLoading(true);
    try {
      await login(loginForm);
      router.back();
    } catch (err) {
      setError(apiErrorMessage(err, "Login failed."));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    setError(null);
    if (!registerForm.first_name || !registerForm.last_name || !registerForm.pin) {
      setError("First name, last name, and PIN are required.");
      return;
    }
    if (!registerForm.mobile && !registerForm.email) {
      setError("Enter your phone or email.");
      return;
    }
    if (!/^\d{4,6}$/.test(registerForm.pin)) {
      setError("PIN must be 4 to 6 digits.");
      return;
    }
    setLoading(true);
    try {
      await register(registerForm);
      router.back();
    } catch (err) {
      setError(apiErrorMessage(err, "Registration failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack>
      <StyledText fontSize={20} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
        {mode === "login" ? "Welcome back" : "Create your account"}
      </StyledText>
      <StyledText fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 22 }}>
        {mode === "login"
          ? "Log in to submit attendance and more."
          : "Set a PIN — you'll use it to log in next time, no password to remember."}
      </StyledText>

      {error && (
        <Stack backgroundColor={COLORS.errorLight} borderRadius={8} padding={14} marginBottom={16}>
          <StyledText fontSize={13.5} fontWeight="600" color={COLORS.error}>
            {error}
          </StyledText>
        </Stack>
      )}

      {mode === "login" ? (
        <StyledForm gap={16} avoidKeyboard={false}>
          <StyledForm.Input
            label="Phone or email"
            autoCapitalize="none"
            value={loginForm.identifier}
            onChangeText={(v) => setLoginForm((f) => ({ ...f, identifier: v }))}
          />
          <StyledForm.Input
            label="PIN"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            value={loginForm.pin}
            onChangeText={(v) => setLoginForm((f) => ({ ...f, pin: v }))}
          />
          <StyledForm.Actions>
            <StyledButton primary block loading={loading} onPress={handleLogin}>
              <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                {loading ? "Logging in…" : "Log in"}
              </StyledButton.Text>
            </StyledButton>
          </StyledForm.Actions>
        </StyledForm>
      ) : (
        <StyledForm gap={16} avoidKeyboard={false}>
          <StyledForm.Row gap={12}>
            <StyledForm.Input label="First name" value={registerForm.first_name} onChangeText={(v) => setRegisterForm((f) => ({ ...f, first_name: v }))} style={{ flex: 1 }} />
            <StyledForm.Input label="Last name" value={registerForm.last_name} onChangeText={(v) => setRegisterForm((f) => ({ ...f, last_name: v }))} style={{ flex: 1 }} />
          </StyledForm.Row>
          <StyledForm.Input
            label="Phone"
            keyboardType="phone-pad"
            value={registerForm.mobile}
            onChangeText={(v) => setRegisterForm((f) => ({ ...f, mobile: v }))}
          />
          <StyledForm.Input
            label="Email (optional if phone provided)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={registerForm.email}
            onChangeText={(v) => setRegisterForm((f) => ({ ...f, email: v }))}
          />
          <StyledForm.Input
            label="Choose a PIN (4–6 digits)"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            value={registerForm.pin}
            onChangeText={(v) => setRegisterForm((f) => ({ ...f, pin: v }))}
          />
          <StyledForm.Actions>
            <StyledButton primary block loading={loading} onPress={handleRegister}>
              <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                {loading ? "Creating account…" : "Create account"}
              </StyledButton.Text>
            </StyledButton>
          </StyledForm.Actions>
        </StyledForm>
      )}

      <StyledButton
        text
        block
        onPress={() => {
          setError(null);
          setMode(mode === "login" ? "register" : "login");
        }}
        style={{ marginTop: 16 }}
      >
        <StyledButton.Text color={COLORS.goldDeep} fontWeight="600">
          {mode === "login" ? "New here? Create an account" : "Already registered? Log in"}
        </StyledButton.Text>
      </StyledButton>
    </Stack>
  );
}
