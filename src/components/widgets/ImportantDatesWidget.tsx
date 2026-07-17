import React, { useState } from 'react';
import { Contact, ImportantDate } from '../../types';
import { styles } from '../../styles';

interface ImportantDatesWidgetProps {
  selectedContact: Contact;
  handleUpdateContact: (c: Contact) => void;
  t: (key: string) => string;
  inputStyle: any;
  btnStyle: any;
}

export const ImportantDatesWidget: React.FC<ImportantDatesWidgetProps> = ({
  selectedContact,
  handleUpdateContact,
  t,
  inputStyle,
  btnStyle
}) => {
  const [newDate, setNewDate] = useState<ImportantDate>({ date: '', label: '' });

  const datesList = selectedContact.importantDates || [];

  const addDate = () => {
    if (!newDate.date || !newDate.label) return;
    const importantDates = [...datesList, newDate];
    handleUpdateContact({ ...selectedContact, importantDates });
    setNewDate({ date: '', label: '' });
  };

  const removeDate = (idx: number) => {
    const importantDates = datesList.filter((_, i) => i !== idx);
    handleUpdateContact({ ...selectedContact, importantDates });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {datesList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {datesList.map((d, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-deep)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>📅 {d.label}</span>
                <span style={{ fontSize: '11px', color: 'var(--accent-teal)' }}>{d.date}</span>
              </div>
              <button onClick={() => removeDate(idx)} style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '11px', outline: 'none' }} title="Delete">✕</button>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_dates')}</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8px' }}>
          <input 
            type="text" 
            placeholder={t('date_label_placeholder')} 
            value={newDate.label} 
            onChange={e => setNewDate({ ...newDate, label: e.target.value })} 
            style={inputStyle}
          />
          <input 
            type="date" 
            value={newDate.date} 
            onChange={e => setNewDate({ ...newDate, date: e.target.value })} 
            style={inputStyle}
          />
        </div>
        <button type="button" onClick={addDate} style={btnStyle}>{t('btn_add_date')}</button>
      </div>
    </div>
  );
};
