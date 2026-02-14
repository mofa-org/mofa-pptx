const pptxgen = require("pptxgenjs");
const sharp = require("sharp");

// ============================================================
// CONFIGURATION — Change these to restyle the entire deck
// ============================================================
const COLORS = {
  // Primary palette
  deepPurple:   '2D1B69',
  mediumPurple: '4A2C82',
  purple:       '7B5EA7',
  lightPurple:  'C4B5D9',
  lavender:     'E8DFF5',
  paleLavender: 'F3EFF9',
  nearWhite:    'F8F5FC',
  white:        'FFFFFF',

  // Text
  titleText:  '2D1B69',
  darkText:   '2D2040',
  bodyText:   '3D3252',
  mutedText:  '8E7BAF',
  lightText:  'C4B5D9',
  whiteText:  'FFFFFF',

  // UI elements
  cardBorder: 'C4B5D9',
  cardFill:   'FFFFFF',
  thinLine:   'D4C8E8',
  accentLine: '7B5EA7',
};

const FONTS = {
  title: 'Georgia',
  body:  'Calibri',
  mono:  'Consolas',
};

const SIZES = {
  slideTitle:   32,
  sectionTitle: 20,
  cardTitle:    16,
  body:         13,
  small:        11,
  caption:      10,
};

// Layout constants (LAYOUT_16x9 = 10" × 5.625")
const SLIDE_W   = 10;
const SLIDE_H   = 5.625;
const MARGIN     = 0.6;
const CONTENT_W  = SLIDE_W - 2 * MARGIN;
const CONTENT_X  = MARGIN;

// ============================================================
// HELPERS
// ============================================================
async function createGradient(w, h, c1, c2, direction = 'vertical') {
  const ch = 3;
  const pixels = Buffer.alloc(w * h * ch);
  const parse = s => [parseInt(s.slice(0,2),16), parseInt(s.slice(2,4),16), parseInt(s.slice(4,6),16)];
  const [r1,g1,b1] = parse(c1);
  const [r2,g2,b2] = parse(c2);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = direction === 'vertical' ? y/h : direction === 'horizontal' ? x/w : (x/w + y/h) / 2;
      const idx = (y * w + x) * ch;
      pixels[idx]   = Math.round(r1 + (r2-r1)*t);
      pixels[idx+1] = Math.round(g1 + (g2-g1)*t);
      pixels[idx+2] = Math.round(b1 + (b2-b1)*t);
    }
  }
  const buf = await sharp(pixels, { raw: { width: w, height: h, channels: ch } }).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

const makeShadow = (o = {}) => ({
  type: "outer", blur: o.blur||4, offset: o.offset||1,
  color: o.color||"000000", opacity: o.opacity||0.08, angle: o.angle||135,
});

function addCard(slide, pres, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || COLORS.cardFill },
    line: { color: opts.border || COLORS.cardBorder, width: opts.lineWidth || 1 },
    shadow: makeShadow({ blur: 3, offset: 1, opacity: 0.06 }),
  });
}

function addLine(slide, pres, x, y, w, opts = {}) {
  slide.addShape(pres.shapes.LINE, {
    x, y, w, h: 0,
    line: { color: opts.color || COLORS.thinLine, width: opts.width || 0.75, dashType: opts.dash || 'solid' },
  });
}

function addSlideTitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: MARGIN, y: 0.35, w: CONTENT_W, h: 0.55,
    fontSize: opts.size || SIZES.slideTitle,
    fontFace: FONTS.title,
    color: opts.color || COLORS.titleText,
    bold: true, margin: 0,
  });
}

function addPageNum(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: SLIDE_W - 1.5, y: SLIDE_H - 0.4, w: 1, h: 0.3,
    fontSize: 9, fontFace: FONTS.body, color: COLORS.mutedText, align: 'right', margin: 0,
  });
}

