import React, { useState } from 'react';
import { Contact, Gift } from '../../types';
import { styles } from '../../styles';

interface GiftsWidgetProps {
  selectedContact: Contact;
  handleUpdateContact: (c: Contact) => void;
  t: (key: string) => string;
  inputStyle: any;
  btnStyle: any;
}

export const GiftsWidget: React.FC<GiftsWidgetProps> = ({
  selectedContact,
  handleUpdateContact,
  t,
  inputStyle,
  btnStyle
}) => {
  const [newGift, setNewGift] = useState({ idea: '', status: 'idea' as 'idea' | 'given' });

  const giftsList = selectedContact.gifts || [];

  const addGift = () => {
    if (!newGift.idea) return;
    const newEntry: Gift = {
      id: Math.random().toString(36).substr(2, 9),
      idea: newGift.idea,
      status: newGift.status
    };
    const gifts = [...giftsList, newEntry];
    handleUpdateContact({ ...selectedContact, gifts });
    setNewGift({ idea: '', status: 'idea' });
  };

  const toggleGiftStatus = (giftId: string) => {
    const gifts = giftsList.map(g => {
      if (g.id === giftId) {
        return {
          ...g,
          status: g.status === 'idea' ? 'given' : 'idea' as 'idea' | 'given',
          date: g.status === 'idea' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return g;
    });
    handleUpdateContact({ ...selectedContact, gifts });
  };

  const removeGift = (giftId: string) => {
    const gifts = giftsList.filter(g => g.id !== giftId);
    handleUpdateContact({ ...selectedContact, gifts });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {giftsList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {giftsList.map((g) => (
            <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-deep)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <input 
                  type="checkbox" 
                  checked={g.status === 'given'} 
                  onChange={() => toggleGiftStatus(g.id)}
                  style={{ cursor: 'pointer' }}
                  title={g.status === 'given' ? t('gift_given_title') : t('gift_mark_given_title')}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-primary)', textDecoration: g.status === 'given' ? 'line-through' : 'none', opacity: g.status === 'given' ? 0.6 : 1 }}>
                    🎁 {g.idea}
                  </span>
                  {g.status === 'given' && g.date && (
                    <span style={{ fontSize: '10px', color: 'var(--accent-emerald)' }}>
                      {t('gift_offered_on')} {g.date}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => removeGift(g.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '11px', outline: 'none' }} title="Delete">✕</button>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_gifts')}</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '8px' }}>
          <input 
            type="text" 
            placeholder={t('gift_placeholder')} 
            value={newGift.idea} 
            onChange={e => setNewGift({ ...newGift, idea: e.target.value })} 
            style={inputStyle}
          />
          <select 
            value={newGift.status} 
            onChange={e => setNewGift({ ...newGift, status: e.target.value as any })} 
            style={inputStyle}
          >
            <option value="idea" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>💡 {t('gift_status_idea')}</option>
            <option value="given" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>🎁 {t('gift_status_given')}</option>
          </select>
        </div>
        <button type="button" onClick={addGift} style={btnStyle}>{t('btn_add_gift')}</button>
      </div>
    </div>
  );
};
