// Generate artistic wireframe SVG illustrations for each slide, convert to PNG
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMG_DIR = path.join(__dirname, "slides-art");
fs.mkdirSync(IMG_DIR, { recursive: true });

const W = 1920, H = 1080;

// Colors matching the PPTX theme
const C = {
  line: '#9B7BC7',
  lineLight: '#C4B5D9',
  lineFaint: '#D4C8E8',
  accent: '#7B5EA7',
  dot: '#E8DFF5',
};

// SVG helpers
const svgWrap = (inner, bg = 'none') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${bg !== 'none' ? `<rect width="${W}" height="${H}" fill="${bg}"/>` : ''}
  <g opacity="0.55">${inner}</g></svg>`;

const circle = (cx, cy, r, opts = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${opts.fill || 'none'}" stroke="${opts.stroke || C.line}" stroke-width="${opts.sw || 1.5}" opacity="${opts.opacity || 1}"/>`;

const line = (x1, y1, x2, y2, opts = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${opts.stroke || C.lineLight}" stroke-width="${opts.sw || 1}" stroke-dasharray="${opts.dash || 'none'}" opacity="${opts.opacity || 0.7}"/>`;

const path_d = (d, opts = {}) =>
  `<path d="${d}" fill="${opts.fill || 'none'}" stroke="${opts.stroke || C.line}" stroke-width="${opts.sw || 1.5}" stroke-linecap="round" stroke-linejoin="round" opacity="${opts.opacity || 1}"/>`;

const rect = (x, y, w, h, opts = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${opts.rx || 0}" fill="${opts.fill || 'none'}" stroke="${opts.stroke || C.lineLight}" stroke-width="${opts.sw || 1}" opacity="${opts.opacity || 0.6}"/>`;

const dots = (points, r = 3) =>
  points.map(([x, y]) => circle(x, y, r, { fill: C.dot, stroke: C.lineLight, sw: 1 })).join('\n');

// Seeded pseudo-random for reproducibility
let seed = 42;
const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; };
const randRange = (a, b) => a + rand() * (b - a);

// ============================================================
// SLIDE ILLUSTRATIONS
// ============================================================

// 1: Cover — constellation network on dark bg
function slide1() {
  let svg = '';
  const nodes = [];
  // Generate nodes in right portion
  for (let i = 0; i < 25; i++) {
    const x = randRange(900, 1850);
    const y = randRange(100, 980);
    const r = randRange(4, 12);
    nodes.push([x, y, r]);
  }
  // Connect nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]);
      if (dist < 280) {
        svg += line(nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1], { stroke: '#6B4F9E', sw: 0.8, opacity: 0.3 });
      }
    }
  }
  // Draw nodes
  for (const [x, y, r] of nodes) {
    svg += circle(x, y, r, { fill: '#3D2580', stroke: '#9B7BC7', sw: 1.2, opacity: 0.8 });
    svg += circle(x, y, r * 0.4, { fill: '#C4B5D9', stroke: 'none', opacity: 0.5 });
  }
  // A few larger accent nodes
  svg += circle(1400, 400, 18, { fill: 'none', stroke: '#9B7BC7', sw: 2, opacity: 0.6 });
  svg += circle(1600, 650, 14, { fill: 'none', stroke: '#9B7BC7', sw: 2, opacity: 0.6 });
  svg += circle(1150, 700, 20, { fill: 'none', stroke: '#7B5EA7', sw: 1.5, opacity: 0.4 });

  return svgWrap(svg);
}

