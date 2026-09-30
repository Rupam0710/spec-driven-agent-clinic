import { Layout } from "../components/Layout";
import { getAilments } from "../data/seed";

// Ailments list: every diagnosable condition, each linking to its detail page.
export function Ailments() {
  const ailments = getAilments();
  return (
    <Layout title="Ailments">
      <h1>Ailments</h1>
      <p>Conditions we diagnose and treat here at the clinic.</p>
      {ailments.map((ailment) => (
        <article>
          <h2>
            <a href={`/ailments/${ailment.id}`}>{ailment.name}</a>
          </h2>
          <p>{ailment.summary}</p>
        </article>
      ))}
    </Layout>
  );
}
