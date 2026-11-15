import * as THREE from 'three';
import { MEMORY_LAYOUT } from '../data/memoryFlowersLayout.js';
import { createMemoryFlowersLogic, MEMORY_COLORS, MEMORY_ID } from './memoryFlowers.js';
import { createPuzzleSign, createResetStone, invisibleMaterial } from './puzzleProps.js';

const COLOR_HEX = {
  pink: 0xff6b9a,
  gold: 0xffd166,
  violet: 0xc77dff,
  white: 0xfff6ea,
};

export function createMemoryFlowers(completion, now = () => performance.now()) {
  const logic = createMemoryFlowersLogic({ now });
  const root = new THREE.Group();
  root.name = 'memory-flowers';

  const pattern = MEMORY_LAYOUT.pattern.map((spot) => {
    const flower = buildFlower('memory:look');
    flower.group.position.set(spot.x, 0, spot.z);
    root.add(flower.group);
    return flower;
  });
  const copies = MEMORY_LAYOUT.copies.map((spot, index) => {
    const flower = buildFlower(`memory:${index}`);
    flower.group.position.set(spot.x, 0, spot.z);
    root.add(flower.group);
    return flower;
  });

  const timer = buildTimer();
  timer.board.position.set(10.15, 1.15, -13.15);
  root.add(timer.board);

  root.add(createPuzzleSign({
    title: 'Memory Flowers',
    subtitle: 'Prototype layout',
    body: 'Click the back row to study the four flowers for seven seconds. Then make the front row match. Looking again resets this attempt. The stone resets it too.',
    x: MEMORY_LAYOUT.sign.x,
    z: MEMORY_LAYOUT.sign.z,
  }));
  root.add(createResetStone({ id: 'memory:reset', x: MEMORY_LAYOUT.reset.x, z: MEMORY_LAYOUT.reset.z }));

  let shownSecond = '';

  function activate(id) {
    if (completion.has(MEMORY_ID)) return { type: 'complete', first: false };
    if (id === 'memory:look') {
      logic.look(now());
      return { type: 'look' };
    }
    if (id === 'memory:reset') {
      logic.reset(now());
      return { type: 'reset' };
    }
    if (!id.startsWith('memory:')) return null;
    const result = logic.cycle(Number(id.slice('memory:'.length)), now());
    if (result.type !== 'complete') return result;
    return { type: 'complete', first: completion.claim(MEMORY_ID) };
  }

  function update() {
    const time = now();
    const solved = completion.has(MEMORY_ID);
    const open = logic.showing(time);
    const colors = logic.pattern();
    pattern.forEach((flower, index) => paint(flower, open || solved ? colors[index] : null, open || solved ? 1 : 0.55));
    const attempt = logic.attempt();
    copies.forEach((flower, index) => paint(flower, attempt[index], 1));
    const label = solved ? 'Done' : open ? String(Math.ceil(logic.remaining(time) / 1000)) : 'Look';
    if (label !== shownSecond) {
      shownSecond = label;
      paintTimer(timer.ctx, timer.texture, label);
    }
  }

  function debug() {
    return {
      id: MEMORY_ID,
      showing: logic.showing(now()),
      remaining: logic.remaining(now()),
      pattern: logic.pattern(),
      attempt: logic.attempt(),
      colors: MEMORY_COLORS,
    };
  }

  update();
  return { root, activate, update, debug };
}

function buildFlower(id) {
  const group = new THREE.Group();
  group.userData.interactableId = id;
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.07, 0.42, 8),
    new THREE.MeshStandardMaterial({ color: 0x3f8f55, roughness: 0.7 }),
  );
  stem.position.y = 0.24;
  stem.castShadow = true;
  const bloom = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xb7b1a6, roughness: 0.45 }),
  );
  bloom.position.y = 0.58;
  bloom.castShadow = true;
  const click = new THREE.Mesh(new THREE.SphereGeometry(0.36, 10, 8), invisibleMaterial());
  click.position.y = 0.5;
  group.add(stem, bloom, click);
  return { group, bloom };
}

function paint(flower, colorIndex, scale) {
  const name = colorIndex === null || colorIndex === undefined ? null : MEMORY_COLORS[colorIndex];
  const color = name ? COLOR_HEX[name] : 0xb7b1a6;
  flower.bloom.material.color.setHex(color);
  flower.bloom.material.emissive = flower.bloom.material.emissive || new THREE.Color();
  flower.bloom.material.emissive.setHex(name ? color : 0x000000);
  flower.bloom.material.emissiveIntensity = name ? 0.35 : 0;
  flower.bloom.scale.setScalar(name ? scale : 0.62);
}

function buildTimer() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.45),
    new THREE.MeshBasicMaterial({ map: texture }),
  );
  board.raycast = () => {};
  return { board, ctx, texture };
}

function paintTimer(ctx, texture, label) {
  ctx.fillStyle = '#fff8ec';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#8a6a45';
  ctx.lineWidth = 10;
  ctx.strokeRect(6, 6, 244, 116);
  ctx.fillStyle = '#2a241c';
  ctx.font = 'bold 72px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText(label, 128, 88);
  texture.needsUpdate = true;
}
