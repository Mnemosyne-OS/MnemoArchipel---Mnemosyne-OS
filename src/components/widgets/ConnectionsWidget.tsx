import React, { useState } from 'react';
import { Contact } from '../../types';
import { renderContactAvatar } from '../AvatarStudioComponent';
import { styles } from '../../styles';

interface ConnectionsWidgetProps {
  selectedContact: Contact;
  contacts: Contact[];
  handleUpdateContact: (c: Contact) => void;
  onSelectContact?: (c: Contact) => void;
  t: (key: string) => string;
  inputStyle: any;
  btnStyle: any;
  userProfile?: any;
}

export const ConnectionsWidget: React.FC<ConnectionsWidgetProps> = ({
  selectedContact,
  contacts,
  handleUpdateContact,
  onSelectContact,
  t,
  inputStyle,
  btnStyle,
  userProfile
}) => {
  const [newConnTarget, setNewConnTarget] = useState('');
  const [newConnType, setNewConnType] = useState('');

  const connectionsList = selectedContact.connections || [];

  const userContact = userProfile ? {
    id: 'user-profile',
    name: `${userProfile.name} (${t('you') || 'Vous'})`,
    relations: [],
    status: 'active',
    avatar: '👤',
    avatarConfig: userProfile.avatarConfig,
    warmth: 100,
    facts: [],
    mementos: [],
    lastContact: '',
    mood: 'neutral'
  } as Contact : null;

  const addConnection = () => {
    if (!newConnTarget || !newConnType) return;

    const currentConns = selectedContact.connections || [];
    if (currentConns.some(c => c.targetId === newConnTarget)) return;

    const updatedSelected: Contact = {
      ...selectedContact,
      connections: [...currentConns, { targetId: newConnTarget, type: newConnType }]
    };

    if (newConnTarget !== 'user-profile') {
      const targetContact = contacts.find(c => c.id === newConnTarget);
      if (targetContact) {
        const targetConns = targetContact.connections || [];
        const updatedTarget: Contact = {
          ...targetContact,
          connections: [...targetConns, { targetId: selectedContact.id, type: newConnType }]
        };
        handleUpdateContact(updatedTarget);
      }
    }

    handleUpdateContact(updatedSelected);

    setNewConnTarget('');
    setNewConnType('');
  };

  const removeConnection = (targetId: string) => {
    const currentConns = selectedContact.connections || [];
    const updatedSelected: Contact = {
      ...selectedContact,
      connections: currentConns.filter(c => c.targetId !== targetId)
    };

    if (targetId !== 'user-profile') {
      const targetContact = contacts.find(c => c.id === targetId);
      if (targetContact) {
        const targetConns = targetContact.connections || [];
        const updatedTarget: Contact = {
          ...targetContact,
          connections: targetConns.filter(c => c.targetId !== selectedContact.id)
        };
        handleUpdateContact(updatedTarget);
      }
    }

    handleUpdateContact(updatedSelected);
  };

  const baseEligible = userContact && selectedContact.id !== 'user-profile' && !connectionsList.some(conn => conn.targetId === 'user-profile')
    ? [userContact, ...contacts]
    : contacts;

  const eligibleContacts = baseEligible.filter(c => 
    c.id !== selectedContact.id && 
    !connectionsList.some(conn => conn.targetId === c.id)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {connectionsList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {connectionsList.map((conn) => {
            const target = contacts.find(c => c.id === conn.targetId) || (conn.targetId === 'user-profile' ? userContact : null);
            if (!target) return null;
            return (
              <div key={conn.targetId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-deep)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden' }}>
                    {renderContactAvatar(target, 24)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {onSelectContact && target.id !== 'user-profile' ? (
                      <span 
                        onClick={() => onSelectContact(target)} 
                        style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {target.name}
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {target.name}
                      </span>
                    )}
                    <span style={{ fontSize: '10.5px', color: 'var(--accent-teal)' }}>{conn.type}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeConnection(conn.targetId)} 
                  style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '11px', outline: 'none' }}
                  title="Delete connection"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_connections') || 'Aucune relation définie.'}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <select
            value={newConnTarget}
            onChange={e => setNewConnTarget(e.target.value)}
            style={inputStyle}
          >
            <option value="" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>-- {t('select_contact_label') || 'Lier à...'} --</option>
            {eligibleContacts.map(c => (
              <option key={c.id} value={c.id} style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{c.name}</option>
            ))}
          </select>
          <select
            value={newConnType}
            onChange={e => {
              const val = e.target.value;
              if (val === 'other') {
                const custom = prompt(t('family_other_prompt') || 'Entrez la relation :');
                if (custom) {
                  setNewConnType(custom);
                }
              } else if (val) {
                setNewConnType(val);
              }
            }}
            style={inputStyle}
          >
            <option value="" disabled style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>-- {t('select') || 'Relation...'} --</option>
            <option value="Daughter" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_daughter') || 'Fille'}</option>
            <option value="Son" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_son') || 'Hijo / Fils'}</option>
            <option value="Sister" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_sister') || 'Sœur'}</option>
            <option value="Brother" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_brother') || 'Frère'}</option>
            <option value="Mother" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_mother') || 'Mère'}</option>
            <option value="Father" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_father') || 'Père'}</option>
            <option value="Partner" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_partner') || 'Conjoint(e)'}</option>
            <option value="Uncle" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_uncle') || 'Oncle'}</option>
            <option value="Aunt" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_aunt') || 'Tante'}</option>
            <option value="Cousin" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_cousin') || 'Cousin(e)'}</option>
            <option value="Friend" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('relation_friend') || 'Ami(e)'}</option>
            <option value="Colleague" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('relation_colleague') || 'Collègue'}</option>
            <option value="other" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{t('family_other') || 'Autre...'}</option>
          </select>
        </div>
        <button type="button" onClick={addConnection} style={btnStyle} disabled={!newConnTarget || !newConnType}>
          🔗 {t('btn_add_connection') || 'Lier les contacts'}
        </button>
      </div>
    </div>
  );
};
