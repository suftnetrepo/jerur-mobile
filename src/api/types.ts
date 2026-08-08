// Kept in sync by hand with church-site/types/church.ts — same backend,
// same shapes. If one changes, update the other.

// A church as returned by GET /church/search — the public discovery
// endpoint. externalId is an encrypted version of the church's real id;
// it's what gets sent back as the "nj-api-key" header on every subsequent
// request once this church is selected. Everything else here is whatever
// fields the Church model exposes — trimmed to what the search UI needs.
export type ChurchSearchResult = {
  _id?: string;
  externalId: string;
  name: string;
  email?: string;
  mobile?: string;
  description?: string;
  // The church's official banner/primary image (jerur-next
  // app/models/church.js: top-level `secure_url`/`public_id`, uploaded via
  // the admin's "About Us" form — see updateBulk in churchService.js). The
  // single source of truth for the church's image everywhere on the
  // platform, this search card included - see ChurchResultCard. Empty
  // string (the schema default), not absent, when a church hasn't
  // uploaded one.
  secure_url?: string;
  public_id?: string;
  // GET /church/search returns the full, unfiltered Church document
  // (searchChurches/searchChurchesWithinRadius in
  // jerur-next/app/services/churchService.js do a plain `Church.find()`,
  // no `.select()`), so fields like these ride along on every search
  // result already, not just on the already-selected church's own
  // ChurchSettings.
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  // One denomination per church (not a list), admin-selected from a fixed
  // list on Settings -> About Us — see jerur-next's
  // constants/denominations.js / app/models/church.js. This is the stable
  // `id` (e.g. "pentecostal"), never the display label — look it up
  // against src/config/denominations.ts's DENOMINATIONS (getDenominationLabel
  // in src/hooks/useDenominations.ts) to show it as text. Phase 1: type-only
  // prep so this rides along on search results already; no filter UI yet.
  // '' (the schema default) on churches that haven't set one.
  denomination?: string;
  address?: {
    addressLine1?: string;
    town?: string;
    postcode?: string;
    completeAddress?: string;
    // Actually nested under `address` on the Church model (matches the
    // `'address.location': '2dsphere'` index in church.js) — not top-level
    // as this type previously had it, which meant Route always silently
    // fell through to the address-text fallback below instead of ever
    // using real coordinates.
    location?: { type: "Point"; coordinates: [number, number] };
  };
};

export type Member = {
  _id: string;
  first_name: string;
  last_name: string;
  status: "active" | "provisional" | "inactive" | "under discipline";
  role: "member" | "volunteer" | "leader" | "pastor";
};

export type MemberLoginResponse = {
  token: string;
  member: Member;
};

export type AttendanceStatus =
  | "PRESENT_IN_CHURCH"
  | "JOINED_ONLINE"
  | "ABSENT"
  | "SICK"
  | "TRAVELLING"
  | "WORKING"
  | "FAMILY_COMMITMENT"
  | "NEEDS_PRAYER"
  | "OTHER";

export type Slider = {
  _id?: string;
  title: string;
  message: string;
  status: boolean;
  imageOnly: boolean;
  secure_url: string;
  public_id?: string;
};

export type ChurchContact = {
  _id?: string;
  title: string;
  first_name: string;
  last_name: string;
  phone?: string;
  status?: boolean;
};

// Church.notification (see jerur-next app/models/church.js) — a single
// admin-authored announcement per church, not a list. `isExpired` is
// computed server-side (buildNotificationResponse in churchService.js) at
// request time; the mobile app recomputes its own display decision from
// `expiry_date` anyway rather than trusting a value that could go stale
// between fetch and render — see ChurchNotificationCard.tsx.
export type ChurchNotification = {
  title: string;
  message: string;
  expiry_date: string | null;
  isExpired: boolean;
};

export type ChurchSettings = {
  name: string;
  mobile: string;
  email?: string;
  currency?: string;
  bank_name?: string;
  sort_code?: string;
  account_number?: string;
  // The church's official banner/primary image - same field, same meaning
  // as ChurchSearchResult.secure_url/public_id above. Was previously
  // missing here even though GET /church/search already returned it,
  // because jerur-next's getChurch() (backing GET /church/get, which is
  // what populates this type) had an explicit field whitelist that didn't
  // include it - now fixed on the backend.
  secure_url?: string;
  public_id?: string;
  address?: {
    addressLine1?: string;
    town?: string;
    postcode?: string;
    completeAddress?: string;
  };
  sliders: Slider[];
  pastor_section?: {
    title?: string;
    description: string;
    first_name: string;
    last_name: string;
    public_id?: string;
    secure_url?: string;
  };
  contacts?: ChurchContact[];
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  // Same field as ChurchSearchResult.denomination above — see that
  // comment. Included here too now that jerur-next's getChurch() select
  // whitelist (backing GET /church/get) includes it.
  denomination?: string;
  // IDs of the mobile features this church has enabled — see
  // src/config/mobileFeatures.ts and src/hooks/useFeatureFlags.ts. Absent
  // or empty on churches that have never saved Settings -> Mobile Features
  // in the admin portal (church/models/church.js has no schema default).
  features?: string[];
  notification?: ChurchNotification;
};

export type RegularService = {
  _id?: string;
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
  remote?: boolean;
  remote_link?: string;
};

export type FellowshipGroup = {
  _id?: string;
  name: string;
  addressLine1?: string;
  completeAddress?: string;
  town?: string;
  county?: string;
  country?: string;
  postcode?: string;
  mobile?: string;
  status?: boolean;
  location?: { type: "Point"; coordinates: [number, number] };
};

export type ChurchEvent = {
  _id?: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  secure_url?: string;
  public_id?: string;
  addressLine1?: string;
  completeAddress?: string;
  town?: string;
  county?: string;
  country?: string;
  postcode?: string;
  status?: boolean;
  can_register?: boolean;
  location?: { type: "Point"; coordinates: [number, number] };
};
