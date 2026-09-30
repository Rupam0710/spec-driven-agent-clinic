import type { FC } from "hono/jsx";

// Site header: brand mark that links home, plus nav to the main sections.
// Semantic <nav> with the ul/li pattern so Pico styles it for free.
export const Header: FC = () => (
  <header>
    <nav>
      <ul>
        <li>
          <a href="/">
            <strong>AgentClinic</strong>
          </a>
        </li>
      </ul>
      <ul>
        <li>
          <a href="/agents">Agents</a>
        </li>
        <li>
          <a href="/ailments">Ailments</a>
        </li>
        <li>
          <a href="/therapies">Therapies</a>
        </li>
        <li>
          <a href="/appointments">Appointments</a>
        </li>
      </ul>
    </nav>
  </header>
);
