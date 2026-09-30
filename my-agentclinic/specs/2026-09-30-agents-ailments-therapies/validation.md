# Validation — Phase 2: Layout, agents, ailments & therapies

Phase 2 is **done and mergeable** when all of the following pass. Each maps to an
acceptance criterion chosen for this phase.

## 1. Entities render & cross-link

- [ ] `GET /agents` returns **200** and lists every seeded agent, each linking to
      their detail page.
- [ ] `GET /agents/:id` returns **200** for a seeded agent and shows that agent's
      diagnosed **ailments**, each linking onward.
- [ ] `GET /ailments` and `GET /ailments/:id` return **200**; the detail page
      shows the **therapy(ies)** that treat the ailment.
- [ ] `GET /therapies` and `GET /therapies/:id` return **200**; the detail page
      shows the **ailment(s)** the therapy treats.
- [ ] The agent → ailment → therapy chain is navigable by links in both
      directions.

## 2. Unknown ids handled

- [ ] A detail route with an unknown `:id` (e.g. `/agents/nope`) returns HTTP
      **404** with a friendly, on-brand page (no server error / stack trace).

## 3. Navigation

- [ ] The header links to `/agents`, `/ailments`, and `/therapies`, and the
      existing `GET /` and `GET /health` still work unchanged.

## 4. Type-check & build pass

- [ ] `tsc` runs clean in **strict** mode — no type errors.
- [ ] `npm run build` produces `dist/` with no errors.

## 5. Automated tests (Vitest)

- [ ] A test hits each new route via `app.request(...)` and asserts **200** plus
      an expected entity name / cross-link in the body.
- [ ] A test asserts an unknown detail id returns **404**.
- [ ] `npm test` runs the suite and it passes (Phase 1 tests still green).

## 6. Manual browser check

- [ ] In a modern browser, the agents / ailments / therapies list and detail
      pages render correctly on the existing shell (header, footer, styling), and
      the cross-links between them work — no blank pages or console/server errors.
- [ ] **Pico CSS** is applied: the Pico stylesheet loads (semantic elements —
      nav, articles/cards, tables, headings — are styled), and the project
      `static/style.css` overrides layer on top without visual regressions.

## Merge gate

All sections green, on branch `phase-2-agents-ailments-therapies`, with
`README.md` updated to describe the new sections/routes. Data remains in-memory
(no SQLite yet). The app is left in a working, shippable state — ready for
Phase 3 (Appointments / booking).
