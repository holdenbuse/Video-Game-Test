# Chapter 1 — When the Flowers Fade

**Status:** Finalized timeline, with implementation details still open  
**Drafted:** 2026-11-13

This is the chronological story and gameplay structure for Chapter 1. Combat, puzzle, and progression rules that apply to every chapter are in `GAME_DESIGN.md`. Do not add scenes, characters, or deaths that this chapter does not list.

## 1. Structural exception

A typical chapter ends with its boss. Chapter 1 does not.

The Chapter 1 boss is fought in Orin's childhood garden, before the academy storyline. After that fight, the chapter continues through the invitation, a time jump, academy arrival, introductions, the Grand Hall ceremony, the catastrophe, the escape, and the aftermath. The book then opens Chapter 2.

Chapters 2–10 are expected to conclude with their own bosses. Their contents are not defined here.

## 2. Invariants

These are fixed. An implementation that breaks one of them is wrong even if it is playable.

- Exactly three garden puzzles: Petal Streams, The Fountain, and Memory Flowers.
- The three puzzles may be completed in any order.
- Exactly three garden combat encounters, including the boss.
- The first puzzle completed starts Encounter 1, the tutorial.
- The second puzzle completed starts Encounter 2, a standard introductory battle.
- The third puzzle completed starts Encounter 3, the garden boss.
- Puzzle identity never selects the encounter. Completion count does.
- There is no fourth garden puzzle, no extra garden encounter, and no second Chapter 1 boss.
- The garden boss is not the end of the chapter.
- The ancient book does not teach movement, combat, or puzzles, and it does not contain playable challenges.
- Playable events happen in the 3D world. This includes the invitation, the escape, and the boss.
- Chapter 1 presents early, colorful Orin. Do not apply the later monochrome transformation here.
- Do not reveal the antagonist's identity.
- Do not depict or foreshadow the later deaths of Mira, Rowan, Tilly, Tilly's creature, or the White Prince.
- Do not introduce the Old Stranger or Arthur unless a later revision adds them. They are not in this chapter's meeting list.

Completing a puzzle requests the next encounter in that fixed sequence. Record the completion and bind it to the encounter before another puzzle can increment the counter. That keeps "first, second, and third" stable if the player is standing near another puzzle.

Between encounters, garden exploration continues. A completed puzzle stays complete and cannot be farmed.

## 3. Chronological sequences

### Sequence 1 — Opening book

The narrator introduces Orin and the world. The narrator's identity is unknown. The book then transitions into the playable childhood garden.

This sequence may use illustrated pages, short captions, voice narration, and a page turn. It may not teach controls.

### Sequence 2 — Childhood garden exploration

Orin is about 11–12. The player explores the garden of the family estate.

This sequence introduces:

- Movement.
- Camera controls.
- Interaction.
- Magical objects.
- Environmental navigation without a minimap or objective arrow.

Orin already possesses Petal Dart, Root Snare, Bloom Shield, and Resonant Pulse. Tutorials introduce how to use them over time. Having them does not mean Sequence 2 explains them all.

The party in this garden is Orin alone under the current timeline, because Rowan, Mira, Tilly, and the White Prince are met after the time jump. Confirm with Q-032 before adding anyone else to the garden fights.

### Sequence 3 — Three garden puzzles

All three exist in the garden and can be solved in any order.

#### Petal Streams

An introductory energy-routing puzzle. It introduces Petalcraft and environmental magic. The playable prototype, labeled in the garden, puts a fixed bloom, two straight flowers, one elbow, and a basin on the north-west lawn. The player turns the flowers so the light reaches the basin. A stone resets them. The first solution is stored for the browser session and does not start combat. The final objects and layout are still `TBD` (Q-013).

#### The Fountain

An environmental puzzle about magical growth and water mechanisms. It introduces Overgrowth and manipulating the environment. The exact mechanism is `TBD` (Q-013).

#### Memory Flowers

The player studies an arrangement of four flowers for seven seconds, then recreates it. Looking at the arrangement again resets that attempt. The general puzzle reset also exists. Input and layout details may be refined later (Q-013).

No magic branch is assigned to Memory Flowers. Leave it unassigned.

Every puzzle needs a visible objective, a reset, a stored completion flag, and a one-time result. A mistake must not soft-lock the chapter.

### Sequence 4 — Three combat encounters

