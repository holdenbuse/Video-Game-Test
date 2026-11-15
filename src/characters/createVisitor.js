import * as THREE from 'three';
import { ACADEMY_HEAD } from '../data/academyHead.js';

export function createVisitor() {
  const root = new THREE.Group();
  root.name = 'academy-head';
  root.visible = false;
  root.position.set(ACADEMY_HEAD.x, 0, ACADEMY_HEAD.z);

  const robe = new THREE.MeshStandardMaterial({ color: 0x243456, roughness: 0.75 });
  const cloth = new THREE.MeshStandardMaterial({ color: 0xd7d2c6, roughness: 0.8 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xe0b494, roughness: 0.7 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x6e675f, roughness: 0.85 });

  add(root, new THREE.ConeGeometry(0.46, 1.15, 8), robe, 0, 0.72, 0);
  add(root, new THREE.SphereGeometry(0.22, 16, 12), skin, 0, 1.48, 0);
  const cap = add(root, new THREE.SphereGeometry(0.23, 16, 12), hair, 0, 1.6, -0.02);
  cap.scale.set(1.02, 0.55, 0.9);
  add(root, new THREE.BoxGeometry(0.34, 0.08, 0.16), cloth, 0, 1.05, 0.16);

  const label = document.createElement('canvas');
  label.width = 256;
  label.height = 64;
  const context = label.getContext('2d');
  context.fillStyle = 'rgba(255, 248, 236, 0.94)';
  context.fillRect(0, 0, 256, 64);
  context.strokeStyle = '#243456';
  context.lineWidth = 4;
  context.strokeRect(2, 2, 252, 60);
  context.fillStyle = '#243456';
  context.font = '28px Georgia';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(ACADEMY_HEAD.label, 128, 32);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(label),
    transparent: true,
  }));
  sprite.position.set(0, 2.15, 0);
  sprite.scale.set(1.7, 0.42, 1);
  root.add(sprite);

  root.traverse((child) => {
    if (!child.isMesh && !child.isSprite) return;
    child.userData.interactableId = ACADEMY_HEAD.interactableId;
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  function setVisible(visible) {
    root.visible = visible;
  }

  function setYaw(radians) {
    root.rotation.y = radians;
  }

  return { mesh: root, setVisible, setYaw };
}

function add(parent, geometry, material, x, y, z) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}
