import { useState, useEffect } from 'react';
import { styles } from './styles';
import { useCrmState } from './hooks/useCrmState';

// Extracted Components
import { Archipelago3D } from './components/Archipelago3D';
import { DetailsSidebar } from './components/DetailsSidebar';
import { ContactDashboard } from './components/ContactDashboard';
import { AddContactModal } from './components/AddContactModal';
import { AddFactModal } from './components/AddFactModal';
import { Setup2FAModal } from './components/Setup2FAModal';
import { SecurityGate } from './components/SecurityGate';
import { AvatarStudio } from './components/AvatarStudio';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { NotificationCenter } from './components/NotificationCenter';
import { ConfirmModal } from './components/ConfirmModal';
import { CrmContextMenu } from './components/CrmContextMenu';
import { MainWorkspace } from './components/MainWorkspace';

// Utilities
import { getTranslation } from './utils/i18n';

export default function App() {
  const {
    langPreference,
    setLangPreference,
    activeLang,
    contacts,
    selectedContact,
    setSelectedContact,
    viewMode,
    setViewMode,
    activeFilter,
    setActiveFilter,
    isLocked,
    setIsLocked,
    lockEnabled,
    lockType,
    setLockType,
    storedPassword,
    showAddModal,
    setShowAddModal,
    showFactModal,
    setShowFactModal,
    isSettingUp2FA,
    setIsSettingUp2FA,
    factTargetContact,
    setFactTargetContact,
    contextMenu,
    setContextMenu,
    highlightedLink,
    setHighlightedLink,
    brainDump,
    setBrainDump,
    extractionResult,
    isExtracting,
    searchQuery,
    setSearchQuery,
    isSearching,
    ragAnswer,
    setRagAnswer,
    errorMsg,
    isHostOnline,
    customCategories,
    handleAddContact,
    handleDeleteContact,
    handleSaveAvatar,
    handleSimulateContact,
    handleAddFact,
    handleCreateCategory,
    handleDeleteCategory,
    handleAddCategoryToContact,
    handleRemoveCategoryFromContact,
    handleUpdateSocial,
    handleRemoveSocial,
    handleAddSocialKey,
    handleBrainDump,
    handleSearch,
    handleLoadDemoData,
    handlePurgeAllData,
    handleToggleLock,
    handleSavePassword,
    confirmDialog,
    setConfirmDialog,
    globalAvatarStyle,
    handleToggleAvatarStyle,
    setGlobalAvatarStyle,
    handleUpdateContact,
    customWidgetDefs,
    handleCreateCustomWidget,
    handleDeleteCustomWidget,
    theme,
    handleToggleTheme,
    githubUpdateStatus,
    githubLatestVersion,
    checkGithubUpdates,
    userProfile,
    handleUpdateUserProfile,
    notificationSettings,
    handleUpdateNotificationSettings,
    notifications,
    handleImportContacts,
    handleImportDatabase,
    handleExportDatabase
  } = useCrmState();

  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);
  const [isBrainDumpExpanded, setIsBrainDumpExpanded] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifTray, setShowNotifTray] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.title = activeLang === 'fr' 
      ? "L'Archipel — Mnemosyne OS Cartridge" 
      : activeLang === 'es'
        ? "El Archipiélago — Mnemosyne OS Cartridge"
        : "The Archipel — Mnemosyne OS Cartridge";
  }, [activeLang]);

  const handleSelectLink = (c1: any, c2: any) => {
    setHighlightedLink({ c1, c2 });
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    return getTranslation(activeLang, key, replacements);
  };

  if (isLocked) {
    return (
      <SecurityGate 
        lockType={lockType}
        storedPassword={storedPassword}
        onUnlock={() => setIsLocked(false)}
        t={t}
      />
    );
  }

  if (viewMode === 'avatar-builder') {
    return (
      <AvatarStudio 
        contacts={contacts}
        initialContactId={selectedContact?.id}
        onSave={handleSaveAvatar}
        onClose={() => setViewMode('archipelago')}
        style={globalAvatarStyle}
        userProfile={userProfile}
        onSaveUserAvatar={(cfg) => handleUpdateUserProfile({ ...userProfile, avatarConfig: cfg })}
        t={t}
      />
    );
  }

  if (isGraphFullscreen && viewMode === 'archipelago3d' && contacts.length > 0) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--bg-deep)', position: 'relative' }}>
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
            setIsGraphFullscreen(false);
          }}
          onToggleFullscreen={(fs) => setIsGraphFullscreen(fs)}
          onFilterChange={setActiveFilter}
          t={t}
          isFullscreen={true}
          customCategories={customCategories}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header
        theme={theme}
        handleToggleTheme={handleToggleTheme}
        globalAvatarStyle={globalAvatarStyle}
        handleToggleAvatarStyle={handleToggleAvatarStyle}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isHostOnline={isHostOnline}
        githubUpdateStatus={githubUpdateStatus}
        githubLatestVersion={githubLatestVersion}
        setShowAddModal={setShowAddModal}
        t={t}
        userProfile={userProfile}
        onOpenProfile={() => setShowProfileModal(true)}
        notifications={notifications}
        showNotifTray={showNotifTray}
        setShowNotifTray={setShowNotifTray}
      />

      {/* CORE WORKSPACE */}
      <div style={styles.mainLayout}>
        <div style={styles.canvasContainer}>
          {viewMode === 'contact-dashboard' && selectedContact ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '6px' }}>
              <ContactDashboard
                selectedContact={selectedContact}
                customCategories={customCategories}
                t={t}
                globalAvatarStyle={globalAvatarStyle}
                handleUpdateContact={handleUpdateContact}
                onClose={() => setViewMode('archipelago')}
                handleAddCategory={handleAddCategoryToContact}
                handleRemoveCategory={handleRemoveCategoryFromContact}
                handleUpdateSocial={handleUpdateSocial}
                handleRemoveSocial={handleRemoveSocial}
                handleAddSocialKey={handleAddSocialKey}
                handleSimulateContact={handleSimulateContact}
                customWidgetDefs={customWidgetDefs}
                contacts={contacts}
                onSelectContact={setSelectedContact}
                onCreateCustomWidget={handleCreateCustomWidget}
                userProfile={userProfile}
              />
            </div>
          ) : (
            <MainWorkspace
              viewMode={viewMode}
              setViewMode={setViewMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              isSearching={isSearching}
              ragAnswer={ragAnswer}
              setRagAnswer={setRagAnswer}
              highlightedLink={highlightedLink}
              setHighlightedLink={setHighlightedLink}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              customCategories={customCategories}
              contacts={contacts}
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
              globalAvatarStyle={globalAvatarStyle}
              handleUpdateContact={handleUpdateContact}
              userProfile={userProfile}
              customWidgetDefs={customWidgetDefs}
              handleCreateCustomWidget={handleCreateCustomWidget}
              handleDeleteCustomWidget={handleDeleteCustomWidget}
              githubUpdateStatus={githubUpdateStatus}
              githubLatestVersion={githubLatestVersion}
              checkGithubUpdates={checkGithubUpdates}
              handleLoadDemoData={handleLoadDemoData}
              handlePurgeAllData={handlePurgeAllData}
              handleToggleLock={handleToggleLock}
              lockEnabled={lockEnabled}
              lockType={lockType}
              setLockType={setLockType}
              setIsSettingUp2FA={setIsSettingUp2FA}
              storedPassword={storedPassword}
              handleSavePassword={handleSavePassword}
              handleCreateCategory={handleCreateCategory}
              handleDeleteCategory={handleDeleteCategory}
              onExportDatabase={handleExportDatabase}
              onImportDatabase={handleImportDatabase}
              onImportContacts={handleImportContacts}
              setShowAddModal={setShowAddModal}
              t={t}
              setContextMenu={setContextMenu}
              handleSelectLink={handleSelectLink}
              setIsGraphFullscreen={setIsGraphFullscreen}
              langPreference={langPreference}
              setLangPreference={setLangPreference}
              setGlobalAvatarStyle={setGlobalAvatarStyle}
            />
          )}

          {/* Quick Brain Dump Panel */}
          {viewMode !== 'settings' && viewMode !== 'timeline' && viewMode !== 'contact-dashboard' && viewMode !== 'dashboard' && (
            isBrainDumpExpanded ? (
              <div style={styles.brainDumpSection} className="glass">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ ...styles.sectionSubtitle, margin: 0 }}>{t('brain_dump_title')}</h3>
                  <button 
                    type="button"
                    onClick={() => setIsBrainDumpExpanded(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  >
                    ✕ {t('brain_dump_collapse')}
                  </button>
                </div>
                <p style={styles.sectionDesc}>{t('brain_dump_desc')}</p>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={brainDump}
                    onChange={(e) => setBrainDump(e.target.value)}
                    placeholder={t('brain_dump_placeholder')}
                    style={styles.brainDumpTextarea}
                    rows={3}
                    disabled={isExtracting}
                  />
                  <button
                    onClick={handleBrainDump}
                    disabled={isExtracting || !brainDump.trim()}
                    style={isExtracting ? { ...styles.distillBtn, opacity: 0.6 } : styles.distillBtn}
                  >
                    {isExtracting ? '...' : t('btn_distill')}
                  </button>
                </div>
                {extractionResult && <div style={styles.successBox}>✅ {extractionResult}</div>}
                {errorMsg && <div style={{ ...styles.successBox, backgroundColor: 'rgba(244,63,94,0.06)', borderColor: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)' }}>❌ {errorMsg}</div>}
              </div>
            ) : (
              <div 
                style={styles.brainDumpCollapsed} 
                className="glass glass-interactive"
                onClick={() => setIsBrainDumpExpanded(true)}
              >
                <span style={{ fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✍️ {t('brain_dump_title').replace('✍️ ', '').replace('🧠 ', '').replace('✍️', '')}
                </span>
                <button
                  type="button"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid var(--accent-emerald)',
                    borderRadius: '6px',
                    color: 'var(--accent-emerald)',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  📝 {t('brain_dump_expand')}
                </button>
              </div>
            )
          )}
        </div>

        {/* SIDEBAR DETAILS PANEL */}
        {viewMode !== 'contact-dashboard' && viewMode !== 'dashboard' && (
          <aside style={styles.detailsSidebar} className="glass">
            <DetailsSidebar 
              selectedContact={selectedContact}
              viewMode={viewMode}
              setViewMode={setViewMode}
              customCategories={customCategories}
              t={t}
              handleAddCategory={handleAddCategoryToContact}
              handleRemoveCategory={handleRemoveCategoryFromContact}
              handleSaveAvatar={handleSaveAvatar}
              handleSimulateContact={handleSimulateContact}
              handleUpdateSocial={handleUpdateSocial}
              handleRemoveSocial={handleRemoveSocial}
              handleAddSocialKey={handleAddSocialKey}
              globalAvatarStyle={globalAvatarStyle}
              handleUpdateContact={handleUpdateContact}
              customWidgetDefs={customWidgetDefs}
              contacts={contacts}
              onSelectContact={setSelectedContact}
              userProfile={userProfile}
            />
          </aside>
        )}
      </div>

      {/* MODALS */}
      {showAddModal && (
        <AddContactModal 
          onClose={() => setShowAddModal(false)}
          customCategories={customCategories}
          onAddContact={handleAddContact}
          onCreateCategory={handleCreateCategory}
          t={t}
          globalAvatarStyle={globalAvatarStyle}
        />
      )}

      {showFactModal && factTargetContact && (
        <AddFactModal 
          onClose={() => { setShowFactModal(false); setFactTargetContact(null); }}
          contactName={factTargetContact.name}
          onAddFact={handleAddFact}
          t={t}
        />
      )}

      {isSettingUp2FA && (
        <Setup2FAModal 
          onClose={() => setIsSettingUp2FA(false)}
          onSuccess={(secret) => {
            localStorage.setItem('crm_lock_enabled', 'true');
            localStorage.setItem('crm_2fa_secret', secret);
            localStorage.setItem('crm_lock_type', '2fa');
            handleToggleLock(true);
            setLockType('2fa');
          }}
          t={t}
        />
      )}

      {confirmDialog && (
        <ConfirmModal
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* CONTEXT MENU */}
      {contextMenu.visible && (
        <CrmContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          contact={contextMenu.contact}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
          onSimulateContact={handleSimulateContact}
          onAddFact={(c) => {
            setFactTargetContact(c);
            setShowFactModal(true);
          }}
          onDeleteContact={handleDeleteContact}
          onAddContactClick={() => setShowAddModal(true)}
          t={t}
        />
      )}

      {/* SELF PROFILE MODAL */}
      {showProfileModal && (
        <ProfileModal
          userProfile={userProfile}
          onSave={handleUpdateUserProfile}
          onClose={() => setShowProfileModal(false)}
          onOpenAvatarBuilder={() => {
            setSelectedContact(null);
            setViewMode('avatar-builder');
          }}
          globalAvatarStyle={globalAvatarStyle}
          t={t}
        />
      )}

      {/* NOTIFICATION CENTER */}
      {showNotifTray && (
        <NotificationCenter
          notifications={notifications}
          contacts={contacts}
          settings={notificationSettings}
          onUpdateSettings={handleUpdateNotificationSettings}
          onClose={() => setShowNotifTray(false)}
          onGoToContact={(id) => {
            const found = contacts.find(c => c.id === id);
            if (found) {
              setSelectedContact(found);
              setViewMode('contact-dashboard');
            }
          }}
          onSimulateContact={handleSimulateContact}
          t={t}
          activeLang={activeLang}
        />
      )}
    </div>
  );
}
