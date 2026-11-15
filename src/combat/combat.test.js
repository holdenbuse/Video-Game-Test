import assert from 'node:assert/strict';
import test from 'node:test';
import { ABILITIES } from '../data/abilities.js';
import { BOSS_ENCOUNTER, STANDARD_ENCOUNTER } from '../data/encounters.js';
import { AGENT_RADIUS, GARDEN } from '../data/gardenLayout.js';
import { createNavGrid, rasterizeBlocks } from '../movement/navGrid.js';
import { createCombatSession, knownAbilityIds, movementAp, strikeAllowed } from './combat.js';

function gardenNav() {
  const nav = createNavGrid(GARDEN);
  rasterizeBlocks(nav, GARDEN.blocks, AGENT_RADIUS);
  return nav;
}

function teach(session) {
  session.begin();
  assert.equal(session.acknowledge().ok, true);
  assert.equal(session.acknowledge().ok, true);
  const cell = session.snapshot().destinations[0];
  assert.ok(cell);
  assert.equal(session.previewMove(cell.x, cell.z).ok, true);
  assert.equal(session.confirmMove().ok, true);
  assert.equal(session.selectAbility('basic-attack').ok, true);
  assert.equal(session.useOn('garden-guardian').ok, true);
  assert.equal(session.selectAbility('bloom-shield').ok, true);
  assert.equal(session.acknowledge().ok, true);
  assert.equal(session.endTurn().pendingEnemy, true);
  assert.equal(session.runEnemyTurn().ok, true);
  assert.equal(session.acknowledge().ok, true);
}

test('movement spends the free allowance before action points', () => {
  assert.equal(movementAp(0, 3), 0);
  assert.equal(movementAp(0, 4), 0);
  assert.equal(movementAp(0, 5), 1);
  assert.equal(movementAp(3, 3), 1);
});

test('the four starting abilities exist as placeholder data', () => {
  assert.deepEqual(knownAbilityIds(), ['petal-dart', 'root-snare', 'bloom-shield', 'resonant-pulse']);
  for (const ability of Object.values(ABILITIES)) {
    assert.equal(ability.placeholder, true);
    assert.equal(typeof ability.ap, 'number');
    assert.equal(typeof ability.cooldown, 'number');
  }
  assert.equal(ABILITIES['bloom-shield'].target, 'self');
});

test('a basic attack needs a clear line and does not gain a cooldown', () => {
  const nav = gardenNav();
  assert.equal(strikeAllowed(nav, { x: 0, z: 6 }, { x: 0, z: 4.6 }, 1.6), null);
  assert.equal(strikeAllowed(nav, { x: 0, z: 6 }, { x: 0, z: 3 }, 1.6), 'range');
  assert.equal(strikeAllowed(nav, { x: 0, z: 3.1 }, { x: 0, z: -3.1 }, 8), 'blocked');
});

test('the tutorial teaches one action at a time and the guardian takes a turn', () => {
  const session = createCombatSession(gardenNav());
  session.begin();
  const opened = session.snapshot();
  assert.equal(opened.fighters[0].name, 'Orin');
  assert.equal(opened.fighters[0].ap, 4);
  assert.equal(opened.abilities.map((ability) => ability.id).join(','), 'basic-attack,bloom-shield');
  assert.equal(session.endTurn().ok, false);
  assert.equal(session.selectAbility('bloom-shield').ok, false);

  teach(session);
  const after = session.snapshot();
  assert.equal(after.phase, 'fighting');
  assert.equal(after.tutorial, null);
  assert.equal(after.activeId, 'orin');
  assert.equal(after.fighters.find((fighter) => fighter.id === 'orin').ap, 4);
  const guardian = after.fighters.find((fighter) => fighter.id === 'garden-guardian');
  assert.equal(guardian.hp, 12);
  const orin = after.fighters.find((fighter) => fighter.id === 'orin');
  assert.equal(orin.shield, 3);
  assert.equal(orin.hp, 24);
  assert.equal(after.abilities.find((ability) => ability.id === 'basic-attack').cooldown, 0);
  assert.equal(after.abilities.find((ability) => ability.id === 'bloom-shield').cooldown, 1);
  assert.equal(session.selectAbility('bloom-shield').reason, 'cooldown');
});

