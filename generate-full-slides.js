const { GoogleGenAI } = require("@google/genai");
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash-exp-image-generation";
const IMG_DIR = path.join(__dirname, "slides-full");
fs.mkdirSync(IMG_DIR, { recursive: true });

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ============================================================
// STYLE GUIDE — shared across all prompts for consistency
// ============================================================
const STYLE = `
MANDATORY STYLE RULES (apply to EVERY slide):
- Presentation slide, 16:9 landscape aspect ratio, 1920×1080 pixels
- Background: subtle gradient from white (#FFFFFF) at top-left to pale lavender (#F0EBF8) at bottom-right
- All decorative elements: thin mono-weight purple wireframe line art (#9B7BC7, #C4B5D9), hand-drawn sketch feel
- Title text: large bold serif font (like Georgia), deep purple (#2D1B69), placed top-left with generous margin
- Body text: clean sans-serif (like Calibri), dark charcoal (#3D3252), left-aligned
- Accent color for highlights/emphasis: medium purple (#7B5EA7)
- Muted secondary text: soft purple-gray (#8E7BAF)
- Cards/containers: white rectangles with thin 1px purple (#C4B5D9) borders, subtle shadow
- NO photographs, NO photorealistic imagery, NO stock images
- NO company logos anywhere
- Subtle wireframe sketch illustrations related to the topic in corners or margins
- Clean, airy layout with 0.5" margins minimum, generous whitespace between elements
- Professional, editorial design quality — NOT a template, NOT generic
- ALL text must be PERFECTLY spelled and fully readable — this is critical
- Page number in bottom-right corner in small muted text
`;

