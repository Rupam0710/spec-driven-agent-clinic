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
- Introduced once the shape of the data is stable; the early "walking skeleton"
  phases can run before storage is wired in.
- **Status (post-MVP):** the data shape is now stable — agents, ailments,
  therapies, and appointments are all modeled and shipped. That trigger condition
  is **met**, and since booked appointments currently reset on every restart,
  wiring up SQLite is the **recommended next step** (ahead of the dashboard and
  the design-polish pass).

## Testing

- **[vitest](https://vitest.dev/)** is the test runner (`npm test`).
- **Every phase ships with tests.** At minimum a smoke test per route (status +
  key content); feature phases add integration tests for their behavior (e.g.
  booking an appointment returns a 303 and the appointment appears in the list).
- Tests should run fast, with no external services — in keeping with the
  single-process, zero-config ethos. Once SQLite lands, tests run against an
  in-memory or temp-file database so they stay isolated and repeatable.

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
