export function createMovement({ nav, speed = 6 }) {
  const state = {
    x: 0,
    z: 0,
    yaw: 0,
    moving: false,
  };
  let path = [];
  let cursor = 0;
  let face = null;

  function request(x, z) {
    const result = nav.findPath(state.x, state.z, x, z);
    if (result.status === 'unreachable') {
      path = [];
      cursor = 0;
      state.moving = false;
      return { ok: false, x, z };
    }
    if (result.status === 'there') {
      path = [];
      cursor = 0;
      state.moving = false;
      return { ok: true, arrived: true, x: state.x, z: state.z };
    }
    path = result.points;
    cursor = 0;
    state.moving = true;
    face = null;
    const end = result.points.at(-1);
    return { ok: true, arrived: false, x: end.x, z: end.z };
  }

  function update(dt) {
    let arrived = false;
    if (state.moving) {
      let remaining = speed * dt;
      while (remaining > 0 && cursor < path.length) {
        const target = path[cursor];
        const dx = target.x - state.x;
        const dz = target.z - state.z;
        const distance = Math.hypot(dx, dz);
        if (distance < 0.001) {
          cursor += 1;
          continue;
        }
        state.yaw = turnToward(state.yaw, Math.atan2(dx, dz), 10 * dt);
        const step = Math.min(remaining, distance);
        state.x += (dx / distance) * step;
        state.z += (dz / distance) * step;
        remaining -= step;
        if (step >= distance - 1e-4) cursor += 1;
      }
      if (cursor >= path.length) {
        state.moving = false;
        arrived = true;
      }
    } else if (face) {
      const dx = face.x - state.x;
      const dz = face.z - state.z;
      const yawTarget = Math.atan2(dx, dz);
      state.yaw = turnToward(state.yaw, yawTarget, 8 * dt);
      if (Math.abs(angleDelta(state.yaw, yawTarget)) < 0.03) face = null;
    }
    return { arrived };
  }

  function faceToward(x, z) {
    face = { x, z };
  }

  function cancel() {
    path = [];
    cursor = 0;
    state.moving = false;
  }

  return { state, request, update, faceToward, cancel };
}

function angleDelta(current, target) {
  let delta = target - current;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

function turnToward(current, target, maxStep) {
  const delta = angleDelta(current, target);
  if (Math.abs(delta) <= maxStep) return target;
  return current + Math.sign(delta) * maxStep;
}
