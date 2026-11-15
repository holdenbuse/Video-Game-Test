// Labeled prototype for The Fountain until Q-013 is answered.
// Water leaves the fountain only by stepping down one growth level at a time.

export const FOUNTAIN_ID = 'fountain';
export const FOUNTAIN_LEVELS = 3;
export const FOUNTAIN_SOURCE = 3;

export function createFountainLogic(start = [0, 0, 1]) {
  let heights = start.slice();

  function links() {
    const [first, second, third] = heights;
    return [
      { from: 'source', to: 'bed-0', open: first === FOUNTAIN_SOURCE - 1 },
      { from: 'bed-0', to: 'bed-1', open: first === second + 1 },
      { from: 'bed-1', to: 'bed-2', open: second === third + 1 },
      { from: 'bed-2', to: 'basin', open: third === 0 },
    ];
  }

  function solved() {
    return links().every((link) => link.open);
  }

  function grow(index) {
    if (!Number.isInteger(index) || index < 0 || index >= heights.length) return null;
    heights[index] = (heights[index] + 1) % FOUNTAIN_LEVELS;
    return { heights: heights.slice(), complete: solved() };
  }

  function reset() {
    heights = start.slice();
    return { heights: heights.slice(), complete: false };
  }

  return {
    grow,
    reset,
    links,
    solved,
    heights: () => heights.slice(),
  };
}
