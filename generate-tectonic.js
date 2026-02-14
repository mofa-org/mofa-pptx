const PptxGenJS = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════════════

const OUTPUT = "Tectonic_Shift_r1.0.pptx";
const WHALE_IMG = "tectonic-assets/whale-sketch.png";

const C = {
  deepPurple:  "2D1B69",
  medPurple:   "4A2C82",
  purple:      "7B5EA7",
  lightPurple: "C4B5D9",
  lavender:    "E8DFF5",
  paleLav:     "F3EFF9",
  nearWhite:   "F8F5FC",
  white:       "FFFFFF",
  // text
  title:   "2D1B69",
  dark:    "2D2040",
  body:    "3D3252",
  muted:   "8E7BAF",
  light:   "C4B5D9",
  wh:      "FFFFFF",
  // ui
  cardBorder: "C4B5D9",
  cardFill:   "FFFFFF",
  thinLine:   "D4C8E8",
  accent:     "7B5EA7",
  coverBg:    "1A0F40",
  // stat accents
  amber:  "D4710A",
  teal:   "3D8B8B",
  coral:  "C75050",
};

const F = { t: "Georgia", b: "Calibri", m: "Consolas", cn: "Microsoft YaHei" };
const SW = 10, SH = 5.625, M = 0.5, CW = SW - 2 * M;
let TOTAL = 30;

// ═══════════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════════

async function createGradient(w, h, c1, c2, dir = "vertical") {
  const ch = 3, pixels = Buffer.alloc(w * h * ch);
  const p = s => [parseInt(s.slice(0,2),16), parseInt(s.slice(2,4),16), parseInt(s.slice(4,6),16)];
  const [r1,g1,b1] = p(c1), [r2,g2,b2] = p(c2);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = dir === "vertical" ? y/h : dir === "horizontal" ? x/w : (x/w + y/h) / 2;
      const i = (y * w + x) * ch;
      pixels[i] = Math.round(r1+(r2-r1)*t);
      pixels[i+1] = Math.round(g1+(g2-g1)*t);
      pixels[i+2] = Math.round(b1+(b2-b1)*t);
    }
  }
  const buf = await sharp(pixels, { raw: { width: w, height: h, channels: ch } }).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

const shadow = () => ({ type:"outer", blur:4, offset:1.5, color:"000000", opacity:0.08, angle:135 });

function addCard(s, _pr, x, y, w, h, opts={}) {
  s.addShape("rect", {
    x, y, w, h,
    fill: { color: opts.fill || C.cardFill },
    line: { color: opts.border || C.cardBorder, width: opts.lineW || 0.75 },
    rectRadius: opts.radius || 0.06,
    shadow: opts.noShadow ? undefined : shadow(),
  });
}

function addLine(s, _pr, x, y, w, opts={}) {
  s.addShape("line", {
    x, y, w, h: 0,
    line: { color: opts.color || C.thinLine, width: opts.width || 0.75, dashType: opts.dash || "solid" },
  });
}

function addAccentBar(s, _pr, x, y, h, color) {
  s.addShape("rect", {
    x, y: y+0.04, w: 0.06, h: h-0.08,
    fill: { color: color || C.accent }, rectRadius: 0.03,
  });
}

function titleSlide(s, en, cn, opts={}) {
  s.addText(en, {
    x: opts.x||M, y: opts.y||0.25, w: opts.w||CW, h: 0.5,
    fontSize: opts.size||26, fontFace: F.t, color: opts.color||C.title, bold: true, margin: 0,
  });
  if (cn) {
    s.addText(cn, {
      x: opts.x||M, y: (opts.y||0.25)+0.5, w: opts.w||CW, h: 0.25,
      fontSize: 12, fontFace: F.cn, color: C.muted, margin: 0,
    });
  }
  addLine(s, null, opts.x||M, (opts.y||0.25)+(cn?0.8:0.55), Math.min(opts.w||CW, 8.5), { color: C.lightPurple, width: 0.75 });
}

function star(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

// Override addLine to not need pres for simple lines
function hline(s, x, y, w, color, width) {
  s.addShape("line", { x, y, w, h: 0, line: { color: color||C.thinLine, width: width||0.75 } });
}

function pageNum(s, n) {
  s.addText(`${n} / ${TOTAL}`, {
    x: SW-1.2, y: SH-0.32, w: 0.85, h: 0.22,
    fontSize: 8, fontFace: F.b, color: C.muted, align: "right", margin: 0,
  });
}

function txt(s, text, x, y, w, h, opts={}) {
  s.addText(text, {
    x, y, w, h,
    fontSize: opts.size || 11,
    fontFace: opts.font || F.b,
    color: opts.color || C.body,
    bold: opts.bold || false,
    italic: opts.italic || false,
    align: opts.align || "left",
    valign: opts.valign || "top",
    margin: opts.margin || 0,
    paraSpaceAfter: opts.paraSpace || 0,
    lineSpacing: opts.lineSpacing,
    bullet: opts.bullet,
  });
}

function addTable(s, pr, x, y, w, headers, rows, opts={}) {
  const rH = opts.rowH || 0.34;
  const fSize = opts.fontSize || 10;
  // Compute column x positions
  let colXs = [x];
  for (let i = 0; i < headers.length - 1; i++) colXs.push(colXs[i] + headers[i].w);

  // Headers
  headers.forEach((h, i) => {
    txt(s, h.text, colXs[i]+0.06, y, h.w-0.06, rH, {
      size: fSize, bold: true, color: h.accent ? C.accent : C.muted, valign: "middle",
    });
  });
  hline(s, x, y+rH, w, C.lightPurple, 1);

  // Rows
  rows.forEach((row, ri) => {
    const ry = y + rH + ri * rH + 0.02;
    if (ri % 2 === 0) {
      s.addShape(pr.shapes.RECTANGLE, { x, y: ry, w, h: rH, fill: { color: C.nearWhite } });
    }
    row.forEach((cell, ci) => {
      txt(s, cell.text || cell, colXs[ci]+0.06, ry, headers[ci].w-0.12, rH, {
        size: fSize, bold: cell.bold||false, color: cell.color||C.body, valign: "middle",
      });
    });
  });
  return y + rH + rows.length * rH + 0.02;
}

function addQuote(s, text, attr, x, y, w, opts={}) {
  const h = opts.h || 0.7;
  addAccentBar(s, null, x, y, h, opts.barColor || C.accent);
  s.addText(text, {
    x: x+0.18, y: y+0.04, w: w-0.24, h: h * 0.65,
    fontSize: opts.size || 10, fontFace: F.b, color: C.dark, italic: true, margin: 0,
  });
  if (attr) {
    s.addText(attr, {
      x: x+0.18, y: y+h*0.65, w: w-0.24, h: h*0.3,
      fontSize: 9, fontFace: F.b, color: C.muted, margin: 0,
    });
  }
}

// addAccentBar override for when no pres needed
function bar(s, x, y, h, color) {
  s.addShape("rect", {
    x, y: y+0.04, w: 0.06, h: h-0.08,
    fill: { color: color||C.accent }, rectRadius: 0.03,
  });
}

function statCard(s, pr, x, y, w, h, num, label, sub, opts={}) {
  addCard(s, pr, x, y, w, h, { border: opts.border || C.lightPurple });
  txt(s, num, x, y+0.08, w, 0.45, {
    size: opts.numSize||32, font: F.t, color: opts.numColor||C.accent, bold: true, align: "center",
  });
  txt(s, label, x+0.1, y+0.5, w-0.2, 0.25, {
    size: 10, bold: true, color: C.dark, align: "center",
  });
  if (sub) {
    txt(s, sub, x+0.1, y+0.72, w-0.2, 0.2, {
      size: 8, color: C.muted, align: "center",
    });
  }
}

function addCodeBlock(s, pr, x, y, w, h, code) {
  s.addShape(pr.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: "2D2040" },
    line: { color: C.lightPurple, width: 0.5 },
    rectRadius: 0.05,
  });
  txt(s, code, x+0.1, y+0.06, w-0.2, h-0.12, {
    size: 8, font: F.m, color: C.lavender,
  });
}

function circleNum(s, pr, x, y, sz, num, opts={}) {
  s.addShape(pr.shapes.OVAL, {
    x, y, w: sz, h: sz,
    fill: { color: opts.fill || C.lavender },
    line: { color: opts.border || C.accent, width: 1.5 },
  });
  txt(s, String(num), x, y, sz, sz, {
    size: opts.fontSize||12, font: F.t, color: C.deepPurple, bold: true, align: "center", valign: "middle",
  });
}

function bullets(s, items, x, y, w, opts={}) {
  const lineH = opts.lineH || 0.28;
  items.forEach((item, i) => {
    txt(s, item.text || item, x+0.18, y + i*lineH, w-0.18, lineH, {
      size: opts.size || 10, color: item.color || C.body, bold: item.bold || false, valign: "middle",
    });
    txt(s, "•", x, y + i*lineH, 0.18, lineH, {
      size: opts.size || 10, color: C.accent, align: "center", valign: "middle",
    });
  });
  return y + items.length * lineH;
}

// ═══════════════════════════════════════════════════════════════════════
//  SLIDES
// ═══════════════════════════════════════════════════════════════════════

