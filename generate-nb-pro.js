const { GoogleGenAI } = require("@google/genai");
const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3-pro-image-preview";
const OUTDIR = "slides-nbpro";
const OUTPUT = "Agentic_SE_Playbook_NBPro.pptx";

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ── Shared style prefix for every prompt ──────────────────────────────
const STYLE = `You are a world-class presentation designer. Generate a single presentation slide image.

CANVAS: 1920×1080 pixels, 16:9 landscape orientation.

DESIGN SYSTEM (follow precisely):
- BACKGROUND: Soft radial gradient from white (#FFFFFF) at center to pale lavender (#E8E0F0) at edges. Subtle, not harsh.
- TITLE TEXT: Dark purple (#2D1B4E), bold, clean sans-serif font (like Helvetica or Inter).
- BODY TEXT: Dark charcoal (#333333), regular weight, clean sans-serif.
- ACCENT COLOR: Medium purple (#6B4FA0) for highlights, numbers, icons, and decorative elements.
- LIGHT ACCENT: Pale purple (#D4C5E8) for borders, divider lines, and subtle backgrounds.
- DECORATIVE ELEMENTS: Very thin (1-2px) wireframe/mono-line abstract sketches in light purple (#C4B0DB). These should be subtle corner or edge decorations — small connected nodes, thin curved lines, tiny circles. Never busy or distracting. Stay in margins/corners only.
- CARDS/PANELS: Rounded rectangles with very thin (#D4C5E8) 1px borders and white (#FAFAFA) fill.
- SLIDE NUMBER: Small text in bottom-right corner, gray (#999999), format "N / 13".
- MARGINS: At least 80px on all sides. Content should breathe.
- NO logos, NO photos, NO 3D elements, NO drop shadows, NO gradients on text.
- Text must be PIXEL-PERFECT and EXACTLY as specified — every word, every letter, every punctuation mark.
- Use clear visual hierarchy: title largest, subtitles medium, body text readable.

`;

