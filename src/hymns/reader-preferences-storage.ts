/**
 * Hymn reader preferences (currently just font size) — a device-local
 * display setting, not domain data, so it belongs in AsyncStorage. Mirrors
 * src/bible/reader-preferences-storage.ts's shape (itself following
 * src/church/selected-church-storage.ts's typed load/save convention) —
 * kept as Hymns' own independent copy rather than a shared abstraction,
 * since the two readers' preferences have no reason to be coupled and a
 * shared module would only save a handful of lines at the cost of an
 * extra indirection.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "hymns-reader-font-size";

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
