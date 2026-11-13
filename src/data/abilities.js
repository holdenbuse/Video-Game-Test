// Placeholder combat numbers until Q-015 is answered.
// The structure (4 AP, cooldown on magic, no cooldown on basic attacks) is established.

export const PLACEHOLDER_COMBAT = {
  label: 'placeholder',
  question: 'Q-015',
  apPerTurn: 4,
  freeMove: 4,
  extraDistancePerAp: 2,
  meleeRange: 1.6,
  orinHp: 24,
  guardianHp: 18,
  orinAttack: 6,
  guardianAttack: 5,
  bloomShieldAbsorb: 8,
  bloomShieldCooldown: 2,
  bloomShieldAp: 2,
  basicAp: 1,
};

export const BASIC_ATTACK = {
  id: 'basic-attack',
  name: 'Basic attack',
  ap: PLACEHOLDER_COMBAT.basicAp,
  cooldown: 0,
  range: PLACEHOLDER_COMBAT.meleeRange,
  target: 'enemy',
  placeholder: true,
};

export const ABILITIES = {
  'petal-dart': {
    id: 'petal-dart',
    name: 'Petal Dart',
    branch: 'Petalcraft',
    ap: 2,
    cooldown: 1,
    range: 6,
    damage: 8,
    target: 'enemy',
    placeholder: true,
  },
  'root-snare': {
    id: 'root-snare',
    name: 'Root Snare',
    branch: 'Overgrowth',
    ap: 2,
    cooldown: 2,
    range: 5,
    damage: 0,
    target: 'enemy',
    placeholder: true,
  },
  'bloom-shield': {
    id: 'bloom-shield',
    name: 'Bloom Shield',
    branch: 'Bloomguard',
    ap: PLACEHOLDER_COMBAT.bloomShieldAp,
    cooldown: PLACEHOLDER_COMBAT.bloomShieldCooldown,
    range: 0,
    shield: PLACEHOLDER_COMBAT.bloomShieldAbsorb,
    target: 'self',
    placeholder: true,
  },
  'resonant-pulse': {
    id: 'resonant-pulse',
    name: 'Resonant Pulse',
    branch: 'Resonance',
    ap: 3,
    cooldown: 3,
    range: 4,
    damage: 7,
    target: 'enemy',
    placeholder: true,
  },
};

export function abilityById(id) {
  if (id === BASIC_ATTACK.id) return BASIC_ATTACK;
  return ABILITIES[id] ?? null;
}
