# Validation — Phase 6: Feedback form

This phase is **done and mergeable** when all of the following pass. Each maps to
an acceptance criterion chosen for this phase.

## 1. Feedback form

- [ ] `GET /feedback/new` returns **200** and renders a `<form>` posting to
      `/feedback` with: an agent `<select>`, a 1–5 rating control, and a comment
      `<textarea>`.
- [ ] Every seeded agent appears as an option in the agent `<select>`.

## 2. Leaving feedback works (happy path)

- [ ] `POST /feedback` with a valid `agentId`, a `rating` in 1–5, and a non-empty
      `comment` persists one feedback row and responds with a **303** redirect to
      `/feedback`.
- [ ] Following the redirect, `GET /feedback` shows the new feedback with its
      rating, comment, a working link to the chosen agent, and its timestamp.

## 3. Invalid feedback rejected

- [ ] `POST /feedback` with an unknown `agentId`, a missing/out-of-range `rating`,
      or an empty `comment` returns HTTP **400**, re-renders the form with a
      friendly on-brand message, and persists **no** feedback (the list count is
      unchanged).

## 4. Review list

- [ ] `GET /feedback` returns **200**; with no submissions it shows a friendly
      empty state, and with several it lists them **newest first**.
- [ ] The header links to `/feedback`, and all existing routes (`/`, `/health`,
      `/agents`, `/ailments`, `/therapies`, `/appointments`, unmatched → friendly
      404) still work unchanged.

## 5. Persistence

- [ ] A submitted feedback row **survives a restart** — reopening the SQLite
      database returns the previously inserted feedback (covered by a temp-file
      test alongside `src/persistence.test.ts`).

## 6. Type-check & build pass

- [ ] `tsc` runs clean in **strict** mode — no type errors.
- [ ] `npm run build` produces `dist/` with no errors.

## 7. Automated tests (Vitest)

- [ ] Tests cover: the form (200 + agent options + rating + comment fields), a
      successful POST (303 + appears in list with agent cross-link), an invalid
      POST (400 + not persisted), and restart persistence.
- [ ] `npm test` runs the whole suite and it passes (Phase 1–4 tests still green;
      tests run against the in-memory database).

## 8. Manual browser check

- [ ] In a modern browser, submitting feedback from `/feedback/new` redirects to
      `/feedback` and the new entry is visible with the correct agent link,
      rating, and comment — styled by Pico, no console/server errors.

## Merge gate

All sections green, on branch `feedback-form`, with `README.md` updated (feedback
routes; feedback persists in SQLite) and `specs/roadmap.md` marking **Phase 6
done**. The app is left in a working, shippable state.
