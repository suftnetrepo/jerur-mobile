import type { SQLiteDatabase } from "expo-sqlite";

interface Migration {
  version: number;
  description: string;
  up: (db: SQLiteDatabase) => Promise<void>;
}

/**
 * Ordered, additive schema history for jerur.db.
 *
 * Once a migration has shipped, never edit it — add a new one instead,
 * even for a small change (a new column, a new index). Editing a shipped
 * migration does nothing for installs that already ran it (see
 * runMigrations below), so the schema would silently drift between fresh
 * installs and upgrades.
 *
 * Versioning is tracked via SQLite's built-in `PRAGMA user_version`
 * (a plain integer stored in the database file header) rather than a
 * separate migrations table — one less table to keep consistent, and
 * user_version is exactly what it's for.
 */
const MIGRATIONS: Migration[] = [
  {
    version: 1,
    description: "Create notes table",
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY NOT NULL,
          content TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          status INTEGER NOT NULL DEFAULT 0,
          is_marked INTEGER NOT NULL DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes (created_at);

        -- Partial unique index: SQLite enforces at most one row with
        -- is_marked = 1 at the database level, as a second line of
        -- defence behind notes-repository.ts's markNote() transaction
        -- (which clears any existing mark before setting a new one).
        -- Rows with is_marked = 0 are untouched by this index (SQLite
        -- treats them as not participating in the uniqueness check),
        -- so it never blocks ordinary inserts/updates.
        CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_single_mark
          ON notes (is_marked)
          WHERE is_marked = 1;
      `);
    },
  },
  {
    version: 2,
    description: "Add title column to notes",
    up: async (db) => {
      // Additive only - existing rows keep their content/timestamps/mark
      // untouched; the new column defaults to '' so every pre-existing
      // note reads as untitled (see src/notes/display.ts's
      // getDisplayTitle()) rather than failing NOT NULL on migrate.
      await db.execAsync(`ALTER TABLE notes ADD COLUMN title TEXT NOT NULL DEFAULT '';`);
    },
  },
];

/**
 * Runs every migration whose version is greater than the database's
 * current `user_version`, in ascending order, each in its own transaction.
 *
 * Fresh install: user_version starts at 0, so every migration in
 * MIGRATIONS runs, in order, ending at the latest version.
 *
 * Existing install: user_version already reflects everything that ran on
 * a previous launch, so only newly-added migrations (version greater than
 * what's stored) execute — existing rows are never touched by a
 * CREATE TABLE IF NOT EXISTS / IF NOT EXISTS index, and later migrations
 * are expected to use ALTER TABLE / data-preserving statements, never
 * DROP TABLE.
 */
export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const versionRow = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  const currentVersion = versionRow?.user_version ?? 0;

  const pending = MIGRATIONS.filter((migration) => migration.version > currentVersion).sort(
    (a, b) => a.version - b.version
  );

  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      await migration.up(db);
      // PRAGMA statements don't accept bound parameters; `migration.version`
      // is our own integer literal from the array above, never user input,
      // so inlining it here is safe.
      await db.execAsync(`PRAGMA user_version = ${migration.version};`);
    });
  }
}

/** Exposed for tests/verification only — not used by application code. */
export const __MIGRATIONS_FOR_TESTING = MIGRATIONS;
