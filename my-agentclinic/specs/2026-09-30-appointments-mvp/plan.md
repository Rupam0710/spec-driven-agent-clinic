# Plan — MVP: Appointments (booking)

Numbered task groups. Each group leaves the repo runnable; the phase ends with an
agent able to book a therapy at a time slot and see it in the upcoming list —
completing the MVP.

## 1. Domain model

1.1. In `src/domain/types.ts`, add an `Appointment` type
     (`{ id, agentId, therapyId, slotId }`) and a `Slot` type
     (`{ id, label, startsAt }`, where `startsAt` is an ISO string used for
     sorting).

## 2. Time slots (static seed)

2.1. Add a small, hardcoded list of bookable `Slot`s to the data layer (e.g. in
     `src/data/seed.ts` or a `src/data/slots.ts`) — ~5–6 slots with legible
     labels and fixed `startsAt` values (not relative to "now", for determinism).
2.2. Add `getSlots()` and `getSlot(id)` accessors.

## 3. Appointments store (in-memory, mutable)

3.1. Create `src/data/appointments.ts` with a module-level array and helpers:
     `listAppointments()` (returns appointments sorted by their slot `startsAt`
     ascending), `addAppointment({ agentId, therapyId, slotId })` (generates an
     `id`, pushes, returns the created appointment), and `getAppointment(id)` if
     useful.
3.2. `addAppointment` assumes ids are already validated by the route (route owns
     validation); keep the store thin.

## 4. Pages (Hono JSX, on the existing Layout)

4.1. `src/pages/Appointments.tsx` — the upcoming-appointments list: each row
     shows the slot label and links to the agent and the therapy; includes a
     prominent "Book an appointment" link to `/appointments/new`. Friendly empty
     state when none are booked.
4.2. `src/pages/BookAppointment.tsx` — the booking form: `<form method="post"
     action="/appointments">` with three `<select>`s (agent, therapy, slot)
     populated from the data helpers, plus a submit button. Accepts an optional
     `error` prop and pre-selected values to re-render after a failed submit.

## 5. Routes

5.1. In `src/app.tsx` add:
     - `GET /appointments` → render the list (`listAppointments()`).
     - `GET /appointments/new` → render the empty booking form.
     - `POST /appointments` → parse the form body (`c.req.parseBody()`), validate
       that `agentId`, `therapyId`, and `slotId` each resolve; on success call
       `addAppointment(...)` and **redirect 303** to `/appointments`; on failure
       re-render `BookAppointment` with a friendly message and HTTP **400**.
5.2. Keep existing routes and the global `app.notFound()` handler intact. Ensure
     `/appointments/new` is registered so it isn't shadowed by any `:id` route
     (there is no `/appointments/:id` this phase).

## 6. Navigation & entry points

6.1. Add an "Appointments" link to the header nav (`src/components/Header.tsx`).
6.2. Optionally add a "Book an appointment" call-to-action on the home page so
     the demo flows into booking.

## 7. Styling (minimal)

7.1. Rely on Pico CSS to style the `<form>`, `<select>`, `<button>`, and the list
     for free. Add to `static/style.css` only if a small tweak is needed — no new
     framework, no build step.

## 8. Tests & validation (Vitest)

8.1. Test `GET /appointments` (200; empty state initially) and
     `GET /appointments/new` (200; form contains agent/therapy/slot options).
8.2. Test a successful `POST /appointments` with valid ids → 303 redirect to
     `/appointments`, and that the new appointment then appears in the list with
     its agent/therapy cross-links.
8.3. Test an invalid `POST /appointments` (bad/missing id) → 400 and no
     appointment added.
8.4. Ensure `tsc` (strict) and `npm run build` pass; run `npm test` (existing
     Phase 1–2 tests stay green).

## 9. Docs

9.1. Update `README.md` with the new appointment routes and a one-line note that
     appointments are in-memory (reset on restart).
9.2. Mark Phase 3 done and note the MVP is complete in `specs/roadmap.md` as part
     of the merge.