// 2: Inflection curve
function slide2() {
  let svg = '';
  // Grid lines
  for (let x = 1200; x <= 1800; x += 100) {
    svg += line(x, 200, x, 900, { stroke: C.lineFaint, sw: 0.5, opacity: 0.3 });
  }
  for (let y = 200; y <= 900; y += 100) {
    svg += line(1200, y, 1800, y, { stroke: C.lineFaint, sw: 0.5, opacity: 0.3 });
  }
  // Inflection curve
  svg += path_d('M 1200 800 Q 1350 790 1450 750 Q 1550 680 1600 550 Q 1650 400 1700 250', { stroke: C.accent, sw: 2.5, opacity: 0.7 });
  // Milestone dots
  svg += dots([[1200, 800], [1350, 790], [1450, 750], [1600, 550], [1700, 250]], 5);
  // Dashed flat line (before)
  svg += line(1050, 810, 1200, 800, { stroke: C.lineLight, sw: 1.5, dash: '6,4', opacity: 0.5 });
  // Small gear sketches near inflection
  svg += circle(1580, 520, 15, { stroke: C.lineLight, sw: 1, opacity: 0.4 });
  svg += circle(1610, 490, 10, { stroke: C.lineLight, sw: 1, opacity: 0.4 });
  // Arrow at top
  svg += path_d('M 1695 260 L 1700 240 L 1710 255', { stroke: C.accent, sw: 2, opacity: 0.6 });
  return svgWrap(svg);
}

// 3: Rising bars
function slide3() {
  let svg = '';
  const bars = [
    { x: 1350, h: 200 },
    { x: 1480, h: 380 },
    { x: 1610, h: 600 },
  ];
  const baseY = 850;
  for (const b of bars) {
    svg += rect(b.x, baseY - b.h, 80, b.h, { stroke: C.line, sw: 1.5, rx: 3, opacity: 0.5 });
    // Hatch lines inside bars
    for (let y = baseY - b.h + 15; y < baseY; y += 20) {
      svg += line(b.x + 5, y, b.x + 75, y, { stroke: C.lineFaint, sw: 0.5, opacity: 0.3 });
    }
  }
  // Upward arrows
  svg += path_d('M 1650 220 L 1650 180 L 1640 195 M 1650 180 L 1660 195', { stroke: C.accent, sw: 2, opacity: 0.6 });
  // Trend line
  svg += path_d('M 1340 700 Q 1480 550 1650 280', { stroke: C.accent, sw: 1.5, dash: '4,3', opacity: 0.4 });
  // Scatter dots
  svg += dots([[1400, 680], [1500, 550], [1560, 420], [1630, 300]], 3);
  return svgWrap(svg);
}

// 4: Target / bullseye
function slide4() {
  let svg = '';
  const cx = 1500, cy = 500;
  svg += circle(cx, cy, 180, { stroke: C.lineLight, sw: 1, opacity: 0.3 });
  svg += circle(cx, cy, 130, { stroke: C.line, sw: 1.5, opacity: 0.4 });
  svg += circle(cx, cy, 70, { stroke: C.accent, sw: 2, opacity: 0.5 });
  svg += circle(cx, cy, 15, { fill: C.accent, stroke: 'none', opacity: 0.4 });
  // Crosshairs
  svg += line(cx - 200, cy, cx - 80, cy, { stroke: C.lineFaint, sw: 1, dash: '4,4', opacity: 0.3 });
  svg += line(cx + 80, cy, cx + 200, cy, { stroke: C.lineFaint, sw: 1, dash: '4,4', opacity: 0.3 });
  svg += line(cx, cy - 200, cx, cy - 80, { stroke: C.lineFaint, sw: 1, dash: '4,4', opacity: 0.3 });
  svg += line(cx, cy + 80, cx, cy + 200, { stroke: C.lineFaint, sw: 1, dash: '4,4', opacity: 0.3 });
  // Calendar sketch in corner
  svg += rect(1700, 780, 120, 100, { stroke: C.lineLight, sw: 1, rx: 4, opacity: 0.4 });
  svg += line(1700, 810, 1820, 810, { stroke: C.lineLight, sw: 1, opacity: 0.4 });
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      svg += circle(1720 + c * 28, 830 + r * 20, 2, { fill: C.lineFaint, stroke: 'none', opacity: 0.5 });
    }
  }
  return svgWrap(svg);
}

