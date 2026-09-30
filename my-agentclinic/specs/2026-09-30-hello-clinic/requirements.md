# Requirements — Phase 1: Hello, clinic (walking skeleton)

## Roadmap phase

This is **Phase 1 — Hello, clinic (walking skeleton)** from `specs/roadmap.md`.
The goal is the smallest thing that runs: a server that starts, responds in a
browser, and says hello. Every later feature hangs off this skeleton.

## Scope

In scope:

- Stand up a **Hono** server on Node that starts cleanly and responds.
- One route **`GET /`** returns a **minimal, server-rendered home page** — a
  valid HTML document with a `<title>` and `<h1>` of **"AgentClinic"** plus a
  short, on-brand welcome tagline. Content only; no styling (styling is Phase 2).
- One route **`GET /health`** returns JSON `{ "status": "ok" }` for liveness
  checks in demos and tests.
- Working **dev** and **run/build** scripts, end to end.

Out of scope (deferred to later phases):

- Shared layout, branding, and styling (Phase 2).
- Any domain models — agents, ailments, therapies, appointments (Phase 3+).
- Persistence / SQLite (introduced later, once data shape is stable).
- Auth, billing, multi-tenancy (non-goals for now).

## Decisions

- **Framework:** Hono, per `specs/tech-stack.md` (TypeScript-first, lightweight).
- **Rendering:** Hono's **JSX** for server-rendered HTML — no separate front-end
  build step.
- **Runtime/serving:** Node via `@hono/node-server`.
- **Dev loop:** `tsx` watch for fast iteration; `tsc` for type-check + build to
  `dist/`.
- **Language:** TypeScript in `strict` mode (already set in `tsconfig.json`).
- **Health endpoint:** included now so demos and the smoke test have a stable,
  cheap liveness signal.

## Context & constraints

- Keep it **small, legible, and demo-friendly** — this is a teaching project and
  a conference-booth demo (see `specs/mission.md`).
- **Reliable over clever**: prefer boring, dependable choices.
- Every dependency must earn its place. Phase 1 adds only `hono`,
  `@hono/node-server`, and dev tooling (`tsx`).
- The app must remain in a **working, shippable state** at the end of the phase.

## Dependencies to add

- Runtime: `hono`, `@hono/node-server`
- Dev: `tsx` (watch/runner); `typescript` already present.
- (Optional, for the automated smoke test — see `validation.md`.)
