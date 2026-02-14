const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-expanded-v1";
const SW = 13.333, SH = 7.5;
const TOTAL = 35;

// ─── SHARED STYLE PREFIX ───────────────────────────────────────────
const STYLE = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Light purple gradient — from pale lavender-white (#F8F5FC) at top-left to soft lavender (#EAE0F5) at bottom-right. Elegant, soft, not too saturated — think frosted lilac glass. In the background, VERY FAINTLY visible (like a ghosted watermark at 5-8% opacity), include a gentle sketch outline of a large whale silhouette — positioned in the right half of the slide. Just barely-visible faint purple-gray pencil lines, like a watermark printed on fine paper. The whale should NOT compete with the content.

TYPOGRAPHY (STRICT):
- ALL English text MUST use Manrope font (geometric modern sans-serif, clean and rounded). No exceptions.
- ALL Chinese text MUST use Noto Sans SC font (clean Chinese sans-serif, matching weight). No exceptions.
- Clean, professional, highly legible.

TITLE RULES (STRICT):
- Title font size MUST be EXACTLY 24pt. Never smaller, never larger. Always 24pt.
- If the Chinese translation is SHORT (≤8 characters), put English and Chinese on ONE line separated by " | " — e.g. "The AGI Implication | AGI的启示"
- If the Chinese translation is LONG (>8 characters), use TWO lines: English title on line 1 in 24pt, Chinese title on line 2 in 20pt.
- Subtitle (if any) goes below the title in medium gray, ~14-16pt.
- Title text color MUST be black or near-black (#1A1A1A). Never use white or light text on content slides.
- NO page numbers anywhere on the slide.

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

TYPOGRAPHY (STRICT):
- ALL English text MUST use Manrope font (geometric modern sans-serif). No exceptions.
- ALL Chinese text MUST use Noto Sans SC font (clean Chinese sans-serif). No exceptions.
- Clean, professional, highly legible.

TITLE RULES (STRICT):
- Title font size MUST be EXACTLY 24pt. Never smaller, never larger. Always 24pt.
- If the Chinese translation is SHORT (≤8 characters), put English and Chinese on ONE line separated by " | "
- If the Chinese translation is LONG (>8 characters), use TWO lines: English title on line 1 in 24pt, Chinese title on line 2 in 20pt.
- Title text color MUST be black or near-black (#1A1A1A).
- NO page numbers anywhere on the slide.

DATA-DENSE SLIDE: This slide contains dense data tables or comparison matrices. PRIORITIZE data presentation clarity above all else. Reduce or remove decorative sketch elements. Use clean table layouts with maximum readability. Data > decoration. Tables should have clear headers, aligned columns, generous spacing, and alternating subtle row shading for readability. Only keep minimal wireframe accents that aid comprehension (small icons in table cells OK), never at the expense of data legibility.

Premium consulting deck aesthetic — clean, intellectual, data-forward.`;

// Cover variant (dark background)
const STYLE_COVER = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Dark purple gradient — from deep midnight purple (#1A0F40) at top-left to rich purple (#3D2580) at bottom-right. Rich, elegant, dramatic.

In the right half of the slide, include a VISIBLE but subtle sketch of a large whale silhouette — drawn in light purple/lavender wireframe lines (#C4B5D9, #E8DFF5) at ~20-30% opacity. The whale is "falling" gracefully, with small particles and dots rising below it (representing "一鲸落万物生" — when a whale falls, all things flourish). The whale is sketch/wireframe style, NOT photorealistic.

TYPOGRAPHY (STRICT):
- ALL English text MUST use Manrope font (geometric modern sans-serif). No exceptions.
- ALL Chinese text MUST use Noto Sans SC font (clean Chinese sans-serif). No exceptions.
- On dark background, text should be white or very light lavender.
- Title font size MUST be EXACTLY 24pt (or 28pt for main cover title only).
- NO page numbers anywhere on the slide.

The LEFT 40% of the slide should be relatively clear for text content. The whale sketch occupies the RIGHT 60%.

Premium, dramatic, cinematic but still intellectual and clean.`;

// ─── SLIDE PROMPTS ─────────────────────────────────────────────────
const slides = [

// ═══════════════════════════════════════════════════════════════════
// SLIDE 1: COVER
// ═══════════════════════════════════════════════════════════════════
{
  style: "cover",
  prompt: `
TITLE (large, bold, white, left-aligned in the left 45%):
Line 1: "AI Coding: The Tectonic Shift in Software" — bold, ~28pt, white
Line 2: "AI编程：软件行业的结构性变革" — ~20pt, light lavender

Below title:
"STRATEGIC INSIGHT REPORT | 战略洞察报告" — small caps, ~12pt, light gray/lavender
"February 2026"

Below that, a subtitle in warm white:
"The $3 Trillion Whale Is Falling | $3万亿巨鲸正在坠落"

Below subtitle, in smaller lighter text:
"一鲸落万物生 — When a whale falls, all things flourish"

Near bottom-left, small source badges in muted lavender text:
"Sources: a16z · Apollo Global · ARK Invest · S&P Index · 36氪"

The whale sketch on the right should be the main visual element — elegant wireframe whale descending with particles rising.`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 2: SaaS CRISIS & SEAT COMPRESSION
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "SaaS Crisis & Seat Compression"
Chinese (long, use line 2): "SaaS危机与座位压缩"

THREE WHITE CARDS:

─── CARD 1: "Fatal Vulnerability" ───
Diagram: A tall tower of 4 stacked blocks with icons (cloud=SCALABLE, dollar=HIGH MARGIN, lightbulb=PURE IP, feather=LIGHT ASSET). Arrow from right with brain-gear icon labeled "AI DISRUPTION" pointing at base. Cracks at tower base.
Body: "Software's asset-light nature — once its greatest strength — is now its fatal weakness. Unlike industrial businesses, software has no hard collateral; value can evaporate overnight when the abstraction layer collapses."

─── CARD 2: "Seat Compression" ───
Diagram: Big stat "60-80%" with "Revenue Drop" beside it. Below: flow of 5 desk-person icons → arrow → 2 desk icons + robot icon. Labels "1,000 LICENSES" → "600 (40% AI)" → "200 (80% AI)". Small declining staircase chart labeled "SaaS REVENUE".
Body: "Per-seat pricing collapses: Salesforce Service Cloud ~40% fewer licenses, ServiceNow ITSM cuts human IT staff roughly in half."

─── CARD 3: "The Structural Reset" ───
Diagram: Three boxes labeled "PREDICTABLE GROWTH", "8-12× MULTIPLES", "COMPOUNDING" with X marks through them. Below each: "CONTRACTS", "COMPRESSES", "UNWINDS". A downward arrow to a scale/balance icon tipping.
Body: "This is not cyclical correction — it is structural reset. Value migrates from software to compute, infrastructure, energy, and physical systems."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 3: SaaSpocalypse (Enhanced)
// ═══════════════════════════════════════════════════════════════════
{
  style: "data",
  prompt: `
TITLE: "The February 2026 'SaaSpocalypse'"
Chinese (long, use line 2): "2026年2月'SaaS末日'"
Subtitle: "Claude Cowork demo triggers $285 billion single-day software stock wipeout"

MAIN CONTENT: One large white card spanning full width with a clean DATA TABLE:

Table header row (bold): Company | Sector | Stock Drop | Significance

Data rows:
Gartner | Research & Advisory | -21% | Advisory value questioned
LegalZoom | Legal Services | -20% | Legal automation threat
Thomson Reuters | Legal/Financial Data | -16% | Worst single-day drop on record
Novo Nordisk | Healthcare/Pharma | -15% | AI drug discovery fears
RELX (LexisNexis) | Legal Research | -14% | Legal research monopoly threatened
London Stock Exchange Group | Financial Data | -13% | Financial services disruption
WPP | Advertising | -12% | Creative automation fears
CS Disco | Legal Technology | -12% | Legal tech disruption
S&P Global | Financial Data | -11% | Financial data services
Equifax | Credit Reporting | -12% | Credit analysis automation
Intuit | Accounting Software | -10% | Accounting automation
Cognizant | IT Services | -10% | IT outsourcing at risk

Use alternating subtle lavender/white row shading. The percentage drops should be visually prominent (bold red text).

Below the table, two stat boxes side by side:
LEFT: "Goldman Sachs US Software Basket: -6%" — "Steepest daily loss since April 2025 tariff slump"
RIGHT: "Financial Services Index: -7% | Nasdaq-100: -2.4%"

Bottom-right: Quote — "We call it the 'SaaSpocalypse'" — Jeffrey Favuzza, Jefferies

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 4: AI ACQUISITION STRATEGY
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "AI Acquisition Strategy | AI收购策略"

THREE WHITE CARDS:

─── CARD 1: "Acquire for Customers, Not Tech" ───
Diagram: A simple flow: AI Company icon → handshake → SaaS Vendor icon. Below: the SaaS vendor is crossed out (technology), but a group of people icons (customer base) is highlighted and flows into the AI company.
Body: "AI companies acquire SaaS vendors for customer relationships and distribution — not technology. Technology is commoditized by AI; the moat is distribution."

─── CARD 2: "The Acquisition Logic" ───
Diagram: A 4-row mini table with icons:
CUSTOMER RELATIONSHIPS — people icon — "Instant enterprise access, bypass 18-month sales cycles"
DISTRIBUTION CHANNELS — network/web icon — "Established go-to-market infrastructure"
DATA FOR TRAINING — database icon — "Proprietary domain data to fine-tune AI models"
BRAND TRUST — shield icon — "Enterprise credibility and trust"

─── CARD 3: "Strategic Outlook" ───
Diagram: Three stacked statements with arrows:
"SaaS vendors → Customer relationship acquisitions" (arrow down)
"Technology → Commoditized by AI" (crossed out)
"Moat → Shifts from product to distribution" (highlighted)

A simple formula at bottom: "AI Capabilities + Existing Customer Base = Instant Distribution"

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 5: FROM L2 TO L5
// ═══════════════════════════════════════════════════════════════════
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

L1 — "Code Completion" — icon: cursor with suggestion bubble — "Hands on: AI suggests completions"
L2 — "Copilot-Style" — icon: split screen (human + AI) — "Feet off: AI assists, human directs"
L3 — "Claude Code" — icon: chat terminal with code output — "Eyes off: AI writes, human directs with NL"
L4 — "Full Autonomy" — icon: robot at desk coding alone — "Minds off: minimal oversight"
L5 — "Human-Free" — icon: brain/AI with radiating lines — "Fully autonomous AI development"

A vertical arrow on the far left from L1 to L5 labeled "INCREASING AUTONOMY →"

A prominent marker/highlight on the L3-L4 boundary labeled "WE ARE HERE" with a star icon.

Below the progression, proof points in smaller text:
"SWE-bench Verified: Claude Opus 4.5 achieves 80.9% | 30+ hours continuous autonomous operation | Claude Cowork built 100% by AI in under 2 weeks"

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 6: CONSOLE OVER IDE
// ═══════════════════════════════════════════════════════════════════
{
  style: "data",
  prompt: `
TITLE: "Console Over IDE: The New Interface Paradigm"
Chinese (long, use line 2): "控制台取代IDE：新界面范式"
Subtitle: "From human-engineer-centric IDEs to natural-language-driven consoles"

MAIN CONTENT: One large white card with a COMPARISON TABLE:

Header row (bold): Dimension | Traditional IDE (Cursor, Windsurf) | Console (Claude Code)

Data rows with small wireframe icons in Dimension column:
1. Interface | GUI, code-centric | Terminal, intent-centric
2. Workflow | Human writes, AI assists | Human describes, AI implements
3. Lock-in | IDE-specific extensions | Zero lock-in, any terminal
4. Learning Curve | Steep (IDE features, shortcuts) | Flat (natural language)
5. Context Window | File-limited | Full project context (CLAUDE.md)
6. Autonomy | L2 Copilot-style | L3/L4 Agent-style
7. Best Use Case | Code editing, refactoring | Full-stack implementation

Use alternating subtle lavender/white row shading. The "Console" column should feel like the highlighted/preferred option.

Below the table, three big stat blocks in a row:
"+116%" — "Autonomous actions increase"
"-33%" — "Human turns per task"
"'Vibe Coding'" — "Human describes intent, AI implements"

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 7: UNLEASH TRILLIONS — EVIDENCE
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Unleash Trillions $ Potential in Software Productivity with AI"
Chinese (long, use line 2): "AI 解锁 万亿美元的软件生产力"
Subtitle: "Consistent evidence of at least 2× productivity gains"

THREE WHITE CARDS:

─── CARD 1: "The $3T Opportunity" ───
Diagram: Large stat "30M" developers icon × "$100K/year" dollar icon = "$3 TRILLION" in huge bold text. Below: "Annual global software development value (a16z)"
Arrow pointing to: "2× productivity = $3T incremental GDP impact"
Body: "Comparable to the economic effect of the Industrial Revolution."

─── CARD 2: "Enterprise Evidence" ───
Diagram: Four evidence blocks with metric icons:
• "333% ROI" — chart icon — "Forrester TEI study of Claude Code, payback < 6 months"
• "9/18 = 100%+" — person icon — "Anthropic employees achieving 100%+ productivity gain"
• "30% faster PRs" — merge icon — "Palantir PR turnaround improvement"
• "70 hrs/week" — clock icon — "Palantir engineering hours saved weekly"

─── CARD 3: "The Operating Model Shift" ───
Diagram: Two paths diverging from a fork:
PATH A: "Same output, half the developers" — shrinking team icon
PATH B: "Double output, same team" — growing output icon

Below: "Cost structure shifts from headcount-driven to compute-driven"
"Marginal cost governed by scale economics, not salary bands"

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 8: UNLEASH TRILLIONS — AI BUILDING AI
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Unleash Trillions $ Potential in Software Productivity with AI"
Chinese (long, use line 2): "AI 解锁 万亿美元的软件生产力"
Subtitle: "AI is increasingly building AI"

THREE WHITE CARDS:

─── CARD 1: "Self-Building Tools" ───
Diagram: A recursive loop: "Claude Code v1" → builds → "Claude Cowork" → builds → "Next-Gen Tools" → improves → back to start. The loop ascends like a spiral.
Body: "Claude Code evolves through AI-driven planning, coding, and iteration. 90% of Claude Code codebase written by Claude Code itself."

─── CARD 2: "Single-Developer Megaprojects" ───
Diagram: One person icon surrounded by multiple terminal/code windows radiating outward. Big stat: "100,000+" lines of code.
Body: "Single-developer projects built with AI now reach hundreds of thousands of lines of complex, production-quality code."

─── CARD 3: "Open-Source Transformation" ───
Diagram: A pie chart or growing bar showing AI-generated share increasing. GitHub icon with AI robot contributions flowing in.
Body: "A growing share of open-source contributions are AI-generated. AI is moving from assistant to primary producer of software."

Bottom banner: "THE IMPLICATION: AI is not just assisting — it is becoming the primary producer of software"

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 9: FIRST PRINCIPLES — STACK DIAGRAM
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "First Principles in Action: Rethinking the Abstraction Stack"
Chinese (long, use line 2): "用第一性原理重构抽象层设计"

TWO WHITE CARDS:

─── CARD 1 (left): "Traditional Stack (PyTorch)" ───
Diagram: A tall vertical stack of 8 layers, each a box connected by downward arrows:
1. "User Application" (top)
2. "Python Framework (PyTorch)"
3. "Python Runtime"
4. "CUDA Toolkit"
5. "cuDNN / cuBLAS"
6. "GPU Drivers"
7. "OS"
8. "Hardware" (bottom)

Label the stack: "8 LAYERS OF ABSTRACTION"
Side note: "1000+ packages, dependency hell"

─── CARD 2 (right): "First-Principles Stack (flux2.c)" ───
Diagram: A short vertical stack of only 4 layers:
1. "User Application" (top)
2. "Pure C Library"
3. "Optional Metal / BLAS"
4. "OS"
5. "Hardware" (bottom)

Label the stack: "ZERO DEPENDENCIES — C standard library only"
Side note: "Direct hardware access, architecture-specific kernels"

Between the two cards, a large "vs" in a circle. The right card should appear significantly shorter/simpler than the left, visually showing the dramatic reduction in complexity.

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 10: FIRST PRINCIPLES — COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════
{
  style: "data",
  prompt: `
TITLE: "First Principles in Action: Rethinking the Abstraction Stack"
Chinese (long, use line 2): "用第一性原理重构抽象层设计"
Subtitle: "PyTorch vs flux2.c — Head-to-Head Comparison"

MAIN CONTENT: One full-width white card with a COMPARISON TABLE:

Header row (bold): Dimension | PyTorch (Traditional) | flux2.c (First Principles)

Data rows:
1. Dependencies | 1000+ packages | Zero (C standard library only)
2. Memory Model | Python GC + CUDA managed | Manual, predictable allocation
3. GPU Backend | CUDA (NVIDIA lock-in) | Metal / optional BLAS
4. Kernel Design | Generic, one-size-fits-all | Architecture-specific, hand-optimized
5. Deployment | Container with full stack | Single binary
6. Abstraction Layers | 8 layers | 4 layers
7. Target Hardware | NVIDIA GPUs primarily | Any hardware with C compiler
8. Build Time | Minutes (dependency resolution) | Seconds

Use alternating subtle lavender/white row shading. The flux2.c column should feel cleaner/highlighted.

Below the table, a key insight box:
"First principles: strip away layers built for human convenience. When AI writes code, abstraction is no longer necessary — optimize directly for hardware."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 11: A2UI — CONCEPT
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "A2UI: The End of App Islands"
Chinese (long, use line 2): "A2UI：应用孤岛的终结"
Subtitle: "Google's Agent-to-User Interface — every person gets their own unique app"

TWO WHITE CARDS:

─── CARD 1 (left): "The Problem: App Islands" ───
Diagram: Multiple app icons (shopping bag, map, calendar, email, bank, music) each trapped inside separate boxes/islands with walls between them. No connections between islands.
Label: "80+ apps installed, 9-12 used daily, 50+ switches/day"
Body: "Today's apps are isolated silos. Each has its own UI, data, login. Users are trapped navigating between disconnected islands."

─── CARD 2 (right): "A2UI: The Solution" ───
Diagram: A flow chart:
"User Intent" → "AI Agent" → "A2UI Messages (Declarative JSON)" → "Client Renderer" → "Native Components"

Below: Three key properties with icons:
• "HYPER-PERSONALIZED" — fingerprint icon — "Based on user context, preferences, device"
• "REAL-TIME GENERATED" — lightning icon — "Seconds, not months of engineering"
• "ONE RESPONSE, NATIVE EVERYWHERE" — multi-device icon — "Phone, tablet, desktop, watch"

Body: "Not one app for billions — billions of unique interfaces for billions of users."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 12: A2UI — PROTOCOL TABLE
// ═══════════════════════════════════════════════════════════════════
{
  style: "data",
  prompt: `
TITLE: "A2UI: The End of App Islands"
Chinese (long, use line 2): "A2UI：应用孤岛的终结"
Subtitle: "Protocol Comparison: Traditional Apps vs A2UI"

MAIN CONTENT: One full-width white card with a COMPARISON TABLE:

Header row (bold): Dimension | Traditional Apps | A2UI

Data rows:
1. Interface | Static, one-size-fits-all | Dynamic, personalized per user
2. Development | Months of engineering | Seconds of AI generation
3. Deployment | App store review & install | Real-time streaming
4. Security | Code execution risks | Declarative (no code execution)
5. Platform Support | Separate builds per platform | One response, native everywhere
6. Personalization | A/B testing, manual segments | AI-driven, per-user context
7. Updates | App store release cycles | Instant, continuous
8. Data Integration | API-by-API manual wiring | Agent orchestrates all sources

Use alternating subtle lavender/white row shading. The A2UI column should feel like the future/preferred option.

Below the table, a prominent insight:
"A2UI disrupts current app island models: edge AI generates interfaces in real-time, multi-modal, multi-device."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 13: THE IMPOSSIBLE TRIANGLE
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "The 'Impossible Triangle' Is Broken"
Chinese (long, use line 2): "'不可能三角'被打破"

TWO WHITE CARDS:

─── CARD 1 (left): "The Traditional Constraint" ───
Diagram: A large triangle with vertices labeled:
TOP: "PERFORMANCE" (speedometer icon)
BOTTOM-LEFT: "PORTABILITY" (globe/multi-platform icon)
BOTTOM-RIGHT: "USABILITY" (user/smile icon)

Inside the triangle, "PICK TWO" in bold text.

Three trade-off labels on the edges:
• Performance + Portability = "Complex code, poor usability"
• Portability + Usability = "Higher abstractions, performance suffers"
• Performance + Usability = "Platform-specific, loses portability"

─── CARD 2 (right): "AI Breaks the Triangle" ───
Diagram: Same triangle but now ALL THREE vertices are highlighted/checked. The "PICK TWO" label is crossed out, replaced with "ALL THREE".

Three AI capabilities mapped to vertices:
• PERFORMANCE: "AI handles implementation complexity & optimization"
• USABILITY: "Humans express intent in natural language"
• PORTABILITY: "AI generates platform-specific code for each target"

A key insight box below: "The impossible triangle is no longer a constraint. AI enables best of all worlds. Hardware innovation accelerates as software abstraction layers collapse."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 14: AI UNLEASHES HARDWARE — NARRATIVE
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "AI Unleashes Hardware: The Universal Translator"
Chinese (long, use line 2): "AI释放硬件：通用翻译器"
Subtitle: "From abstraction to direct hardware access"

TWO WHITE CARDS:

─── CARD 1 (left): "The Abstraction Ladder" ───
Diagram: A vertical ladder/timeline showing software history ascending:
BOTTOM: "Binary & Assembly" — chip icon
↑ "C / Systems Languages" — gear icon — "Close to hardware"
↑ "Java / Python / JavaScript" — cloud icon — "Virtual machines, abstracts hardware away"
↑ "Frameworks & Layers" — stack icon — "Maximum portability, minimum performance"

Each step up gains portability/usability but LOSES performance. Label: "EACH STEP: +PORTABILITY, -PERFORMANCE"

─── CARD 2 (right): "AI: The New Variable" ───
Diagram: The same ladder but with an AI brain icon at the side, with arrows showing it can DIRECTLY access any level.

Key capabilities listed:
• "End-to-end Rust: UI to drivers" — no abstraction tax
• "Platform-specific code generation" — portability without reusable codebase
• "Hardware-native optimization" — AI reads intent, writes for target arch
• "Abstraction layers collapse" — most legacy software gets rewritten

Body: "When AI writes code, abstraction is no longer necessary for human convenience. Systems can be written end-to-end in performance-maximizing languages."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 15: AI UNLEASHES HARDWARE — CUDA BREAKTHROUGH
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "AI Unleashes Hardware: The Universal Translator"
Chinese (long, use line 2): "AI释放硬件：通用翻译器"
Subtitle: "CUDA's 15-year lock-in broken in 30 minutes"

TWO WHITE CARDS:

─── CARD 1 (left): "The CUDA Monopoly" ───
Diagram: A fortress/castle icon labeled "CUDA" with a shield showing "15+ YEARS". Walls block paths to other hardware:
• AMD (blocked) — "ROCm: inferior ecosystem"
• ARM (blocked) — "NEON/SVE: limited adoption"
• NPU (blocked) — "Custom intrinsics: no standard"

Label: "Software moat locked developers into NVIDIA"

─── CARD 2 (right): "AI as Universal Translator" ───
Diagram: An AI brain icon in the center with translation arrows going to multiple targets:
• "CUDA Kernel" → AI reads → "HIP/ROCm (AMD)"
• "CUDA Kernel" → AI reads → "NEON/SVE (ARM)"
• "CUDA Kernel" → AI reads → "NPU Intrinsics"
• "Python" → AI reads → "Rust + Metal"

Big stat at top: "~30 MINUTES" — "January 2026: Claude Code ports entire CUDA backend to ROCm"

Body: "Rewriting becomes review. Costs drop by orders of magnitude. Hardware competition reverts to performance and price — not software ecosystem lock-in."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 16: CASE STUDY — OminiX-MLX OVERVIEW
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Case Study: OminiX-MLX"
Chinese (long, use line 2): "案例研究：OminiX-MLX"
Subtitle: "Pure Rust, unified architecture, all modalities on Apple MLX"

TWO WHITE CARDS:

─── CARD 1 (left): "Project Overview" ───
Diagram: A central hexagon labeled "OminiX-MLX" with 4 branches radiating out:
• "LLM" — brain icon — "Qwen3, GLM4, Mixtral, Mistral"
• "ASR" — microphone icon — "FunASR Paraformer, FunASR-Nano"
• "TTS" — speaker icon — "GPT-SoVITS voice cloning"
• "IMAGE" — image icon — "FLUX.2-klein, Z-Image, Qwen"

Stats below:
"83.7% Pure Rust" | "Couple of weeks" build time | "Thin Rust wrapper over MLX"

─── CARD 2 (right): "First Principles in Practice" ───
Diagram: Comparison visual:

TOP (faded): "TRADITIONAL PYTHON MLX"
• Fragmented: 4 separate repo icons
• "Python + C++ bindings"
• "Years of community effort"
• "Multiple Python layers"

BOTTOM (bold): "OminiX-MLX"
• Unified: 1 single repo icon
• "Pure Rust"
• "Couple of weeks"
• "Thin abstraction layer"

Arrow from top to bottom labeled "FIRST PRINCIPLES"

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 17: OminiX-MLX — COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════
{
  style: "data",
  prompt: `
TITLE: "Case Study: OminiX-MLX"
Chinese (long, use line 2): "案例研究：OminiX-MLX"
Subtitle: "OminiX-MLX vs Python MLX Ecosystem"

MAIN CONTENT: One full-width white card with a COMPARISON TABLE:

Header row (bold): Dimension | Python MLX Ecosystem | OminiX-MLX (Rust)

Data rows:
1. Language | Python + C++ bindings | Pure Rust (83.7%)
2. Architecture | Fragmented, separate projects | Unified, all modalities in one
3. Development Time | Years of community effort | Couple of weeks
4. Abstraction | Multiple Python layers | Thin Rust wrapper over MLX
5. Parallelism | Python GIL limits parallelism | True parallelism with Rust
6. Type Safety | Runtime type errors | Compile-time type safety
7. Dependencies | Dependency hell (pip) | Cargo.toml reproducible builds
8. Performance | Interpreted overhead | Native Rust performance

Use alternating subtle lavender/white row shading. The OminiX-MLX column should feel cleaner/highlighted.

Below the table:
"THE CONTRAST: What took a fragmented Python ecosystem years to build, OminiX-MLX achieved in weeks with pure Rust — unified, safe, fast."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 18: RUST — THE LANGUAGE FOR THE AI AGE
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Rust: The Language for the AI Age"
Chinese (long, use line 2): "Rust：AI时代的编程语言"

THREE WHITE CARDS:

─── CARD 1: "The Security Crisis" ───
Diagram: Big stat "70%+" in huge bold text, with a broken shield icon.
Below: "Of critical security vulnerabilities in OS/infrastructure are memory-related"
Three X marks: "Buffer overflow", "Use-after-free", "Race conditions"
Body: "Rust eliminates these by design through compile-time memory and concurrency safety while matching C/C++ performance."

─── CARD 2: "AI Removes the Barrier" ───
Diagram: Two eras shown:
BEFORE: Person struggling with Rust book, steep learning curve graph → "Limited adoption"
AFTER: AI robot writing Rust code fluently → "AI generates and maintains Rust at scale"
Body: "Historically, Rust's learning curve limited adoption. AI removes human constraints entirely — generating and maintaining Rust codebases at scale."

─── CARD 3: "Industry Convergence" ───
Diagram: Three authority icons converging:
• US DoD emblem → "Advocates Rust for critical systems"
• Microsoft logo text → "Galen Hunt: eliminate all C/C++ by 2030"
• AI brain icon → "AI-scale code generation enables the transition"
Body: "Structural transition: legacy C/C++ systematically rewritten in Rust by AI. Memory safety at scale. Hardware efficiency improves by orders of magnitude."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 19: VELOCITY AT SCALE — PART 1
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Velocity at Scale: AI Coding in Production"
Chinese (long, use line 2): "规模化提速：生产环境中的AI编程"
Subtitle: "How the world's largest tech companies deploy AI coding"

THREE WHITE CARDS:

─── CARD 1: "Meta — 'Think 5X'" ───
Diagram: Big stat "500%" with rocket icon. Below: mandate icon (scroll/decree).
Key data:
• "October 2025: VP Vishal Shah mandate"
• "500% execution speed increase target"
• ">50% AI-generated code by 2026"
• "Internal tool: CodeCompose"
Body: "Meta's 'Think 5X' mandate demands radical acceleration via AI coding."

─── CARD 2: "Google — Production Reality" ───
Diagram: Big stat ">25%" with checkmark icon. Google-style multicolor G text icon.
Key data:
• "Over 25% of all new code is AI-generated"
• "Human-reviewed before merge"
• "Late 2024 milestone"
• "Integrated across all engineering teams"
Body: "Google's production reality: a quarter of all new code is already AI-generated and human-reviewed."

─── CARD 3: "ByteDance — Mass Adoption" ───
Diagram: Big stat "90%" with people icon. ByteDance "Trae" text label.
Key data:
• "90% of engineers use 'Trae' internally"
• "40% of Douyin Local Services code is AI-written"
• "Rapid internal tool deployment"
Body: "ByteDance achieves near-universal AI coding adoption across engineering."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 20: VELOCITY AT SCALE — PART 2
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Velocity at Scale: AI Coding in Production"
Chinese (long, use line 2): "规模化提速：生产环境中的AI编程"
Subtitle: "Part 2: Density, Infrastructure & Hardware"

THREE WHITE CARDS:

─── CARD 1: "Tencent — Density Milestone" ───
Diagram: Big stat ">50%" with code bracket icon.
Key data:
• ">50% of new code is AI-generated"
• "Coding time reduced by 40%"
• "Density milestone: majority AI-written"
Body: "Tencent crosses the 50% threshold — more new code is AI-generated than human-written."

─── CARD 2: "Amazon — Infrastructure Scale" ───
Diagram: Big stat "4,500" developer-years saved, with dollar icon "$260M".
Key data:
• "Q Developer tool"
• "4,500 developer-years saved"
• "$260M in savings"
• "Java application upgrades at scale"
Body: "Amazon's Q Developer saved 4,500 developer-years ($260M) by automating Java application upgrades."

─── CARD 3: "NVIDIA — Hardware Automation" ───
Diagram: Big stat "97.4%" with chip/GPU icon.
Key data:
• "'ChipAgents' for next-gen GPU design"
• "97.4% accuracy in Verilog code"
• "Automating hardware design itself"
Body: "NVIDIA's ChipAgents achieve 97.4% accuracy in Verilog code generation — AI is now designing the hardware that runs AI."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 21: VALUE SHIFTING
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Value Shifting: 'One Whale Falls, All Things Flourish'"
Chinese (long, use line 2): "价值转移：'一鲸落万物生'"

TWO WHITE CARDS:

─── CARD 1 (left): "The Value Transfer" ───
Diagram: Two-era comparison:

TOP — "TRADITIONAL MODEL":
"Software Companies" box (large, highlighted) with label "HIGH MARGIN 70-90%"
"Infrastructure Providers" box (small, faded) with label "COMMODITY, LOW MARGIN"
Arrow showing value flowing TO software.

BOTTOM — "AI-NATIVE MODEL":
"Software" box (small, faded) with label "AI-GENERATED, NEAR-ZERO COST"
"Infrastructure" box (large, highlighted) with label "COMPUTE SCARCE, VALUE CAPTURE"
Arrow showing value flowing TO infrastructure.

Big reversal arrow between the two eras.

─── CARD 2 (right): "Evidence Table" ───
A compact table:
Dimension | Old World | New World
Software Margins | 70-90% | Near-zero (AI-generated)
Value Capture | Code / IP | Compute / Infrastructure
Moat | Feature differentiation | Hardware + Data
Cost Structure | Human salaries | Infrastructure costs
Scarce Resource | Developer talent | Compute & Energy

Body: "36氪: Software development capabilities shifting from human salaries to infrastructure costs. Infrastructure providers become the new giants."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 22: AGENTIC SUPER-VERTICAL — THESIS
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "The Emergence of the Agentic Super-Vertical Enterprise"
Chinese (long, use line 2): "垂直整合的超级智能体企业正在出现"
Subtitle: "AI removes software as the bottleneck — hardware becomes the driver"

TWO WHITE CARDS:

─── CARD 1 (left): "The Paradigm Flip" ───
Diagram: Two eras side by side:
BEFORE: "Hardware" box at bottom → blocked by → "Software Bottleneck" (wall icon) → limited "Applications" at top. Label: "Software constrains hardware"

AFTER: "Hardware" box at bottom → AI translator icon → direct "Applications" at top. The wall is broken. Label: "AI removes the bottleneck"

Key examples listed:
• "AI ports front-end to alternative GPU architectures (AMD)"
• "AI generates kernels exceeding human engineering standards"
• "AI migrates entire engines from JS/Python to Rust"

─── CARD 2 (right): "The Data Flywheel" ───
Diagram: A circular flywheel with 4 nodes:
"MORE DATA" → "BETTER MODELS" → "MORE COMPLEX TASKS" → "MORE SUCCESS & DATA" → back to start

The flywheel should look like it's accelerating. Motion lines around it.

Body: "This flywheel logic naturally drives super-vertical enterprises where chips, networking, data centers, models, and applications are tightly integrated."

A "WHALE FALL" label: "Traditional software industry erodes → value migrates to hardware, data centers, memory, power, energy infrastructure"

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 23: AGENTIC SUPER-VERTICAL — GOOGLE
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "The Emergence of the Agentic Super-Vertical Enterprise"
Chinese (long, use line 2): "垂直整合的超级智能体企业正在出现"
Subtitle: "Google: The Clearest Example of Vertical Integration"

MAIN CONTENT: One large white card with a VERTICAL STACK DIAGRAM:

A vertical flow showing Google's closed-loop integration, from bottom to top:

LAYER 1 (bottom): "TPUs" — chip icon — "Custom AI silicon"
↑ connected by arrow
LAYER 2: "Hyperscale Data Centers" — server rack icon — "Global infrastructure"
↑ connected by arrow
LAYER 3: "OCS Optical Networking" — fiber/light icon — "Links thousands of TPUs into single training system"
↑ connected by arrow
LAYER 4: "Gemini 3" — brain icon — "Trained entirely on this stack"
↑ connected by arrow
LAYER 5 (top): "End-User Applications" — apps icon — "Search, Android, Workspace, YouTube"

A large circular arrow wrapping around the entire stack labeled "CLOSED LOOP — PREMIUM VALUATION"

Side note: "Each layer feeds the next. No external dependencies. Full control of the flywheel."

Body: "Google controls the entire stack: custom silicon → data centers → networking → models → applications. This closed loop has restored it to the AI front line."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 24: AGENTIC SUPER-VERTICAL — xAI & APPLE
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "The Emergence of the Agentic Super-Vertical Enterprise"
Chinese (long, use line 2): "垂直整合的超级智能体企业正在出现"
Subtitle: "Divergent Paths: xAI's Infrastructure Bet vs Apple's Dependency"

TWO WHITE CARDS:

─── CARD 1 (left): "xAI: Infrastructure-First" ───
Diagram: A building/factory icon labeled "Colossus" at center. Radiating connections:
• "Physical Infrastructure" — power plant icon — "Gas turbines, substations, grid interconnects"
• "Compute" — GPU icon — "Massive GPU clusters"
• "Iteration Speed" — clock/fast icon — "Rapid model improvement"
• "Enterprise Software" — monitor icon — "Macrohard extension"

Key insight: "xAI bets that long-term advantage lies NOT in transient model rankings but in ownership of physical infrastructure, power, and iteration speed"

─── CARD 2 (right): "Apple: The Counter-Example" ───
Diagram: An Apple-like device icon at center with broken/missing connections:
• "Foundation Models" — brain icon with ✗ — "No proprietary model"
• "Data Centers" — server icon with ✗ — "No hyperscale infrastructure"
• "Training Stack" — stack icon with ✗ — "Depends on external providers"
• "Strategic Autonomy" — compass icon with ✗ — "SURRENDERED"

Body: "Without control of foundational models or data centers, Apple depends on external providers — revealing that in the AI era, companies not vertically integrated lose control of their own destiny."

Bottom banner: "PARTIAL STACKS FALL BEHIND. ABSTRACTION LAYERS COLLAPSE. CONTROL OF THE FLYWHEEL DEFINES THE WINNERS."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 25: MACROHARD — INFRASTRUCTURE VISION
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Macrohard: The Digital Employee Era"
Chinese (long, use line 2): "Macrohard：数字员工时代"
Subtitle: "Elon Musk's purely AI-native software company built on first principles"

TWO WHITE CARDS:

─── CARD 1 (left): "The Infrastructure Thesis" ───
Diagram: A pyramid/hierarchy from bottom to top:
BOTTOM (largest, foundation): "ENERGY & POWER" — power plant icon — "Gas turbines, transformers, substations, power plants"
MIDDLE: "COMPUTE" — GPU/server icon — "Colossus: world's first gigawatt-scale AI data center"
TOP (smallest): "MODELS & SOFTWARE" — brain icon — "AI agents generate software"

Label on left: "THE REAL BOTTLENECK" arrow pointing to bottom layer
Label on right: "GPUs are no longer the constraint — energy and electrical infrastructure are"

─── CARD 2 (right): "Strategic Rivalry" ───
Diagram: Two columns:
LEFT: "Microsoft" — enterprise building icon
RIGHT: "Macrohard" — rocket/disruptor icon

Key contrast:
• Microsoft: "Legacy enterprise software stack (databases, middleware, apps, SIs)"
• Macrohard: "AI collapses the entire stack — data directly to decisions"

Quote: "Musk has concluded that the enduring moat in enterprise software will not be algorithms — which inevitably converge — but control over compute, energy, and iteration speed."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 26: MACROHARD — DIGITAL EMPLOYEES
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Macrohard: The Digital Employee Era"
Chinese (long, use line 2): "Macrohard：数字员工时代"
Subtitle: "Zero human developers — AI agents as the entire workforce"

TWO WHITE CARDS:

─── CARD 1 (left): "The Autonomous Driving Flywheel Applied" ───
Diagram: A circular flywheel diagram adapted for enterprise:
"AI AGENTS WRITE SOFTWARE" → "OTHER AGENTS SIMULATE HUMAN USAGE" → "FEEDBACK LOOPS RUN CONTINUOUSLY" → "PRODUCTS CONVERGE AT MACHINE SPEED" → back to start

Inside the flywheel: "MASSIVE CLOSED DIGITAL ENVIRONMENTS"
Target: "Microsoft Office-class dominance"

─── CARD 2 (right): "The Digital Employee Company" ───
Diagram: An org chart where ALL positions are filled by robot/AI icons:
• "Developers" — AI icon
• "Testers" — AI icon
• "Designers" — AI icon
• "Analysts" — AI icon
Only one human icon at top: "Human Supervision / Orchestration"

Key metrics in bold:
• "~70% cost reduction"
• "~40% faster time-to-market"
• "Free or ultra-low-cost general software"
• "Lock-in via hyper-customized workflows on compute platform"

Body: "Enterprises receive 'free' software but become structurally dependent on the underlying compute and power platform."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 27: PALANTIR — FDE MODEL
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Human–AI Hybrid: The Palantir Playbook"
Chinese (long, use line 2): "人机协同：Palantir 方法论"
Subtitle: "Forward Deployed Engineers + AI Coding = Unprecedented Speed"

TWO WHITE CARDS:

─── CARD 1 (left): "The FDE Model" ───
Diagram: A flow showing the FDE approach:
"FDE" person icon embedded inside → "Customer Operations" building icon
Bidirectional arrows showing deep integration.

Below: Three key properties:
• "EMBEDDED" — lives with the customer, understands workflows
• "DOMAIN EXPERT" — deep industry knowledge, process understanding
• "TRUSTED" — customer relationships built over years

Origin story in smaller text: "Born from necessity: U.S. defense clients whose data could not leave secure environments"

─── CARD 2 (right): "FDE + AI = Supercharged" ───
Diagram: A multiplication equation:
"HUMAN DOMAIN INSIGHT" person icon × "AI CODING SPEED" robot icon = "UNPRECEDENTED DELIVERY" rocket icon

The amplification effect:
BEFORE AI: "Weeks to customize solutions"
AFTER AI: "Hours to customize solutions"

Key insight: "Particularly important for hardware-centric businesses where compute/servers are only valuable if software can rapidly unlock their potential — historically the weakest link."

Body: "AI programming flips the equation: 'field armies' with industry expertise deliver competitive, customized solutions on hardware at unprecedented speed."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 28: PALANTIR — RESULTS & BIFURCATION
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Human–AI Hybrid: The Palantir Playbook"
Chinese (long, use line 2): "人机协同：Palantir 方法论"
Subtitle: "Validated Results & The Bifurcation of the Future"

TWO WHITE CARDS:

─── CARD 1 (left): "Results That Validate" ───
Diagram: Four big stat blocks:
"$1B" — "Q2 2025 Revenue" — chart icon
"93%" — "U.S. Commercial Growth YoY" — growth arrow icon
"800-1000%" — "FDE Job Postings Surge in 2025" — hiring icon
"9 days → seconds" — "Citibank onboarding with AI FDEs (Nov 2025)" — clock icon

Each stat should be visually prominent with large bold numbers.

─── CARD 2 (right): "The Bifurcation" ───
Diagram: A fork-in-road visualization splitting into two paths:

LEFT PATH (bold): "FULLY AUTONOMOUS"
"Macrohard model"
"Low-risk, standardized domains"
"Zero human developers"
"AI writes, tests, deploys everything"

RIGHT PATH (bold): "HUMAN-AI HYBRID"
"Palantir model"
"Complex enterprise environments"
"Domain insight guides AI"
"FDEs + AI agents"

CONVERGENCE POINT at bottom: "Both paths: value shifts away from traditional packaged software → toward compute, infrastructure, and teams combining domain understanding with AI execution speed."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 29: DEVICE ECOSYSTEM — AI OPPORTUNITY
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "A Reset Moment for the Device Ecosystem"
Chinese (long, use line 2): "终端生态迎来重置时刻"
Subtitle: "AI transforms accumulated technical debt into a rare reset opportunity"

TWO WHITE CARDS:

─── CARD 1 (left): "The App Inefficiency Problem" ───
Diagram: A phone icon with many app icons inside, with only 10-20% highlighted and the rest grayed out/unused.
Stats: "80+ apps installed | Only 10-20% functionality used per user"
Body: "Traditional apps are one-size-fits-all: a single app serves billions. Most users rely on only 10-20% of features, while the rest consumes storage, memory, and cognitive attention."

AI Alternative below: "AI enables DEEPLY PERSONALIZED software: dynamically composed around individual needs, regional contexts, real usage patterns."

─── CARD 2 (right): "The Device Layer Imperative" ───
Diagram: A strategic hierarchy:
TOP: "AI Platform" brain icon
MIDDLE: "Device Layer" phone icon — HIGHLIGHTED as critical
BOTTOM: "User Data & Interaction Surfaces" — data icon

Warning label: "If AI platforms remain in browsers/third-party apps = 'castles built on someone else's land'"

Body: "Large-model companies increasingly recognize that control over user data and interaction surfaces is critical. Owning the device layer becomes strategically unavoidable."

Key insight: "AI companies are not competing with phone manufacturers — they're competing to serve previously unmet user needs (health, education, daily decisions)."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 30: DEVICE ECOSYSTEM — RESET PATH
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "A Reset Moment for the Device Ecosystem"
Chinese (long, use line 2): "终端生态迎来重置时刻"
Subtitle: "HarmonyOS: The AI-Native Path Forward"

TWO WHITE CARDS:

─── CARD 1 (left): "Immediate: Foundation Strengthening" ───
Diagram: Three layers stacked:
LAYER 1: "Kernel Security" — shield icon — "Rewrite C/C++ memory models in memory-safe languages"
LAYER 2: "Performance" — speedometer icon — "Optimize kernel modules and system libraries"
LAYER 3: "Reliability" — checkmark icon — "AI-driven quality improvements end-to-end"

Body: "Past constraints — rapid timelines and external pressures — made it impossible to optimize software quality. AI now enables comprehensive rewriting of critical system components."

─── CARD 2 (right): "Strategic: Application Layer Economics" ───
Diagram: A cost equation:
"Meituan / Ctrip" company icons → "Hundreds of millions ¥/year" dollar icon → "Massive cross-platform codebases" → "Teams of thousands"

AI flip: Arrow labeled "AI CODING" pointing to:
"Rewriting becomes feasible AND necessary to reduce long-term costs"

Below: Three opportunity boxes:
• "New programming languages" — code icon
• "AI-native frameworks" — framework icon
• "Leapfrog, not catch-up" — leap icon

Body: "In the rewriting process, new opportunities emerge: AI-native frameworks and new languages allow HarmonyOS to leapfrog rather than merely catch up."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 31: SOVEREIGN AI
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "Sovereign AI: National-Scale Super-Vertical Stacks"
Chinese (long, use line 2): "主权AI：国家级超级垂直技术栈"

THREE WHITE CARDS:

─── CARD 1: "The Digital Sovereignty Thesis" ───
Diagram: A world map outline with three regions highlighted (EU, Middle East, Southeast Asia). Each has a small flag + server icon representing sovereign digital infrastructure.
Body: "Every country increasingly needs its own digital and AI infrastructure. EU has argued for years — but lacked hyperscale platforms and engineering armies."

─── CARD 2: "AI Changes the Equation" ───
Diagram: Before/After comparison:
BEFORE: "Build sovereign platform" → "Massive human engineering armies" → "Economically impossible"
AFTER: "Build sovereign platform" → "AI agents + compute" → "Technically achievable"

Key requirements listed:
• "Sufficient political will"
• "Access to compute"
• "Power and data center infrastructure"
Body: "What was once economically and organizationally impossible is now technically achievable."

─── CARD 3: "Strategic Implications" ───
Diagram: Three arrows pointing to future outcomes:
• "Accelerating fragmentation of global tech stack" — split globe icon
• "Emergence of national and regional AI champions" — crown icon
• "New wave of infrastructure investment: sovereign compute" — construction icon

Body: "Nations deploy AI agents to build and maintain digital ecosystems aligned with local data, language, regulation, and economic priorities. Digital sovereignty is no longer aspirational — it is technically possible, economically viable, and increasingly unavoidable."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 32: STANDARDS DISRUPTION — MCP vs SKILLS
// ═══════════════════════════════════════════════════════════════════
{
  style: "data",
  prompt: `
TITLE: "Standards Disruption: MCP is Dead, Long Live Skills"
Chinese (long, use line 2): "标准颠覆：MCP已死，Skills万岁"
Subtitle: "Protocol wars: standards rewritten for agent-native architectures"

MAIN CONTENT: One full-width white card with a COMPARISON TABLE:

Header row (bold): Dimension | MCP (Old Paradigm) | Skills (New Paradigm)

Data rows with small wireframe icons:
1. Mindset | AI as assistant (L2) | AI as developer (L3/L4)
2. Approach | AI calls traditional APIs | AI writes code directly
3. Paradigm | Wrapper around existing software | Native agent capabilities
4. Integration | Tool-by-tool manual setup | Composable, shareable workflows
5. Context | Per-request, stateless | Persistent project memory (CLAUDE.md)
6. Execution | Single tool calls | Multi-step autonomous workflows
7. Evolution | Incremental API additions | Agent-native from ground up
8. Future | Fading (L2 ceiling) | Rising (L3/L4 native)

Use alternating subtle lavender/white row shading. The "Skills" column should feel like the highlighted/preferred future.

Below the table:
"a16z: Agent-native infrastructure becomes table stakes. Systems of record lose ground to dynamic agent layers."
"Market reality: MCP designed for L2 (AI assists). Skills designed for L3/L4 (AI implements)."
"Control of agent layer = control of ecosystem."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 33: THE AGENTIC IMPERATIVE — THESIS
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "The Agentic Imperative | 智能体时代的必然"

TWO WHITE CARDS:

─── CARD 1 (left): "What We Must Build" ───
Diagram: A circular agent lifecycle with 8 stages connected in a loop:
"PERCEIVE" → "COLLECT DATA" → "PLAN" → "WRITE CODE" → "TEST" → "DEPLOY" → "OPERATE" → "ITERATE / REFACTOR" → back to "PERCEIVE"

In the center of the loop: "CONTINUOUS CLOSED LOOP"

Label above: "NOT another application — TRUE AGENTIC CAPABILITY"
Body: "An agent is not just a model. It is a system that perceives, plans, writes code, tests, deploys, operates, iterates, and refactors itself in a closed loop."

─── CARD 2 (right): "Three Core Layers" ───
Diagram: Three stacked layers, each with an icon:

LAYER 1 (bottom): "FOUNDATIONAL MODEL" — brain icon — "Proprietary, fine-tuned for your domain"

LAYER 2 (middle): "AGENT TOOLCHAIN" — tools icon — "Cloud-like, deployed across devices"

LAYER 3 (top): "TRUST & SECURITY FRAMEWORK" — shield icon — "Reliability at scale"

All three connected by vertical arrows. Label: "MUST OWN ALL THREE LAYERS"

Quote: "Just as autonomous driving required a tightly coupled perception-decision-action flywheel, the future of software requires an agent-native system built on your hardware."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 34: THE AGENTIC IMPERATIVE — STRATEGIC PRIORITIES
// ═══════════════════════════════════════════════════════════════════
{
  style: "normal",
  prompt: `
TITLE: "The Agentic Imperative | 智能体时代的必然"
Subtitle: "Strategic Priorities 2025-2028"

MAIN CONTENT: One large white card with FIVE PRIORITY BLOCKS arranged vertically, each with a number, icon, and description:

PRIORITY 1: "IMMEDIATE — Adopt L3/L4 AI Coding Tools"
Timeline bar: "NOW" — urgent icon
"Aggressively adopt Claude Code, Codex, and equivalent L3/L4 tools across all engineering teams immediately."

PRIORITY 2: "SHORT-TERM — Rebuild Agent-Native Systems"
Timeline bar: "2025-2026" — architecture icon
"Rebuild systems to be agent-native rather than retrofitted. CLAUDE.md, Skills, agent-first codebases."

PRIORITY 3: "MEDIUM-TERM — Vertical Integration"
Timeline bar: "2026-2027" — stack icon
"Invest in vertical integration to avoid commoditization. Own the stack from hardware to applications."

PRIORITY 4: "ONGOING — Human-AI Hybrid FDE Capabilities"
Timeline bar: "CONTINUOUS" — people+robot icon
"Develop Forward Deployed Engineer capabilities for complex enterprise deployments."

PRIORITY 5: "LONG-TERM — Sovereign AI Options"
Timeline bar: "2027-2028" — flag/sovereignty icon
"Ensure sovereign AI options to avoid structural dependence on external providers."

Bottom banner in bold:
"The software industry is not dying — it is being reborn. The only question is whether you shape the transformation, or are transformed by it."

`
},

// ═══════════════════════════════════════════════════════════════════
// SLIDE 35: APPENDIX
// ═══════════════════════════════════════════════════════════════════
{
  style: "data",
  prompt: `
TITLE: "Appendix | 附录"

MAIN CONTENT: This is a DATA-DENSE slide. Use maximum space for data. Minimal decoration.

THREE SECTIONS in one large white card:

─── SECTION 1: "Key Metrics Summary" (top) ───
Compact table, 2 columns:
$3 trillion | Global software development value (a16z)
$285 billion | Feb 4 2026 single-day stock wipeout
333% ROI | Forrester TEI study of Claude Code
80.9% | Claude Opus 4.5 SWE-bench Verified score
70%+ | Critical vulnerabilities that are memory-related
2× | Best-in-class AI productivity gain
>50% | Tencent new code that is AI-generated
4,500 years | Amazon developer-years saved ($260M)
97.4% | NVIDIA ChipAgents Verilog accuracy
$1B | Palantir Q2 2025 revenue

─── SECTION 2: "Big Tech AI Investment 2026" (middle) ───
Compact table:
Amazon | $200B | AI data centers, Trainium
Google | $175-185B | TPU v5, Gemini
Meta | $115-135B | AI superintelligence labs
Microsoft | ~$150B | Azure AI, Maia chips
xAI | $50B+ | Colossus, energy infrastructure

─── SECTION 3: "Key Concepts Index" (bottom) ───
Three columns of terms:
Column 1: SaaSpocalypse | Seat Compression | L2-L5 Autonomy | Console Over IDE
Column 2: A2UI | Impossible Triangle | First Principles | Universal Translator
Column 3: Super-Vertical Enterprise | Macrohard | FDE Model | Sovereign AI | MCP vs Skills

"Document Version: Expanded v1.0 | February 2026"

`
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

  const outFile = "Tectonic_Shift_Expanded_v1.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${TOTAL} slides)`);
}

main().catch(err => console.error("Fatal:", err));
