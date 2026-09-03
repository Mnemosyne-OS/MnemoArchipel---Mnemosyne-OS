import React from 'react';
import { styles } from '../styles';
import { Contact } from '../types';

interface CrmContextMenuProps {
  x: number;
  y: number;
  contact?: Contact;
  onClose: () => void;
  onSimulateContact: (id: string) => void;
  onAddFact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onAddContactClick: () => void;
  t: (key: string) => string;
}

export const CrmContextMenu: React.FC<CrmContextMenuProps> = ({
  x,
  y,
  contact,
  onClose,
  onSimulateContact,
  onAddFact,
  onDeleteContact,
  onAddContactClick,
  t
}) => {
  // Closing on an outside click, and on this cartridge losing focus.
  //
  // 🪤 A press on the HOST plane never reaches this document: we run in an
  // iframe, so that event belongs to the host page. No event type fixes that
  // (pointerdown included) — only the window blur crosses the boundary.
  React.useEffect(() => {
    const handleOutsideClick = () => onClose();
    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('blur', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('blur', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: y,
      left: x,
      zIndex: 9999,
      backgroundColor: '#12141c',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      padding: '4px 0',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      minWidth: '150px'
    }}>
      {contact ? (
        <>
          <button 
            onClick={() => { onSimulateContact(contact.id); onClose(); }} 
            style={styles.contextMenuBtn}
          >
            👋 {t('ctx_record_contact')}
          </button>
          <button 
            onClick={() => { onAddFact(contact); onClose(); }} 
            style={styles.contextMenuBtn}
          >
            📌 {t('ctx_add_fact')}
          </button>
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
          <button 
            onClick={() => { onDeleteContact(contact.id); onClose(); }} 
            style={{ ...styles.contextMenuBtn, color: 'var(--accent-rose)' }}
          >
            🗑️ {t('ctx_delete_contact')}
          </button>
        </>
      ) : (
        <button 
          onClick={() => { onAddContactClick(); onClose(); }} 
          style={styles.contextMenuBtn}
        >
          ➕ {t('ctx_add_contact')}
        </button>
      )}
    </div>
  );
};
