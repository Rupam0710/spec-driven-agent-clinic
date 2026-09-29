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

## Build & tooling

- **`tsc`** for type-checking and compilation to `dist/`.
- Package manager: **npm**.

## Persistence

- **SQLite** for storage. A single-file, zero-configuration database that is
  reliable, dependency-light, and trivial to spin up — a great fit for course
  students and quick conference-booth demos.
- Introduced once the shape of the data is stable; the early "walking skeleton"
  phases can run before storage is wired in.

## Constraints

- Prefer boring, dependable dependencies with strong TypeScript support.
- Every dependency added should earn its place against the reliability principle.
