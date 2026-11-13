import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export function pickFromPointer(camera, root, dom, clientX, clientY) {
  const rect = dom.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObject(root, true);
}

export function findInteractableId(object) {
  let current = object;
  while (current) {
    if (current.userData && current.userData.interactableId) return current.userData.interactableId;
    current = current.parent;
  }
  return null;
}
