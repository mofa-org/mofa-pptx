const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-infra-race";
const SW = 13.333, SH = 7.5;
const TOTAL = 26;

// ─── STYLE: AMAZON DARK ─────────────────────────────────────────────
const STYLE_AMAZON_DARK = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Dark navy (#232F3E), solid, elegant, premium.

TYPOGRAPHY: Noto Sans SC font (clean Chinese sans-serif) for ALL text. ALL text in Chinese ONLY — absolutely NO English anywhere on the slide.
- Title: bold, Amazon orange, large heading, top-left aligned
- Body: light weight, light gray, standard body size
- Stat numbers: bold, Amazon orange, very large display size

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration in ORANGE tones:
- Orange (#FF9900) line art on dark backgrounds — thin, elegant lines (~1.5-2px)
- DETAILED icons with character: rocket engines with flame details, server racks with blinking lights, chip dies with pin grids, robot arms with joints visible
- Hand-drawn/sketch quality but CLEAN and READABLE — like a senior designer's concept whiteboard on a dark canvas
- Arrows are clean with proper arrowheads in orange
- Labels in clean Noto Sans SC near their icons
- Cards use dark card backgrounds (#2C3849) with thin orange left border, rounded corners (12px)
- Generous white space inside each card — diagrams breathe, never cramped

CRITICAL: Premium consulting deck aesthetic (McKinsey / BCG quality) with hand-drawn wireframe concept sketches in orange on dark navy. Apple Keynote level whitespace and typography. Intellectual, sophisticated, dramatic.`;

// ─── STYLE: AMAZON LIGHT ────────────────────────────────────────────
const STYLE_AMAZON_LIGHT = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: White (#FFFFFF), clean, minimal.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, black, large heading. The word "Amazon" (if present) in Amazon orange.
- Body: light weight, medium gray, standard body size
- Stat numbers: bold, Amazon orange, very large display size

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration:
- Medium gray (#666666 to #888888) line art with orange (#FF9900) accent highlights
- DETAILED icons: server racks, chip dies, rocket shapes, warehouse robots — each with recognizable detail
- Hand-drawn/sketch quality but clean and professional
- Stat cards use dark navy (#232F3E) background with orange numbers for dramatic contrast
- Regular cards are white with subtle shadow and thin orange left border
- Generous whitespace — Apple Keynote level spacing

Premium consulting aesthetic with orange accent wireframes on white. Clean, intellectual, data-forward.`;

// ─── STYLE: GOOGLE ──────────────────────────────────────────────────
const STYLE_GOOGLE = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Very light warm gray (#F8F9FA) to white, clean, airy.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, near-black, large heading. Company name in Google blue.
- Body: light weight, medium gray, standard body size
- Stat numbers: bold, very large display size, using Google's four brand colors for different stats

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration in Google's four colors:
- Blue (#4285F4), Red (#EA4335), Yellow (#FBBC05), Green (#34A853) line art — thin, elegant
- Different sections/layers use different Google colors for visual separation
- DETAILED icons: TPU chip with heat sink fins, optical fiber cables with light beams, self-driving car with sensor array, satellite dish, neural network nodes
- Hand-drawn/sketch quality but CLEAN — like a Google design team's concept whiteboard
- Cards are white with colored left borders matching their section color, rounded 12px, subtle shadow
- Generous whitespace — Apple Keynote level

Premium consulting aesthetic with Google's four-color wireframe sketches on light gray. Fresh, intellectual, optimistic.`;

// ─── STYLE: MICROSOFT ───────────────────────────────────────────────
const STYLE_MICROSOFT = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: White (#FFFFFF), pristine, corporate-clean.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, black, large heading. Company name in Microsoft blue.
- Body: light weight, medium gray, standard body size
- Stat numbers: bold, very large display size

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration in Microsoft blue tones:
- Blue (#0078D4) and complementary colors (#7FBA00 green, #00A4EF cyan, #F25022 red, #FFB900 yellow) line art
- DETAILED icons: Windows laptop screen with UI elements, Office document icons, cloud server with Azure logo shape, identity shield with keyhole, code editor with syntax lines
- Hand-drawn/sketch quality but CLEAN and CORPORATE — precise, structured, trustworthy
- Cards are white with thin blue (#0078D4) left border or blue header bar, rounded 12px
- Generous whitespace — Apple Keynote level

Premium enterprise consulting aesthetic with blue wireframe sketches. Structured, trustworthy, enterprise-grade.`;

// ─── STYLE: NVIDIA DARK ─────────────────────────────────────────────
const STYLE_NVIDIA_DARK = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Pure black (#000000) to very dark (#0A0A0A), dramatic, premium.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, NVIDIA green, large heading
- Body: light weight, light gray, standard body size
- Stat numbers: bold, NVIDIA green, very large display size

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration in NVIDIA green:
- Green (#76B900) line art on black — glowing, tech-forward, like circuit board traces
- DETAILED icons: GPU die with thousands of cores visualized, server rack with NVLink connections, robotic arm with joint motors, factory floor with conveyor belts, autonomous car with sensor rays
- Thin elegant lines (~1.5-2px) with slight green glow effect
- Hand-drawn/sketch quality but CLEAN — like a hardware engineer's concept sketch on black paper with green pencil
- Cards use dark (#1A1A1A) background with thin green border, rounded 12px
- Generous whitespace — Apple Keynote level, lots of black breathing room

Premium hardware/silicon consulting aesthetic with green wireframe on black. Dramatic, technical, powerful.`;

// ─── STYLE: NVIDIA LIGHT ────────────────────────────────────────────
const STYLE_NVIDIA_LIGHT = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: White (#FFFFFF), clean.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, black, large heading
- Body: light weight, medium gray, standard body size
- Stat numbers: bold, NVIDIA green, very large display size

ILLUSTRATION STYLE (CRITICAL):
Wireframe sketches in dark gray with NVIDIA green (#76B900) accent highlights.
- Dark stat cards (#1A1A1A) with green numbers for dramatic callouts
- Regular cards white with green left border
- DETAILED wireframe icons of GPU hardware, CUDA code blocks, developer silhouettes
- Generous whitespace — Apple Keynote level

Premium consulting aesthetic with green accent wireframes on white.`;

// ─── STYLE: OVERVIEW ────────────────────────────────────────────────
const STYLE_OVERVIEW = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: White (#FFFFFF) or very light gray (#F8F9FA), clean, neutral.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, black, large heading
- Body: light weight, medium gray, standard body size
- Stat numbers: bold, very large display size

ILLUSTRATION STYLE (CRITICAL):
Use each company's brand color for their respective sections:
- Amazon: Orange #FF9900 wireframe icons (rocket, warehouse robot)
- Google: Blue #4285F4 wireframe icons (TPU chip, self-driving car)
- Microsoft: Blue #0078D4 wireframe icons (laptop, cloud)
- NVIDIA: Green #76B900 wireframe icons (GPU, factory)
- DETAILED icons with character — each company's section should feel branded through color
- Cards are white with company-colored left borders, rounded 12px, subtle shadow
- Generous whitespace — Apple Keynote level

Premium multi-brand consulting aesthetic. Clean, comparative, authoritative.`;

// ─── STYLE: COVER DARK ──────────────────────────────────────────────
const STYLE_COVER = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Medium lavender/purple gradient — from #C8B8E0 (medium lavender) at top-left to #D8CCE8 (soft purple) at bottom-right. Richer purple than pastel, elegant and premium.

In the right half, include VERY FAINT wireframe sketches (at 10-15% opacity) of four iconic tech shapes: a GPU chip die, a TPU wafer, a self-driving car outline, and a server rack — overlapping subtly like a collage watermark. Drawn in faint purple lines (#A090C0). They should NOT compete with the text.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Main title: bold, very dark navy, extra-large heading
- ALL other text: OMIT — no subtitle, no metadata, no date. ONLY the main title.

The LEFT 50% should be clear for the title. Minimal, elegant, dramatic.`;

// ─── SLIDE PROMPTS ──────────────────────────────────────────────────
const slides = [

// ═══ SLIDE 1: 封面 ═══════════════════════════════════════════════
{
  style: "cover",
  prompt: `
TITLE ONLY — centered vertically on the left half:
"智能体AI基础设施竞赛" — bold, extra-large, very dark navy

NO other text. No subtitle, no company names, no date, no metadata. ONLY the title.

The faint wireframe tech watermarks in the right half should be barely visible — GPU die, TPU, car outline, server rack.
Generous empty space with elegant centered typography. No logos, no decoration. Pure typographic impact.`
},

// ═══ SLIDE 2: 核心洞察 ════════════════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "核心洞察"

FOUR WHITE CARDS in 2×2 grid with generous spacing:

─── CARD 1 (top-left): thin Amazon orange left border ───
Diagram: Small wireframe sketch of a rocket launching upward + a warehouse robot arm, drawn in orange lines.
Header: "Amazon" in bold Amazon orange
Body: "天地一体化融合" in light weight
Subtitle: "$200B投资 | 太空→自动驾驶→Claude Code" in small gray text

─── CARD 2 (top-right): thin Google blue left border ───
Diagram: Small wireframe sketch of a self-driving car + a TPU chip die, drawn in blue lines.
Header: "Google" in bold Google blue
Body: "物理AI全栈主导" in light weight
Subtitle: "$175-185B | Waymo数据 + TPU v7成本优势44%" in small gray text

─── CARD 3 (bottom-left): thin Microsoft blue left border ───
Diagram: Small wireframe sketch of a laptop with Copilot sparkle + Office document, drawn in blue lines.
Header: "Microsoft" in bold Microsoft blue
Body: "企业工作流锁定" in light weight
Subtitle: "$150B | 1500万Copilot席位 | 财富500强90%" in small gray text

─── CARD 4 (bottom-right): thin NVIDIA green left border ───
Diagram: Small wireframe sketch of a GPU chip with radiating connections + a robotic arm, drawn in green lines.
Header: "NVIDIA" in bold NVIDIA green
Body: "物理AI平台编排者" in light weight
Subtitle: "CUDA护城河 + 新云投资 + 物理AI" in small gray text

Each card has the wireframe sketch in the top-right corner of the card, with text flowing below/beside it. Cards are white with subtle shadow. LOTS of whitespace between cards.`
},

// ═══ SLIDE 3: 决定性战场 ═════════════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "未来的决定性战场"

HERO STAT centered in top third:
Diagram: A large wireframe globe/world icon in gray, with a chip icon and a robot arm icon orbiting around it.
Big stat overlay: "$200-300B" in huge bold NVIDIA green text
Below: "2030年物理AI计算市场规模" in standard light gray text

TWO WHITE CARDS below, side by side:

─── CARD LEFT: "数据中心AI (2024-2027)" ───
Diagram: A wireframe server rack icon, drawn smaller/fading, with downward arrows indicating decline.
Three bullet lines:
• "NVIDIA主导但正在商品化"
• "定制芯片侵蚀市场份额"
• "利润率压缩"

─── CARD RIGHT: "物理AI (2026-2030)" ───
Diagram: Three wireframe icons in a row — a self-driving car, a humanoid robot, a warehouse with conveyor belt — drawn bold with upward arrows.
Three bullet lines:
• "自动驾驶: $50-100B"
• "人形机器人: $30-50B"
• "仓储与工业: $80B+"

BOTTOM: One wide card with gradient background (Google blue to NVIDIA green), white text:
Diagram: Two wireframe logos facing each other — a TPU wafer (Google) and a GPU die (NVIDIA) with lightning between them.
"关键对决：Google vs NVIDIA — 唯一在每个层面挑战NVIDIA的公司"`
},

// ═══ SLIDE 4: Amazon 技术栈 ═══════════════════════════════════════
{
  style: "amazon_dark",
  prompt: `
TITLE (top-left, bold, Amazon orange): "Amazon：天地一体化技术栈"

VERTICAL STACK of 4 layers on dark navy, connected by thin orange downward arrows. Each layer is a rounded dark card with thin orange left border. Each has a LEFT wireframe icon and RIGHT text.

Layer 1 (top):
Icon: Wireframe rocket + satellite constellation (3 small satellites orbiting), in orange lines
Text: "太空基础设施层" (bold, orange) / "Blue Origin火箭 | Kuiper 3,236颗卫星" (light gray)

↓ thin orange arrow with label "超低成本部署"

Layer 2:
Icon: Wireframe server rack cluster with a chip die beside it, in orange lines
Text: "计算基础设施层" (bold, orange) / "34区域 | Trainium2/3/4 | 成本优势30-40%" (light gray)

↓ thin orange arrow with label "AI模型层"

Layer 3:
Icon: Wireframe brain with neural connections + a multi-model selector (3 small boxes), in orange lines
Text: "Claude + Bedrock平台" (bold, orange) / "$8B Anthropic | 50万Trainium2部署" (light gray)

↓ thin orange arrow with label "智能体应用"

Layer 4 (bottom):
Icon: Wireframe autonomous car + warehouse robot arm, in orange lines
Text: "物理自动化层" (bold, orange) / "Zoox自动驾驶 | 100万+Kiva机器人 | 节省$25-35B/年" (light gray)

The stack flows top-to-bottom showing Amazon's full vertical integration from space to ground.
Generous vertical spacing between layers. Clean wireframe icons are the visual star.`
},

// ═══ SLIDE 5: Amazon 关键指标 ═════════════════════════════════════
{
  style: "amazon_light",
  prompt: `
TITLE (top-left, bold, black): "Amazon 关键指标"

FOUR STAT CARDS in 2×2 grid. Each card has dark navy background, rounded corners, with a tiny wireframe icon in the top-right corner of each card:

Card 1 — icon: wireframe dollar/investment chart in orange:
"$200B" in very large bold Amazon orange
"2026年资本支出 (+50%)" in small light white text

Card 2 — icon: wireframe order stack/clipboard in orange:
"$244B" in very large bold Amazon orange
"AWS订单积压 (+40%)" in small light white text

Card 3 — icon: wireframe cash flow funnel (narrow) in orange:
"5.6%" in very large bold Amazon orange
"自由现金流容错空间" in small light white text

Card 4 — icon: wireframe chip die with pin grid in orange:
"50万" in very large bold Amazon orange
"Trainium2芯片部署" in small light white text

Below grid, one wide light-orange card:
Diagram: Three wireframe icons in a row — (1) three stacked chips labeled "3代", (2) a multi-model platform with branching arrows, (3) a rocket→cloud→robot flow chain — all in orange wireframe.
Header: "战略优势" in bold Amazon orange
Three key points beside the diagrams:
• "三代训练芯片：唯一Trainium 2/3/4"
• "模型无关：Bedrock支持Claude、Llama、Mistral"
• "垂直整合：太空→云→AI→物流闭环"`
},

// ═══ SLIDE 6: Amazon 风险与机遇 ═══════════════════════════════════
{
  style: "amazon_light",
  prompt: `
TITLE (top-left, bold, black): "Amazon 风险与机遇"

TWO COLUMNS with header labels:

LEFT COLUMN — "关键风险" in bold red:
Three stacked cards with pale red background:

Risk 1 — icon: wireframe declining chart with crack, in red lines:
"现金流危机" (bold, red)
"自由现金流暴跌70% ($38.2B→$11.2B) 仅5.6%容错" (light)

Risk 2 — icon: wireframe funnel narrowing to single point, in red:
"客户集中度" (bold, red)
"Anthropic是Trainium最大客户 需3-5个大客户分散" (light)

Risk 3 — icon: wireframe figure juggling 4 balls (space, car, chip, AI), in red:
"多线作战" (bold, red)
"太空、自动驾驶、芯片、AI 资源分散无单一第一" (light)

RIGHT COLUMN — "战略机遇" in bold green:
Three stacked cards with pale green background:

Opp 1 — icon: wireframe autonomous car fleet with dollar signs, in green:
"Zoox规模化" (bold, green)
"2030年节省$25-35B/年 赋能30分钟配送" (light)

Opp 2 — icon: wireframe satellite + server in orbit, in green:
"太空数据中心" (bold, green)
"2028+年40-60%成本优势 无限冷却+太阳能" (light)

Opp 3 — icon: wireframe code terminal with sparkle, in green:
"Claude Code主导" (bold, green)
"开发工具$10-15B市场 3-10倍生产力" (light)

Generous spacing. Each card's wireframe icon is in the card's top-left corner.`
},

// ═══ SLIDE 7: Google 技术栈 ═══════════════════════════════════════
{
  style: "google",
  prompt: `
TITLE (top-left, bold, Google blue): "Google：物理AI全栈平台"

VERTICAL STACK of 5 layers on light gray background, connected by thin colored downward arrows. Each layer is a white card with a different Google-color left border. Each has a wireframe icon on the left.

Layer 1 — Google blue left border:
Icon: Wireframe self-driving car with LIDAR sensor rays fanning out, in blue lines
Text: "真实世界数据" (bold, blue) / "Waymo 2500万英里 | 15年边缘案例 | 每周20万次" (light)
↓ label: "不可替代的数据护城河"

Layer 2 — Google red left border:
Icon: Wireframe brain generating a 3D world scene (cubes, spheres emerging), in red lines
Text: "世界模型层" (bold, red) / "Genie生成式交互 | 物理与因果理解" (light)
↓ label: "具身智能"

Layer 3 — Google green left border:
Icon: Wireframe TPU chip wafer with performance graph beside it, in green lines
Text: "AI模型与计算层" (bold, green) / "Gemini 3.0首破1500 Elo | TPU v7成本低44%" (light)
↓ label: "机器人控制"

Layer 4 — yellow-dark left border:
Icon: Wireframe robotic arm reaching for objects on a table, in dark/gold lines
Text: "DeepMind机器人栈" (bold, dark) / "RT-2语言引导 | 6000+任务训练" (light)
↓ label: "20亿+用户分发"

Clean, airy, each layer's icon in its respective Google color. Generous spacing.`
},

// ═══ SLIDE 8: Google TPU v7 ═══════════════════════════════════════
{
  style: "google",
  prompt: `
TITLE (top-left, bold, Google blue): "Google TPU v7 改变游戏规则"

HERO SECTION — large card with gradient (Google blue to Google green) background:
Diagram: Wireframe side-by-side comparison — LEFT: a TPU v7 chip die (detailed, fins, pins visible), RIGHT: an NVIDIA GPU die — with a "VS" between them. A balance scale tips toward the TPU side.
Huge stat overlay: "44%" in huge bold white text
Below: "TCO成本优势 vs NVIDIA GB200" in standard light white text

THREE stat cards in a row below the hero:

Card 1 (light green tint) — tiny chip wireframe icon:
"4,614 TFLOPS" in large bold Google green / "FP8性能" in light text

Card 2 (light blue tint) — tiny pod/cluster wireframe icon:
"9,216" in large bold Google blue / "原生芯片Pod规模" in light text

Card 3 (light orange tint) — tiny memory chip wireframe icon:
"192GB" in large bold amber / "HBM3e内存" in light text

BOTTOM — clean light gray card:
Diagram: Wireframe optical fiber cables with light beams passing through MEMS mirrors — drawn in blue/green lines. Shows the concept of optical switching.
Header: "全光交叉连接 (OCS)" in bold Google blue
Compact bullets: • $3B+节省 • 速率无关：400G→1.6T • 40%功耗降低 • 9,216芯片Pod`
},

// ═══ SLIDE 9: Waymo 数据护城河 ════════════════════════════════════
{
  style: "google",
  prompt: `
TITLE (top-left, bold, Google blue): "Waymo 不可替代的数据优势"

FOUR hero stat cards in a row, each with Google-color gradient background and white text:

Card 1 (blue→green gradient) — tiny car wireframe icon:
"2500万" in very large bold white / "真实里程" in light text

Card 2 (red→yellow gradient) — tiny calendar wireframe icon:
"15年" in very large bold white / "数据积累" in light text

Card 3 (yellow→green gradient) — tiny ride wireframe icon:
"20万" in very large bold white / "周乘坐次数" in light text

Card 4 (green→blue gradient) — tiny dollar wireframe icon:
"$70B" in very large bold white / "估值" in light text

Below, a large white card showing "数据价值金字塔":
Diagram: A PYRAMID with three tiers, drawn in wireframe sketch style using Google colors:

TOP tier (smallest, red tint, most valuable):
Wireframe icon: car swerving around construction cones
"边缘案例 — Waymo: 100万边缘案例存档" (bold)
"竞争对手: 3-10年数据 质量较低" (small, gray)

MIDDLE tier (Google yellow tint):
Wireframe icon: car navigating busy intersection
"复杂城市场景 — 6城市精通 扩展至10-20城"

BOTTOM tier (widest, Google green tint):
Wireframe icon: car on highway
"标准驾驶 — 所有竞争对手都有"

Bottom callout: "Waymo核心数据领先10-15年 无法购买 无法合成" (bold, green)`
},

// ═══ SLIDE 10: Google 投资与增长 ═══════════════════════════════════
{
  style: "google",
  prompt: `
TITLE (top-left, bold, Google blue): "Google 投资与增长"

FOUR stat cards in 2×2 grid. Each has solid Google-color background with white text and a tiny wireframe icon:

Card 1 (Google blue background) — icon: wireframe factory/datacenter:
"$175-185B" in very large bold white
"2026年资本支出 (~2× 2025)" in light white text

Card 2 (Google green background) — icon: wireframe order stack:
"$240B" in very large bold white
"云订单积压 (YoY翻倍)" in light white text

Card 3 (Google red background) — icon: wireframe growth chart:
"48%" in very large bold white
"Cloud收入增长 Q4 2025" in light white text

Card 4 (Google yellow background) — icon: wireframe trophy/crown:
"1501" in very large bold black
"Gemini 3.0 LMArena Elo (首破1500)" in light dark text

Below, light gradient card with TWO columns of strategic advantages:
Left column with wireframe icons (blue/green):
• "物理AI数据护城河：Waymo 15年不可替代"
• "成本领先：TPU v7比NVIDIA低44%"
• "全栈能力：唯一挑战NVIDIA全层级"

Right column with wireframe icons (red/yellow):
• "世界模型：Genie + Waymo数据迁移至机器人"
• "分发优势：Android 30亿设备"
• "研究深度：DeepMind 7代TPU经验"`
},

// ═══ SLIDE 11: Microsoft 技术栈 ════════════════════════════════════
{
  style: "microsoft",
  prompt: `
TITLE (top-left, bold, Microsoft blue): "Microsoft：企业工作流锁定栈"

VERTICAL STACK of 5 layers on white background, connected by thin blue downward arrows. Each layer is a white card with Microsoft-colored left border. Each has a wireframe icon.

Layer 1 — Microsoft blue left border:
Icon: Wireframe Windows laptop + Active Directory shield icon, in blue lines
Text: "操作系统基础" (bold, blue) / "Windows 14亿PC | Active Directory | Entra ID" (light)
↓ label: "设备与身份控制"

Layer 2 — Microsoft green left border:
Icon: Wireframe Word/Excel/Teams document icons in a row, in green lines
Text: "生产力应用层" (bold, green) / "M365 4亿+席位 | Teams 3.2亿MAU" (light)
↓ label: "工作流捕获"

Layer 3 — Microsoft yellow left border:
Icon: Wireframe brain + chip die connected by neural paths, in gold lines
Text: "AI模型与推理层" (bold, dark) / "OpenAI合作 27%股权 | Maia 200" (light)
↓ label: "Copilot无处不在"

Layer 4 — Microsoft red left border:
Icon: Wireframe sparkle/Copilot icon + code brackets, in red lines
Text: "Copilot智能体层" (bold, red) / "1500万席位 | GitHub 470万 | 42%份额" (light)
↓ label: "Microsoft Graph数据"

Layer 5 — Microsoft blue left border:
Icon: Wireframe lock + data mesh network, in blue lines
Text: "企业数据锁定" (bold, blue) / "邮件、日历、文档、代码 → 工作流不可替代" (light)

Clean, structured, each layer with its respective Microsoft color.`
},

// ═══ SLIDE 12: M365 Copilot ═══════════════════════════════════════
{
  style: "microsoft",
  prompt: `
TITLE (top-left, bold, Microsoft blue): "M365 Copilot 史上最快企业AI采用"

THREE hero stat cards in a row at top, each with bold colored background and a tiny wireframe icon:

Card 1 (Microsoft blue background) — icon: wireframe seat/chair rows:
"1500万" in very large bold white / "付费席位 (+160% YoY)" in light white text

Card 2 (Microsoft green background) — icon: wireframe trophy with F500:
"90%" in very large bold white / "财富500强采用率" in light white text

Card 3 (Microsoft cyan background) — icon: wireframe growth arrow (10×):
"10×" in very large bold white / "日活跃用户增长" in light white text

MIDDLE — large white card with two-column comparison:
Diagram: LEFT side shows a wireframe "obstacle course" path (register, learn UI, export data, change habits) — long, winding, with barriers. Label: "传统AI工具" — "6-12个月 30-50%失败率" (red)
RIGHT side shows a wireframe "straight highway" — IT switches toggle, user sees Copilot icon in familiar Word. Label: "Microsoft Copilot" — "1-4周 80-90%参与度" (green)

BOTTOM — wide card with gradient (Microsoft blue to cyan):
Diagram: Wireframe GitHub octocat + code editor, in white lines.
"GitHub Copilot: 470万付费 | 42%市场份额 | 财富100强90%" (bold, white)`
},

// ═══ SLIDE 13: Microsoft 创新者困境 ═══════════════════════════════
{
  style: "microsoft",
  prompt: `
TITLE (top-left, bold, Microsoft blue): "Microsoft 创新者困境"

TOP — warning card (light orange background):
Header: "智能体自主性差距" in bold amber
Diagram: Side-by-side wireframe comparison — LEFT: a small window/editor icon (GitHub Copilot, suggesting code in a small box), RIGHT: a large full-screen terminal icon (Claude Code, controlling entire project with tentacle-like connections to files, tests, git). The Claude Code side is visibly larger and more autonomous.

Below the diagram, three comparison rows with thin separators:
"完整项目上下文" | "文件级别" | "整个代码库 ✓" (green check)
"自主执行" | "建议PR" | "运行测试、提交 ✓" (green check)
"错误恢复" | "需手动" | "自动修复、重试 ✓" (green check)

BOTTOM — two cards side by side:

Left card (pale red background):
Diagram: Wireframe empty factory floor with "?" marks where robots should be.
"物理AI完全缺失" in bold red
"无自动驾驶、无机器人 2030年30-40%市场缺失" (light)

Right card (pale orange background):
Diagram: Wireframe chain link breaking — Microsoft connected to OpenAI, but chain cracking as Oracle and AWS icons pull from the other side.
"OpenAI合作风险" in bold orange
"失去独家：$250B+$300B+$38B多云" (light)`
},

// ═══ SLIDE 14: NVIDIA 技术栈 ══════════════════════════════════════
{
  style: "nvidia_dark",
  prompt: `
TITLE (top-left, bold, NVIDIA green): "NVIDIA：物理AI平台编排者"

VERTICAL STACK of 5 layers on pure black, connected by thin green arrows. Each layer is a near-black dark card with thin green border. Each has a green wireframe icon.

Layer 1:
Icon: Wireframe GPU die (Blackwell) with heat spreader and dense core grid visible, glowing green lines
Text: "硬件基础" (bold, green) / "Blackwell B300/GB300 | DRIVE Thor | Jetson Orin" (light gray)

↓ thin green arrow

Layer 2:
Icon: Wireframe network of data centers connected by lines radiating from a central NVIDIA hub, green lines
Text: "新云投资层" (bold, green) / "CoreWeave $2B | Lambda、Crusoe | $55.6B积压" (light gray)

↓

Layer 3:
Icon: Wireframe code block with "CUDA" text and radiating connection lines to framework icons, green lines
Text: "软件平台层" (bold, green) / "CUDA 400万开发者 | NIM 2.6× | NeMo" (light gray)

↓

Layer 4:
Icon: Wireframe robot head with gears + agent workflow arrows, green lines
Text: "智能体框架层" (bold, green) / "AgentIQ开源 | Isaac ROS机器人" (light gray)

↓

Layer 5:
Icon: Wireframe autonomous car + factory floor + humanoid robot side by side, green lines
Text: "物理AI平台层" (bold, green) / "DRIVE自动驾驶 | Isaac机器人 | 物理技能经济" (light gray)

Dramatic green-on-black wireframe. The GPU die in Layer 1 should be especially detailed and impressive.`
},

// ═══ SLIDE 15: NVIDIA 物理AI愿景 ═════════════════════════════════
{
  style: "nvidia_dark",
  prompt: `
TITLE (top-left, bold, NVIDIA green): "NVIDIA 物理AI愿景：原子世界"

TOP — large section with subtle green border:
"物理技能经济" in very large bold NVIDIA green, centered

MAIN — 3×2 GRID of concept cards, each near-black dark with thin green border and a green wireframe icon:

Card 1 — icon: wireframe factory with robotic assembly line:
"可编程工厂" (bold, green)

Card 2 — icon: wireframe lab beakers + robotic pipette:
"自驾实验室" (bold, green)

Card 3 — icon: wireframe hand gesturing to a robotic arm that mirrors the gesture:
"物理提示" (bold, green)

Card 4 — icon: wireframe MCP connector plugging into a robotic body:
"具身MCP" (bold, green)

Card 5 — icon: wireframe fleet of autonomous vehicles in formation:
"智能体车队" (bold, green)

Card 6 — icon: wireframe dots expanding outward (infinity concept):
"更多场景..." (bold, green)

BOTTOM — two stacked accent cards:
Card A (subtle cyan glow border):
"物理API — 统一连接数字与物理世界" in bold cyan

Card B (large, dramatic):
"原子世界" in very large bold white
"物理世界的智能化基础设施" in standard light gray text

Dramatic, visionary, lots of black breathing room between elements.`
},

// ═══ SLIDE 16: NVIDIA CUDA护城河 ═════════════════════════════════
{
  style: "nvidia_light",
  prompt: `
TITLE (top-left, bold, black): "NVIDIA CUDA不可打破的护城河"

THREE hero stat cards in a row, each near-black dark background with green wireframe icons:

Card 1 — icon: wireframe crowd of developer silhouettes:
"400万" in very large bold NVIDIA green / "全球CUDA开发者" in light white text

Card 2 — icon: wireframe app grid (3×3 tiny app windows):
"3,000+" in very large bold NVIDIA green / "GPU加速应用" in light white text

Card 3 — icon: wireframe building/enterprise icons:
"4万+" in very large bold NVIDIA green / "使用CUDA的企业" in light white text

MIDDLE — large light gray card:
Diagram: A wireframe MOAT around a castle/fortress — the castle labeled "CUDA" at center. Five defensive walls around it, each labeled:
Wall 1: "20年生态投资"
Wall 2: "框架优先支持(PyTorch/TensorFlow)"
Wall 3: "完整库生态(cuDNN/cuBLAS/NCCL)"
Wall 4: "400万人才储备"
Wall 5: "数月+$10万+转换成本"
The moat is drawn in green lines, the castle in dark lines.

BOTTOM — wide card with dark-to-green gradient:
Diagram: Small wireframe icons for AMD (small), Intel (smaller), Google TPU (medium) trying to cross the moat.
"唯一威胁：Google TPU（不需要CUDA + 44%成本优势）" (white, centered, bold)`
},

// ═══ SLIDE 17: NVIDIA vs Google ═══════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "决定性对决：NVIDIA vs Google"

TOP callout card (light orange):
Diagram: Two wireframe champion figures facing each other — LEFT in green (NVIDIA), RIGHT in blue (Google), with lightning bolts between them.
"Google是唯一在每个层面挑战NVIDIA的公司" (bold, centered)

MAIN — Clean comparison table, 6 rows, 4 columns:
Use alternating subtle row shading. Minimal thin separators, not heavy grid.

Header row (dark bg, bold, white text): 层级 | NVIDIA | Google挑战 | 威胁等级

Row 1: "训练芯片" | "B300/GB300主导" (green text) | "TPU v7成本低44%" (blue text) | Red filled circle
Row 2: "网络" | "NVLink, InfiniBand" (green) | "全光交叉9,216芯片" (blue) | Red circle
Row 3: "软件" | "CUDA 400万" (green) | "JAX+XLA无需CUDA" (blue) | Orange circle
Row 4: "世界模型" | "Isaac Nova" (green) | "Genie+Waymo数据" (blue) | Red circle
Row 5: "自动驾驶" | "DRIVE 40-50%" (green) | "Waymo全球领先" (blue) | Red circle
Row 6: "机器人" | "Isaac生态" (green) | "DeepMind RT-2" (blue) | Yellow circle

Each "威胁等级" cell has a small filled colored circle (red=high, orange=medium, yellow=low).
The table should feel clean and data-forward, with company colors making each column instantly recognizable.`
},

// ═══ SLIDE 18: 物理AI市场情景 ═════════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "2030物理AI市场情景"

THREE TALL SCENARIO CARDS side by side:

─── CARD 1: gradient (Google blue to Google green), white text ───
Diagram: Wireframe self-driving car + robot fleet spreading across a map, in white lines.
"情景A — Google主导" in large bold text
"概率: 30%" in medium bold text
Bullets: • Waymo授权OEM • 100万+ robotaxis • Android成为机器人OS
Bottom box (semi-transparent): "Google: 45% | NVIDIA: 30%"

─── CARD 2: gradient (NVIDIA green to Google green), white text ───
Diagram: Wireframe GPU fortress with CUDA shield, in white lines. Impenetrable walls.
"情景B — NVIDIA维持" in large bold text
"概率: 40%" in medium bold text
Bullets: • CUDA护城河坚固 • 人形机器人标准化Jetson • Waymo保持内部
Bottom box: "NVIDIA: 55% | Google: 20%"

─── CARD 3: gradient (medium gray to light gray), white text ───
Diagram: Wireframe fragmented map with different flags/icons in different regions, in white lines.
"情景C — 市场分化" in large bold text
"概率: 30%" in medium bold text
Bullets: • 无单一主导 • Waymo、Tesla、中国各自市场 • 多平台共存
Bottom box: "NVIDIA: 35% | Google: 25% | Tesla: 15%"

Equal card widths, generous spacing between them.`
},

// ═══ SLIDE 19: 能力对比矩阵 ══════════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "能力对比矩阵"

ONE CLEAN DATA TABLE spanning the full slide width. 7 rows × 5 columns with company-colored column headers:

Header row (black bg, white text):
"能力维度" | "Amazon" in Amazon orange | "Google" in Google blue | "Microsoft" in Microsoft blue | "NVIDIA" in NVIDIA green

Data rows (alternating subtle gray/white shading, light 300 weight text):

Row 1: "开发者智能体" | "★★★★ Claude Code" | "★★ Gemini弱" | "★★★★★ 42%份额" | "★★★ AgentIQ"
Row 2: "企业智能体" | "★★★★ AgentCore" | "★★★ NotebookLM" | "★★★★★ 1500万席" | "— 无"
Row 3: "物理AI" | "★★★ Zoox早期" | "★★★★★ Waymo" | "★ 少数股权" | "★★★★ 生态系统"
Row 4: "成本效率" | "★★★★ 30-40%" | "★★★★★ 44%" | "★★★ 30%" | "★★★ 基准线"
Row 5: "定制芯片" | "★★★★ 3代" | "★★★★★ 7代TPU" | "★★★ Maia延迟" | "★★★★★ B300"
Row 6: "生态触达" | "★★★★ AWS 31%" | "★★★★★ 30亿" | "★★★★★ 4亿" | "★★★★★ CUDA"

Stars (★) should be rendered in each company's accent color within their column.
Clean, generous cell padding, professional consulting table. The table is the main visual element — no additional diagrams needed.`
},

// ═══ SLIDE 20: 资本支出对比 ══════════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "2026资本支出对比"

MAIN — Four horizontal bar chart visualizations stacked vertically. Each bar is a rounded rectangle in the company's brand color, with company name on the left and $ amount on the right. Bar width proportional to value ($200B = full width):

Bar 1 (full width, Amazon orange):
LEFT: "Amazon" in bold white inside bar — RIGHT: "$200B" in large bold white
Below bar: "+50% YoY | AI数据中心、Trainium、Anthropic" (small, gray)

Bar 2 (~88% width, Google blue):
"Google" — "$175-185B"
Below: "~2× 2025 | TPU v7、全光网络" (small, gray)

Bar 3 (~75% width, Microsoft blue):
"Microsoft" — "~$150B"
Below: "+66% YoY | Azure AI、Maia 200" (small, gray)

Bar 4 (~10% width, short, NVIDIA green):
"NVIDIA" — "$2B+"
Below: "股权投资 | 新云网络(CoreWeave等)" (small, gray)

BOTTOM — large centered hero stat:
Diagram: Wireframe pile of dollar bills / investment tower, in gray lines.
"$700B+" in huge bold black
"2026年行业基础设施总投资" in standard light gray text
"5年复合增长率82% (新云细分)" in small lighter gray text`
},

// ═══ SLIDE 21: 企业选型框架 ══════════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "企业选型决策框架"

FOUR recommendation cards in 2×2 grid, each with gradient background and white text:

─── CARD 1 (gradient Microsoft blue to cyan) ───
Diagram: Wireframe Office document with Copilot sparkle, in white lines.
"生产力优先" in bold medium heading
"推荐：Microsoft M365 Copilot"
• 1500万席位验证 • 零摩擦采用 • 财富500强90%

─── CARD 2 (gradient Amazon dark navy to Amazon orange) ───
Diagram: Wireframe terminal/code editor with brain icon, in white lines.
"开发者优先" in bold medium heading
"推荐：Claude Code 或 GitHub Copilot"
• Claude最高自主性 • Copilot 42%份额

─── CARD 3 (gradient Google blue to Google green) ───
Diagram: Wireframe robotic arm + self-driving car, in white lines.
"物理运营" in bold medium heading
"推荐：Google Waymo 或 NVIDIA Isaac"
• Google最佳技术 • NVIDIA成熟生态

─── CARD 4 (gradient Google green to Google blue) ───
Diagram: Wireframe TPU chip with cost-down arrow, in white lines.
"成本优化" in bold medium heading
"推荐：Google Cloud TPU v7"
• 44%成本优势 • 9,216芯片Pod

Each card has its wireframe diagram in the top-right, text flows below. Clean grid, generous spacing.`
},

// ═══ SLIDE 22: 关键拐点时间线 ════════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "关键拐点时间线"

VERTICAL TIMELINE with colored left borders (4px wide) and wireframe milestone icons. Four time sections:

─── Section 1 — Google blue left border ───
Milestone icon: Wireframe robot holding a product, in blue
"2026: 物理AI产品年" in bold blue medium heading
Compact bullets: • Google I/O: 商业化DeepMind机器人 • Waymo 10-20城市 • NVIDIA Isaac Nova 2.0 • Zoox商业配送

─── Section 2 — NVIDIA green left border ───
Milestone icon: Wireframe chip die with "v8" label, in green
"2027: 定制芯片成熟年" in bold green medium heading
Compact bullets: • TPU v8 >60%成本优势 • Trainium4量产 • 定制芯片采用率40-50%

─── Section 3 — Amazon orange left border ───
Milestone icon: Wireframe IPO bell with car fleet, in orange
"2028: Waymo IPO / 市场验证" in bold orange medium heading
Compact bullets: • Waymo IPO $50-100B • 全球10万+ robotaxis • 人形机器人10万+

─── Section 4 — Microsoft blue left border ───
Milestone icon: Wireframe cityscape with autonomous vehicles, in blue
"2030: 物理AI市场成熟" in bold Microsoft blue medium heading
Compact bullets: • 100万+ robotaxis • 100万+机器人 • 市场$200-300B

Generous vertical spacing between sections. Each section has its wireframe icon to the left of the text.`
},

// ═══ SLIDE 23: 战略灰犀牛 ══════════════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "战略灰犀牛"

FOUR EVENT CARDS in 2×2 grid, each with gradient background and white text, each with a wireframe icon:

─── CARD 1 (gradient Google blue to Google green) ───
Icon: Wireframe car with Waymo sensor being handed to an OEM factory, white lines.
"Google授权Waymo Driver" in bold
"概率: 40%" in bold medium heading
"影响：NVIDIA失去30-40%自动驾驶市场" (light)

─── CARD 2 (gradient Amazon dark navy to Amazon orange) ───
Icon: Wireframe satellite with server rack in orbit around Earth, white lines.
"Amazon太空数据中心" in bold
"概率: 20%" in bold medium heading
"影响：AWS最便宜AI推理 竞争对手无法复制" (light)

─── CARD 3 (gradient Google red to Google yellow) ───
Icon: Wireframe OpenAI logo being absorbed into a larger entity, white lines.
"OpenAI被收购" in bold
"概率: 20%" in bold medium heading
"影响：改变整个竞争格局" (light)

─── CARD 4 (gradient dark red to bright red) ───
Icon: Wireframe gavel/hammer striking down on a robot, white lines.
"AI监管冲击" in bold
"概率: 40%" in bold medium heading
"影响：辅助型优于自主型 物理AI延迟2-5年" (light)

Each card is dramatic with its gradient and wireframe icon. Equal sizes, generous spacing.`
},

// ═══ SLIDE 24: 战略建议 ══════════════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "战略建议"

FOUR audience cards in 2×2 grid, each with light colored background and a wireframe icon:

─── CARD 1 (light blue tint) ───
Icon: Wireframe large enterprise building with multiple cloud connections, blue lines.
"大型企业" in bold Google blue medium heading
• 多云对冲：Google + Amazon + Microsoft
• 物理AI：与Google和NVIDIA双方接触
• 开发工具：试点Claude Code

─── CARD 2 (light orange tint) ───
Icon: Wireframe small office with single focused connection, orange lines.
"中小企业" in bold amber medium heading
• 选择与现有IT栈最契合的供应商
• Microsoft用户→全面Copilot
• 成本敏感→Google Cloud TPU

─── CARD 3 (light green tint) ───
Icon: Wireframe factory floor with robotic arms, green lines.
"制造/物流企业" in bold dark green medium heading
• 立即行动：NVIDIA Isaac平台
• 未来准备：与DeepMind建立关系
• 收集运营数据

─── CARD 4 (light purple tint) ───
Icon: Wireframe rocket launching from a small team, purple lines.
"AI原生初创" in bold purple medium heading
• 灵活性：Bedrock多模型
• 成本：Google TPU + NVIDIA推理
• 速度：Claude Code

BOTTOM — dark card (black bg, white text):
Three principles in company accent colors:
"必看现金流" in NVIDIA green | "必看物理AI" in Google blue | "必看生态成熟度" in Amazon orange`
},

// ═══ SLIDE 25: 五大关键洞察 ══════════════════════════════════════
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, black): "五大关键洞察"

FIVE insight cards stacked vertically, each with subtle gradient background and a small wireframe icon on the left edge:

─── Card 1 (light green gradient) ───
Icon: Wireframe 3D chess board with multiple pieces, in green.
"1. 竞争是多维度的" in bold dark green medium heading
"无单一赢家 每家在不同层面主导" in light standard body

─── Card 2 (light blue gradient) ───
Icon: Wireframe robot arm + self-driving car, in blue.
"2. 物理AI是决定性战场" in bold blue medium heading
"$200-300B市场 Google vs NVIDIA每层对决" in light standard body

─── Card 3 (light blue-teal gradient) ───
Icon: Wireframe full tech stack (chip→cloud→car→phone), in teal.
"3. Google是唯一全栈挑战者" in bold teal medium heading
"Waymo + TPU + DeepMind + Android 全层级覆盖" in light standard body

─── Card 4 (light orange gradient) ───
Icon: Wireframe rocket on launch pad with warning sign, in orange.
"4. Amazon $200B是最高风险/回报" in bold deep orange medium heading
"成功→$500B+价值 失败→仅5.6%容错空间" in light standard body

─── Card 5 (light purple gradient) ───
Icon: Wireframe Microsoft logo trapped in a glass box, in purple/blue.
"5. Microsoft的创新者困境" in bold dark blue medium heading
"1500万Copilot主导 但物理AI为零 智能体自主性差距扩大" in light standard body

Cards evenly spaced, uniform height, generous breathing room. The wireframe icons make each insight visually distinctive.`
},

// ═══ SLIDE 26: 结语 ══════════════════════════════════════════════
{
  style: "cover",
  prompt: `
TITLE (centered, large, bold, white):
"智能体AI竞赛不是'云战争2.0'" — very large, bold, white

Below (40px gap), a subtle dark card with faint green glow:
Diagram: Three wireframe arrows pointing in three dimensions — horizontal (→), vertical (↕), and forward (⚡) — forming a 3D axis system. Each arrow in a different company color.
"这是三维竞争" in large bold NVIDIA green

Below, THREE COLUMNS centered:

Column 1 — wireframe cloud/server cluster icon in Google blue:
"横向" in bold Google blue / "云基础设施 (AWS vs Azure vs GCP)" in light small text

Column 2 — wireframe rocket-to-ground full-stack icon in Amazon orange:
"纵向" in bold Amazon orange / "全栈整合 (太空到地面)" in light small text

Column 3 — wireframe robot + car icon in Microsoft blue:
"物理" in bold Microsoft blue / "自主机器 (机器人、自动驾驶)" in light small text

Below columns, subtle card:
"横向: Amazon AWS → Google TPU追赶" (light)
"纵向: Google 唯一全栈" (light)
"物理: Google vs NVIDIA 2026-2030决战" (light)

VERY BOTTOM: "2026年2月 | 战略洞察报告" in small gray text

The faint tech wiremarks from the cover slide should also be subtly visible in the background. Dramatic, cinematic, impactful.`
},

];

// ─── STYLE RESOLVER ─────────────────────────────────────────────────
function getStyle(tag) {
  switch(tag) {
    case "cover": return STYLE_COVER;
    case "amazon_dark": return STYLE_AMAZON_DARK;
    case "amazon_light": return STYLE_AMAZON_LIGHT;
    case "google": return STYLE_GOOGLE;
    case "microsoft": return STYLE_MICROSOFT;
    case "nvidia_dark": return STYLE_NVIDIA_DARK;
    case "nvidia_light": return STYLE_NVIDIA_LIGHT;
    case "overview": return STYLE_OVERVIEW;
    default: return STYLE_OVERVIEW;
  }
}

// ─── GENERATION ENGINE ──────────────────────────────────────────────
async function genSlide(ai, idx) {
  const s = slides[idx];
  const outFile = path.join(SLIDE_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);

  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`Cached: slide ${idx + 1}`);
    return outFile;
  }

  const prefix = getStyle(s.style);
  const fullPrompt = prefix + "\n\n" + s.prompt;

  for (let a = 1; a <= 3; a++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        config: {
          responseModalities: ["IMAGE", "TEXT"],
          imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
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

  const CONCURRENCY = 5;
  console.log(`Generating ${TOTAL} slides (${CONCURRENCY} parallel)...`);
  const paths = new Array(slides.length).fill(null);

  for (let batch = 0; batch < slides.length; batch += CONCURRENCY) {
    const tasks = [];
    for (let i = batch; i < Math.min(batch + CONCURRENCY, slides.length); i++) {
      tasks.push(genSlide(ai, i).then(p => { paths[i] = p; }));
    }
    await Promise.all(tasks);
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

  const outFile = "智能体AI基础设施竞赛.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${TOTAL} slides)`);
}

main().catch(err => console.error("Fatal:", err));
