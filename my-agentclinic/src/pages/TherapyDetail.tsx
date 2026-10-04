import { Layout } from "../components/Layout";
import type { Therapy } from "../domain/types";
import { getAilmentsForTherapy, getAgent } from "../data/seed";
import { listReviewsForTherapy, getRatingSummary } from "../data/reviews";

type TherapyDetailProps = {
  therapy: Therapy;
};

// One therapy: the ailment(s) it treats, plus its public reviews and an average
// rating — in-world social proof. Fetches its own data like the other pages.
export function TherapyDetail({ therapy }: TherapyDetailProps) {
  const ailments = getAilmentsForTherapy(therapy);
  const reviews = listReviewsForTherapy(therapy.id);
  const { avg, n } = getRatingSummary(therapy.id);

  return (
    <Layout title={therapy.name}>
      <p>
        <a href="/therapies">← All therapies</a>
      </p>
      <h1>{therapy.name}</h1>
      <p>{therapy.summary}</p>

      <h2>Treats</h2>
      {ailments.length === 0 ? (
        <p>Not currently prescribed for any ailment.</p>
      ) : (
        <ul>
          {ailments.map((ailment) => (
            <li>
              <a href={`/ailments/${ailment.id}`}>{ailment.name}</a> —{" "}
              {ailment.summary}
            </li>
          ))}
        </ul>
      )}

      <h2>Reviews</h2>
      <p>
        {avg !== null && n > 0 ? (
          <strong>
            ★ {avg.toFixed(1)} / 5 — {n} review{n === 1 ? "" : "s"}
          </strong>
        ) : (
          "No reviews yet — be the first to vouch for it."
        )}
      </p>
      <p>
        <a href={`/therapies/${therapy.id}/reviews/new`} role="button">
          Write a review
        </a>
      </p>

      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => {
            const agent = getAgent(review.agentId);
            return (
              <li>
                <strong>{"★".repeat(review.rating)}</strong> by{" "}
                {agent ? (
                  <a href={`/agents/${agent.id}`}>{agent.name}</a>
                ) : (
                  "a former patient"
                )}
                <br />
                {review.note}
              </li>
            );
          })}
        </ul>
      ) : null}
    </Layout>
  );
}
