const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-opensource";
const SW = 13.333, SH = 7.5;
const TOTAL = 26;

// ─── SHARED STYLE PREFIX ───────────────────────────────────────────
const STYLE = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Light purple gradient — from pale lavender-white (#F8F5FC) at top-left to soft lavender (#EAE0F5) at bottom-right. Elegant, soft, not too saturated — think frosted lilac glass. In the background, VERY FAINTLY visible (like a ghosted watermark at 5-8% opacity), include a cute CARTOON WHALE sketch — a round, chubby, friendly little whale falling gracefully downward with tiny sparkles and stars rising beneath it. The whale is hand-drawn style with soft round curves, a small happy eye, a gentle smile, and tiny flippers — kawaii-adjacent but still professional. Drawn in faint lavender-gray pencil lines (#C4B5D9 at 6-8% opacity). Positioned in the right half of the slide. The whale should NOT compete with the content — just a charming ghosted watermark.

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

In the right half of the slide, include a VISIBLE cute CARTOON WHALE — a round, chubby, friendly whale falling gracefully downward through the dark purple space. The whale is drawn in light lavender/purple wireframe lines (#C4B5D9, #E8DFF5) at ~20-30% opacity with a hand-drawn, sketch quality. It has soft round body curves, a small happy eye, a gentle upturned mouth, and tiny flippers. Small sparkles, stars, and luminous particles rise upward beneath the falling whale (representing "一鲸落万物生" — when a whale falls, all things flourish). The whale is charming and cute — like an indie game illustration or gentle children's book art — but still sophisticated enough for a consulting deck.

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
Line 1: "How Open Source Survives and Thrives" — bold, ~28pt, white
Line 2: "in the Era of Agentic AI" — bold, ~24pt, white
Line 3: "开源如何在智能体AI时代存续与繁荣" — ~18pt, light lavender

Below title:
"STRATEGIC INSIGHT REPORT | 战略洞察报告" — small caps, ~12pt, light gray/lavender

Below that, a subtitle in warm white:
"The $3 Trillion Whale Is Falling | $3万亿巨鲸正在坠落"

Below subtitle, in smaller lighter text:
"一鲸落万物生 — When a whale falls, all things flourish"

Near bottom-left, small source badges in muted lavender text:
"Sources: a16z · Apollo Global · ARK Invest · Linux Foundation · StrongDM · Dan Shapiro"

Bottom-left corner: "February 2026 — Release 1.0" in small muted text.
Bottom-right corner: "1 / ${TOTAL}" in small muted text.

The cute cartoon whale on the right should be the main visual element — a friendly round whale descending gracefully with sparkles and stars rising beneath it.`
},

// ─── SLIDE 2: SaaS CRISIS ─────────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "SaaS Crisis: The $3T Software Whale Is Falling"
Chinese (long, use line 2): "SaaS危机：三万亿美元软件巨鲸的陨落"

THREE WHITE CARDS:

─── CARD 1: "Fatal Vulnerability" ───
Diagram: A tall tower of 4 stacked blocks with icons (cloud=SCALABLE, dollar=HIGH MARGIN, lightbulb=PURE IP, feather=LIGHT ASSET). Arrow from right with brain-gear icon labeled "AI DISRUPTION" pointing at base. Cracks at tower base.
Body: "Software's asset-light nature — once its greatest strength — is now its fatal weakness when AI replicates intellectual capital at near-zero marginal cost."

─── CARD 2: "Seat Compression" ───
Diagram: Big stat "60-80%" with "Revenue Drop" beside it. Below: flow of 5 desk-person icons → arrow → 2 desk icons + robot icon. Labels "TRADITIONAL: PER-SEAT" → "AI ERA: 2 + AGENTS".
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

// ─── SLIDE 4: VALUE MIGRATION ──────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Value Migration: Software → Hardware → Insight"
Chinese (long, use line 2): "价值迁移：从软件到硬件到洞察力"
Subtitle: "Where does value go when software becomes commodity?"

MAIN CONTENT: One large white card with a visual THREE-PHASE FLOW:

LEFT PHASE: "1990-2020: SOFTWARE" — icon: code brackets / cloud
- "Pure IP, infinite marginal returns, network effects"
- This phase is FADING (drawn slightly lighter)

CENTER PHASE: "2020-2026: HARDWARE & INFRA" — icon: chip / server
- "Custom silicon (TPU, Trainium, Maia), $650B CapEx race"
- This phase is CURRENT (drawn bold)

RIGHT PHASE: "2026+: INSIGHT & EXPERIENCE" — icon: brain / lightbulb
- "Human judgment, domain expertise, problem framing, taste"
- This phase is EMERGING (drawn with forward arrows)

Flowing arrows connect the three phases left to right.

Below, a compact row of Big Tech CapEx stats:
Amazon $200B | Google $175-185B | Microsoft ~$150B | Meta $115-135B

Key insight box at bottom: "When AI can write any code, code is no longer the scarce resource. The scarce resources become: hardware to run AI, human insight to know what to build, experience to judge whether it's right."

PAGE: "4 / ${TOTAL}"`
},

// ─── SLIDE 5: L0-L5 LEVELS ────────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "From Spicy Autocomplete to the Dark Factory (L0-L5)"
Chinese (long, use line 2): "从辣味自动补全到黑灯工厂（L0-L5）"
Subtitle: "Dan Shapiro's Six Levels of AI-Assisted Programming (January 2026)"

MAIN CONTENT: A large white card with a visual LEVEL PROGRESSION:

Draw 6 horizontal lanes stacked vertically, each representing a level. Each lane has:
- LEFT: Level badge (L0-L5) in a circle
- CENTER: Name and wireframe icon
- RIGHT: Human role description

L0 — "Manual Labor" — icon: person typing at keyboard — "Traditional coding — no AI"
L1 — "Assisted Tasks" — icon: cursor with suggestion bubble — "Offload discrete tasks (tests, docstrings)"
L2 — "Active Pairing" — icon: split screen (human + AI) — "Collaborative flow state with AI"
L3 — "Human-in-Loop" — icon: person reviewing code on screen — "AI is senior dev, human is manager"
L4 — "Spec Management" — icon: document with checkmark — "Developer becomes PM writing specs"
L5 — "Dark Factory" — icon: factory with no lights/no people — "Fully automated spec-to-software pipeline"

A vertical arrow on the far left from L0 to L5 labeled "INCREASING AUTONOMY →"

A prominent marker/highlight between L2 and L3: "MOST DEVELOPERS ARE HERE" with an arrow pointing to L2.
Another marker at L4-L5 boundary: "STRONGDM'S TEAM" with a star icon.

Dan Shapiro quote at bottom: "90% of 'AI-native' developers are living at L2 right now."

PAGE: "5 / ${TOTAL}"`
},

// ─── SLIDE 6: STRONGDM DARK FACTORY ───────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "The Dark Factory Is Here: StrongDM's Proof"
Chinese (long, use line 2): "黑灯工厂已经到来：StrongDM的证明"
Subtitle: "Source: Simon Willison, February 7, 2026"

TWO WHITE CARDS:

─── CARD 1 (left): "The Rules" ───
Three bold rules displayed as large statement blocks with icons:

RULE 1: Crossed-out pencil icon
"Code MUST NOT be written by humans"

RULE 2: Crossed-out eye icon
"Code MUST NOT be reviewed by humans"

RULE 3: Dollar/token icon
"Spend $1,000 on tokens per engineer per day minimum"

Below: "3-person team (formed July 2025): Justin McCarthy, Jay Taylor, Navan Chauhan"

─── CARD 2 (right): "Key Innovations" ───
Three vertically stacked sections:

Section 1: "DIGITAL TWIN UNIVERSE (DTU)" — twin/mirror icon
"Behavioral clones of third-party APIs — Okta, Jira, Slack, Google Docs. Self-contained Go binaries. No rate limits, no API costs."

Section 2: "ATTRACTOR REPO" — document icon with no-code symbol
"github.com/strongdm/attractor: Contains ONLY markdown specs, intentionally NO code. Agent generates all code from specs."

Section 3: "OUTPUT: CXDB" — database icon
"16,000 lines Rust + 9,500 lines Go + 6,700 lines TypeScript — all generated from specs, zero hand-written code."

PAGE: "6 / ${TOTAL}"`
},

