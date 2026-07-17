import { describe, it, expect } from 'vitest';
import { PhysicsNode } from '../types';
import { solveRepulsion, solveAttraction, updatePositions, project3D } from './physicsEngine';

describe('physicsEngine math solvers', () => {
  it('should repel close nodes', () => {
    const nodes: PhysicsNode[] = [
      { id: '1', name: 'N1', avatar: '', status: 'active', warmth: 50, relations: [], x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 },
      { id: '2', name: 'N2', avatar: '', status: 'active', warmth: 50, relations: [], x: 10, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }
    ];

    solveRepulsion(nodes, 100);

    // Node 1 should be pushed in negative X, Node 2 in positive X
    expect(nodes[0].vx).toBeLessThan(0);
    expect(nodes[1].vx).toBeGreaterThan(0);
  });

  it('should not repel nodes too far apart', () => {
    const nodes: PhysicsNode[] = [
      { id: '1', name: 'N1', avatar: '', status: 'active', warmth: 50, relations: [], x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 },
      { id: '2', name: 'N2', avatar: '', status: 'active', warmth: 50, relations: [], x: 500, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }
    ];

    solveRepulsion(nodes, 100);

    expect(nodes[0].vx).toBe(0);
    expect(nodes[1].vx).toBe(0);
  });

  it('should attract connected sequential nodes', () => {
    const nodes: PhysicsNode[] = [
      { id: '1', name: 'N1', avatar: '', status: 'active', warmth: 50, relations: [], x: -50, y: 0, z: 0, vx: 0, vy: 0, vz: 0 },
      { id: '2', name: 'N2', avatar: '', status: 'active', warmth: 50, relations: [], x: 50, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }
    ];

    solveAttraction(nodes, 0.1);

    // Node 1 should be pulled toward Node 2 (positive X), Node 2 pulled toward Node 1 (negative X)
    expect(nodes[0].vx).toBeGreaterThan(0);
    expect(nodes[1].vx).toBeLessThan(0);
  });

  it('should apply friction and gravitational center pull', () => {
    const nodes: PhysicsNode[] = [
      { id: '1', name: 'N1', avatar: '', status: 'active', warmth: 50, relations: [], x: 100, y: 100, z: 100, vx: 10, vy: 10, vz: 10 }
    ];

    updatePositions(nodes, 0.05, 0.9, null);

    // Gravity should decrease the velocity, and position should update
    expect(nodes[0].vx).toBeLessThan(10);
    expect(nodes[0].x).toBeCloseTo(104.5);
  });

  it('should project 3D coordinates to 2D screen coordinates', () => {
    const nodes: PhysicsNode[] = [
      { id: '1', name: 'N1', avatar: '', status: 'active', warmth: 50, relations: [], x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }
    ];

    const projected = project3D(nodes, 0, 0, 1.0, 300, 150, 150);

    expect(projected[0].screenX).toBe(150);
    expect(projected[0].screenY).toBe(150);
    expect(projected[0].radius).toBeGreaterThan(10);
  });
});
