import * as THREE from 'three';
import { PETAL_RESET_ID, PETAL_STREAMS, petalNodeId } from '../data/petalStreamsLayout.js';
import { adjacentPairs, createPetalStreamsLogic } from './petalStreams.js';

const ROLE_COLOR = {
  source: 0xff6b9a,
  straight: 0xffd166,
  elbow: 0xc77dff,
  goal: 0x7ad0c8,
};

export function createPetalStreams(completion) {
  const logic = createPetalStreamsLogic(PETAL_STREAMS);
  const root = new THREE.Group();
  root.name = 'petal-streams';
  root.position.set(PETAL_STREAMS.origin.x, 0, PETAL_STREAMS.origin.z);

  const invisible = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    colorWrite: false,
  });

  const views = [];
  for (const node of logic.nodes) {
    const built = buildNode(node, invisible);
    built.group.position.set(node.x, 0, node.z);
    root.add(built.group);
    views.push({
      id: node.id,
      turn: built.turn,
      basin: built.basin,
      shown: -node.rotation * (Math.PI / 2),
    });
    built.turn.rotation.y = -node.rotation * (Math.PI / 2);
  }

  const links = adjacentPairs(logic.nodes, PETAL_STREAMS.spacing).map((pair) => {
    const mesh = linkMesh(pair);
    mesh.raycast = () => {};
    root.add(mesh);
    return { key: pairKey(pair.from, pair.to), mesh };
  });

  root.add(buildSign(PETAL_STREAMS.sign));
  root.add(buildReset(PETAL_STREAMS.reset, invisible));
  root.add(buildPlinth());

  function activate(id) {
    if (id === PETAL_RESET_ID) {
      logic.reset();
      return { type: 'reset' };
    }
    const prefix = 'petal:';
    if (!id.startsWith(prefix)) return null;
    const turned = logic.rotate(id.slice(prefix.length));
    if (!turned) return { type: 'fixed' };
    const flow = logic.solve();
    if (!flow.complete) return { type: 'turned' };
    return { type: 'complete', first: completion.claim(PETAL_STREAMS.id) };
  }

  function update(dt) {
    const flow = logic.solve();
    const powered = new Set(flow.links.filter((link) => link.powered).map((link) => link.key));
    const open = new Set(flow.links.map((link) => link.key));
    const blend = 1 - Math.pow(0.0005, dt);

    for (const view of views) {
      const node = logic.nodes.find((item) => item.id === view.id);
      const target = -node.rotation * (Math.PI / 2);
      view.shown = lerpAngle(view.shown, target, blend);
      view.turn.rotation.y = view.shown;
      if (view.basin) view.basin.material.emissiveIntensity = flow.complete ? 1.6 : 0.18;
    }

    for (const link of links) {
      link.mesh.visible = open.has(link.key);
      const lit = powered.has(link.key);
      link.mesh.material.color.setHex(lit ? 0xff8ec8 : 0xd9c7b0);
      link.mesh.material.emissive.setHex(lit ? 0xff4f9a : 0x000000);
      link.mesh.material.emissiveIntensity = lit ? 1.35 : 0;
    }
  }

  function debug() {
    const flow = logic.solve();
    return {
      complete: flow.complete,
      rewarded: completion.has(PETAL_STREAMS.id),
      nodes: logic.nodes.map((node) => ({
        id: node.id,
        x: PETAL_STREAMS.origin.x + node.x,
        y: 0.55,
        z: PETAL_STREAMS.origin.z + node.z,
        rotation: node.rotation,
        fixed: node.fixed,
      })),
      reset: {
        x: PETAL_STREAMS.origin.x + PETAL_STREAMS.reset.x,
        y: 0.4,
        z: PETAL_STREAMS.origin.z + PETAL_STREAMS.reset.z,
      },
    };
  }

  return { root, update, activate, debug };
}

