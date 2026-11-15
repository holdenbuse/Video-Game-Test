import { abilityById, PLACEHOLDER_COMBAT } from '../data/abilities.js';
import { TUTORIAL_ENCOUNTER } from '../data/encounters.js';
import { GARDEN_GUARDIAN } from '../data/gardenGuardian.js';
import { TUTORIAL_STEPS, createOpenPlay, createTutorial } from './tutorial.js';

const RULES = PLACEHOLDER_COMBAT;

export function movementAp(movedDistance, travel) {
  const freeLeft = Math.max(0, RULES.freeMove - movedDistance);
  const extra = Math.max(0, travel - freeLeft);
  if (extra <= 0) return 0;
  return Math.ceil(extra / RULES.extraDistancePerAp);
}

export function createCombatSession(nav) {
  let definition = TUTORIAL_ENCOUNTER;
  let fighters = fightersFrom(definition);
  let order = turnOrder(fighters);
  let turn = 0;
  let phase = 'exploring';
  const cleared = new Set();
  let tutorial = createTutorial();
  let preview = null;
  let selectedAbility = null;
  let log = [];
  let signaturePending = false;
  let checkpoint = null;
  let enteredPhase = 1;

  function active() {
    return fighters.find((fighter) => fighter.id === order[turn]);
  }

  function foeOf(fighter) {
    return fighters.find((other) => other.team !== fighter.team && other.hp > 0) ?? null;
  }

  function begin() {
    fighters = fightersFrom(definition);
    order = turnOrder(fighters);
    turn = 0;
    tutorial = definition.kind === 'tutorial' ? createTutorial() : createOpenPlay();
    preview = null;
    selectedAbility = null;
    log = [];
    signaturePending = false;
    checkpoint = null;
    enteredPhase = 1;
    phase = 'fighting';
    startTurn();
  }

  function arm(next = TUTORIAL_ENCOUNTER) {
    if (!next || cleared.has(next.id)) return false;
    if (phase === 'fighting' || phase === 'armed' || phase === 'victory' || phase === 'defeat') return false;
    definition = next;
    fighters = fightersFrom(definition);
    order = turnOrder(fighters);
    signaturePending = false;
    checkpoint = null;
    enteredPhase = 1;
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
    if (phase === 'fighting') notePhase();
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
    if (definition.signature) {
      const result = bossSignatureTurn(fighter);
      tutorial.complete('enemy-done');
      return result;
    }
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
      let attacks = 0;
      const limit = definition.attacksPerTurn ?? 1;
      while (attacks < limit && phase === 'fighting' && fighter.ap >= 1) {
        const now = Math.hypot(foe.x - fighter.x, foe.z - fighter.z);
        if (now > RULES.meleeRange + 0.05 || !nav.lineOfSight(fighter.x, fighter.z, foe.x, foe.z)) break;
        fighter.ap -= 1;
        applyDamage(foe, fighter.attackDamage);
        log.push({ type: 'ability', id: fighter.id, ability: 'basic-attack', target: foe.id });
        attacks += 1;
        finishIfNeeded();
      }
    }
    fighter.ap = 0;
    finishIfNeeded();
    if (phase === 'fighting') advance();
    tutorial.complete('enemy-done');
    return { ok: true };
  }

  function bossSignatureTurn(fighter) {
    const signature = definition.signature;
    if (!signaturePending) {
      signaturePending = true;
      fighter.ap = 0;
      log.push({ type: 'telegraph', id: fighter.id, ability: signature.id });
      if (phase === 'fighting') advance();
      return { ok: true, telegraphed: true };
    }
    signaturePending = false;
    const foe = foeOf(fighter);
    if (foe) {
      applyDamage(foe, signature.damage);
      log.push({ type: 'signature', id: fighter.id, ability: signature.id, target: foe.id });
    }
    fighter.ap = 0;
    finishIfNeeded();
    if (phase === 'fighting') notePhase();
    if (phase === 'fighting') advance();
    return { ok: true, resolved: true };
  }

  function enemyPhase() {
    const enemy = fighters.find((fighter) => fighter.team === 'enemy');
    return enemy ? phaseFor(definition, enemy) : 1;
  }

  function notePhase() {
    if (definition.kind !== 'boss') return;
    const enemy = fighters.find((fighter) => fighter.team === 'enemy' && fighter.hp > 0);
    if (!enemy) return;
    const next = phaseFor(definition, enemy);
    if (next <= enteredPhase) return;
    enteredPhase = next;
    checkpoint = captureState();
  }

  function captureState() {
    return {
      turn,
      signaturePending,
      enteredPhase,
      fighters: fighters.map((fighter) => ({
        id: fighter.id,
        x: fighter.x,
        z: fighter.z,
        hp: fighter.hp,
        shield: fighter.shield ?? 0,
        ap: fighter.ap,
        movedDistance: fighter.movedDistance,
        cooldowns: { ...fighter.cooldowns },
      })),
      log: log.map((entry) => ({ ...entry })),
    };
  }

  function restoreCheckpoint() {
    if (phase !== 'defeat' || !checkpoint) return { ok: false };
    turn = checkpoint.turn;
    signaturePending = checkpoint.signaturePending;
    enteredPhase = checkpoint.enteredPhase;
    for (const saved of checkpoint.fighters) {
      const fighter = fighters.find((entry) => entry.id === saved.id);
      if (!fighter) continue;
      fighter.x = saved.x;
      fighter.z = saved.z;
      fighter.hp = saved.hp;
      fighter.shield = saved.shield;
      fighter.ap = saved.ap;
      fighter.movedDistance = saved.movedDistance;
      fighter.cooldowns = { ...saved.cooldowns };
    }
    log = checkpoint.log.map((entry) => ({ ...entry }));
    preview = null;
    selectedAbility = null;
    phase = 'fighting';
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
    const enemy = fighters.find((fighter) => fighter.team === 'enemy');
    const orin = fighters.find((fighter) => fighter.id === 'orin');
    if (enemy && enemy.hp <= 0) {
      phase = 'victory';
      cleared.add(definition.id);
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
      cleared: cleared.has(definition.id),
      kind: definition.kind,
      encounterId: definition.id,
      opportunityAttacks: definition.opportunityAttacks,
      activeId: fighter?.id ?? null,
      selectedAbility,
      preview: preview ? { x: preview.x, z: preview.z, ap: preview.ap, points: preview.points } : null,
      destinations: phase === 'fighting' ? destinations() : [],
      tutorial: step ? {
        id: step.id,
        title: step.title,
        text: step.text,
        action: step.action,
        stepNumber: TUTORIAL_STEPS.findIndex((entry) => entry.id === step.id) + 1,
        stepCount: TUTORIAL_STEPS.length,
        highlight: step.highlight,
        canContinue: step.requires === 'continue',
      } : null,
      outcome: phase === 'victory' ? definition.victoryText : phase === 'defeat' ? definition.defeatText : null,
      armText: phase === 'armed' ? definition.armText : null,
      telegraph: phase === 'fighting' && signaturePending && definition.signature ? {
        name: definition.signature.name,
        text: definition.signature.text,
        action: definition.signature.action,
      } : null,
      boss: definition.kind === 'boss' ? {
        phase: enemyPhase(),
        phaseCount: definition.phases?.length ?? 1,
        checkpoint: Boolean(checkpoint),
        signaturePending,
        divisions: (definition.phases ?? []).slice(0, -1).map((entry) => entry.aboveHpRatio),
      } : null,
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
        movedDistance: entry.movedDistance,
        cooldowns: { ...entry.cooldowns },
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
    restoreCheckpoint,
    leave,
    snapshot,
  };
}

