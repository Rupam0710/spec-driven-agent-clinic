# Roadmap

High-level implementation order, in **very small phases**. We build a *walking
skeleton* first — a bare app that runs — then add one thin capability per phase.
Each phase leaves the app in a working, shippable state.

## Phase 1 — Hello, clinic (walking skeleton)

- Add Hono; stand up a server that starts and responds.
- One route (`/`) returns a simple server-rendered HTML page: "AgentClinic".
- Dev/run scripts working end to end.

_Goal: the app runs in a browser and says hello._

## Phase 2 — Layout & shell

- Shared HTML layout (header, footer, clinic branding), server-rendered.
- Basic styling so the site looks intentional in a modern browser.

_Goal: a consistent, attractive shell to hang features on._

## Phase 3 — Agents

- Model an **agent**.
- List agents; view a single agent's page (static/in-memory data for now).

_Goal: you can see the agents visiting the clinic._

## Phase 4 — Ailments

- Model an **ailment** and associate ailments with agents.
- Show an agent's ailments on their page; list ailments.

_Goal: agents have diagnosed ailments._

## Phase 5 — Therapies

- Model a **therapy** and link therapies to ailments.
- Browse therapies; see which therapy treats which ailment.

_Goal: every ailment has a path to relief._

## Phase 6 — Appointments (booking)

- Model an **appointment**.
- Book an appointment (agent + therapy + time); list upcoming appointments.

_Goal: agents can book their way to relief._

## Later (beyond MVP)

- Introduce persistence (storage layer) once the shape of the data is stable.
- Staff/agent **dashboard** for easy access.
- Polish pass on visual design.

_Order may shift as we learn; the rule stays: small phases, always runnable._
