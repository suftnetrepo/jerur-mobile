/**
 * Note domain type.
 *
 * `title` was added in migration #2 (Phase 4) — deliberately optional from
 * the user's perspective: the database column is `NOT NULL DEFAULT ''`
 * (never null), and an empty string means "no title given", not missing
 * data. Screens derive the "Untitled Note" display fallback from an empty
 * title (see src/notes/display.ts's getDisplayTitle()) rather than storing
 * that fallback text — the database always holds what the user actually
 * typed, or nothing.
 *
 * The old Jerur app's Realm-based Note.js rendered a `row.title` that its
 * own schema never defined (dead code reading a field that could never be
 * set — see the migration audit). This is the real, deliberate title field
 * that replaces that.
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  /** ISO-8601 UTC, e.g. "2026-08-10T20:15:00.000Z". Never locale-formatted — formatting is a UI concern (see src/notes/display.ts). */
  createdAt: string;
  /** ISO-8601 UTC. Bumped on content/title changes (updateNote, appendToMarkedNote); NOT bumped by marking/unmarking. */
  updatedAt: string;
  /**
   * Carried over from the old Realm schema (`status: { type: "int", default: 0 }`).
   * The old app never read or wrote a non-zero value anywhere in screens/Note.js
   * or components/hooks/useNote.tsx — its intended meaning was never established
   * upstream, and Phase 4 does not invent one. NOT exposed anywhere in the UI —
   * no Draft/Published/Archived behaviour. Preserved purely for schema parity.
   */
  status: number;
  /** At most one note is ever marked — enforced both by notes-repository.ts (markNote) and a partial unique index (migrations.ts). User-facing wording is "Bible Note", never "marked"/"is_marked". */
  isMarked: boolean;
}

/** Input for creating a note — id/timestamps/status/isMarked are assigned by the repository. Title may be omitted/empty; it is never invented. */
export interface NewNote {
  title?: string;
  content: string;
}

/** Input for updating a note's editable fields. */
export interface NoteEdit {
  title: string;
  content: string;
}
