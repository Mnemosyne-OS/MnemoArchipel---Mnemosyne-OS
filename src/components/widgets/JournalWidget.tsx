import React, { useState } from 'react';
import { Contact, JournalEntry } from '../../types';
import { styles } from '../../styles';

interface JournalWidgetProps {
  selectedContact: Contact;
  handleUpdateContact: (c: Contact) => void;
  t: (key: string) => string;
  btnStyle: any;
}

export const JournalWidget: React.FC<JournalWidgetProps> = ({
  selectedContact,
  handleUpdateContact,
  t,
  btnStyle
}) => {
  const [newJournal, setNewJournal] = useState('');

  const journalList = selectedContact.personalJournal || [];

  const addJournal = () => {
    if (!newJournal.trim()) return;
    const newEntry: JournalEntry = {
      date: new Date().toISOString().split('T')[0],
      text: newJournal
    };
    const personalJournal = [newEntry, ...journalList];
    handleUpdateContact({ ...selectedContact, personalJournal });
    setNewJournal('');
  };

  const removeJournal = (idx: number) => {
    const personalJournal = journalList.filter((_, i) => i !== idx);
    handleUpdateContact({ ...selectedContact, personalJournal });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {journalList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
          {journalList.map((entry, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-deep)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--accent-teal)', fontWeight: 600 }}>{entry.date}</span>
                <button onClick={() => removeJournal(idx)} style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '10px', outline: 'none' }}>✕</button>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                {entry.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_journal')}</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
        <textarea 
          placeholder={t('journal_placeholder')} 
          value={newJournal} 
          onChange={e => setNewJournal(e.target.value)} 
          rows={2}
          style={{
            width: '100%',
            boxSizing: 'border-box' as const,
            backgroundColor: 'var(--bg-deep)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            padding: '6px 10px',
            fontSize: '12px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
        <button type="button" onClick={addJournal} style={btnStyle}>{t('btn_add_journal')}</button>
      </div>
    </div>
  );
};
