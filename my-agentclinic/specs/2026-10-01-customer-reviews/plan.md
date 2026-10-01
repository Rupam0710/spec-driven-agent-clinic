# Plan — Phase 7: Customer reviews

Numbered task groups. Each group leaves the repo runnable; the phase ends with an
agent able to leave a public review on a therapy and everyone seeing that
therapy's reviews and average rating. Built to mirror the appointments/feedback
features and the Phase 4 SQLite pattern. The `better-sqlite3` API below was
checked against current docs (prepared `.run()` / `.all()`, SQL `AVG`/`COUNT`
aggregates).

## 1. Domain model

1.1. In `src/domain/types.ts`, add a `Review` type
     (`{ id, agentId, therapyId, rating, note, createdAt }`), where `rating` is a
     number (1–5), `note` is a string, and `createdAt` is an ISO string used for
     sorting newest-first.

## 2. Persistence — schema (SQLite)

2.1. In `src/data/db.ts`, add a `review` table to the schema created on first run:
     `id TEXT PRIMARY KEY`, `agentId TEXT NOT NULL`, `therapyId TEXT NOT NULL`,
     `rating INTEGER NOT NULL`, `note TEXT NOT NULL`, `createdAt TEXT NOT NULL`,
     with foreign-key references to the agents and therapies tables. Keep creation
     idempotent (`CREATE TABLE IF NOT EXISTS`), matching the existing tables.
2.2. No reference-data seeding — reviews are user-generated and start empty.

## 3. Reviews store (SQLite accessors)

3.1. Create `src/data/reviews.ts` mirroring `src/data/appointments.ts`:
     - `addReview({ agentId, therapyId, rating, note })` — prepared `INSERT`
       (`db.prepare('INSERT INTO review (...) VALUES (?,...)').run(...)`),
       generating `id` and setting `createdAt` to the current ISO timestamp;
       returns the created row.
     - `listReviewsForTherapy(therapyId)` — prepared `SELECT ... WHERE therapyId=?
       ORDER BY createdAt DESC`, returns all reviews for one therapy.
3.2. Add rating aggregates:
     - `getRatingSummary(therapyId)` — `SELECT AVG(rating) AS avg, COUNT(*) AS n
       FROM review WHERE therapyId = ?`; returns `{ avg, n }` (avg null/0 when
       `n === 0`).
     - `getAllRatingSummaries()` — `SELECT therapyId, AVG(rating) AS avg,
       COUNT(*) AS n FROM review GROUP BY therapyId`; return as a `Map` keyed by
       `therapyId` for the therapies index.
3.3. Keep the store thin — the route owns validation (consistent with the other
     stores).

## 4. Pages (Hono JSX, on the existing Layout)

4.1. `src/pages/WriteReview.tsx` — the review form: `<form method="post"
     action="/therapies/:id/reviews">` with an agent `<select>`, a 1–5 rating
     control, and a `<textarea>` for the note; shows which therapy is being
     reviewed. Accepts an optional `error` prop and pre-selected values to
     re-render after a failed submit.
4.2. Update `src/pages/TherapyDetail.tsx` to show, below the therapy's details:
     the **average rating + count** (from `getRatingSummary`, "No reviews yet"
     when none), a **list of reviews** (agent linked, rating, note, timestamp,
     newest first), and a prominent **"Write a review"** link to
     `/therapies/:id/reviews/new`.
4.3. Update `src/pages/Therapies.tsx` so each therapy row shows its average rating
     (from `getAllRatingSummaries`), or a quiet "No reviews yet".

## 5. Routes

5.1. In `src/app.tsx` add (register these **before** the existing
     `GET /therapies/:id` is relied upon for data — order the two new GETs so
     `/therapies/:id/reviews/new` is matched, not shadowed):
     - `GET /therapies/:id/reviews/new` → 404 via `NotFound` if the therapy
       doesn't resolve; otherwise render `WriteReview` for that therapy.
     - `POST /therapies/:id/reviews` → parse the body (`c.req.parseBody()`);
       validate the `:id` therapy resolves, `agentId` resolves, `rating` is an
       integer 1–5, and `note` is non-empty after trim; on success call
       `addReview(...)` and **redirect 303** to `/therapies/:id`; on failure
       re-render `WriteReview` with a friendly message and HTTP **400**.
5.2. Update the existing `GET /therapies/:id` handler to pass the therapy's
     reviews and rating summary into `TherapyDetail`, and `GET /therapies` to pass
     the summaries map into `Therapies`.
5.3. Keep existing routes and the global `app.notFound()` handler intact.

## 6. Navigation & entry points

6.1. The primary entry point is the "Write a review" link on each therapy detail
     page (4.2) — no new header nav needed, since reviews live under therapies.
6.2. Optionally surface the average rating on the home page's therapy highlights
     if one exists.

## 7. Styling (minimal)

7.1. Rely on Pico CSS for the `<form>`, rating control, and review list/cards. Add
     to `static/style.css` only for a small rating-display tweak if needed — no new
     framework, no build step.

## 8. Tests & validation (Vitest)

8.1. Test `GET /therapies/:id/reviews/new` (200; form has agent options, a rating
     control, a note field) and that an unknown therapy id → 404.
8.2. Test a successful `POST /therapies/:id/reviews` with valid values → 303
     redirect to `/therapies/:id`, and that the review then appears on the therapy
     detail page (agent cross-link, rating, note) and the average updates.
8.3. Test an invalid `POST` (unknown agent, out-of-range/missing rating, empty
     note, or unknown therapy) → 400 and no review persisted.
8.4. Test that `/therapies` shows a therapy's average rating once it has reviews.
8.5. Add a restart-persistence check for reviews alongside
     `src/persistence.test.ts` (temp-file DB): a submitted review survives
     reopening the database.
8.6. Ensure `tsc` (strict) passes and `npm run build` is clean; run `npm test`
     (existing Phase 1–6 tests stay green).

## 9. Docs & roadmap

9.1. Update `README.md` with the new review routes and a one-line note that
     reviews persist in SQLite and appear on therapy pages.
9.2. As part of the merge, mark **Phase 7 done** in `specs/roadmap.md`.
