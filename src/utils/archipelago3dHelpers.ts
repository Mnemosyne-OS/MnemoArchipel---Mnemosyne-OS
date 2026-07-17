import { PhysicsNode } from '../types';

/**
 * Calculates screen coordinates and depth scale for a list of 3D PhysicsNodes.
 */
export function getProjectedNodes(
  nodes: PhysicsNode[],
  angleX: number,
  angleY: number,
  zoom: number,
  focalLength: number,
  cx: number,
  cy: number,
  selectedContactId?: string
) {
  return nodes.map(n => {
    // 3D rotation math
    const x1 = n.x * Math.cos(angleY) - n.z * Math.sin(angleY);
    const z1 = n.x * Math.sin(angleY) + n.z * Math.cos(angleY);
    const y2 = n.y * Math.cos(angleX) - z1 * Math.sin(angleX);
    const z2 = n.y * Math.sin(angleX) + z1 * Math.cos(angleX);

    let baseRadius = 24 + (n.warmth * 0.15);
    if (selectedContactId === n.id) {
      baseRadius *= 1.55;
    }
    const safeZ2 = Math.max(-focalLength + 50, z2);
    const scale = (focalLength / (focalLength + safeZ2)) * zoom;
    const screenX = cx + x1 * scale;
    const screenY = cy + y2 * scale;
    const radius = Math.max(12, baseRadius * scale);

    return { 
      id: n.id, 
      n, 
      screenX, 
      screenY, 
      radius, 
      depth: z2,
      relations: n.relations,
      avatarConfig: n.avatarConfig,
      avatar: n.avatar,
      name: n.name
    };
  });
}

/**
 * Given mouse cursor coordinates, returns the node under the cursor.
 */
export function findNodeAtCursor(
  projectedNodes: ReturnType<typeof getProjectedNodes>,
  mx: number,
  my: number
): PhysicsNode | null {
  // Sort by depth to check front-most nodes first
  const sorted = [...projectedNodes].sort((a, b) => a.depth - b.depth);
  for (const item of sorted) {
    const dx = mx - item.screenX;
    const dy = my - item.screenY;
    if (dx * dx + dy * dy <= item.radius * item.radius) {
      return item.n;
    }
  }
  return null;
}

/**
 * Calculates parameter t of segment projection.
 */
function getSegmentDistanceSq(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;
  if (param < 0) {
    xx = x1; yy = y1;
  } else if (param > 1) {
    xx = x2; yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return dx * dx + dy * dy;
}

/**
 * Finds if the mouse coordinates are close to a link connecting two nodes.
 */
export function findLinkAtCursor(
  projectedNodes: ReturnType<typeof getProjectedNodes>,
  mx: number,
  my: number,
  visibleContacts: any[]
): { n1: PhysicsNode; n2: PhysicsNode } | null {
  // Check loop ring links
  for (let i = 0; i < projectedNodes.length; i++) {
    const p1 = projectedNodes[i];
    const p2 = projectedNodes[(i + 1) % projectedNodes.length];
    const distSq = getSegmentDistanceSq(mx, my, p1.screenX, p1.screenY, p2.screenX, p2.screenY);
    if (distSq < 64) { // 8px tolerance
      return { n1: p1.n, n2: p2.n };
    }
  }

  // Check explicit connections
  for (const contact of visibleContacts) {
    const conns = contact.connections || [];
    for (const conn of conns) {
      if (contact.id < conn.targetId) {
        const p1 = projectedNodes.find(n => n.id === contact.id);
        const p2 = projectedNodes.find(n => n.id === conn.targetId);
        if (p1 && p2) {
          const distSq = getSegmentDistanceSq(mx, my, p1.screenX, p1.screenY, p2.screenX, p2.screenY);
          if (distSq < 64) {
            return { n1: p1.n, n2: p2.n };
          }
        }
      }
    }
  }

  return null;
}

/**
 * Calculates the delta movement mapping to move a node along camera-facing planes.
 */
export function calculate3DDragDelta(
  mx: number,
  my: number,
  nodeZ: number,
  zoom: number,
  focalLength: number,
  angleX: number,
  angleY: number
) {
  const safeZ = Math.max(-focalLength + 50, nodeZ);
  const scale = (focalLength / (focalLength + safeZ)) * zoom;
  const factor = 1.0 / Math.max(0.1, scale);

  const dx = mx * factor;
  const dy = my * factor;

  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);

  const ry = dy * cosX;
  const rz = -dy * sinX;

  const rx = dx * cosY + rz * sinY;
  const rz2 = -dx * sinY + rz * cosY;

  return { rx, ry, rz2 };
}