// ─── SLIDE 7: SPECS, SKILLS, SIMULATORS ───────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Not Code, But Specs, Skills & Simulators"
Chinese (long, use line 2): "不是代码，而是规格、技能与模拟器"
Subtitle: "The Future of Software Development"

THREE WHITE CARDS:

─── CARD 1: "SPECS" ───
Icon: Document with detailed writing inside
Diagram: A spec document at center with three arrows pointing outward to: "PRODUCT DEFINITION", "IMPLEMENTATION GUIDE", "ACCEPTANCE TEST" — all three roles in one document.
Body: "The spec IS the product definition, implementation guide, AND acceptance test. StrongDM's Attractor repo proves it: no code, only specs."

─── CARD 2: "SKILLS" ───
Icon: Toolbox with gear
Diagram: A skill registry labeled "CLAWHUB" at center with icons for "/deploy", "/test", "/review" radiating outward. A counter showing "5,700+" skills.
Body: "Reusable agent workflows — the new 'libraries' are not code packages but agent capabilities. OpenClaw's ClawHub: 5,700+ community-built skills."

─── CARD 3: "SIMULATORS" ───
Icon: Rocket / test environment
Diagram: A "Digital Twin Universe" box containing miniature icons of Okta, Jira, Slack arranged in a test arena. Arrows showing thousands of test scenarios running through it. A SpaceX rocket icon for metaphor.
Body: "Like SpaceX tests Starship through thousands of simulated Mars entries, software quality comes from simulator rigor, not human review. AI makes exhaustive simulation affordable."

