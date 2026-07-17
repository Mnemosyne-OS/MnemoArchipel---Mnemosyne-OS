import { PhysicsNode } from '../types';

export function solveRepulsion(nodes: PhysicsNode[], kRepulsion: number) {
  for (let i = 0; i < nodes.length; i++) {
    const n1 = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const n2 = nodes[j];
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dz = n2.z - n1.z;
      const distSq = dx*dx + dy*dy + dz*dz + 400.0;
      const dist = Math.sqrt(distSq);
      
      if (dist < 400) {
        const force = kRepulsion / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;
        
        n1.vx -= fx;
        n1.vy -= fy;
        n1.vz -= fz;
        n2.vx += fx;
        n2.vy += fy;
        n2.vz += fz;
      }
    }
  }
}

export function solveAttraction(nodes: PhysicsNode[], kAttraction: number) {
  for (let i = 0; i < nodes.length; i++) {
    const n1 = nodes[i];
    const n2 = nodes[(i + 1) % nodes.length];
    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;
    const dz = n2.z - n1.z;
    const fx = dx * kAttraction;
    const fy = dy * kAttraction;
    const fz = dz * kAttraction;
    
    n1.vx += fx;
    n1.vy += fy;
    n1.vz += fz;
    n2.vx -= fx;
    n2.vy -= fy;
    n2.vz -= fz;
  }
}

export function updatePositions(
  nodes: PhysicsNode[],
  kCenterGravity: number,
  friction: number,
  draggedNodeId: string | null
) {
  for (const n of nodes) {
    if (n.id === 'user-profile') {
      n.x = 0;
      n.y = 0;
      n.z = 0;
      n.vx = 0;
      n.vy = 0;
      n.vz = 0;
      continue;
    }
    if (n.id === draggedNodeId) continue;
    n.vx -= n.x * kCenterGravity;
    n.vy -= n.y * kCenterGravity;
    n.vz -= n.z * kCenterGravity;

    n.vx *= friction;
    n.vy *= friction;
    n.vz *= friction;

    // Cap speed to prevent explosive oscillations
    const maxSpeed = 15;
    const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy + n.vz * n.vz);
    if (speed > maxSpeed) {
      n.vx = (n.vx / speed) * maxSpeed;
      n.vy = (n.vy / speed) * maxSpeed;
      n.vz = (n.vz / speed) * maxSpeed;
    }

    n.x += n.vx;
    n.y += n.vy;
    n.z += n.vz;
  }
}

export function project3D(
  nodes: PhysicsNode[],
  angleX: number,
  angleY: number,
  zoom: number,
  focalLength: number,
  cx: number,
  cy: number
) {
  return nodes.map(n => {
    let x1 = n.x * Math.cos(angleY) - n.z * Math.sin(angleY);
    let z1 = n.x * Math.sin(angleY) + n.z * Math.cos(angleY);
    let y2 = n.y * Math.cos(angleX) - z1 * Math.sin(angleX);
    let z2 = n.y * Math.sin(angleX) + z1 * Math.cos(angleX);

    const scale = (focalLength / (focalLength + z2)) * zoom;
    const screenX = cx + x1 * scale;
    const screenY = cy + y2 * scale;
    const baseRadius = 24 + (n.warmth * 0.15);
    const radius = Math.max(12, baseRadius * scale);

    return {
      id: n.id,
      name: n.name,
      avatar: n.avatar,
      status: n.status,
      relations: n.relations,
      avatarConfig: n.avatarConfig,
      screenX,
      screenY,
      radius,
      depth: z2
    };
  });
}
