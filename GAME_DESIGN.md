# When the Flowers Fade — Game Design

**Status:** Established design reference  
**Drafted:** 2026-11-13

This is the mechanics, world, character, progression, and storytelling reference. Chapter 1's scene order is in `CHAPTER_01.md`. Architecture and milestones are in `GAME_PLAN.md`.

Undecided items are marked `TBD`. Do not fill them in during implementation. Questions are collected in §18.

## 1. Game identity

| Item | Established value |
|---|---|
| Title | When the Flowers Fade |
| Genre | Story-driven fantasy RPG, tactical combat, environmental puzzles, exploration |
| Perspective | 3D isometric |
| Mode | Single-player |
| Estimated length | 10–12 hours |
| Structure | 10 chapters, primarily linear |
| Endings | One predetermined story. No alternate endings. |
| Dialogue choices | None currently planned. |

**Themes:** beauty and impermanence; the consequences of power; loss and change; identity; memory; the deterioration of innocence; creation and destruction.

## 2. Player fantasy and change

The player is Orin. The world begins colorful and full of possibility. People around Orin are lost, Orin's magic grows more powerful, and Orin's appearance and abilities become darker and less colorful. Flowers deteriorate visually as Orin changes. The change is gradual. It is not an immediate transformation, and it does not begin as a Chapter 1 visual state.

By the ending, Orin resembles the antagonist whose actions set the story in motion.

## 3. Storytelling

### 3.1 The ancient book

A mysterious narrator reads an ancient illustrated historical book about Orin. The narrator's identity is unknown. Do not invent it.

The book contains illustrated pages, short captions, voice narration, page-turn transitions, major story developments, time jumps, and chapter transitions.

The book is exclusively for advancing the story. It must not be used for:

- Teaching controls.
- Explaining combat.
- Delivering puzzle instructions or gameplay hints.
- Replacing ordinary character dialogue.
- Presenting playable puzzles or combat.

### 3.2 Play in the world

Exploration, interaction, dialogue, puzzles, combat, environmental events, escapes, and boss battles happen in the 3D world. Character dialogue is fully voiced where planned. Which prototype lines are voiced is `TBD` (Q-022).

### 3.3 Cinematics

Major events may use brief in-engine cinematics. Combat may use short sequences for ultimate abilities, boss transformations, and major boss phases. The game does not depend on long animated cinematics. Book sequences carry major narrative transitions.

## 4. World

Magic is common. Most people have some magic. A smaller number of people have unusually powerful or rare abilities.

An ancient academy occupies an enormous castle. Admission is by personal invitation and is reserved for particularly gifted magic users. The academy represents excellence, opportunity, and prestige.

A catastrophic betrayal from inside the academy disrupts the institution and changes the nature of magic. The effects begin locally and eventually spread.

The antagonist is associated with that catastrophe and has an important connection to Orin. Their identity remains concealed until the intended reveal. Do not invent or disclose it in early content.

## 5. Characters

### 5.1 Orin

Orin is the player character.

| Trait | Value |
|---|---|
| Gender | Player-selectable. When the choice is offered, and whether it changes pronouns, voice, model, or all three, is `TBD` (Q-008). |
| Childhood age | About 11–12. |
| Academy age | About 19. |
| Eyes | Blue at first. Appearance changes later, gradually. |
| Magic | Flower-based, in four branches. See §10. |
| Family | Wealthy, prestigious, and magical. Parents are loving and supportive. Names, and whether they appear in the invitation scene, are `TBD` (Q-009). Do not invent a later fate for them. |
| Home | A large magical estate with an extensive garden. |
| Childhood | Happy, with many opportunities. |

**Starting personality:** confident, playful, adventurous, talented, occasionally reckless, and curious. Personality changes as the story progresses. Later personality beats are `TBD` beyond that direction.

