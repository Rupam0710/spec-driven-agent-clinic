import type { Agent, Ailment, Therapy } from "../domain/types";
import { db } from "./db";

// Read accessors for the clinic's reference data, backed by SQLite (src/data/db.ts).
// The source content lives in src/data/seed-data.ts and is loaded into the
// database on first run; everything here reads it back. Signatures are kept
// synchronous (better-sqlite3 is synchronous) so the pages that call these need
// no changes. Relationships (an agent's ailments, an ailment's therapies) are
// stored as join-table rows and reassembled into the id arrays the domain types
// expect, in their original seed order (ORDER BY rowid).

// --- Prepared statements (compiled once, reused per request) ---

const selectAgents = db.prepare(
  "SELECT id, name, description FROM agents ORDER BY rowid",
);
const selectAgentById = db.prepare(
  "SELECT id, name, description FROM agents WHERE id = ?",
);
const selectAilments = db.prepare(
  "SELECT id, name, summary FROM ailments ORDER BY rowid",
);
const selectAilmentById = db.prepare(
  "SELECT id, name, summary FROM ailments WHERE id = ?",
);
const selectTherapies = db.prepare(
  "SELECT id, name, summary FROM therapies ORDER BY rowid",
);
const selectTherapyById = db.prepare(
  "SELECT id, name, summary FROM therapies WHERE id = ?",
);

const selectAilmentIdsForAgent = db.prepare(
  "SELECT ailment_id FROM agent_ailments WHERE agent_id = ? ORDER BY rowid",
);
const selectTherapyIdsForAilment = db.prepare(
  "SELECT therapy_id FROM ailment_therapies WHERE ailment_id = ? ORDER BY rowid",
);
const selectAgentIdsForAilment = db.prepare(
  "SELECT agent_id FROM agent_ailments WHERE ailment_id = ? ORDER BY rowid",
);
const selectAilmentIdsForTherapy = db.prepare(
  "SELECT ailment_id FROM ailment_therapies WHERE therapy_id = ? ORDER BY rowid",
);

// --- Row → domain mappers (attach the related ids) ---

type AgentRow = { id: string; name: string; description: string };
type AilmentRow = { id: string; name: string; summary: string };
type TherapyRow = { id: string; name: string; summary: string };

const toAgent = (row: AgentRow): Agent => ({
  ...row,
  ailmentIds: (selectAilmentIdsForAgent.all(row.id) as { ailment_id: string }[]).map(
    (r) => r.ailment_id,
  ),
});

const toAilment = (row: AilmentRow): Ailment => ({
  ...row,
  therapyIds: (
    selectTherapyIdsForAilment.all(row.id) as { therapy_id: string }[]
  ).map((r) => r.therapy_id),
});

const toTherapy = (row: TherapyRow): Therapy => ({ ...row });

// --- Collection accessors (pages use these instead of raw rows) ---

export const getAgents = (): Agent[] =>
  (selectAgents.all() as AgentRow[]).map(toAgent);
export const getAilments = (): Ailment[] =>
  (selectAilments.all() as AilmentRow[]).map(toAilment);
export const getTherapies = (): Therapy[] =>
  (selectTherapies.all() as TherapyRow[]).map(toTherapy);

// --- Single-entity lookups (undefined when the id is unknown) ---

export const getAgent = (id: string): Agent | undefined => {
  const row = selectAgentById.get(id) as AgentRow | undefined;
  return row ? toAgent(row) : undefined;
};
export const getAilment = (id: string): Ailment | undefined => {
  const row = selectAilmentById.get(id) as AilmentRow | undefined;
  return row ? toAilment(row) : undefined;
};
export const getTherapy = (id: string): Therapy | undefined => {
  const row = selectTherapyById.get(id) as TherapyRow | undefined;
  return row ? toTherapy(row) : undefined;
};

// --- Relationship resolvers ---

// Ailments an agent has been diagnosed with.
export const getAilmentsForAgent = (agent: Agent): Ailment[] =>
  agent.ailmentIds
    .map((id) => getAilment(id))
    .filter((a): a is Ailment => a !== undefined);

// Therapies that treat a given ailment.
export const getTherapiesForAilment = (ailment: Ailment): Therapy[] =>
  ailment.therapyIds
    .map((id) => getTherapy(id))
    .filter((t): t is Therapy => t !== undefined);

// Agents currently diagnosed with a given ailment.
export const getAgentsForAilment = (ailment: Ailment): Agent[] =>
  (selectAgentIdsForAilment.all(ailment.id) as { agent_id: string }[])
    .map((r) => getAgent(r.agent_id))
    .filter((a): a is Agent => a !== undefined);

// Ailments that a given therapy is prescribed for.
export const getAilmentsForTherapy = (therapy: Therapy): Ailment[] =>
  (selectAilmentIdsForTherapy.all(therapy.id) as { ailment_id: string }[])
    .map((r) => getAilment(r.ailment_id))
    .filter((a): a is Ailment => a !== undefined);
