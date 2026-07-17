import React from 'react';
import { styles } from '../styles';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel
}) => {
  return (
    <div style={styles.modalBackdrop}>
      <div style={{ ...styles.modalContent, width: '360px' }} className="glass">
        <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#fff' }}>{title}</h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            onClick={onCancel} 
            style={styles.btnSecondary}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            style={{ 
              ...styles.btnPrimary, 
              backgroundColor: title.toLowerCase().includes('purge') ? 'var(--accent-rose)' : 'var(--accent-teal)' 
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