**Early appearance:** bright colors, beautiful floral magic, elegant effects, lively presentation.  
**Late appearance:** increasingly monochrome, black and white flowers, more powerful and unsettling effects, gradually resembling the antagonist.

Orin starts at level 1 with four free basic abilities and no unspent skill points.

### 5.2 Mira

A companion about Orin's age. She specializes in defensive magic, especially shields. Her defense is strong but limited. She is unable to protect herself during a critical moment.

A childhood gift from Orin becomes symbolically important. The gift's form and the scene that establishes it are `TBD` (Q-010). It is not part of the Chapter 1 timeline as written. Do not add it to Chapter 1 without approval.

Her death is in the final battle and is a consequence of Orin's power. Whether that death is the same event as the critical moment above is `TBD` (Q-027). Do not introduce either outcome in Chapter 1.

### 5.3 Rowan

A male companion. His magic is teal and geometric or crystalline. He is part of Orin's primary group. He dies in a later chapter. The chapter and circumstances are `TBD` (Q-025). Do not invent them, and do not foreshadow the death in Chapter 1.

### 5.4 Tilly

A joyful younger companion. She should be immediately likable. Her magic is bright, colorful, and rainbow-inspired. A small floating magical creature accompanies her.

She dies relatively early in the larger story. The antagonist causes her death. The creature dies with her. Orin feels some responsibility. The tragedy is not directly Orin's fault. This is not a Chapter 1 event.

The creature's combat role is `TBD` (Q-007). It cannot be an extra combatant while Orin and all four named companions are active, because the party limit is five.

### 5.5 The White Prince

A highly skilled, aggressive fighter. His style contrasts with Orin's elegance. His weapons become more powerful as they sustain damage. Exact scaling is `TBD` (Q-026).

He is eventually killed as a consequence of Orin's anger. That is a later development, not a Chapter 1 event.

### 5.6 The Old Stranger

A mysterious, philosophical older man. He appears during the middle of the story, not in the Chapter 1 meeting list. He secretly has extraordinary magical power. He disappears during a major battle and returns later. He hints at the antagonist's identity without explaining it.

Established line:

> Even flowers fade in the winter, but some regrow in a new season.

### 5.7 Arthur

A mysterious figure visible only to Orin. He has no ordinary magical abilities. His apparent age changes between chapters. His clothing stays consistent. He is a grounding presence. His farewell is after the final puzzle.

His first chapter, and whether he ever occupies a combat slot, are `TBD` (Q-006, Q-028). He is not in the Chapter 1 introduction list.

### 5.8 The antagonist

A mysterious figure associated with the academy catastrophe, with an important connection to Orin. Identity concealed until the intended reveal. Do not invent a name, appearance canon, motive speech, or fate.

### 5.9 Academy head and academy leader

The Chapter 1 blueprint says the academy's head delivers Orin's invitation, and the academy's leader recognizes Orin at the ceremony, whispers "Orin," and is killed in the catastrophe. Whether these titles are one person is `TBD` (Q-001). Do not write a second victim or merge the roles until that is answered.

### 5.10 Companion rules

- Companions join according to the fixed story.
- No optional recruitment, party swapping, or bench.
- Maximum party size is five, including Orin.
- The player controls every active member in combat.
- The player controls only Orin in exploration. Companions follow automatically.
- Companions use the appropriate environmental ability when a relevant mechanism is activated.
- Companion dialogue and banter can play automatically.
- When a companion dies, their abilities disappear permanently.
- Orin does not inherit a dead companion's abilities.
- Companions level automatically with Orin.
- Companion skill trees are `TBD` (Q-018). Do not give them Orin's four-branch tree unless that is later designed.

The Chapter 1 garden is before any listed companion joins. Treat that garden's party as Orin alone unless the owner says otherwise (Q-032).

## 6. Chapter structure

A typical chapter:

