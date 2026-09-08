import AsyncStorage from "@react-native-async-storage/async-storage";
import { isThemeId, type ThemeId } from "./themes";

const keyForChurch = (churchKey: string) => `member-theme-override:${churchKey}`;

export async function loadThemeOverride(churchKey: string): Promise<ThemeId | null> {
  try {
    const value = await AsyncStorage.getItem(keyForChurch(churchKey));
    if (!value) return null;
    if (isThemeId(value)) return value;
    await AsyncStorage.removeItem(keyForChurch(churchKey));
    return null;
  } catch {
    return null;
  }
}

export async function saveThemeOverride(churchKey: string, themeId: ThemeId | null) {
  try {
    if (themeId) {
      await AsyncStorage.setItem(keyForChurch(churchKey), themeId);
    } else {
      await AsyncStorage.removeItem(keyForChurch(churchKey));
    }
  } catch {
    // The in-memory preference still applies for this session. A storage
    // failure must never make Appearance unusable or crash application boot.
  }
}
