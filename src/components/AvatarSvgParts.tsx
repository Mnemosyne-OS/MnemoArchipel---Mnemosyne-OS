
import { renderAccessorySvg } from './FigureSvgParts';

/**
 * Renders the head base and ears/horns (either Avatar or Magical).
 */
export function renderSvgBaseAndEars(
  style: 'human' | 'magical',
  body: number,
  headColor: string
) {
  let headPath = "M 34,42 C 34,22 86,22 86,42 L 86,72 C 86,85 78,92 60,92 C 42,92 34,85 34,72 Z";
  let headShadow = "M 34,72 C 34,85 42,92 60,92 C 78,92 86,85 86,72 C 86,77 78,86 60,86 C 42,86 34,77 34,72 Z";

  if (body === 1) {
    headPath = "M 35,40 C 35,18 85,18 85,40 L 85,76 C 85,92 76,96 60,96 C 44,96 35,92 35,76 Z";
    headShadow = "M 35,76 C 35,92 44,96 60,96 C 76,96 85,92 85,76 C 85,81 76,90 60,90 C 44,90 35,81 35,76 Z";
  } else if (body === 2) {
    headPath = "M 33,40 C 33,26 87,26 87,40 L 87,76 C 87,85 81,89 77,89 L 43,89 C 39,89 33,85 33,76 Z";
    headShadow = "M 33,76 C 33,85 39,89 43,89 L 77,89 C 81,89 87,85 87,76 C 87,80 81,84 77,84 L 43,84 C 39,84 33,80 33,76 Z";
  } else if (body === 3) {
    headPath = "M 34,42 C 34,22 86,22 86,42 L 84,68 C 84,80 72,94 60,94 C 48,94 36,80 36,68 Z";
    headShadow = "M 36,68 C 36,80 48,94 60,94 C 72,94 84,80 84,68 C 84,73 72,88 60,88 C 48,88 36,73 36,68 Z";
  } else if (body === 4) {
    headPath = "M 34,42 C 34,20 86,20 86,42 C 92,54 90,74 84,82 C 78,90 70,94 60,94 C 50,94 42,90 36,82 C 30,74 28,54 34,42 Z";
    headShadow = "M 36,82 C 42,90 50,94 60,94 C 70,94 78,90 84,82 C 84,85 70,89 60,89 C 50,89 36,85 36,82 Z";
  }

  if (style === 'magical') {
    let animalBase = null;
    let animalEars = null;

    if (body === 0) {
      animalEars = (
        <g>
          <path d="M 32,34 Q 22,12 28,26 Z" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
          <path d="M 88,34 Q 98,12 92,26 Z" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
        </g>
      );
      animalBase = (
        <g>
          <path d="M 38,42 C 34,26 86,26 82,42 L 80,72 C 80,88 60,94 60,94 C 60,94 40,88 40,72 Z" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
          <ellipse cx="60" cy="80" rx="14" ry="8" fill="#fbcfe8" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="55" cy="80" r="1.5" fill="#db2777" />
          <circle cx="65" cy="80" r="1.5" fill="#db2777" />
          <path d="M 60,6 Q 55,28 56,32 L 64,32 Q 65,28 60,6 Z" fill="url(#hornGrad)" stroke="#1e293b" strokeWidth="2" />
          <path d="M 28,68 Q 6,56 12,82 Q 22,86 28,78" fill="#fff" stroke="#1e293b" strokeWidth="1.8" />
          <path d="M 92,68 Q 114,56 108,82 Q 98,86 92,78" fill="#fff" stroke="#1e293b" strokeWidth="1.8" />
        </g>
      );
    } else if (body === 1) {
      animalEars = (
        <g>
          <path d="M 36,36 L 22,10 L 44,24 Z" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
          <path d="M 34,32 L 26,16 L 40,24 Z" fill="#fbcfe8" />
          <path d="M 84,36 L 98,10 L 76,24 Z" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
          <path d="M 86,32 L 94,16 L 80,24 Z" fill="#fbcfe8" />
        </g>
      );
      animalBase = (
        <g>
          <path d="M 34,44 C 30,30 90,30 86,44 C 94,54 90,74 84,82 Q 60,96 36,82 C 30,74 26,54 34,44 Z" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
          <path d="M 32,60 Q 42,70 50,68 C 42,76 34,70 30,64 Z" fill="#fff" stroke="#1e293b" strokeWidth="1.2" />
          <path d="M 88,60 Q 78,70 70,68 C 78,76 86,70 90,64 Z" fill="#fff" stroke="#1e293b" strokeWidth="1.2" />
          <polygon points="60,74 57,70 63,70" fill="#1e293b" />
          <path d="M 60,34 L 62,38 L 66,38 L 63,41 L 64,45 L 60,42 L 56,45 L 57,41 L 54,38 L 58,38 Z" fill="#a855f7" />
        </g>
      );
    } else if (body === 2) {
      animalEars = (
        <g>
          <circle cx="36" cy="24" r="12" fill="#1e293b" stroke="#1e293b" strokeWidth="2" />
          <circle cx="36" cy="24" r="7" fill="#a855f7" />
          <circle cx="84" cy="24" r="12" fill="#1e293b" stroke="#1e293b" strokeWidth="2" />
          <circle cx="84" cy="24" r="7" fill="#a855f7" />
        </g>
      );
      animalBase = (
        <g>
          <circle cx="60" cy="58" r="26" fill="#fff" stroke="#1e293b" strokeWidth="2.5" />
          <ellipse cx="48" cy="54" rx="10" ry="12" fill="#1e293b" transform="rotate(-15 48 54)" />
          <ellipse cx="72" cy="54" rx="10" ry="12" fill="#1e293b" transform="rotate(15 72 54)" />
          <ellipse cx="60" cy="66" rx="3.5" ry="2" fill="#1e293b" />
          <path d="M 28,48 C 12,32 10,64 28,60 Z" fill="#f472b6" opacity="0.8" stroke="#1e293b" strokeWidth="1.2" />
          <path d="M 92,48 C 108,32 110,64 92,60 Z" fill="#f472b6" opacity="0.8" stroke="#1e293b" strokeWidth="1.2" />
        </g>
      );
    } else if (body === 3) {
      animalEars = (
        <g>
          <path d="M 38,36 Q 26,18 42,28 Z" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
          <path d="M 82,36 Q 94,18 78,28 Z" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
        </g>
      );
      animalBase = (
        <g>
          <circle cx="60" cy="56" r="25" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="48" cy="52" r="10" fill="#fff" opacity="0.15" />
          <circle cx="72" cy="52" r="10" fill="#fff" opacity="0.15" />
          <polygon points="60,65 56,58 64,58" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" />
        </g>
      );
    } else {
      animalEars = (
        <g>
          <path d="M 40,30 Q 30,8 32,18 Z" fill="#f43f5e" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M 80,30 Q 90,8 88,18 Z" fill="#f43f5e" stroke="#1e293b" strokeWidth="2.5" />
        </g>
      );
      animalBase = (
        <g>
          <path d="M 34,44 C 34,22 86,22 86,44 L 86,72 C 86,86 78,92 60,92 C 42,92 34,86 34,72 Z" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="42" cy="68" r="2.5" fill="#f43f5e" />
          <circle cx="78" cy="68" r="2.5" fill="#f43f5e" />
          <path d="M 48,74 Q 60,82 72,74 Z" fill="rgba(0,0,0,0.06)" />
          <path d="M 28,52 Q 4,40 10,64 L 28,68 Z" fill="#1e293b" stroke="#1e293b" strokeWidth="1.2" />
          <path d="M 92,52 Q 116,40 110,64 L 92,68 Z" fill="#1e293b" stroke="#1e293b" strokeWidth="1.2" />
        </g>
      );
    }

    return (
      <g>
        <linearGradient id="hornGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        {animalEars}
        {animalBase}
      </g>
    );
  }

  return (
    <g>
      <circle cx="30" cy="56" r="6" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
      <circle cx="90" cy="56" r="6" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
      <rect x="52" y="80" width="16" height="15" fill={headColor} stroke="#1e293b" strokeWidth="2.5" />
      <path d={headPath} fill={headColor} stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={headShadow} fill="rgba(0,0,0,0.1)" />
    </g>
  );
}

