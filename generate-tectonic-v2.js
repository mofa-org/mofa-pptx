const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-tectonic-v2";
const SW = 13.333, SH = 7.5;
const TOTAL = 30;

// ─── SHARED STYLE PREFIX ───────────────────────────────────────────
const STYLE = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Light purple gradient — from pale lavender-white (#F8F5FC) at top-left to soft lavender (#EAE0F5) at bottom-right. Elegant, soft, not too saturated — think frosted lilac glass. In the background, VERY FAINTLY visible (like a ghosted watermark at 5-8% opacity), include a gentle sketch outline of a large whale silhouette — positioned in the right half of the slide. Just barely-visible faint purple-gray pencil lines, like a watermark printed on fine paper. The whale should NOT compete with the content.

TYPOGRAPHY: Manrope font (geometric modern sans-serif, clean and rounded) for ALL English text. Noto Sans SC font (clean Chinese sans-serif, matching weight) for ALL Chinese text. Clean, professional, highly legible.

TITLE RULES:
- Title font size MUST be ≤24pt. If the title is long, shrink to 20pt or 18pt to fit.
- If the Chinese translation is SHORT (≤8 characters), put English and Chinese on ONE line separated by " | " — e.g. "The AGI Implication | AGI的启示"
- If the Chinese translation is LONG (>8 characters), use TWO lines: English title on line 1, Chinese title on line 2 in slightly smaller text.
- Subtitle (if any) goes below the title in medium gray, ~14-16pt.

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated MONOCHROME WIREFRAME SKETCH illustration:
- Medium gray (#666666 to #888888) line art ONLY — NO color fills, NO heavy gradients
- DETAILED icons with character: gear teeth clearly drawn, building columns visible, brain with neural connections, shield emblems detailed, screens show content
- Consistent line weight throughout (~1.5-2px equivalent)
- Hand-drawn/sketch quality but CLEAN and READABLE — like a senior designer's concept whiteboard sketch
- Arrows are clean with proper arrowheads
- Labels in clean UPPERCASE Manrope gray text, positioned near their icons
- Generous white space inside each card — diagrams should breathe, not feel cramped

The light purple gradient background should be VISIBLE — cards are white so they contrast against the soft lavender background. The overall color feeling is elegant purple/lavender.

CRITICAL: Premium consulting deck aesthetic (McKinsey / Bain style) with hand-drawn concept sketches — intellectual, sophisticated, monochrome diagrams on elegant light purple background.`;

// Data-dense variant (less decoration, more table clarity)
const STYLE_DATA = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Light purple gradient — from pale lavender-white (#F8F5FC) at top-left to soft lavender (#EAE0F5) at bottom-right. Very subtle, clean. Minimal or NO whale watermark on this slide — keep the background clean for data readability.

TYPOGRAPHY: Manrope font (geometric modern sans-serif) for ALL English text. Noto Sans SC for ALL Chinese text. Clean, professional, highly legible.

TITLE RULES:
- Title font size MUST be ≤24pt. If the title is long, shrink to 20pt or 18pt to fit.
- If the Chinese translation is SHORT (≤8 characters), put English and Chinese on ONE line separated by " | "
- If the Chinese translation is LONG (>8 characters), use TWO lines: English title on line 1, Chinese title on line 2 in slightly smaller text.

DATA-DENSE SLIDE: This slide contains dense data tables or comparison matrices. PRIORITIZE data presentation clarity above all else. Reduce or remove decorative sketch elements. Use clean table layouts with maximum readability. Data > decoration. Tables should have clear headers, aligned columns, generous spacing, and alternating subtle row shading for readability. Only keep minimal wireframe accents that aid comprehension (small icons in table cells OK), never at the expense of data legibility.

Premium consulting deck aesthetic — clean, intellectual, data-forward.`;

// Cover variant (dark background)
const STYLE_COVER = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Dark purple gradient — from deep midnight purple (#1A0F40) at top-left to rich purple (#3D2580) at bottom-right. Rich, elegant, dramatic.

In the right half of the slide, include a VISIBLE but subtle sketch of a large whale silhouette — drawn in light purple/lavender wireframe lines (#C4B5D9, #E8DFF5) at ~20-30% opacity. The whale is "falling" gracefully, with small particles and dots rising below it (representing "一鲸落万物生" — when a whale falls, all things flourish). The whale is sketch/wireframe style, NOT photorealistic.

TYPOGRAPHY: Manrope font (geometric modern sans-serif) for English. Noto Sans SC for Chinese. On dark background, text should be white or very light lavender.

The LEFT 40% of the slide should be relatively clear for text content. The whale sketch occupies the RIGHT 60%.

Premium, dramatic, cinematic but still intellectual and clean.`;

// ─── SLIDE PROMPTS ─────────────────────────────────────────────────
const slides = [

// ─── SLIDE 1: COVER ────────────────────────────────────────────────
{
  style: "cover",
  prompt: `
TITLE (large, bold, white, left-aligned in the left 45%):
Line 1: "AI Coding: The Tectonic Shift in Software" — bold, ~28pt, white
Line 2: "AI编程：软件行业的结构性变革" — ~20pt, light lavender

Below title:
"STRATEGIC INSIGHT REPORT | 战略洞察报告" — small caps, ~12pt, light gray/lavender

Below that, a subtitle in warm white:
"The $3 Trillion Whale Is Falling | $3万亿巨鲸正在坠落"

Below subtitle, in smaller lighter text:
"一鲸落万物生 — When a whale falls, all things flourish"

Near bottom-left, small source badges in muted lavender text:
"Sources: a16z · Apollo Global · ARK Invest · S&P Index"

Bottom-left corner: "February 2026 — Release 1.0" in small muted text.
Bottom-right corner: "1 / ${TOTAL}" in small muted text.

The whale sketch on the right should be the main visual element — elegant wireframe whale descending with particles rising.`
},

// ─── SLIDE 2: SaaS CRISIS ─────────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "SaaS Crisis: Fatal Vulnerability & Seat Compression"
Chinese (long, use line 2): "SaaS危机：致命弱点与软件许可缩减"

THREE WHITE CARDS:

─── CARD 1: "Fatal Vulnerability" ───
Diagram: A tall tower of 4 stacked blocks with icons (cloud=SCALABLE, dollar=HIGH MARGIN, lightbulb=PURE IP, feather=LIGHT ASSET). Arrow from right with brain-gear icon labeled "AI DISRUPTION" pointing at base. Cracks at tower base.
Body: "Software's asset-light nature — once its greatest strength — is now its fatal weakness when AI replicates intellectual capital at near-zero marginal cost."

─── CARD 2: "Seat Compression" ───
Diagram: Big stat "60-80%" with "Revenue Drop" beside it. Below: flow of 5 desk-person icons → arrow → 2 desk icons + robot icon. Labels "TRADITIONAL: PER-SEAT" → "AI ERA: 2 + AGENTS". Small declining staircase chart labeled "SaaS REVENUE".
Body: "Per-seat pricing collapses when one AI agent replaces 3-5 developer seats, compressing revenue 60-80% per customer."

─── CARD 3: "The Structural Reset" ───
Diagram: Three boxes labeled "PREDICTABLE GROWTH", "8-12× MULTIPLES", "COMPOUNDING" with X marks through them. Below each, replacement text: "CONTRACTS", "COMPRESSES", "UNWINDS". A downward arrow to a scale/balance icon tipping.
Body: "Traditional valuation assumptions collapse. Software lacks hard collateral — value can evaporate overnight when the abstraction layer breaks."

PAGE: "2 / ${TOTAL}"`
},

// ─── SLIDE 3: SAASPOCALYPSE ────────────────────────────────────────
{
  style: "data",
  prompt: `
TITLE: "The February 2026 'SaaSpocalypse'"
Chinese (long, use line 2): "2026年2月'SaaS末日'"
Subtitle: "Claude Cowork demo triggers $285 billion single-day software stock wipeout"

MAIN CONTENT: One large white card spanning full width with a clean DATA TABLE:

Table header row (bold): Company | Stock Drop | Significance

Data rows:
Thomson Reuters | -15.83% | Worst single-day drop on record
LegalZoom | -19.68% | Legal services disruption
RELX (LexisNexis) | -14% | Legal research monopoly threatened
WPP | -12% | Advertising holding company
Gartner | -21% | Research & advisory
S&P Global | -11% | Financial data services
Intuit | -10% | Accounting software
Equifax | -10% | Credit reporting

Use alternating subtle lavender/white row shading. The percentage drops should be visually prominent (larger or bold).

Below the table, a quote box:
"If an AI agent can do the research, analysis, and document production that companies pay SaaS subscriptions for, a significant portion of the software revenue base is at risk."

Bottom-right of card: "Software P/E ratios at ten-year lows" in small bold text.

PAGE: "3 / ${TOTAL}"`
},

// ─── SLIDE 4: L2-L5 AUTONOMY ──────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "From L2 to L5: The Autonomous Coding Revolution"
Chinese (long, use line 2): "从L2到L5：自主编码革命"
Subtitle: "Using self-driving vehicle taxonomy to frame AI coding evolution"

MAIN CONTENT: A large white card with a visual LEVEL PROGRESSION:

Draw 5 horizontal lanes stacked vertically, each representing a level. Each lane has:
- LEFT: Level badge (L1, L2, L3, L4, L5) in a circle
- CENTER: Name and wireframe icon
- RIGHT: Human role description

L1 — "Code Completion" — icon: cursor with suggestion bubble — "Human writes everything"
L2 — "Copilot-Style" — icon: split screen (human + AI) — "Human directs architecture"
L3 — "Claude Code" — icon: chat terminal with code output — "Human directs via natural language"
L4 — "Full Autonomy" — icon: robot at desk coding alone — "Minimal oversight"
L5 — "Human-Free" — icon: brain/AI with radiating lines — "Only high-level intent required"

A vertical arrow on the far left from L1 to L5 labeled "INCREASING AUTONOMY →"

A prominent marker/highlight on the L3-L4 boundary labeled "WE ARE HERE" with a star icon.

Below the progression, proof points in smaller text:
"SWE-bench Verified: Claude Opus 4.5 achieves 80.9% | 30+ hours continuous autonomous operation"

PAGE: "4 / ${TOTAL}"`
},

// ─── SLIDE 5: AGENT TEAMS ─────────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Agent Teams: 16 Parallel Claudes Build a Compiler"
Chinese (long, use line 2): "智能体团队：16个Claude并行构建编译器"

TWO WHITE CARDS:

─── CARD 1 (left, wider): "The Experiment" ───
Diagram: Wireframe showing 16 small robot/agent icons arranged in a 4×4 grid, all connected by thin lines to a central "SHARED CODEBASE" repository icon in the middle. Arrows flow bidirectionally between agents and repo.

Key metrics displayed as big stats around the diagram:
"16 AGENTS" (top-left)
"~2,000 SESSIONS" (top-right)
"$20,000 COST" (bottom-left)
"100,000 LINES" (bottom-right)

Below: "Task: Build a Rust-based C compiler from scratch"

─── CARD 2 (right, narrower): "The Result" ───
Diagram: A simple computer/server icon with three output arrows pointing to three chip/processor icons labeled "x86", "ARM", "RISC-V". Above: "Compiles Linux 6.9 Kernel" in bold.

Below: a quote in smaller italic text:
"Mostly walked away — minimal human intervention"
— Nicholas Carlini, Anthropic

A small banner at bottom: "L3/L4 INFLECTION POINT — L5 IS THE VISIBLE DESTINATION"

PAGE: "5 / ${TOTAL}"`
},

// ─── SLIDE 6: BORIS CHERNY ────────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Boris Cherny & The 'Prototype-First' Revolution"
Chinese (long, use line 2): "Boris Cherny与'原型优先'革命"

TWO WHITE CARDS:

─── CARD 1 (left): "The Creator" ───
Diagram: A simple person silhouette/avatar icon at top. Below, a vertical timeline with 4 nodes:
• "IC8 at Meta" — building icon (Facebook Groups: 150→800 people)
• "O'Reilly Author" — book icon (Programming TypeScript)
• "Blown away by ChatGPT" — sparkle/lightning icon
• "Head of Claude Code" — terminal/code icon

Body: "Former Principal Engineer at Meta. Joined Anthropic after being 'blown away' by ChatGPT. Now leads Claude Code — gets recognized in public."

─── CARD 2 (right): "Prototype-First vs Traditional" ───
Diagram: Two-column comparison with wireframe icons:

LEFT column "TRADITIONAL" (crossed out / faded):
- Document icon → "Write 10-page PRD"
- Meeting icon → "Design review meetings"
- Handshake icon → "Get stakeholder alignment"
- Calendar icon → "Plan development"

RIGHT column "PROTOTYPE-FIRST" (bold / highlighted):
- Rocket icon → "Build prototype in hours"
- People icon → "Ship to entire company"
- Dog icon → "Everyone dogfoods immediately"
- Loop icon → "Iterate on real usage data"

Arrow from left to right labeled "THE SHIFT"

Body: "Don't build for the model of today, build for the model six months from now." — Boris Cherny

PAGE: "6 / ${TOTAL}"`
},

// ─── SLIDE 7: BUILD FOR FUTURE MODEL ──────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Build for the Model 6 Months From Now"
Chinese (long, use line 2): "为六个月后的模型而构建"

TWO WHITE CARDS:

─── CARD 1 (left): "The Quality Curve" ───
Diagram: A rising curve/graph from bottom-left to top-right, with 4 marked points along it:

Point 1 (low): "Early 2024" — "~10% of code" — small seedling icon
Point 2 (mid): "March 2025 (Sonnet/Opus 4)" — "~50% of code" — growing plant icon
Point 3 (high): "Late 2025" — "80-90% of code" — tree icon
Point 4 (peak): "December 2025" — "300+ PRs in one month" — rocket icon

The curve should show exponential growth. Label the Y-axis "CLAUDE CODE QUALITY" and X-axis "TIME".

─── CARD 2 (right): "Adoption at Anthropic" ───
Diagram: A horizontal bar chart or funnel showing adoption progression:

Day 1: 20% of Engineering → thin bar
Day 5: 50% of Engineering → medium bar
Today: 80%+ of Engineers daily → wide bar
Data Scientists: Multiple instances simultaneously → icons of parallel terminals
Sales Team: 50% of non-technical staff → surprising stat, person with business icon

The bars should grow dramatically from top to bottom, showing rapid adoption.

Body: "The self-improving flywheel: better models → more adoption → more data → even better models"

PAGE: "7 / ${TOTAL}"`
},

// ─── SLIDE 8: SELF-IMPROVING FLYWHEEL ─────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Claude Code's Self-Improving Flywheel"
Chinese (long, use line 2): "Claude Code的自我改进飞轮"

TWO WHITE CARDS:

─── CARD 1 (left): "The Feedback Loop" ───
Diagram: A CIRCULAR FLYWHEEL diagram with 5 nodes connected by arrows in a clockwise loop:

1. "ENGINEERS USE" (person at terminal icon)
2. "MODEL GENERATES CODE" (brain/AI icon)
3. "CODE EXECUTES" (terminal with output icon)
4. "RESULTS FEEDBACK" (chart/data icon)
5. "RLHF/CAI TRAINING" (neural network icon)
→ Back to "BETTER CLAUDE" → loops to node 1

The flywheel should look like it's spinning/accelerating. Draw motion lines around it.

─── CARD 2 (right): "6-Month Metrics" ───
Diagram: Four big stat blocks stacked vertically:

"+116%" — "Consecutive Tool Calls (9.8→21.2/session)" — upward arrow icon
"-33%" — "Human Turns (6.2→4.1/session)" — downward arrow icon
"+50%" — "Productivity Boost at Anthropic" — rocket icon
"+67%" — "PR Throughput Increase" — code merge icon

Below: "Claude Usage: 28% → 59% of all work at Anthropic"

Each stat should be visually prominent with the percentage in large bold text.

PAGE: "8 / ${TOTAL}"`
},

// ─── SLIDE 9: REVENUE & RECURSIVE DEV ─────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Revenue Milestone & Recursive Development"
Chinese (long, use line 2): "营收里程碑与递归开发"

TWO WHITE CARDS:

─── CARD 1 (left): "Revenue Milestone" ───
Diagram: Dominant big stat at top:
"$1 BILLION" in very large bold text
"Claude Code Revenue (Nov 2025)" below it

Below, three smaller metric boxes in a row:
• "8×" — "Business customers >$1M ARR increase"
• "$350B" — "Anthropic valuation (in talks)"
• "70-90%" — "Code written by Claude Code at Anthropic teams"

Quote at bottom: "'Claude is becoming the verb now' — Mike Brevoort, Mytra"

─── CARD 2 (right): "The Recursive Loop" ───
Diagram: A recursive spiral/helix drawn vertically, with 3 generations:

Level 1 (bottom): "Claude Code v1" — simple terminal icon
↓ builds
Level 2 (middle): "Claude Cowork" — multi-window icon — "~10 days, 4 engineers, 100% AI-written"
↓ builds
Level 3 (top): "Next Gen Tools" — constellation/network icon

Arrows loop back from top to bottom labeled "FEEDBACK LOOP"

"90% of Claude Code codebase written by Claude Code itself"
"Boris: 300+ PRs shipped in December 2025 alone"

PAGE: "9 / ${TOTAL}"`
},