PAGE: "7 / ${TOTAL}"`
},

// ─── SLIDE 8: THREE ERAS ──────────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Open Source: A History in Three Eras"
Chinese (long, use line 2): "开源简史：三个时代"

MAIN CONTENT: One large white card with a HORIZONTAL TIMELINE flowing left to right with three eras, each as a large section:

ERA 1 (1985-2000s): "FREE SOFTWARE CRUSADE" — fist/flag icon
- "Ideology-driven"
- "Stallman's GPL manifesto"
- "Software freedom as moral imperative"
- Characteristic: "IDEOLOGICAL"

ERA 2 (2000s-2015): "PAY-TO-PLAY FOUNDATIONS" — building/institution icon
- "Corporate-driven"
- "Linux Foundation, Apache, Eclipse"
- "Industry standards & governance"
- Characteristic: "INSTITUTIONAL"

ERA 3 (2015-2025): "VC BAIT-AND-SWITCH" — dollar/hook icon
- "Profit-driven"
- "Open source as marketing"
- "Redis, HashiCorp, Elastic re-licensed"
- Characteristic: "COMMERCIAL"

A dashed arrow continues rightward to an emerging ERA 4:
"ERA 4 (2025+): AGENTIC AI" — robot/sparkle icon
- "AI-amplified"
- "150K stars overnight. Skills replace libraries."
- Characteristic: "AI-NATIVE"

Quote at bottom: "Open source has always reflected the tension between idealism and pragmatism. AI doesn't resolve this tension — it amplifies it."

PAGE: "8 / ${TOTAL}"`
},

// ─── SLIDE 9: ERA 1 FREE SOFTWARE ─────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Era 1: The Free Software Crusade"
Chinese (long, use line 2): "第一纪：自由软件的理想主义圣战"
Subtitle: "Richard Stallman's Vision (1985)"

TWO WHITE CARDS:

─── CARD 1 (left): "The Origin & Principles" ───
Diagram: A printer icon at top (the Xerox printer moment). Arrow down to a person silhouette (Stallman) with raised fist.

Below: 4 freedom boxes stacked:
"Freedom 0: Run for any purpose"
"Freedom 1: Study and modify"
"Freedom 2: Redistribute copies"
"Freedom 3: Distribute modified versions"

Quote: "Your car is yours — but is the software in it yours?"

─── CARD 2 (right): "Character & Legacy" ───
Four characteristic badges with icons:
- "IDEOLOGICAL" — flag icon — "Software freedom as moral imperative"
- "DEVELOPER-CENTRIC" — person icon — "Extreme pursuit of developer autonomy"
- "CONFRONTATIONAL" — shield icon — "GPL as 'copyleft' weapon"
- "PRESCIENT" — eye icon — "Correctly predicted proprietary software as tool of control"

Key insight box at bottom:
"The FSF established the moral foundation of open source. Every subsequent era both builds on AND betrays this foundation."

PAGE: "9 / ${TOTAL}"`
},

// ─── SLIDE 10: ERA 2 FOUNDATIONS ──────────────────────────────────
{
  style: "data",
  prompt: `
TITLE: "Era 2: Pay-to-Play Foundations"
Chinese (long, use line 2): "第二纪：付费入场的基金会模式"

TWO WHITE CARDS:

─── CARD 1 (left): "The Linux Foundation Model" ───
Big stat metrics:
"$300M+" — Annual membership revenue
"$10M+" — AAIF year one
"3,000+" — Member companies
"800+" — Projects hosted

Below metrics, a table of what foundations provide:
Governance transparency | Neutral home for critical software
Industry standards | Kubernetes APIs, POSIX, .NET
Legal protection | Trademark management, IP policies
Weak standards | AGENTS.md, MCP, Goose — "soft standards" through adoption

─── CARD 2 (right): "The Problems" ───
Four problem boxes with warning icons:
1. "PAY-TO-PLAY" — Platinum members ($500K+/year) get board seats. Individual developers marginalized.
2. "CORPORATE INTERESTS" — Conference attendees are enterprise developers. Individual maintainers rarely attend.
3. "STANDARDS CAPTURE" — Companies donate trademarks but retain technical control.
4. "DOESN'T SOLVE SUSTAINABILITY" — Foundation governance doesn't pay maintainers. The 60% unpaid problem persists.