/**
 * Renders the SVG left & right eyes and bridge connector.
 */
export function renderSvgEyes(
  eyes: number,
  eyeSpacing: number,
  eyeY: number,
  eyeSize: number,
  eyeAngle: number,
  pupilSize: number,
  eyeColor: string,
  eyelashes: number
) {
  const leftX = 60 - eyeSpacing;
  const rightX = 60 + eyeSpacing;
  
  let leftEye = null;
  let rightEye = null;
  let bridge = null;

  if (eyes === 0 || eyes === 3) {
    leftEye = (
      <g transform={`translate(${leftX}, ${eyeY}) scale(${eyeSize}) rotate(${-eyeAngle})`}>
        {eyes === 3 ? (
          <path d="M -5,0 Q 0,-4 5,0" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <g>
            <circle cx="0" cy="0" r="5" fill="#fff" stroke="#1e293b" strokeWidth="1" />
            <circle cx="0" cy="0" r={2.5 * pupilSize} fill={eyeColor} />
            <circle cx="-1" cy="-1" r="0.8" fill="#fff" />
          </g>
        )}
      </g>
    );

    rightEye = (
      <g transform={`translate(${rightX}, ${eyeY}) scale(${eyeSize}) rotate(${eyeAngle})`}>
        <circle cx="0" cy="0" r="5" fill="#fff" stroke="#1e293b" strokeWidth="1" />
        <circle cx="0" cy="0" r={2.5 * pupilSize} fill={eyeColor} />
        <circle cx="-1" cy="-1" r="0.8" fill="#fff" />
      </g>
    );
  } else if (eyes === 1) {
    leftEye = (
      <g transform={`translate(${leftX}, ${eyeY}) scale(${eyeSize}) rotate(${-eyeAngle})`}>
        {eyelashes === 1 && <path d="M -6,-2 L -8,-7" stroke="#1e293b" strokeWidth="1" />}
        {eyelashes === 2 && <g><path d="M -6,-2 L -8,-7" stroke="#1e293b" strokeWidth="1" /><path d="M 6,-2 L 8,-7" stroke="#1e293b" strokeWidth="1" /></g>}
        <path d="M -5,2 Q 0,-4 5,2" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
    rightEye = (
      <g transform={`translate(${rightX}, ${eyeY}) scale(${eyeSize}) rotate(${eyeAngle})`}>
        {eyelashes === 1 && <path d="M 6,-2 L 8,-7" stroke="#1e293b" strokeWidth="1" />}
        {eyelashes === 2 && <g><path d="M -6,-2 L -8,-7" stroke="#1e293b" strokeWidth="1" /><path d="M 6,-2 L 8,-7" stroke="#1e293b" strokeWidth="1" /></g>}
        <path d="M -5,2 Q 0,-4 5,2" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  } else if (eyes === 2) {
    leftEye = (
      <g transform={`translate(${leftX}, ${eyeY}) scale(${eyeSize}) rotate(${-eyeAngle})`}>
        <circle cx="0" cy="0" r="8" fill="none" stroke="#1e293b" strokeWidth="3" />
        <circle cx="0" cy="0" r={3.5 * pupilSize} fill="#1e293b" />
        <circle cx="-1" cy="-1" r="0.8" fill="#fff" />
        <line x1="-5" y1="-5" x2="2" y2="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    );
    rightEye = (
      <g transform={`translate(${rightX}, ${eyeY}) scale(${eyeSize}) rotate(${eyeAngle})`}>
        <circle cx="0" cy="0" r="8" fill="none" stroke="#1e293b" strokeWidth="3" />
        <circle cx="0" cy="0" r={3.5 * pupilSize} fill="#1e293b" />
        <circle cx="-1" cy="-1" r="0.8" fill="#fff" />
        <line x1="-5" y1="-5" x2="2" y2="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    );
    bridge = (
      <line x1={leftX + 5} y1={eyeY} x2={rightX - 5} y2={eyeY} stroke="#1e293b" strokeWidth="3.5" />
    );
  }

  return { leftEye, rightEye, bridge };
}



/**
 * Renders the chosen hat/hairstyle in SVG.
 */
export function renderSvgHats(
  hat: number,
  style: 'human' | 'magical',
  _headColor: string,
  _body: number
) {
  if (style === 'magical') {
    if (hat === 1) {
      return (
        <g>
          <polygon points="44,28 48,16 60,24 72,16 76,28" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="48" cy="15" r="2" fill="#ef4444" />
          <circle cx="60" cy="23" r="2" fill="#3b82f6" />
          <circle cx="72" cy="15" r="2" fill="#ec4899" />
        </g>
      );
    } else if (hat === 2) {
      return (
        <g>
          <circle cx="48" cy="30" r="4.5" fill="#fb7185" stroke="#1e293b" strokeWidth="1" />
          <circle cx="60" cy="27" r="4.5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1" />
          <circle cx="72" cy="30" r="4.5" fill="#a7f3d0" stroke="#1e293b" strokeWidth="1" />
        </g>
      );
    } else if (hat === 3) {
      return (
        <ellipse cx="60" cy="24" rx="20" ry="5" fill="none" stroke="#f59e0b" strokeWidth="3.5" style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }} />
      );
    } else if (hat === 4) {
      return (
        <g>
          <polygon points="38,34 60,4 82,34" fill="#6d28d9" stroke="#1e293b" strokeWidth="2" />
          <circle cx="60" cy="3" r="2.5" fill="#f59e0b" />
        </g>
      );
    }
    return null;
  }

  // Avatar style hats
  if (hat === 0) {
    return (
      <path d="M 31,42 C 28,12 92,12 89,42 C 93,52 86,52 84,44 C 82,34 76,36 60,36 C 44,36 38,34 36,44 C 34,52 27,52 31,42 Z" fill="#78350f" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
    );
  } else if (hat === 1) {
    return (
      <path d="M 33,40 C 31,32 35,22 40,26 C 43,18 48,12 54,19 C 58,9 65,9 68,17 C 72,12 77,18 82,25 C 86,22 89,32 87,40 C 78,36 42,36 33,40 Z" fill="#1e293b" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
    );
  } else if (hat === 2) {
    return (
      <g>
        <path d="M 33,38 C 30,12 90,12 87,38 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="3" />
        <path d="M 44,38 C 42,22 78,22 76,38 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
        <path d="M 24,37 Q 60,24 96,37 L 105,43 Q 60,30 15,43 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
      </g>
    );
  } else if (hat === 3) {
    return (
      <g>
        <polygon points="35,28 43,11 60,25 77,11 85,28" fill="#f59e0b" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="43" cy="11" r="3.5" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" />
        <circle cx="60" cy="25" r="3.5" fill="#3b82f6" stroke="#1e293b" strokeWidth="1.5" />
        <circle cx="77" cy="11" r="3.5" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" />
      </g>
    );
  } else if (hat === 4) {
    return (
      <g>
        <path d="M 31,42 C 28,12 92,12 89,42 C 86,52 84,65 82,78 C 80,82 76,82 78,72 C 80,50 78,38 60,38 C 42,38 40,50 42,72 C 44,82 40,82 38,78 C 36,65 34,52 31,42 Z" fill="#f59e0b" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
        <path d="M 33,35 C 33,25 87,25 87,35" fill="none" stroke="#ec4899" strokeWidth="3.5" />
      </g>
    );
  } else if (hat === 5) {
    return (
      <g>
        <path d="M 33,38 C 30,14 90,14 87,38 Z" fill="#0d9488" stroke="#1e293b" strokeWidth="3" />
        <rect x="30" y="32" width="60" height="8" rx="4" fill="#0f766e" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="60" cy="12" r="7" fill="#f5f5f5" stroke="#1e293b" strokeWidth="2" />
      </g>
    );
  } else if (hat === 6) {
    return (
      <path d="M 33,40 C 15,35 15,5 35,-5 C 50,-20 70,-20 85,-5 C 105,5 105,35 87,40 C 78,38 42,38 33,40 Z" fill="#18181b" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
    );
  } else if (hat === 7) {
    return (
      <g>
        <rect x="42" y="24" width="36" height="15" fill="#f8fafc" stroke="#1e293b" strokeWidth="3" />
        <path d="M 42,25 C 28,15 32,-15 50,-5 C 55,-20 65,-20 70,-5 C 88,-15 92,15 78,25 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
      </g>
    );
  } else if (hat === 8) {
    return (
      <g>
        <path d="M 33,40 C 33,30 87,30 87,40" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
        <path d="M 20,32 C 30,12 90,12 100,32 C 75,25 45,25 20,32 Z" fill="#18181b" stroke="#1e293b" strokeWidth="3" />
        <path d="M 20,32 C 30,12 90,12 100,32" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="60" y="24" fontSize="10" textAnchor="middle" fill="#fff" style={{ userSelect: 'none', fontFamily: 'Arial' }}>☠️</text>
      </g>
    );
  } else if (hat === 9) {
    return (
      <g>
        <path d="M 31,42 C 28,12 92,12 89,42 C 93,52 86,52 84,44 Z" fill="#78350f" stroke="#1e293b" strokeWidth="2.5" />
        <path d="M 30,56 C 30,16 90,16 90,56" fill="none" stroke="#ec4899" strokeWidth="4" />
        <rect x="25" y="46" width="6" height="20" rx="3" fill="#18181b" stroke="#1e293b" strokeWidth="2" />
        <rect x="21" y="48" width="4" height="16" rx="2" fill="#ec4899" />
        <rect x="89" y="46" width="6" height="20" rx="3" fill="#18181b" stroke="#1e293b" strokeWidth="2" />
        <rect x="95" y="48" width="4" height="16" rx="2" fill="#ec4899" />
      </g>
    );
  } else if (hat === 10) {
    return (
      <g>
        <ellipse cx="60" cy="38" rx="35" ry="6" fill="#5b21b6" stroke="#1e293b" strokeWidth="3" />
        <path d="M 38,36 Q 60,0 72,-5 Q 65,22 82,36 Z" fill="#6d28d9" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
        <rect x="52" y="32" width="16" height="6" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" />
      </g>
    );
  } else if (hat === 11) {
    return (
      <g>
        <path d="M 31,42 C 28,12 92,12 89,42 C 86,52 84,70 82,88 C 80,92 72,92 74,80 C 76,60 78,38 60,38 C 42,38 44,60 46,80 C 48,92 40,92 38,88 C 36,70 34,52 31,42 Z" fill="#ea580c" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
        <path d="M 34,36 C 45,30 75,30 86,36" fill="none" stroke="#c2410c" strokeWidth="3" />
      </g>
    );
  }
  return null;
}

/**
 * Renders the orbit accessories SVG group.
 */
export function renderSvgAccessories(
  accessories: number[]
) {
  const orbitCoords = [
    { x: 18, y: 92 },
    { x: 102, y: 92 },
    { x: 12, y: 60 },
    { x: 108, y: 60 },
    { x: 18, y: 28 }
  ];

  return accessories.slice(0, 5).map((accId, index) => {
    const coords = orbitCoords[index];
    if (!coords) return null;
    return (
      <g key={index} transform={`translate(${coords.x}, ${coords.y})`}>
        <circle cx="0" cy="0" r="10.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.8" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} />
        <g transform="translate(-7, -7) scale(0.58)">
          {renderAccessorySvg(Number(accId))}
        </g>
      </g>
    );
  });
}
