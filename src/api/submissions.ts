import { apiClient } from "./client";
import { churchSiteClient } from "./churchSiteClient";

type SubmissionPayload = {
  first_name: string;
  last_name: string;
  email: string;
  message: string;
};

// These four are Winners-Chapel-specific (church-site's own Brevo email
// routes) — see README "What's deferred" for why there's no general Jerur
// equivalent yet. They deliberately use churchSiteClient, not the Jerur
// apiClient, even though everything else in this file now talks to Jerur.

export async function submitContact(payload: SubmissionPayload) {
  await churchSiteClient.post("/email/contact-us", payload);
}

export async function submitPrayerRequest(payload: SubmissionPayload) {
  await churchSiteClient.post("/email/prayer-request", payload);
}

export async function submitTestimony(payload: SubmissionPayload) {
  await churchSiteClient.post("/email/testimony", payload);
}

export async function registerForWofbi(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  campus: string;
}) {
  await churchSiteClient.post("/email/wofbi-registration", payload);
}

// Event registration IS a real Jerur feature (api/event/register, no auth
// required) — unlike the four above, this one correctly stays on the Jerur
// apiClient. Confirmed against eventRegisterServices.js's addEventRegister():
// it reads `body.eventId` (camelCase, matching the rest of Jerur's API —
// serviceId, memberId, churchId, etc.) — NOT `event_id`. Sending event_id
// meant Event.findOneAndUpdate({ _id: body.eventId }) always got undefined,
// so every registration failed regardless of what was entered — this is
// what Apple's review caught as "an error message was displayed when we
// entered any email for registration".
export async function registerForEvent(payload: { eventId: string; name: string; email: string; phone?: string }) {
  await apiClient.post("/event/register", payload);
}
