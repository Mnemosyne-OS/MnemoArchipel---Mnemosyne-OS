import { useState, useEffect } from 'react';
import { Contact, CustomCategory, AvatarStudioConfig, CustomWidgetDef } from '../types';
import { renderContactAvatar } from './AvatarStudioComponent';
import { getCategoryColor } from '../utils/colors';
import { styles } from '../styles';
import { AvatarQuickBuilder } from './AvatarQuickBuilder';
import { EmojiCatalogPicker } from './EmojiCatalogPicker';
import { formatRelationTag } from '../utils/helpers';

import { SidebarWidgetRenderer } from './SidebarWidgetRenderer';

interface DetailsSidebarProps {
  selectedContact: Contact | null;
  viewMode: string;
  setViewMode: (val: any) => void;
  customCategories: CustomCategory[];
  t: (key: string) => string;
  
  // Handlers
  handleAddCategory: (contactId: string, category: string) => void;
  handleRemoveCategory: (contactId: string, category: string) => void;
  handleSaveAvatar: (contactId: string, config: AvatarStudioConfig | undefined, emoji?: string) => void;
  handleSimulateContact: (contactId: string) => void;
  
  // Social updates
  handleUpdateSocial: (contactId: string, key: string, value: string) => void;
  handleRemoveSocial: (contactId: string, key: string) => void;
  handleAddSocialKey: (contactId: string, key: string) => void;
  globalAvatarStyle: 'human' | 'magical';
  handleUpdateContact: (updatedContact: Contact) => void;
  customWidgetDefs?: CustomWidgetDef[];
  contacts?: Contact[];
  onSelectContact?: (c: Contact) => void;
  userProfile?: any;
}

