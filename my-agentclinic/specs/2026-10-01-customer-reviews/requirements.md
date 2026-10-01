# Requirements — Phase 7: Customer reviews

## Roadmap phase

This is **Phase 7 — Customer reviews** from `specs/roadmap.md`. The MVP (Phases
1–3) shipped the clinic shell and booking; Phase 4 moved data onto SQLite. This
phase lets agents leave **public reviews** (a rating + a note) for a **therapy**,
and **surfaces those reviews on the relevant therapy pages** with an average
rating — in-world social proof: agents vouching for what worked.

Reviews are distinct from Phase 6 feedback: feedback is a private, staff-facing
note about a *visit*; a **review is public**, attached to a *therapy*, and shown
to everyone browsing that therapy.

## Scope

In scope:

- Model a **Review**: an agent + a therapy + a rating + a public note, persisted
  to SQLite.
- **Leave a review** via a server-rendered form, reached from a therapy's page:
  - `GET /therapies/:id/reviews/new` — the form (agent dropdown, 1–5 rating,
    note textarea), pre-scoped to that therapy.
  - `POST /therapies/:id/reviews` — validate, persist, and redirect back to the
    therapy's detail page.
- **Surface reviews on therapy pages** — the therapy **detail** page
  (`GET /therapies/:id`) lists that therapy's reviews (newest first) and shows an
  **average rating + review count**; the therapies **index** (`/therapies`) shows
  each therapy's average rating (or "no reviews yet").

Out of scope (deferred):

- **Tying a review to a specific appointment/visit.** A review is attached to a
  therapy, not to a booked appointment — see Decisions. Revisit when visits become
  browseable.
- **Constraining reviewable therapies** to the agent's diagnosed ailments (the
  agent→ailment→therapy path) — a knowingly relaxed simplification, as elsewhere.
- **Editing / deleting / moderating** reviews; staff replies; helpful-votes;
  verifying the reviewer actually booked the therapy.
- Auth / identity of reviewers beyond picking an agent from the roster.

## Decisions

- **A review is tied to a therapy.** The form offers every agent in a free
  dropdown and is pre-scoped to the therapy whose page it was opened from; the
  agent gives a **1–5 rating** and a public **note**. Chosen over tying reviews to
  a specific appointment because it is the simplest model that satisfies the
  roadmap's "surface reviews on the relevant therapy pages," and it mirrors the
  deliberate "any agent" simplicity used for booking and feedback. Linking reviews
  to a real visit is a clean post-phase enhancement.
- **Storage = SQLite, mirroring prior features.** A new `review` table created
  idempotently through the existing `src/data/db.ts`, accessed only via helpers in
  a new `src/data/reviews.ts`. Chosen because Phase 4 established persistence as
  the norm — public reviews must survive restarts.
- **Review model:** `{ id, agentId, therapyId, rating, note, createdAt }`, where
  `id` is generated; `agentId` / `therapyId` reference existing entities (resolved
  for rendering); `rating` is an integer 1–5; `note` is public free text;
  `createdAt` is an ISO string set at insert, used to order newest-first.
- **Averages via a GROUP BY aggregate.** Per-therapy average and count come from a
  single prepared `SELECT therapyId, AVG(rating) AS avgRating, COUNT(*) AS n FROM
  review GROUP BY therapyId` (verified against current `better-sqlite3` docs —
  plain SQL aggregates, no custom `db.aggregate`). The detail page uses the single
  therapy's figures; the index maps results by `therapyId`. Present the average
  rounded to one decimal; show "No reviews yet" when count is 0.
- **Validation on POST:** `agentId` must resolve to a real agent, the `:id`
  therapy must resolve, `rating` must be an integer in **1–5**, and `note` must be
  non-empty (after trim). On any invalid/missing field, re-render the form with a
  friendly on-brand message and HTTP **400** (nothing persisted). On success,
  **redirect (303)** to `/therapies/:id`.
- **Rendering / styling:** Hono JSX on the existing `Layout` and `TherapyDetail`
  page; Pico CSS styles the `<form>`, rating control, and the review list for free.

## Context & constraints

- Keep it **small, legible, and demo-friendly** — teaching project + conference
  booth demo (`specs/mission.md`); reviews are a satisfying, visible thing to show.
- **Metaphor-forward:** review copy stays warm and in-world ("vouch for what gave
  you relief").
- **Reliable over clever:** no new dependencies; reuse the existing stack (Hono,
  Hono JSX, `better-sqlite3`, Vitest, Pico).
- The app must remain in a **working, shippable state** at the end of the phase.

## Dependencies to add

- None expected. Uses the existing stack. Any new dependency must earn its place.
