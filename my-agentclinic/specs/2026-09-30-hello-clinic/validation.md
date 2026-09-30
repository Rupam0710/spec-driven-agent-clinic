# Validation — Phase 1: Hello, clinic (walking skeleton)

Phase 1 is **done and mergeable** when all of the following pass. Each maps to an
acceptance criterion chosen for this phase.

## 1. Server starts & responds

- [ ] `npm run dev` (or `npm start`) boots the server with no errors and logs the
      listen URL.
- [ ] `GET /` returns **HTTP 200** and a valid HTML document whose `<title>` and
      `<h1>` are **"AgentClinic"**, including the welcome tagline.
- [ ] `GET /health` returns **HTTP 200** with JSON `{ "status": "ok" }`.

## 2. Type-check & build pass

- [ ] `tsc` runs clean in **strict** mode — no type errors.
- [ ] `npm run build` produces `dist/` with no errors.

## 3. Manual browser check

- [ ] Loading `http://localhost:<port>/` in a modern browser visibly renders the
      minimal **AgentClinic** home page — heading plus welcome tagline
      (server-rendered HTML, no blank page / no console errors from the server).

## 4. Automated smoke test

- [ ] An automated test hits `app.request('/')` and asserts **200 + body contains
      "AgentClinic"**.
- [ ] The same test asserts `app.request('/health')` returns `{ status: "ok" }`.
- [ ] `npm test` runs the test and it passes.

## Merge gate

All four sections green, on branch `phase-1-hello-clinic`, with `README.md`
updated to describe how to run the app. The app is left in a working, shippable
state — ready for Phase 2 (Layout & shell).
