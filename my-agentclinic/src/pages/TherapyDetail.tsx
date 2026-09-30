import { Layout } from "../components/Layout";
import type { Therapy } from "../domain/types";
import { getAilmentsForTherapy } from "../data/seed";

type TherapyDetailProps = {
  therapy: Therapy;
};

// One therapy: the ailment(s) it treats, cross-linked back to each ailment.
export function TherapyDetail({ therapy }: TherapyDetailProps) {
  const ailments = getAilmentsForTherapy(therapy);
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
    </Layout>
  );
}
