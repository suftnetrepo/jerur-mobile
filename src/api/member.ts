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

// Permanently deletes the logged-in member's own record. Authorization
// header (member token) is attached automatically by the apiClient
// interceptor — see setActiveMemberToken() in client.ts — and the backend
// requires it to match `id` (a member may only ever delete themselves).
export async function deleteMember(id: string): Promise<void> {
  await apiClient.delete("/member/delete", { params: { id } });
}
