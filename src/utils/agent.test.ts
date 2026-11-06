/**
 * The agent's moves in L'Archipel (doc 149): each is the person's own button
 * (the shared edits of contactEdits.ts, saved through handleUpdateContact),
 * each shows the contact's page, and every refusal names what to call.
 */
import { describe, expect, it, vi } from 'vitest';
import { archipelAgentHandlers, contactsLimit, findContact, searchContacts, type ArchipelAgentContext } from './agent';
import { withFact, withTask, withTaskToggled } from './contactEdits';
import type { Contact } from '../types';

const contact = (id: string, name: string, over: Partial<Contact> = {}): Contact => ({
  id, name, relations: ['Friend'], status: 'active', lastContact: '2026-10-01', warmth: 50, avatar: '👤',
  facts: ['Loves jazz'], mood: 'neutral', mementos: [], ...over,
});

/** A context whose saves really change the list, as useCrmState does. */
function setup(over: Partial<ArchipelAgentContext> = {}) {
  let contacts: Contact[] = [
    contact('a1', 'Léa Martin', { tasks: [{ id: 't1', text: 'Call back', completed: false }] }),
    contact('a2', 'Sam'), contact('a3', 'Sam'),
  ];
  const ctx: ArchipelAgentContext = {
    get contacts() { return contacts; },
    load: 'ok',
    relationKeys: ['Friend', 'Colleague', 'Family', 'Mentor', 'Climbing'],
    addContact: vi.fn((c) => { contacts = [contact('new1', c.name, { relations: c.relations, facts: c.fact ? [c.fact] : [] }), ...contacts]; return 'new1'; }),
    updateContact: vi.fn((c: Contact) => { contacts = contacts.map((x) => (x.id === c.id ? c : x)); }),
    recordContact: vi.fn((id: string) => { contacts = contacts.map((x) => (x.id === id ? { ...x, warmth: x.warmth + 15 } : x)); }),
    openContact: vi.fn(),
    rendered: vi.fn(async () => undefined),
    editingAvatar: false,
    relationLabels: { Climbing: 'Escalade' },
    view: {
      mode: 'settings', filter: 'All', theme: 'dark', avatarStyle: 'human', language: 'auto',
      show: vi.fn(), setFilter: vi.fn(), closeAll: vi.fn(), showReminders: vi.fn(),
      toggleTheme: vi.fn(), toggleAvatarStyle: vi.fn(), setLanguage: vi.fn(),
    },
    ...over,
  };
  return { ctx, h: archipelAgentHandlers(() => ctx), list: () => contacts };
}

describe('the shared edits are the buttons\' own', () => {
  it('withFact adds once, withTask appends, withTaskToggled flips', () => {
    const c = contact('x', 'X');
    expect(withFact(c, 'Loves jazz')).toBe(c);
    expect(withFact(c, 'Plays chess').facts).toEqual(['Loves jazz', 'Plays chess']);
    const t = withTask(c, { id: 't', text: 'x', completed: false });
    expect(t.tasks).toHaveLength(1);
    expect(withTaskToggled(t, 't').tasks![0]!.completed).toBe(true);
  });
});

describe('what an agent reads', () => {
  it('contacts searches every word, accents ignored, and clamps its limit', () => {
    const { h } = setup();
    expect(h.contacts({ query: 'lea jazz' }).contacts.map((c) => c.id)).toEqual(['a1']);
    expect(h.contacts({ query: 'lea' }).contacts[0]).toMatchObject({ openTasks: 1 });
    expect(h.contacts({ limit: -4 }).contacts).toHaveLength(1);
    expect(contactsLimit(-4)).toBe(1);
    expect(contactsLimit(9999)).toBe(500);
    expect(searchContacts([contact('z', 'Zoé')], '')).toHaveLength(1);
  });

  it('a name naming two people is AMBIGUOUS, never the first; an unknown one lists the names', () => {
    const { h } = setup();
    expect(() => h.contact({ contactId: 'Sam' })).toThrow('AMBIGUOUS: "Sam" names several contacts: Sam (a2), Sam (a3); say which');
    expect(() => h.contact({ contactId: 'Nobody' })).toThrow('NO_CONTACT: no contact named "Nobody"; contacts: Léa Martin, Sam (a2), Sam (a3)');
    expect(findContact([contact('q', 'Léa')], 'lea').id).toBe('q');
  });

  it('a person is taken by the words said: a first name, a last name, an id', () => {
    const { h } = setup();
    expect(h.contact({ contactId: 'léa' }).id).toBe('a1');
    expect(h.contact({ contactId: 'Martin' }).id).toBe('a1');
    expect(h.contact({ contactId: 'a3' }).id).toBe('a3');
    const three = [contact('b1', 'Léa Martin'), contact('b2', 'Léa Dubois'), contact('b3', 'Léa')];
    // The whole name wins over the people who carry the word.
    expect(findContact(three, 'Léa').id).toBe('b3');
    expect(() => findContact(three.slice(0, 2), 'Léa')).toThrow(/^AMBIGUOUS: .*Léa Martin, Léa Dubois/);
  });

  it('a list not read yet, or unreadable, is refused (unknown is not empty)', () => {
    expect(() => setup({ load: 'reading' }).h.contacts({})).toThrow(/^NOT_READY/);
    expect(() => setup({ load: 'unreadable' }).h.contacts({})).toThrow(/^NOT_READY/);
  });
});

