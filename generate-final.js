const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ============================================================
// CONFIG
// ============================================================
const ART_DIR = path.join(__dirname, "slides-full"); // Gemini-generated art
const COLORS = {
  deepPurple: '2D1B69', mediumPurple: '4A2C82', purple: '7B5EA7',
  lightPurple: 'C4B5D9', lavender: 'E8DFF5', paleLavender: 'F3EFF9',
  nearWhite: 'F8F5FC', white: 'FFFFFF',
  titleText: '2D1B69', bodyText: '3D3252', mutedText: '8E7BAF',
  whiteText: 'FFFFFF', accent: '7B5EA7',
  // Semi-transparent panels
  panelWhite: 'FFFFFF', panelLavender: 'F3EFF9',
};
const F = { title: 'Georgia', body: 'Calibri', mono: 'Consolas' };
const SW = 10, SH = 5.625, M = 0.5;
const CW = SW - 2 * M;

// ============================================================
// HELPERS
// ============================================================
const shadow = () => ({ type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.1, angle: 135 });

// Semi-transparent white panel (makes text readable over art backgrounds)
function panel(s, pres, x, y, w, h, opts = {}) {
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.color || COLORS.panelWhite, transparency: opts.transparency || 15 },
    line: opts.border ? { color: opts.border, width: opts.borderWidth || 1.5 } : { width: 0 },
    rectRadius: opts.radius || 0.08,
    shadow: opts.noShadow ? undefined : shadow(),
  });
}

// Accent bar on left of panel
function accentBar(s, pres, x, y, h, color) {
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: y + 0.06, w: 0.07, h: h - 0.12,
    fill: { color: color || COLORS.purple }, rectRadius: 0.04,
  });
}

// Big slide title
function title(s, text, opts = {}) {
  s.addText(text, {
    x: opts.x || M, y: opts.y || 0.25, w: opts.w || CW, h: opts.h || 0.7,
    fontSize: opts.size || 36, fontFace: F.title,
    color: opts.color || COLORS.titleText,
    bold: true, margin: 0,
  });
}

// Subtitle
function subtitle(s, text, opts = {}) {
  s.addText(text, {
    x: opts.x || M, y: opts.y || 0.85, w: opts.w || CW, h: 0.3,
    fontSize: 13, fontFace: F.body, color: COLORS.mutedText,
    italic: true, margin: 0,
  });
}

// Thin line
function thinLine(s, pres, x, y, w, opts = {}) {
  s.addShape(pres.shapes.LINE, {
    x, y, w, h: 0,
    line: { color: opts.color || COLORS.lightPurple, width: opts.width || 0.75, dashType: opts.dash || 'solid' },
  });
}

// Page number
function pageNum(s, n) {
  s.addText(`${n} / 13`, {
    x: SW - 1.2, y: SH - 0.35, w: 0.8, h: 0.25,
    fontSize: 9, fontFace: F.body, color: COLORS.mutedText, align: 'right', margin: 0,
  });
}

// Numbered circle
function numCircle(s, pres, x, y, size, num) {
  s.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color: COLORS.lavender }, line: { color: COLORS.purple, width: 2 },
  });
  s.addText(String(num), {
    x, y, w: size, h: size,
    fontSize: size > 0.45 ? 18 : 13, fontFace: F.title, color: COLORS.deepPurple,
    bold: true, align: 'center', valign: 'middle', margin: 0,
  });
}

// Set background from Gemini art
function setBg(s, num) {
  const f = path.join(ART_DIR, `slide-${String(num).padStart(2, '0')}.png`);
  if (fs.existsSync(f)) {
    s.background = { path: f };
  } else {
    s.background = { color: COLORS.nearWhite };
  }
}

