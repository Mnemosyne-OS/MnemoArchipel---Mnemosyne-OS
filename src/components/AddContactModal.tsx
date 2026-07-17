import React, { useState } from 'react';
import { CustomCategory, AvatarStudioConfig } from '../types';
import { styles } from '../styles';
import { AvatarStudioComponent } from './AvatarStudioComponent';
import { AvatarQuickBuilder } from './AvatarQuickBuilder';
import { EmojiCatalogPicker } from './EmojiCatalogPicker';
import { getRandomAvatarConfig } from '../utils/helpers';
import { SOCIAL_TYPES, getSocialIcon } from '../utils/socialHelpers';

interface AddContactModalProps {
  onClose: () => void;
  customCategories: CustomCategory[];
  onAddContact: (
    name: string,
    relations: string[],
    avatar: string,
    fact: string,
    avatarConfig?: AvatarStudioConfig,
    email?: string,
    phone?: string,
    address?: string,
    socials?: Record<string, string>
  ) => void;
  onCreateCategory?: (label: string, color: string) => void;
  t: (key: string) => string;
  globalAvatarStyle?: 'human' | 'magical';
}

const CATEGORY_PALETTE = ['#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899', '#3b82f6', '#14b8a6'];
const getRandomCategoryColor = () => CATEGORY_PALETTE[Math.floor(Math.random() * CATEGORY_PALETTE.length)];

