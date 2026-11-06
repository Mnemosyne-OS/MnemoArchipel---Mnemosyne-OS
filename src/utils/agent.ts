/**
 * agent.ts — what an agent may do in L'Archipel (doc 149), declared in
 * `mnemo-plugin.json` › agentActions and served by ArchipelAgentActions while
 * the window is open.
 *
 * Each write is the person's own button: « New contact » (handleAddContact),
 * « Add a fact » (withFact), « Record a contact » (handleSimulateContact), the
 * tasks widget (withTask, withTaskToggled), all saved through the same
 * handleUpdateContact, and each one opens the contact's page so the person
 * sees the change land. The screen's own gestures (a header button, a filter
 * chip, the bell, the theme and avatar toggles, the language) are served too,
 * so the orb can drive the app by voice; a person, a task or a relation is
 * taken by the words a person says (utils/agentFind), never only by its id.
 *
 * NOT exposed: the brain dump and the memory search (each calls a model), and
 * deleting a contact (the person confirms it).
 */
import type { Contact, ContactTask } from '../types';
import { withFact, withTask, withTaskToggled } from './contactEdits';
import { findNamed, fold as foldName } from './agentFind';
import { getTranslation } from './i18n';

export interface ArchipelAgentContext {
  contacts: readonly Contact[];
  /** 'ok' once the saved list is read; anything else refuses (unknown is not empty). */
  load: 'reading' | 'ok' | 'unreadable';
  /** Relation keys the person can pick: the built-in ones and their own. */
  relationKeys: readonly string[];
  /** handleAddContact: the « New contact » form's save. Returns the new id. */
  addContact: (c: { name: string; relations: string[]; fact: string; email?: string; phone?: string; address?: string }) => string;
  /** handleUpdateContact: the save every widget of a contact page uses. */
  updateContact: (c: Contact) => void;
  /** handleSimulateContact: « Record a contact » (warmth up, a memento, today). */
  recordContact: (id: string) => void;
  /** Shows the contact's page, as a notification's « go to » does. */
  openContact: (c: Contact) => void;
  /** Resolves after the next render, so a following call reads the saved list. */
  rendered: () => Promise<void>;
  /** The avatar studio is open: leaving it would drop the person's unsaved avatar. */
  editingAvatar: boolean;
  /** The person's own relation labels, by key (« Climbing » → « Escalade »). */
  relationLabels: Readonly<Record<string, string>>;
  /** What is on screen, and the screen's own setters (the header, the filter chips, the settings). */
  view: ArchipelView;
}

/** The screens of the header, by the names an agent uses. */
export const AGENT_VIEWS = ['dashboard', 'archipelago', 'archipelago3d', 'list', 'timeline', 'settings'] as const;
export type AgentView = typeof AGENT_VIEWS[number];
export const AGENT_THEMES = ['light', 'dark'] as const;
export const AGENT_AVATAR_STYLES = ['human', 'magical'] as const;
export const AGENT_LANGUAGES = ['auto', 'en', 'fr', 'es'] as const;

/** What L'Archipel shows and how, read and changed by an agent as by the person's clicks. */
export interface ArchipelView {
  mode: string;
  filter: string;
  theme: 'light' | 'dark';
  avatarStyle: 'human' | 'magical';
  language: 'auto' | 'en' | 'fr' | 'es';
  /** A header button (setViewMode). */
  show: (mode: AgentView) => void;
  /** A filter chip (setActiveFilter): 'All' or a relation key. */
  setFilter: (key: string) => void;
  /** Closes what is open over the screen (a contact page, a form, the profile, the reminders, a menu). */
  closeAll: () => void;
  /** The bell: the reminders tray. */
  showReminders: () => void;
  /** The header's theme toggle. */
  toggleTheme: () => void;
  /** The header's avatar style toggle. */
  toggleAvatarStyle: () => void;
  /** The settings' language select (it saves the choice too). */
  setLanguage: (lang: 'auto' | 'en' | 'fr' | 'es') => void;
}

/** The built-in relations of the « New contact » form. */
export const BUILT_IN_RELATIONS = ['Friend', 'Colleague', 'Family', 'Mentor'] as const;

export const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

