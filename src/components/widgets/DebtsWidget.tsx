import React, { useState } from 'react';
import { Contact, Debt } from '../../types';
import { styles } from '../../styles';

interface DebtsWidgetProps {
  selectedContact: Contact;
  handleUpdateContact: (c: Contact) => void;
  t: (key: string) => string;
  inputStyle: any;
  btnStyle: any;
}

export const DebtsWidget: React.FC<DebtsWidgetProps> = ({
  selectedContact,
  handleUpdateContact,
  t,
  inputStyle,
  btnStyle
}) => {
  const [newDebt, setNewDebt] = useState({ amount: '', description: '', type: 'owe' as 'owe' | 'owed' });

  const debtsList = selectedContact.debts || [];

  const addDebt = () => {
    const parsedAmount = parseFloat(newDebt.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !newDebt.description) return;
    const newEntry: Debt = {
      id: Math.random().toString(36).substr(2, 9),
      amount: parsedAmount,
      description: newDebt.description,
      type: newDebt.type,
      settled: false,
      date: new Date().toISOString().split('T')[0]
    };
    const debts = [...debtsList, newEntry];
    handleUpdateContact({ ...selectedContact, debts });
    setNewDebt({ amount: '', description: '', type: 'owe' });
  };

  const toggleDebtSettled = (debtId: string) => {
    const debts = debtsList.map(d => d.id === debtId ? { ...d, settled: !d.settled } : d);
    handleUpdateContact({ ...selectedContact, debts });
  };

  const removeDebt = (debtId: string) => {
    const debts = debtsList.filter(d => d.id !== debtId);
    handleUpdateContact({ ...selectedContact, debts });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {debtsList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {debtsList.map((d) => {
            const color = d.settled ? 'var(--text-muted)' : d.type === 'owe' ? 'var(--accent-rose)' : 'var(--accent-emerald)';
            const label = d.type === 'owe' ? t('debt_owe_label') : t('debt_owed_label');
            return (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-deep)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', opacity: d.settled ? 0.5 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <input 
                    type="checkbox" 
                    checked={d.settled} 
                    onChange={() => toggleDebtSettled(d.id)}
                    style={{ cursor: 'pointer' }}
                    title={d.settled ? t('debt_settled') : t('debt_mark_settled')}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 'bold', color, textDecoration: d.settled ? 'line-through' : 'none' }}>
                      {d.amount} € — {label}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {d.description} ({d.date})
                    </span>
                  </div>
                </div>
                <button onClick={() => removeDebt(d.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '11px', outline: 'none' }} title="Delete">✕</button>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_debts')}</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '8px' }}>
          <input 
            type="number" 
            placeholder={t('debt_amount_placeholder')} 
            value={newDebt.amount} 
            onChange={e => setNewDebt({ ...newDebt, amount: e.target.value })} 
            style={inputStyle}
          />
          <select 
            value={newDebt.type} 
            onChange={e => setNewDebt({ ...newDebt, type: e.target.value as any })} 
            style={inputStyle}
          >
            <option value="owe" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>💸 {t('debt_type_owe')}</option>
            <option value="owed" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>💰 {t('debt_type_owed')}</option>
          </select>
        </div>
        <input 
          type="text" 
          placeholder={t('debt_desc_placeholder')} 
          value={newDebt.description} 
          onChange={e => setNewDebt({ ...newDebt, description: e.target.value })} 
          style={inputStyle}
        />
        <button type="button" onClick={addDebt} style={btnStyle}>{t('btn_add_debt')}</button>
      </div>
    </div>
  );
};
