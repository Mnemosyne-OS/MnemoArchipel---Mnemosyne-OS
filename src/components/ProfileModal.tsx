import React, { useState } from 'react';
import { UserProfile } from '../types';
import { styles } from '../styles';
import { AvatarStudioComponent } from './AvatarStudioComponent';

interface ProfileModalProps {
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
  onOpenAvatarBuilder: () => void;
  globalAvatarStyle?: 'human' | 'magical';
  t: (key: string) => string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userProfile,
  onSave,
  onClose,
  onOpenAvatarBuilder,
  globalAvatarStyle = 'human',
  t
}) => {
  const [name, setName] = useState(userProfile.name || 'Human');
  const [email, setEmail] = useState(userProfile.email || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [address, setAddress] = useState(userProfile.address || '');
  const [bio, setBio] = useState(userProfile.bio || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      email,
      phone,
      address,
      bio,
      avatarConfig: userProfile.avatarConfig
    });
    onClose();
  };

  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div 
        style={{ ...styles.modalContent, width: '460px' }} 
        onClick={(e) => e.stopPropagation()}
        className="glass"
      >
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('profile_modal_title')}
          </h3>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Avatar Preview & Customizer Trigger */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-deep)',
              border: '2.5px solid var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)'
            }}>
              {userProfile.avatarConfig ? (
                <AvatarStudioComponent config={userProfile.avatarConfig} size={76} style={globalAvatarStyle} />
              ) : (
                <span style={{ fontSize: '32px' }}>👤</span>
              )}
            </div>
            <button 
              type="button" 
              onClick={() => {
                onOpenAvatarBuilder();
                onClose();
              }}
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                color: 'var(--accent-emerald)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t('profile_modal_customize_avatar')}
            </button>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>{t('profile_modal_name')}</label>
            <input 
              style={styles.input}
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('profile_modal_email')}</label>
              <input 
                style={styles.input}
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>{t('profile_modal_phone')}</label>
              <input 
                style={styles.input}
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>{t('profile_modal_address')}</label>
            <input 
              style={styles.input}
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>{t('profile_modal_bio')}</label>
            <textarea 
              style={{ ...styles.input, height: '60px', resize: 'none', fontFamily: 'inherit' }}
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
            />
          </div>

          <div style={styles.modalActions}>
            <button 
              type="button" 
              style={styles.btnSecondary} 
              onClick={onClose}
            >
              {t('btn_cancel')}
            </button>
            <button 
              type="submit" 
              style={styles.btnPrimary}
            >
              {t('profile_modal_save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
