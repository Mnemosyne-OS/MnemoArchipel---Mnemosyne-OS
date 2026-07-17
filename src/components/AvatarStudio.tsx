import React, { useState, useEffect } from 'react';
import { AvatarStudioConfig, UserProfile } from '../types';
import { AvatarStudioComponent } from './AvatarStudioComponent';
import { AvatarStudioControls } from './AvatarStudioControls';
import { AvatarAccessoriesModal } from './AvatarAccessoriesModal';
import {
  defaultCfg,
  checkConfigHasChanges,
  generateRandomConfig
} from '../utils/avatarStudioHelpers';
import { formatRelationTag } from '../utils/helpers';

interface AvatarStudioProps {
  contacts: any[];
  initialContactId?: string;
  onSave: (contactId: string, config: AvatarStudioConfig) => void;
  onClose: () => void;
  style?: 'human' | 'magical';
  userProfile: UserProfile;
  onSaveUserAvatar: (config: AvatarStudioConfig) => void;
  t?: (key: string) => string;
}

/**
 * Avatar Studio customization panel.
 * Allows users to tweak details, skin tone, features, and accessory badges.
 */
export const AvatarStudio: React.FC<AvatarStudioProps> = ({ 
  contacts, 
  initialContactId,
  onSave, 
  onClose,
  style = 'human',
  userProfile,
  onSaveUserAvatar,
  t
}) => {
  const localT = t || ((key: string) => key);
  const [selectedContactId, setSelectedContactId] = useState<string>(initialContactId || 'user-profile');
  const currentContact = selectedContactId === 'user-profile'
    ? { 
        id: 'user-profile', 
        name: userProfile.name, 
        avatarConfig: userProfile.avatarConfig || defaultCfg,
        facts: [],
        relations: ['Moi'],
        mood: 'neutral'
      }
    : contacts.find(c => c.id === selectedContactId);

  const [activeConfig, setActiveConfig] = useState<AvatarStudioConfig>(defaultCfg);
  const [bgStyle, setBgStyle] = useState<'grid' | 'gradient' | 'dots'>('gradient');
  const [showAccessoryModal, setShowAccessoryModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const originalConfig = currentContact?.avatarConfig || defaultCfg;

  const hasChanges = checkConfigHasChanges(activeConfig, originalConfig);

  const renderLocalAvatar = (c: any) => {
    if (c.id === selectedContactId) {
      return <AvatarStudioComponent config={activeConfig} size={24} style={style} />;
    }
    if (c.avatarConfig) {
      return <AvatarStudioComponent config={c.avatarConfig} size={24} style={style} />;
    }
    return <span style={{ fontSize: '14px' }}>{c.avatar}</span>;
  };

  useEffect(() => {
    if (currentContact) {
      setActiveConfig(currentContact.avatarConfig || defaultCfg);
    }
  }, [selectedContactId]);

  const handleRandomize = () => {
    setActiveConfig(generateRandomConfig());
  };

  const handleSaveConfig = () => {
    if (selectedContactId === 'user-profile') {
      onSaveUserAvatar(activeConfig);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1500);
    } else if (selectedContactId && hasChanges) {
      onSave(selectedContactId, activeConfig);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1500);
    }
  };

  const currentAccs = activeConfig.accessories || [];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: 'calc(100vh - 70px)',
      backgroundColor: 'var(--bg-deep)',
      color: 'var(--text-primary)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* LEFT COLUMN: CONTACT SELECTOR */}
      <div style={{
        width: '280px',
        borderRight: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface-glass)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>🎨 Avatar Studio</h2>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Select a contact to customize their expert avatar</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {/* User Self-Avatar Selector */}
          <div
            onClick={() => setSelectedContactId('user-profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '12px',
              backgroundColor: selectedContactId === 'user-profile' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
              border: selectedContactId === 'user-profile' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
              transition: 'background 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: 'var(--bg-deep)', borderRadius: '50%', overflow: 'hidden' }}>
              <AvatarStudioComponent config={selectedContactId === 'user-profile' ? activeConfig : (userProfile.avatarConfig || defaultCfg)} size={24} style={style} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>👤 {userProfile.name} (Moi)</span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Votre Avatar Personnel</span>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '8px 0 12px 0' }} />

          {contacts.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedContactId(c.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '4px',
                backgroundColor: selectedContactId === c.id ? 'var(--bg-surface)' : 'transparent',
                border: selectedContactId === c.id ? '1px solid var(--border-subtle)' : '1px solid transparent',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: 'var(--bg-deep)', borderRadius: '50%' }}>
                {renderLocalAvatar(c)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{c.relations.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE COLUMN: LIVE CANVAS PREVIEW */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'var(--bg-deep)',
        position: 'relative'
      }}>
        {/* Contact Name & Relationship Context Header */}
        {currentContact && (
          <div style={{
            textAlign: 'center',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 700,
              margin: 0,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}>
              {currentContact.name}
            </h1>
            <div style={{
              display: 'flex',
              gap: '6px',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '11px',
              color: 'var(--text-secondary)'
            }}>
              {currentContact.relations.map((rel: string, idx: number) => (
                <span 
                  key={idx} 
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: 'var(--accent-emerald)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 600
                  }}
                >
                  {formatRelationTag(rel, localT)}
                </span>
              ))}
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{
                color: currentContact.warmth > 75 
                  ? 'var(--accent-emerald)' 
                  : currentContact.warmth > 40 
                  ? 'var(--accent-amber)' 
                  : 'var(--accent-rose)',
                fontWeight: 600
              }}>
                Warmth: {currentContact.warmth}%
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ textTransform: 'capitalize' }}>
                Mood: {currentContact.mood}
              </span>
            </div>
          </div>
        )}

        {/* Live render canvas */}
        <div style={{
          width: '320px',
          height: '320px',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
          background: bgStyle === 'grid' 
            ? 'radial-gradient(circle, transparent 20%, var(--bg-deep) 20%, var(--bg-deep) 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, var(--bg-deep) 20%, var(--bg-deep) 80%, transparent 80%, transparent) 15px 15px, linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)' 
            : bgStyle === 'dots'
            ? 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)'
            : 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(14,165,233,0.08) 100%)',
          backgroundSize: bgStyle === 'grid' ? '30px 30px' : bgStyle === 'dots' ? '20px 20px' : 'auto',
          backgroundColor: 'var(--bg-surface-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '20px'
        }}>
          {currentContact ? (
            <AvatarStudioComponent config={activeConfig} size={280} style={style} />
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Select a contact to begin</span>
          )}

          {/* Quick badge orbit picker toggle overlay */}
          <button 
            type="button"
            onClick={() => setShowAccessoryModal(true)}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
            title="Edit Accessory Badges"
          >
            🎒
          </button>
        </div>

        {/* Customization Suggestions bottom contextual box */}
        {currentContact && (
          <div style={{
            width: '320px',
            backgroundColor: 'var(--bg-surface-glass)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxSizing: 'border-box'
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--accent-teal)',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              💡 Idées de Personnalisation
            </span>
            <div style={{
              maxHeight: '70px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {currentContact.facts && currentContact.facts.length > 0 ? (
                currentContact.facts.map((fact: string, idx: number) => (
                  <p key={idx} style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', textAlign: 'left' }}>
                    • {fact}
                  </p>
                ))
              ) : (
                <>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4', textAlign: 'left', fontStyle: 'italic' }}>
                    Aucun fait marquant enregistré.
                  </p>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.4', textAlign: 'left' }}>
                    • Inspirez-vous de son cercle <strong>{currentContact.relations.join(', ')}</strong> ou de son humeur <strong>{currentContact.mood}</strong> pour créer un style unique !
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* BG selector & Random buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['gradient', 'grid', 'dots'].map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setBgStyle(style as any)}
              style={{
                backgroundColor: bgStyle === style ? 'var(--bg-surface)' : 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '10px',
                padding: '4px 8px',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Primary action controls */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={handleRandomize}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🎲 Randomize
          </button>
          <button
            type="button"
            onClick={handleSaveConfig}
            disabled={!hasChanges && !isSaved}
            style={{
              backgroundColor: isSaved 
                ? 'var(--accent-emerald)' 
                : hasChanges 
                ? 'rgba(16, 185, 129, 0.15)' 
                : 'var(--bg-surface)',
              border: isSaved 
                ? '1px solid var(--accent-emerald)' 
                : hasChanges 
                ? '1px solid var(--accent-emerald)' 
                : '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: isSaved 
                ? '#ffffff' 
                : hasChanges 
                ? 'var(--accent-emerald)' 
                : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '8px 24px',
              cursor: (isSaved || hasChanges) ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transform: isSaved ? 'scale(1.05)' : 'scale(1)'
            }}
            title={!hasChanges && !isSaved ? "No modifications to save" : "Save modifications"}
          >
            {isSaved ? '✓ Saved!' : hasChanges ? `💾 Save for ${currentContact?.name.split(' ')[0]}` : `💾 No changes`}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            ❌ Quit
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: SIMS EXPERT SLIDERS PANEL */}
      <AvatarStudioControls
        config={activeConfig}
        onChange={setActiveConfig}
      />

      {/* ACCESSORIES MODAL DIALOG */}
      {showAccessoryModal && (
        <AvatarAccessoriesModal
          onClose={() => setShowAccessoryModal(false)}
          currentAccs={currentAccs}
          onToggleAccessory={(id) => {
            if (currentAccs.includes(id)) {
              setActiveConfig({
                ...activeConfig,
                accessories: currentAccs.filter(i => i !== id)
              });
            } else {
              if (currentAccs.length >= 5) {
                alert("Maximum 5 accessories allowed");
                return;
              }
              setActiveConfig({
                ...activeConfig,
                accessories: [...currentAccs, id]
              });
            }
          }}
        />
      )}
    </div>
  );
};