// ============================================================
// BUILD
// ============================================================
async function main() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'Agentic Software Engineering Playbook';

  // ─────── SLIDE 1: COVER ───────
  {
    const s = pres.addSlide();
    setBg(s, 1);

    // Dark overlay panel for text readability on dark bg
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: SW * 0.62, h: SH,
      fill: { color: '1A0F40', transparency: 25 },
    });

    s.addText('PLAYBOOK', {
      x: 0.7, y: 0.5, w: 4, h: 0.3,
      fontSize: 11, fontFace: F.body, color: COLORS.lightPurple, charSpacing: 8, margin: 0,
    });

    thinLine(s, pres, 0.7, 0.85, 2.2, { color: COLORS.purple });

    s.addText('Agentic Software\nEngineering Playbook', {
      x: 0.7, y: 1.0, w: 5, h: 1.8,
      fontSize: 44, fontFace: F.title, color: COLORS.whiteText, bold: true, margin: 0,
    });

    s.addText("From OpenAI's Internal Transformation", {
      x: 0.7, y: 2.85, w: 5, h: 0.4,
      fontSize: 17, fontFace: F.body, color: COLORS.lightPurple, margin: 0,
    });

    thinLine(s, pres, 0.7, 3.4, 3.5, { color: COLORS.accent, width: 0.5 });

    s.addText([
      { text: '"Software development is undergoing a renaissance\nin front of our eyes."', options: { italic: true, breakLine: true } },
      { text: '\n\u2014 Greg Brockman, OpenAI Co-founder', options: { fontSize: 10, color: COLORS.mutedText } },
    ], {
      x: 0.7, y: 3.6, w: 5, h: 0.95,
      fontSize: 14, fontFace: F.body, color: COLORS.lavender, margin: 0,
    });

    s.addText('For Engineering Teams, Tech Leads, CTOs  |  February 2026', {
      x: 0.7, y: SH - 0.45, w: 5, h: 0.25,
      fontSize: 9, fontFace: F.body, color: COLORS.mutedText, margin: 0,
    });
  }

  // ─────── SLIDE 2: DECEMBER 2025 ───────
  {
    const s = pres.addSlide();
    setBg(s, 2);

    // Title panel
    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.75, { transparency: 10 });
    title(s, 'The December 2025 Inflection Point');
    pageNum(s, 2);

    const cW = 4.3, cH = 1.7, gap = 0.4, cY = 1.1;
    const aX = M + cW + gap;

    // Before card
    panel(s, pres, M, cY, cW, cH, { transparency: 5 });
    s.addText('Before December 2025', {
      x: M + 0.2, y: cY + 0.1, w: cW - 0.4, h: 0.35,
      fontSize: 15, fontFace: F.body, color: COLORS.mutedText, bold: true, margin: 0,
    });
    s.addText([
      { text: 'Codex for unit tests only', options: { bullet: true, breakLine: true } },
      { text: 'Limited to simple tasks', options: { bullet: true, breakLine: true } },
      { text: 'Experimental tool', options: { bullet: true } },
    ], {
      x: M + 0.25, y: cY + 0.5, w: cW - 0.5, h: 1.1,
      fontSize: 13, fontFace: F.body, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 6,
    });

    // After card (emphasized)
    panel(s, pres, aX, cY, cW, cH, { transparency: 0, border: COLORS.purple, borderWidth: 2 });
    s.addText('After December 2025', {
      x: aX + 0.2, y: cY + 0.1, w: cW - 0.4, h: 0.35,
      fontSize: 15, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText([
      { text: 'Codex writes essentially all code', options: { bullet: true, breakLine: true, bold: true } },
      { text: 'Handles operations and debugging', options: { bullet: true, breakLine: true, bold: true } },
      { text: 'Primary development interface', options: { bullet: true, bold: true } },
    ], {
      x: aX + 0.25, y: cY + 0.5, w: cW - 0.5, h: 1.1,
      fontSize: 13, fontFace: F.body, color: COLORS.deepPurple, margin: 0, paraSpaceAfter: 6,
    });

    // Proof section
    const pY = 3.0;
    s.addText('Real-World Proof', {
      x: M, y: pY, w: 3, h: 0.35,
      fontSize: 18, fontFace: F.title, color: COLORS.titleText, bold: true, margin: 0,
    });

    const stY = pY + 0.45, stH = 1.15;
    panel(s, pres, M, stY, cW, stH, { transparency: 5 });
    accentBar(s, pres, M, stY, stH, COLORS.purple);
    s.addText('Sora Android App', {
      x: M + 0.25, y: stY + 0.08, w: cW - 0.4, h: 0.3,
      fontSize: 14, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('4 engineers \u00B7 18 days \u00B7 vs 3\u20136 months traditional', {
      x: M + 0.25, y: stY + 0.4, w: cW - 0.4, h: 0.25,
      fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0,
    });
    s.addText('~10x faster', {
      x: M + 0.25, y: stY + 0.7, w: cW - 0.4, h: 0.3,
      fontSize: 16, fontFace: F.title, color: COLORS.purple, bold: true, margin: 0,
    });

    panel(s, pres, aX, stY, cW, stH, { transparency: 5 });
    accentBar(s, pres, aX, stY, stH, COLORS.purple);
    s.addText('C Compiler (100K lines)', {
      x: aX + 0.25, y: stY + 0.08, w: cW - 0.4, h: 0.3,
      fontSize: 14, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('16 parallel agents \u00B7 ~2,000 sessions \u00B7 $20K API cost', {
      x: aX + 0.25, y: stY + 0.4, w: cW - 0.4, h: 0.25,
      fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0,
    });
    s.addText('Compiles Linux 6.9 kernel', {
      x: aX + 0.25, y: stY + 0.7, w: cW - 0.4, h: 0.3,
      fontSize: 16, fontFace: F.title, color: COLORS.purple, bold: true, margin: 0,
    });

    panel(s, pres, M, 4.85, CW, 0.35, { transparency: 25, noShadow: true });
    s.addText('Catalyst: GPT-5.2-Codex \u2014 long-horizon work, large code changes, leading SWE-Bench Pro', {
      x: M + 0.1, y: 4.88, w: CW - 0.2, h: 0.25,
      fontSize: 10, fontFace: F.body, color: COLORS.mutedText, italic: true, margin: 0,
    });
  }

  // ─────── SLIDE 3: METRICS ───────
  {
    const s = pres.addSlide();
    setBg(s, 3);

    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.75, { transparency: 10 });
    title(s, 'The Scale of Change');
    pageNum(s, 3);

    const stW = 2.8, stH = 2.3, gap = 0.2;
    const totW = stW * 3 + gap * 2;
    const sX = (SW - totW) / 2, stY = 1.15;

    const stats = [
      { num: '1M+', label: 'Developers\nusing Codex', sub: 'and growing' },
      { num: '2x', label: 'Usage growth\nsince GPT-5.2', sub: 'nearly doubled' },
      { num: '20x', label: 'Growth since\nAugust 2025', sub: 'explosive adoption' },
    ];

    stats.forEach((st, i) => {
      const x = sX + i * (stW + gap);
      panel(s, pres, x, stY, stW, stH, {
        transparency: 0,
        border: i === 2 ? COLORS.purple : COLORS.lightPurple,
        borderWidth: i === 2 ? 2.5 : 1,
      });
      s.addText(st.num, {
        x, y: stY + 0.15, w: stW, h: 1.0,
        fontSize: 54, fontFace: F.title, color: COLORS.deepPurple,
        bold: true, align: 'center', valign: 'middle', margin: 0,
      });
      s.addText(st.label, {
        x, y: stY + 1.15, w: stW, h: 0.6,
        fontSize: 14, fontFace: F.body, color: COLORS.bodyText,
        align: 'center', valign: 'top', margin: 0,
      });
      s.addText(st.sub, {
        x, y: stY + 1.8, w: stW, h: 0.3,
        fontSize: 10, fontFace: F.body, color: COLORS.mutedText,
        italic: true, align: 'center', margin: 0,
      });
    });

    panel(s, pres, M + 0.5, 3.8, CW - 1, 0.95, { transparency: 10, noShadow: true });
    s.addText('Enterprise Customers', {
      x: M, y: 3.9, w: CW, h: 0.3,
      fontSize: 15, fontFace: F.body, color: COLORS.titleText, bold: true, align: 'center', margin: 0,
    });
    s.addText('Cisco \u00B7 Ramp \u00B7 Virgin Atlantic \u00B7 Vanta \u00B7 Duolingo \u00B7 Gap', {
      x: M, y: 4.25, w: CW, h: 0.3,
      fontSize: 14, fontFace: F.body, color: COLORS.bodyText, align: 'center', margin: 0,
    });
  }

  // ─────── SLIDE 4: MANDATE ───────
  {
    const s = pres.addSlide();
    setBg(s, 4);

    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.95, { transparency: 10 });
    title(s, 'The March 31, 2026 Mandate');
    subtitle(s, "OpenAI's Organizational Targets");
    pageNum(s, 4);

    const gW = CW, gH = 1.0;
    const g1Y = 1.25;

    panel(s, pres, M, g1Y, gW, gH, { transparency: 0 });
    accentBar(s, pres, M, g1Y, gH, COLORS.purple);
    s.addText('Goal 1: Tool of First Resort', {
      x: M + 0.3, y: g1Y + 0.08, w: gW - 0.5, h: 0.35,
      fontSize: 16, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('For any technical task, humans interact with an agent rather than using an editor or terminal.', {
      x: M + 0.3, y: g1Y + 0.48, w: gW - 0.5, h: 0.4,
      fontSize: 13, fontFace: F.body, color: COLORS.bodyText, margin: 0,
    });

    const g2Y = g1Y + gH + 0.2;
    panel(s, pres, M, g2Y, gW, gH, { transparency: 0 });
    accentBar(s, pres, M, g2Y, gH, COLORS.purple);
    s.addText('Goal 2: Safe & Productive Default', {
      x: M + 0.3, y: g2Y + 0.08, w: gW - 0.5, h: 0.35,
      fontSize: 16, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText("Agent utilization is explicitly evaluated as safe, but also productive enough that most workflows don't need additional permissions.", {
      x: M + 0.3, y: g2Y + 0.48, w: gW - 0.5, h: 0.4,
      fontSize: 13, fontFace: F.body, color: COLORS.bodyText, margin: 0,
    });

    const wY = g2Y + gH + 0.3;
    panel(s, pres, M, wY, CW, 1.2, { transparency: 15, noShadow: true });
    s.addText('Why March 31?', {
      x: M + 0.15, y: wY + 0.05, w: 3, h: 0.35,
      fontSize: 17, fontFace: F.title, color: COLORS.titleText, bold: true, margin: 0,
    });
    s.addText([
      { text: 'Top-down organizational transformation', options: { bullet: true, breakLine: true } },
      { text: 'Not aspirational \u2014 operational deadline', options: { bullet: true, breakLine: true } },
      { text: 'Drives cultural change, not just tool adoption', options: { bullet: true } },
    ], {
      x: M + 0.2, y: wY + 0.4, w: CW - 0.4, h: 0.75,
      fontSize: 13, fontFace: F.body, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 6,
    });
  }

  // ─────── SLIDE 5: COMPARISON ───────
  {
    const s = pres.addSlide();
    setBg(s, 5);

    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.75, { transparency: 10 });
    title(s, 'Traditional vs Agentic Engineering');
    pageNum(s, 5);

    const tY = 1.05, rH = 0.45, lW = 1.7, cW2 = 3.65;

    // Table backdrop
    panel(s, pres, M, tY - 0.05, CW, rH * 9 + 0.15, { transparency: 5 });

    s.addText('Dimension', { x: M + 0.1, y: tY, w: lW, h: rH, fontSize: 11, fontFace: F.body, color: COLORS.mutedText, bold: true, margin: 0, valign: 'middle' });
    s.addText('Traditional', { x: M + lW, y: tY, w: cW2, h: rH, fontSize: 11, fontFace: F.body, color: COLORS.mutedText, bold: true, margin: [0, 0, 0, 10], valign: 'middle' });
    s.addText('Agentic', { x: M + lW + cW2, y: tY, w: cW2, h: rH, fontSize: 12, fontFace: F.body, color: COLORS.purple, bold: true, margin: [0, 0, 0, 10], valign: 'middle' });

    thinLine(s, pres, M + 0.1, tY + rH, CW - 0.2, { color: COLORS.purple, width: 1.5 });

    const rows = [
      ['First Action', 'Open IDE, write code', 'Prompt agent with intent'],
      ['Code Production', 'Human writes line-by-line', 'Agent generates, human reviews'],
      ['Debugging', 'Manual trace, breakpoint', 'Agent diagnoses and fixes'],
      ['Testing', 'Write tests after code', 'Agent writes tests first'],
      ['Documentation', 'Write docs after shipping', 'Spec-driven development'],
      ['Knowledge', 'Code comments, wiki', 'AGENTS.md + Skills'],
      ['Tool Usage', 'Click UI, manual steps', 'Agent invokes via CLI/MCP'],
      ['Speed', 'Hours/days per feature', 'Minutes with feedback loops'],
    ];

    rows.forEach((r, i) => {
      const y = tY + rH + i * rH + 0.05;
      if (i % 2 === 0) {
        s.addShape(pres.shapes.RECTANGLE, {
          x: M + 0.05, y, w: CW - 0.1, h: rH,
          fill: { color: COLORS.lavender, transparency: 40 }, rectRadius: 0.04,
        });
      }
      s.addText(r[0], { x: M + 0.15, y, w: lW - 0.1, h: rH, fontSize: 12, fontFace: F.body, color: COLORS.deepPurple, bold: true, valign: 'middle', margin: 0 });
      s.addText(r[1], { x: M + lW, y, w: cW2, h: rH, fontSize: 12, fontFace: F.body, color: COLORS.bodyText, valign: 'middle', margin: [0, 0, 0, 10] });
      s.addText(r[2], { x: M + lW + cW2, y, w: cW2, h: rH, fontSize: 12, fontFace: F.body, color: COLORS.deepPurple, bold: true, valign: 'middle', margin: [0, 0, 0, 10] });
    });

    // Vertical accent
    s.addShape(pres.shapes.LINE, { x: M + lW + cW2 - 0.05, y: tY, w: 0, h: rH * 9 + 0.05, line: { color: COLORS.purple, width: 1 } });
  }

  // ─────── SLIDE 6: 6 PILLARS ───────
  {
    const s = pres.addSlide();
    setBg(s, 6);

    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.95, { transparency: 10 });
    title(s, 'The 6-Pillar Playbook');
    subtitle(s, "OpenAI's Implementation Framework");
    pageNum(s, 6);

    const pillars = [
      { n: '1', t: 'Adoption', d: 'Try the tools \u2014 designate\n"Agents Captain" per team' },
      { n: '2', t: 'AGENTS.md', d: 'Create machine-readable\nproject handbook' },
      { n: '3', t: 'Tools', d: 'Make internal tools\nagent-accessible (CLI/MCP)' },
      { n: '4', t: 'Architecture', d: 'Restructure codebases for\nagent-first development' },
      { n: '5', t: 'Quality', d: '"Say no to slop" \u2014\nmaintain review bar' },
      { n: '6', t: 'Infrastructure', d: 'Build observability,\ntrajectory tracking' },
    ];
    const cols = 3, cW3 = 2.8, cH = 1.7, gx = 0.2, gy = 0.2;
    const gridW = cols * cW3 + (cols - 1) * gx;
    const gridX = (SW - gridW) / 2, gridY = 1.25;

    pillars.forEach((p, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = gridX + col * (cW3 + gx), y = gridY + row * (cH + gy);
      panel(s, pres, x, y, cW3, cH, { transparency: 0 });
      numCircle(s, pres, x + 0.15, y + 0.15, 0.45, p.n);
      s.addText(p.t, {
        x: x + 0.7, y: y + 0.15, w: cW3 - 0.9, h: 0.4,
        fontSize: 17, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle',
      });
      thinLine(s, pres, x + 0.15, y + 0.65, cW3 - 0.3, { color: COLORS.lavender });
      s.addText(p.d, {
        x: x + 0.2, y: y + 0.75, w: cW3 - 0.4, h: 0.85,
        fontSize: 12, fontFace: F.body, color: COLORS.bodyText, margin: 0,
      });
    });
  }

  // ─────── SLIDE 7: PILLAR 1-2 ───────
  {
    const s = pres.addSlide();
    setBg(s, 7);

    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.75, { transparency: 10 });
    title(s, 'Pillar 1-2: Adoption & Knowledge');
    pageNum(s, 7);

    const hW = (CW - 0.3) / 2, lx = M, rx = M + hW + 0.3, sy = 1.1;

    // Left
    panel(s, pres, lx, sy, hW, 3.3, { transparency: 8 });
    numCircle(s, pres, lx + 0.15, sy + 0.12, 0.38, '1');
    s.addText('Cultural Adoption', { x: lx + 0.6, y: sy + 0.12, w: hW - 0.8, h: 0.38, fontSize: 17, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    const challenges = [['Engineers "too busy"', '"Agents Captain" role per team'], ['Uncertainty', 'Shared internal channels'], ['Lack of exposure', 'Company-wide Codex hackathon']];
    challenges.forEach((c, i) => {
      const y = sy + 0.65 + i * 0.72;
      panel(s, pres, lx + 0.1, y, hW - 0.2, 0.62, { transparency: 0 });
      s.addText(c[0], { x: lx + 0.2, y: y + 0.05, w: hW - 0.4, h: 0.22, fontSize: 11, fontFace: F.body, color: COLORS.mutedText, margin: 0 });
      s.addText(c[1], { x: lx + 0.2, y: y + 0.3, w: hW - 0.4, h: 0.25, fontSize: 13, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0 });
    });
    s.addText('"The tools do sell themselves."', { x: lx + 0.15, y: sy + 2.85, w: hW - 0.3, h: 0.3, fontSize: 12, fontFace: F.body, color: COLORS.purple, italic: true, margin: 0 });

    // Right
    panel(s, pres, rx, sy, hW, 3.3, { transparency: 8 });
    numCircle(s, pres, rx + 0.15, sy + 0.12, 0.38, '2');
    s.addText('AGENTS.md & Skills', { x: rx + 0.6, y: sy + 0.12, w: hW - 0.8, h: 0.38, fontSize: 17, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    panel(s, pres, rx + 0.1, sy + 0.65, hW - 0.2, 1.55, { transparency: 0, color: COLORS.nearWhite });
    s.addText([
      { text: 'project-root/', options: { breakLine: true, bold: true, color: COLORS.deepPurple } },
      { text: '\u251C\u2500\u2500 AGENTS.md', options: { breakLine: true, color: COLORS.purple } },
      { text: '\u2502   Project context, conventions', options: { breakLine: true, color: COLORS.mutedText, fontSize: 10 } },
      { text: '\u251C\u2500\u2500 skills/', options: { breakLine: true, color: COLORS.purple } },
      { text: '\u2502   deploy.sh, test-suite.yml', options: { breakLine: true, color: COLORS.mutedText, fontSize: 10 } },
      { text: '\u2514\u2500\u2500 src/', options: { color: COLORS.purple } },
    ], { x: rx + 0.2, y: sy + 0.75, w: hW - 0.4, h: 1.35, fontSize: 12, fontFace: F.mono, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 3 });

    s.addText('Industry Convergence', { x: rx + 0.15, y: sy + 2.35, w: hW - 0.3, h: 0.3, fontSize: 13, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0 });
    s.addText('AGENTS.md (OpenAI, Google) \u00B7 CLAUDE.md (Anthropic)\ncopilot-instructions.md (GitHub)', {
      x: rx + 0.15, y: sy + 2.65, w: hW - 0.3, h: 0.45, fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0,
    });
  }

  // ─────── SLIDE 8: PILLAR 3-4 ───────
  {
    const s = pres.addSlide();
    setBg(s, 8);
    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.75, { transparency: 10 });
    title(s, 'Pillar 3-4: Tools & Architecture');
    pageNum(s, 8);

    const hW = (CW - 0.3) / 2, lx = M, rx = M + hW + 0.3, sy = 1.1;

    panel(s, pres, lx, sy, hW, 3.3, { transparency: 8 });
    numCircle(s, pres, lx + 0.15, sy + 0.12, 0.38, '3');
    s.addText('Agent-Accessible Tooling', { x: lx + 0.6, y: sy + 0.12, w: hW - 0.8, h: 0.38, fontSize: 16, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    [['Audit tools', 'Catalog team dependencies'], ['Enable access', 'CLI wrappers or MCP servers'], ['Assign ownership', 'One person per tool integration']].forEach((t, i) => {
      const y = sy + 0.65 + i * 0.65;
      panel(s, pres, lx + 0.1, y, hW - 0.2, 0.55, { transparency: 0 });
      s.addText(t[0], { x: lx + 0.2, y: y + 0.05, w: hW * 0.4, h: 0.45, fontSize: 12, fontFace: F.body, color: COLORS.purple, bold: true, margin: 0, valign: 'middle' });
      s.addText(t[1], { x: lx + hW * 0.42, y: y + 0.05, w: hW * 0.52, h: 0.45, fontSize: 12, fontFace: F.body, color: COLORS.bodyText, margin: 0, valign: 'middle' });
    });

    panel(s, pres, lx + 0.1, sy + 2.65, hW - 0.2, 0.55, { transparency: 0, border: COLORS.purple, color: COLORS.lavender });
    s.addText('MCP (Model Context Protocol)', { x: lx + 0.2, y: sy + 2.68, w: hW - 0.4, h: 0.22, fontSize: 12, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0 });
    s.addText('Emerging standard for agent-tool connections', { x: lx + 0.2, y: sy + 2.92, w: hW - 0.4, h: 0.22, fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0 });

    panel(s, pres, rx, sy, hW, 3.3, { transparency: 8 });
    numCircle(s, pres, rx + 0.15, sy + 0.12, 0.38, '4');
    s.addText('Agent-First Codebase', { x: rx + 0.6, y: sy + 0.12, w: hW - 0.8, h: 0.38, fontSize: 16, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    [['Fast tests', 'Agents iterate by running tests repeatedly'], ['Clean interfaces', 'Agents reason about one component at a time'], ['Strong types', 'Compiler acts as correctness checker'], ['Clear boundaries', 'Agents work on isolated components']].forEach((p, i) => {
      const y = sy + 0.65 + i * 0.62;
      panel(s, pres, rx + 0.1, y, hW - 0.2, 0.52, { transparency: 0 });
      accentBar(s, pres, rx + 0.1, y, 0.52, COLORS.purple);
      s.addText(p[0], { x: rx + 0.3, y: y + 0.04, w: hW - 0.5, h: 0.2, fontSize: 13, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0 });
      s.addText(p[1], { x: rx + 0.3, y: y + 0.26, w: hW - 0.5, h: 0.22, fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0 });
    });
  }

  // ─────── SLIDE 9: PILLAR 5-6 ───────
  {
    const s = pres.addSlide();
    setBg(s, 9);
    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.75, { transparency: 10 });
    title(s, 'Pillar 5-6: Quality & Infrastructure');
    pageNum(s, 9);

    const hW = (CW - 0.3) / 2, lx = M, rx = M + hW + 0.3, sy = 1.1;

    panel(s, pres, lx, sy, hW, 3.3, { transparency: 8 });
    numCircle(s, pres, lx + 0.15, sy + 0.12, 0.38, '5');
    s.addText('"Say No to Slop"', { x: lx + 0.6, y: sy + 0.12, w: hW - 0.8, h: 0.38, fontSize: 16, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    [['Human accountability', 'Someone accountable for all merged code'], ['Same review bar', 'Maintain standard for agent-generated code'], ['Author comprehension', 'No "vibe merging" \u2014 understand what you submit']].forEach((r, i) => {
      const y = sy + 0.65 + i * 0.62;
      panel(s, pres, lx + 0.1, y, hW - 0.2, 0.52, { transparency: 0 });
      accentBar(s, pres, lx + 0.1, y, 0.52, COLORS.purple);
      s.addText(r[0], { x: lx + 0.3, y: y + 0.04, w: hW - 0.5, h: 0.2, fontSize: 13, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0 });
      s.addText(r[1], { x: lx + 0.3, y: y + 0.26, w: hW - 0.5, h: 0.22, fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0 });
    });

    panel(s, pres, lx + 0.1, sy + 2.6, hW - 0.2, 0.6, { transparency: 0, border: COLORS.purple, color: COLORS.nearWhite });
    s.addText('The "Slop" Problem', { x: lx + 0.2, y: sy + 2.63, w: hW - 0.4, h: 0.22, fontSize: 12, fontFace: F.body, color: COLORS.purple, bold: true, margin: 0 });
    s.addText('Functionally correct but poorly maintainable \u2014 passes tests but introduces technical debt.', { x: lx + 0.2, y: sy + 2.88, w: hW - 0.4, h: 0.28, fontSize: 10, fontFace: F.body, color: COLORS.bodyText, italic: true, margin: 0 });

    panel(s, pres, rx, sy, hW, 3.3, { transparency: 8 });
    numCircle(s, pres, rx + 0.15, sy + 0.12, 0.38, '6');
    s.addText('Infrastructure for Agents', { x: rx + 0.6, y: sy + 0.12, w: hW - 0.8, h: 0.38, fontSize: 16, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    [['Observability', 'Monitor agent performance and success rates'], ['Trajectory tracking', 'Capture reasoning path, not just output'], ['Tool management', 'Governance over agent tool access'], ['Feedback loops', 'Internal usage data drives improvements']].forEach((item, i) => {
      const y = sy + 0.65 + i * 0.62;
      panel(s, pres, rx + 0.1, y, hW - 0.2, 0.52, { transparency: 0 });
      s.addText(item[0], { x: rx + 0.2, y: y + 0.04, w: hW - 0.4, h: 0.2, fontSize: 13, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0 });
      s.addText(item[1], { x: rx + 0.2, y: y + 0.26, w: hW - 0.4, h: 0.22, fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0 });
    });
  }

  // ─────── SLIDE 10: EVOLVING ROLE ───────
  {
    const s = pres.addSlide();
    setBg(s, 10);
    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.95, { transparency: 10 });
    title(s, 'The Evolving Engineer Role');
    subtitle(s, 'From Writer to Orchestrator');
    pageNum(s, 10);

    const cW4 = 3.8, lx2 = M + 0.2, rx2 = M + cW4 + 1.1;
    const rY = 1.15, rH = 0.38;

    panel(s, pres, M, rY - 0.05, CW, rH * 7 + 0.4, { transparency: 5 });

    s.addText('Old Focus', { x: lx2, y: rY, w: cW4, h: rH, fontSize: 12, fontFace: F.body, color: COLORS.mutedText, bold: true, margin: 0 });
    s.addText('New Focus', { x: rx2, y: rY, w: cW4, h: rH, fontSize: 13, fontFace: F.body, color: COLORS.purple, bold: true, margin: 0 });
    thinLine(s, pres, M + 0.1, rY + rH, CW - 0.2, { color: COLORS.purple, width: 1.5 });

    const roles = [
      ['Writing implementation code', 'Designing agent-implementable systems'],
      ['Manual coding', 'Writing specifications for agents'],
      ['Debugging line-by-line', 'Reviewing and curating agent output'],
      ['Ad-hoc knowledge sharing', 'Maintaining AGENTS.md & skills'],
      ['Single-threaded work', 'Orchestrating multiple agents'],
      ['Low-level coding', 'Higher-order design & communication'],
    ];
    roles.forEach((r, i) => {
      const y = rY + rH + 0.05 + i * rH;
      if (i % 2 === 0) s.addShape(pres.shapes.RECTANGLE, { x: M + 0.05, y, w: CW - 0.1, h: rH, fill: { color: COLORS.lavender, transparency: 50 }, rectRadius: 0.03 });
      s.addText(r[0], { x: lx2, y, w: cW4, h: rH, fontSize: 12, fontFace: F.body, color: COLORS.bodyText, margin: 0, valign: 'middle' });
      s.addText('\u2192', { x: lx2 + cW4, y, w: 0.9, h: rH, fontSize: 16, fontFace: F.body, color: COLORS.purple, align: 'center', valign: 'middle', margin: 0, bold: true });
      s.addText(r[1], { x: rx2, y, w: cW4, h: rH, fontSize: 12, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });
    });

    const spY = 3.75;
    thinLine(s, pres, M + 0.5, spY - 0.05, CW - 1, { color: COLORS.lightPurple, dash: 'dash' });
    s.addText('Spec-Driven Development', { x: M, y: spY, w: 4, h: 0.35, fontSize: 16, fontFace: F.title, color: COLORS.titleText, bold: true, margin: 0 });

    const steps = ['Engineer writes\nSpecification', 'Agent\nImplements', 'Spec = Instruction +\nAcceptance Criteria'];
    const stW = 2.6, stH = 0.75, fG = 0.25;
    const fTot = stW * 3 + fG * 2, fX = (SW - fTot) / 2, fY = spY + 0.4;
    steps.forEach((st, i) => {
      const x = fX + i * (stW + fG);
      panel(s, pres, x, fY, stW, stH, { transparency: 0, border: i === 1 ? COLORS.purple : COLORS.lightPurple, borderWidth: i === 1 ? 2 : 1 });
      s.addText(st, { x, y: fY, w: stW, h: stH, fontSize: 12, fontFace: F.body, color: i === 1 ? COLORS.deepPurple : COLORS.bodyText, bold: i === 1, align: 'center', valign: 'middle', margin: 4 });
      if (i < 2) s.addText('\u2192', { x: x + stW, y: fY, w: fG, h: stH, fontSize: 20, fontFace: F.body, color: COLORS.purple, align: 'center', valign: 'middle', margin: 0, bold: true });
    });
  }

  // ─────── SLIDE 11: ROADMAP ───────
  {
    const s = pres.addSlide();
    setBg(s, 11);
    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.75, { transparency: 10 });
    title(s, 'Implementation Roadmap');
    pageNum(s, 11);

    const phases = [
      { t: 'Phase 1', p: 'Weeks 1\u20132', sub: 'Foundation', items: ['Designate "Agents Captain"', 'Schedule Codex hackathon', 'Create initial AGENTS.md', 'Audit tooling accessibility'] },
      { t: 'Phase 2', p: 'Weeks 3\u20134', sub: 'Infrastructure', items: ['Set up skills repository', 'Create MCP servers (top 5)', 'Establish review guidelines', 'Set up agent observability'] },
      { t: 'Phase 3', p: 'Weeks 5\u20138', sub: 'Optimization', items: ['Optimize tests (<30s target)', 'Refine AGENTS.md from failures', 'Build skills library', 'Define quality metrics'] },
      { t: 'Phase 4', p: 'Ongoing', sub: 'Scale', items: ['Regular AGENTS.md reviews', 'Continuous skills development', 'Infrastructure improvements'] },
    ];
    const pW = 2.1, pH2 = 3.5, pG = 0.15;
    const tW = phases.length * pW + (phases.length - 1) * pG;
    const sX = (SW - tW) / 2, pY = 1.05;

    phases.forEach((p, i) => {
      const x = sX + i * (pW + pG);
      panel(s, pres, x, pY, pW, pH2, { transparency: 0, border: i === 0 ? COLORS.purple : COLORS.lightPurple, borderWidth: i === 0 ? 2 : 1 });

      // Header area
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.04, y: pY + 0.04, w: pW - 0.08, h: 0.75,
        fill: { color: i === 0 ? COLORS.lavender : COLORS.paleLavender }, rectRadius: 0.06,
      });
      s.addText(p.t, { x, y: pY + 0.06, w: pW, h: 0.32, fontSize: 15, fontFace: F.body, color: COLORS.deepPurple, bold: true, align: 'center', margin: 0 });
      s.addText(p.p, { x, y: pY + 0.38, w: pW, h: 0.25, fontSize: 10, fontFace: F.body, color: COLORS.mutedText, align: 'center', margin: 0 });
      s.addText(p.sub, { x, y: pY + 0.85, w: pW, h: 0.3, fontSize: 14, fontFace: F.body, color: COLORS.purple, bold: true, align: 'center', margin: 0 });

      const its = p.items.map((item, j) => ({ text: item, options: { bullet: true, breakLine: j < p.items.length - 1 } }));
      s.addText(its, { x: x + 0.12, y: pY + 1.2, w: pW - 0.24, h: 2.1, fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 8 });

      if (i < phases.length - 1) {
        s.addText('\u203A', { x: x + pW, y: pY + 0.15, w: pG, h: 0.6, fontSize: 22, fontFace: F.body, color: COLORS.purple, align: 'center', valign: 'middle', margin: 0, bold: true });
      }
    });
  }

  // ─────── SLIDE 12: TAKEAWAYS & RISKS ───────
  {
    const s = pres.addSlide();
    setBg(s, 12);
    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.75, { transparency: 10 });
    title(s, 'Key Takeaways & Open Risks');
    pageNum(s, 12);

    const hW = (CW - 0.3) / 2, lx = M, rx = M + hW + 0.3, sy = 1.05;

    panel(s, pres, lx, sy, hW, 3.55, { transparency: 8 });
    s.addText('Key Takeaways', { x: lx + 0.15, y: sy + 0.08, w: hW - 0.3, h: 0.35, fontSize: 18, fontFace: F.title, color: COLORS.titleText, bold: true, margin: 0 });

    const takeaways = [
      'Organizational transformation,\nnot tool adoption',
      'Architect role becomes\nmore critical',
      'AGENTS.md is the new README',
      '"Say no to slop" is the\nhardest pillar',
      'Agent infrastructure is a\ngreenfield opportunity',
      'Navigate deliberately \u2014\ntransition is inevitable',
    ];
    takeaways.forEach((t, i) => {
      const y = sy + 0.55 + i * 0.48;
      numCircle(s, pres, lx + 0.15, y + 0.02, 0.28, i + 1);
      s.addText(t, { x: lx + 0.5, y, w: hW - 0.7, h: 0.45, fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0 });
    });

    panel(s, pres, rx, sy, hW, 3.55, { transparency: 8 });
    s.addText('Open Risks', { x: rx + 0.15, y: sy + 0.08, w: hW - 0.3, h: 0.35, fontSize: 18, fontFace: F.title, color: COLORS.titleText, bold: true, margin: 0 });

    [{ r: 'Code ownership', m: 'Rigorous review,\nnot rubber-stamping' }, { r: 'Technical debt', m: 'New metrics for\nAI-generated drift' }, { r: 'Security', m: '"Safe but productive"\nbalance' }, { r: 'Skill atrophy', m: 'Maintain deep understanding\nfor review' }].forEach((item, i) => {
      const y = sy + 0.55 + i * 0.72;
      panel(s, pres, rx + 0.1, y, hW - 0.2, 0.62, { transparency: 0 });
      accentBar(s, pres, rx + 0.1, y, 0.62, COLORS.purple);
      s.addText(item.r, { x: rx + 0.3, y: y + 0.05, w: hW - 0.5, h: 0.22, fontSize: 13, fontFace: F.body, color: COLORS.deepPurple, bold: true, margin: 0 });
      s.addText(item.m, { x: rx + 0.3, y: y + 0.3, w: hW - 0.5, h: 0.28, fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0 });
    });
  }

  // ─────── SLIDE 13: APPENDIX ───────
  {
    const s = pres.addSlide();
    setBg(s, 13);
    panel(s, pres, M - 0.1, 0.15, CW + 0.2, 0.75, { transparency: 10 });
    title(s, 'Appendix: Language-Specific Notes');
    pageNum(s, 13);

    const langs = [
      { name: 'Rust', items: [{ t: 'Type system = built-in correctness verification', tp: 'pro' }, { t: 'unsafe blocks need explicit AGENTS.md policy', tp: 'warn' }, { t: 'Build times may slow agent iteration', tp: 'warn' }] },
      { name: 'C / C++', items: [{ t: 'Less safety guardrails \u2192 more prescriptive AGENTS.md', tp: 'warn' }, { t: 'Memory management conventions must be explicit', tp: 'warn' }] },
      { name: 'Python', items: [{ t: 'Large training corpus = agents perform well', tp: 'pro' }, { t: 'Mandate type hints and mypy in AGENTS.md', tp: 'warn' }] },
    ];
    const lW2 = 2.8, lH = 2.9, lG = 0.25;
    const tLW = langs.length * lW2 + (langs.length - 1) * lG;
    const lSX = (SW - tLW) / 2, lY = 1.05;

    langs.forEach((lang, i) => {
      const x = lSX + i * (lW2 + lG);
      panel(s, pres, x, lY, lW2, lH, { transparency: 0 });
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.04, y: lY + 0.04, w: lW2 - 0.08, h: 0.55,
        fill: { color: COLORS.lavender }, rectRadius: 0.06,
      });
      s.addText(lang.name, { x, y: lY + 0.06, w: lW2, h: 0.5, fontSize: 20, fontFace: F.title, color: COLORS.deepPurple, bold: true, align: 'center', valign: 'middle', margin: 0 });

      lang.items.forEach((item, j) => {
        const iy = lY + 0.72 + j * 0.65;
        const pre = item.tp === 'pro' ? '\u2713' : '\u26A0';
        const pc = item.tp === 'pro' ? '2D8659' : 'B8860B';
        s.addText(pre, { x: x + 0.15, y: iy, w: 0.3, h: 0.28, fontSize: 15, fontFace: F.body, color: pc, bold: true, margin: 0 });
        s.addText(item.t, { x: x + 0.45, y: iy, w: lW2 - 0.6, h: 0.55, fontSize: 11, fontFace: F.body, color: COLORS.bodyText, margin: 0 });
      });
    });

    s.addText("Source: Greg Brockman's public post on OpenAI's internal agentic transformation  |  Compiled: February 2026", {
      x: M, y: SH - 0.45, w: CW, h: 0.3,
      fontSize: 9, fontFace: F.body, color: COLORS.mutedText, align: 'center', margin: 0,
    });
  }

  const outPath = '/Users/yuechen/home/cc-ppt/Agentic_SE_Playbook_Final.pptx';
  await pres.writeFile({ fileName: outPath });
  console.log(`\nPresentation saved: ${outPath}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
