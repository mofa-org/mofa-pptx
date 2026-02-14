const { GoogleGenAI } = require("@google/genai");
const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3-pro-image-preview";
const OUTDIR = "slides-br";
const OUTPUT = "Agentic_SE_Playbook_BR.pptx";

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ── Blade Runner 2049 Design System ───────────────────────────────────
const STYLE = `You are a world-class cinematic presentation designer. Generate a single presentation slide image.

CANVAS: 1920×1080 pixels, 16:9 landscape.

VISUAL IDENTITY — BLADE RUNNER 2049 CINEMATIC STYLE:
- ATMOSPHERE: Dark, moody, cinematic. Think Blade Runner 2049 by Denis Villeneuve — fog, volumetric light, rain particles, vast empty spaces, melancholy grandeur.
- COLOR PALETTE: Deep midnight blue (#0A0E1A) and dark teal (#0D1B2A) as base. Warm neon orange (#FF6A00, #E8540A) as primary accent. Cool cyan/teal (#00D4FF, #1AFFD5) as secondary accent. Muted purple (#6B4FA0) for highlights. Pale amber (#FFB347) glow effects. White (#FFFFFF) and light gray (#C0C0C0) for body text.
- BACKGROUNDS: NOT flat colors. Use atmospheric, cinematic compositions — distant blurred cityscapes with towering dark buildings, holographic projections floating in foggy air, rain streaks, neon reflections on wet surfaces, vast desert-like wastelands with orange haze, or dark interiors with shafts of volumetric light.
- TYPOGRAPHY: Clean futuristic sans-serif (like Eurostile, Rajdhani, or Barlow). Title text in white or warm amber with subtle glow. Body text in light gray or white. Important keywords can have orange or cyan glow.
- UI ELEMENTS: Thin holographic interface lines, HUD-style corners and brackets, scanning lines, data readout overlays, translucent panels with slight blue/cyan tint, grid overlays.
- DECORATIVE: Holographic replicant eye iris patterns, DNA helix strands, neural network visualizations, rain particles, light bokeh, lens flares, floating data fragments, glitching digital artifacts.
- PANELS/CARDS: Semi-transparent dark panels (#0A0E1A at 70-80% opacity) with thin cyan (#00D4FF) or orange (#FF6A00) border glow. Rounded corners optional.
- SLIDE NUMBER: Small text in bottom-right, cyan or muted gray.
- The overall mood: humanity's role being transformed by AI — beautiful, awe-inspiring, slightly melancholic, vast.
- Text must be PIXEL-PERFECT and EXACTLY as specified.
- Balance visual richness with text readability — text should always be clearly legible against the atmospheric backgrounds.
- Use semi-transparent dark overlay panels behind text blocks when needed for readability.

`;

