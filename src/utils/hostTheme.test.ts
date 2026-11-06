import { describe, it, expect } from 'vitest';
import { archipelTokens } from './hostTheme';

describe('archipelTokens', () => {
  const host = {
    '--bg-void': '#1a1b26',
    '--bg-panel': '#16161e',
    '--bg-surface': 'rgba(169, 177, 214, 0.05)',
    '--bg-surface-hover': 'rgba(169, 177, 214, 0.09)',
    '--text-primary': '#c0caf5',
    '--accent': '#7aa2f7',
  };

  it('never lets the host wash replace the opaque card colour', () => {
    // Same name, two jobs: taken as is, every card of the app turns see-through.
    const out = archipelTokens(host);
    expect(out['--bg-surface']).toBe('#16161e');
    expect(out['--bg-surface-hover']).toBeUndefined();
  });

  it('feeds the app\'s own names from the host equivalents', () => {
    const out = archipelTokens(host);
    expect(out['--bg-deep']).toBe('#1a1b26');
    expect(out['--accent-teal']).toBe('#7aa2f7');
    expect(out['--bg-surface-glass']).toBe('color-mix(in srgb, #16161e 85%, transparent)');
  });

  it('passes the names the two palettes mean the same way', () => {
    expect(archipelTokens(host)['--text-primary']).toBe('#c0caf5');
  });

  it('a host without a panel leaves the app\'s card colour alone', () => {
    // Absent is not empty: no host panel means index.css keeps its own.
    const out = archipelTokens({ '--text-primary': '#fff', '--bg-surface': 'rgba(0,0,0,0.1)' });
    expect(out).not.toHaveProperty('--bg-surface');
    expect(out).not.toHaveProperty('--bg-deep');
  });

  it('drops keys that are not custom properties', () => {
    expect(archipelTokens({ color: 'red', '--accent': '#0f0' })).not.toHaveProperty('color');
  });
});
