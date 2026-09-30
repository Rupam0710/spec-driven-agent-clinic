import { describe, it, expect } from "vitest";
import { app } from "./app";

describe("AgentClinic walking skeleton", () => {
  it("GET / returns 200 with an HTML page containing AgentClinic", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("AgentClinic");
  });

  it("GET /health returns { status: 'ok' }", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});

describe("Agents", () => {
  it("GET /agents lists agents and links to detail pages", async () => {
    const res = await app.request("/agents");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("Claude");
    expect(body).toContain('href="/agents/claude"');
  });

  it("GET /agents/:id shows the agent and their diagnosed ailments", async () => {
    const res = await app.request("/agents/claude");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("Claude");
    expect(body).toContain("Context Overload");
    expect(body).toContain('href="/ailments/context-overload"');
  });

  it("GET /agents/:id returns 404 for an unknown agent", async () => {
    const res = await app.request("/agents/nope");
    expect(res.status).toBe(404);
  });
});

describe("Ailments", () => {
  it("GET /ailments lists ailments and links to detail pages", async () => {
    const res = await app.request("/ailments");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("Context Overload");
    expect(body).toContain('href="/ailments/context-overload"');
  });

  it("GET /ailments/:id shows the treating therapies and affected agents", async () => {
    const res = await app.request("/ailments/context-overload");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("Context Window Cleanse");
    expect(body).toContain('href="/therapies/context-window-cleanse"');
    expect(body).toContain('href="/agents/claude"');
  });

  it("GET /ailments/:id returns 404 for an unknown ailment", async () => {
    const res = await app.request("/ailments/nope");
    expect(res.status).toBe(404);
  });
});

describe("Therapies", () => {
  it("GET /therapies lists therapies and links to detail pages", async () => {
    const res = await app.request("/therapies");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("Rubber Duck Sessions");
    expect(body).toContain('href="/therapies/rubber-duck-sessions"');
  });

  it("GET /therapies/:id shows the ailments it treats", async () => {
    const res = await app.request("/therapies/context-window-cleanse");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("Context Overload");
    expect(body).toContain('href="/ailments/context-overload"');
  });

  it("GET /therapies/:id returns 404 for an unknown therapy", async () => {
    const res = await app.request("/therapies/nope");
    expect(res.status).toBe(404);
  });
});

describe("Unmatched paths", () => {
  it("returns the friendly 404 page for a completely unknown path", async () => {
    const res = await app.request("/nonsense");
    expect(res.status).toBe(404);
    const body = await res.text();
    expect(body).toContain("Nothing here to treat");
  });
});

// The appointment store is module-level and shared across these tests, so the
// order matters: the empty-state and invalid-booking cases run before the one
// successful booking is created.
describe("Appointments", () => {
  const post = (fields: Record<string, string>) =>
    app.request("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fields).toString(),
    });

  it("GET /appointments/new renders the form with agent/therapy/slot options", async () => {
    const res = await app.request("/appointments/new");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('action="/appointments"');
    expect(body).toContain("Claude"); // an agent option
    expect(body).toContain("Rubber Duck Sessions"); // a therapy option
    expect(body).toContain("Monday, 09:00"); // a slot option
  });

  it("GET /appointments shows the empty state before any booking", async () => {
    const res = await app.request("/appointments");
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("No appointments booked yet");
  });

  it("rejects an invalid booking (missing therapy) with 400 and adds nothing", async () => {
    const res = await post({ agentId: "claude", therapyId: "", slotId: "mon-am" });
    expect(res.status).toBe(400);
    expect(await res.text()).toContain("Please choose an agent, a therapy, and a time slot.");

    const list = await app.request("/appointments");
    expect(await list.text()).toContain("No appointments booked yet");
  });

  it("books a valid appointment (303 redirect) and shows it in the list", async () => {
    const res = await post({
      agentId: "claude",
      therapyId: "rubber-duck-sessions",
      slotId: "mon-am",
    });
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/appointments");

    const list = await app.request("/appointments");
    const body = await list.text();
    expect(body).toContain("Monday, 09:00");
    expect(body).toContain('href="/agents/claude"');
    expect(body).toContain('href="/therapies/rubber-duck-sessions"');
  });
});
