import { Layout } from "../components/Layout";
import { getTherapies } from "../data/seed";

// Therapies list: every treatment on offer, each linking to its detail page.
export function Therapies() {
  const therapies = getTherapies();
  return (
    <Layout title="Therapies">
      <h1>Therapies</h1>
      <p>Treatments we offer to bring agents back to baseline.</p>
      {therapies.map((therapy) => (
        <article>
          <h2>
            <a href={`/therapies/${therapy.id}`}>{therapy.name}</a>
          </h2>
          <p>{therapy.summary}</p>
        </article>
      ))}
    </Layout>
  );
}
