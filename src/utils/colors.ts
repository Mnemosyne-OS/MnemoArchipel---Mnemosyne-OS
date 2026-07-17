import { CustomCategory } from '../types';

export const PALETTE_COLORS = [
  '#10b981', // emerald
  '#0ea5e9', // teal
  '#f43f5e', // rose
  '#a855f7', // purple
  '#f59e0b', // amber
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal-light
  '#84cc16', // lime
  '#ef4444', // red
];

// Map category to color
export function getCategoryColor(relation: string): string {
  const cleanRel = relation.includes('(') ? relation.split('(')[0].trim() : relation;

  // Check localstorage for custom categories if window/localStorage exists
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('crm_custom_categories');
    if (saved) {
      try {
        const customCats: CustomCategory[] = JSON.parse(saved);
        const custom = customCats.find(c => c.key === cleanRel || c.label === cleanRel);
        if (custom) return custom.color;
      } catch (e) {
        // ignore
      }
    }
  }

  switch (cleanRel) {
    case 'Close Friend':
    case 'Friend':
    case 'Ami':
    case 'Ami Proche':
      return '#10b981'; // emerald
    case 'Colleague':
    case 'Collègue':
      return '#0ea5e9'; // teal
    case 'Family':
    case 'Famille':
      return '#f43f5e'; // rose
    case 'Mentor':
      return '#a855f7'; // purple
    case 'Neighbor':
    case 'Voisin':
      return '#f59e0b'; // amber
    case 'Acquaintance':
    case 'Connaissance':
      return '#ec4899'; // pink
    default:
      return '#9ca3af'; // gray
  }
}