export function AddContactModal({
  onClose,
  customCategories,
  onAddContact,
  onCreateCategory,
  t,
  globalAvatarStyle = 'human'
}: AddContactModalProps) {
  const [newName, setNewName] = useState('');
  const [newRelations, setNewRelations] = useState<string[]>(['Friend']);
  const [avatarType, setAvatarType] = useState<'emoji' | 'human'>('emoji');
  const [newAvatar, setNewAvatar] = useState('👤');
  const [humanConfig, setAvatarConfig] = useState<AvatarStudioConfig | undefined>(undefined);
  const [newFact, setNewFact] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Dynamic Contact Information system (matching the profile details editor)
  const [activeSocialKeys, setActiveSocialKeys] = useState<string[]>(['phone', 'email']);
  const [socialsDict, setSocialsDict] = useState<Record<string, string>>({});
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Separate phone, email, address, and remaining socials
    const finalPhone = socialsDict.phone?.trim() || undefined;
    const finalEmail = socialsDict.email?.trim() || undefined;
    const finalAddress = socialsDict.address?.trim() || undefined;

    const remainingSocials: Record<string, string> = {};
    activeSocialKeys.forEach(key => {
      if (['phone', 'email', 'address'].includes(key)) return;
      const val = socialsDict[key]?.trim();
      if (val) {
        remainingSocials[key] = val;
      }
    });

    onAddContact(
      newName.trim(),
      newRelations,
      avatarType === 'human' ? '🤖' : (newAvatar.trim() || '👤'),
      newFact.trim(),
      avatarType === 'human' ? humanConfig : undefined,
      finalEmail,
      finalPhone,
      finalAddress,
      Object.keys(remainingSocials).length > 0 ? remainingSocials : undefined
    );
    onClose();
  };

  const handleSelectAvatar = () => {
    setAvatarType('human');
    setNewAvatar('🤖');
    if (!humanConfig) {
      setAvatarConfig(getRandomAvatarConfig());
    }
  };

  const toggleRelation = (relation: string) => {
    if (newRelations.includes(relation)) {
      setNewRelations(newRelations.filter(r => r !== relation));
    } else {
      setNewRelations([...newRelations, relation]);
    }
  };

  const handleAddCategoryInline = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const cleanLabel = newCategoryName.trim();
    if (!cleanLabel) return;

    const newKey = cleanLabel.toLowerCase().replace(/\s+/g, '_');
    
    const exists = customCategories.some(c => c.key === newKey) || 
                   ['friend', 'colleague', 'family', 'mentor'].includes(newKey);
    
    if (!exists && onCreateCategory) {
      const color = getRandomCategoryColor();
      onCreateCategory(cleanLabel, color);
      if (!newRelations.includes(cleanLabel)) {
        setNewRelations([...newRelations, cleanLabel]);
      }
    } else {
      const keyToSelect = customCategories.find(c => c.key === newKey)?.label || cleanLabel;
      if (!newRelations.includes(keyToSelect)) {
        setNewRelations([...newRelations, keyToSelect]);
      }
    }
    setNewCategoryName('');
  };

  const defaultCats = [
    { key: 'Friend', label: t('relation_friend'), color: '#3b82f6' },
    { key: 'Colleague', label: t('relation_colleague'), color: '#8b5cf6' },
    { key: 'Family', label: t('relation_family'), color: '#ec4899' },
    { key: 'Mentor', label: t('relation_mentor'), color: '#f59e0b' }
  ];

  return (
    <div style={styles.modalBackdrop}>
      <div style={{ ...styles.modalContent, width: '840px', maxWidth: '95vw', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} className="glass">
        {/* Header */}
        <div style={{ ...styles.modalHeader, padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✨ {t('modal_title')}
          </h2>
          <button type="button" onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', flex: 1, overflowY: 'auto', padding: '24px', gap: '28px' }}>
            
            {/* Left Column: Form Inputs */}
            <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Name Input */}
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                  👤 {t('modal_name')}
                </label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="Ex: Sophie Martin"
                  style={{ ...styles.input, padding: '12px 14px', fontSize: '14px' }}
                  required
                  autoFocus
                />
              </div>

              {/* Categories/Relations Chips */}
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  🏷️ {t('modal_relation')}
                </label>
                
                {/* Chip Container */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {defaultCats.map(cat => {
                    const isSelected = newRelations.includes(cat.key);
                    return (
                      <button
                        type="button"
                        key={cat.key}
                        onClick={() => toggleRelation(cat.key)}
                        style={{
                          backgroundColor: isSelected ? 'var(--accent-teal)' : 'var(--bg-deep)',
                          color: isSelected ? 'var(--bg-deep)' : 'var(--text-secondary)',
                          border: isSelected ? '1px solid var(--accent-teal)' : '1px solid var(--border-subtle)',
                          borderRadius: '20px',
                          padding: '6px 14px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>{isSelected ? '✓' : '＋'}</span>
                        {cat.label}
                      </button>
                    );
                  })}

                  {/* Custom Categories Chips */}
                  {customCategories.map(cat => {
                    const isSelected = newRelations.includes(cat.label);
                    return (
                      <button
                        type="button"
                        key={cat.key}
                        onClick={() => toggleRelation(cat.label)}
                        style={{
                          backgroundColor: isSelected ? cat.color : 'var(--bg-deep)',
                          color: isSelected ? '#111827' : 'var(--text-secondary)',
                          border: isSelected ? `1px solid ${cat.color}` : '1px solid var(--border-subtle)',
                          borderRadius: '20px',
                          padding: '6px 14px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: isSelected ? 'rgba(0,0,0,0.5)' : cat.color 
                        }} />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Inline Category Creator */}
                {onCreateCategory && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder={t('cat_new_placeholder') || "New custom category..."}
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddCategoryInline(e);
                        }
                      }}
                      style={{ 
                        ...styles.input, 
                        flex: 1, 
                        padding: '8px 12px', 
                        fontSize: '12px',
                        backgroundColor: 'var(--bg-card)',
                        borderStyle: 'dashed'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategoryInline}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'}
                    >
                      ＋
                    </button>
                  </div>
                )}
              </div>

              {/* Notable Fact Input */}
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                  💡 {t('modal_fact')}
                </label>
                <textarea 
                  value={newFact} 
                  onChange={(e) => setNewFact(e.target.value)} 
                  placeholder={t('brain_dump_placeholder') || "Write an important fact or first memory about this contact..."}
                  style={{ 
                    ...styles.input, 
                    padding: '12px 14px', 
                    fontSize: '13px',
                    height: '80px',
                    resize: 'none',
                    lineHeight: '1.5'
                  }}
                />
              </div>

              {/* Dynamic Social & Contact Links */}
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  📞 {t('info_social_header') || "Contact Details & Social Links"}
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  {activeSocialKeys.map(key => {
                    const type = SOCIAL_TYPES.find(t => t.key === key);
                    const val = socialsDict[key] || '';
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px', width: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title={type?.label || key}>
                          {getSocialIcon(key, 16)}
                        </span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => setSocialsDict({ ...socialsDict, [key]: e.target.value })}
                          placeholder={`Enter ${type?.label || key}...`}
                          style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            outline: 'none',
                            padding: '4px 0'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setActiveSocialKeys(activeSocialKeys.filter(k => k !== key))}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(239, 68, 68, 0.6)',
                            cursor: 'pointer',
                            fontSize: '11px',
                            padding: '2px 6px'
                          }}
                          title="Remove method"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}

                  {/* Add method interface */}
                  {isAddingSocial ? (
                    <div style={{
                      marginTop: '4px',
                      padding: '8px',
                      backgroundColor: 'var(--bg-deep)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                        {SOCIAL_TYPES
                          .filter(type => !activeSocialKeys.includes(type.key))
                          .map(type => (
                            <button
                              key={type.key}
                              type="button"
                              onClick={() => {
                                setActiveSocialKeys([...activeSocialKeys, type.key]);
                                setIsAddingSocial(false);
                              }}
                              style={{
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '6px',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: 'var(--text-primary)'
                              }}
                              title={type.label}
                            >
                              {getSocialIcon(type.key, 16)}
                            </button>
                          ))
                        }
                      </div>
                      <button 
                        type="button"
                        onClick={() => setIsAddingSocial(false)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '10px',
                          textDecoration: 'underline',
                          alignSelf: 'center'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    SOCIAL_TYPES.filter(type => !activeSocialKeys.includes(type.key)).length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingSocial(true)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          border: '1px dashed rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          padding: '6px',
                          color: 'var(--text-secondary)',
                          fontSize: '11.5px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          marginTop: '4px',
                          outline: 'none'
                        }}
                      >
                        ➕ {t('info_social_header') || "Add Contact Method"}
                      </button>
                    )
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Avatar Config & Huge Preview */}
            <div style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '28px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <label style={{ ...styles.label, alignSelf: 'flex-start', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                  🎭 Avatar Selection
                </label>
                
                {/* Switcher */}
                <div style={{ display: 'flex', gap: '6px', width: '100%', backgroundColor: 'var(--bg-deep)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => { setAvatarType('emoji'); setNewAvatar('👤'); }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: avatarType === 'emoji' ? 'var(--accent-teal)' : 'transparent',
                      color: avatarType === 'emoji' ? 'var(--bg-deep)' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Emoji
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectAvatar}
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: avatarType === 'human' ? 'var(--accent-teal)' : 'transparent',
                      color: avatarType === 'human' ? 'var(--bg-deep)' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Avatar 🤖
                  </button>
                </div>

                {/* Huge Preview Container */}
                <div style={{ 
                  position: 'relative',
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--bg-deep)', 
                  border: '2px solid var(--accent-teal)',
                  boxShadow: '0 0 20px rgba(14, 165, 233, 0.25)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '64px',
                  overflow: 'hidden',
                  marginTop: '6px',
                  transition: 'transform 0.2s ease'
                }}
                className="floating-node"
                >
                  {avatarType === 'emoji' ? (
                    <span style={{ userSelect: 'none' }}>{newAvatar || '👤'}</span>
                  ) : (
                    humanConfig && (
                      <div style={{ transform: 'scale(2.2)', transformOrigin: 'center center' }}>
                        <AvatarStudioComponent config={humanConfig} size={42} style={globalAvatarStyle} />
                      </div>
                    )
                  )}
                </div>

                {/* Quick actions for Avatar */}
                {avatarType === 'human' && (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setAvatarConfig(getRandomAvatarConfig())}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '6px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      🎲 Randomize
                    </button>
                  </div>
                )}
              </div>

              {/* Lower Section Picker */}
              <div style={{ flex: 1, minHeight: '180px', overflowY: 'auto' }}>
                {avatarType === 'emoji' ? (
                  <div style={{ 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: '10px', 
                    backgroundColor: 'var(--bg-card)',
                    padding: '8px'
                  }}>
                    <EmojiCatalogPicker onSelectEmoji={setNewAvatar} />
                  </div>
                ) : (
                  humanConfig && (
                    <div style={{ 
                      border: '1px solid var(--border-subtle)', 
                      borderRadius: '10px', 
                      backgroundColor: 'var(--bg-card)',
                      padding: '8px'
                    }}>
                      <AvatarQuickBuilder
                        editingAvatarConfig={humanConfig}
                        setEditingAvatarConfig={setAvatarConfig as any}
                        hideActions={true}
                        style={globalAvatarStyle}
                        t={t}
                      />
                    </div>
                  )
                )}
              </div>

            </div>

          </div>

          {/* Form Actions Footer */}
          <div style={{ 
            ...styles.modalActions, 
            padding: '16px 24px', 
            borderTop: '1px solid var(--border-subtle)',
            margin: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button type="button" onClick={onClose} style={styles.btnSecondary}>
              {t('btn_cancel')}
            </button>
            <button 
              type="submit" 
              style={{
                ...styles.btnPrimary,
                backgroundColor: 'var(--accent-teal)',
                color: 'var(--bg-deep)',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.15)';
              }}
            >
              {t('btn_create_island')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
