import * as SecureStore from "expo-secure-store";
import type { Member } from "../api/types";

const STORAGE_KEY = "member-session";

type StoredSession = { token: string; member: Member };

export async function loadMemberSession(): Promise<StoredSession | null> {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export async function saveMemberSession(session: StoredSession): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
}

export async function clearMemberSession(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}
