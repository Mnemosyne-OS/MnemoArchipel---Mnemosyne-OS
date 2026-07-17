import { useState, useEffect, FormEvent } from 'react';
import { styles } from '../styles';

interface SecurityGateProps {
  lockType: 'password' | '2fa';
  storedPassword: string;
  onUnlock: () => void;
  t: (key: string) => string;
}

export function SecurityGate({
  lockType,
  storedPassword,
  onUnlock,
  t
}: SecurityGateProps) {
  const [securityInput, setSecurityInput] = useState('');
  const [securityError, setSecurityError] = useState('');
  
  // 2FA simulation states
  const [simulatedCode, setSimulatedCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(30);

  // 2FA code generator loop
  useEffect(() => {
    if (lockType !== '2fa') return;

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
  }, [lockType]);

  const handleUnlockClick = (e: FormEvent) => {
    e.preventDefault();
    setSecurityError('');

    if (lockType === 'password') {
      if (securityInput === storedPassword) {
        onUnlock();
      } else {
        setSecurityError(t('lock_error_pass') || 'Mot de passe incorrect.');
      }
    } else {
      if (securityInput === simulatedCode) {
        onUnlock();
      } else {
        setSecurityError(t('lock_error_2fa') || 'Code 2FA invalide ou expiré.');
      }
    }
  };

  return (
    <div style={styles.lockOverlay} className="glass">
      <div style={{ ...styles.modalContent, width: '320px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🔐</span>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 600, color: '#fff' }}>Mnemosyne OS</h2>
        <p style={{ margin: '0 0 24px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
          {lockType === 'password' ? t('lock_enter_pass') : t('lock_enter_2fa')}
        </p>

        <form onSubmit={handleUnlockClick} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={styles.formGroup}>
            <input 
              type={lockType === 'password' ? 'password' : 'text'} 
              value={securityInput} 
              onChange={(e) => setSecurityInput(e.target.value)} 
              placeholder={lockType === 'password' ? '••••' : '123456'}
              maxLength={lockType === 'password' ? undefined : 6}
              style={{ ...styles.input, textAlign: 'center', fontSize: lockType === 'password' ? '20px' : '16px', letterSpacing: '0.1em' }}
              autoFocus
              required
            />
          </div>

          {securityError && <p style={styles.securityError}>{securityError}</p>}

          <button type="submit" style={{ ...styles.btnPrimary, width: '100%', padding: '10px' }}>
            {t('btn_unlock')}
          </button>
        </form>

        {lockType === '2fa' && (
          <div style={{ ...styles.debugBox, marginTop: '24px', width: '100%' }}>
            <span style={{ fontWeight: 600, color: 'var(--accent-amber)', fontSize: '10px' }}>🔬 Sandbox Code</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
              Enter code: <code style={styles.code}>{simulatedCode}</code> ({timerSeconds}s left)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
