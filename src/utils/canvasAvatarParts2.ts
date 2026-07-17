import { AvatarStudioConfig } from '../types';

/**
 * Draws left and right eyes based on config parameters.
 */
export function drawAvatarEyes(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  config: AvatarStudioConfig
) {
  const {
    eyes = 0,
    eyeSize = 1.0,
    eyeSpacing = 12,
    eyeY = 52,
    eyeColor = '#1e293b',
    eyeAngle = 0,
    pupilSize = 1.0,
    eyebrows = 0,
    eyebrowY = 42,
    eyebrowAngle = 0,
    eyelashes = 0
  } = config;

  const leftX = 60 - eyeSpacing;
  const rightX = 60 + eyeSpacing;

  const drawSingleEye = (ex: number, ey: number, isRight: boolean) => {
    ctx.save();
    ctx.translate(cx + (ex - 60) * s, cy + (ey - 60) * s);
    ctx.scale(eyeSize * s, eyeSize * s);
    ctx.rotate((isRight ? eyeAngle : -eyeAngle) * Math.PI / 180);

    if (eyes === 0 || eyes === 3) {
      // Points
      if (eyes === 3 && !isRight) {
        // Wink left
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 6, Math.PI, 0);
        ctx.stroke();
      } else {
        // Normal eye
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(0, 0, 3 * pupilSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-1.5, -1.5, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Eyelashes
      if (eyelashes > 0 && !(eyes === 3 && !isRight)) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        if (eyelashes === 1) {
          // Short
          ctx.beginPath();
          if (isRight) {
            ctx.moveTo(4, -4); ctx.lineTo(6, -7);
            ctx.moveTo(1, -5); ctx.lineTo(2, -9);
            ctx.moveTo(-2, -5); ctx.lineTo(-3, -8);
          } else {
            ctx.moveTo(-4, -4); ctx.lineTo(-6, -7);
            ctx.moveTo(-1, -5); ctx.lineTo(-2, -9);
            ctx.moveTo(2, -5); ctx.lineTo(3, -8);
          }
          ctx.stroke();
        } else {
          // Long
          ctx.beginPath();
          if (isRight) {
            ctx.moveTo(5, -3); ctx.lineTo(9, -6);
            ctx.moveTo(2, -5); ctx.lineTo(4, -10);
            ctx.moveTo(-1, -5); ctx.lineTo(-2, -10);
            ctx.moveTo(-4, -4); ctx.lineTo(-7, -8);
          } else {
            ctx.moveTo(-5, -3); ctx.lineTo(-9, -6);
            ctx.moveTo(-2, -5); ctx.lineTo(-4, -10);
            ctx.moveTo(1, -5); ctx.lineTo(2, -10);
            ctx.moveTo(4, -4); ctx.lineTo(7, -8);
          }
          ctx.stroke();
        }
      }
    } else if (eyes === 1) {
      // Squint
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 2, 7, Math.PI, 0);
      ctx.stroke();
      if (eyelashes > 0) {
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-6, -2); ctx.lineTo(-9, -5);
        ctx.moveTo(0, -4); ctx.lineTo(0, -8);
        ctx.moveTo(6, -2); ctx.lineTo(9, -5);
        ctx.stroke();
      }
    } else if (eyes === 2) {
      // Glasses
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-1.5, -1.5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -6); ctx.lineTo(2, 2);
      ctx.stroke();
    }
    ctx.restore();
  };

  drawSingleEye(leftX, eyeY, false);
  drawSingleEye(rightX, eyeY, true);

  // Glasses bridge connector
  if (eyes === 2) {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5 * s; // Match standard strokeW
    ctx.beginPath();
    ctx.moveTo(cx + (leftX + 4 - 60) * s, cy + (eyeY - 60) * s);
    ctx.lineTo(cx + (rightX - 4 - 60) * s, cy + (eyeY - 60) * s);
    ctx.stroke();
  }

  // Draw Eyebrows
  if (eyebrows > 0) {
    const drawEyebrow = (ex: number, isRight: boolean) => {
      ctx.save();
      ctx.translate(cx + (ex - 60) * s, cy + (eyebrowY - 60) * s);
      ctx.rotate((isRight ? eyebrowAngle : -eyebrowAngle) * Math.PI / 180);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3.5 * s;
      ctx.beginPath();
      if (eyebrows === 1) {
        // Straight
        ctx.moveTo(-8 * s, 0); ctx.lineTo(8 * s, 0);
      } else if (eyebrows === 2) {
        // Angry
        if (isRight) {
          ctx.moveTo(-8 * s, 4 * s); ctx.lineTo(8 * s, -2 * s);
        } else {
          ctx.moveTo(-8 * s, -2 * s); ctx.lineTo(8 * s, 4 * s);
        }
      } else if (eyebrows === 3) {
        // Sad
        if (isRight) {
          ctx.moveTo(-8 * s, -2 * s); ctx.lineTo(8 * s, 4 * s);
        } else {
          ctx.moveTo(-8 * s, 4 * s); ctx.lineTo(8 * s, -2 * s);
        }
      } else if (eyebrows === 4) {
        // Curved
        ctx.arc(0, 2 * s, 7 * s, Math.PI, 0);
      }
      ctx.stroke();
      ctx.restore();
    };

    drawEyebrow(leftX, false);
    drawEyebrow(rightX, true);
  }
}