describe('what an agent changes', () => {
  it('addContact goes through the form\'s save, checks relations, and shows the new page', async () => {
    const { ctx, h, list } = setup();
    expect(await h.addContact({ name: 'Nina', relations: ['Climbing'], fact: 'Met at the gym' })).toEqual({ contactId: 'new1' });
    expect(ctx.addContact).toHaveBeenCalledWith({ name: 'Nina', relations: ['Climbing'], fact: 'Met at the gym' });
    expect(ctx.openContact).toHaveBeenCalledWith(expect.objectContaining({ id: 'new1' }));
    expect(list()[0]!.name).toBe('Nina');
    await expect(h.addContact({ name: 'X', relations: ['Enemy'] })).rejects.toThrow(/^NO_RELATION.*Enemy.*Escalade/);
    // A relation as said, in any of the app's languages, or by the person's own label.
    await h.addContact({ name: 'Paul', relations: ['famille', 'escalade', 'Friend'] });
    expect(ctx.addContact).toHaveBeenLastCalledWith(expect.objectContaining({ relations: ['Family', 'Climbing', 'Friend'] }));
    await expect(h.addContact({ name: '  ' })).rejects.toThrow(/^BAD_ARG/);
  });

  it('a contact that did not land is said', async () => {
    const { h } = setup({ addContact: () => 'ghost' });
    await expect(h.addContact({ name: 'Nina' })).rejects.toThrow(/^WRITE_FAILED/);
  });

  it('a storage that refuses the save is named, never a raw exception', async () => {
    const { h } = setup({ updateContact: () => { throw new Error('QuotaExceededError'); } });
    await expect(h.addFact({ contactId: 'a1', fact: 'New' })).rejects.toThrow(/^WRITE_FAILED.*QuotaExceededError/);
  });

  it('addFact saves through updateContact and shows the page; a fact already there is not repeated', async () => {
    const { ctx, h, list } = setup();
    await h.addFact({ contactId: 'a1', fact: 'Has two cats' });
    expect(list()[0]!.facts).toEqual(['Loves jazz', 'Has two cats']);
    expect(ctx.openContact).toHaveBeenCalledTimes(1);
    expect(await h.addFact({ contactId: 'a1', fact: 'Loves jazz' })).toEqual({ contactId: 'a1', already: true });
    expect(ctx.updateContact).toHaveBeenCalledTimes(1);
  });

  it('recordContact uses the button and shows the contact as saved, not the old copy', async () => {
    const { ctx, h } = setup();
    expect(await h.recordContact({ contactId: 'a1' })).toMatchObject({ warmth: 65 });
    expect(ctx.recordContact).toHaveBeenCalledWith('a1');
    expect(ctx.openContact).toHaveBeenCalledWith(expect.objectContaining({ warmth: 65 }));
  });

  it('addTask and completeTask: the widget\'s edits; ticking twice stays done, false unticks', async () => {
    const { ctx, h, list } = setup();
    const { taskId } = await h.addTask({ contactId: 'a1', text: 'Send photos' });
    expect(list()[0]!.tasks!.map((t) => t.text)).toEqual(['Call back', 'Send photos']);
    await h.completeTask({ contactId: 'a1', taskId });
    await h.completeTask({ contactId: 'a1', taskId });
    expect(list()[0]!.tasks!.find((t) => t.id === taskId)!.completed).toBe(true);
    expect(ctx.updateContact).toHaveBeenCalledTimes(2);
    await h.completeTask({ contactId: 'a1', taskId, done: false });
    expect(list()[0]!.tasks!.find((t) => t.id === taskId)!.completed).toBe(false);
    await expect(h.completeTask({ contactId: 'a1', taskId: 'nope' })).rejects.toThrow('NO_TASK: no task named "nope"; tasks: Call back, Send photos');
  });

  it('completeTask takes a task by its words, and refuses words naming several', async () => {
    const { h, list } = setup();
    await h.addTask({ contactId: 'Léa', text: 'Call Paul back' });
    expect(await h.completeTask({ contactId: 'léa martin', taskId: 'call back' })).toMatchObject({ taskId: 't1', text: 'Call back', done: true });
    expect(list()[0]!.tasks!.find((t) => t.id === 't1')!.completed).toBe(true);
    await expect(h.completeTask({ contactId: 'Léa', taskId: 'call' })).rejects.toThrow('AMBIGUOUS: "call" names several tasks: Call back, Call Paul back; say which');
  });

  it('nothing is written or shown while the person edits an avatar', async () => {
    const { ctx, h } = setup({ editingAvatar: true });
    await expect(h.addFact({ contactId: 'a1', fact: 'x' })).rejects.toThrow(/^BUSY/);
    expect(() => h.openContact({ contactId: 'a1' })).toThrow(/^BUSY/);
    expect(h.contacts({}).total).toBe(3);
    expect(ctx.updateContact).not.toHaveBeenCalled();
    expect(ctx.openContact).not.toHaveBeenCalled();
    expect(() => h.showView({ view: 'list' })).toThrow(/^BUSY/);
    expect(ctx.view.show).not.toHaveBeenCalled();
  });
});

