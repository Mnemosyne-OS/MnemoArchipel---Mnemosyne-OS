import { Contact, UserProfile } from '../types';
import { getCategoryColor } from '../utils/colors';
import { styles } from '../styles';
import { renderContactAvatar } from './AvatarStudioComponent';

interface Archipelago2DProps {
  contacts: Contact[];
  activeFilter: string;
  onSelectContact: (c: Contact) => void;
  onRightClickNode: (contact: Contact, clientX: number, clientY: number) => void;
  globalAvatarStyle?: 'human' | 'magical';
  t: (key: string) => string;
  userProfile?: UserProfile;
}

export function Archipelago2D({
  contacts,
  activeFilter,
  onSelectContact,
  onRightClickNode,
  globalAvatarStyle = 'human',
  t,
  userProfile
}: Archipelago2DProps) {
  const filtered = contacts.filter(c => 
    activeFilter === 'All' || 
    c.relations.some(r => r.toLowerCase().includes(activeFilter.toLowerCase()))
  );

  const userContact: Contact | null = userProfile ? {
    id: 'user-profile',
    name: `${userProfile.name} (${t('you') || 'You'})`,
    relations: ['User'],
    status: 'active',
    avatar: '👤',
    avatarConfig: userProfile.avatarConfig,
    warmth: 100,
    facts: [],
    mementos: [],
    lastContact: '',
    mood: 'neutral'
  } : null;

  const displayList = userContact && activeFilter === 'All' ? [userContact, ...filtered] : filtered;

  return (
    <div style={styles.archipelagoGrid}>
      {displayList.map((contact) => {
        let pulseClass = 'pulse-active-emerald';
        let accentColor = 'var(--accent-emerald)';
        
        if (contact.relations.length > 0) {
          accentColor = getCategoryColor(contact.relations[0]);
        }

        if (contact.status === 'warm') {
          pulseClass = 'pulse-active-amber';
        } else if (contact.status === 'dormant') {
          pulseClass = 'pulse-active-rose';
        }

        const size = 100 + (contact.warmth * 0.6);
        const debtsList = contact.debts || [];
        const activeOwe = debtsList.some(d => d.type === 'owe' && !d.settled);
        const activeOwed = debtsList.some(d => d.type === 'owed' && !d.settled);

        return (
          <div
            key={contact.id}
            onClick={() => contact.id !== 'user-profile' && onSelectContact(contact)}
            onContextMenu={(e) => {
              e.preventDefault();
              contact.id !== 'user-profile' && onRightClickNode(contact, e.clientX, e.clientY);
            }}
            style={{
              ...styles.archipelagoNode,
              width: `${size}px`,
              height: `${size}px`,
              borderColor: accentColor,
              boxShadow: `0 8px 32px ${accentColor}15`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Absolute Top-Left Debt Status Badge */}
            {(activeOwe || activeOwed) && (
              <div 
                style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '-4px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#0a0b0e',
                  border: `2px solid ${activeOwe ? 'var(--accent-rose)' : 'var(--accent-emerald)'}`,
                  color: '#ffffff',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  zIndex: 2,
                  userSelect: 'none'
                }}
                title={activeOwe ? t('debt_owe_tooltip') : t('debt_owed_tooltip')}
              >
                {activeOwe ? '💸' : '💰'}
              </div>
            )}
            <div 
              className={pulseClass} 
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: '50%',
                zIndex: -1
              }}
            />
            {/* Enlarged Avatar */}
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size * 0.55}px`, height: `${size * 0.55}px` }}>
              {renderContactAvatar(contact, size * 0.55, globalAvatarStyle)}
            </div>

            {/* Absolute Top-Right Warmth Badge */}
            <div 
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#0a0b0e',
                border: `2px solid ${accentColor}`,
                color: '#ffffff',
                fontSize: '9.5px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                zIndex: 2,
                userSelect: 'none'
              }}
              title={`Chaleur: ${contact.warmth}%`}
            >
              {contact.warmth}
            </div>

            {/* Absolute Bottom-Center Name Badge */}
            <div 
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(16, 18, 22, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '4px 10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                userSelect: 'none'
              }}
            >
              <span 
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#ffffff',
                  letterSpacing: '0.02em'
                }}
              >
                {contact.name.split(' ')[0]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
