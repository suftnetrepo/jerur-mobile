/**
 * Bible reader preferences (currently just font size) — a device-local
 * display setting, not domain data, so it belongs in AsyncStorage
 * following the same typed load/save/clear shape as
 * src/church/selected-church-storage.ts, not SQLite (Notes' SQLite
 * database is for durable user content, not UI preferences).
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "bible-reader-font-size";

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
