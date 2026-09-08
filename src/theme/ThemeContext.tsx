import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { useSettings } from "../hooks/useChurchData";
import { useSelectedChurch } from "../church/SelectedChurchContext";
import { applyThemeColors, COLORS } from "./colors";
import { DEFAULT_THEME_ID, resolveThemeId, THEMES, type AppColors, type ThemeId } from "./themes";
import { loadThemeOverride, saveThemeOverride } from "./theme-storage";

type ThemeContextValue = {
  colors: AppColors;
  activeThemeId: ThemeId;
  churchThemeId: ThemeId;
  memberThemeId: ThemeId | null;
  isLoading: boolean;
  setMemberTheme: (themeId: ThemeId | null) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { church, isLoading: churchLoading } = useSelectedChurch();
  const settings = useSettings();
  const churchKey = church?.externalId ?? "";
  const [memberThemeId, setMemberThemeId] = useState<ThemeId | null>(null);
  const [loadedChurchKey, setLoadedChurchKey] = useState("");
  const [appliedThemeId, setAppliedThemeId] = useState<ThemeId>(DEFAULT_THEME_ID);

  const churchThemeId = resolveThemeId(settings.data?.theme_id ?? church?.theme_id);
  const resolvedThemeId = memberThemeId ?? churchThemeId;

  useEffect(() => {
    let current = true;
    if (!churchKey) {
      setMemberThemeId(null);
      setLoadedChurchKey("");
      return () => { current = false; };
    }

    loadThemeOverride(churchKey).then((savedTheme) => {
      if (!current) return;
      setMemberThemeId(savedTheme);
      setLoadedChurchKey(churchKey);
    });

    return () => { current = false; };
  }, [churchKey]);

  useLayoutEffect(() => {
    applyThemeColors(resolvedThemeId);
    setAppliedThemeId(resolvedThemeId);
  }, [resolvedThemeId]);

  const setMemberTheme = useCallback(async (themeId: ThemeId | null) => {
    if (!churchKey) return;
    setMemberThemeId(themeId);
    await saveThemeOverride(churchKey, themeId);
  }, [churchKey]);

  const value = useMemo<ThemeContextValue>(() => ({
    colors: COLORS,
    activeThemeId: appliedThemeId,
    churchThemeId,
    memberThemeId,
    isLoading: churchLoading
      || Boolean(churchKey && loadedChurchKey !== churchKey)
      || Boolean(churchKey && settings.isLoading),
    setMemberTheme,
  }), [appliedThemeId, churchKey, churchLoading, churchThemeId, loadedChurchKey, memberThemeId, setMemberTheme, settings.isLoading]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useMobileTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useMobileTheme must be used within ThemeProvider");
  return context;
}

export function useColors(): AppColors {
  return useMobileTheme().colors;
}

export function getThemeLabel(themeId: ThemeId) {
  return THEMES[themeId].label;
}
