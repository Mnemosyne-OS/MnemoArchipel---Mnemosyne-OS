import { useState } from 'react';
import { Contact, CustomCategory, CustomWidgetDef, CustomWidgetField } from '../types';
import { renderContactAvatar } from './AvatarStudioComponent';
import { getCategoryColor } from '../utils/colors';
import { styles } from '../styles';
import { SidebarWidgetRenderer } from './SidebarWidgetRenderer';
import { formatRelationTag } from '../utils/helpers';

interface ContactDashboardProps {
  selectedContact: Contact;
  customCategories: CustomCategory[];
  t: (key: string) => string;
  globalAvatarStyle: 'human' | 'magical';
  handleUpdateContact: (c: Contact) => void;
  onClose: () => void;
  
  // Handlers for nested select & buttons
  handleAddCategory: (contactId: string, category: string) => void;
  handleRemoveCategory: (contactId: string, category: string) => void;
  handleUpdateSocial: (contactId: string, key: string, value: string) => void;
  handleRemoveSocial: (contactId: string, key: string) => void;
  handleAddSocialKey: (contactId: string, key: string) => void;
  handleSimulateContact: (contactId: string) => void;
  customWidgetDefs?: CustomWidgetDef[];
  contacts?: Contact[];
  onSelectContact?: (c: Contact) => void;
  onCreateCustomWidget?: (def: CustomWidgetDef) => void;
  userProfile?: any;
}

