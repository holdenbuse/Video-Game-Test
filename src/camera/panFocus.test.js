import assert from 'node:assert/strict';
import test from 'node:test';
import { offsetFocus } from './panFocus.js';

test('panning right and forward follows the camera ground axes', () => {
  const right = offsetFocus({ x: 2, z: 3 }, 0, 4, 0, 18.5);
  assert.equal(right.x, -2);
  assert.equal(right.z, 3);

  const forward = offsetFocus({ x: 2, z: 3 }, 0, 0, 3, 18.5);
  assert.equal(forward.x, 2);
  assert.equal(forward.z, 0);
});

test('a turned view pans along the turned axes', () => {
  const next = offsetFocus({ x: 0, z: 0 }, Math.PI / 2, 4, 5, 18.5);
  assert.ok(Math.abs(next.x - -5) < 1e-9);
  assert.ok(Math.abs(next.z - 4) < 1e-9);
});

test('pan stops at the garden view limit', () => {
  const next = offsetFocus({ x: 0, z: 0 }, 0, 100, -100, 18.5);
  assert.equal(next.x, -18.5);
  assert.equal(next.z, 18.5);
});
