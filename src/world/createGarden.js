import * as THREE from 'three';
import { FLOWER_COLORS, GARDEN } from '../data/gardenLayout.js';

export function createGarden() {
  const root = new THREE.Group();
  root.name = 'garden';

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(GARDEN.width, GARDEN.depth),
    new THREE.MeshStandardMaterial({ color: 0x73c37a, roughness: 0.95 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.userData.walkSurface = true;
  root.add(ground);

  const lawn = new THREE.Mesh(
    new THREE.CircleGeometry(16.5, 40),
    new THREE.MeshStandardMaterial({ color: 0x86d18a, roughness: 0.95 }),
  );
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.y = 0.012;
  lawn.receiveShadow = true;
  lawn.userData.walkSurface = true;
  root.add(lawn);

  addPath(root, 2.6, 18, 0, 8.6);
  addPath(root, 28, 2.6, 0, 0);
  addRing(root);

  const hedgeMaterial = new THREE.MeshStandardMaterial({ color: 0x2f7a45, roughness: 0.85 });
  for (const block of GARDEN.blocks) {
    if (block.hedge) addHedge(root, hedgeMaterial, block);
  }

  const stone = new THREE.MeshStandardMaterial({ color: 0xd7d0c2, roughness: 0.75 });
  addGate(root, stone);
  addBench(root, stone);
  for (const tree of GARDEN.trees) addTree(root, tree);
  const fountain = addFountain(root, stone);
  const pedestal = addPedestal(root, stone);
  addFlowers(root);

  let time = 0;
  function update(dt) {
    time += dt;
    fountain.water.position.y = 0.58 + Math.sin(time * 2) * 0.025;
    if (pedestal.pulse > 0) {
      pedestal.pulse = Math.max(0, pedestal.pulse - dt);
      const strength = pedestal.pulse / 0.85;
      pedestal.crystal.material.emissiveIntensity = 0.65 + strength * 2;
      const scale = 1 + strength * 0.16;
      pedestal.crystal.scale.setScalar(scale);
    }
  }

  function confirmPedestal() {
    pedestal.pulse = 0.85;
  }

  return { root, update, confirmPedestal };
}

function addPath(parent, width, depth, x, z) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({ color: 0xe3d3b0, roughness: 0.9 }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.02, z);
  mesh.receiveShadow = true;
  mesh.userData.walkSurface = true;
  parent.add(mesh);
}

function addRing(parent) {
  const mesh = new THREE.Mesh(
    new THREE.RingGeometry(3.15, 4.35, 40),
    new THREE.MeshStandardMaterial({ color: 0xe7d8b8, roughness: 0.9 }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.02;
  mesh.receiveShadow = true;
  mesh.userData.walkSurface = true;
  parent.add(mesh);
}

function addHedge(parent, material, block) {
  const width = block.maxX - block.minX;
  const depth = block.maxZ - block.minZ;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, 1.25, depth), material);
  mesh.position.set((block.minX + block.maxX) / 2, 0.62, (block.minZ + block.maxZ) / 2);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
}

function addGate(parent, stone) {
  const pillarGeometry = new THREE.BoxGeometry(0.7, 2.1, 0.7);
  for (const x of [-2.55, 2.55]) {
    const pillar = new THREE.Mesh(pillarGeometry, stone);
    pillar.position.set(x, 1.05, 18.05);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    parent.add(pillar);
  }
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.38, 0.8), stone);
  lintel.position.set(0, 2.15, 18.05);
  lintel.castShadow = true;
  parent.add(lintel);
}

function addBench(parent, stone) {
  const seat = new THREE.Mesh(new THREE.BoxGeometry(3, 0.28, 0.9), stone);
  seat.position.set(5.7, 0.48, 7.95);
  seat.castShadow = true;
  seat.receiveShadow = true;
  parent.add(seat);
}

function addTree(parent, tree) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28 * tree.scale, 0.38 * tree.scale, 1.15 * tree.scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x7a5132, roughness: 0.85 }),
  );
  trunk.position.set(tree.x, 0.55 * tree.scale, tree.z);
  trunk.castShadow = true;
  parent.add(trunk);

  const canopy = new THREE.Mesh(
    new THREE.SphereGeometry(1.35 * tree.scale, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x3f9a52, roughness: 0.8 }),
  );
  canopy.position.set(tree.x, 1.85 * tree.scale, tree.z);
  canopy.castShadow = true;
  canopy.receiveShadow = true;
  parent.add(canopy);
}

function addFountain(parent, stone) {
  const basin = new THREE.Mesh(
    new THREE.CylinderGeometry(2.25, 2.4, 0.7, 28),
    stone,
  );
  basin.position.y = 0.35;
  basin.castShadow = true;
  basin.receiveShadow = true;
  parent.add(basin);

  const water = new THREE.Mesh(
    new THREE.CircleGeometry(1.85, 28),
    new THREE.MeshStandardMaterial({
      color: 0x4eb6e0,
      roughness: 0.18,
      metalness: 0.05,
    }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.58;
  parent.add(water);

  const spout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 0.9, 10),
    stone,
  );
  spout.position.y = 0.95;
  spout.castShadow = true;
  parent.add(spout);
  return { water };
}

function addPedestal(parent, stone) {
  const { x, z, id } = GARDEN.pedestal;
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.74, 0.42, 12), stone);
  base.position.y = 0.21;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.85, 10), stone);
  column.position.y = 0.78;
  column.castShadow = true;
  group.add(column);

  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.38),
    new THREE.MeshStandardMaterial({
      color: 0xff8ec8,
      emissive: 0xff4f9a,
      emissiveIntensity: 0.65,
      roughness: 0.28,
    }),
  );
  crystal.position.y = 1.48;
  crystal.castShadow = true;
  group.add(crystal);

  const clickVolume = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.95, 2.3, 12),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
    }),
  );
  clickVolume.position.y = 1.15;
  group.add(clickVolume);

  group.traverse((child) => {
    if (child.isMesh) child.userData.interactableId = id;
  });
  parent.add(group);
  return { crystal, pulse: 0 };
}

function addFlowers(parent) {
  const geometry = new THREE.ConeGeometry(0.12, 0.28, 6);
  const material = new THREE.MeshStandardMaterial({ roughness: 0.55, vertexColors: false });
  let count = 0;
  const spots = [];
  for (const bed of GARDEN.flowerBeds) {
    for (let i = 0; i < 9; i += 1) {
      const column = i % 3;
      const row = Math.floor(i / 3);
      spots.push({
        x: bed.x + column * (bed.w / 2),
        z: bed.z + row * (bed.d / 2),
        color: FLOWER_COLORS[(count + i) % FLOWER_COLORS.length],
      });
    }
    count += 9;
  }
  const flowers = new THREE.InstancedMesh(geometry, material, spots.length);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  spots.forEach((spot, index) => {
    dummy.position.set(spot.x, 0.16, spot.z);
    dummy.rotation.y = index * 0.7;
    dummy.updateMatrix();
    flowers.setMatrixAt(index, dummy.matrix);
    flowers.setColorAt(index, color.setHex(spot.color));
  });
  if (flowers.instanceColor) flowers.instanceColor.needsUpdate = true;
  flowers.castShadow = true;
  flowers.receiveShadow = true;
  flowers.raycast = () => {};
  parent.add(flowers);
}
