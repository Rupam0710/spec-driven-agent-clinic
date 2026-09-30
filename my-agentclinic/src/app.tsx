import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";
import { Agents } from "./pages/Agents";
import { AgentDetail } from "./pages/AgentDetail";
import { Ailments } from "./pages/Ailments";
import { AilmentDetail } from "./pages/AilmentDetail";
import { Therapies } from "./pages/Therapies";
import { TherapyDetail } from "./pages/TherapyDetail";
import { NotFound } from "./pages/NotFound";
import { getAgent, getAilment, getTherapy } from "./data/seed";

// The Hono app and its routes. Exported (rather than served here) so tests can
// call `app.request(...)` without starting a network listener.
export const app = new Hono();

// Serve the static assets (e.g. /static/style.css) from the `static/` dir.
app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (c) => {
  return c.html(<Home />);
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// --- Agents ---
app.get("/agents", (c) => c.html(<Agents />));
app.get("/agents/:id", (c) => {
  const agent = getAgent(c.req.param("id"));
  if (!agent) {
    return c.html(<NotFound message="No such agent has checked in." />, 404);
  }
  return c.html(<AgentDetail agent={agent} />);
});

// --- Ailments ---
app.get("/ailments", (c) => c.html(<Ailments />));
app.get("/ailments/:id", (c) => {
  const ailment = getAilment(c.req.param("id"));
  if (!ailment) {
    return c.html(<NotFound message="We don't diagnose that one here." />, 404);
  }
  return c.html(<AilmentDetail ailment={ailment} />);
});

// --- Therapies ---
app.get("/therapies", (c) => c.html(<Therapies />));
app.get("/therapies/:id", (c) => {
  const therapy = getTherapy(c.req.param("id"));
  if (!therapy) {
    return c.html(<NotFound message="That therapy isn't on our list." />, 404);
  }
  return c.html(<TherapyDetail therapy={therapy} />);
});