1. Enter a new story location.
2. Explore.
3. Interact with characters and magical objects.
4. Complete environmental puzzles.
5. Enter the scripted combat that follows a completed puzzle.
6. Uncover more story and lore.
7. Complete the chapter's final puzzle.
8. Fight the chapter boss.
9. Transition into the next chapter.

Chapters 2–10 normally end with their boss. Their plots are not written. Do not invent them.

Chapter 1 places its only boss in the childhood garden, then continues through the academy catastrophe and escape. There is no second Chapter 1 boss. The full sequence is in `CHAPTER_01.md`.

**Watch item, not a contradiction:** full-game combat targets are about 5–10 minutes for an ordinary encounter, 15–20 for an elite, and 20–30 for a boss. Ten boss fights at that length consume a large part of a 10–12 hour game. Revisit when each chapter's encounter count exists. Chapter 1 tutorial fights do not have to hit these durations.

## 7. Exploration

### 7.1 Camera

Use a fully 3D isometric-style camera. The player can rotate it and zoom within limits. During ordinary exploration the view stays on Orin and follows them while they walk. Middle-drag, the arrow keys, and the on-screen pad pan the view away from Orin and leave it there. The Orin button, or C, sticks the view back on Orin, including while they walk. That is the prototype answer to Q-030.

### 7.2 Movement

Movement is primarily click-to-move. The player clicks a valid location and Orin walks there. Other control schemes are not specified (Q-031).

Required behavior:

- Smooth movement.
- Collision detection.
- Obstacle avoidance or pathfinding.
- Clear destination feedback.
- Natural rotation toward the path.
- Interaction with usable objects.

### 7.3 Interaction

The player uses magical mechanisms, doors and passages, puzzle devices, environmental objects, lore discoveries, and story characters.

There is no traditional inventory. The player does not collect and combine items in an inventory interface.

### 7.4 Navigation

Guide the player with landmarks, signs, composition, lighting, architecture, and recognizable interactive objects.

Do not implement a conventional minimap, an objective compass, or constant waypoint arrows.

### 7.5 Exploration rewards

Optional exploration can award experience, lore, Magical Encyclopedia entries, hidden discoveries, and occasional permanent bonuses.

There is no currency, conventional loot, gear progression, or crafting.

The specific permanent bonuses, and how they are stored without an inventory, are `TBD` (Q-021).

### 7.6 Magic perception

Orin can perceive magical traces and hidden mechanisms. This reveals interactive magical objects. It is not a direct attack, and it must not reveal a complete puzzle solution.

Whether it is available in Chapter 1 is `TBD` (Q-014). Do not add it to the garden tutorial unless approved.

## 8. Puzzles

Environmental puzzles are central. Each chapter introduces or develops one magical puzzle mechanic. Puzzles are physical arrangements in the 3D world, connected to that place rather than unrelated minigames.

Rules:

- Multiple puzzles in a chapter can generally be completed in any order.
- Puzzles become harder as the game progresses.
- Every puzzle has a clear objective.
- A reset option is available.
- A wrong action must not permanently block progression.
- Completion is recorded.
- A completed puzzle cannot be repeated for more XP.
- Hint availability depends on difficulty. The exact assistance per mode is `TBD` (Q-019).

**Standard combat link:** completing a puzzle triggers a scripted combat encounter, then exploration resumes. The final puzzle of a typical chapter triggers its boss.

Chapter 1 has three garden puzzles and three encounters, including its boss. Which encounter plays depends on how many puzzles have been completed, not on which puzzle was completed. See `CHAPTER_01.md`.

Puzzle interactions may express a magic branch in the environment. That is not automatically the same control as casting the combat ability of that branch. Whether they share an input is `TBD`. Do not collapse puzzles into the combat ability bar unless a later decision says so.

### 8.1 Chapter 1 puzzles

