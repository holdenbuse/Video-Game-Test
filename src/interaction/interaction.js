import { GARDEN } from '../data/gardenLayout.js';

export function createInteraction({ nav, movement, onConfirmed, onCharacter, onUnreachable }) {
  let pending = null;

  function requestPedestal() {
    return requestTarget(GARDEN.pedestal, onConfirmed);
  }

  function requestCharacter(target) {
    return requestTarget(target, () => onCharacter(target));
  }

  function requestTarget(target, arrive) {
    const distance = Math.hypot(movement.state.x - target.x, movement.state.z - target.z);
    if (distance <= target.interactRadius) {
      pending = null;
      movement.faceToward(target.x, target.z);
      arrive();
      return { ok: true, arrived: true };
    }

    const approach = findApproach(target);
    if (!approach) {
      pending = null;
      onUnreachable();
      return { ok: false };
    }
    const result = movement.request(approach.x, approach.z);
    if (!result.ok) {
      pending = null;
      onUnreachable();
      return result;
    }
    pending = result.arrived ? null : { target, arrive };
    if (result.arrived) {
      movement.faceToward(target.x, target.z);
      arrive();
    }
    return result;
  }

  function update(arrived) {
    if (!pending || !arrived) return false;
    const { target, arrive } = pending;
    pending = null;
    const distance = Math.hypot(movement.state.x - target.x, movement.state.z - target.z);
    if (distance <= target.interactRadius + 1.25) {
      movement.faceToward(target.x, target.z);
      arrive();
      return true;
    }
    onUnreachable();
    return false;
  }

  function cancel() {
    pending = null;
  }

  function findApproach(target) {
    let best = null;
    let bestScore = Infinity;
    const reach = target.interactRadius * 0.72;
    for (let i = 0; i < 16; i += 1) {
      const angle = (i / 16) * Math.PI * 2;
      const x = target.x + Math.cos(angle) * reach;
      const z = target.z + Math.sin(angle) * reach;
      if (!nav.isWalkable(x, z)) continue;
      const path = nav.findPath(movement.state.x, movement.state.z, x, z);
      if (path.status === 'unreachable') continue;
      const score = path.status === 'there' ? 0 : path.points.length;
      if (score < bestScore) {
        best = { x, z };
        bestScore = score;
      }
    }
    return best;
  }

  return { requestPedestal, requestCharacter, update, cancel };
}
