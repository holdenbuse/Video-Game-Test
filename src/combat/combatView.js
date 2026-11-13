import * as THREE from 'three';
import { createGuardian } from '../characters/createGuardian.js';

export function createCombatView(scene) {
  const guardian = createGuardian();
  scene.add(guardian.mesh);

  const geometry = new THREE.CircleGeometry(0.18, 8);
  geometry.rotateX(-Math.PI / 2);
  const markers = new THREE.InstancedMesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0xf2d27a, transparent: true, opacity: 0.85 }),
    480,
  );
  markers.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  markers.count = 0;
  markers.raycast = () => {};
  scene.add(markers);

  const line = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0xfff6ea }),
  );
  line.frustumCulled = false;
  line.visible = false;
  line.raycast = () => {};
  scene.add(line);

  const dummy = new THREE.Object3D();

  function render(snapshot) {
    const enemy = snapshot.fighters.find((fighter) => fighter.id === 'garden-guardian');
    const showEnemy = enemy && (snapshot.phase === 'fighting' || snapshot.phase === 'victory' || snapshot.phase === 'defeat');
    guardian.setVisible(Boolean(showEnemy && enemy.hp > 0));
    if (enemy) {
      guardian.setPosition(enemy.x, enemy.z);
      const orin = snapshot.fighters.find((fighter) => fighter.id === 'orin');
      if (orin) guardian.setYaw(Math.atan2(orin.x - enemy.x, orin.z - enemy.z));
    }

    const cells = snapshot.phase === 'fighting' ? snapshot.destinations : [];
    markers.count = Math.min(cells.length, 480);
    cells.slice(0, markers.count).forEach((cell, index) => {
      dummy.position.set(cell.x, 0.045, cell.z);
      dummy.scale.setScalar(cell.ap > 0 ? 0.7 : 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      markers.setMatrixAt(index, dummy.matrix);
    });
    markers.instanceMatrix.needsUpdate = true;
    markers.visible = markers.count > 0;

    if (snapshot.preview?.points?.length) {
      const orin = snapshot.fighters.find((fighter) => fighter.id === 'orin');
      const points = [new THREE.Vector3(orin.x, 0.08, orin.z)];
      for (const point of snapshot.preview.points) points.push(new THREE.Vector3(point.x, 0.08, point.z));
      line.geometry.dispose();
      line.geometry = new THREE.BufferGeometry().setFromPoints(points);
      line.visible = true;
    } else {
      line.visible = false;
    }
  }

  return { render };
}
