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
// apiClient. Path and payload match Jerur's addEventRegister(body); the
// exact required fields weren't fully confirmed from the route handler
// alone, so double-check against Jerur's validation if registrations start
// failing silently.
export async function registerForEvent(payload: { event_id: string; name: string; email: string; phone?: string }) {
  await apiClient.post("/event/register", payload);
}
