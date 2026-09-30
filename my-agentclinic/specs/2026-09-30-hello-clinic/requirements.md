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
  short, on-brand welcome tagline.
- A **shared page layout** with a **header**, **main**, and **footer**, plus a
  linked **CSS file** for minimal base styling (see Decisions for file layout).
- One route **`GET /health`** returns JSON `{ "status": "ok" }` for liveness
  checks in demos and tests.
- Working **dev** and **run/build** scripts, end to end.

Out of scope (deferred to later phases):

- Rich branding, theming, and page-specific styling beyond the minimal base
  stylesheet (later phases).
- Any domain models — agents, ailments, therapies, appointments (Phase 3+).
- Persistence / SQLite (introduced later, once data shape is stable).
- Auth, billing, multi-tenancy (non-goals for now).

## Decisions

- **Framework:** Hono, per `specs/tech-stack.md` (TypeScript-first, lightweight).
- **Rendering:** Hono's **JSX** for server-rendered HTML — no separate front-end
  build step.
- **Layout structure:** a top-level `Layout` component composes the page shell
  from three subcomponents — **`Header`**, **`Main`**, and **`Footer`** — and
  **each lives in its own file** (`src/components/Header.tsx`,
  `src/components/Main.tsx`, `src/components/Footer.tsx`, with the shell in
  `src/components/Layout.tsx`). One component per file keeps them small and
  independently editable.
- **Styling:** a single `static/style.css`, served as a static asset and linked
  from the layout `<head>`; kept minimal (base styles only).
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
