import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setActiveChurchKey, setActiveMemberToken } from "../api/client";
import { loadSelectedChurch, saveSelectedChurch, clearSelectedChurch } from "./selected-church-storage";
import { clearMemberSession } from "../member/member-session-storage";
import type { ChurchSearchResult } from "../api/types";

type SelectedChurchContextValue = {
  church: ChurchSearchResult | null;
  isLoading: boolean;
  selectChurch: (church: ChurchSearchResult) => Promise<void>;
  changeChurch: () => Promise<void>;
};

const SelectedChurchContext = createContext<SelectedChurchContextValue | null>(null);

export function SelectedChurchProvider({ children }: { children: ReactNode }) {
  const [church, setChurch] = useState<ChurchSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadSelectedChurch().then((stored) => {
      setChurch(stored);
      setActiveChurchKey(stored?.externalId ?? null);
      setIsLoading(false);
    });
  }, []);

  async function selectChurch(next: ChurchSearchResult) {
    await saveSelectedChurch(next);
    setActiveChurchKey(next.externalId);
    setChurch(next);
    // A member record — and their session token — belongs to whichever
    // church they registered/logged in with. Switching churches means
    // that member session no longer applies.
    await clearMemberSession();
    setActiveMemberToken(null);
    // Every cached read (settings, events, fellowship, etc.) belonged to
    // whichever church was previously selected — none of it applies to the
    // new one, so it must be thrown away rather than shown stale.
    queryClient.clear();
  }

  async function changeChurch() {
    await clearSelectedChurch();
    setActiveChurchKey(null);
    setChurch(null);
    await clearMemberSession();
    setActiveMemberToken(null);
    queryClient.clear();
  }

  return (
    <SelectedChurchContext.Provider value={{ church, isLoading, selectChurch, changeChurch }}>
      {children}
    </SelectedChurchContext.Provider>
  );
}

export function useSelectedChurch() {
  const ctx = useContext(SelectedChurchContext);
  if (!ctx) throw new Error("useSelectedChurch must be used within a SelectedChurchProvider");
  return ctx;
}
