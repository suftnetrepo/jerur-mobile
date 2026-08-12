/**
 * Bible reader preferences (currently just font size) — a device-local
 * display setting, not domain data, so it belongs in AsyncStorage
 * following the same typed load/save/clear shape as
 * src/church/selected-church-storage.ts, not SQLite (Notes' SQLite
 * database is for durable user content, not UI preferences).
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "bible-reader-font-size";
const BOOK_LIST_STORAGE_KEY = "bible-book-list-font-size";

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

/** Separate preference from the chapter reader's font size above - this one scales the book list row text on the Bible index screen, not the verse text. */
export async function loadBookListFontSize(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(BOOK_LIST_STORAGE_KEY);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export async function saveBookListFontSize(fontSize: number): Promise<void> {
  await AsyncStorage.setItem(BOOK_LIST_STORAGE_KEY, String(fontSize));
}
