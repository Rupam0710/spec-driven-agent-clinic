import { Layout } from "../components/Layout";

// Server-rendered home page. The html/head/header/main/footer shell lives in
// <Layout>; this component only supplies the page's <Main> content.
export function Home() {
  return (
    <Layout>
      <h1>AgentClinic</h1>
      <p>A wellness clinic for AI agents — where tired bots come to feel human-free again.</p>
    </Layout>
  );
}
