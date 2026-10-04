# Plan — Phase 6: Feedback form

Numbered task groups. Each group leaves the repo runnable; the phase ends with an
agent able to leave feedback about their visit and staff able to review it in a
list — closing the loop after an appointment. Built to mirror the appointments
feature and the Phase 4 SQLite pattern.

## 1. Domain model

1.1. In `src/domain/types.ts`, add a `Feedback` type
     (`{ id, agentId, rating, comment, createdAt }`), where `rating` is a number
     (1–5), `comment` is a string, and `createdAt` is an ISO string used for
     sorting newest-first.

## 2. Persistence — schema & seed (SQLite)

2.1. In `src/data/db.ts`, add a `feedback` table to the schema created on first
     run: columns `id TEXT PRIMARY KEY`, `agentId TEXT NOT NULL`,
     `rating INTEGER NOT NULL`, `comment TEXT NOT NULL`, `createdAt TEXT NOT NULL`,
     with a foreign-key reference to the agents table. Keep creation idempotent
     (`CREATE TABLE IF NOT EXISTS`), matching how the other tables are set up.
2.2. No reference-data seeding for feedback — the table starts empty (feedback is
     user-generated, not clinic reference data, like appointments).

## 3. Feedback store (SQLite accessors)

3.1. Create `src/data/feedback.ts` with helpers mirroring
     `src/data/appointments.ts`: `listFeedback()` (returns all feedback ordered by
     `createdAt` descending), `addFeedback({ agentId, rating, comment })`
     (generates an `id`, sets `createdAt` to the current ISO timestamp, inserts,
     returns the created row), and `getFeedback(id)` if useful.
3.2. `addFeedback` assumes ids/values are already validated by the route (route
     owns validation); keep the store thin, consistent with the appointments store.

## 4. Pages (Hono JSX, on the existing Layout)

4.1. `src/pages/Feedback.tsx` — the staff-facing review list: each row shows the
     agent (linked to the agent page), the rating, the comment, and `createdAt`,
     newest first; includes a prominent "Leave feedback" link to `/feedback/new`.
     Friendly empty state when none submitted ("No feedback yet…").
4.2. `src/pages/LeaveFeedback.tsx` — the form: `<form method="post"
     action="/feedback">` with an agent `<select>` (populated from the agent data
     helper), a 1–5 rating input (`<select>` or radio set), a `<textarea>` for the
     comment, and a submit button. Accepts an optional `error` prop and
     pre-selected values to re-render after a failed submit.

## 5. Routes

5.1. In `src/app.tsx` add:
     - `GET /feedback` → render the list (`listFeedback()`).
     - `GET /feedback/new` → render the empty feedback form.
     - `POST /feedback` → parse the form body (`c.req.parseBody()`); validate that
       `agentId` resolves to a real agent, `rating` is an integer 1–5, and
       `comment` is non-empty after trimming; on success call `addFeedback(...)`
       and **redirect 303** to `/feedback`; on failure re-render `LeaveFeedback`
       with a friendly message and HTTP **400**.
5.2. Keep existing routes and the global `app.notFound()` handler intact. Register
     `/feedback/new` so it isn't shadowed by any `:id` route (there is no
     `/feedback/:id` this phase).

## 6. Navigation & entry points

6.1. Add a "Feedback" link to the header nav (`src/components/Header.tsx`).
6.2. Optionally add a "Leave feedback" call-to-action on an agent page and/or the
     appointments list, so the demo flows naturally from a visit into feedback.

## 7. Styling (minimal)

7.1. Rely on Pico CSS to style the `<form>`, `<select>`, `<textarea>`, `<button>`,
     and the list/table for free. Add to `static/style.css` only if a small tweak
     is needed — no new framework, no build step.

## 8. Tests & validation (Vitest)

8.1. Test `GET /feedback` (200; empty state initially) and `GET /feedback/new`
     (200; form contains the agent options, a rating control, and a comment field).
8.2. Test a successful `POST /feedback` with valid values → 303 redirect to
     `/feedback`, and that the new feedback then appears in the list with its
     agent cross-link, rating, and comment.
8.3. Test an invalid `POST /feedback` (unknown `agentId`, out-of-range/missing
     `rating`, or empty `comment`) → 400 and no feedback persisted.
8.4. Add a restart-persistence check for feedback alongside the existing
     `src/persistence.test.ts` pattern (temp-file DB): a submitted feedback row
     survives reopening the database.
8.5. Ensure `tsc` (strict) passes and `npm run build` is clean; run `npm test`
     (existing Phase 1–4 tests stay green).

## 9. Docs & roadmap

9.1. Update `README.md` with the new feedback routes and a one-line note that
     feedback persists in SQLite.
9.2. As part of the merge, mark **Phase 6 done** in `specs/roadmap.md`.