function addCircleNum(slide, pres, x, y, size, num, opts = {}) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color: opts.fill || COLORS.lavender },
    line: { color: opts.border || COLORS.purple, width: 1.5 },
  });
  slide.addText(String(num), {
    x, y, w: size, h: size,
    fontSize: opts.fontSize || 14, fontFace: FONTS.title,
    color: opts.textColor || COLORS.deepPurple,
    bold: true, align: 'center', valign: 'middle', margin: 0,
  });
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'Agentic SE Playbook';
  pres.title  = 'Agentic Software Engineering Playbook';

  const TOTAL = 13;

  // Pre-render gradient backgrounds
  const coverBg      = await createGradient(1920, 1080, '1A0F40', '3D2580', 'diagonal');
  const contentBg    = await createGradient(1920, 1080, 'FFFFFF', 'F3EFF9', 'vertical');
  const altContentBg = await createGradient(1920, 1080, 'F8F5FC', 'EDE5F7', 'vertical');

  // ─────────── SLIDE 1: COVER ───────────
  {
    const s = pres.addSlide();
    s.background = { data: coverBg };

    addLine(s, pres, 0.6, 0.5, 2.5, { color: COLORS.lightPurple, width: 1 });

    s.addText('PLAYBOOK', {
      x: 0.6, y: 0.65, w: 3, h: 0.35,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.lightPurple, charSpacing: 6, margin: 0,
    });

    s.addText('Agentic Software\nEngineering Playbook', {
      x: 0.6, y: 1.2, w: 7, h: 1.6,
      fontSize: 40, fontFace: FONTS.title, color: COLORS.whiteText, bold: true, margin: 0,
    });

    s.addText("From OpenAI's Internal Transformation", {
      x: 0.6, y: 2.9, w: 7, h: 0.45,
      fontSize: 18, fontFace: FONTS.body, color: COLORS.lightPurple, margin: 0,
    });

    addLine(s, pres, 0.6, 3.55, 4, { color: COLORS.purple, width: 0.75 });

    s.addText([
      { text: '"Software development is undergoing a renaissance\nin front of our eyes."', options: { italic: true, breakLine: true } },
      { text: '\n— Greg Brockman, OpenAI Co-founder', options: { fontSize: 11, color: COLORS.mutedText } },
    ], {
      x: 0.6, y: 3.8, w: 7, h: 1,
      fontSize: 14, fontFace: FONTS.body, color: COLORS.lavender, margin: 0,
    });

    s.addText('For Engineering Teams, Tech Leads, CTOs  |  February 2026', {
      x: 0.6, y: SLIDE_H - 0.55, w: 6, h: 0.3,
      fontSize: 10, fontFace: FONTS.body, color: COLORS.mutedText, margin: 0,
    });
  }

  // ─────────── SLIDE 2: DECEMBER 2025 INFLECTION ───────────
  {
    const s = pres.addSlide();
    s.background = { data: contentBg };
    addSlideTitle(s, 'The December 2025 Inflection Point');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 2, TOTAL);

    const cardY = 1.15, cardH = 1.65, cardW = 4.2, gap = 0.4;

    // Before card
    addCard(s, pres, MARGIN, cardY, cardW, cardH);
    s.addText('Before December 2025', {
      x: MARGIN+0.2, y: cardY+0.1, w: cardW-0.4, h: 0.35,
      fontSize: 14, fontFace: FONTS.body, color: COLORS.mutedText, bold: true, margin: 0,
    });
    s.addText([
      { text: 'Codex for unit tests only', options: { bullet: true, breakLine: true } },
      { text: 'Limited to simple tasks', options: { bullet: true, breakLine: true } },
      { text: 'Experimental tool', options: { bullet: true } },
    ], {
      x: MARGIN+0.2, y: cardY+0.5, w: cardW-0.4, h: 1.05,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 4,
    });

    // After card
    const afterX = MARGIN + cardW + gap;
    addCard(s, pres, afterX, cardY, cardW, cardH, { border: COLORS.purple });
    s.addText('After December 2025', {
      x: afterX+0.2, y: cardY+0.1, w: cardW-0.4, h: 0.35,
      fontSize: 14, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText([
      { text: 'Codex writes essentially all code', options: { bullet: true, breakLine: true, bold: true } },
      { text: 'Handles operations and debugging', options: { bullet: true, breakLine: true, bold: true } },
      { text: 'Primary development interface', options: { bullet: true, bold: true } },
    ], {
      x: afterX+0.2, y: cardY+0.5, w: cardW-0.4, h: 1.05,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, margin: 0, paraSpaceAfter: 4,
    });

    // Real-World Proof
    const proofY = 3.05;
    s.addText('Real-World Proof', {
      x: MARGIN, y: proofY, w: 3, h: 0.35,
      fontSize: 16, fontFace: FONTS.title, color: COLORS.titleText, bold: true, margin: 0,
    });

    const statY = proofY + 0.45;

    addCard(s, pres, MARGIN, statY, cardW, 1.1, { fill: COLORS.nearWhite });
    s.addText('Sora Android App', {
      x: MARGIN+0.2, y: statY+0.1, w: cardW-0.4, h: 0.3,
      fontSize: 13, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('4 engineers  ·  18 days  ·  vs 3-6 months traditional', {
      x: MARGIN+0.2, y: statY+0.45, w: cardW-0.4, h: 0.25,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });
    s.addText('~10x faster', {
      x: MARGIN+0.2, y: statY+0.75, w: cardW-0.4, h: 0.25,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: 0,
    });

    addCard(s, pres, afterX, statY, cardW, 1.1, { fill: COLORS.nearWhite });
    s.addText('C Compiler (100K lines)', {
      x: afterX+0.2, y: statY+0.1, w: cardW-0.4, h: 0.3,
      fontSize: 13, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('16 parallel agents  ·  ~2,000 sessions  ·  $20K API cost', {
      x: afterX+0.2, y: statY+0.45, w: cardW-0.4, h: 0.25,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });
    s.addText('Compiles Linux 6.9 kernel', {
      x: afterX+0.2, y: statY+0.75, w: cardW-0.4, h: 0.25,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: 0,
    });

    s.addText('Catalyst: GPT-5.2-Codex — long-horizon work, large code changes, leading SWE-Bench Pro', {
      x: MARGIN, y: 4.85, w: CONTENT_W, h: 0.25,
      fontSize: 10, fontFace: FONTS.body, color: COLORS.mutedText, italic: true, margin: 0,
    });
  }

  // ─────────── SLIDE 3: ADOPTION METRICS ───────────
  {
    const s = pres.addSlide();
    s.background = { data: contentBg };
    addSlideTitle(s, 'The Scale of Change');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 3, TOTAL);

    const statW = 2.7, statH = 2.2, statY = 1.3, gap = 0.25;
    const totalW = statW*3 + gap*2;
    const startX = (SLIDE_W - totalW) / 2;
    const stats = [
      { num: '1M+', label: 'Developers\nusing Codex', sub: 'and growing' },
      { num: '2x',  label: 'Usage growth\nsince GPT-5.2', sub: 'nearly doubled' },
      { num: '20x', label: 'Growth since\nAugust 2025', sub: 'explosive adoption' },
    ];

    stats.forEach((st, i) => {
      const x = startX + i * (statW + gap);
      addCard(s, pres, x, statY, statW, statH, { border: i === 2 ? COLORS.purple : COLORS.cardBorder });

      s.addText(st.num, {
        x, y: statY+0.2, w: statW, h: 0.85,
        fontSize: 48, fontFace: FONTS.title, color: COLORS.deepPurple,
        bold: true, align: 'center', valign: 'middle', margin: 0,
      });
      s.addText(st.label, {
        x, y: statY+1.1, w: statW, h: 0.6,
        fontSize: 13, fontFace: FONTS.body, color: COLORS.bodyText, align: 'center', valign: 'top', margin: 0,
      });
      s.addText(st.sub, {
        x, y: statY+1.7, w: statW, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.mutedText, italic: true, align: 'center', margin: 0,
      });
    });

    addLine(s, pres, MARGIN+1, 3.85, CONTENT_W-2, { color: COLORS.thinLine, dash: 'dash' });

    s.addText('Enterprise Customers', {
      x: MARGIN, y: 4.1, w: CONTENT_W, h: 0.3,
      fontSize: 14, fontFace: FONTS.body, color: COLORS.titleText, bold: true, align: 'center', margin: 0,
    });
    s.addText('Cisco  ·  Ramp  ·  Virgin Atlantic  ·  Vanta  ·  Duolingo  ·  Gap', {
      x: MARGIN, y: 4.45, w: CONTENT_W, h: 0.3,
      fontSize: 13, fontFace: FONTS.body, color: COLORS.bodyText, align: 'center', margin: 0,
    });
  }

  // ─────────── SLIDE 4: MARCH 31 MANDATE ───────────
  {
    const s = pres.addSlide();
    s.background = { data: altContentBg };
    addSlideTitle(s, 'The March 31, 2026 Mandate');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 4, TOTAL);

    s.addText("OpenAI's Organizational Targets", {
      x: MARGIN, y: 0.95, w: CONTENT_W, h: 0.3,
      fontSize: 13, fontFace: FONTS.body, color: COLORS.mutedText, italic: true, margin: 0,
    });

    const goalW = CONTENT_W, goalH = 1.05;

    // Goal 1
    const g1Y = 1.4;
    addCard(s, pres, MARGIN, g1Y, goalW, goalH);
    s.addShape(pres.shapes.RECTANGLE, {
      x: MARGIN, y: g1Y, w: 0.06, h: goalH, fill: { color: COLORS.purple },
    });
    s.addText('Goal 1: Tool of First Resort', {
      x: MARGIN+0.25, y: g1Y+0.1, w: goalW-0.5, h: 0.3,
      fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('For any technical task, humans interact with an agent rather than using an editor or terminal.', {
      x: MARGIN+0.25, y: g1Y+0.5, w: goalW-0.5, h: 0.4,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });

    // Goal 2
    const g2Y = g1Y + goalH + 0.25;
    addCard(s, pres, MARGIN, g2Y, goalW, goalH);
    s.addShape(pres.shapes.RECTANGLE, {
      x: MARGIN, y: g2Y, w: 0.06, h: goalH, fill: { color: COLORS.purple },
    });
    s.addText('Goal 2: Safe & Productive Default', {
      x: MARGIN+0.25, y: g2Y+0.1, w: goalW-0.5, h: 0.3,
      fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText("Agent utilization is explicitly evaluated as safe, but also productive enough that most workflows don't need additional permissions.", {
      x: MARGIN+0.25, y: g2Y+0.5, w: goalW-0.5, h: 0.4,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });

    // Why March 31
    const whyY = g2Y + goalH + 0.35;
    s.addText('Why March 31?', {
      x: MARGIN, y: whyY, w: 3, h: 0.35,
      fontSize: 16, fontFace: FONTS.title, color: COLORS.titleText, bold: true, margin: 0,
    });
    s.addText([
      { text: 'Top-down organizational transformation', options: { bullet: true, breakLine: true } },
      { text: 'Not aspirational — operational deadline', options: { bullet: true, breakLine: true } },
      { text: 'Drives cultural change, not just tool adoption', options: { bullet: true } },
    ], {
      x: MARGIN+0.1, y: whyY+0.35, w: CONTENT_W-0.2, h: 0.9,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 4,
    });
  }

  // ─────────── SLIDE 5: TRADITIONAL VS AGENTIC ───────────
  {
    const s = pres.addSlide();
    s.background = { data: contentBg };
    addSlideTitle(s, 'Traditional vs Agentic Engineering');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 5, TOTAL);

    const tableY = 1.15, rowH = 0.42, labelW = 1.8, colW = 3.5, tableX = MARGIN;
    const rows = [
      ['First Action',    'Open IDE, write code',       'Prompt agent with intent'],
      ['Code Production', 'Human writes line-by-line',  'Agent generates, human reviews'],
      ['Debugging',       'Manual trace, breakpoint',   'Agent diagnoses and fixes'],
      ['Testing',         'Write tests after code',     'Agent writes tests first'],
      ['Documentation',   'Write docs after shipping',  'Spec-driven development'],
      ['Knowledge',       'Code comments, wiki',        'AGENTS.md + Skills'],
      ['Tool Usage',      'Click UI, manual steps',     'Agent invokes via CLI/MCP'],
      ['Speed',           'Hours/days per feature',     'Minutes with feedback loops'],
    ];

    // Headers
    s.addText('Dimension', {
      x: tableX, y: tableY, w: labelW, h: rowH,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.mutedText, bold: true, margin: 0, valign: 'middle',
    });
    s.addText('Traditional', {
      x: tableX+labelW, y: tableY, w: colW, h: rowH,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.mutedText, bold: true, margin: [0,0,0,8], valign: 'middle',
    });
    s.addText('Agentic', {
      x: tableX+labelW+colW, y: tableY, w: colW, h: rowH,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: [0,0,0,8], valign: 'middle',
    });

    addLine(s, pres, tableX, tableY+rowH, CONTENT_W, { color: COLORS.lightPurple, width: 1 });

    rows.forEach((row, i) => {
      const y = tableY + rowH + (i * rowH) + 0.05;
      if (i % 2 === 0) {
        s.addShape(pres.shapes.RECTANGLE, {
          x: tableX, y, w: CONTENT_W, h: rowH, fill: { color: COLORS.nearWhite },
        });
      }
      s.addText(row[0], {
        x: tableX+0.1, y, w: labelW-0.1, h: rowH,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, valign: 'middle', margin: 0,
      });
      s.addText(row[1], {
        x: tableX+labelW, y, w: colW, h: rowH,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, valign: 'middle', margin: [0,0,0,8],
      });
      s.addText(row[2], {
        x: tableX+labelW+colW, y, w: colW, h: rowH,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, valign: 'middle', margin: [0,0,0,8],
      });
    });

    // Vertical divider
    s.addShape(pres.shapes.LINE, {
      x: tableX+labelW+colW, y: tableY, w: 0, h: rowH*9 + 0.05,
      line: { color: COLORS.lightPurple, width: 0.5 },
    });
  }

  // ─────────── SLIDE 6: 6-PILLAR OVERVIEW ───────────
  {
    const s = pres.addSlide();
    s.background = { data: contentBg };
    addSlideTitle(s, 'The 6-Pillar Playbook');
    s.addText("OpenAI's Implementation Framework", {
      x: MARGIN, y: 0.65, w: CONTENT_W, h: 0.25,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.mutedText, italic: true, margin: 0,
    });
    addLine(s, pres, MARGIN, 0.95, CONTENT_W);
    addPageNum(s, 6, TOTAL);

    const pillars = [
      { num: '1', title: 'Adoption',       desc: 'Try the tools — designate\n"Agents Captain" per team' },
      { num: '2', title: 'AGENTS.md',      desc: 'Create machine-readable\nproject handbook' },
      { num: '3', title: 'Tools',          desc: 'Make internal tools\nagent-accessible (CLI/MCP)' },
      { num: '4', title: 'Architecture',   desc: 'Restructure codebases for\nagent-first development' },
      { num: '5', title: 'Quality',        desc: '"Say no to slop" —\nmaintain review bar' },
      { num: '6', title: 'Infrastructure', desc: 'Build observability,\ntrajectory tracking' },
    ];

    const cols = 3, cW = 2.7, cH = 1.65, gx = 0.25, gy = 0.25;
    const gridW = cols*cW + (cols-1)*gx;
    const gridX = (SLIDE_W - gridW) / 2;
    const gridY = 1.2;

    pillars.forEach((p, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = gridX + col*(cW+gx), y = gridY + row*(cH+gy);
      addCard(s, pres, x, y, cW, cH);
      addCircleNum(s, pres, x+0.15, y+0.15, 0.4, p.num);
      s.addText(p.title, {
        x: x+0.65, y: y+0.15, w: cW-0.85, h: 0.35,
        fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle',
      });
      s.addText(p.desc, {
        x: x+0.2, y: y+0.65, w: cW-0.4, h: 0.85,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
      });
    });
  }

  // ─────────── SLIDE 7: PILLAR 1-2 ───────────
  {
    const s = pres.addSlide();
    s.background = { data: altContentBg };
    addSlideTitle(s, 'Pillar 1-2: Adoption & Knowledge');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 7, TOTAL);

    const halfW = (CONTENT_W - 0.4) / 2;
    const lx = MARGIN, rx = MARGIN + halfW + 0.4, sy = 1.1;

    // LEFT: Cultural Adoption
    addCircleNum(s, pres, lx, sy, 0.35, '1', { fontSize: 12 });
    s.addText('Cultural Adoption', {
      x: lx+0.45, y: sy, w: halfW-0.5, h: 0.35,
      fontSize: 16, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle',
    });

    const challenges = [
      ['Engineers "too busy"',  '"Agents Captain" role per team'],
      ['Uncertainty',           'Shared internal channels'],
      ['Lack of exposure',      'Company-wide Codex hackathon'],
    ];
    challenges.forEach((c, i) => {
      const y = sy + 0.5 + i*0.7;
      addCard(s, pres, lx, y, halfW, 0.6);
      s.addText(c[0], {
        x: lx+0.15, y: y+0.05, w: halfW-0.3, h: 0.25,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.mutedText, margin: 0,
      });
      s.addText(c[1], {
        x: lx+0.15, y: y+0.3, w: halfW-0.3, h: 0.25,
        fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
      });
    });
    s.addText('"The tools do sell themselves."', {
      x: lx, y: sy+2.7, w: halfW, h: 0.3,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.purple, italic: true, margin: 0,
    });

    // RIGHT: AGENTS.md
    addCircleNum(s, pres, rx, sy, 0.35, '2', { fontSize: 12 });
    s.addText('AGENTS.md & Skills', {
      x: rx+0.45, y: sy, w: halfW-0.5, h: 0.35,
      fontSize: 16, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle',
    });

    addCard(s, pres, rx, sy+0.5, halfW, 1.8, { fill: COLORS.nearWhite });
    s.addText([
      { text: 'project-root/',               options: { breakLine: true, bold: true, color: COLORS.deepPurple } },
      { text: '\u251C\u2500\u2500 AGENTS.md', options: { breakLine: true, color: COLORS.purple } },
      { text: '\u2502   Project context, conventions', options: { breakLine: true, color: COLORS.mutedText, fontSize: 10 } },
      { text: '\u251C\u2500\u2500 skills/',   options: { breakLine: true, color: COLORS.purple } },
      { text: '\u2502   deploy.sh, test-suite.yml',   options: { breakLine: true, color: COLORS.mutedText, fontSize: 10 } },
      { text: '\u2514\u2500\u2500 src/',      options: { color: COLORS.purple } },
    ], {
      x: rx+0.2, y: sy+0.6, w: halfW-0.4, h: 1.6,
      fontSize: 11, fontFace: FONTS.mono, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 2,
    });

    s.addText('Industry Convergence', {
      x: rx, y: sy+2.45, w: halfW, h: 0.25,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('AGENTS.md (OpenAI, Google) · CLAUDE.md (Anthropic)\ncopilot-instructions.md (GitHub)', {
      x: rx, y: sy+2.7, w: halfW, h: 0.4,
      fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });

    // Divider
    s.addShape(pres.shapes.LINE, {
      x: MARGIN+halfW+0.2, y: sy, w: 0, h: 3.2,
      line: { color: COLORS.thinLine, width: 0.75, dashType: 'dash' },
    });
  }

  // ─────────── SLIDE 8: PILLAR 3-4 ───────────
  {
    const s = pres.addSlide();
    s.background = { data: contentBg };
    addSlideTitle(s, 'Pillar 3-4: Tools & Architecture');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 8, TOTAL);

    const halfW = (CONTENT_W - 0.4) / 2;
    const lx = MARGIN, rx = MARGIN+halfW+0.4, sy = 1.1;

    // LEFT: Tools
    addCircleNum(s, pres, lx, sy, 0.35, '3', { fontSize: 12 });
    s.addText('Agent-Accessible Tooling', {
      x: lx+0.45, y: sy, w: halfW-0.5, h: 0.35,
      fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle',
    });

    const toolActions = [
      ['Audit tools',       'Catalog team dependencies'],
      ['Enable access',     'CLI wrappers or MCP servers'],
      ['Assign ownership',  'One person per tool integration'],
    ];
    toolActions.forEach((t, i) => {
      const y = sy + 0.55 + i*0.65;
      addCard(s, pres, lx, y, halfW, 0.55);
      s.addText(t[0], {
        x: lx+0.15, y: y+0.05, w: halfW*0.4, h: 0.45,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: 0, valign: 'middle',
      });
      s.addText(t[1], {
        x: lx+halfW*0.42, y: y+0.05, w: halfW*0.55, h: 0.45,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0, valign: 'middle',
      });
    });

    addCard(s, pres, lx, sy+2.6, halfW, 0.55, { border: COLORS.purple, fill: COLORS.lavender });
    s.addText('MCP (Model Context Protocol)', {
      x: lx+0.15, y: sy+2.65, w: halfW-0.3, h: 0.2,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('Emerging standard for agent-tool connections', {
      x: lx+0.15, y: sy+2.88, w: halfW-0.3, h: 0.2,
      fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });

    // RIGHT: Architecture
    addCircleNum(s, pres, rx, sy, 0.35, '4', { fontSize: 12 });
    s.addText('Agent-First Codebase', {
      x: rx+0.45, y: sy, w: halfW-0.5, h: 0.35,
      fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle',
    });

    const principles = [
      ['Fast tests',        'Agents iterate by running\ntests repeatedly'],
      ['Clean interfaces',  'Agents reason about one\ncomponent at a time'],
      ['Strong types',      'Compiler acts as\ncorrectness checker'],
      ['Clear boundaries',  'Agents work on\nisolated components'],
    ];
    principles.forEach((p, i) => {
      const y = sy + 0.55 + i*0.7;
      addCard(s, pres, rx, y, halfW, 0.6);
      s.addShape(pres.shapes.RECTANGLE, {
        x: rx, y, w: 0.05, h: 0.6, fill: { color: COLORS.purple },
      });
      s.addText(p[0], {
        x: rx+0.2, y: y+0.05, w: halfW-0.35, h: 0.22,
        fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
      });
      s.addText(p[1], {
        x: rx+0.2, y: y+0.28, w: halfW-0.35, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
      });
    });

    s.addShape(pres.shapes.LINE, {
      x: MARGIN+halfW+0.2, y: sy, w: 0, h: 3.3,
      line: { color: COLORS.thinLine, width: 0.75, dashType: 'dash' },
    });
  }

  // ─────────── SLIDE 9: PILLAR 5-6 ───────────
  {
    const s = pres.addSlide();
    s.background = { data: altContentBg };
    addSlideTitle(s, 'Pillar 5-6: Quality & Infrastructure');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 9, TOTAL);

    const halfW = (CONTENT_W - 0.4) / 2;
    const lx = MARGIN, rx = MARGIN+halfW+0.4, sy = 1.1;

    // LEFT: Quality
    addCircleNum(s, pres, lx, sy, 0.35, '5', { fontSize: 12 });
    s.addText('"Say No to Slop"', {
      x: lx+0.45, y: sy, w: halfW-0.5, h: 0.35,
      fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle',
    });

    const rules = [
      ['Human accountability',  'Someone accountable for\nall merged code'],
      ['Same review bar',       'Maintain standard for\nagent-generated code'],
      ['Author comprehension',  'No "vibe merging" —\nunderstand what you submit'],
    ];
    rules.forEach((r, i) => {
      const y = sy + 0.55 + i*0.7;
      addCard(s, pres, lx, y, halfW, 0.6);
      s.addShape(pres.shapes.RECTANGLE, {
        x: lx, y, w: 0.05, h: 0.6, fill: { color: COLORS.purple },
      });
      s.addText(r[0], {
        x: lx+0.2, y: y+0.05, w: halfW-0.35, h: 0.22,
        fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
      });
      s.addText(r[1], {
        x: lx+0.2, y: y+0.28, w: halfW-0.35, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
      });
    });

    addCard(s, pres, lx, sy+2.75, halfW, 0.6, { fill: COLORS.nearWhite, border: COLORS.purple });
    s.addText('The "Slop" Problem', {
      x: lx+0.15, y: sy+2.8, w: halfW-0.3, h: 0.2,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: 0,
    });
    s.addText('Functionally correct but poorly maintainable — passes tests but introduces technical debt.', {
      x: lx+0.15, y: sy+3.05, w: halfW-0.3, h: 0.25,
      fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, italic: true, margin: 0,
    });

    // RIGHT: Infrastructure
    addCircleNum(s, pres, rx, sy, 0.35, '6', { fontSize: 12 });
    s.addText('Infrastructure for Agents', {
      x: rx+0.45, y: sy, w: halfW-0.5, h: 0.35,
      fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle',
    });

    const infra = [
      ['Observability',         'Monitor agent performance\nand success rates'],
      ['Trajectory tracking',   'Capture reasoning path,\nnot just output'],
      ['Tool management',       'Governance over agent\ntool access'],
      ['Feedback loops',        'Internal usage data\ndrives improvements'],
    ];
    infra.forEach((item, i) => {
      const y = sy + 0.55 + i*0.7;
      addCard(s, pres, rx, y, halfW, 0.6);
      s.addText(item[0], {
        x: rx+0.15, y: y+0.05, w: halfW-0.3, h: 0.22,
        fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
      });
      s.addText(item[1], {
        x: rx+0.15, y: y+0.28, w: halfW-0.3, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
      });
    });

    s.addShape(pres.shapes.LINE, {
      x: MARGIN+halfW+0.2, y: sy, w: 0, h: 3.5,
      line: { color: COLORS.thinLine, width: 0.75, dashType: 'dash' },
    });
  }

  // ─────────── SLIDE 10: EVOLVING ENGINEER ROLE ───────────
  {
    const s = pres.addSlide();
    s.background = { data: contentBg };
    addSlideTitle(s, 'The Evolving Engineer Role');
    s.addText('From Writer to Orchestrator', {
      x: MARGIN, y: 0.65, w: CONTENT_W, h: 0.25,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.mutedText, italic: true, margin: 0,
    });
    addLine(s, pres, MARGIN, 0.95, CONTENT_W);
    addPageNum(s, 10, TOTAL);

    const colW = 4.0, lx = MARGIN, rx2 = MARGIN+colW+0.8;
    const rowY = 1.15, rowH = 0.35;

    s.addText('Old Focus', {
      x: lx, y: rowY, w: colW, h: rowH,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.mutedText, bold: true, margin: [0,0,0,8],
    });
    s.addText('New Focus', {
      x: rx2, y: rowY, w: colW, h: rowH,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: [0,0,0,8],
    });
    addLine(s, pres, lx, rowY+rowH, CONTENT_W, { color: COLORS.lightPurple });

    const roles = [
      ['Writing implementation code',  'Designing agent-implementable systems'],
      ['Manual coding',                'Writing specifications for agents'],
      ['Debugging line-by-line',       'Reviewing and curating agent output'],
      ['Ad-hoc knowledge sharing',     'Maintaining AGENTS.md & skills'],
      ['Single-threaded work',         'Orchestrating multiple agents'],
      ['Low-level coding',             'Higher-order design & communication'],
    ];

    roles.forEach((r, i) => {
      const y = rowY + rowH + 0.05 + i*rowH;
      if (i % 2 === 0) {
        s.addShape(pres.shapes.RECTANGLE, {
          x: lx, y, w: CONTENT_W, h: rowH, fill: { color: COLORS.nearWhite },
        });
      }
      s.addText(r[0], {
        x: lx, y, w: colW, h: rowH,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: [0,0,0,8], valign: 'middle',
      });
      s.addText('\u2192', {
        x: lx+colW, y, w: 0.8, h: rowH,
        fontSize: 14, fontFace: FONTS.body, color: COLORS.purple, align: 'center', valign: 'middle', margin: 0,
      });
      s.addText(r[1], {
        x: rx2, y, w: colW, h: rowH,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: [0,0,0,8], valign: 'middle',
      });
    });

    // Spec-Driven Development
    const specY = 3.7;
    addLine(s, pres, MARGIN, specY-0.1, CONTENT_W, { color: COLORS.thinLine, dash: 'dash' });
    s.addText('Spec-Driven Development', {
      x: MARGIN, y: specY, w: 3, h: 0.35,
      fontSize: 15, fontFace: FONTS.title, color: COLORS.titleText, bold: true, margin: 0,
    });

    const steps = ['Engineer writes\nSpecification', 'Agent\nImplements', 'Spec = Instruction +\nAcceptance Criteria'];
    const stepW = 2.5, stepH = 0.8, fGap = 0.3;
    const fTotal = stepW*3 + fGap*2;
    const fX = (SLIDE_W - fTotal) / 2;
    const fY = specY + 0.4;

    steps.forEach((st, i) => {
      const x = fX + i*(stepW+fGap);
      addCard(s, pres, x, fY, stepW, stepH, { border: i===1 ? COLORS.purple : COLORS.cardBorder });
      s.addText(st, {
        x, y: fY, w: stepW, h: stepH,
        fontSize: 11, fontFace: FONTS.body, color: i===1 ? COLORS.deepPurple : COLORS.bodyText,
        bold: i===1, align: 'center', valign: 'middle', margin: 4,
      });
      if (i < 2) {
        s.addText('\u2192', {
          x: x+stepW, y: fY, w: fGap, h: stepH,
          fontSize: 18, fontFace: FONTS.body, color: COLORS.purple, align: 'center', valign: 'middle', margin: 0,
        });
      }
    });
  }

  // ─────────── SLIDE 11: IMPLEMENTATION ROADMAP ───────────
  {
    const s = pres.addSlide();
    s.background = { data: altContentBg };
    addSlideTitle(s, 'Implementation Roadmap');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 11, TOTAL);

    const phases = [
      { title: 'Phase 1', period: 'Weeks 1\u20132', subtitle: 'Foundation', items: [
        'Designate "Agents Captain"', 'Schedule Codex hackathon', 'Create initial AGENTS.md', 'Audit tooling accessibility',
      ]},
      { title: 'Phase 2', period: 'Weeks 3\u20134', subtitle: 'Infrastructure', items: [
        'Set up skills repository', 'Create MCP servers (top 5)', 'Establish review guidelines', 'Set up agent observability',
      ]},
      { title: 'Phase 3', period: 'Weeks 5\u20138', subtitle: 'Optimization', items: [
        'Optimize tests (<30s target)', 'Refine AGENTS.md from failures', 'Build skills library', 'Define quality metrics',
      ]},
      { title: 'Phase 4', period: 'Ongoing', subtitle: 'Scale', items: [
        'Regular AGENTS.md reviews', 'Continuous skills development', 'Infrastructure improvements',
      ]},
    ];

    const pW = 2.05, pH = 3.3, pGap = 0.15;
    const tW = phases.length*pW + (phases.length-1)*pGap;
    const sX = (SLIDE_W - tW) / 2;
    const pY = 1.15;

    phases.forEach((p, i) => {
      const x = sX + i*(pW+pGap);
      addCard(s, pres, x, pY, pW, pH, { border: i===0 ? COLORS.purple : COLORS.cardBorder });

      s.addShape(pres.shapes.RECTANGLE, {
        x: x+0.02, y: pY+0.02, w: pW-0.04, h: 0.7,
        fill: { color: i===0 ? COLORS.lavender : COLORS.nearWhite },
      });
      s.addText(p.title, {
        x, y: pY+0.05, w: pW, h: 0.3,
        fontSize: 14, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, align: 'center', margin: 0,
      });
      s.addText(p.period, {
        x, y: pY+0.35, w: pW, h: 0.25,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.mutedText, align: 'center', margin: 0,
      });
      s.addText(p.subtitle, {
        x, y: pY+0.8, w: pW, h: 0.3,
        fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, bold: true, align: 'center', margin: 0,
      });

      const itemTexts = p.items.map((item, j) => ({
        text: item, options: { bullet: true, breakLine: j < p.items.length-1 },
      }));
      s.addText(itemTexts, {
        x: x+0.12, y: pY+1.15, w: pW-0.24, h: 2.0,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 6,
      });

      if (i < phases.length-1) {
        s.addText('\u203A', {
          x: x+pW, y: pY+0.1, w: pGap, h: 0.6,
          fontSize: 20, fontFace: FONTS.body, color: COLORS.lightPurple, align: 'center', valign: 'middle', margin: 0,
        });
      }
    });
  }

  // ─────────── SLIDE 12: KEY TAKEAWAYS & RISKS ───────────
  {
    const s = pres.addSlide();
    s.background = { data: contentBg };
    addSlideTitle(s, 'Key Takeaways & Open Risks');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 12, TOTAL);

    const halfW = (CONTENT_W - 0.4) / 2;
    const lx = MARGIN, rx = MARGIN+halfW+0.4, sy = 1.1;

    // Takeaways
    s.addText('Key Takeaways', {
      x: lx, y: sy, w: halfW, h: 0.35,
      fontSize: 16, fontFace: FONTS.title, color: COLORS.titleText, bold: true, margin: 0,
    });
    const takeaways = [
      'Organizational transformation,\nnot tool adoption',
      'Architect role becomes\nmore critical',
      'AGENTS.md is the new README',
      '"Say no to slop" is the\nhardest pillar',
      'Agent infrastructure is a\ngreenfield opportunity',
      'Navigate deliberately \u2014\ntransition is inevitable',
    ];
    takeaways.forEach((t, i) => {
      const y = sy + 0.45 + i*0.55;
      s.addText(String(i+1), {
        x: lx, y, w: 0.3, h: 0.45,
        fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: 0, valign: 'top',
      });
      s.addText(t, {
        x: lx+0.35, y, w: halfW-0.4, h: 0.5,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
      });
    });

    // Risks
    s.addText('Open Risks', {
      x: rx, y: sy, w: halfW, h: 0.35,
      fontSize: 16, fontFace: FONTS.title, color: COLORS.titleText, bold: true, margin: 0,
    });
    const risks = [
      { risk: 'Code ownership',  mitigation: 'Rigorous review,\nnot rubber-stamping' },
      { risk: 'Technical debt',  mitigation: 'New metrics for\nAI-generated drift' },
      { risk: 'Security',        mitigation: '"Safe but productive"\nbalance' },
      { risk: 'Skill atrophy',   mitigation: 'Maintain deep understanding\nfor review' },
    ];
    risks.forEach((r, i) => {
      const y = sy + 0.5 + i*0.75;
      addCard(s, pres, rx, y, halfW, 0.65);
      s.addShape(pres.shapes.RECTANGLE, {
        x: rx, y, w: 0.05, h: 0.65, fill: { color: COLORS.purple },
      });
      s.addText(r.risk, {
        x: rx+0.2, y: y+0.05, w: halfW-0.35, h: 0.22,
        fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
      });
      s.addText(r.mitigation, {
        x: rx+0.2, y: y+0.28, w: halfW-0.35, h: 0.35,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
      });
    });

    s.addShape(pres.shapes.LINE, {
      x: MARGIN+halfW+0.2, y: sy, w: 0, h: 3.7,
      line: { color: COLORS.thinLine, width: 0.75, dashType: 'dash' },
    });
  }

  // ─────────── SLIDE 13: APPENDIX ───────────
  {
    const s = pres.addSlide();
    s.background = { data: altContentBg };
    addSlideTitle(s, 'Appendix: Language-Specific Notes');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 13, TOTAL);

    const languages = [
      { name: 'Rust', items: [
        { text: 'Type system = built-in correctness verification', type: 'pro' },
        { text: 'unsafe blocks need explicit AGENTS.md policy', type: 'warn' },
        { text: 'Build times may slow agent iteration', type: 'warn' },
      ]},
      { name: 'C / C++', items: [
        { text: 'Less safety guardrails \u2192 more prescriptive AGENTS.md', type: 'warn' },
        { text: 'Memory management conventions must be explicit', type: 'warn' },
      ]},
      { name: 'Python', items: [
        { text: 'Large training corpus = agents perform well', type: 'pro' },
        { text: 'Mandate type hints and mypy in AGENTS.md', type: 'warn' },
      ]},
    ];

    const lW = 2.75, lH = 2.8, lGap = 0.25;
    const tLW = languages.length*lW + (languages.length-1)*lGap;
    const lSX = (SLIDE_W - tLW) / 2;
    const lY = 1.2;

    languages.forEach((lang, i) => {
      const x = lSX + i*(lW+lGap);
      addCard(s, pres, x, lY, lW, lH);

      s.addShape(pres.shapes.RECTANGLE, {
        x: x+0.02, y: lY+0.02, w: lW-0.04, h: 0.55,
        fill: { color: COLORS.lavender },
      });
      s.addText(lang.name, {
        x, y: lY+0.05, w: lW, h: 0.5,
        fontSize: 18, fontFace: FONTS.title, color: COLORS.deepPurple, bold: true, align: 'center', valign: 'middle', margin: 0,
      });

      lang.items.forEach((item, j) => {
        const iy = lY + 0.7 + j*0.65;
        const prefix = item.type === 'pro' ? '\u2713' : '\u26A0';
        const pColor = item.type === 'pro' ? '2D8659' : 'B8860B';
        s.addText(prefix, {
          x: x+0.15, y: iy, w: 0.25, h: 0.25,
          fontSize: 13, fontFace: FONTS.body, color: pColor, bold: true, margin: 0,
        });
        s.addText(item.text, {
          x: x+0.4, y: iy, w: lW-0.55, h: 0.55,
          fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
        });
      });
    });

    s.addText("Source: Greg Brockman's public post on OpenAI's internal agentic transformation  |  Compiled: February 2026", {
      x: MARGIN, y: SLIDE_H-0.5, w: CONTENT_W, h: 0.3,
      fontSize: 9, fontFace: FONTS.body, color: COLORS.mutedText, align: 'center', margin: 0,
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const outputPath = '/Users/yuechen/home/cc-ppt/Agentic_SE_Playbook.pptx';
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation saved to: ${outputPath}`);
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