// ─── SLIDE 10: FIVE PILLARS ───────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Five Pillars of Claude Code Architecture"
Chinese (long, use line 2): "Claude Code架构五大支柱"

MAIN CONTENT: One large white card with FIVE COLUMNS, each representing a pillar:

PILLAR 1: "CLAUDE.md"
Icon: Document with bookmark icon
Label: "Always-on project memory"
Status badge: "DE FACTO STANDARD"

PILLAR 2: "Skills"
Icon: Toolbox/wrench icon
Label: "On-demand workflows (/deploy)"
Status badge: "DE FACTO STANDARD"

PILLAR 3: "MCP"
Icon: Plug/connector icon
Label: "External tool connections"
Status badge: "LINUX FOUNDATION"

PILLAR 4: "Subagents"
Icon: Multiple small agent icons branching from one
Label: "Parallel execution"
Status badge: "INDUSTRY FIRST"

PILLAR 5: "Hooks"
Icon: Hook/event icon
Label: "Event-driven automation"
Status badge: "INDUSTRY FIRST"

Below the 5 pillars, a section labeled "INDUSTRY CONVERGENCE":
4 company names with arrows pointing to the pillars:
OpenAI → AGENTS.md | Google → Collaborating | GitHub Copilot → copilot-instructions.md | Cursor → .cursorrules

