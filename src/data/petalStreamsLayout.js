// Prototype Petal Streams layout for Milestone 2.
// The final layout is still an open question (Q-013). The garden sign says this is a prototype.
// Directions: 0 east (+x), 1 south (+z), 2 west, 3 north.
// A flower's openings are its ports turned in 90-degree steps.

export const PETAL_STREAMS = {
  id: 'petal-streams',
  label: 'Prototype layout',
  origin: { x: -11.2, z: -15.2 },
  spacing: 2.4,
  reset: { x: -1.7, z: 1.15 },
  sign: { x: -0.15, z: 2.7 },
  nodes: [
    { id: 'source', x: 0, z: 0, ports: [0], rotation: 0, fixed: true, role: 'source' },
    { id: 'east', x: 2.4, z: 0, ports: [0, 2], rotation: 3, fixed: false, role: 'straight' },
    { id: 'corner', x: 4.8, z: 0, ports: [0, 1], rotation: 0, fixed: false, role: 'elbow' },
    { id: 'south', x: 4.8, z: 2.4, ports: [0, 2], rotation: 0, fixed: false, role: 'straight' },
    { id: 'goal', x: 4.8, z: 4.8, ports: [3], rotation: 0, fixed: true, role: 'goal' },
  ],
};

export const PETAL_RESET_ID = 'petal:reset';

export function petalNodeId(id) {
  return `petal:${id}`;
}
