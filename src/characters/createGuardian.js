import * as THREE from 'three';

export function createGuardian() {
  const root = new THREE.Group();
  root.name = 'garden-guardian';
  root.visible = false;
  root.userData.interactableId = 'fighter:garden-guardian';

  const leaf = new THREE.MeshStandardMaterial({ color: 0x2f8f4e, roughness: 0.75 });
  const moss = new THREE.MeshStandardMaterial({ color: 0x67b15a, roughness: 0.8 });
  const stone = new THREE.MeshStandardMaterial({ color: 0xc4bfb2, roughness: 0.9 });
  const glow = new THREE.MeshStandardMaterial({
    color: 0xd7f5b2,
    emissive: 0x8fbf45,
    emissiveIntensity: 0.45,
    roughness: 0.4,
  });

  add(root, new THREE.CapsuleGeometry(0.34, 0.7, 6, 10), leaf, 0, 0.95, 0);
  add(root, new THREE.SphereGeometry(0.42, 16, 12), moss, 0, 1.55, 0);
  add(root, new THREE.SphereGeometry(0.1, 10, 8), glow, -0.12, 1.62, 0.28);
  add(root, new THREE.SphereGeometry(0.1, 10, 8), glow, 0.12, 1.62, 0.28);
  add(root, new THREE.BoxGeometry(0.16, 0.7, 0.16), stone, -0.28, 0.5, 0);
  add(root, new THREE.BoxGeometry(0.16, 0.7, 0.16), stone, 0.28, 0.5, 0);
  add(root, new THREE.ConeGeometry(0.16, 0.42, 6), leaf, -0.46, 1.35, 0);
  add(root, new THREE.ConeGeometry(0.16, 0.42, 6), leaf, 0.46, 1.35, 0);
  const left = root.children[root.children.length - 2];
  const right = root.children[root.children.length - 1];
  left.rotation.z = 0.5;
  right.rotation.z = -0.5;

  root.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    child.userData.interactableId = 'fighter:garden-guardian';
  });

  function setPosition(x, z) {
    root.position.set(x, 0, z);
  }

  function setYaw(radians) {
    root.rotation.y = radians;
  }

  function setVisible(visible) {
    root.visible = visible;
  }

  function setEncounter(kind, fighterId = 'garden-guardian') {
    const look = LOOKS[kind] ?? LOOKS.tutorial;
    leaf.color.setHex(look.leaf);
    moss.color.setHex(look.moss);
    root.scale.setScalar(look.scale);
    const id = `fighter:${fighterId}`;
    root.userData.interactableId = id;
    root.traverse((child) => {
      if (child.isMesh) child.userData.interactableId = id;
    });
  }

  return { mesh: root, setPosition, setYaw, setVisible, setEncounter };
}

const LOOKS = {
  tutorial: { leaf: 0x2f8f4e, moss: 0x67b15a, scale: 1 },
  standard: { leaf: 0x8d8a82, moss: 0xb7b1a6, scale: 1 },
  boss: { leaf: 0x3e5c3a, moss: 0x6d8f62, scale: 1.2 },
};

function add(parent, geometry, material, x, y, z) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}
