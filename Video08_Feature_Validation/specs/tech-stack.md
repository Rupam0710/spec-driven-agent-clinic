# Tech Stack

AgentClinic is a server-side TypeScript application. All rendering happens on the server; the browser receives plain HTML that works well and looks good.

## Core

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Type safety end-to-end; satisfies Mary's requirement |
| Runtime | Node.js | Stable, well-supported, vast ecosystem |
| Server framework | **Hono** | Lightweight, TypeScript-first, fast, excellent DX; routes and middleware feel natural |
| Templating | Hono JSX (server-side) | JSX without React overhead; components are just functions |
| CSS | Plain CSS + CSS custom properties | No build step required; mobile-first and responsive so Steve gets a modern, attractive result on any device |

## Recommended: Hono

[Hono](https://hono.dev) is chosen over Express/Fastify because:

- First-class TypeScript with zero config
- Built-in JSX renderer for server-side HTML
- Middleware model is simple and composable
- Runs on Node, Deno, Bun, and edge runtimes without changes

## Responsive Design

The web UI is **responsive by default**. Every page must render well from ~320px (small phones) up to large desktops:

- Mobile-first CSS: base styles target small screens; `min-width` media queries layer on enhancements for wider viewports
- Fluid layout using relative units (`rem`, `%`, `max-width`) rather than fixed pixel widths
- A `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` tag on every page (rendered by the shared `Layout`)
- No horizontal scrolling, readable line lengths, and comfortable tap targets

This is a baseline expectation for all UI phases, not a Phase 9 polish task.

## Data

- **SQLite** (via `better-sqlite3`) for local development and early production — simple, embedded, no infrastructure
- Migrations via plain SQL files; no ORM to start

## Testing & Validation

- **Vitest** — fast, TypeScript-native, compatible with the rest of the stack
- Vitest is our validation mechanism: each feature phase is considered validated when its Vitest suite passes
- Tests are run through a dedicated `test` script in `package.json`, so validation is a single command (`npm test`) locally and in CI
  - `"test": "vitest run"` for one-off/CI runs
  - `"test:watch": "vitest"` for iterative development

## Tooling

- `tsx` for development (run TypeScript directly, no build step needed)
- `tsc` for production builds
- `prettier` for formatting

## What We Are Not Using

- No React, Vue, or Svelte — server-side rendering keeps the stack simple
- No ORM — SQL is sufficient at this scale
- No Docker — not yet; that's a later phase concern