test('a confirmed move is kept and movement can be split around an attack', () => {
  const session = createCombatSession(gardenNav());
  teach(session);
  const before = session.snapshot().fighters.find((fighter) => fighter.id === 'orin');
  const guardian = session.snapshot().fighters.find((fighter) => fighter.id === 'garden-guardian');
  const step = session.snapshot().destinations.find((cell) => (
    cell.ap === 0 && Math.hypot(cell.x - guardian.x, cell.z - guardian.z) <= 1.6
  ));
  assert.ok(step);
  session.previewMove(step.x, step.z);
  session.confirmMove();
  const moved = session.snapshot().fighters.find((fighter) => fighter.id === 'orin');
  assert.ok(Math.hypot(moved.x - before.x, moved.z - before.z) > 0.2);
  assert.equal(moved.ap, 4);
  assert.equal(session.selectAbility('basic-attack').ok, true);
  assert.equal(session.useOn('garden-guardian').ok, true);
  assert.equal(session.snapshot().fighters.find((fighter) => fighter.id === 'orin').ap, 3);
  const updatedGuardian = session.snapshot().fighters.find((fighter) => fighter.id === 'garden-guardian');
  const second = session.snapshot().destinations.find((cell) => (
    cell.ap === 0 && Math.hypot(cell.x - updatedGuardian.x, cell.z - updatedGuardian.z) <= 1.6
  ));
  assert.equal(session.previewMove(second.x, second.z).ok, true);
  assert.equal(session.confirmMove().ok, true);
  assert.equal(session.snapshot().fighters.find((fighter) => fighter.id === 'orin').ap, 3);
});

test('victory withdraws the guardian and restores Orin without calling it a death', () => {
  const session = createCombatSession(gardenNav());
  teach(session);
  session.selectAbility('basic-attack');
  session.useOn('garden-guardian');
  session.selectAbility('basic-attack');
  const result = session.useOn('garden-guardian');
  assert.equal(result.ok, true);
  const done = session.snapshot();
  assert.equal(done.phase, 'victory');
  assert.equal(done.cleared, true);
  assert.equal(done.fighters.find((fighter) => fighter.id === 'garden-guardian').hp, 0);
  assert.equal(done.fighters.find((fighter) => fighter.id === 'orin').hp, 24);
  assert.match(done.outcome, /withdraws/);
  assert.match(done.outcome, /not a death/);
  assert.doesNotMatch(done.outcome, /killed|died/);
  assert.equal(session.arm(), false);
});

test('a standard fight has no lesson and the boss is one health pool', () => {
  const session = createCombatSession(gardenNav());
  assert.equal(session.arm(STANDARD_ENCOUNTER), true);
  session.begin();
  const opened = session.snapshot();
  assert.equal(opened.kind, 'standard');
  assert.equal(opened.tutorial, null);
  assert.equal(session.endTurn().pendingEnemy, true);
  session.runEnemyTurn();
  const attacks = session.snapshot().log.filter((entry) => entry.ability === 'basic-attack' && entry.id === 'placeholder-opponent');
  assert.equal(attacks.length, 2);
  assert.equal(session.arm(BOSS_ENCOUNTER), false);

  const boss = createCombatSession(gardenNav());
  boss.arm(BOSS_ENCOUNTER);
  boss.begin();
  const start = boss.snapshot();
  assert.equal(start.fighters.filter((fighter) => fighter.team === 'enemy').length, 1);
  assert.equal(start.fighters.find((fighter) => fighter.team === 'enemy').maxHp, 36);
  assert.match(start.fighters.find((fighter) => fighter.team === 'enemy').name, /placeholder/i);
  let guard = 0;
  while (boss.snapshot().phase === 'fighting' && guard < 8) {
    guard += 1;
    const snap = boss.snapshot();
    const foe = snap.fighters.find((fighter) => fighter.team === 'enemy');
    const orin = snap.fighters.find((fighter) => fighter.id === 'orin');
    if (snap.activeId !== 'orin') {
      boss.runEnemyTurn();
      continue;
    }
    if (Math.hypot(orin.x - foe.x, orin.z - foe.z) > 1.6) {
      const step = snap.destinations.find((cell) => Math.hypot(cell.x - foe.x, cell.z - foe.z) <= 1.6);
      boss.previewMove(step.x, step.z);
      boss.confirmMove();
    }
    if (!boss.snapshot().abilities.find((ability) => ability.id === 'basic-attack').ready) {
      boss.endTurn();
      continue;
    }
    boss.selectAbility('basic-attack');
    boss.useOn(foe.id);
  }
  assert.equal(boss.snapshot().phase, 'victory');
  assert.match(boss.snapshot().outcome, /withdraws/);
  assert.doesNotMatch(boss.snapshot().outcome, /killed|died/);
});

test('defeat can be tried again and does not clear the encounter', () => {
  const session = createCombatSession(gardenNav());
  teach(session);
  let guard = 0;
  while (session.snapshot().phase === 'fighting' && guard < 12) {
    guard += 1;
    session.endTurn();
    session.runEnemyTurn();
  }
  const lost = session.snapshot();
  assert.equal(lost.phase, 'defeat');
  assert.equal(lost.cleared, false);
  assert.match(lost.outcome, /Try again/);
  assert.doesNotMatch(lost.outcome, /killed|died|death/);
  assert.equal(session.retry().ok, true);
  const again = session.snapshot();
  assert.equal(again.phase, 'fighting');
  assert.equal(again.fighters.find((fighter) => fighter.id === 'orin').hp, 24);
  assert.equal(again.cleared, false);
});
