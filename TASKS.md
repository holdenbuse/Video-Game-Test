# When the Flowers Fade — Tasks

**Drafted:** 2026-11-13  
**Rule:** A task is not `Verified` because a file exists. `Verified` requires the completion criteria to have been checked. Do not start a milestone's gameplay until the owner approves that milestone.

Related documents: `AGENTS.md`, `GAME_PLAN.md`, `GAME_DESIGN.md`, `CHAPTER_01.md`.

## Status and priority

| Status | Meaning |
|---|---|
| Not Started | No work yet. |
| In Progress | Started, not ready to review. |
| Blocked | Waiting on a named task or open question. |
| Implemented | The work exists. Criteria have not been verified. |
| Verified | Criteria were checked against the result. |

| Priority | Meaning |
|---|---|
| Critical | Required for the current gate or for the prototype to function. |
| High | Required for Chapter 1's playable spine. |
| Medium | Required by the design, but after the spine exists. |
| Low | Polish or later-chapter support. |

Open questions cited below are defined in `GAME_DESIGN.md` §18. Do not close them by inventing an answer.

## Current gate

| Gate | State |
|---|---|
| Milestone 0 documents drafted | Verified by owner approval on 2026-11-13 |
| Milestone 0 owner approval | Verified |
| Milestone 1 gameplay | Verified in the browser. |
| Milestone 2 Petal Streams | Verified in the browser. Do not start Milestone 3 without approval. |

## Planning

| ID | Task | Phase | Priority | Status | Dependencies | Completion criteria |
|---|---|---|---|---|---|---|
| P-01 | Create `GAME_PLAN.md` | Planning | Critical | Verified | None | The file states vision, browser-versus-UE5 scope, system boundaries, milestones 0–10, and the decision log. |
| P-02 | Create `GAME_DESIGN.md` | Planning | Critical | Verified | None | The file records established mechanics, characters, progression, the XP table, and unresolved items as `TBD`. |
| P-03 | Create `CHAPTER_01.md` | Planning | Critical | Verified | None | The file gives Sequences 1–13, the three-puzzle encounter-order rule, and Chapter 1 prohibitions. |
| P-04 | Create `TASKS.md` | Planning | Critical | Verified | None | Every task has a name, phase, priority, status, dependencies, and completion criteria. |
| P-05 | Create `AGENTS.md` | Planning | Critical | Verified | None | Future agents are instructed to read the four design documents before significant changes. |
| P-06 | Review consistency between documents | Planning | Critical | Verified | P-01, P-02, P-03, P-04, P-05 | A review has been recorded in `GAME_PLAN.md` §7 and `GAME_DESIGN.md` §18. The owner approved the set on 2026-11-13. |
| P-07 | Owner approval of the planning set | Planning | Critical | Verified | P-06 | The owner accepted the documents on 2026-11-13. Recorded as TD-008. This approval covers Milestone 1, not every later milestone. |

## Foundation

Milestone 1. Do not start until P-07 approves Milestone 1.

| ID | Task | Phase | Priority | Status | Dependencies | Completion criteria |
|---|---|---|---|---|---|---|
| F-01 | Initialize the Vite project | Foundation | Critical | Verified | P-07 | `npm` scripts exist for dev and production build. The app opens in a browser. |
| F-02 | Configure Three.js | Foundation | Critical | Verified | F-01 | A Three.js scene renders a canvas without console errors. |
| F-03 | Create the game scene | Foundation | Critical | Verified | F-02 | Initialization code owns the scene, camera, and renderer and does not contain puzzle or combat rules. |
| F-04 | Implement the rendering loop | Foundation | Critical | Verified | F-03 | The frame loop updates and draws continuously while the page is open. |
| F-05 | Implement the isometric camera | Foundation | High | Verified | F-04 | The camera uses an isometric-style view. It follows Orin until the player pans, and recenter sticks it back (TD-012). Rechecked in the browser on 2026-11-13. |
| F-06 | Implement camera rotation | Foundation | High | Verified | F-05 | The player can rotate the view around its focus. |
| F-07 | Implement camera zoom | Foundation | High | Verified | F-05 | The player can zoom in and out within set limits. |
| F-08 | Implement click-to-move | Foundation | Critical | Verified | F-04, F-12 | Clicking a valid point makes Orin walk there smoothly and turn along the path. |
| F-09 | Implement collision | Foundation | Critical | Verified | F-08 | Orin does not pass through blocking garden geometry. |
| F-10 | Implement obstacle avoidance or pathfinding | Foundation | Critical | Verified | F-09 | A click behind a simple obstacle produces a valid route or a clear rejection. Cutting through the obstacle is not accepted. |
| F-11 | Show destination feedback | Foundation | High | Verified | F-08 | The selected destination is visible until Orin arrives or the move is replaced. |
| F-12 | Add placeholder young Orin | Foundation | Critical | Verified | F-03 | A recognizable placeholder character stands in the garden, and the view can return to them. Gender selection is not required (Q-008). |

