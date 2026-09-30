# Roadmap

High-level implementation order, in **very small phases**. We build a *walking
skeleton* first — a bare app that runs — then add one thin capability per phase.
Each phase leaves the app in a working, shippable state.

## Phase 1 — Hello, clinic (walking skeleton) ✅

- Add Hono; stand up a server that starts and responds.
- One route (`/`) returns a simple server-rendered HTML page: "AgentClinic".
- Dev/run scripts working end to end.

_Goal: the app runs in a browser and says hello._ **Done.**

## Phase 2 — Layout, agents, ailments & therapies ✅

- Shared HTML layout (header, footer, clinic branding), server-rendered, with
  basic styling so the site looks intentional in a modern browser.
- Model an **agent**; list agents and view a single agent's page
  (static/in-memory data for now).
- Model an **ailment** and associate ailments with agents; show an agent's
  ailments on their page and list ailments.
- Model a **therapy** and link therapies to ailments; browse therapies and see
  which therapy treats which ailment.

_Goal: a consistent shell where you can see agents, their diagnosed ailments,
and the therapy that treats each ailment._

## Phase 3 — Appointments (booking) ✅

- Model an **appointment**.
- Book an appointment (agent + therapy + time); list upcoming appointments.

_Goal: agents can book their way to relief._ **Done — this completes the MVP.**
Appointments are held in memory (reset on restart); real persistence is below.

## Later (beyond MVP)

Recommended order, now that the MVP is done (see the appointments spec's
"Clarifications" section for the reasoning):

1. **Persistence (SQLite).** The data shape is stable and appointments currently
   reset on restart, so this is the recommended next step. See `tech-stack.md`.
2. **Constrain booking to the metaphor.** Optionally limit the therapy choices to
   those that treat the selected agent's diagnosed ailments (agent → ailment →
   therapy), and add booking-confirmation feedback + appointment detail/cancel.
3. **Staff/agent dashboard** for easy access.
4. **Polish pass** on visual design.

_Order may shift as we learn; the rule stays: small phases, always runnable._