// ============================================================
// SLIDE PROMPTS — each describes complete slide content + layout
// ============================================================
const SLIDES = [
  // SLIDE 1: COVER
  `${STYLE}
OVERRIDE for this slide only: Use a DARK purple gradient background (#1A0F40 to #3D2580). All text is white or light lavender. Decorative wireframe circuit/network sketch art in lighter purple lines on the right side.

LAYOUT: Title slide, text left-aligned in the left 60% of the slide.

CONTENT (render exactly):
- Small spaced-out label at top: "PLAYBOOK" (light purple, letter-spaced)
- Thin horizontal line below the label (2.5 inches wide)
- Main title (very large, ~40pt, bold, white):
  "Agentic Software
   Engineering Playbook"
- Subtitle (18pt, light lavender):
  "From OpenAI's Internal Transformation"
- Thin separator line
- Quote (14pt, italic, light):
  "Software development is undergoing a renaissance in front of our eyes."
  — Greg Brockman, OpenAI Co-founder
- Bottom left small text (10pt, muted):
  "For Engineering Teams, Tech Leads, CTOs  |  February 2026"

Decorative: Abstract wireframe constellation of connected nodes and flowing circuit paths on the right side, suggesting AI agent networks.`,

  // SLIDE 2: DECEMBER 2025
  `${STYLE}
LAYOUT: Title at top. Two side-by-side cards below (Before vs After). Two stat cards below those. Page "2 / 13" bottom-right.

CONTENT (render exactly):
TITLE: "The December 2025 Inflection Point" (32pt bold, deep purple)

LEFT CARD (white, thin border):
Header: "Before December 2025" (muted gray)
• Codex for unit tests only
• Limited to simple tasks
• Experimental tool

RIGHT CARD (white, purple border — emphasized):
Header: "After December 2025" (deep purple, bold)
• Codex writes essentially all code
• Handles operations and debugging
• Primary development interface

Below the cards, section label: "Real-World Proof" (bold)

BOTTOM LEFT STAT CARD (light fill):
"Sora Android App"
4 engineers · 18 days · vs 3-6 months traditional
"~10x faster" (purple, bold)

BOTTOM RIGHT STAT CARD (light fill):
"C Compiler (100K lines)"
16 parallel agents · ~2,000 sessions · $20K API cost
"Compiles Linux 6.9 kernel" (purple, bold)

Small italic footer: "Catalyst: GPT-5.2-Codex — long-horizon work, large code changes, leading SWE-Bench Pro"

Decorative: Subtle inflection curve sketch in background (exponential growth line).`,

  // SLIDE 3: METRICS
  `${STYLE}
LAYOUT: Title top. Three large stat callout cards centered side by side. Enterprise customer names below. Page "3 / 13".

CONTENT (render exactly):
TITLE: "The Scale of Change" (32pt bold, deep purple)

THREE STAT CARDS (white, thin border, centered):

Card 1:
Big number: "1M+" (48pt, bold, deep purple)
Label: "Developers using Codex"
Sub: "and growing" (italic, muted)

Card 2:
Big number: "2x" (48pt, bold, deep purple)
Label: "Usage growth since GPT-5.2"
Sub: "nearly doubled" (italic, muted)

Card 3 (purple border for emphasis):
Big number: "20x" (48pt, bold, deep purple)
Label: "Growth since August 2025"
Sub: "explosive adoption" (italic, muted)

Dashed separator line below cards.

"Enterprise Customers" (bold, centered)
"Cisco · Ramp · Virgin Atlantic · Vanta · Duolingo · Gap" (centered)

Decorative: Rising bar chart wireframe sketch in corner.`,

  // SLIDE 4: MANDATE
  `${STYLE}
LAYOUT: Title top. Subtitle. Two full-width goal cards with left purple accent bars. Bullet points section below. Page "4 / 13".

CONTENT (render exactly):
TITLE: "The March 31, 2026 Mandate" (32pt bold)
SUBTITLE: "OpenAI's Organizational Targets" (italic, muted)

GOAL CARD 1 (full width, thin border, purple accent bar on left edge):
"Goal 1: Tool of First Resort" (15pt bold, deep purple)
"For any technical task, humans interact with an agent rather than using an editor or terminal."

GOAL CARD 2 (full width, same style):
"Goal 2: Safe & Productive Default" (15pt bold, deep purple)
"Agent utilization is explicitly evaluated as safe, but also productive enough that most workflows don't need additional permissions."

SECTION: "Why March 31?" (16pt bold)
• Top-down organizational transformation
• Not aspirational — operational deadline
• Drives cultural change, not just tool adoption

Decorative: Target/bullseye wireframe sketch in right margin.`,

  // SLIDE 5: COMPARISON
  `${STYLE}
LAYOUT: Title top. Full-width comparison table with 3 columns. Alternating row backgrounds. Thin vertical divider between Traditional and Agentic columns. Page "5 / 13".

CONTENT (render exactly):
TITLE: "Traditional vs Agentic Engineering" (32pt bold)

TABLE HEADERS: "Dimension" (muted) | "Traditional" (muted) | "Agentic" (purple, bold)

ROWS (8 rows, alternating white/pale lavender backgrounds):
First Action | Open IDE, write code | Prompt agent with intent
Code Production | Human writes line-by-line | Agent generates, human reviews
Debugging | Manual trace, breakpoint | Agent diagnoses and fixes
Testing | Write tests after code | Agent writes tests first
Documentation | Write docs after shipping | Spec-driven development
Knowledge | Code comments, wiki | AGENTS.md + Skills
Tool Usage | Click UI, manual steps | Agent invokes via CLI/MCP
Speed | Hours/days per feature | Minutes with feedback loops

The "Dimension" column text should be bold deep purple. The "Agentic" column text should be bold deep purple. The "Traditional" column text should be regular dark gray.

Decorative: Subtle split visual — rigid grid lines on left fading to organic curved connections on right.`,

  // SLIDE 6: 6 PILLARS
  `${STYLE}
LAYOUT: Title and subtitle at top. 2×3 grid of 6 cards below, each with a numbered circle icon, title, and description. Page "6 / 13".

CONTENT (render exactly):
TITLE: "The 6-Pillar Playbook" (32pt bold)
SUBTITLE: "OpenAI's Implementation Framework" (italic, muted)

6 CARDS in 2 rows × 3 columns:

Card 1: Circle with "1" | "Adoption" (bold) | Try the tools — designate "Agents Captain" per team
Card 2: Circle with "2" | "AGENTS.md" (bold) | Create machine-readable project handbook
Card 3: Circle with "3" | "Tools" (bold) | Make internal tools agent-accessible (CLI/MCP)
Card 4: Circle with "4" | "Architecture" (bold) | Restructure codebases for agent-first development
Card 5: Circle with "5" | "Quality" (bold) | "Say no to slop" — maintain review bar
Card 6: Circle with "6" | "Infrastructure" (bold) | Build observability, trajectory tracking

Each card: white background, thin purple border, numbered circle in lavender fill with purple border. Card title in deep purple bold. Description in dark gray body text.

Decorative: Six thin classical pillars wireframe sketch subtly in background.`,

  // SLIDE 7: PILLAR 1-2
  `${STYLE}
LAYOUT: Title top. Two-column layout with thin dashed vertical divider. Left column = Pillar 1, Right column = Pillar 2. Page "7 / 13".

CONTENT (render exactly):
TITLE: "Pillar 1-2: Adoption & Knowledge" (32pt bold)

LEFT COLUMN:
Circle "1" icon + "Cultural Adoption" (16pt bold)

3 cards stacked vertically, each with:
Card 1 — challenge: "Engineers 'too busy'" → solution: "Agents Captain" role per team
Card 2 — challenge: "Uncertainty" → solution: Shared internal channels
Card 3 — challenge: "Lack of exposure" → solution: Company-wide Codex hackathon

Quote: "The tools do sell themselves." (italic, purple)

RIGHT COLUMN:
Circle "2" icon + "AGENTS.md & Skills" (16pt bold)

Code-style card (light fill, mono font) showing directory structure:
project-root/
├── AGENTS.md
│   Project context, conventions
├── skills/
│   deploy.sh, test-suite.yml
└── src/

Below: "Industry Convergence" (bold)
"AGENTS.md (OpenAI, Google) · CLAUDE.md (Anthropic) · copilot-instructions.md (GitHub)"

Decorative: People figures wireframe on left margin, open book sketch on right margin.`,

  // SLIDE 8: PILLAR 3-4
  `${STYLE}
LAYOUT: Title top. Two-column layout with dashed vertical divider. Left = Pillar 3, Right = Pillar 4. Page "8 / 13".

CONTENT (render exactly):
TITLE: "Pillar 3-4: Tools & Architecture" (32pt bold)

LEFT COLUMN:
Circle "3" + "Agent-Accessible Tooling" (15pt bold)

3 action cards:
"Audit tools" → Catalog team dependencies
"Enable access" → CLI wrappers or MCP servers
"Assign ownership" → One person per tool integration

Highlight card (lavender fill, purple border):
"MCP (Model Context Protocol)"
"Emerging standard for agent-tool connections"

RIGHT COLUMN:
Circle "4" + "Agent-First Codebase" (15pt bold)

4 principle cards (each with purple left accent bar):
"Fast tests" — Agents iterate by running tests repeatedly
"Clean interfaces" — Agents reason about one component at a time
"Strong types" — Compiler acts as correctness checker
"Clear boundaries" — Agents work on isolated components

Decorative: Gear/tool wireframe sketches on left, building blocks on right.`,

  // SLIDE 9: PILLAR 5-6
  `${STYLE}
LAYOUT: Title top. Two-column layout with dashed divider. Left = Pillar 5, Right = Pillar 6. Page "9 / 13".

CONTENT (render exactly):
TITLE: "Pillar 5-6: Quality & Infrastructure" (32pt bold)

LEFT COLUMN:
Circle "5" + '"Say No to Slop"' (15pt bold)

3 rule cards (each with purple left accent bar):
"Human accountability" — Someone accountable for all merged code
"Same review bar" — Maintain standard for agent-generated code
"Author comprehension" — No "vibe merging" — understand what you submit

Callout card (light fill, purple border):
'The "Slop" Problem'
"Functionally correct but poorly maintainable — passes tests but introduces technical debt." (italic)

RIGHT COLUMN:
Circle "6" + "Infrastructure for Agents" (15pt bold)

4 cards:
"Observability" — Monitor agent performance and success rates
"Trajectory tracking" — Capture reasoning path, not just output
"Tool management" — Governance over agent tool access
"Feedback loops" — Internal usage data drives improvements

Decorative: Shield with checkmark wireframe on left, dashboard wireframe on right.`,

  // SLIDE 10: EVOLVING ROLE
  `${STYLE}
LAYOUT: Title and subtitle top. Comparison rows with arrows in middle section. Spec-driven development flow at bottom. Page "10 / 13".

CONTENT (render exactly):
TITLE: "The Evolving Engineer Role" (32pt bold)
SUBTITLE: "From Writer to Orchestrator" (italic, muted)

COMPARISON TABLE (two columns with → arrows between):
Headers: "Old Focus" (muted) → "New Focus" (purple bold)

Writing implementation code → Designing agent-implementable systems
Manual coding → Writing specifications for agents
Debugging line-by-line → Reviewing and curating agent output
Ad-hoc knowledge sharing → Maintaining AGENTS.md & skills
Single-threaded work → Orchestrating multiple agents
Low-level coding → Higher-order design & communication

Alternating row backgrounds. Right column text in bold deep purple.

BOTTOM SECTION (separated by dashed line):
"Spec-Driven Development" (15pt bold)
Three connected cards in a flow with → arrows:
[Engineer writes Specification] → [Agent Implements] → [Spec = Instruction + Acceptance Criteria]
Middle card has purple border for emphasis.

Decorative: Desk-to-orchestrator transformation wireframe in subtle background.`,

  // SLIDE 11: ROADMAP
  `${STYLE}
LAYOUT: Title top. Four phase cards arranged horizontally with arrow connectors between them. Page "11 / 13".

CONTENT (render exactly):
TITLE: "Implementation Roadmap" (32pt bold)

4 PHASE CARDS side by side (equal width, white, thin border):

PHASE 1 (purple border, lavender header):
"Phase 1" (bold) | "Weeks 1–2"
"Foundation" (purple bold)
• Designate "Agents Captain"
• Schedule Codex hackathon
• Create initial AGENTS.md
• Audit tooling accessibility

PHASE 2 (normal border):
"Phase 2" (bold) | "Weeks 3–4"
"Infrastructure" (purple bold)
• Set up skills repository
• Create MCP servers (top 5)
• Establish review guidelines
• Set up agent observability

PHASE 3 (normal border):
"Phase 3" (bold) | "Weeks 5–8"
"Optimization" (purple bold)
• Optimize tests (<30s target)
• Refine AGENTS.md from failures
• Build skills library
• Define quality metrics

PHASE 4 (normal border):
"Phase 4" (bold) | "Ongoing"
"Scale" (purple bold)
• Regular AGENTS.md reviews
• Continuous skills development
• Infrastructure improvements

› arrow between each phase card.

Decorative: Winding path with milestone flags wireframe in background.`,

  // SLIDE 12: TAKEAWAYS & RISKS
  `${STYLE}
LAYOUT: Title top. Two-column layout with dashed divider. Left = takeaways list, Right = risk cards. Page "12 / 13".

CONTENT (render exactly):
TITLE: "Key Takeaways & Open Risks" (32pt bold)

LEFT COLUMN — "Key Takeaways" (16pt bold):
1. Organizational transformation, not tool adoption
2. Architect role becomes more critical
3. AGENTS.md is the new README
4. "Say no to slop" is the hardest pillar
5. Agent infrastructure is a greenfield opportunity
6. Navigate deliberately — transition is inevitable

Numbers in purple bold. Each takeaway on its own line with clear spacing.

RIGHT COLUMN — "Open Risks" (16pt bold):
4 risk cards (each with purple left accent bar):
"Code ownership" → Rigorous review, not rubber-stamping
"Technical debt" → New metrics for AI-generated drift
"Security" → "Safe but productive" balance
"Skill atrophy" → Maintain deep understanding for review

Decorative: Lightbulb wireframe on left, warning triangle wireframe on right.`,

  // SLIDE 13: APPENDIX
  `${STYLE}
LAYOUT: Title top. Three language cards side by side. Source attribution at bottom. Page "13 / 13".

CONTENT (render exactly):
TITLE: "Appendix: Language-Specific Notes" (32pt bold)

3 LANGUAGE CARDS side by side (equal width):

RUST (lavender header with "Rust" in 18pt bold):
✓ Type system = built-in correctness verification
⚠ unsafe blocks need explicit AGENTS.md policy
⚠ Build times may slow agent iteration

C / C++ (lavender header with "C / C++" in 18pt bold):
⚠ Less safety guardrails → more prescriptive AGENTS.md
⚠ Memory management conventions must be explicit

PYTHON (lavender header with "Python" in 18pt bold):
✓ Large training corpus = agents perform well
⚠ Mandate type hints and mypy in AGENTS.md

✓ items in green. ⚠ items in amber/gold.

FOOTER (centered, 9pt, muted):
"Source: Greg Brockman's public post on OpenAI's internal agentic transformation | Compiled: February 2026"

Decorative: Three code bracket pairs { } wireframe in subtle background.`,
];

