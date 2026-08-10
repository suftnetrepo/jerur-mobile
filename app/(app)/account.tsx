import { useRef, useState } from "react";
import { router } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledText,
  StyledForm,
  StyledButton,
  StyledCard,
  StyledTextInput,
  Stack,
  useToast,
  useNotification,
  type StyledTextInputHandle,
} from "fluent-styles";
import { useMemberSession } from "../../src/member/MemberSessionContext";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import { apiErrorMessage, apiErrorCode } from "../../src/api/client";
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
          pressableProps={{ onPress: () => router.push("/service-times") }}
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

type LoginField = "identifier" | "pin";
type RegisterField = "first_name" | "last_name" | "mobile" | "email" | "pin";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9()+\-\s]{7,20}$/;
const PIN_PATTERN = /^\d{4,6}$/;

function AuthForms() {
  const { register, login } = useMemberSession();
  const toast = useToast();
  const notification = useNotification();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ identifier: "", pin: "" });
  const [loginErrors, setLoginErrors] = useState<Partial<Record<LoginField, string>>>({});

  const [registerForm, setRegisterForm] = useState({ first_name: "", last_name: "", mobile: "", email: "", pin: "" });
  const [registerErrors, setRegisterErrors] = useState<Partial<Record<RegisterField, string>>>({});

  // Imperative refs purely so a failed validation can call .focus() on the
  // exact field that failed — StyledForm.Input doesn't forward refs (its
  // type declares no ref support), so these fields use StyledTextInput
  // directly instead (what StyledForm.Input renders under the hood anyway,
  // same props, same look) rather than losing focus-management entirely.
  const identifierRef = useRef<StyledTextInputHandle>(null);
  const loginPinRef = useRef<StyledTextInputHandle>(null);
  const firstNameRef = useRef<StyledTextInputHandle>(null);
  const lastNameRef = useRef<StyledTextInputHandle>(null);
  const mobileRef = useRef<StyledTextInputHandle>(null);
  const emailRef = useRef<StyledTextInputHandle>(null);
  const pinRef = useRef<StyledTextInputHandle>(null);

  function switchMode(next: "login" | "register") {
    setMode(next);
    setLoginErrors({});
    setRegisterErrors({});
  }

  function clearLoginError(field: LoginField) {
    setLoginErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  function clearRegisterError(field: RegisterField) {
    setRegisterErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  function validateLogin(): { field: LoginField; message: string } | null {
    if (!loginForm.identifier.trim()) return { field: "identifier", message: "Enter your phone or email." };
    if (!loginForm.pin.trim()) return { field: "pin", message: "Enter your PIN." };
    return null;
  }

  // Checked in the same top-to-bottom order the fields appear on screen,
  // so "first invalid field" always means what it looks like it means.
  function validateRegister(): { field: RegisterField; message: string } | null {
    const f = registerForm;
    if (!f.first_name.trim()) return { field: "first_name", message: "Enter your first name." };
    if (!f.last_name.trim()) return { field: "last_name", message: "Enter your last name." };
    if (f.mobile.trim() && !PHONE_PATTERN.test(f.mobile.trim())) return { field: "mobile", message: "Phone number is invalid." };
    if (f.email.trim() && !EMAIL_PATTERN.test(f.email.trim())) return { field: "email", message: "Enter a valid email address." };
    if (!f.mobile.trim() && !f.email.trim()) return { field: "mobile", message: "Enter your phone or email." };
    if (!PIN_PATTERN.test(f.pin.trim())) return { field: "pin", message: "PIN must contain 4–6 digits." };
    return null;
  }

  async function handleLogin() {
    const invalid = validateLogin();
    if (invalid) {
      setLoginErrors({ [invalid.field]: invalid.message });
      toast.error(invalid.message);
      (invalid.field === "identifier" ? identifierRef : loginPinRef).current?.focus();
      return;
    }
    setLoginErrors({});
    setLoading(true);
    try {
      await login(loginForm);
      router.back();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    const invalid = validateRegister();
    if (invalid) {
      setRegisterErrors({ [invalid.field]: invalid.message });
      toast.error(invalid.message);
      const refs = { first_name: firstNameRef, last_name: lastNameRef, mobile: mobileRef, email: emailRef, pin: pinRef };
      refs[invalid.field].current?.focus();
      return;
    }
    setRegisterErrors({});
    setLoading(true);
    try {
      await register(registerForm);
      toast.success("Account created successfully.");
      // register() already logs the new member straight in — this just
      // continues whichever flow was already implemented for that (Home).
      router.back();
    } catch (err) {
      const code = apiErrorCode(err);
      if (code === "EMAIL_EXISTS" || code === "MOBILE_EXISTS") {
        const isEmail = code === "EMAIL_EXISTS";
        notification.show({
          title: isEmail ? "An account already exists with this email." : "An account already exists with this phone number.",
          body: isEmail ? "Sign in instead or use a different email address." : "Sign in instead or use a different phone number.",
          initials: "!",
          actionLabel: "Log in",
          onAction: () => {
            switchMode("login");
            setLoginForm((f) => ({ ...f, identifier: isEmail ? registerForm.email.trim() : registerForm.mobile.trim() }));
          },
          theme: "light",
        });
      } else {
        toast.error(apiErrorMessage(err, "Registration failed. Please try again."));
      }
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

      {mode === "login" ? (
        <StyledForm gap={16} avoidKeyboard={false}>
          <StyledTextInput
            ref={identifierRef}
            label="Phone or email"
            autoCapitalize="none"
            value={loginForm.identifier}
            onChangeText={(v) => {
              setLoginForm((f) => ({ ...f, identifier: v }));
              clearLoginError("identifier");
            }}
            error={!!loginErrors.identifier}
            errorMessage={loginErrors.identifier}
          />
          <StyledTextInput
            ref={loginPinRef}
            label="PIN"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            value={loginForm.pin}
            onChangeText={(v) => {
              setLoginForm((f) => ({ ...f, pin: v }));
              clearLoginError("pin");
            }}
            error={!!loginErrors.pin}
            errorMessage={loginErrors.pin}
          />
          <StyledForm.Actions>
            <StyledButton primary block loading={loading} disabled={loading} onPress={handleLogin}>
              <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                {loading ? "Logging in…" : "Log in"}
              </StyledButton.Text>
            </StyledButton>
          </StyledForm.Actions>
        </StyledForm>
      ) : (
        <StyledForm gap={16} avoidKeyboard={false}>
          <StyledForm.Row gap={12}>
            <StyledTextInput
              ref={firstNameRef}
              label="First name"
              value={registerForm.first_name}
              onChangeText={(v) => {
                setRegisterForm((f) => ({ ...f, first_name: v }));
                clearRegisterError("first_name");
              }}
              error={!!registerErrors.first_name}
              errorMessage={registerErrors.first_name}
              style={{ flex: 1 }}
            />
            <StyledTextInput
              ref={lastNameRef}
              label="Last name"
              value={registerForm.last_name}
              onChangeText={(v) => {
                setRegisterForm((f) => ({ ...f, last_name: v }));
                clearRegisterError("last_name");
              }}
              error={!!registerErrors.last_name}
              errorMessage={registerErrors.last_name}
              style={{ flex: 1 }}
            />
          </StyledForm.Row>
          <StyledTextInput
            ref={mobileRef}
            label="Phone"
            keyboardType="phone-pad"
            value={registerForm.mobile}
            onChangeText={(v) => {
              setRegisterForm((f) => ({ ...f, mobile: v }));
              clearRegisterError("mobile");
            }}
            error={!!registerErrors.mobile}
            errorMessage={registerErrors.mobile}
          />
          <StyledTextInput
            ref={emailRef}
            label="Email (optional if phone provided)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={registerForm.email}
            onChangeText={(v) => {
              setRegisterForm((f) => ({ ...f, email: v }));
              clearRegisterError("email");
            }}
            error={!!registerErrors.email}
            errorMessage={registerErrors.email}
          />
          <StyledTextInput
            ref={pinRef}
            label="Choose a PIN (4–6 digits)"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            value={registerForm.pin}
            onChangeText={(v) => {
              setRegisterForm((f) => ({ ...f, pin: v }));
              clearRegisterError("pin");
            }}
            error={!!registerErrors.pin}
            errorMessage={registerErrors.pin}
          />
          <StyledForm.Actions>
            <StyledButton primary block loading={loading} disabled={loading} onPress={handleRegister}>
              <StyledButton.Text color={COLORS.indigoDeep} fontWeight="700">
                {loading ? "Creating account…" : "Create account"}
              </StyledButton.Text>
            </StyledButton>
          </StyledForm.Actions>
        </StyledForm>
      )}

      <StyledButton link block onPress={() => switchMode(mode === "login" ? "register" : "login")} style={{ marginTop: 16 }}>
        <StyledButton.Text color={COLORS.goldDeep} fontWeight="600">
          {mode === "login" ? "New here? Create an account" : "Already registered? Log in"}
        </StyledButton.Text>
      </StyledButton>
    </Stack>
  );
}
