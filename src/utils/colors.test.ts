import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCategoryColor } from './colors';

describe('getCategoryColor', () => {
  beforeEach(() => {
    // Reset window/localStorage mocks
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('should return default colors for standard categories', () => {
    expect(getCategoryColor('Friend')).toBe('#10b981');
    expect(getCategoryColor('Colleague')).toBe('#0ea5e9');
    expect(getCategoryColor('Family')).toBe('#f43f5e');
    expect(getCategoryColor('Mentor')).toBe('#a855f7');
    expect(getCategoryColor('Neighbor')).toBe('#f59e0b');
    expect(getCategoryColor('Acquaintance')).toBe('#ec4899');
  });

  it('should return gray for unknown categories when storage is empty', () => {
    expect(getCategoryColor('Unknown')).toBe('#9ca3af');
  });

  it('should resolve custom categories color from localStorage', () => {
    const customCats = [
      { key: 'VIP', label: 'VIP Contact', color: '#ff0000' }
    ];
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(customCats));

    expect(getCategoryColor('VIP')).toBe('#ff0000');
  });
});
