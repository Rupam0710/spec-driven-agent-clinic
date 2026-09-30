# Roadmap

Phases are intentionally small — each one is a shippable slice of work, independently reviewable and testable.

**Cross-cutting expectation:** every phase that ships UI must be **responsive** (mobile-first, works from small phones to large desktops). This is not a single phase — it applies to all UI work from Phase 1 onward. See `tech-stack.md` → Responsive Design.

---

## Phase 1 — Hello Hono ✅
- Install and configure Hono with `tsx` dev server
- Single `/` route returning "AgentClinic is open for business"
- Confirm TypeScript types work end-to-end

## Phase 2 — Core Clinic: Layout, Agents & Ailments
Combines the former Phases 2–5 into one slice that stands up the shared UI and the agent/ailment data model.

- **Base layout:** server-side JSX layout component (header, nav, main, footer); basic CSS (custom properties, reset, typography), mobile-first and responsive; all routes render inside the shared layout
- **Agent list:** SQLite database + first migration (`agents` table); seed a handful of fictional agents; `/agents` page listing all agents
- **Agent detail:** `/agents/:id` page showing a single agent's profile (name, model type, current status, presenting complaints)
- **Ailments catalog:** `ailments` table + seed data (e.g., "context-window claustrophobia", "prompt fatigue"); `/ailments` list page; link agents to one or more ailments

## Phase 3 — Therapies Catalog
- `therapies` table + seed data
- `/therapies` list page
- Map ailments → recommended therapies

## Phase 4 — Appointment Booking
- `appointments` table (agent, therapist, datetime, status)
- Form to book an appointment from an agent's detail page
- Basic validation and confirmation page

## Phase 5 — Staff Dashboard
- `/dashboard` with summary counts: agents, open appointments, ailments in-flight
- Simple table views for staff to manage records
- Mary's dashboard is now real

## Phase 6 — Polish & Accessibility
- Responsive refinements and cross-device QA (responsive is already baseline from Phase 1)
- Semantic HTML audit
- Keyboard navigation and focus styles

## Phase 7 — Hardening
- Error pages (404, 500)
- Input sanitization on all forms
- Basic logging middleware

---

Later phases (not yet planned): auth, email notifications, therapist profiles, reporting.
