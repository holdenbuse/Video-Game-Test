import assert from 'node:assert/strict';
import test from 'node:test';
import { FOUNTAIN_LAYOUT } from '../data/fountainLayout.js';
import { AGENT_RADIUS, GARDEN } from '../data/gardenLayout.js';
import { MEMORY_LAYOUT } from '../data/memoryFlowersLayout.js';
import { createNavGrid, rasterizeBlocks } from '../movement/navGrid.js';
import { createEncounterGate } from './encounterGate.js';
import { createFountainLogic } from './fountain.js';
import { createMemoryFlowersLogic, MEMORY_COLORS, STUDY_MS } from './memoryFlowers.js';

function nav() {
  const grid = createNavGrid(GARDEN);
  rasterizeBlocks(grid, GARDEN.blocks, AGENT_RADIUS);
  return grid;
}

test('fountain water flows only down a one-step staircase', () => {
  const fountain = createFountainLogic();
  assert.equal(fountain.solved(), false);
  fountain.grow(0);
  fountain.grow(0);
  fountain.grow(1);
  fountain.grow(2);
  fountain.grow(2);
  assert.deepEqual(fountain.heights(), [2, 1, 0]);
  assert.equal(fountain.solved(), true);
  assert.equal(fountain.links().every((link) => link.open), true);
  fountain.grow(1);
  assert.equal(fountain.solved(), false);
  fountain.reset();
  assert.deepEqual(fountain.heights(), [0, 0, 1]);
});

test('memory flowers stay hidden until the seven seconds end, and looking again clears the attempt', () => {
  let time = 1000;
  const memory = createMemoryFlowersLogic({ now: () => time });
  assert.equal(memory.showing(), false);
  assert.equal(memory.look().type, 'look');
  assert.equal(memory.showing(), true);
  assert.equal(memory.cycle(0).type, 'studying');
  time += STUDY_MS;
  assert.equal(memory.showing(), false);
  assert.equal(memory.cycle(0).type, 'set');
  assert.deepEqual(memory.attempt(), [0, null, null, null]);
  const looked = memory.look();
  assert.equal(looked.type, 'look');
  assert.deepEqual(memory.attempt(), [null, null, null, null]);
  assert.equal(memory.showing(), true);
  time += STUDY_MS;
  memory.reset();
  assert.equal(memory.showing(), true);
  time += STUDY_MS;
  const pattern = memory.pattern();
  for (let index = 0; index < pattern.length; index += 1) {
    for (let step = 0; step <= pattern[index]; step += 1) memory.cycle(index);
  }
  assert.equal(memory.cycle(0).type, 'set');
  memory.reset();
  time += STUDY_MS;
  let last = null;
  for (let index = 0; index < pattern.length; index += 1) {
    const clicks = pattern[index] + 1;
    for (let step = 0; step < clicks; step += 1) last = memory.cycle(index);
  }
  assert.equal(last.type, 'complete');
  assert.equal(MEMORY_COLORS.length, 4);
});

test('completion count selects tutorial, then a standard fight, then the boss', () => {
  const gate = createEncounterGate();
  assert.equal(gate.onFirstSolve('memory-flowers').encounter, 'tutorial');
  assert.equal(gate.onFirstSolve('fountain').encounter, null);
  assert.equal(gate.onFirstSolve('memory-flowers').reward, false);

  const afterTutorial = gate.victory();
  assert.equal(afterTutorial.finished, 'tutorial');
  assert.equal(afterTutorial.reward, true);
  assert.equal(afterTutorial.encounter, 'standard');

  assert.equal(gate.onFirstSolve('petal-streams').encounter, null);
  const afterStandard = gate.victory();
  assert.equal(afterStandard.finished, 'standard');
  assert.equal(afterStandard.reward, true);
  assert.equal(afterStandard.encounter, 'boss');

  const afterBoss = gate.victory();
  assert.equal(afterBoss.finished, 'boss');
  assert.equal(afterBoss.encounter, null);
  assert.equal(afterBoss.reward, true);
  assert.equal(gate.victory().reward, false);
  assert.equal(gate.bound(), 3);
});

test('the new puzzle controls stand on open lawn', () => {
  const grid = nav();
  const spots = [
    ...FOUNTAIN_LAYOUT.beds,
    FOUNTAIN_LAYOUT.basin,
    FOUNTAIN_LAYOUT.reset,
    ...MEMORY_LAYOUT.pattern,
    ...MEMORY_LAYOUT.copies,
    MEMORY_LAYOUT.reset,
  ];
  for (const spot of spots) {
    assert.equal(grid.isWalkable(spot.x, spot.z), true, `${spot.x},${spot.z}`);
  }
});
