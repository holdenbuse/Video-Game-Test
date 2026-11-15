// Labeled prototype for Memory Flowers until Q-013 is answered.
// No magical branch is assigned to this puzzle.

export const MEMORY_ID = 'memory-flowers';
export const MEMORY_COLORS = ['pink', 'gold', 'violet', 'white'];
export const STUDY_MS = 7000;
export const MEMORY_PATTERN = [1, 0, 3, 2];

export function createMemoryFlowersLogic({
  pattern = MEMORY_PATTERN,
  now = () => 0,
  studyMs = STUDY_MS,
} = {}) {
  let attempt = [null, null, null, null];
  let revealedUntil = 0;

  function remaining(time = now()) {
    return Math.max(0, revealedUntil - time);
  }

  function showing(time = now()) {
    return remaining(time) > 0;
  }

  function reveal(time = now()) {
    attempt = [null, null, null, null];
    revealedUntil = time + studyMs;
  }

  function cycle(index, time = now()) {
    if (!Number.isInteger(index) || index < 0 || index >= pattern.length) return { type: 'invalid' };
    if (showing(time)) return { type: 'studying', remaining: remaining(time) };
    const current = attempt[index];
    attempt[index] = current === null ? 0 : (current + 1) % MEMORY_COLORS.length;
    const complete = attempt.every((value, slot) => value === pattern[slot]);
    return { type: complete ? 'complete' : 'set', attempt: attempt.slice() };
  }

  function look(time = now()) {
    reveal(time);
    return { type: 'look' };
  }

  function reset(time = now()) {
    reveal(time);
    return { type: 'reset' };
  }

  return {
    showing,
    remaining,
    cycle,
    look,
    reset,
    pattern: () => pattern.slice(),
    attempt: () => attempt.slice(),
  };
}
