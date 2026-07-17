import React from 'react';
import { styles } from '../styles';
import { playClick } from '../utils/audio';
import { UserProfile, CrmNotification } from '../types';
import { AvatarStudioComponent } from './AvatarStudioComponent';

interface HeaderProps {
  theme: 'dark' | 'light';
  handleToggleTheme: () => void;
  globalAvatarStyle: 'human' | 'magical';
  handleToggleAvatarStyle: () => void;
  viewMode: string;
  setViewMode: (mode: any) => void;
  isHostOnline: boolean;
  githubUpdateStatus: string;
  githubLatestVersion: string;
  setShowAddModal: (show: boolean) => void;
  t: (key: string) => string;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  notifications: CrmNotification[];
  showNotifTray: boolean;
  setShowNotifTray: (show: boolean) => void;
}

/**
 * Top navigation header component containing navigation actions, theme toggles,
 * host status indicators, update warnings, and add contact actions.
 */
export const Header: React.FC<HeaderProps> = ({
  theme,
  handleToggleTheme,
  globalAvatarStyle,
  handleToggleAvatarStyle,
  viewMode,
  setViewMode,
  isHostOnline,
  githubUpdateStatus,
  githubLatestVersion,
  setShowAddModal,
  t,
  userProfile,
  onOpenProfile,
  notifications,
  showNotifTray,
  setShowNotifTray
}) => {
  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <span style={styles.logo} onClick={() => setViewMode('archipelago')}>🏝️</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ ...styles.title, cursor: 'pointer' }} onClick={() => setViewMode('archipelago')}>
              {t('logo_title')}
            </h1>
            <span style={{ 
              backgroundColor: 'var(--bg-deep)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '6px', 
              padding: '2px 6px', 
              fontSize: '10px', 
              color: 'var(--text-secondary)',
              fontWeight: 600
            }}>
              v0.5.0
            </span>
            {githubUpdateStatus === 'new-version' && (
              <a 
                href="https://github.com/yaka0007/Mnemosyne-OS/releases"
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid var(--accent-amber)',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  color: 'var(--accent-amber)',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
                title={`v${githubLatestVersion} is available! Click to open releases.`}
              >
                ✨ Update available!
              </a>
            )}
          </div>
          <p style={styles.subtitle}>{t('logo_subtitle')}</p>
        </div>
      </div>

      <div style={styles.headerRight}>
        <div style={isHostOnline ? styles.badgeOnline : styles.badgeOffline}>
          <span style={styles.pulseDot}></span>
          {isHostOnline ? t('status_host') : t('status_local')}
        </div>

        <div style={styles.toggleGroup}>
          <button onClick={() => { playClick(); setViewMode('dashboard'); }} style={viewMode === 'dashboard' ? styles.toggleBtnActive : styles.toggleBtn}>
            📊 {t('view_dashboard')}
          </button>
          <button onClick={() => { playClick(); setViewMode('archipelago'); }} style={viewMode === 'archipelago' ? styles.toggleBtnActive : styles.toggleBtn}>
            {t('view_archipelago')}
          </button>
          <button onClick={() => { playClick(); setViewMode('archipelago3d'); }} style={viewMode === 'archipelago3d' ? styles.toggleBtnActive : styles.toggleBtn}>
            {t('view_archipelago3d')}
          </button>
          <button onClick={() => { playClick(); setViewMode('list'); }} style={viewMode === 'list' ? styles.toggleBtnActive : styles.toggleBtn}>
            {t('view_list')}
          </button>
          <button onClick={() => { playClick(); setViewMode('timeline'); }} style={viewMode === 'timeline' ? styles.toggleBtnActive : styles.toggleBtn}>
            📅 {t('view_timeline')}
          </button>
        </div>

        {/* User Profile Trigger Button */}
        <button 
          onClick={() => { playClick(); onOpenProfile(); }}
          style={{
            ...styles.settingsBtn,
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-deep)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '11px',
            height: '32px',
            width: 'auto'
          }}
          title={t('profile_modal_title')}
        >
          {userProfile.avatarConfig ? (
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AvatarStudioComponent config={userProfile.avatarConfig} size={18} style={globalAvatarStyle} />
            </div>
          ) : (
            <span>👤</span>
          )}
          {userProfile.name || 'Human'}
        </button>

        {/* Global Avatar Style Switch */}
        <button 
          onClick={handleToggleAvatarStyle} 
          style={{
            ...styles.settingsBtn,
            fontSize: '11px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-deep)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.2s',
            height: '32px',
            width: 'auto'
          }}
          title={globalAvatarStyle === 'human' ? t('switch_to_magical') : t('switch_to_human')}
        >
          {globalAvatarStyle === 'human' ? t('avatar_style_human') : t('avatar_style_magic')}
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={handleToggleTheme} 
          style={{
            ...styles.settingsBtn,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px'
          }}
          title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => { playClick(); setShowNotifTray(!showNotifTray); }} 
            style={{
              ...styles.settingsBtn,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              backgroundColor: showNotifTray ? 'var(--bg-deep)' : 'transparent',
              borderColor: showNotifTray ? 'var(--accent-emerald)' : 'var(--border-subtle)'
            }}
            title="Notification Center"
          >
            🔔
          </button>
          {notifications.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: 'var(--accent-rose)',
              color: '#ffffff',
              borderRadius: '50%',
              fontSize: '9px',
              fontWeight: 700,
              width: '15px',
              height: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 6px var(--accent-rose)',
              pointerEvents: 'none'
            }}>
              {notifications.length}
            </span>
          )}
        </div>

        {/* Settings view mode */}
        <button onClick={() => setViewMode('settings')} style={viewMode === 'settings' ? styles.settingsBtnActive : styles.settingsBtn}>
          ⚙️
        </button>

        <button 
          onClick={() => setShowAddModal(true)} 
          style={{
            ...styles.btnPrimary,
            backgroundColor: 'var(--accent-teal)',
            color: 'var(--bg-deep)',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)',
            transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s'
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
          {t('btn_new_contact')}
        </button>
      </div>
    </header>
  );
};
