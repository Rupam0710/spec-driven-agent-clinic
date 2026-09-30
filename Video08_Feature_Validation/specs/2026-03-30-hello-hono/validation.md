# Phase 1 Validation — Hello Hono

## Definition of Done

All of the following must be true before this branch is merged.

### 1. TypeScript compiles cleanly

```
npm run typecheck
```

Must exit with code 0 and produce no errors or warnings.

### 2. Server starts

```
npm run dev
```

Must start without errors. The terminal should show the server is listening (port 3000 or logged port).

### 3. Automated tests pass (Vitest)

```
npm test
```

Must exit with code 0. The Vitest suite is the source of truth for validation and asserts that the `/` route:

- Responds with HTTP status `200 OK`
- Returns an HTML response (`content-type: text/html`)
- Contains an `<h1>` element with the text `AgentClinic`
- Contains a tagline (any short descriptive text; exact wording is implementation choice)

Tests import the exported Hono `app` and use `app.request()`, so no live server or port is needed.

### 4. Hono version is pinned

`package.json` must list `hono` without a `^` or `~` range prefix.

### 5. Strict TypeScript is on

`tsconfig.json` must contain `"strict": true`.

## Not Required

- No CI pipeline required (running `npm test` locally is sufficient for now)
- Browser rendering not checked (the Vitest route assertion is sufficient)
