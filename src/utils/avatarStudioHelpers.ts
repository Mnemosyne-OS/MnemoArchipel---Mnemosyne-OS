import { AvatarStudioConfig } from '../types';

export const defaultCfg: AvatarStudioConfig = {
  body: 0,
  color: '#fcd34d',
  eyes: 0,
  nose: 0,
  mouth: 0,
  hat: 0,
  accessories: [],
  eyeSize: 1.0,
  eyeSpacing: 12,
  eyeY: 52,
  eyeColor: '#1e293b',
  eyeAngle: 0,
  pupilSize: 1.0,
  eyebrows: 0,
  eyebrowY: 42,
  eyebrowAngle: 0,
  eyelashes: 0,
  mouthScale: 1.0,
  mouthY: 71,
  blushScale: 1.0
};

export const arraysEqual = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const checkConfigHasChanges = (active: AvatarStudioConfig, original: AvatarStudioConfig): boolean => {
  return (
    active.body !== (original.body ?? defaultCfg.body) ||
    active.color !== (original.color ?? defaultCfg.color) ||
    active.eyes !== (original.eyes ?? defaultCfg.eyes) ||
    active.nose !== (original.nose ?? defaultCfg.nose) ||
    active.mouth !== (original.mouth ?? defaultCfg.mouth) ||
    active.hat !== (original.hat ?? defaultCfg.hat) ||
    !arraysEqual(active.accessories || [], original.accessories || []) ||
    active.eyeSize !== (original.eyeSize ?? defaultCfg.eyeSize) ||
    active.eyeSpacing !== (original.eyeSpacing ?? defaultCfg.eyeSpacing) ||
    active.eyeY !== (original.eyeY ?? defaultCfg.eyeY) ||
    active.eyeColor !== (original.eyeColor ?? defaultCfg.eyeColor) ||
    active.eyeAngle !== (original.eyeAngle ?? defaultCfg.eyeAngle) ||
    active.pupilSize !== (original.pupilSize ?? defaultCfg.pupilSize) ||
    active.eyebrows !== (original.eyebrows ?? defaultCfg.eyebrows) ||
    active.eyebrowY !== (original.eyebrowY ?? defaultCfg.eyebrowY) ||
    active.eyebrowAngle !== (original.eyebrowAngle ?? defaultCfg.eyebrowAngle) ||
    active.eyelashes !== (original.eyelashes ?? defaultCfg.eyelashes) ||
    active.mouthScale !== (original.mouthScale ?? defaultCfg.mouthScale) ||
    active.mouthY !== (original.mouthY ?? defaultCfg.mouthY) ||
    active.blushScale !== (original.blushScale ?? defaultCfg.blushScale)
  );
};

export const generateRandomConfig = (): AvatarStudioConfig => {
  const skinTones = ['#fcd34d', '#fdba74', '#b45309', '#ffedd5', '#fecdd3'];
  const eyeColors = ['#1e293b', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#db2777'];
  
  const numAccs = Math.floor(Math.random() * 6);
  const randomAccs: number[] = [];
  while (randomAccs.length < numAccs) {
    const id = Math.floor(Math.random() * 17);
    if (!randomAccs.includes(id)) {
      randomAccs.push(id);
    }
  }

  return {
    body: Math.floor(Math.random() * 5),
    color: skinTones[Math.floor(Math.random() * skinTones.length)],
    eyes: Math.floor(Math.random() * 4),
    nose: Math.floor(Math.random() * 4),
    mouth: Math.floor(Math.random() * 8),
    hat: Math.floor(Math.random() * 12),
    accessories: randomAccs,
    eyeSize: Number((0.7 + Math.random() * 0.8).toFixed(2)),
    eyeSpacing: Math.floor(8 + Math.random() * 10),
    eyeY: Math.floor(48 + Math.random() * 10),
    eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
    eyeAngle: Math.floor(-10 + Math.random() * 20),
    pupilSize: Number((0.6 + Math.random() * 0.9).toFixed(2)),
    eyebrows: Math.floor(Math.random() * 5),
    eyebrowY: Math.floor(36 + Math.random() * 12),
    eyebrowAngle: Math.floor(-15 + Math.random() * 30),
    eyelashes: Math.floor(Math.random() * 3),
    mouthScale: Number((0.7 + Math.random() * 0.8).toFixed(2)),
    mouthY: Math.floor(66 + Math.random() * 12),
    blushScale: Number((0.6 + Math.random() * 0.9).toFixed(2))
  };
};
