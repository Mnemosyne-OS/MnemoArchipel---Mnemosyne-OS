import React from 'react';
import { renderAccessorySvg } from './AvatarStudioComponent';

interface AvatarAccessoriesModalProps {
  onClose: () => void;
  currentAccs: number[];
  onToggleAccessory: (id: number) => void;
}

export const AvatarAccessoriesModal: React.FC<AvatarAccessoriesModalProps> = ({
  onClose,
  currentAccs,
  onToggleAccessory
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: 'var(--bg-deep)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '24px',
        width: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Edit Accessory Badges</h3>
          <button 
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '16px' }}
          >
            ✕
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
          Select up to 5 items to display as small status orbit badges around the contact's avatar.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          maxHeight: '200px',
          overflowY: 'auto',
          padding: '4px'
        }}>
          {Array.from({ length: 17 }).map((_, id) => {
            const isSelected = currentAccs.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggleAccessory(id)}
                style={{
                  backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                  border: isSelected ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <g style={{ transform: 'scale(1.2)' }}>
                  {renderAccessorySvg(id)}
                </g>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            backgroundColor: 'var(--accent-emerald)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            padding: '8px',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};
