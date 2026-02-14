const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-agentic-enterprise";
const SW = 13.333, SH = 7.5;

// ─── COLOR PALETTE ──────────────────────────────────────────────────
// Primary:   Deep purple #2D1B69
// Secondary: Vivid purple #7C3AED
// Accent:    Light purple #9B7FD4
// Positive:  Teal #00A99D (kept for contrast)
// Negative:  Coral #E8636F
// Dark BG:   #0F0A28 → #1A0F40
// Light BG:  #F8F5FC (pale lavender) → #EDE6F6
// Warm BG:   #FFF8F3 → #F8F0FF (peach-to-lavender gradient)

// ─── STYLE PREFIXES ─────────────────────────────────────────────────

const STYLE = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K — every detail crisp and sharp.

BACKGROUND: Pale lavender gradient (#F8F5FC → #EDE6F6). Soft, warm, premium feel — NOT cold white.

TYPOGRAPHY:
- English text: Manrope font (geometric modern sans-serif)
- Chinese text: Noto Sans SC font (clean Chinese sans-serif)
- Title: font-weight 700, 24pt, color #2D1B69 (deep purple), LEFT-ALIGNED. Title only — NO subtitle, NO footer, NO page number.
- Section headers: font-weight 700, 20-22pt, #2D1B69, LEFT-ALIGNED
- Body: font-weight 300, color #444444, 16-18pt, LEFT-ALIGNED
- Stat numbers: font-weight 700, Manrope, 48-64pt
- Keep English terms in English: SaaS, Claude Code, L1/L2/L3/L4/L5, Hands On, Feet Off, Eyes Off, Minds Off, Copilot, IDE, MCP, Skills, Rust, etc. Chinese for everything else.

ILLUSTRATION STYLE (CRITICAL — MOST IMPORTANT):
Every slide MUST have LARGE, DETAILED WIREFRAME illustrations that are PROMINENT — not tiny decorative icons.
- WIREFRAME LINE ART style — clean outlines, NO solid color fills, NO photo-realistic rendering
- Purple-gray line color (#7B6B8D to #9B7FD4), line weight ~1.5-2px
- Illustrations should be LARGE SCENE COMPOSITIONS occupying ~35-40% of the slide
- Detailed wireframe elements: monitors with visible screen content, server racks with individual drives, network graphs with labeled nodes, brain outlines with neural pathways, gear mechanisms with visible teeth
- Each card/section should have its own wireframe illustration — NOT text-only
- Think: McKinsey strategy deck concept illustrations but BIGGER and more detailed
- Labels in clean UPPERCASE Manrope text beside wireframe elements
- NO solid color fills, NO gradients on illustrations, NO wireframe effects — pure line art

LAYOUT:
- Illustrations are PROMINENT — each slide needs a large wireframe scene
- Cards: white background, thin purple left border (#7C3AED), FLAT — NO shadow. Completely flat boxes.
- 0.5" minimum margins. Breathing room.

Clean, institutional, authoritative. Detailed wireframe illustrations with purple-toned premium aesthetic.`;

const STYLE_WARM = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K — every detail crisp and sharp.

BACKGROUND: Warm gradient from soft peach (#FFF8F3) to pale lavender (#F8F0FF). A gentle warm-to-cool transition that feels inviting and premium.

TYPOGRAPHY:
- English text: Manrope font (geometric modern sans-serif)
- Chinese text: Noto Sans SC font (clean Chinese sans-serif)
- Title: font-weight 700, 24pt, color #2D1B69 (deep purple), LEFT-ALIGNED. Title only — NO subtitle, NO footer, NO page number.
- Section headers: font-weight 700, 20-22pt, #2D1B69, LEFT-ALIGNED
- Body: font-weight 300, color #444444, 16-18pt, LEFT-ALIGNED
- Stat numbers: font-weight 700, Manrope, 48-64pt
- Keep English terms in English.

ILLUSTRATION STYLE (CRITICAL):
Every slide MUST have LARGE, DETAILED WIREFRAME illustrations — NOT tiny icons.
- WIREFRAME LINE ART — clean outlines, NO solid fills, NO photo-realistic
- Purple-gray lines (#7B6B8D to #9B7FD4), ~1.5-2px weight
- Large scene compositions occupying ~35-40% of the slide
- NO solid color fills, NO gradients, NO wireframe effects — pure line art

LAYOUT:
- Illustrations are PROMINENT wireframe scenes
- Cards: white bg, thin purple left border (#7C3AED), FLAT.
- 0.5" minimum margins.

Warm, inviting, premium. Detailed wireframe illustrations.`;

const STYLE_COVER = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K — every detail crisp and sharp.

BACKGROUND: Light purple to blue gradient — from soft lavender (#E8DFF5) on the left to light corporate blue (#C5D5E8) on the right. Airy, detailed wireframe, premium. NOT dark.

TYPOGRAPHY:
- English text: Manrope font (geometric modern sans-serif)
- Chinese text: Noto Sans SC font (clean Chinese sans-serif)
- Title: font-weight 700, 36-40pt, color #2D1B69 (deep purple), CENTER-ALIGNED
- NO subtitle, NO footer, NO page number.

ILLUSTRATION STYLE:
- LARGE detailed WIREFRAME illustration at 15-20% opacity as atmospheric background
- Interconnected nodes, gear mechanisms, neural pathway outlines — all in wireframe line art
- Purple-gray lines (#9B7FD4), NO solid fills, NO gradients — pure clean outlines
- Elegant, premium — like a McKinsey annual report cover

Light, airy, premium. Atmospheric wireframe illustration behind title.`;

const STYLE_DATA = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K — every detail crisp and sharp.

BACKGROUND: Very light lavender (#FAFAFE) to pale purple (#F5F0FC). Clean, corporate, institutional.

TYPOGRAPHY:
- English text: Manrope font (geometric modern sans-serif)
- Chinese text: Noto Sans SC font (clean Chinese sans-serif)
- Title: font-weight 700, 24pt, color #2D1B69 (deep purple), LEFT-ALIGNED. Title only — NO subtitle, NO footer, NO page number.
- Table headers: font-weight 700, 14-16pt, white text on #2D1B69 background
- Table body: font-weight 300, 13-15pt, #444444
- Stat numbers: font-weight 700, Manrope, 48-64pt, #2D1B69 or teal (#00A99D)
- Keep English terms in English.

DATA DISPLAY STYLE:
- Tables: clean borders, alternating white/#F5F0FC rows, purple header row (#2D1B69)
- Stat callouts: large Manrope numbers with small Noto Sans SC labels below
- Cards with thin purple left border (#7C3AED), FLAT — NO shadow. Completely flat boxes.
- ALL boxes and cards must be FLAT.

ILLUSTRATION STYLE (CRITICAL):
Even data slides need PROMINENT WIREFRAME illustrations — detailed line art scene compositions (network diagrams, server racks, flow charts, brain outlines). NOT tiny icons. Each data slide should have at least one medium-to-large wireframe illustration element. NO solid fills, NO gradients — pure line art in purple-gray.

McKinsey data slide with detailed wireframe illustrations.`;

// ─── SLIDE PROMPTS ──────────────────────────────────────────────────
const slides = [

// ═══ SLIDE 1: COVER ═══
{
  style: "cover",
  prompt: `TITLE (center, bold, #2D1B69, Noto Sans SC, 40pt): "加速进化的AI智能体产业"

NO subtitle. NO additional text. Title only.

ILLUSTRATION (background, atmospheric, LARGE):
A large abstract wireframe illustration at 25-30% opacity filling the lower 60% of the slide. Multiple wireframe AI brain outlines/neural nodes in purple (#7C3AED) and teal (#00A99D) connected by detailed wireframe dotted lines. Abstract hexagonal grid and constellation patterns. Flowing curves suggesting acceleration and evolution. Soft detailed wireframe halos around key nodes. Wireframe line art style — rich, detailed, premium.

Light purple-to-blue gradient background (#E8DFF5 → #C5D5E8). Premium, airy. Like a Linux Foundation annual report cover.`
},

// ═══ SLIDE 2: 三万亿巨鲸陨落 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "三万亿巨鲸陨落"

LAYOUT: LEFT ~55% text content, RIGHT ~40% wireframe illustration. Apple Keynote whitespace. ALL boxes FLAT — no shadow, no 3D.

LEFT SIDE — 4 content blocks, stacked vertically with generous spacing:

BLOCK 1:
Large stat: "$3万亿" (Manrope, 56pt, #2D1B69)
Body (Noto Sans SC, 16pt, #444): "全球软件开发年产值"
"3000万开发者 × $10万/年 — a16z"

BLOCK 2:
Large stat: "$285B" (Manrope, 48pt, #E8636F)
Body: "单日市值蒸发 — Loss in Market Cap"
"2008年以来最大跌幅 · Largest Since 2008"

BLOCK 3:
Large stat: "$4,400亿" (Manrope, 40pt, #E8636F)
Body: "PE资产面临风险"
"Apollo Global Management: 'Software is Dead'"

BLOCK 4:
Body (16pt, #444):
"• ARK Invest: AI Agent = 新运营模式"
"• 价值从软件公司 → 基础设施提供商迁移"

RIGHT SIDE — LARGE wireframe illustration (takes full 40% width):
A dramatic descending whale shape made of disconnecting detailed wireframe NODES and fading connection beams in purple (#7C3AED → transparent). The whale dissolves into scattered neural network constellation points. Below the whale, new detailed wireframe SPROUTS and AI brain outlines (#00A99D teal glow) emerge upward — the "万物生长" metaphor. Gradient light trails connecting the new growth. Wireframe line art style with rich purple/teal fadings. Large, detailed scene — NOT a tiny sketch.`
},

// ═══ SLIDE 3: SaaS危机与座位压缩 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "SaaS危机与座位压缩"

LAYOUT: TOP ~60% text content in two columns. BOTTOM ~35% wireframe illustration strip. Apple Keynote whitespace. ALL boxes FLAT.

LEFT COLUMN (50%):
Header (20pt, bold, #2D1B69): "结构性重置"
Body (16pt, #444, Noto Sans SC):
"传统软件被视为'纯脑力劳动' — 轻资产、高毛利、无限可扩展。如今，轻资产属性成为最大脆弱性。"

"AI Agent直接替代人类角色，软件许可证面临座位压缩："

"• 1,000 许可证 → AI处理40% → 600 许可证"
"• 600 许可证 → AI达到80% → 200 许可证"

"8-12× 营收倍数模型面临崩塌 — 增长不再复合，而是收缩。"

RIGHT COLUMN (45%):
Header (20pt, bold, #2D1B69): "已在生产环境验证"

Card 1 (thin purple left border, FLAT):
"Salesforce Service Cloud" (bold, Manrope)
Stat: "-40%" (Manrope, 48pt, #E8636F)
"AI处理一线交互后许可证减少"

Card 2 (thin purple left border, FLAT):
"ServiceNow ITSM" (bold, Manrope)
Stat: "-50%" (Manrope, 48pt, #E8636F)
"日常事件由AI解决，人类IT员工减半"

BOTTOM — a PROMINENT illustration strip spanning the width:
A row of office desk/monitor wireframe illustrations on the left, progressively DISSOLVING and being replaced by detailed AI brain wireframe nodes on the right — visualizing the seat compression. Monitors fade from solid to transparent, AI brain outlines glow brighter from left to right. Purple (#7C3AED) to teal (#00A99D) dotted lines connecting the AI nodes. Wireframe line art style, rich and detailed.`
},

// ═══ SLIDE 4: SaaS末日 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "2026年2月 SaaSpocalypse"

LAYOUT: LEFT 30% — key stats. RIGHT 65% — crash table. Apple Keynote spacing. ALL boxes FLAT.

LEFT SIDE:

Large stat:
"$2,850亿" (Manrope, 56pt, #E8636F)
Label: "单日市值蒸发" (Noto Sans SC, 16pt, #444)

Below, 3 index stats stacked:
"S&P 软件 -6%" (Manrope, bold, 20pt, #E8636F)
"金融服务 -7%" (Manrope, bold, 20pt, #E8636F)
"Nasdaq-100 -2.4%" (Manrope, bold, 20pt, #E8636F)

Below stats, body text (14pt, #666):
"触发事件: Anthropic Claude Cowork 演示"
"Jeffrey Favuzza (Jefferies) 创造 'SaaSpocalypse' 一词"

Wireframe illustration accent: a descending chart line with scattered disconnecting wireframe nodes. Nodes dissolve from purple to transparent. Teal/coral fading trails.

RIGHT SIDE — DATA TABLE:
Purple header row (#2D1B69, white text, Manrope): "Company | Drop | Sector"

Table rows (alternating white/#F5F0FC, 14pt):
Gartner | -21% | 企业服务
LegalZoom | -20% | 法律
Thomson Reuters | -16% | 金融数据
Novo Nordisk | -15% | 医疗
RELX/LexisNexis | -14% | 法律
London Stock Exchange | -13% | 金融
WPP | -12% | 广告
CS Disco | -12% | 法律科技
Equifax | -12% | 数据
S&P Global | -11% | 金融
Intuit | -10% | 财务软件
Cognizant | -10% | IT服务

All percentage numbers in coral (#E8636F, Manrope bold).`
},

// ═══ SLIDE 5: AI收购策略 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "AI收购策略"

LAYOUT: TOP — formula. BOTTOM — 4 text blocks in 2×2 grid. Apple Keynote whitespace. ALL boxes FLAT.

TOP FORMULA (center, large, spanning ~80% width):
Three elements connected by "+" and "=" in Manrope bold:

[Wireframe sketch: brain/AI chip] "AI能力" (Noto Sans SC, 20pt, #2D1B69)
  +
[Wireframe sketch: people network] "客户基础" (Noto Sans SC, 20pt, #2D1B69)
  =
[Wireframe sketch: broadcast/distribution tower] "即时分发" (Noto Sans SC, 20pt, #00A99D)

The formula flows left to right. Each element is a LARGE wireframe illustration (~120px) with label below — wireframe AI brain orb, connected human network constellation, broadcasting tower with fading light beams. Connected by large "+" and "=" in Manrope 36pt #2D1B69. Rich purple/teal wireframe line art.

BOTTOM — 2×2 GRID of text blocks (generous spacing, thin purple left border, FLAT):

─── TOP-LEFT: "客户关系" (bold, 18pt, #2D1B69) ───
"即时获得企业入口"
"绕过18个月销售周期"
"案例: Salesforce 收购 Slack"

─── TOP-RIGHT: "分发渠道" (bold, 18pt, #2D1B69) ───
"现有客户触达能力"
"品牌信任转移"

─── BOTTOM-LEFT: "训练数据" (bold, 18pt, #2D1B69) ───
"客户使用数据 → AI模型优化"
"数据飞轮加速"

─── BOTTOM-RIGHT: "战略转变" (bold, 18pt, #2D1B69) ───
"护城河从产品 → 分发"
"技术被AI商品化，客户关系不可替代"`
},

// ═══ SLIDE 6: 从L2到L5 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "从L2到L5: Autonomous Coding Revolution"

LAYOUT: 5 horizontal level cards spanning full width, left to right. Each card is a vertical strip. Apple Keynote spacing. ALL cards FLAT — no shadow.

─── L1 (leftmost, lightest bg #FAF8FC) ───
Badge: "L1" (Manrope, bold, gray circle)
Label: "Code Completion" (Manrope, bold, 16pt, #888)
Chinese: "代码补全" (Noto Sans SC, 14pt, #666)
Metaphor: "Hands On" (Manrope, italic, 14pt, #999)
ILLUSTRATION: A keyboard with a small wireframe sparkle above keys — simple wireframe icon

─── L2 (bg #F0EDF5) ───
Badge: "L2" (Manrope, bold, light purple circle)
Label: "Copilot" (Manrope, bold, 16pt, #666)
Chinese: "AI辅助，人类主导" (14pt)
Metaphor: "Feet Off" (Manrope, italic, 14pt, #999)
ILLUSTRATION: A monitor screen with a small wireframe AI BRAIN OUTLINE floating beside it, emitting soft purple light beams toward the screen. Vector style.

─── L3 (bg #E8E0F0, HIGHLIGHTED — thin purple border on all sides #7C3AED) ───
Badge: "L3" (Manrope, bold, purple circle #7C3AED, 1.3× larger)
Label: "Claude Code" (Manrope, bold, 18pt, #2D1B69)
Chinese: "AI编写，人类用自然语言指导" (14pt)
Metaphor: "Eyes Off" (Manrope, italic, 14pt, #7C3AED)
ILLUSTRATION: A LARGE terminal/console screen with a large AI brain wireframe outline connected by detailed wireframe purple wireframe connection lines. Neural constellation patterns flow from the orb to the terminal. The most visually prominent card.
★ Below this card: "← WE ARE HERE" (Manrope, bold, 16pt, #00A99D) with arrow

─── L4 (bg #D5CCE5) ───
Badge: "L4" (Manrope, bold, dark purple circle)
Label: "Full Autonomy" (Manrope, bold, 16pt, #2D1B69)
Chinese: "AI构建完整应用，极少监督" (14pt)
Metaphor: "Minds Off" (Manrope, italic, 14pt)
ILLUSTRATION: A radiant AI brain ORB producing multiple app screens/documents autonomously, connected by teal light trails. Glowing production line concept.
Evidence: "Claude Cowork: 100% AI-built" (Manrope, 12pt, #00A99D)

─── L5 (rightmost, bg #1A0F40, white text) ───
Badge: "L5" (Manrope, bold, teal circle)
Label: "Human-Free" (Manrope, bold, 16pt, white)
Chinese: "完全自主AI软件开发" (14pt, #C4B5D9)
Metaphor: "Fully Autonomous" (Manrope, italic, 14pt, #C4B5D9)
ILLUSTRATION: A FULLY CONNECTED MESH of 5-6 detailed wireframe AI nodes with teal/purple wireframe connection beams between all nodes. Self-maintaining energy circulation. Ethereal, atmospheric. No human figures.

Bottom text (14pt, #666): "SWE-bench Verified: 80.9% · 连续自主运行 30+ 小时 · Claude Opus 4.5"`
},

// ═══ SLIDE 7: AGI的启示 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "AGI的启示：制造工具的工具"

LAYOUT: LEFT ~55% text. RIGHT ~40% wireframe illustration. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — text content:

Opening paragraph (16pt, #444, Noto Sans SC):
"人类智能的指数级分化，始于用工具制造工具的那一刻。两百万年来，这个递归循环只属于人类。Claude Code打破了这种独占性。"

Section header (18pt, bold, #2D1B69): "AGI的四个操作性特征"

4 numbered items with thin purple left border each (FLAT):

"1. Tool Generation — 按需创建自定义工具：脚本、工具、自动化流程"

"2. Tool Use — 执行bash命令、读取文件、编写代码、导航代码库"

"3. Feedback Integration — 从执行结果中学习，根据测试失败和错误调整策略"

"4. Self-Improvement — 使用数据持续反馈到模型训练，每一代比上一代更强"

Key insight box (thin teal left border, bg very light teal, FLAT):
"制造工具的工具 = AGI" (bold, 20pt, #2D1B69)
"六个月内自主操作增加116%" (Manrope, 16pt, #00A99D)

RIGHT SIDE — LARGE wireframe illustration (takes full 40% width):
An ascending spiral diagram with RICH VECTOR ILLUSTRATIONS at each level. At the bottom: a stone tool icon (simple, gray). Spiral upward through increasingly detailed wireframe tool icons — hammer → gear mechanism → computer monitor → AI BRAIN ORB. At the top: a detailed AI node creating another AI node — the recursive loop, connected by detailed wireframe teal/purple wireframe connection lines. Each level glows brighter than the last. The spiral itself is a fading from gray to vivid purple to teal. Soft detailed wireframe halos around the top nodes. Large, detailed, atmospheric scene.

Label at bottom: "石斧 → 空间站 → AI制造AI" (gray, 14pt)
Label at top: "Tools Creating Tools" (Manrope, italic, 14pt, #2D1B69)`
},

// ═══ SLIDE 8: Console Over IDE ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "Console Over IDE: 新界面范式"

LAYOUT: Two columns comparison. LEFT = old paradigm, RIGHT = new paradigm. Apple Keynote whitespace. ALL boxes FLAT.

LEFT COLUMN (45%) — card with thin gray left border (FLAT):
Header: "Traditional IDE" (Manrope, bold, 20pt, #888)
Chinese: "传统IDE模式" (Noto Sans SC, 14pt, #999)

ILLUSTRATION: A complex IDE window with multiple panels, tabs, file trees, toolbars — busy, cluttered. Gray/muted wireframe style with many small elements. Represents complexity.

5 attributes stacked (16pt, #444):
"Interface: GUI code-centric"
"Workflow: 人写代码，AI辅助"
"Lock-in: IDE-specific"
"Learning Curve: 陡峭"
"工具: Cursor, Windsurf"

Each attribute has a small "×" or neutral mark in gray.

RIGHT COLUMN (45%) — card with thin purple left border (#7C3AED, FLAT):
Header: "Claude Code Console" (Manrope, bold, 20pt, #2D1B69)
Chinese: "控制台模式" (Noto Sans SC, 14pt, #7C3AED)

ILLUSTRATION: A clean terminal window with a large AI brain wireframe outline connected to it by detailed wireframe purple wireframe connection lines. Neural constellation patterns flow from the orb. Elegant simplicity — minimal interface, powerful AI. Rich purple/teal wireframe style.

5 attributes stacked (16pt, #444):
"Interface: Terminal intent-centric"
"Workflow: 人描述意图，AI实现"
"Lock-in: Zero — 零锁定"
"Learning Curve: 平坦 (自然语言)"
"模式: Vibe Coding"

Each attribute has a small "✓" in teal (#00A99D).

BOTTOM — key metrics bar (14pt, Manrope, #2D1B69):
"自主操作 +116% · 人类轮次 -33% · PR吞吐量 +67%"`
},

// ═══ SLIDE 9: AI解锁万亿美元生产力 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "AI解锁万亿美元的软件生产力"

LAYOUT: LEFT 35% — headline stat + context. RIGHT 60% — evidence cards. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE:

Large stat:
"$3万亿" (Manrope, 64pt, #2D1B69)
Label: "增量GDP影响" (Noto Sans SC, 18pt, #444)
Below: "堪比工业革命的经济效应" (16pt, #666)

Wireframe illustration accent: a productivity curve with fading fill (purple to teal), trending sharply upward with a large AI brain wireframe outline at the inflection point emitting detailed wireframe beams. Rich wireframe style.

Body text (14pt, #444):
"顶级AI部署产生阶跃式提升，而非渐进改良。部署良好的AI编码系统至少将开发者生产力翻倍。"

RIGHT SIDE — 5 evidence cards stacked (thin purple left border each, FLAT, generous spacing):

─── CARD 1 ───
"a16z" (Manrope, bold, 16pt, #2D1B69)
"Best-of-breed部署: 2× 生产力提升" (14pt, #444)

─── CARD 2 ───
"Forrester TEI · Claude Code" (Manrope, bold, 16pt, #2D1B69)
Stat: "333% ROI" (Manrope, bold, 24pt, #00A99D)
"回收期不到六个月" (14pt, #444)

─── CARD 3 ───
"Anthropic内部" (bold, 16pt, #2D1B69)
"18人中9人实现 100%+ 生产力提升" (14pt, #444)

─── CARD 4 ───
"Palantir" (Manrope, bold, 16pt, #2D1B69)
"PR周转 +30% · 每周节省70工程小时" (14pt, #444)

─── CARD 5 ───
"战略转变" (bold, 16pt, #2D1B69)
"成本结构: 人头驱动 → 计算驱动" (14pt, #444)
"AI从助手变为软件的主要生产者" (14pt, #00A99D)`
},

// ═══ SLIDE 10: 智能体团队与递归开发循环 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "智能体团队与递归开发循环"

LAYOUT: LEFT ~50% text content. RIGHT ~45% wireframe illustration. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — text content:

Section header (18pt, bold, #2D1B69): "Agent Teams实验"

Card (thin purple left border, FLAT):
"16个并行Claude实例" (bold, Manrope)
"共享代码库，极少人类监督"
"产出: 完整C编译器 — 约100,000行Rust代码"
"成功编译Linux 6.9内核 (x86, ARM, RISC-V)"
Stats inline: "$20,000总成本 · ~2,000个会话" (Manrope, 16pt, #00A99D)

Section header (18pt, bold, #2D1B69): "递归开发飞轮"

4 metric rows (thin purple left border each, FLAT):
"自主工具调用 +116%" (Manrope bold, #00A99D) "每会话 9.8 → 21.2"
"人类轮次 -33%" (Manrope bold, #E8636F) "每会话 6.2 → 4.1"
"PR吞吐量 +67%" (Manrope bold, #00A99D)
"Claude占比 28% → 59%" (Manrope bold, #00A99D) "所有Anthropic工作"

Bottom text (14pt, #666): "Boris Cherny — 2025年12月单月 300+ PR"

RIGHT SIDE — LARGE wireframe illustration (takes full 45% width):
A recursive spiral/helix diagram with detailed wireframe NODES at each stage. At center: a bright AI BRAIN OUTLINE labeled "Claude Code v1". Spiral outward through increasingly detailed wireframe stages: "Claude Cowork" (brighter orb) → "Next-gen Tools" (constellation of orbs) → "Better Models" (radiant multi-node cluster). Each ring has dotted lines in purple (#7C3AED) → teal (#00A99D). Flowing energy beams show the recursive loop direction. At the bottom: a row of 16 small detailed wireframe TERMINAL NODES representing the parallel agents, connected by a mesh of faint purple beams. Purple-gray wireframe line art — atmospheric, detailed.`
},

// ═══ SLIDE 11: 原型优先革命 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "原型优先革命"

LAYOUT: TOP — before/after comparison. BOTTOM — role transformation table. Apple Keynote whitespace. ALL boxes FLAT.

TOP — Two-column comparison (generous spacing):

LEFT card (thin gray left border, FLAT, bg white):
Header: "旧模式" (18pt, bold, #888)
"写10页PRD"
"→ 开设计评审会"
"→ 获取利益相关者共识"
"→ 规划开发"
"→ 数周到数月交付"
ILLUSTRATION: A stack of documents with a clock icon, grayed out and fading. Muted wireframe style — represents the slow past.

RIGHT card (thin purple left border, FLAT, bg white):
Header: "原型优先" (18pt, bold, #2D1B69)
"几小时内构建可运行原型"
"→ 发给全公司试用"
"→ 基于真实使用数据迭代"
"→ 原型就是规格说明"
ILLUSTRATION: A running app screen with a detailed AI brain wireframe above it generating the interface in real-time. Luminous purple/teal sparkle trails. Vivid, energetic wireframe style — represents the fast new way.

Arrow between them: "→" (Manrope, 36pt, #7C3AED)

BOTTOM — Role transformation (6 rows, clean layout, thin purple left border on left side):

Header: "工程师角色升级" (18pt, bold, #2D1B69)

"键入代码 → 编写Spec和Prompt"
"逐行调试 → 审查AI输出"
"记忆API → 设计架构"
"手动测试 → 定义测试策略"
"独自编码 → 编排多个Agent"
"工具熟练度 → 系统思维"

Each row has a small "→" arrow in #7C3AED separating old from new.`
},

// ═══ SLIDE 12: 智能体软件工程架构五大支柱 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "智能体软件工程架构五大支柱"

LAYOUT: 5 pillar cards in a horizontal row, each as a vertical strip. Apple Keynote spacing. ALL cards FLAT — no shadow.

─── PILLAR 1 (thin purple left border, FLAT) ───
ILLUSTRATION: A detailed wireframe DOCUMENT icon with neural network gear overlay, emitting soft purple halo. Vector style.
Header: "CLAUDE.md" (Manrope, bold, 16pt, #2D1B69)
Body (14pt, #444):
"机器可读的项目记忆"
"跨会话持久存在"
"项目规则·代码规范·架构上下文"
Equivalents: "AGENTS.md · .cursorrules" (12pt, #888)

─── PILLAR 2 (thin purple left border, FLAT) ───
ILLUSTRATION: A command prompt with wireframe slash commands radiating outward like a starburst. Teal/purple wireframe connection lines.
Header: "Skills" (Manrope, bold, 16pt, #2D1B69)
Body (14pt, #444):
"按需可复用工作流"
"/deploy · /test · /review"
"可扩展·可共享·可组合"

─── PILLAR 3 (thin purple left border, FLAT) ───
ILLUSTRATION: A central detailed wireframe HUB NODE connected to multiple external service icons (GitHub, DB, tools) by detailed wireframe fading connection beams. Constellation pattern.
Header: "MCP" (Manrope, bold, 16pt, #2D1B69)
Body (14pt, #444):
"标准化外部工具连接"
"已捐赠Linux Foundation"
"GitHub · Jira · DB · 任何外部系统"

─── PILLAR 4 (thin purple left border, FLAT) ───
ILLUSTRATION: A large parent AI BRAIN OUTLINE at top spawning 4-5 smaller child orbs below, connected by cascading purple light trails. Parallel execution visualization.
Header: "Subagents" (Manrope, bold, 16pt, #2D1B69)
Body (14pt, #444):
"并行执行"
"父Agent生成多个子Agent"
"大幅减少实际耗时"

─── PILLAR 5 (thin purple left border, FLAT) ───
ILLUSTRATION: A lightning bolt emitting teal energy waves triggering cascading automation nodes. Event-driven chain reaction wireframe.
Header: "Hooks" (Manrope, bold, 16pt, #2D1B69)
Body (14pt, #444):
"事件驱动自动化"
"响应系统事件触发操作"
"持续集成和部署"

Bottom text (14pt, #666): "行业趋同: Anthropic · OpenAI · Google · GitHub · Cursor — 数月内独立收敛到相同架构"`
},

// ═══ SLIDE 13: 智能体软件工程手册 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "智能体软件工程手册：殊途同归"

LAYOUT: Two columns comparing Anthropic vs OpenAI methodology. Apple Keynote spacing. ALL boxes FLAT.

LEFT COLUMN (48%):
Header: "Anthropic方法" (Manrope, bold, 20pt, #2D1B69)
Subheader: "原型优先 + 自我改进飞轮" (14pt, #7C3AED)

6 numbered steps (thin purple left border each, FLAT, stacked):
"1. 试用工具，指定Agents Captain" (14pt, #444)
"2. 创建AGENTS.md — 机器可读项目手册" (14pt, #444)
"3. 使内部工具对Agent可访问" (14pt, #444)
"4. 为Agent优先重构代码库" (14pt, #444)
"5. Say No to Slop — 坚持人类审查标准" (14pt, #444)
"6. 建设可观测性基础设施" (14pt, #444)

RIGHT COLUMN (48%):
Header: "OpenAI方法" (Manrope, bold, 20pt, #2D1B69)
Subheader: "Agent as 首选工具" (14pt, #7C3AED)

6 numbered steps (thin purple left border each, FLAT, stacked):
"1. 通过Hackathon试用工具" (14pt, #444)
"2. 编写AGENTS.md" (14pt, #444)
"3. 盘点并使工具对Agent可用" (14pt, #444)
"4. 构建Agent优先代码库 + 快速测试" (14pt, #444)
"5. 坚持人类问责制 — Say No to Slop" (14pt, #444)
"6. 部署基础可观测性" (14pt, #444)

Case study (Manrope, 14pt, #00A99D):
"Sora Android: 4名工程师 · 18天 · 速度提升500%"

BOTTOM — key insight box (centered, thin teal left border, FLAT):
"2025年12月 Linux Foundation成立AAIF" (bold, 16pt, #2D1B69)
"Anthropic捐赠MCP · OpenAI捐赠AGENTS.md" (14pt, #444)
"竞争对手之间史无前例的合作 — 不是工具采用，而是组织变革" (14pt, #666)`
},

// ═══ SLIDE 14: 从手动社区到黑灯社区 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "从手动社区到黑灯社区：L0-L5框架"

LAYOUT: 6 level cards arranged as a 2×3 grid (2 columns, 3 rows). Each card is compact. Apple Keynote spacing. ALL cards FLAT.

─── ROW 1 ───

CARD L0 (bg white, thin gray left border, FLAT):
Badge: "L0" (Manrope, bold, gray circle)
ILLUSTRATION (LEFT 35%): A cluster of MONITOR SCREENS showing code terminals. Small human silhouettes gesture and point. A central figure slightly larger (the BDFL). Mailing envelopes flow between screens. Gray wireframe style.
Title: "手动社区" (bold, 16pt, #888)
"所有代码由人类编写和审查 · BDFL治理 · commit权即权力"

CARD L1 (bg white, thin purple-gray left border, FLAT):
Badge: "L1" (Manrope, bold, light purple circle)
ILLUSTRATION (LEFT 35%): A terminal monitor with a small detailed wireframe ORB (AI) floating beside it emitting soft purple light, sending document icons toward terminal. CI/CD pipeline as connected hexagons with green checkmarks. Light blue-purple wireframe.
Title: "辅助社区" (bold, 16pt, #666)
"AI辅助测试·文档·issue总结 · 人类审查一切"

─── ROW 2 ───

CARD L2 (bg #FAF8FC, thin purple left border, FLAT):
Badge: "L2" (Manrope, bold, purple circle)
ILLUSTRATION (LEFT 35%): A MONITOR and a detailed wireframe NEURAL CONSTELLATION (AI) at equal size, side by side. A prominent wireframe "AGENTS.md" document bridges them. Data streams flow both ways. Floating badges: "60K+" and "93万PR". Corporate purple/teal wireframe.
Title: "协作社区" (bold, 16pt, #2D1B69)
"AGENTS.md引导 · 93万+ Agent PR"
"瓶颈: 人类审查能力" (#E8636F)
★ "大多数项目目前处于此阶段" (bold, #7C3AED)

CARD L3 (bg #F0EDF5, thin purple left border, FLAT, subtle purple glow border):
Badge: "L3" (Manrope, bold, purple circle, 1.3× larger)
ILLUSTRATION (LEFT 35%): THREE concept icons in a row: (1) SHIELD icon with interconnected TRUST GRAPH nodes — teal lines for trusted, coral dashed for rejected; (2) AI BRAIN OUTLINE emitting scan beams onto document queue; (3) GATEWAY pillars with coral barrier. Rich wireframe style.
Title: "信任社区" (bold, 16pt, #2D1B69)
"信任网络 (Vouch) · 智能审查 · 准入策略"
"信任是自主的前提条件" (#00A99D)

─── ROW 3 ───

CARD L4 (bg #E8E0F0, thin purple left border, FLAT):
Badge: "L4" (Manrope, bold, dark purple circle)
ILLUSTRATION (LEFT 35%): A detailed DOCUMENT icon labeled "NLSpec" wireframe as source of truth → ARROW with energy sparks → AI WORKSPACE (orb producing code files) → RECYCLING symbol with old code dissolving. Mini-flow in wireframe style.
Title: "规范社区" (bold, 16pt, #2D1B69)
"NLSpec唯一真相 · Attractor: Markdown → 16K Rust + 9.5K Go + 6.7K TS"
"代码是临时的，规范是永恒的" (#7C3AED)

CARD L5 (bg DARK gradient #0A1628, white text, thin teal left border, FLAT):
Badge: "L5" (Manrope, bold, teal circle with pulsing glow)
ILLUSTRATION (LEFT 40%): DARK SPACE — 5-6 detailed wireframe AI NODES in a FULLY CONNECTED MESH. Teal/purple connection beams between all nodes. Nodes pulse with neural patterns. Energy circulates autonomously. One tiny faint human silhouette behind translucent barrier holding "价值观" scroll. Ethereal, atmospheric.
Title: "黑灯社区" (bold, 16pt, white)
"智能体自治 · 人类只定义价值观"
"从'谁写代码'到'谁定义价值观'" (#00A99D)`
},

// ═══ SLIDE 15: "不可能三角"被打破 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): ""不可能三角"被打破"

LAYOUT: LEFT ~50% — triangle diagram with wireframe. RIGHT ~45% — explanation text. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — LARGE triangle diagram with rich wireframe illustrations:

A large triangle with GRADIENT EDGES (purple #7C3AED).
Three vertices, each with a PROMINENT VECTOR ICON:
- TOP: "性能" (bold, 16pt, #2D1B69) with a detailed wireframe GEAR MECHANISM icon (purple fading)
- BOTTOM-LEFT: "可移植性" (bold, 16pt, #2D1B69) with MULTI-PLATFORM DEVICES icon (phone, laptop, server with connection beams)
- BOTTOM-RIGHT: "可用性" (bold, 16pt, #2D1B69) with USER FIGURE icon with intuitive interface elements

Inside triangle: "三选二" (18pt, #888, dashed)

Below: a second triangle with all three vertices as detailed wireframe TEAL ORBS (#00A99D), connected by thin connecting lines, with a detailed AI BRAIN ORB in the center emitting light rays to all three vertices.
Label: "AI: 三者兼得" (Manrope, bold, 18pt, #00A99D)

RIGHT SIDE — text content:

Section header (18pt, bold, #2D1B69): "传统权衡"

3 text blocks (thin gray left border each, FLAT):
"性能 + 可移植性 = 复杂代码，可用性差"
"可移植性 + 可用性 = 更高抽象，性能受损"
"性能 + 可用性 = 平台专用，失去可移植性"

Section header (18pt, bold, #2D1B69): "AI如何打破三角"

3 text blocks (thin purple left border each, FLAT):
"AI处理实现复杂性 → 性能优化" (#00A99D bullet)
"人类用自然语言表达意图 → 可用性" (#00A99D bullet)
"AI为每个目标平台生成特定代码 → 可移植性" (#00A99D bullet)

Key insight (16pt, bold, #2D1B69): "抽象层崩塌，硬件创新加速"`
},

// ═══ SLIDE 16: AI释放硬件 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "AI释放硬件：通用翻译器"

LAYOUT: LEFT ~55% text content. RIGHT ~40% wireframe stack diagram. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — text content:

Opening (16pt, #444):
"软件历史是不断攀升的抽象阶梯 — 从汇编到C到Java/Python。每一步提升可移植性和可用性，代价是性能。"

Section header (18pt, bold, #2D1B69): "AI消除人类认知限制"

3 key points (thin purple left border each, FLAT):

"端到端Rust — 从UI到驱动，不牺牲速度、安全性或可维护性"

"AI为每个目标生成平台特定实现 — 可移植性不再需要单一可复用代码库"

"CUDA 15年锁定被AI在分钟内打破 — 读取内核、识别意图、重写为HIP/ROCm或ARM NEON/SVE"

Highlight box (thin teal left border, bg very light teal, FLAT):
"ROCm突破" (bold, 16pt, #2D1B69)
"Claude Code在约30分钟内移植整个CUDA后端" (Manrope, 14pt, #00A99D)
"重写变成审查，成本下降数个数量级" (14pt, #444)

RIGHT SIDE — LARGE wireframe illustration (takes full 40% width):
A vertical stack diagram. TOP: tall stack of 8 layers labeled "传统" — each layer a COLORED GRADIENT RECTANGLE (progressively lighter purple). Many layers = visual complexity. BOTTOM: a much shorter stack of 4 layers labeled "AI原生" — each layer detailed wireframe TEAL. Between the two stacks: a detailed AI BRAIN ORB acting as "universal translator" bridge, emitting fading light beams (purple input → teal output). Neural constellation patterns surround the AI node. Purple-gray wireframe line art — atmospheric, detailed.`
},

// ═══ SLIDE 17: 用第一性原理重构抽象层设计 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "用第一性原理重构抽象层设计"

LAYOUT: Two columns comparison — PyTorch stack vs First Principles stack. Apple Keynote whitespace. ALL boxes FLAT.

LEFT COLUMN (45%) — card with thin gray left border (FLAT):
Header: "传统ML框架 (PyTorch)" (bold, 18pt, #888)

Stack diagram — 8 layers stacked vertically, each a GRADIENT RECTANGLE getting more opaque/heavy from top to bottom. Gray/muted palette showing bloat:
"用户应用" → "Python框架" → "Python运行时" → "CUDA Toolkit" → "cuDNN/cuBLAS" → "GPU驱动" → "操作系统" → "硬件"
Each layer labeled in 12pt gray. Many layers = visual weight and complexity.

Stats below:
"1,000+个包" (Manrope, bold, 14pt, #E8636F)
"通用内核设计"
"容器部署"

RIGHT COLUMN (45%) — card with thin purple left border (FLAT):
Header: "第一性原理 (flux2.c)" (bold, 18pt, #2D1B69)

Stack diagram — 4 layers only, each a CLEAN TEAL/PURPLE GRADIENT RECTANGLE — light, efficient:
"用户应用" → "纯C库" → "可选Metal/BLAS" → "硬件"
Each layer detailed wireframe with teal accent. Visually much lighter and simpler.

Stats below:
"零依赖" (Manrope, bold, 14pt, #00A99D) "— 仅C标准库"
"架构特定内核"
"单一二进制文件部署"

BOTTOM — key insight (centered, 16pt, #2D1B69):
"为人类便利层层抽象 vs 为硬件直接优化 — AI消除了前者的必要性"

Wireframe illustration accent: detailed wireframe scissors made of light beams cutting through abstraction layers, with dissolved layer fragments floating away. Purple/teal fading.`
},

// ═══ SLIDE 18: 案例研究OminiX-MLX (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "案例研究：OminiX-MLX"

LAYOUT: TOP 40% — comparison table. BOTTOM 55% — model support + stats. Apple Keynote spacing. ALL boxes FLAT.

TOP — Comparison table:
Purple header row (#2D1B69, white text, Manrope): "维度 | OminiX-MLX | 传统Python MLX"

Table rows (alternating white/#F5F0FC, 14pt):
语言 | 纯Rust (83.7%) | Python + C++绑定
架构 | 统一所有模态 | 碎片化独立项目
开发时间 | 数周 | 数年社区投入
封装 | MLX之上的薄Rust封装 | 多层Python封装
并行 | Rust真正并行 | Python GIL限制
类型安全 | 编译时 | 运行时错误
依赖 | Cargo.toml可复现 | 依赖地狱

BOTTOM LEFT — Supported Models (thin purple left border, FLAT):
Header: "支持的模型" (bold, 16pt, #2D1B69)

4 categories:
"LLM" (Manrope, bold, #7C3AED): "Qwen3 · GLM4 · Mixtral · Mistral"
"ASR" (Manrope, bold, #7C3AED): "FunASR Paraformer · FunASR-Nano"
"TTS" (Manrope, bold, #7C3AED): "GPT-SoVITS语音克隆"
"图像" (Manrope, bold, #7C3AED): "FLUX.2-klein · Z-Image · Qwen"

BOTTOM RIGHT — Key stat:
"Apple MLX上的纯Rust实现" (Manrope, bold, 20pt, #2D1B69)
"涵盖LLM · ASR · TTS · 图像生成" (16pt, #444)
"数周构建 vs 数年的Python碎片化" (14pt, #00A99D)

Wireframe illustration accent: detailed wireframe Apple chip icon with Rust crab gear logo, connected by detailed wireframe circuit traces. Purple/teal fading wireframe style.`
},

// ═══ SLIDE 19: Rust：AI时代的编程语言 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "Rust：AI时代的编程语言"

LAYOUT: LEFT ~55% text content. RIGHT ~40% wireframe illustration. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — text content:

Stat callout (large):
"70%" (Manrope, 56pt, #E8636F)
"关键安全漏洞与内存相关" (Noto Sans SC, 16pt, #444)
"操作系统和核心基础设施中" (14pt, #666)

Section header (18pt, bold, #2D1B69): "为什么是Rust"

3 key points (thin purple left border each, FLAT):
"编译时内存和并发安全 — 从设计上消除70%漏洞"
"匹配C/C++的性能 — 零成本抽象"
"AI消除学习曲线 — 规模化生成和维护Rust代码库"

Section header (18pt, bold, #2D1B69): "行业趋同"

2 key quotes (thin teal left border each, FLAT):
"美国国防部: 倡导Rust用于关键系统" (14pt, #444)
"Microsoft Galen Hunt: 目标2030年消除所有C/C++" (14pt, #444)
"由AI规模代码生成赋能" (14pt, #00A99D)

Bottom text (14pt, #666): "结构性转变: 遗留C/C++系统被AI系统性用Rust重写"

RIGHT SIDE — LARGE wireframe illustration (takes full 40% width):
A detailed SHIELD with Rust crab gear logo inside, wireframe with teal (#00A99D) protective aura. Around the shield: CROSSED-OUT BUG ICONS in coral (#E8636F) representing eliminated vulnerabilities — each bug dissolves into particles. Below: a timeline arrow with fading from gray (C/C++ 1972) through muted blue (Java/Python) to detailed wireframe TEAL (Rust + AI 2026) with progressively brighter security shield indicators at each stage. Purple-gray wireframe line art — prominent, detailed.`
},

// ═══ SLIDE 20: 终端生态迎来重置时刻 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "终端生态迎来重置时刻"

LAYOUT: LEFT ~50% text content. RIGHT ~45% wireframe illustration. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — text content:

Opening (16pt, #444):
"用户只使用应用10-20%的功能，其余消耗存储和认知注意力。AI从根本上改变了这一模式。"

Section header (18pt, bold, #2D1B69): "AI原生终端"

3 key points (thin purple left border each, FLAT):
"软件围绕个人需求深度个性化、动态组合"
"大模型公司追求垂直整合 — 控制用户数据和交互界面至关重要"
"拥有设备层成为战略不可回避的选择"

Section header (18pt, bold, #2D1B69): "HarmonyOS的机遇"

3 key points (thin purple left border each, FLAT):
"内核安全: 关键C/C++模块用内存安全语言重写"
"应用层: 美团/携程每年数亿维护成本 — AI改变计算公式"
"新编程语言 + AI原生框架 — 跨越式发展而非追赶"

Key insight (16pt, bold, #2D1B69): "技术债务 → 罕见的重置时刻"

RIGHT SIDE — LARGE wireframe illustration (takes full 45% width):
A phone/device in wireframe style. LEFT HALF shows a cluttered app grid (many identical gray squares — boring, generic). RIGHT HALF shows the same device TRANSFORMED with a clean, dynamic interface — fewer elements, each detailed wireframe with personalized teal/purple accent colors. A detailed AI BRAIN ORB sits above the device, emitting thin connecting lines connecting to each personalized element. Neural constellation patterns flow from orb to device. Label: "一刀切 → 深度个性化". Purple-gray wireframe line art — vivid transformation visual.`
},

// ═══ SLIDE 21: A2UI ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "A2UI：应用孤岛的终结"

LAYOUT: TOP ~35% — flow diagram. BOTTOM ~55% — comparison + explanation. Apple Keynote whitespace. ALL boxes FLAT.

TOP — A2UI workflow as horizontal flow (RICH VECTOR):
5 connected ILLUSTRATED NODES with dotted line arrows between:
"用户意图" (speech bubble icon) → "AI Agent" (detailed AI brain wireframe) → "A2UI消息" (JSON document with teal glow) → "客户端渲染器" (device screen icon) → "原生组件" (polished app interface)
Each node is a DETAILED wireframe illustration with label below. Gradient light trail arrows in purple (#7C3AED) → teal (#00A99D). Rich, atmospheric flow diagram.

BOTTOM — Two-column comparison:

LEFT card (thin gray left border, FLAT):
Header: "传统应用" (bold, 18pt, #888)
"静态一刀切界面"
"数月工程开发"
"应用商店部署"
"代码执行风险"
"每个平台单独构建"

RIGHT card (thin purple left border, FLAT):
Header: "A2UI" (Manrope, bold, 18pt, #2D1B69)
"动态个性化界面"
"秒级AI生成"
"实时流式传输"
"声明式安全"
"一次响应全平台原生"

Each A2UI attribute has a small "✓" in teal (#00A99D).

Bottom text (16pt, bold, #2D1B69): "Google A2UI: 每个人获得自己独特的应用 — 而非十亿人一个应用"`
},

// ═══ SLIDE 22: OpenClaw — AI原生操作系统 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "OpenClaw：AI原生操作系统的雏形"

LAYOUT: LEFT ~50% text + stats. RIGHT ~45% LARGE wireframe illustration. ALL boxes FLAT.

LEFT SIDE — text content:

Stats row (3 large stats in horizontal strip):
"150K+" (Manrope, 40pt, #2D1B69) label: "GitHub Stars"
"5,700+" (Manrope, 40pt, #00A99D) label: "ClawHub Skills"
"900+" (Manrope, 40pt, #7C3AED) label: "Contributors"
Small text: "9K → 60K stars in days · 一周200万访客" (14pt, #666)

Section header (18pt, bold, #2D1B69): "不是工具，是操作系统"

3 key points (thin purple left border each, FLAT):
"Skills生态 — ClawHub取代App Store，5,700+可复用Agent工作流"
"全平台覆盖 — iMessage · WhatsApp · Telegram · Slack · Discord · Signal"
"Moltbook — Agent社交网络，用户的AI Agent自主发帖和互动"

Section header (18pt, bold, #2D1B69): "Peter Steinberger与新型领袖"

Card (thin purple left border, FLAT):
"创始人: 奥地利工程师，PSPDFKit创始人" (14pt, #444)
"批评者称其'Claude Code wrapper' — 但真正创新在于iOS深度集成和社区构建" (14pt, #444)
"名称传奇: Clawdbot → Moltbot → OpenClaw" (14pt, #666)
"每次更名都成为病毒式营销事件 — 个人开发者 vs AI巨头的叙事" (14pt, #7C3AED)

Key insight (bold, 16pt, #2D1B69): "当技术不再稀缺，社区构建和文化叙事成为新护城河"

RIGHT SIDE — LARGE wireframe illustration (takes full 45% width):
A multi-layered AI-native OS concept in wireframe line art. At the CENTER: a large AI brain wireframe outline representing OpenClaw's core. AROUND it: orbiting PLATFORM ICONS as wireframe outlines — iMessage bubble, WhatsApp, Telegram, Slack, Discord — each connected to center by thin dotted lines. ABOVE: a dense constellation of small wireframe skill nodes labeled "ClawHub 5,700+". BELOW: a mesh of interconnected smaller node outlines (Moltbook — agents talking to agents). The composition suggests an OS layer above all platforms. Purple-gray (#7B6B8D) wireframe line art, detailed, large — NO solid fills.`
},

// ═══ SLIDE 23: 规模化提速 (was 22) (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "规模化提速：生产环境中的AI编程"

LAYOUT: 6 company cards in a 2×3 grid. Each card has company name, key stat, and brief description. Apple Keynote spacing. ALL cards FLAT.

─── ROW 1 ───

CARD 1 (thin purple left border, FLAT):
"Meta" (Manrope, bold, 18pt, #2D1B69)
Stat: "Think 5X" (Manrope, bold, 32pt, #7C3AED)
"VP Vishal Shah指令: 速度提升500%"
"2026年前 >50% AI生成代码 · CodeCompose" (14pt, #444)

CARD 2 (thin purple left border, FLAT):
"Google" (Manrope, bold, 18pt, #2D1B69)
Stat: ">25%" (Manrope, bold, 32pt, #00A99D)
"所有新代码由AI生成并经人工审查"
"截至2024年底" (14pt, #666)

─── ROW 2 ───

CARD 3 (thin purple left border, FLAT):
"ByteDance" (Manrope, bold, 18pt, #2D1B69)
Stat: "90%" (Manrope, bold, 32pt, #7C3AED)
"工程师使用内部工具Trae"
"抖音本地生活40%代码由AI编写" (14pt, #444)

CARD 4 (thin purple left border, FLAT):
"Tencent" (Manrope, bold, 18pt, #2D1B69)
Stat: ">50%" (Manrope, bold, 32pt, #00A99D)
"新代码由AI生成"
"编码时间减少40%" (14pt, #444)

─── ROW 3 ───

CARD 5 (thin purple left border, FLAT):
"Amazon" (Manrope, bold, 18pt, #2D1B69)
Stat: "4,500" (Manrope, bold, 32pt, #7C3AED)
"开发者年节省 ($2.6亿)"
"Q Developer升级Java应用" (14pt, #444)

CARD 6 (thin purple left border, FLAT):
"NVIDIA" (Manrope, bold, 18pt, #2D1B69)
Stat: "97.4%" (Manrope, bold, 32pt, #00A99D)
"ChipAgents Verilog代码准确率"
"下一代GPU设计" (14pt, #444)`
},

// ═══ SLIDE 23: 价值转移 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "价值转移："一鲸落万物生""

LAYOUT: LEFT ~50% — value shift diagram. RIGHT ~45% — text content. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — LARGE wireframe diagram (takes full 50% width):
A value flow diagram with RICH VECTOR ILLUSTRATIONS.

TOP section "传统模式" (gray label):
"软件公司" — a LARGE PROMINENT BUILDING icon with golden glow (70-90% margin)
"基础设施" — a small, muted server rack icon

DRAMATIC ARROW labeled "AI转变" pointing downward — fading from purple to teal, with energy particles

BOTTOM section "AI原生模式" (purple label):
"软件" — a SMALL, FADING, dissolving code icon (near-zero cost)
"基础设施" — a LARGE detailed DATA CENTER with detailed wireframe TEAL AURA, server racks, energy beams (captures value)

A detailed wireframe WHALE SILHOUETTE descending between the two sections, dissolving into constellation particles. Below: NEW detailed wireframe AI SPROUTS/NODES rising upward with teal light trails — the "鲸落万物生" metaphor. Atmospheric, dramatic.

RIGHT SIDE — text content:

Section header (18pt, bold, #2D1B69): "结构性迁移"

4 comparison rows (thin purple left border each, FLAT):
"毛利: 70-90% → 接近零" (14pt, stat in #E8636F)
"价值捕获: 代码/IP → 计算/基础设施" (14pt)
"护城河: 功能差异化 → 硬件 + 数据" (14pt)
"成本结构: 人类工资 → 基础设施成本" (14pt)

Section header (18pt, bold, #2D1B69): "36氪战略展望"

3 key points (thin teal left border, FLAT):
"基础设施提供商成为新巨头"
"能源和计算成为战略资源"
"软件开发能力: 人类工资成本 → 基础设施成本"`
},

// ═══ SLIDE 24: 超级智能体企业 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "垂直整合的超级智能体企业"

LAYOUT: LEFT ~55% text. RIGHT ~40% wireframe illustration. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — text content:

Opening (16pt, #444):
"AI将软件从瓶颈中移除 — 新硬件存在后，AI可在数小时内适配和优化代码。"

Section header (18pt, bold, #2D1B69): "数据飞轮"

Flow text (16pt, #444):
"更多数据 → 更好模型 → 更复杂任务 → 更多数据"
"芯片·网络·数据中心·模型·应用紧密集成"

Section header (18pt, bold, #2D1B69): "三个范例"

Card 1 (thin purple left border, FLAT):
"Google" (Manrope, bold, 16pt, #2D1B69)
"TPU + 超大规模数据中心 + OCS光网络 + Gemini 3 + 终端应用"
"闭环控制 → 溢价估值" (14pt, #00A99D)

Card 2 (thin purple left border, FLAT):
"xAI" (Manrope, bold, 16pt, #2D1B69)
"物理基础设施 + 电力 + 迭代速度"
"通过Macrohard延伸至企业软件" (14pt, #444)

Card 3 (thin gray left border, FLAT):
"Apple" (Manrope, bold, 16pt, #888)
"反面案例: 无基础模型或数据中心控制"
"被迫依赖外部供应商，让渡战略自主权" (14pt, #E8636F)

Key insight (16pt, bold, #2D1B69): "不完整的栈会掉队 — 控制飞轮定义赢家"

RIGHT SIDE — LARGE wireframe illustration (takes full 40% width):
A vertical integration stack with RICH ILLUSTRATIONS. From bottom to top: "能源/电力" (power plant icon with energy waves) → "数据中心" (server racks with blue glow) → "芯片/GPU" (chip icon with circuit traces) → "网络" (connected nodes with light beams) → "模型" (AI brain orb) → "应用" (app screens). Each layer is a DETAILED VECTOR ILLUSTRATION strip with fading backgrounds getting brighter toward the top. A large CIRCULAR FLYWHEEL ARROW wraps around the entire stack in wireframe purple (#7C3AED) fading. Google and xAI labels near the top with teal highlight. Apple label at the side with "?" in coral. Purple-gray wireframe line art.`
},

// ═══ SLIDE 25: Macrohard ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "Macrohard：数字员工时代"

LAYOUT: LEFT ~55% text. RIGHT ~40% wireframe illustration. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — text content:

Opening (16pt, #444):
"Elon Musk的Macrohard: 纯AI原生软件公司。基于第一性原理构建，锚定物理基础设施而非算法。"

Section header (18pt, bold, #2D1B69): "核心论点"

3 key points (thin purple left border each, FLAT):
"算法不可避免地趋同 — 持久护城河在计算、能源和迭代速度"
"Colossus: 世界首个吉瓦级AI数据中心"
"真正瓶颈: 燃气轮机·变压器·变电站·电网 — 比芯片更稀缺"

Section header (18pt, bold, #2D1B69): "运营模式"

Card (thin teal left border, FLAT):
"AI Agent编写软件"
"其他Agent模拟人类使用"
"反馈循环在封闭数字环境中持续运行"
"产品以机器速度收敛" (14pt, #00A99D)

Stats (Manrope, 14pt):
"成本 -70% · 上市时间 -40% · 零人类开发者" (#00A99D)

Bottom text (14pt, #666): "竞争不可逆转地从软件抽象转向物理现实"

RIGHT SIDE — LARGE wireframe illustration (takes full 40% width):
A DRAMATIC dark factory scene: a data center building silhouette with detailed wireframe AI NODES inside (5-6 detailed wireframe orbs working autonomously — no human figures). Power lines and energy infrastructure connect below with electric GRADIENT BEAMS. Software output flows upward as detailed wireframe data streams in teal. The building pulses with internal purple/teal glow — "lights out" but alive with AI activity. Below: a small comparison — old model (tiny human figures at desks) vs new Macrohard model (zero humans, only radiant AI brain outlines). Purple-gray wireframe line art — detailed, large.`
},

// ═══ SLIDE 26: 人机协同Palantir ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "人机协同：Palantir方法论"

LAYOUT: LEFT ~50% text. RIGHT ~45% stats + wireframe. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — text content:

Opening (16pt, #444):
"并非所有软件都能100% AI驱动。复杂、高风险行业中，不可替代的价值在于深度领域知识和可信赖的客户关系。"

Section header (18pt, bold, #2D1B69): "FDE模式"

Card (thin purple left border, FLAT):
"Forward Deployed Engineer" (Manrope, bold, 16pt)
"工程师直接嵌入客户现场"
"深入理解真实运营工作流"
"起源: 美国国防/情报 — 数据不能离开安全环境"

Section header (18pt, bold, #2D1B69): "AI增强FDE"

Card (thin teal left border, FLAT):
"人类专家: 领域洞察 + 问题框架"
"AI: 加速方案设计、迭代和定制"
"AI FDE (2025.11): 通过自然语言操作Foundry"
"花旗银行: 部署从九天 → 秒级" (Manrope, 14pt, #00A99D)

RIGHT SIDE:

Stats block (large, stacked):
"$10亿" (Manrope, 48pt, #2D1B69)
"2025 Q2营收" (14pt, #444)

"93%" (Manrope, 48pt, #00A99D)
"美国商业增长 YoY" (14pt, #444)

"800-1000%" (Manrope, 36pt, #7C3AED)
"FDE岗位发布增长" (14pt, #444)

Below stats — RICH wireframe illustration:
A Venn diagram with GRADIENT FILLS: LEFT circle in warm purple (#7C3AED with soft glow) labeled "人类洞察" with a small human silhouette inside + RIGHT circle in teal (#00A99D with detailed wireframe halo) labeled "AI速度" with an AI brain outline inside → overlapping area GLOWS BRIGHTLY labeled "FDE" where human and AI energy merge. Gradient light trails radiate from the overlap. Wireframe line art style.

Bottom text (14pt, #666): "未来二分化: 完全自主 (低风险) vs 人机混合 (复杂企业)"`
},

// ═══ SLIDE 27: 主权AI ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "主权AI：国家级超级垂直技术栈"

LAYOUT: LEFT ~55% text content. RIGHT ~40% wireframe map illustration. Apple Keynote whitespace. ALL boxes FLAT.

LEFT SIDE — text content:

Opening (16pt, #444):
"每个国家越来越需要自己的数字和AI基础设施。AI编码从根本上改变了主权软件能力的等式。"

Section header (18pt, bold, #2D1B69): "数字主权的新可能"

3 key points (thin purple left border each, FLAT):
"欧盟: 公民数据存储在美国云平台 = 结构性隐私风险"
"历史约束: 缺乏本土超大规模平台和运营专长"
"AI转变: 有意志和计算资源 → 可行成本和速度构建主权平台"

Section header (18pt, bold, #2D1B69): "全球趋势"

3 key points (thin teal left border each, FLAT):
"拉丁美洲·中东·东南亚: AI = 工业革命规模机遇"
"限制因素不再是软件能力，而是基础设施"
"国家可部署AI Agent构建和维护自己的数字生态系统"

Key insight box (bold, 16pt, #2D1B69):
"数字主权: 技术可行 · 经济可持续 · 越来越不可回避"

RIGHT SIDE — LARGE wireframe illustration (takes full 40% width):
A stylized world map with detailed wireframe HIGHLIGHTED REGIONS — EU (purple glow), Middle East (teal glow), Southeast Asia (teal glow), Latin America (purple glow) — each with a small detailed wireframe SOVEREIGNTY STACK icon (flag + server + AI brain outline emitting light). Gradient light trail CONNECTIONS from each region to its own independent stack. A larger dominant stack at center with US/China labels and brighter glow. The concept: fragmentation visualized as separate detailed wireframe clusters emerging from one global cloud. Purple-gray wireframe line art, detailed.`
},

// ═══ SLIDE 28: 标准颠覆 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #2D1B69, Noto Sans SC, 24pt): "标准颠覆：MCP已死，Skills万岁"

LAYOUT: TOP ~55% — comparison. BOTTOM ~40% — strategic outlook. Apple Keynote whitespace. ALL boxes FLAT.

TOP — Two-column comparison:

LEFT card (thin gray left border, FLAT):
Header: "MCP (旧范式)" (bold, 18pt, #888)
Subheader: "AI作为助手 (L2)" (14pt, #999)

4 attributes stacked:
"思维方式: AI辅助人类" (14pt, #444)
"方法: AI调用传统API" (14pt, #444)
"范式: 现有软件的包装层" (14pt, #444)
"趋势: 衰退 ↓" (14pt, #E8636F)

ILLUSTRATION: A traditional API endpoint icon with adapter wrapper layers — gray/muted wireframe, fading, stale-looking.

RIGHT card (thin purple left border, FLAT):
Header: "Skills (新范式)" (bold, 18pt, #2D1B69)
Subheader: "AI作为开发者 (L3/L4)" (14pt, #7C3AED)

4 attributes stacked:
"思维方式: AI自主编写代码" (14pt, #444)
"方法: AI直接编写实现" (14pt, #444)
"范式: 原生Agent能力" (14pt, #444)
"趋势: 上升 ↑" (14pt, #00A99D)

ILLUSTRATION: A detailed AI brain wireframe directly producing code on a terminal screen, surrounded by detailed wireframe skill nodes (/deploy, /test, /review) radiating outward like a constellation. Purple/teal fading, vivid and energetic wireframe style.

Arrow between: "→" (Manrope, 36pt, #7C3AED)

BOTTOM — Strategic outlook (thin purple left border, FLAT):
Header: "a16z洞察" (Manrope, bold, 16pt, #2D1B69)
"Agent原生基础设施成为标配"
"记录系统让位于动态Agent层"
"控制Agent层 = 控制生态" (bold, 14pt, #00A99D)
"传统软件API被商品化，新Agent原生协议涌现"`
},

// ═══ SLIDE 29: 智能体时代的必然 (CONCLUSION COVER) ═══
{
  style: "cover",
  prompt: `TITLE (center, bold, #2D1B69, Noto Sans SC, 36pt): "智能体时代的必然"

SUBTITLE (center, below title, 18pt, #444): "软件产业不是在消亡 — 它正在重生"

NO footer, NO page number.

ILLUSTRATION (background, atmospheric, LARGE — fills lower 60%):
A rich abstract wireframe illustration at 25-30% opacity. The whale falling motif — a detailed wireframe WHALE SILHOUETTE descending through connected technology constellation nodes, dissolving into particles of light. Below the whale, a FLOURISHING ECOSYSTEM of wireframe AI brain outlines, teal neural pathway sprouts, constellation patterns, and fading energy trails growing upward. Soft detailed wireframe halos around key nodes. The composition conveys transformation — death becomes rebirth. Purple-gray wireframe line art.

CENTER-BOTTOM — 5 strategic priorities in a horizontal row (each a small labeled wireframe icon, 14pt, #2D1B69):
"L3/L4 AI编码" · "Agent原生重建" · "垂直整合" · "人机混合FDE" · "主权AI"

BOTTOM quote (center, italic, 14pt, #666):
"唯一真正的问题是：你是塑造变革的人，还是被变革塑造的人。"

Light purple-to-blue gradient background (#E8DFF5 → #C5D5E8). Premium, airy. Like a McKinsey conclusion slide — strong closure with clear call to action.`
},

];

// ─── STYLE RESOLVER ─────────────────────────────────────────────────
function getStyle(tag) {
  switch(tag) {
    case "cover": return STYLE_COVER;
    case "data":  return STYLE_DATA;
    case "warm":  return STYLE_WARM;
    default:      return STYLE;
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

  const CONCURRENCY = 10;
  console.log(`Generating ${slides.length} slides at 4K (${CONCURRENCY} parallel)...`);
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

  const outFile = "加速进化的AI智能体产业.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${slides.length} slides)`);
}

main().catch(err => console.error("Fatal:", err));
