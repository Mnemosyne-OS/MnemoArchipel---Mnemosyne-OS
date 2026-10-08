import React, { useMemo, useState } from 'react';
import {
  DEFAULT_HOUR, QUICK_TIMES, isPast, monthGrid, nextQuarterHour, shiftTime, shortcutDay, splitDueAt,
  toDayKey, toDueAt, type Shortcut,
} from '../../utils/dueAtPicker';

interface DueAtPickerProps {
  /** `YYYY-MM-DDTHH:mm`, or '' for no date. */
  value: string;
  onChange: (dueAt: string) => void;
  onClose: () => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const SHORTCUTS: Shortcut[] = ['today', 'tomorrow', 'nextMonday', 'inAWeek'];

/** A reference Monday, used only to name the weekday columns. */
const A_MONDAY = new Date(2026, 0, 5);

const chip = (active: boolean): React.CSSProperties => ({
  background: active ? 'var(--accent-teal)' : 'var(--bg-deep)',
  color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
  border: `1px solid ${active ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
  borderRadius: '999px',
  padding: '4px 10px',
  fontSize: '11px',
  cursor: 'pointer',
});

/**
 * Taps only: shortcuts, a month grid, a few times, and ± 15 min.
 * Inline, never a floating popover: the sidebar is narrow and the cartridge
 * is an iframe, so anything that floats is cut at its edge.
 */
export const DueAtPicker: React.FC<DueAtPickerProps> = ({ value, onChange, onClose, t }) => {
  const now = new Date();
  const current = splitDueAt(value);
  const day = current?.day ?? '';
  const time = current?.time ?? `${String(DEFAULT_HOUR).padStart(2, '0')}:00`;
  const locale = t('date_locale');

  const [view, setView] = useState(() => {
    const base = day ? new Date(`${day}T00:00`) : now;
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const grid = useMemo(() => monthGrid(view.year, view.month), [view]);
  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, i) =>
    new Date(A_MONDAY.getFullYear(), A_MONDAY.getMonth(), A_MONDAY.getDate() + i)
      .toLocaleDateString(locale, { weekday: 'narrow' })), [locale]);
  const title = new Date(view.year, view.month, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const today = toDayKey(now);

  // Tapping today with a time already gone (09:00 at 17:00) would pick a
  // moment that never rings: it moves to the next quarter hour instead.
  const pickDay = (d: string) => {
    const at = toDueAt(d, time);
    onChange(isPast(at, now) ? toDueAt(d, nextQuarterHour(now)) : at);
  };
  const pickTime = (tm: string) => onChange(toDueAt(day || today, tm));
  const moveMonth = (delta: number) => setView(v => {
    const d = new Date(v.year, v.month + delta, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const navBtn: React.CSSProperties = { background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', padding: '2px 8px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-deep)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {SHORTCUTS.map(s => {
          const d = shortcutDay(s, now);
          return <button key={s} type="button" onClick={() => pickDay(d)} style={chip(day === d)}>{t(`due_${s}`)}</button>;
        })}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <button type="button" onClick={() => moveMonth(-1)} style={navBtn} aria-label={t('due_prev_month')}>‹</button>
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{title}</span>
          <button type="button" onClick={() => moveMonth(1)} style={navBtn} aria-label={t('due_next_month')}>›</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
          {weekdays.map((w, i) => <span key={`w${i}`} style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{w}</span>)}
          {grid.flat().map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const selected = d === day;
            const past = d < today;
            return (
              <button
                key={d}
                type="button"
                onClick={() => pickDay(d)}
                style={{
                  aspectRatio: '1', border: d === today && !selected ? '1px solid var(--accent-teal)' : '1px solid transparent',
                  borderRadius: '50%', background: selected ? 'var(--accent-teal)' : 'transparent',
                  color: selected ? 'var(--text-on-accent)' : past ? 'var(--text-muted)' : 'var(--text-primary)',
                  opacity: past && !selected ? 0.5 : 1, fontSize: '11px', cursor: 'pointer', padding: 0,
                }}
              >
                {Number(d.slice(8))}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
        {QUICK_TIMES.map(tm => (
          <button key={tm} type="button" onClick={() => pickTime(tm)} style={chip(!!day && time === tm)}>{tm}</button>
        ))}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginLeft: 'auto' }}>
          <button type="button" onClick={() => pickTime(shiftTime(time, -15))} style={navBtn} aria-label={t('due_earlier')}>−</button>
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', minWidth: '40px', textAlign: 'center' }}>{time}</span>
          <button type="button" onClick={() => pickTime(shiftTime(time, 15))} style={navBtn} aria-label={t('due_later')}>+</button>
        </span>
      </div>

      {value && isPast(value, now) && (
        <span role="alert" style={{ fontSize: '11px', color: 'var(--accent-amber)' }}>{t('due_past')}</span>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" onClick={() => onChange('')} style={{ ...navBtn, fontSize: '11px' }} disabled={!value}>{t('due_clear')}</button>
        <button type="button" onClick={onClose} style={chip(true)}>{t('due_done')}</button>
      </div>
    </div>
  );
};
