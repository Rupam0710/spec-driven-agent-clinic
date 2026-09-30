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