PAGE: "10 / ${TOTAL}"`
},

// ─── SLIDE 11: ERA 3 VC BAIT-AND-SWITCH ──────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Era 3: The VC Bait-and-Switch"
Chinese (long, use line 2): "第三纪：风险投资的开源诱饵"
Subtitle: "Open Source as Marketing Strategy"

TWO WHITE CARDS:

─── CARD 1 (left): "The Playbook" ───
Diagram: A vertical flowchart with 5 steps, each with a small icon:
Step 1: Unlock icon → "Release with permissive license (Apache 2.0, MIT)"
Step 2: People icon → "Build community, accumulate users and contributors"
Step 3: Chart icon → "Achieve product-market fit using community feedback"
Step 4: Lock icon → "Re-license to proprietary or restrictive terms"
Step 5: Dollar icon → "Monetize the community you built on free labor"

The flow feels like a trap — open at top, closing shut at bottom.

─── CARD 2 (right): "The Hall of Shame" ───
A compact table:

Company | What Happened | Community Response
Redis | BSD → SSPL/RSAL | Valkey fork (Linux Foundation)
HashiCorp | MPL → BSL | OpenTofu fork
Elastic | Apache 2.0 → SSPL | OpenSearch fork (AWS)
MongoDB | AGPL → SSPL | Community fragmentation

Quote at bottom:
"Why should I contribute my time and expertise so that a VC-backed company can monetize my work and then lock me out?"

PAGE: "11 / ${TOTAL}"`
},

// ─── SLIDE 12: PRE-AI SUSTAINABILITY CRISIS ──────────────────────
{
  style: "data",
  prompt: `
TITLE: "The Pre-AI Sustainability Crisis"
Chinese (long, use line 2): "AI之前的可持续性危机"
Subtitle: "The crisis was already here"

MAIN CONTENT: One large white card with THREE DATA SECTIONS:

─── SECTION 1 (top): "Maintainer Burnout" ───
Clean metrics row:
"60%" — Maintainers working unpaid (Tidelift 2024)
"60%" — Quit or considered quitting
"Kubernetes Ingress NGINX" — Retired, no security patches after March 2026

─── SECTION 2 (middle): "The Tailwind CSS Catastrophe" ───
Data table:
Usage growth | Faster than ever
Revenue decline | -80%
Documentation traffic | -40% in 2 years
Engineers laid off | 75% (3 of 4)
Root cause | AI tools consume Tailwind without visiting docs — conversion funnel broken
Emergency response | Vercel, Google, Gumroad pledge support within 48 hours

─── SECTION 3 (bottom): "Security: The Poison Well" ───
Compact metrics:
"454,648" — Malicious packages identified (2025)
"1.23 million" — Total known malicious packages
"Growing" — AI-fabricated contributor identities
"Released 2026" — OWASP AI Agent Security Top 10

Footer: "Open source is not free. The digital world is built on software maintained by exhausted, unpaid volunteers."

PAGE: "12 / ${TOTAL}"`
},

// ─── SLIDE 13: BIG TECH READ-ONLY ────────────────────────────────
{
  style: "data",
  prompt: `
TITLE: "Big Tech's 'Read-Only' Open Source"
Chinese (long, use line 2): "大厂的"只读"开源"
Subtitle: "Donating the trademark, keeping the control"

MAIN CONTENT: One large white card with a COMPARISON TABLE:

Header: Project | Company | What's "Open" | What's Controlled

6 data rows:
Android | Google | Source code (AOSP) | Play Services, GMS certification, update timeline
LLVM | Google/Apple | Codebase | Commit upstream — only Google and Apple practically accepted
PyTorch | Meta | Codebase | CI/CD funded by Meta. All major technical decisions
React | Meta | Codebase | Core team is Meta employees. Direction set internally
Codex | OpenAI | "Open source" | Read-only — doesn't accept conflicting PRs
Triton | OpenAI | Codebase | Contribution acceptance heavily filtered

Use alternating row shading. Clean, readable.

Key insight box below table:
"Big tech's open source is a ONE-WAY MIRROR: they see out (community feedback, free contributions, ecosystem growth), but the community can't see in (roadmap decisions, technical direction, resource allocation)."

PAGE: "13 / ${TOTAL}"`
},

// ─── SLIDE 14: AI BREAKS MONOPOLY ────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "AI Breaks Big Tech's Technical Monopoly"
Chinese (long, use line 2): "AI打破大厂的技术垄断"
Subtitle: "Why community projects could never compete — until now"

TWO WHITE CARDS:

─── CARD 1 (left): "The Old Reality" ───
Diagram: A fortress/castle icon at top labeled "BIG TECH". Four pillars supporting it:
- "500+ SENIOR ENGINEERS" — people icon
- "MILLIONS/YEAR CI/CD" — server icon
- "RIGOROUS QA" — shield icon
- "FULL-TIME MAINTENANCE" — clock icon

