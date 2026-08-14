import { Linking } from "react-native";

export const DEFAULT_CHURCH_EMAIL =
  "WinnersChapel.InternationalPeterborough@winners-chapel.org.uk";

type EmailField = { label: string; value?: string | null };

export async function openChurchEmailDraft({
  recipient,
  subject,
  heading,
  fields,
}: {
  recipient?: string | null;
  subject: string;
  heading: string;
  fields: EmailField[];
}) {
  const to = recipient?.trim() || DEFAULT_CHURCH_EMAIL;
  const details = fields
    .filter((field) => field.value?.trim())
    .flatMap((field) => [field.label.toUpperCase(), field.value!.trim(), ""]);
  const body = [
    "Hello Church Team,",
    "",
    heading,
    "",
    "────────────────────────",
    "",
    ...details,
    "────────────────────────",
    "",
    "Prepared in the Winners Chapel mobile app.",
  ].join("\n");
  const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const supported = await Linking.canOpenURL(url);
  if (!supported) throw new Error("No email app is available on this device.");
  await Linking.openURL(url);
}
