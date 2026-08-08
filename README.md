# Church Finder — Mobile

A general-purpose Expo app for finding and following any church on the Jerur platform — think
ChurchTools/Life.Church's own apps, not a Winners-Chapel-specific app. `church-site` (the Next.js
website) stays permanently locked to Winners Chapel Peterborough; this app is the opposite: any
church on Jerur can be found, selected, and switched between.

## Stack

- **Expo Router**
- **axios** — `src/api/client.ts` talks to **Jerur directly**, not through a website proxy. See the
  big comment in that file for why that's safe: `nj-api-key` isn't an account-wide secret, it's a
  per-church identifier Jerur hands back publicly in its own search results.
- **TanStack React Query** — same custom-hooks-wrapping-useQuery/useMutation pattern as before
- **fluent-styles** — same UI package as `premeal-mobile` and the earlier version of this app
- **AsyncStorage** — persists which church is currently selected across app restarts
- **expo-location** — "show churches near me" support

## Setup

```bash
npm install
cp .env.example .env
# edit .env: EXPO_PUBLIC_JERUR_BASE_URL (Jerur's base URL) and
# EXPO_PUBLIC_CHURCH_SITE_URL (your deployed church-site — only used by the
# four Winners-Chapel-specific submission routes, see below)
npx expo start
```

## The core flow — read this before touching anything else

1. **First launch, or no church selected yet** → `app/(select-church)/index.tsx`. Search by name/
   city/postcode (debounced, same pattern as premeal's address search), or tap "Show churches near
   me" to search by radius using the device's GPS. Both hit Jerur's public `/church/search` endpoint
   — no key needed for search itself.
2. Each result includes an `externalId` — an encrypted version of that church's real id. Tapping a
   result calls `selectChurch()` (`src/church/SelectedChurchContext.tsx`), which:
   - persists `{ externalId, name, address, ... }` to AsyncStorage
   - calls `setActiveChurchKey()` so every future request attaches that church's `nj-api-key` header
   - clears the React Query cache (nothing cached under the old church applies to the new one)
3. `app/_layout.tsx`'s `RouteGuard` — same shape as `premeal-mobile`'s onboarding gate, just checking
   "is a church selected" instead of "has onboarded" — forces the user into `(select-church)` if
   nothing's picked yet, and out of it into the main app once something is.
4. Home screen shows the selected church's name at the top with a **Change** control, which clears
   the selection and sends the user back through step 1 with a different church in mind — this is the
   "leads to another search" behavior you described from the ChurchTools/Life.Church references.

## What's real vs. what's deferred (and why)

**Real:** the entire search → select → persist → key-per-request → switch flow above. Every read
screen (Home, Events, Fellowship, Service Times, About) pulls real data for whichever church is
currently selected, through `src/api/church.ts`, which now calls Jerur's actual route paths
(`/church/get`, `/regularService/get`, `/fellowship/get`, `/event/get`, etc.) directly.

**Also real, as of this pass:** member self-service. `app/(app)/account.tsx` handles registration
and PIN-based login against the new `/member/register` and `/member/login` Jerur routes (see the
`jerur-api-patch` delivered separately — this only works once that patch is merged into the backend).
`app/(app)/check-in.tsx` lets a logged-in member submit their own attendance
(`/attendance/submit`), picking a service, a status from the real `Attendance` model's enum, an
optional message, and a "pastor should reach out" flag. The member's session token
(`src/member/member-session-storage.ts`, via `expo-secure-store`) is cleared automatically whenever
the selected church changes — a member registered at one church has no session at another.

**Deferred, on purpose — confirmed with the client, not an oversight:**
- **Contact / Prayer Request / Testimony / WOFBI Registration** still post to `church-site`'s
  Winners-Chapel-specific Brevo email routes. There's no Jerur equivalent for these — `contact/create`
  and `testimony/create` in Jerur require a logged-in **staff** session (`getUserSession`), not a
  public visitor submission. Until Jerur exposes a public submission endpoint keyed by the selected
  church's `email` field, these four screens only make sense for Winners Chapel. **They are not yet
  gated to only show for Winners Chapel** — that's the next thing to do once the plan for these is
  settled, so they don't silently misfire for a different selected church.
- **Attendance / check-in** — UI is built (`app/(app)/check-in.tsx`), calling `/attendance/submit`
  with a member session token. This only works once the `jerur-api-patch` (delivered separately,
  containing `member/register`, `member/login`, `attendance/submit`, and the `Member` model's PIN
  hashing change) is merged into the actual Jerur backend — until then this screen will error on
  submit with a 404/401 depending on what's live.

## Keeping in sync

`src/api/types.ts` mirrors the real Jerur/Church model shapes by hand. If a model changes on the
backend, update this file to match.
