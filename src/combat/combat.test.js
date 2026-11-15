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
  assert.equal(start.boss.phase, 1);
  assert.equal(start.boss.phaseCount, 2);
  assert.equal(start.boss.checkpoint, false);
  assert.equal(start.opportunityAttacks, false);
  let guard = 0;
  while (boss.snapshot().phase === 'fighting' && guard < 40) {
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
  assert.equal(boss.snapshot().fighters.find((fighter) => fighter.team === 'enemy').maxHp, 36);
  assert.match(boss.snapshot().outcome, /withdraws/);
  assert.doesNotMatch(boss.snapshot().outcome, /killed|died/);
  assert.ok(boss.snapshot().log.some((entry) => entry.type === 'telegraph'));
});

test('a phase checkpoint restores the boss fight and the signature waits a turn', () => {
  const session = createCombatSession(gardenNav());
  session.arm(BOSS_ENCOUNTER);
  session.begin();
  assert.equal(session.restoreCheckpoint().ok, false);
  session.endTurn();
  assert.equal(session.runEnemyTurn().telegraphed, true);
  const warned = session.snapshot();
  assert.equal(warned.telegraph.name, 'Signature action');
  assert.equal(warned.boss.signaturePending, true);
  assert.equal(warned.boss.phase, 1);
  assert.equal(warned.fighters.find((fighter) => fighter.id === 'orin').hp, 24);
  assert.equal(warned.log.some((entry) => entry.type === 'signature'), false);

  session.endTurn();
  assert.equal(session.runEnemyTurn().resolved, true);
  assert.equal(session.snapshot().fighters.find((fighter) => fighter.id === 'orin').hp, 14);
  assert.equal(session.snapshot().boss.checkpoint, false);

  assert.equal(session.selectAbility('bloom-shield').ok, true);
  session.endTurn();
  session.runEnemyTurn();
  session.endTurn();
  session.runEnemyTurn();
  const shielded = session.snapshot().fighters.find((fighter) => fighter.id === 'orin');
  assert.equal(shielded.hp, 12);
  assert.equal(shielded.shield, 0);

  const foe = session.snapshot().fighters.find((fighter) => fighter.team === 'enemy');
  const orin = session.snapshot().fighters.find((fighter) => fighter.id === 'orin');
  if (Math.hypot(orin.x - foe.x, orin.z - foe.z) > 1.6) {
    const step = session.snapshot().destinations.find((cell) => Math.hypot(cell.x - foe.x, cell.z - foe.z) <= 1.6);
    session.previewMove(step.x, step.z);
    session.confirmMove();
  }
  while (session.snapshot().boss.phase === 1) {
    const target = session.snapshot().fighters.find((fighter) => fighter.team === 'enemy');
    assert.equal(session.selectAbility('basic-attack').ok, true);
    assert.equal(session.useOn(target.id).ok, true);
  }
  const marked = session.snapshot();
  const markedBoss = marked.fighters.find((fighter) => fighter.team === 'enemy');
  assert.equal(marked.boss.phase, 2);
  assert.equal(marked.boss.checkpoint, true);
  assert.equal(markedBoss.maxHp, 36);
  assert.equal(markedBoss.hp, 18);
  assert.ok(marked.fighters.find((fighter) => fighter.id === 'orin').hp > 0);

  let guard = 0;
  while (session.snapshot().phase === 'fighting' && guard < 20) {
    guard += 1;
    if (session.snapshot().activeId === 'orin') session.endTurn();
    else session.runEnemyTurn();
  }
  assert.equal(session.snapshot().phase, 'defeat');
  assert.equal(session.snapshot().boss.checkpoint, true);
  assert.equal(session.restoreCheckpoint().ok, true);
  const restored = session.snapshot();
  assert.equal(restored.phase, 'fighting');
  assert.equal(restored.boss.phase, marked.boss.phase);
  assert.equal(restored.activeId, marked.activeId);
  assert.equal(restored.boss.signaturePending, marked.boss.signaturePending);
  assert.deepEqual(restored.log, marked.log);
  for (const fighter of marked.fighters) {
    const again = restored.fighters.find((entry) => entry.id === fighter.id);
    assert.equal(again.hp, fighter.hp);
    assert.equal(again.ap, fighter.ap);
    assert.equal(again.shield, fighter.shield);
    assert.equal(again.x, fighter.x);
    assert.equal(again.z, fighter.z);
    assert.equal(again.movedDistance, fighter.movedDistance);
    assert.deepEqual(again.cooldowns, fighter.cooldowns);
  }

  guard = 0;
  while (session.snapshot().phase === 'fighting' && guard < 20) {
    guard += 1;
    if (session.snapshot().activeId === 'orin') session.endTurn();
    else session.runEnemyTurn();
  }
  assert.equal(session.retry().ok, true);
  const restarted = session.snapshot();
  assert.equal(restarted.boss.phase, 1);
  assert.equal(restarted.boss.checkpoint, false);
  assert.equal(restarted.fighters.find((fighter) => fighter.team === 'enemy').hp, 36);
  assert.equal(restarted.fighters.find((fighter) => fighter.id === 'orin').hp, 24);
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
