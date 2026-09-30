# Requirements — Phase 2: Layout, agents, ailments & therapies

## Roadmap phase

This is **Phase 2 — Layout, agents, ailments & therapies** from
`specs/roadmap.md`. The shared layout/shell already shipped as part of Phase 1
(`src/components/Layout.tsx`, `Header`, `Main`, `Footer`, plus base styling in
`static/style.css`), so this branch focuses on the **three domain entities** and
the relationships between them, rendered onto the existing shell.

_Goal (from the roadmap): a consistent shell where you can see agents, their
diagnosed ailments, and the therapy that treats each ailment._

## Scope

In scope:

- Model three domain entities as TypeScript types:
  - **Agent** — an AI agent visiting the clinic.
  - **Ailment** — a diagnosed condition, associated with agents.
  - **Therapy** — a treatment, linked to the ailment(s) it treats.
- **In-memory static seed data** for all three (see Decisions).
- Server-rendered pages / routes, cross-linked:
  - **Agents list** (`GET /agents`) — every agent, linking to their detail page.
  - **Agent detail** (`GET /agents/:id`) — one agent, showing their diagnosed
    **ailments**, each linking to the ailment (or the therapy that treats it).
  - **Ailments list** (`GET /ailments`) and **ailment detail**
    (`GET /ailments/:id`) — the ailment plus the **therapy** that treats it.
  - **Therapies list** (`GET /therapies`) and **therapy detail**
    (`GET /therapies/:id`) — the therapy plus the **ailment(s)** it treats.
- Navigation: header links to the three list pages; entity pages cross-link
  (agent → ailment → therapy and back).

Out of scope (deferred):

- **Appointments / booking** — that is Phase 3.
- **Persistence / SQLite** — data stays in-memory this phase; SQLite is
  introduced later once the data shape is stable (`specs/tech-stack.md`).
- **New layout/shell work** — the header/footer/shell already exist; only add
  the nav links needed to reach the new pages and wire in Pico CSS (see
  Decisions), no redesign.
- Auth, billing, multi-tenancy (non-goals for now).

## Decisions

- **Scope = three entities.** Layout is treated as done from Phase 1; this branch
  adds agents, ailments, therapies and their relationships.
- **Data = in-memory static seed.** Hardcoded TypeScript seed data in a small
  `src/data/` module. Matches the roadmap ("static/in-memory data for now") and
  `specs/tech-stack.md`, which defers SQLite until the data shape is stable. This
  keeps the phase small and demo-friendly.
- **Relationships:**
  - An **agent** has zero or more **ailments** (diagnosed conditions).
  - An **ailment** is treated by one or more **therapies**.
  - Links are modeled by id references in the seed data; helper lookups resolve
    them for rendering.
- **Pages = lists + details, cross-linked.** Each entity gets a list page and a
  detail page; pages link across the agent → ailment → therapy chain.
- **Rendering:** Hono JSX server-rendered pages on the existing `Layout`, per
  `specs/tech-stack.md` — no separate front-end build step.
- **Styling = Pico CSS.** Adopt **[Pico CSS](https://picocss.com/)** as the base
  stylesheet. Pico is *classless* — it styles semantic HTML (`<nav>`, `<article>`,
  `<table>`, headings, links) directly with almost no class markup, which keeps
  the JSX clean and demo-friendly and fits "reliable over clever." It is loaded
  from the classless CDN build via a `<link>` in the layout `<head>`; the
  existing `static/style.css` remains for small, project-specific overrides
  (clinic accent color, spacing) layered *after* Pico. No build step, no npm
  dependency added.
- **IDs:** stable, human-readable slug ids in the seed data (e.g. `"claude"`,
  `"context-overload"`) so URLs are legible in demos.
- **404s:** unknown `:id` on a detail route returns a friendly, on-brand 404.

## Context & constraints

- Keep it **small, legible, and demo-friendly** — teaching project + conference
  booth demo (`specs/mission.md`).
- **Metaphor-forward:** domain language (agents, ailments, therapies) shows up in
  the types, routes, and UI copy; keep the tone warm and playful.
- **Reliable over clever:** boring, dependable choices; no new heavy deps.
- The app must remain in a **working, shippable state** at the end of the phase.

## Dependencies to add

- None expected. Uses the existing stack (`hono`, `@hono/node-server`, `tsx`,
  `typescript`, `vitest`). Any new dependency must earn its place.
