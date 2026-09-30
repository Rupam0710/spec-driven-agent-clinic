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
