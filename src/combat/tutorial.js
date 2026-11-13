export const TUTORIAL_STEPS = [
  {
    id: 'initiative',
    highlight: 'initiative',
    requires: 'continue',
    text: 'Initiative sets the turn order. Orin acts, then the Garden Guardian. The order stays visible.',
  },
  {
    id: 'ap',
    highlight: 'ap',
    requires: 'continue',
    text: 'Each turn starts with 4 Action Points. Points left over are discarded when the turn ends.',
  },
  {
    id: 'move',
    highlight: 'ground',
    requires: 'move',
    text: 'Click a highlighted patch of grass, then confirm the move. That first step is free.',
  },
  {
    id: 'attack',
    highlight: 'basic-attack',
    requires: 'basic-attack',
    text: 'A basic attack costs 1 Action Point and has no cooldown. Click Basic attack, then click the Garden Guardian.',
  },
  {
    id: 'shield',
    highlight: 'bloom-shield',
    requires: 'bloom-shield',
    text: 'Bloom Shield is a defense. Click it to raise a shield before the guardian acts.',
  },
  {
    id: 'cooldown',
    highlight: 'bloom-shield',
    requires: 'continue',
    text: 'Bloom Shield is now cooling down, so it cannot be used again yet. A basic attack does not cool down.',
  },
  {
    id: 'end',
    highlight: 'end-turn',
    requires: 'end-turn',
    text: 'End the turn. Any Action Points still unused are lost.',
  },
  {
    id: 'enemy',
    highlight: 'initiative',
    requires: 'enemy-done',
    text: 'The Garden Guardian acts on its own turn.',
  },
  {
    id: 'free',
    highlight: null,
    requires: 'continue',
    text: 'It is your turn again, with 4 Action Points. Continue until the guardian withdraws. This practice is not a battle to the death.',
  },
];

export function createTutorial() {
  let index = 0;
  let finished = false;

  function current() {
    if (finished) return null;
    return TUTORIAL_STEPS[index] ?? null;
  }

  function allows(action) {
    const step = current();
    if (!step) return true;
    if (step.requires === 'enemy-done') return false;
    if (step.requires === 'continue') return false;
    return step.requires === action;
  }

  function complete(action) {
    const step = current();
    if (!step || step.requires !== action) return false;
    index += 1;
    if (index >= TUTORIAL_STEPS.length) finished = true;
    return true;
  }

  function acknowledge() {
    return complete('continue');
  }

  return { current, allows, complete, acknowledge };
}
