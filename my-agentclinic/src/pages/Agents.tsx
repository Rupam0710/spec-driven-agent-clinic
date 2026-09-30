import { Layout } from "../components/Layout";
import { getAgents } from "../data/seed";

// Agents list: every agent checked in, each linking to their detail page.
export function Agents() {
  const agents = getAgents();
  return (
    <Layout title="Agents">
      <h1>Agents</h1>
      <p>The agents currently checked in at the clinic.</p>
      {agents.map((agent) => (
        <article>
          <h2>
            <a href={`/agents/${agent.id}`}>{agent.name}</a>
          </h2>
          <p>{agent.description}</p>
        </article>
      ))}
    </Layout>
  );
}
