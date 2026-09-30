# Requirements — MVP: Appointments (booking)

## Roadmap phase

This is **Phase 3 — Appointments (booking)** from `specs/roadmap.md`, the final
feature that completes the **MVP**. Phases 1 and 2 shipped the walking skeleton,
the shared shell, and the three domain entities (agents, ailments, therapies)
with in-memory data. This phase lets an agent **book an appointment** for a
therapy at a time, and lists **upcoming appointments** — after which the MVP goal
("agents can book their way to relief") is met.

Everything under the roadmap's **"Later (beyond MVP)"** heading (real
persistence, a staff/agent dashboard, a visual-design polish pass) is explicitly
**out of scope** here.

## Scope

In scope:

- Model an **Appointment**: an agent + a therapy + a time slot.
- **Predefined time slots** — a fixed, static set of bookable slots (see
  Decisions), offered as a dropdown.
- **Book an appointment** via a server-rendered form:
  - `GET /appointments/new` — the booking form (agent dropdown, therapy
    dropdown, time-slot dropdown).
  - `POST /appointments` — validate the submission, create the appointment in
    the in-memory store, and redirect to the appointments list.
- **List upcoming appointments** — `GET /appointments` shows booked
  appointments, soonest first, each cross-linked to its agent and therapy.
- Navigation: header link to `/appointments`; a "Book an appointment" entry
  point (e.g. from `/appointments` and/or the home page).

Out of scope (deferred):

- **Persistence** — appointments live in memory only and reset on restart
  (roadmap lists persistence under "Later"). No SQLite / file storage this phase.
- **Editing or cancelling** appointments; **slot capacity / double-booking**
  rules (a slot may be booked more than once); timezones; reminders/notifications.
- Staff/agent **dashboard** and the visual **polish pass** ("Later").
- Auth, billing, multi-tenancy (non-goals for now).

## Decisions

- **Storage = in-memory mutable store.** A module-level array that `POST` appends
  to, exposed only through helper functions (mirroring `src/data/seed.ts`).
  Resets on restart — acceptable for the MVP; persistence is a later phase.
- **Booking = any agent + any therapy.** The form offers every agent and every
  therapy in free dropdowns; no filtering by the agent's diagnosed ailments.
  Simplest to build and explain (a conscious trade-off against the
  agent→ailment→therapy metaphor).
- **Time = predefined static slots.** A small hardcoded list of slots, each with
  a stable slug `id`, a human `label` (e.g. "Mon 09:00"), and an ISO `startsAt`
  used only for sorting. Static (not relative to "now") so the demo and tests are
  **deterministic**. Chosen over a free datetime input to avoid parsing/validation
  surprises in a live booth demo.
- **Appointment model:** `{ id, agentId, therapyId, slotId }`, where `id` is a
  generated unique id; `agentId` / `therapyId` / `slotId` are references resolved
  via existing/`new` lookup helpers for rendering.
- **Validation on POST:** all three of `agentId`, `therapyId`, `slotId` must
  resolve to real entities. On any invalid/missing field, re-render the booking
  form with a friendly on-brand message and HTTP **400** (no appointment
  created). On success, **redirect (303)** to `/appointments`.
- **"Upcoming"** = all appointments sorted by their slot's `startsAt` ascending.
- **Rendering / styling:** Hono JSX on the existing `Layout`; Pico CSS styles the
  `<form>`, `<select>`, and list markup for free (semantic HTML, no extra CSS).

## Context & constraints

- Keep it **small, legible, and demo-friendly** — teaching project + conference
  booth demo (`specs/mission.md`).
- **Metaphor-forward:** booking copy stays warm and playful ("book your way to
  relief").
- **Reliable over clever:** no new dependencies; reuse the existing stack (Hono,
  Hono JSX, Vitest, Pico).
- The app must remain in a **working, shippable state** at the end of the phase —
  this is the MVP release.

## Dependencies to add

- None expected. Uses the existing stack. Any new dependency must earn its place.
