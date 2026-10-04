import { describe, it, expect, beforeEach } from "vitest";
import { app } from "./app";
import { db } from "./data/db";
import {
  addReview,
  getAllRatingSummaries,
  getRatingSummary,
  listReviewsForTherapy,
} from "./data/reviews";
import { addAppointment, listAppointments } from "./data/appointments";

// Edge cases for validation, review aggregation, and appointment ordering.
// Unlike app.test.ts these don't rely on test order: every test starts from
// empty reviews/appointments tables (reference data stays seeded).
beforeEach(() => {
  db.exec("DELETE FROM reviews; DELETE FROM appointments;");
});

const postForm = (path: string, fields: Record<string, string>) =>
  app.request(path, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields).toString(),
  });

describe("Review POST validation", () => {
  const post = (fields: Record<string, string>, therapyId = "rubber-duck-sessions") =>
    postForm(`/therapies/${therapyId}/reviews`, fields);
  const valid = { agentId: "claude", rating: "4", note: "Solid." };

  it.each([
    ["unknown agent", { ...valid, agentId: "nobody" }],
    ["missing agent", { rating: "4", note: "Solid." }],
    ["missing rating", { agentId: "claude", note: "Solid." }],
    ["empty rating", { ...valid, rating: "" }],
    ["rating zero", { ...valid, rating: "0" }],
    ["rating above range", { ...valid, rating: "6" }],
    ["negative rating", { ...valid, rating: "-1" }],
    ["fractional rating", { ...valid, rating: "3.5" }],
    ["non-numeric rating", { ...valid, rating: "abc" }],
    ["missing note", { agentId: "claude", rating: "4" }],
    ["whitespace-only note", { ...valid, note: "  \n\t " }],
  ])("rejects %s with 400 and stores nothing", async (_name, fields) => {
    const res = await post(fields);
    expect(res.status).toBe(400);
    expect(await res.text()).toContain("Please pick an agent, a rating from 1 to 5");
    expect(listReviewsForTherapy("rubber-duck-sessions")).toHaveLength(0);
  });

  it.each(["1", "5"])("accepts the boundary rating %s", async (rating) => {
    const res = await post({ ...valid, rating });
    expect(res.status).toBe(303);
    expect(listReviewsForTherapy("rubber-duck-sessions")[0].rating).toBe(Number(rating));
  });

  it("returns 404 when posting to an unknown therapy", async () => {
    const res = await post(valid, "nope");
    expect(res.status).toBe(404);
  });

  it("re-renders the form pre-filled with the submitted values on error", async () => {
    const res = await post({ agentId: "gpt", rating: "9", note: "Keep me" });
    expect(res.status).toBe(400);
    const body = await res.text();
    expect(body).toMatch(/<option value="gpt"[^>]*selected/);
    expect(body).toContain("Keep me");
  });

  it("trims the note before storing", async () => {
    await post({ ...valid, note: "  padded  " });
    expect(listReviewsForTherapy("rubber-duck-sessions")[0].note).toBe("padded");
  });

  it("escapes HTML in the note when displayed", async () => {
    await post({ ...valid, note: "<script>alert(1)</script>" });
    const body = await (await app.request("/therapies/rubber-duck-sessions")).text();
    expect(body).not.toContain("<script>alert(1)</script>");
    expect(body).toContain("&lt;script&gt;");
  });
});

describe("Booking POST validation", () => {
  const post = (fields: Record<string, string>) => postForm("/appointments", fields);
  const valid = {
    agentId: "claude",
    therapyId: "rubber-duck-sessions",
    slotId: "mon-am",
  };

  it.each([
    ["unknown agent", { ...valid, agentId: "nobody" }],
    ["unknown therapy", { ...valid, therapyId: "nope" }],
    ["unknown slot", { ...valid, slotId: "sun-3am" }],
    ["missing agent", { therapyId: valid.therapyId, slotId: valid.slotId }],
    ["missing slot", { agentId: valid.agentId, therapyId: valid.therapyId }],
    ["empty body", {}],
  ])("rejects %s with 400 and books nothing", async (_name, fields) => {
    const res = await post(fields);
    expect(res.status).toBe(400);
    expect(await res.text()).toContain("Please choose an agent, a therapy, and a time slot.");
    expect(listAppointments()).toHaveLength(0);
  });

  it("re-renders the form pre-filled with the submitted values on error", async () => {
    const res = await post({ ...valid, slotId: "bogus" });
    const body = await res.text();
    expect(body).toMatch(/<option value="claude"[^>]*selected/);
    expect(body).toMatch(/<option value="rubber-duck-sessions"[^>]*selected/);
  });
});