## Garden

Milestone 1 uses only enough of this phase to walk and interact. The rest supports later garden milestones.

| ID | Task | Phase | Priority | Status | Dependencies | Completion criteria |
|---|---|---|---|---|---|---|
| G-01 | Create garden terrain | Garden | Critical | Verified | F-03 | The playable surface has bounds and is the walkable ground for Milestone 1. |
| G-02 | Add pathways | Garden | High | Verified | G-01 | Paths are visually distinct from planting beds and connect the areas Orin can walk. |
| G-03 | Add the fountain | Garden | High | Verified | G-01 | A fountain landmark exists. This task does not require the Fountain puzzle to function. |
| G-04 | Add flowers and trees | Garden | High | Verified | G-01 | Placeholder plants make the space read as a garden, including flowers that later puzzles can reuse. |
| G-05 | Add garden architecture | Garden | Medium | Verified | G-01 | Walls, beds, or estate edges block and guide movement without a minimap. |
| G-06 | Add interactable objects | Garden | High | Verified | F-08, G-01 | The interaction system can target an object in the world. No inventory is created. |
| G-07 | Add one Milestone 1 test interaction | Garden | Critical | Verified | G-06 | The player can interact with a test object and receive visible confirmation. This satisfies the Milestone 1 interaction requirement. |
| G-08 | Support exploration without HUD navigation | Garden | Medium | Verified | G-02, G-05 | The garden test is playable without a minimap, compass, or waypoint arrow. |

## Puzzles

| ID | Task | Phase | Priority | Status | Dependencies | Completion criteria |
|---|---|---|---|---|---|---|
| Z-01 | Build the puzzle framework | Puzzles | Critical | Verified | G-06 | A puzzle can declare an objective, reset, record completion once, and refuse repeat rewards. A wrong action does not permanently block the garden. Checked by the completion-log tests and a browser solve, reset, and second solve of Petal Streams. |
| Z-02 | Implement Petal Streams | Puzzles | Critical | Verified | Z-01 | The player can route the puzzle's magical energy, see feedback, get confirmation, reset, and continue exploring. Layout details that are still `TBD` use a labeled placeholder (Q-013). Checked in the browser: the light reaches the basin, the first toast is "Petal Streams complete.", and the second is "Petal Streams is already complete." |
| Z-03 | Implement The Fountain | Puzzles | High | Not Started | Z-01, G-03 | The player can solve a growth-and-water puzzle at the fountain, reset it, and keep the completion. |
| Z-04 | Implement Memory Flowers | Puzzles | High | Not Started | Z-01, G-04 | Four flowers are shown for seven seconds. Recreating them succeeds. Looking again resets the attempt. The general reset still exists. |
| Z-05 | Allow any puzzle order | Puzzles | Critical | Not Started | Z-02, Z-03, Z-04 | Any of the three puzzles can be solved first, second, or third. No fourth puzzle exists. |
| Z-06 | Separate puzzle casts from combat casts | Puzzles | Medium | Verified | Z-01 | Environmental puzzle interactions do not depend on the combat ability bar unless a later approved decision unifies them. Petal Streams turns from a world click. No combat bar is on screen. Checked while solving it in the browser. |

## Combat

Milestone 3 is the tutorial slice. Later rows are established rules and must not be dropped, but they are not all required to call the tutorial playable.

