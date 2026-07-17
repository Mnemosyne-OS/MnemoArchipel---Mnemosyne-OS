/**
 * Renders magical ears/features based on body style for the canvas avatar.
 */
export function drawMagicalEars(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  body: number,
  headColor: string,
  strokeW: number
) {
  ctx.fillStyle = headColor;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = strokeW;

  if (body === 0) {
    // Unicorn ears
    ctx.beginPath();
    ctx.moveTo(cx + (32 - 60) * s, cy + (34 - 60) * s);
    ctx.quadraticCurveTo(cx + (22 - 60) * s, cy + (12 - 60) * s, cx + (28 - 60) * s, cy + (26 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + (88 - 60) * s, cy + (34 - 60) * s);
    ctx.quadraticCurveTo(cx + (98 - 60) * s, cy + (12 - 60) * s, cx + (92 - 60) * s, cy + (26 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (body === 1) {
    // Fox pointy ears
    ctx.beginPath();
    ctx.moveTo(cx + (36 - 60) * s, cy + (36 - 60) * s);
    ctx.lineTo(cx + (22 - 60) * s, cy + (10 - 60) * s);
    ctx.lineTo(cx + (44 - 60) * s, cy + (24 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + (84 - 60) * s, cy + (36 - 60) * s);
    ctx.lineTo(cx + (98 - 60) * s, cy + (10 - 60) * s);
    ctx.lineTo(cx + (76 - 60) * s, cy + (24 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (body === 2) {
    // Panda round ears
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cx + (36 - 60) * s, cy + (24 - 60) * s, 12 * s, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(cx + (36 - 60) * s, cy + (24 - 60) * s, 7 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cx + (84 - 60) * s, cy + (24 - 60) * s, 12 * s, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(cx + (84 - 60) * s, cy + (24 - 60) * s, 7 * s, 0, Math.PI * 2);
    ctx.fill();
  } else if (body === 3) {
    // Owl feather tufts
    ctx.beginPath();
    ctx.moveTo(cx + (38 - 60) * s, cy + (36 - 60) * s);
    ctx.quadraticCurveTo(cx + (26 - 60) * s, cy + (18 - 60) * s, cx + (42 - 60) * s, cy + (28 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + (82 - 60) * s, cy + (36 - 60) * s);
    ctx.quadraticCurveTo(cx + (94 - 60) * s, cy + (18 - 60) * s, cx + (78 - 60) * s, cy + (28 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else {
    // Dragon horns
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(cx + (40 - 60) * s, cy + (30 - 60) * s);
    ctx.quadraticCurveTo(cx + (30 - 60) * s, cy + (8 - 60) * s, cx + (32 - 60) * s, cy + (18 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + (80 - 60) * s, cy + (30 - 60) * s);
    ctx.quadraticCurveTo(cx + (90 - 60) * s, cy + (8 - 60) * s, cx + (88 - 60) * s, cy + (18 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }
}

/**
 * Draws base head and features for magical style.
 */
export function drawMagicalHeadShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  body: number,
  headColor: string,
  strokeW: number
) {
  ctx.fillStyle = headColor;
  if (body === 2) {
    ctx.fillStyle = '#fff';
  }
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = strokeW;

  if (body === 0) {
    // Unicorn head shape
    ctx.beginPath();
    ctx.moveTo(cx + (38 - 60) * s, cy + (42 - 60) * s);
    ctx.bezierCurveTo(cx + (34 - 60) * s, cy + (26 - 60) * s, cx + (86 - 60) * s, cy + (26 - 60) * s, cx + (82 - 60) * s, cy + (42 - 60) * s);
    ctx.lineTo(cx + (80 - 60) * s, cy + (72 - 60) * s);
    ctx.quadraticCurveTo(cx + (60 - 60) * s, cy + (94 - 60) * s, cx + (60 - 60) * s, cy + (94 - 60) * s);
    ctx.quadraticCurveTo(cx + (40 - 60) * s, cy + (72 - 60) * s, cx + (40 - 60) * s, cy + (72 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Muzzle
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.ellipse(cx, cy + (80 - 60) * s, 14 * s, 8 * s, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Nostrils
    ctx.fillStyle = '#db2777';
    ctx.beginPath(); ctx.arc(cx - 5 * s, cy + (80 - 60) * s, 1.5 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 5 * s, cy + (80 - 60) * s, 1.5 * s, 0, Math.PI * 2); ctx.fill();

    // Horn (gradient)
    const hornGrad = ctx.createLinearGradient(cx - 5 * s, cy + (6 - 60) * s, cx + 5 * s, cy + (32 - 60) * s);
    hornGrad.addColorStop(0, '#f472b6');
    hornGrad.addColorStop(0.5, '#c084fc');
    hornGrad.addColorStop(1, '#60a5fa');
    ctx.fillStyle = hornGrad;
    ctx.beginPath();
    ctx.moveTo(cx, cy + (6 - 60) * s);
    ctx.quadraticCurveTo(cx - 5 * s, cy + (28 - 60) * s, cx - 4 * s, cy + (32 - 60) * s);
    ctx.lineTo(cx + 4 * s, cy + (32 - 60) * s);
    ctx.quadraticCurveTo(cx + 5 * s, cy + (28 - 60) * s, cx, cy + (6 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Wings
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx + (28 - 60) * s, cy + (68 - 60) * s);
    ctx.quadraticCurveTo(cx + (6 - 60) * s, cy + (56 - 60) * s, cx + (12 - 60) * s, cy + (82 - 60) * s);
    ctx.quadraticCurveTo(cx + (22 - 60) * s, cy + (86 - 60) * s, cx + (28 - 60) * s, cy + (78 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + (92 - 60) * s, cy + (68 - 60) * s);
    ctx.quadraticCurveTo(cx + (114 - 60) * s, cy + (56 - 60) * s, cx + (108 - 60) * s, cy + (82 - 60) * s);
    ctx.quadraticCurveTo(cx + (98 - 60) * s, cy + (86 - 60) * s, cx + (92 - 60) * s, cy + (78 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (body === 1) {
    // Fox head
    ctx.beginPath();
    ctx.moveTo(cx + (34 - 60) * s, cy + (44 - 60) * s);
    ctx.bezierCurveTo(cx + (30 - 60) * s, cy + (30 - 60) * s, cx + (90 - 60) * s, cy + (30 - 60) * s, cx + (86 - 60) * s, cy + (44 - 60) * s);
    ctx.quadraticCurveTo(cx + (94 - 60) * s, cy + (54 - 60) * s, cx + (84 - 60) * s, cy + (82 - 60) * s);
    ctx.quadraticCurveTo(cx + (60 - 60) * s, cy + (96 - 60) * s, cx + (36 - 60) * s, cy + (82 - 60) * s);
    ctx.quadraticCurveTo(cx + (30 - 60) * s, cy + (54 - 60) * s, cx + (34 - 60) * s, cy + (44 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Cheek white fur
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx + (32 - 60) * s, cy + (60 - 60) * s);
    ctx.quadraticCurveTo(cx + (42 - 60) * s, cy + (70 - 60) * s, cx + (50 - 60) * s, cy + (68 - 60) * s);
    ctx.quadraticCurveTo(cx + (38 - 60) * s, cy + (76 - 60) * s, cx + (30 - 60) * s, cy + (64 - 60) * s);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + (88 - 60) * s, cy + (60 - 60) * s);
    ctx.quadraticCurveTo(cx + (78 - 60) * s, cy + (70 - 60) * s, cx + (70 - 60) * s, cy + (68 - 60) * s);
    ctx.quadraticCurveTo(cx + (78 - 60) * s, cy + (76 - 60) * s, cx + (90 - 60) * s, cy + (64 - 60) * s);
    ctx.closePath();
    ctx.fill();

    // Nose
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(cx, cy + (74 - 60) * s);
    ctx.lineTo(cx - 3 * s, cy + (70 - 60) * s);
    ctx.lineTo(cx + 3 * s, cy + (70 - 60) * s);
    ctx.closePath();
    ctx.fill();

    // Forehead star
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(cx, cy + (38 - 60) * s, 3 * s, 0, Math.PI * 2);
    ctx.fill();
  } else if (body === 2) {
    // Panda round face
    ctx.beginPath();
    ctx.arc(cx, cy - 2 * s, 26 * s, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Eye patches
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(cx - 12 * s, cy - 6 * s, 10 * s, 12 * s, -15 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 12 * s, cy - 6 * s, 10 * s, 12 * s, 15 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill();

    // Small nose
    ctx.beginPath();
    ctx.ellipse(cx, cy + 6 * s, 3.5 * s, 2 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // Butterfly wings
    ctx.fillStyle = '#f472b6';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.ellipse(cx - 28 * s, cy + 4 * s, 14 * s, 8 * s, -30 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx + 28 * s, cy + 4 * s, 14 * s, 8 * s, 30 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.globalAlpha = 1.0;
  } else if (body === 3) {
    // Owl head
    ctx.beginPath();
    ctx.arc(cx, cy - 4 * s, 25 * s, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Beak
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 5 * s);
    ctx.lineTo(cx - 4 * s, cy - 2 * s);
    ctx.lineTo(cx + 4 * s, cy - 2 * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else {
    // Dragon head
    ctx.beginPath();
    ctx.moveTo(cx + (34 - 60) * s, cy + (44 - 60) * s);
    ctx.bezierCurveTo(cx + (34 - 60) * s, cy + (22 - 60) * s, cx + (86 - 60) * s, cy + (22 - 60) * s, cx + (86 - 60) * s, cy + (44 - 60) * s);
    ctx.lineTo(cx + (86 - 60) * s, cy + (72 - 60) * s);
    ctx.bezierCurveTo(cx + (86 - 60) * s, cy + (86 - 60) * s, cx + (78 - 60) * s, cy + (92 - 60) * s, cx + (60 - 60) * s, cy + (92 - 60) * s);
    ctx.bezierCurveTo(cx + (42 - 60) * s, cy + (92 - 60) * s, cx + (34 - 60) * s, cy + (86 - 60) * s, cx + (34 - 60) * s, cy + (72 - 60) * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Snout curve
    ctx.beginPath();
    ctx.arc(cx, cy + 18 * s, 12 * s, Math.PI, 2 * Math.PI);
    ctx.stroke();

    // Bat wings
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(cx - 24 * s, cy);
    ctx.lineTo(cx - 42 * s, cy - 8 * s);
    ctx.lineTo(cx - 32 * s, cy + 10 * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 24 * s, cy);
    ctx.lineTo(cx + 42 * s, cy - 8 * s);
    ctx.lineTo(cx + 32 * s, cy + 10 * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }
}

/**
 * Draws ears, neck, head shapes and chin shadows for Avatar style.
 */
export function drawFigureHeadShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  body: number,
  headColor: string,
  strokeW: number
) {
  ctx.fillStyle = headColor;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = strokeW;

  // Left ear
  ctx.beginPath();
  ctx.arc(cx + (30 - 60) * s, cy + (56 - 60) * s, 6 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right ear
  ctx.beginPath();
  ctx.arc(cx + (90 - 60) * s, cy + (56 - 60) * s, 6 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Neck
  ctx.beginPath();
  ctx.rect(cx + (52 - 60) * s, cy + (80 - 60) * s, 16 * s, 15 * s);
  ctx.fill();
  ctx.stroke();

  // Head shape base
  ctx.beginPath();
  if (body === 0) {
    // Standard cylinder
    ctx.moveTo(cx + (34 - 60) * s, cy + (42 - 60) * s);
    ctx.bezierCurveTo(cx + (34 - 60) * s, cy + (22 - 60) * s, cx + (86 - 60) * s, cy + (22 - 60) * s, cx + (86 - 60) * s, cy + (42 - 60) * s);
    ctx.lineTo(cx + (86 - 60) * s, cy + (72 - 60) * s);
    ctx.bezierCurveTo(cx + (86 - 60) * s, cy + (85 - 60) * s, cx + (78 - 60) * s, cy + (92 - 60) * s, cx + (60 - 60) * s, cy + (92 - 60) * s);
    ctx.bezierCurveTo(cx + (42 - 60) * s, cy + (92 - 60) * s, cx + (34 - 60) * s, cy + (85 - 60) * s, cx + (34 - 60) * s, cy + (72 - 60) * s);
  } else if (body === 1) {
    // Oval / Long
    ctx.moveTo(cx + (35 - 60) * s, cy + (40 - 60) * s);
    ctx.bezierCurveTo(cx + (35 - 60) * s, cy + (18 - 60) * s, cx + (85 - 60) * s, cy + (18 - 60) * s, cx + (85 - 60) * s, cy + (40 - 60) * s);
    ctx.lineTo(cx + (85 - 60) * s, cy + (76 - 60) * s);
    ctx.bezierCurveTo(cx + (85 - 60) * s, cy + (92 - 60) * s, cx + (76 - 60) * s, cy + (96 - 60) * s, cx + (60 - 60) * s, cy + (96 - 60) * s);
    ctx.bezierCurveTo(cx + (44 - 60) * s, cy + (96 - 60) * s, cx + (35 - 60) * s, cy + (92 - 60) * s, cx + (35 - 60) * s, cy + (76 - 60) * s);
  } else if (body === 2) {
    // Square
    ctx.moveTo(cx + (33 - 60) * s, cy + (40 - 60) * s);
    ctx.bezierCurveTo(cx + (33 - 60) * s, cy + (26 - 60) * s, cx + (87 - 60) * s, cy + (26 - 60) * s, cx + (87 - 60) * s, cy + (40 - 60) * s);
    ctx.lineTo(cx + (87 - 60) * s, cy + (76 - 60) * s);
    ctx.bezierCurveTo(cx + (87 - 60) * s, cy + (85 - 60) * s, cx + (81 - 60) * s, cy + (89 - 60) * s, cx + (77 - 60) * s, cy + (89 - 60) * s);
    ctx.lineTo(cx + (43 - 60) * s, cy + (89 - 60) * s);
    ctx.bezierCurveTo(cx + (39 - 60) * s, cy + (89 - 60) * s, cx + (33 - 60) * s, cy + (85 - 60) * s, cx + (33 - 60) * s, cy + (76 - 60) * s);
  } else if (body === 3) {
    // Heart-shaped
    ctx.moveTo(cx + (34 - 60) * s, cy + (42 - 60) * s);
    ctx.bezierCurveTo(cx + (34 - 60) * s, cy + (22 - 60) * s, cx + (86 - 60) * s, cy + (22 - 60) * s, cx + (86 - 60) * s, cy + (42 - 60) * s);
    ctx.lineTo(cx + (84 - 60) * s, cy + (68 - 60) * s);
    ctx.bezierCurveTo(cx + (84 - 60) * s, cy + (80 - 60) * s, cx + (72 - 60) * s, cy + (94 - 60) * s, cx + (60 - 60) * s, cy + (94 - 60) * s);
    ctx.bezierCurveTo(cx + (48 - 60) * s, cy + (94 - 60) * s, cx + (36 - 60) * s, cy + (80 - 60) * s, cx + (36 - 60) * s, cy + (68 - 60) * s);
  } else {
    // Chubby
    ctx.moveTo(cx + (34 - 60) * s, cy + (42 - 60) * s);
    ctx.bezierCurveTo(cx + (34 - 60) * s, cy + (20 - 60) * s, cx + (86 - 60) * s, cy + (20 - 60) * s, cx + (86 - 60) * s, cy + (42 - 60) * s);
    ctx.bezierCurveTo(cx + (92 - 60) * s, cy + (54 - 60) * s, cx + (90 - 60) * s, cy + (74 - 60) * s, cx + (84 - 60) * s, cy + (82 - 60) * s);
    ctx.bezierCurveTo(cx + (78 - 60) * s, cy + (90 - 60) * s, cx + (70 - 60) * s, cy + (94 - 60) * s, cx + (60 - 60) * s, cy + (94 - 60) * s);
    ctx.bezierCurveTo(cx + (50 - 60) * s, cy + (94 - 60) * s, cx + (42 - 60) * s, cy + (90 - 60) * s, cx + (36 - 60) * s, cy + (82 - 60) * s);
    ctx.bezierCurveTo(cx + (30 - 60) * s, cy + (74 - 60) * s, cx + (28 - 60) * s, cy + (54 - 60) * s, cx + (34 - 60) * s, cy + (42 - 60) * s);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Shadow under chin
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  if (body === 0) {
    ctx.moveTo(cx + (34 - 60) * s, cy + (72 - 60) * s);
    ctx.bezierCurveTo(cx + (34 - 60) * s, cy + (85 - 60) * s, cx + (42 - 60) * s, cy + (92 - 60) * s, cx + (60 - 60) * s, cy + (92 - 60) * s);
    ctx.bezierCurveTo(cx + (78 - 60) * s, cy + (92 - 60) * s, cx + (86 - 60) * s, cy + (85 - 60) * s, cx + (86 - 60) * s, cy + (72 - 60) * s);
    ctx.bezierCurveTo(cx + (86 - 60) * s, cy + (77 - 60) * s, cx + (78 - 60) * s, cy + (86 - 60) * s, cx + (60 - 60) * s, cy + (86 - 60) * s);
    ctx.bezierCurveTo(cx + (42 - 60) * s, cy + (86 - 60) * s, cx + (34 - 60) * s, cy + (77 - 60) * s, cx + (34 - 60) * s, cy + (72 - 60) * s);
  } else if (body === 1) {
    ctx.moveTo(cx + (35 - 60) * s, cy + (76 - 60) * s);
    ctx.bezierCurveTo(cx + (35 - 60) * s, cy + (92 - 60) * s, cx + (44 - 60) * s, cy + (96 - 60) * s, cx + (60 - 60) * s, cy + (96 - 60) * s);
    ctx.bezierCurveTo(cx + (76 - 60) * s, cy + (96 - 60) * s, cx + (85 - 60) * s, cy + (92 - 60) * s, cx + (85 - 60) * s, cy + (76 - 60) * s);
    ctx.bezierCurveTo(cx + (85 - 60) * s, cy + (81 - 60) * s, cx + (76 - 60) * s, cy + (90 - 60) * s, cx + (60 - 60) * s, cy + (90 - 60) * s);
    ctx.bezierCurveTo(cx + (44 - 60) * s, cy + (90 - 60) * s, cx + (35 - 60) * s, cy + (81 - 60) * s, cx + (35 - 60) * s, cy + (76 - 60) * s);
  } else if (body === 2) {
    ctx.moveTo(cx + (33 - 60) * s, cy + (76 - 60) * s);
    ctx.bezierCurveTo(cx + (33 - 60) * s, cy + (85 - 60) * s, cx + (39 - 60) * s, cy + (89 - 60) * s, cx + (43 - 60) * s, cy + (89 - 60) * s);
    ctx.lineTo(cx + (77 - 60) * s, cy + (89 - 60) * s);
    ctx.bezierCurveTo(cx + (81 - 60) * s, cy + (89 - 60) * s, cx + (87 - 60) * s, cy + (85 - 60) * s, cx + (87 - 60) * s, cy + (76 - 60) * s);
    ctx.bezierCurveTo(cx + (87 - 60) * s, cy + (80 - 60) * s, cx + (81 - 60) * s, cy + (84 - 60) * s, cx + (77 - 60) * s, cy + (84 - 60) * s);
    ctx.lineTo(cx + (43 - 60) * s, cy + (84 - 60) * s);
    ctx.bezierCurveTo(cx + (39 - 60) * s, cy + (84 - 60) * s, cx + (33 - 60) * s, cy + (80 - 60) * s, cx + (33 - 60) * s, cy + (76 - 60) * s);
  } else if (body === 3) {
    ctx.moveTo(cx + (36 - 60) * s, cy + (68 - 60) * s);
    ctx.bezierCurveTo(cx + (36 - 60) * s, cy + (80 - 60) * s, cx + (48 - 60) * s, cy + (94 - 60) * s, cx + (60 - 60) * s, cy + (94 - 60) * s);
    ctx.bezierCurveTo(cx + (72 - 60) * s, cy + (94 - 60) * s, cx + (84 - 60) * s, cy + (80 - 60) * s, cx + (84 - 60) * s, cy + (68 - 60) * s);
    ctx.bezierCurveTo(cx + (84 - 60) * s, cy + (73 - 60) * s, cx + (72 - 60) * s, cy + (88 - 60) * s, cx + (60 - 60) * s, cy + (88 - 60) * s);
    ctx.bezierCurveTo(cx + (48 - 60) * s, cy + (88 - 60) * s, cx + (36 - 60) * s, cy + (73 - 60) * s, cx + (36 - 60) * s, cy + (68 - 60) * s);
  } else {
    ctx.moveTo(cx + (36 - 60) * s, cy + (82 - 60) * s);
    ctx.bezierCurveTo(cx + (42 - 60) * s, cy + (90 - 60) * s, cx + (50 - 60) * s, cy + (94 - 60) * s, cx + (60 - 60) * s, cy + (94 - 60) * s);
    ctx.bezierCurveTo(cx + (70 - 60) * s, cy + (94 - 60) * s, cx + (78 - 60) * s, cy + (90 - 60) * s, cx + (84 - 60) * s, cy + (82 - 60) * s);
    ctx.bezierCurveTo(cx + (84 - 60) * s, cy + (85 - 60) * s, cx + (70 - 60) * s, cy + (89 - 60) * s, cx + (60 - 60) * s, cy + (89 - 60) * s);
    ctx.bezierCurveTo(cx + (50 - 60) * s, cy + (89 - 60) * s, cx + (36 - 60) * s, cy + (85 - 60) * s, cx + (36 - 60) * s, cy + (82 - 60) * s);
  }
  ctx.closePath();
  ctx.fill();
}
