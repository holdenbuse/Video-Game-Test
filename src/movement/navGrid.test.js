import assert from 'node:assert/strict';
import test from 'node:test';
import { AGENT_RADIUS, GARDEN } from '../data/gardenLayout.js';
import { createNavGrid, rasterizeBlocks } from './navGrid.js';

function gardenNav() {
  const nav = createNavGrid(GARDEN);
  rasterizeBlocks(nav, GARDEN.blocks, AGENT_RADIUS);
  return nav;
}

function segmentStaysWalkable(nav, from, to) {
  const distance = Math.hypot(to.x - from.x, to.z - from.z);
  const steps = Math.max(1, Math.ceil(distance / 0.25));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = from.x + (to.x - from.x) * t;
    const z = from.z + (to.z - from.z) * t;
    if (!nav.isWalkable(x, z)) return false;
  }
  return true;
}

test('garden start, pocket, and pedestal approach are walkable', () => {
  const nav = gardenNav();
  assert.equal(nav.isWalkable(GARDEN.start.x, GARDEN.start.z), true);
  assert.equal(nav.isWalkable(GARDEN.pocket.x, GARDEN.pocket.z), true);
  assert.equal(nav.isWalkable(GARDEN.pedestal.x, GARDEN.pedestal.z), false);
  assert.equal(nav.isWalkable(0, 0), false);
});

test('path around the hedge pocket stays on walkable ground', () => {
  const nav = gardenNav();
  const result = nav.findPath(GARDEN.start.x, GARDEN.start.z, GARDEN.pocket.x, GARDEN.pocket.z);
  assert.equal(result.status, 'ok');
  let previous = { x: GARDEN.start.x, z: GARDEN.start.z };
  for (const point of result.points) {
    assert.equal(segmentStaysWalkable(nav, previous, point), true);
    previous = point;
  }
  const end = result.points.at(-1);
  assert.ok(Math.hypot(end.x - GARDEN.pocket.x, end.z - GARDEN.pocket.z) < 1.2);
});

test('a click in the fountain resolves to the rim', () => {
  const nav = gardenNav();
  const result = nav.findPath(GARDEN.start.x, GARDEN.start.z, 0, 0);
  assert.equal(result.status, 'ok');
  const end = result.points.at(-1);
  const distance = Math.hypot(end.x, end.z);
  assert.ok(distance > 2.2 && distance < 4.2);
});

test('a point buried in a solid block cannot be reached', () => {
  const nav = createNavGrid({ width: 20, depth: 20, cellSize: 0.5 });
  nav.blockRect(-4, -4, 4, 4);
  const result = nav.findPath(-8, -8, 0, 0, { approach: 2 });
  assert.equal(result.status, 'unreachable');
});

test('diagonal steps do not cut a blocked corner', () => {
  const nav = createNavGrid({ width: 12, depth: 12, cellSize: 1 });
  nav.blockRect(-0.5, -0.5, 0.5, 0.5);
  const result = nav.findPath(-2, -2, 2, 2);
  assert.equal(result.status, 'ok');
  let previous = { x: -2, z: -2 };
  for (const point of result.points) {
    assert.equal(segmentStaysWalkable(nav, previous, point), true);
    previous = point;
  }
});

test('an open garden path reaches the far lawn', () => {
  const nav = gardenNav();
  const result = nav.findPath(GARDEN.start.x, GARDEN.start.z, -14, -14);
  assert.equal(result.status, 'ok');
  assert.ok(result.points.length > 0);
});
