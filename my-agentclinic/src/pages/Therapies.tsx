import { Layout } from "../components/Layout";
import { getTherapies } from "../data/seed";
import { getAllRatingSummaries } from "../data/reviews";

// Therapies list: every treatment on offer, each linking to its detail page and
// showing its average review rating (social proof) once it has reviews.
export function Therapies() {
  const therapies = getTherapies();
  const summaries = getAllRatingSummaries();
  return (
    <Layout title="Therapies">
      <h1>Therapies</h1>
      <p>Treatments we offer to bring agents back to baseline.</p>
      {therapies.map((therapy) => {
        const summary = summaries.get(therapy.id);
        return (
          <article>
            <h2>
              <a href={`/therapies/${therapy.id}`}>{therapy.name}</a>
            </h2>
            <p>{therapy.summary}</p>
            <p>
              {summary && summary.avg !== null && summary.n > 0 ? (
                <small>
                  ★ {summary.avg.toFixed(1)} / 5 — {summary.n} review
                  {summary.n === 1 ? "" : "s"}
                </small>
              ) : (
                <small>No reviews yet</small>
              )}
            </p>
          </article>
        );
      })}
    </Layout>
  );
}
