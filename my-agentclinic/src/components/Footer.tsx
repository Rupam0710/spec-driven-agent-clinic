import type { FC } from "hono/jsx";

// Site footer with a running copyright line.
export const Footer: FC = () => (
  <footer>
    <p>&copy; {new Date().getFullYear()} AgentClinic</p>
  </footer>
);
