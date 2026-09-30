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

## Clarifications (post-implementation review)

Building the MVP surfaced ambiguities the original spec left open. Resolved here;
each notes whether it is **already reflected in the code** or a **follow-up**.

1. **"Upcoming" list semantics** *(reflected in code).* For the MVP, "upcoming"
   means **all booked appointments, sorted by slot start soonest-first** — there
   is deliberately **no past/future filtering**. This is a conscious trade-off:
   slots are a fixed demo set (see decision above), so a real `startsAt >= now`
   filter would either be meaningless or make tests non-deterministic. When slots
   become dynamic/persisted (post-MVP), revisit true "upcoming" filtering.

2. **Slot capacity / double-booking** *(reflected in code).* A slot has **no
   capacity limit**: it may be booked any number of times, including the same
   agent booking the same slot twice, and multiple agents sharing a slot. No
   conflict detection in the MVP. Capacity, per-slot availability, and
   double-booking rules are **post-MVP**.

3. **"Any agent + any therapy" vs the metaphor** *(reflected in code — accepted).*
   The booking form intentionally does **not** constrain therapies to the
   selected agent's diagnosed ailments, so an agent can book a therapy unrelated
   to their ailments. This knowingly relaxes the agent→ailment→therapy metaphor
   from `mission.md` in favor of a simpler MVP. Constraining the therapy list to
   the agent's ailments is a candidate **post-MVP** enhancement.

4. **Persistence trigger is now met** *(follow-up — see tech-stack/roadmap).*
   With agents, ailments, therapies, and appointments all modeled, the data shape
   is stable — the condition `tech-stack.md` sets for introducing SQLite. Because
   appointments now reset on every restart (a newly visible limitation),
   **persistence is the recommended next post-MVP phase**, ahead of the dashboard
   and the polish pass. Recorded in `tech-stack.md` and `roadmap.md`.

5. **Booking confirmation feedback** *(follow-up — NOT yet implemented).* Today a
   successful `POST` 303-redirects to `/appointments` with no success message.
   Recommendation: redirect to `/appointments?booked=1` and render a small
   confirmation banner when that query param is present (no session/flash state
   needed). Small, on-brand UX win; scheduled as a near-term follow-up.

6. **No appointment detail page** *(reflected in code — accepted).* Unlike the
   other entities, appointments have a list but no `/appointments/:id` detail
   page. This is intentional for the MVP (an appointment is a booking, not a
   browseable catalog entry). A detail page — likely paired with cancel/reschedule
   — is a **post-MVP** candidate.

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
