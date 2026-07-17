import { useMemo, useState } from 'react';
import { Contact, CustomCategory } from '../types';
import { renderContactAvatar } from './AvatarStudioComponent';
import { styles } from '../styles';

interface GlobalTimelineProps {
  contacts: Contact[];
  customCategories: CustomCategory[];
  onSelectContact: (c: Contact) => void;
  globalAvatarStyle?: 'human' | 'magical';
  t: (key: string) => string;
}

interface TimelineEvent {
  id: string;
  type: 'encounter' | 'evolution' | 'journal';
  date: string;
  contact: Contact;
  text: string;
}

export function GlobalTimeline({
  contacts,
  customCategories,
  onSelectContact,
  globalAvatarStyle = 'human',
  t
}: GlobalTimelineProps) {
  // Aggregate all events
  const events = useMemo<TimelineEvent[]>(() => {
    const list: TimelineEvent[] = [];

    contacts.forEach(contact => {
      // Encounters / Mementos
      if (contact.mementos) {
        contact.mementos.forEach((m, idx) => {
          list.push({
            id: `memento-${contact.id}-${idx}`,
            type: 'encounter',
            date: m.date,
            contact,
            text: m.note
          });
        });
      }

      // Category changes / History
      if (contact.categoryHistory) {
        contact.categoryHistory.forEach((h, idx) => {
          const custom = customCategories.find(c => c.key === h.category);
          const catLabel = custom ? custom.label : h.category;
          const text = h.action === 'added' 
            ? `➕ Rattaché à la catégorie ${catLabel}`
            : `❌ Détaché de la catégorie ${catLabel}`;
          list.push({
            id: `history-${contact.id}-${idx}`,
            type: 'evolution',
            date: h.date,
            contact,
            text
          });
        });
      }

      // Journal Entry
      if (contact.personalJournal) {
        contact.personalJournal.forEach((j, idx) => {
          list.push({
            id: `journal-${contact.id}-${idx}`,
            type: 'journal',
            date: j.date,
            contact,
            text: `📓 Note personnelle : ${j.text}`
          });
        });
      }
    });

    // Sort descending by date
    list.sort((a, b) => b.date.localeCompare(a.date));
    return list;
  }, [contacts, customCategories]);

  const [timeFilter, setTimeFilter] = useState<'all' | 'day' | 'week' | 'month' | 'year'>('all');

  const filteredEvents = useMemo(() => {
    if (timeFilter === 'all') return events;
    const now = new Date();
    const parseDate = (dStr: string) => {
      const d = new Date(dStr);
      return isNaN(d.getTime()) ? null : d;
    };

    return events.filter(e => {
      const eDate = parseDate(e.date);
      if (!eDate) return false;
      const diffTime = now.getTime() - eDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (timeFilter === 'day') {
        return diffDays >= 0 && diffDays <= 1;
      }
      if (timeFilter === 'week') {
        return diffDays >= 0 && diffDays <= 7;
      }
      if (timeFilter === 'month') {
        return diffDays >= 0 && diffDays <= 30;
      }
      if (timeFilter === 'year') {
        return diffDays >= 0 && diffDays <= 365;
      }
      return true;
    });
  }, [events, timeFilter]);

  const getEventBadge = (type: 'encounter' | 'evolution' | 'journal') => {
    switch (type) {
      case 'encounter':
        return { label: 'Rencontre', icon: '👋', color: '#10b981' };
      case 'evolution':
        return { label: 'Évolution', icon: '🧭', color: '#0ea5e9' };
      case 'journal':
        return { label: 'Journal', icon: '📓', color: '#f59e0b' };
    }
  };

  return (
    <div style={{ ...styles.settingsView, padding: '24px' }} className="glass">
      <h2 style={styles.settingsViewTitle}>📅 Fil Temporel Global</h2>
      <p style={{ ...styles.sectionDesc, marginBottom: '20px' }}>
        Toutes les interactions, notes et changements de catégories triés par ordre chronologique.
      </p>

      {/* Time filters HUD */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: t('time_filter_all') || 'Tout' },
          { key: 'day', label: t('time_filter_day') || "Aujourd'hui" },
          { key: 'week', label: t('time_filter_week') || 'Cette Semaine' },
          { key: 'month', label: t('time_filter_month') || 'Ce Mois' },
          { key: 'year', label: t('time_filter_year') || 'Cette Année' }
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => setTimeFilter(btn.key as any)}
            style={{
              ...styles.controlBtn,
              backgroundColor: timeFilter === btn.key ? 'var(--bg-surface)' : 'transparent',
              borderColor: timeFilter === btn.key ? 'var(--accent-teal)' : 'var(--border-subtle)',
              color: 'var(--text-primary)',
              fontWeight: timeFilter === btn.key ? 700 : 500,
              borderRadius: '20px',
              padding: '6px 14px'
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {filteredEvents.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          {filteredEvents.map((e) => {
            const badge = getEventBadge(e.type);
            return (
              <div 
                key={e.id}
                onClick={() => onSelectContact(e.contact)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.015)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                className="timeline-card"
              >
                {/* Avatar with micro-badge */}
                <div style={{ position: 'relative', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {renderContactAvatar(e.contact, 42, globalAvatarStyle)}
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      backgroundColor: badge.color,
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      border: '1.5px solid #101216'
                    }}
                    title={badge.label}
                  >
                    {badge.icon}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{e.contact.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{e.date}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>{e.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyContactsBox}>
          <span style={{ fontSize: '48px' }}>📭</span>
          <h3>Aucun événement enregistré</h3>
          <p>Ajoutez des notes, mementos ou changez les catégories pour alimenter le fil temporel.</p>
        </div>
      )}
    </div>
  );
}