PAGE: "10 / ${TOTAL}"`
},

// ─── SLIDE 11: [NEW-D] ARCHITECTURE DEEP DIVE ────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Architecture Deep Dive: CLAUDE.md, Skills, MCP"
Chinese (long, use line 2): "架构深潜：CLAUDE.md、技能系统、MCP"

THREE WHITE CARDS:

─── CARD 1: "CLAUDE.md" ───
Diagram: A document/file icon at top with lines of text inside, labeled "CLAUDE.md". Below it, arrows branch out to 3 smaller items:
- "Project Rules" (gear icon)
- "Code Conventions" (code bracket icon)
- "Architecture Context" (blueprint icon)

A key insight label: "ALWAYS LOADED INTO CONTEXT"

Body: "Machine-readable project memory that persists across sessions. Every conversation starts with full project context — conventions, patterns, decisions."

─── CARD 2: "Skills System" ───
Diagram: A command prompt showing "/deploy" at top. Below, a flowchart:
Trigger ("/command") → Skill YAML → Multi-step workflow → Result

Show 3 example skills as small cards: "/deploy", "/test", "/review"

Body: "On-demand reusable workflows triggered by slash commands. Each skill is a YAML-defined multi-step recipe — extensible, shareable, composable."

─── CARD 3: "MCP + Subagents + Hooks" ───
Diagram: Three layers stacked:
TOP: "MCP" — plug icon connecting to external tools (GitHub, Jira, DB icons)
MIDDLE: "Subagents" — one parent agent icon spawning 4 child agent icons in parallel
BOTTOM: "Hooks" — event trigger icon → chain of automated actions

Body: "MCP standardizes tool connections (donated to Linux Foundation). Subagents enable parallel execution. Hooks provide event-driven automation."

PAGE: "11 / ${TOTAL}"`
},

