import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ChurchSearchResult } from "../api/types";

const STORAGE_KEY = "selected-church";

export async function loadSelectedChurch(): Promise<ChurchSearchResult | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChurchSearchResult) : null;
  } catch {
    return null;
  }
}

export async function saveSelectedChurch(church: ChurchSearchResult): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(church));
}

export async function clearSelectedChurch(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