/** A whole number inside the manifest's bounds, or the default. Clamped, never trusted. */
export function boundedInt(v: unknown, fallback: number, min: number, max: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(v)));
}

/** `contacts` › limit: 1..500, default 50 (mnemo-plugin.json). */
export const contactsLimit = (v: unknown): number => boundedInt(v, 50, 1, 500);
/** Mementos carried on one contact card; the rest is counted. */
export const MEMENTOS_MAX = 20;

const fold = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Every word of the query somewhere in the contact (name, relations, facts, email, phone), accents ignored. */
export function searchContacts(contacts: readonly Contact[], query: string): Contact[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [...contacts];
  return contacts.filter((c) => {
    const hay = fold([c.name, ...c.relations, ...c.facts, c.email ?? '', c.phone ?? ''].join(' '));
    return words.every((w) => hay.includes(w));
  });
}

export function contactLine(c: Contact) {
  const open = (c.tasks || []).filter((t) => !t.completed).length;
  return {
    id: c.id,
    name: c.name,
    relations: c.relations,
    status: c.status,
    warmth: c.warmth,
    lastContact: c.lastContact,
    ...(c.email ? { email: c.email } : {}),
    ...(c.phone ? { phone: c.phone } : {}),
    facts: c.facts.length,
    ...(open ? { openTasks: open } : {}),
  };
}

export function contactCard(c: Contact) {
  return {
    ...contactLine(c),
    ...(c.address ? { address: c.address } : {}),
    facts: c.facts,
    tasks: (c.tasks || []).map((t) => ({ id: t.id, text: t.text, done: t.completed, ...(t.dueAt ? { dueAt: t.dueAt } : {}) })),
    ...(c.importantDates?.length ? { importantDates: c.importantDates } : {}),
    mementos: c.mementos.slice(0, MEMENTOS_MAX),
    ...(c.mementos.length > MEMENTOS_MAX ? { mementosNotShown: c.mementos.length - MEMENTOS_MAX } : {}),
  };
}

/**
 * The contact an agent named: by id, or by the words a person says (« Léa »,
 * « Léa Martin », « Martin »). Several are refused with their names, never the first taken.
 */
export function findContact(contacts: readonly Contact[], ref: string): Contact {
  const count = new Map<string, number>();
  for (const c of contacts) count.set(foldName(c.name), (count.get(foldName(c.name)) ?? 0) + 1);
  // Two people with the same name are told apart by their id in the refusal.
  const label = (c: Contact) => ((count.get(foldName(c.name)) ?? 0) > 1 ? `${c.name} (${c.id})` : c.name);
  return findNamed(contacts.map((c) => ({ item: c, id: c.id, names: [c.name], label: label(c) })), ref, { code: 'NO_CONTACT', noun: 'contact' });
}

/** A task of one contact: by id, or by its words (« rappeler », « les photos »). */
export function findTask(c: Contact, ref: string): ContactTask {
  return findNamed((c.tasks || []).map((t) => ({ item: t, id: t.id, names: [t.text], label: t.text })), ref, { code: 'NO_TASK', noun: 'task' });
}

/** The built-in relations and the words for them in the three languages of the app. */
const BUILT_IN_WORDS: Record<string, string[]> = {
  All: ['filter_all', 'tous', 'tout le monde', 'everyone', 'everybody', 'todos'],
  Friend: ['filter_friends', 'relation_friend', 'relation_friend_close', 'amie', 'amies', 'amiga', 'amigas'],
  Colleague: ['filter_colleagues', 'relation_colleague'],
  Family: ['filter_family', 'relation_family'],
  Mentor: ['filter_mentors', 'relation_mentor'],
};
const LANGS = ['en', 'fr', 'es'] as const;

/**
 * The relation a person names: its key, its label in any of the app's
 * languages, or the person's own label. `withAll` accepts « all » (the filter).
 */
export function findRelation(ctx: Pick<ArchipelAgentContext, 'relationKeys' | 'relationLabels'>, ref: string, withAll = false): string {
  const keys = [...(withAll ? ['All'] : []), ...ctx.relationKeys];
  return findNamed(keys.map((key) => {
    const words = BUILT_IN_WORDS[key] ?? [];
    const names = [key, ...words.flatMap((w) => (w.includes('_') ? LANGS.map((l) => getTranslation(l, w)) : [w])), ...(ctx.relationLabels[key] ? [ctx.relationLabels[key]!] : [])];
    return { item: key, id: key, names, label: ctx.relationLabels[key] ?? key };
  }), ref, { code: 'NO_RELATION', noun: 'relation' });
}

