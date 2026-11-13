import { abilityById, PLACEHOLDER_COMBAT } from '../data/abilities.js';
import { ARM_TEXT, DEFEAT_TEXT, GARDEN_GUARDIAN, VICTORY_TEXT } from '../data/gardenGuardian.js';
import { createTutorial } from './tutorial.js';

const RULES = PLACEHOLDER_COMBAT;

export function movementAp(movedDistance, travel) {
  const freeLeft = Math.max(0, RULES.freeMove - movedDistance);
  const extra = Math.max(0, travel - freeLeft);
  if (extra <= 0) return 0;
  return Math.ceil(extra / RULES.extraDistancePerAp);
}

export function createCombatSession(nav) {
  const initial = startingFighters();
  let fighters = cloneFighters(initial);
  let order = turnOrder(fighters);
  let turn = 0;
  let phase = 'exploring';
  let cleared = false;
  let tutorial = createTutorial();
  let preview = null;
  let selectedAbility = null;
  let log = [];

  function active() {
    return fighters.find((fighter) => fighter.id === order[turn]);
  }

  function foeOf(fighter) {
    return fighters.find((other) => other.team !== fighter.team && other.hp > 0) ?? null;
  }

  function begin() {
    fighters = cloneFighters(initial);
    order = turnOrder(fighters);
    turn = 0;
    tutorial = createTutorial();
    preview = null;
    selectedAbility = null;
    log = [];
    phase = 'fighting';
    startTurn();
  }

  function arm() {
    if (cleared || phase === 'fighting' || phase === 'armed') return false;
    phase = 'armed';
    return true;
  }

  function startTurn() {
    const fighter = active();
    if (!fighter || fighter.hp <= 0) {
      advance();
      return;
    }
    fighter.ap = RULES.apPerTurn;
    fighter.movedDistance = 0;
    for (const id of Object.keys(fighter.cooldowns)) {
      fighter.cooldowns[id] = Math.max(0, fighter.cooldowns[id] - 1);
    }
  }

  function destinations() {
    if (phase !== 'fighting') return [];
    const fighter = active();
    if (!fighter || fighter.team !== 'player' || !tutorial.allows('move')) return [];
    const step = tutorial.current();
    const budget = RULES.freeMove - fighter.movedDistance + fighter.ap * RULES.extraDistancePerAp;
    if (budget <= 0) return [];
    const foe = foeOf(fighter);
    return nav.reachable(fighter.x, fighter.z, Math.max(0, budget))
      .map((cell) => ({ ...cell, ap: movementAp(fighter.movedDistance, cell.distance) }))
      .filter((cell) => cell.ap <= fighter.ap)
      .filter((cell) => {
        if (!step || step.requires !== 'move' || !foe) return true;
        return cell.ap === 0 && Math.hypot(cell.x - foe.x, cell.z - foe.z) <= RULES.meleeRange;
      });
  }

  function previewMove(x, z) {
    const fighter = active();
    if (!canAct(fighter, 'move')) return { ok: false, reason: 'unavailable' };
    const path = nav.findPath(fighter.x, fighter.z, x, z);
    if (path.status !== 'ok') return { ok: false, reason: 'unreachable' };
    const distance = pathLength(fighter, path.points);
    const ap = movementAp(fighter.movedDistance, distance);
    if (ap > fighter.ap) return { ok: false, reason: 'ap' };
    const step = tutorial.current();
    if (step?.requires === 'move') {
      const foe = foeOf(fighter);
      const end = path.points.at(-1);
      if (ap !== 0 || !foe || Math.hypot(end.x - foe.x, end.z - foe.z) > RULES.meleeRange + 0.05) {
        return { ok: false, reason: 'lesson' };
      }
    }
    preview = { x: path.points.at(-1).x, z: path.points.at(-1).z, ap, distance, points: path.points };
    selectedAbility = null;
    return { ok: true, ...preview };
  }

  function confirmMove() {
    const fighter = active();
    if (!preview || !canAct(fighter, 'move')) return { ok: false, reason: 'unavailable' };
    fighter.x = preview.x;
    fighter.z = preview.z;
    fighter.ap -= preview.ap;
    fighter.movedDistance += preview.distance;
    preview = null;
    tutorial.complete('move');
    log.push({ type: 'move', id: fighter.id });
    return { ok: true };
  }

  function selectAbility(id) {
    const fighter = active();
    const ability = abilityById(id);
    if (!ability || !canAct(fighter, id === 'basic-attack' ? 'basic-attack' : id)) {
      return { ok: false, reason: 'unavailable' };
    }
    if (!fighter.abilities.includes(id)) return { ok: false, reason: 'unknown' };
    if ((fighter.cooldowns[id] ?? 0) > 0) return { ok: false, reason: 'cooldown' };
    if (fighter.ap < ability.ap) return { ok: false, reason: 'ap' };
    if (ability.target === 'self') return cast(fighter, ability, fighter);
    selectedAbility = id;
    preview = null;
    return { ok: true, pending: true };
  }

  function useOn(targetId) {
    const fighter = active();
    const ability = abilityById(selectedAbility);
    const target = fighters.find((entry) => entry.id === targetId);
    if (!ability || !target || !canAct(fighter, ability.id === 'basic-attack' ? 'basic-attack' : ability.id)) {
      return { ok: false, reason: 'unavailable' };
    }
    return cast(fighter, ability, target);
  }

  function cast(fighter, ability, target) {
    if ((fighter.cooldowns[ability.id] ?? 0) > 0) return { ok: false, reason: 'cooldown' };
    if (fighter.ap < ability.ap) return { ok: false, reason: 'ap' };
    if (ability.target === 'self' && target.id !== fighter.id) return { ok: false, reason: 'target' };
    if (ability.target === 'enemy' && target.team === fighter.team) return { ok: false, reason: 'target' };
    if (ability.target === 'enemy') {
      const blocked = strikeAllowed(nav, fighter, target, ability.range);
      if (blocked) return { ok: false, reason: blocked };
    }
    fighter.ap -= ability.ap;
    if (ability.cooldown > 0) fighter.cooldowns[ability.id] = ability.cooldown;
    if (ability.shield) target.shield = (target.shield ?? 0) + ability.shield;
    if (ability.target === 'enemy') {
      const damage = fighter.attackDamage;
      applyDamage(target, damage);
    }
    selectedAbility = null;
    preview = null;
    const lesson = ability.id === 'basic-attack' ? 'basic-attack' : ability.id;
    tutorial.complete(lesson);
    log.push({ type: 'ability', id: fighter.id, ability: ability.id, target: target.id });
    finishIfNeeded();
    return { ok: true };
  }

  function endTurn() {
    const fighter = active();
    if (!fighter || phase !== 'fighting' || !tutorial.allows('end-turn')) {
      return { ok: false, reason: 'lesson' };
    }
    fighter.ap = 0;
    preview = null;
    selectedAbility = null;
    tutorial.complete('end-turn');
    advance();
    const enemy = active()?.team === 'enemy';
    return { ok: true, pendingEnemy: enemy && phase === 'fighting' };
  }

  function runEnemyTurn() {
    const fighter = active();
    if (!fighter || fighter.team !== 'enemy' || phase !== 'fighting') return { ok: false };
    const foe = foeOf(fighter);
    if (foe) {
      const distance = Math.hypot(foe.x - fighter.x, foe.z - fighter.z);
      if (distance > RULES.meleeRange) {
        const step = approach(fighter, foe);
        if (step) {
          preview = null;
          const path = nav.findPath(fighter.x, fighter.z, step.x, step.z);
          if (path.status === 'ok') {
            const travel = pathLength(fighter, path.points);
            const ap = movementAp(fighter.movedDistance, travel);
            if (ap <= fighter.ap) {
              fighter.x = path.points.at(-1).x;
              fighter.z = path.points.at(-1).z;
              fighter.ap -= ap;
              fighter.movedDistance += travel;
              log.push({ type: 'move', id: fighter.id });
            }
          }
        }
      }
      const now = Math.hypot(foe.x - fighter.x, foe.z - fighter.z);
      if (now <= RULES.meleeRange + 0.05 && fighter.ap >= 1 && nav.lineOfSight(fighter.x, fighter.z, foe.x, foe.z)) {
        fighter.ap -= 1;
        applyDamage(foe, fighter.attackDamage);
        log.push({ type: 'ability', id: fighter.id, ability: 'basic-attack', target: foe.id });
      }
    }
    fighter.ap = 0;
    finishIfNeeded();
    if (phase === 'fighting') advance();
    tutorial.complete('enemy-done');
    return { ok: true };
  }

  function acknowledge() {
    if (tutorial.current()?.requires !== 'continue') return { ok: false };
    tutorial.acknowledge();
    return { ok: true };
  }

  function approach(fighter, foe) {
    const budget = RULES.freeMove - fighter.movedDistance + fighter.ap * RULES.extraDistancePerAp;
    const cells = nav.reachable(fighter.x, fighter.z, Math.max(0, budget));
    let best = null;
    for (const cell of cells) {
      const gap = Math.hypot(cell.x - foe.x, cell.z - foe.z);
      const score = gap <= RULES.meleeRange ? gap : 100 + gap;
      if (!best || score < best.score) best = { ...cell, score };
    }
    return best;
  }

  function advance() {
    if (phase !== 'fighting') return;
    for (let i = 0; i < order.length; i += 1) {
      turn = (turn + 1) % order.length;
      const fighter = active();
      if (fighter && fighter.hp > 0) {
        startTurn();
        return;
      }
    }
  }

  function finishIfNeeded() {
    const guardian = fighters.find((fighter) => fighter.id === 'garden-guardian');
    const orin = fighters.find((fighter) => fighter.id === 'orin');
    if (guardian && guardian.hp <= 0) {
      phase = 'victory';
      cleared = true;
      if (orin) {
        orin.hp = orin.maxHp;
        orin.shield = 0;
      }
      preview = null;
      selectedAbility = null;
    } else if (orin && orin.hp <= 0) {
      phase = 'defeat';
      preview = null;
      selectedAbility = null;
    }
  }

  function retry() {
    if (phase !== 'defeat') return { ok: false };
    begin();
    return { ok: true };
  }

  function leave() {
    if (phase !== 'victory') return { ok: false };
    phase = 'exploring';
    return { ok: true };
  }

  function canAct(fighter, action) {
    if (phase !== 'fighting' || !fighter || fighter.team !== 'player' || fighter.hp <= 0) return false;
    if (active()?.id !== fighter.id) return false;
    return tutorial.allows(action);
  }

  function snapshot() {
    const fighter = phase === 'fighting' ? active() : null;
    const step = phase === 'fighting' ? tutorial.current() : null;
    return {
      phase,
      cleared,
      opportunityAttacks: GARDEN_GUARDIAN.opportunityAttacks,
      activeId: fighter?.id ?? null,
      selectedAbility,
      preview: preview ? { x: preview.x, z: preview.z, ap: preview.ap, points: preview.points } : null,
      destinations: phase === 'fighting' ? destinations() : [],
      tutorial: step ? { id: step.id, text: step.text, highlight: step.highlight, canContinue: step.requires === 'continue' } : null,
      outcome: phase === 'victory' ? VICTORY_TEXT : phase === 'defeat' ? DEFEAT_TEXT : null,
      armText: phase === 'armed' ? ARM_TEXT : null,
      fighters: fighters.map((entry) => ({
        id: entry.id,
        name: entry.name,
        team: entry.team,
        x: entry.x,
        z: entry.z,
        hp: entry.hp,
        maxHp: entry.maxHp,
        ap: entry.ap,
        initiative: entry.initiative,
        shield: entry.shield ?? 0,
        active: entry.id === fighter?.id,
      })),
      abilities: (fighter?.abilities ?? []).map((id) => {
        const ability = abilityById(id);
        return {
          id,
          name: ability.name,
          ap: ability.ap,
          cooldown: fighter.cooldowns[id] ?? 0,
          ready: (fighter.cooldowns[id] ?? 0) === 0 && fighter.ap >= ability.ap,
        };
      }),
      log: log.slice(),
    };
  }

  return {
    arm,
    begin,
    previewMove,
    confirmMove,
    selectAbility,
    useOn,
    endTurn,
    runEnemyTurn,
    acknowledge,
    retry,
    leave,
    snapshot,
  };
}