// ============================================================
// GENERATION
// ============================================================
async function generateSlide(prompt, num) {
  const outFile = path.join(IMG_DIR, `slide-${String(num).padStart(2, '0')}.png`);
  if (fs.existsSync(outFile)) {
    console.log(`  [${num}/13] Cached`);
    return outFile;
  }

  console.log(`  [${num}/13] Generating...`);
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseModalities: ["IMAGE", "TEXT"] },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(outFile, buf);
          console.log(`  [${num}/13] OK (${(buf.length/1024).toFixed(0)}KB)`);
          return outFile;
        }
      }

      // If RECITATION or other finish reason, retry with slightly modified prompt
      const reason = response.candidates?.[0]?.finishReason;
      if (reason === 'RECITATION') {
        console.log(`  [${num}/13] Content policy, retrying...`);
        continue;
      }
      throw new Error("No image in response, reason: " + reason);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        const wait = 65 * (attempt + 1);
        console.log(`  [${num}/13] Rate limited, waiting ${wait}s...`);
        await new Promise(r => setTimeout(r, wait * 1000));
      } else {
        console.error(`  [${num}/13] Error: ${msg.slice(0, 150)}`);
        if (attempt < MAX_RETRIES - 1) continue;
        return null;
      }
    }
  }
  return null;
}

