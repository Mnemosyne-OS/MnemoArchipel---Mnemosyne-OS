import { useState } from 'react';
import { CustomCategory, CustomWidgetDef, CustomWidgetField } from '../types';
import { styles } from '../styles';
import { CustomCategoriesSettings } from './CustomCategoriesSettings';

interface SettingsPanelProps {
  viewMode: string;
  langPreference: 'auto' | 'en' | 'fr' | 'es';
  setLangPreference: (val: 'auto' | 'en' | 'fr' | 'es') => void;
  lockEnabled: boolean;
  handleToggleLock: (val: boolean) => void;
  lockType: 'password' | '2fa';
  setLockType: (val: 'password' | '2fa') => void;
  setIsSettingUp2FA: (val: boolean) => void;
  storedPassword: string;
  handleSavePassword: (val: string) => void;
  handleLoadDemoData: () => void;
  handlePurgeAllData: () => void;
  customCategories: CustomCategory[];
  onCreateCategory: (label: string, color: string) => void;
  onDeleteCategory: (key: string) => void;
  t: (key: string, replacements?: any) => string;
  globalAvatarStyle: 'human' | 'magical';
  setGlobalAvatarStyle: (val: 'human' | 'magical') => void;
  customWidgetDefs: CustomWidgetDef[];
  onCreateCustomWidget: (def: CustomWidgetDef) => void;
  onDeleteCustomWidget: (id: string) => void;
  githubUpdateStatus?: 'up-to-date' | 'new-version' | 'checking' | 'error';
  githubLatestVersion?: string;
  checkGithubUpdates?: () => void;
  onExportDatabase: () => void;
  onImportDatabase: (jsonDb: string) => boolean;
  onImportContacts: (fileContent: string, fileName: string) => boolean;
}

