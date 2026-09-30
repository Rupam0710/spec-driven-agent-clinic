# Validation — MVP: Appointments (booking)

This phase is **done and mergeable** (and the MVP is complete) when all of the
following pass. Each maps to an acceptance criterion chosen for this phase.

## 1. Booking form

- [ ] `GET /appointments/new` returns **200** and renders a `<form>` posting to
      `/appointments` with three populated `<select>`s: agents, therapies, and
      time slots.
- [ ] Every seeded agent, every therapy, and every predefined slot appears as an
      option.

## 2. Booking works (happy path)

- [ ] `POST /appointments` with a valid `agentId`, `therapyId`, and `slotId`
      creates one appointment and responds with a **303** redirect to
      `/appointments`.
- [ ] Following the redirect, `GET /appointments` shows the new appointment with
      its slot label and working links to the chosen agent and therapy.

## 3. Invalid booking rejected

- [ ] `POST /appointments` with a missing or unknown id returns HTTP **400**,
      re-renders the form with a friendly on-brand message, and adds **no**
      appointment (the list count is unchanged).

## 4. Upcoming list

- [ ] `GET /appointments` returns **200**; with no bookings it shows a friendly
      empty state, and with several it lists them **soonest slot first**.
- [ ] The header links to `/appointments`, and all existing routes (`/`,
      `/health`, `/agents`, `/ailments`, `/therapies`, unmatched → friendly 404)
      still work unchanged.

## 5. Type-check & build pass

- [ ] `tsc` runs clean in **strict** mode — no type errors.
- [ ] `npm run build` produces `dist/` with no errors.

## 6. Automated tests (Vitest)

- [ ] Tests cover: the form (200 + options), a successful POST (303 + appears in
      list with cross-links), and an invalid POST (400 + not added).
- [ ] `npm test` runs the whole suite and it passes (Phase 1–2 tests still green).

## 7. Manual browser check

- [ ] In a modern browser, booking an appointment from `/appointments/new`
      redirects to `/appointments` and the new appointment is visible with
      correct agent/therapy links — styled by Pico, no console/server errors.

## Merge gate

All sections green, on branch `mvp-appointments`, with `README.md` updated
(appointments are in-memory, reset on restart) and `specs/roadmap.md` marking
Phase 3 done / the MVP complete. The app is left in a working, shippable state —
this is the **MVP release**. Real persistence, a dashboard, and a design polish
pass remain as post-MVP work.