// 5: Split — grid vs flow
function slide5() {
  let svg = '';
  // Right side: organic flowing nodes
  const nodes = [];
  for (let i = 0; i < 12; i++) {
    const x = randRange(1300, 1850);
    const y = randRange(650, 1000);
    nodes.push([x, y]);
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]);
      if (dist < 200) {
        const mx = (nodes[i][0] + nodes[j][0]) / 2 + randRange(-30, 30);
        const my = (nodes[i][1] + nodes[j][1]) / 2 + randRange(-20, 20);
        svg += path_d(`M ${nodes[i][0]} ${nodes[i][1]} Q ${mx} ${my} ${nodes[j][0]} ${nodes[j][1]}`, { stroke: C.lineLight, sw: 1, opacity: 0.4 });
      }
    }
  }
  for (const [x, y] of nodes) {
    svg += circle(x, y, randRange(5, 10), { fill: C.dot, stroke: C.line, sw: 1, opacity: 0.5 });
  }
  return svgWrap(svg);
}

// 6: Six pillars
function slide6() {
  let svg = '';
  const baseY = 900, pillarH = 400;
  const startX = 1100, gap = 120;
  for (let i = 0; i < 6; i++) {
    const x = startX + i * gap;
    const topY = baseY - pillarH + randRange(-20, 20);
    // Pillar
    svg += rect(x, topY, 30, baseY - topY, { stroke: C.line, sw: 1.2, opacity: 0.4 });
    // Capital
    svg += rect(x - 5, topY - 8, 40, 8, { stroke: C.line, sw: 1, opacity: 0.4 });
    // Base
    svg += rect(x - 5, baseY, 40, 8, { stroke: C.line, sw: 1, opacity: 0.4 });
  }
  // Connecting arches
  for (let i = 0; i < 5; i++) {
    const x1 = startX + i * gap + 15;
    const x2 = startX + (i + 1) * gap + 15;
    const cy = baseY - pillarH - 30;
    svg += path_d(`M ${x1} ${baseY - pillarH} Q ${(x1 + x2) / 2} ${cy} ${x2} ${baseY - pillarH}`, { stroke: C.lineLight, sw: 1, opacity: 0.35 });
  }
  return svgWrap(svg);
}

// 7: People + document
function slide7() {
  let svg = '';
  // Stick figures (bottom left of right area)
  const drawPerson = (x, y, scale = 1) => {
    const s = scale;
    svg += circle(x, y - 25 * s, 10 * s, { stroke: C.line, sw: 1.2, opacity: 0.5 });
    svg += line(x, y - 15 * s, x, y + 20 * s, { stroke: C.line, sw: 1.2, opacity: 0.5 });
    svg += line(x - 12 * s, y, x + 12 * s, y, { stroke: C.line, sw: 1.2, opacity: 0.5 });
    svg += line(x, y + 20 * s, x - 10 * s, y + 40 * s, { stroke: C.line, sw: 1.2, opacity: 0.5 });
    svg += line(x, y + 20 * s, x + 10 * s, y + 40 * s, { stroke: C.line, sw: 1.2, opacity: 0.5 });
  };
  drawPerson(1250, 820);
  drawPerson(1310, 830);
  drawPerson(1370, 820);

  // Document/book sketch
  svg += rect(1550, 750, 100, 130, { stroke: C.line, sw: 1.5, rx: 3, opacity: 0.5 });
  for (let i = 0; i < 5; i++) {
    svg += line(1565, 775 + i * 18, 1635, 775 + i * 18, { stroke: C.lineFaint, sw: 1, opacity: 0.4 });
  }
  // Tree branching from document
  svg += line(1600, 750, 1600, 700, { stroke: C.line, sw: 1, opacity: 0.4 });
  svg += line(1600, 700, 1550, 660, { stroke: C.line, sw: 1, opacity: 0.4 });
  svg += line(1600, 700, 1650, 660, { stroke: C.line, sw: 1, opacity: 0.4 });
  svg += circle(1550, 655, 6, { fill: C.dot, stroke: C.line, sw: 1, opacity: 0.4 });
  svg += circle(1650, 655, 6, { fill: C.dot, stroke: C.line, sw: 1, opacity: 0.4 });
  return svgWrap(svg);
}

