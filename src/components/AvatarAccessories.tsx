export const renderAccessorySvg = (id: number) => {
  switch (id) {
    case 0: // Cake
      return (
        <g>
          <rect x="3" y="10" width="18" height="10" fill="#f472b6" rx="2" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M 3,13 Q 7,15 12,13 Q 17,11 21,13" fill="none" stroke="#db2777" strokeWidth="1" />
          <rect x="4" y="9" width="16" height="2" fill="#fff" rx="1" />
          <rect x="11.2" y="4" width="1.6" height="5" fill="#fcd34d" stroke="#1e293b" strokeWidth="0.8" />
          <path d="M 12,1 Q 13,3 12,4 Q 11,3 12,1" fill="#ef4444" />
        </g>
      );
    case 1: // Fishing Rod
      return (
        <g>
          <line x1="2" y1="22" x2="20" y2="4" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <path d="M 20,4 Q 22,12 21,16" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
          <path d="M 19,16 Q 22,17 22,19 Q 20,20 19,19 L 18,20 L 18,17 Z" fill="#3b82f6" stroke="#1e293b" strokeWidth="0.8" />
        </g>
      );
    case 2: // Boat
      return (
        <g>
          <polygon points="2,16 6,21 18,21 22,16" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="12,4 12,15 20,15" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="12" y1="3" x2="12" y2="16" stroke="#1e293b" strokeWidth="1.5" />
        </g>
      );
    case 3: // Bread Baguette
      return (
        <g transform="rotate(-30 12 12)">
          <rect x="4" y="9" width="16" height="6" rx="3" fill="#d97706" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="7" y1="10" x2="9" y2="14" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="11" y1="10" x2="13" y2="14" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="15" y1="10" x2="17" y2="14" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
    case 4: // Magic Wand
      return (
        <g>
          <line x1="5" y1="19" x2="15" y2="9" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15" y1="9" x2="17" y2="7" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points="17,2 19,6 23,6 20,9 21,13 17,11 13,13 14,9 11,6 15,6" fill="#f59e0b" stroke="#1e293b" strokeWidth="1" strokeLinejoin="round" />
          <circle cx="21" cy="2" r="0.8" fill="#fcd34d" />
          <circle cx="12" cy="11" r="0.8" fill="#fcd34d" />
          <circle cx="13" cy="2" r="0.8" fill="#fcd34d" />
        </g>
      );
    case 5: // Shield
      return (
        <g>
          <path d="M 4,4 L 20,4 C 20,4 20,13 12,21 C 4,13 4,4 4,4 Z" fill="#2563eb" stroke="#1e293b" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M 7,6 L 17,6 C 17,6 17,12 12,18 C 7,12 7,6 7,6 Z" fill="#3b82f6" opacity="0.6" />
          <polygon points="12,7 14,11 18,11 15,13 16,17 12,15 8,17 9,13 6,11 10,11" fill="#f59e0b" stroke="#1e293b" strokeWidth="0.8" />
        </g>
      );
    case 6: // Sword
      return (
        <g transform="rotate(45 12 12)">
          <polygon points="10,2 14,2 14,17 10,17" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="7" y="16" width="10" height="2" rx="0.5" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.2" />
          <rect x="11" y="18" width="2" height="4" fill="#78350f" stroke="#1e293b" strokeWidth="1" />
          <circle cx="12" cy="22" r="1.5" fill="#f59e0b" stroke="#1e293b" strokeWidth="1" />
        </g>
      );
    case 7: // Dino
      return (
        <g>
          <path d="M 4,18 C 4,18 3,11 8,9 C 13,7 18,9 18,6 C 18,3 22,2 22,6 C 22,10 19,13 18,15 L 19,19 C 19,20 17,21 16,20 L 14,16 L 10,18 L 8,21 C 7,22 5,21 6,19 L 7,17 C 5,16 4,18 4,18 Z" fill="#22c55e" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="19" cy="7" r="1" fill="#000" />
          <path d="M 12,8 L 11,6 M 14,9 L 14,7 M 16,10 L 17,8" stroke="#15803d" strokeWidth="1" strokeLinecap="round" />
        </g>
      );
    case 8: // Balloon
      return (
        <g>
          <path d="M 12,16 Q 11,20 13,23" fill="none" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 12,16 C 12,16 4,14 4,9 C 4,4 12,2 12,2 C 12,2 20,4 20,9 C 20,14 12,16 12,16 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" />
          <polygon points="11,15 13,15 12,17" fill="#dc2626" stroke="#1e293b" strokeWidth="0.8" />
          <ellipse cx="8" cy="6" rx="2" ry="1.2" transform="rotate(-30 8 6)" fill="#fecaca" opacity="0.6" />
        </g>
      );
    case 9: // Pizza
      return (
        <g>
          <path d="M 2,5 Q 12,2 22,5 L 12,22 Z" fill="#eab308" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 2,5 Q 12,2 22,5" fill="none" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="12" cy="9" r="1.5" fill="#ef4444" />
          <circle cx="8" cy="13" r="1.5" fill="#ef4444" />
          <circle cx="15" cy="12" r="1.5" fill="#ef4444" />
          <circle cx="11" cy="16" r="1" fill="#ef4444" />
        </g>
      );
    case 10: // Cat
      return (
        <g>
          <path d="M 3,8 L 6,3 L 9,6 L 15,6 L 18,3 L 21,8 C 22,12 21,17 18,19 C 14,21 10,21 6,19 C 3,17 2,12 3,8 Z" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="8" cy="11" r="1" fill="#000" />
          <circle cx="16" cy="11" r="1" fill="#000" />
          <polygon points="11.5,13.5 12.5,13.5 12,14" fill="#f43f5e" />
          <path d="M 10,15 Q 12,16 14,15" fill="none" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
          <line x1="5" y1="13" x2="2" y2="12" stroke="#1e293b" strokeWidth="0.8" />
          <line x1="5" y1="15" x2="1" y2="16" stroke="#1e293b" strokeWidth="0.8" />
          <line x1="19" y1="13" x2="22" y2="12" stroke="#1e293b" strokeWidth="0.8" />
          <line x1="19" y1="15" x2="23" y2="16" stroke="#1e293b" strokeWidth="0.8" />
        </g>
      );
    case 11: // Cool Glasses
      return (
        <g>
          <rect x="2" y="9" width="9" height="6" rx="2" fill="#18181b" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="13" y="9" width="9" height="6" rx="2" fill="#18181b" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="11" y1="11" x2="13" y2="11" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M 4,10 L 8,13" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
          <path d="M 15,10 L 19,13" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
        </g>
      );
    case 12: // Ice Cream
      return (
        <g>
          <polygon points="6,12 18,12 12,23" fill="#d97706" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="9" r="6" fill="#f472b6" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="12" cy="3" r="2" fill="#ef4444" />
          <path d="M 13,2 Q 17,-1 16,-4" fill="none" stroke="#1e293b" strokeWidth="0.8" />
        </g>
      );
    case 13: // Coffee
      return (
        <g>
          <path d="M 8,4 Q 7,1 9,-1" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
          <path d="M 12,4 Q 11,1 13,-1" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
          <rect x="5" y="8" width="12" height="12" rx="2" fill="#0d9488" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M 17,11 C 21,11 21,17 17,17" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case 14: // Palette
      return (
        <g>
          <path d="M 16,5 C 20,5 21,10 20,14 C 19,18 16,21 11,21 C 6,21 3,17 3,12 C 3,7 7,5 12,5 Z" fill="#d97706" opacity="0.6" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="6" cy="10" r="1.5" fill="#ef4444" />
          <circle cx="9" cy="8" r="1.5" fill="#3b82f6" />
          <circle cx="14" cy="9" r="1.5" fill="#22c55e" />
          <circle cx="16" cy="14" r="1.5" fill="#eab308" />
          <ellipse cx="8" cy="16" rx="2" ry="1.2" fill="#fff" stroke="#1e293b" strokeWidth="1" />
        </g>
      );
    case 15: // Book
      return (
        <g>
          <rect x="4" y="4" width="16" height="16" rx="1.5" fill="#7c3aed" stroke="#1e293b" strokeWidth="1.5" />
          <rect x="3" y="5" width="2" height="14" fill="#a78bfa" />
          <polygon points="12,8 13.5,11 16.5,11 14,13 15,16 12,14.5 9,16 10,13 7.5,11 10.5,11" fill="#f59e0b" />
        </g>
      );
    case 16: // Guitar
      return (
        <g transform="rotate(-30 12 12)">
          <rect x="11" y="1" width="2" height="14" fill="#78350f" stroke="#1e293b" strokeWidth="1" />
          <path d="M 9,14 C 7,13 5,15 5,17 C 5,20 8,23 12,23 C 16,23 19,20 19,17 C 19,15 17,13 15,14 Z" fill="#b91c1c" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="17" r="2" fill="#eab308" stroke="#1e293b" strokeWidth="1" />
        </g>
      );
    default:
      return null;
  }
};
