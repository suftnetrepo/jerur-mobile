import * as SQLite from "expo-sqlite";
import { runMigrations } from "./migrations";

const DATABASE_NAME = "jerur.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Opens (or returns the already-opened) app database, running any
 * outstanding migrations first. Callers never open expo-sqlite directly —
 * this is the one place jerur.db is opened, so every caller shares the
 * same open+migrated connection instead of racing to open/migrate it
 * independently (mirrors the old app's `getRealmInstance()` singleton in
 * model/store.ts, adapted to SQLite).
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openAndMigrate();
  }
  return dbPromise;
}

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  // WAL improves concurrent read/write behaviour and is Expo's documented
  // recommendation for apps that write regularly (every note edit here).
  await db.execAsync("PRAGMA journal_mode = WAL;");
  await runMigrations(db);
  return db;
}

/**
 * Test-only escape hatch: forces the next getDatabase() call to reopen
 * (and re-run migration bookkeeping against) the database, instead of
 * reusing the cached connection. Application code should never call this.
 */
export function __resetDatabaseConnectionForTesting(): void {
  dbPromise = null;
}
