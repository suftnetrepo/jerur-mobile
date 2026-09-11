import { useQuery } from "@tanstack/react-query";
import { getAttendanceReminder } from "../api/attendance";

export function useAttendanceReminder(enabled: boolean, memberId?: string) {
  return useQuery({
    queryKey: ["attendance-reminder", memberId ?? "guest"],
    queryFn: getAttendanceReminder,
    enabled,
    staleTime: 60_000,
    refetchInterval: enabled ? 60_000 : false,
  });
}