A small community icon below, looking up at the fortress. Label: "Community couldn't match this"

─── CARD 2 (right): "The New Reality" ───
Diagram: Each old barrier matched with an AI solution:
- "Elite engineers needed" → "AI writes at senior-engineer level"
- "Expensive CI/CD" → "Digital Twin Universes (StrongDM model)"
- "Rigorous QA" → "Agent-driven testing with exhaustive simulation"
- "Full-time maintenance" → "AI agents handle repetitive maintenance"

A small community icon now EQUAL in size to the fortress icon. Label: "TECHNICAL PARITY VIA AI"

Key insight at bottom: "For the first time, a 3-person team (StrongDM) can produce production-grade software that rivals corporate engineering output."

PAGE: "14 / ${TOTAL}"`
},

// ─── SLIDE 15: MAINTAINER LIBERATION ─────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "The Maintainer Liberation | 维护者的解放"

TWO WHITE CARDS:

─── CARD 1 (left): "The Duality of Open Source" ───
Diagram: A split visualization:
TOP HALF: "INNOVATION" — sparkle/rocket icon — "Creative, exploratory, exciting"
Label: "DEVELOPERS LOVE THIS" with a heart icon

BOTTOM HALF: "MAINTENANCE" — wrench/repetitive icon — "Engineering, repetitive, thankless"
Label: "NOBODY LOVES THIS" with a broken heart icon

Below: A timeline arc showing:
"Innovation (exciting) → Adoption (gratifying) → Popularity (burdensome) → Maintenance hell (burnout)"

─── CARD 2 (right): "The AI Liberation" ───
A table showing what AI absorbs:
PR triage and review | Agent-assisted code review
Bug reproduction | AI agents diagnose and propose fixes
Documentation | Auto-generated from code
Dependency updates | Automated (Dependabot+AI)
Repetitive refactoring | Agent-executed at scale
User support | AI-assisted with codebase knowledge

Key insight box: "Open source was always meant to be creative exploration. AI restores the original promise: developers create, agents maintain."

PAGE: "15 / ${TOTAL}"`
},

// ─── SLIDE 16: AI MAKES IT WORSE FIRST ───────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "How AI Coding Makes It Worse (First)"
Chinese (long, use line 2): "AI编程如何先让一切更糟"
Subtitle: "Before liberation comes destruction"

THREE WHITE CARDS:

─── CARD 1: "Vampire Economics" ───
Icon: Vampire/drain icon
Diagram: A circular drain showing the Tailwind Effect:
"AI trains on OSS code → AI generates code without attribution → Users get value without visiting docs → Revenue funnels break → Maintainers lose compensation"

─── CARD 2: "The Flood" ───
Icon: Flood/wave icon
Five stats displayed prominently:
- "454,648" malicious packages in 2025
- "19% SLOWER" — METR study: devs initially slower with AI
- "AI-generated low-quality PRs" — flooding maintainers
- "AI-fabricated identities" — emerging threat
- "curl: Extra verification needed" for AI bug reports

─── CARD 3: "The Quality Paradox" ───
Icon: Question mark in loop
Quote prominently displayed:
"How can you prove that software works if both implementation AND tests are written by coding agents?" — StrongDM team

Below: "The Transition Valley: Before AI makes open source better, it first makes it worse."

PAGE: "16 / ${TOTAL}"`
},

// ─── SLIDE 17: ASE STANDARDS ─────────────────────────────────────
{
  style: "data",
  prompt: `
TITLE: "ASE Standards: The New Battleground"
Chinese (long, use line 2): "智能体软件工程标准：新的战场"

MAIN CONTENT: One large white card with TWO SECTIONS:

─── SECTION 1 (top): "The Emerging Standard Stack" ───
Clean data table:

Standard | Origin | Adoption | Status
AGENTS.md | OpenAI | 60,000+ projects | Donated to AAIF (Linux Foundation)
CLAUDE.md | Anthropic | De facto standard | Industry-wide adoption
MCP | Anthropic | Broad adoption | Donated to AAIF
Skills | Anthropic (Claude Code) | Growing | De facto standard
Hooks | Anthropic (Claude Code) | Emerging | Industry first
Goose | Block | Growing | Donated to AAIF

─── SECTION 2 (bottom): "The AAIF: Unprecedented — and Problematic" ───
Two columns:

LEFT: "What's Unprecedented"
- Direct competitors donating core technology to shared foundation
- OpenAI donated AGENTS.md, Anthropic donated MCP

