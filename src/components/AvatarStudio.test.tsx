import { describe, it, expect } from 'vitest';
import { renderAccessorySvg, renderContactAvatar } from './AvatarStudioComponent';
import { Contact } from '../types';

describe('renderAccessorySvg', () => {
  it('should return SVG graphics for valid accessory IDs', () => {
    expect(renderAccessorySvg(0)).not.toBeNull(); // Gâteau
    expect(renderAccessorySvg(5)).not.toBeNull(); // Bouclier
    expect(renderAccessorySvg(16)).not.toBeNull(); // Guitare
  });

  it('should return null for out-of-bounds accessory IDs', () => {
    expect(renderAccessorySvg(-1)).toBeNull();
    expect(renderAccessorySvg(99)).toBeNull();
  });
});

describe('renderContactAvatar', () => {
  it('should return initials element for generic user avatar', () => {
    const contact: Contact = {
      id: 'test-1',
      name: 'Emma Watson',
      relations: ['Friend'],
      status: 'active',
      lastContact: '2026-07-10',
      warmth: 85,
      avatar: '👤',
      facts: [],
      mood: 'neutral',
      mementos: []
    };

    const element = renderContactAvatar(contact, 40);
    expect(element).toBeDefined();
    // Check that it's a React element
    expect(element.props.style.backgroundColor).toBeDefined();
    expect(element.props.children).toBe('E');
  });

  it('should return emoji string for custom emoji avatars', () => {
    const contact: Contact = {
      id: 'test-2',
      name: 'Liam Neeson',
      relations: ['Friend'],
      status: 'active',
      lastContact: '2026-07-10',
      warmth: 85,
      avatar: '🐱',
      facts: [],
      mood: 'neutral',
      mementos: []
    };

    const element = renderContactAvatar(contact, 40);
    expect(element.props.children).toBe('🐱');
  });
});
