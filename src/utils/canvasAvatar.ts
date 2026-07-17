import { AvatarStudioConfig } from '../types';
import {
  drawMagicalEars,
  drawMagicalHeadShape,
  drawFigureHeadShape
} from './canvasAvatarParts1';
import {
  drawAvatarEyes,
  drawAvatarNose,
  drawAvatarMouth
} from './canvasAvatarParts2';
import {
  drawFigureHats,
  drawAvatarAccessories
} from './canvasAvatarParts3';

/**
 * Draws the customized avatar head on a 2D canvas context.
 * Delegates drawing coordinates and styles to canvasAvatarParts modules.
 */
export function drawFigureCanvas(
  ctx: CanvasRenderingContext2D, 
  cx: number, 
  cy: number, 
  r: number, 
  config: AvatarStudioConfig,
  style: 'human' | 'magical' = 'human'
) {
  const { 
    body = 0,
    color, 
    nose = 0, 
    hat = 0,
    accessories = []
  } = config;

  const s = r / 30; // Scale factor based on radius
  const strokeW = Math.max(1.5, r * 0.08);

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const headColor = color || '#fcd34d';

  if (style === 'magical') {
    // 1. Draw magical ears / horns
    drawMagicalEars(ctx, cx, cy, s, body, headColor, strokeW);
    // 2. Draw magical base head shape
    drawMagicalHeadShape(ctx, cx, cy, s, body, headColor, strokeW);
  } else {
    // 1. Draw Avatar base shape & ears
    drawFigureHeadShape(ctx, cx, cy, s, body, headColor, strokeW);
  }

  // 3. Draw Eyes & Eyebrows
  drawAvatarEyes(ctx, cx, cy, s, config);

  // 4. Draw Nose / Freckles / Blush
  drawAvatarNose(ctx, cx, cy, s, nose, config);

  // 5. Draw Mouth
  drawAvatarMouth(ctx, cx, cy, s, config);

  // 6. Draw Hair / Hats
  const hairColor = hat === 0 ? '#78350f' : hat === 1 ? '#1e293b' : hat === 2 ? '#ef4444' : '#f59e0b';
  drawFigureHats(ctx, cx, cy, s, hat, style, hairColor);

  // 7. Draw accessories orbit badges
  drawAvatarAccessories(ctx, cx, cy, s, accessories);

  ctx.restore();
}
