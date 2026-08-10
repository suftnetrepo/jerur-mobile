/**
 * Local, in-memory Notes search — case-insensitive substring match across
 * title + content. No SQL LIKE query: personal-note volume is small
 * enough that loading the user's notes (already fetched for the library
 * screen) and filtering in memory is simpler and plenty fast, matching
 * the same "local data, plain filter" approach as Bible/Hymns search.
 */
import type { Note } from "./types";

export function searchNotes(notes: Note[], query: string): Note[] {
  const q = query.trim().toLowerCase();
  if (!q) return notes;
  return notes.filter((note) => note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q));
}