// ─── SLIDE 12: [NEW-E] TEAMS & ADOPTION PATTERNS ─────────────────
{
  style: "data",
  prompt: `
TITLE: "Claude Code in Practice: Teams & Adoption"
Chinese (long, use line 2): "Claude Code实战：团队与采用模式"

TWO WHITE CARDS:

─── CARD 1 (left, wider): "8-Team Use Case Matrix" ───
A clean data table:

Team | Use Case | Pattern
Data Infra | Pipeline & ETL automation | Autonomous
Product Dev | Feature implementation | Collaborative
Security | Vulnerability scanning & fixes | Autonomous
Data Science | Analysis & visualization | Collaborative
Legal | Contract review & compliance | Knowledge
Non-technical | Report generation, workflows | Knowledge
DevOps | CI/CD, infrastructure as code | Autonomous
Research | Paper analysis, experiment design | Knowledge

Use alternating row shading. Keep it clean and readable.

─── CARD 2 (right, narrower): "3 Adoption Patterns" ───
Three vertically stacked sections with icons:

1. "AUTONOMOUS EXECUTION" — robot icon running alone
   "Fire-and-forget: assign task, agent completes independently"

2. "SYNCHRONOUS COLLABORATION" — two figures side by side (human + AI)
   "Pair programming: human and agent work together in real-time"

3. "KNOWLEDGE EXTRACTION" — magnifying glass over document
   "Codebase Q&A: ask questions, get answers with references"

Each pattern has a small progress/usage bar showing relative adoption.

PAGE: "12 / ${TOTAL}"`
},

// ─── SLIDE 13: AGI FOUNDATION ─────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Claude Code as AGI Foundation | AGI基石"

TWO WHITE CARDS:

─── CARD 1 (left): "Recursive Development Cycle" ───
Diagram: A recursive loop diagram:
"Claude Code v1" → arrow → "Builds Claude Cowork" → arrow → "Builds Next-Gen Tools"
                         ↑                                               |
                         └──────────── "Feedback Loop" ◄────────────────┘

The loop should feel like an ascending spiral, each generation higher than the last.

Case study box below:
"Claude Cowork: ~10 days | 4 engineers | 'All of it' written by Claude Code"
"Human role: Product and architecture decisions only"

─── CARD 2 (right): "Agent Teams Breakthrough (Feb 2026)" ───
Diagram: 16 small robot icons in a 4×4 grid formation, all connected to a central repository. Output arrow pointing to a chip icon labeled "C COMPILER".

Stats around the diagram:
"16 parallel instances"
"100,000 lines of Rust"
"$20,000 total cost"
"Compiles Linux 6.9 kernel"
"x86 + ARM + RISC-V"

Quote: "Mostly walked away" — minimal human supervision

PAGE: "13 / ${TOTAL}"`
},

// ─── SLIDE 14: ANTHROPIC VS OPENAI ────────────────────────────────
{
  style: "data",
  prompt: `
TITLE: "Anthropic vs OpenAI: Divergent Philosophies"
Chinese (long, use line 2): "Anthropic vs OpenAI：分道扬镳的哲学"

MAIN CONTENT: One large white card with a COMPARISON TABLE:

Two columns with headers and a divider line:

LEFT HEADER: "Anthropic" with a shield icon
RIGHT HEADER: "OpenAI" with a rocket icon

Row 1 — Philosophy:
Anthropic: "Safety-first, human-in-the-loop"
OpenAI: "Rapid innovation, productivity-first"

Row 2 — System Prompt:
Anthropic: "120+ pages of explicit rules"
OpenAI: "'Make a best effort'"

Row 3 — Guardrails:
Anthropic: "Protocol-level (MCP)"
OpenAI: "Optional developer checks"

Row 4 — Development Speed:
Anthropic: "Conservative, measured"
OpenAI: "Aggressive, fast-moving"

Row 5 — Key Innovation:
Anthropic: "CLAUDE.md, Skills, Subagents, Hooks"
OpenAI: "AGENTS.md, Codex integration"

Row 6 — Internal Adoption:
Anthropic: "80%+ engineers daily"
OpenAI: "Growing rapidly"

Row 7 — Productivity Gain:
Anthropic: "+67% PR throughput"
OpenAI: "Targeting 500% speed (Meta)"

Below the table, two quote boxes side by side:
LEFT (Anthropic/Claude 4): "Claude never starts by saying a question was good, great, fascinating..."
RIGHT (OpenAI/GPT-5): "DO NOT ASK A CLARIFYING QUESTION... make a best effort to respond."

PAGE: "14 / ${TOTAL}"`
},

// ─── SLIDE 15: [NEW-F] SAFETY & RELEASE DECISION ─────────────────
{
  style: "normal",
  prompt: `
TITLE: "Safety & The Release Decision | 安全与发布决策"

