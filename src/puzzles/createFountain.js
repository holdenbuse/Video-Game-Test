import * as THREE from 'three';
import { FOUNTAIN_LAYOUT } from '../data/fountainLayout.js';
import { createFountainLogic, FOUNTAIN_ID } from './fountain.js';
import { createPuzzleSign, createResetStone, invisibleMaterial } from './puzzleProps.js';

const LEAF = 0x2f8f4e;

export function createFountain(completion) {
  const logic = createFountainLogic();
  const root = new THREE.Group();
  root.name = 'fountain-puzzle';

  const beds = FOUNTAIN_LAYOUT.beds.map((bed, index) => {
    const built = buildBed(`fountain:${index}`);
    built.group.position.set(bed.x, 0, bed.z);
    root.add(built.group);
    return built;
  });

  const basin = buildBasin();
  basin.position.set(FOUNTAIN_LAYOUT.basin.x, 0, FOUNTAIN_LAYOUT.basin.z);
  root.add(basin);

  const links = logic.links().map(() => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.08, 1),
      new THREE.MeshStandardMaterial({ color: 0x4eb6e0, emissive: 0x1d6f93, roughness: 0.3 }),
    );
    mesh.raycast = () => {};
    mesh.visible = false;
    root.add(mesh);
    return mesh;
  });

  root.add(createPuzzleSign({
    title: 'The Fountain',
    subtitle: 'Prototype layout',
    body: 'Grow each bed one step shorter than the one before it, from the fountain to the lower basin. Click a bed to grow it. The stone resets the beds.',
    x: FOUNTAIN_LAYOUT.sign.x,
    z: FOUNTAIN_LAYOUT.sign.z,
  }));
  root.add(createResetStone({ id: 'fountain:reset', x: FOUNTAIN_LAYOUT.reset.x, z: FOUNTAIN_LAYOUT.reset.z }));

  function activate(id) {
    if (id === 'fountain:reset') {
      logic.reset();
      return { type: 'reset' };
    }
    if (!id.startsWith('fountain:')) return null;
    const grown = logic.grow(Number(id.slice('fountain:'.length)));
    if (!grown) return null;
    if (!grown.complete) return { type: 'grown' };
    return { type: 'complete', first: completion.claim(FOUNTAIN_ID) };
  }

  function update() {
    const flow = logic.links();
    const heights = logic.heights();
    beds.forEach((bed, index) => {
      const height = 0.25 + heights[index] * 0.38;
      bed.stem.scale.y = height / 0.25;
      bed.stem.position.y = height / 2;
      bed.bloom.position.y = height + 0.12;
    });
    const points = [
      FOUNTAIN_LAYOUT.source,
      ...FOUNTAIN_LAYOUT.beds,
      FOUNTAIN_LAYOUT.basin,
    ];
    flow.forEach((link, index) => {
      const from = points[index];
      const to = points[index + 1];
      const dx = to.x - from.x;
      const dz = to.z - from.z;
      const length = Math.max(0.2, Math.hypot(dx, dz) - 0.7);
      links[index].visible = link.open;
      links[index].scale.z = length;
      links[index].position.set((from.x + to.x) / 2, 0.18, (from.z + to.z) / 2);
      links[index].rotation.y = Math.atan2(dx, dz);
    });
    basin.material.emissiveIntensity = logic.solved() ? 0.8 : 0.15;
  }

  function debug() {
    return { heights: logic.heights(), solved: logic.solved(), id: FOUNTAIN_ID };
  }

  update();
  return { root, activate, update, debug };
}

function buildBed(id) {
  const group = new THREE.Group();
  group.userData.interactableId = id;
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.4, 0.28, 12),
    new THREE.MeshStandardMaterial({ color: 0xc4b59a, roughness: 0.85 }),
  );
  pot.position.y = 0.14;
  pot.castShadow = true;
  pot.receiveShadow = true;
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 0.25, 8),
    new THREE.MeshStandardMaterial({ color: LEAF, roughness: 0.7 }),
  );
  stem.castShadow = true;
  const bloom = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x67b15a, roughness: 0.55 }),
  );
  bloom.castShadow = true;
  const click = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.3, 10), invisibleMaterial());
  click.position.y = 0.6;
  group.add(pot, stem, bloom, click);
  return { group, stem, bloom };
}

function buildBasin() {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.52, 0.28, 16),
    new THREE.MeshStandardMaterial({
      color: 0x4eb6e0,
      emissive: 0x1d6f93,
      emissiveIntensity: 0.15,
      roughness: 0.25,
    }),
  );
  mesh.position.y = 0.14;
  mesh.raycast = () => {};
  return mesh;
}
