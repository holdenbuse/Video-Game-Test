export function createNavGrid({ width, depth, cellSize }) {
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(depth / cellSize);
  const blocked = new Uint8Array(cols * rows);
  const originX = -width / 2;
  const originZ = -depth / 2;

  function index(c, r) {
    return r * cols + c;
  }

  function inBounds(c, r) {
    return c >= 0 && r >= 0 && c < cols && r < rows;
  }

  function worldToCell(x, z) {
    return {
      c: Math.floor((x - originX) / cellSize),
      r: Math.floor((z - originZ) / cellSize),
    };
  }

  function cellCenter(c, r) {
    return {
      x: originX + (c + 0.5) * cellSize,
      z: originZ + (r + 0.5) * cellSize,
    };
  }

  function isWalkable(x, z) {
    const { c, r } = worldToCell(x, z);
    if (!inBounds(c, r)) return false;
    return blocked[index(c, r)] === 0;
  }

  function blockCircle(x, z, radius) {
    const min = worldToCell(x - radius, z - radius);
    const max = worldToCell(x + radius, z + radius);
    for (let r = min.r; r <= max.r; r += 1) {
      for (let c = min.c; c <= max.c; c += 1) {
        if (!inBounds(c, r)) continue;
        const center = cellCenter(c, r);
        if (Math.hypot(center.x - x, center.z - z) <= radius + cellSize * 0.2) {
          blocked[index(c, r)] = 1;
        }
      }
    }
  }

  function blockRect(minX, minZ, maxX, maxZ) {
    const min = worldToCell(minX, minZ);
    const max = worldToCell(maxX, maxZ);
    for (let r = min.r; r <= max.r; r += 1) {
      for (let c = min.c; c <= max.c; c += 1) {
        if (!inBounds(c, r)) continue;
        const x0 = originX + c * cellSize;
        const z0 = originZ + r * cellSize;
        const overlaps = x0 < maxX && x0 + cellSize > minX && z0 < maxZ && z0 + cellSize > minZ;
        if (overlaps) blocked[index(c, r)] = 1;
      }
    }
  }

  function nearestWalkable(x, z, maxDistance) {
    if (isWalkable(x, z)) return { x, z };
    const { c: startC, r: startR } = worldToCell(x, z);
    const maxCells = Math.ceil(maxDistance / cellSize);
    let best = null;
    let bestDistance = Infinity;
    for (let radius = 1; radius <= maxCells; radius += 1) {
      for (let dc = -radius; dc <= radius; dc += 1) {
        for (let dr = -radius; dr <= radius; dr += 1) {
          if (Math.max(Math.abs(dc), Math.abs(dr)) !== radius) continue;
          const c = startC + dc;
          const r = startR + dr;
          if (!inBounds(c, r) || blocked[index(c, r)]) continue;
          const point = cellCenter(c, r);
          const distance = Math.hypot(point.x - x, point.z - z);
          if (distance <= maxDistance && distance < bestDistance) {
            best = point;
            bestDistance = distance;
          }
        }
      }
    }
    return best;
  }

  function lineOfSight(x0, z0, x1, z1) {
    const distance = Math.hypot(x1 - x0, z1 - z0);
    const steps = Math.max(1, Math.ceil(distance / (cellSize * 0.45)));
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      if (!isWalkable(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t)) return false;
    }
    return true;
  }

  function smooth(fromX, fromZ, points) {
    const result = [];
    let anchorX = fromX;
    let anchorZ = fromZ;
    let indexCursor = 0;
    while (indexCursor < points.length) {
      let chosen = indexCursor;
      for (let j = points.length - 1; j > indexCursor; j -= 1) {
        if (lineOfSight(anchorX, anchorZ, points[j].x, points[j].z)) {
          chosen = j;
          break;
        }
      }
      result.push(points[chosen]);
      anchorX = points[chosen].x;
      anchorZ = points[chosen].z;
      indexCursor = chosen + 1;
    }
    return result;
  }

  function findPath(fromX, fromZ, toX, toZ, options = {}) {
    const approach = options.approach ?? 4;
    if (!isWalkable(fromX, fromZ)) return { status: 'unreachable', points: [] };

    let goalX = toX;
    let goalZ = toZ;
    if (!isWalkable(goalX, goalZ)) {
      const near = nearestWalkable(goalX, goalZ, approach);
      if (!near) return { status: 'unreachable', points: [] };
      goalX = near.x;
      goalZ = near.z;
    }

    const start = worldToCell(fromX, fromZ);
    const goal = worldToCell(goalX, goalZ);
    if (start.c === goal.c && start.r === goal.r) return { status: 'there', points: [] };

    const goalKey = keyOf(goal.c, goal.r);
    const startKey = keyOf(start.c, start.r);
    const heap = createHeap();
    const gScore = new Map([[startKey, 0]]);
    const came = new Map();
    heap.push(startKey, heuristic(start.c, start.r, goal.c, goal.r), 0);

    const directions = [
      [1, 0, 1],
      [-1, 0, 1],
      [0, 1, 1],
      [0, -1, 1],
      [1, 1, Math.SQRT2],
      [1, -1, Math.SQRT2],
      [-1, 1, Math.SQRT2],
      [-1, -1, Math.SQRT2],
    ];

    let found = false;
    let guard = cols * rows;
    while (heap.size > 0 && guard > 0) {
      guard -= 1;
      const current = heap.pop();
      if (current.g !== gScore.get(current.key)) continue;
      if (current.key === goalKey) {
        found = true;
        break;
      }
      const currentKey = current.key;
      const cell = decode(currentKey);
      const currentG = current.g;
      for (const [dc, dr, cost] of directions) {
        const nextC = cell.c + dc;
        const nextR = cell.r + dr;
        if (!inBounds(nextC, nextR) || blocked[index(nextC, nextR)]) continue;
        if (dc !== 0 && dr !== 0) {
          if (blocked[index(cell.c + dc, cell.r)] || blocked[index(cell.c, cell.r + dr)]) {
            continue;
          }
        }
        const nextKey = keyOf(nextC, nextR);
        const tentative = currentG + cost;
        if (tentative >= (gScore.get(nextKey) ?? Infinity)) continue;
        came.set(nextKey, currentKey);
        gScore.set(nextKey, tentative);
        heap.push(nextKey, tentative + heuristic(nextC, nextR, goal.c, goal.r), tentative);
      }
    }

    if (!found) return { status: 'unreachable', points: [] };

    const chain = [];
    let cursor = goalKey;
    while (cursor) {
      chain.push(cursor);
      cursor = came.get(cursor);
    }
    chain.reverse();
    const points = chain.slice(1).map((entry) => {
      const cell = decode(entry);
      return cellCenter(cell.c, cell.r);
    });
    if (points.length === 0) return { status: 'there', points: [] };
    return { status: 'ok', points: smooth(fromX, fromZ, points) };
  }

  return {
    isWalkable,
    blockCircle,
    blockRect,
    nearestWalkable,
    findPath,
    lineOfSight,
  };
}

