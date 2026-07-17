import { Contact } from '../types';
import { styles } from '../styles';
import { renderContactAvatar } from './AvatarStudioComponent';

interface ListViewProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (c: Contact) => void;
  t: (key: string) => string;
  globalAvatarStyle?: 'human' | 'magical';
}

export function ListView({
  contacts,
  selectedContact,
  onSelectContact,
  t,
  globalAvatarStyle = 'human'
}: ListViewProps) {
  return (
    <div style={styles.listView}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeaderRow}>
            <th style={styles.tableHeader}>{t('table_contact')}</th>
            <th style={styles.tableHeader}>{t('table_relation')}</th>
            <th style={styles.tableHeader}>{t('table_last_contact')}</th>
            <th style={styles.tableHeader}>{t('table_warmth')}</th>
            <th style={styles.tableHeader}>{t('table_status')}</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr 
              key={c.id} 
              onClick={() => onSelectContact(c)} 
              style={{
                ...styles.tableRow,
                backgroundColor: selectedContact?.id === c.id ? 'rgba(255,255,255,0.06)' : 'transparent'
              }}
            >
              <td style={styles.tableCell}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '50%', marginRight: '8px', verticalAlign: 'middle' }}>
                  {renderContactAvatar(c, 20, globalAvatarStyle)}
                </div>
                <span style={{ fontWeight: 500 }}>{c.name}</span>
              </td>
              <td style={styles.tableCell}>{c.relations.join(', ')}</td>
              <td style={styles.tableCell}>{c.lastContact}</td>
              <td style={styles.tableCell}>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${c.warmth}%`, backgroundColor: c.status === 'active' ? 'var(--accent-emerald)' : c.status === 'warm' ? 'var(--accent-amber)' : 'var(--accent-rose)' }} />
                </div>
              </td>
              <td style={styles.tableCell}>
                <span style={{
                  ...styles.statusTag,
                  color: c.status === 'active' ? 'var(--accent-emerald)' : c.status === 'warm' ? 'var(--accent-amber)' : 'var(--accent-rose)',
                  backgroundColor: c.status === 'active' ? 'rgba(16,185,129,0.08)' : c.status === 'warm' ? 'rgba(245,158,11,0.08)' : 'rgba(244,63,94,0.08)'
                }}>
                  {c.status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