| Puzzle | Established behavior |
|---|---|
| Petal Streams | Introductory magical energy-routing. Introduces Petalcraft and environmental magic. The playable garden uses a labeled prototype: a fixed source, two straight flowers, one elbow, and a basin. The final layout is `TBD` (Q-013). |
| The Fountain | Magical growth and water mechanisms. Introduces Overgrowth and environmental manipulation. Exact mechanism is `TBD` (Q-013). |
| Memory Flowers | The player studies four flowers for seven seconds, then recreates the arrangement. Looking at the arrangement again resets the attempt. Input details may be refined later (Q-013). No branch is assigned to this puzzle. Do not assign one only to mirror the four schools. |

## 9. Combat

### 9.1 Format

Combat is fully turn-based and tactical. Battles use the same 3D world as exploration. Initiative order is visible. The player controls each active party member on that member's turn.

Combat is relatively infrequent and meaningful. Every encounter is scripted. There are no random encounters.

### 9.2 Action Points

Every character starts a turn with 4 AP. Upgrades may raise the maximum. Unused AP does not carry to the next turn.

Example costs, not a final table:

| Action | Example cost |
|---|---|
| Basic attack | 1 AP |
| Standard ability | 2 AP |
| Advanced ability | 3 AP |
| Powerful ability | 4 or more AP |

Exact costs vary by ability and are `TBD` (Q-015).

### 9.3 Movement

Characters receive a free movement allowance. The distance is `TBD` (Q-015). Further movement can spend AP. Movement may be split around actions.

The player sees valid destinations, range, path, extra AP cost, and opportunity-attack warnings. Confirmed movement cannot be undone.

### 9.4 Cooldowns

Most magical abilities have cooldowns. Basic attacks do not. Durations vary and are `TBD` (Q-015). Upgrades may reduce cooldowns.

### 9.5 Accuracy and critical hits

Basic attacks reliably hit an unobstructed target. Certain powerful abilities may miss based on range, cover, status effects, or ability-specific rules.

Critical hits mainly reward positioning, vulnerabilities, and combinations. A critical hit increases damage. It does not automatically add a status effect.

### 9.6 Cover and elevation

Partial cover can reduce accuracy. Full cover blocks applicable direct attacks. Some magic can bypass or destroy cover. Elevation can improve accuracy and critical-hit chances.

Do not implement flanking.

### 9.7 Opportunity attacks

Leaving an enemy's melee range can trigger an opportunity attack. It happens automatically, spends no AP, and is limited to once per round per eligible combatant.

### 9.8 Friendly fire

Only abilities explicitly marked as capable of friendly fire can harm allies. The targeting UI must warn the player. Harm can include damage and the ability's relevant secondary effects.

### 9.9 Status effects

Durations vary by status and are `TBD` (Q-015). Applying the same status again refreshes its duration and does not stack its strength. Enemies may have fixed immunities. Do not use percentage resistance or buildup.

### 9.10 Hazards

Hazards may spread, change, react to magic, affect movement, and cause damage or status. They may trigger when entered or activated. Some changes happen at the end of a round. Dangerous changes are telegraphed.

### 9.11 Enemy behavior

Enemies use tactical AI. Sophistication scales with difficulty. Weaknesses are found by experimentation and then recorded in the Magical Encyclopedia. Do not show an advance prediction of every enemy attack.

### 9.12 Objectives

Most encounters require defeating all enemies. Scripted exceptions may require surviving a number of rounds, protecting a target, reaching an escape point, or completing a special objective.

The player cannot freely retreat unless escape is that encounter's objective.

### 9.13 Reinforcements

Some encounters have scripted reinforcements. They are finite and telegraphed.

### 9.14 Defeat and recovery

A character at 0 HP is unavailable for the rest of the encounter. There is no mid-battle revive. If the whole party is defeated, the player retries or loads a save.

After victory, every active party member is restored to full health, including characters who were knocked out.

The Garden Guardian is nonlethal in the story. Use the normal defeat rules for the fight, and do not present the result as a death.

### 9.15 Ultimates

