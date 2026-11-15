import assert from 'node:assert/strict';
import test from 'node:test';
import { PETAL_STREAMS } from '../data/petalStreamsLayout.js';
import { createCompletionLog } from './completionLog.js';
import { createPetalStreamsLogic } from './petalStreams.js';

test('the prototype layout is unsolved until each flower turns once', () => {
  const logic = createPetalStreamsLogic(PETAL_STREAMS);
  assert.equal(logic.solve().complete, false);

  assert.equal(logic.rotate('east'), true);
  assert.equal(logic.solve().complete, false);
  assert.equal(logic.solve().links.length, 1);

  assert.equal(logic.rotate('south'), true);
  assert.equal(logic.rotate('corner'), true);
  const solved = logic.solve();
  assert.equal(solved.complete, true);
  assert.equal(solved.links.length, 4);
  assert.equal(solved.links.every((link) => link.powered), true);
  assert.ok(solved.powered.includes('goal'));
});

test('the three flowers can be turned in any order', () => {
  const logic = createPetalStreamsLogic(PETAL_STREAMS);
  logic.rotate('corner');
  logic.rotate('south');
  logic.rotate('east');
  assert.equal(logic.solve().complete, true);
});

test('the source and basin do not turn', () => {
  const logic = createPetalStreamsLogic(PETAL_STREAMS);
  assert.equal(logic.rotate('source'), false);
  assert.equal(logic.rotate('goal'), false);
  assert.equal(logic.nodes.find((node) => node.id === 'source').rotation, 0);
  assert.equal(logic.nodes.find((node) => node.id === 'goal').rotation, 0);
});

test('an opening that does not face its neighbor carries no light', () => {
  const logic = createPetalStreamsLogic({
    spacing: 2,
    nodes: [
      { id: 'source', x: 0, z: 0, ports: [0], rotation: 0, fixed: true, role: 'source' },
      { id: 'goal', x: 2, z: 0, ports: [0], rotation: 0, fixed: true, role: 'goal' },
    ],
  });
  assert.equal(logic.solve().complete, false);
  assert.equal(logic.solve().links.length, 0);
});

test('reset restores the unsolved flowers and completion is rewarded once', () => {
  const logic = createPetalStreamsLogic(PETAL_STREAMS);
  const completion = createCompletionLog();
  logic.rotate('east');
  logic.rotate('corner');
  logic.rotate('south');
  assert.equal(logic.solve().complete, true);
  assert.equal(completion.claim(PETAL_STREAMS.id), true);
  assert.equal(completion.claim(PETAL_STREAMS.id), false);
  assert.equal(completion.has(PETAL_STREAMS.id), true);

  logic.reset();
  assert.equal(logic.solve().complete, false);
  assert.equal(logic.nodes.find((node) => node.id === 'east').rotation, 3);
  assert.equal(completion.has(PETAL_STREAMS.id), true);

  logic.rotate('east');
  logic.rotate('corner');
  logic.rotate('south');
  assert.equal(logic.solve().complete, true);
  assert.equal(completion.claim(PETAL_STREAMS.id), false);
});
