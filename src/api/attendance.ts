import { apiClient } from "./client";
import type { AttendanceStatus } from "./types";

export async function submitAttendance(payload: {
  serviceId: string;
  status: AttendanceStatus;
  message?: string;
  checkedInVia?: "QR_CODE" | "MANUAL" | "ONLINE";
  wantsPastorContact?: boolean;
}) {
  // Authorization header (member token) is attached automatically by the
  // apiClient interceptor — see setActiveMemberToken() in client.ts.
  const { data } = await apiClient.post("/attendance/submit", payload);
  return data;
}
