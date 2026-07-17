import React, { useState } from 'react';
import { CustomCategory } from '../types';
import { styles } from '../styles';

interface CustomCategoriesSettingsProps {
  customCategories: CustomCategory[];
  onCreateCategory: (label: string, color: string) => void;
  onDeleteCategory: (key: string) => void;
  t: (key: string) => string;
}

export const CustomCategoriesSettings: React.FC<CustomCategoriesSettingsProps> = ({
  customCategories,
  onCreateCategory,
  onDeleteCategory,
  t
}) => {
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatColor, setNewCatColor] = useState('#10b981');

  const handleCreate = () => {
    if (!newCatLabel.trim()) return;
    onCreateCategory(newCatLabel.trim(), newCatColor);
    setNewCatLabel('');
  };

  return (
    <div style={styles.settingsSection}>
      <h3 style={styles.settingsSectionTitle}>{t('custom_cat_title')}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {customCategories.length > 0 ? (
          customCategories.map(cat => (
            <div 
              key={cat.key} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '6px 10px', 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '8px' 
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.color }} />
                <strong>{cat.label}</strong> <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({cat.key})</span>
              </span>
              <button 
                type="button"
                onClick={() => onDeleteCategory(cat.key)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}
              >
                {t('btn_delete')}
              </button>
            </div>
          ))
        ) : (
          <p style={{ ...styles.emptyText, margin: '4px 0', fontSize: '12px' }}>{t('custom_cat_empty')}</p>
        )}
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            value={newCatLabel} 
            onChange={(e) => setNewCatLabel(e.target.value)} 
            placeholder={t('custom_cat_placeholder')}
            style={{ ...styles.input, flex: 1, minWidth: '150px' }}
          />
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '110px' }}>
            {['#10b981', '#0ea5e9', '#f43f5e', '#a855f7', '#f59e0b', '#3b82f6', '#ec4899', '#f97316'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setNewCatColor(c)}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: newCatColor === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            ))}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input 
              type="color" 
              value={newCatColor} 
              onChange={(e) => setNewCatColor(e.target.value)}
              style={{ width: '24px', height: '24px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent' }}
            />
            <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{newCatColor}</span>
          </div>
          
          <button 
            type="button"
            onClick={handleCreate}
            style={{ ...styles.btnPrimary, padding: '6px 12px', fontSize: '12px' }}
          >
            {t('btn_add')}
          </button>
        </div>
      </div>
    </div>
  );
};
