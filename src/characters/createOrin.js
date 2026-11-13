import * as THREE from 'three';

export function createOrin() {
  const root = new THREE.Group();
  root.name = 'orin';

  const skin = new THREE.MeshStandardMaterial({ color: 0xf0c3a0, roughness: 0.7 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x4a3428, roughness: 0.8 });
  const tunic = new THREE.MeshStandardMaterial({ color: 0x3db7c9, roughness: 0.6 });
  const sash = new THREE.MeshStandardMaterial({ color: 0xf2d27a, roughness: 0.55 });
  const cloth = new THREE.MeshStandardMaterial({ color: 0xfff6ea, roughness: 0.7 });
  const shoes = new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 0.8 });
  const eye = new THREE.MeshStandardMaterial({ color: 0x2f6dff, roughness: 0.3 });
  const bloom = new THREE.MeshStandardMaterial({ color: 0xff6b8a, roughness: 0.45 });

  add(root, new THREE.CapsuleGeometry(0.16, 0.28, 4, 8), tunic, 0, 0.78, 0);
  add(root, new THREE.SphereGeometry(0.2, 16, 12), skin, 0, 1.22, 0);
  const hairCap = add(root, new THREE.SphereGeometry(0.21, 16, 12), hair, 0, 1.36, -0.05);
  hairCap.scale.set(1.05, 0.62, 0.9);
  add(root, new THREE.BoxGeometry(0.36, 0.08, 0.16), hair, 0, 1.22, -0.02);
  add(root, new THREE.SphereGeometry(0.035, 10, 8), eye, -0.07, 1.24, 0.16);
  add(root, new THREE.SphereGeometry(0.035, 10, 8), eye, 0.07, 1.24, 0.16);
  add(root, new THREE.BoxGeometry(0.22, 0.08, 0.08), sash, 0, 0.7, 0.12);
  add(root, new THREE.SphereGeometry(0.06, 10, 8), bloom, 0.1, 0.86, 0.14);
  add(root, new THREE.CapsuleGeometry(0.07, 0.22, 4, 6), cloth, -0.18, 0.78, 0);
  add(root, new THREE.CapsuleGeometry(0.07, 0.22, 4, 6), cloth, 0.18, 0.78, 0);
  add(root, new THREE.CapsuleGeometry(0.08, 0.24, 4, 6), tunic, -0.09, 0.32, 0);
  add(root, new THREE.CapsuleGeometry(0.08, 0.24, 4, 6), tunic, 0.09, 0.32, 0);
  add(root, new THREE.BoxGeometry(0.12, 0.08, 0.2), shoes, -0.09, 0.06, 0.02);
  add(root, new THREE.BoxGeometry(0.12, 0.08, 0.2), shoes, 0.09, 0.06, 0.02);

  root.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  function setPosition(x, z) {
    root.position.set(x, 0, z);
  }

  function setYaw(yaw) {
    root.rotation.y = yaw;
  }

  return { mesh: root, setPosition, setYaw };
}

function add(parent, geometry, material, x, y, z) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}
