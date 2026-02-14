const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-agentic-enterprise-huawei";
const SW = 13.333, SH = 7.5;

// ─── HUAWEI COLOR PALETTE ──────────────────────────────────────────
// Primary:   Huawei Red #C7000B
// Secondary: Deep Black #1A1A1A
// Accent:    Warm Gold #D4A843
// Tech:      Huawei Blue #0077B6
// Positive:  Teal #00A99D
// Negative:  Coral #E8636F
// Light BG:  #FFFFFF → #F5F3F0 (warm white)
// Dark BG:   #1A1A1A → #0D0D0D (deep black)

// ─── STYLE PREFIXES ─────────────────────────────────────────────────

const STYLE = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K — every detail crisp and sharp.

BACKGROUND: Clean white (#FFFFFF) to warm light gray (#F5F3F0). Professional, institutional, premium.

TYPOGRAPHY:
- English text: Manrope font (geometric modern sans-serif)
- Chinese text: Noto Sans SC font (clean Chinese sans-serif)
- Title: font-weight 700, 24pt, color #1A1A1A (deep black), LEFT-ALIGNED. Title only — NO subtitle, NO footer, NO page number.
- Section headers: font-weight 700, 20-22pt, #1A1A1A, LEFT-ALIGNED
- Body: font-weight 300, color #444444, 16-18pt, LEFT-ALIGNED
- Stat numbers: font-weight 700, Manrope, 48-64pt
- Keep English terms in English: SaaS, Claude Code, L1/L2/L3/L4/L5, Hands On, Feet Off, Eyes Off, Minds Off, Copilot, IDE, MCP, Skills, Rust, HarmonyOS, Ascend, Kirin, etc. Chinese for everything else.

ILLUSTRATION STYLE (CRITICAL — MOST IMPORTANT):
Every slide MUST have LARGE, DETAILED WIREFRAME illustrations that are PROMINENT — not tiny decorative icons.
- WIREFRAME LINE ART style — clean outlines, NO solid color fills, NO photo-realistic rendering
- Line color: dark gray (#555555) to warm charcoal (#333333), line weight ~1.5-2px
- RED ACCENT lines (#C7000B) on key elements — highlights, borders, important nodes
- Illustrations should be LARGE SCENE COMPOSITIONS occupying ~35-40% of the slide
- Detailed wireframe elements: network nodes, server racks, circuit patterns, connected devices, brain outlines
- Each card/section should have its own wireframe illustration
- Think: Huawei Annual Report, MWC keynote deck — bold, tech-forward, confident
- Labels in clean UPPERCASE Manrope text beside wireframe elements
- NO solid color fills, NO gradients on illustrations — pure line art with red accents

LAYOUT:
- Bold, modern, confident — NOT delicate or airy
- Cards: white background, thin RED left border (#C7000B), FLAT — NO shadow. Completely flat boxes.
- 0.5" minimum margins. Clean spacing.

Huawei corporate aesthetic. Bold, tech-forward, confident. Red and black premium feel.`;

const STYLE_COVER = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K — every detail crisp and sharp.

BACKGROUND: Deep black (#1A1A1A) to dark charcoal (#0D0D0D). Premium, bold, tech-forward.

TYPOGRAPHY:
- English text: Manrope font (geometric modern sans-serif)
- Chinese text: Noto Sans SC font (clean Chinese sans-serif)
- Title: font-weight 700, 36-40pt, color WHITE (#FFFFFF), CENTER-ALIGNED
- Subtitle: font-weight 300, 18pt, color #D4A843 (warm gold)
- NO footer, NO page number.

ILLUSTRATION STYLE:
- LARGE detailed WIREFRAME illustration at 15-20% opacity as atmospheric background
- Interconnected nodes, network patterns, petal/flower geometric motifs — all in wireframe line art
- Red accent lines (#C7000B) on key nodes, white/gray lines for the rest
- Circuit board traces, connected device silhouettes
- Elegant, bold — like a Huawei MWC keynote cover

Dark, bold, premium. Huawei keynote cover feel — confident and tech-forward.`;

const STYLE_DATA = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K — every detail crisp and sharp.

BACKGROUND: Very light warm gray (#FAFAF8) to white (#FFFFFF). Clean, corporate, institutional.

TYPOGRAPHY:
- English text: Manrope font (geometric modern sans-serif)
- Chinese text: Noto Sans SC font (clean Chinese sans-serif)
- Title: font-weight 700, 24pt, color #1A1A1A (deep black), LEFT-ALIGNED. Title only — NO subtitle, NO footer, NO page number.
- Table headers: font-weight 700, 14-16pt, white text on #C7000B background (Huawei red)
- Table body: font-weight 300, 13-15pt, #444444
- Stat numbers: font-weight 700, Manrope, 48-64pt, #C7000B or #1A1A1A
- Keep English terms in English.

DATA DISPLAY STYLE:
- Tables: clean borders, alternating white/#F5F3F0 rows, RED header row (#C7000B)
- Stat callouts: large Manrope numbers with small Noto Sans SC labels below
- Cards with thin red left border (#C7000B), FLAT — NO shadow. Completely flat boxes.

ILLUSTRATION STYLE (CRITICAL):
Even data slides need PROMINENT WIREFRAME illustrations — detailed line art with red accents. NOT tiny icons. Each data slide should have at least one medium-to-large wireframe illustration.

Huawei data slide aesthetic — bold red accents, clean data.`;

// ─── SLIDE PROMPTS ──────────────────────────────────────────────────
const slides = [

// ═══ SLIDE 1: COVER ═══
{
  style: "cover",
  prompt: `TITLE (center, bold, WHITE, Noto Sans SC, 40pt): "加速进化的AI智能体产业"
SUBTITLE (center, below title, #D4A843 gold, 20pt): "万物互联新纪元 · 战略洞察报告"

NO footer. NO page number.

ILLUSTRATION (background, atmospheric, LARGE):
A large wireframe network at 15-20% opacity filling the slide. Interconnected nodes in a mesh — devices (phone, laptop, server, car, watch) connected by thin white lines. Key nodes highlighted with RED (#C7000B) accent circles. A central larger node (AI brain outline) connects to all others. Geometric petal/flower motif (subtle Huawei identity) integrated into the network. Circuit board trace patterns in the corners. Dark black background (#1A1A1A). Bold, confident, tech-forward.`
},

// ═══ SLIDE 2: 三万亿巨鲸陨落 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "三万亿巨鲸陨落"

LAYOUT: LEFT ~55% text content, RIGHT ~40% wireframe illustration. ALL boxes FLAT.

LEFT SIDE — 4 content blocks:

BLOCK 1:
Large stat: "$3万亿" (Manrope, 56pt, #C7000B)
Body: "全球软件开发年产值"
"3000万开发者 × $10万/年 — a16z"

BLOCK 2:
Large stat: "$285B" (Manrope, 48pt, #E8636F)
Body: "单日市值蒸发 — Loss in Market Cap"
"2008年以来最大跌幅"

BLOCK 3:
Large stat: "$4,400亿" (Manrope, 40pt, #E8636F)
Body: "PE资产面临风险"
"Apollo Global Management: 'Software is Dead'"

BLOCK 4:
Body: "• ARK Invest: AI Agent = 新运营模式"
"• 价值从软件公司 → 基础设施提供商迁移"
"• 验证了硬件优先战略的正确性"

RIGHT SIDE — LARGE wireframe illustration:
A descending whale shape made of disconnecting wireframe nodes and dotted lines. Below the whale, new sprouts/network nodes emerging upward. Key nodes have RED (#C7000B) accent circles. Charcoal gray line art with red highlights. Large, detailed — NOT tiny.`
},

// ═══ SLIDE 3: SaaS危机 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "SaaS危机与座位压缩"

LAYOUT: Two columns. ALL boxes FLAT.

LEFT COLUMN (50%):
Header (20pt, bold, #1A1A1A): "结构性重置"
Body (16pt, #444):
"传统软件被视为'纯脑力劳动' — 轻资产、高毛利、无限可扩展。如今，轻资产属性成为最大脆弱性。"

"AI Agent直接替代人类角色，软件许可证面临座位压缩："
"• 1,000 许可证 → AI处理40% → 600 许可证"
"• 600 许可证 → AI达到80% → 200 许可证"

"8-12× 营收倍数模型面临崩塌"

RIGHT COLUMN (45%):
Header (20pt, bold, #1A1A1A): "已在生产环境验证"

Card 1 (thin RED left border, FLAT):
"Salesforce Service Cloud" (bold)
Stat: "-40%" (Manrope, 48pt, #E8636F)
"AI处理一线交互后许可证减少"

Card 2 (thin RED left border, FLAT):
"ServiceNow ITSM" (bold)
Stat: "-50%" (Manrope, 48pt, #E8636F)
"日常事件由AI解决，人类IT员工减半"

BOTTOM — wireframe strip: office desks progressively replaced by AI wireframe nodes left to right. Charcoal gray with red accent on AI nodes.`
},

// ═══ SLIDE 4: SaaS末日 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "2026年2月 SaaSpocalypse"

LAYOUT: LEFT 30% key stats. RIGHT 65% crash table. ALL boxes FLAT.

LEFT SIDE:
Large stat: "$2,850亿" (Manrope, 56pt, #C7000B)
Label: "单日市值蒸发" (16pt, #444)

Index stats:
"S&P 软件 -6%" (Manrope, bold, 20pt, #E8636F)
"金融服务 -7%" (20pt, #E8636F)
"Nasdaq-100 -2.4%" (20pt, #E8636F)

Body: "触发事件: Anthropic Claude Cowork 演示"
"Jeffrey Favuzza (Jefferies) 创造 'SaaSpocalypse'"

Wireframe accent: descending chart line with disconnecting nodes. Red accent on key drop points.

RIGHT SIDE — DATA TABLE:
RED header row (#C7000B, white text): "Company | Drop | Sector"
Rows (alternating white/#F5F3F0):
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

Drop numbers in #E8636F.`
},

// ═══ SLIDE 5: AI收购策略 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "AI收购策略"

LAYOUT: TOP formula. BOTTOM 2×2 grid. ALL boxes FLAT.

TOP FORMULA (center, spanning ~80%):
Three wireframe icons connected by "+" and "=":
[AI brain wireframe] "AI能力" + [people network wireframe] "客户基础" = [broadcast tower wireframe] "即时分发"
Each icon is ~100px wireframe with RED accent highlights. Connected by "+" and "=" in Manrope 36pt #1A1A1A.

BOTTOM — 2×2 GRID (thin RED left border each, FLAT):

TOP-LEFT: "客户关系" (bold, 18pt, #1A1A1A)
"即时获得企业入口" "绕过18个月销售周期"

TOP-RIGHT: "分发渠道" (bold, 18pt)
"现有客户触达能力" "品牌信任转移"

BOTTOM-LEFT: "训练数据" (bold, 18pt)
"客户使用数据 → AI模型优化" "数据飞轮加速"

BOTTOM-RIGHT: "战略转变" (bold, 18pt)
"护城河从产品 → 分发" "技术被AI商品化，客户关系不可替代"`
},

// ═══ SLIDE 6: 从L2到L5 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "从L2到L5: Autonomous Coding Revolution"

LAYOUT: 5 horizontal level cards. ALL cards FLAT.

─── L1 (lightest bg #FAFAF8) ───
Badge: "L1" (gray circle)
Label: "Code Completion" (bold, 16pt, #888)
"代码补全" / "Hands On"
Wireframe: keyboard with sparkle lines

─── L2 (bg #F0EDED) ───
Badge: "L2" (light red circle)
Label: "Copilot" (bold, 16pt, #666)
"AI辅助，人类主导" / "Feet Off"
Wireframe: monitor with small AI brain outline beside it

─── L3 (bg #E8E0E0, HIGHLIGHTED — thin RED border #C7000B) ───
Badge: "L3" (RED circle #C7000B, 1.3× larger)
Label: "Claude Code" (bold, 18pt, #1A1A1A)
"AI编写，人类用自然语言指导" / "Eyes Off"
Wireframe: LARGE terminal with AI brain connected by circuit lines
★ "← WE ARE HERE" (bold, 16pt, #C7000B)

─── L4 (bg #D5CCCC) ───
Badge: "L4" (dark circle)
Label: "Full Autonomy" (bold, 16pt)
"AI构建完整应用，极少监督" / "Minds Off"
Wireframe: AI brain producing multiple documents
"Claude Cowork: 100% AI-built" (#00A99D)

─── L5 (bg #1A1A1A, white text) ───
Badge: "L5" (RED circle)
Label: "Human-Free" (bold, 16pt, white)
"完全自主AI软件开发" / "Fully Autonomous"
Wireframe: fully connected mesh of AI nodes, no humans

Bottom: "SWE-bench Verified: 80.9% · 连续自主运行 30+ 小时"`
},

// ═══ SLIDE 7: AGI的启示 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "AGI的启示：制造工具的工具"

LAYOUT: LEFT ~55% text. RIGHT ~40% wireframe. ALL boxes FLAT.

LEFT SIDE:
Opening (16pt, #444):
"人类智能的指数级分化，始于用工具制造工具的那一刻。两百万年来，这个递归循环只属于人类。Claude Code打破了这种独占性。"

Header (18pt, bold, #1A1A1A): "AGI的四个操作性特征"

4 numbered items (thin RED left border each, FLAT):
"1. Tool Generation — 按需创建自定义工具"
"2. Tool Use — 执行bash命令、读取文件、编写代码"
"3. Feedback Integration — 从执行结果中学习"
"4. Self-Improvement — 每一代比上一代更强"

Key insight box (thin RED left border, FLAT):
"制造工具的工具 = AGI" (bold, 20pt, #1A1A1A)
"六个月内自主操作增加116%" (Manrope, 16pt, #C7000B)

RIGHT SIDE — LARGE wireframe:
Ascending spiral from bottom: stone tool → hammer → gear → computer → AI brain → AI creating AI. Each level more detailed. Spiral in charcoal gray, key nodes with RED (#C7000B) accent circles. Large, detailed wireframe scene.`
},

// ═══ SLIDE 8: Console Over IDE ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "Console Over IDE: 新界面范式"

LAYOUT: Two columns comparison. ALL boxes FLAT.

LEFT COLUMN (45%) — thin gray left border:
Header: "Traditional IDE" (bold, 20pt, #888)
"传统IDE模式"
Wireframe: complex IDE window with multiple panels, tabs, file trees — busy, cluttered. Gray line art.
"Interface: GUI code-centric"
"Workflow: 人写代码，AI辅助"
"Lock-in: IDE-specific"
"Learning Curve: 陡峭"
Each with "×" in gray.

RIGHT COLUMN (45%) — thin RED left border:
Header: "Claude Code Console" (bold, 20pt, #1A1A1A)
"控制台模式"
Wireframe: clean terminal with AI brain wireframe connected by circuit lines. Charcoal with RED accent.
"Interface: Terminal intent-centric"
"Workflow: 人描述意图，AI实现"
"Lock-in: Zero — 零锁定"
"Learning Curve: 平坦 (自然语言)"
Each with "✓" in #C7000B.

BOTTOM: "自主操作 +116% · 人类轮次 -33% · PR吞吐量 +67%"`
},

// ═══ SLIDE 9: AI生产力 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "AI解锁万亿美元的软件生产力"

LAYOUT: LEFT 35% stat. RIGHT 60% evidence cards. ALL boxes FLAT.

LEFT SIDE:
Large stat: "$3万亿" (Manrope, 64pt, #C7000B)
Label: "增量GDP影响" (18pt, #444)
"堪比工业革命的经济效应"
Wireframe accent: productivity curve trending up sharply with AI brain at inflection point. Red accent.

RIGHT SIDE — 5 evidence cards (thin RED left border each, FLAT):

"a16z" (bold) — "Best-of-breed部署: 2× 生产力提升"
"Forrester TEI · Claude Code" — "333% ROI" (bold, 24pt, #C7000B) "回收期不到六个月"
"Anthropic内部" — "18人中9人实现 100%+ 生产力提升"
"Palantir" — "PR周转 +30% · 每周节省70工程小时"
"战略转变" — "成本结构: 人头驱动 → 计算驱动" "AI从助手变为主要生产者" (#C7000B)`
},

// ═══ SLIDE 10: 智能体团队 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "智能体团队与递归开发循环"

LAYOUT: LEFT ~50% text. RIGHT ~45% wireframe. ALL boxes FLAT.

LEFT SIDE:
Header (18pt, bold, #1A1A1A): "Agent Teams实验"

Card (thin RED left border, FLAT):
"16个并行Claude实例"
"共享代码库，极少人类监督"
"产出: 完整C编译器 — 约100,000行Rust代码"
"成功编译Linux 6.9内核 (x86, ARM, RISC-V)"
"$20,000总成本 · ~2,000个会话" (#C7000B)

Header: "递归开发飞轮"
4 metrics (thin RED left border each):
"自主工具调用 +116%" (#C7000B) "9.8 → 21.2"
"人类轮次 -33%" (#E8636F) "6.2 → 4.1"
"PR吞吐量 +67%" (#C7000B)
"Claude占比 28% → 59%"

Bottom: "Boris Cherny — 2025年12月单月 300+ PR"

RIGHT SIDE — LARGE wireframe:
Recursive spiral diagram. Center: "Claude Code v1" node. Spiral through "Claude Cowork" → "Next-gen Tools" → "Better Models". Bottom: 16 small terminal wireframe nodes in a mesh. Charcoal gray lines with RED accent on key nodes. Large, detailed.`
},

// ═══ SLIDE 11: 原型优先 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "原型优先革命"

LAYOUT: TOP before/after. BOTTOM role table. ALL boxes FLAT.

TOP — Two columns:

LEFT card (thin gray border, FLAT):
Header: "旧模式" (18pt, bold, #888)
"写10页PRD → 设计评审 → 共识 → 规划 → 数周交付"
Wireframe: stack of documents with clock. Gray.

RIGHT card (thin RED border, FLAT):
Header: "原型优先" (18pt, bold, #1A1A1A)
"几小时构建原型 → 全公司试用 → 数据迭代 → 原型即规格"
Wireframe: running app screen with AI brain wireframe generating interface. Red accent.

Arrow: "→" (36pt, #C7000B)

BOTTOM — "工程师角色升级" (18pt, bold):
"键入代码 → 编写Spec和Prompt"
"逐行调试 → 审查AI输出"
"记忆API → 设计架构"
"手动测试 → 定义测试策略"
"独自编码 → 编排多个Agent"
"工具熟练度 → 系统思维"
Each "→" in #C7000B.`
},

// ═══ SLIDE 12: 五大支柱 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "智能体软件工程架构五大支柱"

LAYOUT: 5 pillar cards horizontal. ALL cards FLAT.

─── PILLAR 1 (thin RED left border) ───
Wireframe: document with gear overlay. Red accent.
"CLAUDE.md" (bold, 16pt)
"机器可读项目记忆 · 跨会话持久 · 项目规则"
"AGENTS.md · .cursorrules" (12pt, #888)

─── PILLAR 2 (thin RED left border) ───
Wireframe: command prompt with slash commands radiating. Red accent.
"Skills" (bold, 16pt)
"按需可复用工作流 · /deploy /test /review"

─── PILLAR 3 (thin RED left border) ───
Wireframe: central hub node connected to external service icons. Red accent on hub.
"MCP" (bold, 16pt)
"标准化外部工具连接 · 已捐赠Linux Foundation"

─── PILLAR 4 (thin RED left border) ───
Wireframe: parent node spawning child nodes. Red accent on parent.
"Subagents" (bold, 16pt)
"并行执行 · 父Agent生成多个子Agent"

─── PILLAR 5 (thin RED left border) ───
Wireframe: lightning bolt triggering cascade. Red accent.
"Hooks" (bold, 16pt)
"事件驱动自动化 · CI/CD"

Bottom: "行业趋同: Anthropic · OpenAI · Google · GitHub · Cursor — 数月内独立收敛"`
},

// ═══ SLIDE 13: ASE手册 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "智能体软件工程手册：殊途同归"

LAYOUT: Two columns. ALL boxes FLAT.

LEFT (48%):
Header: "Anthropic方法" (bold, 20pt, #1A1A1A)
"原型优先 + 自我改进飞轮" (14pt, #C7000B)
6 steps (thin RED left border each):
"1. 试用工具，指定Agents Captain"
"2. 创建AGENTS.md"
"3. 使内部工具对Agent可访问"
"4. 为Agent优先重构代码库"
"5. Say No to Slop"
"6. 建设可观测性基础设施"

RIGHT (48%):
Header: "OpenAI方法" (bold, 20pt)
"Agent as 首选工具" (14pt, #C7000B)
6 steps (thin RED left border each):
"1. Hackathon试用"
"2. 编写AGENTS.md"
"3. 工具对Agent可用"
"4. Agent优先代码库"
"5. 人类问责制"
"6. 可观测性"

"Sora Android: 4名工程师 · 18天 · 速度提升500%" (#C7000B)

BOTTOM: "2025年12月 AAIF成立 · Anthropic捐赠MCP · OpenAI捐赠AGENTS.md"`
},

// ═══ SLIDE 14: L0-L5框架 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "从手动社区到黑灯社区：L0-L5框架"

LAYOUT: 6 cards in 2×3 grid. ALL cards FLAT.

─── ROW 1 ───
L0 (thin gray border):
Wireframe (LEFT 35%): monitors with human figures pointing. Gray.
"手动社区" (bold, #888) "所有代码人写人审 · BDFL治理"

L1 (thin gray border):
Wireframe: terminal with small AI brain, CI/CD hexagons. Light gray.
"辅助社区" (bold, #666) "AI辅助测试·文档 · 人审一切"

─── ROW 2 ───
L2 (thin RED border):
Wireframe: monitor + AI neural constellation, "AGENTS.md" bridge, "60K+" "93万PR" badges.
"协作社区" (bold, #1A1A1A) "AGENTS.md引导 · 93万+ Agent PR"
"瓶颈: 人类审查能力" (#E8636F)
★ "大多数项目目前处于此阶段" (#C7000B)

L3 (thin RED border, highlighted):
Wireframe: shield + trust graph, AI scan beams, gateway pillars.
"信任社区" (bold, #1A1A1A) "信任网络·智能审查·准入策略"
"信任是自主的前提条件" (#00A99D)

─── ROW 3 ───
L4 (thin RED border):
Wireframe: NLSpec document → AI workspace → recycling old code.
"规范社区" (bold) "NLSpec唯一真相 · Attractor: Markdown → 16K Rust + 9.5K Go"
"代码临时，规范永恒" (#C7000B)

L5 (bg #1A1A1A, white text, thin RED border):
Wireframe: 5-6 AI nodes fully connected mesh, dark space, human with "价值观" scroll.
"黑灯社区" (bold, white) "智能体自治 · 人类只定义价值观"`
},

// ═══ SLIDE 15: 不可能三角 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): ""不可能三角"被打破"

LAYOUT: LEFT ~50% triangle diagram. RIGHT ~45% text. ALL boxes FLAT.

LEFT — LARGE triangle wireframe:
Three vertices with wireframe icons:
TOP: "性能" with gear icon
BOTTOM-LEFT: "可移植性" with multi-device icon
BOTTOM-RIGHT: "可用性" with user icon
Inside: "三选二" (dashed)
Below: second triangle with all vertices as RED (#C7000B) nodes, AI brain in center.
"AI: 三者兼得" (#C7000B)

RIGHT:
"传统权衡" (bold):
3 blocks (gray border): performance+portability=bad UX, etc.
"AI如何打破" (bold):
3 blocks (RED border): AI handles complexity, natural language, platform-specific code.
"抽象层崩塌，硬件创新加速" (bold, #1A1A1A)`
},

// ═══ SLIDE 16: AI释放硬件 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "AI释放硬件：通用翻译器"

LAYOUT: LEFT ~55% text. RIGHT ~40% wireframe. ALL boxes FLAT.

LEFT SIDE:
"软件历史是不断攀升的抽象阶梯。每一步提升可移植性和可用性，代价是性能。"

Header: "AI消除人类认知限制"
3 points (thin RED left border each):
"端到端Rust — 从UI到驱动，不牺牲速度"
"AI为每个目标生成平台特定实现 — Ascend · Kirin · 鲲鹏均可受益"
"CUDA 15年锁定被AI在分钟内打破"

Highlight box (RED border):
"ROCm突破" (bold) "Claude Code ~30分钟移植整个CUDA后端"
"重写变成审查，成本下降数个数量级"
"Ascend生态可借此实现加速突破" (#C7000B)

RIGHT — LARGE wireframe:
Stack diagram: TOP tall stack (8 layers, gray) "传统" vs BOTTOM short stack (4 layers, red accent) "AI原生". AI brain wireframe between as translator. Charcoal lines, red accents.`
},

// ═══ SLIDE 17: 第一性原理 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "用第一性原理重构抽象层设计"

LAYOUT: Two columns comparison. ALL boxes FLAT.

LEFT (45%) — thin gray border:
Header: "传统ML框架 (PyTorch)" (bold, #888)
Stack: 8 layers (gray wireframe rectangles). Many layers = bloat.
"1,000+个包" (#E8636F)
"通用内核 · 容器部署"

RIGHT (45%) — thin RED border:
Header: "第一性原理 (flux2.c)" (bold, #1A1A1A)
Stack: 4 layers only (charcoal wireframe, red accent). Clean.
"零依赖" (#C7000B) "仅C标准库"
"架构特定内核 · 单一二进制"

BOTTOM: "HarmonyOS薄栈优势 — AI消除了为人类便利而层层抽象的必要性" (bold)

Wireframe accent: scissors cutting layers. Red accent.`
},

// ═══ SLIDE 18: OminiX-MLX (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "案例研究：OminiX-MLX"

LAYOUT: TOP comparison table. BOTTOM model support + stats. ALL boxes FLAT.

TOP TABLE:
RED header (#C7000B, white text): "维度 | OminiX-MLX | 传统Python MLX"
Rows:
语言 | 纯Rust (83.7%) | Python + C++绑定
架构 | 统一所有模态 | 碎片化独立项目
开发时间 | 数周 | 数年
封装 | MLX薄Rust封装 | 多层Python封装
并行 | Rust真正并行 | Python GIL限制
类型安全 | 编译时 | 运行时错误
依赖 | Cargo.toml可复现 | 依赖地狱

BOTTOM LEFT (RED border):
"支持的模型" (bold): LLM (Qwen3·GLM4·Mixtral), ASR (FunASR), TTS (GPT-SoVITS), 图像 (FLUX.2)

BOTTOM RIGHT:
"Apple MLX上的纯Rust实现" (bold, 20pt)
"数周构建 vs 数年" (#C7000B)

Wireframe: chip with Rust gear. Red accent.`
},

// ═══ SLIDE 19: Rust ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "Rust：AI时代的编程语言"

LAYOUT: LEFT ~55% text. RIGHT ~40% wireframe. ALL boxes FLAT.

LEFT:
Stat: "70%" (Manrope, 56pt, #C7000B)
"关键安全漏洞与内存相关"

Header: "为什么是Rust"
3 points (RED border each):
"编译时内存和并发安全 — 消除70%漏洞"
"匹配C/C++性能 — 零成本抽象"
"AI消除学习曲线 — 规模化生成Rust代码"

"美国国防部: Rust用于关键系统"
"Microsoft: 2030年消除所有C/C++"
"HarmonyOS内核模块正在用Rust重写" (#C7000B)

RIGHT — LARGE wireframe:
Shield with Rust crab gear inside. Crossed-out bugs around shield. Timeline: C/C++ → Java/Python → Rust+AI. Charcoal with RED accent on shield and Rust+AI endpoint. Large, detailed.`
},

// ═══ SLIDE 20: 终端生态重置 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "终端生态迎来重置时刻"

LAYOUT: LEFT ~50% text. RIGHT ~45% wireframe. ALL boxes FLAT.

LEFT:
"用户只使用应用10-20%的功能。AI从根本上改变了这一模式。"

Header: "AI原生终端"
3 points (RED border):
"软件围绕个人需求深度个性化、动态组合"
"大模型公司追求垂直整合 — 控制用户数据和交互界面"
"拥有设备层成为战略不可回避的选择"

Header: "鸿蒙的战略机遇" (#C7000B)
3 points (RED border):
"内核安全: C/C++模块用Rust/内存安全语言重写"
"应用层: 美团/携程每年数亿维护成本 — AI改变等式"
"新编程语言 + AI原生框架 — 跨越式发展"

"技术债务 → 罕见的重置时刻 — HarmonyOS的历史性窗口" (bold, #C7000B)

RIGHT — LARGE wireframe:
Phone device outline. Left half: cluttered app grid (gray). Right half: clean personalized AI interface (red accent). AI brain wireframe above connected to personalized elements. "一刀切 → 深度个性化". Charcoal with red highlights.`
},

// ═══ SLIDE 21: A2UI ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "A2UI：应用孤岛的终结"

LAYOUT: TOP flow diagram. BOTTOM comparison. ALL boxes FLAT.

TOP — A2UI flow (wireframe):
"用户意图" → "AI Agent" → "A2UI消息 (JSON)" → "客户端渲染器" → "原生组件"
Each as wireframe icon with arrows. Charcoal with RED accent on AI Agent node.

BOTTOM — Two columns:
LEFT (gray border): "传统应用"
"静态一刀切 · 数月开发 · 应用商店 · 每平台单独构建"

RIGHT (RED border): "A2UI"
"动态个性化 · 秒级AI生成 · 实时流式 · 全平台原生"
Each with "✓" in #C7000B.

Bottom: "Google A2UI: 每个人获得自己独特的应用 — 而非十亿人一个应用"`
},

// ═══ SLIDE 22: OpenClaw ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "OpenClaw：AI原生操作系统的雏形"

LAYOUT: LEFT ~50% text. RIGHT ~45% wireframe. ALL boxes FLAT.

LEFT:
Stats row: "150K+" (40pt, #C7000B) Stars · "5,700+" (40pt, #00A99D) Skills · "900+" Contributors
"9K → 60K stars in days · 一周200万访客"

Header: "不是工具，是操作系统"
3 points (RED border):
"Skills生态 — ClawHub取代App Store，5,700+可复用Agent工作流"
"全平台覆盖 — iMessage · WhatsApp · Telegram · Slack · Discord"
"Moltbook — Agent社交网络，AI Agent自主发帖互动"

Header: "Peter Steinberger与新型领袖"
Card (RED border):
"PSPDFKit创始人 · 批评者称'Claude Code wrapper'"
"真正创新: iOS深度集成和社区构建"
"名称传奇: Clawdbot → Moltbot → OpenClaw"
"当技术不再稀缺，社区构建成为新护城河" (bold, #C7000B)

RIGHT — LARGE wireframe:
AI brain wireframe center (OpenClaw core). Platform icons orbiting: iMessage, WhatsApp, Telegram, Slack, Discord — wireframe outlines connected by dotted lines. Above: dense constellation of skill nodes "ClawHub". Below: mesh of agent nodes (Moltbook). Charcoal gray with RED accent on core. Large, detailed.`
},

// ═══ SLIDE 23: 规模化提速 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "规模化提速：生产环境中的AI编程"

LAYOUT: 6 company cards in 2×3 grid. ALL cards FLAT, thin RED left border.

─── ROW 1 ───
"Meta" — "Think 5X" (32pt, #C7000B)
"速度提升500% · >50% AI生成代码"

"Google" — ">25%" (32pt, #00A99D)
"所有新代码由AI生成 · 截至2024年底"

─── ROW 2 ───
"ByteDance" — "90%" (32pt, #C7000B)
"工程师使用Trae · 抖音40%代码AI编写"

"Tencent" — ">50%" (32pt, #00A99D)
"新代码AI生成 · 编码时间减少40%"

─── ROW 3 ───
"Amazon" — "4,500" (32pt, #C7000B)
"开发者年节省 ($2.6亿) · Q Developer"

"NVIDIA" — "97.4%" (32pt, #00A99D)
"ChipAgents Verilog准确率 · 下一代GPU"`
},

// ═══ SLIDE 24: 价值转移 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "价值转移："一鲸落万物生""

LAYOUT: LEFT ~50% diagram. RIGHT ~45% text. ALL boxes FLAT.

LEFT — LARGE wireframe diagram:
TOP "传统模式": large building wireframe "软件公司" (高毛利 70-90%) + small server "基础设施"
Arrow "AI转变" pointing down (RED accent)
BOTTOM "AI原生": small fading code icon "软件" + LARGE server/data center "基础设施" (captures value, RED accent)
Whale wireframe silhouette descending. New nodes rising below. Charcoal with RED highlights.

RIGHT:
Header: "结构性迁移"
4 rows (RED border):
"毛利: 70-90% → 接近零" (#E8636F)
"价值捕获: 代码/IP → 计算/基础设施"
"护城河: 功能差异化 → 硬件 + 数据"
"成本结构: 人类工资 → 基础设施成本"

Header: "战略展望"
3 points: "基础设施提供商成为新巨头" "能源和计算成为战略资源" "华为全栈能力的战略价值凸显" (#C7000B)`
},

// ═══ SLIDE 25: 超级智能体企业 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "垂直整合的超级智能体企业"

LAYOUT: LEFT ~55% text. RIGHT ~40% wireframe. ALL boxes FLAT.

LEFT:
"AI将软件从瓶颈中移除 — 新硬件存在后，AI可在数小时内适配代码。"

Header: "数据飞轮"
"更多数据 → 更好模型 → 更复杂任务 → 更多数据"
"芯片·网络·数据中心·模型·应用紧密集成"

Header: "全栈范例"
Card 1 (RED border): "Google" — "TPU + 数据中心 + OCS + Gemini + 应用 → 闭环" (#00A99D)
Card 2 (RED border): "华为" — "Ascend + 鲲鹏 + 华为云 + 盘古 + HarmonyOS → 中国唯一全栈" (#C7000B)
Card 3 (RED border): "xAI" — "Colossus + 电力基础设施 + Macrohard"
Card 4 (gray border): "Apple" — "反面案例: 无基础模型控制" (#888)

"不完整的栈会掉队 — 控制飞轮定义赢家" (bold)

RIGHT — LARGE wireframe:
Vertical stack: 能源 → 数据中心 → 芯片 → 网络 → 模型 → 应用. Flywheel arrow around stack. Huawei label with RED accent highlight. Charcoal gray with red accents.`
},

// ═══ SLIDE 26: Macrohard ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "Macrohard：数字员工时代"

LAYOUT: LEFT ~55% text. RIGHT ~40% wireframe. ALL boxes FLAT.

LEFT:
"Elon Musk的Macrohard: 纯AI原生软件公司。锚定物理基础设施而非算法。"

Header: "核心论点"
3 points (RED border):
"算法趋同 — 护城河在计算、能源和迭代速度"
"Colossus: 世界首个吉瓦级AI数据中心"
"真正瓶颈: 燃气轮机·变压器·变电站·电网 — 比芯片更稀缺"

Header: "运营模式"
Card (RED border):
"AI Agent编写软件 · 其他Agent模拟使用"
"反馈循环持续运行 · 产品以机器速度收敛"
"成本 -70% · 上市时间 -40% · 零人类开发者" (#C7000B)

"竞争从软件抽象转向物理现实"

RIGHT — LARGE wireframe:
Dark factory: data center building with AI nodes inside (no humans). Power lines below. Software streams upward. Old model (tiny humans at desks) vs new (AI nodes only). Charcoal with red accents.`
},

// ═══ SLIDE 27: Palantir ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "人机协同：Palantir方法论"

LAYOUT: LEFT ~50% text. RIGHT ~45% stats + wireframe. ALL boxes FLAT.

LEFT:
"并非所有软件都能100% AI驱动。复杂行业中，深度领域知识不可替代。"

Header: "FDE模式"
Card (RED border):
"Forward Deployed Engineer · 嵌入客户现场"
"深入理解运营工作流 · 起源: 美国国防/情报"

Header: "AI增强FDE"
Card (RED border):
"人类: 领域洞察 + 问题框架"
"AI: 加速方案设计、迭代和定制"
"AI FDE (2025.11): 自然语言操作Foundry"
"花旗银行: 九天 → 秒级" (#C7000B)

"对华为启示: 硬件+现场军团+AI编程 = 最强交付能力" (bold, #C7000B)

RIGHT:
"$10亿" (48pt, #C7000B) "2025 Q2营收"
"93%" (48pt, #00A99D) "美国商业增长 YoY"
"800-1000%" (36pt, #C7000B) "FDE岗位增长"

Wireframe: Venn diagram "人类洞察" + "AI速度" → overlap "FDE". Charcoal + red accent.

"完全自主 (低风险) vs 人机混合 (复杂企业)"`
},

// ═══ SLIDE 28: 主权AI ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "主权AI：国家级超级垂直技术栈"

LAYOUT: LEFT ~55% text. RIGHT ~40% wireframe. ALL boxes FLAT.

LEFT:
"每个国家越来越需要自己的数字和AI基础设施。AI编码从根本上改变了主权软件能力的等式。"

Header: "数字主权新可能"
3 points (RED border):
"欧盟: 公民数据在美国云平台 = 结构性风险"
"AI转变: 有意志和计算资源 → 可行成本构建主权平台"
"全球趋势: 拉美·中东·东南亚视AI为工业革命级机遇"

Header: "中国的独特优势" (#C7000B)
3 points (RED border):
"华为: 唯一具备从芯片到终端全栈能力的中国企业"
"Ascend + 鲲鹏 + 华为云 + 盘古模型 + HarmonyOS = 主权AI完整解决方案"
"AI编程使'自主可控'从口号变为可执行战略"

"数字主权: 技术可行 · 经济可持续 · 不可回避" (bold, #C7000B)

RIGHT — LARGE wireframe:
World map outline with highlighted regions (EU, Middle East, SE Asia, Latin America). Each with sovereignty stack wireframe (flag + server + AI node). China/Huawei stack largest and most complete. Charcoal + RED accent on China stack.`
},

// ═══ SLIDE 29: 标准颠覆 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "标准颠覆：MCP已死，Skills万岁"

LAYOUT: TOP comparison. BOTTOM outlook. ALL boxes FLAT.

TOP — Two columns:
LEFT (gray border): "MCP (旧范式)"
"AI作为助手 (L2) · AI调用传统API"
"现有软件包装层 · 趋势衰退 ↓"
Wireframe: traditional API endpoint wrapper. Gray.

RIGHT (RED border): "Skills (新范式)"
"AI作为开发者 (L3/L4) · AI直接编写代码"
"原生Agent能力 · 趋势上升 ↑"
Wireframe: AI brain wireframe producing code with skill nodes. Red accent.

Arrow: "→" (36pt, #C7000B)

BOTTOM (RED border):
"a16z洞察" (bold): "Agent原生基础设施成为标配"
"记录系统让位于动态Agent层"
"控制Agent层 = 控制生态" (#C7000B)
"华为应把握Agent原生标准的定义权" (bold, #C7000B)`
},

// ═══ SLIDE 30: 结论 (COVER) ═══
{
  style: "cover",
  prompt: `TITLE (center, bold, WHITE, Noto Sans SC, 36pt): "智能体时代的必然"
SUBTITLE (center, #D4A843 gold, 18pt): "软件产业不是在消亡 — 它正在重生"

5 priorities in horizontal row (14pt, white, wireframe icons):
"L3/L4 AI编码" · "Agent原生重建" · "垂直整合" · "人机混合FDE" · "主权AI"

Bottom quote (center, italic, 14pt, #888):
"唯一真正的问题是：你是塑造变革的人，还是被变革塑造的人。"

ILLUSTRATION (background, atmospheric):
Large wireframe at 15-20% opacity. Whale falling through network nodes, dissolving into particles. Below: new ecosystem of AI nodes, device outlines, connected infrastructure growing upward. Red accent (#C7000B) on key new-growth nodes. Petal/flower geometric motifs woven into the network. Dark black background. Bold, confident closure.`
},

];

// ─── STYLE RESOLVER ─────────────────────────────────────────────────
function getStyle(tag) {
  switch(tag) {
    case "cover": return STYLE_COVER;
    case "data":  return STYLE_DATA;
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

  const outFile = "加速进化的AI智能体产业_华为版.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${slides.length} slides)`);
}

main().catch(err => console.error("Fatal:", err));
