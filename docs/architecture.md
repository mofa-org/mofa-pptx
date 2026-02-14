# AI-Generated Presentation Slide Architecture

## Pipeline Overview

```
Source MD ──► Prompt Engineering ──► Nano Banana Pro ──► PNG Slides ──► PptxGenJS ──► .pptx
```

## 1. Source Content

### Presentation A — Agentic SE Playbook (Dark Theme)
`/Users/yuechen/Downloads/Agentic_Software_Engineering_Playbook.md` — 13 slides covering OpenAI's agentic software engineering transformation (cover, inflection point, adoption metrics, mandate, comparison, 6-pillar framework, pillar details, evolving role, roadmap, takeaways, appendix).

### Presentation B — Claude Code Deep Research (Light Theme)
`/Users/yuechen/Downloads/Anthropic_Claude_Code_Deep_Research.md` — 13 slides covering Anthropic's development of Claude Code and Claude Cowork (cover, prototype-first revolution, origin story, self-improving feedback loop, productivity metrics, architecture 5 pillars, de facto standard, Anthropic vs OpenAI, AGI foundation, real-world impact, agent teams, Dario's prediction, conclusion).

## 2. Image Generation

**Model**: `gemini-3-pro-image-preview` (Google Nano Banana Pro)
**SDK**: `@google/genai` npm package
**API Key**: Stored in script, authenticates via `GoogleGenAI({ apiKey })`

Each slide prompt has three layers:

### Shared Style Prefix
Prepended to every prompt. Defines the visual design system. Two themes exist:

#### Theme A — Blade Runner 2049 Dark (Agentic SE Playbook)
- **Canvas**: 1920×1080, 16:9 landscape
- **Color palette**: Midnight blue/dark teal base, neon orange primary accent, cyan secondary accent, muted purple highlights, amber glow, white/gray text
- **Atmosphere**: Dark, moody, cinematic — fog, volumetric light, rain, vast spaces
- **Typography**: Futuristic sans-serif, white/amber titles with glow, light gray body
- **UI elements**: Holographic interface lines, HUD brackets, translucent panels with cyan/orange border glow
- **Readability rule**: Semi-transparent dark overlay panels behind text blocks

