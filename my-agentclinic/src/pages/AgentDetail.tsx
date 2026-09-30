import { Layout } from "../components/Layout";
import type { Agent } from "../domain/types";
import { getAilmentsForAgent } from "../data/seed";

type AgentDetailProps = {
  agent: Agent;
};

// One agent, showing the ailments they've been diagnosed with. Each ailment
// links onward to its own detail page (agent → ailment → therapy chain).
export function AgentDetail({ agent }: AgentDetailProps) {
  const ailments = getAilmentsForAgent(agent);
  return (
    <Layout title={agent.name}>
      <p>
        <a href="/agents">← All agents</a>
      </p>
      <h1>{agent.name}</h1>
      <p>{agent.description}</p>

      <h2>Diagnosed ailments</h2>
      {ailments.length === 0 ? (
        <p>No ailments diagnosed — a clean bill of health.</p>
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