export function ContactDashboard({
  selectedContact,
  customCategories,
  t,
  globalAvatarStyle,
  handleUpdateContact,
  onClose,
  handleAddCategory,
  handleRemoveCategory,
  handleUpdateSocial,
  handleRemoveSocial,
  handleAddSocialKey,
  handleSimulateContact,
  customWidgetDefs = [],
  contacts = [],
  onSelectContact,
  onCreateCustomWidget,
  userProfile
}: ContactDashboardProps) {
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [subselectCategory, setSubselectCategory] = useState<string | null>(null);

  // Widget Builder local states
  const [widgetName, setWidgetName] = useState('');
  const [widgetFields, setWidgetFields] = useState<CustomWidgetField[]>([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'boolean'>('text');

  const renderDashboardCard = (widgetId: string, title: string) => {
    return (
      <div 
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
        className="glass"
      >
        <h3 style={{ ...styles.sidebarSubtitle, fontSize: '13px', margin: 0, paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
          {title}
        </h3>
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
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '20px' }}>
      
      {/* Top Banner Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative'
        }}
        className="glass"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ ...styles.avatarCircle, width: '72px', height: '72px', overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {renderContactAvatar(selectedContact, 72, globalAvatarStyle)}
          </div>
          <div>
            <h2 style={{ ...styles.sidebarTitle, fontSize: '20px', textAlign: 'left', margin: 0 }}>
              {selectedContact.name}
            </h2>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px', alignItems: 'center' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', padding: '10px', backgroundColor: 'var(--bg-deep)', borderRadius: '8px', border: '1px solid var(--border-subtle)', maxWidth: '280px' }}>
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
                    <option value="Son">{t('family_son') || 'Hijo / Fils'}</option>
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
        </div>

        {/* Stats Row & Close Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ ...styles.sidebarStatCard, padding: '10px 16px', minWidth: '90px' }}>
              <span style={styles.statLabel}>{t('sidebar_warmth')}</span>
              <span style={{ ...styles.statVal, color: 'var(--accent-emerald)' }}>{selectedContact.warmth}%</span>
            </div>
            <div style={{ ...styles.sidebarStatCard, padding: '10px 16px', minWidth: '90px' }}>
              <span style={styles.statLabel}>{t('sidebar_mood')}</span>
              <span style={styles.statVal}>{selectedContact.mood}</span>
            </div>
            <div style={{ ...styles.sidebarStatCard, padding: '10px 16px', minWidth: '110px' }}>
              <span style={styles.statLabel}>{t('sidebar_last_contact')}</span>
              <span style={{ ...styles.statVal, fontSize: '11px' }}>{selectedContact.lastContact}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAddingWidget(true)} 
            style={{
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid var(--accent-teal)',
              color: 'var(--accent-teal)',
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: 600,
              height: 'auto',
              borderRadius: '8px',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s'
            }}
          >
            ➕ {t('btn_create_widget') || 'Créer un Widget'}
          </button>

          <button 
            onClick={() => handleSimulateContact(selectedContact.id)} 
            style={{
              ...styles.btnSimulate,
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: 600,
              height: 'auto',
              borderRadius: '8px'
            }}
          >
            {t('btn_record_contact')}
          </button>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--bg-deep)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              fontSize: '16px',
              cursor: 'pointer',
              outline: 'none',
              marginLeft: '12px',
              transition: 'all 0.2s'
            }}
            title="Quitter"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 3-Column Dashboard Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {/* Column 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {renderDashboardCard('info', t('widget_info'))}
          {renderDashboardCard('journal', t('widget_journal'))}
          {renderDashboardCard('connections', t('widget_connections') || '🕸️ Relations Inter-Contacts')}
          {renderDashboardCard('evolution', t('widget_evolution'))}
          {customWidgetDefs.filter((_, i) => i % 3 === 0).map(w => renderDashboardCard(w.id, '🛠️ ' + w.name))}
        </div>

        {/* Column 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {renderDashboardCard('facts', t('widget_facts'))}
          {renderDashboardCard('tasks', t('widget_tasks'))}
          {renderDashboardCard('mementos', t('widget_mementos'))}
          {customWidgetDefs.filter((_, i) => i % 3 === 1).map(w => renderDashboardCard(w.id, '🛠️ ' + w.name))}
        </div>

        {/* Column 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {renderDashboardCard('pets', t('widget_pets'))}
          {renderDashboardCard('important_dates', t('widget_important_dates'))}
          {renderDashboardCard('debts', t('widget_debts'))}
          {renderDashboardCard('gifts', t('widget_gifts'))}
          {customWidgetDefs.filter((_, i) => i % 3 === 2).map(w => renderDashboardCard(w.id, '🛠️ ' + w.name))}
        </div>
      </div>

      {/* Dynamic Modal for Creating Custom Widgets */}
      {isAddingWidget && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(5, 6, 8, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div 
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            className="glass"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              <h3 style={{ ...styles.sidebarSubtitle, fontSize: '15px', margin: 0, color: 'var(--text-primary)' }}>
                🛠️ {t('settings_custom_widgets_title') || 'Créer un Widget Personnalisé'}
              </h3>
              <button 
                type="button" 
                onClick={() => {
                  setIsAddingWidget(false);
                  setWidgetName('');
                  setWidgetFields([]);
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '16px', cursor: 'pointer', outline: 'none' }}
              >
                ✕
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{t('widget_name_label') || 'Nom du Widget'}</label>
              <input 
                type="text" 
                value={widgetName}
                onChange={(e) => setWidgetName(e.target.value)}
                placeholder="ex: Habitudes Café"
                style={styles.input}
              />
            </div>

            {/* Configured fields preview */}
            {widgetFields.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Champs configurés :</span>
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

            {/* Field adding Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr auto', gap: '10px', alignItems: 'end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Nom du champ</span>
                <input 
                  type="text" 
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="ex: Préfère le lait"
                  style={styles.input}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Type</span>
                <select 
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as any)}
                  style={styles.select}
                >
                  <option value="text">Texte</option>
                  <option value="number">Nombre</option>
                  <option value="boolean">Boolean</option>
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
                ➕ Ajouter
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <button 
                type="button"
                onClick={() => {
                  setIsAddingWidget(false);
                  setWidgetName('');
                  setWidgetFields([]);
                }}
                style={styles.btnSecondary}
              >
                {t('btn_cancel')}
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (!widgetName.trim() || widgetFields.length === 0) return;
                  const widgetId = 'custom_' + widgetName.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substr(2, 4);
                  if (onCreateCustomWidget) {
                    onCreateCustomWidget({
                      id: widgetId,
                      name: widgetName.trim(),
                      fields: widgetFields
                    });
                  }
                  setIsAddingWidget(false);
                  setWidgetName('');
                  setWidgetFields([]);
                }}
                style={styles.btnPrimary}
                disabled={!widgetName.trim() || widgetFields.length === 0}
              >
                💾 {t('btn_save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