Each character can unlock a personal ultimate ability. Charge starts at zero at the beginning of each battle and builds through character-specific actions. A long battle may offer the ultimate more than once.

Orin can invest in more than one branch ultimate. How a single charge interacts with multiple unlocked ultimates is `TBD` (Q-017).

### 9.16 Bosses

Each boss has a distinctive identity, unique mechanics, multiple phases where appropriate, environmental interaction, a signature attack or ability, and a clear visual presentation.

A boss uses one continuous HP pool with visible phase divisions. A phase change may play a short cinematic. A boss checkpoint preserves the exact combat state.

Optional exploration may reveal a useful weakness. The advantage is meaningful and is not mandatory.

Chapter 1's garden boss identity and mechanics are `TBD` (Q-012). Use a non-canonical placeholder until the owner defines the boss. Do not invent narrative significance.

### 9.17 Duration targets

| Encounter | Target duration |
|---|---|
| Ordinary | About 5–10 minutes |
| Elite | About 15–20 minutes |
| Boss | About 20–30 minutes |

These are full-game targets. They are not mandatory lengths for the Chapter 1 tutorial.

## 10. Orin's magic

Orin has four branches. All four starting abilities are available at level 1. Tutorials introduce them gradually. Possession at level 1 does not mean the first tutorial explains all four.

Names are working names. Damage, AP costs, cooldowns, and upgrade effects are `TBD` (Q-015).

| Branch | Focus | Starting ability |
|---|---|---|
| Petalcraft | Offense, precision, flower projectiles, area attacks | Petal Dart |
| Overgrowth | Roots, thorns, battlefield control, restricting movement, environmental manipulation | Root Snare |
| Bloomguard | Shields, protection, defensive support, damage mitigation | Bloom Shield |
| Resonance | Magical energy, disruption, interference with unstable magic, advanced interactions | Resonant Pulse |

Chapter 1 introduction placement:

- Petal Streams introduces Petalcraft as environmental magic.
- The Fountain introduces Overgrowth as environmental manipulation.
- Encounter 1 introduces defensive abilities. Bloom Shield is the starting defensive ability.
- Resonance has no assigned Chapter 1 introduction (Q-002).
- The combat-tutorial order for Petal Dart, Root Snare, and Resonant Pulse is `TBD` (Q-003).

## 11. Skill trees

Orin has four interconnected skill trees, one per branch. There are no mutually exclusive branches. How a node in one branch connects to another branch is `TBD` (Q-016). Do not invent cross-branch links.

Each tree has two paths. Each path has four tiers.

| Investment | Cost |
|---|---|
| One path | 10 skill points |
| Both paths in a branch | 20 skill points |
| Branch ultimate | 5 additional skill points |
| Full mastery of one branch | 25 skill points |

Individual nodes, and the cost of each node, are `TBD` (Q-016). Four tiers costing 10 points means a tier is not assumed to be one point. Do not invent the node list.

The phrase "five additional points" describes full mastery as 20 + 5. Whether the ultimate can be bought before both paths are complete is `TBD` (Q-016). Advanced skills require earlier nodes. They do not require a minimum chapter or character level.

By level 50, Orin has earned 54 skill points. That can fully master two branches for 50 points, with 4 points left. Players may instead spread points across more branches. Four leftover points are not enough for a third ultimate if an ultimate costs 5.

Management rules:

- Points are spent outside combat.
- Unlocked skills do not need to be equipped into slots.
- Respec is available only at the beginning of a chapter.
- No build-preset system.
- The skill-tree interface darkens as Orin changes.

## 12. Experience and leveling

| Rule | Value |
|---|---|
| Starting level | 1 |
| Maximum level | 50 |
| Skill points at level 50 | 54 |
| Points at level 1 | 0 unspent, plus the four free basic abilities |
| Award | 1 skill point per level-up, plus 1 bonus at levels 10, 20, 30, 40, and 50 |

