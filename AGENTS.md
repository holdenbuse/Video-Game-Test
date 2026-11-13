# Agent instructions — When the Flowers Fade

These instructions apply to every coding agent working in this repository.

## Read before significant changes

Read these documents before planning, implementing, or reviewing any significant change:

1. `GAME_PLAN.md` — vision, architecture, milestones, and technical decisions.
2. `GAME_DESIGN.md` — established mechanics, world, characters, progression, and storytelling rules.
3. `CHAPTER_01.md` — Chapter 1 order, puzzles, encounters, and story boundaries.
4. `TASKS.md` — task status, dependencies, and completion criteria.

The owner blueprint that created these files is preserved in the documents above. If a later request conflicts with an established rule, stop and ask. Do not silently "simplify" a system.

## Current gate

The owner approved the planning documents and Milestone 1 on 2026-11-13. Milestone 1 is implemented: a browser garden with movement, camera controls, collision, and one test interaction.

The owner approved Milestone 2 on 2026-11-13 and asked for the isometric view to be able to move away from Orin as well as stay on them. Milestone 2 is implemented: the view follows Orin until the player pans it, recenter sticks it back, and Petal Streams can be solved, reset, and confirmed once. Completing it does not start combat.

Do not start Milestone 3 until the owner approves it. Finish and verify one milestone before starting the next major milestone.

Run the prototype with `npm install`, then `npm run dev`. Pathfinding checks are `npm test`. The production build is `npm run build`.

## Hard rules

- Do not contradict established mechanics.
- Do not invent major story events, characters, character deaths, or the antagonist's identity.
- Do not reveal Mira's, Rowan's, Tilly's, or the White Prince's later fates in Chapter 1.
- Mark undecided details as `TBD`. Record them in `GAME_DESIGN.md` rather than filling them in.
- Ask before implementing a missing decision that would change story, puzzle identity, combat rules, or progression.
- A clearly labeled placeholder is allowed only when it does not affect important story or mechanics. Record it in the decision log in `GAME_PLAN.md`.
- Never replace an established system with a simpler one. A milestone may ship a vertical slice, but the architecture must leave room for the real rule.
- Prioritize working gameplay over visual polish.
- Keep systems modular. Do not put the game in one file.
- The ancient book advances story only. It must not teach controls, explain combat, give puzzle instructions, hint solutions, replace dialogue, or host playable puzzles or combat.
- Chapter 1 has exactly three garden puzzles and exactly three garden encounters. Encounter type follows completion order, not which puzzle was solved. The third completion is the only Chapter 1 boss. There is no second Chapter 1 boss.
- Do not deploy to Vercel unless the owner explicitly authorizes that deployment.

## Implementation workflow

1. Re-read the documents that the change touches.
2. Choose the next approved task in `TASKS.md`. Confirm its dependencies are satisfied.
3. State the intended implementation briefly before editing.
4. Implement the smallest useful working version.
5. Run the relevant checks.
6. Fix errors.
7. Report what was implemented and what was actually tested.
8. Update `TASKS.md`. Use `Verified` only after the completion criteria have been checked. Code existing is `Implemented`, not `Verified`.
9. Update `GAME_PLAN.md`, `GAME_DESIGN.md`, or `CHAPTER_01.md` if the implementation changes or clarifies a design decision.
10. Wait for approval before the next major milestone.

## Status meanings

| Status | Meaning |
|---|---|
| Not Started | No implementation yet. |
| In Progress | Work has begun and is not ready to review. |
| Blocked | Cannot proceed until a named dependency or decision is resolved. |
| Implemented | The work exists, but completion criteria are not yet verified. |
| Verified | Completion criteria have been checked and the result matches the docs. |

## Placeholders

Label stand-in numbers, names, models, narration, and encounter data as placeholders in code and in the decision log.

Do not give the Chapter 1 boss a canonical name, motive, or relationship to Orin. Do not write placeholder narration that adds plot.

## Repository map

| Path | Role |
|---|---|
| `AGENTS.md` | Rules for future agents. |
| `GAME_PLAN.md` | Vision, architecture, phases, decision log. |
| `GAME_DESIGN.md` | Mechanics and story reference. |
| `CHAPTER_01.md` | Chapter 1 script and gameplay structure. |
| `TASKS.md` | Implementation checklist and status. |

`README.md` is the original repository stub. The planning documents are the working source of truth.
