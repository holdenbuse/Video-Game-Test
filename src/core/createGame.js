import * as THREE from 'three';
import { createIsometricCamera } from '../camera/isometricCamera.js';
import { createOrin } from '../characters/createOrin.js';
import { AGENT_RADIUS, GARDEN } from '../data/gardenLayout.js';
import { PETAL_STREAMS } from '../data/petalStreamsLayout.js';
import { createPointerInput } from '../input/pointerInput.js';
import { findInteractableId, pickFromPointer } from '../input/pick.js';
import { createInteraction } from '../interaction/interaction.js';
import { createMovement } from '../movement/movement.js';
import { createNavGrid, rasterizeBlocks } from '../movement/navGrid.js';
import { createCompletionLog } from '../puzzles/completionLog.js';
import { createPetalStreams } from '../puzzles/createPetalStreams.js';
import { createRenderer, createSceneLights } from '../rendering/createRenderer.js';
import { createHud } from '../ui/hud.js';
import { createDestinationMarker } from '../world/destinationMarker.js';
import { createGarden } from '../world/createGarden.js';

const TEST_MESSAGE = 'Test pedestal: interaction confirmed.';
const BLOCKED_MESSAGE = 'Orin cannot reach that spot.';
const PETAL_COMPLETE = 'Petal Streams complete.';
const PETAL_ALREADY = 'Petal Streams is already complete.';
const PAN_SPEED = 8;

export function createGame(host) {
  const renderer = createRenderer(host);
  const scene = new THREE.Scene();
  createSceneLights(scene);

  const view = createIsometricCamera();
  const orin = createOrin();
  const garden = createGarden();
  const marker = createDestinationMarker();
  const completion = createCompletionLog();
  const puzzle = createPetalStreams(completion);
  const world = new THREE.Group();
  world.name = 'world';
  world.add(garden.root, puzzle.root);
  scene.add(world, orin.mesh, marker.mesh);

  const nav = createNavGrid(GARDEN);
  rasterizeBlocks(nav, GARDEN.blocks, AGENT_RADIUS);
  const movement = createMovement({ nav });
  movement.state.x = GARDEN.start.x;
  movement.state.z = GARDEN.start.z;
  movement.state.yaw = GARDEN.start.yaw;

  function recenterView() {
    view.recenter(movement.state.x, 0.9, movement.state.z);
  }

  const hud = createHud({
    onRotate: (radians) => view.rotate(radians),
    onZoom: (amount) => view.zoom(amount),
    onPan: (right, forward) => view.panByView(right, forward),
    onRecenter: recenterView,
  });

  const interaction = createInteraction({
    nav,
    movement,
    onConfirmed: () => {
      garden.confirmPedestal();
      marker.show(GARDEN.pedestal.x, GARDEN.pedestal.z, 'yes');
      hud.showMessage(TEST_MESSAGE);
    },
    onUnreachable: () => hud.showMessage(BLOCKED_MESSAGE),
  });

  function placeCharacter() {
    orin.setPosition(movement.state.x, movement.state.z);
    orin.setYaw(movement.state.yaw);
    view.follow(movement.state.x, 0.9, movement.state.z);
  }

  function requestMove(point) {
    interaction.cancel();
    const result = movement.request(point.x, point.z);
    if (!result.ok) {
      marker.show(point.x, point.z, 'no');
      hud.showMessage(BLOCKED_MESSAGE);
      return;
    }
    if (result.arrived) marker.hide();
    else marker.show(result.x, result.z, 'go');
  }

  function onClick(clientX, clientY) {
    const hits = pickFromPointer(view.camera, world, renderer.domElement, clientX, clientY);
    if (hits.length === 0) return;
    const interactableId = findInteractableId(hits[0].object);
    if (interactableId && interactableId.startsWith('petal:')) {
      const outcome = puzzle.activate(interactableId);
      if (outcome?.type === 'complete') {
        hud.showMessage(outcome.first ? PETAL_COMPLETE : PETAL_ALREADY);
      }
      return;
    }
    if (interactableId === GARDEN.pedestal.id) {
      const result = interaction.requestPedestal();
      if (result.ok && !result.arrived) marker.show(result.x, result.z, 'go');
      return;
    }
    requestMove(hits[0].point);
  }

  function onHover(clientX, clientY) {
    const hits = pickFromPointer(view.camera, world, renderer.domElement, clientX, clientY);
    const interactive = hits.length > 0 && findInteractableId(hits[0].object);
    renderer.domElement.style.cursor = interactive ? 'pointer' : 'default';
  }

  const input = createPointerInput(renderer.domElement, {
    onClick,
    onHover,
    onRotate: (radians) => view.rotate(radians),
    onZoom: (amount) => view.zoom(amount),
    onPan: (pixelX, pixelY) => view.panByGrab(pixelX, pixelY),
    onRecenter: recenterView,
  });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    view.resize(window.innerWidth, window.innerHeight);
  }
  resize();
  window.addEventListener('resize', resize);
  placeCharacter();
  view.setFocus(movement.state.x, 0.9, movement.state.z);

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const axes = input.panAxes();
    if (axes.x !== 0 || axes.y !== 0) view.panByView(axes.x * PAN_SPEED * dt, axes.y * PAN_SPEED * dt);
    const step = movement.update(dt);
    if (step.arrived && !interaction.update(true)) marker.hide();
    garden.update(dt);
    puzzle.update(dt);
    marker.update(dt);
    hud.update(dt);
    placeCharacter();
    view.update(dt);
    renderer.render(scene, view.camera);
    requestAnimationFrame(frame);
  }

  function start() {
    requestAnimationFrame(frame);
  }

  if (import.meta.env.DEV) {
    window.__wtff = {
      project(x, y, z) {
        const rect = renderer.domElement.getBoundingClientRect();
        const point = new THREE.Vector3(x, y, z).project(view.camera);
        return {
          x: rect.left + (point.x * 0.5 + 0.5) * rect.width,
          y: rect.top + (-point.y * 0.5 + 0.5) * rect.height,
          behind: point.z > 1,
        };
      },
      pick(clientX, clientY) {
        return pickFromPointer(view.camera, world, renderer.domElement, clientX, clientY)
          .slice(0, 6)
          .map((hit) => ({
            name: hit.object.name || hit.object.type,
            id: findInteractableId(hit.object),
            distance: Number(hit.distance.toFixed(2)),
          }));
      },
      position() {
        return {
          x: Number(movement.state.x.toFixed(2)),
          z: Number(movement.state.z.toFixed(2)),
          moving: movement.state.moving,
        };
      },
      focus() {
        const point = view.focusPoint();
        return {
          x: Number(point.x.toFixed(2)),
          z: Number(point.z.toFixed(2)),
        };
      },
      pan(right, forward) {
        view.panByView(right, forward);
      },
      lookAt(x, z) {
        view.lookAt(x, 0.9, z);
      },
      puzzle() {
        return puzzle.debug();
      },
      toast() {
        return document.querySelector('#toast')?.textContent ?? '';
      },
      layout: PETAL_STREAMS.id,
    };
  }

  return { start };
}