The level-50 bonus is included in the 54. After level 50, XP stops, no prestige system appears, and no further skill points are awarded (TD-006).

### 12.1 XP formula

Experience required to advance from level `n` to level `n + 1`:

```text
XP(n) = 100 + 25(n - 1) + 2(n - 1)^2
```

The sum of `XP(1)` through `XP(49)` is 110,348. That is the cumulative XP required to reach level 50. The appendix table was calculated from this formula on 2026-11-13.

### 12.2 Distribution target

For the first eight chapters, total available XP is aimed at:

| Source | Share |
|---|---|
| Combat | 40% |
| Puzzles | 40% |
| Exploration | 15% |
| Discoveries | 5% |

This is a balancing target for the whole pool, not a rule that every chapter or encounter uses the same split. The numerical XP available in Chapters 9 and 10 is `TBD` (Q-033), aside from the catch-up rule below.

### 12.3 When XP is granted

| Source | Timing |
|---|---|
| Combat | After the encounter is completed |
| Puzzle | Immediately on completion |
| Exploration | When that objective is completed |
| Discovery | When the qualifying secret is found |

Each unique activity grants its reward once.

### 12.4 Level targets

Completionists should be able to reach level 50 by the end of Chapter 8. Proposed ending levels:

| Chapter | Target ending level | Cumulative XP to reach it | Skill points at that level |
|---|---:|---:|---:|
| 1 | 9 | 1,780 | 8 |
| 2 | 17 | 7,080 | 17 |
| 3 | 24 | 16,215 | 25 |
| 4 | 30 | 28,478 | 32 |
| 5 | 36 | 45,745 | 38 |
| 6 | 41 | 64,580 | 44 |
| 7 | 46 | 87,990 | 49 |
| 8 | 50 | 110,348 | 54 |
| 9 | 50 | 110,348 | 54 |
| 10 | 50 | 110,348 | 54 |

These are targets. Check reward tables against the formula before implementing them. Do not treat 1,780 as a mandated Chapter 1 payout until the Chapter 1 reward budget is designed.

Reaching level 50 by Chapter 8 should require nearly all optional content. Players who skip optional content can continue leveling in Chapters 9 and 10. Every player who completes the required story reaches level 50 before the final battle.

All difficulty modes award the same XP.

## 13. Difficulty

Four modes:

1. Story
2. Explorer
3. Balanced
4. Challenging

Balanced is the default. Difficulty can be changed outside combat.

Difficulty changes enemy stats, enemy AI, encounter difficulty, status threats, and puzzle hints or assistance.

Difficulty does not change XP, story outcomes, available skill points, or main narrative progression.

Numeric modifiers are `TBD` (Q-019).

## 14. Interface

The interface should feel elegant, readable, and appropriate to a fantasy RPG. Avoid a crowded permanent HUD.

### 14.1 Combat presets

Provide three customizable presets: Minimal, Balanced, and Advanced.

The interface may show health, AP, initiative, status effects, cooldowns, ability costs, targeting previews, and numbers where the preset enables them.

Targeting previews communicate valid targets and affected areas. They do not automatically reveal exact damage or undiscovered weaknesses.

### 14.2 Tutorials

Use minimal instruction panels. Explain one mechanic at a time, highlight the relevant control, pause combat when a mandatory guided action is required, and dismiss the panel when it is no longer needed.

The book narrator never explains controls.

### 14.3 Magical Encyclopedia

The encyclopedia resembles an ancient illustrated manuscript. It records world lore, magical discoveries, enemy information, discovered weaknesses, and important history. Its presentation becomes darker as the story progresses. It must not reveal future spoilers.

## 15. Saving

Use hybrid saving.

Autosave after chapter transitions, combat encounters, puzzle completion, and important story events.

Manual saving is allowed outside combat and major scripted sequences. Support multiple slots. The slot count is `TBD` (Q-020).