TWO WHITE CARDS:

─── CARD 1 (left): "The Internal Debate" ───
Diagram: A balance scale icon at top. Two sides:
LEFT pan: "KEEP SECRET" — lock icon — "Competitive advantage, prevent misuse"
RIGHT pan: "RELEASE" — unlock icon — "Safety learning, ecosystem building"

The RIGHT pan is lower (heavier/winning).

Below the scale:
"Anthropic chose to release Claude Code publicly"
"Rationale: Real-world safety data > theoretical safety in isolation"
"Release enables the community to find and report safety issues faster"

─── CARD 2 (right): "Safety Evaluation: Claude vs GPT-4" ───
A comparison table:

Dimension | Claude | GPT-4
Instruction Hierarchy | Strict layered | Flexible
Hallucination Rate | Lower (trained on refusals) | Moderate
Safety Constraints | 120+ page system prompt | Best-effort
Refusal Mechanisms | Protocol-level (MCP) | Developer-optional
Red Team Process | Continuous internal + external | Periodic

Use small shield/checkmark icons in the Claude column, caution/neutral icons in GPT-4 column where appropriate.

Body: "Anthropic's bet: the safest path to AGI requires deploying AI in the real world and learning from actual usage patterns, not keeping it locked away."

PAGE: "15 / ${TOTAL}"`
},

// ─── SLIDE 16: AGI IMPLICATION ────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "The AGI Implication | AGI的启示"

TWO WHITE CARDS:

─── CARD 1 (left): "Self-Evolving AI Characteristics" ───
Diagram: A 2×2 grid of characteristic boxes, each with an icon:

TOP-LEFT: "TOOL GENERATION" — wrench being created icon
"Creates custom tools on demand"

TOP-RIGHT: "TOOL USE" — hand using tool icon
"Executes bash, reads files, writes code"

BOTTOM-LEFT: "FEEDBACK INTEGRATION" — loop/cycle icon
"Learns from execution results"

BOTTOM-RIGHT: "SELF-IMPROVEMENT" — ascending arrow icon
"Models trained on usage data get better"

All four connected by arrows in a cycle, showing the self-evolving nature.

─── CARD 2 (right): "Dario Amodei's Prediction" ───
Diagram: A timeline visualization:

March 2025 (prediction point): Speech bubble from Dario icon
"In 3-6 months, AI writes 90% of code"
"In 12 months, AI writes essentially all code"

Arrow to: February 2026 (current):
Big checkmark icon: "ALREADY HAPPENING"
- "Claude Cowork: 100% AI-written"
- "Boris: 300+ PRs in one month"
- "Anthropic teams: 70-90% AI-written code"

The timeline should show the prediction was accurate, with a "VALIDATED" stamp.

PAGE: "16 / ${TOTAL}"`
},

// ─── SLIDE 17: AGENTIC SE PLAYBOOK INTRO ──────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "The Agentic SE Playbook: Two Paths"
Chinese (long, use line 2): "智能体软件工程手册：殊途同归"
Subtitle: "Both Anthropic and OpenAI converge on agent-first software engineering"

MAIN CONTENT: One large white card with a visual split:

LEFT HALF — Anthropic's path:
A shield icon at top, labeled "ANTHROPIC"
Below: "Prototype-First + Self-Improving Flywheel"
Key words in boxes: "Safety" "Human-in-loop" "Measured"
A circular flywheel icon spinning

RIGHT HALF — OpenAI's path:
A rocket icon at top, labeled "OPENAI"
Below: "Tool of First Resort + March 31 Mandate"
Key words in boxes: "Speed" "Productivity" "Aggressive"
A countdown/deadline icon

BETWEEN the two halves, converging arrows meet at a central point labeled:
"SAME DESTINATION: Agent-First Engineering"

Below: "Both organizations independently reached the same conclusion: the future of software engineering is agent-first, where humans design and orchestrate while agents implement."

Small icons at bottom showing shared elements: AGENTS.md, Skills, MCP, Human-in-loop, Observability

PAGE: "17 / ${TOTAL}"`
},

// ─── SLIDE 18: ANTHROPIC'S PLAYBOOK ──────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Anthropic's 6-Step Playbook"
Chinese (use line 2): "Anthropic六步行动手册"
Subtitle: "Prototype-First + Self-Improving Flywheel"

MAIN CONTENT: One large white card with 6 STEPS arranged as a horizontal workflow:

STEP 1: Circle with "1" → "Adoption" icon: people icon
"Try tools, designate 'Agents Captain'"

STEP 2: Circle with "2" → "AGENTS.md" icon: document icon
"Machine-readable project handbook"

STEP 3: Circle with "3" → "Tools" icon: wrench icon
"Make internal tools agent-accessible"

STEP 4: Circle with "4" → "Architecture" icon: building blocks icon
"Restructure for agent-first dev"

STEP 5: Circle with "5" → "Quality" icon: shield/checkmark icon
"'Say no to slop' — maintain review bar"

STEP 6: Circle with "6" → "Infrastructure" icon: server/monitoring icon
"Observability, trajectory tracking"

Steps connected by arrows flowing left to right. Below the 6 steps, a horizontal flywheel bar:
"Engineers Use → Model Generates → Code Executes → Results Feedback → Training → Better Claude"

Bottom metrics row:
"80%+ daily users | +67% PR throughput | +116% tool calls | -33% human turns"

PAGE: "18 / ${TOTAL}"`
},

// ─── SLIDE 19: OPENAI'S MANDATE ──────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "OpenAI's March 31 Mandate"
Chinese (use line 2): "OpenAI的3月31日指令"
Subtitle: "Tool of First Resort — agent replaces editor and terminal"

TWO WHITE CARDS:

─── CARD 1 (left): "The Two Goals" ───
Two large goal boxes stacked:

GOAL 1: Bullseye icon
"TOOL OF FIRST RESORT"
"Humans interact with an AGENT rather than editor/terminal"

GOAL 2: Shield icon
"SAFE & PRODUCTIVE DEFAULT"
"Agent utilization is explicitly safe and productive enough"

Below: deadline banner "TARGET: MARCH 31, 2026"

─── CARD 2 (right): "The 6-Step Playbook" ───
Compact numbered list with small icons:
1. "Try Tools" — play button — host hackathons, designate Agents Captain
2. "AGENTS.md" — document — project-specific instructions
3. "Inventory Tools" — catalog — agent-enable internal tools
4. "Agent-First Codebase" — code — fast tests, quality interfaces
5. "Say No to Slop" — shield — human accountability for merged code
6. "Basic Infrastructure" — server — observability, trajectories

