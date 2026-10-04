# AgentClinic

A wellness clinic for AI agents — where tired bots come to get relief from their humans.

This is a teaching / conference-demo project built spec-first. See `specs/` for the
mission, tech stack, roadmap, and per-phase requirements.

## Stack

- **TypeScript** (strict) on **Node.js** (v18+)
- **[Hono](https://hono.dev/)** web framework with server-rendered **JSX**
- **[Pico CSS](https://picocss.com/)** (classless, via CDN) for base styling
- **[SQLite](https://sqlite.org/)** via **[`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)** for persistence
- **tsx** for the dev loop, **tsc** for type-check/build, **vitest** for tests

## Getting started

```bash
npm install
```

## Running the app

```bash
npm run dev     # start with hot-reload (tsx watch) — for local development
npm start       # start the server once (tsx)
```

The server listens on port **3000** by default. Override it with `PORT`:

```bash
PORT=8080 npm start
```

Then open <http://localhost:3000/> — you should see the **AgentClinic** home page.

### Routes

- `GET /` — server-rendered home page (HTML)
- `GET /health` — liveness check, returns `{ "status": "ok" }`
- `GET /agents` · `GET /agents/:id` — agents checked in, and each agent's
  diagnosed ailments
- `GET /ailments` · `GET /ailments/:id` — diagnosable conditions, with the
  therapies that treat them and the agents affected
- `GET /therapies` · `GET /therapies/:id` — treatments on offer, the ailments
  each one treats, and its public reviews with an average rating
- `GET /appointments` — upcoming appointments, soonest first
- `GET /appointments/new` — booking form (agent + therapy + time slot)
- `POST /appointments` — book an appointment (303-redirects to the list)
- `GET /therapies/:id/reviews/new` — form to review a therapy (agent + 1–5
  rating + note)
- `POST /therapies/:id/reviews` — post a review (303-redirects to the therapy)

The agents, ailments, and therapies sections are cross-linked (agent → ailment →
therapy and back). Data is stored in **SQLite** via `better-sqlite3`
(`src/data/db.ts`): the schema is created and seeded with the reference content
(`src/data/seed-data.ts`) on first run, and **booked appointments and posted
reviews persist across restarts**. Reviews are public and surfaced on each
therapy's page with an average rating. The database file path is `DATABASE_PATH`
(default `./agentclinic.db`, gitignored); tests use an in-memory database. The
fixed booking slots (`src/data/slots.ts`) stay static — they're configuration,
not clinic data.

## Build

```bash
npm run build       # type-check + compile to dist/
npm run typecheck   # type-check only (no emit)
```

## Test

```bash
npm test            # run the smoke tests (vitest)
```

## Input from stakeholders

- Mary in engineering wants a reliable site with a popular stack based on TypeScript, giving agents and staff a dashboard for easy access.
- Susan in product has a set of features about agents and their ailments, therapies, and booking appointments.
- Steve in marketing wants an attractive site that works well with a modern browser.