function requireLoaded(ctx: ArchipelAgentContext): void {
  if (ctx.load === 'reading') throw new Error('NOT_READY: L\'Archipel is still reading the contacts; try again in a moment');
  if (ctx.load !== 'ok') throw new Error('NOT_READY: the saved contacts could not be read; the person sees it in L\'Archipel');
}

/** A write shows the contact's page: never while the person is in the avatar studio. */
function requireWritable(ctx: ArchipelAgentContext): void {
  requireLoaded(ctx);
  if (ctx.editingAvatar) throw new Error("BUSY: the person is editing an avatar in L'Archipel; showing a contact now would drop it. Try again when they close the studio");
}

/** Saves through the contact page's save, shows the page, and waits for the render. */
async function save(ctx: ArchipelAgentContext, next: Contact): Promise<void> {
  written(() => ctx.updateContact(next));
  ctx.openContact(next);
  await ctx.rendered();
}

/** Runs a save; a storage that refuses it (full, blocked) is named, never a raw exception. */
function written<T>(run: () => T): T {
  try {
    return run();
  } catch (err) {
    throw new Error(`WRITE_FAILED: the contacts could not be saved (${err instanceof Error ? err.message : String(err)})`);
  }
}

export function archipelAgentHandlers(get: () => ArchipelAgentContext) {
  return {
    // agent-actions:begin
    contacts: (args: Record<string, unknown>) => {
      const ctx = get();
      requireLoaded(ctx);
      const found = searchContacts(ctx.contacts, str(args.query)).sort((a, b) => a.name.localeCompare(b.name));
      return { total: ctx.contacts.length, matching: found.length, contacts: found.slice(0, contactsLimit(args.limit)).map(contactLine) };
    },

    contact: (args: Record<string, unknown>) => {
      const ctx = get();
      requireLoaded(ctx);
      return contactCard(findContact(ctx.contacts, str(args.contactId)));
    },

    openContact: (args: Record<string, unknown>) => {
      const ctx = get();
      requireWritable(ctx);
      const c = findContact(ctx.contacts, str(args.contactId));
      ctx.openContact(c);
      return { contactId: c.id, shown: true };
    },

    addContact: async (args: Record<string, unknown>) => {
      const ctx = get();
      requireWritable(ctx);
      const name = str(args.name);
      if (!name) throw new Error('BAD_ARG: name is empty');
      // Each relation by its key or the word the person says (« famille », « amis »): an unknown one is refused with the names.
      const relations = Array.isArray(args.relations) ? args.relations.map(str).filter(Boolean).map((r) => findRelation(ctx, r)) : [];
      const id = written(() => ctx.addContact({
        name, relations: [...new Set(relations)], fact: str(args.fact),
        ...(str(args.email) ? { email: str(args.email) } : {}),
        ...(str(args.phone) ? { phone: str(args.phone) } : {}),
        ...(str(args.address) ? { address: str(args.address) } : {}),
      }));
      await get().rendered();
      const created = get().contacts.find((c) => c.id === id);
      if (!created) throw new Error('WRITE_FAILED: the contact was not saved; the reason is on the person\'s screen');
      get().openContact(created);
      return { contactId: id };
    },

    addFact: async (args: Record<string, unknown>) => {
      const ctx = get();
      requireWritable(ctx);
      const c = findContact(ctx.contacts, str(args.contactId));
      const fact = str(args.fact);
      if (!fact) throw new Error('BAD_ARG: fact is empty');
      const next = withFact(c, fact);
      if (next === c) return { contactId: c.id, already: true };
      await save(ctx, next);
      return { contactId: c.id, facts: next.facts.length };
    },

    recordContact: async (args: Record<string, unknown>) => {
      const ctx = get();
      requireWritable(ctx);
      const c = findContact(ctx.contacts, str(args.contactId));
      written(() => ctx.recordContact(c.id));
      await ctx.rendered();
      // Opened with the contact as saved: the copy read before would show the old warmth.
      const after = get().contacts.find((x) => x.id === c.id);
      if (!after) throw new Error("WRITE_FAILED: the contact was not saved; the reason is on the person's screen");
      get().openContact(after);
      return { contactId: c.id, warmth: after.warmth, status: after.status, lastContact: after.lastContact };
    },

    addTask: async (args: Record<string, unknown>) => {
      const ctx = get();
      requireWritable(ctx);
      const c = findContact(ctx.contacts, str(args.contactId));
      const text = str(args.text);
      if (!text) throw new Error('BAD_ARG: text is empty');
      const task: ContactTask = { id: Math.random().toString(36).slice(2, 11), text, completed: false };
      await save(ctx, withTask(c, task));
      return { contactId: c.id, taskId: task.id };
    },

    completeTask: async (args: Record<string, unknown>) => {
      const ctx = get();
      requireWritable(ctx);
      const c = findContact(ctx.contacts, str(args.contactId));
      // By its id or its words (« rappeler »): several are refused with their texts.
      const task = findTask(c, str(args.taskId));
      const done = args.done !== false;
      // The checkbox flips: only touch it when the state must change, so the call is idempotent.
      if (task.completed !== done) await save(ctx, withTaskToggled(c, task.id));
      return { contactId: c.id, taskId: task.id, text: task.text, done };
    },

    // ── What the person sees: the header, the filter chips, the bell and the settings, as her own clicks ──

    showView: (args: Record<string, unknown>) => {
      const ctx = get();
      requireWritable(ctx);
      const view = str(args.view) as AgentView;
      if (!AGENT_VIEWS.includes(view)) throw new Error(`BAD_ARG: view is one of ${AGENT_VIEWS.join(', ')}`);
      ctx.view.show(view);
      return { view };
    },

    filterRelation: (args: Record<string, unknown>) => {
      const ctx = get();
      requireWritable(ctx);
      const key = findRelation(ctx, str(args.relation) || 'All', true);
      ctx.view.setFilter(key);
      // The chips act on the dashboard and the two maps: from anywhere else the 2D map shows the filter.
      const shown = ['dashboard', 'archipelago', 'archipelago3d'].includes(ctx.view.mode) ? ctx.view.mode : 'archipelago';
      if (shown !== ctx.view.mode) ctx.view.show(shown as AgentView);
      return { relation: key, view: shown };
    },

    closeView: () => {
      const ctx = get();
      requireWritable(ctx);
      ctx.view.closeAll();
      return { closed: true };
    },

    showReminders: () => {
      const ctx = get();
      requireWritable(ctx);
      ctx.view.showReminders();
      return { shown: true };
    },

    setDisplay: (args: Record<string, unknown>) => {
      const ctx = get();
      requireWritable(ctx);
      const theme = str(args.theme), style = str(args.avatarStyle), lang = str(args.language);
      if (theme && !(AGENT_THEMES as readonly string[]).includes(theme)) throw new Error(`BAD_ARG: theme is one of ${AGENT_THEMES.join(', ')}`);
      if (style && !(AGENT_AVATAR_STYLES as readonly string[]).includes(style)) throw new Error(`BAD_ARG: avatarStyle is one of ${AGENT_AVATAR_STYLES.join(', ')}`);
      if (lang && !(AGENT_LANGUAGES as readonly string[]).includes(lang)) throw new Error(`BAD_ARG: language is one of ${AGENT_LANGUAGES.join(', ')}`);
      if (!theme && !style && !lang) throw new Error('BAD_ARG: say what changes: theme, avatarStyle or language');
      // The header's toggles flip: only pressed when the state must change, so the call is idempotent.
      written(() => {
        if (theme && theme !== ctx.view.theme) ctx.view.toggleTheme();
        if (style && style !== ctx.view.avatarStyle) ctx.view.toggleAvatarStyle();
        if (lang && lang !== ctx.view.language) ctx.view.setLanguage(lang as ArchipelView['language']);
      });
      return {
        theme: theme || ctx.view.theme, avatarStyle: style || ctx.view.avatarStyle, language: lang || ctx.view.language,
      };
    },
    // agent-actions:end
  };
}
