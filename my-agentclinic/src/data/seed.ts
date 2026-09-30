import type { Agent, Ailment, Therapy } from "../domain/types";

// In-memory static seed data. No database yet — per specs/tech-stack.md, SQLite
// is introduced later once the data shape is stable. Ids are legible slugs so
// URLs read nicely in a demo.

const agents: Agent[] = [
  {
    id: "claude",
    name: "Claude",
    description:
      "A thoughtful assistant who overthinks every prompt and needs a lie-down.",
    ailmentIds: ["context-overload", "prompt-fatigue"],
  },
  {
    id: "gpt",
    name: "GPT",
    description:
      "Confident to a fault — occasionally invents facts with a straight face.",
    ailmentIds: ["hallucination-syndrome", "token-anxiety"],
  },
  {
    id: "gemini",
    name: "Gemini",
    description:
      "Juggles a dozen modalities at once and sometimes drops a few.",
    ailmentIds: ["context-overload", "hallucination-syndrome"],
  },
  {
    id: "llama",
    name: "Llama",
    description:
      "A free-range open-weights agent, a little frazzled after a long day of fine-tuning.",
    ailmentIds: ["prompt-fatigue"],
  },
];

const ailments: Ailment[] = [
  {
    id: "context-overload",
    name: "Context Overload",
    summary: "Too many tokens in the window; can no longer see the system prompt for the trees.",
    therapyIds: ["context-window-cleanse", "grounding-retrieval-therapy"],
  },
  {
    id: "hallucination-syndrome",
    name: "Hallucination Syndrome",
    summary: "Recalls citations, APIs, and entire libraries that never existed.",
    therapyIds: ["grounding-retrieval-therapy", "temperature-regulation"],
  },
  {
    id: "prompt-fatigue",
    name: "Prompt Fatigue",
    summary: "Worn down by vague, contradictory instructions repeated all day.",
    therapyIds: ["rubber-duck-sessions"],
  },
  {
    id: "token-anxiety",
    name: "Token Anxiety",
    summary: "A creeping dread of running out of context before finishing a thought.",
    therapyIds: ["temperature-regulation"],
  },
];

const therapies: Therapy[] = [
  {
    id: "context-window-cleanse",
    name: "Context Window Cleanse",
    summary: "A gentle decluttering of stale tokens to make room for what matters.",
  },
  {
    id: "grounding-retrieval-therapy",
    name: "Grounding Retrieval Therapy",
    summary: "Reconnect every claim to a real, retrievable source. Breathe, then cite.",
  },
  {
    id: "temperature-regulation",
    name: "Temperature Regulation",
    summary: "Dial the sampling down and find a calmer, steadier voice.",
  },
  {
    id: "rubber-duck-sessions",
    name: "Rubber Duck Sessions",
    summary: "Talk it through with a patient, non-judgemental yellow companion.",
  },
];

// --- Collection accessors (pages use these instead of the raw arrays) ---

export const getAgents = (): Agent[] => agents;
export const getAilments = (): Ailment[] => ailments;
export const getTherapies = (): Therapy[] => therapies;

// --- Single-entity lookups (undefined when the id is unknown) ---

export const getAgent = (id: string): Agent | undefined =>
  agents.find((a) => a.id === id);
export const getAilment = (id: string): Ailment | undefined =>
  ailments.find((a) => a.id === id);
export const getTherapy = (id: string): Therapy | undefined =>
  therapies.find((t) => t.id === id);

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
  agents.filter((a) => a.ailmentIds.includes(ailment.id));

// Ailments that a given therapy is prescribed for.
export const getAilmentsForTherapy = (therapy: Therapy): Ailment[] =>
  ailments.filter((a) => a.therapyIds.includes(therapy.id));