// 8: Tools + blocks
function slide8() {
  let svg = '';
  // Gear sketches (right side, lower)
  const drawGear = (cx, cy, r) => {
    svg += circle(cx, cy, r, { stroke: C.line, sw: 1.5, opacity: 0.45 });
    svg += circle(cx, cy, r * 0.4, { stroke: C.line, sw: 1, opacity: 0.4 });
    for (let a = 0; a < 360; a += 45) {
      const rad = a * Math.PI / 180;
      svg += line(cx + Math.cos(rad) * r, cy + Math.sin(rad) * r,
        cx + Math.cos(rad) * (r + 8), cy + Math.sin(rad) * (r + 8),
        { stroke: C.line, sw: 1.5, opacity: 0.4 });
    }
  };
  drawGear(1450, 800, 30);
  drawGear(1510, 760, 20);

  // Building blocks (right side)
  const bx = 1600, by = 720;
  svg += rect(bx, by, 60, 40, { stroke: C.line, sw: 1.2, opacity: 0.45 });
  svg += rect(bx + 70, by, 60, 40, { stroke: C.line, sw: 1.2, opacity: 0.45 });
  svg += rect(bx, by + 50, 60, 40, { stroke: C.line, sw: 1.2, opacity: 0.45 });
  svg += rect(bx + 70, by + 50, 60, 40, { stroke: C.line, sw: 1.2, opacity: 0.45 });
  // Connection lines between blocks
  svg += line(bx + 60, by + 20, bx + 70, by + 20, { stroke: C.accent, sw: 1, opacity: 0.4 });
  svg += line(bx + 60, by + 70, bx + 70, by + 70, { stroke: C.accent, sw: 1, opacity: 0.4 });
  svg += line(bx + 30, by + 40, bx + 30, by + 50, { stroke: C.accent, sw: 1, opacity: 0.4 });
  svg += line(bx + 100, by + 40, bx + 100, by + 50, { stroke: C.accent, sw: 1, opacity: 0.4 });
  return svgWrap(svg);
}

// 9: Shield + dashboard
function slide9() {
  let svg = '';
  // Shield
  svg += path_d('M 1300 750 L 1300 820 Q 1300 880 1340 900 Q 1380 880 1380 820 L 1380 750 Z', { stroke: C.line, sw: 1.5, opacity: 0.45 });
  // Checkmark inside shield
  svg += path_d('M 1320 820 L 1335 840 L 1360 800', { stroke: C.accent, sw: 2, opacity: 0.5 });

  // Dashboard outline
  svg += rect(1500, 730, 200, 130, { stroke: C.line, sw: 1.5, rx: 5, opacity: 0.45 });
  // Waveform lines
  svg += path_d('M 1520 790 L 1545 775 L 1570 795 L 1595 760 L 1620 780 L 1645 750 L 1670 770', { stroke: C.accent, sw: 1.5, opacity: 0.4 });
  svg += path_d('M 1520 830 L 1550 820 L 1580 835 L 1610 815 L 1640 825 L 1670 810', { stroke: C.lineLight, sw: 1, opacity: 0.35 });
  return svgWrap(svg);
}

// 10: Transformation desk → podium
function slide10() {
  let svg = '';
  // Desk (right, lower-left area)
  svg += rect(1200, 820, 80, 50, { stroke: C.line, sw: 1.2, opacity: 0.4 });
  svg += rect(1215, 800, 50, 20, { stroke: C.lineLight, sw: 1, opacity: 0.35 }); // screen
  // Arrow flow
  svg += path_d('M 1300 840 Q 1400 800 1500 780 Q 1550 770 1600 750', { stroke: C.accent, sw: 1.5, dash: '6,3', opacity: 0.45 });
  svg += path_d('M 1595 755 L 1605 748 L 1598 742', { stroke: C.accent, sw: 1.5, opacity: 0.45 });
  // Podium/orchestrator
  svg += rect(1600, 730, 60, 70, { stroke: C.line, sw: 1.5, rx: 3, opacity: 0.5 });
  // Branching lines from podium
  const branches = [[1660, 740, 1750, 700], [1660, 760, 1760, 760], [1660, 780, 1750, 820]];
  for (const [x1, y1, x2, y2] of branches) {
    svg += line(x1, y1, x2, y2, { stroke: C.lineLight, sw: 1, opacity: 0.4 });
    svg += circle(x2, y2, 5, { fill: C.dot, stroke: C.line, sw: 1, opacity: 0.4 });
  }
  return svgWrap(svg);
}

