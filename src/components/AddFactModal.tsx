import { useState } from 'react';
import { styles } from '../styles';

interface AddFactModalProps {
  onClose: () => void;
  contactName: string;
  onAddFact: (fact: string) => void;
  t: (key: string, replacements?: any) => string;
}

export function AddFactModal({
  onClose,
  contactName,
  onAddFact,
  t
}: AddFactModalProps) {
  const [factInput, setFactInput] = useState('');

  const handleAdd = () => {
    if (!factInput.trim()) return;
    onAddFact(factInput.trim());
    onClose();
  };

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent} className="glass">
        <div style={styles.modalHeader}>
          <h2>📌 {t('ctx_add_fact')} ({contactName.split(' ')[0]})</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>{t('modal_fact')}</label>
            <input 
              type="text" 
              value={factInput} 
              onChange={(e) => setFactInput(e.target.value)} 
              placeholder="..."
              style={styles.input}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div style={styles.modalActions}>
            <button onClick={onClose} style={styles.btnSecondary}>
              {t('btn_cancel')}
            </button>
            <button onClick={handleAdd} style={styles.btnPrimary}>
              {t('btn_distill')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