RIGHT: "What's Problematic"
- OpenAI and Anthropic retain outsized governance power
- Membership transparency is limited
- Project acceptance favors founding members
- Meta's PyTorch precedent: donated trademark, kept technical control
- These are AI CAPABILITY standards — geopolitically sensitive

PAGE: "17 / ${TOTAL}"`
},

// ─── SLIDE 18: FOUNDATION FRAGMENTATION ──────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Foundation Fragmentation Along Geopolitical Lines"
Chinese (long, use line 2): "基金会沿地缘政治裂线碎片化"
Subtitle: "The end of global open source cooperation?"

THREE WHITE CARDS:

─── CARD 1: "Shrinking Industry" ───
Icon: Shrinking pie chart
"As AI disrupts software companies, foundation membership revenue faces pressure. Pay-to-play dynamics intensify."

─── CARD 2: "Discriminatory Treatment" ───
Icon: Unbalanced scale
"Chinese companies report: membership fees accepted but governance rights limited. Contributions deprioritized. 'Non-discriminatory' principles not consistently applied."

─── CARD 3: "Regulatory Divergence" ───
Icon: Three flags diverging
Three rows:
US — "Light-touch, innovation-first"
EU — "CRA, AI Act — heavy compliance burden"
China — "State-directed, sovereignty-focused"

Below all three cards, a FRAGMENTATION DIAGRAM:
"Global Foundation (Linux Foundation, AAIF)" at top, branching into three:
├── "US-dominated → favors US standards"
├── "China-led alternatives → Chinese OSS foundations"
└── "EU-specific → compliance-focused European foundations"

Quote: "The dream of a single, global, neutral open source commons may fracture along the same geopolitical lines splitting the internet."

PAGE: "18 / ${TOTAL}"`
},

// ─── SLIDE 19: GOVERNANCE GAP ────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "The Agentic SE Governance Gap"
Chinese (long, use line 2): "智能体软件工程的治理鸿沟"
Subtitle: "Governance built for humans, challenged by agents"

TWO WHITE CARDS:

─── CARD 1 (left): "Traditional OSS Governance" ───
Five mechanisms with icons:
- "BDFL" — crown icon — "One human's technical judgment is supreme"
- "MERITOCRACY" — trophy icon — "Commit rights earned through demonstrated skill"
- "CODE REVIEW" — eye icon — "Humans read and evaluate humans' code"
- "CONTRIBUTOR IDENTITY" — ID card icon — "Real people with verifiable track records"
- "RELEASE MANAGEMENT" — ship icon — "Human judgment on what ships"

─── CARD 2 (right): "What Breaks in the ASE Era" ───
Six challenge rows with warning icons:
- "Agent code review" — Who reviews when both author and reviewer are AI?
- "Accountability" — When AI introduces a bug, who is responsible?
- "Identity verification" — AI can fabricate entire contributor personas
- "Merit measurement" — When anyone can produce good code with AI, what does "merit" mean?
- "Quality signals" — 454K malicious packages; AI makes supply chain attacks easier
- "OWASP AI Agent Top 10" — Prompt injection, tool poisoning, identity spoofing

Key insight box: "Traditional governance assumes technical skill is scarce and contributor identity is verifiable. AI makes skill abundant and identity forgeable."

PAGE: "19 / ${TOTAL}"`
},

// ─── SLIDE 20: NEW BDFL ──────────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "The New BDFL: Community Leader > Technical Genius"
Chinese (long, use line 2): "新型BDFL：社区领袖 > 技术天才"
Subtitle: "When technology is no longer the bottleneck"

TWO WHITE CARDS:

─── CARD 1 (left): "Old Scarcity → New Scarcity" ───
Diagram: A transformation table with arrows between columns:

OLD SCARCITY (faded) → NEW SCARCITY (bold)
Deep technical expertise → Community building ability
System architecture vision → Communication and storytelling
Code quality judgment → Marketing and distribution
Implementation speed → Cultural leadership

Each row has a small icon. The shift feels like an evolution.

Label: "WHEN AI WRITES CODE, WHAT MAKES A LEADER?"

─── CARD 2 (right): "New Participants" ───
Diagram: A door opening wide, with diverse people entering:
- "Writing specs and prompts"
- "Building skills (agent workflows)"
- "Community management"
- "Documentation and education"
- "Quality assurance through simulation design"

Label at top: "When code isn't the barrier, NON-TECHNICAL PEOPLE can participate in open source"

Key insight at bottom: "The successful OSS leader of the ASE era builds community, communicates vision, masters distribution, creates cultural resonance."

PAGE: "20 / ${TOTAL}"`
},

// ─── SLIDE 21: OPENCLAW CASE STUDY ───────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Case Study: OpenClaw & Peter Steinberger"
Chinese (long, use line 2): "案例研究：OpenClaw与Peter Steinberger"

