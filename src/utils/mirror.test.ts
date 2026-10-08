import { describe, it, expect } from 'vitest';
import {
  CONTACTS_KEY, MIRRORED_KEYS, bootDecision, localIsBlank, readContactsRaw, restoreLocal,
  snapshotHasContacts, snapshotLocal, statusFromError,
} from './mirror';

/** A Storage double: a Map behind the four methods the module calls. */
function fakeStorage(init: Record<string, string> = {}, opts: { throwOnGet?: boolean } = {}): Storage {
  const map = new Map(Object.entries(init));
  return {
    getItem: (k: string) => {
      if (opts.throwOnGet) throw new Error('denied');
      return map.has(k) ? (map.get(k) as string) : null;
    },
    setItem: (k: string, v: string) => { map.set(k, v); },
    removeItem: (k: string) => { map.delete(k); },
    clear: () => map.clear(),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    get length() { return map.size; },
  };
}

const TWO = JSON.stringify([{ id: 'a' }, { id: 'b' }]);

describe('readContactsRaw', () => {
  it('tells empty, list and unreadable apart', () => {
    expect(readContactsRaw(null)).toEqual({ kind: 'empty' });
    expect(readContactsRaw('')).toEqual({ kind: 'empty' });
    expect(readContactsRaw('[]')).toEqual({ kind: 'empty' });
    expect(readContactsRaw(TWO)).toEqual({ kind: 'list', count: 2 });
    expect(readContactsRaw('{"not":"a list"}')).toEqual({ kind: 'unreadable' });
    expect(readContactsRaw('[{"id":')).toEqual({ kind: 'unreadable' });
  });
});

describe('localIsBlank', () => {
  it('is blank with no key or an empty list', () => {
    expect(localIsBlank(fakeStorage())).toBe(true);
    expect(localIsBlank(fakeStorage({ [CONTACTS_KEY]: '[]' }))).toBe(true);
  });

  it('is not blank with contacts', () => {
    expect(localIsBlank(fakeStorage({ [CONTACTS_KEY]: TWO }))).toBe(false);
  });

  it('is NOT blank when the list is unreadable, so the mirror never overwrites it', () => {
    expect(localIsBlank(fakeStorage({ [CONTACTS_KEY]: 'garbage' }))).toBe(false);
  });

  it('is NOT blank when storage cannot be read (unknown is not empty)', () => {
    expect(localIsBlank(fakeStorage({}, { throwOnGet: true }))).toBe(false);
  });
});

describe('bootDecision', () => {
  it('restores only a blank origin from a mirror that holds contacts', () => {
    expect(bootDecision(true, { [CONTACTS_KEY]: TWO })).toBe('restore');
  });

  it('keeps a local list even when the mirror holds more (the mirror can lag)', () => {
    expect(bootDecision(false, { [CONTACTS_KEY]: TWO })).toBe('keep');
  });

  it('keeps when the mirror is absent, empty or unreadable', () => {
    expect(bootDecision(true, null)).toBe('keep');
    expect(bootDecision(true, undefined)).toBe('keep');
    expect(bootDecision(true, { [CONTACTS_KEY]: '[]' })).toBe('keep');
    expect(bootDecision(true, { [CONTACTS_KEY]: 'garbage' })).toBe('keep');
    expect(bootDecision(true, { crm_theme: 'dark' })).toBe('keep');
  });
});

describe('snapshotLocal / restoreLocal', () => {
  it('snapshots only the mirrored keys that exist', () => {
    const storage = fakeStorage({
      [CONTACTS_KEY]: TWO,
      crm_theme: 'light',
      'archipel_synced_v1:APP-x': '{}',
      crm_password: 'should never travel',
    });
    expect(snapshotLocal(storage)).toEqual({ [CONTACTS_KEY]: TWO, crm_theme: 'light' });
  });

  it('round-trips every mirrored key onto a blank origin', () => {
    const full: Record<string, string> = {};
    for (const k of MIRRORED_KEYS) full[k] = k === CONTACTS_KEY ? TWO : `v-${k}`;
    const target = fakeStorage();
    expect(restoreLocal(snapshotLocal(fakeStorage(full)), target).sort()).toEqual([...MIRRORED_KEYS].sort());
    expect(snapshotLocal(target)).toEqual(full);
  });

  it('never removes a key the snapshot does not carry, and ignores foreign keys', () => {
    const target = fakeStorage({ crm_theme: 'light' });
    const restored = restoreLocal({ [CONTACTS_KEY]: TWO, intruder: 'x' }, target);
    expect(restored).toEqual([CONTACTS_KEY]);
    expect(target.getItem('crm_theme')).toBe('light');
    expect(target.getItem('intruder')).toBeNull();
  });

  it('reports the snapshot as holding contacts only when it does', () => {
    expect(snapshotHasContacts({ [CONTACTS_KEY]: TWO })).toBe(true);
    expect(snapshotHasContacts({ [CONTACTS_KEY]: '[]' })).toBe(false);
    expect(snapshotHasContacts(null)).toBe(false);
  });
});

describe('statusFromError', () => {
  it('names the host size refusal, and keeps any other message', () => {
    expect(statusFromError(new Error('TOO_LARGE'))).toEqual({ kind: 'tooLarge' });
    expect(statusFromError(new Error('WRITE_FAILED'))).toEqual({ kind: 'failed', error: 'WRITE_FAILED' });
    expect(statusFromError('boom')).toEqual({ kind: 'failed', error: 'boom' });
  });
});
