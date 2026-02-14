const { GoogleGenAI } = require("@google/genai");
const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3-pro-image-preview";
const OUTDIR = "slides-cc-research";
const OUTPUT = "Claude_Code_Deep_Research.pptx";

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ── Blade Runner 2049 LIGHT Design System ─────────────────────────────
// Inspired by the Las Vegas / golden desert sequences in BR2049
const STYLE = `You are a world-class cinematic presentation designer. Generate a single presentation slide image.

CANVAS: 1920×1080 pixels, 16:9 landscape.

VISUAL IDENTITY — BLADE RUNNER 2049 "GOLDEN HOUR" LIGHT THEME:
- ATMOSPHERE: Warm, luminous, cinematic. Inspired by the Las Vegas desert sequences in Blade Runner 2049 — golden haze, warm volumetric light, vast open spaces bathed in amber sunlight, soft fog, ethereal and dreamlike.
- COLOR PALETTE: Warm golden amber (#FFB347, #F5A623) as dominant tone. Soft cream/ivory (#F5F0E8, #FFF8F0) for light areas. Pale warm white (#FFFFFF with warm tint). Soft burnt orange (#E8845A) for accents. Muted teal (#5BB5B5, #4AA8A8) as cool contrast accent. Soft coral (#FF8A80) for highlights. Deep charcoal (#2D2D2D) and dark brown (#3D2B1F) for text.
- BACKGROUNDS: NOT flat colors. Use atmospheric golden-hour compositions — vast amber-haze desert landscapes, sunlit brutalist architecture with warm light flooding through, golden fog with silhouettes of futuristic structures, soft bright interiors with shafts of warm sunlight through tall windows, holographic displays rendered in warm amber and soft teal instead of neon. Everything feels warm, luminous, expansive.
- TYPOGRAPHY: Clean modern sans-serif (like Inter, Helvetica Neue). Title text in deep charcoal (#2D2D2D) or dark warm brown (#3D2B1F), large and bold. Body text in dark charcoal (#444444). Accent text in burnt orange (#D4710A) or teal (#3D8B8B). No glow effects — clean and readable.
- UI ELEMENTS: Thin warm-toned holographic interface lines, soft golden grid overlays, translucent warm amber panels with subtle borders, light holographic data fragments in amber/teal.
- DECORATIVE: Soft light particles like dust motes in sunlight, golden bokeh, warm lens flares, faint holographic wireframes in amber, architectural silhouettes in golden haze, DNA/circuit patterns in soft warm tones.
- PANELS/CARDS: Semi-transparent warm panels (#FFF8F0 at 80% opacity) with thin amber (#E8A045) or teal (#5BB5B5) borders. Or dark charcoal panels (#2D2D2D at 75%) with warm amber text for contrast sections.
- SLIDE NUMBER: Small text in bottom-right, teal or muted brown.
- The overall mood: The dawn of a new era in software engineering — warm, hopeful, awe-inspiring, vast golden landscapes representing the frontier of AI-human collaboration.
- Text must be PIXEL-PERFECT and EXACTLY as specified — every word, letter, punctuation mark.
- Balance visual richness with text readability. Text must always be clearly legible.

`;