TWO WHITE CARDS:

─── CARD 1 (left): "The Numbers" ───
Big stat metrics displayed prominently:
"150,000+" — GitHub Stars
"900+" — Contributors
"5,700+" — ClawHub Skills
"9K → 60K" — Stars growth in days
"2 million" — Visitors in one week

Below: "Peter Steinberger: Austrian engineer, founded PSPDFKit. Critics call OpenClaw 'a Claude Code wrapper' — but genuine innovation in iOS deep integration (iMessage, Apple APIs)."

─── CARD 2 (right): "The Name Saga & Why It Worked" ───
A timeline/flow:
"Clawdbot (Nov 2025)" → "Anthropic cease-and-desist" →
"Moltbot (Jan 27, 2026)" → "'Never rolled off the tongue'" →
"OpenClaw (Jan 30, 2026)" → "Called Sam Altman personally"

Below: "Moltbook: Agent Social Network" — description: "Reddit-style social network where users' OpenClaw agents post content and interact with other chatbots."

Four success factors:
1. "ANTI-ESTABLISHMENT" — individual dev vs. corporate giants
2. "CULTURAL PROVOCATION" — name-squatting as humorous rebellion
3. "COMMUNITY-FIRST" — ClawHub skills ecosystem
4. "PLATFORM STRATEGY" — WhatsApp, Telegram, Slack, Discord, Signal, iMessage

PAGE: "21 / ${TOTAL}"`
},

// ─── SLIDE 22: COUNTERCULTURE THESIS ─────────────────────────────
{
  style: "normal",
  prompt: `
TITLE (use TWO lines — this is a long Chinese-only title concept):
Line 1: "From Geek Utopia to the Arena of AI vs Human Values"
Line 2: "开源从技术极客的乌托邦变为AI和人类价值竞合的竞技场"

TWO WHITE CARDS:

─── CARD 1 (left): "The Pattern" ───
A comparison table:

Era | Threat | Rebel | Cultural Force
FSF (1985) | Proprietary software | Stallman | Freedom from corporate control
Linux (1991) | Unix licensing | Torvalds | Meritocratic hacker culture
Wikipedia (2001) | Gatekept knowledge | Jimmy Wales | Democratized information
Agentic AI (2025) | AI replacing humans | Steinberger et al. | Defending human value

Each era row has a small icon. Show the PATTERN repeating.

─── CARD 2 (right): "The Human Value Thesis" ───
Prominent quote block:
"In the AI era, open source becomes the arena where humans defend their relevance. This is not a technical debate — it's existential."

Below: "OpenClaw's virality driven by anti-corporate rebellion: developers feel threatened by AI giants → identify with projects that challenge them."

Key insight at bottom: "Open source has always thrived on conflict, idealism, and defense of individual agency against institutional power. AI intensifies all three."

PAGE: "22 / ${TOTAL}"`
},

// ─── SLIDE 23: CAMBRIAN EXPLOSION ────────────────────────────────
{
  style: "data",
  prompt: `
TITLE: "The Cambrian Explosion of AI-Native Open Source"
Chinese (long, use line 2): "AI原生开源的寒武纪大爆发"

MAIN CONTENT: One large white card with TWO SECTIONS:

─── SECTION 1 (top): "The Numbers" ───
Clean data table:

Project | Stars | Category | Growth
OpenClaw | 150K+ | General AI agent | 9K → 60K in days
OpenCode | 95K+ | CLI coding agent | Months to 95K
OpenHands | 65K+ | Cloud coding platform | $18.8M raised
Cline | 30K+ | VS Code coding agent | 4M+ developers
Continue | 20K+ | IDE extension | Enterprise focus
Aider | 12.9K+ | Git-first terminal agent | Git-native workflow
Goose | Growing | Block's agent framework | Donated to AAIF

─── SECTION 2 (bottom): "What's Different" ───
Two-column comparison:

Old Open Source | AI-Native Open Source
Libraries for humans | Skills for agents
npm/PyPI packages | ClawHub skill registry
Years to 100K stars | Weeks to 100K stars
Human developers contribute | Humans write specs, agents write code
Security: code review | Security: VirusTotal scanning + SHA-256
Distribution: package managers | Distribution: messaging platforms

Footer: "AI amplifies grassroots energy. Individual developers, armed with AI, can now challenge corporate-backed projects on equal technical footing."

PAGE: "23 / ${TOTAL}"`
},

// ─── SLIDE 24: THREE FUTURES ─────────────────────────────────────
{
  style: "normal",
  prompt: `
TITLE: "Open Source Doesn't Die — It Transforms"
Chinese (long, use line 2): "开源不会消亡——它在蜕变"
Subtitle: "Three possible futures"

THREE WHITE CARDS:

─── CARD 1: "Scenario 1: Flourishing" ───
Icon: Blooming flower
Probability badge: "20%"
Key points:
- "AI democratizes — anyone can build production-quality software"
- "New funding models work (endowments, pledges, sponsorship)"
- "AAIF standards enable trusted agent collaboration"
- "Open source becomes the neutral layer between competing AI platforms"

─── CARD 2: "Scenario 2: Hollowing" ───
Icon: Hollow/empty shell
Probability badge: "30%"
Key points:
- "AI extracts value faster than new structures sustain it"
- "Tailwind-style collapses multiply across ecosystem"
- "'Ghost repositories' — millions of stars, zero maintainers"
- "Open source becomes training data commons with no stewards"

─── CARD 3: "Scenario 3: Bifurcation + Renaissance" ───
Icon: Diverging paths with a rising phoenix
Probability badge: "50% — MOST LIKELY" (highlighted)
Key points:
- "Cathedral tier: well-funded, AAIF-backed, corporate governance"
- "Bazaar tier: AI-augmented individual developers"
- "Grassroots developers punch above their weight via AI"
- "New Stallman-like figures emerge to defend human value"

PAGE: "24 / ${TOTAL}"`
},

// ─── SLIDE 25: OPENTOKEN & SUSTAINABILITY ────────────────────────
{
  style: "data",
  prompt: `
TITLE: "OpenToken & New Sustainability Models"
Chinese (long, use line 2): "OpenToken与开源可持续性的新模式"
Subtitle: "Beyond pay-to-play: emerging funding architectures"

MAIN CONTENT: One large white card with TWO SECTIONS:

─── SECTION 1 (top): "OpenToken: Shared AI Credit Framework" ───
Subtitle: "Proposed with United Nations Digital Public Goods Alliance (DPGA)"

A clean role table:
Role | Who | Examples
Contributors | LLM providers donating credits | OpenAI, Anthropic, Google, Meta AI, Together.ai, Stability AI
Recipients | Vetted OSS foundations | Linux Foundation, Apache Foundation, Stanford University
Distribution | Unified access & tracking | OpenRouter, Hugging Face, Partner APIs
Reporting | Annual public impact report | Tokens granted, projects supported, key metrics

Four objectives displayed as compact badges:
1. "ACCESS EQUITY" — Enable OSS devs to experiment with frontier models
2. "AI TRANSPARENCY" — Independently validate and benchmark models
3. "OPEN INNOVATION" — Lower entry barrier for small teams
4. "CORPORATE CSR" — Measurable support for digital commons

─── SECTION 2 (bottom): "Other Emerging Models" ───
Compact table:
Model | Scale | Mechanism
Open Source Endowment | Permanent principal | ~5% annual returns, like university endowments
HeroDevs Sustainability Fund | $20M | Grants $2,500–$250,000 to maintainers
CodeRabbit | $1M | Corporate sponsorship post-Series B
Open Source Pledge | Industry-wide | $2,000/developer/year minimum
Frontend Masters | $50K/year | Distributed across 1,100+ projects via thanks.dev

Quote at bottom: "Together, we can make access to intelligence as open as access to code." — OpenToken Initiative

PAGE: "25 / ${TOTAL}"`
},

// ─── SLIDE 26: CONCLUSION ────────────────────────────────────────
{
  style: "cover",
  prompt: `
TITLE (large, bold, white, left-aligned in the left 45%):
Line 1: "一鲸落万物生" — bold, ~32pt, white (Chinese characters prominent)
Line 2: "When the Whale Falls, All Things Flourish" — ~22pt, light lavender

Below title, two columns of text in white/light lavender:

LEFT COLUMN — "What Falls":
- The $3T human-centric software development model
- SaaS valuations and per-seat pricing
- Code as the scarce resource
- Big tech's technical monopoly
- Traditional BDFL meritocracy
- Global foundation unity

RIGHT COLUMN — "What Flourishes":
- Individual developers amplified by AI
- Spec-driven, simulator-validated development
- Open source as creative exploration
- New leadership: community builders, storytellers
- Non-technical participation
- Counterculture energy defending human meaning

Below the columns, a prominent quote in italic white text:
"All those moments will be lost in time, like tears in rain."
"Unlike tears in rain, the whale fall creates new life."

Final line in bold:
"Open source doesn't die. It transforms."
"The whale is falling. What will you build from its bones?"

Bottom-left: "Document Version: r1.0 | February 2026"
Bottom-right: "26 / ${TOTAL}"

The cute cartoon whale on the right should be prominently visible — falling gracefully with sparkles and stars rising beneath it, luminous and hopeful.`
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

  const outFile = "AI_Coding_OpenSource.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${TOTAL} slides)`);
}

main().catch(err => console.error("Fatal:", err));
