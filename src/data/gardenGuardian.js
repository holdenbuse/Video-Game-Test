import { PLACEHOLDER_COMBAT } from './abilities.js';

// Encounter 1. The guardian is a nonlethal practice opponent.
// Opportunity attacks stay off until that system exists. The rule is unchanged.

export const GARDEN_GUARDIAN = {
  id: 'garden-guardian-tutorial',
  name: 'Garden Guardian',
  opportunityAttacks: false,
  orin: { x: 0, z: 11.2 },
  guardian: { x: 0, z: 8.2 },
  orinHp: PLACEHOLDER_COMBAT.orinHp,
  guardianHp: PLACEHOLDER_COMBAT.guardianHp,
  orinInitiative: 12,
  guardianInitiative: 7,
  orinAttack: PLACEHOLDER_COMBAT.orinAttack,
  guardianAttack: PLACEHOLDER_COMBAT.guardianAttack,
  tutorialAbilities: ['basic-attack', 'bloom-shield'],
  knownAbilities: ['petal-dart', 'root-snare', 'bloom-shield', 'resonant-pulse'],
};

export const VICTORY_TEXT = 'The Garden Guardian withdraws. This was practice, not a death.';
export const DEFEAT_TEXT = 'The practice ends before the guardian withdraws. Try again.';
export const ARM_TEXT = 'A Garden Guardian steps onto the lawn for a practice fight. This is not a battle to the death.';
