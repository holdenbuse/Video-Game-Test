// Completion count selects the encounter. Puzzle identity does not.
// A later solve waits while an encounter is still open, so two puzzles
// cannot advance the count before the current one is bound.
// Rewards are recorded once. Chapter 1 XP amounts are not assigned yet.

export const ENCOUNTER_ORDER = ['tutorial', 'standard', 'boss'];

export function createEncounterGate() {
  const solved = [];
  const rewards = new Set();
  let bound = 0;
  let open = false;

  function noteReward(kind, id) {
    const key = `${kind}:${id}`;
    if (rewards.has(key)) return false;
    rewards.add(key);
    return true;
  }

  function onFirstSolve(puzzleId) {
    if (solved.includes(puzzleId)) {
      return { encounter: null, bound, waiting: solved.length - bound, reward: false };
    }
    solved.push(puzzleId);
    const reward = noteReward('puzzle', puzzleId);
    const next = release();
    return { ...next, reward };
  }

  function release() {
    if (open || bound >= solved.length || bound >= ENCOUNTER_ORDER.length) {
      return { encounter: null, bound, waiting: Math.max(0, solved.length - bound) };
    }
    const encounter = ENCOUNTER_ORDER[bound];
    bound += 1;
    open = true;
    return { encounter, bound, waiting: solved.length - bound };
  }

  function victory() {
    const finished = ENCOUNTER_ORDER[bound - 1] ?? null;
    const reward = finished ? noteReward('encounter', finished) : false;
    open = false;
    const next = release();
    return { ...next, finished, reward };
  }

  return {
    onFirstSolve,
    victory,
    bound: () => bound,
    solved: () => solved.slice(),
    isOpen: () => open,
    rewarded: (kind, id) => rewards.has(`${kind}:${id}`),
  };
}
