import * as THREE from 'three';

export function createDestinationMarker() {
  const mesh = new THREE.Mesh(
    new THREE.RingGeometry(0.32, 0.52, 28),
    new THREE.MeshBasicMaterial({
      color: 0xffd56a,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.08;
  mesh.visible = false;

  let mode = 'idle';
  let age = 0;

  function show(x, z, kind) {
    mesh.position.set(x, 0.08, z);
    mesh.visible = true;
    mode = kind;
    age = 0;
    const colors = { no: 0xff5d5d, yes: 0x67d36a, go: 0xffd56a };
    mesh.material.color.set(colors[kind] ?? colors.go);
    mesh.scale.setScalar(1);
  }

  function hide() {
    mesh.visible = false;
    mode = 'idle';
  }

  function update(dt) {
    if (!mesh.visible) return;
    age += dt;
    if (mode === 'go' || mode === 'yes') mesh.scale.setScalar(1 + Math.sin(age * 6) * 0.08);
    if ((mode === 'no' && age > 0.7) || (mode === 'yes' && age > 4.5)) hide();
  }

  return { mesh, show, hide, update };
}
