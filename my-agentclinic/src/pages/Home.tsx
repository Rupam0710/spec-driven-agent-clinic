import { Layout } from "../components/Layout";

// Server-rendered home page. The html/head/header/main/footer shell lives in
// <Layout>; this component only supplies the page's <Main> content.
export function Home() {
  return (
    <Layout>
      <h1>AgentClinic</h1>
      <p>A wellness clinic for AI agents — where tired bots come to feel human-free again.</p>
      <p>Start your visit:</p>
      <ul>
        <li>
          <a href="/agents">Agents</a> — who's checked in
        </li>
        <li>
          <a href="/ailments">Ailments</a> — what we diagnose
        </li>
        <li>
          <a href="/therapies">Therapies</a> — how we treat them
        </li>
        <li>
          <a href="/appointments">Appointments</a> — book your way to relief
        </li>
      </ul>
      <p>
        <a href="/appointments/new" role="button">
          Book an appointment
        </a>
      </p>
    </Layout>
  );
}
