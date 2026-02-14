const { GoogleGenAI } = require("@google/genai");
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ============================================================
// CONFIG — Easy to restyle
// ============================================================
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash-exp-image-generation";
const IMG_DIR = path.join(__dirname, "slides-art");

const COLORS = {
  deepPurple: '2D1B69', mediumPurple: '4A2C82', purple: '7B5EA7',
  lightPurple: 'C4B5D9', lavender: 'E8DFF5', paleLavender: 'F3EFF9',
  nearWhite: 'F8F5FC', white: 'FFFFFF',
  titleText: '2D1B69', darkText: '2D2040', bodyText: '3D3252',
  mutedText: '8E7BAF', whiteText: 'FFFFFF',
  cardBorder: 'C4B5D9', cardFill: 'FFFFFF', thinLine: 'D4C8E8',
};

const FONTS = { title: 'Georgia', body: 'Calibri', mono: 'Consolas' };
const SLIDE_W = 10, SLIDE_H = 5.625, MARGIN = 0.6;
const CONTENT_W = SLIDE_W - 2 * MARGIN;

// ============================================================
// GEMINI IMAGE GENERATION
// ============================================================
const ai = new GoogleGenAI({ apiKey: API_KEY });

const STYLE_PREFIX = `Minimalist wireframe-sketch illustration for a presentation slide background.
Style rules:
- Thin single-weight mono-line art (like an architect's pencil sketch)
- Colors ONLY: soft purple (#9B7BC7, #D4C8E8) lines on a clean white-to-pale-lavender (#F8F5FC → #EDE5F7) gradient background
- Hand-drawn/notebook aesthetic — slightly organic lines, not perfectly straight
- ABSOLUTELY NO TEXT, no words, no letters, no numbers, no labels, no captions
- 16:9 landscape aspect ratio (1920×1080)
- Generous negative space — sketches occupy edges and corners, leaving center-left area open for text overlay
- Very subtle, background-appropriate — not too detailed or busy
`;

const SLIDE_PROMPTS = [
  // 1: Cover
  `${STYLE_PREFIX}
Dark variant: use deep purple (#1A0F40 → #3D2580) gradient background instead of white.
Subject: Abstract constellation of connected nodes and flowing circuit-like paths, suggesting an AI agent network. Nodes are small circles connected by thin curved lines. Some geometric shapes (hexagons, diamonds) scattered subtly. A few nodes glow slightly brighter. The network flows from bottom-left toward top-right. Keep upper-left area completely empty.`,

  // 2: December 2025 Inflection
  `${STYLE_PREFIX}
Subject: A minimalist timeline curve that starts flat on the left, then curves sharply upward (inflection point) on the right side of the image. Small milestone dots along the curve. A few tiny gear and code-bracket sketches near the inflection point. Subtle grid lines in the background. Keep left 60% mostly empty.`,

  // 3: Adoption Metrics
  `${STYLE_PREFIX}
Subject: Three ascending bar chart columns sketched in thin purple lines, each taller than the last, positioned on the right side. Small upward arrows floating near the tops. A few scatter dots suggesting growth trajectory. Very minimal. Keep left half empty.`,

  // 4: March 31 Mandate
  `${STYLE_PREFIX}
Subject: A minimalist target/bullseye with two concentric circles in the right portion. A calendar page sketch in the corner. Two thin arrows converging toward the center of the target. Subtle compass-like directional lines. Clean and geometric.`,

  // 5: Traditional vs Agentic
  `${STYLE_PREFIX}
Subject: Split composition with a thin vertical dashed line in the center. Left side: rigid rectangular grid boxes stacked formally (representing traditional workflow). Right side: organic flowing connected nodes and curved paths (representing agentic workflow). Both sides sketched in the same thin purple line style. Position everything in the lower portion, leaving top area for text.`,

  // 6: 6-Pillar Overview
  `${STYLE_PREFIX}
Subject: Six thin classical columns/pillars sketched in a row, with slight perspective. Each pillar has a small unique symbol at its base (barely visible). Thin arching lines connect the tops of the pillars. Positioned in the lower-right area. Very architectural and minimal.`,

  // 7: Pillar 1-2
  `${STYLE_PREFIX}
Subject: Two vignettes side by side in the bottom portion. Left: a small group of 3-4 stick-figure people with raised hands (team adoption). Right: an open document/book with a tree-diagram branching out of it (AGENTS.md knowledge). Both sketched minimally in thin purple lines. Leave top 60% empty.`,

  // 8: Pillar 3-4
  `${STYLE_PREFIX}
Subject: Two vignettes in the bottom portion. Left: interconnecting tools — a wrench, a plug connecting to a socket, thin API connector lines. Right: modular building blocks / architectural floor plan with clean interfaces between modules. Thin purple line sketches. Leave top 60% empty.`,

  // 9: Pillar 5-6
  `${STYLE_PREFIX}
Subject: Two vignettes in the bottom portion. Left: a shield with a checkmark inside, representing quality and review. Right: a simple dashboard outline with monitoring waveforms/lines, representing infrastructure observability. Thin wireframe sketches in purple. Leave top 60% empty.`,

  // 10: Evolving Engineer Role
  `${STYLE_PREFIX}
Subject: A transformation/metamorphosis sketch — on the left side a single desk with a keyboard (old role), flowing curved arrows and lines transitioning toward the right side showing a conductor's podium with multiple branching paths going to smaller workstations (orchestrator role). Thin purple lines. Position in the lower-right area.`,

  // 11: Implementation Roadmap
  `${STYLE_PREFIX}
Subject: A winding path/road sketched from left to right with four milestone marker flags along the journey. The path starts wide and structured on the left, becomes more flowing and expansive toward the right. Small decorative dots and dashes along the path edges. Positioned in the lower portion of the image. Very minimal.`,

  // 12: Key Takeaways & Risks
  `${STYLE_PREFIX}
Subject: Left side: a simple lightbulb outline sketch (insights/takeaways). Right side: a small warning triangle outline with subtle exclamation mark (risks). Both connected by a thin dotted line. Positioned in the bottom corners. Very subtle and minimal.`,

  // 13: Appendix
  `${STYLE_PREFIX}
Subject: Three code bracket pairs { } sketched in thin purple lines, each with a slightly different style — one angular (Rust), one classic (C), one rounded (Python). Arranged horizontally in the lower portion. Small decorative circuit-like lines connecting them. Very minimal.`,
];

