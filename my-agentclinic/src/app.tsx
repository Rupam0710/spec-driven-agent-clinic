import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";
import { Agents } from "./pages/Agents";
import { AgentDetail } from "./pages/AgentDetail";
import { Ailments } from "./pages/Ailments";
import { AilmentDetail } from "./pages/AilmentDetail";
import { Therapies } from "./pages/Therapies";
import { TherapyDetail } from "./pages/TherapyDetail";
import { Appointments } from "./pages/Appointments";
import { BookAppointment } from "./pages/BookAppointment";
import { NotFound } from "./pages/NotFound";
import { getAgent, getAilment, getTherapy } from "./data/seed";
import { getSlot } from "./data/slots";
import { addAppointment } from "./data/appointments";

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

// --- Appointments (booking) ---
// Static /new route is declared before there'd be any /:id route; there is no
// /appointments/:id this phase.
app.get("/appointments", (c) => c.html(<Appointments />));
app.get("/appointments/new", (c) => c.html(<BookAppointment />));
app.post("/appointments", async (c) => {
  const body = await c.req.parseBody();
  const agentId = String(body.agentId ?? "");
  const therapyId = String(body.therapyId ?? "");
  const slotId = String(body.slotId ?? "");

  // Every reference must resolve; otherwise re-render the form with a message.
  if (!getAgent(agentId) || !getTherapy(therapyId) || !getSlot(slotId)) {
    return c.html(
      <BookAppointment
        error="Please choose an agent, a therapy, and a time slot."
        selected={{ agentId, therapyId, slotId }}
      />,
      400,
    );
  }

  addAppointment({ agentId, therapyId, slotId });
  return c.redirect("/appointments", 303);
});

// Any unmatched path gets the friendly, on-brand 404 page (not Hono's default
// plain-text response), so misses are consistent across the whole app.
app.notFound((c) => c.html(<NotFound />, 404));
