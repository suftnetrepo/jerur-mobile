/**
 * Bible Inspiration reader font size — a device-local display setting,
 * mirrors src/bible/reader-preferences-storage.ts. One key shared across
 * the Inspiration home, all-topics and category-detail screens, so
 * picking a size once applies everywhere verse text is shown.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "inspiration-reader-font-size";

export async function loadReaderFontSize(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export async function saveReaderFontSize(fontSize: number): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, String(fontSize));
}