Boss phase checkpoints preserve the exact relevant combat state.

## 16. Established content boundaries

Do not add these systems:

- Branching dialogue or alternate endings.
- Optional party recruitment, swapping, or a bench.
- Inventory, item combination, currency, loot, gear, or crafting.
- A conventional minimap, objective compass, or constant waypoint arrows.
- Random encounters.
- Flanking.
- Percentage-based status resistance or status buildup.
- Mid-battle revival.
- Free retreat from combat unless the encounter objective is escape.
- Skill-build presets.
- Prestige levels or skill points after level 50.
- Inherited abilities from dead companions.
- Book pages that teach play, hint puzzles, or contain a battle.

## 17. Reading of two easy-to-miss rules

These are interpretations recorded so later work does not "fix" them by accident. Their decision-log IDs are in `GAME_PLAN.md`.

1. **Skill points at the cap.** Arriving at level 50 grants the normal level-up point and the level-50 bonus. That pair is part of the 54. Nothing is granted after the cap.
2. **Nonlethal tutorial defeat.** The Garden Guardian fight still ends through the combat rules. The story does not treat the guardian as killed.

## 18. Open questions

Answer these before the milestone that would otherwise invent the answer. Milestone 1 does not depend on them.

| ID | Question | Needed before |
|---|---|---|
| Q-001 | Are the academy head who delivers the invitation and the academy leader who whispers "Orin" and dies the same person? | Invitation and ceremony writing |
| Q-002 | When, if at all, does Chapter 1 introduce Resonance and Resonant Pulse? | Combat tutorials |
| Q-003 | What is the combat-tutorial order for Petal Dart, Root Snare, and Resonant Pulse? | Encounter 1–2 |
| Q-004 | Is the Chapter 1 escape combat, hazards, a scripted sequence, or a mix? It cannot include a second boss. | Escape implementation |
| Q-005 | When does each of Rowan, Mira, Tilly, and the White Prince become an active combat party member? | Academy encounters, if any |
| Q-006 | Does Arthur ever occupy a combat slot? | Any chapter where he is present |
| Q-007 | What does Tilly's creature do in exploration and combat? | Tilly's introduction |
| Q-008 | When is gender selected, and what does it change? | First presented Orin beyond a placeholder |
| Q-009 | What are the parents' names, and are they on screen for the invitation? | Invitation scene |
| Q-010 | What is Mira's childhood gift, and when is it shown? It is not in the Chapter 1 timeline. | The chapter that establishes it |
| Q-011 | Who is the second garden encounter's enemy? | Encounter 2 |
| Q-012 | Who is the garden boss, and what are the mechanics? | Boss content beyond a placeholder |
| Q-013 | What are the exact Petal Streams, Fountain, and Memory Flowers layouts? The garden has a labeled prototype Petal Streams layout. That layout is not the final answer. | Those puzzles |
| Q-014 | When does magic perception unlock? | Exploration tuning |
| Q-015 | What are the combat numbers: damage, costs, cooldowns, ranges, movement, accuracy? | Combat tuning |
| Q-016 | What are the skill nodes, how do the four trees interconnect, and can an ultimate be bought before both paths? | Skill-tree content |
| Q-017 | How does ultimate charge work with more than one unlocked ultimate? | Ultimate implementation |
| Q-018 | How do companion abilities progress when they level with Orin? | Companion combat beyond placeholders |
| Q-019 | What are the difficulty multipliers and hint rules? | Difficulty implementation |
| Q-020 | How many save slots, and what does the save UI show? | Saving UI |
| Q-021 | What permanent exploration bonuses exist, and where are they stored? | Exploration rewards |
| Q-022 | Which lines are voiced in the prototype? | Audio |
| Q-023 | What is the content of Orin's ceremony vision, beyond an impossible comforting memory from a life never lived? | Ceremony |
| Q-024 | What is the introduction order and the conversation text? | Character scenes |
| Q-025 | When and how does Rowan die? | That later chapter |
| Q-026 | How do the White Prince's weapons scale as they are damaged? | His combat implementation |
| Q-027 | Is Mira's failed protection the same event as her final-battle death? | That later chapter |
| Q-028 | In which chapters do Arthur and the Old Stranger first appear? | Those chapters |
| Q-029 | Who is the antagonist? Do not answer this in early content. | The intended reveal only |
| Q-030 | Resolved for the prototype on 2026-11-13. The player may pan the garden view at any time. The view follows Orin until that pan, and recenter sticks it back. See §7.1. | Resolved |
| Q-031 | Is any movement control required besides click-to-move? | Movement implementation |
| Q-032 | Confirm that the childhood garden party is Orin alone. | Garden combat |
| Q-033 | How much catch-up XP do Chapters 9 and 10 contain? | Those reward tables |

