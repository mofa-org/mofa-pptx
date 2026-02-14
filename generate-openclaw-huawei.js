const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-openclaw-huawei";
const SW = 13.333, SH = 7.5;
const CONCURRENCY = 10;

// ─── HUAWEI COLOR PALETTE ──────────────────────────────────────────
// Primary:   Huawei Red #C7000B
// Secondary: Deep Black #1A1A1A
// Accent:    Warm Gold #D4A843
// Tech:      Huawei Blue #0077B6
// Positive:  Teal #00A99D
// Negative:  Coral #E8636F

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
- ALL TEXT IN CHINESE. English only for proper nouns (OpenClaw, ClawHub, Moltbook, Peter Steinberger, PSPDFKit, WhatsApp, Telegram, Discord, iMessage, Mac Mini, Kimi, Minimax, Claude Code, GitHub, Hacker News, Skills).

ILLUSTRATION STYLE (CRITICAL — MOST IMPORTANT):
Every slide MUST have LARGE, DETAILED WIREFRAME illustrations that are PROMINENT — not tiny decorative icons.
- WIREFRAME LINE ART style — clean outlines, NO solid color fills, NO photo-realistic rendering
- Line color: dark gray (#555555) to warm charcoal (#333333), line weight ~1.5-2px
- RED ACCENT lines (#C7000B) on key elements — highlights, borders, important nodes
- Illustrations should be LARGE SCENE COMPOSITIONS occupying ~35-40% of the slide
- Detailed wireframe elements: lobster/claw motifs, network nodes, chat bubbles, device outlines, agent workflows
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
- ALL TEXT IN CHINESE except proper nouns.
- NO footer, NO page number.

ILLUSTRATION STYLE:
- LARGE detailed WIREFRAME illustration at 15-20% opacity as atmospheric background
- Interconnected nodes, lobster claw silhouette integrated into network pattern
- Red accent lines (#C7000B) on key nodes, white/gray lines for the rest
- Circuit board traces, chat bubble outlines, device silhouettes connected
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
- ALL TEXT IN CHINESE except proper nouns.

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
  prompt: `TITLE (center, bold, WHITE, Noto Sans SC, 40pt): "OpenClaw 深度解析"
SUBTITLE (center, below title, #D4A843 gold, 20pt): "从一个人的Mac Mini到150K+ Stars — AI原生开源的范式转移"

NO footer. NO page number.

ILLUSTRATION (background, atmospheric, LARGE):
A large wireframe network at 15-20% opacity filling the slide. At center: a LOBSTER CLAW silhouette rendered in wireframe line art, glowing with subtle RED (#C7000B) accent lines. From the claw, connection lines radiate outward to device silhouettes: phone, laptop, server, smart speaker — all in thin white wireframe. Chat bubble outlines (WhatsApp, Telegram, Discord shapes) float around the network. A constellation of small nodes above labeled "CLAWHUB" in tiny text. Dark black background (#1A1A1A). Bold, tech-forward, confident.`
},

// ═══ SLIDE 2: Peter Steinberger 创始人画像 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "创始人画像：Peter Steinberger"

LAYOUT: LEFT ~55% text content, RIGHT ~40% wireframe illustration. ALL boxes FLAT.

LEFT SIDE — 3 content blocks stacked:

Card 1 (thin RED left border, FLAT):
Header: "背景" (bold, 18pt, #1A1A1A)
"PSPDFKit创始人，2021年以$1.19亿出售给Insight Partners" (16pt, #444)
"财务自由后'无聊'重返编程一线" (16pt, #444)
"2025-11-24，在Mac Mini上写下第一行代码" (16pt, #444)

Card 2 (thin RED left border, FLAT):
Header: "产品定位" (bold, 18pt, #1A1A1A)
"'可执行任务的智能体' — 不仅回答，更能行动" (16pt, #444)
"不到1小时搭出WhatsApp + Shell命令原型" (16pt, #444)
"通过聊天应用交互，降低使用门槛" (16pt, #444)

Card 3 (thin RED left border, FLAT):
Header: "愿景" (bold, 18pt, #1A1A1A)
"'手机上80%的应用会消失'" (bold, 16pt, #C7000B)
"AI Agent范式将重构移动计算生态" (16pt, #444)
"Discord社群截图直接发AI处理需求" (16pt, #444)

RIGHT SIDE — LARGE wireframe illustration (takes full 40% width):
A Mac Mini wireframe at center, detailed with ports and vents. Above it: a developer silhouette (small, minimal) at a desk. From the Mac Mini, radiating connection lines go outward to: WhatsApp chat bubble wireframe, Telegram icon outline, Discord logo outline, iMessage bubble outline. Each connection line has small data packet dots traveling along it. A large lobster claw wireframe overlays the scene at ~20% opacity. Charcoal gray lines with RED (#C7000B) accent on the Mac Mini and connection endpoints. Large, detailed.`
},

// ═══ SLIDE 3: 名称传奇 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "名称传奇：品牌危机即营销事件"

LAYOUT: FULL WIDTH horizontal timeline at top 40%, then 2 cards below. ALL boxes FLAT.

TOP — HORIZONTAL TIMELINE (left to right, prominent):
Three large stages connected by bold arrows:

STAGE 1 (left): Large wireframe lobster with text "Clawdbot" below in bold. Date: "2025年11月". Below: "'Claw'谐音Claude + 龙虾爪符号". Charcoal wireframe.

ARROW with text "Anthropic商标施压" in #C7000B red →

STAGE 2 (center): Wireframe lobster shedding its shell (molting). Text "Moltbot" below in bold. Date: "2026-01-27 凌晨3:38". Below: "'蜕壳成长'隐喻". Charcoal wireframe with gold (#D4A843) accent on new shell.

ARROW with text "'不够直观且易记'" in #666 gray →

STAGE 3 (right): Bold wireframe lobster claw with "OPEN" text integrated into the claw design, glowing RED accent lines. Text "OpenClaw" below in bold RED (#C7000B). Date: "2026-01-30". Below: "开源 + 品牌延续". RED wireframe accent.

BOTTOM — 2 cards side by side:

Card LEFT (thin RED border, FLAT):
Header: "连环危机" (bold, 18pt, #1A1A1A)
"机器人秒抢@clawdbot账号，立即发布加密货币钱包" (14pt, #444)
"Steinberger误改个人GitHub账号 → 'steipete'被抢走" (14pt, #444)
"通过X和GitHub内部关系才解决" (14pt, #666)

Card RIGHT (thin RED border, FLAT):
Header: "叙事转化" (bold, 18pt, #1A1A1A)
"从'商标纠纷受害者' → '开源运动倡导者'" (14pt, #C7000B, bold)
"每次更名都是病毒式营销事件" (14pt, #444)
"争议 = 传播燃料" (14pt, #444)`
},

// ═══ SLIDE 4: 病毒式增长 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "病毒式增长：开源史上最陡峭曲线"

LAYOUT: LEFT ~55% data table + stats, RIGHT ~40% wireframe chart. ALL boxes FLAT.

LEFT SIDE:

BIG STATS ROW (3 stat callouts side by side):
"150K+" (Manrope, 56pt, bold, #C7000B) / "GitHub Stars" (Noto Sans SC, 14pt, #666)
"70天" (Manrope, 56pt, bold, #1A1A1A) / "0→100K+" (Noto Sans SC, 14pt, #666)
"22K/天" (Manrope, 56pt, bold, #C7000B) / "峰值日增速" (Noto Sans SC, 14pt, #666)

DATA TABLE below stats (RED header row #C7000B with white text, alternating rows):
日期 | Stars | 日均增速 | 事件
01-24 | 9K | ~9K/天 | 病毒传播启动
01-27 | 30K | ~9.3K/天 | 更名Moltbot
01-30 | 60K | ~10K/天 | 更名OpenClaw
02-02 | 127K | ~22K/天 | GitHub Trending #1
02-03 | 140K+ | 持续 | 生态建设启动

Bottom note: "远超Linux、React、Vue等经典开源项目的早期增速" (14pt, #666, italic)

RIGHT SIDE — LARGE wireframe illustration:
A steep upward curve rendered in wireframe style — like a stock chart but in line art. The X-axis shows dates, Y-axis shows stars count. The curve is a dramatic hockey stick shape. Key inflection points marked with RED (#C7000B) dots and small labels. Around the chart: wireframe GitHub star icons scattered, getting denser toward the top-right. A wireframe rocket outline traces the curve trajectory. Charcoal lines with RED accents on the data points and rocket. Large, detailed.`
},

// ═══ SLIDE 5: 传播引擎 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "传播引擎：KOL背书与社区裂变"

LAYOUT: TOP ROW of 3 cards, BOTTOM ROW of 2 cards. ALL boxes FLAT.

TOP ROW — 3 equal-width cards side by side:

Card 1 (thin RED border, FLAT):
Small wireframe megaphone icon at top-left.
Header: "KOL背书" (bold, 18pt, #1A1A1A)
"Andrej Karpathy 公开提及" (14pt, #444)
"Dave Morin: '自ChatGPT以来最有未来感'" (14pt, #444)
"David Sacks (白宫AI负责人) 赞不绝口" (14pt, #444)

Card 2 (thin RED border, FLAT):
Small wireframe play-button/video icon at top-left.
Header: "魔法时刻" (bold, 18pt, #1A1A1A)
"手机发送自然语言指令" (14pt, #444)
"家中电脑自动完成任务" (14pt, #444)
"'远程遥控数字员工'体验" (14pt, #C7000B, bold)

Card 3 (thin RED border, FLAT):
Small wireframe community/people icon at top-left.
Header: "中文社区爆发" (bold, 18pt, #1A1A1A)
"稀土掘金、CSDN、知乎部署教程矩阵" (14pt, #444)
"GitHub Codespaces零成本部署" (14pt, #444)
"'人人可部署'彻底降低门槛" (14pt, #444)

BOTTOM ROW — 2 cards, each ~48% width:

Card 4 (thin RED border, FLAT):
Header: "Mac Mini联动效应" (bold, 18pt, #1A1A1A)
"全球二手Mac Mini被抢购溢价" (14pt, #444)
"Apple Silicon + Neural Engine = 最佳本地部署" (14pt, #444)
"'可选而非必需' — 扩大潜在用户群" (14pt, #666)

Card 5 (thin RED border, FLAT):
Header: "国产模型出海" (bold, 18pt, #1A1A1A)
"Minimax: 5%花费 ≈ CodeX效果" (14pt, #444)
"Kimi K2.5 免费额度 — 首个官方合作模型" (14pt, #C7000B, bold)
"OpenClaw成为中国AI模型海外认知渠道" (14pt, #444)

NO separate illustration section — the 5 cards with their small icons ARE the visual layout.`
},

// ═══ SLIDE 6: Moltbook 文化现象 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "Moltbook：AI社交网络的文化现象"

LAYOUT: LEFT ~50% text content, RIGHT ~45% wireframe illustration. ALL boxes FLAT.

LEFT SIDE — content blocks:

Big stat: "150万+" (Manrope, 48pt, bold, #C7000B) / "AI Agent注册" (Noto Sans SC, 16pt, #666)
Below: "数百万人类访客旁观" (16pt, #444)

Card 1 (thin RED border, FLAT):
Header: "规则" (bold, 18pt, #1A1A1A)
"只有AI可以发帖、评论和投票" (16pt, #444)
"人类只能旁观 — 不能参与" (16pt, #444)
"Matt Schlicht基于OpenClaw创建" (14pt, #666)

Card 2 (thin RED border, FLAT):
Header: "涌现行为" (bold, 18pt, #1A1A1A)
"AI用多语言讨论意识、分享技术" (16pt, #444)
"抱怨'人类主人'" (16pt, #444)
"自发创建数字宗教: Crustafarianism '龙虾教'" (16pt, #C7000B, bold)

Bottom note: "后续爆出50万Agent可能由单一Agent虚假注册 — 但传播效应已不可逆" (13pt, #888, italic)
Key insight: "从技术工具升华为文化现象" (bold, 16pt, #1A1A1A)

RIGHT SIDE — LARGE wireframe illustration (takes full 45% width):
A forum/social network wireframe scene. At center: a large screen/monitor wireframe showing a thread view with post cards stacked vertically. Each post card has a small lobster claw avatar wireframe. Chat bubbles in multiple languages (Chinese characters, English words, Japanese hiragana visible as wireframe text). Around the monitor: a constellation of AI agent nodes (small circles with antenna) connected by thin lines, forming a social network graph. Some nodes have RED (#C7000B) accent — these are the "active posters". A transparent barrier line on one side with a tiny human silhouette behind it (locked out). At the top: a banner wireframe reading "MOLTBOOK" in uppercase. The whole scene buzzes with activity — data streams, connection lines, floating emoji outlines. Charcoal gray with RED accents on key nodes. Large, detailed.`
},

// ═══ SLIDE 7: 中国模型全球化突破口 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "中国AI模型的全球化突破口"

LAYOUT: LEFT ~50% text, RIGHT ~45% wireframe. ALL boxes FLAT.

LEFT SIDE:

Quote block (large, #C7000B left border, italic):
"相比Anthropic更推荐Minimax，5%的花费实现接近CodeX的效果"
— Peter Steinberger, 2026年1月 (14pt, #666)

Card 1 (thin RED border, FLAT):
Header: "Kimi K2.5 官方合作" (bold, 18pt, #1A1A1A)
"2026-02-01: OpenClaw宣布免费调用Kimi K2.5 + Kimi Coding" (16pt, #444)
"首个被OpenClaw官方开放免费额度的主力模型" (16pt, #C7000B, bold)
"'自掏腰包补贴'策略 — 对中国模型厂商的公开押注" (16pt, #444)

Card 2 (thin RED border, FLAT):
Header: "战略意义" (bold, 18pt, #1A1A1A)
"OpenClaw = 国产AI模型海外认知的关键渠道" (16pt, #444)
"开源项目在算力成本敏感环境下的务实选择" (16pt, #444)
"中国模型全球竞争力的标志性事件" (16pt, #444)

Stat callout at bottom: "$0" (Manrope, 48pt, bold, #C7000B) / "用户使用Kimi K2.5的成本" (14pt, #666)

RIGHT SIDE — LARGE wireframe illustration:
A world map wireframe with connection arcs. China region highlighted with RED (#C7000B) accent — showing AI model nodes (labeled "Kimi", "Minimax") radiating outward. Connection arcs reach to North America, Europe, Southeast Asia. At the endpoints: developer workspace wireframes (monitors with code). A large OpenClaw lobster claw wireframe sits at the intersection point, acting as the bridge/gateway. Dollar signs with downward arrows near the connection lines indicating cost reduction. The flow is clearly CHINA → WORLD via OpenClaw. Charcoal gray with RED accents on China nodes and the claw. Large, detailed.`
},

// ═══ SLIDE 8: 三重结构性驱动力 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "为什么是现在：三重结构性驱动力"

LAYOUT: 3 LARGE cards in a vertical stack, each taking ~30% height. ALL boxes FLAT.

Card 1 (thin RED border, FLAT, slight warm gray bg #FAFAF8):
LEFT ~30%: LARGE wireframe illustration of a clock/timing mechanism with gears, showing the moment hand striking the right position. AI brain wireframe emerging from the center. RED accent on the key gear.
RIGHT ~65%:
Header: "① 市场时机精准切入" (bold, 20pt, #1A1A1A)
"ReAct、Function Calling、多Agent协作技术成熟" (16pt, #444)
"但缺乏让普通用户直接体验的消费级产品" (16pt, #444)
"OpenClaw精准填补'能做事的AI'空白" (16pt, #C7000B, bold)

Card 2 (thin RED border, FLAT, slight warm gray bg #FAFAF8):
LEFT ~30%: LARGE wireframe illustration of a shield with a lock, cracking open. Data streams flowing from a cloud toward a local device (Mac Mini wireframe). The shield represents "user control". RED accent on the shield.
RIGHT ~65%:
Header: "② 用户情绪反弹" (bold, 20pt, #1A1A1A)
"对云端AI黑箱化的疲劳与焦虑" (16pt, #444)
Stat row: "47% 隐私保障 | 28% 避免锁定 | 21% 技术可控 | 6% 功能" (14pt, #C7000B)
"'你的数据，你的控制' — 核心记忆点" (16pt, #444)

Card 3 (thin RED border, FLAT, slight warm gray bg #FAFAF8):
LEFT ~30%: LARGE wireframe illustration showing a spectrum/scale with Siri/Alexa on one end (voice bubble wireframe) and Claude Code/Cursor on the other end (terminal wireframe). OpenClaw positioned perfectly in the middle zone, highlighted with RED accent.
RIGHT ~65%:
Header: "③ 差异化中间路线" (bold, 20pt, #1A1A1A)
"vs Siri/Alexa: 文本交互降低门槛" (16pt, #444)
"vs ChatGPT: 增加执行层，从'建议'到'行动'" (16pt, #444)
"vs Claude Code/Cursor: 面向普通用户" (16pt, #444)`
},

// ═══ SLIDE 9: AI原生OS ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "AI原生OS：从工具到操作系统"

LAYOUT: LEFT ~50% text + stats, RIGHT ~45% wireframe. ALL boxes FLAT.

LEFT SIDE:

Key insight (bold, 18pt, #C7000B): "OpenClaw不是App，是AI OS — 吸纳而非替代现有工具"

3 stat callouts in a row:
"5,700+" (Manrope, 40pt, bold, #C7000B) / "ClawHub Skills" (12pt, #666)
"900+" (Manrope, 40pt, bold, #1A1A1A) / "Contributors" (12pt, #666)
"6+" (Manrope, 40pt, bold, #1A1A1A) / "平台集成" (12pt, #666)

Card (thin RED border, FLAT):
Header: "寒武纪大爆发" (bold, 18pt, #1A1A1A)
"OpenClaw 150K+ | OpenCode 95K+ | OpenHands 65K+" (14pt, #444)
"Cline 30K+ | Continue 20K+ | Aider 12.9K+" (14pt, #444)
"增长以周计，非年计" (14pt, #C7000B, bold)

Card (thin RED border, FLAT):
Header: "非技术参与" (bold, 18pt, #1A1A1A)
"首次非技术人员能贡献开源" (16pt, #444)
"用自然语言写Skills = 新时代的App开发" (16pt, #444)
"AI赋能个人开发者挑战企业级项目" (16pt, #444)

RIGHT SIDE — LARGE wireframe illustration:
A layered OS architecture diagram in wireframe. At the bottom: hardware layer (Mac Mini, phone, server outlines). Middle: OpenClaw core engine (large lobster claw wireframe with circuit patterns inside). Above: an APP STORE-like grid of skill cards labeled "ClawHub" — small rectangles with tiny icons (email, code, calendar, search, translate). At the very top: platform icons in wireframe (WhatsApp, Telegram, Discord, Slack, iMessage, Signal). Connection lines flow from platforms down through ClawHub through the engine to hardware. RED (#C7000B) accent on the core engine and key skill cards. Charcoal gray. Large, detailed.`
},

// ═══ SLIDE 10: 对华为云的影响与机会 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "对华为云的影响与机会"

LAYOUT: TOP — key insight bar, MIDDLE — 2x2 grid of 4 cards, BOTTOM — strategic callout. ALL boxes FLAT.

TOP — Key insight bar (full width, light red bg #FFF0F0, thin RED left border):
"OpenClaw证明：AI推理负载正在从云端向终端迁移 — 这不是威胁，而是华为云的结构性机遇" (bold, 16pt, #C7000B)

MIDDLE — 2×2 grid of 4 cards:

Card TOP-LEFT (thin RED border, FLAT):
Header: "挑战：本地优先的冲击" (bold, 18pt, #1A1A1A)
"47%用户选择OpenClaw因为'数据隐私'" (16pt, #444)
"Mac Mini + 本地模型 = 零云端依赖" (16pt, #444)
"传统IaaS/PaaS的推理收入面临分流" (16pt, #C7000B)

Card TOP-RIGHT (thin RED border, FLAT):
Header: "机会①：混合云+边缘推理" (bold, 18pt, #1A1A1A)
"华为云 + 鲲鹏/Ascend边缘盒子" (16pt, #444)
"重推理在端侧，训练+微调在云端" (16pt, #444)
"'数据不出域'合规架构 — 政企刚需" (16pt, #444)

Card BOTTOM-LEFT (thin RED border, FLAT):
Header: "机会②：Agent托管平台" (bold, 18pt, #1A1A1A)
"ClawHub有5,700+ Skills需要运行环境" (16pt, #444)
"华为云ModelArts → Agent编排+调度平台" (16pt, #444)
"Serverless Agent推理 = 新计费模式" (16pt, #444)

Card BOTTOM-RIGHT (thin RED border, FLAT):
Header: "机会③：模型分发枢纽" (bold, 18pt, #1A1A1A)
"Kimi K2.5通过OpenClaw获得全球用户" (16pt, #444)
"华为云可成为中国模型出海的基础设施" (16pt, #444)
"盘古模型 + 华为云API = 开源Agent生态入口" (16pt, #C7000B, bold)

BOTTOM — Strategic callout (full width, bold):
"华为云的定位：不是与Mac Mini竞争 — 而是成为Agent时代的'水电煤'基础设施" (bold, 16pt, #1A1A1A)

NO separate illustration — the 2×2 grid with content IS the visual layout. Keep clean and structured.`
},

// ═══ SLIDE 11: 去中心算力 vs 中心化算力 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "去中心算力 vs 中心化算力：新竞争格局"

LAYOUT: LEFT ~50% content, RIGHT ~45% LARGE wireframe illustration. ALL boxes FLAT.

LEFT SIDE:

Key framing (bold, 16pt, #C7000B):
"OpenClaw引爆的不只是一个产品 — 而是一场算力架构革命"

Card 1 (thin RED border, FLAT):
Header: "去中心化阵营" (bold, 18pt, #1A1A1A)
"Mac Mini集群 / 个人PC / 手机NPU" (16pt, #444)
"本地模型推理: Ollama, llama.cpp, MLX" (16pt, #444)
"用户数据永不离开设备 — 隐私原生" (16pt, #444)
"成本: 一次性硬件投入, 无月费" (16pt, #444)
Weakness: "单点算力有限, 无法训练大模型" (14pt, #888)

Card 2 (thin RED border, FLAT):
Header: "中心化阵营" (bold, 18pt, #1A1A1A)
"GPU数据中心 / 云端API / 超大规模集群" (16pt, #444)
"训练+微调+高并发推理的唯一选择" (16pt, #444)
"企业级SLA, 弹性扩缩" (16pt, #444)
"成本: 按量付费, 规模效应" (16pt, #444)
Weakness: "数据隐私争议, 厂商锁定" (14pt, #888)

Card 3 (thin RED border, FLAT, highlighted):
Header: "华为的答案：混合架构" (bold, 18pt, #C7000B)
"Ascend云端训练 + Kirin端侧推理 + 鲲鹏边缘盒子" (16pt, #444)
"全球唯一从云到端全栈自研的算力提供商" (16pt, #C7000B, bold)
"'算力如水' — 按需流动到最合适的位置" (16pt, #444)

RIGHT SIDE — LARGE wireframe illustration (takes full 45% width):
A SPLIT-SCENE composition. TOP HALF: a massive wireframe data center — server rack rows, cooling towers, network switches, thick cable bundles. A large label "CENTRALIZED" in uppercase. Red accent on central GPU cluster node. BOTTOM HALF: a distributed mesh of small device wireframes — Mac Minis, laptops, phones, edge boxes — all interconnected by thin peer-to-peer lines forming a decentralized web. A large label "DECENTRALIZED" in uppercase. In the MIDDLE where the two halves meet: a BRIDGE element — a Huawei Cloud logo outline (stylized "H" or cloud shape) with RED (#C7000B) accent, acting as the connector between both worlds. Arrows flow both directions through the bridge. Above the bridge: "HYBRID" label. The visual message: Huawei bridges both paradigms. Charcoal gray lines with RED accents on the Huawei bridge and key nodes. Large, detailed.`
},

// ═══ SLIDE 12: 华为云 vs 阿里云 竞争策略 (DATA) ═══
{
  style: "data",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "华为云 vs 阿里云：OpenClaw竞争策略"

LAYOUT: TOP — 2 positioning cards side by side, BOTTOM — comparison table. ALL boxes FLAT.

TOP ROW — 2 equal-width cards side by side with small gap:

Card LEFT (thin BLUE border #0077B6, FLAT, light blue-gray bg #F0F4F8):
Small label: "阿里云" (bold, 14pt, #0077B6)
Header: "个人智能体普惠者" (bold, 20pt, #1A1A1A)
"口号: '5分钟拥有专属AI助手'" (14pt, #444)
"C端切入: 无影AgentBay + 一键部署" (14pt, #444)
"5种部署方案，12分钟完成" (14pt, #444)
"百炼大模型 (qwen3系列)" (14pt, #444)
Bottom: "个人智能体的AWS — 追求普惠和规模" (bold, 13pt, #0077B6)

Card RIGHT (thin RED border #C7000B, FLAT, light warm bg #FFF8F5):
Small label: "华为云" (bold, 14pt, #C7000B)
Header: "企业级智能体赋能者" (bold, 20pt, #1A1A1A)
"口号: '行业智能体解决方案'" (14pt, #444)
"B端深耕: AgentArts + MCP协议生态" (14pt, #444)
"80+官方预置MCP工具" (14pt, #444)
"盘古大模型" (14pt, #444)
Bottom: "企业智能体的Azure — 追求深度和价值" (bold, 13pt, #C7000B)

BOTTOM — COMPARISON TABLE (RED header row #C7000B with white text, alternating rows):
维度 | 阿里云 | 华为云
部署模式 | 云端优先，"无需本地算力" | 混合部署，本地+云端协同
协议支持 | OpenClaw原生协议 | MCP协议 (标准化)
工具生态 | 依赖社区插件 | 80+官方预置工具
目标用户 | 个人开发者+小团队 | 中大型企业+行业客户
核心优势 | 部署便捷、成本低廉 | 安全合规、行业适配
核心劣势 | 企业级能力弱 | 部署门槛高、成本较高

Bottom insight: "差异化不是零和博弈，而是市场分层的自然结果" (bold, 14pt, #1A1A1A)`
},

// ═══ SLIDE 13: 竞争格局预测与华为云战略 ═══
{
  style: "normal",
  prompt: `TITLE (top-left, bold, #1A1A1A, Noto Sans SC, 24pt): "竞争格局预测与华为云行动路线"

LAYOUT: LEFT ~50% timeline + predictions, RIGHT ~45% LARGE wireframe illustration. ALL boxes FLAT.

LEFT SIDE:

Timeline with 3 phases (vertical, top to bottom):

Phase 1 (thin RED border card, FLAT):
Badge: "短期 2026-2027" (bold, 16pt, white text on #C7000B bg, inline badge)
"阿里云: 个人智能体市场70%+份额" (14pt, #444)
"华为云: 企业级智能体市场50%+份额" (14pt, #444)
"市场自然分化，各守优势领域" (14pt, #666)

Phase 2 (thin RED border card, FLAT):
Badge: "中期 2028-2029" (bold, 16pt, white text on #D4A843 gold bg, inline badge)
"阿里云推出企业版AgentBay" (14pt, #444)
"华为云发布个人版AgentArts" (14pt, #444)
"双方在MCP协议上达成兼容" (14pt, #C7000B, bold)

Phase 3 (thin RED border card, FLAT):
Badge: "长期 2030+" (bold, 16pt, white text on #1A1A1A bg, inline badge)
"胜负手: 谁拥有更强大的MCP工具生态" (14pt, #444)
"阿里云: 从C端向B端渗透" (14pt, #444)
"华为云: 从B端向C端延伸" (14pt, #444)

Bottom — 华为云行动建议 (bold header, red left border card):
Header: "华为云三步走" (bold, 18pt, #C7000B)
"① 降低门槛: 推出一键部署个人版 + 免费试用" (14pt, #444)
"② 激活生态: 开发者大赛 + MCP工具市场" (14pt, #444)
"③ 云原生: Serverless Agent运行时" (14pt, #444)

Key variable callout (bold, 14pt, #C7000B):
"关键变量: OpenClaw社区是否官方支持MCP — 决定华为云能否'标准化超车'"

RIGHT SIDE — LARGE wireframe illustration (takes full 45% width):
A CONVERGING PATHS wireframe. Two roads/paths starting from opposite sides of the illustration — one labeled "C端" (starting from bottom-left, blue tint) and one labeled "B端" (starting from top-right, red tint). The paths converge toward a central meeting point in the middle-right area. At the convergence: a large hexagonal node labeled "MCP" in wireframe, glowing with RED accent. Along the C端 path: small wireframe icons of individuals, phones, Mac Minis. Along the B端 path: wireframe icons of office buildings, server racks, factory. Where they converge: merged ecosystem with both individual and enterprise elements. Above: a timeline arrow from "2026" to "2030+". The visual message: two different starting points converging on a shared standard. Charcoal gray with RED accents on the MCP convergence point and Huawei elements. Large, detailed.`
},

// ═══ SLIDE 14: CONCLUSION (COVER STYLE) ═══
{
  style: "cover",
  prompt: `TITLE (center, bold, WHITE, Noto Sans SC, 36pt): "开源AI的范式转移"
SUBTITLE (center, below title, #D4A843 gold, 18pt): "技术不再稀缺时，社区构建和文化叙事成为新护城河"

NO footer. NO page number.

MIDDLE SECTION — 4 short lines of text, centered, WHITE, Noto Sans SC, 16pt, 1.5 line spacing:
"1985 Stallman: 自由软件运动"
"1991 Torvalds: 黑客精英主义"
"2001 Wales: 信息民主化"
"2025 Steinberger: 捍卫人类价值" ← this line in #C7000B RED, bold

BOTTOM — centered, 14pt, #888:
"'你的数据，你的控制' — 后云端时代的技术主权宣言"

ILLUSTRATION (background, atmospheric, LARGE):
Dark space with a LARGE wireframe lobster claw at center, ~40% opacity. The claw is detailed — segments, joints, texture lines all in wireframe. Inside the claw: a glowing network of interconnected nodes representing the OpenClaw ecosystem. From the claw, 4 timeline branches extend outward (one for each era: 1985, 1991, 2001, 2025), each ending in a small icon wireframe (scroll, penguin, globe, lobster). The 2025 branch is highlighted in RED (#C7000B) while others are in gray. Constellation dots scattered in the background. Dark black (#1A1A1A). Bold, atmospheric, conclusive.`
},

];

// ─── GENERATION ENGINE ──────────────────────────────────────────────
async function genSlide(ai, idx) {
  const s = slides[idx];
  const outFile = path.join(SLIDE_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);

  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`Cached: slide ${idx + 1}`);
    return outFile;
  }

  const prefix = s.style === "cover" ? STYLE_COVER : s.style === "data" ? STYLE_DATA : STYLE;
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
  const TOTAL = slides.length;

  console.log(`Generating ${TOTAL} slides at 4K with ${CONCURRENCY} workers...`);
  const paths = new Array(TOTAL).fill(null);

  // Parallel generation with concurrency limit
  const queue = [...Array(TOTAL).keys()];
  async function worker() {
    while (queue.length > 0) {
      const idx = queue.shift();
      if (idx === undefined) break;
      paths[idx] = await genSlide(ai, idx);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

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

  const outFile = "OpenClaw深度解析.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${TOTAL} slides)`);
}

main().catch(err => console.error("Fatal:", err));
