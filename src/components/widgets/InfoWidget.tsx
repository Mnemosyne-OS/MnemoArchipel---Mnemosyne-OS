import React from 'react';
import { Contact } from '../../types';
import { SOCIAL_TYPES, getSocialIcon } from '../../utils/socialHelpers';

interface InfoWidgetProps {
  selectedContact: Contact;
  activeSocialKeys: string[];
  isAddingSocial: boolean;
  setIsAddingSocial: (val: boolean) => void;
  handleAddSocialKey: (id: string, key: string) => void;
  handleRemoveSocialKey: (id: string, key: string) => void;
  handleUpdateSocialValue: (id: string, key: string, value: string) => void;
  t: (key: string) => string;
}

export const InfoWidget: React.FC<InfoWidgetProps> = ({
  selectedContact,
  activeSocialKeys,
  isAddingSocial,
  setIsAddingSocial,
  handleAddSocialKey,
  handleRemoveSocialKey,
  handleUpdateSocialValue,
  t
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {activeSocialKeys.map(key => {
        const type = SOCIAL_TYPES.find(t => t.key === key);
        const val = selectedContact.socials?.[key] || '';
        return (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', width: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title={type?.label || key}>
              {getSocialIcon(key, 16)}
            </span>
            <input
              type="text"
              value={val}
              onChange={(e) => handleUpdateSocialValue(selectedContact.id, key, e.target.value)}
              placeholder={`Enter ${type?.label || key}...`}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none',
                padding: '4px 0'
              }}
            />
            <button
              type="button"
              onClick={() => handleRemoveSocialKey(selectedContact.id, key)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(239, 68, 68, 0.6)',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '2px 6px',
                transition: 'color 0.2s'
              }}
              title="Remove method"
            >
              ✕
            </button>
            {val && key === 'email' && (
              <a
                href={`mailto:${val}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(20, 184, 166, 0.12)',
                  border: '1px solid var(--accent-teal)',
                  borderRadius: '6px',
                  color: 'var(--accent-teal)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  textDecoration: 'none',
                  transition: 'all 0.15s'
                }}
                title={t('send_email')}
              >
                ✉️
              </a>
            )}
            {val && key === 'phone' && (
              <a
                href={`tel:${val}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid var(--accent-emerald)',
                  borderRadius: '6px',
                  color: 'var(--accent-emerald)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  textDecoration: 'none',
                  transition: 'all 0.15s'
                }}
                title={t('call_contact') || 'Appeler'}
              >
                📞
              </a>
            )}
          </div>
        );
      })}

      {isAddingSocial ? (
        <div style={{
          marginTop: '4px',
          padding: '8px',
          backgroundColor: 'rgba(0,0,0,0.15)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {SOCIAL_TYPES
              .filter(type => !activeSocialKeys.includes(type.key))
              .map(type => (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => {
                    handleAddSocialKey(selectedContact.id, type.key);
                    setIsAddingSocial(false);
                  }}
                  style={{
                    backgroundColor: 'var(--bg-deep)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'var(--text-primary)'
                  }}
                  title={type.label}
                >
                  {getSocialIcon(type.key, 16)}
                </button>
              ))
            }
          </div>
          <button 
            type="button"
            onClick={() => setIsAddingSocial(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '10px',
              textDecoration: 'underline',
              alignSelf: 'center'
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        SOCIAL_TYPES.filter(type => !activeSocialKeys.includes(type.key)).length > 0 && (
          <button
            type="button"
            onClick={() => setIsAddingSocial(true)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '6px',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: '4px',
              transition: 'all 0.2s',
              outline: 'none'
            }}
          >
            ➕ Add Contact Method
          </button>
        )
      )}
    </div>
  );
};
