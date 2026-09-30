import { Layout } from "../components/Layout";

type NotFoundProps = {
  message?: string;
};

// Friendly, on-brand 404 for unknown ids / routes.
export function NotFound({ message }: NotFoundProps) {
  return (
    <Layout title="Not found">
      <h1>Nothing here to treat</h1>
      <p>{message ?? "We couldn't find what you were looking for."}</p>
      <p>
        <a href="/">← Back to reception</a>
      </p>
    </Layout>
  );
}