// ── Per-slide prompts ─────────────────────────────────────────────────
const SLIDES = [
  // SLIDE 1: Cover
  {
    file: "slide-01.png",
    prompt: `${STYLE}
SLIDE 1 OF 13 — COVER SLIDE

Layout:
- Top-left corner: Small label "PLAYBOOK" in uppercase, letter-spaced, purple (#6B4FA0), 14px equivalent.
- Center of slide, slightly above middle:
  - Line 1: "Agentic Software Engineering" in dark purple (#2D1B4E), very large bold text (approx 56px equivalent).
  - Line 2: "Playbook" in dark purple (#2D1B4E), very large bold text, same size as line 1.
  - Below, with 24px gap: "From OpenAI's Internal Transformation" in medium gray (#666666), 20px equivalent.
- Below the subtitle, centered, with 40px gap:
  - A thin horizontal purple line, about 120px wide, centered.
- Below the line, with 24px gap:
  - Italic quote: "\u201CSoftware development is undergoing a renaissance in front of our eyes.\u201D" in charcoal (#444444), 18px equivalent.
  - Below: "\u2014 Greg Brockman, OpenAI Co-founder" in gray (#888888), 14px equivalent.
- Bottom-center: "For Engineering Teams, Tech Leads, CTOs  |  February 2026" in small gray (#999999) text, 12px equivalent.
- Decorative: Very subtle thin wireframe constellation pattern in bottom-right corner area, light purple lines.
- Slide number: "1 / 13" in bottom-right.
`
  },

  // SLIDE 2: December 2025 Inflection Point
  {
    file: "slide-02.png",
    prompt: `${STYLE}
SLIDE 2 OF 13 — THE DECEMBER 2025 INFLECTION POINT

Layout:
- Title at top-left (with 80px margin): "The December 2025 Inflection Point" in dark purple, bold, ~36px equivalent.
- Thin purple accent line under title, about 200px wide.

- Below title, TWO CARDS side by side (each about 45% width, equal height):

  LEFT CARD — header bar with light purple (#E8E0F0) background:
    Header: "Before December 2025" in purple (#6B4FA0), bold, 16px.
    Body (white background, bulleted list):
    • "Codex for unit tests only"
    • "Limited to simple tasks"
    • "Experimental tool"
    All in charcoal, 14px.

  RIGHT CARD — header bar with light purple background:
    Header: "After December 2025" in purple (#6B4FA0), bold, 16px.
    Body (white background, bulleted list):
    • "Codex writes essentially all code"
    • "Handles operations and debugging"
    • "Primary development interface"
    All in charcoal, 14px. Bold the key phrases.

- Below cards, section labeled "Real-World Proof" in purple, bold, 18px:
  Two horizontal info boxes side by side:

  Box 1: "Sora Android App" (bold) — "4 engineers · 18 days · vs 3\u20136 months traditional" — right-aligned accent: "~10x faster" in large purple text.

  Box 2: "C Compiler (100K lines)" (bold) — "16 parallel agents · ~2,000 sessions · $20K API cost" — right-aligned accent: "Compiles Linux 6.9 kernel" in purple.

- Small footer text: "Catalyst: GPT-5.2-Codex \u2014 long-horizon work, large code changes, leading SWE-Bench Pro" in gray, 11px.
- Slide number: "2 / 13" in bottom-right.
- Decorative: Very subtle thin circuit/node wireframe in top-right corner.
`
  },

  // SLIDE 3: Adoption Metrics
  {
    file: "slide-03.png",
    prompt: `${STYLE}
SLIDE 3 OF 13 — ADOPTION METRICS

Layout:
- Title at top-left: "The Scale of Change" in dark purple, bold, ~36px.
- Thin purple accent line under title.

- CENTER of slide: Three large metric cards in a row, evenly spaced:

  CARD 1:
    Large number: "1M+" in very large bold purple (#6B4FA0), approximately 72px.
    Below: "Developers" in charcoal, 16px.
    Below: "using Codex" in charcoal, 16px.
    Small label below: "and growing" in light gray italic, 12px.

  CARD 2:
    Large number: "2x" in very large bold purple, approximately 72px.
    Below: "Usage growth" in charcoal, 16px.
    Below: "since GPT-5.2" in charcoal, 16px.
    Small label below: "nearly doubled" in light gray italic, 12px.

  CARD 3:
    Large number: "20x" in very large bold purple, approximately 72px.
    Below: "Growth since" in charcoal, 16px.
    Below: "August 2025" in charcoal, 16px.
    Small label below: "explosive adoption" in light gray italic, 12px.

  Each card has a thin purple border, rounded corners, white fill.

- Below cards, with spacing:
  "Enterprise Customers" label in purple, bold, 16px.
  Below: "Cisco  ·  Ramp  ·  Virgin Atlantic  ·  Vanta  ·  Duolingo  ·  Gap" in charcoal, 14px, centered.

- Slide number: "3 / 13" in bottom-right.
- Decorative: Subtle thin wireframe growth chart sketch in bottom-left corner area.
`
  },

  // SLIDE 4: March 31 Mandate
  {
    file: "slide-04.png",
    prompt: `${STYLE}
SLIDE 4 OF 13 — THE MARCH 31, 2026 MANDATE

Layout:
- Title at top-left: "The March 31, 2026 Mandate" in dark purple, bold, ~36px.
- Subtitle below title: "OpenAI's Organizational Targets" in gray (#666666), 18px.
- Thin purple accent line under subtitle.

- Two large cards stacked vertically, each spanning about 70% width, centered:

  CARD 1:
    Left side: Large purple circled number "1" (or just large "1" in purple).
    Right side:
      Title: "Tool of First Resort" in dark purple, bold, 20px.
      Body: "For any technical task, humans interact with an agent rather than using an editor or terminal." in charcoal, 15px.

  CARD 2:
    Left side: Large purple circled number "2".
    Right side:
      Title: "Safe & Productive Default" in dark purple, bold, 20px.
      Body: "Agent utilization is explicitly evaluated as safe, but also productive enough that most workflows don't need additional permissions." in charcoal, 15px.

- Right side of slide (about 25% width), a vertical sidebar panel with light purple (#F0EBF5) background:
  Title: "Why March 31?" in purple, bold, 16px.
  Three bullet points:
  • "Top-down organizational transformation"
  • "Not aspirational \u2014 operational deadline"
  • "Drives cultural change, not just tool adoption"
  In charcoal, 13px.

- Slide number: "4 / 13" in bottom-right.
- Decorative: Thin wireframe calendar/timeline sketch in bottom area.
`
  },

  // SLIDE 5: Traditional vs Agentic
  {
    file: "slide-05.png",
    prompt: `${STYLE}
SLIDE 5 OF 13 — TRADITIONAL VS AGENTIC ENGINEERING

Layout:
- Title at top-left: "Traditional vs Agentic Engineering" in dark purple, bold, ~36px.
- Thin purple accent line under title.

- Below title: A clean comparison table with 3 columns:
  Column headers in purple (#6B4FA0) bold, with light purple (#F0EBF5) background row:
  "Dimension" | "Traditional" | "Agentic"

  8 data rows, alternating white and very light gray (#FAFAFA) backgrounds:
  "First Action"      | "Open IDE, write code"         | "Prompt agent with intent"
  "Code Production"   | "Human writes line-by-line"     | "Agent generates, human reviews"
  "Debugging"         | "Manual trace, breakpoint"      | "Agent diagnoses and fixes"
  "Testing"           | "Write tests after code"        | "Agent writes tests first"
  "Documentation"     | "Write docs after shipping"     | "Spec-driven development"
  "Knowledge"         | "Code comments, wiki"           | "AGENTS.md + Skills"
  "Tool Usage"        | "Click UI, manual steps"        | "Agent invokes via CLI/MCP"
  "Speed"             | "Hours/days per feature"        | "Minutes with feedback loops"

  The "Dimension" column text should be in bold charcoal.
  "Traditional" column in regular charcoal.
  "Agentic" column in purple (#6B4FA0) to highlight the new approach.
  Use thin light purple (#D4C5E8) borders between rows.
  Each row about 14px text height with comfortable padding.

- A thin purple right-arrow icon (\u2192) between the Traditional and Agentic columns to show transformation direction.

- Slide number: "5 / 13" in bottom-right.
- Decorative: Subtle thin wireframe arrows/flow lines in bottom-right corner.
`
  },

  // SLIDE 6: 6-Pillar Overview
  {
    file: "slide-06.png",
    prompt: `${STYLE}
SLIDE 6 OF 13 — THE 6-PILLAR PLAYBOOK

Layout:
- Title at top-left: "The 6-Pillar Playbook" in dark purple, bold, ~36px.
- Subtitle: "OpenAI's Implementation Framework" in gray (#666666), 18px.
- Thin purple accent line under subtitle.

- Below: 6 cards arranged in a 3×2 grid (3 columns, 2 rows), evenly spaced:

  ROW 1:
  Card 1: Large purple "1" top-left. Title: "Adoption" in purple bold, 18px. Body: "Try the tools \u2014 designate \u201CAgents Captain\u201D per team" in charcoal 13px.
  Card 2: Large purple "2" top-left. Title: "AGENTS.md" in purple bold, 18px. Body: "Create machine-readable project handbook" in charcoal 13px.
  Card 3: Large purple "3" top-left. Title: "Tools" in purple bold, 18px. Body: "Make internal tools agent-accessible (CLI/MCP)" in charcoal 13px.

  ROW 2:
  Card 4: Large purple "4" top-left. Title: "Architecture" in purple bold, 18px. Body: "Restructure codebases for agent-first development" in charcoal 13px.
  Card 5: Large purple "5" top-left. Title: "Quality" in purple bold, 18px. Body: "\u201CSay no to slop\u201D \u2014 maintain review bar" in charcoal 13px.
  Card 6: Large purple "6" top-left. Title: "Infrastructure" in purple bold, 18px. Body: "Build observability, trajectory tracking" in charcoal 13px.

  Each card: thin purple border (#D4C5E8), rounded corners, white fill, subtle shadow optional.

- Slide number: "6 / 13" in bottom-right.
- Decorative: Thin wireframe hexagonal network pattern in corners.
`
  },

  // SLIDE 7: Pillar 1-2
  {
    file: "slide-07.png",
    prompt: `${STYLE}
SLIDE 7 OF 13 — PILLAR 1-2: ADOPTION & KNOWLEDGE

Layout:
- Title at top-left: "Pillar 1-2: Adoption & Knowledge" in dark purple, bold, ~36px.
- Thin purple accent line under title.

- Two columns, each taking ~48% width:

  LEFT COLUMN — Card with header:
    Header: Purple number "1" + "Cultural Adoption" in purple bold, 20px.
    Content — three rows showing challenge → solution:

    Row 1: "Engineers \u201Ctoo busy\u201D" (gray) → "\u201CAgents Captain\u201D role per team" (charcoal bold)
    Row 2: "Uncertainty" (gray) → "Shared internal channels" (charcoal bold)
    Row 3: "Lack of exposure" (gray) → "Company-wide Codex hackathon" (charcoal bold)

    Below, italic quote in purple: "\u201CThe tools do sell themselves.\u201D"

  RIGHT COLUMN — Card with header:
    Header: Purple number "2" + "AGENTS.md & Skills" in purple bold, 20px.
    Content — a code/file tree diagram in monospace font:

    project-root/
    \u251C\u2500\u2500 AGENTS.md
    \u2502   Project context, conventions
    \u251C\u2500\u2500 skills/
    \u2502   deploy.sh, test-suite.yml
    \u2514\u2500\u2500 src/

    (render this in a code-block style panel with light gray background)

    Below: "Industry Convergence" label in purple bold, 14px.
    "AGENTS.md (OpenAI, Google) \u00B7 CLAUDE.md (Anthropic) \u00B7 copilot-instructions.md (GitHub)" in small charcoal text, 12px.

- Slide number: "7 / 13" in bottom-right.
- Decorative: Subtle thin wireframe connected nodes in bottom corners.
`
  },

  // SLIDE 8: Pillar 3-4
  {
    file: "slide-08.png",
    prompt: `${STYLE}
SLIDE 8 OF 13 — PILLAR 3-4: TOOLS & ARCHITECTURE

Layout:
- Title at top-left: "Pillar 3-4: Tools & Architecture" in dark purple, bold, ~36px.
- Thin purple accent line under title.

- Two columns, each taking ~48% width:

  LEFT COLUMN — Card with header:
    Header: Purple number "3" + "Agent-Accessible Tooling" in purple bold, 20px.
    Content — three action items with left purple accent dots:

    \u2022 "Audit tools" (bold) \u2014 "Catalog team dependencies"
    \u2022 "Enable access" (bold) \u2014 "CLI wrappers or MCP servers"
    \u2022 "Assign ownership" (bold) \u2014 "One person per tool integration"

    Bottom callout box with light purple background:
    "MCP (Model Context Protocol)" in purple bold.
    "Emerging standard for agent-tool connections" in small charcoal.

  RIGHT COLUMN — Card with header:
    Header: Purple number "4" + "Agent-First Codebase" in purple bold, 20px.
    Content — four principles with purple accent icons:

    \u2022 "Fast tests" (purple bold) \u2014 "Agents iterate by running tests repeatedly"
    \u2022 "Clean interfaces" (purple bold) \u2014 "Agents reason about one component at a time"
    \u2022 "Strong types" (purple bold) \u2014 "Compiler acts as correctness checker"
    \u2022 "Clear boundaries" (purple bold) \u2014 "Agents work on isolated components"

    Each item about 13-14px text.

- Slide number: "8 / 13" in bottom-right.
- Decorative: Subtle thin wireframe tool/gear outlines in top-right corner.
`
  },

  // SLIDE 9: Pillar 5-6
  {
    file: "slide-09.png",
    prompt: `${STYLE}
SLIDE 9 OF 13 — PILLAR 5-6: QUALITY & INFRASTRUCTURE

Layout:
- Title at top-left: "Pillar 5-6: Quality & Infrastructure" in dark purple, bold, ~36px.
- Thin purple accent line under title.

- Two columns:

  LEFT COLUMN — Card with header:
    Header: Purple "5" + "\u201CSay No to Slop\u201D" in purple bold, 20px.
    Three rules with left purple accent bar:
    1. "Human accountability" (bold) \u2014 "Someone accountable for all merged code"
    2. "Same review bar" (bold) \u2014 "Maintain standard for agent-generated code"
    3. "Author comprehension" (bold) \u2014 "No \u201Cvibe merging\u201D \u2014 understand what you submit"

    Below, a callout box with warning style (light amber or light purple background):
    "The \u201CSlop\u201D Problem" in bold.
    "Functionally correct but poorly maintainable \u2014 passes tests but introduces technical debt." in small italic.

  RIGHT COLUMN — Card with header:
    Header: Purple "6" + "Infrastructure for Agents" in purple bold, 20px.
    Four items:
    \u2022 "Observability" (purple bold) \u2014 "Monitor agent performance and success rates"
    \u2022 "Trajectory tracking" (purple bold) \u2014 "Capture reasoning path, not just output"
    \u2022 "Tool management" (purple bold) \u2014 "Governance over agent tool access"
    \u2022 "Feedback loops" (purple bold) \u2014 "Internal usage data drives improvements"

- Slide number: "9 / 13" in bottom-right.
- Decorative: Thin wireframe quality-check/shield outline in bottom-right.
`
  },

  // SLIDE 10: Evolving Engineer Role
  {
    file: "slide-10.png",
    prompt: `${STYLE}
SLIDE 10 OF 13 — THE EVOLVING ENGINEER ROLE

Layout:
- Title at top-left: "The Evolving Engineer Role" in dark purple, bold, ~36px.
- Subtitle: "From Writer to Orchestrator" in gray (#666666), 18px.
- Thin purple accent line.

- Main content: A transformation table showing old → new focus:
  Two column headers: "Old Focus" (gray) and "New Focus" (purple bold)
  Between them: a purple arrow (\u2192) icon.

  6 rows, each showing the shift:
  "Writing implementation code"       \u2192  "Designing agent-implementable systems"
  "Manual coding"                     \u2192  "Writing specifications for agents"
  "Debugging line-by-line"            \u2192  "Reviewing and curating agent output"
  "Ad-hoc knowledge sharing"          \u2192  "Maintaining AGENTS.md & skills"
  "Single-threaded work"              \u2192  "Orchestrating multiple agents"
  "Low-level coding"                  \u2192  "Higher-order design & communication"

  Old Focus in regular charcoal. New Focus in bold charcoal. Arrow in purple.
  Thin divider lines between rows. Alternating subtle backgrounds.

- Bottom section: Small card:
  Title: "Spec-Driven Development" in purple bold, 16px.
  Three steps: "1. Engineer writes specification  \u2192  2. Agent implements against spec  \u2192  3. Spec = instruction set + acceptance criteria"
  In charcoal 12px.

- Slide number: "10 / 13" in bottom-right.
- Decorative: Thin wireframe person/orchestrator icon in top-right corner.
`
  },

  // SLIDE 11: Implementation Roadmap
  {
    file: "slide-11.png",
    prompt: `${STYLE}
SLIDE 11 OF 13 — IMPLEMENTATION ROADMAP

Layout:
- Title at top-left: "Implementation Roadmap" in dark purple, bold, ~36px.
- Thin purple accent line.

- A horizontal timeline/roadmap with 4 phases. Each phase is a vertical card connected by a thin purple horizontal line:

  PHASE 1 card — "Foundation" label in purple bold, subtitle "Weeks 1\u20132" in small gray:
    \u2022 Designate "Agents Captain"
    \u2022 Schedule Codex hackathon
    \u2022 Create initial AGENTS.md
    \u2022 Audit tooling accessibility

  PHASE 2 card — "Infrastructure" in purple bold, "Weeks 3\u20134" in gray:
    \u2022 Set up skills repository
    \u2022 Create MCP servers (top 5)
    \u2022 Establish review guidelines
    \u2022 Set up agent observability

  PHASE 3 card — "Optimization" in purple bold, "Weeks 5\u20138" in gray:
    \u2022 Optimize tests (<30s target)
    \u2022 Refine AGENTS.md from failures
    \u2022 Build skills library
    \u2022 Define quality metrics

  PHASE 4 card — "Scale" in purple bold, "Ongoing" in gray:
    \u2022 Regular AGENTS.md reviews
    \u2022 Continuous skills development
    \u2022 Infrastructure improvements

  Each card has thin purple border, white fill, and a circled phase number (1, 2, 3, 4) in purple at the top.
  Cards connected by thin purple arrow line.
  Text in each card: 12-13px charcoal.

- Slide number: "11 / 13" in bottom-right.
- Decorative: Thin wireframe timeline arrow stretching across bottom edge.
`
  },

  // SLIDE 12: Key Takeaways & Risks
  {
    file: "slide-12.png",
    prompt: `${STYLE}
SLIDE 12 OF 13 — KEY TAKEAWAYS & OPEN RISKS

Layout:
- Title at top-left: "Key Takeaways & Open Risks" in dark purple, bold, ~36px.
- Thin purple accent line.

- Two columns:

  LEFT COLUMN (55% width) — "Key Takeaways" header in purple bold 20px:
  6 numbered insights, each with a purple circled number:

  1  "Organizational transformation, not tool adoption"
  2  "Architect role becomes more critical"
  3  "AGENTS.md is the new README"
  4  "\u201CSay no to slop\u201D is the hardest pillar"
  5  "Agent infrastructure is a greenfield opportunity"
  6  "Navigate deliberately \u2014 transition is inevitable"

  Each line in charcoal, 14px. Numbers in purple bold.

  RIGHT COLUMN (40% width) — "Open Risks" header in purple bold 20px:
  4 risk items, each in a small card:

  Card 1: "Code ownership" (bold) — "Rigorous review, not rubber-stamping"
  Card 2: "Technical debt" (bold) — "New metrics for AI-generated drift"
  Card 3: "Security" (bold) — "\u201CSafe but productive\u201D balance"
  Card 4: "Skill atrophy" (bold) — "Maintain deep understanding for review"

  Each card with thin border and subtle warning accent (thin left bar in amber/orange #D4940A or just purple).

- Slide number: "12 / 13" in bottom-right.
- Decorative: Thin wireframe lightbulb/key icon in top-right corner.
`
  },

  // SLIDE 13: Appendix
  {
    file: "slide-13.png",
    prompt: `${STYLE}
SLIDE 13 OF 13 — APPENDIX: LANGUAGE-SPECIFIC NOTES

Layout:
- Title at top-left: "Appendix: Language-Specific Notes" in dark purple, bold, ~36px.
- Thin purple accent line.

- Three cards in a horizontal row, equal width:

  CARD 1 — Header: "Rust" in purple bold 20px.
    \u2713 "Type system = built-in correctness verification" (green check or purple check)
    \u26A0 "unsafe blocks need explicit AGENTS.md policy" (amber warning icon)
    \u26A0 "Build times may slow agent iteration"
    Text in charcoal, 13px.

  CARD 2 — Header: "C / C++" in purple bold 20px.
    \u26A0 "Less safety guardrails \u2192 more prescriptive AGENTS.md"
    \u26A0 "Memory management conventions must be explicit"
    Text in charcoal, 13px.

  CARD 3 — Header: "Python" in purple bold 20px.
    \u2713 "Large training corpus = agents perform well"
    \u26A0 "Mandate type hints and mypy in AGENTS.md"
    Text in charcoal, 13px.

  Each card: thin purple border, white fill, rounded corners.

- Bottom footer text centered:
  "Source: Greg Brockman's public post on OpenAI's internal agentic transformation  |  Compiled: February 2026"
  In small gray (#999999), 11px.

- Slide number: "13 / 13" in bottom-right.
- Decorative: Thin wireframe code bracket symbols in corners.
`
  },
];

