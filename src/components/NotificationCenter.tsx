import React, { useState } from 'react';
import { CrmNotification, Contact, NotificationSettings } from '../types';
import { generateAiOutreachSuggestion } from '../utils/notificationHelpers';

interface NotificationCenterProps {
  notifications: CrmNotification[];
  contacts: Contact[];
  settings: NotificationSettings;
  onUpdateSettings: (s: NotificationSettings) => void;
  onClose: () => void;
  onGoToContact: (contactId: string) => void;
  onSimulateContact: (contactId: string) => void;
  t: (key: string, replacements?: any) => string;
  activeLang: 'en' | 'fr' | 'es';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  contacts,
  settings,
  onUpdateSettings,
  onClose,
  onGoToContact,
  onSimulateContact,
  t,
  activeLang
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'ai' | 'settings'>('alerts');
  const [copied, setCopied] = useState(false);

  // Pick one dormant contact for AI outreach assistant
  const dormantNotifs = notifications.filter(n => n.type === 'dormant');
  const selectedDormantContact = dormantNotifs.length > 0
    ? contacts.find(c => c.id === dormantNotifs[0].contactId)
    : null;

  const aiSuggestion = selectedDormantContact 
    ? generateAiOutreachSuggestion(selectedDormantContact, activeLang)
    : t('no_dormant_contacts') || "Aucun contact dormant pour le moment ! Votre Archipel est parfaitement entretenu. 🏝️";

  const handleCopyText = (text: string) => {
    // Extract actual template text if it has markdown formatting
    const rawMatch = text.match(/\*"(.*)"\*/s);
    const cleanText = rawMatch ? rawMatch[1] : text;
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailTo = (contact: Contact, text: string) => {
    const rawMatch = text.match(/\*"(.*)"\*/s);
    const cleanText = rawMatch ? rawMatch[1] : text;
    const mail = contact.email || 'hello@archipel.local';
    window.open(`mailto:${mail}?subject=Prendre des nouvelles&body=${encodeURIComponent(cleanText)}`);
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: '64px',
        right: '24px',
        width: '380px',
        maxHeight: '520px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)'
      }}
      className="glass"
    >
      {/* Header Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
        <button 
          onClick={() => setActiveTab('alerts')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: activeTab === 'alerts' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer',
            borderBottom: activeTab === 'alerts' ? '2px solid var(--accent-emerald)' : 'none'
          }}
        >
          🚨 {t('notif_tab_alerts')} ({notifications.length})
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: activeTab === 'ai' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer',
            borderBottom: activeTab === 'ai' ? '2px solid var(--accent-emerald)' : 'none'
          }}
        >
          ✨ {t('notif_tab_assistant')}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: activeTab === 'settings' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer',
            borderBottom: activeTab === 'settings' ? '2px solid var(--accent-emerald)' : 'none'
          }}
        >
          ⚙️ {t('notif_tab_thresholds')}
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', minHeight: '120px' }}>
        {activeTab === 'alerts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>
                {t('notif_empty_alerts')}
              </div>
            ) : (
              notifications.map(notif => {
                const icon = notif.type === 'dormant' ? '🕒' : notif.type === 'date' ? '📅' : '📝';
                return (
                  <div 
                    key={notif.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-deep)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span style={{ fontSize: '16px', marginTop: '2px' }}>{icon}</span>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {notif.title}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {notif.message}
                      </span>
                      {notif.contactId && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <button 
                            onClick={() => {
                              onGoToContact(notif.contactId!);
                              onClose();
                            }}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: 'var(--accent-teal)',
                              padding: 0,
                              fontSize: '10.5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textDecoration: 'underline'
                            }}
                          >
                            Details
                          </button>
                          {notif.type === 'dormant' && (
                            <button 
                              onClick={() => onSimulateContact(notif.contactId!)}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'var(--accent-emerald)',
                                padding: 0,
                                fontSize: '10.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              }}
                            >
                              {t('ctx_record_contact')}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {t('notif_ai_heading')}
            </h4>
            <div 
              style={{
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px',
                lineHeight: '1.5',
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap'
              }}
            >
              {aiSuggestion}
            </div>

            {selectedDormantContact && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleCopyText(aiSuggestion)}
                  style={{
                    flex: 1,
                    backgroundColor: copied ? 'var(--accent-emerald)' : 'var(--bg-surface)',
                    color: copied ? '#ffffff' : 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {copied ? t('saved') : t('notif_copy_message')}
                </button>
                <button 
                  onClick={() => handleMailTo(selectedDormantContact, aiSuggestion)}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--accent-teal)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {t('notif_send_email')}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              ⚙ {t('notif_tab_thresholds')}
            </h4>

            {/* Threshold Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 500 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('notif_settings_active')}</span>
                <span style={{ color: 'var(--accent-emerald)' }}>{settings.activeThresholdDays} {t('spacing_label').toLowerCase()}</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="30" 
                value={settings.activeThresholdDays} 
                onChange={(e) => onUpdateSettings({ ...settings, activeThresholdDays: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 500 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('notif_settings_warm')}</span>
                <span style={{ color: 'var(--accent-emerald)' }}>{settings.warmThresholdDays} {t('spacing_label').toLowerCase()}</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="90" 
                value={settings.warmThresholdDays} 
                onChange={(e) => onUpdateSettings({ ...settings, warmThresholdDays: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
              />
            </div>

            {/* Toggle checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={settings.enableDatesAlerts} 
                  onChange={(e) => onUpdateSettings({ ...settings, enableDatesAlerts: e.target.checked })}
                  style={{ accentColor: 'var(--accent-emerald)' }}
                />
                {t('notif_settings_dates')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={settings.enableTasksAlerts} 
                  onChange={(e) => onUpdateSettings({ ...settings, enableTasksAlerts: e.target.checked })}
                  style={{ accentColor: 'var(--accent-emerald)' }}
                />
                {t('notif_settings_tasks')}
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Footer Closer */}
      <div 
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '10px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {t('notif_close')}
        </button>
      </div>
    </div>
  );
};
