import { AvatarStudioConfig } from '../types';
import { AvatarFeaturePreview } from './AvatarStudioComponent';

interface AvatarStudioControlsProps {
  config: AvatarStudioConfig;
  onChange: (config: AvatarStudioConfig) => void;
}

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (val: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{suffix === 'x' ? `x${value.toFixed(2)}` : `${value}${suffix}`}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--accent-teal)' }}
      />
    </div>
  );
}

export function AvatarStudioControls({
  config,
  onChange
}: AvatarStudioControlsProps) {
  const eyeColors = ['#1e293b', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#db2777'];

  const setVal = (key: keyof AvatarStudioConfig, val: any) => {
    onChange({ ...config, [key]: val });
  };

  const getBtnStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-deep)',
    border: isActive ? '1.5px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
    borderRadius: '8px',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    aspectRatio: '1 / 1'
  });

  const {
    body = 0,
    color = '#fcd34d',
    eyes = 0,
    nose = 0,
    mouth = 0,
    hat = 0,
    eyeSize = 1.0,
    eyeSpacing = 12,
    eyeY = 52,
    eyeColor = '#1e293b',
    eyeAngle = 0,
    pupilSize = 1.0,
    eyebrows = 0,
    eyebrowY = 42,
    eyebrowAngle = 0,
    eyelashes = 0,
    mouthScale = 1.0,
    mouthY = 71,
    blushScale = 1.0
  } = config;

  return (
    <div style={{
      width: '420px',
      borderLeft: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-surface-glass)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🎛️ Expert Settings (Sims Mode)</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* SECTION: SKIN TONE & HAIRSTYLES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-teal)', margin: 0, textTransform: 'uppercase' }}>Skin & Hairstyle</h4>
          
          {/* Skin palette */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Skin Color</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {['#fcd34d', '#fdba74', '#b45309', '#ffedd5', '#fecdd3'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setVal('color', c)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: color === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                />
              ))}
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setVal('color', e.target.value)}
                style={{ backgroundColor: 'transparent', border: 'none', width: '28px', height: '28px', cursor: 'pointer' }}
                title="Custom Color"
              />
            </div>
          </div>

          {/* Shape selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Face Shape</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {['Classic', 'Long', 'Square', 'Triangle', 'Chubby'].map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVal('body', idx)}
                  title={label}
                  style={getBtnStyle(body === idx)}
                >
                  <AvatarFeaturePreview type="body" value={idx} color={color} />
                </button>
              ))}
            </div>
          </div>

          {/* Hat Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hairstyle / Hat Model</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {['Bowl (Brown)', 'Spikes (Black)', 'Cap', 'Crown', 'Princess', 'Beanie', 'Afro', 'Chef', 'Pirate', 'Headphones', 'Wizard', 'Red Long'].map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVal('hat', idx)}
                  title={label}
                  style={getBtnStyle(hat === idx)}
                >
                  <AvatarFeaturePreview type="hat" value={idx} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

        {/* SECTION: EXPERT EYES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-teal)', margin: 0, textTransform: 'uppercase' }}>👁️ Eyes (Sims Controls)</h4>
          
          {/* Template selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Base Style</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {['Custom', 'Squint', 'Glasses', 'Wink'].map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVal('eyes', idx)}
                  title={label}
                  style={getBtnStyle(eyes === idx)}
                >
                  <AvatarFeaturePreview type="eyes" value={idx} eyeColor={eyeColor} />
                </button>
              ))}
            </div>
          </div>

          {/* Custom eye color picker */}
          {eyes !== 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Iris / Eye Color</span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {eyeColors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setVal('eyeColor', c)}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: eyeColor === c ? '2px solid #fff' : 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  />
                ))}
                <input 
                  type="color" 
                  value={eyeColor} 
                  onChange={(e) => setVal('eyeColor', e.target.value)}
                  style={{ border: 'none', width: '22px', height: '22px', backgroundColor: 'transparent', cursor: 'pointer' }}
                />
              </div>
            </div>
          )}

          <SliderField label="Eye Spacing" value={eyeSpacing} min={6} max={22} suffix="px" onChange={(val) => setVal('eyeSpacing', val)} />
          <SliderField label="Vertical Height (Y)" value={eyeY} min={44} max={62} suffix="px" onChange={(val) => setVal('eyeY', val)} />
          <SliderField label="Overall Eye Size" value={eyeSize} min={0.6} max={1.8} step={0.05} suffix="x" onChange={(val) => setVal('eyeSize', val)} />
          {eyes !== 1 && (
            <SliderField label="Pupil Size" value={pupilSize} min={0.4} max={1.8} step={0.05} suffix="x" onChange={(val) => setVal('pupilSize', val)} />
          )}
          <SliderField label="Rotation Angle" value={eyeAngle} min={-20} max={20} suffix="°" onChange={(val) => setVal('eyeAngle', val)} />

          {/* Eyelashes selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Eyelashes</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['None', 'Short', 'Long'].map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVal('eyelashes', idx)}
                  style={{
                    backgroundColor: eyelashes === idx ? 'var(--bg-surface)' : 'var(--bg-deep)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '10px',
                    padding: '2px 6px',
                    cursor: 'pointer'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

        {/* SECTION: EYEBROWS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-teal)', margin: 0, textTransform: 'uppercase' }}>🤨 Eyebrows</h4>
          
          {/* Shape selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Eyebrow Style</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {['None', 'Straight', 'Angry', 'Sad', 'Curved'].map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVal('eyebrows', idx)}
                  title={label}
                  style={getBtnStyle(eyebrows === idx)}
                >
                  <AvatarFeaturePreview type="eyebrows" value={idx} />
                </button>
              ))}
            </div>
          </div>

          {/* Eyebrow properties */}
          {eyebrows > 0 && (
            <>
              <SliderField label="Eyebrow Height" value={eyebrowY} min={32} max={50} suffix="px" onChange={(val) => setVal('eyebrowY', val)} />
              <SliderField label="Eyebrow Angle" value={eyebrowAngle} min={-30} max={30} suffix="°" onChange={(val) => setVal('eyebrowAngle', val)} />
            </>
          )}
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

        {/* SECTION: MOUTH & CHEEKS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-teal)', margin: 0, textTransform: 'uppercase' }}>👄 Mouth & Cheeks</h4>
          
          {/* Mouth selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Mouth Style</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {['Smile', 'Laugh', 'Surprised', 'Mustache', 'Sad', 'Angry', 'Neutral', 'Fear'].map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVal('mouth', idx)}
                  title={label}
                  style={getBtnStyle(mouth === idx)}
                >
                  <AvatarFeaturePreview type="mouth" value={idx} />
                </button>
              ))}
            </div>
          </div>

          <SliderField label="Mouth Size" value={mouthScale} min={0.6} max={1.8} step={0.05} suffix="x" onChange={(val) => setVal('mouthScale', val)} />
          <SliderField label="Mouth Height" value={mouthY} min={62} max={82} suffix="px" onChange={(val) => setVal('mouthY', val)} />

          {/* Detail style selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Cheek Details / Accessories</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {['None', 'Blush', 'Freckles', 'Bandage'].map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVal('nose', idx)}
                  title={label}
                  style={getBtnStyle(nose === idx)}
                >
                  <AvatarFeaturePreview type="details" value={idx} color={color} />
                </button>
              ))}
            </div>
          </div>

          {/* Blush scale */}
          {nose === 1 && (
            <SliderField label="Blush Size" value={blushScale} min={0.5} max={1.8} step={0.05} suffix="x" onChange={(val) => setVal('blushScale', val)} />
          )}
        </div>
      </div>
    </div>
  );
}
