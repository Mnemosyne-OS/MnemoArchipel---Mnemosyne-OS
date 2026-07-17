import { describe, it, expect } from 'vitest';
import { arraysEqual, getRandomAvatarConfig, createDemoContacts, generate50DemoContacts, getLayoutPosition } from './helpers';
import { Contact } from '../types';

describe('arraysEqual', () => {
  it('should return true for identical arrays', () => {
    expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(arraysEqual([], [])).toBe(true);
    expect(arraysEqual(['a', 'b'], ['a', 'b'])).toBe(true);
  });

  it('should return false for different lengths', () => {
    expect(arraysEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('should return false for different elements', () => {
    expect(arraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });
});

describe('getRandomAvatarConfig', () => {
  it('should generate a valid Avatar avatar config', () => {
    const config = getRandomAvatarConfig();
    expect(config).toBeDefined();
    
    // Check ranges and values are correct
    expect(config.body).toBeGreaterThanOrEqual(0);
    expect(config.body).toBeLessThanOrEqual(4);
    
    expect(config.color).toMatch(/^#[0-9a-f]{6}$/i);
    
    expect(config.eyes).toBeGreaterThanOrEqual(0);
    expect(config.eyes).toBeLessThanOrEqual(3);
    
    expect(config.mouth).toBeGreaterThanOrEqual(0);
    expect(config.mouth).toBeLessThanOrEqual(7);
    
    expect(config.hat).toBeGreaterThanOrEqual(0);
    expect(config.hat).toBeLessThanOrEqual(11);
    
    expect(Array.isArray(config.accessories)).toBe(true);
    expect(config.accessories?.length).toBeLessThanOrEqual(5);
  });
});

describe('createDemoContacts', () => {
  it('should map mock contacts to random Avatar config and set avatar to robot', () => {
    const mockList: Contact[] = [
      {
        id: '1',
        name: 'John Doe',
        relations: ['Friend'],
        status: 'active',
        lastContact: '2026-07-01',
        warmth: 80,
        avatar: '👤',
        facts: ['Fact A'],
        mood: 'neutral',
        mementos: []
      },
      {
        id: '2',
        name: 'Jane Smith',
        relations: ['Colleague'],
        status: 'warm',
        lastContact: '2026-07-02',
        warmth: 60,
        avatar: '👩',
        facts: [],
        mood: 'happy',
        mementos: []
      }
    ];

    const result = createDemoContacts(mockList);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('John Doe');
    expect(result[0].avatar).toBe('🤖');
    expect(result[0].avatarConfig).toBeDefined();
    expect(result[0].avatarConfig?.body).toBeGreaterThanOrEqual(0);
    
    expect(result[1].name).toBe('Jane Smith');
    expect(result[1].avatar).toBe('🤖');
    expect(result[1].avatarConfig).toBeDefined();
  });
});

describe('generate50DemoContacts', () => {
  it('should generate exactly 50 distinct contacts with Avatar configuration', () => {
    const list = generate50DemoContacts();
    expect(list).toHaveLength(50);
    
    // Check structure of first generated contact
    const first = list[0];
    expect(first.id).toBe('demo-id-0');
    expect(first.avatar).toBe('🦊');
    expect(first.avatarConfig).toBeDefined();
    expect(first.avatarConfig?.color).toBeDefined();
    expect(first.mementos).toHaveLength(1);
    expect(first.facts.length).toBeGreaterThanOrEqual(1);
    
    // Check that we have a mix of categories
    const categories = list.map(c => c.relations[0]);
    expect(categories.includes('Friend')).toBe(true);
    expect(categories.includes('Colleague')).toBe(true);
  });
});

describe('getLayoutPosition', () => {
  it('should generate valid 3D coordinates for all math shapes', () => {
    const shapes = ['sphere', 'torus', 'spiral', 'dna'] as const;
    shapes.forEach(shape => {
      const pos = getLayoutPosition(5, 20, shape);
      expect(pos).toBeDefined();
      expect(typeof pos.x).toBe('number');
      expect(typeof pos.y).toBe('number');
      expect(typeof pos.z).toBe('number');
      expect(Number.isNaN(pos.x)).toBe(false);
      expect(Number.isNaN(pos.y)).toBe(false);
      expect(Number.isNaN(pos.z)).toBe(false);
    });
  });

  it('should generate distinct points for different indices', () => {
    const pos1 = getLayoutPosition(0, 100, 'sphere');
    const pos2 = getLayoutPosition(1, 100, 'sphere');
    expect(pos1.x).not.toEqual(pos2.x);
  });
});
