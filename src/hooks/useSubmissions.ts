import { useMutation } from "@tanstack/react-query";
import * as submissionsApi from "../api/submissions";

export function useContactSubmission() {
  return useMutation({ mutationFn: submissionsApi.submitContact });
}

export function usePrayerRequestSubmission() {
  return useMutation({ mutationFn: submissionsApi.submitPrayerRequest });
}

export function useTestimonySubmission() {
  return useMutation({ mutationFn: submissionsApi.submitTestimony });
}

export function useEventRegistration() {
  return useMutation({ mutationFn: submissionsApi.registerForEvent });
}

export function useWofbiRegistration() {
  return useMutation({ mutationFn: submissionsApi.registerForWofbi });
}
