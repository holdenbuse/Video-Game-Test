import { GARDEN_GUARDIAN, ARM_TEXT, DEFEAT_TEXT, VICTORY_TEXT } from './gardenGuardian.js';
import { PLACEHOLDER_COMBAT } from './abilities.js';

// Encounter type follows completion count, not which puzzle was solved.
// Numbers are placeholders until Q-015. The boss label is temporary until Q-012.
// Two phase marks share one health pool. The signature action is a placeholder, not a story ability.

const PLAYER = {
  x: GARDEN_GUARDIAN.orin.x,
  z: GARDEN_GUARDIAN.orin.z,
  hp: GARDEN_GUARDIAN.orinHp,
  initiative: GARDEN_GUARDIAN.orinInitiative,
  attack: GARDEN_GUARDIAN.orinAttack,
  abilities: GARDEN_GUARDIAN.tutorialAbilities,
};

export const TUTORIAL_ENCOUNTER = {
  id: GARDEN_GUARDIAN.id,
  kind: 'tutorial',
  attacksPerTurn: 1,
  opportunityAttacks: false,
  placeholder: true,
  armText: ARM_TEXT,
  victoryText: VICTORY_TEXT,
  defeatText: DEFEAT_TEXT,
  player: PLAYER,
  enemy: {
    id: 'garden-guardian',
    name: 'Garden Guardian',
    x: GARDEN_GUARDIAN.guardian.x,
    z: GARDEN_GUARDIAN.guardian.z,
    hp: GARDEN_GUARDIAN.guardianHp,
    initiative: GARDEN_GUARDIAN.guardianInitiative,
    attack: GARDEN_GUARDIAN.guardianAttack,
  },
};

export const STANDARD_ENCOUNTER = {
  id: 'encounter-2-placeholder',
  kind: 'standard',
  attacksPerTurn: 2,
  opportunityAttacks: false,
  placeholder: true,
  armText: 'A standard fight begins. This opponent is a placeholder with no story role. Move, attack, and defend in any order.',
  victoryText: 'The placeholder opponent withdraws. This fight is finished.',
  defeatText: 'The fight ends. Try again.',
  player: PLAYER,
  enemy: {
    id: 'placeholder-opponent',
    name: 'Placeholder opponent',
    x: 0,
    z: 8.2,
    hp: 24,
    initiative: 8,
    attack: PLACEHOLDER_COMBAT.guardianAttack,
  },
};

export const BOSS_ENCOUNTER = {
  id: 'encounter-3-placeholder',
  kind: 'boss',
  attacksPerTurn: 2,
  opportunityAttacks: false,
  placeholder: true,
  oneHealthPool: true,
  // Phase 1 while health is above half. Phase 2 is the rest of the same pool.
  phases: [
    { id: 1, aboveHpRatio: 0.5 },
    { id: 2, aboveHpRatio: 0 },
  ],
  signature: {
    id: 'signature-action',
    name: 'Signature action',
    placeholder: true,
    damage: 10,
    text: 'The boss placeholder is preparing its signature action. The hit lands on its next turn, even if you move.',
    action: 'Bloom Shield can absorb part of it. You can still move, attack, and end the turn.',
  },
  armText: 'The third puzzle selects the garden boss. This figure is a temporary label with one health pool and no story name. Its signature action is shown before it lands.',
  victoryText: 'The boss placeholder withdraws. The third encounter is finished.',
  defeatText: 'The boss fight ends. Try again.',
  player: PLAYER,
  enemy: {
    id: 'boss-placeholder',
    name: 'Boss placeholder',
    x: 0,
    z: 8.2,
    hp: 36,
    initiative: 9,
    attack: PLACEHOLDER_COMBAT.guardianAttack,
  },
};

const BY_KIND = {
  tutorial: TUTORIAL_ENCOUNTER,
  standard: STANDARD_ENCOUNTER,
  boss: BOSS_ENCOUNTER,
};

export function encounterByKind(kind) {
  return BY_KIND[kind] ?? null;
}