export function strikeAllowed(nav, from, to, range) {
  const distance = Math.hypot(to.x - from.x, to.z - from.z);
  if (distance > range + 0.05) return 'range';
  if (!nav.lineOfSight(from.x, from.z, to.x, to.z)) return 'blocked';
  return null;
}

function startingFighters() {
  return [
    {
      id: 'orin',
      name: 'Orin',
      team: 'player',
      x: GARDEN_GUARDIAN.orin.x,
      z: GARDEN_GUARDIAN.orin.z,
      hp: GARDEN_GUARDIAN.orinHp,
      maxHp: GARDEN_GUARDIAN.orinHp,
      initiative: GARDEN_GUARDIAN.orinInitiative,
      attackDamage: GARDEN_GUARDIAN.orinAttack,
      ap: RULES.apPerTurn,
      movedDistance: 0,
      shield: 0,
      cooldowns: {},
      abilities: GARDEN_GUARDIAN.tutorialAbilities.slice(),
    },
    {
      id: 'garden-guardian',
      name: 'Garden Guardian',
      team: 'enemy',
      x: GARDEN_GUARDIAN.guardian.x,
      z: GARDEN_GUARDIAN.guardian.z,
      hp: GARDEN_GUARDIAN.guardianHp,
      maxHp: GARDEN_GUARDIAN.guardianHp,
      initiative: GARDEN_GUARDIAN.guardianInitiative,
      attackDamage: GARDEN_GUARDIAN.guardianAttack,
      ap: RULES.apPerTurn,
      movedDistance: 0,
      shield: 0,
      cooldowns: {},
      abilities: ['basic-attack'],
    },
  ];
}

function cloneFighters(source) {
  return source.map((fighter) => ({
    ...fighter,
    cooldowns: { ...fighter.cooldowns },
    abilities: fighter.abilities.slice(),
  }));
}

function turnOrder(list) {
  return list.slice().sort((a, b) => b.initiative - a.initiative).map((fighter) => fighter.id);
}

function pathLength(from, points) {
  let total = 0;
  let previous = from;
  for (const point of points) {
    total += Math.hypot(point.x - previous.x, point.z - previous.z);
    previous = point;
  }
  return total;
}

function applyDamage(fighter, amount) {
  let remaining = amount;
  const shield = fighter.shield ?? 0;
  const absorbed = Math.min(shield, remaining);
  fighter.shield = shield - absorbed;
  remaining -= absorbed;
  fighter.hp = Math.max(0, fighter.hp - remaining);
}

export function knownAbilityIds() {
  return GARDEN_GUARDIAN.knownAbilities.slice();
}