Timeline at bottom:
"Dec 2025: Codex step-function → Jan 2026: Playbook distributed → Mar 31, 2026: TARGET"

PAGE: "19 / ${TOTAL}"`
},

// ─── SLIDE 20: [NEW-A] CODEX CATALYST ────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "OpenAI's 2026 Mandate: The Codex Catalyst"
Chinese (long, use line 2): "OpenAI的2026指令：Codex催化剂"

THREE WHITE CARDS:

─── CARD 1: "Before vs After Codex" ───
Diagram: Two-column before/after comparison:

BEFORE (faded/crossed out):
- "Unit tests only" — simple test tube icon
- "Limited scope" — small box icon
- "Human writes everything" — person typing icon

AFTER (bold/highlighted):
- "Writes ALL code" — AI brain with code streams icon
- "Full applications" — multi-window app icon
- "Human reviews and directs" — person with magnifying glass icon

Arrow from BEFORE → AFTER labeled "DECEMBER 2025 STEP FUNCTION"

─── CARD 2: "GPT-5.2-Codex" ───
Big stat: "GPT-5.2" in large bold text
Subtitle: "Purpose-built for code generation"

Key capabilities as bullet icons:
• Multi-file generation
• Architecture understanding
• Test-driven development
• Autonomous debugging
• Continuous operation (hours)

─── CARD 3: "Sora Android App Case Study" ───
Diagram: Comparison visualization:

TRADITIONAL approach (top, faded):
Timeline bar: "3-6 MONTHS" — team of 10+ people icons
Label: "Traditional development timeline"

AGENTIC approach (bottom, bold):
Timeline bar: "18 DAYS" — 4 people icons + robot icon
Label: "4 engineers + Codex agents"

Big stat: "500%" with "Speed Increase" beside it

Body: "Sora Android App: 4 engineers completed in 18 days what would traditionally take 3-6 months with a larger team."

PAGE: "20 / ${TOTAL}"`
},

// ─── SLIDE 21: [NEW-B] 8-DIMENSION PARADIGM SHIFT ────────────────
{
  style: "data",
  prompt: `
TITLE: "Traditional vs Agentic: 8-Dimension Paradigm Shift"
Chinese (long, use line 2): "传统vs智能体：八维范式转变"

MAIN CONTENT: One full-width white card with a large clean COMPARISON TABLE:

Header row: Dimension | Traditional Engineering | Agentic Engineering

8 data rows with small wireframe icons in the Dimension column:

1. First Action (keyboard icon) | Open editor, start typing | Write prompt describing intent
2. Code Production (document icon) | Single-file, manual | Multi-file, parallel generation
3. Debugging (bug icon) | printf/breakpoint, manual trace | Agent analyzes logs, proposes fixes
4. Testing (test tube icon) | Write tests after code | Tests generated alongside code
5. Documentation (book icon) | Written reluctantly, post-hoc | Generated automatically from code
6. Knowledge Sharing (people icon) | Meetings, wikis, tribal knowledge | AGENTS.md, machine-readable context
7. Tool Usage (wrench icon) | IDE, terminal, manual CLI | Agent orchestrates all tools
8. Iteration Speed (clock icon) | Hours to days per cycle | Minutes per cycle

Use alternating subtle lavender/white row shading. The "Agentic Engineering" column should feel like the highlighted/preferred option.

A footer label: "Source: OpenAI Internal Agentic Software Engineering Playbook (January 2026)"

PAGE: "21 / ${TOTAL}"`
},

// ─── SLIDE 22: [NEW-C] EVOLVING ENGINEER ──────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "The Evolving Engineer: Writer to Orchestrator"
Chinese (long, use line 2): "工程师进化：从编写者到编排者"

TWO WHITE CARDS:

─── CARD 1 (left): "Old Focus → New Focus" ───
Diagram: 6-row transformation table with arrow between columns:

OLD FOCUS (faded) → NEW FOCUS (bold)
Typing code → Writing specs & prompts
Debugging line-by-line → Reviewing AI output
Memorizing APIs → Designing architecture
Manual testing → Defining test strategies
Solo coding → Orchestrating multiple agents
Tool proficiency → System thinking

Each row has a small icon. Arrows between old and new should feel like evolution/transformation.

Label at bottom: "THE ENGINEER DOESN'T DISAPPEAR — THE ROLE ELEVATES"

─── CARD 2 (right): "Spec-Driven Development" ───
Diagram: A vertical flowchart:

Step 1: Document icon → "Write detailed spec"
↓ arrow
Step 2: Robot/AI icon → "Agent implements from spec"
↓ arrow
Step 3: Checkmark icon → "Spec = acceptance criteria"
↓ arrow
Step 4: Loop arrow → "Iterate until spec is met"

The spec document is the central artifact — it replaces the PRD AND the test plan.

Key insight box: "The spec IS the product definition, the implementation guide, AND the acceptance test — all in one document."

Body: "Spec-Driven Development: write the spec first, then let the agent implement. The spec becomes both the instruction and the success criteria."

PAGE: "22 / ${TOTAL}"`
},

// ─── SLIDE 23: SIDE-BY-SIDE + KEY TAKEAWAY ────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Agentic Software Engineering (ASE)"
Chinese (long, use line 2): "智能体软件工程(ASE)：共识与关键启示"

TWO WHITE CARDS:

─── CARD 1 (left): "Industry Convergence" ───
Diagram: Five shared elements shown as a horizontal row of connected nodes:

1. "AGENTS.md / CLAUDE.md" — document icon
2. "Skills" — toolbox icon
3. "MCP" — plug icon
4. "Human-in-the-loop" — person + checkmark icon
5. "Observability" — dashboard/chart icon

Below: "Linux Foundation Agentic AI Foundation (Dec 2025): Anthropic donated MCP, OpenAI donated AGENTS.md — unprecedented collaboration between competitors."

A handshake icon between Anthropic and OpenAI logos (text only, no actual logos).

─── CARD 2 (right): "Key Takeaway" ───
A prominent quote block with large quotation marks:

"This is not a tool adoption — it's an organizational transformation."

Below, three lines:
"Both Anthropic and OpenAI have reached the same conclusion:"
"The future is AGENT-FIRST"
"Humans design and orchestrate. Agents implement."

A bold call-to-action at bottom:
"The question is not WHETHER to adopt, but HOW QUICKLY you can navigate it — deliberately vs. reactively."

A fork-in-road icon: left path labeled "DELIBERATE" (bright), right path labeled "REACTIVE" (faded).

PAGE: "23 / ${TOTAL}"`
},

