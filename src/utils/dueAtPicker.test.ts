import { describe, it, expect } from 'vitest';
import { addDays, isPast, nextQuarterHour, monthGrid, nextMonday, shiftTime, shortcutDay, splitDueAt, toDayKey, toDueAt } from './dueAtPicker';

describe('dueAtPicker', () => {
  it('rolls days over month and year ends', () => {
    expect(toDayKey(addDays(new Date(2026, 11, 31, 15), 1))).toBe('2027-01-01');
    expect(toDayKey(addDays(new Date(2026, 1, 28), 1))).toBe('2026-03-01');
  });

  it('next Monday is never today', () => {
    expect(toDayKey(nextMonday(new Date(2026, 8, 28)))).toBe('2026-10-05'); // a Monday → +7
    expect(toDayKey(nextMonday(new Date(2026, 8, 27)))).toBe('2026-09-28'); // Sunday → +1
    expect(toDayKey(nextMonday(new Date(2026, 8, 24)))).toBe('2026-09-28'); // Thursday
  });

  it('shortcuts land on the right day', () => {
    const now = new Date(2026, 8, 24, 22, 0);
    expect(shortcutDay('today', now)).toBe('2026-09-24');
    expect(shortcutDay('tomorrow', now)).toBe('2026-09-25');
    expect(shortcutDay('inAWeek', now)).toBe('2026-10-01');
  });

  it('draws a Monday-first month with no day of the neighbouring months', () => {
    const rows = monthGrid(2026, 8); // September 2026 starts on a Tuesday
    expect(rows[0]).toEqual([null, '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06']);
    const days = rows.flat().filter(Boolean);
    expect(days).toHaveLength(30);
    expect(days.at(-1)).toBe('2026-09-30');
    expect(rows.every(r => r.length === 7)).toBe(true);
  });

  it('shifts time and wraps around midnight', () => {
    expect(shiftTime('09:00', 15)).toBe('09:15');
    expect(shiftTime('23:50', 15)).toBe('00:05');
    expect(shiftTime('00:05', -15)).toBe('23:50');
  });

  it('round-trips the stored form and refuses anything else', () => {
    expect(splitDueAt(toDueAt('2026-10-12', '09:30'))).toEqual({ day: '2026-10-12', time: '09:30' });
    expect(splitDueAt('')).toBeNull();
    expect(splitDueAt('2026-10-12')).toBeNull();
  });

  it('knows a past moment', () => {
    const now = new Date(2026, 8, 24, 12, 0);
    expect(isPast('2026-09-24T09:00', now)).toBe(true);
    expect(isPast('2026-09-24T18:00', now)).toBe(false);
    expect(isPast('garbage', now)).toBe(false);
  });

  it('next quarter hour is strictly after now', () => {
    expect(nextQuarterHour(new Date(2026, 8, 24, 16, 59))).toBe('17:00');
    expect(nextQuarterHour(new Date(2026, 8, 24, 17, 0))).toBe('17:15');
    expect(nextQuarterHour(new Date(2026, 8, 24, 9, 44))).toBe('09:45');
    expect(nextQuarterHour(new Date(2026, 8, 24, 23, 50))).toBe('00:00');
  });
});