function buildNode(node, invisible) {
  const group = new THREE.Group();
  group.name = `petal-${node.id}`;
  group.userData.interactableId = petalNodeId(node.id);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.5, 0.12, 14),
    new THREE.MeshStandardMaterial({ color: 0xe4d8c4, roughness: 0.82 }),
  );
  base.position.y = 0.06;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const turn = new THREE.Group();
  const color = ROLE_COLOR[node.role] ?? 0xffd166;
  for (const port of node.ports) turn.add(openingMarker(port, color));

  let basin = null;
  if (node.role === 'source') {
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffd1ea,
        emissive: 0xff4f9a,
        emissiveIntensity: 0.95,
        roughness: 0.32,
      }),
    );
    core.position.y = 0.46;
    core.castShadow = true;
    turn.add(core);
  }
  if (node.role === 'goal') {
    basin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.34, 0.2, 16),
      new THREE.MeshStandardMaterial({
        color: 0x9fe0d8,
        emissive: 0x147a74,
        emissiveIntensity: 0.18,
        roughness: 0.38,
      }),
    );
    basin.position.y = 0.24;
    basin.castShadow = true;
    turn.add(basin);
  }
  group.add(turn);

  const click = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 1.15, 10), invisible);
  click.position.y = 0.55;
  group.add(click);
  return { group, turn, basin };
}

function openingMarker(port, color) {
  const group = new THREE.Group();
  const dx = [1, 0, -1, 0][port];
  const dz = [0, 1, 0, -1][port];
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.28,
    roughness: 0.42,
  });
  const groove = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.16), material);
  groove.rotation.y = -port * (Math.PI / 2);
  groove.position.set(dx * 0.28, 0.16, dz * 0.28);
  groove.castShadow = true;
  group.add(groove);

  const bloom = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 10, 8),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.45,
      roughness: 0.35,
    }),
  );
  bloom.position.set(dx * 0.52, 0.32, dz * 0.52);
  bloom.castShadow = true;
  group.add(bloom);
  return group;
}

function linkMesh(pair) {
  const dx = pair.bx - pair.ax;
  const dz = pair.bz - pair.az;
  const length = Math.max(0.2, Math.hypot(dx, dz) - 0.95);
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.08, 1),
    new THREE.MeshStandardMaterial({ color: 0xd9c7b0, roughness: 0.45, emissive: 0x000000 }),
  );
  mesh.scale.z = length;
  mesh.position.set((pair.ax + pair.bx) / 2, 0.2, (pair.az + pair.bz) / 2);
  mesh.rotation.y = Math.atan2(dx, dz);
  return mesh;
}

function buildSign(spot) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff8ec';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#8a6a45';
  ctx.lineWidth = 12;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  ctx.fillStyle = '#2a241c';
  ctx.font = 'bold 72px Georgia';
  ctx.fillText('Petal Streams', 40, 100);
  ctx.font = 'italic 40px Georgia';
  ctx.fillStyle = '#6a5340';
  ctx.fillText('Prototype layout', 40, 158);
  ctx.font = '40px Georgia';
  ctx.fillStyle = '#2a241c';
  wrapText(ctx, 'Turn the flowers so the light reaches the basin. The round stone resets them.', 40, 230, 680, 50);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(3.7, 1.85),
    new THREE.MeshBasicMaterial({ map: texture }),
  );
  board.position.set(spot.x, 1.45, spot.z);
  board.raycast = () => {};

  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.07, 1.15, 8),
    new THREE.MeshStandardMaterial({ color: 0x8b6748, roughness: 0.8 }),
  );
  post.position.set(spot.x, 0.55, spot.z);
  post.castShadow = true;
  post.raycast = () => {};

  const group = new THREE.Group();
  group.add(post, board);
  return group;
}

function buildReset(spot, invisible) {
  const group = new THREE.Group();
  group.position.set(spot.x, 0, spot.z);
  group.userData.interactableId = PETAL_RESET_ID;

  const stone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.48, 0.28, 16),
    new THREE.MeshStandardMaterial({ color: 0x8ea4b8, roughness: 0.62 }),
  );
  stone.position.y = 0.16;
  stone.castShadow = true;
  stone.receiveShadow = true;
  group.add(stone);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e7eef4';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#243140';
  ctx.font = 'bold 64px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText('Reset', canvas.width / 2, 82);
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.35),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) }),
  );
  label.position.y = 0.62;
  group.add(label);

  const click = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.1, 10), invisible);
  click.position.y = 0.5;
  group.add(click);
  return group;
}

function buildPlinth() {
  const mesh = new THREE.Mesh(
    new THREE.CircleGeometry(4.6, 28),
    new THREE.MeshStandardMaterial({ color: 0xcbb892, roughness: 0.92 }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(2.4, 0.025, 2.4);
  mesh.receiveShadow = true;
  mesh.raycast = () => {};
  return mesh;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = trial;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

function lerpAngle(current, target, t) {
  let delta = target - current;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return current + delta * t;
}

function pairKey(a, b) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}
