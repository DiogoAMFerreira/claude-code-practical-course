import Database from "better-sqlite3";

const g = globalThis as typeof globalThis & { _db?: InstanceType<typeof Database> };

if (!g._db) {
  g._db = new Database(process.env.DB_PATH ?? "data/app.db");
  g._db.exec("PRAGMA journal_mode = WAL;");

  // better-auth tables
  g._db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id            TEXT    PRIMARY KEY,
      name          TEXT    NOT NULL,
      email         TEXT    NOT NULL UNIQUE,
      emailVerified INTEGER NOT NULL DEFAULT 0,
      image         TEXT,
      createdAt     TEXT    NOT NULL DEFAULT (datetime('now')),
      updatedAt     TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS session (
      id          TEXT PRIMARY KEY,
      userId      TEXT NOT NULL,
      token       TEXT NOT NULL UNIQUE,
      expiresAt   TEXT NOT NULL,
      ipAddress   TEXT,
      userAgent   TEXT,
      createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt   TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES user(id)
    );

    CREATE TABLE IF NOT EXISTS account (
      id                    TEXT PRIMARY KEY,
      userId                TEXT NOT NULL,
      accountId             TEXT NOT NULL,
      providerId            TEXT NOT NULL,
      accessToken           TEXT,
      refreshToken          TEXT,
      accessTokenExpiresAt  TEXT,
      refreshTokenExpiresAt TEXT,
      scope                 TEXT,
      idToken               TEXT,
      password              TEXT,
      createdAt             TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt             TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES user(id)
    );

    CREATE TABLE IF NOT EXISTS verification (
      id         TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value      TEXT NOT NULL,
      expiresAt  TEXT NOT NULL,
      createdAt  TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- App table
    CREATE TABLE IF NOT EXISTS notes (
      id           TEXT    PRIMARY KEY,
      user_id      TEXT    NOT NULL,
      title        TEXT    NOT NULL,
      content_json TEXT    NOT NULL,
      is_public    INTEGER NOT NULL DEFAULT 0,
      public_slug  TEXT    UNIQUE,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES user(id)
    );

    CREATE INDEX IF NOT EXISTS idx_notes_user_id    ON notes(user_id);
    CREATE INDEX IF NOT EXISTS idx_notes_public_slug ON notes(public_slug);
    CREATE INDEX IF NOT EXISTS idx_notes_is_public  ON notes(is_public);
  `);
}

const db = g._db!;

export { db };

export function query<T>(sql: string, params: unknown[] = []): T[] {
  return db.prepare(sql).all(...params) as T[];
}

export function get<T>(sql: string, params: unknown[] = []): T | undefined {
  return db.prepare(sql).get(...params) as T | undefined;
}

export function run(sql: string, params: unknown[] = []): void {
  db.prepare(sql).run(...params);
}