export function DetailsSidebar({
  selectedContact,
  viewMode,
  setViewMode,
  customCategories,
  t,
  handleAddCategory,
  handleRemoveCategory,
  handleSaveAvatar,
  handleSimulateContact,
  handleUpdateSocial,
  handleRemoveSocial,
  handleAddSocialKey,
  globalAvatarStyle,
  handleUpdateContact,
  customWidgetDefs = [],
  contacts = [],
  onSelectContact,
  userProfile
}: DetailsSidebarProps) {
  // Avatar builder state
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [editTab, setEditTab] = useState<'custom' | 'emoji'>('custom');
  const [editingAvatarConfig, setEditingAvatarConfig] = useState<AvatarStudioConfig>({
    body: 0,
    color: '#d97706',
    eyes: 0,
    nose: 0,
    mouth: 0,
    hat: 0
  });
  
  // Widget ordering and list
  const [widgetOrder, setWidgetOrder] = useState<string[]>(['info', 'facts', 'connections', 'pets', 'important_dates', 'gifts', 'tasks', 'debts', 'journal', 'evolution', 'mementos']);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [subselectCategory, setSubselectCategory] = useState<string | null>(null);

  useEffect(() => {
    const defaultWidgets = ['info', 'facts', 'connections', 'pets', 'important_dates', 'gifts', 'tasks', 'debts', 'journal', 'evolution', 'mementos'];
    const customIds = customWidgetDefs.map(w => w.id);
    const allExpected = [...defaultWidgets, ...customIds];
    
    setWidgetOrder(prev => {
      const filtered = prev.filter(w => allExpected.includes(w));
      const added = allExpected.filter(w => !filtered.includes(w));
      return [...filtered, ...added];
    });
  }, [customWidgetDefs]);

  // Sync builder config when contact or editing state changes
  useEffect(() => {
    if (selectedContact) {
      setEditingAvatarConfig(selectedContact.avatarConfig || {
        body: 0,
        color: '#d97706',
        eyes: 0,
        nose: 0,
        mouth: 0,
        hat: 0
      });
    }
  }, [selectedContact, isEditingAvatar]);

  if (!selectedContact || viewMode === 'settings') {
    return (
      <div style={styles.emptySidebar}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {t('sidebar_empty_title')}
        </h3>
        <p style={{ ...styles.emptyText, margin: 0 }}>
          {t('sidebar_empty_desc')}
        </p>
      </div>
    );
  }

  // Compare config to check if changes were made
  const sidebarHasChanges = JSON.stringify(selectedContact.avatarConfig || {}) !== JSON.stringify(editingAvatarConfig);

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= widgetOrder.length) return;
    const newOrder = [...widgetOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[nextIndex];
    newOrder[nextIndex] = temp;
    setWidgetOrder(newOrder);
  };

  return (
    <div style={styles.sidebarContent}>
      <div style={styles.sidebarHeader}>
        <div style={{ ...styles.avatarCircle, overflow: 'visible', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderContactAvatar(selectedContact, 64, globalAvatarStyle)}
          <button 
            onClick={() => setIsEditingAvatar(prev => !prev)}
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '11px',
              zIndex: 10,
              outline: 'none'
            }}
            title="Customize Avatar"
          >
            🎨
          </button>
        </div>
        <h2 style={styles.sidebarTitle}>{selectedContact.name}</h2>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: '8px' }}>
          {selectedContact.relations.map((rel, idx) => (
            <span 
              key={idx} 
              style={{ 
                ...styles.relationTag, 
                color: getCategoryColor(rel),
                backgroundColor: getCategoryColor(rel) + '15',
                borderColor: getCategoryColor(rel) + '30',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px'
              }}
            >
              {formatRelationTag(rel, t)}
              {selectedContact.relations.length > 1 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemoveCategory(selectedContact.id, rel); }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: getCategoryColor(rel),
                    cursor: 'pointer',
                    fontSize: '11px',
                    padding: '0 2px',
                    fontWeight: 'bold',
                    opacity: 0.7
                  }}
                  title="Remove category"
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {[
            'Friend', 'Colleague', 'Family', 'Mentor', 'Neighbor', 'Acquaintance',
            ...customCategories.map(c => c.key)
          ].filter(cat => {
            if (cat === 'Family') {
              return !selectedContact.relations.some(r => r.startsWith('Family'));
            }
            return !selectedContact.relations.includes(cat);
          }).length > 0 && (
            <select
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'Family') {
                  setSubselectCategory('Family');
                } else if (val) {
                  handleAddCategory(selectedContact.id, val);
                }
              }}
              style={{
                backgroundColor: 'var(--bg-deep)',
                border: '1px dashed var(--border-subtle)',
                borderRadius: '12px',
                padding: '4px 8px',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="" disabled style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>+ Ajouter...</option>
              {[
                'Friend', 'Colleague', 'Family', 'Mentor', 'Neighbor', 'Acquaintance',
                ...customCategories.map(c => c.key)
              ]
                .filter(cat => {
                  if (cat === 'Family') {
                    return !selectedContact.relations.some(r => r.startsWith('Family'));
                  }
                  return !selectedContact.relations.includes(cat);
                })
                .map(cat => {
                  const custom = customCategories.find(c => c.key === cat);
                  const label = custom ? custom.label : cat;
                  return (
                    <option key={cat} value={cat} style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                      {label}
                    </option>
                  );
                })
              }
            </select>
          )}
        </div>

        {subselectCategory === 'Family' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '8px 16px 0 16px', padding: '10px', backgroundColor: 'var(--bg-deep)', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('family_relation_type') || 'Lien de parenté :'}</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <select
                onChange={(e) => {
                  const subtype = e.target.value;
                  if (subtype === 'other') {
                    const custom = prompt(t('family_other_prompt') || 'Entrez le type de relation familiale :');
                    if (custom) {
                      handleAddCategory(selectedContact.id, `Family (${custom})`);
                    }
                  } else if (subtype) {
                    handleAddCategory(selectedContact.id, `Family (${subtype})`);
                  }
                  setSubselectCategory(null);
                }}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  padding: '6px',
                  fontSize: '11px',
                  outline: 'none'
                }}
                value=""
              >
                <option value="" disabled>-- {t('select') || 'Sélectionner'} --</option>
                <option value="Daughter">{t('family_daughter') || 'Fille'}</option>
                <option value="Son">{t('family_son') || 'Fils'}</option>
                <option value="Sister">{t('family_sister') || 'Sœur'}</option>
                <option value="Brother">{t('family_brother') || 'Frère'}</option>
                <option value="Mother">{t('family_mother') || 'Mère'}</option>
                <option value="Father">{t('family_father') || 'Père'}</option>
                <option value="Partner">{t('family_partner') || 'Conjoint(e)'}</option>
                <option value="Uncle">{t('family_uncle') || 'Oncle'}</option>
                <option value="Aunt">{t('family_aunt') || 'Tante'}</option>
                <option value="Cousin">{t('family_cousin') || 'Cousin(e)'}</option>
                <option value="other">{t('family_other') || 'Autre...'}</option>
              </select>
              <button 
                onClick={() => setSubselectCategory(null)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px 8px',
                  fontWeight: 'bold'
                }}
                title="Cancel"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {isEditingAvatar && (
        <div style={{ margin: '12px 16px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
            <button 
              type="button"
              onClick={() => setEditTab('custom')} 
              style={{
                flex: 1,
                padding: '6px',
                backgroundColor: editTab === 'custom' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                border: editTab === 'custom' ? '1px solid var(--accent-emerald)' : '1px solid transparent',
                borderRadius: '6px',
                color: editTab === 'custom' ? 'var(--accent-emerald)' : '#9ca3af',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none'
              }}
            >
              🤖 {t('avatar_tab_custom') || 'Customize'}
            </button>
            <button 
              type="button"
              onClick={() => setEditTab('emoji')} 
              style={{
                flex: 1,
                padding: '6px',
                backgroundColor: editTab === 'emoji' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                border: editTab === 'emoji' ? '1px solid var(--accent-emerald)' : '1px solid transparent',
                borderRadius: '6px',
                color: editTab === 'emoji' ? 'var(--accent-emerald)' : '#9ca3af',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none'
              }}
            >
              🏷️ {t('avatar_tab_emoji') || 'Emoji Catalog'}
            </button>
          </div>

          {editTab === 'custom' ? (
            <AvatarQuickBuilder 
              editingAvatarConfig={editingAvatarConfig}
              setEditingAvatarConfig={setEditingAvatarConfig}
              setViewMode={setViewMode}
              onCancel={() => setIsEditingAvatar(false)}
              onSave={() => {
                handleSaveAvatar(selectedContact.id, editingAvatarConfig);
                setIsEditingAvatar(false);
              }}
              sidebarHasChanges={sidebarHasChanges}
              style={globalAvatarStyle}
              t={t}
            />
          ) : (
            <EmojiCatalogPicker 
              onSelectEmoji={(emoji) => {
                handleSaveAvatar(selectedContact.id, undefined, emoji);
                setIsEditingAvatar(false);
              }}
            />
          )}
        </div>
      )}

      <div style={styles.sidebarStatsGrid}>
        <div style={styles.sidebarStatCard}>
          <span style={styles.statLabel}>{t('sidebar_warmth')}</span>
          <span style={{ 
            ...styles.statVal, 
            color: selectedContact.status === 'active' ? 'var(--accent-emerald)' : selectedContact.status === 'warm' ? 'var(--accent-amber)' : 'var(--accent-rose)' 
          }}>
            {selectedContact.warmth}%
          </span>
        </div>
        <div style={styles.sidebarStatCard}>
          <span style={styles.statLabel}>{t('sidebar_mood')}</span>
          <span style={styles.statVal}>{selectedContact.mood}</span>
        </div>
        <div style={styles.sidebarStatCard}>
          <span style={styles.statLabel}>{t('sidebar_last_contact')}</span>
          <span style={{ ...styles.statVal, fontSize: '11px' }}>{selectedContact.lastContact}</span>
        </div>
      </div>

      <div style={{ ...styles.actionButtonsRow, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={() => handleSimulateContact(selectedContact.id)} 
          style={styles.btnSimulate}
        >
          {t('btn_record_contact')}
        </button>
        <button 
          onClick={() => setViewMode('contact-dashboard')} 
          style={{
            backgroundColor: 'rgba(14, 165, 233, 0.15)',
            border: '1px solid var(--accent-teal)',
            borderRadius: '8px',
            color: 'var(--accent-teal)',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          🖥️ {t('btn_open_dashboard')}
        </button>
      </div>

      {/* Reorderable Widget List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
        {widgetOrder.map((widgetId, index) => {
          let title = '';
          if (widgetId === 'info') title = t('widget_info');
          else if (widgetId === 'facts') title = t('widget_facts');
          else if (widgetId === 'connections') title = t('widget_connections');
          else if (widgetId === 'pets') title = t('widget_pets');
          else if (widgetId === 'important_dates') title = t('widget_important_dates');
          else if (widgetId === 'gifts') title = t('widget_gifts');
          else if (widgetId === 'tasks') title = t('widget_tasks');
          else if (widgetId === 'debts') title = t('widget_debts');
          else if (widgetId === 'journal') title = t('widget_journal');
          else if (widgetId === 'evolution') title = t('widget_evolution');
          else if (widgetId === 'mementos') title = t('widget_mementos');
          else {
            const customDef = customWidgetDefs.find(w => w.id === widgetId);
            title = customDef ? '🛠️ ' + customDef.name : widgetId;
          }

          return (
            <div 
              key={widgetId} 
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '12px' }}>
                <h3 style={styles.sidebarSubtitle}>{title}</h3>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => moveWidget(index, 'up')} 
                    disabled={index === 0}
                    style={{ background: 'transparent', border: 'none', color: index === 0 ? 'rgba(255,255,255,0.1)' : 'var(--text-secondary)', cursor: index === 0 ? 'default' : 'pointer', fontSize: '10px' }}
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button 
                    onClick={() => moveWidget(index, 'down')} 
                    disabled={index === widgetOrder.length - 1}
                    style={{ background: 'transparent', border: 'none', color: index === widgetOrder.length - 1 ? 'rgba(255,255,255,0.1)' : 'var(--text-secondary)', cursor: index === widgetOrder.length - 1 ? 'default' : 'pointer', fontSize: '10px' }}
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
              </div>
              <SidebarWidgetRenderer
                widgetId={widgetId}
                selectedContact={selectedContact}
                customCategories={customCategories}
                t={t}
                activeSocialKeys={Object.keys(selectedContact.socials || {})}
                isAddingSocial={isAddingSocial}
                setIsAddingSocial={setIsAddingSocial}
                handleAddSocialKey={handleAddSocialKey}
                handleRemoveSocialKey={handleRemoveSocial}
                handleUpdateSocialValue={handleUpdateSocial}
                handleUpdateContact={handleUpdateContact}
                customWidgetDefs={customWidgetDefs}
                contacts={contacts}
                onSelectContact={onSelectContact}
                userProfile={userProfile}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