#### Theme B — Blade Runner 2049 Golden Hour Light (Claude Code Research)
- **Canvas**: 1920×1080, 16:9 landscape
- **Color palette**: Warm golden amber (#FFB347, #F5A623) dominant, cream/ivory (#F5F0E8, #FFF8F0) light areas, burnt orange (#E8845A) accents, muted teal (#5BB5B5) cool contrast, soft coral (#FF8A80) highlights, deep charcoal (#2D2D2D) text
- **Atmosphere**: Warm, luminous, cinematic — inspired by BR2049 Las Vegas desert sequences. Golden haze, warm volumetric sunlight, vast open amber landscapes, soft fog, ethereal and hopeful
- **Typography**: Clean modern sans-serif (Inter/Helvetica Neue style). Charcoal (#2D2D2D) titles, warm brown (#5A4230) subtitles, teal (#3D8B8B) accent labels. No glow — clean and readable
- **UI elements**: Thin warm-toned holographic lines, soft golden grid overlays, translucent warm amber panels (#FFF8F0 at 80%) with amber or teal borders. Golden bokeh, dust motes, warm lens flares
- **Readability rule**: Semi-transparent warm panels behind text blocks, charcoal text on light panels
- **Mood**: Dawn of a new era — warm, hopeful, vast golden landscapes representing AI-human collaboration frontier

### Scene Description
Per-slide cinematic composition.

#### Presentation A (Dark) — Scene Examples:
- **Cover**: Lone engineer silhouette on rooftop, cityscape, holographic projections in rain
- **Inflection Point**: Split-screen — dim old office (left) vs neon holographic command center (right)
- **Adoption Metrics**: Three holographic light pillars rising from rain-slicked city
- **Mandate**: Wallace-style corporate interior, countdown hologram
- **Roadmap**: Highway through wasteland with four glowing gateway arches
- **Takeaways**: Giant replicant eye iris with circuit patterns, two diverging paths
- **Appendix**: Data archive room with three language-specific holographic columns

#### Presentation B (Light) — Scene Examples:
- **Cover**: Vast Las Vegas desert with brutalist structures, solitary figure walking into golden haze, holographic code projections in warm amber
- **Prototype-First**: Sunlit design studio, "PRD" documents dissolving into particles, holographic prototype materializing
- **Origin Story**: Golden laboratory, engineer at terminal, holographic file trees blooming outward organically
- **Feedback Loop**: Grand circular atrium with domed skylight, holographic circular flow diagram in warm amber/teal
- **Productivity Metrics**: Three golden holographic metric pillars in Las Vegas amber haze, data particles rising
- **Architecture 5 Pillars**: Five golden columns in sunlit atrium, holographic icons (brain, tools, network, lines, hook)
- **De Facto Standard**: Golden plaza with converging paths from different company structures to central monument
- **Anthropic vs OpenAI**: Split landscape — orderly golden garden (left) vs dynamic construction zone (right)
- **AGI Foundation**: Magnificent recursive golden DNA helix/spiral ascending, each level a generation of AI tools
- **Agent Teams**: 16 luminous spheres in coordinated formation over golden desert, connected by amber network lines
- **Dario's Prediction**: Golden desert horizon at dawn, holographic percentage numbers floating in sky
- **Conclusion**: Figure on golden cliff edge looking at luminous horizon, five golden holographic icons in sky

### Text Layout
Exact text content specified word-for-word with:
- Position (top-left, center, columns, etc.)
- Hierarchy (title, subtitle, body, footer)
- Colors (orange headers, cyan accents, white body, gray footnotes)
- Panel styling (semi-transparent dark fill, colored border glow)

## 3. Generation Process

```javascript
// Sequential generation with rate-limit handling
for (let i = 0; i < 13; i++) {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { responseModalities: ["IMAGE", "TEXT"] },
  });
  // Extract base64 image from response, save as PNG
  // 3s delay between requests, retry up to 3x with 15s backoff
}
```

- Images cached per presentation — re-runs skip existing files
  - Presentation A: `slides-br/` directory, 693–856KB each
  - Presentation B: `slides-cc-research/` directory, 662–799KB each

## 4. PPTX Assembly

```javascript
const pptx = new PptxGenJS();
pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
// Each PNG inserted as full-bleed slide background
slide.addImage({ data: base64, x: 0, y: 0, w: 13.333, h: 7.5 });
```

Outputs:
- **Presentation A**: `Agentic_SE_Playbook_BR.pptx` (9.9MB, 13 slides)
- **Presentation B**: `Claude_Code_Deep_Research.pptx` (9.5MB, 13 slides)

## 5. Multi-Model Benchmark

The same Blade Runner 2049 prompts were tested across three image generation models. All received identical content (same 13 slide prompts with same scene descriptions and text).

### Models Tested

| Model | Provider | SDK | Resolution | Image Format | Avg Size/Slide |
|-------|----------|-----|------------|--------------|----------------|
| `gemini-3-pro-image-preview` (Nano Banana Pro) | Google | `@google/genai` (Node.js) | 1920×1080 | Base64 inline → PNG | ~750KB |
| `qwen-image-plus-2026-01-09` | Alibaba (DashScope) | `dashscope` (Python) | 1344×768 | URL download → PNG | ~1500KB |
| `qwen-image-max` | Alibaba (DashScope) | `dashscope` (Python) | 1344×768 | URL download → PNG | ~1450KB |

### Text Accuracy Results

| Slide | Content | NB Pro | Qwen Plus | Qwen Max |
|-------|---------|--------|-----------|----------|
| 1 | "OpenAI's" | ✅ | ❌ "Openay's" | ❌ "Openay's" |
| 1 | "renaissance" | ✅ | ❌ "reneissance" | ❌ "reassance" |
| 2 | "debugging" | ✅ | ❌ "dabbuging" | ❌ "dabugging" |
| 2 | "unit tests" | ✅ | ❌ "unit tasts" | ❌ "unit tusts" |
| 3 | Metric labels | ✅ | ❌ Scrambled | ✅ Correct |
| 4 | "March 31, 2026" | ✅ | ❌ "March 51" | ❌ "March 31, 2022" |
| 5 | "Agentic" | ✅ | ❌ "Agetic" | ✅ |
| 5 | "breakpoint" | ✅ | ❌ "breeckbrock" | ❌ "breektroook" |
| 6 | Card body text | ✅ | ❌ Garbled | ⚠️ Minor errors |
| 10 | Transformation table | ✅ Readable | ❌ Illegible | ❌ Jumbled rows |
| 12 | "README" | ✅ | ❌ "RENDARE" | ❌ "REDADDAR" |

### Visual Quality Rating

| Aspect | NB Pro | Qwen Plus | Qwen Max |
|--------|--------|-----------|----------|
| Cinematic atmosphere | ★★★★☆ | ★★★★★ | ★★★★★ |
| Scene composition | ★★★★☆ | ★★★★★ | ★★★★★ |
| Text rendering accuracy | ★★★★★ | ★★☆☆☆ | ★★☆☆☆ |
| Color/lighting | ★★★★☆ | ★★★★★ | ★★★★★ |
| Overall usability for presentations | ★★★★★ | ★★☆☆☆ | ★★☆☆☆ |

### Conclusion

- **Qwen models** (both Plus and Max) produce more cinematic, detailed art with richer textures and lighting — arguably more visually impressive in isolation.
- **Nano Banana Pro** produces slightly cleaner/simpler art but with **near-perfect text rendering**, making it the only model suitable for presentation slides where text accuracy is non-negotiable.
- Both Qwen models exhibit the same text garbling pattern: proper nouns (OpenAI→Openay), technical terms (debugging→dabbuging), and numbers (31→51, 2026→2022) are frequently corrupted. This is consistent across `qwen-image-plus` and `qwen-image-max`.
- A hybrid approach (Qwen art backgrounds + PptxGenJS text overlay) could combine the best of both, but adds complexity.

### API Differences

| | Gemini (NB Pro) | Qwen (DashScope) |
|---|---|---|
| Auth | API key (`AIza...`) | API key (`sk-...`) |
| Response | Base64 `inlineData` in response body | URL to download from Alibaba OSS |
| Rate limits | ~1 req/3s on free tier | ~1 req/5s, 429 errors more frequent |
| Extra params | `responseModalities: ["IMAGE", "TEXT"]` | `prompt_extend`, `negative_prompt`, `watermark` |
| Language | Node.js SDK | Python SDK |

## 6. File Structure

```
cc-ppt/
│
│── ★ PRESENTATION A: Agentic SE Playbook (Dark BR2049 Theme) ──────────
├── generate-nb-br.js              # ★ Best: Gemini NB Pro + Blade Runner dark theme
├── slides-br/                     # Cached NB Pro output (693–856KB each)
│   └── slide-01.png ... slide-13.png
├── Agentic_SE_Playbook_BR.pptx    # ★ Final output (9.9MB)
│
│── ★ PRESENTATION B: Claude Code Deep Research (Light BR2049 Theme) ───
├── generate-cc-research.js        # ★ NB Pro + Blade Runner golden hour light theme
├── slides-cc-research/            # Cached NB Pro output (662–799KB each)
│   └── slide-01.png ... slide-13.png
├── Claude_Code_Deep_Research.pptx  # ★ Final output (9.5MB)
│
│── Qwen Model Benchmarks ─────────────────────────────────────────────
├── generate-qwen.py               # Qwen Image Plus version (Python)
├── slides-qwen/                   # Cached Qwen Plus output (~1.5MB each)
│   └── slide-01.png ... slide-13.png
├── Agentic_SE_Playbook_Qwen.pptx  # Qwen Plus output (19.3MB)
│
├── generate-qwen-max.py           # Qwen Image Max version (Python)
├── slides-qwen-max/               # Cached Qwen Max output (~1.4MB each)
│   └── slide-01.png ... slide-13.png
├── Agentic_SE_Playbook_QwenMax.pptx # Qwen Max output (18.5MB)
│
│── Earlier Versions ──────────────────────────────────────────────────
├── generate-nb-pro.js             # Earlier version (purple/clean theme)
├── slides-nbpro/                  # Purple theme cached images
├── Agentic_SE_Playbook_NBPro.pptx # Purple theme output
│
├── generate-slides.js             # v1: Pure PptxGenJS, no AI images
├── generate-with-gemini.js        # v2: Gemini 2.0 backgrounds + PptxGenJS text
├── generate-full-slides.js        # v3: Gemini 2.0 full slides (garbled text)
├── generate-final.js              # v4: Gemini 2.0 art + improved PptxGenJS text
├── generate-art.js                # Fallback: programmatic SVG illustrations
├── test-gemini.js                 # Gemini API key test
├── test-qwen.png                  # Qwen Plus test output
├── test-qwen-max.png              # Qwen Max test output
├── test-nb-pro.png                # NB Pro test output
│
├── architecture.md                # This document
├── package.json                   # Node.js dependencies
└── node_modules/
```

## 7. Dependencies

- `pptxgenjs` — PowerPoint file generation (Node.js)
- `@google/genai` — Google Gemini API client (Node.js)
- `sharp` — Image processing (used in earlier versions for gradient backgrounds)
- `dashscope` — Alibaba DashScope API client (Python)
- `python-pptx` — PowerPoint file generation (Python)

## 8. Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Image gen model | `gemini-3-pro-image-preview` (NB Pro) | Pixel-perfect text; Qwen Plus/Max garble text; old Gemini 2.0 also garbles |
| Slide rendering | 100% AI-generated images | User wanted artistic feeling, not "plain" PptxGenJS layouts |
| Theme A (dark) | Blade Runner 2049 dark/rain | Content about AI agents replacing human programmers — dystopian thematic match |
| Theme B (light) | Blade Runner 2049 golden hour | Same BR2049 universe but Las Vegas desert sequences — warm, hopeful; fits Claude Code's positive impact narrative |
| Prompt structure | Shared style prefix + per-slide scene + exact text | Ensures visual consistency across slides while allowing unique compositions |
| Sequential generation | 3s delays + retry with backoff | Avoids Gemini API rate limits on free tier |
| Caching | Skip existing PNGs on re-run | Enables regenerating individual slides without re-doing all 13 |

## 9. Trade-offs

- **Text is not editable** in PowerPoint — each slide is a flat image. To change a word, regenerate that slide's image.
- **Non-deterministic** — re-running produces different art. Cache preserves successful outputs.
- **API dependency** — requires valid Gemini API key with quota for `gemini-3-pro-image-preview`.
- **Prompt leakage risk** — formatting instructions (e.g. "~36px", "18px") can appear in rendered text if not carefully worded. Fixed by avoiding raw CSS units in prompts and using descriptive sizing (e.g. "large size matching other slide titles", "smaller than title") instead. Occurred on Presentation A slide 7 ("~36px") and Presentation B slide 2 ("18px") — both fixed by prompt rewording + single-slide regeneration.

## 10. Evolution History

1. **v1** (`generate-slides.js`): Pure PptxGenJS + sharp gradient backgrounds. Functional but plain.
2. **v2** (`generate-with-gemini.js`): Gemini 2.0 backgrounds + PptxGenJS text overlay. Better art, still plain text.
3. **v3** (`generate-full-slides.js`): Gemini 2.0 renders everything. Beautiful art, garbled text.
4. **v4** (`generate-final.js`): Gemini 2.0 art backgrounds + improved PptxGenJS text panels. Compromise.
5. **v5** (`generate-nb-pro.js`): Nano Banana Pro renders everything. Clean purple theme, perfect text.
6. **v6** (`generate-nb-br.js`): Nano Banana Pro + Blade Runner 2049 cinematic theme. **Best result.**
7. **v7** (`generate-qwen.py`): Qwen Image Plus + Blade Runner theme. Stunning art, garbled text.
8. **v8** (`generate-qwen-max.py`): Qwen Image Max + Blade Runner theme. Similar art quality, same text issues.
9. **v9** (`generate-cc-research.js`): Nano Banana Pro + Blade Runner 2049 **Golden Hour light theme**. New content (Claude Code Deep Research). Warm amber/gold palette, Las Vegas desert aesthetic, charcoal text on cream panels. **Best light-theme result.**