describe("Review aggregation", () => {
  const review = (therapyId: string, rating: number, note = "ok") =>
    addReview({ agentId: "claude", therapyId, rating, note });

  it("reports a null average and zero count when there are no reviews", () => {
    expect(getRatingSummary("rubber-duck-sessions")).toEqual({ avg: null, n: 0 });
  });

  it("averages multiple ratings and counts them", () => {
    review("rubber-duck-sessions", 5);
    review("rubber-duck-sessions", 4);
    review("rubber-duck-sessions", 2);
    const { avg, n } = getRatingSummary("rubber-duck-sessions");
    expect(n).toBe(3);
    expect(avg).toBeCloseTo(11 / 3);
  });

  it("keeps reviews and summaries separate per therapy", () => {
    review("rubber-duck-sessions", 5);
    review("temperature-regulation", 1);
    expect(getRatingSummary("rubber-duck-sessions")).toEqual({ avg: 5, n: 1 });
    expect(getRatingSummary("temperature-regulation")).toEqual({ avg: 1, n: 1 });
    expect(listReviewsForTherapy("rubber-duck-sessions")).toHaveLength(1);
  });

  it("getAllRatingSummaries includes only therapies that have reviews", () => {
    review("rubber-duck-sessions", 4);
    review("rubber-duck-sessions", 2);
    const all = getAllRatingSummaries();
    expect([...all.keys()]).toEqual(["rubber-duck-sessions"]);
    expect(all.get("rubber-duck-sessions")).toEqual({ avg: 3, n: 2 });
  });

  it("lists reviews newest first", () => {
    const first = review("rubber-duck-sessions", 3, "first");
    const second = review("rubber-duck-sessions", 4, "second");
    const ids = listReviewsForTherapy("rubber-duck-sessions").map((r) => r.id);
    expect(ids).toEqual([second.id, first.id]);
  });

  it("uses singular 'review' for one and plural for several on the page", async () => {
    review("rubber-duck-sessions", 5);
    let body = await (await app.request("/therapies/rubber-duck-sessions")).text();
    expect(body).toMatch(/1 review(?!s)/);

    review("rubber-duck-sessions", 3);
    body = await (await app.request("/therapies/rubber-duck-sessions")).text();
    expect(body).toContain("4.0 / 5");
    expect(body).toContain("2 reviews");
  });

  it("links to the write-review form from the therapy page", async () => {
    const body = await (await app.request("/therapies/rubber-duck-sessions")).text();
    expect(body).toContain('href="/therapies/rubber-duck-sessions/reviews/new"');
  });

  it("rejects a review for a nonexistent therapy at the database level", () => {
    expect(() => review("nope", 3)).toThrow();
  });
});

describe("Appointment ordering", () => {
  it("lists appointments soonest slot first regardless of booking order", () => {
    const book = (slotId: string) =>
      addAppointment({ agentId: "claude", therapyId: "rubber-duck-sessions", slotId });
    book("fri-am");
    book("mon-am");
    book("wed-am");
    expect(listAppointments().map((a) => a.slotId)).toEqual(["mon-am", "wed-am", "fri-am"]);
  });

  it("shows the soonest appointment first on the page", async () => {
    addAppointment({ agentId: "claude", therapyId: "rubber-duck-sessions", slotId: "thu-pm" });
    addAppointment({ agentId: "claude", therapyId: "rubber-duck-sessions", slotId: "mon-pm" });
    const body = await (await app.request("/appointments")).text();
    expect(body.indexOf("Monday, 14:00")).toBeGreaterThan(-1);
    expect(body.indexOf("Monday, 14:00")).toBeLessThan(body.indexOf("Thursday, 16:00"));
  });
});