Each completed garden puzzle starts one encounter. Difficulty and encounter type follow completion order.

#### Encounter 1 — tutorial

A guided combat tutorial against a nonlethal Garden Guardian.

Introduce, using short UI panels and highlighted controls:

- Initiative.
- Four Action Points.
- Movement.
- Basic attacks.
- Defensive abilities.
- Cooldowns.
- Turn progression.

Pause combat when a mandatory guided action is required. Remove each panel when it is done. The book does not narrate this lesson.

Bloom Shield is the established starting defensive ability, so it is the defensive ability this tutorial introduces. The moment Petal Dart, Root Snare, and Resonant Pulse are taught in combat is `TBD` (Q-002, Q-003). Do not dump all four schools into the first panel.

The guardian's defeat uses the normal combat result. The story outcome is not a death.

#### Encounter 2 — standard battle

A standard introductory battle. The player uses the mechanics from Encounter 1 with more freedom. The enemy is `TBD` (Q-011). Use a labeled placeholder until the owner defines the enemy. Do not give that placeholder a role in the academy conspiracy or a relationship to Orin.

#### Encounter 3 — garden boss

The boss begins after the third puzzle is completed. Identity, mechanics, and phases are `TBD` (Q-012).

A placeholder may exercise the boss framework: one HP pool, visible phase divisions if more than one phase is needed to test checkpoints, a signature action, and a checkpoint that stores the combat state. The placeholder needs a temporary label in data, not a canonical name or story purpose.

Full-game boss duration of 20–30 minutes is not a requirement for this introductory fight.

### Sequence 5 — Academy invitation

After the garden boss, the academy's head personally visits the family estate and invites Orin to attend. This happens in the game world, not as a book page that replaces the visit.

Parent presence and names are `TBD` (Q-009). Whether "head" and the later "leader" are the same person is `TBD` (Q-001).

### Sequence 6 — Book time jump

The narrator advances the story several years. Orin is now about 19. The book transitions into the academy arrival.

This is a story transition. It is not a puzzle, a lesson, or a playable combat.

### Sequence 7 — Academy arrival

Orin arrives at the enormous ancient castle. The player explores the accessible academy environment. The tone is wonder, opportunity, and anticipation.

The playable boundary of "accessible" is `TBD` within this sequence. Do not include the catastrophe's destruction yet.

### Sequence 8 — Character introductions

Orin meets Rowan, Mira, Tilly, and the White Prince. Personalities and relationships are established through in-world dialogue and interaction.

Order and conversation text are `TBD` (Q-024).

Established personalities to preserve when the text is written:

| Character | What Chapter 1 may show |
|---|---|
| Rowan | Male companion. Teal geometric or crystalline magic. Part of the forming group. |
| Mira | About Orin's age. Defensive magic and shields. Strong, but her protection has limits. Do not show her death or the childhood gift unless Q-010 explicitly places the gift here. |
| Tilly | Joyful, younger, immediately likable. Bright rainbow-inspired magic. Small floating creature with her. |
| The White Prince | Highly skilled, aggressive, a contrast to Orin's elegance. |

By the escape, Orin and the companions leave together. The moment each person becomes an active combat party member is `TBD` (Q-005). Meeting them is not, by itself, a statement that all four are already in the combat party.

### Sequence 9 — Grand Hall ceremony

A ceremony gathers students and important figures. Participants experience individual magical visions.

Orin experiences an impossible, comforting memory or feeling from a life they have never lived. Further content of that vision is `TBD` (Q-023). Do not identify the antagonist through it.

The academy's leader recognizes something significant and whispers:

> Orin.

Whether this leader is the head from Sequence 5 is Q-001.

### Sequence 10 — The catastrophe

The antagonist attacks. The academy's leader is killed. A catastrophic magical event begins. The castle falls into chaos. The event comes from betrayal inside the academy.

Do not name or unmask the antagonist. Do not add a Chapter 1 boss to this sequence.

### Sequence 11 — Escape

Orin and the companions escape the damaged academy in the playable world. Obstacles and the route are `TBD` (Q-004).

There is no second Chapter 1 boss. Do not add a boss-like duel and call it an escape encounter. If the approved escape later includes ordinary scripted combat, that combat still has to be designed first; it is not implied by this sequence.

### Sequence 12 — Aftermath