const SLIDES = [
  // SLIDE 1: Cover
  {
    file: "slide-01.png",
    prompt: `${STYLE}
SLIDE 1 OF 13 — COVER SLIDE

SCENE: A vast Blade Runner 2049-style cityscape at twilight. Massive dark skyscrapers disappear into orange-amber fog. In the foreground, a lone silhouette of a software engineer stands on a rooftop, looking out at the city. Above the city, enormous holographic projections flicker — showing code fragments, neural networks, and agent workflow diagrams floating in the misty air. Rain falls gently. Neon reflections shimmer on wet surfaces below.

TEXT LAYOUT (overlaid on the scene):
- Top-left corner: Small holographic HUD label "PLAYBOOK" in uppercase, letter-spaced, cyan (#00D4FF) with subtle glow, 14px.
- Center of slide, slightly above middle, on a wide semi-transparent dark panel:
  - Line 1: "Agentic Software Engineering" in white, very large bold text (~56px), with faint amber glow.
  - Line 2: "Playbook" in white, same size bold.
  - Below (20px gap): "From OpenAI's Internal Transformation" in light gray (#B0B0B0), 20px.
- Below, centered:
  - Thin horizontal line in cyan glow, ~120px wide.
  - Italic quote: "\u201CSoftware development is undergoing a renaissance in front of our eyes.\u201D" in pale amber (#FFD4A0), 18px.
  - "\u2014 Greg Brockman, OpenAI Co-founder" in gray (#999), 14px.
- Bottom-center: "For Engineering Teams, Tech Leads, CTOs  |  February 2026" in small muted text.
- Bottom-right: "1 / 13" in cyan.
`
  },

  // SLIDE 2: December 2025 Inflection Point
  {
    file: "slide-02.png",
    prompt: `${STYLE}
SLIDE 2 OF 13 — THE DECEMBER 2025 INFLECTION POINT

SCENE: A dramatic split-screen composition. LEFT HALF: A dim, old-world office — a single desk lamp illuminating a dusty keyboard, terminal screen with simple code, muted blue-gray tones, lonely and outdated. RIGHT HALF: An explosion of neon light — a Blade Runner-style holographic command center with multiple floating screens, AI agent visualizations, streaming code in cyan and orange, neural network diagrams glowing. The dividing line between the two halves crackles with electricity and digital transformation energy. Rain visible through windows on the right side.

TEXT LAYOUT:
- Title at top: "The December 2025 Inflection Point" in white bold ~36px with faint glow, on a thin semi-transparent dark banner.

- LEFT SIDE — semi-transparent dark panel, thin orange border:
  Header: "Before December 2025" in orange (#FF6A00), bold, 16px.
  • "Codex for unit tests only"
  • "Limited to simple tasks"
  • "Experimental tool"
  White text, 14px.

- RIGHT SIDE — semi-transparent dark panel, thin cyan border:
  Header: "After December 2025" in cyan (#00D4FF), bold, 16px.
  • "Codex writes essentially all code"
  • "Handles operations and debugging"
  • "Primary development interface"
  White text, 14px, key phrases slightly brighter.

- Bottom section — "Real-World Proof" in amber, two horizontal info blocks:
  "Sora Android App" — "4 engineers · 18 days · vs 3\u20136 months" — large orange "~10x faster"
  "C Compiler (100K lines)" — "16 parallel agents · ~2,000 sessions · $20K API cost" — cyan "Compiles Linux 6.9 kernel"

- Small footer: "Catalyst: GPT-5.2-Codex — long-horizon work, large code changes, leading SWE-Bench Pro" in gray 11px.
- "2 / 13" bottom-right.
`
  },

  // SLIDE 3: Adoption Metrics
  {
    file: "slide-03.png",
    prompt: `${STYLE}
SLIDE 3 OF 13 — ADOPTION METRICS

SCENE: A massive Blade Runner-style holographic data visualization floating above a dark, rain-slicked cityscape. Three enormous holographic pillars of light rise from the ground into the foggy sky, each displaying a giant glowing number. Around them, smaller data particles and graph fragments float like digital rain. The scene has the scale and grandeur of the giant holographic advertisements in Blade Runner 2049. Warm orange and cool cyan light interplay. A vast dark sky with faint stars above.

TEXT LAYOUT (integrated into the holographic display):
- Title: "The Scale of Change" in white bold ~36px, top-left, on dark overlay bar.

- THREE GIANT HOLOGRAPHIC METRIC DISPLAYS, evenly spaced across the middle of the slide. Each is a tall column of light:

  PILLAR 1 (orange glow):
    Huge number: "1M+" in bold orange (#FF6A00) with strong glow effect, ~80px.
    Below: "Developers" in white 16px.
    Below: "using Codex" in white 16px.
    Small: "and growing" in amber italic 12px.

  PILLAR 2 (cyan glow):
    Huge number: "2x" in bold cyan (#00D4FF) with glow, ~80px.
    Below: "Usage growth" in white 16px.
    Below: "since GPT-5.2" in white 16px.
    Small: "nearly doubled" in light cyan italic 12px.

  PILLAR 3 (purple glow):
    Huge number: "20x" in bold purple (#9B72CF) with glow, ~80px.
    Below: "Growth since" in white 16px.
    Below: "August 2025" in white 16px.
    Small: "explosive adoption" in light purple italic 12px.

- Below pillars:
  "Enterprise Customers" in amber bold, 16px.
  "Cisco  ·  Ramp  ·  Virgin Atlantic  ·  Vanta  ·  Duolingo  ·  Gap" in white 14px.

- "3 / 13" bottom-right.
`
  },

  // SLIDE 4: March 31 Mandate
  {
    file: "slide-04.png",
    prompt: `${STYLE}
SLIDE 4 OF 13 — THE MARCH 31, 2026 MANDATE

SCENE: A stark, imposing Blade Runner-style corporate interior — think the enormous minimalist office of Niander Wallace. A vast dark room with a thin line of water reflecting on the floor. Dramatic shafts of warm amber light cut through darkness from narrow windows. In the background, a massive holographic calendar/countdown display shows "MARCH 31, 2026" in glowing orange numerals, ticking down. The mood is authoritative, inevitable — a mandate from above.

TEXT LAYOUT:
- Title: "The March 31, 2026 Mandate" in white bold ~36px, with subtle amber glow.
- Subtitle: "OpenAI's Organizational Targets" in light gray 18px.

- Two goal cards, stacked vertically, each on a semi-transparent dark panel with thin glowing borders:

  CARD 1 (orange border glow):
    Large "1" in orange (#FF6A00), glowing.
    "Tool of First Resort" in white bold 20px.
    "For any technical task, humans interact with an agent rather than using an editor or terminal." in light gray 15px.

  CARD 2 (cyan border glow):
    Large "2" in cyan (#00D4FF), glowing.
    "Safe & Productive Default" in white bold 20px.
    "Agent utilization is explicitly evaluated as safe, but also productive enough that most workflows don't need additional permissions." in light gray 15px.

- Right side — a narrow vertical panel with subtle blue tint:
  "Why March 31?" in amber bold 16px.
  • "Top-down organizational transformation"
  • "Not aspirational \u2014 operational deadline"
  • "Drives cultural change, not just tool adoption"
  White text, 13px.

- "4 / 13" bottom-right.
`
  },

  // SLIDE 5: Traditional vs Agentic
  {
    file: "slide-05.png",
    prompt: `${STYLE}
SLIDE 5 OF 13 — TRADITIONAL VS AGENTIC ENGINEERING

SCENE: A powerful visual metaphor. On the left side, a fading ghost image of a solitary programmer hunched at a terminal in a dim cubicle — the old way, rendered in cold blue-gray monochrome, almost dissolving. On the right side, a vibrant holographic command center with multiple AI agent interfaces orbiting around a standing engineer who orchestrates them with gestures — rendered in warm orange and cyan neon light. Between them, a vertical stream of digital transformation energy — particles, code fragments, arrows — flowing from left to right. The Blade Runner rain continues in the background.

TEXT LAYOUT:
- Title: "Traditional vs Agentic Engineering" in white bold ~36px, on dark overlay bar at top.

- Comparison table on a large semi-transparent dark panel, with thin cyan border:
  Column headers with subtle glow — "Dimension" (white) | "Traditional" (orange) | "Agentic" (cyan)
  A glowing orange arrow (\u2192) between Traditional and Agentic columns.

  8 rows, thin horizontal divider lines in dark cyan (#0D4466):
  "First Action"       | "Open IDE, write code"          | "Prompt agent with intent"
  "Code Production"    | "Human writes line-by-line"      | "Agent generates, human reviews"
  "Debugging"          | "Manual trace, breakpoint"       | "Agent diagnoses and fixes"
  "Testing"            | "Write tests after code"         | "Agent writes tests first"
  "Documentation"      | "Write docs after shipping"      | "Spec-driven development"
  "Knowledge"          | "Code comments, wiki"            | "AGENTS.md + Skills"
  "Tool Usage"         | "Click UI, manual steps"         | "Agent invokes via CLI/MCP"
  "Speed"              | "Hours/days per feature"         | "Minutes with feedback loops"

  Dimension in white bold. Traditional in muted orange. Agentic in bright cyan.
  ~14px text with comfortable padding.

- "5 / 13" bottom-right.
`
  },

  // SLIDE 6: 6-Pillar Overview
  {
    file: "slide-06.png",
    prompt: `${STYLE}
SLIDE 6 OF 13 — THE 6-PILLAR PLAYBOOK

SCENE: Six towering monolithic pillars/columns rising from a reflective dark surface, inspired by the massive architecture in Blade Runner 2049. Each pillar glows from within with a different intensity — some orange, some cyan, some purple — illuminating the foggy air around them. Between the pillars, thin laser-like connection lines form a network. The ground reflects the pillars' light like wet pavement. Holographic UI brackets and data fragments float around each pillar. The sky above is a deep Blade Runner orange-amber haze.

TEXT LAYOUT:
- Title: "The 6-Pillar Playbook" in white bold ~36px with glow.
- Subtitle: "OpenAI's Implementation Framework" in light gray 18px.

- 6 cards in a 3×2 grid, each styled as a holographic panel floating in space — semi-transparent dark fill with thin glowing border:

  ROW 1:
  Card 1 (orange accent): Large "1" in orange. "Adoption" in white bold 18px. "Try the tools \u2014 designate \u201CAgents Captain\u201D per team" in light gray 13px.
  Card 2 (cyan accent): Large "2" in cyan. "AGENTS.md" in white bold 18px. "Create machine-readable project handbook" in light gray 13px.
  Card 3 (amber accent): Large "3" in amber. "Tools" in white bold 18px. "Make internal tools agent-accessible (CLI/MCP)" in light gray 13px.

  ROW 2:
  Card 4 (teal accent): Large "4" in teal. "Architecture" in white bold 18px. "Restructure codebases for agent-first development" in light gray 13px.
  Card 5 (purple accent): Large "5" in purple. "Quality" in white bold 18px. "\u201CSay no to slop\u201D \u2014 maintain review bar" in light gray 13px.
  Card 6 (cyan accent): Large "6" in cyan. "Infrastructure" in white bold 18px. "Build observability, trajectory tracking" in light gray 13px.

- "6 / 13" bottom-right.
`
  },

  // SLIDE 7: Pillar 1-2
  {
    file: "slide-07.png",
    prompt: `${STYLE}
SLIDE 7 OF 13 — PILLAR 1-2: ADOPTION & KNOWLEDGE

SCENE: Interior of a Blade Runner-style corporate war room. A circular table with holographic displays rising from its center, showing network graphs and team structures. Around the edges of the room, wall-mounted screens display AGENTS.md file contents scrolling in green/cyan monospace text. A few silhouetted figures stand watching. The room is dark with dramatic side lighting — warm amber from one side, cool cyan from the other. Rain patters against floor-to-ceiling windows showing a dark cityscape beyond. Floating holographic file trees and directory structures hover in the air.

TEXT LAYOUT:
- Title: "Pillar 1-2: Adoption & Knowledge" in white bold, large size matching other slide titles.

- Two columns on semi-transparent dark panels:

  LEFT — orange border glow:
    Header: "1" (orange) + "Cultural Adoption" in white bold 20px.
    Three challenge\u2192solution rows:
    "Engineers \u201Ctoo busy\u201D" (dim gray) \u2192 "\u201CAgents Captain\u201D role per team" (white bold)
    "Uncertainty" (dim gray) \u2192 "Shared internal channels" (white bold)
    "Lack of exposure" (dim gray) \u2192 "Company-wide Codex hackathon" (white bold)
    Italic quote in amber: "\u201CThe tools do sell themselves.\u201D"

  RIGHT — cyan border glow:
    Header: "2" (cyan) + "AGENTS.md & Skills" in white bold 20px.
    Code block panel (dark terminal style, monospace cyan text):
    project-root/
    \u251C\u2500\u2500 AGENTS.md
    \u2502   Project context, conventions
    \u251C\u2500\u2500 skills/
    \u2502   deploy.sh, test-suite.yml
    \u2514\u2500\u2500 src/

    Below: "Industry Convergence" in amber bold 14px.
    "AGENTS.md (OpenAI, Google) \u00B7 CLAUDE.md (Anthropic) \u00B7 copilot-instructions.md (GitHub)" in light gray 12px.

- "7 / 13" bottom-right.
`
  },

  // SLIDE 8: Pillar 3-4
  {
    file: "slide-08.png",
    prompt: `${STYLE}
SLIDE 8 OF 13 — PILLAR 3-4: TOOLS & ARCHITECTURE

SCENE: A breathtaking Blade Runner-style engineering bay. A massive blueprint hologram of a software architecture diagram floats in the center of a cavernous dark space — showing interconnected modules, API endpoints, and MCP connections as glowing cyan wireframes. Around it, smaller holographic tool interfaces orbit like satellites. The architecture looks like a futuristic space station blueprint. On the ground level, glowing orange lines trace connection paths like circuit boards embedded in the floor. Steam/fog rises from below. Dramatic volumetric light from above.

TEXT LAYOUT:
- Title: "Pillar 3-4: Tools & Architecture" in white bold ~36px.

- Two columns on holographic panels:

  LEFT — orange accent:
    Header: "3" (orange) + "Agent-Accessible Tooling" in white bold 20px.
    Three items with orange dot accents:
    \u2022 "Audit tools" (orange bold) \u2014 "Catalog team dependencies" (light gray)
    \u2022 "Enable access" (orange bold) \u2014 "CLI wrappers or MCP servers" (light gray)
    \u2022 "Assign ownership" (orange bold) \u2014 "One person per tool integration" (light gray)

    Bottom callout (dark panel, cyan border):
    "MCP (Model Context Protocol)" in cyan bold.
    "Emerging standard for agent-tool connections" in light gray.

  RIGHT — cyan accent:
    Header: "4" (cyan) + "Agent-First Codebase" in white bold 20px.
    Four principles with cyan dot accents:
    \u2022 "Fast tests" (cyan bold) \u2014 "Agents iterate by running tests repeatedly" (light gray)
    \u2022 "Clean interfaces" (cyan bold) \u2014 "Agents reason about one component at a time" (light gray)
    \u2022 "Strong types" (cyan bold) \u2014 "Compiler acts as correctness checker" (light gray)
    \u2022 "Clear boundaries" (cyan bold) \u2014 "Agents work on isolated components" (light gray)

- "8 / 13" bottom-right.
`
  },

  // SLIDE 9: Pillar 5-6
  {
    file: "slide-09.png",
    prompt: `${STYLE}
SLIDE 9 OF 13 — PILLAR 5-6: QUALITY & INFRASTRUCTURE

SCENE: A Blade Runner 2049 quality control chamber. Think of the memory-verification lab from the film. In the center, a large holographic quality shield/seal floats, glowing amber — it represents code quality standards. Around it, streams of code scroll upward like the Matrix but in Blade Runner's orange/cyan palette. On one side, rejected "slop" code dissolves into red particles. On the other, approved code solidifies into clean cyan structures. The room has dramatic lighting — dark with concentrated amber spotlights. Monitoring screens on the walls show trajectory graphs and performance dashboards.

TEXT LAYOUT:
- Title: "Pillar 5-6: Quality & Infrastructure" in white bold ~36px.

- Two columns:

  LEFT — amber/orange accent:
    Header: "5" (orange) + "\u201CSay No to Slop\u201D" in white bold 20px.
    Three rules with orange number badges:
    1. "Human accountability" (white bold) \u2014 "Someone accountable for all merged code" (light gray)
    2. "Same review bar" (white bold) \u2014 "Maintain standard for agent-generated code" (light gray)
    3. "Author comprehension" (white bold) \u2014 "No \u201Cvibe merging\u201D \u2014 understand what you submit" (light gray)

    Warning callout panel (dark red-tinted border):
    "The \u201CSlop\u201D Problem" in amber bold.
    "Functionally correct but poorly maintainable \u2014 passes tests but introduces technical debt." in light gray italic.

  RIGHT — cyan accent:
    Header: "6" (cyan) + "Infrastructure for Agents" in white bold 20px.
    Four items:
    \u2022 "Observability" (cyan bold) \u2014 "Monitor agent performance and success rates" (light gray)
    \u2022 "Trajectory tracking" (cyan bold) \u2014 "Capture reasoning path, not just output" (light gray)
    \u2022 "Tool management" (cyan bold) \u2014 "Governance over agent tool access" (light gray)
    \u2022 "Feedback loops" (cyan bold) \u2014 "Internal usage data drives improvements" (light gray)

- "9 / 13" bottom-right.
`
  },

  // SLIDE 10: Evolving Engineer Role
  {
    file: "slide-10.png",
    prompt: `${STYLE}
SLIDE 10 OF 13 — THE EVOLVING ENGINEER ROLE

SCENE: The most iconic Blade Runner visual. A lone engineer stands in the center of a vast, rain-drenched rooftop. Behind them, the engineer's shadow stretches into a massive projected hologram that transforms — on the left side the shadow is a traditional programmer typing at a desk, but as it extends right it morphs into an orchestrator commanding multiple AI agents represented as glowing orbiting spheres. The city skyline stretches to the horizon, shrouded in amber fog. Holographic agent interfaces float around the transformed figure like a constellation. Neon signs flicker in the distance. Rain catches the light. The scene captures the transformation from writer to orchestrator.

TEXT LAYOUT:
- Title: "The Evolving Engineer Role" in white bold ~36px with glow.
- Subtitle: "From Writer to Orchestrator" in amber (#FFB347) 18px.

- Transformation table on a wide semi-transparent dark panel:
  Headers: "Old Focus" (muted orange, fading) \u2192 "New Focus" (bright cyan, bold)

  6 rows with glowing cyan arrows between columns:
  "Writing implementation code"        \u2192  "Designing agent-implementable systems"
  "Manual coding"                      \u2192  "Writing specifications for agents"
  "Debugging line-by-line"             \u2192  "Reviewing and curating agent output"
  "Ad-hoc knowledge sharing"           \u2192  "Maintaining AGENTS.md & skills"
  "Single-threaded work"               \u2192  "Orchestrating multiple agents"
  "Low-level coding"                   \u2192  "Higher-order design & communication"

  Old Focus in dim gray (fading out). New Focus in white bold (emerging). Arrows in cyan.

- Bottom card:
  "Spec-Driven Development" in amber bold 16px.
  "1. Engineer writes specification \u2192 2. Agent implements against spec \u2192 3. Spec = instruction set + acceptance criteria" in light gray 12px.

- "10 / 13" bottom-right.
`
  },

  // SLIDE 11: Implementation Roadmap
  {
    file: "slide-11.png",
    prompt: `${STYLE}
SLIDE 11 OF 13 — IMPLEMENTATION ROADMAP

SCENE: A Blade Runner 2049-style highway stretching into the distance — a straight glowing path cutting through a dark wasteland. Along the highway, four towering holographic waypoint gates/arches rise at intervals, each glowing with increasing intensity (the journey forward). The first gate glows dim amber, the second brighter orange, the third cyan, the fourth brilliant white. The road surface has embedded neon light strips. Fog and dust particles swirl around the gates. The sky transitions from stormy dark on the left (present) to clearer amber-lit horizon on the right (future). It's a visual journey — a roadmap rendered as a path through a cyberpunk landscape.

TEXT LAYOUT:
- Title: "Implementation Roadmap" in white bold ~36px.

- Four phase cards arranged horizontally along the bottom half, connected by a glowing horizontal timeline arrow:

  PHASE 1 (amber glow border):
    Circled "1" in amber. "PHASE 1" small label. "Foundation" in white bold 18px. "Weeks 1\u20132" in dim gray.
    \u2022 Designate "Agents Captain"
    \u2022 Schedule Codex hackathon
    \u2022 Create initial AGENTS.md
    \u2022 Audit tooling accessibility
    White text 12px.

  PHASE 2 (orange glow border):
    Circled "2". "PHASE 2". "Infrastructure" in white bold. "Weeks 3\u20134".
    \u2022 Set up skills repository
    \u2022 Create MCP servers (top 5)
    \u2022 Establish review guidelines
    \u2022 Set up agent observability

  PHASE 3 (cyan glow border):
    Circled "3". "PHASE 3". "Optimization" in white bold. "Weeks 5\u20138".
    \u2022 Optimize tests (<30s target)
    \u2022 Refine AGENTS.md from failures
    \u2022 Build skills library
    \u2022 Define quality metrics

  PHASE 4 (white glow border):
    Circled "4". "PHASE 4". "Scale" in white bold. "Ongoing".
    \u2022 Regular AGENTS.md reviews
    \u2022 Continuous skills development
    \u2022 Infrastructure improvements

- "11 / 13" bottom-right.
`
  },

  // SLIDE 12: Key Takeaways & Risks
  {
    file: "slide-12.png",
    prompt: `${STYLE}
SLIDE 12 OF 13 — KEY TAKEAWAYS & OPEN RISKS

SCENE: A dramatic Blade Runner 2049 ending-scene composition. A vast, quiet space — think the final snow scene but reinterpreted for technology. A large holographic eye (like a replicant's iris) fills the upper background, watching over everything — representing the need for vigilance and awareness. Inside the eye's iris, faint circuit patterns and code fragments are visible. Below the eye, two paths diverge — one glowing amber (takeaways/wisdom) and one glowing red (risks/warnings). Rain or snow particles fall gently. The scene is contemplative, powerful — a moment of reckoning with the transformation.

TEXT LAYOUT:
- Title: "Key Takeaways & Open Risks" in white bold ~36px.

- Two columns:

  LEFT (55%) — "Key Takeaways" in amber (#FFB347) bold 20px:
  6 numbered items with glowing amber circled numbers:
  1  "Organizational transformation, not tool adoption"
  2  "Architect role becomes more critical"
  3  "AGENTS.md is the new README"
  4  "\u201CSay no to slop\u201D is the hardest pillar"
  5  "Agent infrastructure is a greenfield opportunity"
  6  "Navigate deliberately \u2014 transition is inevitable"
  White text 14px.

  RIGHT (40%) — "Open Risks" in red-orange (#FF4444) bold 20px:
  4 risk cards with thin red/warning left border:
  "Code ownership" (white bold) \u2014 "Rigorous review, not rubber-stamping" (gray)
  "Technical debt" (white bold) \u2014 "New metrics for AI-generated drift" (gray)
  "Security" (white bold) \u2014 "\u201CSafe but productive\u201D balance" (gray)
  "Skill atrophy" (white bold) \u2014 "Maintain deep understanding for review" (gray)

- "12 / 13" bottom-right.
`
  },

  // SLIDE 13: Appendix
  {
    file: "slide-13.png",
    prompt: `${STYLE}
SLIDE 13 OF 13 — APPENDIX: LANGUAGE-SPECIFIC NOTES

SCENE: A Blade Runner-style data archive room. Three tall holographic display columns stand in a row, each projecting scrolling code in a different programming language — Rust (orange-tinted), C/C++ (cyan-tinted), Python (purple/green-tinted). The columns are like the data banks in a futuristic library. Around each column, floating syntax fragments and language-specific symbols drift like embers. The room is dark with the columns providing the main light source. Floor reflects their glow. A few holographic code bracket symbols { } float in the background. The mood is archival, reference-like — an appendix of knowledge.

TEXT LAYOUT:
- Title: "Appendix: Language-Specific Notes" in white bold ~36px.

- Three cards in a horizontal row, each styled as a glowing data terminal:

  CARD 1 (orange accent border):
    Header: "Rust" in orange bold 20px.
    \u2713 "Type system = built-in correctness verification" (green check, white text)
    \u26A0 "unsafe blocks need explicit AGENTS.md policy" (amber warning, light gray text)
    \u26A0 "Build times may slow agent iteration" (amber warning, light gray text)

  CARD 2 (cyan accent border):
    Header: "C / C++" in cyan bold 20px.
    \u26A0 "Less safety guardrails \u2192 more prescriptive AGENTS.md" (amber, light gray)
    \u26A0 "Memory management conventions must be explicit" (amber, light gray)

  CARD 3 (purple/green accent border):
    Header: "Python" in purple (#9B72CF) bold 20px.
    \u2713 "Large training corpus = agents perform well" (green check, white text)
    \u26A0 "Mandate type hints and mypy in AGENTS.md" (amber, light gray)

- Bottom footer centered:
  "Source: Greg Brockman's public post on OpenAI's internal agentic transformation  |  Compiled: February 2026"
  Small gray text 11px.

- "13 / 13" bottom-right.
`
  },
];

