import Database from "better-sqlite3";
import { seedAgents, seedAilments, seedTherapies } from "./seed-data";

// SQLite persistence for AgentClinic (specs/tech-stack.md → "Persistence —
// SQLite"). A single-file, zero-config database holds agents, ailments,
// therapies, and the appointments agents book. Reference data is seeded on
// first run; appointments then survive a restart.
//
// One shared connection for the whole process. better-sqlite3 is synchronous,
// so the data accessors (src/data/seed.ts, src/data/appointments.ts) keep the
// same synchronous signatures the pages already call.
//
// The database file path comes from DATABASE_PATH (default ./agentclinic.db).
// Tests set DATABASE_PATH=":memory:" so each run starts from a clean,
// throwaway, in-memory database — no temp files, fully isolated (vitest.config.ts).

const databasePath = process.env.DATABASE_PATH ?? "./agentclinic.db";

export const db = new Database(databasePath);

// WAL improves concurrent read/write behaviour and is the sensible default for a
// long-running server; harmless for the in-memory test database.
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ailments (
      id      TEXT PRIMARY KEY,
      name    TEXT NOT NULL,
      summary TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS therapies (
      id      TEXT PRIMARY KEY,
      name    TEXT NOT NULL,
      summary TEXT NOT NULL
    );

    -- Many-to-many: which ailments an agent is diagnosed with.
    CREATE TABLE IF NOT EXISTS agent_ailments (
      agent_id   TEXT NOT NULL REFERENCES agents(id),
      ailment_id TEXT NOT NULL REFERENCES ailments(id),
      PRIMARY KEY (agent_id, ailment_id)
    );

    -- Many-to-many: which therapies treat an ailment.
    CREATE TABLE IF NOT EXISTS ailment_therapies (
      ailment_id TEXT NOT NULL REFERENCES ailments(id),
      therapy_id TEXT NOT NULL REFERENCES therapies(id),
      PRIMARY KEY (ailment_id, therapy_id)
    );

    -- Booked appointments. Unlike the reference tables above, rows here are
    -- created at runtime and are what persistence is really about.
    CREATE TABLE IF NOT EXISTS appointments (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id   TEXT NOT NULL REFERENCES agents(id),
      therapy_id TEXT NOT NULL REFERENCES therapies(id),
      slot_id    TEXT NOT NULL
    );

    -- Public customer reviews: an agent rates a therapy (1–5) and leaves a
    -- note. Runtime-created and persisted, like appointments; surfaced on the
    -- therapy's page with an average rating.
    CREATE TABLE IF NOT EXISTS reviews (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id   TEXT NOT NULL REFERENCES agents(id),
      therapy_id TEXT NOT NULL REFERENCES therapies(id),
      rating     INTEGER NOT NULL,
      note       TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

// Idempotent: only load reference data when the clinic is empty, so restarts
// (and the WAL-persisted file) don't duplicate rows. Appointments are never
// seeded. Wrapped in a transaction so a half-written seed can't survive.
function seedReferenceData(): void {
  const already = db.prepare("SELECT COUNT(*) AS n FROM agents").get() as {
    n: number;
  };
  if (already.n > 0) return;

  const insertAgent = db.prepare(
    "INSERT INTO agents (id, name, description) VALUES (?, ?, ?)",
  );
  const insertAilment = db.prepare(
    "INSERT INTO ailments (id, name, summary) VALUES (?, ?, ?)",
  );
  const insertTherapy = db.prepare(
    "INSERT INTO therapies (id, name, summary) VALUES (?, ?, ?)",
  );
  const linkAgentAilment = db.prepare(
    "INSERT INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)",
  );
  const linkAilmentTherapy = db.prepare(
    "INSERT INTO ailment_therapies (ailment_id, therapy_id) VALUES (?, ?)",
  );

  const seed = db.transaction(() => {
    // Therapies and ailments first so the join-table foreign keys resolve.
    for (const t of seedTherapies) insertTherapy.run(t.id, t.name, t.summary);
    for (const a of seedAilments) {
      insertAilment.run(a.id, a.name, a.summary);
      for (const therapyId of a.therapyIds)
        linkAilmentTherapy.run(a.id, therapyId);
    }
    for (const agent of seedAgents) {
      insertAgent.run(agent.id, agent.name, agent.description);
      for (const ailmentId of agent.ailmentIds)
        linkAgentAilment.run(agent.id, ailmentId);
    }
  });

  seed();
}

initSchema();
seedReferenceData();
