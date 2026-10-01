# Roadmap

High-level implementation order, in **very small phases**. We build a *walking
skeleton* first — a bare app that runs — then add one thin capability per phase.
Each phase leaves the app in a working, shippable state. Order may shift as we
learn; the rule stays: small phases, always runnable.

## Phase 1 — Hello, clinic (walking skeleton) ✅

- Add Hono; stand up a server that starts and responds.
- One route (`/`) returns a simple server-rendered HTML page: "AgentClinic".
- Dev/run scripts working end to end.

_Goal: the app runs in a browser and says hello._ **Done.**

## Phase 2 — Layout, agents, ailments & therapies ✅

- Shared HTML layout (header, footer, clinic branding), server-rendered, styled
  so the site looks intentional in a modern browser.
- Model an **agent**; list agents and view a single agent's page (static /
  in-memory data for now).
- Model an **ailment** and associate ailments with agents; show an agent's
  ailments on their page and list ailments.
- Model a **therapy** and link therapies to ailments; browse therapies and see
  which therapy treats which ailment.

_Goal: a consistent shell where you can see agents, their diagnosed ailments, and
the therapy that treats each ailment._ **Done.**

## Phase 3 — Appointments (booking) ✅

- Model an **appointment**.
- Book an appointment (agent + therapy + time); list upcoming appointments.

_Goal: agents can book their way to relief._ **Done — this completes the MVP.**
Appointments are held in memory (reset on restart); real persistence is below.

## Phase 4 — Persistence (SQLite)

- Introduce SQLite (single local file) and move agents, ailments, therapies, and
  appointments off in-memory seed data.
- Seed the database on first run; appointments survive a restart.
- Tests run against an in-memory / temp-file database.

_Goal: data outlives the process. The highest-value next step — the data shape is
stable and booked appointments currently reset on restart (see `tech-stack.md`)._

## Phase 5 — Booking polish

- Constrain therapy choices at booking to those that treat the selected agent's
  diagnosed ailments (agent → ailment → therapy).
- Add booking-confirmation feedback, plus an appointment detail/cancel flow.

_Goal: booking respects the metaphor and feels finished._

## Phase 6 — Feedback form (TODO: Now)

- A form for agents to leave feedback about their visit; persist submissions.
- List/review submitted feedback (staff-facing view).

_Goal: close the loop after an appointment. First item on the current backlog._

## Phase 7 — Customer reviews (TODO: Next)

- Let agents leave public reviews (rating + note), tied to a therapy or visit.
- Surface reviews on the relevant therapy pages.

_Goal: social proof, in-world — agents vouch for what worked._

## Phase 8 — About-us page (TODO: Next)

- An "About the clinic" page with address and an embedded map.
- Link it from the shared layout's nav/footer.

_Goal: give the clinic a place in the world._

## Later (not yet scheduled)

- **Staff / agent dashboard** for easy access (Mary's original ask).
- **Design-polish pass** on the overall visual design.

_These stay unscheduled until the backlog above is cleared; the rule holds —
small phases, always runnable._
