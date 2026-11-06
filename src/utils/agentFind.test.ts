import { describe, expect, it } from 'vitest';
import { findNamed, nameWords, type Named } from './agentFind';

const person = (id: string, name: string): Named<string> => ({ item: id, id, names: [name], label: name });
const PEOPLE = [person('p1', 'Léa Martin'), person('p2', 'Léa'), person('p3', 'Chloé Dubois'), person('p4', 'Paul Martin')];
const kind = { code: 'NO_CONTACT', noun: 'contact' };

describe('a person named the way someone says it', () => {
  it('folds case, accents, fillers and a plural', () => {
    expect(nameWords('la fiche de CHLOÉ')).toEqual(['chloe']);
    expect(nameWords('mes amis')).toEqual(['ami']);
    // A filler is matched before the accents come off: « thé » stays a word.
    expect(nameWords('le thé')).toEqual(['the']);
  });

  it('an id, the whole name, or every word of it', () => {
    expect(findNamed(PEOPLE, 'p3', kind)).toBe('p3');
    expect(findNamed(PEOPLE, 'chloe', kind)).toBe('p3');
    expect(findNamed(PEOPLE, 'la fiche de Paul', kind)).toBe('p4');
    // « Léa » is a whole name: it wins over the people who carry the word.
    expect(findNamed(PEOPLE, 'Léa', kind)).toBe('p2');
    expect(findNamed(PEOPLE, 'léa martin', kind)).toBe('p1');
  });

  it('several matches are refused with their names, never the first taken', () => {
    expect(() => findNamed(PEOPLE, 'Martin', kind)).toThrow('AMBIGUOUS: "Martin" names several contacts: Léa Martin, Paul Martin; say which');
  });

  it('no match is refused with the names that exist', () => {
    expect(() => findNamed(PEOPLE, 'Zoé', kind)).toThrow('NO_CONTACT: no contact named "Zoé"; contacts: Léa Martin, Léa, Chloé Dubois, Paul Martin');
    expect(() => findNamed(PEOPLE, ' ', kind)).toThrow(/^BAD_ARG/);
    expect(() => findNamed(PEOPLE, 'la', kind)).toThrow(/^NO_CONTACT: "la" names no contact/);
    expect(() => findNamed([], 'Léa', kind)).toThrow('contacts: none');
  });

  it('the list in a refusal is capped', () => {
    const many = Array.from({ length: 15 }, (_, i) => person(`x${i}`, `Person ${i}`));
    expect(() => findNamed(many, 'nobody', kind)).toThrow(/Person 11 \(\+3\)$/);
  });
});
