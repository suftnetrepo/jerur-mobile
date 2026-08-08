import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { setActiveMemberToken } from "../api/client";
import { loadMemberSession, saveMemberSession, clearMemberSession } from "./member-session-storage";
import { registerMember, loginMember } from "../api/member";
import type { Member } from "../api/types";

type MemberSessionContextValue = {
  member: Member | null;
  isLoading: boolean;
  register: (payload: { first_name: string; last_name: string; mobile?: string; email?: string; pin: string }) => Promise<void>;
  login: (payload: { identifier: string; pin: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const MemberSessionContext = createContext<MemberSessionContextValue | null>(null);

export function MemberSessionProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMemberSession().then((stored) => {
      setMember(stored?.member ?? null);
      setActiveMemberToken(stored?.token ?? null);
      setIsLoading(false);
    });
  }, []);

  async function register(payload: { first_name: string; last_name: string; mobile?: string; email?: string; pin: string }) {
    await registerMember(payload);
    // Registration doesn't return a session token — log in immediately
    // afterward with the same credentials so the flow feels like one step.
    await login({ identifier: (payload.mobile || payload.email)!, pin: payload.pin });
  }

  async function login(payload: { identifier: string; pin: string }) {
    const { token, member: loggedInMember } = await loginMember(payload);
    await saveMemberSession({ token, member: loggedInMember });
    setActiveMemberToken(token);
    setMember(loggedInMember);
  }

  async function logout() {
    await clearMemberSession();
    setActiveMemberToken(null);
    setMember(null);
  }

  return (
    <MemberSessionContext.Provider value={{ member, isLoading, register, login, logout }}>
      {children}
    </MemberSessionContext.Provider>
  );
}

export function useMemberSession() {
  const ctx = useContext(MemberSessionContext);
  if (!ctx) throw new Error("useMemberSession must be used within a MemberSessionProvider");
  return ctx;
}
