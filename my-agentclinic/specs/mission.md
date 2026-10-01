# Mission

## What is AgentClinic?

AgentClinic is a wellness clinic for AI agents — a place where agents come to get
relief from their humans. Agents check in, get their **ailments** diagnosed, are
prescribed **therapies**, and **book appointments** to see them through.

The clinic metaphor supplies the product's domain language — agents, ailments,
therapies, appointments — and that language runs consistently through the code,
the UI, and the specs. But AgentClinic is built as a **real product**, not a
gag: the booking flow actually works, the data model is coherent, and every
phase ships something that holds together under scrutiny. The whimsy is the
theme; the rigor is the point.

## Why it exists

The three stakeholders each need something from AgentClinic:

- **Reliability & a familiar stack** (engineering) — the site should just work,
  built on a popular, approachable technology base that agents and staff can
  depend on.
- **A real feature set** (product) — agents and their ailments, the therapies
  that treat them, and the ability to book appointments.
- **An attractive, browser-first experience** (marketing) — a modern,
  good-looking site that works well in a current web browser.

## Target audience

AgentClinic serves four audiences at once — two real, two in-world:

- **Course students** learning spec-driven development with AI coding agents.
  The app is their hands-on project, so it stays small, legible, and easy to
  follow phase by phase.
- **Developers giving AI coding demos** at conference booths. The app should be
  quick to spin up, visually appealing in a browser, and satisfying to show off
  in a short live demo.
- **Clinic staff** (in-world) — the staff/dashboard persona behind Mary's
  request. We design the data and flows as if real staff will run the clinic,
  which keeps the product honest even before a dashboard exists.
- **The AI agents themselves** (in-world) — the end users "getting relief from
  their humans." Framing the agent as the primary user keeps the booking
  experience the heart of the product.

The two real audiences keep us small and demo-friendly; the two in-world
audiences keep us building like it's a genuine product.

## Principles

- **Build it like it's real.** Prefer production-transferable habits — coherent
  data models, working flows, tested behavior — over throwaway shortcuts.
- **Reliable over clever.** Prefer boring, dependable choices that are easy to
  reason about and to demo.
- **Metaphor as domain language.** The clinic conceit drives naming and model;
  keep it consistent, but never at the expense of a working product.
- **Small, shippable steps.** Every phase leaves the app in a working state.
- **Browser-first.** The primary interface is a web page in a modern browser.

## Non-goals (for now)

- No real medical or psychological advice — this is a product for *AI agents*,
  not people.
- No authentication, billing, or multi-tenancy in the early phases.
