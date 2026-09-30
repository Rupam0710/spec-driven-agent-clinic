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
