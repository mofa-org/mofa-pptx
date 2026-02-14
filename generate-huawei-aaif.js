const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");
const https = require("https");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const QWEN_KEY = process.env.DASHSCOPE_API_KEY || process.argv[2] || "";

const NB_DIR = "slides-huawei-nb";
const QWEN_DIR = "slides-huawei-qwen";
const SW = 13.333, SH = 7.5;
const TOTAL = 5;

// ─── HUAWEI STYLE PREFIX ───────────────────────────────────────────
const HUAWEI_STYLE = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Clean white (#FFFFFF) background.

HEADER: A bold red (#CE0E2D) horizontal bar at the TOP of the slide, spanning full width, approximately 80-90px tall. The slide title goes INSIDE this red bar in WHITE BOLD text, LEFT-ALIGNED with ~40px left padding. Title font size EXACTLY 28pt bold.

COLOR SCHEME — Huawei corporate style:
- Primary Red: #CE0E2D (headers, key stats, emphasis, borders of important boxes)
- Black: #000000 (main body text)
- Dark Gray: #333333 (secondary text)
- Light Gray: #F5F5F5 (box backgrounds, alternating rows)
- White: #FFFFFF (slide background, text on red)
- Accent Red: #E60012 (for highlights, arrows, urgent items)

TYPOGRAPHY (STRICT):
- ALL Chinese text MUST use 微软雅黑 (Microsoft YaHei) font. No exceptions.
- ALL English text MUST also use Microsoft YaHei or a clean sans-serif like Arial. No exceptions.
- Title: 28pt bold white on red bar, LEFT-ALIGNED.
- Body text: 14-16pt regular, black (#000000).
- Key stats/numbers: 24-32pt bold, red (#CE0E2D).
- Labels/captions: 12pt, dark gray (#333333).

LAYOUT RULES (CRITICAL):
- DENSE, INFORMATION-PACKED. Every pixel should carry information.
- Content organized in COLORED BOXES/CARDS arranged in tight grids.
- Boxes have thin borders (1px #CCCCCC or #CE0E2D for emphasis).
- Use alternating white/light-gray (#F5F5F5) for rows and sections.
- NO wasted white space. Executive briefing style.
- NO decorative elements, NO artistic flourishes, NO watermarks, NO illustrations.
- NO page numbers.
- Pure CORPORATE DATA PRESENTATION. Think Huawei internal strategy deck.

CRITICAL: This is a Huawei-style executive briefing. Bold, direct, data-rich, red-and-black corporate aesthetic. Information density is paramount.`;

// ─── 5 SLIDE PROMPTS ───────────────────────────────────────────────
const slides = [

// SLIDE 1: COVER / EXECUTIVE SUMMARY
{
  prompt: `
TITLE (in red bar): "华为加入AAIF战略建议 | Huawei AAIF Strategic Recommendation"

MAIN CONTENT — organized in a clean executive summary layout:

TOP SECTION — One wide red-bordered box:
Large bold text: "建议：华为应立即加入智能体AI基金会（AAIF）"
English below: "Recommendation: Huawei should immediately join the Agentic AI Foundation"
Urgency tag in red: "⚡ 战略优先级：最高 | Strategic Priority: HIGHEST"

MIDDLE SECTION — Four equal boxes in a 2×2 grid:

BOX 1 (red left border): "背景 | Context"
"2025年12月，Linux基金会成立AAIF"
"Anthropic捐赠MCP协议，OpenAI捐赠AGENTS.md"
"Google、Microsoft、Amazon已加入"
"智能体标准正在被制定 — 缺席即被边缘化"

BOX 2 (red left border): "紧迫性 | Urgency"
"标准窗口期：6-12个月"
"MCP已成事实标准，3000+ MCP服务器"
"Skills协议正在崛起 (Claude Code)"
"HarmonyOS智能体架构需要标准兼容"

BOX 3 (red left border): "核心收益 | Key Benefits"
"参与制定全球智能体协议标准"
"将鸿蒙生态纳入标准考量"
"获取最前沿技术洞察"
"建立国际合作信任关系"

BOX 4 (red left border): "风险评估 | Risk Assessment"
"不加入：被标准排除，生态孤立"
"加入：投入有限，收益巨大"
"竞争对手已全部入局"
"窗口正在关闭"

BOTTOM SECTION — slim black bar:
"报告日期：2026年2月 | 目标受众：华为高管决策层 | 机密等级：内部"`
},

// SLIDE 2: WHAT IS AAIF
{
  prompt: `
TITLE (in red bar): "AAIF全景：智能体AI基金会 | The Agentic AI Foundation"

MAIN CONTENT:

TOP ROW — One full-width box with light gray background:
Bold: "Linux Foundation Agentic AI Foundation (AAIF)"
"成立时间：2025年12月 | 托管方：Linux基金会 | 定位：全球智能体AI标准制定"

MIDDLE SECTION — Three columns of boxes:

COLUMN 1: "核心协议 | Core Protocols"
Red header bar on the box.
Three stacked items:
"MCP (Model Context Protocol)" — "Anthropic捐赠" — "智能体连接外部工具的标准协议" — "已有3000+服务器实现" — "已成为事实标准"
"goose" — "Block捐赠" — "开源AI开发者智能体" — "可扩展的智能体框架"
"AGENTS.md" — "OpenAI捐赠" — "项目级智能体指令文件" — "定义智能体行为规范"

COLUMN 2: "白金创始成员 | 8 Platinum Founding Members"
Red header bar.
Company names in bold black, stacked in TWO COLUMNS (4 per column) to fit all 8:
LEFT COLUMN:
"Anthropic — MCP发明者"
"OpenAI — AGENTS.md发明者"
"Google — Gemini, TPU"
"Microsoft — Azure, Copilot"
RIGHT COLUMN:
"Amazon (AWS) — Bedrock"
"Block — goose发明者"
"Bloomberg — 金融AI"
"Cloudflare — 边缘AI"
Tag at bottom in red: "八大白金创始成员 | 8 Platinum Founding Members"

COLUMN 3: "标准化方向 | Standardization Areas"
Red header bar.
Six items with bullet points:
"• 智能体通信协议 (Agent Communication)"
"• 工具调用规范 (Tool Use Standards)"
"• 安全与信任框架 (Safety & Trust)"
"• 多智能体协作 (Multi-Agent)"
"• 上下文管理 (Context Management)"
"• 可观测性 (Observability)"

BOTTOM ROW — Red-bordered alert box:
Bold: "关键洞察：AAIF正在定义智能体时代的'TCP/IP' — 谁制定标准，谁掌控生态"
English: "AAIF is defining the 'TCP/IP' of the agent era — whoever sets the standard controls the ecosystem"`
},

// SLIDE 3: STRATEGIC RISKS OF NOT JOINING
{
  prompt: `
TITLE (in red bar): "不加入的代价：战略风险分析 | Cost of Inaction: Strategic Risk Analysis"

MAIN CONTENT:

TOP SECTION — Full-width red alert box:
Large bold white text on red background: "⚠ 核心风险：标准排除 = 生态孤立 = 市场边缘化"

MIDDLE SECTION — Five risk boxes arranged vertically, each with red left border and risk level indicator:

RISK 1: "协议不兼容 | Protocol Incompatibility" — Risk: 极高
"MCP/Skills成为全球标准后，鸿蒙智能体无法与国际生态互通"
"第三方开发者优先支持标准协议，鸿蒙被绕过"
"影响：鸿蒙智能体生态沦为孤岛"

RISK 2: "技术滞后 | Technology Lag" — Risk: 高
"无法获取最新智能体架构洞察"
"竞争对手在标准组织内共享最前沿实践"
"影响：技术路线偏离主流，纠错成本极高"

RISK 3: "开发者流失 | Developer Exodus" — Risk: 高
"开发者选择标准化平台（MCP生态）"
"鸿蒙智能体SDK/工具链被市场忽视"
"影响：应用生态无法形成正循环"

RISK 4: "客户信任损失 | Enterprise Trust Loss" — Risk: 中高
"企业客户要求智能体标准兼容性"
"华为云智能体服务缺乏国际认证"
"影响：政企客户转向兼容标准的竞品"

RISK 5: "战略被动 | Strategic Passivity" — Risk: 极高
"标准由竞争对手主导，华为利益未被考虑"
"事后追赶成本远高于早期参与"
"影响：从标准制定者沦为标准跟随者"

BOTTOM — Bold black text:
"历史教训：Android早期标准制定中的缺席，导致多年被动追赶。AAIF是同等级别的标准窗口。"`
},

// SLIDE 4: STRATEGIC BENEFITS OF JOINING
{
  prompt: `
TITLE (in red bar): "加入AAIF的战略收益 | Strategic Benefits of Joining AAIF"

MAIN CONTENT:

TOP ROW — Three large stat boxes in a row, each with big red number:

STAT 1: Red number "第1" — "标准话语权" — "参与制定全球智能体协议，将华为需求纳入标准"
STAT 2: Red number "3000+" — "MCP生态" — "即时接入3000+智能体工具服务器生态"
STAT 3: Red number "6-12月" — "窗口期" — "标准定型前的关键影响期"

MIDDLE SECTION — Four benefit boxes in 2×2 grid:

BOX 1: "标准影响力 | Standards Influence"
Red header.
"• 将鸿蒙特性（分布式能力、跨设备协同）纳入协议"
"• 确保MCP/Skills支持华为硬件生态"
"• 推动NPU优化的智能体标准"
"• 参与安全框架制定，与华为安全理念对齐"

BOX 2: "生态扩展 | Ecosystem Expansion"
Red header.
"• 鸿蒙应用自动获得MCP兼容性"
"• 第三方智能体无缝运行在华为设备上"
"• 华为云智能体服务获国际标准认证"
"• 开发者工具链与全球生态接轨"

BOX 3: "技术洞察 | Technology Insights"
Red header.
"• 获取Anthropic/OpenAI最新智能体架构"
"• 参与多智能体协作标准讨论"
"• 提前了解协议演进方向"
"• 与全球顶尖AI团队直接交流"

BOX 4: "商业机会 | Business Opportunities"
Red header.
"• 华为云MCP服务器认证服务"
"• 鸿蒙智能体平台国际推广"
"• 政企客户标准兼容需求转化"
"• 主权AI方案的标准化输出"

BOTTOM ROW — Bold comparison box:
LEFT (red background, white text): "不加入：被动、孤立、追赶"
RIGHT (green/dark background, white text): "加入：主动、融合、引领"`
},

// SLIDE 5: RECOMMENDED ACTION PLAN
{
  prompt: `
TITLE (in red bar): "建议行动计划 | Recommended Action Plan"

MAIN CONTENT:

TOP SECTION — Timeline/Roadmap as a horizontal flow with 4 phases:

PHASE 1 (red box): "立即 | Immediate (1-2周)"
"• 高管层批准加入AAIF决策"
"• 指定AAIF联络负责人"
"• 向Linux基金会提交成员申请"

PHASE 2 (dark red box): "短期 | Short-term (1-3月)"
"• 组建AAIF工作组（5-8人）"
"• 参与MCP/Skills标准讨论"
"• 鸿蒙MCP适配POC"
"• 提交首批华为标准提案"

PHASE 3 (dark gray box): "中期 | Medium-term (3-6月)"
"• 发布鸿蒙MCP SDK"
"• 华为云智能体标准认证"
"• 举办华为智能体开发者大会"
"• 推动NPU优化协议纳入标准"

PHASE 4 (black box): "长期 | Long-term (6-12月)"
"• 成为AAIF核心贡献者"
"• 鸿蒙智能体生态全面标准化"
"• 主权AI标准方案国际推广"
"• 引领下一代智能体协议制定"

MIDDLE SECTION — Resource requirements box:
Three columns:
"人力投入 | Headcount": "核心工作组5-8人 + 技术专家10-15人 = ~20人"
"资金投入 | Budget": "Linux基金会会费 + 差旅 + 技术投入 ≈ $500K-1M/年"
"预期回报 | Expected ROI": "生态价值 >> 投入成本，标准话语权无法用金钱衡量"

BOTTOM SECTION — Red bordered decision box:
Large bold text: "决策建议：立即批准加入AAIF，抢占智能体标准制定的关键窗口"
English: "Decision: Approve AAIF membership immediately to secure position in agent standard-setting"
"签批：_____________ 日期：_____________"`
},

];

// ─── NB PRO GENERATION ─────────────────────────────────────────────
async function genSlideNB(ai, idx) {
  const s = slides[idx];
  const outFile = path.join(NB_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);

  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`[NB] Cached: slide ${idx + 1}`);
    return outFile;
  }

  const fullPrompt = HUAWEI_STYLE + "\n\n" + s.prompt;

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
          console.log(`[NB] Slide ${idx + 1}: ${(buf.length / 1024).toFixed(0)}KB`);
          return outFile;
        }
      }
      console.log(`[NB] Slide ${idx + 1}: no image, attempt ${a}/3`);
    } catch (err) {
      console.log(`[NB] Slide ${idx + 1}: error ${a}/3 — ${err.message?.slice(0, 200)}`);
      if (a < 3) await new Promise(r => setTimeout(r, 15000));
    }
  }
  console.log(`[NB] Slide ${idx + 1}: FAILED`);
  return null;
}

// ─── QWEN-MAX GENERATION (DashScope API) ────────────────────────────
function qwenImageGen(prompt, outFile) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "qwen-max-latest",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
      stream: false,
    });

    const opts = {
      hostname: "dashscope.aliyuncs.com",
      path: "/compatible-mode/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${QWEN_KEY}`,
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(opts, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          const j = JSON.parse(data);
          const content = j.choices?.[0]?.message?.content;
          if (Array.isArray(content)) {
            for (const part of content) {
              if (part.type === "image_url" && part.image_url?.url) {
                const b64 = part.image_url.url.replace(/^data:image\/\w+;base64,/, "");
                const buf = Buffer.from(b64, "base64");
                fs.writeFileSync(outFile, buf);
                resolve(outFile);
                return;
              }
            }
          }
          // Try alternative response format
          if (j.output?.results?.[0]?.url) {
            resolve(j.output.results[0].url);
            return;
          }
          reject(new Error("No image in Qwen response: " + data.slice(0, 500)));
        } catch (e) {
          reject(new Error("Parse error: " + e.message + " — " + data.slice(0, 300)));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function genSlideQwen(idx) {
  const s = slides[idx];
  const outFile = path.join(QWEN_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);

  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`[QW] Cached: slide ${idx + 1}`);
    return outFile;
  }

  const fullPrompt = HUAWEI_STYLE + "\n\n" + s.prompt;

  for (let a = 1; a <= 3; a++) {
    try {
      await qwenImageGen(fullPrompt, outFile);
      const sz = fs.existsSync(outFile) ? fs.statSync(outFile).size : 0;
      console.log(`[QW] Slide ${idx + 1}: ${(sz / 1024).toFixed(0)}KB`);
      return outFile;
    } catch (err) {
      console.log(`[QW] Slide ${idx + 1}: error ${a}/3 — ${err.message?.slice(0, 200)}`);
      if (a < 3) await new Promise(r => setTimeout(r, 10000));
    }
  }
  console.log(`[QW] Slide ${idx + 1}: FAILED`);
  return null;
}

// ─── BUILD PPTX ────────────────────────────────────────────────────
async function buildPptx(paths, outFile) {
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

  await pptx.writeFile({ fileName: outFile });
  console.log(`Done: ${outFile} (${paths.filter(Boolean).length}/${TOTAL} slides)`);
}

// ─── MAIN ──────────────────────────────────────────────────────────
async function main() {
  // NB Pro generation
  if (!fs.existsSync(NB_DIR)) fs.mkdirSync(NB_DIR);
  const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

  console.log(`\n=== Generating ${TOTAL} slides with NB Pro ===`);
  const nbPaths = [];
  for (let i = 0; i < slides.length; i++) {
    const p = await genSlideNB(ai, i);
    nbPaths.push(p);
    if (i < slides.length - 1) await new Promise(r => setTimeout(r, 3000));
  }

  console.log("\nBuilding NB Pro PPTX...");
  await buildPptx(nbPaths, "Huawei_AAIF_NB.pptx");

  // Qwen-Max generation
  if (QWEN_KEY) {
    if (!fs.existsSync(QWEN_DIR)) fs.mkdirSync(QWEN_DIR);

    console.log(`\n=== Generating ${TOTAL} slides with Qwen-Max ===`);
    const qwPaths = [];
    for (let i = 0; i < slides.length; i++) {
      const p = await genSlideQwen(i);
      qwPaths.push(p);
      if (i < slides.length - 1) await new Promise(r => setTimeout(r, 2000));
    }

    console.log("\nBuilding Qwen PPTX...");
    await buildPptx(qwPaths, "Huawei_AAIF_Qwen.pptx");
  } else {
    console.log("\n=== Skipping Qwen-Max (no DASHSCOPE_API_KEY) ===");
    console.log("To generate with Qwen-Max, run:");
    console.log("  node generate-huawei-aaif.js YOUR_DASHSCOPE_API_KEY");
    console.log("  or: DASHSCOPE_API_KEY=xxx node generate-huawei-aaif.js");
  }
}

main().catch(err => console.error("Fatal:", err));
