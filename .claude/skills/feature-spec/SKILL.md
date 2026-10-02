---
name: feature-spec
description: Kick off a new feature phase in this spec-driven repo — pick the next roadmap phase, cut a branch, and write its specs/YYYY-MM-DD-feature-name/ folder (plan.md, requirements.md, validation.md). Use whenever the user wants to start, spec out, or plan the next feature/phase, says "spec the next feature", "start the next phase", "write the spec for X", "set up the spec folder", or asks to begin feature work from specs/roadmap.md. This skill ALWAYS confirms the open decisions with the user (via AskUserQuestion) before writing any files.
---

# Feature spec kickoff

Stand up the spec folder for the next feature phase of this project, the same way
every prior phase was specced. The repo is spec-driven: each feature lives in
`specs/YYYY-MM-DD-feature-name/` as three documents — `plan.md`, `requirements.md`,
and `validation.md` — and is built on its own branch. Your job here is to pick the
next phase, cut the branch, **confirm the load-bearing decisions with the user**,
and write those three files in the house style.

The point of this skill is to stop the user re-typing the kickoff prompt every
phase. So be proactive: do the reading and the derivation yourself, and only spend
the user's attention on the handful of decisions that genuinely need a human.

## Locate the specs directory

The specs live in a `specs/` folder containing `roadmap.md`, `mission.md`, and
`tech-stack.md`. It may be at the repo root or one level down (e.g. in an app
subdirectory). Find it before doing anything else:

```bash
find . -name roadmap.md -path '*specs/*' -not -path '*/node_modules/*'
```

Everything below is relative to that `specs/` directory (`SPECS` from here on).

## Step 1 — Read the context (no writes yet)

Read these in full; they are the source of truth and the examples to match:

- `SPECS/roadmap.md` — the phase list and what's next.
- `SPECS/mission.md` — product intent, audience, principles, non-goals.
- `SPECS/tech-stack.md` — the stack, conventions, and constraints.
- The **most recent** existing `SPECS/YYYY-MM-DD-*/` folder's three files — this
  is your format and tone template. Match its structure, heading style, voice, and
  level of detail. Do not invent a new format.

## Step 2 — Pick the next phase

In `roadmap.md`, find the next phase to build. Phases are typically tagged — a
done phase is marked (e.g. ✅ / "Done"), and the next one up is flagged (e.g.
"TODO: Now"). Choose the earliest phase that is **not** done. If it's genuinely
ambiguous which phase is next, that's one of the things you'll confirm in Step 4 —
don't guess silently.

From the phase title, derive a short kebab-case **feature-name** (e.g. "Phase 6 —
Feedback form" → `feedback-form`). Build the folder name as
`<today>-<feature-name>` using today's date in `YYYY-MM-DD`
(`date +%F`) — not the date from an older folder.

## Step 3 — Cut the branch

Create and check out a feature branch off the current main branch, named for the
feature (match the branch-naming the repo already uses — check `git log`/existing
branches; prior phases used names like `mvp-appointments`, `constitution-refresh`).
A reasonable default is the feature-name slug. This is a safe, reversible side
effect, so it's fine to do before writing files — but do **not** write the spec
files yet.

## Step 4 — Confirm the decisions with the user (REQUIRED, before any file write)

This is the non-negotiable gate. Before writing a single spec file, use the
**AskUserQuestion** tool to confirm the decisions that will shape the three
documents. Batch the questions into **one** AskUserQuestion call, grouped so there
is one question feeding each document:

1. **Scope / requirements** — the biggest open scope-or-decision call for this
   phase (what's in vs. deferred, or a key design choice like storage/validation
   behaviour). Feeds `requirements.md`.
2. **Plan / approach** — how to sequence or structure the build where more than
   one sensible approach exists (e.g. new file vs. extend existing; test-first vs.
   after). Feeds `plan.md`.
3. **Validation / acceptance** — what "done and mergeable" must demonstrate for
   this phase (the acceptance bar, e.g. required tests, manual browser check,
   merge gate). Feeds `validation.md`.

Derive the actual questions and options from the roadmap phase + mission +
tech-stack — don't ask generic boilerplate. Give each question 2–4 concrete
options with your **recommended option first** (and say it's recommended), so the
user can usually just accept your read. The user can always pick "Other" to steer.

Why this gate matters: the specs are a contract the implementation is held to, and
a wrong assumption here costs a whole phase. A short, well-framed set of choices up
front is cheaper than rewriting specs (or code) later. It also keeps the human in
the loop on product/scope calls that aren't yours to make unilaterally.

After the answers come back, if they opened a new ambiguity worth one more pass,
it's fine to ask a brief follow-up — but don't stall. Once decisions are settled,
proceed to write.

## Step 5 — Write the three documents

Create `SPECS/<today>-<feature-name>/` and write all three files, matching the most
recent prior phase's format and the clinic's warm, metaphor-forward-but-rigorous
voice. Fold the user's Step-4 answers in as settled decisions.

- **`requirements.md`** — scope, decisions, context.
  - Name the roadmap phase this implements and how it builds on prior phases.
  - **In scope** / **Out of scope (deferred)** lists.
  - **Decisions** — each decision with its *why* and the trade-off considered
    (this is where the Step-4 answers land).
  - **Context & constraints** and any **Dependencies to add** (default: none —
    reuse the existing stack; every new dependency must earn its place).

- **`plan.md`** — the build as **numbered task groups** (`## 1.`, `## 2.`, …) with
  decimal sub-tasks (`1.1.`, `1.2.`). Reference real files/paths from the repo.
  Order so that each group leaves the app runnable, ending with tests/validation
  and a docs/roadmap-update group. Keep it concrete, not aspirational.

- **`validation.md`** — how to know it's done and mergeable: checkbox acceptance
  criteria grouped by area, covering behaviour, type-check/build, automated tests,
  and a manual browser check, ending with a **Merge gate** that names the branch
  and the roadmap update required to land.

## Step 6 — Report

Tell the user, concisely:

- The phase selected and the branch created.
- The folder written and the three files in it.
- The key decisions as confirmed (so they have one last look).
- The suggested next step (start implementing `plan.md`, or review the specs).

Do **not** mark the roadmap phase done or start implementing in this skill — that
happens during/after the build. This skill's job ends at a reviewed spec folder on
a fresh branch.
