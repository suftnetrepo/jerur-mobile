/**
 * The "marked note" — the old app's screens/Note.js let a user bookmark
 * exactly one note (stored as the AsyncStorage key "MARK_NOTE" via
 * store/single-store.js), so that long-pressing a Bible verse in
 * screens/Verse.js could append that verse's text to it.
 *
 * Now that Notes live in SQLite, the mark is a column on the notes table
 * (`is_marked`) instead of a disconnected AsyncStorage key — see
 * migrations.ts. This file is the domain API for that behaviour; it does
 * not introduce a second storage mechanism.
 *
 * NOT wired into any Bible UI yet — Phase 1 only builds the capability
 * (per the migration plan, Bible screens are Phase 2+, and the verse
 * long-press → append interaction is explicitly out of scope until then).
 */
import { getDatabase } from "./database";
import { getNoteById, toNote, type NoteRow } from "./notes-repository";
import type { Note } from "./types";

/**
 * Marks exactly one note, clearing any previous mark first. Runs as a
 * single transaction so there is never a moment — even under concurrent
 * calls — where zero or more than one note is marked. A partial unique
 * index on `notes(is_marked) WHERE is_marked = 1` (migrations.ts) also
 * enforces this at the database level as a second line of defence.
 *
 * Throws if `id` doesn't match an existing note (and rolls back — no
 * note ends up unmarked as a side effect of a bad id).
 */
export async function markNote(id: string): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    await db.runAsync(`UPDATE notes SET is_marked = 0 WHERE is_marked = 1`);
    const result = await db.runAsync(`UPDATE notes SET is_marked = 1 WHERE id = ?`, [id]);
    if (result.changes === 0) {
      throw new Error(`markNote: no note with id "${id}"`);
    }
  });
}

/** Clears the mark, if any. A no-op if no note is currently marked. */
export async function unmarkNote(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`UPDATE notes SET is_marked = 0 WHERE is_marked = 1`);
}

/** The currently marked note, or null if none is marked. */
export async function getMarkedNote(): Promise<Note | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<NoteRow>(`SELECT * FROM notes WHERE is_marked = 1 LIMIT 1`);
  return row ? toNote(row) : null;
}

/**
 * Appends text (e.g. a formatted Bible passage — see
 * src/bible/share-text.ts's formatNoteAppendText) to the currently marked
 * note's content, never overwriting what's already there.
 *
 * Spacing: a blank line on either side of the appended block visually
 * separates it from whatever the user already wrote, e.g.
 *
 *   Existing reflection text...
 *
 *   John 3:16
 *
 *   For God so loved the world...
 *
 * If the note is currently empty (a fresh note marked as the Bible Note
 * before writing anything), the appended text becomes the entire content
 * with no leading blank lines.
 *
 * Returns null (and makes no change) if no note is currently marked —
 * mirrors the old app's behaviour of requiring an explicit mark first
 * rather than silently creating one on the user's behalf.
 */
export async function appendToMarkedNote(text: string): Promise<Note | null> {
  const marked = await getMarkedNote();
  if (!marked) return null;

  const db = await getDatabase();
  const timestamp = new Date().toISOString();
  const existing = marked.content.trim();
  const newContent = existing ? `${marked.content}\n\n${text}` : text;
  await db.runAsync(`UPDATE notes SET content = ?, updated_at = ? WHERE id = ?`, [newContent, timestamp, marked.id]);
  return getNoteById(marked.id);
}
