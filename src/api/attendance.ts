import { apiClient } from "./client";
import type { AttendanceStatus } from "./types";

export type AttendanceReminder = {
  showReminder: boolean;
  serviceId?: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  days?: number[];
  state?: "UPCOMING" | "LIVE" | "ENDING_SOON";
  eyebrow?: string;
  message?: string;
  actionLabel?: string;
};

export async function getAttendanceReminder(): Promise<AttendanceReminder> {
  const { data } = await apiClient.get("/attendance/reminder");
  return data.data;
}

export type HouseholdAttendance = {
  adults: { male: number; female: number };
  youth: { male: number; female: number };
  children: { male: number; female: number };
};

export async function submitAttendance(payload: {
  serviceId: string;
  memberId: string;
  status: AttendanceStatus;
  message?: string;
  checkedInVia?: "QR_CODE" | "MANUAL" | "ONLINE";
  wantsPastorContact?: boolean;
  household?: HouseholdAttendance;
}) {
  // Authorization header (member token) is attached automatically by the
  // apiClient interceptor — see setActiveMemberToken() in client.ts.
  const { data } = await apiClient.post("/attendance/create/mobile", payload);
  return data;
}
