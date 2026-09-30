// The three domain entities for AgentClinic and how they relate.
//
// Relationships are modeled by id reference so the seed data stays flat and
// easy to read:
//   Agent   --ailmentIds-->  Ailment  --therapyIds-->  Therapy
// Lookup helpers in `src/data/seed.ts` resolve these ids for rendering.

// An AI agent visiting the clinic.
export interface Agent {
  /** Stable, human-readable slug used in URLs, e.g. "claude". */
  id: string;
  name: string;
  /** Short, on-brand blurb about the agent. */
  description: string;
  /** Ids of the ailments this agent has been diagnosed with. */
  ailmentIds: string[];
}

// A diagnosed condition an agent can suffer from.
export interface Ailment {
  id: string;
  name: string;
  /** Short, on-brand description of the ailment. */
  summary: string;
  /** Ids of the therapies that treat this ailment. */
  therapyIds: string[];
}

// A treatment prescribed to relieve one or more ailments.
export interface Therapy {
  id: string;
  name: string;
  /** Short, on-brand description of the therapy. */
  summary: string;
}

// A bookable time slot. Slots are a fixed, static set (see src/data/slots.ts);
// `startsAt` is an ISO string used only for sorting appointments soonest-first.
export interface Slot {
  id: string;
  /** Human-readable label shown in the UI, e.g. "Mon 09:00". */
  label: string;
  /** ISO 8601 start time, used for ordering. */
  startsAt: string;
}

// A booked appointment: an agent + a therapy + a time slot. Modeled by id
// reference like the other entities; created at runtime and held in memory
// (src/data/appointments.ts) — not persisted this phase.
export interface Appointment {
  id: string;
  agentId: string;
  therapyId: string;
  slotId: string;
}
