import React from 'react';
import { AvatarStudioConfig, Contact } from '../types';
import {
  renderSvgBaseAndEars,
  renderSvgEyes,
  renderSvgHats,
  renderSvgAccessories
} from './AvatarSvgParts';
import {
  renderSvgEyebrows,
  renderSvgNoseDetails,
  renderSvgMouth,
  renderAccessorySvg,
  AvatarFeaturePreview
} from './FigureSvgParts';

export { renderAccessorySvg, AvatarFeaturePreview };

/**
 * Renders the custom Avatar or Magical avatar as an SVG element.
 * Delegates individual feature SVGs to AvatarStudioComponentSvgParts module.
 */
export const AvatarStudioComponent: React.FC<{ 
  config: AvatarStudioConfig; 
  size?: number; 
  style?: 'human' | 'magical';
}> = ({ config, size = 48, style = 'human' }) => {
  const { 
    body = 0,
    color, 
    eyes = 0, 
    nose = 0, 
    mouth = 0, 
    hat = 0,
    accessories = [],
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
  
  const headColor = color || '#fcd34d';

  // 1. Base Head & Ears/Horns
  const headSvg = renderSvgBaseAndEars(style, body, headColor);

  // 2. Eyes & Bridge
  const { leftEye, rightEye, bridge } = renderSvgEyes(
    eyes,
    eyeSpacing,
    eyeY,
    eyeSize,
    eyeAngle,
    pupilSize,
    eyeColor,
    eyelashes
  );

  // 3. Eyebrows
  const eyebrowsGroup = renderSvgEyebrows(eyebrows, eyebrowY, eyebrowAngle, eyeSpacing);

  // 4. Nose Details / Blush / Freckles
  const detailsSvg = renderSvgNoseDetails(nose, blushScale, eyeSpacing);

  // 5. Mouth
  const mouthGroup = renderSvgMouth(mouth, mouthY, mouthScale);

  // 6. Hats / Hairstyles
  const hatSvg = renderSvgHats(hat, style, headColor, body);

  // 7. Accessories orbit badges
  const accessoriesGroup = renderSvgAccessories(accessories);

  return (
    <svg 
      viewBox="0 0 120 120" 
      width={size} 
      height={size} 
      style={{ 
        display: 'inline-block', 
        overflow: 'visible',
        filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
        verticalAlign: 'middle'
      }}
    >
      {headSvg}
      {leftEye}
      {rightEye}
      {bridge}
      {eyebrowsGroup}
      {mouthGroup}
      {detailsSvg}
      {hatSvg}
      {accessoriesGroup}
    </svg>
  );
};

/**
 * Standard contact avatar renderer widget supporting fallback initials if config is not present.
 */
export const renderContactAvatar = (contact: Contact, size = 32, style: 'human' | 'magical' = 'human') => {
  if (contact.avatarConfig) {
    return <AvatarStudioComponent config={contact.avatarConfig} size={size} style={style} />;
  }
  if (contact.avatar === '👤' || !contact.avatar) {
    const initial = contact.name ? contact.name.trim().charAt(0).toUpperCase() : '?';
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    const charCodeSum = contact.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const bg = colors[charCodeSum % colors.length];
    
    return (
      <div 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: bg,
          color: '#ffffff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: `${size * 0.48}px`,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          userSelect: 'none',
          fontFamily: 'inherit'
        }}
      >
        {initial}
      </div>
    );
  }
  return <span style={{ fontSize: `${size * 0.6}px`, lineHeight: 1 }}>{contact.avatar}</span>;
};
