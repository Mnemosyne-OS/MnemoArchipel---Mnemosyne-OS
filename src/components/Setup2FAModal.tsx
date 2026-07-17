import { useState, useEffect } from 'react';
import { styles } from '../styles';

interface Setup2FAModalProps {
  onClose: () => void;
  onSuccess: (secret: string) => void;
  t: (key: string) => string;
}

export function Setup2FAModal({
  onClose,
  onSuccess,
  t
}: Setup2FAModalProps) {
  const [storedSecret] = useState(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ2347';
    let secret = '';
    for (let i = 0; i < 16; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  });

  const [new2FACode, setNew2FACode] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [securityError, setSecurityError] = useState('');

  // 2FA code generator loop
  useEffect(() => {
    const generateCode = () => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedCode(code);
      setTimerSeconds(30);
    };

    generateCode();
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          generateCode();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    setSecurityError('');
    if (new2FACode === simulatedCode) {
      onSuccess(storedSecret);
      onClose();
    } else {
      setSecurityError('Code 2FA invalide ou expiré.');
    }
  };

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent} className="glass">
        <div style={styles.modalHeader}>
          <h2>📱 {t('settings_2fa_setup')}</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            {t('settings_2fa_desc')}
          </p>
          
          <div style={styles.simulatedQr}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
              {Array.from({ length: 144 }).map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: (i % 3 === 0 || i % 7 === 0 || (i > 40 && i < 60) || i < 15 || i > 128) ? '#000' : '#fff' 
                  }} 
                />
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('settings_2fa_secret')}</span>
            <code style={styles.code}>{storedSecret}</code>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>{t('settings_2fa_code')}</label>
            <input 
              type="text"
              maxLength={6}
              value={new2FACode}
              onChange={(e) => setNew2FACode(e.target.value)}
              placeholder="123456"
              style={{ ...styles.input, textAlign: 'center', fontSize: '16px', letterSpacing: '0.2em' }}
            />
          </div>

          {securityError && <p style={styles.securityError}>{securityError}</p>}

          <div style={{ ...styles.debugBox, width: '100%' }}>
            <span style={{ fontWeight: 600, color: 'var(--accent-amber)', fontSize: '10px' }}>🔬 Sandbox Code</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
              Enter code: <code style={styles.code}>{simulatedCode}</code> ({timerSeconds}s left)
            </p>
          </div>

          <div style={styles.modalActions}>
            <button onClick={onClose} style={styles.btnSecondary}>
              {t('btn_cancel')}
            </button>
            <button onClick={handleVerify} style={styles.btnPrimary}>
              {t('btn_verify')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
