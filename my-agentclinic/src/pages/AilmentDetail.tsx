import { Layout } from "../components/Layout";
import type { Ailment } from "../domain/types";
import { getTherapiesForAilment, getAgentsForAilment } from "../data/seed";

type AilmentDetailProps = {
  ailment: Ailment;
};

// One ailment: the therapies that treat it and the agents who have it.
// Cross-links both onward (→ therapy) and back (→ agent).
export function AilmentDetail({ ailment }: AilmentDetailProps) {
  const therapies = getTherapiesForAilment(ailment);
  const agents = getAgentsForAilment(ailment);
  return (
    <Layout title={ailment.name}>
      <p>
        <a href="/ailments">← All ailments</a>
      </p>
      <h1>{ailment.name}</h1>
      <p>{ailment.summary}</p>

      <h2>Recommended therapies</h2>
      {therapies.length === 0 ? (
        <p>No therapy prescribed yet.</p>
      ) : (
        <ul>
          {therapies.map((therapy) => (
            <li>
              <a href={`/therapies/${therapy.id}`}>{therapy.name}</a> —{" "}
              {therapy.summary}
            </li>
          ))}
        </ul>
      )}

      <h2>Agents with this ailment</h2>
      {agents.length === 0 ? (
        <p>No agents currently diagnosed with this.</p>
      ) : (
        <ul>
          {agents.map((agent) => (
            <li>
              <a href={`/agents/${agent.id}`}>{agent.name}</a>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