describe("what an agent shows: the screen's own buttons", () => {
  it('showView is a header button; an unknown screen is refused with the list', () => {
    const { ctx, h } = setup();
    expect(h.showView({ view: 'archipelago3d' })).toEqual({ view: 'archipelago3d' });
    expect(ctx.view.show).toHaveBeenCalledWith('archipelago3d');
    expect(() => h.showView({ view: 'map' })).toThrow(/^BAD_ARG.*dashboard, archipelago/);
  });

  it('filterRelation takes the word said, and from another screen shows the 2D map', () => {
    const { ctx, h } = setup();
    expect(h.filterRelation({ relation: 'la famille' })).toEqual({ relation: 'Family', view: 'archipelago' });
    expect(ctx.view.setFilter).toHaveBeenCalledWith('Family');
    expect(ctx.view.show).toHaveBeenCalledWith('archipelago');
    expect(h.filterRelation({ relation: 'tout le monde' }).relation).toBe('All');
    expect(h.filterRelation({ relation: 'mes amis' }).relation).toBe('Friend');
    expect(h.filterRelation({ relation: 'colegas' }).relation).toBe('Colleague');
    expect(() => h.filterRelation({ relation: 'voisins' })).toThrow(/^NO_RELATION: no relation named "voisins"; relations: All, Friend/);
  });

  it('filterRelation on the dashboard keeps the dashboard', () => {
    const { ctx, h } = setup();
    ctx.view.mode = 'dashboard';
    expect(h.filterRelation({ relation: 'colleagues' })).toEqual({ relation: 'Colleague', view: 'dashboard' });
    expect(ctx.view.show).not.toHaveBeenCalled();
  });

  it("closeView and showReminders press the screen's own buttons", () => {
    const { ctx, h } = setup();
    h.closeView();
    h.showReminders();
    expect(ctx.view.closeAll).toHaveBeenCalledTimes(1);
    expect(ctx.view.showReminders).toHaveBeenCalledTimes(1);
  });

  it('setDisplay presses a toggle only when the state must change', () => {
    const { ctx, h } = setup();
    expect(h.setDisplay({ theme: 'dark', avatarStyle: 'magical', language: 'fr' })).toEqual({ theme: 'dark', avatarStyle: 'magical', language: 'fr' });
    expect(ctx.view.toggleTheme).not.toHaveBeenCalled();
    expect(ctx.view.toggleAvatarStyle).toHaveBeenCalledTimes(1);
    expect(ctx.view.setLanguage).toHaveBeenCalledWith('fr');
    expect(() => h.setDisplay({})).toThrow(/^BAD_ARG/);
    expect(() => h.setDisplay({ theme: 'blue' })).toThrow(/^BAD_ARG.*light, dark/);
  });

  it('a language that cannot be saved is said, never reported done', () => {
    const { ctx, h } = setup();
    ctx.view.setLanguage = () => { throw new Error('SecurityError'); };
    expect(() => h.setDisplay({ language: 'es' })).toThrow(/^WRITE_FAILED.*SecurityError/);
  });
});
