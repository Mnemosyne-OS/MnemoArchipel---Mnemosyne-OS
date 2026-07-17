import { AvatarStudioConfig } from '../types';
import { AvatarFeaturePreview, AvatarStudioComponent } from './AvatarStudioComponent';

interface AvatarQuickBuilderProps {
  editingAvatarConfig: AvatarStudioConfig;
  setEditingAvatarConfig: (val: AvatarStudioConfig | ((prev: AvatarStudioConfig) => AvatarStudioConfig)) => void;
  setViewMode?: (mode: string) => void;
  onCancel?: () => void;
  onSave?: () => void;
  sidebarHasChanges?: boolean;
  hideActions?: boolean;
  style?: 'human' | 'magical';
  t: (key: string) => string;
}

export function AvatarQuickBuilder({
  editingAvatarConfig,
  setEditingAvatarConfig,
  setViewMode = () => {},
  onCancel = () => {},
  onSave = () => {},
  sidebarHasChanges = false,
  hideActions = false,
  style = 'human',
  t
}: AvatarQuickBuilderProps) {
  return (
    <div style={{ 
      margin: '12px 16px', 
      padding: '12px', 
      backgroundColor: 'var(--bg-deep)', 
      border: '1px solid var(--border-subtle)', 
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <h3 style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🤖 Avatar Builder</span>
        {!hideActions && (
          <button 
            type="button"
            onClick={() => { setViewMode('avatar-builder'); onCancel(); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', cursor: 'pointer', fontSize: '10px', textDecoration: 'underline', padding: 0 }}
          >
            Mode Expert ➔
          </button>
        )}
      </h3>
      
      {/* Color selection */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Teint</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#fcd34d', '#fdba74', '#b45309', '#ffedd5', '#fecdd3'].map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setEditingAvatarConfig(prev => ({ ...prev, color }))}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: color,
                border: editingAvatarConfig.color === color ? '2px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                padding: 0
              }}
            />
          ))}
        </div>
      </div>

      {/* Forme du visage */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Visage</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2, 3, 4].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setEditingAvatarConfig(prev => ({ ...prev, body: idx }))}
              style={{
                backgroundColor: editingAvatarConfig.body === idx ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-deep)',
                border: editingAvatarConfig.body === idx ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                borderRadius: '6px',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
              title={['Classique', 'Allongé', 'Carré', 'Triangle', 'Joufflu'][idx]}
            >
              <AvatarFeaturePreview type="body" value={idx} color={editingAvatarConfig.color} />
            </button>
          ))}
        </div>
      </div>

      {/* Eyes selection */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Yeux</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setEditingAvatarConfig(prev => ({ ...prev, eyes: idx }))}
              style={{
                backgroundColor: editingAvatarConfig.eyes === idx ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-deep)',
                border: editingAvatarConfig.eyes === idx ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                borderRadius: '6px',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
              title={['Points', 'Squint', 'Lunettes', 'Clin d’œil'][idx]}
            >
              <AvatarFeaturePreview type="eyes" value={idx} eyeColor={editingAvatarConfig.eyeColor} />
            </button>
          ))}
        </div>
      </div>

      {/* Nose selection */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Détails</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setEditingAvatarConfig(prev => ({ ...prev, nose: idx }))}
              style={{
                backgroundColor: editingAvatarConfig.nose === idx ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-deep)',
                border: editingAvatarConfig.nose === idx ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                borderRadius: '6px',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
              title={['Aucun', 'Blush', 'Taches', 'Pansement'][idx]}
            >
              <AvatarFeaturePreview type="details" value={idx} color={editingAvatarConfig.color} />
            </button>
          ))}
        </div>
      </div>

      {/* Mouth selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Bouche</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setEditingAvatarConfig(prev => ({ ...prev, mouth: idx }))}
              style={{
                backgroundColor: editingAvatarConfig.mouth === idx ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-deep)',
                border: editingAvatarConfig.mouth === idx ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1 / 1'
              }}
              title={['Sourire', 'Rire', 'Surpris', 'Moustache', 'Triste', 'Colère', 'Neutre', 'Peur'][idx]}
            >
              <AvatarFeaturePreview type="mouth" value={idx} />
            </button>
          ))}
        </div>
      </div>

      {/* Hat selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Coiffure</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setEditingAvatarConfig(prev => ({ ...prev, hat: idx }))}
              style={{
                backgroundColor: editingAvatarConfig.hat === idx ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-deep)',
                border: editingAvatarConfig.hat === idx ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1 / 1'
              }}
              title={['Bol', 'Piques', 'Casquette', 'Couronne', 'Princesse', 'Bonnet', 'Afro', 'Chef', 'Pirate', 'Casque', 'Sorcier', 'Roux'][idx]}
            >
              <AvatarFeaturePreview type="hat" value={idx} />
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview & Action Buttons */}
      {!hideActions && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '6px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AvatarStudioComponent config={editingAvatarConfig} size={36} style={style} />
          </div>
          <div style={{ flex: 1, display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button 
              type="button"
              onClick={onCancel} 
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                fontSize: '10px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Annuler
            </button>
            <button 
              type="button"
              onClick={onSave} 
              disabled={!sidebarHasChanges}
              style={{
                backgroundColor: sidebarHasChanges ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-deep)',
                border: sidebarHasChanges ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: sidebarHasChanges ? 'var(--accent-emerald)' : 'var(--text-muted)',
                fontSize: '10px',
                fontWeight: 600,
                cursor: sidebarHasChanges ? 'pointer' : 'not-allowed',
                padding: '4px 10px',
                transition: 'all 0.2s'
              }}
            >
              {t('btn_save')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
