import { apiClient } from "./client";
import type { Member, MemberLoginResponse } from "./types";

export async function registerMember(payload: {
  first_name: string;
  last_name: string;
  mobile?: string;
  email?: string;
  pin: string;
}): Promise<Member> {
  const { data } = await apiClient.post<{ data: Member; success: boolean }>("/member/register", payload);
  return data.data;
}

export async function loginMember(payload: { identifier: string; pin: string }): Promise<MemberLoginResponse> {
  const { data } = await apiClient.post<{ data: MemberLoginResponse; success: boolean }>("/member/login", payload);
  return data.data;
}