/**
 * Draws nose decorations, freckles, blush, or band-aid.
 */
export function drawAvatarNose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  nose: number,
  config: AvatarStudioConfig
) {
  const {
    eyeSpacing = 12,
    blushScale = 1.0
  } = config;

  const leftX = 60 - eyeSpacing;
  const rightX = 60 + eyeSpacing;

  if (nose === 1) {
    // Blush
    ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.beginPath();
    ctx.arc(cx + (leftX - 6 - 60) * s, cy + (62 - 60) * s, 5.5 * blushScale * s, 0, Math.PI * 2);
    ctx.arc(cx + (rightX + 6 - 60) * s, cy + (62 - 60) * s, 5.5 * blushScale * s, 0, Math.PI * 2);
    ctx.fill();
  } else if (nose === 2) {
    // Freckles
    ctx.fillStyle = '#7c2d12';
    const points = [
      { x: leftX - 5, y: 60 }, { x: leftX - 2, y: 62 }, { x: leftX + 1, y: 60 },
      { x: rightX - 1, y: 60 }, { x: rightX + 2, y: 62 }, { x: rightX + 5, y: 60 }
    ];
    points.forEach(pt => {
      ctx.beginPath();
      ctx.arc(cx + (pt.x - 60) * s, cy + (pt.y - 60) * s, 1.3 * s, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (nose === 3) {
    // Band-aid
    ctx.fillStyle = '#fed7aa';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5 * s;
    ctx.save();
    ctx.translate(cx + (42 - 60) * s, cy + (44 - 60) * s);
    ctx.rotate(-12 * Math.PI / 180);
    ctx.beginPath();
    ctx.rect(0, 0, 16 * s, 7 * s);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Draws the avatar mouth based on config index.
 */
export function drawAvatarMouth(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  config: AvatarStudioConfig
) {
  const {
    mouth = 0,
    mouthScale = 1.0,
    mouthY = 71
  } = config;

  ctx.save();
  ctx.translate(cx, cy + (mouthY - 60) * s);
  ctx.scale(mouthScale * s, mouthScale * s);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3.5;
  ctx.fillStyle = '#b91c1c';

  if (mouth === 0) {
    ctx.beginPath();
    ctx.arc(0, -2, 13, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  } else if (mouth === 1) {
    ctx.beginPath();
    ctx.arc(0, -2, 13, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (mouth === 2) {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (mouth === 3) {
    // mustache & smile
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(0, -6, 20, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (mouth === 4) {
    // Sad
    ctx.beginPath();
    ctx.arc(0, 8, 13, 1.1 * Math.PI, 1.9 * Math.PI);
    ctx.stroke();
  } else if (mouth === 5) {
    // Angry teeth
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(-12, -4, 24, 8);
    ctx.fill();
    ctx.stroke();
    // Grid lines
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-12, 0); ctx.lineTo(12, 0);
    ctx.moveTo(-6, -4); ctx.lineTo(-6, 4);
    ctx.moveTo(0, -4); ctx.lineTo(0, 4);
    ctx.moveTo(6, -4); ctx.lineTo(6, 4);
    ctx.stroke();
  } else if (mouth === 6) {
    // Neutral
    ctx.beginPath();
    ctx.moveTo(-12, 0); ctx.lineTo(12, 0);
    ctx.stroke();
  } else if (mouth === 7) {
    // Scared wave
    ctx.beginPath();
    ctx.moveTo(-12, -2);
    ctx.quadraticCurveTo(-6, 3, 0, -2);
    ctx.quadraticCurveTo(6, -7, 12, -2);
    ctx.stroke();
  }
  ctx.restore();
}
