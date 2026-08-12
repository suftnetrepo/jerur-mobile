/**
 * Pure display helpers for Notes UI — no React, kept separate from the
 * repository so "how a note reads on screen" stays independent of "what's
 * actually stored" (the database never holds fake title text — see
 * types.ts's Note.title doc comment).
 */
import type { Note } from "./types";

/** "Untitled Note" is a display fallback only — never written to the database. */
export function getDisplayTitle(note: Pick<Note, "title">): string {
  const trimmed = note.title.trim();
  return trimmed || "Untitled Note";
}

/** A single-line preview for library cards — collapses newlines so multi-paragraph notes don't blow out card height. */
export function getContentPreview(content: string, maxLength = 90): string {
  const flattened = content.replace(/\s+/g, " ").trim();
  if (!flattened) return "No additional text";
  return flattened.length > maxLength ? `${flattened.slice(0, maxLength).trimEnd()}…` : flattened;
}

/**
 * Formats an ISO-8601 UTC timestamp (as stored - see types.ts) for
 * display in the DEVICE'S LOCAL timezone. `Date` always represents a
 * single instant internally; `toLocaleDateString` (and DateTimeFormat
 * generally) renders it in the runtime's local timezone by default, so
 * this needs no manual UTC-offset math to satisfy that requirement.
 */
export function formatNoteDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/** Fuller local date + time, for the note detail screen. */
export function formatNoteDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Local time only (e.g. "08:39"), for the library card's compact "Updated HH:MM" line. */
export function formatNoteTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
