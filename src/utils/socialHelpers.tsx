

export const SOCIAL_TYPES = [
  { key: 'email', icon: '✉️', label: 'Email' },
  { key: 'phone', icon: '📞', label: 'Phone' },
  { key: 'address', icon: '📍', label: 'Address' },
  { key: 'facebook', icon: '📘', label: 'Facebook' },
  { key: 'instagram', icon: '📸', label: 'Instagram' },
  { key: 'snapchat', icon: '👻', label: 'Snapchat' },
  { key: 'telegram', icon: '✈️', label: 'Telegram' },
  { key: 'signal', icon: '💬', label: 'Signal' },
  { key: 'github', icon: '💻', label: 'GitHub' },
  { key: 'linkedin', icon: '💼', label: 'LinkedIn' },
  { key: 'website', icon: '🌐', label: 'Website' }
];

export const getSocialIcon = (key: string, size = 16) => {
  switch (key) {
    case 'email':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', color: '#a1a1aa' }}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      );
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', color: '#10b981' }}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      );
    case 'address':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', color: '#ef4444' }}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="#1877F2" style={{ verticalAlign: 'middle' }}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', color: '#E4405F' }}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      );
    case 'snapchat':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="#FFFC00" stroke="#000000" strokeWidth="1.5" style={{ verticalAlign: 'middle', borderRadius: '4px' }}>
          <path d="M12 2.25c-3.13 0-4.5 2.25-4.5 4.12 0 .8.27 1.54.73 2.11a2.82 2.82 0 0 1-.23 1.34 2 2 0 0 1-1 1c-.8.36-1.57.94-1.57 2.05a1.18 1.18 0 0 0 .73 1.08c.95.42 1.36.19 1.84-.45.45.69 1.15.91 2 .91.53 0 1-.1 1.48-.3v.8c0 1.25.9 2.25 2 2.25s2-1 2-2.25v-.8c.48.2 1 .3 1.48.3.85 0 1.55-.22 2-.91.48.64.89.87 1.84.45a1.18 1.18 0 0 0 .73-1.08c0-1.11-.77-1.69-1.57-2.05a2 2 0 0 1-1-1 2.82 2.82 0 0 1-.23-1.34c.46-.57.73-1.31.73-2.11 0-1.87-1.37-4.12-4.5-4.12z"/>
        </svg>
      );
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" style={{ verticalAlign: 'middle' }}>
          <circle cx="12" cy="12" r="12" fill="#229ED9"/>
          <path d="M5.4 11.6l12.9-5c.6-.2 1.1.2.9.9l-2.2 10.4c-.2.8-.7 1-1.4.6l-3.4-2.5-1.6 1.6c-.2.2-.3.3-.7.3l.2-3.4 6.2-5.6c.3-.3-.1-.4-.4-.2L8.7 13.5l-3.3-1c-.7-.3-.7-.7.1-1z" fill="#ffffff"/>
        </svg>
      );
    case 'signal':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" style={{ verticalAlign: 'middle' }}>
          <circle cx="12" cy="12" r="12" fill="#3a76f0"/>
          <path d="M12 3a9 9 0 0 0-9 9c0 1.7.5 3.3 1.4 4.7L3.1 21l4.5-1.2C9 20.6 10.5 21 12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9zm0 15a7 7 0 0 1-5-2.1l-.3-.3-2.6.7.7-2.5-.3-.4A7 7 0 0 1 5 12a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7z" fill="#ffffff" />
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={{ verticalAlign: 'middle', color: 'var(--text-primary)' }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="#0077B5" style={{ verticalAlign: 'middle' }}>
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case 'website':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', color: '#10b981' }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
    default:
      return <span>🔗</span>;
  }
};
