const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-dark-community";
const SW = 13.333, SH = 7.5;
const TOTAL = 1;

// ─── STYLE ─────────────────────────────────────────────────────────
const STYLE = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K — every detail crisp and sharp.

BACKGROUND: White (#FFFFFF) to very light cool gray (#F5F7FA). Clean, corporate, institutional — Linux Foundation press release style.

TYPOGRAPHY:
- English text: Manrope font (geometric modern sans-serif)
- Chinese text: Noto Sans SC font (clean Chinese sans-serif)
- Title: font-weight 700, color #003366 (deep corporate blue), 32-36pt
- Section headers: font-weight 700, 20-24pt
- Body: font-weight 300, color #444444, 16-18pt
- Badge/stat text: font-weight 700
- ALL TEXT IN CHINESE. Do NOT repeat English translations of Chinese text. English only for proper nouns (AGENTS.md, NLSpec, Vouch, Attractor, PR-Agent).

ILLUSTRATION STYLE (CRITICAL — THIS IS THE MOST IMPORTANT PART):
Every level MUST have LARGE, DETAILED illustrations that dominate the visual space. Text is secondary.
- Corporate blue (#003366, #0066CC, #4A90D9) as primary palette with teal (#00A99D) and navy accents
- ABSTRACT AI FIGURES — NOT cartoonish robots. Use:
  * Glowing orbs / neural network nodes / constellation patterns to represent AI agents
  * Abstract geometric shapes (hexagons, circles, flowing curves) for intelligence
  * Gradient light trails and connection beams for agent-to-agent communication
  * Soft luminous halos around AI nodes — sophisticated, almost spiritual
  * Minimal human figures — only use simple silhouettes when absolutely necessary, keep them small
- Accent colors: teal (#00A99D) for trust/approval, coral (#E8636F) for rejection
- CLEAN CORPORATE vector-style illustrations — NOT hand-drawn sketches
- Think: Linux Foundation annual report, World Economic Forum infographic, Deloitte digital transformation deck
- Each illustration should be LARGE scene compositions, not tiny icons
- Cards use white background with thin blue left border, NO SHADOW, rounded 12px. NO drop shadows or shading on any card or panel.
- Generous whitespace — institutional, authoritative

Linux Foundation corporate PR aesthetic. Clean, institutional, authoritative, forward-looking.`;

// ─── SLIDE PROMPT ──────────────────────────────────────────────────
const slides = [

{
  prompt: `
TITLE (top-left, bold, #003366, Noto Sans SC, 34pt): "开源社区的演进"
Subtitle (Noto Sans SC, 16pt, #888): "从手动社区到黑灯社区 — L0-L5 框架推演"

LAYOUT: TWO COLUMNS side by side, each taking ~48% width with a narrow gap between them.

LEFT COLUMN: L0, L1, L2 stacked vertically (3 cards). Background progressively shifts from white to light blue-gray.
RIGHT COLUMN: L3, L4, L5 stacked vertically (3 cards). Background progressively shifts from light blue to deep dark navy.

A PROMINENT HORIZONTAL ARROW between the two columns at the midpoint, pointing LEFT→RIGHT, labeled "演进 →" — showing the progression from left column to right column.

Each card has: TOP-LEFT = level badge, LEFT ~40% = LARGE illustration, RIGHT ~60% = name + description text.

Use ABSTRACT AI representations (glowing orbs, neural constellation nodes, geometric shapes) NOT humanoid robots. Minimal human silhouettes — small and secondary.

═══════════════════════════════════════════════════════════════

LEFT COLUMN (人类主导阶段):
Small column header at top in italic gray: "人类主导"

─── CARD L0 (bg: white #FFFFFF, thin bottom border, rounded 12px) ───
Badge: "L0" in gray circle
ILLUSTRATION: A cluster of 3-4 MONITOR SCREENS showing code terminals. Small human silhouettes gesture and point. A central figure slightly larger (the BDFL). Mailing list envelopes flow between screens. Everything MANUAL. Light gray (#BBBBBB) vector style.
Text: "手动社区" (bold, 20pt, #003366) / "所有代码人写人审 · BDFL治理 · commit权即权力"

─── CARD L1 (bg: #F5F7FA, rounded 12px) ───
Badge: "L1" in light blue circle
ILLUSTRATION: A large terminal monitor. A small GLOWING ORB (AI) floats beside it emitting soft blue light, sending document icons (测试/文档) toward terminal. Tiny human silhouette at terminal, clearly dominant. CI/CD pipeline as connected hexagons with green checkmarks. Blue-gray vector.
Text: "辅助社区" (bold) / "AI辅助测试与文档 · 人审全部 · CI/CD自动化"

─── CARD L2 (bg: #EDF2F7, rounded 12px) ───
Badge: "L2" in blue circle (#0066CC)
ILLUSTRATION: A MONITOR and a GLOWING NEURAL CONSTELLATION (AI) at equal size, side by side. A prominent glowing "AGENTS.md" document bridges them. Data streams flow both ways. Floating badges: "60K+" and "93万PR". Corporate blue + teal vector.
★ Below card: coral (#E8636F) text: "← 大多数项目在这里" (bold)
Text: "协作社区" (bold) / "AGENTS.md引导 · 93万Agent PR · 人仍审每行"

═══════════════════════════════════════════════════════════════

RIGHT COLUMN (智能体主导阶段) — use the SAME light background as left column, NO dark shading, NO gray/blue tinted background on the right panel. Both columns should have the same clean white/light background. The darkening only applies to the L5 card itself.
Small column header at top in italic gray: "智能体主导"

─── CARD L3 (bg: #E3EBF3, HIGHLIGHTED — subtle blue glow border, rounded 12px) ───
Badge: "L3" in dark blue circle (#003366), 1.3× larger, subtle glow ring
ILLUSTRATION: THREE small concept icons in a ROW:
  (1) SHIELD icon surrounded by interconnected TRUST GRAPH nodes — teal lines for trusted (✓), coral dashed for rejected (✗). Label: "Vouch信任网络"
  (2) Abstract AI ORB on elevated position emitting scan beams onto a queue of documents — teal=approved, coral=rejected. Label: "智能审查"
  (3) Geometric GATEWAY pillars — documents pass through or get blocked by coral barrier. Label: "准入策略"
★ A bold downward ARROW below this card pointing to L4: "信任基础 ↓ 没有L3，L4无法运转" (bold, #003366)
Text: "信任社区" (bold, 22pt, #003366) / "信任框架是规范驱动的前提条件"

─── CARD L4 (bg: #D6E0EC, rounded 12px) ───
Badge: "L4" in navy circle
ILLUSTRATION (LEFT→RIGHT mini-flow):
  A RADIANT DOCUMENT icon labeled "NLSpec" glowing as source of truth → ARROW with energy sparks → ABSTRACT AI WORKSPACE (glowing orb producing code files, test results, binaries) → RECYCLING symbol with old code dissolving. Label: "代码可丢弃"
  Small text below: "Attractor: 纯Markdown → 16K Rust + 9.5K Go + 6.7K TypeScript"
Text: "规范社区" (bold) / "NLSpec是唯一真相 · 代码是编译产物"

─── CARD L5 (bg: DARK gradient #0A1628, all text WHITE, rounded 12px) ───
Badge: "L5" in glowing teal circle with pulsing glow
ILLUSTRATION (atmospheric):
  DARK SPACE — 5-6 luminous AI NODES in a FULLY CONNECTED MESH. Teal/blue connection beams between all nodes. Nodes pulse with neural patterns. Self-maintaining: energy circulates autonomously. One tiny faint human silhouette behind a translucent barrier, holding a scroll labeled "价值观". No external light — only the mesh's own glow. Ethereal, elegant.
Text: "黑灯社区" (bold, white, 24pt) / "智能体自治 · 人类只定义价值观"

═══════════════════════════════════════════════════════════════

BOTTOM STRIP — MUST span the FULL PAGE WIDTH from left edge to right edge (100% width, no margin). Light blue gradient background from #4A90D9 (left) to #00A99D (teal, right). 60px tall, positioned at the very bottom of the slide touching both edges.
Center text: "核心转变：从 '谁写代码' → '谁定义价值观'" (Noto Sans SC, bold, 22pt, white, centered horizontally)`
},

];

// ─── GENERATION ENGINE ──────────────────────────────────────────────
async function genSlide(ai, idx) {
  const s = slides[idx];
  const outFile = path.join(SLIDE_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);

  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`Cached: slide ${idx + 1}`);
    return outFile;
  }

  const fullPrompt = STYLE + "\n\n" + s.prompt;

  for (let a = 1; a <= 3; a++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        config: {
          responseModalities: ["IMAGE", "TEXT"],
          imageConfig: { aspectRatio: "16:9", imageSize: "4K" },
        },
      });
      for (const p of (res.candidates?.[0]?.content?.parts || [])) {
        if (p.inlineData) {
          const buf = Buffer.from(p.inlineData.data, "base64");
          fs.writeFileSync(outFile, buf);
          console.log(`Slide ${idx + 1}: ${(buf.length / 1024).toFixed(0)}KB`);
          return outFile;
        }
      }
      console.log(`Slide ${idx + 1}: no image, attempt ${a}/3`);
    } catch (err) {
      console.log(`Slide ${idx + 1}: error ${a}/3 — ${err.message?.slice(0, 200)}`);
      if (a < 3) await new Promise(r => setTimeout(r, 15000));
    }
  }
  console.log(`Slide ${idx + 1}: FAILED after 3 attempts`);
  return null;
}

async function main() {
  if (!fs.existsSync(SLIDE_DIR)) fs.mkdirSync(SLIDE_DIR);
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  console.log(`Generating ${TOTAL} slide(s) at 4K...`);
  const paths = [];

  for (let i = 0; i < slides.length; i++) {
    const p = await genSlide(ai, i);
    paths.push(p);
  }

  // Build PPTX
  console.log("Building PPTX...");
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: SW, height: SH });
  pptx.layout = "WIDE";

  for (const p of paths) {
    const slide = pptx.addSlide();
    if (p && fs.existsSync(p)) {
      const b64 = "data:image/png;base64," + fs.readFileSync(p, "base64");
      slide.addImage({ data: b64, x: 0, y: 0, w: SW, h: SH });
    }
  }

  const outFile = "黑灯社区.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${TOTAL} slides)`);
}

main().catch(err => console.error("Fatal:", err));
