import { getDatabase } from "./database";
import type { Note, NewNote, NoteEdit } from "./types";

/** Raw SQLite row shape (snake_case columns) — never leaves this file except via toNote(). */
export interface NoteRow {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  status: number;
  is_marked: number;
}

/** Shared by notes-repository.ts and marked-note.ts so both map DB rows to Note the same way. */
export function toNote(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    isMarked: row.is_marked === 1,
  };
}

/**
 * Timestamp-prefixed random id — TypeScript port of the old app's
 * `guid()` (util/helpers.js), which is a fine local-only primary key.
 * Revisit (e.g. a proper UUIDv4 via expo-crypto) if/when cloud sync needs
 * ids that are guaranteed collision-free across devices, not just locally.
 */
function generateId(): string {
  const timePart = Math.floor(Date.now() / 1000).toString(16);
  const randomPart = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return `${timePart}${randomPart}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function createNote(input: NewNote): Promise<Note> {
  const db = await getDatabase();
  const id = generateId();
  const timestamp = nowIso();
  const title = input.title ?? "";
  await db.runAsync(`INSERT INTO notes (id, title, content, created_at, updated_at, status, is_marked) VALUES (?, ?, ?, ?, ?, 0, 0)`, [
    id,
    title,
    input.content,
    timestamp,
    timestamp,
  ]);
  return { id, title, content: input.content, createdAt: timestamp, updatedAt: timestamp, status: 0, isMarked: false };
}

/** Returns the updated note, or null if no note with that id exists. */
export async function updateNote(id: string, edit: NoteEdit): Promise<Note | null> {
  const db = await getDatabase();
  const timestamp = nowIso();
  const result = await db.runAsync(`UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?`, [
    edit.title,
    edit.content,
    timestamp,
    id,
  ]);
  if (result.changes === 0) return null;
  return getNoteById(id);
}

/** Returns true if a note was deleted, false if no note with that id existed. */
export async function deleteNote(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.runAsync(`DELETE FROM notes WHERE id = ?`, [id]);
  return result.changes > 0;
}

export async function getNoteById(id: string): Promise<Note | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<NoteRow>(`SELECT * FROM notes WHERE id = ?`, [id]);
  return row ? toNote(row) : null;
}

/** All notes, most recently updated first (the library screen's sort order). */
export async function getNotes(): Promise<Note[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<NoteRow>(`SELECT * FROM notes ORDER BY updated_at DESC`);
  return rows.map(toNote);
}

/**
 * Notes created on the given calendar day, compared in UTC (consistent
 * with the ISO-8601 UTC timestamps notes are stored with — see types.ts).
 * A half-open [dayStart, dayEnd) range on the ISO strings works directly
 * without needing SQLite's date() function, since ISO-8601 UTC timestamps
 * sort identically as strings and as instants.
 *
 * NOTE: "calendar day" here is a UTC day, not the device's local day. A
 * user in a timezone far from UTC filtering "today" late at night may see
 * a boundary that doesn't match their wall clock. Worth revisiting when
 * the date-filter UI is built (Phase 4) — pass local-day boundaries
 * converted to UTC at the call site rather than changing storage format.
 */
export async function getNotesByDate(date: Date): Promise<Note[]> {
  const db = await getDatabase();
  const dayStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString();
  const dayEnd = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)).toISOString();
  const rows = await db.getAllAsync<NoteRow>(
    `SELECT * FROM notes WHERE created_at >= ? AND created_at < ? ORDER BY created_at DESC`,
    [dayStart, dayEnd]
  );
  return rows.map(toNote);
}
