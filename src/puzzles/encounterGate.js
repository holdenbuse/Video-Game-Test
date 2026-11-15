// Puzzle completion and encounter order are separate.
// Only the first solved puzzle starts Encounter 1.
// Later solves are stored by the completion log and wait for Milestone 5
// before they can start Encounter 2 or the garden boss.

export function createEncounterGate() {
  let bound = 0;

  function onFirstSolve() {
    if (bound > 0) return { startTutorial: false, bound };
    bound = 1;
    return { startTutorial: true, bound };
  }

  return {
    onFirstSolve,
    bound: () => bound,
  };
}
