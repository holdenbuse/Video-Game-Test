import { GARDEN } from '../data/gardenLayout.js';

export function createInteraction({ nav, movement, onConfirmed, onUnreachable }) {
  const pedestal = GARDEN.pedestal;
  let pending = false;

  function requestPedestal() {
    const distance = Math.hypot(movement.state.x - pedestal.x, movement.state.z - pedestal.z);
    if (distance <= pedestal.interactRadius) {
      pending = false;
      movement.faceToward(pedestal.x, pedestal.z);
      onConfirmed();
      return { ok: true, arrived: true };
    }

    const approach = findApproach();
    if (!approach) {
      pending = false;
      onUnreachable();
      return { ok: false };
    }
    const result = movement.request(approach.x, approach.z);
    if (!result.ok) {
      pending = false;
      onUnreachable();
      return result;
    }
    pending = !result.arrived;
    if (result.arrived) {
      movement.faceToward(pedestal.x, pedestal.z);
      onConfirmed();
    }
    return result;
  }

  function update(arrived) {
    if (!pending || !arrived) return false;
    const distance = Math.hypot(movement.state.x - pedestal.x, movement.state.z - pedestal.z);
    pending = false;
    if (distance <= pedestal.interactRadius + 1.25) {
      movement.faceToward(pedestal.x, pedestal.z);
      onConfirmed();
      return true;
    }
    onUnreachable();
    return false;
  }

  function cancel() {
    pending = false;
  }

  function findApproach() {
    let best = null;
    let bestScore = Infinity;
    const reach = pedestal.interactRadius * 0.72;
    for (let i = 0; i < 16; i += 1) {
      const angle = (i / 16) * Math.PI * 2;
      const x = pedestal.x + Math.cos(angle) * reach;
      const z = pedestal.z + Math.sin(angle) * reach;
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

  return { requestPedestal, update, cancel };
}