The survivors reach a place where they can see the scale of the destruction. The castle and the surrounding environment are enormously damaged. The group begins to understand that the catastrophe is larger than a single attack.

### Sequence 13 — Chapter ending

The book returns. The narrator advances the story into Chapter 2. The chapter ends.

## 4. Suggested playable order versus simulation order

The player can roam the garden and choose puzzle order. The story order of the three fights is still fixed. A useful state model is:

| State | Player can | Next story beat |
|---|---|---|
| Garden open | Explore and attempt any unsolved puzzle | First puzzle completion |
| Encounter pending or active | Fight the encounter bound to the current count | Return to the garden on victory |
| One puzzle complete | Explore and attempt either remaining puzzle | Second completion |
| Two puzzles complete | Explore and attempt the last puzzle | Boss |
| Boss defeated | Leave combat at full health under the normal victory rule | Invitation |
| Invitation done | — | Book time jump |
| Academy open | Explore the intact accessible castle | Introductions and ceremony |
| After the whisper | — | Catastrophe, then escape, aftermath, and book ending |

Defeat of the whole party returns the player to a retry or a save. It does not advance the story. Individual knockout still removes that character only until victory restoration. In the garden, the active party is Orin, so Orin's defeat ends the encounter.

## 5. What each garden system must remember

| Fact | Stored result |
|---|---|
| Petal Streams solved | Once. Unlocks no specific encounter identity. |
| Fountain solved | Once. |
| Memory Flowers solved | Once. |
| Completion count | 0–3. Selects the encounter. |
| Encounter 1, 2, and 3 cleared | Once each. No repeat XP. |
| Boss checkpoint | Exact combat state at the phase checkpoint. |
| Invitation, ceremony, catastrophe, escape | Story flags in the event system, not book-only flags. |

## 6. Milestone mapping

Do not build this whole chapter in one pass. The approved unit of work is one milestone from `GAME_PLAN.md`.

| Milestone | Chapter 1 slice |
|---|---|
| 1 | Sequence 2 only, as a walking prototype with one test interaction. |
| 2 | Petal Streams, without requiring combat. |
| 3 | Encounter 1, the Garden Guardian tutorial. |
| 4 | Fountain, Memory Flowers, and any-order selection. |
| 5 | Completion count selects the three encounters. |
| 6 | Placeholder for Encounter 3. |
| 7 | Book shell, dialogue, and story triggers, with placeholder art and narration. |
| 8 | Academy spaces and event data for Sequences 7–12. |
| 9 | Sequences 1–13 connected. |
| 10 | Presentation, audio, saving, and fixes. No new plot. |

## 7. Placeholder policy for this chapter

Allowed until the owner replaces them:

- Greybox garden and castle geometry.
- A single placeholder young Orin, then a placeholder academy-age Orin after the time jump.
- Temporary combat numbers, marked as placeholders.
- Temporary Encounter 2 and boss data, without canonical names or lore.
- Stand-in book illustrations and narration that only cover events already in this document.

Not allowed in placeholders:

- A boss name that later has to be retconned out of the story.
- A hint of who the antagonist is.
- A prophecy, vision, or gift scene that is not already written above.
- An extra puzzle or an extra boss.
- Tutorial text delivered as a book page.

## 8. Chapter-specific open questions

Full wording is in `GAME_DESIGN.md` §18.

| ID | Chapter 1 impact |
|---|---|
| Q-001 | Invitation speaker versus ceremony speaker and victim. |
| Q-002 | Where Resonant Pulse is taught, if it is taught here. |
| Q-003 | Combat lesson order after Bloom Shield. |
| Q-004 | Escape route and whether any non-boss combat exists. |
| Q-005 | When the four companions enter the combat party. |
| Q-007 | How Tilly's creature is shown when she is introduced. |
| Q-008 | Gender presentation once Orin is no longer a neutral prototype mesh. |
| Q-009 | Parents during the invitation. |
| Q-010 | Do not add Mira's gift to this chapter unless the answer places it here. |
| Q-011 | Encounter 2 enemy. |
| Q-012 | Garden boss identity and mechanics. |
| Q-013 | Exact puzzle layouts. |
| Q-014 | Do not add magic perception to the garden unless it is approved for Chapter 1. |
| Q-023 | Limits of the ceremony vision. |
| Q-024 | Introduction order and dialogue. |
| Q-032 | Confirm solo garden party. |