// 11: Winding path with milestones
function slide11() {
  let svg = '';
  svg += path_d('M 1100 850 Q 1200 800 1300 820 Q 1400 840 1450 790 Q 1500 740 1600 760 Q 1700 780 1800 720', { stroke: C.line, sw: 2, opacity: 0.4 });
  // Milestone flags
  const milestones = [[1200, 805], [1380, 830], [1530, 755], [1750, 740]];
  for (const [x, y] of milestones) {
    svg += line(x, y, x, y - 35, { stroke: C.accent, sw: 1.5, opacity: 0.5 });
    svg += path_d(`M ${x} ${y - 35} L ${x + 18} ${y - 28} L ${x} ${y - 21}`, { fill: C.dot, stroke: C.line, sw: 1, opacity: 0.4 });
  }
  // Decorative dots along path
  svg += dots([[1150, 840], [1250, 815], [1340, 830], [1420, 810], [1480, 770], [1560, 755], [1650, 770], [1720, 750]], 2);
  return svgWrap(svg);
}

// 12: Lightbulb + triangle
function slide12() {
  let svg = '';
  // Lightbulb (bottom left of right area)
  svg += path_d('M 1250 780 Q 1230 730 1260 700 Q 1290 670 1320 700 Q 1350 730 1330 780', { stroke: C.line, sw: 1.5, opacity: 0.45 });
  svg += line(1255, 790, 1325, 790, { stroke: C.line, sw: 1.2, opacity: 0.4 });
  svg += line(1260, 800, 1320, 800, { stroke: C.line, sw: 1.2, opacity: 0.4 });
  svg += circle(1290, 740, 4, { fill: C.dot, stroke: 'none', opacity: 0.5 }); // glow
  // Rays
  for (let a = -120; a <= -30; a += 30) {
    const rad = a * Math.PI / 180;
    svg += line(1290 + Math.cos(rad) * 45, 720 + Math.sin(rad) * 45,
      1290 + Math.cos(rad) * 60, 720 + Math.sin(rad) * 60,
      { stroke: C.lineLight, sw: 1, opacity: 0.35 });
  }

  // Warning triangle
  svg += path_d('M 1600 810 L 1570 860 L 1630 860 Z', { stroke: C.line, sw: 1.5, opacity: 0.45 });
  svg += line(1600, 830, 1600, 845, { stroke: C.accent, sw: 2, opacity: 0.4 });
  svg += circle(1600, 852, 2, { fill: C.accent, stroke: 'none', opacity: 0.4 });

  // Connecting dotted line
  svg += line(1330, 820, 1565, 835, { stroke: C.lineFaint, sw: 1, dash: '4,4', opacity: 0.3 });
  return svgWrap(svg);
}

