import React from 'react';

export { renderAccessorySvg } from './AvatarAccessories';

export const AvatarFeaturePreview: React.FC<{
  type: 'body' | 'hat' | 'eyes' | 'eyebrows' | 'mouth' | 'details';
  value: number;
  color?: string;
  eyeColor?: string;
}> = ({ type, value, color = '#fcd34d', eyeColor = '#1e293b' }) => {
  if (type === 'body') {
    let shapePath = "";
    let shadowPath = "";
    if (value === 0) {
      shapePath = "M 34,42 C 34,22 86,22 86,42 L 86,72 C 86,85 78,92 60,92 C 42,92 34,85 34,72 Z";
      shadowPath = "M 34,72 C 34,85 42,92 60,92 C 78,92 86,85 86,72 C 86,77 78,86 60,86 C 42,86 34,77 34,72 Z";
    } else if (value === 1) {
      shapePath = "M 35,40 C 35,18 85,18 85,40 L 85,76 C 85,92 76,96 60,96 C 44,96 35,92 35,76 Z";
      shadowPath = "M 35,76 C 35,92 44,96 60,96 C 76,96 85,92 85,76 C 85,81 76,90 60,90 C 44,90 35,81 35,76 Z";
    } else if (value === 2) {
      shapePath = "M 33,40 C 33,26 87,26 87,40 L 87,76 C 87,85 81,89 77,89 L 43,89 C 39,89 33,85 33,76 Z";
      shadowPath = "M 33,76 C 33,85 39,89 43,89 L 77,89 C 81,89 87,85 87,76 C 87,80 81,84 77,84 L 43,84 C 39,84 33,80 33,76 Z";
    } else if (value === 3) {
      shapePath = "M 34,42 C 34,22 86,22 86,42 L 84,68 C 84,80 72,94 60,94 C 48,94 36,80 36,68 Z";
      shadowPath = "M 36,68 C 36,80 48,94 60,94 C 72,94 84,80 84,68 C 84,73 72,88 60,88 C 48,88 36,73 36,68 Z";
    } else {
      shapePath = "M 34,42 C 34,20 86,20 86,42 C 92,54 90,74 84,82 C 78,90 70,94 60,94 C 50,94 42,90 36,82 C 30,74 28,54 34,42 Z";
      shadowPath = "M 36,82 C 42,90 50,94 60,94 C 70,94 78,90 84,82 C 84,85 70,89 60,89 C 50,89 36,85 36,82 Z";
    }

    return (
      <svg viewBox="28 15 64 82" width="32" height="32" style={{ overflow: 'visible' }}>
        <path d={shapePath} fill={color} stroke="#1e293b" strokeWidth="3.5" strokeLinejoin="round" />
        <path d={shadowPath} fill="rgba(0,0,0,0.12)" />
      </svg>
    );
  }
  if (type === 'hat') {
    let hatSvg = (
      <path 
        d="M 31,42 C 28,12 92,12 89,42 C 93,52 86,52 84,44 C 82,34 76,36 60,36 C 44,36 38,34 36,44 C 34,52 27,52 31,42 Z" 
        fill="#78350f" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" 
      />
    );
    if (value === 1) {
      hatSvg = (
        <path 
          d="M 33,40 C 31,32 35,22 40,26 C 43,18 48,12 54,19 C 58,9 65,9 68,17 C 72,12 77,18 82,25 C 86,22 89,32 87,40 C 78,36 42,36 33,40 Z" 
          fill="#1e293b" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" 
        />
      );
    } else if (value === 2) {
      hatSvg = (
        <g>
          <path d="M 33,38 C 30,12 90,12 87,38 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="3" />
          <path d="M 44,38 C 42,22 78,22 76,38 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M 24,37 Q 60,24 96,37 L 105,43 Q 60,30 15,43 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
        </g>
      );
    } else if (value === 3) {
      hatSvg = (
        <g>
          <polygon points="35,28 43,11 60,25 77,11 85,28" fill="#f59e0b" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="43" cy="11" r="3.5" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="60" cy="25" r="3.5" fill="#3b82f6" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="77" cy="11" r="3.5" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" />
        </g>
      );
    } else if (value === 4) {
      hatSvg = (
        <g>
          <path d="M 31,42 C 28,12 92,12 89,42 C 86,52 84,65 82,78 C 80,82 76,82 78,72 C 80,50 78,38 60,38 C 42,38 40,50 42,72 C 44,82 40,82 38,78 C 36,65 34,52 31,42 Z" fill="#f59e0b" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 33,35 C 33,25 87,25 87,35" fill="none" stroke="#ec4899" strokeWidth="3.5" />
        </g>
      );
    } else if (value === 5) {
      hatSvg = (
        <g>
          <path d="M 33,38 C 30,14 90,14 87,38 Z" fill="#0d9488" stroke="#1e293b" strokeWidth="3" />
          <rect x="30" y="32" width="60" height="8" rx="4" fill="#0f766e" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="60" cy="12" r="7" fill="#f5f5f5" stroke="#1e293b" strokeWidth="2" />
        </g>
      );
    } else if (value === 6) {
      hatSvg = (
        <path 
          d="M 33,40 C 15,35 15,5 35,-5 C 50,-20 70,-20 85,-5 C 105,5 105,35 87,40 C 78,38 42,38 33,40 Z" 
          fill="#18181b" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" 
        />
      );
    } else if (value === 7) {
      hatSvg = (
        <g>
          <rect x="42" y="24" width="36" height="15" fill="#f8fafc" stroke="#1e293b" strokeWidth="3" />
          <path d="M 42,25 C 28,15 32,-15 50,-5 C 55,-20 65,-20 70,-5 C 88,-15 92,15 78,25 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
        </g>
      );
    } else if (value === 8) {
      hatSvg = (
        <g>
          <path d="M 33,40 C 33,30 87,30 87,40" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <path d="M 20,32 C 30,12 90,12 100,32 C 75,25 45,25 20,32 Z" fill="#18181b" stroke="#1e293b" strokeWidth="3" />
          <path d="M 20,32 C 30,12 90,12 100,32" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="60" y="24" fontSize="10" textAnchor="middle" fill="#fff" style={{ userSelect: 'none', fontFamily: 'Arial' }}>☠️</text>
        </g>
      );
    } else if (value === 9) {
      hatSvg = (
        <g>
          <path d="M 31,42 C 28,12 92,12 89,42 C 93,52 86,52 84,44 Z" fill="#78350f" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M 30,56 C 30,16 90,16 90,56" fill="none" stroke="#ec4899" strokeWidth="4" />
          <rect x="25" y="46" width="6" height="20" rx="3" fill="#18181b" stroke="#1e293b" strokeWidth="2" />
          <rect x="21" y="48" width="4" height="16" rx="2" fill="#ec4899" />
          <rect x="89" y="46" width="6" height="20" rx="3" fill="#18181b" stroke="#1e293b" strokeWidth="2" />
          <rect x="95" y="48" width="4" height="16" rx="2" fill="#ec4899" />
        </g>
      );
    } else if (value === 10) {
      hatSvg = (
        <g>
          <ellipse cx="60" cy="38" rx="35" ry="6" fill="#5b21b6" stroke="#1e293b" strokeWidth="3" />
          <path d="M 38,36 Q 60,0 72,-5 Q 65,22 82,36 Z" fill="#6d28d9" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
          <rect x="52" y="32" width="16" height="6" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" />
        </g>
      );
    } else if (value === 11) {
      hatSvg = (
        <g>
          <path d="M 31,42 C 28,12 92,12 89,42 C 86,52 84,70 82,88 C 80,92 72,92 74,80 C 76,60 78,38 60,38 C 42,38 44,60 46,80 C 48,92 40,92 38,88 C 36,70 34,52 31,42 Z" fill="#ea580c" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 34,36 C 45,30 75,30 86,36" fill="none" stroke="#c2410c" strokeWidth="3" />
        </g>
      );
    }

    return (
      <svg viewBox="12 6 96 60" width="32" height="32" style={{ overflow: 'visible' }}>
        {hatSvg}
      </svg>
    );
  }

  if (type === 'eyes') {
    let leftEye = null;
    let rightEye = null;
    const leftX = 48;
    const rightX = 72;
    const eyeY = 52;

    if (value === 0) {
      leftEye = (
        <g transform={`translate(${leftX}, ${eyeY})`}>
          <circle cx="0" cy="0" r="6" fill="#fff" stroke="#1e293b" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill={eyeColor} />
          <circle cx="-1.5" cy="-1.5" r="1" fill="#fff" />
        </g>
      );
      rightEye = (
        <g transform={`translate(${rightX}, ${eyeY})`}>
          <circle cx="0" cy="0" r="6" fill="#fff" stroke="#1e293b" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill={eyeColor} />
          <circle cx="-1.5" cy="-1.5" r="1" fill="#fff" />
        </g>
      );
    } else if (value === 1) {
      leftEye = (
        <g transform={`translate(${leftX}, ${eyeY})`}>
          <path d="M -7,2 Q 0,-6 7,2" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </g>
      );
      rightEye = (
        <g transform={`translate(${rightX}, ${eyeY})`}>
          <path d="M -7,2 Q 0,-6 7,2" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </g>
      );
    } else if (value === 2) {
      leftEye = (
        <g transform={`translate(${leftX}, ${eyeY})`}>
          <circle cx="0" cy="0" r="10" stroke="#1e293b" strokeWidth="3.5" fill="none" />
          <circle cx="0" cy="0" r="4.5" fill="#1e293b" />
          <circle cx="-1.5" cy="-1.5" r="1.2" fill="#fff" />
          <path d="M -6,-6 L 2,2" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
      rightEye = (
        <g transform={`translate(${rightX}, ${eyeY})`}>
          <circle cx="0" cy="0" r="10" stroke="#1e293b" strokeWidth="3.5" fill="none" />
          <circle cx="0" cy="0" r="4.5" fill="#1e293b" />
          <circle cx="-1.5" cy="-1.5" r="1.2" fill="#fff" />
          <path d="M -6,-6 L 2,2" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    } else if (value === 3) {
      leftEye = (
        <g transform={`translate(${leftX}, ${eyeY})`}>
          <path d="M -6,0 Q 0,-5 6,0" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
      rightEye = (
        <g transform={`translate(${rightX}, ${eyeY})`}>
          <circle cx="0" cy="0" r="6" fill="#fff" stroke="#1e293b" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill={eyeColor} />
          <circle cx="-1.5" cy="-1.5" r="1" fill="#fff" />
        </g>
      );
    }

    const bridge = value === 2 && (
      <line x1={leftX + 4} y1={eyeY} x2={rightX - 4} y2={eyeY} stroke="#1e293b" strokeWidth="3" />
    );

    return (
      <svg viewBox="35 38 50 28" width="32" height="32" style={{ overflow: 'visible' }}>
        <circle cx="60" cy="52" r="23" fill="#ffedd5" stroke="#1e293b" strokeWidth="1.5" />
        {leftEye}
        {rightEye}
        {bridge}
      </svg>
    );
  }

  if (type === 'eyebrows') {
    let leftEyebrow = null;
    let rightEyebrow = null;
    const leftX = 48;
    const rightX = 72;
    const eyebrowY = 42;

    if (value === 1) {
      leftEyebrow = <line x1="-8" y1="0" x2="8" y2="0" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
      rightEyebrow = <line x1="-8" y1="0" x2="8" y2="0" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
    } else if (value === 2) {
      leftEyebrow = <line x1="-8" y1="-2" x2="8" y2="4" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
      rightEyebrow = <line x1="-8" y1="4" x2="8" y2="-2" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
    } else if (value === 3) {
      leftEyebrow = <line x1="-8" y1="4" x2="8" y2="-2" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
      rightEyebrow = <line x1="-8" y1="-2" x2="8" y2="4" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
    } else if (value === 4) {
      leftEyebrow = <path d="M -7,2 Q 0,-4 7,2" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
      rightEyebrow = <path d="M -7,2 Q 0,-4 7,2" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
    }

    return (
      <svg viewBox="35 28 50 28" width="32" height="32" style={{ overflow: 'visible' }}>
        <circle cx="60" cy="42" r="23" fill="#ffedd5" stroke="#1e293b" strokeWidth="1.5" />
        {value > 0 && (
          <g>
            <g transform={`translate(${leftX}, ${eyebrowY})`}>{leftEyebrow}</g>
            <g transform={`translate(${rightX}, ${eyebrowY})`}>{rightEyebrow}</g>
          </g>
        )}
        {value === 0 && (
          <text x="60" y="46" fontSize="7" textAnchor="middle" fill="#9ca3af" style={{ fontFamily: 'sans-serif', fontWeight: 600 }}>None</text>
        )}
      </svg>
    );
  }

  if (type === 'mouth') {
    let mouthSvg = null;
    if (value === 0) {
      mouthSvg = <path d="M -13,-2 Q 0,8 13,-2" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
    } else if (value === 1) {
      mouthSvg = <path d="M -14,-4 C -14,-4 -11,8 0,8 C 11,8 14,-4 14,-4 Z" fill="#b91c1c" stroke="#1e293b" strokeWidth="3.5" strokeLinejoin="round" />;
    } else if (value === 2) {
      mouthSvg = <ellipse cx="0" cy="0" rx="7" ry="5.5" fill="#1e293b" />;
    } else if (value === 3) {
      mouthSvg = (
        <g transform="translate(0, -6)">
          <path d="M -12,6 Q 0,14 12,6" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 0,0 C -10,-6 -16,3 -20,5 C -14,0 -4,2 0,4 C 4,2 14,0 20,5 C 16,3 10,-6 0,0 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" />
        </g>
      );
    } else if (value === 4) {
      mouthSvg = <path d="M -13,6 Q 0,-4 13,6" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
    } else if (value === 5) {
      mouthSvg = (
        <g>
          <rect x="-12" y="-4" width="24" height="8" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="-6" y1="-4" x2="-6" y2="4" stroke="#1e293b" strokeWidth="1" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#1e293b" strokeWidth="1" />
          <line x1="6" y1="-4" x2="6" y2="4" stroke="#1e293b" strokeWidth="1" />
        </g>
      );
    } else if (value === 6) {
      mouthSvg = <line x1="-12" y1="0" x2="12" y2="0" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
    } else if (value === 7) {
      mouthSvg = <path d="M -12,-2 Q -6,3 0,-2 Q 6,-7 12,-2" fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
    }

    return (
      <svg viewBox="40 56 40 28" width="32" height="32" style={{ overflow: 'visible' }}>
        <circle cx="60" cy="70" r="23" fill="#ffedd5" stroke="#1e293b" strokeWidth="1.5" />
        <g transform="translate(60, 70)">
          {mouthSvg}
        </g>
      </svg>
    );
  }

  if (type === 'details') {
    let detailsSvg = null;
    const leftX = 48;
    const rightX = 72;

    if (value === 1) {
      detailsSvg = (
        <g>
          <circle cx={leftX - 6} cy="62" r="5.5" fill="#ef4444" opacity="0.6" />
          <circle cx={rightX + 6} cy="62" r="5.5" fill="#ef4444" opacity="0.6" />
        </g>
      );
    } else if (value === 2) {
      detailsSvg = (
        <g>
          <circle cx={leftX - 5} cy="60" r="1.2" fill="#7c2d12" />
          <circle cx={leftX - 2} cy="62" r="1.5" fill="#7c2d12" />
          <circle cx={leftX + 1} cy="60" r="1.2" fill="#7c2d12" />
          <circle cx={rightX - 1} cy="60" r="1.2" fill="#7c2d12" />
          <circle cx={rightX + 2} cy="62" r="1.5" fill="#7c2d12" />
          <circle cx={rightX + 5} cy="60" r="1.2" fill="#7c2d12" />
        </g>
      );
    } else if (value === 3) {
      detailsSvg = (
        <g>
          <rect x="42" y="44" width="16" height="7" fill="#fed7aa" rx="1.5" transform="rotate(-12 42 44)" stroke="#1e293b" strokeWidth="1.5" />
          <line x1="49" y1="44" x2="49" y2="51" stroke="#1e293b" strokeWidth="1" transform="rotate(-12 42 44)" />
        </g>
      );
    }

    return (
      <svg viewBox="35 42 50 28" width="32" height="32" style={{ overflow: 'visible' }}>
        <circle cx="60" cy="56" r="23" fill="#ffedd5" stroke="#1e293b" strokeWidth="1.5" />
        {value > 0 && detailsSvg}
        {value === 0 && (
          <text x="60" y="60" fontSize="7" textAnchor="middle" fill="#9ca3af" style={{ fontFamily: 'sans-serif', fontWeight: 600 }}>None</text>
        )}
      </svg>
    );
  }

  return null;
};

/**
 * Renders the custom Avatar eyebrows.
 */
export function renderSvgEyebrows(
  eyebrows: number,
  eyebrowY: number,
  eyebrowAngle: number,
  eyeSpacing: number
) {
  if (eyebrows === 0) return null;

  const leftX = 60 - eyeSpacing;
  const rightX = 60 + eyeSpacing;

  let leftEyebrow = <line x1="-6" y1="0" x2="6" y2="0" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
  let rightEyebrow = <line x1="-6" y1="0" x2="6" y2="0" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;

  if (eyebrows === 1) {
    leftEyebrow = <line x1="-6" y1="-2" x2="6" y2="2" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
    rightEyebrow = <line x1="-6" y1="2" x2="6" y2="-2" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
  } else if (eyebrows === 2) {
    leftEyebrow = <line x1="-6" y1="2" x2="6" y2="-2" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
    rightEyebrow = <line x1="-6" y1="-2" x2="6" y2="2" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
  } else if (eyebrows === 3) {
    leftEyebrow = <line x1="-6" y1="2" x2="6" y2="-2" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
    rightEyebrow = <line x1="-6" y1="2" x2="6" y2="-2" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
  } else if (eyebrows === 4) {
    leftEyebrow = <path d="M -6,1 Q 0,-3 6,1" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
    rightEyebrow = <path d="M -6,1 Q 0,-3 6,1" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
  }
  
  return (
    <g>
      <g transform={`translate(${leftX}, ${eyebrowY}) rotate(${-eyebrowAngle})`}>{leftEyebrow}</g>
      <g transform={`translate(${rightX}, ${eyebrowY}) rotate(${eyebrowAngle})`}>{rightEyebrow}</g>
    </g>
  );
}

/**
 * Renders details detailsSvg: blush, freckles, band-aid.
 */
export function renderSvgNoseDetails(
  nose: number,
  blushScale: number,
  eyeSpacing: number
) {
  const leftX = 60 - eyeSpacing;
  const rightX = 60 + eyeSpacing;

  if (nose === 1) {
    return (
      <g>
        <circle cx={leftX - 5} cy="62" r={5 * blushScale} fill="#ef4444" opacity="0.4" />
        <circle cx={rightX + 5} cy="62" r={5 * blushScale} fill="#ef4444" opacity="0.4" />
      </g>
    );
  } else if (nose === 2) {
    return (
      <g fill="#78350f" opacity="0.8">
        <circle cx={leftX - 4} cy="61" r="0.8" />
        <circle cx={leftX - 1} cy="63" r="1.1" />
        <circle cx={leftX + 2} cy="61" r="0.8" />
        <circle cx={rightX - 2} cy="61" r="0.8" />
        <circle cx={rightX + 1} cy="63" r="1.1" />
        <circle cx={rightX + 4} cy="61" r="0.8" />
      </g>
    );
  } else if (nose === 3) {
    return (
      <g transform="translate(42, 44) rotate(-12)">
        <rect x="0" y="0" width="16" height="7" fill="#fed7aa" rx="1.5" stroke="#1e293b" strokeWidth="1.2" />
        <line x1="8" y1="0" x2="8" y2="7" stroke="#1e293b" strokeWidth="0.8" />
      </g>
    );
  }
  return null;
}

/**
 * Renders the SVG mouth based on index.
 */
export function renderSvgMouth(
  mouth: number,
  mouthY: number,
  mouthScale: number
) {
  let mouthSvg = null;
  if (mouth === 0) {
    mouthSvg = <path d="M -10,-2 Q 0,8 10,-2" fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
  } else if (mouth === 1) {
    mouthSvg = (
      <path d="M -11,-3 C -11,-3 -8,6 0,6 C 8,6 11,-3 11,-3 Z" fill="#b91c1c" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
    );
  } else if (mouth === 2) {
    mouthSvg = (
      <ellipse cx="0" cy="0" rx="6" ry="5.5" fill="#1e293b" />
    );
  } else if (mouth === 3) {
    mouthSvg = (
      <g>
        <path d="M -9,3 Q 0,11 9,3" fill="none" stroke="#1e293b" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 0,-4 C -8,-10 -14,-1 -16,1 C -10,-4 -3,-2 0,-1 C 3,-2 10,-4 16,1 C 14,-1 8,-10 0,-4 Z" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
      </g>
    );
  } else if (mouth === 4) {
    mouthSvg = <path d="M -10,5 Q 0,-3 10,5" fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
  } else if (mouth === 5) {
    mouthSvg = (
      <g>
        <rect x="-10" y="-3" width="20" height="6" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#1e293b" strokeWidth="1" />
        <line x1="-5" y1="-3" x2="-5" y2="3" stroke="#1e293b" strokeWidth="1" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#1e293b" strokeWidth="1" />
        <line x1="5" y1="-3" x2="5" y2="3" stroke="#1e293b" strokeWidth="1" />
      </g>
    );
  } else if (mouth === 6) {
    mouthSvg = <line x1="-10" y1="0" x2="10" y2="0" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />;
  } else if (mouth === 7) {
    mouthSvg = <path d="M -10,-2 Q -5,2 0,-2 Q 5,-6 10,-2" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />;
  }

  return (
    <g transform={`translate(60, ${mouthY}) scale(${mouthScale})`}>
      {mouthSvg}
    </g>
  );
}

