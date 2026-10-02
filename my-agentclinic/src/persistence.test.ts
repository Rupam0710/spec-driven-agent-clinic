import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Phase 4's promise: booked appointments outlive the process. The rest of the
// suite runs against an in-memory database; here we use a temp *file* so we can
// close the connection ("shut down") and reopen it ("restart") and prove the
// row is still there. vi.resetModules() forces src/data/db.ts to re-evaluate and
// open a brand-new connection to the same file, standing in for a restart.

describe("Persistence (appointments survive a restart)", () => {
  let dir: string;
  let dbPath: string;

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "agentclinic-"));
    dbPath = join(dir, "clinic.db");
    process.env.DATABASE_PATH = dbPath;
  });

  afterAll(() => {
    delete process.env.DATABASE_PATH;
    rmSync(dir, { recursive: true, force: true });
  });

  it("keeps an appointment booked before the restart", async () => {
    // First run: seed + book, then close the connection to flush to disk.
    vi.resetModules();
    {
      const { db } = await import("./data/db");
      const { addAppointment, listAppointments } = await import(
        "./data/appointments"
      );
      expect(listAppointments()).toHaveLength(0);
      addAppointment({
        agentId: "claude",
        therapyId: "rubber-duck-sessions",
        slotId: "mon-am",
      });
      expect(listAppointments()).toHaveLength(1);
      db.close();
    }

    // Restart: a fresh module graph opens a new connection to the same file.
    vi.resetModules();
    {
      const { listAppointments } = await import("./data/appointments");
      const appointments = listAppointments();
      expect(appointments).toHaveLength(1);
      expect(appointments[0]).toMatchObject({
        agentId: "claude",
        therapyId: "rubber-duck-sessions",
        slotId: "mon-am",
      });
    }
  });

  it("does not re-seed reference data on restart (no duplicate agents)", async () => {
    vi.resetModules();
    const { getAgents } = await import("./data/seed");
    // Four agents were seeded on the very first run above; reopening the same
    // file must not seed them again.
    expect(getAgents()).toHaveLength(4);
  });

  it("keeps a posted review across a restart", async () => {
    // Post a review, close the connection to flush to disk...
    vi.resetModules();
    {
      const { db } = await import("./data/db");
      const { addReview, listReviewsForTherapy } = await import(
        "./data/reviews"
      );
      expect(listReviewsForTherapy("rubber-duck-sessions")).toHaveLength(0);
      addReview({
        agentId: "claude",
        therapyId: "rubber-duck-sessions",
        rating: 5,
        note: "Quacked my bug wide open.",
      });
      expect(listReviewsForTherapy("rubber-duck-sessions")).toHaveLength(1);
      db.close();
    }

    // ...then reopen the same file and confirm the review is still there.
    vi.resetModules();
    {
      const { listReviewsForTherapy, getRatingSummary } = await import(
        "./data/reviews"
      );
      const reviews = listReviewsForTherapy("rubber-duck-sessions");
      expect(reviews).toHaveLength(1);
      expect(reviews[0]).toMatchObject({
        agentId: "claude",
        therapyId: "rubber-duck-sessions",
        rating: 5,
        note: "Quacked my bug wide open.",
      });
      expect(getRatingSummary("rubber-duck-sessions")).toMatchObject({
        avg: 5,
        n: 1,
      });
    }
  });
});
