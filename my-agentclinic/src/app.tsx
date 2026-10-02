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
import { WriteReview } from "./pages/WriteReview";
import { NotFound } from "./pages/NotFound";
import { getAgent, getAilment, getTherapy } from "./data/seed";
import { getSlot } from "./data/slots";
import { addAppointment } from "./data/appointments";
import { addReview } from "./data/reviews";

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

// --- Reviews (public, per therapy) ---
// Nested under a therapy; the extra path segments mean these don't collide with
// GET /therapies/:id above. The therapy must resolve before we show the form.
app.get("/therapies/:id/reviews/new", (c) => {
  const therapy = getTherapy(c.req.param("id"));
  if (!therapy) {
    return c.html(<NotFound message="That therapy isn't on our list." />, 404);
  }
  return c.html(<WriteReview therapy={therapy} />);
});
app.post("/therapies/:id/reviews", async (c) => {
  const therapy = getTherapy(c.req.param("id"));
  if (!therapy) {
    return c.html(<NotFound message="That therapy isn't on our list." />, 404);
  }

  const body = await c.req.parseBody();
  const agentId = String(body.agentId ?? "");
  const ratingRaw = String(body.rating ?? "");
  const rating = Number(ratingRaw);
  const note = String(body.note ?? "").trim();

  // Agent must resolve, rating must be an integer 1–5, note must be non-empty.
  const validRating = Number.isInteger(rating) && rating >= 1 && rating <= 5;
  if (!getAgent(agentId) || !validRating || note === "") {
    return c.html(
      <WriteReview
        therapy={therapy}
        error="Please pick an agent, a rating from 1 to 5, and write a short note."
        selected={{ agentId, rating: ratingRaw, note }}
      />,
      400,
    );
  }

  addReview({ agentId, therapyId: therapy.id, rating, note });
  return c.redirect(`/therapies/${therapy.id}`, 303);
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
