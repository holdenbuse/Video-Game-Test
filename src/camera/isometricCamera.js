import * as THREE from 'three';
import { offsetFocus } from './panFocus.js';

export function createIsometricCamera() {
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 240);
  const focus = new THREE.Vector3();
  const target = new THREE.Vector3();
  let snapped = false;
  let freeLook = false;
  const state = {
    azimuth: 0.35,
    distance: 20,
    polar: 0.96,
    minDistance: 8,
    maxDistance: 42,
  };

  function setFocus(x, y, z) {
    focus.set(x, y, z);
  }

  function snap() {
    target.copy(focus);
    snapped = true;
  }

  function follow(x, y, z) {
    if (freeLook) return;
    focus.set(x, y, z);
  }

  function recenter(x, y, z) {
    freeLook = false;
    focus.set(x, y, z);
    snap();
  }

  function lookAt(x, y, z) {
    freeLook = true;
    focus.set(x, y, z);
    snap();
  }

  function panByView(rightAmount, forwardAmount) {
    freeLook = true;
    const next = offsetFocus(focus, state.azimuth, rightAmount, forwardAmount);
    focus.x = next.x;
    focus.z = next.z;
    target.copy(focus);
    snapped = true;
  }

  // Grabbing the ground: dragging right moves the focus left, dragging down moves it toward the horizon.
  function panByGrab(pixelX, pixelY) {
    const scale = state.distance * 0.0024;
    panByView(-pixelX * scale, pixelY * scale);
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

  function focusPoint() {
    return { x: focus.x, y: focus.y, z: focus.z };
  }

  return {
    camera,
    setFocus,
    snap,
    follow,
    recenter,
    lookAt,
    panByView,
    panByGrab,
    resize,
    rotate,
    zoom,
    update,
    focusPoint,
  };
}
