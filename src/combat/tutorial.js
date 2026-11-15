export const TUTORIAL_STEPS = [
  {
    id: 'initiative',
    highlight: 'initiative',
    requires: 'continue',
    title: 'Orin acts first',
    text: 'The cards on the right are the turn order. Orin is on top. The Garden Guardian goes after him.',
    action: 'Click Continue.',
  },
  {
    id: 'ap',
    highlight: 'ap',
    requires: 'continue',
    title: 'You have 4 Action Points',
    text: 'The four dots at the bottom left of the action bar are your Action Points. Dots you do not spend disappear when the turn ends.',
    action: 'Click Continue.',
  },
  {
    id: 'move',
    highlight: 'ground',
    requires: 'move',
    title: 'Move Orin',
    text: 'The gold circles on the grass are places Orin can reach for free.',
    action: 'Click a gold circle, then click Move.',
  },
  {
    id: 'attack',
    highlight: 'basic-attack',
    requires: 'basic-attack',
    title: 'Use a basic attack',
    text: 'A basic attack costs 1 Action Point. It never goes on cooldown.',
    action: 'Click Basic attack, then click the Garden Guardian.',
  },
  {
    id: 'shield',
    highlight: 'bloom-shield',
    requires: 'bloom-shield',
    title: 'Raise Bloom Shield',
    text: 'Bloom Shield is a defense. It absorbs the next hit.',
    action: 'Click Bloom Shield.',
  },
  {
    id: 'cooldown',
    highlight: 'bloom-shield',
    requires: 'continue',
    title: 'Bloom Shield is cooling down',
    text: 'The number on Bloom Shield is how long you must wait. Basic attack does not get a number.',
    action: 'Click Continue.',
  },
  {
    id: 'end',
    highlight: 'end-turn',
    requires: 'end-turn',
    title: 'End Orin’s turn',
    text: 'Action Points left over are lost.',
    action: 'Click End turn.',
  },
  {
    id: 'enemy',
    highlight: 'initiative',
    requires: 'enemy-done',
    title: 'The Garden Guardian’s turn',
    text: 'The guardian moves and attacks by itself.',
    action: 'Wait. You do not need to click.',
  },
  {
    id: 'free',
    highlight: null,
    requires: 'continue',
    title: 'Finish the practice',
    text: 'Click Basic attack, then the Garden Guardian, until it withdraws. This practice is not a battle to the death.',
    action: 'Click Continue to take your turn.',
  },
];

export function createOpenPlay() {
  return {
    current: () => null,
    allows: () => true,
    complete: () => false,
    acknowledge: () => false,
  };
}

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
