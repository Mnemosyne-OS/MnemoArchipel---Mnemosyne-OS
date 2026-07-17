/**
 * Renders the chosen hat/hairstyle in 2D canvas context.
 */
export function drawFigureHats(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  hat: number,
  style: 'human' | 'magical',
  hairColor: string = '#1e293b'
) {
  ctx.fillStyle = hairColor;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2 * s;

  if (style === 'magical') {
    if (hat === 0) { // Crown
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(cx + (40 - 60) * s, cy + (30 - 60) * s);
      ctx.lineTo(cx + (44 - 60) * s, cy + (12 - 60) * s);
      ctx.lineTo(cx, cy + (22 - 60) * s);
      ctx.lineTo(cx + (76 - 60) * s, cy + (12 - 60) * s);
      ctx.lineTo(cx + (80 - 60) * s, cy + (30 - 60) * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(cx + (44 - 60) * s, cy + (12 - 60) * s, 3 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath(); ctx.arc(cx, cy + (22 - 60) * s, 3 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(cx + (76 - 60) * s, cy + (12 - 60) * s, 3 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (hat === 1) { // Jester
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(cx + (35 - 60) * s, cy + (34 - 60) * s);
      ctx.bezierCurveTo(cx + (25 - 60) * s, cy + (10 - 60) * s, cx + (55 - 60) * s, cy + (10 - 60) * s, cx + (48 - 60) * s, cy + (26 - 60) * s);
      ctx.lineTo(cx + (72 - 60) * s, cy + (26 - 60) * s);
      ctx.bezierCurveTo(cx + (65 - 60) * s, cy + (10 - 60) * s, cx + (95 - 60) * s, cy + (10 - 60) * s, cx + (85 - 60) * s, cy + (34 - 60) * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(cx + (48 - 60) * s, cy + (15 - 60) * s, 2 * s, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath(); ctx.arc(cx + (60 - 60) * s, cy + (23 - 60) * s, 2 * s, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ec4899';
      ctx.beginPath(); ctx.arc(cx + (72 - 60) * s, cy + (15 - 60) * s, 2 * s, 0, Math.PI * 2); ctx.fill();
    } else if (hat === 2) { // Flower wreath
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1 * s;
      ctx.fillStyle = '#fb7185';
      ctx.beginPath(); ctx.arc(cx + (48 - 60) * s, cy + (30 - 60) * s, 4.5 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(cx + (60 - 60) * s, cy + (27 - 60) * s, 4.5 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#a7f3d0';
      ctx.beginPath(); ctx.arc(cx + (72 - 60) * s, cy + (30 - 60) * s, 4.5 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (hat === 3) { // Halo
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5 * s;
      ctx.beginPath();
      ctx.ellipse(cx, cy + (24 - 60) * s, 20 * s, 5 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (hat === 4) { // Wizard Cap
      ctx.fillStyle = '#6d28d9';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(cx + (38 - 60) * s, cy + (34 - 60) * s);
      ctx.lineTo(cx, cy + (4 - 60) * s);
      ctx.lineTo(cx + (82 - 60) * s, cy + (34 - 60) * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(cx, cy + (3 - 60) * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    if (hat === 0) {
      // Bol Brown
      ctx.beginPath();
      ctx.moveTo(cx + (31 - 60) * s, cy + (42 - 60) * s);
      ctx.bezierCurveTo(
        cx + (28 - 60) * s, cy + (12 - 60) * s,
        cx + (92 - 60) * s, cy + (12 - 60) * s,
        cx + (89 - 60) * s, cy + (42 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (93 - 60) * s, cy + (52 - 60) * s,
        cx + (86 - 60) * s, cy + (52 - 60) * s,
        cx + (84 - 60) * s, cy + (44 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (82 - 60) * s, cy + (34 - 60) * s,
        cx + (76 - 60) * s, cy + (36 - 60) * s,
        cx + (60 - 60) * s, cy + (36 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (44 - 60) * s, cy + (36 - 60) * s,
        cx + (38 - 60) * s, cy + (34 - 60) * s,
        cx + (36 - 60) * s, cy + (44 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (34 - 60) * s, cy + (52 - 60) * s,
        cx + (27 - 60) * s, cy + (52 - 60) * s,
        cx + (31 - 60) * s, cy + (42 - 60) * s
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (hat === 1) {
      // Spiky
      ctx.beginPath();
      ctx.moveTo(cx + (33 - 60) * s, cy + (40 - 60) * s);
      ctx.bezierCurveTo(
        cx + (31 - 60) * s, cy + (32 - 60) * s,
        cx + (35 - 60) * s, cy + (22 - 60) * s,
        cx + (40 - 60) * s, cy + (26 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (43 - 60) * s, cy + (18 - 60) * s,
        cx + (48 - 60) * s, cy + (12 - 60) * s,
        cx + (54 - 60) * s, cy + (19 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (58 - 60) * s, cy + (9 - 60) * s,
        cx + (65 - 60) * s, cy + (9 - 60) * s,
        cx + (68 - 60) * s, cy + (17 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (72 - 60) * s, cy + (12 - 60) * s,
        cx + (77 - 60) * s, cy + (18 - 60) * s,
        cx + (82 - 60) * s, cy + (25 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (86 - 60) * s, cy + (22 - 60) * s,
        cx + (89 - 60) * s, cy + (32 - 60) * s,
        cx + (87 - 60) * s, cy + (40 - 60) * s
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (hat === 2) {
      // Cap
      ctx.beginPath();
      ctx.moveTo(cx + (33 - 60) * s, cy + (38 - 60) * s);
      ctx.bezierCurveTo(
        cx + (30 - 60) * s, cy + (12 - 60) * s,
        cx + (90 - 60) * s, cy + (12 - 60) * s,
        cx + (87 - 60) * s, cy + (38 - 60) * s
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx + (44 - 60) * s, cy + (38 - 60) * s);
      ctx.bezierCurveTo(
        cx + (42 - 60) * s, cy + (22 - 60) * s,
        cx + (78 - 60) * s, cy + (22 - 60) * s,
        cx + (76 - 60) * s, cy + (38 - 60) * s
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(cx + (24 - 60) * s, cy + (37 - 60) * s);
      ctx.quadraticCurveTo(cx, cy + (24 - 60) * s, cx + (96 - 60) * s, cy + (37 - 60) * s);
      ctx.lineTo(cx + (105 - 60) * s, cy + (43 - 60) * s);
      ctx.quadraticCurveTo(cx, cy + (30 - 60) * s, cx + (15 - 60) * s, cy + (43 - 60) * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (hat === 3) {
      // Crown
      ctx.beginPath();
      ctx.moveTo(cx + (35 - 60) * s, cy + (28 - 60) * s);
      ctx.lineTo(cx + (43 - 60) * s, cy + (11 - 60) * s);
      ctx.lineTo(cx, cy + (25 - 60) * s);
      ctx.lineTo(cx + (77 - 60) * s, cy + (11 - 60) * s);
      ctx.lineTo(cx + (85 - 60) * s, cy + (28 - 60) * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx + (43 - 60) * s, cy + (11 - 60) * s, 3.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(cx, cy + (25 - 60) * s, 3.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx + (77 - 60) * s, cy + (11 - 60) * s, 3.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (hat === 4) {
      // Princess
      ctx.beginPath();
      ctx.moveTo(cx + (31 - 60) * s, cy + (42 - 60) * s);
      ctx.bezierCurveTo(
        cx + (28 - 60) * s, cy + (12 - 60) * s,
        cx + (92 - 60) * s, cy + (12 - 60) * s,
        cx + (89 - 60) * s, cy + (42 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (86 - 60) * s, cy + (52 - 60) * s,
        cx + (84 - 60) * s, cy + (65 - 60) * s,
        cx + (82 - 60) * s, cy + (78 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (80 - 60) * s, cy + (82 - 60) * s,
        cx + (76 - 60) * s, cy + (82 - 60) * s,
        cx + (78 - 60) * s, cy + (72 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (80 - 60) * s, cy + (50 - 60) * s,
        cx + (78 - 60) * s, cy + (38 - 60) * s,
        cx + (60 - 60) * s, cy + (38 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (42 - 60) * s, cy + (38 - 60) * s,
        cx + (40 - 60) * s, cy + (50 - 60) * s,
        cx + (42 - 60) * s, cy + (72 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (44 - 60) * s, cy + (82 - 60) * s,
        cx + (40 - 60) * s, cy + (82 - 60) * s,
        cx + (38 - 60) * s, cy + (78 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (36 - 60) * s, cy + (65 - 60) * s,
        cx + (34 - 60) * s, cy + (52 - 60) * s,
        cx + (31 - 60) * s, cy + (42 - 60) * s
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3.5 * s;
      ctx.beginPath();
      ctx.arc(cx, cy + (35 - 60) * s, 27 * s, 1.2 * Math.PI, 1.8 * Math.PI);
      ctx.stroke();
    } else if (hat === 5) {
      // Winter Beanie
      ctx.fillStyle = '#0d9488';
      ctx.beginPath();
      ctx.moveTo(cx + (33 - 60) * s, cy + (38 - 60) * s);
      ctx.bezierCurveTo(
        cx + (30 - 60) * s, cy + (14 - 60) * s,
        cx + (90 - 60) * s, cy + (14 - 60) * s,
        cx + (87 - 60) * s, cy + (38 - 60) * s
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f766e';
      ctx.beginPath();
      ctx.rect(cx + (30 - 60) * s, cy + (32 - 60) * s, 60 * s, 8 * s);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f5f5f5';
      ctx.beginPath();
      ctx.arc(cx, cy + (12 - 60) * s, 7 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (hat === 6) {
      // Afro
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.moveTo(cx + (33 - 60) * s, cy + (40 - 60) * s);
      ctx.bezierCurveTo(
        cx + (15 - 60) * s, cy + (35 - 60) * s,
        cx + (15 - 60) * s, cy + (5 - 60) * s,
        cx + (35 - 60) * s, cy + (-5 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (50 - 60) * s, cy + (-20 - 60) * s,
        cx + (70 - 60) * s, cy + (-20 - 60) * s,
        cx + (85 - 60) * s, cy + (-5 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (105 - 60) * s, cy + (5 - 60) * s,
        cx + (105 - 60) * s, cy + (35 - 60) * s,
        cx + (87 - 60) * s, cy + (40 - 60) * s
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (hat === 7) {
      // Chef Hat
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.rect(cx + (42 - 60) * s, cy + (24 - 60) * s, 36 * s, 15 * s);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx + (42 - 60) * s, cy + (25 - 60) * s);
      ctx.bezierCurveTo(
        cx + (28 - 60) * s, cy + (15 - 60) * s,
        cx + (32 - 60) * s, cy + (-15 - 60) * s,
        cx + (50 - 60) * s, cy + (-5 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (42 - 60) * s, cy + (-25 - 60) * s,
        cx + (78 - 60) * s, cy + (-25 - 60) * s,
        cx + (70 - 60) * s, cy + (-5 - 60) * s
      );
      ctx.bezierCurveTo(
        cx + (88 - 60) * s, cy + (-15 - 60) * s,
        cx + (92 - 60) * s, cy + (15 - 60) * s,
        cx + (78 - 60) * s, cy + (25 - 60) * s
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
}

/**
 * Draws human accessories in badges around the main avatar circle.
 */
export function drawAvatarAccessories(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  accessories: number[]
) {
  if (!accessories || accessories.length === 0) return;

  const orbitCoords = [
    { x: 18, y: 92 },
    { x: 102, y: 92 },
    { x: 12, y: 60 },
    { x: 108, y: 60 },
    { x: 18, y: 28 }
  ];
  const accEmojis = ['🎂', '🎣', '⛵', '🥖', '🪄', '🛡️', '⚔️', '🦖', '🎈', '🍕', '🐱', '🕶️', '🍦', '☕', '🎨', '📚', '🎸'];

  accessories.slice(0, 5).forEach((accId, index) => {
    const coords = orbitCoords[index];
    if (!coords) return;
    
    const ax = cx + (coords.x - 60) * s;
    const ay = cy + (coords.y - 60) * s;
    const badgeR = 9.5 * s;
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.arc(ax, ay + 1.2 * s, badgeR, 0, Math.PI * 2);
    ctx.fill();
    
    // Circle badge
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.arc(ax, ay, badgeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Emoji content
    ctx.font = `${10 * s}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(accEmojis[Number(accId)] || '🎒', ax, ay + 0.5 * s);
  });
}