## 19. Appendix — level table

Calculated from `XP(n) = 100 + 25(n - 1) + 2(n - 1)^2`. "XP to next" on a row is the cost to leave that level. Skill points include the bonus at 10, 20, 30, 40, and 50.

| Level | XP to next | Cumulative XP to reach | Skill points |
|---:|---:|---:|---:|
| 1 | 100 | 0 | 0 |
| 2 | 127 | 100 | 1 |
| 3 | 158 | 227 | 2 |
| 4 | 193 | 385 | 3 |
| 5 | 232 | 578 | 4 |
| 6 | 275 | 810 | 5 |
| 7 | 322 | 1,085 | 6 |
| 8 | 373 | 1,407 | 7 |
| 9 | 428 | 1,780 | 8 |
| 10 | 487 | 2,208 | 10 |
| 11 | 550 | 2,695 | 11 |
| 12 | 617 | 3,245 | 12 |
| 13 | 688 | 3,862 | 13 |
| 14 | 763 | 4,550 | 14 |
| 15 | 842 | 5,313 | 15 |
| 16 | 925 | 6,155 | 16 |
| 17 | 1,012 | 7,080 | 17 |
| 18 | 1,103 | 8,092 | 18 |
| 19 | 1,198 | 9,195 | 19 |
| 20 | 1,297 | 10,393 | 21 |
| 21 | 1,400 | 11,690 | 22 |
| 22 | 1,507 | 13,090 | 23 |
| 23 | 1,618 | 14,597 | 24 |
| 24 | 1,733 | 16,215 | 25 |
| 25 | 1,852 | 17,948 | 26 |
| 26 | 1,975 | 19,800 | 27 |
| 27 | 2,102 | 21,775 | 28 |
| 28 | 2,233 | 23,877 | 29 |
| 29 | 2,368 | 26,110 | 30 |
| 30 | 2,507 | 28,478 | 32 |
| 31 | 2,650 | 30,985 | 33 |
| 32 | 2,797 | 33,635 | 34 |
| 33 | 2,948 | 36,432 | 35 |
| 34 | 3,103 | 39,380 | 36 |
| 35 | 3,262 | 42,483 | 37 |
| 36 | 3,425 | 45,745 | 38 |
| 37 | 3,592 | 49,170 | 39 |
| 38 | 3,763 | 52,762 | 40 |
| 39 | 3,938 | 56,525 | 41 |
| 40 | 4,117 | 60,463 | 43 |
| 41 | 4,300 | 64,580 | 44 |
| 42 | 4,487 | 68,880 | 45 |
| 43 | 4,678 | 73,367 | 46 |
| 44 | 4,873 | 78,045 | 47 |
| 45 | 5,072 | 82,918 | 48 |
| 46 | 5,275 | 87,990 | 49 |
| 47 | 5,482 | 93,265 | 50 |
| 48 | 5,693 | 98,747 | 51 |
| 49 | 5,908 | 104,440 | 52 |
| 50 | — | 110,348 | 54 |
