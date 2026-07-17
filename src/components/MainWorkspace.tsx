import React from 'react';
import { Contact, CustomCategory, CustomWidgetDef, UserProfile } from '../types';
import { styles } from '../styles';
import { getCategoryColor } from '../utils/colors';

// View Imports
import { SettingsPanel } from './SettingsPanel';
import { GlobalTimeline } from './GlobalTimeline';
import { GlobalDashboard } from './GlobalDashboard';
import { Archipelago3D } from './Archipelago3D';
import { Archipelago2D } from './Archipelago2D';
import { ListView } from './ListView';

interface MainWorkspaceProps {
  userProfile?: UserProfile;
  viewMode: string;
  setViewMode: (v: any) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
  ragAnswer: string | null;
  setRagAnswer: (val: string | null) => void;
  highlightedLink: any;
  setHighlightedLink: (val: any) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  customCategories: CustomCategory[];
  contacts: Contact[];
  selectedContact: Contact | null;
  setSelectedContact: (c: Contact | null) => void;
  globalAvatarStyle: 'human' | 'magical';
  handleUpdateContact: (c: Contact) => void;
  customWidgetDefs: CustomWidgetDef[];
  handleCreateCustomWidget: (w: CustomWidgetDef) => void;
  handleDeleteCustomWidget: (id: string) => void;
  githubUpdateStatus: any;
  githubLatestVersion: string;
  checkGithubUpdates: () => void;
  handleLoadDemoData: () => void;
  handlePurgeAllData: () => void;
  handleToggleLock: (l: boolean) => void;
  lockEnabled: boolean;
  lockType: 'password' | '2fa';
  setLockType: (t: 'password' | '2fa') => void;
  setIsSettingUp2FA: (s: boolean) => void;
  storedPassword: string;
  handleSavePassword: (p: string) => void;
  handleCreateCategory: (l: string, c: string) => void;
  handleDeleteCategory: (k: string) => void;
  onExportDatabase: () => void;
  onImportDatabase: (json: string) => boolean;
  onImportContacts: (fileContent: string, fileName: string) => boolean;
  setShowAddModal: (val: boolean) => void;
  t: (key: string, replacements?: any) => string;
  setContextMenu: (m: any) => void;
  handleSelectLink: (c1: any, c2: any) => void;
  setIsGraphFullscreen: (fs: boolean) => void;
  langPreference: 'auto' | 'en' | 'fr' | 'es';
  setLangPreference: (val: 'auto' | 'en' | 'fr' | 'es') => void;
  setGlobalAvatarStyle: (val: 'human' | 'magical') => void;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
  ragAnswer,
  setRagAnswer,
  highlightedLink,
  setHighlightedLink,
  activeFilter,
  setActiveFilter,
  customCategories,
  contacts,
  selectedContact,
  setSelectedContact,
  globalAvatarStyle,
  handleUpdateContact,
  customWidgetDefs,
  handleCreateCustomWidget,
  handleDeleteCustomWidget,
  githubUpdateStatus,
  githubLatestVersion,
  checkGithubUpdates,
  handleLoadDemoData,
  handlePurgeAllData,
  handleToggleLock,
  lockEnabled,
  lockType,
  setLockType,
  setIsSettingUp2FA,
  storedPassword,
  handleSavePassword,
  handleCreateCategory,
  handleDeleteCategory,
  onExportDatabase,
  onImportDatabase,
  onImportContacts,
  setShowAddModal,
  t,
  setContextMenu,
  handleSelectLink,
  setIsGraphFullscreen,
  langPreference,
  setLangPreference,
  setGlobalAvatarStyle,
  userProfile
}) => {
  return (
    <div style={styles.scrollableContent}>
      {/* RAG Search Engine */}
      <div style={styles.searchBar}>
        <input 
          type="text" 
          placeholder={t('search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} disabled={isSearching} style={styles.searchBtn}>
          {isSearching ? '...' : t('btn_rag')}
        </button>
      </div>

      {/* RAG Answers / Highlights */}
      {ragAnswer && (
        <div style={styles.ragAnswerBox} className="glass">
          <button onClick={() => setRagAnswer(null)} style={{ float: 'right', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>×</button>
          <div style={{ fontSize: '13px', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: ragAnswer }} />
        </div>
      )}

      {highlightedLink && (
        <div style={{ ...styles.ragAnswerBox, borderColor: 'rgba(245, 158, 11, 0.4)' }} className="glass">
          <button onClick={() => setHighlightedLink(null)} style={{ float: 'right', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>×</button>
          <h4>🔗 Relation Link: {highlightedLink.c1.name} &lt;—&gt; {highlightedLink.c2.name}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Both are anchored in your Archipel and linked topologically. Keep in touch with them together!
          </p>
        </div>
      )}

      {/* Main Visualizer Area */}
      {viewMode !== 'settings' && viewMode !== 'timeline' && (
        <div style={styles.filterRow}>
          {[
            { key: 'All', label: t('filter_all'), color: 'rgba(128,128,128,0.4)' },
            { key: 'Friend', label: t('filter_friends'), color: getCategoryColor('Friend') },
            { key: 'Colleague', label: t('filter_colleagues'), color: getCategoryColor('Colleague') },
            { key: 'Family', label: t('filter_family'), color: getCategoryColor('Family') },
            { key: 'Mentor', label: t('filter_mentors'), color: getCategoryColor('Mentor') },
            ...customCategories.map(c => ({
              key: c.key,
              label: c.label,
              color: c.color
            }))
          ].map(chip => (
            <button
              key={chip.key}
              onClick={() => setActiveFilter(chip.key)}
              style={{
                ...styles.filterChip,
                borderColor: activeFilter === chip.key ? chip.color : 'var(--border-subtle)',
                backgroundColor: activeFilter === chip.key ? 'var(--bg-surface)' : 'var(--bg-deep)',
                color: 'var(--text-primary)',
                fontWeight: activeFilter === chip.key ? 700 : 500,
              }}
            >
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: chip.color, marginRight: '6px' }} />
              {chip.label}
            </button>
          ))}
          
          {activeFilter !== 'All' && (() => {
            const matchingContacts = contacts.filter(c => 
              c.relations.some(r => r.toLowerCase().startsWith(activeFilter.toLowerCase()))
            );
            const emails = matchingContacts.map(c => c.socials?.email || c.email).filter(Boolean);
            if (emails.length === 0) return null;
            
            return (
              <a
                href={`mailto:?bcc=${emails.join(',')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  backgroundColor: 'rgba(20, 184, 166, 0.12)',
                  border: '1px solid var(--accent-teal)',
                  borderRadius: '20px',
                  color: 'var(--accent-teal)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  marginLeft: 'auto',
                  cursor: 'pointer'
                }}
                title={`${t('group_email')} (${emails.length})`}
              >
                ✉️ {t('group_email')} ({emails.length})
              </a>
            );
          })()}
        </div>
      )}

      {/* Render Views */}
      {viewMode === 'settings' && (
        <SettingsPanel 
          viewMode={viewMode}
          langPreference={langPreference as any}
          setLangPreference={setLangPreference}
          lockEnabled={lockEnabled}
          handleToggleLock={handleToggleLock}
          lockType={lockType}
          setLockType={setLockType}
          setIsSettingUp2FA={setIsSettingUp2FA}
          storedPassword={storedPassword}
          handleSavePassword={handleSavePassword}
          handleLoadDemoData={handleLoadDemoData}
          handlePurgeAllData={handlePurgeAllData}
          customCategories={customCategories}
          onCreateCategory={handleCreateCategory}
          onDeleteCategory={handleDeleteCategory}
          t={t}
          globalAvatarStyle={globalAvatarStyle}
          setGlobalAvatarStyle={setGlobalAvatarStyle}
          customWidgetDefs={customWidgetDefs}
          onCreateCustomWidget={handleCreateCustomWidget}
          onDeleteCustomWidget={handleDeleteCustomWidget}
          githubUpdateStatus={githubUpdateStatus}
          githubLatestVersion={githubLatestVersion}
          checkGithubUpdates={checkGithubUpdates}
          onExportDatabase={onExportDatabase}
          onImportDatabase={onImportDatabase}
          onImportContacts={onImportContacts}
        />
      )}

      {viewMode === 'timeline' && (
        <GlobalTimeline 
          contacts={contacts}
          customCategories={customCategories}
          onSelectContact={setSelectedContact}
          globalAvatarStyle={globalAvatarStyle}
          t={t}
        />
      )}

      {viewMode === 'dashboard' && (
        <GlobalDashboard
          contacts={contacts.filter(c => 
            activeFilter.toLowerCase() === 'all' || 
            c.relations.some(r => r.toLowerCase().startsWith(activeFilter.toLowerCase()))
          )}
          onSelectContact={setSelectedContact}
          setViewMode={setViewMode}
          globalAvatarStyle={globalAvatarStyle}
          t={t}
          handleUpdateContact={handleUpdateContact}
          customCategories={customCategories}
          handleLoadDemoData={handleLoadDemoData}
          onImportContacts={onImportContacts}
          onImportDatabase={onImportDatabase}
          setShowAddModal={setShowAddModal}
        />
      )}

      {viewMode === 'archipelago3d' && contacts.length > 0 && (
        <div style={{ flex: 1, display: 'flex', minHeight: '380px' }} className="glass">
          <Archipelago3D 
            contacts={contacts}
            selectedContactId={selectedContact?.id}
            onSelectContact={setSelectedContact}
            activeFilter={activeFilter}
            onRightClickNode={(c, cx, cy) => setContextMenu({ x: cx, y: cy, visible: true, contact: c })}
            onRightClickCanvas={(cx, cy) => setContextMenu({ x: cx, y: cy, visible: true, contact: undefined })}
            onSelectLink={handleSelectLink}
            globalAvatarStyle={globalAvatarStyle}
            onDoubleClickNode={(c) => {
              setSelectedContact(c);
              setViewMode('avatar-builder');
            }}
            onToggleFullscreen={(fs) => setIsGraphFullscreen(fs)}
            onFilterChange={setActiveFilter}
            t={t}
            customCategories={customCategories}
            userProfile={userProfile}
          />
        </div>
      )}

      {viewMode === 'archipelago' && (
        <Archipelago2D 
          contacts={contacts}
          activeFilter={activeFilter}
          onSelectContact={setSelectedContact}
          onRightClickNode={(c, cx, cy) => setContextMenu({ x: cx, y: cy, visible: true, contact: c })}
          globalAvatarStyle={globalAvatarStyle}
          t={t}
          userProfile={userProfile}
        />
      )}

      {viewMode === 'list' && (
        <ListView 
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          t={t}
          globalAvatarStyle={globalAvatarStyle}
        />
      )}
    </div>
  );
};
