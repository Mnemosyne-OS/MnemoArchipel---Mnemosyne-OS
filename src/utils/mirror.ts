/**
 * mirror.ts — the Archipel's second copy, kept where the origin cannot reach it.
 *
 * Every contact lives in localStorage, which belongs to the iframe's ORIGIN.
 * That origin moves (dev server → packaged `mnemo-plugin://`, a port that
 * drifts), and each move hands the cartridge an empty store: the CRM opens
 * blank and reads as wiped. Nothing was wiped, it is just unreachable.
 *
 * So the host keeps a mirror (doc 73). localStorage stays the primary, it is
 * synchronous and always there. The mirror only makes its loss survivable.
 *
 * Only what cannot be recomputed is mirrored. The vault-sync map
 * (`archipel_synced_v1:*`) is left out on purpose: losing it only re-anchors
 * contacts, and the host dedups identical content anyway.
 */

/** The keys worth surviving an origin change. */
export const MIRRORED_KEYS = [
  'archipel_contacts',
  'archipel_user_profile',
  'archipel_notif_settings',
  'crm_custom_categories',
  'crm_custom_widget_defs',
  'crm_theme',
  'crm_avatar_style',
  'crm_language',
] as const;

export const CONTACTS_KEY = 'archipel_contacts';

/** Set right before the reload that follows a restore, read once after it. */
export const RESTORED_FLAG = 'archipel_restored_at';

export type MirrorSnapshot = Record<string, string>;

/**
 * What the contacts key holds. Three answers, never two:
 * an empty list and an unreadable one lead to different next steps.
 */
export type ContactsRead =
  | { kind: 'empty' }
  | { kind: 'list'; count: number }
  | { kind: 'unreadable' };

export function readContactsRaw(raw: string | null | undefined): ContactsRead {
  if (raw === null || raw === undefined || raw === '') return { kind: 'empty' };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { kind: 'unreadable' };
    return parsed.length === 0 ? { kind: 'empty' } : { kind: 'list', count: parsed.length };
  } catch {
    return { kind: 'unreadable' };
  }
}

/** Everything mirrorable that currently exists locally. */
export function snapshotLocal(storage: Storage = localStorage): MirrorSnapshot {
  const out: MirrorSnapshot = {};
  for (const key of MIRRORED_KEYS) {
    try {
      const raw = storage.getItem(key);
      if (raw !== null) out[key] = raw;
    } catch (err) {
      console.warn(`[MIRROR] could not read ${key}:`, err);
    }
  }
  return out;
}

/** Does this snapshot carry at least one contact? */
export function snapshotHasContacts(snap: MirrorSnapshot | null | undefined): boolean {
  return readContactsRaw(snap?.[CONTACTS_KEY]).kind === 'list';
}

/**
 * True when THIS origin holds no contact, the signature of a cartridge that
 * just booted somewhere new. An UNREADABLE list is not blank: overwriting it
 * with the mirror would erase data someone may still want to recover.
 */
export function localIsBlank(storage: Storage = localStorage): boolean {
  let raw: string | null = null;
  try { raw = storage.getItem(CONTACTS_KEY); }
  catch (err) { console.warn('[MIRROR] could not read contacts:', err); return false; }
  return readContactsRaw(raw).kind === 'empty';
}

/**
 * Writes a mirror snapshot into this origin's localStorage and returns the
 * keys actually restored. Never removes a key the snapshot does not carry.
 */
export function restoreLocal(snap: MirrorSnapshot, storage: Storage = localStorage): string[] {
  const restored: string[] = [];
  for (const key of MIRRORED_KEYS) {
    const value = snap[key];
    if (typeof value !== 'string') continue;
    try {
      storage.setItem(key, value);
      restored.push(key);
    } catch (err) {
      console.error(`[MIRROR] could not restore ${key}:`, err);
    }
  }
  return restored;
}

/**
 * The decision taken at boot, once the host has answered.
 * `restore` only when the local copy is blank AND the mirror has contacts:
 * a local list always wins, because the mirror can be a moment behind.
 */
export function bootDecision(localBlank: boolean, snap: MirrorSnapshot | null | undefined): 'restore' | 'keep' {
  return localBlank && snapshotHasContacts(snap) ? 'restore' : 'keep';
}

/** What the screen says about the second copy. */
export type MirrorStatus =
  | { kind: 'pending' }          // the host has not answered yet
  | { kind: 'offline' }          // no host: the cartridge runs outside Mnemosyne
  | { kind: 'saved'; at: string }
  | { kind: 'tooLarge' }         // the host refused: past its 256 KB cap
  | { kind: 'failed'; error: string };

export function statusFromError(err: unknown): MirrorStatus {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes('TOO_LARGE') ? { kind: 'tooLarge' } : { kind: 'failed', error: message };
}