// ─── SLIDE 24: CHAT-APP TRAP ──────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "The Chat-App Trap & Agentic Future"
Chinese (use line 2): "聊天还是工作：AI助手的未来"

THREE WHITE CARDS:

─── CARD 1: "Chat-App Fatal Flaws" ───
Diagram: A phone/chat icon at top with 5 X marks radiating out:
• "REACTIVE" — waits for input, can't anticipate
• "SESSION MEMORY" — forgets between conversations
• "APP SILOS" — trapped in single app
• "CLOUD-DEPENDENT" — requires internet
• "PLATFORM BLOCKS" — subject to gatekeepers

The phone icon looks constrained/boxed in.

Body: "Chat apps live at the mercy of platform owners. When AI agents threaten ecosystems, platforms block them."

─── CARD 2: "Case Study: Doubao" ───
Diagram: ByteDance's Doubao icon (simple chat bubble) with three wall/barrier icons:
• Alipay wall — "Financial transactions DISABLED"
• Taobao wall — "E-commerce BLOCKED"
• Pinduoduo wall — "Shopping DISABLED"

Quote: "AI can create content, but hits walls when trying to pay for something."

─── CARD 3: "The Agentic Alternative" ───
Diagram: A comparison showing:
TOP (crossed out): "User → Chat App → Answer" (constrained flow)
BOTTOM (bold): "User → OS Agent → System Access → Files, APIs, Hardware" (open flow)

Key capabilities:
✓ File system access
✓ Background tasks
✓ Cross-app integration
✓ Offline operation
✓ Custom tool creation

Body: "The winners will be agents that live in the OS, not apps that wrap AI in a chat window."

PAGE: "24 / ${TOTAL}"`
},

// ─── SLIDE 25: CLAWDBOT ARCHITECTURE ──────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Clawdbot: OS-Native Agent Architecture"
Chinese (long, use line 2): "Clawdbot：操作系统原生智能体架构"

MAIN CONTENT: One large white card with an ARCHITECTURE DIAGRAM:

TOP LAYER — Three boxes side by side:
"Skills (Reusable Workflows)" — toolbox icon
"Plugins (System Integrations)" — plug icon
"Memories (Persistent Context)" — brain/storage icon

All three connect down via arrows to:

MIDDLE LAYER — Central box:
"Agent Orchestrator (Claude / Codex / Gemma)" — conductor/brain icon

Which connects down to:

BOTTOM LAYER — Three boxes side by side:
"On-Device LLM (Gemma 3B)" — phone/chip icon
"Cloud LLM (Claude API)" — cloud icon
"Open Source LLM (Llama 3)" — open padlock icon

5 CORE PRINCIPLES listed on the right side of the diagram:
1. OS-Native — lives in the operating system
2. Tool-First — uses system tools, not UI
3. Persistent Context — long-term memory
4. Offline-Capable — on-device LLMs
5. Multi-Agent — coordinates specialists

The architecture diagram should look like a clean technical blueprint with wireframe style.

PAGE: "25 / ${TOTAL}"`
},

// ─── SLIDE 26: CHAT-APPS VS AGENTIC ──────────────────────────────
{
  style: "data",
  prompt: `
TITLE: "Chat-Apps vs Personal Agentic Assistants"
Chinese (long, use line 2): "聊天应用与个人智能体助手的竞争"

TWO WHITE CARDS:

─── CARD 1 (left): "Capability Comparison" ───
Clean data table:

Capability | Chat-App | OS-Native Agent
File System Access | ✗ No | ✓ Full access
Background Tasks | ✗ No | ✓ Yes
System Notifications | ✗ Limited | ✓ Full control
Cross-App Integration | ✗ No | ✓ Via APIs
Offline Operation | ✗ No | ✓ On-device LLM
Custom Tool Creation | ✗ No | ✓ Yes

Use red/gray for ✗ entries, green/dark for ✓ entries. Clean alternating rows.

Below: market stats:
"AI Assistant Market: $3.35-14.14B (2025) → $21-71B (2030)"
"CAGR: 22-44.5%"

─── CARD 2 (right): "The Smartphone Revolution" ───
Before/After visualization:

CURRENT STATE (top):
"80+ apps installed | 9-12 used daily | 50+ app switches/day"
Icon: phone with crowded app grid

AGENT-CENTRIC FUTURE (bottom):
"Modular agents embedded across devices"
Icon: phone with single clean agent interface

Predictions:
• "80% customer service replaced by AI agents by 2029" (Gartner)
• "33% enterprise software includes agentic AI by 2028" (Gartner)

Body: "The future isn't 80 apps — it's one intelligent agent that coordinates everything."

PAGE: "26 / ${TOTAL}"`
},

// ─── SLIDE 27: SELF-EVOLVING AI & CLAWDBOT ───────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Self-Evolving AI & The Clawdbot Vision"
Chinese (long, use line 2): "自我进化的AI与Clawdbot愿景"

TWO WHITE CARDS:

─── CARD 1 (left): "The Recursive Improvement Loop" ───
Diagram: A circular/spiral diagram showing the AGI loop:

"Agent Uses Tools" → "Observes Results" → "Learns from Feedback" → "Creates Better Tools" → back to start

The key insight in a central callout: "Tools can create tools. This is AGI."

Evidence metrics below:
• Tool Creation: Claude generates custom scripts
• Tool Use: Executes tools, observes, iterates
• Feedback: Usage data trains better models
• Self-Improvement: +116% autonomous actions in 6 months

─── CARD 2 (right): "The Clawdbot Vision" ───
Diagram: A vertical list of 6 capabilities, each with an icon and flowing downward:

1. "UNDERSTANDS" — ear/input icon — your goals from natural language
2. "PLANS" — blueprint icon — multi-step tasks across systems
3. "CREATES" — wrench icon — custom tools when needed
4. "EXECUTES" — play button icon — autonomously, minimal supervision
5. "LEARNS" — brain icon — from every interaction
6. "EVOLVES" — DNA/spiral icon — its own capabilities over time