function phaseFor(definition, enemy) {
  const ratio = enemy.maxHp > 0 ? enemy.hp / enemy.maxHp : 0;
  const phases = definition.phases ?? [];
  if (phases.length === 0) return 1;
  for (const entry of phases) {
    if (ratio > entry.aboveHpRatio) return entry.id;
  }
  return phases[phases.length - 1].id;
}

export function strikeAllowed(nav, from, to, range) {
  const distance = Math.hypot(to.x - from.x, to.z - from.z);
  if (distance > range + 0.05) return 'range';
  if (!nav.lineOfSight(from.x, from.z, to.x, to.z)) return 'blocked';
  return null;
}

function fightersFrom(definition) {
  const player = definition.player;
  const enemy = definition.enemy;
  return [
    {
      id: 'orin',
      name: 'Orin',
      team: 'player',
      x: player.x,
      z: player.z,
      hp: player.hp,
      maxHp: player.hp,
      initiative: player.initiative,
      attackDamage: player.attack,
      ap: RULES.apPerTurn,
      movedDistance: 0,
      shield: 0,
      cooldowns: {},
      abilities: player.abilities.slice(),
    },
    {
      id: enemy.id,
      name: enemy.name,
      team: 'enemy',
      x: enemy.x,
      z: enemy.z,
      hp: enemy.hp,
      maxHp: enemy.hp,
      initiative: enemy.initiative,
      attackDamage: enemy.attack,
      ap: RULES.apPerTurn,
      movedDistance: 0,
      shield: 0,
      cooldowns: {},
      abilities: ['basic-attack'],
    },
  ];
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
