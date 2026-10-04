# Validation — Phase 7: Customer reviews

This phase is **done and mergeable** when all of the following pass. Each maps to
an acceptance criterion chosen for this phase.

## 1. Review form

- [ ] `GET /therapies/:id/reviews/new` for an existing therapy returns **200** and
      renders a `<form>` posting to `/therapies/:id/reviews` with: an agent
      `<select>`, a 1–5 rating control, and a note `<textarea>`.
- [ ] Every seeded agent appears as an option, and the form makes clear which
      therapy is being reviewed.
- [ ] `GET /therapies/:id/reviews/new` for an unknown therapy id returns a
      friendly **404**.

## 2. Leaving a review works (happy path)

- [ ] `POST /therapies/:id/reviews` with a valid `agentId`, a `rating` in 1–5, and
      a non-empty `note` persists one review and responds with a **303** redirect
      to `/therapies/:id`.
- [ ] Following the redirect, the therapy detail page shows the new review (agent
      link, rating, note, timestamp) and the updated **average rating + count**.

## 3. Invalid review rejected

- [ ] `POST /therapies/:id/reviews` with an unknown agent, a missing/out-of-range
      rating, an empty note, or an unknown therapy returns HTTP **400**,
      re-renders the form with a friendly on-brand message, and persists **no**
      review (the count is unchanged).

## 4. Reviews surfaced on therapy pages

- [ ] A therapy with no reviews shows a friendly "No reviews yet" state on both
      its detail page and the `/therapies` index.
- [ ] A therapy with reviews shows them **newest first** on its detail page, and
      its **average rating** (one decimal) appears on both the detail page and the
      `/therapies` index.
- [ ] All existing routes (`/`, `/health`, `/agents`, `/ailments`, `/therapies`,
      `/appointments`, `/feedback` if present, unmatched → friendly 404) still work
      unchanged.

## 5. Persistence

- [ ] A submitted review **survives a restart** — reopening the SQLite database
      returns the previously inserted review (covered by a temp-file test
      alongside `src/persistence.test.ts`).

## 6. Type-check & build pass

- [ ] `tsc` runs clean in **strict** mode — no type errors.
- [ ] `npm run build` produces `dist/` with no errors.

## 7. Automated tests (Vitest)

- [ ] Tests cover: the form (200 + fields; unknown therapy → 404), a successful
      POST (303 + appears on the therapy page with cross-link + average updates),
      an invalid POST (400 + not persisted), the index average display, and
      restart persistence.
- [ ] `npm test` runs the whole suite and it passes (Phase 1–6 tests still green;
      tests run against the in-memory database).

## 8. Manual browser check

- [ ] In a modern browser, opening a therapy page, clicking "Write a review", and
      submitting redirects back to the therapy page with the new review visible
      and the average updated — styled by Pico, no console/server errors.

## Merge gate

All sections green, on branch `customer-reviews`, with `README.md` updated (review
routes; reviews persist in SQLite and appear on therapy pages) and
`specs/roadmap.md` marking **Phase 7 done**. The app is left in a working,
shippable state.
