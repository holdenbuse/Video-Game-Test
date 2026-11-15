import * as THREE from 'three';

export function createPuzzleSign({ title, subtitle, body, x, z }) {
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
  ctx.font = 'bold 64px Georgia';
  ctx.fillText(title, 40, 90);
  ctx.font = 'italic 36px Georgia';
  ctx.fillStyle = '#6a5340';
  ctx.fillText(subtitle, 40, 142);
  ctx.font = '34px Georgia';
  ctx.fillStyle = '#2a241c';
  wrapText(ctx, body, 40, 200, 680, 44);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 1.75),
    new THREE.MeshBasicMaterial({ map: texture }),
  );
  board.position.set(x, 1.35, z);
  board.raycast = () => {};

  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.07, 1.05, 8),
    new THREE.MeshStandardMaterial({ color: 0x8b6748, roughness: 0.8 }),
  );
  post.position.set(x, 0.5, z);
  post.castShadow = true;
  post.raycast = () => {};

  const group = new THREE.Group();
  group.add(post, board);
  return group;
}

export function createResetStone({ id, x, z, label = 'Reset' }) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.userData.interactableId = id;

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
  ctx.font = 'bold 58px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText(label, canvas.width / 2, 80);
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, 0.36),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) }),
  );
  plate.position.y = 0.64;
  group.add(plate);

  const click = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.62, 1.15, 10),
    invisibleMaterial(),
  );
  click.position.y = 0.5;
  group.add(click);
  return group;
}

export function invisibleMaterial() {
  return new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    colorWrite: false,
  });
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