export function rasterizeBlocks(nav, blocks, padding) {
  for (const block of blocks) {
    if (block.type === 'circle') {
      nav.blockCircle(block.x, block.z, block.radius + padding);
    } else if (block.type === 'rect') {
      nav.blockRect(
        block.minX - padding,
        block.minZ - padding,
        block.maxX + padding,
        block.maxZ + padding,
      );
    }
  }
}

function keyOf(c, r) {
  return `${c},${r}`;
}

function decode(key) {
  const [c, r] = key.split(',').map(Number);
  return { c, r };
}

function heuristic(c, r, goalC, goalR) {
  const dc = Math.abs(c - goalC);
  const dr = Math.abs(r - goalR);
  const diagonal = Math.min(dc, dr);
  const straight = Math.max(dc, dr) - diagonal;
  return diagonal * Math.SQRT2 + straight;
}

function createHeap() {
  const items = [];
  return {
    get size() {
      return items.length;
    },
    push(key, score, g) {
      items.push({ key, score, g });
      let i = items.length - 1;
      while (i > 0) {
        const parent = (i - 1) >> 1;
        if (items[parent].score <= items[i].score) break;
        [items[parent], items[i]] = [items[i], items[parent]];
        i = parent;
      }
    },
    pop() {
      const top = items[0];
      const last = items.pop();
      if (items.length > 0 && last) {
        items[0] = last;
        let i = 0;
        for (;;) {
          const left = i * 2 + 1;
          const right = left + 1;
          let smallest = i;
          if (left < items.length && items[left].score < items[smallest].score) smallest = left;
          if (right < items.length && items[right].score < items[smallest].score) smallest = right;
          if (smallest === i) break;
          [items[smallest], items[i]] = [items[i], items[smallest]];
          i = smallest;
        }
      }
      return top;
    },
  };
}