const SLIDES = [
  // SLIDE 1: Cover
  {
    file: "slide-01.png",
    prompt: `${STYLE}
SLIDE 1 OF 13 — COVER SLIDE

SCENE: A vast Blade Runner 2049 Las Vegas landscape bathed in golden-amber light. Massive brutalist structures rise from a warm hazy desert, their surfaces catching golden sunlight. In the foreground, a solitary figure walks toward the structures — representing the engineer entering the new frontier. Above the structures, enormous warm-toned holographic projections shimmer — showing code fragments, neural network patterns, and the Claude logo symbol. Golden dust particles drift in the warm air. Soft lens flares. The entire scene is bathed in warm amber-gold light, like looking into a beautiful sunset. Ethereal and hopeful.

TEXT LAYOUT:
- Top-left: "DEEP RESEARCH" in uppercase, letter-spaced, teal (#3D8B8B), small.
- Center, on a wide semi-transparent warm panel:
  Line 1: "How Anthropic Developed" in dark charcoal (#2D2D2D), bold, large (~44px).
  Line 2: "Claude Code & Claude Cowork" in dark charcoal, bold, large (~44px).
  Below: "A Deep Research on Agentic Software Engineering at Anthropic" in warm brown (#5A4230), 18px.
- Thin horizontal amber line divider.
- Below: Five key findings as a compact list in dark charcoal, 13px:
  • Prototype-first methodology powered by Claude Code itself
  • Claude Code invented Skills, Plugins, Memories, Subagents, MCP
  • De facto standard for agentic software engineering
  • Self-improving feedback loop that trains better models
  • Claude Cowork built in 10 days by Claude Code itself
- Bottom-center: "February 2026" in small muted brown.
- "1 / 13" bottom-right in teal.`
  },

  // SLIDE 2: Prototype-First Revolution
  {
    file: "slide-02.png",
    prompt: `${STYLE}
SLIDE 2 OF 13 — THE PROTOTYPE-FIRST REVOLUTION

SCENE: A warm sunlit Blade Runner-style design studio interior. Massive floor-to-ceiling windows flood the space with golden afternoon light. On one side, fading transparent holographic documents labeled "PRD" and "Design Review" dissolve into warm particles. On the other side, a glowing holographic prototype materializes — a beautiful interactive wireframe in warm amber and teal tones. The contrast: heavy documentation fading away, replaced by living prototypes. Dust motes dance in the sunbeams. Warm minimalist architecture.

TEXT LAYOUT:
- Title: "The Prototype-First Revolution" in dark charcoal, bold, large.
- Subtitle: "Anthropic's Inverted Development Model" in warm brown, smaller than title.

- Comparison table on warm semi-transparent panel:
  Headers: "Step" | "Traditional" (muted, fading) | "Anthropic" (bold, teal accent)
  Row 1: 1 | Write 10-page PRD | Build working prototype in hours
  Row 2: 2 | Design review meetings | Ship prototype to entire company
  Row 3: 3 | Get stakeholder alignment | Everyone dogfoods immediately
  Row 4: 4 | Plan development | Iterate based on real usage data

  Traditional column in muted gray. Anthropic column in dark charcoal bold.

- Quote box with warm amber left border:
  "When you can build prototypes in hours instead of weeks, planning becomes the bottleneck. So they removed the bottleneck."
  — Aakash Gupta (small, muted)

- "2 / 13" bottom-right.`
  },

  // SLIDE 3: Origin Story
  {
    file: "slide-03.png",
    prompt: `${STYLE}
SLIDE 3 OF 13 — THE CLAUDE CODE ORIGIN STORY

SCENE: A warm golden Blade Runner interior — think a sunlit laboratory. A single engineer sits at a futuristic terminal, bathed in warm amber light from a tall window. From the terminal screen, translucent golden holographic file trees and code structures are blooming outward into the room — growing organically like a neural network discovering the filesystem for the first time. Each file node glows softly as it connects to others via warm amber lines. The image captures the "eureka moment" — AI exploring code autonomously for the first time. Warm, intimate, significant.

TEXT LAYOUT:
- Title: "The Claude Code Origin Story" in dark charcoal, bold, large.
- Subtitle: "September 2024 — Boris Cherny's Breakthrough" in warm brown.

- Large quote panel (warm cream background, amber border):
  "I tried giving it some tools to interact with the filesystem... Suddenly, this agent was really interesting. It would read one file, look at the imports, then read the files that were defined in the imports!"
  — Boris Cherny, Anthropic Engineer (small brown)

- "Product Overhang" callout in teal bold:
  "The model could already do this, but there wasn't a product built around this capability!"

- Timeline on right side, vertical with teal dots:
  Sep 2024 — Boris builds first prototype
  Nov 2024 — Dogfooding-ready internally
  Day 1 — 20% of engineering adopts
  Day 5 — 50% of engineering adopts
  Today — 80%+ daily usage

- "3 / 13" bottom-right.`
  },

  // SLIDE 4: Self-Improving Loop
  {
    file: "slide-04.png",
    prompt: `${STYLE}
SLIDE 4 OF 13 — THE SELF-IMPROVING FEEDBACK LOOP

SCENE: A magnificent Blade Runner-style golden atrium — a vast circular room with warm light flooding in from a domed skylight above. In the center, a beautiful holographic circular flow diagram rotates slowly — rendered in warm amber and teal. The flow shows: Engineers → Claude Code → Tool Calls → Results → Feedback → Usage Data → Training → Better Claude → back to Engineers. Each node of the cycle glows with warm golden light. Around the edges, translucent data streams flow upward toward the dome. The architecture is grand, circular, emphasizing the feedback loop visually. Warm, luminous, majestic.

TEXT LAYOUT:
- Title: "The Self-Improving Feedback Loop" in dark charcoal, bold, large.

- Circular flow diagram description (or rendered visually):
  Engineers Use Tool → Claude Code Session → Claude Model → Tool Calls & Code Gen → Results & Feedback → Usage Data Collection → RLHF/CAI Training → Better Claude
  (Rendered as connected nodes in warm amber, with arrows)

- Data Training Policy panel (two columns):
  LEFT (teal border): "Consumer Users (Free, Pro, Max)"
  "Data can be used to improve future Claude models"
  RIGHT (amber border): "Commercial Users (Team, Enterprise, API)"
  "Anthropic does NOT train on code or prompts"

- "4 / 13" bottom-right.`
  },

  // SLIDE 5: Productivity Metrics
  {
    file: "slide-05.png",
    prompt: `${STYLE}
SLIDE 5 OF 13 — PRODUCTIVITY GAINS & METRICS

SCENE: Three massive golden holographic metric displays floating in a warm amber haze, similar to the Las Vegas BR2049 landscape. The metrics rise like warm light pillars from a reflective golden surface. Around them, soft data particles and graph fragments drift upward like golden embers. The scene has vast BR2049 scale but in warm golden tones instead of dark. Sunlight breaks through the haze creating soft god-rays. Beautiful and data-driven.

TEXT LAYOUT:
- Title: "The Proof: Productivity Gains" in dark charcoal, bold, large.

- Three large metric cards (warm semi-transparent panels):

  Card 1 (amber accent):
    Big number: "+116%" in burnt orange bold, large (~60px).
    "Consecutive Tool Calls" in dark charcoal 16px.
    "9.8 → 21.2 per transcript" in warm brown 13px.

  Card 2 (teal accent):
    Big number: "-33%" in teal bold, large (~60px).
    "Human Turns Needed" in dark charcoal 16px.
    "6.2 → 4.1 per transcript" in warm brown 13px.

  Card 3 (coral accent):
    Big number: "+67%" in coral bold, large (~60px).
    "PR Throughput" in dark charcoal 16px.
    "Even as headcount doubled" in warm brown 13px.

- Bottom row: Three smaller metrics:
  "Claude Usage: 28% → 59% (+111%)" | "Productivity: +20% → +50% (+150%)" | "Power Users: >100% gains"
  In dark charcoal, 13px.

- "5 / 13" bottom-right.`
  },

  // SLIDE 6: Architecture — 5 Pillars
  {
    file: "slide-06.png",
    prompt: `${STYLE}
SLIDE 6 OF 13 — CLAUDE CODE ARCHITECTURE: 5 PILLARS

SCENE: Five elegant golden pillars/columns rise from a warm reflective surface in a vast sunlit atrium — inspired by BR2049's grand architecture but bathed in golden light. Each pillar represents one of Claude Code's extensibility features. Between the pillars, thin warm-toned connection lines form a delicate network. Warm amber light floods through tall windows behind the pillars. The floor reflects golden light. Holographic symbols float near each pillar — a brain icon, a tools icon, a network icon, parallel lines, and a hook/automation symbol. Majestic and architectural.

TEXT LAYOUT:
- Title: "Claude Code Architecture" in dark charcoal, bold, large.
- Subtitle: "The Five Pillars of Extensibility" in warm brown.

- 5 cards in a row (warm panel with thin colored border each):

  Card 1 (amber border): "CLAUDE.md" (bold) — "Memories" (teal) — "Always-on project context and conventions" — "Loads at session start"

  Card 2 (teal border): "Skills" (bold) — "On-demand knowledge and workflows" — "Loads when invoked or auto-triggered"

  Card 3 (coral border): "MCP" (bold) — "Model Context Protocol" (teal) — "External tool connections" — "Loads at session start"

  Card 4 (amber border): "Subagents" (bold) — "Parallel/isolated work delegation" — "On-demand execution"

  Card 5 (teal border): "Hooks" (bold) — "Event-driven automation" — "Fires on matching events"

- "6 / 13" bottom-right.`
  },

  // SLIDE 7: De Facto Standard
  {
    file: "slide-07.png",
    prompt: `${STYLE}
SLIDE 7 OF 13 — THE DE FACTO STANDARD

SCENE: A warm golden Blade Runner-style plaza where multiple paths converge to a central point. Different company logos/symbols (represented abstractly as distinct architectural structures) approach from different directions — all converging on a central golden monument representing the shared standard. The scene is bathed in warm amber light with soft golden fog. Think of it as the "industry convergence" moment — rivals meeting at a common ground. Light particles flow between the converging structures. Warm, collaborative, significant.

TEXT LAYOUT:
- Title: "Claude Code: The De Facto Standard" in dark charcoal, bold, large.
- Subtitle: "Industry Convergence on Claude Code's Architecture" in warm brown.

- Convergence table on warm panel (amber border):
  "Company/Product" | "Adopted From Claude Code"
  OpenAI | AGENTS.md (similar to CLAUDE.md)
  Google | AGENTS.md (collaborating on standard)
  GitHub Copilot | copilot-instructions.md
  Cursor | .cursorrules
  Factory AI | AGENTS.md

- Callout panel (teal left border):
  "Linux Foundation — December 2025" in teal bold.
  "Anthropic donated MCP, OpenAI donated AGENTS.md, Block donated engineering resources"
  "Unprecedented collaboration between competitors" in warm brown italic.

- "7 / 13" bottom-right.`
  },

  // SLIDE 8: Anthropic vs OpenAI
  {
    file: "slide-08.png",
    prompt: `${STYLE}
SLIDE 8 OF 13 — ANTHROPIC VS OPENAI: DIVERGENT PHILOSOPHIES

SCENE: A warm Blade Runner-style landscape split into two distinct but equally beautiful zones. LEFT: A warm golden garden-like space with careful, measured architecture — representing Anthropic's safety-first approach. Warm amber light, orderly structures, protective shields visible. RIGHT: A dynamic, expansive golden construction zone with rapid building — representing OpenAI's speed-first approach. Both bathed in warm golden light but with distinctly different energies. A thin golden dividing line between them. Both sides respect their own philosophy. Warm, balanced, thoughtful.

TEXT LAYOUT:
- Title: "Anthropic vs OpenAI" in dark charcoal, bold, large.
- Subtitle: "Divergent Philosophies in AI Development" in warm brown.

- Comparison table (warm panel, thin amber border):
  Headers: "Dimension" (charcoal bold) | "Anthropic" (teal) | "OpenAI" (amber)
  Primary Focus | Safety-first, research-driven | Rapid innovation, broad accessibility
  Development Speed | Conservative, measured | Aggressive, fast-moving
  Safety Approach | Constitutional AI, ASL levels | Preparedness Framework
  Tool Philosophy | Human-in-the-loop | Productivity-first
  System Prompts | 120+ pages of explicit rules | "Make a best effort" approach

- Two quote boxes side by side:
  LEFT (teal border): Anthropic — "Claude never starts its response by saying a question or idea was good, great, fascinating..."
  RIGHT (amber border): OpenAI — "DO NOT ASK A CLARIFYING QUESTION. Instead make a best effort..."

- "8 / 13" bottom-right.`
  },

  // SLIDE 9: AGI Foundation
  {
    file: "slide-09.png",
    prompt: `${STYLE}
SLIDE 9 OF 13 — CLAUDE CODE AS AGI FOUNDATION

SCENE: The most awe-inspiring golden Blade Runner visual. A magnificent recursive spiral structure rises from a golden landscape — each layer of the spiral is a generation of AI tools building the next. At the base, Claude Code (current). The spiral climbs upward through Claude Cowork, then future generation tools, each level more luminous. The structure looks like a golden DNA helix or fibonacci spiral ascending into warm amber sky. Around it, holographic tool icons and code fragments orbit at different levels. Golden dust and warm light particles swirl around the ascending spiral. The scene captures the self-improving nature — AI building better AI. Vast, hopeful, transcendent.

TEXT LAYOUT:
- Title: "Claude Code as AGI Foundation" in dark charcoal, bold, large.
- Subtitle: "Self-Evolving AI — AI Tools Creating Their Own Successors" in warm brown.

- Flow diagram: "Claude Code (v1) → Builds Claude Cowork → Builds Next Generation Tools → Feedback Loop back"

- Case Study panel (warm panel, teal border):
  "Claude Cowork — Built in 10 Days" in teal bold.
  Development Time: ~10 days
  Team Size: 4 engineers
  Code Written By: Claude Code itself ("all of it")
  Human Role: Product and architecture decisions

- Quote: "We spent more time making product and architecture decisions than writing individual lines of code." — Felix Rieseberg, Anthropic

- "9 / 13" bottom-right.`
  },

  // SLIDE 10: Real-World Impact
  {
    file: "slide-10.png",
    prompt: `${STYLE}
SLIDE 10 OF 13 — REAL-WORLD IMPACT AT ANTHROPIC

SCENE: A warm golden Blade Runner-style open-plan engineering floor. Rows of futuristic workstations stretch into the distance, each with warm holographic displays showing code, dashboards, and AI agent interfaces. Engineers work alongside floating holographic Claude Code sessions. The space is flooded with warm golden afternoon light through massive windows. Multiple holographic screens show different use cases — Kubernetes debugging, security analysis, data visualization. The energy is productive, warm, collaborative. Think of a golden-hour version of a busy futuristic engineering hub.

TEXT LAYOUT:
- Title: "Real-World Impact at Anthropic" in dark charcoal, bold, large.

- Key metrics row (three cards, warm panels):
  "80%+" (large amber) — "Engineers using Claude Code daily"
  "5 PRs/day" (large teal) — "Per engineer vs 1-2 industry norm"
  "60-100" (large coral) — "Internal releases per day"

- Team use cases table (warm panel):
  Data Infrastructure | Kubernetes debugging, pipeline automation
  Product Development | Feature implementation, auto-accept prototyping
  Security | Code analysis, vulnerability detection
  Data Science | Visualization, analysis automation
  Legal | Document processing, contract analysis
  Non-technical Staff | Debugging, Git operations

- "10 / 13" bottom-right.`
  },

  // SLIDE 11: Agent Teams
  {
    file: "slide-11.png",
    prompt: `${STYLE}
SLIDE 11 OF 13 — AGENT TEAMS: THE NEXT FRONTIER

SCENE: A stunning golden Blade Runner landscape showing 16 luminous spheres of warm light arranged in a coordinated formation above a vast golden desert. Each sphere represents a parallel Claude agent instance — they are connected by thin warm amber lines forming a constellation/network pattern. Below them, the golden ground shows lines of code being written simultaneously — multiple streams converging into a single magnificent structure (the compiler). The sky is a warm amber gradient. The formation of agents looks orchestrated, beautiful — like a coordinated light show. Particles flow between agents. Vast, powerful, collaborative.

TEXT LAYOUT:
- Title: "Agent Teams: The Next Frontier" in dark charcoal, bold, large.
- Subtitle: "February 2026 Breakthrough" in warm brown.

- Central metrics panel (warm panel, amber border):
  Task | Build a Rust-based C compiler from scratch
  Approach | 16 parallel Claude instances
  Sessions | ~2,000 Claude Code sessions
  Cost | $20,000 in API costs
  Output | 100,000-line compiler
  Achievement | Compiles Linux 6.9 kernel (x86, ARM, RISC-V)
  Supervision | Minimal — "mostly walked away"

- Quote: "With agent teams, multiple Claude instances work in parallel on a shared codebase without active human intervention." — Nicholas Carlini, Anthropic

- "11 / 13" bottom-right.`
  },

  // SLIDE 12: Dario's Prediction
  {
    file: "slide-12.png",
    prompt: `${STYLE}
SLIDE 12 OF 13 — THE AI CODE REVOLUTION: STATUS CHECK

SCENE: A warm golden Blade Runner-style horizon. The viewer looks out over a vast golden desert landscape at dawn — the sun rising on the right, casting long warm shadows. On the left (past/present), faint silhouettes of traditional office buildings. On the right (future), luminous golden structures representing AI-native development. In the sky, large warm holographic percentage numbers float — "30%", "25%", "90%" — representing AI code contribution milestones. The transition from past to future is gradual, warm, inevitable. Dawn of a new era.

TEXT LAYOUT:
- Title: "The AI Code Revolution" in dark charcoal, bold, large.
- Subtitle: "Dario Amodei's Prediction vs Reality" in warm brown.

- Quote panel (warm cream background, amber left border):
  "I think we will be there in three to six months, where AI is writing 90% of the code. And then, in 12 months, AI is writing essentially all the code."
  — Dario Amodei, Anthropic CEO, March 2025

- Status check (February 2026) — four data points with progress indicators:
  30% — Microsoft's code is AI-written
  25% — Google's code is AI-written
  100% — Claude Cowork built entirely by Claude Code
  100% — Boris Cherny's Dec 2025 Claude Code contributions written by Claude + Opus 4.5

- "12 / 13" bottom-right.`
  },

  // SLIDE 13: Conclusion
  {
    file: "slide-13.png",
    prompt: `${STYLE}
SLIDE 13 OF 13 — CONCLUSION

SCENE: The final golden vista. A warm Blade Runner-style scene at golden hour — a figure stands at the edge of a golden cliff or rooftop, looking out at a luminous horizon where golden light meets the sky. The landscape below shows a vast network of warm interconnected structures — representing the new paradigm of AI-human collaboration spreading across the world. In the sky, five soft golden holographic icons represent the five conclusions. The mood is contemplative, warm, hopeful — the future has arrived and it's beautiful. Soft golden particles ascend into the amber sky. Vast and peaceful.

TEXT LAYOUT:
- Title: "Conclusion" in dark charcoal, bold, large.
- Subtitle: "Claude Code Is More Than a Coding Assistant" in warm brown.

- Five numbered conclusion cards (warm panels with teal number badges):
  1 "A Development Methodology" — Prototype-first powered by AI
  2 "A Self-Improving System" — Usage data trains better models
  3 "An Industry Standard" — Skills, MCP, AGENTS.md adopted across industry
  4 "An AGI Foundation" — Tool generation, use, and feedback integration
  5 "A Recursive System" — AI tools that build better AI tools

- Bottom: "The evidence is clear: Anthropic has created not just a product, but a new paradigm for software development." in dark charcoal italic.

- Source line: "Sources: The Pragmatic Engineer, Latent Space, Anthropic Research, SemiAnalysis — Compiled February 2026" in small muted brown.
- "13 / 13" bottom-right.`
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
      slide.background = { color: "FFF8F0" };
      slide.addText(`Slide ${i + 1} — image generation failed`, {
        x: 1, y: 3, w: 11, h: 1.5,
        fontSize: 24, color: "D4710A", align: "center",
      });
    }
  }

  await pptx.writeFile({ fileName: OUTPUT });
  console.log(`\nPresentation saved: ${path.resolve(OUTPUT)}`);
}

async function main() {
  fs.mkdirSync(OUTDIR, { recursive: true });

  console.log(`Generating 13 slides with ${MODEL} (Nano Banana Pro) — Blade Runner 2049 Golden Hour edition...\n`);

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
