import { useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyledPage,
  StyledScrollView,
  StyledForm,
  StyledTextInput,
  StyledPressable,
  Stack,
  useToast,
  useNotification,
  useDialogue,
  type StyledTextInputHandle,
} from "fluent-styles";
import { Text } from "../../src/components/text";
import { useMemberSession } from "../../src/member/MemberSessionContext";
import { AppBackHeader } from "../../src/components/AppBackHeader";
import { FormSubmitButton } from "../../src/components/FormSubmitButton";
import { AccountSkeleton } from "../../src/components/skeleton";
import { useFeatureFlags } from "../../src/hooks/useFeatureFlags";
import { apiErrorMessage, apiErrorCode } from "../../src/api/client";
import { Platform } from "react-native";
import { COLORS , isDarkTheme } from "../../src/theme/colors";
import { SHADOW_SOFT } from "../../src/theme/shadows";

export default function AccountScreen() {
  const { member, isLoading, logout, deleteAccount } = useMemberSession();
  const params = useLocalSearchParams<{
    returnTo?: string;
    serviceId?: string;
    title?: string;
    startTime?: string;
    endTime?: string;
    days?: string;
  }>();

  function continueAfterAuthentication() {
    if (params.returnTo === "check-in" && params.serviceId) {
      router.replace({
        pathname: "/check-in",
        params: {
          serviceId: params.serviceId,
          title: params.title ?? "",
          startTime: params.startTime ?? "",
          endTime: params.endTime ?? "",
          days: params.days ?? "[]",
        },
      });
      return;
    }
    router.back();
  }

  return (
    <StyledPage flex={1} backgroundColor={COLORS.paper} statusBarStyle={isDarkTheme ? "light-content" : "dark-content"} statusBarBackgroundColor={Platform.OS === "android" ? COLORS.paper : undefined}>
      <AppBackHeader title="Account" />
      <StyledScrollView contentContainerStyle={{  paddingTop: 10, paddingBottom: 60  }}>
        {isLoading ? (
          <AccountSkeleton />
        ) : (
          <>
         <Stack
          width={42}
          height={4}
          borderRadius={999}
          backgroundColor={COLORS.gold}
          paddingHorizontal={24}
          marginHorizontal={24}
        />
        <Stack backgroundColor={COLORS.paper} paddingHorizontal={24} paddingTop={16} paddingBottom={member ? 44 : 68}>
          <Stack width={46} height={46} borderRadius={23} backgroundColor={COLORS.paperAlt} alignItems="center" justifyContent="center" marginBottom={18}>
            <Icon name={member ? "user-check" : "lock"} size={21} color={COLORS.ink} />
          </Stack>
          <Text variant="header" fontSize={27} fontWeight="800" color={COLORS.ink} style={{ marginBottom: 7 }}>
            {member ? "Your membership" : "Welcome "}
          </Text>
          <Text variant="body" fontSize={13.5} color={COLORS.inkSoft} style={{ lineHeight: 21 }}>
            {member ? "Your church profile, all in one place." : "Sign in to take part, stay connected and keep your details secure."}
          </Text>
        </Stack>
        <Stack marginHorizontal={20} marginTop={-28} backgroundColor={COLORS.paper} borderRadius={24} padding={22} style={[SHADOW_SOFT, { borderWidth: 1, borderColor: COLORS.paperAlt }]}>
          {member ? (
            <LoggedInView member={member} onLogout={logout} onDeleteAccount={deleteAccount} />
          ) : (
            <AuthForms onAuthenticated={continueAfterAuthentication} />
          )}
        </Stack>
          </>
        )}
      </StyledScrollView>
    </StyledPage>
  );
}

