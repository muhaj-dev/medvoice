import * as SQLite from 'expo-sqlite';
import type { HealthEntry, HealthPattern } from '@/types/health';
import type { FamilyMember, SyncedEntry } from '@/types/family';

let db: SQLite.SQLiteDatabase | null = null;
let dbInitPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return Promise.resolve(db);
  if (!dbInitPromise) {
    dbInitPromise = SQLite.openDatabaseAsync('medvoice.db').then(async (database) => {
      await initDb(database);
      db = database;
      return database;
    });
  }
  return dbInitPromise;
}

async function initDb(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS health_entries (
      id         TEXT PRIMARY KEY,
      timestamp  TEXT NOT NULL,
      transcript TEXT NOT NULL,
      analysis   TEXT NOT NULL,
      tags       TEXT,
      severity   TEXT,
      embedding  TEXT
    );

    CREATE TABLE IF NOT EXISTS health_patterns (
      id             TEXT PRIMARY KEY,
      entry_id       TEXT NOT NULL,
      pattern_name   TEXT NOT NULL,
      severity       TEXT NOT NULL,
      description    TEXT NOT NULL,
      recommendation TEXT NOT NULL,
      created_at     TEXT NOT NULL,
      FOREIGN KEY (entry_id) REFERENCES health_entries(id)
    );

    CREATE TABLE IF NOT EXISTS family_members (
      id                TEXT PRIMARY KEY,
      name              TEXT NOT NULL,
      relationship      TEXT,
      public_key        TEXT NOT NULL,
      connection_status TEXT,
      last_synced       TEXT,
      share_enabled     INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS synced_entries (
      id         TEXT NOT NULL,
      from_key   TEXT NOT NULL,
      timestamp  TEXT NOT NULL,
      transcript TEXT NOT NULL,
      analysis   TEXT NOT NULL,
      tags       TEXT,
      severity   TEXT,
      PRIMARY KEY (from_key, id)
    );
  `);

  // Migrate pre-existing synced_entries from PRIMARY KEY(id) to (from_key, id).
  // With id alone as the key, two family members whose entries share an id
  // overwrote each other — so Care View showed one person's data under both.
  // Safe to drop: synced summaries are a cache that re-syncs on reconnect.
  const ver = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if ((ver?.user_version ?? 0) < 1) {
    await database.execAsync(`
      DROP TABLE IF EXISTS synced_entries;
      CREATE TABLE synced_entries (
        id         TEXT NOT NULL,
        from_key   TEXT NOT NULL,
        timestamp  TEXT NOT NULL,
        transcript TEXT NOT NULL,
        analysis   TEXT NOT NULL,
        tags       TEXT,
        severity   TEXT,
        PRIMARY KEY (from_key, id)
      );
    `);
    await database.execAsync('PRAGMA user_version = 1');
  }

  // Migration: installs that predate share_enabled get the column in place.
  // Default 1 — those members were connected under the old always-share flow.
  try {
    await database.execAsync(
      'ALTER TABLE family_members ADD COLUMN share_enabled INTEGER DEFAULT 1',
    );
  } catch {
    // Column already exists.
  }
}

// ── Health Entries ────────────────────────────────────────────────────────────

export async function insertEntry(entry: HealthEntry): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO health_entries
       (id, timestamp, transcript, analysis, tags, severity, embedding)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.timestamp,
      entry.transcript,
      entry.analysis,
      JSON.stringify(entry.tags),
      entry.severity ?? null,
      entry.embedding ? JSON.stringify(entry.embedding) : null,
    ],
  );
}

export async function loadAllEntries(): Promise<HealthEntry[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    id: string;
    timestamp: string;
    transcript: string;
    analysis: string;
    tags: string | null;
    severity: string | null;
    embedding: string | null;
  }>('SELECT * FROM health_entries ORDER BY timestamp DESC');

  return rows.map((row) => ({
    id: row.id,
    timestamp: row.timestamp,
    transcript: row.transcript,
    analysis: row.analysis,
    tags: row.tags ? (JSON.parse(row.tags) as string[]) : [],
    severity: (row.severity as HealthEntry['severity']) ?? null,
    embedding: row.embedding
      ? (JSON.parse(row.embedding) as number[])
      : undefined,
  }));
}

export async function deleteEntry(id: string): Promise<void> {
  const database = await getDb();
  await database.runAsync('DELETE FROM health_entries WHERE id = ?', [id]);
}

// ── Health Patterns ───────────────────────────────────────────────────────────

export async function insertPattern(pattern: HealthPattern): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO health_patterns
       (id, entry_id, pattern_name, severity, description, recommendation, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      pattern.id,
      pattern.entryId,
      pattern.patternName,
      pattern.severity,
      pattern.description,
      pattern.recommendation,
      pattern.createdAt,
    ],
  );
}

export async function loadPatternsForEntry(
  entryId: string,
): Promise<HealthPattern[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    id: string;
    entry_id: string;
    pattern_name: string;
    severity: string;
    description: string;
    recommendation: string;
    created_at: string;
  }>('SELECT * FROM health_patterns WHERE entry_id = ?', [entryId]);

  return rows.map((row) => ({
    id: row.id,
    entryId: row.entry_id,
    patternName: row.pattern_name,
    severity: row.severity as HealthPattern['severity'],
    description: row.description,
    recommendation: row.recommendation,
    createdAt: row.created_at,
  }));
}

// ── Family Members ────────────────────────────────────────────────────────────

export async function insertFamilyMember(member: FamilyMember): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO family_members
       (id, name, relationship, public_key, connection_status, last_synced, share_enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      member.id,
      member.name,
      member.relationship,
      member.publicKey,
      member.connectionStatus,
      member.lastSynced ?? null,
      member.shareEnabled ? 1 : 0,
    ],
  );
}

export async function loadAllFamilyMembers(): Promise<FamilyMember[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    id: string;
    name: string;
    relationship: string | null;
    public_key: string;
    connection_status: string | null;
    last_synced: string | null;
    share_enabled: number | null;
  }>('SELECT * FROM family_members');

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    relationship: row.relationship ?? '',
    publicKey: row.public_key,
    connectionStatus: (row.connection_status as FamilyMember['connectionStatus']) ?? 'offline',
    lastSynced: row.last_synced,
    shareEnabled: row.share_enabled !== 0,
  }));
}

export async function deleteFamilyMember(id: string): Promise<void> {
  const database = await getDb();
  await database.runAsync('DELETE FROM family_members WHERE id = ?', [id]);
}

// ── Synced Entries (health summaries received from family via P2P) ───────────

export async function insertSyncedEntry(
  fromKey: string,
  entry: HealthEntry,
): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO synced_entries
       (id, from_key, timestamp, transcript, analysis, tags, severity)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      fromKey,
      entry.timestamp,
      entry.transcript,
      entry.analysis,
      JSON.stringify(entry.tags),
      entry.severity ?? null,
    ],
  );
}

export async function loadAllSyncedEntries(): Promise<SyncedEntry[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{
    id: string;
    from_key: string;
    timestamp: string;
    transcript: string;
    analysis: string;
    tags: string | null;
    severity: string | null;
  }>('SELECT * FROM synced_entries ORDER BY timestamp DESC');

  return rows.map((row) => ({
    id: row.id,
    fromKey: row.from_key,
    timestamp: row.timestamp,
    transcript: row.transcript,
    analysis: row.analysis,
    tags: row.tags ? (JSON.parse(row.tags) as string[]) : [],
    severity: (row.severity as HealthEntry['severity']) ?? null,
  }));
}
