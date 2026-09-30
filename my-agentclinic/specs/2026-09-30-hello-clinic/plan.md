# Plan — Phase 1: Hello, clinic (walking skeleton)

Numbered task groups. Each group leaves the repo closer to a runnable app; the
phase ends with the app running in a browser and saying hello.

## 1. Dependencies & tooling

1.1. Add runtime deps: `hono`, `@hono/node-server`.
1.2. Add dev dep: `tsx`.
1.3. Configure `tsconfig.json` for Hono JSX (`"jsx": "react-jsx"`,
     `"jsxImportSource": "hono/jsx"`), keeping `strict` on and output to `dist/`.

## 2. Server & routes

2.1. Create the Hono app in `src/index.ts`.
2.2. Implement `GET /` returning the server-rendered home page (see group 3).
2.3. Implement `GET /health` returning JSON `{ status: "ok" }`.
2.4. Start the server via `@hono/node-server`, listening on a configurable port
     (default `3000`, overridable by `PORT`), logging the listen URL.

## 3. Home page (minimal)

3.1. Create a minimal, server-rendered `HomePage` component (Hono JSX) — content
     only, no styling (styling is Phase 2).
3.2. Render a valid HTML document: a `<title>` of **"AgentClinic"** and an `<h1>`
     of **"AgentClinic"** as the visible heading.
3.3. Add a one-line, on-brand welcome tagline (metaphor-forward, warm/playful)
     beneath the heading — e.g. a short "wellness clinic for AI agents" line.
3.4. Wire `GET /` (task 2.2) to render this component.

## 4. Scripts

4.1. `dev` — `tsx watch src/index.ts` for a fast local loop.
4.2. `start` — run the server (`tsx src/index.ts`, or `node dist/index.js` after
     build).
4.3. `build` — `tsc` to `dist/` (already present; confirm it compiles the new
     source).
4.4. Confirm dev → browser → build all work end to end.

## 5. Smoke test

5.1. Add a small automated test that calls `app.request('/')` and asserts HTTP
     200 with body containing "AgentClinic", plus `app.request('/health')`
     returns `{ status: "ok" }`.
5.2. Wire an `npm test` script to run it.

## 6. Verify & wrap up

6.1. Run through `validation.md` end to end (type-check, build, run, browser,
     smoke test).
6.2. Update `README.md` with how to run the app (dev/start/build/test).
6.3. Commit on the `phase-1-hello-clinic` branch; open a PR when green.
