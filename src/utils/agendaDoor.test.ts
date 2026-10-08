import { describe, it, expect } from 'vitest';
import { AGENDA_DENIED, FOLLOW_UP_ALARM_MINUTES, agendaErrorKey, followUpEvent } from './agendaDoor';

describe('followUpEvent', () => {
  it('builds one appointment that rings at the follow-up time', () => {
    expect(followUpEvent(' Paul ', { text: ' Envoyer le devis ', dueAt: '2026-10-12T09:30' })).toEqual({
      title: 'Envoyer le devis — Paul',
      start: '2026-10-12T09:30',
      alarmMinutesBefore: FOLLOW_UP_ALARM_MINUTES,
      description: 'Archipel: Paul',
    });
  });

  it('files nothing for a task without a date', () => {
    expect(followUpEvent('Paul', { text: 'Rappeler' })).toBeNull();
    expect(followUpEvent('Paul', { text: 'Rappeler', dueAt: '' })).toBeNull();
  });

  it('keeps the title within the host cap', () => {
    const e = followUpEvent('Paul', { text: 'x'.repeat(500), dueAt: '2026-10-12T09:30' });
    expect(e?.title.length).toBe(200);
  });
});

describe('agendaErrorKey', () => {
  it('names each refusal apart', () => {
    expect(agendaErrorKey(new Error('No Mnemosyne host: "agenda.add" was invoked outside the shell'))).toEqual({ key: 'agenda_no_host' });
    expect(agendaErrorKey(new Error('EMPTY_PLAN'))).toEqual({ key: 'agenda_refused' });
    expect(agendaErrorKey(new Error(AGENDA_DENIED))).toEqual({ key: 'agenda_denied' });
  });

  it('keeps an unknown host code visible', () => {
    expect(agendaErrorKey(new Error('WRITE_FAILED'))).toEqual({ key: 'agenda_failed', detail: 'WRITE_FAILED' });
  });
});
