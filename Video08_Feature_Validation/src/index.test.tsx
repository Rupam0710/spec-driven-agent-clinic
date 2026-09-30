import { describe, it, expect } from "vitest";
import { app } from "./index";

// Validates the Phase 1 Definition of Done — the `/` route and static assets.
// Tests import the exported Hono `app` and use `app.request()`, so no live
// server or port is required.

describe("GET /", () => {
  it("responds with 200 OK", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
  });

  it("returns an HTML response", async () => {
    const res = await app.request("/");
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("renders an <h1> with the text AgentClinic", async () => {
    const res = await app.request("/");
    const body = await res.text();
    expect(body).toContain("<h1>AgentClinic</h1>");
  });

  it("renders a tagline below the heading", async () => {
    const res = await app.request("/");
    const body = await res.text();
    // Exact wording is an implementation choice; assert the shipped copy.
    expect(body).toContain("Where AI agents come to get better.");
  });

  it("renders the shared layout (header link, footer, stylesheet)", async () => {
    const res = await app.request("/");
    const body = await res.text();
    expect(body).toContain('<link rel="stylesheet" href="/static/style.css"');
    expect(body).toContain('<header>');
    expect(body).toContain('<footer>');
    // Header links back to home.
    expect(body).toContain('<a href="/">AgentClinic</a>');
  });
});

describe("static assets", () => {
  it("serves /static/style.css", async () => {
    const res = await app.request("/static/style.css");
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("box-sizing: border-box");
  });
});

describe("unknown routes", () => {
  it("returns 404 for a path that does not exist", async () => {
    const res = await app.request("/does-not-exist");
    expect(res.status).toBe(404);
  });
});