// ── Generate images ───────────────────────────────────────────────────
async function generateSlide(idx) {
  const slide = SLIDES[idx];
  const outPath = path.join(OUTDIR, slide.file);

  // Skip if already cached
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
    console.log(`  [${idx + 1}/13] cached: ${slide.file}`);
    return outPath;
  }

  console.log(`  [${idx + 1}/13] generating ${slide.file} ...`);

  // Retry logic
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: "user", parts: [{ text: slide.prompt }] }],
        config: { responseModalities: ["IMAGE", "TEXT"] },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(outPath, buf);
          console.log(`  [${idx + 1}/13] OK: ${(buf.length / 1024).toFixed(0)}KB`);
          return outPath;
        }
      }

      // No image returned
      const reason = response.candidates?.[0]?.finishReason;
      console.log(`  [${idx + 1}/13] no image (reason: ${reason}), attempt ${attempt}/3`);

    } catch (err) {
      console.log(`  [${idx + 1}/13] error attempt ${attempt}/3: ${err.message?.slice(0, 200)}`);
      if (attempt < 3) {
        // Wait before retry (rate limit backoff)
        const wait = attempt * 15000;
        console.log(`  waiting ${wait / 1000}s ...`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }

  console.log(`  [${idx + 1}/13] FAILED after 3 attempts`);
  return null;
}

// ── Build PPTX ───────────────────────────────────────────────────────
async function buildPptx(imagePaths) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "WIDE";

  for (let i = 0; i < imagePaths.length; i++) {
    const imgPath = imagePaths[i];
    const slide = pptx.addSlide();

    if (imgPath && fs.existsSync(imgPath)) {
      // Full-bleed slide image
      const imgData = fs.readFileSync(imgPath).toString("base64");
      const ext = path.extname(imgPath).slice(1).toLowerCase();
      const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
      slide.addImage({
        data: `data:${mime};base64,${imgData}`,
        x: 0, y: 0, w: 13.333, h: 7.5,
        sizing: { type: "cover", w: 13.333, h: 7.5 },
      });
    } else {
      // Fallback: light purple background with error text
      slide.background = { color: "E8E0F0" };
      slide.addText(`Slide ${i + 1} — image generation failed`, {
        x: 1, y: 3, w: 11, h: 1.5,
        fontSize: 24, color: "2D1B4E", align: "center",
      });
    }
  }

  await pptx.writeFile({ fileName: OUTPUT });
  console.log(`\nPresentation saved: ${path.resolve(OUTPUT)}`);
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUTDIR, { recursive: true });

  console.log(`Generating 13 slides with ${MODEL} (Nano Banana Pro)...\n`);

  // Generate sequentially to avoid rate limits
  const imagePaths = [];
  for (let i = 0; i < SLIDES.length; i++) {
    const result = await generateSlide(i);
    imagePaths.push(result);

    // Small delay between requests to avoid rate limiting
    if (i < SLIDES.length - 1) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  // Check results
  const failed = imagePaths.filter(p => !p).length;
  if (failed > 0) {
    console.log(`\nWARNING: ${failed} slide(s) failed to generate.`);
  }

  console.log("\nBuilding PPTX...");
  await buildPptx(imagePaths);
}

main().catch(err => console.error("Fatal:", err));
