import type { Review } from "../domain/types";
import { db } from "./db";

// Review store, backed by SQLite (src/data/db.ts). Public reviews an agent
// leaves for a therapy; they persist across restarts like appointments. The
// route owns validation (agent/therapy ids resolve, rating is 1–5, note is
// non-empty), so the store stays thin.
//
// Per-therapy averages use plain SQL aggregates (AVG/COUNT ... GROUP BY) rather
// than a custom aggregate function — the simplest, fastest option for this.

const insertReview = db.prepare(
  "INSERT INTO reviews (agent_id, therapy_id, rating, note, created_at) VALUES (?, ?, ?, ?, ?)",
);
const selectReviewsForTherapy = db.prepare(
  "SELECT id, agent_id, therapy_id, rating, note, created_at FROM reviews WHERE therapy_id = ? ORDER BY created_at DESC, id DESC",
);
const selectSummaryForTherapy = db.prepare(
  "SELECT AVG(rating) AS avg, COUNT(*) AS n FROM reviews WHERE therapy_id = ?",
);
const selectAllSummaries = db.prepare(
  "SELECT therapy_id, AVG(rating) AS avg, COUNT(*) AS n FROM reviews GROUP BY therapy_id",
);

type ReviewRow = {
  id: number;
  agent_id: string;
  therapy_id: string;
  rating: number;
  note: string;
  created_at: string;
};

const toReview = (row: ReviewRow): Review => ({
  id: String(row.id),
  agentId: row.agent_id,
  therapyId: row.therapy_id,
  rating: row.rating,
  note: row.note,
  createdAt: row.created_at,
});

// Average rating and how many reviews a therapy has. `avg` is null when there
// are no reviews yet (SQLite AVG over zero rows), which callers treat as "no
// reviews yet".
export type RatingSummary = { avg: number | null; n: number };

// Create and store a review. Ids/values are assumed already validated by the
// caller (the route owns validation); the store stays thin. `createdAt` is
// stamped here so ordering is consistent.
export const addReview = (input: {
  agentId: string;
  therapyId: string;
  rating: number;
  note: string;
}): Review => {
  const createdAt = new Date().toISOString();
  const info = insertReview.run(
    input.agentId,
    input.therapyId,
    input.rating,
    input.note,
    createdAt,
  );
  return { id: String(info.lastInsertRowid), createdAt, ...input };
};

// A therapy's reviews, newest first.
export const listReviewsForTherapy = (therapyId: string): Review[] =>
  (selectReviewsForTherapy.all(therapyId) as ReviewRow[]).map(toReview);

// Average rating + count for one therapy.
export const getRatingSummary = (therapyId: string): RatingSummary =>
  selectSummaryForTherapy.get(therapyId) as RatingSummary;

// Average rating + count for every therapy that has at least one review,
// keyed by therapy id — for the therapies index.
export const getAllRatingSummaries = (): Map<string, RatingSummary> => {
  const rows = selectAllSummaries.all() as (RatingSummary & {
    therapy_id: string;
  })[];
  return new Map(rows.map((r) => [r.therapy_id, { avg: r.avg, n: r.n }]));
};