| ID | Task | Phase | Priority | Status | Dependencies | Completion criteria |
|---|---|---|---|---|---|---|
| C-01 | Build the combat framework | Combat | Critical | Not Started | F-04 | A battle runs in the 3D scene with visible initiative, turn order, health, victory, and party defeat. No random encounters exist. |
| C-02 | Implement Action Points | Combat | Critical | Not Started | C-01 | Each turn starts at 4 AP. Unused AP is discarded. Costs come from ability data. |
| C-03 | Implement combat movement | Combat | Critical | Not Started | C-01, F-10 | The player sees range, path, and extra AP cost. Movement can be split around actions. A confirmed move is not undone. |
| C-04 | Implement basic attacks | Combat | Critical | Not Started | C-02 | A basic attack costs its defined AP, has no cooldown, and hits an unobstructed target. |
| C-05 | Implement the four starting abilities | Combat | Critical | Not Started | C-02 | Petal Dart, Root Snare, Bloom Shield, and Resonant Pulse exist as data. Unpublished numbers are labeled placeholders (Q-015). |
| C-06 | Implement cooldowns | Combat | High | Not Started | C-05 | Magical abilities can be on cooldown. Basic attacks cannot. |
| C-07 | Implement tutorial UI | Combat | Critical | Not Started | C-01 | Panels explain one idea at a time, highlight the control, pause for a required guided action, and dismiss themselves. None of this text is a book page. |
| C-08 | Implement the Garden Guardian tutorial | Combat | Critical | Not Started | C-03, C-04, C-06, C-07 | The player can finish Encounter 1 against the nonlethal guardian. The result is not presented as a death. Bloom Shield is the defensive lesson. |
| C-09 | Implement enemy turns | Combat | Critical | Not Started | C-01 | The guardian acts on its initiative. The tutorial AI may be simple, but it uses the enemy-turn system rather than a scripted player-only sequence. |
| C-10 | Implement Encounter 2 | Combat | High | Not Started | C-08, Z-05 | The second completion starts a standard battle with more freedom than the tutorial. The enemy stays a labeled placeholder until Q-011 is answered. |
| C-11 | Implement encounter-order progression | Combat | Critical | Not Started | Z-05, C-08, C-10, C-12 | Completion count, not puzzle identity, selects tutorial, then standard battle, then boss. A second puzzle cannot increment the count before the current completion is bound to its encounter. Rewards happen once. |
| C-12 | Implement the garden boss framework | Combat | High | Not Started | C-01 | A boss can run with one HP pool and a signature action. A placeholder has no canonical name or story role (Q-012). Encounter selection is C-11, not this task. |
| C-13 | Implement boss phase checkpoints | Combat | High | Not Started | C-12 | A phase checkpoint restores the exact in-memory combat state. Persisting that checkpoint in a save slot is completed with X-07. |
| C-14 | Implement opportunity attacks | Combat | Medium | Not Started | C-03 | Leaving melee range can cause one automatic attack per eligible combatant per round. It spends no AP. The move preview warns the player. |
| C-15 | Implement cover and elevation | Combat | Medium | Not Started | C-04 | Partial cover can reduce accuracy. Full cover blocks applicable direct attacks. Elevation can improve accuracy and critical chances. No flanking bonus exists. |
| C-16 | Implement friendly-fire warnings | Combat | Medium | Not Started | C-05 | Only abilities flagged for friendly fire can harm allies, and the UI warns before those targets are confirmed. |
| C-17 | Implement status effects | Combat | Medium | Not Started | C-05 | Reapplying a status refreshes duration and does not stack strength. Fixed immunities work. No percentage resistance or buildup exists. |
| C-18 | Implement battlefield hazards | Combat | Medium | Not Started | C-01 | A hazard can affect movement or health, including an immediate trigger and an end-of-round change that was telegraphed. |
| C-19 | Implement tactical enemy AI | Combat | High | Not Started | C-09 | Non-tutorial enemies choose actions from a tactical profile. Difficulty can select a simpler or smarter profile. The UI does not predict every attack in advance. |
| C-20 | Implement reinforcements | Combat | Low | Not Started | C-19 | A scripted, finite reinforcement can enter after a telegraph. Not required for the garden unless a later encounter design asks for it. |
| C-21 | Implement ultimate charge | Combat | Low | Not Started | C-05 | Charge starts at zero each battle and can become available through authored actions. Multiple-ultimate charge behavior waits on Q-017. |
| C-22 | Implement combat UI presets | Combat | Medium | Not Started | C-01 | Minimal, Balanced, and Advanced presets can show the combat fields allowed in `GAME_DESIGN.md` §14. Targeting does not reveal exact damage or hidden weaknesses. |
| C-23 | Restore the party after victory | Combat | High | Not Started | C-01 | Knocked-out active members return at full health after victory. A total-party defeat offers retry or load and does not advance the story. |

## Story