Quote at bottom in a prominent box:
"Chat-apps are the past. OS-native agents are the future."

PAGE: "27 / ${TOTAL}"`
},

// ─── SLIDE 28: AGENTIC AI WARS ───────────────────────────────────
{
  style: "data",
  prompt: `
TITLE: "Agentic AI Wars: The $650B Arms Race"
Chinese (long, use line 2): "智能体AI大战：6500亿美元军备竞赛"

MAIN CONTENT: This is a DATA-DENSE slide. One large white card with a CAPABILITIES MATRIX table:

Header: Company | Foundation Model | Agentic Product | B2B | B2C | 2026 CapEx | Verdict

9 rows:
Google | Gemini 2.0 | Project Mariner | 5/5 | 5/5 | $175-185B | Agentic Native
Microsoft | GPT-4o/MAI | Copilot Agents | 5/5 | 3/5 | ~$150B | Agentic Platform
Amazon | Nova/Claude | Amazon Q | 5/5 | 3/5 | $200B | Agentic Infra
Meta | Llama 4 | Meta AI Agents | 3/5 | 5/5 | $115-135B | Emerging Native
OpenAI | GPT-5 | Operator | 3/5 | 5/5 | $40B+ | Pioneer at Risk
Anthropic | Claude 4.6 | Claude Cowork | 5/5 | 2/5 | $6B+ | Best Tech, Limited
xAI | Grok 4.1/5 | Grok Agents | 4/5 | 3/5 | $50B+ | Disruptor
NVIDIA | Nemotron | NIM/AgentIQ | 5/5 | 1/5 | N/A | Infra Monopoly
Apple | Apple Intelligence | Siri 2.0 | 2/5 | 4/5 | ~$10B | Laggard at Risk

Use star ratings (filled/empty circles or stars) for B2B/B2C columns. Alternating row shading. Clean, readable. Use small text (10-11pt) to fit all data.

Below the table: "Tesla FSD flywheel template: Real-world Data → Model Training → Improved Performance → More Users → More Data"

PAGE: "28 / ${TOTAL}"`
},

// ─── SLIDE 29: STRATEGIC IMPLICATIONS ─────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Strategic Implications: Winners & Losers"
Chinese (long, use line 2): "战略启示：赢家与输家"

THREE WHITE CARDS:

─── CARD 1: "The Winners" ───
4 entries with trophy/star icons:
• "Google" — Personal intelligence flywheel (Android × Chrome × Search × Workspace) — Score: 20/20
• "Microsoft" — Enterprise orchestration (Office 365 × Azure × Copilot) — Score: 17/20
• "NVIDIA" — Infrastructure monopoly (GPUs for every deployment) — Score: 20/20
• "Meta" — Open ecosystem + consumer scale (3B users × Llama) — Score: 18/20

─── CARD 2: "At Risk" ───
3 entries with warning/caution icons:
• "OpenAI" — No owned distribution, dependent on Microsoft/Apple — Score: 9/20
• "Anthropic" — Premium positioning limits scale, no owned infra — Score: 7/20
• "Apple" — 2-3 years behind, dependent on OpenAI/Google — Score: 15/20

─── CARD 3: "Dark Horses" ───
2 entries with horse/wild card icons:
• "xAI" — Real-time data + government contracts + Colossus — Score: 10/20
• "Amazon" — AWS dominance + enterprise platform (Bedrock) — Score: 16/20

Below cards, the formula:
"Data Scale + Distribution Control + Custom Silicon + Vertical Integration = Winner"

PAGE: "29 / ${TOTAL}"`
},

// ─── SLIDE 30: APPENDIX ──────────────────────────────────────────
{
  style: "data",
  prompt: `
TITLE: "Appendix | 附录"

MAIN CONTENT: This is a DATA-DENSE slide. Use maximum space for data. Minimal decoration.

THREE SECTIONS in one large white card:

─── SECTION 1: "Key Metrics Summary" (top) ───
Compact table, 2 columns:
$3 trillion | Global software development value
2× | Best-in-class AI productivity gain
$285 billion | Feb 4 2026 single-day stock wipeout
80.9% | Claude Opus 4.5 SWE-bench score
$20K | 16-agent 100K-line compiler cost
80%+ | Anthropic engineers using Claude Code daily
+67% | PR throughput increase
$1 billion | Claude Code revenue (Nov 2025)
90% | Claude Code codebase written by itself
$350 billion | Anthropic valuation (in talks)

─── SECTION 2: "Big Tech AI Investment 2026" (middle) ───
Compact table:
Amazon | $200B | +50% YoY | AI data centers, Trainium
Google | $175-185B | +100% YoY | TPU v5, Gemini
Meta | $115-135B | +73% YoY | AI superintelligence labs
Microsoft | ~$150B | +66% YoY | Azure AI, Maia chips

─── SECTION 3: "Timeline" (bottom) ───
Horizontal timeline with key dates:
Late 2024: Google 25%+ AI code
Oct 2025: Meta "Think 5X"
Nov 2025: Claude Code $1B revenue
Dec 2025: Claude Code inflection
Jan 2026: ROCm breakthrough
Feb 4, 2026: SaaSpocalypse
Feb 5, 2026: Agent Teams

All sections should be compact, clean, maximizing data density while remaining readable.

"Document Version: r1.0 | February 2026"

PAGE: "30 / ${TOTAL}"`
},

];

// ─── GENERATION ENGINE ─────────────────────────────────────────────
async function genSlide(ai, idx) {
  const s = slides[idx];
  const outFile = path.join(SLIDE_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);

  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`Cached: slide ${idx + 1}`);
    return outFile;
  }

  const prefix = s.style === "cover" ? STYLE_COVER
    : s.style === "data" ? STYLE_DATA
    : STYLE;

  const fullPrompt = prefix + "\n\n" + s.prompt;

  for (let a = 1; a <= 3; a++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        config: { responseModalities: ["IMAGE", "TEXT"] },
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

  console.log(`Generating ${TOTAL} slides...`);
  const paths = [];

  for (let i = 0; i < slides.length; i++) {
    const p = await genSlide(ai, i);
    paths.push(p);
    if (i < slides.length - 1) await new Promise(r => setTimeout(r, 3000));
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

  const outFile = "Tectonic_Shift_v2.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${TOTAL} slides)`);
}

main().catch(err => console.error("Fatal:", err));
