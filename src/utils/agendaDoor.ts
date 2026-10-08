/**
 * agendaDoor.ts — a contact follow-up becomes an appointment in the host
 * calendar, so it rings on the canvas even with the Archipel closed.
 *
 * A task kept only in this cartridge never rings: the alarm engine lives in
 * the host (doc 124 §3.3). The host door `agenda.add` (permission
 * `agenda:write`) is add-only: once filed, the appointment belongs to the
 * human's calendar, and ticking or deleting the task here does not touch it.
 */
import type { ContactTask } from '../types';

/** The reminder rings at the follow-up time itself. */
export const FOLLOW_UP_ALARM_MINUTES = 0;

/** What `agenda.add` receives for one follow-up. Pure, so it is tested alone. */
export function followUpEvent(contactName: string, task: Pick<ContactTask, 'text'> & { dueAt?: string }) {
  if (!task.dueAt) return null;
  const title = `${task.text.trim()} — ${contactName.trim()}`.slice(0, 200);
  return {
    title,
    // Local wall clock, no offset: the host reads it as this machine's time.
    start: task.dueAt,
    alarmMinutesBefore: FOLLOW_UP_ALARM_MINUTES,
    description: `Archipel: ${contactName.trim()}`,
  };
}

/** Thrown when the host answers that `agenda:write` is not granted. */
export const AGENDA_DENIED = 'AGENDA_DENIED';

/**
 * Why a filing failed, as a key the screen can translate. The host's own
 * code is kept when it is one we do not know, so nothing is hidden.
 */
export function agendaErrorKey(err: unknown): { key: string; detail?: string } {
  const message = err instanceof Error ? err.message : String(err);
  if (message.startsWith('No Mnemosyne host')) return { key: 'agenda_no_host' };
  if (message.includes('EMPTY_PLAN')) return { key: 'agenda_refused' };
  if (message === AGENDA_DENIED) return { key: 'agenda_denied' };
  return { key: 'agenda_failed', detail: message };
}