| ID | Task | Phase | Priority | Status | Dependencies | Completion criteria |
|---|---|---|---|---|---|---|
| S-01 | Build the story-event system | Story | Critical | Not Started | F-03 | Chapter events are data with order and flags, not a single hard-coded script. |
| S-02 | Implement the ancient-book presentation | Story | High | Not Started | S-01 | Illustrated pages, short captions, and page turns can play. Placeholder art is allowed. The book cannot start a puzzle, a battle, or a control lesson. |
| S-03 | Implement page-turn transitions | Story | High | Not Started | S-02 | Opening, the time jump, and the chapter ending change pages and then enter the correct 3D scene. |
| S-04 | Implement the dialogue system | Story | High | Not Started | S-01 | In-world lines can play with a speaker. Dialogue is not displayed as a book page. |
| S-05 | Implement character interaction | Story | High | Not Started | G-06, S-04 | Orin can approach a story character and start that character's current interaction. |
| S-06 | Implement the invitation | Story | High | Not Started | C-12, S-04 | After the garden boss, the academy head invites Orin on the estate. Q-001 and Q-009 stay open in the text. |
| S-07 | Implement the time jump | Story | High | Not Started | S-03, S-06 | The book moves the story forward several years and resumes at academy age, about 19. |
| S-08 | Build the academy environment | Story | High | Not Started | F-08 | A placeholder castle can be explored without minimap navigation. The intact arrival state is separate from the damaged state. |
| S-09 | Implement academy arrival | Story | High | Not Started | S-07, S-08 | Orin enters the accessible academy in a state that reads as wonder and anticipation. |
| S-10 | Implement character introductions | Story | High | Not Started | S-05, S-09 | Rowan, Mira, Tilly, and the White Prince can be met in world. Copy waits on Q-024 and does not include later deaths. |
| S-11 | Implement companion follow | Story | High | Not Started | F-10, S-10 | After a companion has joined exploration, they follow Orin. The player still directly controls only Orin. Join timing waits on Q-005. |
| S-12 | Implement the Grand Hall ceremony | Story | High | Not Started | S-10 | The ceremony, individual visions, Orin's impossible comforting memory, and the whispered "Orin." can play. Vision details wait on Q-023. |
| S-13 | Implement the catastrophe | Story | High | Not Started | S-12 | The attack, the leader's death, and the castle's collapse play without naming the antagonist and without a second boss. |
| S-14 | Implement the escape | Story | High | Not Started | S-13, S-11 | Orin and the companions leave through a playable sequence. Route and obstacles wait on Q-004. No second boss is added. |
| S-15 | Implement the aftermath | Story | High | Not Started | S-14 | The group can see the scale of the damage and register that the event is larger than one attack. |
| S-16 | Implement the chapter ending | Story | High | Not Started | S-15, S-03 | The book returns and advances the story to Chapter 2. |
| S-17 | Connect Chapter 1 end to end | Story | Critical | Not Started | S-16, C-11, Z-05 | A playthrough can run Sequences 1–13 in order, including any puzzle order in the garden. |

## Progression

| ID | Task | Phase | Priority | Status | Dependencies | Completion criteria |
|---|---|---|---|---|---|---|
| X-01 | Implement the XP system | Progression | High | Not Started | Z-01, C-01 | Combat, puzzle, exploration, and discovery awards match the timing rules and grant each unique reward once. |
| X-02 | Implement leveling | Progression | High | Not Started | X-01 | The curve matches `GAME_DESIGN.md` §19. Level 50 requires 110,348 cumulative XP and then XP stops. |
| X-03 | Implement skill points | Progression | High | Not Started | X-02 | Level-ups grant one point. Levels 10, 20, 30, 40, and 50 also grant the bonus. The total at level 50 is 54, with none after. |
| X-04 | Implement skill-tree structure | Progression | Medium | Not Started | X-03 | Four branches, two paths, four tiers, and a 25-point mastery cost can be represented. Node contents wait on Q-016 and are not invented. |
| X-05 | Spend skills outside combat | Progression | Medium | Not Started | X-04 | Points can be spent only outside combat. Unlocked skills are available without equipment slots. |
| X-06 | Implement chapter-start respec | Progression | Medium | Not Started | X-05, S-01 | Respec is offered at a chapter beginning and is not available in the middle of a chapter. No preset system is added. |
| X-07 | Implement saving and loading | Progression | High | Not Started | S-01, C-01 | Autosave covers chapter transitions, encounters, puzzle completion, and important story events. Manual save works outside combat and major sequences. Multiple slots exist. |
| X-08 | Implement the encyclopedia | Progression | Medium | Not Started | S-04 | Lore, discoveries, enemy notes, and found weaknesses can be recorded. Entries do not spoil future chapters. The early presentation is the bright manuscript state. |
| X-09 | Implement difficulty settings | Progression | Medium | Not Started | C-19, Z-01 | Story, Explorer, Balanced, and Challenging exist. Balanced is the default. The choice is locked during combat. XP and story results stay identical. Numeric tuning waits on Q-019. |
| X-10 | Implement magic perception | Progression | Low | Not Started | G-06 | When approved, perception highlights magical interaction and does not reveal a full solution or deal damage. Availability waits on Q-014. Do not enable it in Chapter 1 before that answer. |
| X-11 | Design the Chapter 1 XP budget | Progression | Medium | Not Started | X-02, P-07 | Proposed Chapter 1 awards are checked against the level-9 target of 1,780 cumulative XP. The target is not copied blindly into rewards. |