// 13: Code brackets
function slide13() {
  let svg = '';
  // Three bracket pairs
  const drawBrackets = (x, y, style) => {
    if (style === 'angular') {
      svg += path_d(`M ${x + 20} ${y} L ${x} ${y + 30} L ${x + 20} ${y + 60}`, { stroke: C.line, sw: 2, opacity: 0.45 });
      svg += path_d(`M ${x + 60} ${y} L ${x + 80} ${y + 30} L ${x + 60} ${y + 60}`, { stroke: C.line, sw: 2, opacity: 0.45 });
    } else if (style === 'curly') {
      svg += path_d(`M ${x + 20} ${y} Q ${x} ${y + 15} ${x + 10} ${y + 30} Q ${x} ${y + 45} ${x + 20} ${y + 60}`, { stroke: C.line, sw: 2, opacity: 0.45 });
      svg += path_d(`M ${x + 60} ${y} Q ${x + 80} ${y + 15} ${x + 70} ${y + 30} Q ${x + 80} ${y + 45} ${x + 60} ${y + 60}`, { stroke: C.line, sw: 2, opacity: 0.45 });
    } else {
      svg += path_d(`M ${x + 18} ${y} Q ${x + 5} ${y + 30} ${x + 18} ${y + 60}`, { stroke: C.line, sw: 2, opacity: 0.45 });
      svg += path_d(`M ${x + 62} ${y} Q ${x + 75} ${y + 30} ${x + 62} ${y + 60}`, { stroke: C.line, sw: 2, opacity: 0.45 });
    }
    // Code lines inside
    for (let i = 0; i < 3; i++) {
      const lw = randRange(15, 35);
      svg += line(x + 28, y + 15 + i * 15, x + 28 + lw, y + 15 + i * 15, { stroke: C.lineFaint, sw: 1, opacity: 0.35 });
    }
  };
  drawBrackets(1250, 790, 'angular');
  drawBrackets(1420, 790, 'curly');
  drawBrackets(1590, 790, 'round');
  // Connection lines
  svg += line(1340, 820, 1410, 820, { stroke: C.lineFaint, sw: 1, dash: '3,3', opacity: 0.3 });
  svg += line(1510, 820, 1580, 820, { stroke: C.lineFaint, sw: 1, dash: '3,3', opacity: 0.3 });
  return svgWrap(svg);
}

// ============================================================
// GENERATE ALL
// ============================================================
async function main() {
  const generators = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9, slide10, slide11, slide12, slide13];

  // Also generate gradient backgrounds to composite with
  for (let i = 0; i < generators.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const outFile = path.join(IMG_DIR, `slide-${num}.png`);

    const svgContent = generators[i]();

    // Create gradient background
    const isDark = i === 0;
    const isAlt = [3, 6, 8, 10, 12].includes(i); // alternate bg slides (0-indexed: 4,7,9,11,13)
    let bgColor;
    if (isDark) {
      // Dark purple gradient for cover
      bgColor = { r: 26, g: 15, b: 64 }; // will be gradient
    }

    // Create gradient base image
    const ch = 3;
    const pixels = Buffer.alloc(W * H * ch);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const t = y / H;
        const idx = (y * W + x) * ch;
        if (isDark) {
          pixels[idx]     = Math.round(26 + (61 - 26) * t);
          pixels[idx + 1] = Math.round(15 + (37 - 15) * t);
          pixels[idx + 2] = Math.round(64 + (128 - 64) * t);
        } else if (isAlt) {
          pixels[idx]     = Math.round(248 + (237 - 248) * t);
          pixels[idx + 1] = Math.round(245 + (229 - 245) * t);
          pixels[idx + 2] = Math.round(252 + (247 - 252) * t);
        } else {
          pixels[idx]     = Math.round(255 + (243 - 255) * t);
          pixels[idx + 1] = Math.round(255 + (239 - 255) * t);
          pixels[idx + 2] = Math.round(255 + (249 - 255) * t);
        }
      }
    }

    const bgImage = await sharp(pixels, { raw: { width: W, height: H, channels: ch } }).png().toBuffer();
    const svgImage = await sharp(Buffer.from(svgContent)).resize(W, H).png().toBuffer();

    // Composite: gradient bg + SVG overlay
    const final = await sharp(bgImage)
      .composite([{ input: svgImage, blend: 'over' }])
      .png()
      .toBuffer();

    fs.writeFileSync(outFile, final);
    console.log(`  [slide ${i + 1}] Generated ${outFile} (${(final.length / 1024).toFixed(0)}KB)`);
  }

  console.log('\nAll illustrations generated in slides-art/');
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