export function SettingsPanel({
  viewMode,
  langPreference,
  setLangPreference,
  lockEnabled,
  handleToggleLock,
  lockType,
  setLockType,
  setIsSettingUp2FA,
  storedPassword,
  handleSavePassword,
  handleLoadDemoData,
  handlePurgeAllData,
  customCategories,
  onCreateCategory,
  onDeleteCategory,
  t,
  globalAvatarStyle,
  setGlobalAvatarStyle,
  customWidgetDefs,
  onCreateCustomWidget,
  onDeleteCustomWidget,
  githubUpdateStatus = 'checking',
  githubLatestVersion = '',
  checkGithubUpdates,
  onExportDatabase,
  onImportDatabase,
  onImportContacts
}: SettingsPanelProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Widget Builder states
  const [widgetName, setWidgetName] = useState('');
  const [widgetFields, setWidgetFields] = useState<CustomWidgetField[]>([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'boolean'>('text');

  if (viewMode !== 'settings') return null;

  return (
    <div style={styles.settingsView} className="glass">
      <h2 style={styles.settingsViewTitle}>⚙️ {t('settings_title')}</h2>
      
      {/* Language Settings */}
      <div style={styles.settingsSection}>
        <h3 style={styles.settingsSectionTitle}>{t('settings_language')}</h3>
        <div style={styles.formGroup}>
          <select 
            value={langPreference} 
            onChange={(e) => {
              const val = e.target.value as 'auto' | 'en' | 'fr' | 'es';
              setLangPreference(val);
              localStorage.setItem('crm_language', val);
            }}
            style={styles.select}
          >
            <option value="auto">{t('settings_lang_auto')}</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>

      {/* Custom Categories Section Component */}
      <CustomCategoriesSettings
        customCategories={customCategories}
        onCreateCategory={onCreateCategory}
        onDeleteCategory={onDeleteCategory}
        t={t}
      />

      {/* Security Gate settings */}
      <div style={styles.settingsSection}>
        <h3 style={styles.settingsSectionTitle}>{t('settings_security')}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <input 
            type="checkbox" 
            id="security-toggle"
            checked={lockEnabled}
            onChange={(e) => handleToggleLock(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="security-toggle" style={{ fontSize: '13px', cursor: 'pointer' }}>
            {t('settings_lock_enabled')}
          </label>
        </div>

        {lockEnabled && (
          <div style={styles.formGroup}>
            <label style={styles.label}>{t('settings_lock_type')}</label>
            <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
              <button 
                onClick={() => { setLockType('password'); localStorage.setItem('crm_lock_type', 'password'); }}
                style={lockType === 'password' ? styles.toggleBtnActive : styles.toggleBtn}
              >
                🔑 {t('settings_password')}
              </button>
              <button 
                onClick={() => { setIsSettingUp2FA(true); }}
                style={lockType === '2fa' ? styles.toggleBtnActive : styles.toggleBtn}
              >
                📱 {t('settings_2fa')}
              </button>
            </div>
          </div>
        )}

        {lockEnabled && lockType === 'password' && (
          <div style={{ ...styles.formGroup, marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <label style={styles.label}>{t('settings_set_password')}</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <input 
                type="text" 
                defaultValue={storedPassword}
                onBlur={(e) => handleSavePassword(e.target.value)}
                style={styles.input}
                placeholder="1234"
              />
            </div>
          </div>
        )}
      </div>

      {/* Avatar Style choice */}
      <div style={styles.settingsSection}>
        <h3 style={styles.settingsSectionTitle}>{t('settings_avatar_style') || 'Avatar Style'}</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            onClick={() => setGlobalAvatarStyle('human')} 
            style={globalAvatarStyle === 'human' ? styles.toggleBtnActive : styles.toggleBtn}
          >
            👤 Avatar (Human)
          </button>
          <button 
            type="button"
            onClick={() => setGlobalAvatarStyle('magical')} 
            style={globalAvatarStyle === 'magical' ? styles.toggleBtnActive : styles.toggleBtn}
          >
            🦄 Magical Animals
          </button>
        </div>
      </div>

      {/* Custom Widget Builder Section */}
      <div style={styles.settingsSection}>
        <h3 style={styles.settingsSectionTitle}>{t('settings_custom_widgets_title')}</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          {t('settings_custom_widgets_desc')}
        </p>

        {/* Create new Widget Form */}
        <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>{t('widget_name_label')}</label>
            <input 
              type="text" 
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
              placeholder="ex: Coffee habits"
              style={styles.input}
            />
          </div>

          {/* Added fields preview */}
          {widgetFields.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('widget_fields_configured')}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {widgetFields.map((f, idx) => (
                  <span key={f.key} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {f.label} ({f.type})
                    <button 
                      type="button" 
                      onClick={() => setWidgetFields(widgetFields.filter((_, i) => i !== idx))}
                      style={{ border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '10px', padding: 0 }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add a field Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr auto', gap: '10px', alignItems: 'end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{t('widget_field_name')}</span>
              <input 
                type="text" 
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="ex: Likes milk"
                style={styles.input}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{t('widget_field_type')}</span>
              <select 
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as any)}
                style={styles.select}
              >
                <option value="text">{t('widget_field_type_text')}</option>
                <option value="number">{t('widget_field_type_number')}</option>
                <option value="boolean">{t('widget_field_type_boolean')}</option>
              </select>
            </div>
            <button 
              type="button"
              onClick={() => {
                if (!newFieldName.trim()) return;
                const fieldKey = newFieldName.trim().toLowerCase().replace(/\s+/g, '_');
                if (widgetFields.some(f => f.key === fieldKey)) return;
                setWidgetFields([...widgetFields, { key: fieldKey, label: newFieldName.trim(), type: newFieldType }]);
                setNewFieldName('');
              }}
              style={{ ...styles.btnSecondary, padding: '8px 12px', height: '36px' }}
            >
              ➕ {t('btn_add')}
            </button>
          </div>

          <button 
            type="button" 
            onClick={() => {
              if (!widgetName.trim() || widgetFields.length === 0) return;
              const widgetId = 'custom_' + widgetName.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substr(2, 4);
              onCreateCustomWidget({
                id: widgetId,
                name: widgetName.trim(),
                fields: widgetFields
              });
              setWidgetName('');
              setWidgetFields([]);
            }}
            style={{ ...styles.btnPrimary, marginTop: '8px' }}
            disabled={!widgetName.trim() || widgetFields.length === 0}
          >
            💾 {t('settings_custom_widgets_save')}
          </button>
        </div>

        {/* Existing Widgets List */}
        {customWidgetDefs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{t('settings_custom_widgets_active')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {customWidgetDefs.map((w) => (
                <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>🛠️ {w.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {t('widget_field_type')}: {w.fields.map(f => f.label).join(', ')}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => onDeleteCustomWidget(w.id)}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.7)', cursor: 'pointer', fontSize: '12px', outline: 'none' }}
                  >
                    🗑️ {t('btn_delete')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GitHub Update Tracker Section */}
      <div style={styles.settingsSection}>
        <h3 style={styles.settingsSectionTitle}>
          📦 {t('settings_updates_title') || 'Mises à Jour & Version'}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          {t('settings_updates_desc') || "Suivez les versions et mettez à jour votre application directement depuis le dépôt GitHub officiel de Mnemosyne OS."}
        </p>

        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          borderRadius: '8px', 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {t('settings_updates_local')}
            </span>
            <span style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '6px', 
              padding: '4px 10px', 
              fontSize: '12px', 
              color: '#fff', 
              fontWeight: 'bold' 
            }}>
              v0.5.0
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {t('settings_updates_status')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {githubUpdateStatus === 'checking' && (
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {t('settings_updates_checking')}
                </span>
              )}
              {githubUpdateStatus === 'up-to-date' && (
                <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  {t('settings_updates_up_to_date')}
                </span>
              )}
              {githubUpdateStatus === 'new-version' && (
                <span style={{ fontSize: '12px', color: 'var(--accent-amber)', fontWeight: 600 }}>
                  {t('settings_updates_available', { version: githubLatestVersion })}
                </span>
              )}
              {githubUpdateStatus === 'error' && (
                <span style={{ fontSize: '12px', color: 'var(--accent-rose)' }}>
                  {t('settings_updates_error')}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '12px', justifyContent: 'flex-end' }}>
            {checkGithubUpdates && (
              <button 
                type="button" 
                onClick={checkGithubUpdates} 
                style={{ ...styles.btnSecondary, padding: '6px 12px', fontSize: '12px' }}
                disabled={githubUpdateStatus === 'checking'}
              >
                🔄 {t('btn_recheck') || 'Vérifier à nouveau'}
              </button>
            )}
            {githubUpdateStatus === 'new-version' && (
              <a 
                href="https://github.com/yaka0007/Mnemosyne-OS/releases"
                target="_blank"
                rel="noreferrer"
                style={{ 
                  ...styles.btnPrimary, 
                  backgroundColor: 'var(--accent-amber)', 
                  textDecoration: 'none', 
                  padding: '6px 12px', 
                  fontSize: '12px',
                  display: 'inline-block',
                  textAlign: 'center'
                }}
              >
                📥 {t('btn_download_updates') || 'Télécharger la v' + githubLatestVersion}
              </a>
            )}
          </div>
        </div>
      </div>

      <div style={styles.settingsSection}>
        <h3 style={styles.settingsSectionTitle}>{t('db_section_title')}</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          {t('db_section_desc')}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <button 
            type="button" 
            onClick={onExportDatabase} 
            style={{ ...styles.btnPrimary, padding: '8px 14px', fontSize: '12px' }}
          >
            {t('db_export_btn')}
          </button>
          <label style={{
            ...styles.btnSecondary,
            padding: '8px 14px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'inline-block'
          }}>
            {t('db_import_label')}
            <input 
              type="file" 
              accept=".json,.vcf,.csv" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (evt) => {
                  const content = evt.target?.result as string;
                  if (content) {
                    const isDatabaseBackup = file.name.toLowerCase().endsWith('.json') && content.includes('"userProfile"');
                    if (isDatabaseBackup) {
                      const success = onImportDatabase(content);
                      setImportStatus(success ? 'success' : 'error');
                    } else {
                      const success = onImportContacts(content, file.name);
                      setImportStatus(success ? 'success' : 'error');
                    }
                  }
                };
                reader.readAsText(file);
              }}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        {importStatus === 'success' && <div style={{ color: 'var(--accent-emerald)', fontSize: '11.5px', marginBottom: '8px' }}>{t('db_import_success')}</div>}
        {importStatus === 'error' && <div style={{ color: 'var(--accent-rose)', fontSize: '11.5px', marginBottom: '8px' }}>{t('db_import_error')}</div>}
        
        <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '4px' }}>
          <button onClick={handleLoadDemoData} style={{ ...styles.btnSecondary, padding: '6px 12px', fontSize: '11px' }}>
            {t('db_load_demo')}
          </button>
          <button onClick={handlePurgeAllData} style={{ ...styles.btnSecondary, padding: '6px 12px', fontSize: '11px', color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.2)' }}>
            {t('db_purge_all')}
          </button>
        </div>
      </div>
    </div>
  );
}