async function generateSlideImage(prompt, slideNum) {
  const outFile = path.join(IMG_DIR, `slide-${String(slideNum).padStart(2, '0')}.png`);

  // Use cached image if exists
  if (fs.existsSync(outFile)) {
    console.log(`  [slide ${slideNum}] Using cached image`);
    return outFile;
  }

  console.log(`  [slide ${slideNum}] Generating with Gemini...`);

  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      });

      // Extract image data from response
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(outFile, buf);
          console.log(`  [slide ${slideNum}] Saved (${(buf.length/1024).toFixed(0)}KB)`);
          return outFile;
        }
      }
      throw new Error("No image data in response");
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        const waitSec = 60 * (attempt + 1);
        console.log(`  [slide ${slideNum}] Rate limited, waiting ${waitSec}s (attempt ${attempt+1}/${MAX_RETRIES})...`);
        await new Promise(r => setTimeout(r, waitSec * 1000));
      } else {
        console.error(`  [slide ${slideNum}] Error: ${msg.slice(0, 200)}`);
        return null;
      }
    }
  }
  console.error(`  [slide ${slideNum}] Failed after ${MAX_RETRIES} retries`);
  return null;
}

async function generateAllImages() {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const results = [];

  for (let i = 0; i < SLIDE_PROMPTS.length; i++) {
    const result = await generateSlideImage(SLIDE_PROMPTS[i], i + 1);
    results.push(result);
    // Rate limiting delay
    if (i < SLIDE_PROMPTS.length - 1) {
      await new Promise(r => setTimeout(r, 2500));
    }
  }
  return results;
}

// ============================================================
// PPTX HELPERS (same as before, but simplified)
// ============================================================
const makeShadow = (o = {}) => ({
  type: "outer", blur: o.blur||4, offset: o.offset||1,
  color: o.color||"000000", opacity: o.opacity||0.08, angle: o.angle||135,
});

function addCard(s, pres, x, y, w, h, opts = {}) {
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || COLORS.cardFill, transparency: opts.fillTransparency || 0 },
    line: { color: opts.border || COLORS.cardBorder, width: opts.lineWidth || 1 },
    shadow: makeShadow({ blur: 3, offset: 1, opacity: 0.06 }),
  });
}

function addLine(s, pres, x, y, w, opts = {}) {
  s.addShape(pres.shapes.LINE, {
    x, y, w, h: 0,
    line: { color: opts.color || COLORS.thinLine, width: opts.width || 0.75, dashType: opts.dash || 'solid' },
  });
}

function addTitle(s, text, opts = {}) {
  s.addText(text, {
    x: MARGIN, y: 0.35, w: CONTENT_W, h: 0.55,
    fontSize: opts.size || 32, fontFace: FONTS.title,
    color: opts.color || COLORS.titleText, bold: true, margin: 0,
  });
}

function addPageNum(s, n, total) {
  s.addText(`${n} / ${total}`, {
    x: SLIDE_W-1.5, y: SLIDE_H-0.4, w: 1, h: 0.3,
    fontSize: 9, fontFace: FONTS.body, color: COLORS.mutedText, align: 'right', margin: 0,
  });
}

function addCircleNum(s, pres, x, y, size, num, opts = {}) {
  s.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color: opts.fill || COLORS.lavender },
    line: { color: opts.border || COLORS.purple, width: 1.5 },
  });
  s.addText(String(num), {
    x, y, w: size, h: size,
    fontSize: opts.fontSize || 14, fontFace: FONTS.title,
    color: opts.textColor || COLORS.deepPurple,
    bold: true, align: 'center', valign: 'middle', margin: 0,
  });
}