## Release and polish

| ID | Task | Phase | Priority | Status | Dependencies | Completion criteria |
|---|---|---|---|---|---|---|
| REL-01 | Browser testing | Release | Critical | Not Started | The milestone under test | The milestone success condition is exercised in a browser and the result is recorded on the task. |
| REL-02 | Performance testing | Release | Medium | Not Started | F-04 | The garden scene keeps a playable frame rate in the browser used for the test. Record the browser and the observation. |
| REL-03 | Production build verification | Release | High | Not Started | F-01 | `vite build` completes and the built output loads. |
| REL-04 | Prepare Vercel deployment | Release | Medium | Verified | REL-03 | `vercel.json` tells Vercel to install dependencies, run `npm run build`, and publish `dist`. The Vercel check on commit `1ed8711` completed successfully. A separate manual deploy was not run. |
| REL-05 | Playable prototype review | Release | High | Not Started | S-17, REL-01 | A Chapter 1 prototype review notes what was played and which tasks are `Verified`. |
| POL-01 | Lighting | Polish | Low | Not Started | G-01 | Garden light supports navigation. It does not replace landmarks with UI markers. |
| POL-02 | Environment art | Polish | Low | Not Started | G-05, S-08 | Placeholder geometry can be replaced without changing collision and puzzle positions that were verified. |
| POL-03 | Character animation | Polish | Low | Not Started | F-12 | Movement and major actions are animated. Gameplay does not wait on this task. |
| POL-04 | Audio | Polish | Low | Not Started | S-02, C-01 | Placeholder or final audio can play for book, movement, and combat. Voice scope waits on Q-022. |
| POL-05 | UI presentation | Polish | Low | Not Started | C-22, X-08 | Combat, tutorial, and encyclopedia UI match the restrained fantasy presentation. Function remains the earlier UI tasks. |
| POL-06 | Camera polish | Polish | Low | Not Started | F-06, F-07 | Follow, pan, recenter, rotation, and zoom behave as TD-012. Further feel polish is still open. |
| POL-07 | Bug-fix pass | Polish | High | Not Started | REL-01 | Defects found in a tested milestone are fixed and the failed check is run again. |

## Explicitly rejected work

Do not add tasks that implement the following unless the owner changes the design:

- Unreal Engine or Unity project setup.
- Inventory, currency, loot, gear, or crafting.
- Minimap, objective compass, or constant waypoint arrows.
- Random encounters, flanking, mid-battle revive, or free retreat.
- Branching choices, alternate endings, optional recruits, or a party bench.
- Book pages that teach controls or host a puzzle or battle.
- A fourth garden puzzle or a second Chapter 1 boss.
- Automatic Vercel deployment.
- A canonical antagonist identity in Chapter 1 content.

## Status log

| Date | Change |
|---|---|
| 2026-11-13 | Planning tasks P-01 through P-06 marked `Implemented` after the initial documents were written and cross-checked. None are `Verified`. No gameplay tasks started. |
| 2026-11-13 | Owner approved the planning set and Milestone 1. P-01 through P-07 marked `Verified`. Milestone 1 foundation and garden tasks marked `Verified` after browser play, pathfinding tests, and a scripted click that produced the pedestal confirmation. |
| 2026-11-13 | Vercel reported a failed deployment for the garden commit. Added explicit Vite build settings. REL-04 is `Implemented`, not `Verified`. |
| 2026-11-13 | Vercel deployment for `1ed8711` completed successfully. REL-04 marked `Verified`. |
| 2026-11-13 | Owner approved Milestone 2 and asked for the view to move away from Orin as well as stay on them. F-05 rechecked. Z-01, Z-02, and Z-06 marked `Verified` after unit tests and a browser solve, reset, and second solve. Combat was not started. |