// ── Generate images ───────────────────────────────────────────────────
async function generateSlide(idx) {
  const slide = SLIDES[idx];
  const outPath = path.join(OUTDIR, slide.file);

  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
    console.log(`  [${idx + 1}/13] cached: ${slide.file}`);
    return outPath;
  }

  console.log(`  [${idx + 1}/13] generating ${slide.file} ...`);

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

      const reason = response.candidates?.[0]?.finishReason;
      console.log(`  [${idx + 1}/13] no image (reason: ${reason}), attempt ${attempt}/3`);
    } catch (err) {
      console.log(`  [${idx + 1}/13] error attempt ${attempt}/3: ${err.message?.slice(0, 200)}`);
      if (attempt < 3) {
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
      const imgData = fs.readFileSync(imgPath).toString("base64");
      const ext = path.extname(imgPath).slice(1).toLowerCase();
      const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
      slide.addImage({
        data: `data:${mime};base64,${imgData}`,
        x: 0, y: 0, w: 13.333, h: 7.5,
        sizing: { type: "cover", w: 13.333, h: 7.5 },
      });
    } else {
      slide.background = { color: "0A0E1A" };
      slide.addText(`Slide ${i + 1} — image generation failed`, {
        x: 1, y: 3, w: 11, h: 1.5,
        fontSize: 24, color: "FF6A00", align: "center",
      });
    }
  }

  await pptx.writeFile({ fileName: OUTPUT });
  console.log(`\nPresentation saved: ${path.resolve(OUTPUT)}`);
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUTDIR, { recursive: true });

  console.log(`Generating 13 slides with ${MODEL} (Nano Banana Pro) — Blade Runner 2049 edition...\n`);

  const imagePaths = [];
  for (let i = 0; i < SLIDES.length; i++) {
    const result = await generateSlide(i);
    imagePaths.push(result);

    if (i < SLIDES.length - 1) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  const failed = imagePaths.filter(p => !p).length;
  if (failed > 0) {
    console.log(`\nWARNING: ${failed} slide(s) failed to generate.`);
  }

  console.log("\nBuilding PPTX...");
  await buildPptx(imagePaths);
}

main().catch(err => console.error("Fatal:", err));
