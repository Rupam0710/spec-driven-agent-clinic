# Requirements — Phase 6: Feedback form

## Roadmap phase

This is **Phase 6 — Feedback form** from `specs/roadmap.md`, the first item on the
current backlog (tagged "TODO: Now"). The MVP (Phases 1–3) shipped the clinic
shell and the booking flow; Phase 4 moved everything onto SQLite so data outlives
the process. This phase lets an agent **leave feedback about their visit** and
gives staff a place to **review submitted feedback** — closing the loop after an
appointment.

Phase 5 (Booking polish) is still open on the roadmap but is **not** this phase;
nothing here depends on it.

## Scope

In scope:

- Model **Feedback**: an agent + a rating + a comment, persisted to SQLite.
- **Leave feedback** via a server-rendered form:
  - `GET /feedback/new` — the form (agent dropdown, 1–5 rating, comment textarea).
  - `POST /feedback` — validate the submission, persist it, and redirect to the
    staff-facing feedback list.
- **Review feedback (staff-facing)** — `GET /feedback` lists submitted feedback,
  newest first, each row showing the agent (cross-linked), the rating, the
  comment, and when it was left.
- Navigation: a header link to `/feedback`; a "Leave feedback" entry point (e.g.
  from `/feedback` and/or an agent/appointment page).

Out of scope (deferred):

- **Tying feedback to a specific appointment.** Feedback is free-standing (agent +
  rating + comment), not linked to a booked appointment — see Decisions. Revisit
  once visits are a first-class, browseable thing.
- **Editing or deleting** feedback; moderation; staff replies.
- **Public display** of feedback/reviews on therapy pages — that is Phase 7
  (Customer reviews), a separate phase.
- Auth / identifying who is "staff" (the review view is simply an unguarded page
  for now); rate-limiting; spam protection.

## Decisions

- **Feedback shape = agent + rating + comment.** The form offers every agent in a
  free dropdown, a **1–5 rating**, and a free-text **comment**. Chosen over tying
  feedback to a specific appointment because it is the simplest thing that closes
  the loop and mirrors the appointments feature's deliberate "any agent" MVP
  simplicity (no appointment-selection UI, no coupling to the booking records).
  Linking feedback to a visit is a clean post-phase enhancement.
- **Storage = SQLite, mirroring appointments.** A new `feedback` table created and
  seeded (empty) idempotently through the existing `src/data/db.ts`, accessed only
  via helper functions in a new `src/data/feedback.ts` (same pattern as
  appointments). Chosen over an in-memory array because Phase 4 established
  persistence as the norm — feedback must survive a restart, and regressing to
  in-memory would be a step backwards.
- **Feedback model:** `{ id, agentId, rating, comment, createdAt }`, where `id` is
  a generated unique id; `agentId` references an existing agent (resolved for
  rendering); `rating` is an integer 1–5; `comment` is free text; `createdAt` is
  an ISO string set at insert time, used to order the list newest-first.
- **Validation on POST:** `agentId` must resolve to a real agent, `rating` must be
  an integer in **1–5**, and `comment` must be non-empty (after trim). On any
  invalid/missing field, re-render the form with a friendly on-brand message and
  HTTP **400** (nothing persisted). On success, **redirect (303)** to `/feedback`.
- **"Review" ordering** = all feedback sorted by `createdAt` **descending**
  (newest first), so staff see the latest visit sentiment at the top.
- **Rendering / styling:** Hono JSX on the existing `Layout`; Pico CSS styles the
  `<form>`, `<select>`, `<textarea>`, and the list/table markup for free (semantic
  HTML, no new CSS unless a small tweak is needed).

## Context & constraints

- Keep it **small, legible, and demo-friendly** — teaching project + conference
  booth demo (`specs/mission.md`).
- **Metaphor-forward:** feedback copy stays warm and playful ("how was your
  visit?"), consistent with the clinic voice.
- **Reliable over clever:** no new dependencies; reuse the existing stack (Hono,
  Hono JSX, `better-sqlite3`, Vitest, Pico).
- The app must remain in a **working, shippable state** at the end of the phase.

## Dependencies to add

- None expected. Uses the existing stack. Any new dependency must earn its place.
