# Plan — Phase 2: Layout, agents, ailments & therapies

Numbered task groups. Each group leaves the repo runnable; the phase ends with
the three entities browsable and cross-linked on the existing shell.

## 1. Domain models

1.1. Create `src/domain/types.ts` defining `Agent`, `Ailment`, and `Therapy`
     TypeScript types (strict mode).
1.2. Model relationships by id reference: an `Agent` carries `ailmentIds`, an
     `Ailment` carries `therapyIds` (and each entity has a slug `id`, `name`, and
     short on-brand `description`/`summary`).

## 2. Seed data & lookups

2.1. Create `src/data/seed.ts` with in-memory static seed arrays for agents,
     ailments, and therapies — enough to be interesting in a demo (e.g. 3–5 of
     each), with metaphor-forward, playful names and copy.
2.2. Add small lookup/relationship helpers (e.g. `getAgent(id)`,
     `getAilmentsForAgent(agent)`, `getTherapiesForAilment(ailment)`,
     `getAilmentsForTherapy(therapy)`) so pages don't reach into raw arrays.

## 3. Pages (Hono JSX, on the existing Layout)

3.1. `src/pages/Agents.tsx` — agents list: each agent links to their detail page.
3.2. `src/pages/AgentDetail.tsx` — one agent + their diagnosed ailments, each
     ailment linking to its ailment detail page.
3.3. `src/pages/Ailments.tsx` — ailments list, linking to ailment detail.
3.4. `src/pages/AilmentDetail.tsx` — one ailment + the therapy(ies) that treat it
     (and which agents have it), cross-linked.
3.5. `src/pages/Therapies.tsx` — therapies list, linking to therapy detail.
3.6. `src/pages/TherapyDetail.tsx` — one therapy + the ailment(s) it treats,
     cross-linked back to ailments.
3.7. A small, friendly on-brand **404** page component for unknown ids.

## 4. Routes

4.1. In `src/app.tsx`, add `GET /agents`, `GET /agents/:id`, `GET /ailments`,
     `GET /ailments/:id`, `GET /therapies`, and `GET /therapies/:id`, each
     rendering the matching page.
4.2. Detail routes look up by `:id`; on a miss, return the 404 page with HTTP
     **404**.
4.3. Keep existing `GET /` and `GET /health` untouched.

## 5. Navigation & shell wiring

5.1. Add header nav links to the three list pages (`/agents`, `/ailments`,
     `/therapies`) in the existing `Header` component, using semantic `<nav>`
     markup so Pico styles it — links only, no redesign.
5.2. Optionally surface entry points from the home page so the demo flows from
     `/` into the new sections.

## 6. Styling — Pico CSS

6.1. Add the Pico CSS **classless** stylesheet via a `<link>` in the layout
     `<head>` (`src/components/Layout.tsx`), before the existing
     `static/style.css` link so project overrides win.
6.2. Ensure pages use semantic HTML that Pico styles for free — wrap the body in
     a Pico `<main class="container">` (or equivalent) and use `<article>` for
     cards, `<table>` for tabular lists, `<nav>` for the header nav.
6.3. Trim `static/style.css` to only small, project-specific overrides (clinic
     accent color, spacing) layered after Pico; remove base rules Pico now
     provides. No new npm dependency, no build step.

## 7. Tests & validation

7.1. Add Vitest tests hitting `app.request(...)` for each new route: 200 status,
     and body contains expected entity names / cross-links.
7.2. Add a test that an unknown detail id returns **404**.
7.3. Ensure `tsc` (strict) and `npm run build` pass; run `npm test`.

## 8. Docs

8.1. Update `README.md` with the new routes and a one-line description of the
     agents / ailments / therapies sections.