function LoggedInView({
  member,
  onLogout,
  onDeleteAccount,
}: {
  member: NonNullable<ReturnType<typeof useMemberSession>["member"]>;
  onLogout: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}) {
  const { hasFeature } = useFeatureFlags();
  const dialogue = useDialogue();
  const toast = useToast();
  const isProvisional = member.status === "provisional";
  const [deleting, setDeleting] = useState(false);

  // Two confirmations deep before anything destructive happens, and a
  // `deleting` guard covering the whole flow (not just the API call) so a
  // repeated tap while either dialogue is still open — or the request is
  // in flight — can never queue a second delete.
  async function handleDeleteProfile() {
    if (deleting) return;
    setDeleting(true);
    try {
      const firstConfirmed = await dialogue.confirm({
        title: "Delete your profile?",
        message: "This will permanently delete your membership profile and account details. This action cannot be undone.",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        destructive: true,
      });
      if (!firstConfirmed) return;

      const finalConfirmed = await dialogue.confirm({
        title: "Are you sure?",
        message: "Your profile will be permanently removed. You will need to create a new account if you want to use member features again.",
        confirmLabel: "Delete",
        cancelLabel: "Keep",
        destructive: true,
      });
      if (!finalConfirmed) return;

      // Only ever calls the API after the final destructive confirmation.
      await onDeleteAccount();
      toast.success("Your profile has been deleted.");
    } catch (err) {
      // Failure leaves the session untouched — onDeleteAccount() only
      // clears it after the API call actually succeeds.
      toast.error(apiErrorMessage(err, "We couldn't delete your profile. Please try again."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Stack alignItems="center">
      <Stack
        width={84}
        height={84}
        borderRadius={42}
        backgroundColor={COLORS.paperAlt}
        alignItems="center"
        justifyContent="center"
        marginBottom={12}
        style={{ borderWidth: 3, borderColor: COLORS.paperWarm }}
      >
        <Text fontSize={26} fontWeight="800" color={COLORS.ink}>
          {member.first_name[0]}
          {member.last_name[0]}
        </Text>
      </Stack>
      <Text
        variant="title"
        fontWeight="800"
        color={COLORS.ink}
        style={{ textAlign: "center", marginBottom: isProvisional ? 8 : 24 }}
      >
        {member.first_name} {member.last_name}
      </Text>
      {isProvisional && (
        <Stack backgroundColor={COLORS.goldPale} borderRadius={999} paddingHorizontal={13} paddingVertical={6} marginBottom={24}>
          <Text variant="button" fontSize={12} color={COLORS.goldDeep}>
            Pending confirmation by church staff
          </Text>
        </Stack>
      )}
      {hasFeature("attendance") && (
        <StyledPressable
          onPress={() => router.push("/service-times")}
          accessibilityRole="button"
          accessibilityLabel="Submit attendance"
          style={{ width: "100%", marginBottom: 12 }}
        >
          <Stack
            horizontal
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="rgba(94,112,82,0.07)"
            borderRadius={14}
            paddingHorizontal={14}
            minHeight={56}
          >
            <Stack horizontal alignItems="center" gap={12}>
              <Stack width={35} height={35} borderRadius={17.5} backgroundColor={COLORS.sageSoft} alignItems="center" justifyContent="center">
                <Icon name="check-circle" size={16} color={COLORS.sage} />
              </Stack>
              <Text variant="button" fontSize={14.5} color={COLORS.ink}>
                Submit attendance
              </Text>
            </Stack>
            <Icon name="chevron-right" size={16} color={COLORS.inkSoft} />
          </Stack>
        </StyledPressable>
      )}
      <StyledPressable
        onPress={onLogout}
        accessibilityRole="button"
        accessibilityLabel="Log out"
        style={{ width: "100%" }}
      >
        <Stack
          horizontal
          alignItems="center"
          justifyContent="center"
          gap={8}
          height={48}
          borderRadius={14}
          backgroundColor={COLORS.errorLight}
        >
          <Icon name="log-out" size={16} color={COLORS.error} />
          <Text variant="button" color={COLORS.error}>
            Log out
          </Text>
        </Stack>
      </StyledPressable>

      {/* Deliberately quieter than Log out — plain text/icon, no
          background — so it reads as a rare, careful action rather than
          competing with Submit attendance or Log out above it. */}
      <StyledPressable
        onPress={handleDeleteProfile}
        disabled={deleting}
        accessibilityRole="button"
        accessibilityLabel="Delete profile"
        accessibilityState={{ disabled: deleting, busy: deleting }}
        style={{ marginTop: 18, opacity: deleting ? 0.5 : 1 }}
      >
        <Stack horizontal alignItems="center" justifyContent="center" gap={6} paddingVertical={6}>
          <Icon name="trash-2" size={13} color={COLORS.error} />
          <Text variant="button" fontSize={12.5} fontWeight="600" color={COLORS.error}>
            {deleting ? "Deleting…" : "Delete profile"}
          </Text>
        </Stack>
      </StyledPressable>
    </Stack>
  );
}

type LoginField = "identifier" | "pin";
type RegisterField = "first_name" | "last_name" | "mobile" | "email" | "pin";
type ForgotField = "identifier" | "pin";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9()+\-\s]{7,20}$/;
const PIN_PATTERN = /^\d{4,6}$/;

function AuthForms({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { register, login, forgotPin } = useMemberSession();
  const toast = useToast();
  const notification = useNotification();

  // "forgot" isn't a tab alongside login/register — it's only ever reached
  // via the "Forgot PIN?" link inside login mode (see below), with its own
  // "Back to log in" way out, same idea as a typical login screen's
  // forgot-password sub-flow.
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ identifier: "", pin: "" });
  const [loginErrors, setLoginErrors] = useState<Partial<Record<LoginField, string>>>({});

  const [registerForm, setRegisterForm] = useState({ first_name: "", last_name: "", mobile: "", email: "", pin: "" });
  const [registerErrors, setRegisterErrors] = useState<Partial<Record<RegisterField, string>>>({});

  const [forgotForm, setForgotForm] = useState({ identifier: "", pin: "" });
  const [forgotErrors, setForgotErrors] = useState<Partial<Record<ForgotField, string>>>({});

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
  const forgotIdentifierRef = useRef<StyledTextInputHandle>(null);
  const forgotPinRef = useRef<StyledTextInputHandle>(null);

  function switchMode(next: "login" | "register" | "forgot") {
    setMode(next);
    setLoginErrors({});
    setRegisterErrors({});
    setForgotErrors({});
  }

  function clearLoginError(field: LoginField) {
    setLoginErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  function clearRegisterError(field: RegisterField) {
    setRegisterErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  function clearForgotError(field: ForgotField) {
    setForgotErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
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

  function validateForgot(): { field: ForgotField; message: string } | null {
    if (!forgotForm.identifier.trim()) return { field: "identifier", message: "Enter your phone or email." };
    if (!PIN_PATTERN.test(forgotForm.pin.trim())) return { field: "pin", message: "New PIN must contain 4–6 digits." };
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
      onAuthenticated();
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
      onAuthenticated();
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

  async function handleForgotPin() {
    const invalid = validateForgot();
    if (invalid) {
      setForgotErrors({ [invalid.field]: invalid.message });
      toast.error(invalid.message);
      (invalid.field === "identifier" ? forgotIdentifierRef : forgotPinRef).current?.focus();
      return;
    }
    setForgotErrors({});
    setLoading(true);
    try {
      await forgotPin(forgotForm);
      toast.success("PIN updated. You're logged in.");
      onAuthenticated();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't reset your PIN. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  if (mode === "forgot") {
    return (
      <Stack>
        <StyledPressable
          onPress={() => {
            switchMode("login");
            setForgotForm({ identifier: "", pin: "" });
          }}
          accessibilityRole="button"
          accessibilityLabel="Back to log in"
          style={{ marginBottom: 18, alignSelf: "flex-start" }}
        >
          <Stack horizontal alignItems="center" gap={6}>
            <Icon name="chevron-left" size={16} color={COLORS.inkSoft} />
            <Text variant="button" fontSize={13.5} color={COLORS.inkSoft}>
              Back to log in
            </Text>
          </Stack>
        </StyledPressable>

        <Text variant="title" fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
          Reset your PIN
        </Text>
        <Text variant="body" fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 22 }}>
          Enter the phone or email on your account and choose a new PIN — no need to remember the old one.
        </Text>

        <StyledForm gap={16} avoidKeyboard={false}>
          <StyledTextInput
            ref={forgotIdentifierRef}
            label="Phone or email"
            autoCapitalize="none"
            value={forgotForm.identifier}
            onChangeText={(v) => {
              setForgotForm((f) => ({ ...f, identifier: v }));
              clearForgotError("identifier");
            }}
            error={!!forgotErrors.identifier}
            errorMessage={forgotErrors.identifier}
          />
          <StyledTextInput
            ref={forgotPinRef}
            label="New PIN (4–6 digits)"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            value={forgotForm.pin}
            onChangeText={(v) => {
              setForgotForm((f) => ({ ...f, pin: v }));
              clearForgotError("pin");
            }}
            error={!!forgotErrors.pin}
            errorMessage={forgotErrors.pin}
          />
          <StyledForm.Actions>
            <FormSubmitButton label="Reset PIN" loadingLabel="Resetting…" loading={loading} onPress={handleForgotPin} />
          </StyledForm.Actions>
        </StyledForm>
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack
        horizontal
        backgroundColor={COLORS.paperAlt}
        borderRadius={50}
        padding={4}
        marginBottom={22}
        style={{ borderWidth: 1, borderColor: COLORS.paperAlt }}
      >
        {(["login", "register"] as const).map((item) => {
          const active = mode === item;
          return (
            <StyledPressable
              key={item}
              onPress={() => switchMode(item)}
              flex={1}
              alignItems="center"
              paddingVertical={10}
              borderRadius={50}
              backgroundColor={active ? COLORS.white : "transparent"}
              style={active ? { borderWidth: 1, borderColor: COLORS.white } : undefined}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text variant="label" fontSize={13} fontWeight={active ? "800" : "600"} color={active ? COLORS.ink : COLORS.inkSoft}>
                {item === "login" ? "Log in" : "Create account"}
              </Text>
            </StyledPressable>
          );
        })}
      </Stack>

      <Text variant="title" fontWeight="800" color={COLORS.ink} style={{ marginBottom: 6 }}>
        {mode === "login" ? "Welcome back" : "Create your account"}
      </Text>
      <Text variant="body" fontSize={13.5} color={COLORS.inkSoft} style={{ marginBottom: 22 }}>
        {mode === "login"
          ? "Log in to submit attendance and more."
          : "Set a PIN — you'll use it to log in next time, no password to remember."}
      </Text>

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
          <StyledPressable
            onPress={() => {
              setForgotForm((f) => ({ ...f, identifier: loginForm.identifier }));
              switchMode("forgot");
            }}
            accessibilityRole="button"
            accessibilityLabel="Forgot PIN?"
            style={{ alignSelf: "flex-end", marginTop: -8 }}
          >
            <Text variant="button" fontSize={13} color={COLORS.ink}>
              Forgot PIN?
            </Text>
          </StyledPressable>
          <StyledForm.Actions>
            <FormSubmitButton label="Log in" loadingLabel="Logging in…" loading={loading} onPress={handleLogin} />
          </StyledForm.Actions>
        </StyledForm>
      ) : (
        <StyledForm gap={16} avoidKeyboard={false}>
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
              returnKeyType="next"
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
                returnKeyType="next"
            />
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
              returnKeyType="next"
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
              returnKeyType="next"
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
              returnKeyType="done"
          />
          <StyledForm.Actions>
            <FormSubmitButton label="Create account" loadingLabel="Creating account…" loading={loading} onPress={handleRegister} />
          </StyledForm.Actions>
        </StyledForm>
      )}

    </Stack>
  );
}
