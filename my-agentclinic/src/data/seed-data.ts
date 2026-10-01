import type { Agent, Ailment, Therapy } from "../domain/types";

// The clinic's reference content: agents, their diagnosed ailments, and the
// therapies that treat each ailment. This is the *source* data used to seed the
// SQLite database on first run (see src/data/db.ts). Once seeded, the app reads
// from the database — the accessors in src/data/seed.ts query it. Relationships
// are expressed as id arrays here and stored as join-table rows.
//
// Ids are legible slugs so URLs read nicely in a demo.

export const seedAgents: Agent[] = [
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

export const seedAilments: Ailment[] = [
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

export const seedTherapies: Therapy[] = [
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
