import * as THREE from 'three';

export function createIsometricCamera() {
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  const focus = new THREE.Vector3();
  const target = new THREE.Vector3();
  let snapped = false;
  const state = {
    azimuth: 0.35,
    distance: 20,
    polar: 0.96,
    minDistance: 9,
    maxDistance: 34,
  };

  function setFocus(x, y, z) {
    focus.set(x, y, z);
  }

  function resize(width, height) {
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  }

  function rotate(radians) {
    state.azimuth += radians;
  }

  function zoom(amount) {
    state.distance = THREE.MathUtils.clamp(state.distance + amount, state.minDistance, state.maxDistance);
  }

  function update(dt) {
    if (!snapped) {
      target.copy(focus);
      snapped = true;
    } else {
      const blend = 1 - Math.pow(0.0008, dt);
      target.lerp(focus, blend);
    }
    const sinPolar = Math.sin(state.polar);
    const cosPolar = Math.cos(state.polar);
    camera.position.set(
      target.x + Math.sin(state.azimuth) * sinPolar * state.distance,
      target.y + cosPolar * state.distance,
      target.z + Math.cos(state.azimuth) * sinPolar * state.distance,
    );
    camera.lookAt(target);
  }

  return { camera, setFocus, resize, rotate, zoom, update };
}
