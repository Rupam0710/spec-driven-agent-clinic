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

3.1. Create a minimal, server-rendered `Home` page component (Hono JSX) that
     supplies the page content; the HTML document shell comes from the layout
     (group 4).
3.2. Render an `<h1>` of **"AgentClinic"** as the visible heading (the document
     `<title>` of **"AgentClinic"** lives in the layout).
3.3. Add a one-line, on-brand welcome tagline (metaphor-forward, warm/playful)
     beneath the heading — e.g. a short "wellness clinic for AI agents" line.
3.4. Wire `GET /` (task 2.2) to render this component.

## 4. Layout component & base styling

4.1. Create a top-level `Layout` component (`src/components/Layout.tsx`) that
     renders the HTML document shell (`<html>`/`<head>`/`<body>`) and composes
     three subcomponents — `<Header>`, `<Main>`, `<Footer>` — with page content
     passed as `children` into `<Main>`.
4.2. Create each subcomponent in its own file:
     `src/components/Header.tsx` (brand link home), `src/components/Main.tsx`
     (wraps `children`), and `src/components/Footer.tsx` (copyright line).
4.3. Create `static/style.css` with minimal base styles for the
     header/main/footer regions; link it from the layout `<head>` via
     `<link rel="stylesheet" href="/static/style.css" />`.
4.4. Serve the `static/` directory through `@hono/node-server/serve-static`
     (registered on the exported `app`), so `GET /static/style.css` resolves.
4.5. Update `Home` (task 3.1) to render its content inside `<Layout>`.

## 6. Scripts

6.1. `dev` — `tsx watch src/index.ts` for a fast local loop.
6.2. `start` — run the server (`tsx src/index.ts`, or `node dist/index.js` after
     build).
6.3. `build` — `tsc` to `dist/` (already present; confirm it compiles the new
     source).
6.4. Confirm dev → browser → build all work end to end.

## 7. Smoke test

7.1. Add a small automated test that calls `app.request('/')` and asserts HTTP
     200 with body containing "AgentClinic", plus `app.request('/health')`
     returns `{ status: "ok" }`.
7.2. Wire an `npm test` script to run it.

## 8. Verify & wrap up

8.1. Run through `validation.md` end to end (type-check, build, run, browser,
     smoke test).
8.2. Update `README.md` with how to run the app (dev/start/build/test).
8.3. Commit on the `phase-1-hello-clinic` branch; open a PR when green.
