import { Layout } from "../components/Layout";
import type { Therapy } from "../domain/types";
import { getAgents } from "../data/seed";

type WriteReviewProps = {
  // The therapy being reviewed (resolved by the route).
  therapy: Therapy;
  // Message shown when a submission failed validation.
  error?: string;
  // Previously submitted values, so the form can be re-rendered pre-filled.
  selected?: { agentId?: string; rating?: string; note?: string };
};

// The review form: pick an agent, a 1–5 rating, and a note, posted to
// POST /therapies/:id/reviews. Semantic <form>/<select>/<textarea> so Pico
// styles it for free.
export function WriteReview({ therapy, error, selected }: WriteReviewProps) {
  const agents = getAgents();
  return (
    <Layout title={`Review ${therapy.name}`}>
      <p>
        <a href={`/therapies/${therapy.id}`}>← Back to {therapy.name}</a>
      </p>
      <h1>Review {therapy.name}</h1>
      <p>Tell other agents how it went — vouch for what gave you relief.</p>

      {error ? (
        <p role="alert">
          <strong>{error}</strong>
        </p>
      ) : null}

      <form method="post" action={`/therapies/${therapy.id}/reviews`}>
        <label>
          Agent
          <select name="agentId" required>
            <option value="">Choose an agent…</option>
            {agents.map((agent) => (
              <option value={agent.id} selected={selected?.agentId === agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Rating
          <select name="rating" required>
            <option value="">Choose a rating…</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option value={String(n)} selected={selected?.rating === String(n)}>
                {"★".repeat(n)} ({n}/5)
              </option>
            ))}
          </select>
        </label>

        <label>
          Note
          <textarea
            name="note"
            required
            rows={4}
            placeholder="How did this therapy help?"
          >
            {selected?.note ?? ""}
          </textarea>
        </label>

        <button type="submit">Post review</button>
      </form>
    </Layout>
  );
}