// ============================================================
// BUILD PPTX
// ============================================================
async function buildPptx(images) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'Agentic SE Playbook';
  pres.title = 'Agentic Software Engineering Playbook';
  const TOTAL = 13;

  // Helper: set slide background from generated image or fallback
  function setBg(s, idx) {
    if (images[idx]) {
      s.background = { path: images[idx] };
    } else {
      s.background = { color: idx === 0 ? COLORS.deepPurple : COLORS.nearWhite };
    }
  }

  // ─────────── SLIDE 1: COVER ───────────
  {
    const s = pres.addSlide();
    setBg(s, 0);

    addLine(s, pres, 0.6, 0.5, 2.5, { color: COLORS.purple, width: 1 });
    s.addText('PLAYBOOK', {
      x: 0.6, y: 0.65, w: 3, h: 0.35,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, charSpacing: 6, margin: 0,
    });
    s.addText('Agentic Software\nEngineering Playbook', {
      x: 0.6, y: 1.2, w: 6, h: 1.6,
      fontSize: 40, fontFace: FONTS.title, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText("From OpenAI's Internal Transformation", {
      x: 0.6, y: 2.9, w: 6, h: 0.45,
      fontSize: 18, fontFace: FONTS.body, color: COLORS.mediumPurple, margin: 0,
    });
    addLine(s, pres, 0.6, 3.55, 3.5, { color: COLORS.purple, width: 0.75 });
    s.addText([
      { text: '"Software development is undergoing a renaissance\nin front of our eyes."', options: { italic: true, breakLine: true } },
      { text: '\n\u2014 Greg Brockman, OpenAI Co-founder', options: { fontSize: 11, color: COLORS.mutedText } },
    ], {
      x: 0.6, y: 3.8, w: 6, h: 1, fontSize: 14, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });
    s.addText('For Engineering Teams, Tech Leads, CTOs  |  February 2026', {
      x: 0.6, y: SLIDE_H-0.55, w: 5, h: 0.3,
      fontSize: 10, fontFace: FONTS.body, color: COLORS.mutedText, margin: 0,
    });
  }

  // ─────────── SLIDE 2: DECEMBER 2025 ───────────
  {
    const s = pres.addSlide();
    setBg(s, 1);
    addTitle(s, 'The December 2025 Inflection Point');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 2, TOTAL);

    const cY = 1.15, cH = 1.65, cW = 4.2, gap = 0.4;
    const aX = MARGIN + cW + gap;

    // Before
    addCard(s, pres, MARGIN, cY, cW, cH);
    s.addText('Before December 2025', {
      x: MARGIN+0.2, y: cY+0.1, w: cW-0.4, h: 0.35,
      fontSize: 14, fontFace: FONTS.body, color: COLORS.mutedText, bold: true, margin: 0,
    });
    s.addText([
      { text: 'Codex for unit tests only', options: { bullet: true, breakLine: true } },
      { text: 'Limited to simple tasks', options: { bullet: true, breakLine: true } },
      { text: 'Experimental tool', options: { bullet: true } },
    ], {
      x: MARGIN+0.2, y: cY+0.5, w: cW-0.4, h: 1.05,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 4,
    });

    // After
    addCard(s, pres, aX, cY, cW, cH, { border: COLORS.purple });
    s.addText('After December 2025', {
      x: aX+0.2, y: cY+0.1, w: cW-0.4, h: 0.35,
      fontSize: 14, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText([
      { text: 'Codex writes essentially all code', options: { bullet: true, breakLine: true, bold: true } },
      { text: 'Handles operations and debugging', options: { bullet: true, breakLine: true, bold: true } },
      { text: 'Primary development interface', options: { bullet: true, bold: true } },
    ], {
      x: aX+0.2, y: cY+0.5, w: cW-0.4, h: 1.05,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, margin: 0, paraSpaceAfter: 4,
    });

    // Real-World Proof
    const pY = 3.05, stY = pY+0.45;
    s.addText('Real-World Proof', {
      x: MARGIN, y: pY, w: 3, h: 0.35,
      fontSize: 16, fontFace: FONTS.title, color: COLORS.titleText, bold: true, margin: 0,
    });

    addCard(s, pres, MARGIN, stY, cW, 1.1, { fill: COLORS.nearWhite });
    s.addText('Sora Android App', {
      x: MARGIN+0.2, y: stY+0.1, w: cW-0.4, h: 0.3,
      fontSize: 13, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('4 engineers \u00B7 18 days \u00B7 vs 3-6 months traditional', {
      x: MARGIN+0.2, y: stY+0.45, w: cW-0.4, h: 0.25,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });
    s.addText('~10x faster', {
      x: MARGIN+0.2, y: stY+0.75, w: cW-0.4, h: 0.25,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: 0,
    });

    addCard(s, pres, aX, stY, cW, 1.1, { fill: COLORS.nearWhite });
    s.addText('C Compiler (100K lines)', {
      x: aX+0.2, y: stY+0.1, w: cW-0.4, h: 0.3,
      fontSize: 13, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('16 parallel agents \u00B7 ~2,000 sessions \u00B7 $20K API cost', {
      x: aX+0.2, y: stY+0.45, w: cW-0.4, h: 0.25,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });
    s.addText('Compiles Linux 6.9 kernel', {
      x: aX+0.2, y: stY+0.75, w: cW-0.4, h: 0.25,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: 0,
    });

    s.addText('Catalyst: GPT-5.2-Codex \u2014 long-horizon work, large code changes, leading SWE-Bench Pro', {
      x: MARGIN, y: 4.85, w: CONTENT_W, h: 0.25,
      fontSize: 10, fontFace: FONTS.body, color: COLORS.mutedText, italic: true, margin: 0,
    });
  }

  // ─────────── SLIDE 3: ADOPTION METRICS ───────────
  {
    const s = pres.addSlide();
    setBg(s, 2);
    addTitle(s, 'The Scale of Change');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 3, TOTAL);

    const stW = 2.7, stH = 2.2, stY = 1.3, gap = 0.25;
    const totW = stW*3 + gap*2;
    const sX = (SLIDE_W - totW) / 2;
    const stats = [
      { num: '1M+', label: 'Developers\nusing Codex', sub: 'and growing' },
      { num: '2x',  label: 'Usage growth\nsince GPT-5.2', sub: 'nearly doubled' },
      { num: '20x', label: 'Growth since\nAugust 2025', sub: 'explosive adoption' },
    ];

    stats.forEach((st, i) => {
      const x = sX + i*(stW+gap);
      addCard(s, pres, x, stY, stW, stH, { border: i===2 ? COLORS.purple : COLORS.cardBorder });
      s.addText(st.num, {
        x, y: stY+0.2, w: stW, h: 0.85,
        fontSize: 48, fontFace: FONTS.title, color: COLORS.deepPurple,
        bold: true, align: 'center', valign: 'middle', margin: 0,
      });
      s.addText(st.label, {
        x, y: stY+1.1, w: stW, h: 0.6,
        fontSize: 13, fontFace: FONTS.body, color: COLORS.bodyText, align: 'center', valign: 'top', margin: 0,
      });
      s.addText(st.sub, {
        x, y: stY+1.7, w: stW, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.mutedText, italic: true, align: 'center', margin: 0,
      });
    });

    addLine(s, pres, MARGIN+1, 3.85, CONTENT_W-2, { color: COLORS.thinLine, dash: 'dash' });
    s.addText('Enterprise Customers', {
      x: MARGIN, y: 4.1, w: CONTENT_W, h: 0.3,
      fontSize: 14, fontFace: FONTS.body, color: COLORS.titleText, bold: true, align: 'center', margin: 0,
    });
    s.addText('Cisco \u00B7 Ramp \u00B7 Virgin Atlantic \u00B7 Vanta \u00B7 Duolingo \u00B7 Gap', {
      x: MARGIN, y: 4.45, w: CONTENT_W, h: 0.3,
      fontSize: 13, fontFace: FONTS.body, color: COLORS.bodyText, align: 'center', margin: 0,
    });
  }

  // ─────────── SLIDE 4: MARCH 31 MANDATE ───────────
  {
    const s = pres.addSlide();
    setBg(s, 3);
    addTitle(s, 'The March 31, 2026 Mandate');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 4, TOTAL);

    s.addText("OpenAI's Organizational Targets", {
      x: MARGIN, y: 0.95, w: CONTENT_W, h: 0.3,
      fontSize: 13, fontFace: FONTS.body, color: COLORS.mutedText, italic: true, margin: 0,
    });

    const gW = CONTENT_W, gH = 1.05;
    const g1Y = 1.4;
    addCard(s, pres, MARGIN, g1Y, gW, gH);
    s.addShape(pres.shapes.RECTANGLE, { x: MARGIN, y: g1Y, w: 0.06, h: gH, fill: { color: COLORS.purple } });
    s.addText('Goal 1: Tool of First Resort', {
      x: MARGIN+0.25, y: g1Y+0.1, w: gW-0.5, h: 0.3,
      fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText('For any technical task, humans interact with an agent rather than using an editor or terminal.', {
      x: MARGIN+0.25, y: g1Y+0.5, w: gW-0.5, h: 0.4,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });

    const g2Y = g1Y+gH+0.25;
    addCard(s, pres, MARGIN, g2Y, gW, gH);
    s.addShape(pres.shapes.RECTANGLE, { x: MARGIN, y: g2Y, w: 0.06, h: gH, fill: { color: COLORS.purple } });
    s.addText('Goal 2: Safe & Productive Default', {
      x: MARGIN+0.25, y: g2Y+0.1, w: gW-0.5, h: 0.3,
      fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0,
    });
    s.addText("Agent utilization is explicitly evaluated as safe, but also productive enough that most workflows don't need additional permissions.", {
      x: MARGIN+0.25, y: g2Y+0.5, w: gW-0.5, h: 0.4,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });

    const wY = g2Y+gH+0.35;
    s.addText('Why March 31?', {
      x: MARGIN, y: wY, w: 3, h: 0.35,
      fontSize: 16, fontFace: FONTS.title, color: COLORS.titleText, bold: true, margin: 0,
    });
    s.addText([
      { text: 'Top-down organizational transformation', options: { bullet: true, breakLine: true } },
      { text: 'Not aspirational \u2014 operational deadline', options: { bullet: true, breakLine: true } },
      { text: 'Drives cultural change, not just tool adoption', options: { bullet: true } },
    ], {
      x: MARGIN+0.1, y: wY+0.35, w: CONTENT_W-0.2, h: 0.9,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 4,
    });
  }

  // ─────────── SLIDE 5: TRADITIONAL VS AGENTIC ───────────
  {
    const s = pres.addSlide();
    setBg(s, 4);
    addTitle(s, 'Traditional vs Agentic Engineering');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 5, TOTAL);

    const tY = 1.15, rH = 0.42, lW = 1.8, cW2 = 3.5, tX = MARGIN;
    const rows = [
      ['First Action','Open IDE, write code','Prompt agent with intent'],
      ['Code Production','Human writes line-by-line','Agent generates, human reviews'],
      ['Debugging','Manual trace, breakpoint','Agent diagnoses and fixes'],
      ['Testing','Write tests after code','Agent writes tests first'],
      ['Documentation','Write docs after shipping','Spec-driven development'],
      ['Knowledge','Code comments, wiki','AGENTS.md + Skills'],
      ['Tool Usage','Click UI, manual steps','Agent invokes via CLI/MCP'],
      ['Speed','Hours/days per feature','Minutes with feedback loops'],
    ];

    s.addText('Dimension', { x: tX, y: tY, w: lW, h: rH, fontSize: 11, fontFace: FONTS.body, color: COLORS.mutedText, bold: true, margin: 0, valign: 'middle' });
    s.addText('Traditional', { x: tX+lW, y: tY, w: cW2, h: rH, fontSize: 11, fontFace: FONTS.body, color: COLORS.mutedText, bold: true, margin: [0,0,0,8], valign: 'middle' });
    s.addText('Agentic', { x: tX+lW+cW2, y: tY, w: cW2, h: rH, fontSize: 11, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: [0,0,0,8], valign: 'middle' });

    addLine(s, pres, tX, tY+rH, CONTENT_W, { color: COLORS.lightPurple, width: 1 });

    rows.forEach((r, i) => {
      const y = tY + rH + i*rH + 0.05;
      if (i%2===0) s.addShape(pres.shapes.RECTANGLE, { x: tX, y, w: CONTENT_W, h: rH, fill: { color: COLORS.nearWhite } });
      s.addText(r[0], { x: tX+0.1, y, w: lW-0.1, h: rH, fontSize: 11, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, valign: 'middle', margin: 0 });
      s.addText(r[1], { x: tX+lW, y, w: cW2, h: rH, fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, valign: 'middle', margin: [0,0,0,8] });
      s.addText(r[2], { x: tX+lW+cW2, y, w: cW2, h: rH, fontSize: 11, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, valign: 'middle', margin: [0,0,0,8] });
    });

    s.addShape(pres.shapes.LINE, { x: tX+lW+cW2, y: tY, w: 0, h: rH*9+0.05, line: { color: COLORS.lightPurple, width: 0.5 } });
  }

  // ─────────── SLIDE 6: 6-PILLAR OVERVIEW ───────────
  {
    const s = pres.addSlide();
    setBg(s, 5);
    addTitle(s, 'The 6-Pillar Playbook');
    s.addText("OpenAI's Implementation Framework", {
      x: MARGIN, y: 0.65, w: CONTENT_W, h: 0.25,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.mutedText, italic: true, margin: 0,
    });
    addLine(s, pres, MARGIN, 0.95, CONTENT_W);
    addPageNum(s, 6, TOTAL);

    const pillars = [
      { n:'1', t:'Adoption', d:'Try the tools \u2014 designate\n"Agents Captain" per team' },
      { n:'2', t:'AGENTS.md', d:'Create machine-readable\nproject handbook' },
      { n:'3', t:'Tools', d:'Make internal tools\nagent-accessible (CLI/MCP)' },
      { n:'4', t:'Architecture', d:'Restructure codebases for\nagent-first development' },
      { n:'5', t:'Quality', d:'"Say no to slop" \u2014\nmaintain review bar' },
      { n:'6', t:'Infrastructure', d:'Build observability,\ntrajectory tracking' },
    ];
    const cols=3, cW3=2.7, cH=1.65, gx=0.25, gy=0.25;
    const gridW=cols*cW3+(cols-1)*gx, gridX=(SLIDE_W-gridW)/2, gridY=1.2;

    pillars.forEach((p,i) => {
      const col=i%cols, row=Math.floor(i/cols);
      const x=gridX+col*(cW3+gx), y=gridY+row*(cH+gy);
      addCard(s, pres, x, y, cW3, cH);
      addCircleNum(s, pres, x+0.15, y+0.15, 0.4, p.n);
      s.addText(p.t, { x: x+0.65, y: y+0.15, w: cW3-0.85, h: 0.35, fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });
      s.addText(p.d, { x: x+0.2, y: y+0.65, w: cW3-0.4, h: 0.85, fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0 });
    });
  }

  // ─────────── SLIDE 7: PILLAR 1-2 ───────────
  {
    const s = pres.addSlide();
    setBg(s, 6);
    addTitle(s, 'Pillar 1-2: Adoption & Knowledge');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 7, TOTAL);

    const hW = (CONTENT_W-0.4)/2, lx=MARGIN, rx=MARGIN+hW+0.4, sy=1.1;

    addCircleNum(s, pres, lx, sy, 0.35, '1', { fontSize: 12 });
    s.addText('Cultural Adoption', { x: lx+0.45, y: sy, w: hW-0.5, h: 0.35, fontSize: 16, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    [['Engineers "too busy"','"Agents Captain" role per team'],['Uncertainty','Shared internal channels'],['Lack of exposure','Company-wide Codex hackathon']].forEach((c,i) => {
      const y = sy+0.5+i*0.7;
      addCard(s, pres, lx, y, hW, 0.6);
      s.addText(c[0], { x: lx+0.15, y: y+0.05, w: hW-0.3, h: 0.25, fontSize: 11, fontFace: FONTS.body, color: COLORS.mutedText, margin: 0 });
      s.addText(c[1], { x: lx+0.15, y: y+0.3, w: hW-0.3, h: 0.25, fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0 });
    });
    s.addText('"The tools do sell themselves."', { x: lx, y: sy+2.7, w: hW, h: 0.3, fontSize: 11, fontFace: FONTS.body, color: COLORS.purple, italic: true, margin: 0 });

    addCircleNum(s, pres, rx, sy, 0.35, '2', { fontSize: 12 });
    s.addText('AGENTS.md & Skills', { x: rx+0.45, y: sy, w: hW-0.5, h: 0.35, fontSize: 16, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    addCard(s, pres, rx, sy+0.5, hW, 1.8, { fill: COLORS.nearWhite });
    s.addText([
      { text: 'project-root/', options: { breakLine: true, bold: true, color: COLORS.deepPurple } },
      { text: '\u251C\u2500\u2500 AGENTS.md', options: { breakLine: true, color: COLORS.purple } },
      { text: '\u2502   Project context, conventions', options: { breakLine: true, color: COLORS.mutedText, fontSize: 10 } },
      { text: '\u251C\u2500\u2500 skills/', options: { breakLine: true, color: COLORS.purple } },
      { text: '\u2502   deploy.sh, test-suite.yml', options: { breakLine: true, color: COLORS.mutedText, fontSize: 10 } },
      { text: '\u2514\u2500\u2500 src/', options: { color: COLORS.purple } },
    ], { x: rx+0.2, y: sy+0.6, w: hW-0.4, h: 1.6, fontSize: 11, fontFace: FONTS.mono, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 2 });

    s.addText('Industry Convergence', { x: rx, y: sy+2.45, w: hW, h: 0.25, fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0 });
    s.addText('AGENTS.md (OpenAI, Google) \u00B7 CLAUDE.md (Anthropic)\ncopilot-instructions.md (GitHub)', {
      x: rx, y: sy+2.7, w: hW, h: 0.4, fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0,
    });

    s.addShape(pres.shapes.LINE, { x: MARGIN+hW+0.2, y: sy, w: 0, h: 3.2, line: { color: COLORS.thinLine, width: 0.75, dashType: 'dash' } });
  }

  // ─────────── SLIDE 8: PILLAR 3-4 ───────────
  {
    const s = pres.addSlide();
    setBg(s, 7);
    addTitle(s, 'Pillar 3-4: Tools & Architecture');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 8, TOTAL);

    const hW = (CONTENT_W-0.4)/2, lx=MARGIN, rx=MARGIN+hW+0.4, sy=1.1;

    addCircleNum(s, pres, lx, sy, 0.35, '3', { fontSize: 12 });
    s.addText('Agent-Accessible Tooling', { x: lx+0.45, y: sy, w: hW-0.5, h: 0.35, fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    [['Audit tools','Catalog team dependencies'],['Enable access','CLI wrappers or MCP servers'],['Assign ownership','One person per tool integration']].forEach((t,i) => {
      const y = sy+0.55+i*0.65;
      addCard(s, pres, lx, y, hW, 0.55);
      s.addText(t[0], { x: lx+0.15, y: y+0.05, w: hW*0.4, h: 0.45, fontSize: 11, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: 0, valign: 'middle' });
      s.addText(t[1], { x: lx+hW*0.42, y: y+0.05, w: hW*0.55, h: 0.45, fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0, valign: 'middle' });
    });

    addCard(s, pres, lx, sy+2.6, hW, 0.55, { border: COLORS.purple, fill: COLORS.lavender });
    s.addText('MCP (Model Context Protocol)', { x: lx+0.15, y: sy+2.65, w: hW-0.3, h: 0.2, fontSize: 11, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0 });
    s.addText('Emerging standard for agent-tool connections', { x: lx+0.15, y: sy+2.88, w: hW-0.3, h: 0.2, fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0 });

    addCircleNum(s, pres, rx, sy, 0.35, '4', { fontSize: 12 });
    s.addText('Agent-First Codebase', { x: rx+0.45, y: sy, w: hW-0.5, h: 0.35, fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    [['Fast tests','Agents iterate by running\ntests repeatedly'],['Clean interfaces','Agents reason about one\ncomponent at a time'],['Strong types','Compiler acts as\ncorrectness checker'],['Clear boundaries','Agents work on\nisolated components']].forEach((p,i) => {
      const y = sy+0.55+i*0.7;
      addCard(s, pres, rx, y, hW, 0.6);
      s.addShape(pres.shapes.RECTANGLE, { x: rx, y, w: 0.05, h: 0.6, fill: { color: COLORS.purple } });
      s.addText(p[0], { x: rx+0.2, y: y+0.05, w: hW-0.35, h: 0.22, fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0 });
      s.addText(p[1], { x: rx+0.2, y: y+0.28, w: hW-0.35, h: 0.3, fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0 });
    });

    s.addShape(pres.shapes.LINE, { x: MARGIN+hW+0.2, y: sy, w: 0, h: 3.3, line: { color: COLORS.thinLine, width: 0.75, dashType: 'dash' } });
  }

  // ─────────── SLIDE 9: PILLAR 5-6 ───────────
  {
    const s = pres.addSlide();
    setBg(s, 8);
    addTitle(s, 'Pillar 5-6: Quality & Infrastructure');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 9, TOTAL);

    const hW = (CONTENT_W-0.4)/2, lx=MARGIN, rx=MARGIN+hW+0.4, sy=1.1;

    addCircleNum(s, pres, lx, sy, 0.35, '5', { fontSize: 12 });
    s.addText('"Say No to Slop"', { x: lx+0.45, y: sy, w: hW-0.5, h: 0.35, fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    [['Human accountability','Someone accountable for\nall merged code'],['Same review bar','Maintain standard for\nagent-generated code'],['Author comprehension','No "vibe merging" \u2014\nunderstand what you submit']].forEach((r,i) => {
      const y = sy+0.55+i*0.7;
      addCard(s, pres, lx, y, hW, 0.6);
      s.addShape(pres.shapes.RECTANGLE, { x: lx, y, w: 0.05, h: 0.6, fill: { color: COLORS.purple } });
      s.addText(r[0], { x: lx+0.2, y: y+0.05, w: hW-0.35, h: 0.22, fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0 });
      s.addText(r[1], { x: lx+0.2, y: y+0.28, w: hW-0.35, h: 0.3, fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0 });
    });

    addCard(s, pres, lx, sy+2.75, hW, 0.6, { fill: COLORS.nearWhite, border: COLORS.purple });
    s.addText('The "Slop" Problem', { x: lx+0.15, y: sy+2.8, w: hW-0.3, h: 0.2, fontSize: 11, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: 0 });
    s.addText('Functionally correct but poorly maintainable \u2014 passes tests but introduces technical debt.', {
      x: lx+0.15, y: sy+3.05, w: hW-0.3, h: 0.25, fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, italic: true, margin: 0,
    });

    addCircleNum(s, pres, rx, sy, 0.35, '6', { fontSize: 12 });
    s.addText('Infrastructure for Agents', { x: rx+0.45, y: sy, w: hW-0.5, h: 0.35, fontSize: 15, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0, valign: 'middle' });

    [['Observability','Monitor agent performance\nand success rates'],['Trajectory tracking','Capture reasoning path,\nnot just output'],['Tool management','Governance over agent\ntool access'],['Feedback loops','Internal usage data\ndrives improvements']].forEach((item,i) => {
      const y = sy+0.55+i*0.7;
      addCard(s, pres, rx, y, hW, 0.6);
      s.addText(item[0], { x: rx+0.15, y: y+0.05, w: hW-0.3, h: 0.22, fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0 });
      s.addText(item[1], { x: rx+0.15, y: y+0.28, w: hW-0.3, h: 0.3, fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0 });
    });

    s.addShape(pres.shapes.LINE, { x: MARGIN+hW+0.2, y: sy, w: 0, h: 3.5, line: { color: COLORS.thinLine, width: 0.75, dashType: 'dash' } });
  }

  // ─────────── SLIDE 10: EVOLVING ROLE ───────────
  {
    const s = pres.addSlide();
    setBg(s, 9);
    addTitle(s, 'The Evolving Engineer Role');
    s.addText('From Writer to Orchestrator', {
      x: MARGIN, y: 0.65, w: CONTENT_W, h: 0.25,
      fontSize: 12, fontFace: FONTS.body, color: COLORS.mutedText, italic: true, margin: 0,
    });
    addLine(s, pres, MARGIN, 0.95, CONTENT_W);
    addPageNum(s, 10, TOTAL);

    const cW4=4.0, lx2=MARGIN, rx2=MARGIN+cW4+0.8;
    const rY=1.15, rH=0.35;
    s.addText('Old Focus', { x: lx2, y: rY, w: cW4, h: rH, fontSize: 12, fontFace: FONTS.body, color: COLORS.mutedText, bold: true, margin: [0,0,0,8] });
    s.addText('New Focus', { x: rx2, y: rY, w: cW4, h: rH, fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: [0,0,0,8] });
    addLine(s, pres, lx2, rY+rH, CONTENT_W, { color: COLORS.lightPurple });

    const roles = [
      ['Writing implementation code','Designing agent-implementable systems'],
      ['Manual coding','Writing specifications for agents'],
      ['Debugging line-by-line','Reviewing and curating agent output'],
      ['Ad-hoc knowledge sharing','Maintaining AGENTS.md & skills'],
      ['Single-threaded work','Orchestrating multiple agents'],
      ['Low-level coding','Higher-order design & communication'],
    ];
    roles.forEach((r,i) => {
      const y = rY+rH+0.05+i*rH;
      if (i%2===0) s.addShape(pres.shapes.RECTANGLE, { x: lx2, y, w: CONTENT_W, h: rH, fill: { color: COLORS.nearWhite } });
      s.addText(r[0], { x: lx2, y, w: cW4, h: rH, fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: [0,0,0,8], valign: 'middle' });
      s.addText('\u2192', { x: lx2+cW4, y, w: 0.8, h: rH, fontSize: 14, fontFace: FONTS.body, color: COLORS.purple, align: 'center', valign: 'middle', margin: 0 });
      s.addText(r[1], { x: rx2, y, w: cW4, h: rH, fontSize: 11, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: [0,0,0,8], valign: 'middle' });
    });

    const spY = 3.7;
    addLine(s, pres, MARGIN, spY-0.1, CONTENT_W, { color: COLORS.thinLine, dash: 'dash' });
    s.addText('Spec-Driven Development', { x: MARGIN, y: spY, w: 3, h: 0.35, fontSize: 15, fontFace: FONTS.title, color: COLORS.titleText, bold: true, margin: 0 });

    const steps=['Engineer writes\nSpecification','Agent\nImplements','Spec = Instruction +\nAcceptance Criteria'];
    const stW2=2.5, stH2=0.8, fG=0.3;
    const fTot=stW2*3+fG*2, fX=(SLIDE_W-fTot)/2, fY=spY+0.4;
    steps.forEach((st,i) => {
      const x = fX+i*(stW2+fG);
      addCard(s, pres, x, fY, stW2, stH2, { border: i===1 ? COLORS.purple : COLORS.cardBorder });
      s.addText(st, { x, y: fY, w: stW2, h: stH2, fontSize: 11, fontFace: FONTS.body, color: i===1 ? COLORS.deepPurple : COLORS.bodyText, bold: i===1, align: 'center', valign: 'middle', margin: 4 });
      if (i<2) s.addText('\u2192', { x: x+stW2, y: fY, w: fG, h: stH2, fontSize: 18, fontFace: FONTS.body, color: COLORS.purple, align: 'center', valign: 'middle', margin: 0 });
    });
  }

  // ─────────── SLIDE 11: ROADMAP ───────────
  {
    const s = pres.addSlide();
    setBg(s, 10);
    addTitle(s, 'Implementation Roadmap');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 11, TOTAL);

    const phases = [
      { t:'Phase 1', p:'Weeks 1\u20132', sub:'Foundation', items:['Designate "Agents Captain"','Schedule Codex hackathon','Create initial AGENTS.md','Audit tooling accessibility'] },
      { t:'Phase 2', p:'Weeks 3\u20134', sub:'Infrastructure', items:['Set up skills repository','Create MCP servers (top 5)','Establish review guidelines','Set up agent observability'] },
      { t:'Phase 3', p:'Weeks 5\u20138', sub:'Optimization', items:['Optimize tests (<30s target)','Refine AGENTS.md from failures','Build skills library','Define quality metrics'] },
      { t:'Phase 4', p:'Ongoing', sub:'Scale', items:['Regular AGENTS.md reviews','Continuous skills development','Infrastructure improvements'] },
    ];
    const pW2=2.05, pH2=3.3, pG=0.15;
    const tW2=phases.length*pW2+(phases.length-1)*pG;
    const sX2=(SLIDE_W-tW2)/2, pY2=1.15;

    phases.forEach((p,i) => {
      const x=sX2+i*(pW2+pG);
      addCard(s, pres, x, pY2, pW2, pH2, { border: i===0 ? COLORS.purple : COLORS.cardBorder });
      s.addShape(pres.shapes.RECTANGLE, { x: x+0.02, y: pY2+0.02, w: pW2-0.04, h: 0.7, fill: { color: i===0 ? COLORS.lavender : COLORS.nearWhite } });
      s.addText(p.t, { x, y: pY2+0.05, w: pW2, h: 0.3, fontSize: 14, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, align: 'center', margin: 0 });
      s.addText(p.p, { x, y: pY2+0.35, w: pW2, h: 0.25, fontSize: 10, fontFace: FONTS.body, color: COLORS.mutedText, align: 'center', margin: 0 });
      s.addText(p.sub, { x, y: pY2+0.8, w: pW2, h: 0.3, fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, bold: true, align: 'center', margin: 0 });

      const its = p.items.map((item,j) => ({ text: item, options: { bullet: true, breakLine: j<p.items.length-1 } }));
      s.addText(its, { x: x+0.12, y: pY2+1.15, w: pW2-0.24, h: 2.0, fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0, paraSpaceAfter: 6 });

      if (i<phases.length-1) s.addText('\u203A', { x: x+pW2, y: pY2+0.1, w: pG, h: 0.6, fontSize: 20, fontFace: FONTS.body, color: COLORS.lightPurple, align: 'center', valign: 'middle', margin: 0 });
    });
  }

  // ─────────── SLIDE 12: TAKEAWAYS & RISKS ───────────
  {
    const s = pres.addSlide();
    setBg(s, 11);
    addTitle(s, 'Key Takeaways & Open Risks');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 12, TOTAL);

    const hW=(CONTENT_W-0.4)/2, lx=MARGIN, rx=MARGIN+hW+0.4, sy=1.1;

    s.addText('Key Takeaways', { x: lx, y: sy, w: hW, h: 0.35, fontSize: 16, fontFace: FONTS.title, color: COLORS.titleText, bold: true, margin: 0 });
    ['Organizational transformation,\nnot tool adoption','Architect role becomes\nmore critical','AGENTS.md is the new README','"Say no to slop" is the\nhardest pillar','Agent infrastructure is a\ngreenfield opportunity','Navigate deliberately \u2014\ntransition is inevitable'].forEach((t,i) => {
      const y = sy+0.45+i*0.55;
      s.addText(String(i+1), { x: lx, y, w: 0.3, h: 0.45, fontSize: 12, fontFace: FONTS.body, color: COLORS.purple, bold: true, margin: 0, valign: 'top' });
      s.addText(t, { x: lx+0.35, y, w: hW-0.4, h: 0.5, fontSize: 11, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0 });
    });

    s.addText('Open Risks', { x: rx, y: sy, w: hW, h: 0.35, fontSize: 16, fontFace: FONTS.title, color: COLORS.titleText, bold: true, margin: 0 });
    [{r:'Code ownership',m:'Rigorous review,\nnot rubber-stamping'},{r:'Technical debt',m:'New metrics for\nAI-generated drift'},{r:'Security',m:'"Safe but productive"\nbalance'},{r:'Skill atrophy',m:'Maintain deep understanding\nfor review'}].forEach((item,i) => {
      const y = sy+0.5+i*0.75;
      addCard(s, pres, rx, y, hW, 0.65);
      s.addShape(pres.shapes.RECTANGLE, { x: rx, y, w: 0.05, h: 0.65, fill: { color: COLORS.purple } });
      s.addText(item.r, { x: rx+0.2, y: y+0.05, w: hW-0.35, h: 0.22, fontSize: 12, fontFace: FONTS.body, color: COLORS.deepPurple, bold: true, margin: 0 });
      s.addText(item.m, { x: rx+0.2, y: y+0.28, w: hW-0.35, h: 0.35, fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0 });
    });

    s.addShape(pres.shapes.LINE, { x: MARGIN+hW+0.2, y: sy, w: 0, h: 3.7, line: { color: COLORS.thinLine, width: 0.75, dashType: 'dash' } });
  }

  // ─────────── SLIDE 13: APPENDIX ───────────
  {
    const s = pres.addSlide();
    setBg(s, 12);
    addTitle(s, 'Appendix: Language-Specific Notes');
    addLine(s, pres, MARGIN, 0.9, CONTENT_W);
    addPageNum(s, 13, TOTAL);

    const langs = [
      { name:'Rust', items:[{t:'Type system = built-in correctness verification',tp:'pro'},{t:'unsafe blocks need explicit AGENTS.md policy',tp:'warn'},{t:'Build times may slow agent iteration',tp:'warn'}] },
      { name:'C / C++', items:[{t:'Less safety guardrails \u2192 more prescriptive AGENTS.md',tp:'warn'},{t:'Memory management conventions must be explicit',tp:'warn'}] },
      { name:'Python', items:[{t:'Large training corpus = agents perform well',tp:'pro'},{t:'Mandate type hints and mypy in AGENTS.md',tp:'warn'}] },
    ];
    const lW2=2.75, lH=2.8, lG=0.25;
    const tLW=langs.length*lW2+(langs.length-1)*lG, lSX=(SLIDE_W-tLW)/2, lY2=1.2;

    langs.forEach((lang,i) => {
      const x=lSX+i*(lW2+lG);
      addCard(s, pres, x, lY2, lW2, lH);
      s.addShape(pres.shapes.RECTANGLE, { x: x+0.02, y: lY2+0.02, w: lW2-0.04, h: 0.55, fill: { color: COLORS.lavender } });
      s.addText(lang.name, { x, y: lY2+0.05, w: lW2, h: 0.5, fontSize: 18, fontFace: FONTS.title, color: COLORS.deepPurple, bold: true, align: 'center', valign: 'middle', margin: 0 });
      lang.items.forEach((item,j) => {
        const iy = lY2+0.7+j*0.65;
        const pre = item.tp==='pro' ? '\u2713' : '\u26A0';
        const pc = item.tp==='pro' ? '2D8659' : 'B8860B';
        s.addText(pre, { x: x+0.15, y: iy, w: 0.25, h: 0.25, fontSize: 13, fontFace: FONTS.body, color: pc, bold: true, margin: 0 });
        s.addText(item.t, { x: x+0.4, y: iy, w: lW2-0.55, h: 0.55, fontSize: 10, fontFace: FONTS.body, color: COLORS.bodyText, margin: 0 });
      });
    });

    s.addText("Source: Greg Brockman's public post on OpenAI's internal agentic transformation  |  Compiled: February 2026", {
      x: MARGIN, y: SLIDE_H-0.5, w: CONTENT_W, h: 0.3,
      fontSize: 9, fontFace: FONTS.body, color: COLORS.mutedText, align: 'center', margin: 0,
    });
  }

  const outPath = '/Users/yuechen/home/cc-ppt/Agentic_SE_Playbook_Gemini.pptx';
  await pres.writeFile({ fileName: outPath });
  console.log(`\nPresentation saved: ${outPath}`);
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('=== Generating artistic slide backgrounds with Gemini ===\n');
  const images = await generateAllImages();

  const successCount = images.filter(Boolean).length;
  console.log(`\n${successCount}/${images.length} images generated successfully.\n`);

  console.log('=== Building PPTX with Gemini backgrounds ===\n');
  await buildPptx(images);
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
