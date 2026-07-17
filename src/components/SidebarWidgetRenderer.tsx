import React from 'react';
import { Contact, CustomCategory, CustomWidgetDef } from '../types';
import { getCategoryColor } from '../utils/colors';
import { styles } from '../styles';
import { InfoWidget } from './widgets/InfoWidget';
import { ConnectionsWidget } from './widgets/ConnectionsWidget';
import { PetsWidget } from './widgets/PetsWidget';
import { ImportantDatesWidget } from './widgets/ImportantDatesWidget';
import { GiftsWidget } from './widgets/GiftsWidget';
import { TasksWidget } from './widgets/TasksWidget';
import { DebtsWidget } from './widgets/DebtsWidget';
import { JournalWidget } from './widgets/JournalWidget';
import { CustomWidget } from './widgets/CustomWidget';

interface SidebarWidgetRendererProps {
  widgetId: string;
  selectedContact: Contact;
  customCategories: CustomCategory[];
  t: (key: string) => string;
  
  // Social states & handlers
  activeSocialKeys: string[];
  isAddingSocial: boolean;
  setIsAddingSocial: (val: boolean) => void;
  handleAddSocialKey: (id: string, key: string) => void;
  handleRemoveSocialKey: (id: string, key: string) => void;
  handleUpdateSocialValue: (id: string, key: string, value: string) => void;
  handleUpdateContact: (updatedContact: Contact) => void;
  customWidgetDefs?: CustomWidgetDef[];
  contacts?: Contact[];
  onSelectContact?: (c: Contact) => void;
  userProfile?: any;
}

/**
 * Orchestrates sidebar widgets rendering.
 * Delegates individual widgets logic to specialized modules inside components/widgets.
 */
export const SidebarWidgetRenderer: React.FC<SidebarWidgetRendererProps> = ({
  widgetId,
  selectedContact,
  customCategories,
  t,
  activeSocialKeys,
  isAddingSocial,
  setIsAddingSocial,
  handleAddSocialKey,
  handleRemoveSocialKey,
  handleUpdateSocialValue,
  handleUpdateContact,
  customWidgetDefs = [],
  contacts = [],
  onSelectContact,
  userProfile
}) => {
  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box' as const,
    backgroundColor: 'var(--bg-deep)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    padding: '6px 10px',
    fontSize: '12px',
    outline: 'none',
    fontFamily: 'inherit'
  };

  const btnStyle = {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid var(--accent-emerald)',
    borderRadius: '8px',
    color: 'var(--accent-emerald)',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    width: '100%',
    textAlign: 'center' as const,
    transition: 'all 0.2s'
  };

  switch (widgetId) {
    case 'info':
      return (
        <InfoWidget
          selectedContact={selectedContact}
          activeSocialKeys={activeSocialKeys}
          isAddingSocial={isAddingSocial}
          setIsAddingSocial={setIsAddingSocial}
          handleAddSocialKey={handleAddSocialKey}
          handleRemoveSocialKey={handleRemoveSocialKey}
          handleUpdateSocialValue={handleUpdateSocialValue}
          t={t}
        />
      );
    case 'facts':
      return selectedContact.facts && selectedContact.facts.length > 0 ? (
        <ul style={styles.factsList}>
          {selectedContact.facts.map((fact, idx) => (
            <li key={idx} style={styles.factItem}>
              <span style={styles.bullet}>•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_facts')}</p>
      );
    case 'evolution':
      return selectedContact.categoryHistory && selectedContact.categoryHistory.length > 0 ? (
        <div style={styles.mementoTimeline}>
          {selectedContact.categoryHistory.map((historyItem, idx) => {
            const custom = customCategories.find(c => c.key === historyItem.category);
            const label = custom ? custom.label : historyItem.category;
            return (
              <div key={idx} style={styles.timelineItem}>
                <div style={{ ...styles.timelinePoint, backgroundColor: getCategoryColor(historyItem.category) }} />
                <div style={styles.timelineContent}>
                  <span style={styles.timelineDate}>{historyItem.date}</span>
                  <p style={styles.timelineNote}>
                    {historyItem.action === 'added' ? '➕ Rattaché à' : '❌ Détaché de'} <strong>{label}</strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_evolution')}</p>
      );
    case 'mementos':
      return selectedContact.mementos && selectedContact.mementos.length > 0 ? (
        <div style={styles.mementoTimeline}>
          {selectedContact.mementos.map((memento, idx) => (
            <div key={idx} style={styles.timelineItem}>
              <div style={styles.timelinePoint} />
              <div style={styles.timelineContent}>
                <span style={styles.timelineDate}>{memento.date}</span>
                <p style={styles.timelineNote}>{memento.note}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_mementos')}</p>
      );
    case 'connections':
      return (
        <ConnectionsWidget
          selectedContact={selectedContact}
          contacts={contacts}
          handleUpdateContact={handleUpdateContact}
          onSelectContact={onSelectContact}
          t={t}
          inputStyle={inputStyle}
          btnStyle={btnStyle}
          userProfile={userProfile}
        />
      );
    case 'pets':
      return (
        <PetsWidget
          selectedContact={selectedContact}
          handleUpdateContact={handleUpdateContact}
          t={t}
          inputStyle={inputStyle}
          btnStyle={btnStyle}
        />
      );
    case 'important_dates':
      return (
        <ImportantDatesWidget
          selectedContact={selectedContact}
          handleUpdateContact={handleUpdateContact}
          t={t}
          inputStyle={inputStyle}
          btnStyle={btnStyle}
        />
      );
    case 'gifts':
      return (
        <GiftsWidget
          selectedContact={selectedContact}
          handleUpdateContact={handleUpdateContact}
          t={t}
          inputStyle={inputStyle}
          btnStyle={btnStyle}
        />
      );
    case 'tasks':
      return (
        <TasksWidget
          selectedContact={selectedContact}
          handleUpdateContact={handleUpdateContact}
          t={t}
          inputStyle={inputStyle}
          btnStyle={btnStyle}
        />
      );
    case 'debts':
      return (
        <DebtsWidget
          selectedContact={selectedContact}
          handleUpdateContact={handleUpdateContact}
          t={t}
          inputStyle={inputStyle}
          btnStyle={btnStyle}
        />
      );
    case 'journal':
      return (
        <JournalWidget
          selectedContact={selectedContact}
          handleUpdateContact={handleUpdateContact}
          t={t}
          btnStyle={btnStyle}
        />
      );
    default:
      return (
        <CustomWidget
          selectedContact={selectedContact}
          widgetId={widgetId}
          customWidgetDefs={customWidgetDefs}
          handleUpdateContact={handleUpdateContact}
          inputStyle={inputStyle}
        />
      );
  }
};
