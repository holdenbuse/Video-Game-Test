const OPPOSITE = [2, 3, 0, 1];

export function createPetalStreamsLogic(definition) {
  const spacing = definition.spacing;
  const nodes = definition.nodes.map((node) => ({
    id: node.id,
    x: node.x,
    z: node.z,
    ports: node.ports.slice(),
    rotation: node.rotation ?? 0,
    fixed: Boolean(node.fixed),
    role: node.role,
  }));
  const initial = nodes.map((node) => node.rotation);

  function rotate(id) {
    const node = nodes.find((item) => item.id === id);
    if (!node || node.fixed) return false;
    node.rotation = (node.rotation + 1) % 4;
    return true;
  }

  function reset() {
    nodes.forEach((node, index) => {
      node.rotation = initial[index];
    });
  }

  function solve() {
    const links = [];
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const link = facingLink(nodes[i], nodes[j], spacing);
        if (link) links.push(link);
      }
    }

    const source = nodes.find((node) => node.role === 'source');
    const powered = new Set(source ? [source.id] : []);
    const queue = source ? [source.id] : [];
    while (queue.length > 0) {
      const id = queue.shift();
      for (const link of links) {
        const other = link.from === id ? link.to : link.to === id ? link.from : null;
        if (!other || powered.has(other)) continue;
        powered.add(other);
        queue.push(other);
      }
    }

    const goal = nodes.find((node) => node.role === 'goal');
    return {
      links: links.map((link) => ({
        ...link,
        powered: powered.has(link.from) && powered.has(link.to),
      })),
      powered: [...powered],
      complete: Boolean(goal && powered.has(goal.id)),
    };
  }

  return { nodes, rotate, reset, solve };
}

export function adjacentPairs(nodes, spacing) {
  const pairs = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      if (!isAdjacent(nodes[i], nodes[j], spacing)) continue;
      pairs.push({
        from: nodes[i].id,
        to: nodes[j].id,
        ax: nodes[i].x,
        az: nodes[i].z,
        bx: nodes[j].x,
        bz: nodes[j].z,
      });
    }
  }
  return pairs;
}

function facingLink(a, b, spacing) {
  if (!isAdjacent(a, b, spacing)) return null;
  const dir = directionFrom(a, b);
  if (!openings(a).includes(dir)) return null;
  if (!openings(b).includes(OPPOSITE[dir])) return null;
  return { from: a.id, to: b.id, key: pairKey(a.id, b.id) };
}

function openings(node) {
  return node.ports.map((port) => (port + node.rotation) % 4);
}

function isAdjacent(a, b, spacing) {
  const dx = Math.abs(b.x - a.x);
  const dz = Math.abs(b.z - a.z);
  const major = Math.max(dx, dz);
  const minor = Math.min(dx, dz);
  return minor <= spacing * 0.2 && Math.abs(major - spacing) <= spacing * 0.2;
}

function directionFrom(a, b) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  if (Math.abs(dx) >= Math.abs(dz)) return dx >= 0 ? 0 : 2;
  return dz >= 0 ? 1 : 3;
}

function pairKey(a, b) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}
