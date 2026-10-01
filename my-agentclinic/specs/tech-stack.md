# Tech Stack

## Language & runtime

- **TypeScript** on the server, in `strict` mode.
- **Node.js** (v18+) as the runtime.

## Web framework — Hono (recommended)

We use **[Hono](https://hono.dev/)** as the server-side web framework.

Why Hono:

- **TypeScript-first.** Excellent type inference for routes, handlers, and
  context — little friction, few `any`s.
- **Lightweight & fast.** Minimal, small surface area, quick to start and easy
  to reason about — ideal for a demo-friendly, spec-driven project.
- **Modern & portable.** Standard `Request`/`Response`, runs on Node and beyond.
- **Batteries where we need them.** Built-in routing, middleware, and JSX-based
  HTML rendering without dragging in a heavy front-end build.

Alternatives considered: **Express** (most popular, but heavier and less
TypeScript-native) and **Fastify** (fast and schema-driven, but more structure
than this project needs). We chose Hono for its clarity and TS ergonomics.

## Rendering

- **Server-rendered HTML.** Pages are rendered on the server (Hono's JSX /
  templating) and served to the browser. No separate front-end framework or
  build step in the early phases — this keeps things simple and satisfies the
  "works well in a modern browser" requirement.

## Styling & UX — Pico CSS

- **[Pico CSS](https://picocss.com/)** is the base stylesheet — a minimal,
  *classless* framework that styles semantic HTML (`<nav>`, `<article>`,
  `<table>`, headings, links) directly, with almost no class markup. This keeps
  the server-rendered JSX clean and the site attractive in a modern browser with
  little effort — a good fit for Steve's "attractive, modern-browser" goal,
  course students, and quick booth demos.
- Loaded from the **classless CDN build** via a `<link>` in the layout `<head>`.
  No npm dependency and no build step, in keeping with "reliable over clever."
- A single **`static/style.css`** holds small, project-specific overrides
  (clinic accent color, spacing), layered *after* Pico so overrides win.
- **UX direction:** semantic HTML first, one shared layout (header/footer/clinic
  branding), tables and `<article>` cards for listings and detail pages. Favor
  legibility over custom components.

## Persistence — SQLite

- **SQLite** for storage. A single-file, zero-configuration database that is
  reliable, dependency-light, and trivial to spin up — a great fit for course
  students and quick conference-booth demos.
- **Driver: [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3).**
  Chosen for the "reliable over clever" reason — it is **synchronous**, so the
  existing data accessors kept their signatures and the server-rendered pages
  needed no changes, and it ships prebuilt binaries so `npm install` stays
  turnkey. Alternatives (the built-in `node:sqlite`, async `node-sqlite3`) were
  passed over: the former is still experimental and needs a newer Node; the
  latter would have forced an async rewrite of every page.
- **Status (shipped — Phase 4):** SQLite is live. One shared connection
  (`src/data/db.ts`) creates the schema and seeds the reference data — agents,
  ailments, therapies, and their relationships — on first run, idempotently.
  Booked **appointments now persist** across restarts. The database file path is
  `DATABASE_PATH` (default `./agentclinic.db`, gitignored). The fixed booking
  **slots stay static** (`src/data/slots.ts`) — they are a configured set, not
  clinic data, so they are not stored in the database.

## Testing

- **[vitest](https://vitest.dev/)** is the test runner (`npm test`).
- **Every phase ships with tests.** At minimum a smoke test per route (status +
  key content); feature phases add integration tests for their behavior (e.g.
  booking an appointment returns a 303 and the appointment appears in the list).
- Tests should run fast, with no external services — in keeping with the
  single-process, zero-config ethos. Now that SQLite has landed, tests run
  against an in-memory database (`DATABASE_PATH=":memory:"`, set in
  `vitest.config.ts`) so they stay isolated and repeatable, with a dedicated
  temp-file test covering restart persistence.

## Deployment

- **Single Node process** listening on a port (default **3000**, overridable via
  `PORT`). `npm run dev` for hot-reload (tsx watch); `npm start` to run once.
- **`tsc`** type-checks and compiles to `dist/`; `npm run build` is the release
  step. The app is self-contained — static assets are served from `static/`, and
  SQLite is a single local file — so it runs the same on a laptop, a booth
  machine, or a container with no extra infrastructure.
- Reproducibility is a feature: a clean `npm install && npm start` must bring the
  demo up every time.

## Build & tooling

- **`tsc`** for type-checking and compilation to `dist/`.
- **tsx** for the dev/run loop; **vitest** for tests.
- Package manager: **npm**.

## Constraints

- Prefer boring, dependable dependencies with strong TypeScript support.
- Every dependency added should earn its place against the reliability principle.
