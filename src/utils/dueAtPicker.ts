/**
 * dueAtPicker.ts — the arithmetic behind the follow-up date picker.
 *
 * The native `datetime-local` field did not fit the sidebar (the year was cut
 * off) and asks for typing. The picker is taps only: a few shortcuts, a month
 * grid, a few times. Everything here is pure and works in LOCAL time, the
 * same wall clock the host Agenda reads a `YYYY-MM-DDTHH:mm` string in.
 */

/** Hour a shortcut lands on when no time was chosen yet. */
export const DEFAULT_HOUR = 9;

/** The times offered as one tap. */
export const QUICK_TIMES = ['09:00', '12:00', '14:00', '18:00'] as const;

const pad = (n: number) => String(n).padStart(2, '0');

/** `YYYY-MM-DD` of a local date. */
export function toDayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Joins a day and a time into the stored form. */
export function toDueAt(day: string, time: string): string {
  return `${day}T${time}`;
}

/** Splits the stored form; null when it is not one. */
export function splitDueAt(dueAt: string | undefined | null): { day: string; time: string } | null {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/.exec(dueAt ?? '');
  return m ? { day: m[1], time: m[2] } : null;
}

/** Local midnight of `now` plus `days`. Month and year rollover included. */
export function addDays(now: Date, days: number): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
}

/** Next Monday, never today: « lundi prochain » said on a Monday means in 7 days. */
export function nextMonday(now: Date): Date {
  const dow = now.getDay(); // 0 = Sunday
  const ahead = ((8 - dow) % 7) || 7;
  return addDays(now, ahead);
}

export type Shortcut = 'today' | 'tomorrow' | 'nextMonday' | 'inAWeek';

export function shortcutDay(kind: Shortcut, now: Date): string {
  switch (kind) {
    case 'today': return toDayKey(now);
    case 'tomorrow': return toDayKey(addDays(now, 1));
    case 'nextMonday': return toDayKey(nextMonday(now));
    case 'inAWeek': return toDayKey(addDays(now, 7));
  }
}

/**
 * The month grid, Monday first, as rows of 7 cells. A cell outside the month
 * is `null` (drawn empty), so the grid never shows a day that belongs to the
 * neighbouring month under this month's title.
 */
export function monthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Monday = 0
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) cells.push(toDayKey(new Date(year, month, d)));
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/** Moves a `HH:mm` by `minutes`, wrapping around midnight. */
export function shiftTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/**
 * The next quarter hour strictly after `now`, as `HH:mm`. Past 23:45 it wraps
 * to 00:00: the caller only uses it for today, where that is already gone and
 * the past warning says so.
 */
export function nextQuarterHour(now: Date): string {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const next = (Math.floor(minutes / 15) + 1) * 15;
  return next >= 1440 ? '00:00' : `${pad(Math.floor(next / 60))}:${pad(next % 60)}`;
}

/** True when the moment is already behind `now`: a reminder there never rings. */
export function isPast(dueAt: string, now: Date): boolean {
  const t = new Date(dueAt).getTime();
  return Number.isFinite(t) && t < now.getTime();
}