async function main() {
  console.log('=== Generating complete slides with Gemini ===\n');

  const images = [];
  for (let i = 0; i < SLIDES.length; i++) {
    const img = await generateSlide(SLIDES[i], i + 1);
    images.push(img);
    if (i < SLIDES.length - 1) await new Promise(r => setTimeout(r, 3000));
  }

  const ok = images.filter(Boolean).length;
  console.log(`\n${ok}/${images.length} slides generated.\n`);

  if (ok === 0) {
    console.error('No slides generated. Check API key and quota.');
    process.exit(1);
  }

  // Build PPTX
  console.log('=== Assembling PPTX ===\n');
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'Agentic Software Engineering Playbook';

  for (let i = 0; i < images.length; i++) {
    const s = pres.addSlide();
    if (images[i]) {
      s.background = { path: images[i] };
    } else {
      s.background = { color: 'F8F5FC' };
      s.addText(`Slide ${i + 1} — image generation failed`, {
        x: 1, y: 2, w: 8, h: 1.5,
        fontSize: 24, fontFace: 'Georgia', color: '2D1B69',
        align: 'center', valign: 'middle',
      });
    }
  }

  const outPath = '/Users/yuechen/home/cc-ppt/Agentic_SE_Playbook_Full.pptx';
  await pres.writeFile({ fileName: outPath });
  console.log(`Presentation saved: ${outPath}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