async function main() {
  const pr = new PptxGenJS();
  pr.defineLayout({ name: "STD", width: SW, height: SH });
  pr.layout = "STD";
  pr.author = "AI Coding Tectonic Shift r1.0";
  pr.title = "AI Coding: The Tectonic Shift in Software";

  // Pre-render backgrounds
  console.log("Generating backgrounds...");
  const coverBg = await createGradient(1920, 1080, "1A0F40", "3D2580", "diagonal");
  const bgA = await createGradient(1920, 1080, "FFFFFF", "F3EFF9", "vertical");
  const bgB = await createGradient(1920, 1080, "F8F5FC", "EDE5F7", "vertical");
  const bg = (n) => n % 2 === 0 ? bgB : bgA; // alternating

  // Load whale sketch
  let whaleData = null;
  if (fs.existsSync(WHALE_IMG) && fs.statSync(WHALE_IMG).size > 10000) {
    whaleData = "image/png;base64," + fs.readFileSync(WHALE_IMG).toString("base64");
    console.log("Whale sketch loaded.");
  } else {
    console.log("WARNING: No whale sketch found at", WHALE_IMG);
  }

  let slideN = 0;
  function newSlide(bgImg) {
    slideN++;
    const s = pr.addSlide();
    if (bgImg) s.background = { data: bgImg };
    return s;
  }

  // ─── SLIDE 1: COVER ──────────────────────────────────────────────
  {
    const s = newSlide(coverBg);
    // Whale sketch (right side, not overpowering)
    if (whaleData) {
      s.addImage({ data: whaleData, x: 0, y: 0, w: SW, h: SH, sizing: { type: "cover", w: SW, h: SH } });
      // Semi-transparent overlay to ensure text readability on left
      s.addShape(pr.shapes.RECTANGLE, {
        x: 0, y: 0, w: SW * 0.5, h: SH,
        fill: { color: C.coverBg, transparency: 15 },
      });
    }
    txt(s, "STRATEGIC INSIGHT REPORT", M, 0.3, 4, 0.2, { size: 9, color: C.light, font: F.b });
    hline(s, M, 0.55, 1.5, C.accent, 1.5);
    txt(s, "AI Coding:\nThe Tectonic Shift\nin Software", M, 0.7, 4.5, 1.6, {
      size: 34, font: F.t, color: C.wh, bold: true, lineSpacing: 40,
    });
    txt(s, "AI编程：软件行业的结构性变革", M, 2.4, 4.5, 0.3, { size: 13, font: F.cn, color: C.light });
    hline(s, M, 2.8, 3.5, C.accent, 0.75);
    txt(s, "The $3 Trillion Whale Is Falling  |  $3万亿巨鲸正在坠落", M, 2.95, 4.5, 0.3, {
      size: 11, color: C.lavender, italic: true,
    });
    txt(s, "一鲸落万物生", M, 3.35, 4.5, 0.3, { size: 14, font: F.cn, color: C.lightPurple });
    // Key evidence mini-table
    const ey = 3.85;
    const ev = [
      ["a16z", "30M devs × $100K = $3T market"],
      ["Apollo", "$440B PE assets at risk"],
      ["ARK Invest", "AI agents = new operating model"],
      ["S&P Index", "Worst correction since 2008"],
    ];
    ev.forEach((e, i) => {
      txt(s, e[0], M+0.05, ey+i*0.22, 1.0, 0.22, { size: 8, bold: true, color: C.lavender, valign: "middle" });
      txt(s, e[1], M+1.1, ey+i*0.22, 3.2, 0.22, { size: 8, color: C.light, valign: "middle" });
    });
    txt(s, "February 2026 — Release 1.0", M, SH-0.35, 3, 0.2, { size: 8, color: C.muted });
    pageNum(s, slideN);
  }

  // ─── SLIDE 2: SaaS CRISIS — THE STRUCTURAL RESET ─────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "SaaS Crisis & Seat Compression", "SaaS危机与座位压缩");
    const bY = 1.2;
    // Left: Fatal Vulnerability
    addCard(s, pr, M, bY, 4.2, 2.1);
    txt(s, "Traditional Software's Fatal Vulnerability", M+0.15, bY+0.1, 3.9, 0.25, {
      size: 11, bold: true, color: C.dark,
    });
    const traits = [
      "Pure intellectual capital",
      "Light-asset, high-margin",
      "Infinitely scalable",
      "Unconstrained by physical limits",
    ];
    traits.forEach((t, i) => {
      txt(s, "✅  " + t, M+0.2, bY+0.42+i*0.26, 3.8, 0.26, { size: 10, color: C.body, valign: "middle" });
    });
    bar(s, M+0.1, bY+1.55, 0.45, C.coral);
    txt(s, "This same asset-light nature now\nconstitutes their fatal vulnerability.", M+0.25, bY+1.55, 3.8, 0.45, {
      size: 9, italic: true, color: C.dark,
    });

    // Right: Seat Compression Math
    addCard(s, pr, M+4.5, bY, 4.4, 2.1);
    txt(s, "The Mathematics of Seat Compression", M+4.65, bY+0.1, 4.1, 0.25, {
      size: 11, bold: true, color: C.dark,
    });
    const seatH = [
      { text: "AI Autonomy", w: 1.3 },
      { text: "Workforce", w: 1.3 },
      { text: "Licenses", w: 1.6, accent: true },
    ];
    const seatR = [
      ["0% (Baseline)", "1,000", "1,000"],
      ["40% AI", "600", { text: "600 (-40%)", bold: true }],
      ["80% AI", "200", { text: "200 (-80%)", bold: true, color: C.coral }],
    ];
    addTable(s, pr, M+4.6, bY+0.4, 4.2, seatH, seatR, { rowH: 0.32, fontSize: 9 });

    // Bottom: Key insight
    addQuote(s, '"Light assets rise fast—but they fall faster."', null,
      M, bY+2.3, CW, { h: 0.4, size: 10 });
    // Early warnings
    txt(s, "Early Signals: Salesforce ~40% license cuts  •  ServiceNow IT staff -50%", M+0.2, bY+2.8, CW-0.4, 0.2, {
      size: 8, color: C.muted,
    });
    pageNum(s, slideN);
  }

  // ─── SLIDE 3: THE SAASPOCALYPSE ──────────────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, 'The February 2026 "SaaSpocalypse"', '2026年2月"SaaS末日"');
    txt(s, "Claude Cowork's product demo triggered a $285 billion single-day wipeout across software stocks:", M, 1.15, CW, 0.25, { size: 10, color: C.dark });

    const sH = [
      { text: "Company", w: 2.2 },
      { text: "Stock Drop", w: 1.5, accent: true },
      { text: "Significance", w: 5.2 },
    ];
    const sR = [
      [{ text: "Thomson Reuters", bold: true }, { text: "-15.83%", bold: true, color: C.coral }, "Worst single-day drop on record"],
      [{ text: "LegalZoom", bold: true }, { text: "-19.68%", bold: true, color: C.coral }, "Legal services disruption"],
      [{ text: "RELX (LexisNexis)", bold: true }, { text: "-14%", bold: true, color: C.coral }, "Legal research monopoly threatened"],
      [{ text: "WPP", bold: true }, { text: "-12%", color: C.coral }, "Advertising holding company"],
      [{ text: "Gartner", bold: true }, { text: "-21%", bold: true, color: C.coral }, "Research & advisory"],
      [{ text: "S&P Global", bold: true }, { text: "-11%", color: C.coral }, "Financial data services"],
      [{ text: "Intuit", bold: true }, { text: "-10%", color: C.coral }, "TurboTax, QuickBooks"],
      [{ text: "Equifax", bold: true }, { text: "-10%", color: C.coral }, "Credit reporting"],
    ];
    addTable(s, pr, M, 1.45, CW, sH, sR, { rowH: 0.3, fontSize: 9 });

    // Valuation collapse mini
    const vy = 4.3;
    txt(s, "Valuation Model Collapse:", M, vy, 2.5, 0.2, { size: 9, bold: true, color: C.dark });
    txt(s, "Predictable seat expansion → Growth contracts  |  8-12× multiples → Compressed  |  Compounding → Unwinding", M, vy+0.2, CW, 0.2, { size: 8, color: C.muted });
    pageNum(s, slideN);
  }

  // ─── SLIDE 4: L2 TO L5 AUTONOMY LEVELS ──────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "From L2 to L5: The Autonomous Coding Revolution", "从L2到L5：自主编码革命");

    const lH = [
      { text: "Level", w: 0.6 },
      { text: "Name", w: 1.8 },
      { text: "Description", w: 3.2 },
      { text: "Human Role", w: 3.3 },
    ];
    const lR = [
      [{ text: "L1", bold: true }, "Code Completion", "AI suggests completions", "Human writes everything"],
      [{ text: "L2", bold: true }, "Copilot-Style", "AI assists actively", "Human directs architecture"],
      [{ text: "L3", bold: true, color: C.accent }, "Claude Code", "AI writes functional code", "Directs via NL, reviews output"],
      [{ text: "L4", bold: true, color: C.amber }, "Full Autonomy", "AI builds complete apps", "Minimal oversight"],
      [{ text: "L5", bold: true, color: C.coral }, "Human-Free", "Fully autonomous dev", "Only high-level intent"],
    ];
    addTable(s, pr, M, 1.15, CW, lH, lR, { rowH: 0.38 });

    // Proof points
    const py = 3.35;
    txt(s, "Proof Points for L4:", M, py, 3, 0.22, { size: 11, bold: true, color: C.dark });
    const proofs = [
      { text: "SWE-bench Verified: Claude Opus 4.5 achieves 80.9%", bold: false },
      { text: "30+ hours continuous autonomous operation", bold: false },
      { text: "Claude Cowork built 100% by AI in under 2 weeks", bold: false },
    ];
    bullets(s, proofs, M+0.1, py+0.28, 5);

    // Callout
    addQuote(s, '"We stand at the L3/L4 inflection point today, with L5 as the visible destination."', null,
      M, 4.4, CW, { h: 0.4, size: 10 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 5: L4 PROOF — AGENT TEAMS ────────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Agent Teams Breakthrough", "February 2026");

    // Stats row
    const cw = 2.7, gap = 0.3, sx = (SW - 3*cw - 2*gap)/2;
    statCard(s, pr, sx, 1.2, cw, 1.0, "16", "Parallel Claude Agents", "Working simultaneously", { numColor: C.accent });
    statCard(s, pr, sx+cw+gap, 1.2, cw, 1.0, "100K", "Lines of Code", "Rust-based C compiler", { numColor: C.amber });
    statCard(s, pr, sx+2*(cw+gap), 1.2, cw, 1.0, "$20K", "API Costs", "Minimal human oversight", { numColor: C.teal });

    // Details table
    const dH = [
      { text: "Metric", w: 2.5 },
      { text: "Result", w: 6.4, accent: true },
    ];
    const dR = [
      [{ text: "Task", bold: true }, "Build a Rust-based C compiler from scratch"],
      [{ text: "Sessions", bold: true }, "~2,000 Claude Code sessions"],
      [{ text: "Achievement", bold: true }, "Compiles Linux 6.9 kernel on x86, ARM, RISC-V"],
      [{ text: "Supervision", bold: true }, { text: '"Mostly walked away"', italic: true }],
    ];
    addTable(s, pr, M, 2.5, CW, dH, dR, { rowH: 0.32 });

    addQuote(s, '"With agent teams, multiple Claude instances work in parallel on a shared codebase without active human intervention."',
      "— Nicholas Carlini, Anthropic", M, 3.95, CW, { h: 0.65, size: 9 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 6: BORIS CHERNY & PROTOTYPE-FIRST ────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "The Path to AGI: Prototype-First Revolution", "AGI之路");

    // Left: Boris bio + quote
    addCard(s, pr, M, 1.15, 4.2, 1.8);
    txt(s, "The Creator: Boris Cherny", M+0.15, 1.25, 3.9, 0.25, { size: 11, bold: true, color: C.dark });
    const bio = [
      "Former Principal Engineer (IC8) at Meta",
      "Led Facebook Groups (150→800 people)",
      'Author of "Programming TypeScript"',
      "Now Head of Claude Code at Anthropic",
    ];
    bullets(s, bio, M+0.2, 1.55, 3.7, { size: 9, lineH: 0.24 });
    addQuote(s, '"I tried giving it some tools to interact with the filesystem... Suddenly, this agent was really interesting."',
      "— Boris Cherny", M+0.1, 2.5, 4.0, { h: 0.5, size: 8 });

    // Right: Prototype-First table
    addCard(s, pr, M+4.5, 1.15, 4.4, 1.8);
    txt(s, '"Prototype-First" Methodology', M+4.65, 1.25, 4.1, 0.25, { size: 11, bold: true, color: C.dark });
    const pfH = [
      { text: "Traditional", w: 2.0 },
      { text: "Anthropic", w: 2.2, accent: true },
    ];
    const pfR = [
      ["Write 10-page PRD", { text: "Build prototype in hours", bold: true }],
      ["Design review meetings", { text: "Ship to entire company", bold: true }],
      ["Get stakeholder alignment", { text: "Everyone dogfoods immediately", bold: true }],
      ["Plan development", { text: "Iterate on real usage data", bold: true }],
    ];
    addTable(s, pr, M+4.6, 1.55, 4.2, pfH, pfR, { rowH: 0.3, fontSize: 9 });

    // Bottom: Build for Model 6 Months From Now
    const bY = 3.2;
    addQuote(s, '"Don\'t build for the model of today, build for the model six months from now."', "— Boris Cherny",
      M, bY, CW/2-0.1, { h: 0.6, size: 9 });

    // Adoption timeline
    addCard(s, pr, M+CW/2+0.1, bY, CW/2-0.1, 1.5);
    txt(s, "Adoption at Anthropic", M+CW/2+0.25, bY+0.08, 3.5, 0.22, { size: 10, bold: true, color: C.dark });
    const adopt = [
      ["Day 1", "20% of Engineering"],
      ["Day 5", "50% of Engineering"],
      ["Today", "80%+ daily usage"],
      ["Non-tech", "50% of sales team"],
    ];
    adopt.forEach((a, i) => {
      txt(s, a[0], M+CW/2+0.3, bY+0.35+i*0.24, 0.8, 0.24, { size: 9, bold: true, color: C.accent, valign: "middle" });
      txt(s, a[1], M+CW/2+1.2, bY+0.35+i*0.24, 2.5, 0.24, { size: 9, color: C.body, valign: "middle" });
    });
    pageNum(s, slideN);
  }

  // ─── SLIDE 7: SELF-IMPROVING FLYWHEEL ───────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Claude Code's Self-Improving Flywheel");

    // Flywheel diagram (simplified using boxes + arrows)
    const nodes = [
      { label: "Engineers\nUse Tool", x: 0.8, y: 1.2 },
      { label: "Claude Code\nSession", x: 3.2, y: 1.2 },
      { label: "Tool Calls &\nCode Gen", x: 5.6, y: 1.2 },
      { label: "Results &\nFeedback", x: 7.8, y: 1.2 },
      { label: "Usage Data\nCollection", x: 7.8, y: 2.3 },
      { label: "RLHF/CAI\nTraining", x: 5.0, y: 2.3 },
      { label: "Better\nClaude", x: 2.2, y: 2.3 },
    ];
    nodes.forEach(n => {
      addCard(s, pr, n.x, n.y, 1.6, 0.7, { border: C.accent, radius: 0.08 });
      txt(s, n.label, n.x+0.05, n.y+0.05, 1.5, 0.6, { size: 8, bold: true, color: C.dark, align: "center", valign: "middle" });
    });
    // Arrow labels
    txt(s, "→", 2.4, 1.35, 0.8, 0.4, { size: 18, color: C.lightPurple, align: "center", valign: "middle" });
    txt(s, "→", 4.8, 1.35, 0.8, 0.4, { size: 18, color: C.lightPurple, align: "center", valign: "middle" });
    txt(s, "→", 7.2, 1.35, 0.6, 0.4, { size: 18, color: C.lightPurple, align: "center", valign: "middle" });
    txt(s, "↓", 8.3, 1.9, 0.5, 0.4, { size: 16, color: C.lightPurple, align: "center", valign: "middle" });
    txt(s, "←", 6.6, 2.45, 0.8, 0.4, { size: 18, color: C.lightPurple, align: "center", valign: "middle" });
    txt(s, "←", 3.8, 2.45, 0.8, 0.4, { size: 18, color: C.lightPurple, align: "center", valign: "middle" });
    txt(s, "↑", 1.2, 1.9, 0.5, 0.4, { size: 16, color: C.lightPurple, align: "center", valign: "middle" });

    // Metrics table
    const mH = [
      { text: "Metric", w: 3.5 },
      { text: "Change", w: 2.5, accent: true },
      { text: "Detail", w: 2.9 },
    ];
    const mR = [
      [{ text: "Consecutive Tool Calls", bold: true }, { text: "+116%", bold: true, color: C.amber }, "9.8 → 21.2 per session"],
      [{ text: "Human Turns", bold: true }, { text: "-33%", bold: true, color: C.teal }, "6.2 → 4.1 per session"],
      [{ text: "Feature Implementation", bold: true }, { text: "+158%", bold: true, color: C.accent }, "14.3% → 36.9% of tasks"],
    ];
    addTable(s, pr, M, 3.3, CW, mH, mR, { rowH: 0.32, fontSize: 9 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 8: PRODUCTIVITY & REVENUE ────────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Productivity Gains & Revenue Milestone");

    // Stats row
    const cw2 = 2.1, gap2 = 0.25, sx2 = M;
    statCard(s, pr, sx2, 1.15, cw2, 0.95, "59%", "Claude Usage", "Up from 28%", { numColor: C.accent });
    statCard(s, pr, sx2+cw2+gap2, 1.15, cw2, 0.95, "+67%", "PR Throughput", "Even as headcount tripled", { numColor: C.teal });
    statCard(s, pr, sx2+2*(cw2+gap2), 1.15, cw2, 0.95, "$1B", "Revenue (Nov '25)", "8× enterprise growth", { numColor: C.amber });
    statCard(s, pr, sx2+3*(cw2+gap2), 1.15, cw2, 0.95, "90%", "Self-Written Code", "Claude Code codebase", { numColor: C.coral });

    // Recursive development
    const ry = 2.35;
    txt(s, "The Recursive Development: Claude Code Writes Itself", M, ry, CW, 0.22, { size: 12, bold: true, color: C.dark });
    const recH = [
      { text: "Metric", w: 3.5 },
      { text: "Value", w: 5.4, accent: true },
    ];
    const recR = [
      [{ text: "Boris's Dec 2025", bold: true }, { text: "300+ PRs shipped using Claude Code", bold: true }],
      [{ text: "Cloud Agents Running", bold: true }, "5+ Claude agents simultaneously"],
      [{ text: "Anthropic Teams", bold: true }, "70-90% of code written using Claude Code"],
      [{ text: "Valuation (Feb 2026)", bold: true }, { text: "$350 billion (in talks)", bold: true }],
    ];
    addTable(s, pr, M, ry+0.28, CW, recH, recR, { rowH: 0.3, fontSize: 9 });

    addQuote(s, '"Claude is becoming the verb now, in the similar way that ChatGPT was as it launched."',
      "— Mike Brevoort, Principal Architect", M, 4.05, CW, { h: 0.55, size: 9 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 9: FIVE PILLARS ──────────────────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "The Five Pillars of Claude Code Architecture");

    const pillars = [
      { num: 1, name: "CLAUDE.md", sub: "Memories", desc: "Always-on project context\nLoads at session start", status: "De facto standard" },
      { num: 2, name: "Skills", sub: "", desc: "On-demand workflows\n/deploy, /review, etc.", status: "De facto standard" },
      { num: 3, name: "MCP", sub: "Model Context Protocol", desc: "External tool connections\nDonated to Linux Foundation", status: "Industry standard" },
      { num: 4, name: "Subagents", sub: "", desc: "Parallel/isolated execution\nOn-demand delegation", status: "Industry first" },
      { num: 5, name: "Hooks", sub: "", desc: "Event-driven automation\nFires on matching events", status: "Industry first" },
    ];
    const pcw = 1.65, pgap = 0.15, psx = (SW - 5*pcw - 4*pgap)/2;
    pillars.forEach((p, i) => {
      const px = psx + i*(pcw+pgap), py = 1.2;
      addCard(s, pr, px, py, pcw, 2.1, { border: i % 2 === 0 ? C.accent : C.lightPurple });
      circleNum(s, pr, px+(pcw-0.35)/2, py+0.1, 0.35, p.num);
      txt(s, p.name, px+0.08, py+0.52, pcw-0.16, 0.22, { size: 11, bold: true, color: C.dark, align: "center" });
      if (p.sub) txt(s, p.sub, px+0.08, py+0.72, pcw-0.16, 0.18, { size: 7, color: C.accent, align: "center" });
      txt(s, p.desc, px+0.08, py+0.95, pcw-0.16, 0.55, { size: 8, color: C.body, align: "center" });
      txt(s, p.status, px+0.08, py+1.65, pcw-0.16, 0.2, { size: 7, color: C.muted, align: "center", italic: true });
    });

    // Industry convergence
    const iy = 3.55;
    txt(s, "Industry Convergence", M, iy, 3, 0.22, { size: 11, bold: true, color: C.dark });
    const icH = [
      { text: "Company", w: 2.0 },
      { text: "Adopted From Claude Code", w: 6.9, accent: true },
    ];
    const icR = [
      [{ text: "OpenAI", bold: true }, "AGENTS.md (similar to CLAUDE.md)"],
      [{ text: "Google", bold: true }, "AGENTS.md (collaborating on standard)"],
      [{ text: "GitHub Copilot", bold: true }, "copilot-instructions.md"],
      [{ text: "Cursor", bold: true }, ".cursorrules"],
    ];
    addTable(s, pr, M, iy+0.25, CW, icH, icR, { rowH: 0.28, fontSize: 9 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 10: [NEW-D] ARCHITECTURE DEEP DIVE ──────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Architecture Deep Dive: The Five Pillars in Practice");

    // Three columns with code examples
    const cw3 = 2.8, g3 = 0.2, cx = M;

    // Col 1: CLAUDE.md
    addCard(s, pr, cx, 1.15, cw3, 2.5);
    txt(s, "1. CLAUDE.md — Memories", cx+0.1, 1.22, cw3-0.2, 0.22, { size: 10, bold: true, color: C.dark });
    addCodeBlock(s, pr, cx+0.1, 1.5, cw3-0.2, 1.2,
      "# CLAUDE.md\n## Project Context\nPython web app, FastAPI + PostgreSQL\n## Coding Standards\n- Type hints everywhere\n- PEP 8, TDD\n## Architecture\n- SQLAlchemy ORM\n- Pydantic validation");
    txt(s, "Loads at session start\nAll levels contribute", cx+0.1, 2.8, cw3-0.2, 0.4, { size: 8, color: C.muted });

    // Col 2: Skills
    const c2x = cx+cw3+g3;
    addCard(s, pr, c2x, 1.15, cw3, 2.5);
    txt(s, "2. Skills — Workflows", c2x+0.1, 1.22, cw3-0.2, 0.22, { size: 10, bold: true, color: C.dark });
    addCodeBlock(s, pr, c2x+0.1, 1.5, cw3-0.2, 1.2,
      "---\nname: deploy\ndescription: Deploy to prod\n---\n# Steps\n1. pytest\n2. docker build -t app\n3. docker push\n4. kubectl apply -f k8s/");
    txt(s, "Invoke with /deploy\nLoads on-demand only", c2x+0.1, 2.8, cw3-0.2, 0.4, { size: 8, color: C.muted });

    // Col 3: MCP + Subagents + Hooks
    const c3x = cx+2*(cw3+g3);
    addCard(s, pr, c3x, 1.15, cw3, 2.5);
    txt(s, "3-5. MCP, Subagents, Hooks", c3x+0.1, 1.22, cw3-0.2, 0.22, { size: 10, bold: true, color: C.dark });
    txt(s, "MCP: External tool connections\n  DB, GitHub, Slack, Cloud APIs\n  Scope: Local > Project > User\n\nSubagents: Parallel work\n  Main → Security review\n       → Performance review\n       → Style review\n\nHooks: Event automation\n  on: file_edited\n  then: npm run lint", c3x+0.1, 1.5, cw3-0.2, 1.6, {
      size: 8, font: F.m, color: C.body,
    });

    // Feature layering
    const flY = 3.85;
    txt(s, "Feature Layering Priority", M, flY, 3, 0.2, { size: 10, bold: true, color: C.dark });
    const flH = [
      { text: "Feature", w: 2.0 },
      { text: "Resolution Rule", w: 6.9, accent: true },
    ];
    const flR = [
      [{ text: "CLAUDE.md", bold: true }, "Additive — all levels contribute"],
      [{ text: "Skills", bold: true }, "Override by name (managed > user > project)"],
      [{ text: "MCP", bold: true }, "Override by name (local > project > user)"],
      [{ text: "Hooks", bold: true }, "Merge — all registered hooks fire"],
    ];
    addTable(s, pr, M, flY+0.22, CW, flH, flR, { rowH: 0.26, fontSize: 8 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 11: [NEW-E] TEAMS & ADOPTION PATTERNS ───────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Claude Code in Practice: Teams & Adoption Patterns");

    // Left: Team use cases
    txt(s, "Team-Specific Use Cases", M, 1.15, 4, 0.22, { size: 11, bold: true, color: C.dark });
    const tH = [
      { text: "Team", w: 2.0 },
      { text: "Primary Use Case", w: 2.3 },
    ];
    const tR = [
      [{ text: "Data Infrastructure", bold: true }, "K8s debugging, pipelines"],
      [{ text: "Product Development", bold: true }, "Feature impl, auto-accept"],
      [{ text: "Security", bold: true }, "Code analysis, vuln detection"],
      [{ text: "Data Science", bold: true }, "Visualization, analysis"],
      [{ text: "Legal", bold: true }, "Doc processing, contracts"],
      [{ text: "Non-technical", bold: true }, "Debugging, Git operations"],
    ];
    addTable(s, pr, M, 1.4, 4.3, tH, tR, { rowH: 0.28, fontSize: 9 });

    // Right: Adoption patterns
    const rx = M+4.6;
    txt(s, "Three Adoption Patterns", rx, 1.15, 4, 0.22, { size: 11, bold: true, color: C.dark });

    const patterns = [
      { name: "Autonomous Execution", desc: "Auto-accept mode, clean git start, review 80% solution.\nSuccess: ~1/3 on first attempt.", color: C.accent },
      { name: "Synchronous Collaboration", desc: "Detailed prompts, real-time monitoring.\nHybrid: human judgment + AI execution.", color: C.teal },
      { name: "Knowledge Extraction", desc: "Onboarding, codebase navigation.\n80% reduction in research time.", color: C.amber },
    ];
    patterns.forEach((p, i) => {
      const py = 1.45 + i * 0.85;
      addCard(s, pr, rx, py, 4.3, 0.75, { border: p.color });
      bar(s, rx+0.08, py+0.06, 0.63, p.color);
      txt(s, p.name, rx+0.22, py+0.06, 3.8, 0.22, { size: 10, bold: true, color: C.dark });
      txt(s, p.desc, rx+0.22, py+0.3, 3.8, 0.38, { size: 8, color: C.body });
    });

    // Bottom stats
    txt(s, "80%+ engineers daily  •  5 PRs/engineer/day (vs 1-2 norm)  •  60-100 internal releases/day", M, 4.5, CW, 0.2, {
      size: 9, bold: true, color: C.accent, align: "center",
    });
    pageNum(s, slideN);
  }

  // ─── SLIDE 12: AGI FOUNDATION ───────────────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Claude Code as AGI Foundation");

    // Recursive cycle
    const bx = M+0.5, by = 1.2, bw = 2.2, bh = 0.6;
    addCard(s, pr, bx, by, bw, bh, { border: C.accent });
    txt(s, "Claude Code (v1)", bx+0.1, by+0.1, bw-0.2, bh-0.2, { size: 10, bold: true, color: C.dark, align: "center", valign: "middle" });
    txt(s, "→", bx+bw, by+0.1, 0.5, bh-0.2, { size: 20, color: C.lightPurple, align: "center", valign: "middle" });
    addCard(s, pr, bx+bw+0.5, by, bw, bh, { border: C.teal });
    txt(s, "Builds Cowork", bx+bw+0.6, by+0.1, bw-0.2, bh-0.2, { size: 10, bold: true, color: C.dark, align: "center", valign: "middle" });
    txt(s, "→", bx+2*bw+0.5, by+0.1, 0.5, bh-0.2, { size: 20, color: C.lightPurple, align: "center", valign: "middle" });
    addCard(s, pr, bx+2*bw+1.0, by, bw, bh, { border: C.amber });
    txt(s, "Next Gen Tools", bx+2*bw+1.1, by+0.1, bw-0.2, bh-0.2, { size: 10, bold: true, color: C.dark, align: "center", valign: "middle" });
    txt(s, "← Feedback Loop →", bx+bw, by+bh+0.05, 2*bw+0.5, 0.25, { size: 8, color: C.muted, align: "center" });

    // Cowork case study
    addCard(s, pr, M, 2.15, 4.3, 1.5);
    txt(s, "Case Study: Claude Cowork Built Itself", M+0.15, 2.22, 4.0, 0.22, { size: 10, bold: true, color: C.dark });
    const cwH = [
      { text: "Metric", w: 1.8 },
      { text: "Value", w: 2.3, accent: true },
    ];
    const cwR = [
      [{ text: "Dev Time", bold: true }, "~10 days"],
      [{ text: "Team Size", bold: true }, "4 engineers"],
      [{ text: "Code By", bold: true }, { text: '"All of it" — Claude Code', bold: true }],
      [{ text: "Human Role", bold: true }, "Product & architecture decisions"],
    ];
    addTable(s, pr, M+0.1, 2.5, 4.1, cwH, cwR, { rowH: 0.26, fontSize: 9 });

    // AGI characteristics
    addCard(s, pr, M+4.6, 2.15, 4.3, 1.5);
    txt(s, "AGI Characteristics Demonstrated", M+4.75, 2.22, 4.0, 0.22, { size: 10, bold: true, color: C.dark });
    const agiH = [
      { text: "Capability", w: 1.8 },
      { text: "Evidence", w: 2.3, accent: true },
    ];
    const agiR = [
      [{ text: "Tool Generation", bold: true }, "Creates custom tools on demand"],
      [{ text: "Tool Use", bold: true }, "Executes bash, reads, writes code"],
      [{ text: "Feedback", bold: true }, "Learns from execution results"],
      [{ text: "Self-Improvement", bold: true }, "Usage data → better models"],
    ];
    addTable(s, pr, M+4.7, 2.5, 4.1, agiH, agiR, { rowH: 0.26, fontSize: 9 });

    addQuote(s, '"We spent more time making product and architecture decisions than writing individual lines of code."',
      "— Felix Rieseberg, Anthropic", M, 3.9, CW, { h: 0.6, size: 9 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 13: ANTHROPIC VS OPENAI ──────────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Anthropic vs OpenAI: Divergent Philosophies");

    const avH = [
      { text: "Dimension", w: 2.0 },
      { text: "Anthropic", w: 3.5, accent: true },
      { text: "OpenAI", w: 3.4 },
    ];
    const avR = [
      [{ text: "Philosophy", bold: true }, "Safety-first, human-in-the-loop", "Rapid innovation, productivity-first"],
      [{ text: "System Prompt", bold: true }, "120+ pages of explicit rules", '"Make a best effort" approach'],
      [{ text: "Guardrails", bold: true }, "Protocol-level (MCP)", "Optional developer checks"],
      [{ text: "Dev Speed", bold: true }, "Conservative, measured", "Aggressive, fast-moving"],
      [{ text: "Key Innovation", bold: true }, "CLAUDE.md, Skills, Subagents, Hooks", "AGENTS.md, Codex integration"],
      [{ text: "Adoption", bold: true }, "80%+ engineers daily", "Growing rapidly"],
      [{ text: "Productivity", bold: true }, "+67% PR throughput", "Targeting 500% speed (Meta)"],
    ];
    addTable(s, pr, M, 1.15, CW, avH, avR, { rowH: 0.34, fontSize: 9 });

    // Quote comparison
    const qy = 3.85;
    addCard(s, pr, M, qy, CW/2-0.1, 0.85, { border: C.teal });
    txt(s, "Anthropic", M+0.1, qy+0.06, 1.5, 0.2, { size: 9, bold: true, color: C.teal });
    txt(s, '"Claude never starts its response by saying a question or idea was good, great, fascinating..."', M+0.1, qy+0.28, CW/2-0.3, 0.5, { size: 8, color: C.body, italic: true });

    addCard(s, pr, M+CW/2+0.1, qy, CW/2-0.1, 0.85, { border: C.amber });
    txt(s, "OpenAI", M+CW/2+0.2, qy+0.06, 1.5, 0.2, { size: 9, bold: true, color: C.amber });
    txt(s, '"DO NOT ASK A CLARIFYING QUESTION. Instead make a best effort..."', M+CW/2+0.2, qy+0.28, CW/2-0.3, 0.5, { size: 8, color: C.body, italic: true });
    pageNum(s, slideN);
  }

  // ─── SLIDE 14: [NEW-F] SAFETY & RELEASE DECISION ───────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Safety & Philosophy: The Internal Release Decision");

    // The debate
    txt(s, "The Internal Debate: Keep It Secret or Release?", M, 1.15, CW, 0.22, { size: 11, bold: true, color: C.dark });
    addCard(s, pr, M, 1.42, CW, 0.9);
    addQuote(s, '"We weren\'t even sure if we wanted to launch Claude Code publicly because we were thinking it could be a competitive advantage — our secret sauce."',
      null, M+0.1, 1.48, CW-0.2, { h: 0.35, size: 9 });
    txt(s, "Decision rationale:", M+0.2, 1.9, 2, 0.2, { size: 9, bold: true, color: C.dark });
    const reasons = [
      "Anthropic is, at core, a model safety company",
      "Tools people use → learn about model safety & capabilities",
      "All of Anthropic got hooked on it internally",
      "Releasing teaches more than keeping it private",
    ];
    bullets(s, reasons, M+0.2, 2.12, CW-0.4, { size: 8, lineH: 0.2 });

    // Safety eval table
    const sey = 3.0;
    txt(s, "Safety Evaluation Comparison (Dec 2025)", M, sey, CW, 0.22, { size: 11, bold: true, color: C.dark });
    const seH = [
      { text: "Metric", w: 3.0 },
      { text: "Claude", w: 2.8, accent: true },
      { text: "GPT-4o/4.1", w: 3.1 },
    ];
    const seR = [
      [{ text: "Instruction Hierarchy", bold: true }, { text: "Best", bold: true, color: C.teal }, "Lower"],
      [{ text: "Hallucination Rate", bold: true }, { text: "Lower", bold: true, color: C.teal }, "Higher"],
      [{ text: "Safety Constraints", bold: true }, { text: "Strong", bold: true, color: C.teal }, "Weaker"],
      [{ text: "Refusal Mechanisms", bold: true }, "Conservative", "Permissive"],
    ];
    addTable(s, pr, M, sey+0.25, CW, seH, seR, { rowH: 0.3, fontSize: 9 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 15: THE AGI IMPLICATION ──────────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "The AGI Implication");

    addQuote(s, '"In 3-6 months, AI writes 90% of code. In 12 months, AI writes essentially all code."',
      "— Dario Amodei, Anthropic CEO, March 2025", M, 1.2, CW, { h: 0.7, size: 11 });

    txt(s, "Status Check (February 2026):", M, 2.1, 4, 0.22, { size: 11, bold: true, color: C.dark });
    const stH = [
      { text: "Metric", w: 4.0 },
      { text: "Value", w: 4.9, accent: true },
    ];
    const stR = [
      ["Microsoft's code AI-written", { text: "30%", bold: true }],
      ["Google's code AI-written", { text: "25%", bold: true }],
      ["Claude Cowork", { text: "100% built by Claude Code", bold: true, color: C.accent }],
      ["Boris Cherny Dec 2025", { text: "100% via Claude + Opus 4.5", bold: true, color: C.accent }],
    ];
    addTable(s, pr, M, 2.35, CW, stH, stR, { rowH: 0.32, fontSize: 10 });

    addQuote(s, "Claude Code demonstrates self-evolving AI — the core characteristic of AGI. AI tools creating their own successors.",
      null, M, 3.85, CW, { h: 0.45, size: 10, barColor: C.amber });
    pageNum(s, slideN);
  }

  // ─── SLIDE 16: AGENTIC SE PLAYBOOK — TWO PATHS ─────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "The Agentic Software Engineering Playbook", "智能体软件工程手册");
    txt(s, "Two Paths to the Same Destination", M, 1.15, CW, 0.25, { size: 14, color: C.dark, italic: true });
    txt(s, "Both Anthropic and OpenAI have developed internal playbooks for agentic software engineering — but with fundamentally different philosophies.", M, 1.5, CW, 0.4, { size: 11, color: C.body });

    // Two cards
    addCard(s, pr, M, 2.1, CW/2-0.15, 2.2, { border: C.teal });
    txt(s, "Anthropic", M+0.15, 2.2, CW/2-0.45, 0.25, { size: 14, bold: true, color: C.teal });
    txt(s, '"Prototype-First" + Self-Improving Flywheel', M+0.15, 2.48, CW/2-0.45, 0.22, { size: 9, italic: true, color: C.muted });
    addQuote(s, '"Build prototypes in hours, not weeks. Remove planning as the bottleneck."',
      null, M+0.15, 2.78, CW/2-0.5, { h: 0.4, size: 8, barColor: C.teal });
    txt(s, "Key: Self-improving flywheel where usage data trains better models.", M+0.15, 3.3, CW/2-0.5, 0.35, { size: 9, color: C.body });

    const rx2 = M+CW/2+0.15;
    addCard(s, pr, rx2, 2.1, CW/2-0.15, 2.2, { border: C.amber });
    txt(s, "OpenAI", rx2+0.15, 2.2, CW/2-0.45, 0.25, { size: 14, bold: true, color: C.amber });
    txt(s, '"Tool of First Resort" + March 31 Mandate', rx2+0.15, 2.48, CW/2-0.45, 0.22, { size: 9, italic: true, color: C.muted });
    addQuote(s, '"For any technical task, the tool of first resort is interacting with an agent."',
      null, rx2+0.15, 2.78, CW/2-0.5, { h: 0.4, size: 8, barColor: C.amber });
    txt(s, "Key: Top-down organizational mandate with a hard deadline.", rx2+0.15, 3.3, CW/2-0.5, 0.35, { size: 9, color: C.body });

    addQuote(s, "This is not a tool adoption — it's an organizational transformation. The question is not whether to adopt, but how quickly you can navigate it deliberately vs. reactively.",
      null, M, 4.5, CW, { h: 0.45, size: 9, barColor: C.deepPurple });
    pageNum(s, slideN);
  }

  // ─── SLIDE 17: ANTHROPIC'S 6-STEP PLAYBOOK ─────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Anthropic's Approach: 6-Step Playbook");

    const apH = [
      { text: "Step", w: 0.6 },
      { text: "Action", w: 3.2 },
      { text: "Key Output", w: 5.1, accent: true },
    ];
    const apR = [
      [{ text: "1", bold: true }, "Try the tools — designate 'Agents Captain'", "Cultural shift"],
      [{ text: "2", bold: true }, "Create AGENTS.md project handbook", "Shared knowledge"],
      [{ text: "3", bold: true }, "Make internal tools agent-accessible (CLI/MCP)", "Programmatic interfaces"],
      [{ text: "4", bold: true }, "Restructure codebases for agent-first dev", "Fast tests, clean interfaces"],
      [{ text: "5", bold: true }, '"Say no to slop" — maintain review bar', "Code quality guardrails"],
      [{ text: "6", bold: true }, "Build observability, trajectory tracking", "Agent telemetry"],
    ];
    addTable(s, pr, M, 1.15, CW, apH, apR, { rowH: 0.34, fontSize: 9 });

    // Metrics
    const amY = 3.5;
    txt(s, "Key Metrics at Anthropic:", M, amY, 3, 0.22, { size: 11, bold: true, color: C.dark });
    const amH = [
      { text: "Metric", w: 4.5 },
      { text: "Value", w: 4.4, accent: true },
    ];
    const amR = [
      ["Engineers using Claude Code daily", { text: "80%+", bold: true }],
      ["PR throughput increase", { text: "+67%", bold: true }],
      ["Consecutive tool calls (6 months)", { text: "+116%", bold: true }],
      ["Human turns per session", { text: "-33%", bold: true }],
    ];
    addTable(s, pr, M, amY+0.25, CW, amH, amR, { rowH: 0.28, fontSize: 9 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 18: OPENAI'S MARCH 31 MANDATE ───────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "OpenAI's March 31, 2026 Mandate");

    // Two goal cards
    addCard(s, pr, M, 1.15, CW/2-0.15, 1.0, { border: C.amber });
    txt(s, "Goal 1: Tool of First Resort", M+0.15, 1.22, CW/2-0.45, 0.25, { size: 11, bold: true, color: C.amber });
    txt(s, "For any technical task, humans interact with an agent rather than using an editor or terminal.", M+0.15, 1.52, CW/2-0.45, 0.5, { size: 9, color: C.body });

    const g2x = M+CW/2+0.15;
    addCard(s, pr, g2x, 1.15, CW/2-0.15, 1.0, { border: C.teal });
    txt(s, "Goal 2: Safe & Productive Default", g2x+0.15, 1.22, CW/2-0.45, 0.25, { size: 11, bold: true, color: C.teal });
    txt(s, "Agent utilization is explicitly evaluated as safe, but also productive enough for most workflows.", g2x+0.15, 1.52, CW/2-0.45, 0.5, { size: 9, color: C.body });

    // 6-step playbook
    const opH = [
      { text: "Step", w: 0.6 },
      { text: "Action", w: 3.5 },
      { text: "Key Output", w: 4.8, accent: true },
    ];
    const opR = [
      [{ text: "1", bold: true }, 'Designate "Agents Captain", host hackathons', "Cultural adoption"],
      [{ text: "2", bold: true }, "Create project-specific AGENTS.md", "Machine-readable context"],
      [{ text: "3", bold: true }, "Catalog and agent-enable internal tools", "CLI/MCP wrappers"],
      [{ text: "4", bold: true }, "Fast tests, high-quality interfaces", "Agent-optimized architecture"],
      [{ text: "5", bold: true }, "Human accountability for all merged code", "Quality guardrails"],
      [{ text: "6", bold: true }, "Observability, trajectory tracking", "Agent telemetry"],
    ];
    addTable(s, pr, M, 2.35, CW, opH, opR, { rowH: 0.3, fontSize: 9 });

    // Timeline
    const tlY = 4.35;
    txt(s, "Timeline:", M, tlY, 1.5, 0.2, { size: 10, bold: true, color: C.dark });
    txt(s, "Dec 2025: Step function in Codex  →  Jan 2026: Playbook distributed  →  Mar 31, 2026: Agent as tool of first resort", M+1.5, tlY, 7.0, 0.2, { size: 9, color: C.body });
    pageNum(s, slideN);
  }

  // ─── SLIDE 19: [NEW-A] DECEMBER 2025 CODEX INFLECTION ──────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "The December 2025 Codex Inflection Point");

    // Before/After
    const baH = [
      { text: "Before Dec 2025", w: 4.3 },
      { text: "After Dec 2025", w: 4.6, accent: true },
    ];
    const baR = [
      ["Codex for unit tests only", { text: "Codex writes essentially all code", bold: true }],
      ["Limited to simple tasks", { text: "Handles operations & debugging", bold: true }],
      ["Experimental tool", { text: "Primary development interface", bold: true }],
    ];
    addTable(s, pr, M, 1.15, CW, baH, baR, { rowH: 0.34, fontSize: 10 });

    // GPT-5.2 catalyst
    txt(s, "GPT-5.2-Codex Catalyst", M, 2.35, 3, 0.22, { size: 11, bold: true, color: C.dark });
    const gpH = [
      { text: "Capability", w: 3.0 },
      { text: "Impact", w: 5.9, accent: true },
    ];
    const gpR = [
      ["Long-horizon work", "Context compaction for extended tasks"],
      ["Large code changes", "Better refactors and migrations"],
      ["SWE-Bench Pro", "Leading benchmark performance"],
    ];
    addTable(s, pr, M, 2.6, CW, gpH, gpR, { rowH: 0.3, fontSize: 9 });

    // Case studies
    txt(s, "Real-World Proof Points", M, 3.6, 3, 0.22, { size: 11, bold: true, color: C.dark });
    addCard(s, pr, M, 3.85, CW/2-0.15, 0.9, { border: C.amber });
    txt(s, "Sora Android App", M+0.15, 3.92, 3, 0.22, { size: 10, bold: true, color: C.amber });
    txt(s, "4 engineers  •  18 days\nTraditional estimate: 3-6 months", M+0.15, 4.18, CW/2-0.45, 0.45, { size: 9, color: C.body });

    addCard(s, pr, M+CW/2+0.15, 3.85, CW/2-0.15, 0.9, { border: C.accent });
    txt(s, "1M+ Developers Using Codex", M+CW/2+0.3, 3.92, 3, 0.22, { size: 10, bold: true, color: C.accent });
    txt(s, "20× growth since Aug 2025\nUsage nearly doubled after GPT-5.2", M+CW/2+0.3, 4.18, CW/2-0.45, 0.45, { size: 9, color: C.body });
    pageNum(s, slideN);
  }

  // ─── SLIDE 20: [NEW-B] 8-DIMENSION PARADIGM SHIFT ──────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Traditional vs Agentic Engineering: The Paradigm Shift");

    const psH = [
      { text: "Dimension", w: 2.0 },
      { text: "Traditional", w: 3.5 },
      { text: "Agentic", w: 3.4, accent: true },
    ];
    const psR = [
      [{ text: "First Action", bold: true }, "Open IDE, write code", { text: "Prompt agent with intent", bold: true }],
      [{ text: "Code Production", bold: true }, "Human writes line-by-line", { text: "Agent generates, human reviews", bold: true }],
      [{ text: "Debugging", bold: true }, "Manual trace, breakpoint", { text: "Agent diagnoses and fixes", bold: true }],
      [{ text: "Testing", bold: true }, "Write tests after code", { text: "Agent writes tests first", bold: true }],
      [{ text: "Documentation", bold: true }, "Write docs after shipping", { text: "Spec-driven development", bold: true }],
      [{ text: "Knowledge", bold: true }, "Code comments, wiki", { text: "AGENTS.md + Skills", bold: true }],
      [{ text: "Tool Usage", bold: true }, "Click UI, manual steps", { text: "Agent invokes via CLI/MCP", bold: true }],
      [{ text: "Iteration Speed", bold: true }, "Hours/days per feature", { text: "Minutes with feedback loops", bold: true }],
    ];
    addTable(s, pr, M, 1.15, CW, psH, psR, { rowH: 0.38, fontSize: 10 });

    addQuote(s, '"Coding is a relatively small part of the work of creating software."',
      null, M, 4.55, CW, { h: 0.35, size: 10 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 21: [NEW-C] EVOLVING ENGINEER ROLE ──────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "The Evolving Engineer: From Writer to Orchestrator");

    const erH = [
      { text: "Old Focus", w: 3.5 },
      { text: "New Focus", w: 5.4, accent: true },
    ];
    const erR = [
      ["Writing implementation code", { text: "Designing agent-implementable systems", bold: true }],
      ["Manual coding", { text: "Writing specifications for agents", bold: true }],
      ["Debugging", { text: "Reviewing and curating agent output", bold: true }],
      ["Ad-hoc knowledge sharing", { text: "Maintaining AGENTS.md & skills", bold: true }],
      ["Single-threaded work", { text: "Orchestrating multiple agents", bold: true }],
      ["Low-level coding", { text: "Higher-order design & communication", bold: true }],
    ];
    addTable(s, pr, M, 1.15, CW, erH, erR, { rowH: 0.36, fontSize: 10 });

    // Spec-driven development
    txt(s, "Spec-Driven Development", M, 3.6, 4, 0.22, { size: 12, bold: true, color: C.dark });
    const steps = [
      { num: "1", label: "Engineer writes\nspecification", color: C.accent },
      { num: "2", label: "Agent implements\nagainst spec", color: C.teal },
      { num: "3", label: "Spec = instruction set\n+ acceptance criteria", color: C.amber },
    ];
    const scw = 2.6, sgap = 0.5, ssx = (SW - 3*scw - 2*sgap)/2;
    steps.forEach((st, i) => {
      const sx3 = ssx + i*(scw+sgap);
      addCard(s, pr, sx3, 3.9, scw, 0.8, { border: st.color });
      circleNum(s, pr, sx3+0.15, 3.98, 0.35, st.num, { fill: C.lavender, border: st.color });
      txt(s, st.label, sx3+0.6, 3.95, scw-0.8, 0.7, { size: 10, color: C.dark, valign: "middle" });
    });
    pageNum(s, slideN);
  }

  // ─── SLIDE 22: SIDE-BY-SIDE + COMMON ELEMENTS ──────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Side-by-Side Comparison & Industry Convergence");

    const ssH = [
      { text: "Element", w: 2.5 },
      { text: "Purpose", w: 6.4, accent: true },
    ];
    const ssR = [
      [{ text: "AGENTS.md / CLAUDE.md", bold: true }, "Machine-readable project context"],
      [{ text: "Skills", bold: true }, "Reusable agent capabilities"],
      [{ text: "MCP", bold: true }, "Standardized tool connections"],
      [{ text: "Human-in-the-loop", bold: true }, "Quality review and accountability"],
      [{ text: "Observability", bold: true }, "Track agent performance and trajectories"],
    ];
    addTable(s, pr, M, 1.15, CW, ssH, ssR, { rowH: 0.32, fontSize: 10 });

    addQuote(s, "Linux Foundation Agentic AI Foundation (Dec 2025): Anthropic donated MCP, OpenAI donated AGENTS.md — unprecedented collaboration between competitors.",
      null, M, 2.95, CW, { h: 0.55, size: 10, barColor: C.deepPurple });

    addQuote(s, "This is not a tool adoption — it's an organizational transformation. Both have reached the same conclusion: the future is agent-first, where humans design and orchestrate while agents implement.",
      null, M, 3.7, CW, { h: 0.6, size: 10, barColor: C.accent });

    txt(s, "The question is not whether to adopt, but how quickly you can navigate it deliberately vs. reactively.", M, 4.5, CW, 0.25, { size: 11, bold: true, color: C.dark, align: "center" });
    pageNum(s, slideN);
  }

  // ─── SLIDE 23: FUTURE OF AI ASSISTANTS ──────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "The Future of Personal AI Assistants", "个人AI助手之未来");
    txt(s, "The Chat-App Trap: Why Doubao and Others Are Wrong", M, 1.2, CW, 0.25, { size: 14, color: C.dark, italic: true });

    // Chat-App flaws
    const cfH = [
      { text: "Flaw", w: 2.5 },
      { text: "Why It Fails", w: 6.4, accent: true },
    ];
    const cfR = [
      [{ text: "Reactive", bold: true }, "Waits for input; can't anticipate needs"],
      [{ text: "Session memory", bold: true }, "Forgets context between conversations"],
      [{ text: "App silos", bold: true }, "Trapped inside a single app; can't access system"],
      [{ text: "Cloud-dependent", bold: true }, "Requires internet; high latency"],
      [{ text: "Platform locks", bold: true }, "Subject to app store policies and blocks"],
    ];
    addTable(s, pr, M, 1.55, CW, cfH, cfR, { rowH: 0.32, fontSize: 9 });

    // Doubao case
    txt(s, "Case Study: Doubao's Limitations (Jan 2026)", M, 3.35, CW, 0.22, { size: 11, bold: true, color: C.dark });
    txt(s, "ByteDance's AI assistant blocked by major platforms:", M, 3.6, CW, 0.2, { size: 9, color: C.body });
    txt(s, "Alipay (financial)  •  Taobao (e-commerce)  •  Pinduoduo (shopping)", M+0.2, 3.82, CW-0.4, 0.2, { size: 9, bold: true, color: C.coral });

    addQuote(s, '"It seems that AI can create content, but it hits walls when trying to pay for something."',
      null, M, 4.15, CW, { h: 0.4, size: 9 });
    txt(s, "Chat apps live at the mercy of platform owners. When AI agents threaten ecosystems, platforms block them.", M, 4.65, CW, 0.2, { size: 9, bold: true, color: C.dark, align: "center" });
    pageNum(s, slideN);
  }

  // ─── SLIDE 24: AGENTIC AI VS CHATBOTS ───────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Agentic AI vs Chatbots: Why Agents Win");

    const acH = [
      { text: "Dimension", w: 1.8 },
      { text: "Chatbots (Doubao, etc.)", w: 3.5 },
      { text: "Agentic AI (Claude Code, etc.)", w: 3.6, accent: true },
    ];
    const acR = [
      [{ text: "Core Function", bold: true }, "Respond to messages", { text: "Analyze, plan, take action", bold: true }],
      [{ text: "Autonomy", bold: true }, "Reactive (waits)", { text: "Proactive (initiates)", bold: true }],
      [{ text: "Memory", bold: true }, "Session-based", { text: "Persistent, context-aware", bold: true }],
      [{ text: "Integration", bold: true }, "Limited to chat", { text: "Deep system integration", bold: true }],
      [{ text: "Data Source", bold: true }, "Static FAQs", { text: "Live systems + real-time", bold: true }],
      [{ text: "Learning", bold: true }, "Manual updates", { text: "Continuous improvement", bold: true }],
    ];
    addTable(s, pr, M, 1.15, CW, acH, acR, { rowH: 0.36, fontSize: 9 });

    // Market validation
    txt(s, "Market Validation", M, 3.65, 3, 0.22, { size: 11, bold: true, color: C.dark });
    const mvH = [
      { text: "Metric", w: 4.0 },
      { text: "Value", w: 4.9, accent: true },
    ];
    const mvR = [
      ["AI Assistant Market 2025", "$3.35-14.14 billion"],
      ["Projected 2030", "$21-71 billion (CAGR 22-44.5%)"],
      ["Gartner Prediction", "33% enterprise software includes agentic AI by 2028"],
    ];
    addTable(s, pr, M, 3.9, CW, mvH, mvR, { rowH: 0.28, fontSize: 9 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 25: CLAWDBOT ARCHITECTURE ────────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Clawdbot: The OS-Native Agent Architecture");

    // Principles
    const cpH = [
      { text: "Principle", w: 2.0 },
      { text: "Implementation", w: 6.9, accent: true },
    ];
    const cpR = [
      [{ text: "OS-Native", bold: true }, "Lives in the OS, not an app"],
      [{ text: "Tool-First", bold: true }, "Uses CLI, APIs rather than UI automation"],
      [{ text: "Persistent Context", bold: true }, "Long-term memory across sessions"],
      [{ text: "Offline-Capable", bold: true }, "On-device LLMs when possible"],
      [{ text: "Multi-Agent", bold: true }, "Coordinates specialized agents"],
    ];
    addTable(s, pr, M, 1.15, CW, cpH, cpR, { rowH: 0.32, fontSize: 10 });

    // Architecture diagram (simplified)
    const dy = 2.95;
    txt(s, "Technical Stack", M, dy, 3, 0.22, { size: 11, bold: true, color: C.dark });
    addCard(s, pr, M, dy+0.25, CW, 2.0);
    // Top row: Skills, Plugins, Memories
    const tw = 2.5, tg = 0.4, tsx = M+0.3;
    ["Skills\n(Reusable Workflows)", "Plugins\n(System Integrations)", "Memories\n(Persistent Context)"].forEach((label, i) => {
      addCard(s, pr, tsx+i*(tw+tg), dy+0.4, tw, 0.55, { border: C.lightPurple, fill: C.nearWhite });
      txt(s, label, tsx+i*(tw+tg)+0.1, dy+0.42, tw-0.2, 0.5, { size: 8, color: C.dark, align: "center", valign: "middle" });
    });
    // Center: Agent Orchestrator
    addCard(s, pr, M+CW/2-1.5, dy+1.1, 3, 0.5, { border: C.accent, fill: C.lavender });
    txt(s, "Agent Orchestrator\n(Claude / Codex / Gemma)", M+CW/2-1.4, dy+1.12, 2.8, 0.46, { size: 9, bold: true, color: C.dark, align: "center", valign: "middle" });
    // Bottom row: LLMs
    ["On-Device LLM\n(Gemma 3B)", "Cloud LLM\n(Claude API)", "Open Source\n(Llama 3)"].forEach((label, i) => {
      addCard(s, pr, tsx+i*(tw+tg), dy+1.7, tw, 0.45, { border: C.thinLine, fill: C.nearWhite });
      txt(s, label, tsx+i*(tw+tg)+0.1, dy+1.72, tw-0.2, 0.4, { size: 7, color: C.body, align: "center", valign: "middle" });
    });
    pageNum(s, slideN);
  }

  // ─── SLIDE 26: CHAT-APP LIMITATIONS + SMARTPHONE ────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "OS-Native Agents vs Chat-App Limitations");

    const capH = [
      { text: "Capability", w: 2.5 },
      { text: "Chat-App", w: 1.5 },
      { text: "OS-Native Agent", w: 4.9, accent: true },
    ];
    const capR = [
      [{ text: "File System", bold: true }, "❌ No", { text: "✅ Full access", bold: true }],
      [{ text: "Background Tasks", bold: true }, "❌ No", { text: "✅ Yes", bold: true }],
      [{ text: "Notifications", bold: true }, "❌ Limited", { text: "✅ Full control", bold: true }],
      [{ text: "Cross-App", bold: true }, "❌ No", { text: "✅ Via APIs", bold: true }],
      [{ text: "Offline", bold: true }, "❌ No", { text: "✅ On-device LLM", bold: true }],
      [{ text: "Custom Tools", bold: true }, "❌ No", { text: "✅ Yes", bold: true }],
    ];
    addTable(s, pr, M, 1.15, CW, capH, capR, { rowH: 0.32, fontSize: 9 });

    // Smartphone future
    txt(s, "The Agent-Centric Future", M, 3.35, 4, 0.22, { size: 11, bold: true, color: C.dark });
    const sfR = [
      ["AI agents replace 80% of customer service", "By 2029 (Gartner)"],
      ["33% enterprise software includes agentic AI", "By 2028 (Gartner)"],
      ["Apps decline, modular agents embedded", "By 2030"],
    ];
    sfR.forEach((r, i) => {
      txt(s, "•  " + r[0], M+0.1, 3.6+i*0.26, 5.5, 0.26, { size: 9, color: C.body, valign: "middle" });
      txt(s, r[1], M+5.8, 3.6+i*0.26, 3.0, 0.26, { size: 9, bold: true, color: C.accent, valign: "middle" });
    });

    addQuote(s, "Chat-apps are the past. OS-native agents are the future. The winners won't be apps that wrap AI in a chat interface — they'll be agents that live in the OS.",
      null, M, 4.45, CW, { h: 0.45, size: 9, barColor: C.deepPurple });
    pageNum(s, slideN);
  }

  // ─── SLIDE 27: AGI PATH + CLAWDBOT VISION ──────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "The AGI Path: Self-Evolving AI");

    // Self-evolving loop
    addCard(s, pr, M, 1.2, CW, 0.8);
    txt(s, "Agent Uses Tools  →  Observes Results  →  Learns from Feedback  →  Creates Better Tools  →  Repeat", M+0.2, 1.3, CW-0.4, 0.6, {
      size: 12, bold: true, color: C.dark, align: "center", valign: "middle",
    });
    txt(s, "Key Insight: Tools can create tools. This is AGI.", M, 2.1, CW, 0.25, { size: 11, italic: true, color: C.accent, align: "center" });

    // Clawdbot vision
    txt(s, "The Clawdbot Vision: A Personal AI That...", M, 2.55, CW, 0.22, { size: 12, bold: true, color: C.dark });
    const vision = [
      { text: "Understands your goals from natural language", bold: false },
      { text: "Plans multi-step tasks across systems", bold: false },
      { text: "Creates custom tools when needed", bold: false },
      { text: "Executes autonomously with minimal supervision", bold: false },
      { text: "Learns from every interaction to improve", bold: false },
      { text: "Evolves its own capabilities over time", bold: false },
    ];
    vision.forEach((v, i) => {
      circleNum(s, pr, M+0.2, 2.85+i*0.3, 0.25, i+1, { fontSize: 9, fill: C.lavender, border: C.accent });
      txt(s, v.text, M+0.55, 2.85+i*0.3, CW-0.8, 0.25, { size: 10, color: C.body, valign: "middle" });
    });
    pageNum(s, slideN);
  }

  // ─── SLIDE 28: AGENTIC AI WARS — CAPABILITIES MATRIX ───────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Agentic AI Wars: The $650B Arms Race", "智能体AI大战：执行摘要");

    // Compact matrix (most important companies)
    const mxH = [
      { text: "Company", w: 1.3 },
      { text: "Product", w: 1.6 },
      { text: "B2B", w: 0.7 },
      { text: "B2C", w: 0.7 },
      { text: "2026 CapEx", w: 1.2 },
      { text: "Flywheel", w: 0.9 },
      { text: "Verdict", w: 2.5, accent: true },
    ];
    const star = (n) => "★".repeat(n) + "☆".repeat(5-n);
    const mxR = [
      [{ text: "Google", bold: true }, "Project Mariner", star(5), star(5), "$175-185B", star(5), { text: "Agentic Native", bold: true }],
      [{ text: "Microsoft", bold: true }, "Copilot Agents", star(5), star(3), "~$150B", star(4), "Agentic Platform"],
      [{ text: "Amazon", bold: true }, "Amazon Q", star(5), star(3), "$200B", star(4), "Infrastructure"],
      [{ text: "Meta", bold: true }, "Meta AI", star(3), star(5), "$115-135B", star(5), { text: "Emerging Native", bold: true }],
      [{ text: "OpenAI", bold: true }, "Operator", star(3), star(5), "$40B+", star(3), { text: "Pioneer at Risk", color: C.coral }],
      [{ text: "Anthropic", bold: true }, "Cowork", star(5), star(2), "$6B+", star(3), { text: "Best Tech, Ltd Dist", color: C.amber }],
      [{ text: "NVIDIA", bold: true }, "NIM/AgentIQ", star(5), star(1), "N/A", star(5), "Infra Monopoly"],
      [{ text: "Apple", bold: true }, "Siri 2.0", star(2), star(4), "~$10B", star(2), { text: "Laggard at Risk", color: C.coral }],
    ];
    addTable(s, pr, M, 1.15, CW, mxH, mxR, { rowH: 0.3, fontSize: 8 });

    addQuote(s, "2026 is the year of agentic AI. The battleground has shifted from 'who has the best chatbot' to 'who can build the most reliable autonomous agent ecosystem.'",
      null, M, 3.85, CW, { h: 0.5, size: 9, barColor: C.deepPurple });

    txt(s, "Tesla FSD template: Real-world Data → Model Training → Improved Performance → More Users → More Data", M, 4.5, CW, 0.2, { size: 8, color: C.muted, align: "center" });
    pageNum(s, slideN);
  }

  // ─── SLIDE 29: STRATEGIC IMPLICATIONS + FLYWHEEL ────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Strategic Implications & Flywheel Formula");

    // Winners / At-Risk / Dark Horses
    const secY = 1.15;
    const secW = (CW-0.4)/3;

    // Winners
    addCard(s, pr, M, secY, secW, 1.8, { border: C.teal });
    txt(s, "Winners", M+0.1, secY+0.08, secW-0.2, 0.22, { size: 11, bold: true, color: C.teal });
    const winners = [
      { text: "Google — Personal intelligence flywheel" },
      { text: "Microsoft — Enterprise orchestration" },
      { text: "NVIDIA — Infrastructure monopoly" },
      { text: "Meta — Open ecosystem + 3B users" },
    ];
    bullets(s, winners, M+0.15, secY+0.35, secW-0.3, { size: 8, lineH: 0.28 });

    // At-Risk
    addCard(s, pr, M+secW+0.2, secY, secW, 1.8, { border: C.coral });
    txt(s, "At-Risk", M+secW+0.3, secY+0.08, secW-0.2, 0.22, { size: 11, bold: true, color: C.coral });
    const atRisk = [
      { text: "OpenAI — No owned distribution" },
      { text: "Anthropic — Premium limits scale" },
      { text: "Apple — 2-3 years behind" },
    ];
    bullets(s, atRisk, M+secW+0.35, secY+0.35, secW-0.3, { size: 8, lineH: 0.28 });

    // Dark Horses
    addCard(s, pr, M+2*(secW+0.2), secY, secW, 1.8, { border: C.amber });
    txt(s, "Dark Horses", M+2*(secW+0.2)+0.1, secY+0.08, secW-0.2, 0.22, { size: 11, bold: true, color: C.amber });
    const horses = [
      { text: "xAI — Real-time data + gov contracts" },
      { text: "Amazon — AWS + Bedrock platform" },
    ];
    bullets(s, horses, M+2*(secW+0.2)+0.15, secY+0.35, secW-0.3, { size: 8, lineH: 0.28 });

    // Flywheel formula
    const fy = 3.2;
    addCard(s, pr, M, fy, CW, 0.4, { border: C.deepPurple, fill: C.lavender });
    txt(s, "Data Scale + Distribution Control + Custom Silicon + Vertical Integration = Agentic AI Winner", M+0.2, fy+0.05, CW-0.4, 0.3, {
      size: 11, bold: true, color: C.deepPurple, align: "center", valign: "middle",
    });

    // Scoring (top companies only)
    const fwH = [
      { text: "Company", w: 1.3 },
      { text: "Data", w: 1.5 },
      { text: "Distribution", w: 1.5 },
      { text: "Silicon", w: 1.5 },
      { text: "Integration", w: 1.5 },
      { text: "Score", w: 1.1, accent: true },
    ];
    const fwR = [
      [{ text: "Google", bold: true }, star(5), star(5), star(5), star(5), { text: "20/20", bold: true }],
      [{ text: "Meta", bold: true }, star(5), star(5), star(3), star(4), "18/20"],
      [{ text: "Microsoft", bold: true }, star(4), star(5), star(3), star(4), "17/20"],
      [{ text: "OpenAI", bold: true }, star(3), star(3), star(1), star(2), { text: "9/20", color: C.coral }],
      [{ text: "Anthropic", bold: true }, star(2), star(2), star(1), star(2), { text: "7/20", color: C.coral }],
    ];
    addTable(s, pr, M, fy+0.5, CW, fwH, fwR, { rowH: 0.26, fontSize: 8 });
    pageNum(s, slideN);
  }

  // ─── SLIDE 30: APPENDIX ─────────────────────────────────────────
  {
    const s = newSlide(bg(slideN));
    titleSlide(s, "Appendix: Key Metrics & Timeline", "附录");

    // Key metrics (compact)
    const akH = [
      { text: "Category", w: 1.6 },
      { text: "Metric", w: 3.8 },
      { text: "Value", w: 3.5, accent: true },
    ];
    const akR = [
      ["Market", "Global software dev value", { text: "$3 trillion", bold: true }],
      ["SaaS Rout", "Feb 4, 2026 single-day wipeout", { text: "$285 billion", bold: true }],
      ["Autonomy", "Claude Opus 4.5 (SWE-bench)", { text: "80.9%", bold: true }],
      ["Agent Teams", "16 parallel Claudes, 100K-line compiler", { text: "$20K cost", bold: true }],
      ["Adoption", "Anthropic engineers using daily", { text: "80%+", bold: true }],
      ["Revenue", "Claude Code (Nov 2025)", { text: "$1 billion", bold: true }],
      ["Self-Written", "Claude Code codebase", { text: "90%", bold: true }],
      ["Valuation", "Anthropic (Feb 2026, in talks)", { text: "$350 billion", bold: true }],
    ];
    addTable(s, pr, M, 1.1, CW, akH, akR, { rowH: 0.26, fontSize: 8 });

    // Timeline
    const tly = 3.3;
    txt(s, "Timeline of Key Events", M, tly, 3, 0.22, { size: 10, bold: true, color: C.dark });
    const events = [
      ["Late 2024", "Google >25% AI-generated code"],
      ["Oct 2025", 'Meta "Think 5X" mandate'],
      ["Nov 2025", "Claude Code reaches $1B revenue"],
      ["Dec 2025", "Claude Code inflection — 300+ PRs"],
      ["Jan 2026", "ROCm breakthrough (~30 min CUDA port)"],
      ["Feb 4, 2026", '"SaaSpocalypse" — $285B stock rout'],
      ["Feb 5, 2026", "Agent Teams — 16 Claudes build compiler"],
    ];
    events.forEach((e, i) => {
      txt(s, e[0], M+0.05, tly+0.25+i*0.22, 1.3, 0.22, { size: 8, bold: true, color: C.accent, valign: "middle" });
      txt(s, e[1], M+1.4, tly+0.25+i*0.22, 6.5, 0.22, { size: 8, color: C.body, valign: "middle" });
    });

    // Footer
    txt(s, "Document Version: r1.0  |  Release Date: February 2026  |  Enriched with OpenAI Mandate & Claude Code Research", M, SH-0.4, CW, 0.2, { size: 7, color: C.muted, align: "center" });
    pageNum(s, slideN);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  WRITE OUTPUT
  // ═══════════════════════════════════════════════════════════════════

  TOTAL = slideN; // Update total for page numbers
  console.log(`\nGenerated ${slideN} slides.`);
  console.log("Writing PPTX...");
  await pr.writeFile({ fileName: OUTPUT });
  console.log(`Saved: ${path.resolve(OUTPUT)}`);
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
