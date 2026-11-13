// Placeholder childhood garden for Milestone 1.
// The pedestal is a test interaction, not a story object.

export const AGENT_RADIUS = 0.45;

export const GARDEN = {
  width: 44,
  depth: 44,
  cellSize: 0.5,
  start: { x: 0, z: 11.5, yaw: Math.PI },
  pedestal: {
    id: 'test-pedestal',
    x: 8.2,
    z: -5.2,
    interactRadius: 1.65,
  },
  pocket: { x: -8.3, z: 3.6 },
  blocks: [
    { type: 'rect', minX: -22, minZ: 19, maxX: 22, maxZ: 22 },
    { type: 'rect', minX: -22, minZ: -22, maxX: 22, maxZ: -19 },
    { type: 'rect', minX: 19, minZ: -19, maxX: 22, maxZ: 19 },
    { type: 'rect', minX: -22, minZ: -19, maxX: -19, maxZ: 19 },
    { type: 'rect', minX: -19, minZ: -19, maxX: 19, maxZ: -17.2, hedge: true },
    { type: 'rect', minX: -19, minZ: 17.2, maxX: -2.15, maxZ: 19, hedge: true },
    { type: 'rect', minX: 2.15, minZ: 17.2, maxX: 19, maxZ: 19, hedge: true },
    { type: 'rect', minX: 17.2, minZ: -17.2, maxX: 19, maxZ: 17.2, hedge: true },
    { type: 'rect', minX: -19, minZ: -17.2, maxX: -17.2, maxZ: 17.2, hedge: true },
    { type: 'circle', x: 0, z: 0, radius: 2.25 },
    { type: 'rect', minX: -11.2, minZ: 1.0, maxX: -10.2, maxZ: 6.8, hedge: true },
    { type: 'rect', minX: -6.4, minZ: 1.0, maxX: -5.4, maxZ: 6.8, hedge: true },
    { type: 'rect', minX: -11.2, minZ: 6.0, maxX: -5.4, maxZ: 7.1, hedge: true },
    { type: 'circle', x: 8.2, z: -5.2, radius: 0.55 },
    { type: 'circle', x: -14.5, z: 10, radius: 0.42 },
    { type: 'circle', x: -14.2, z: -8, radius: 0.48 },
    { type: 'circle', x: 13.8, z: 8.5, radius: 0.4 },
    { type: 'circle', x: 14.2, z: -11, radius: 0.46 },
    { type: 'circle', x: 3.5, z: -14.5, radius: 0.4 },
    { type: 'circle', x: -3.4, z: 14.4, radius: 0.38 },
    { type: 'circle', x: 11.2, z: 13.2, radius: 0.4 },
    { type: 'rect', minX: 4.2, minZ: 7.4, maxX: 7.2, maxZ: 8.5 },
  ],
  trees: [
    { x: -14.5, z: 10, scale: 1.15 },
    { x: -14.2, z: -8, scale: 1.35 },
    { x: 13.8, z: 8.5, scale: 1.05 },
    { x: 14.2, z: -11, scale: 1.28 },
    { x: 3.5, z: -14.5, scale: 1.12 },
    { x: -3.4, z: 14.4, scale: 0.92 },
    { x: 11.2, z: 13.2, scale: 1 },
  ],
  flowerBeds: [
    { x: -4.6, z: 4.2, w: 2.4, d: 1.6 },
    { x: 2.2, z: 4.4, w: 2.2, d: 1.5 },
    { x: -4.8, z: 8.6, w: 2.2, d: 1.4 },
    { x: 2.3, z: 9.2, w: 2.3, d: 1.5 },
    { x: 4.6, z: -2.4, w: 2.6, d: 1.6 },
    { x: -14.8, z: 2.2, w: 2.2, d: 2.4 },
    { x: 12.4, z: -6.5, w: 2.4, d: 1.8 },
    { x: -2.8, z: -8.4, w: 2.8, d: 1.6 },
  ],
};

export const FLOWER_COLORS = [0xff6b8a, 0xffd166, 0xc77dff, 0xfff6ea, 0xff8c42, 0x7ad0ff];
