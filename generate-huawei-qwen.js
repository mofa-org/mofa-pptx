const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const https = require("https");

const QWEN_KEY = process.argv[2] || process.env.DASHSCOPE_API_KEY || "";
const QWEN_DIR = "slides-huawei-qwen";
const SW = 13.333, SH = 7.5;

// ─── HUAWEI STYLE PREFIX ────────────────────────────────────────────
const HUAWEI_STYLE = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Clean white (#FFFFFF) background.

HEADER: A bold red (#CE0E2D) horizontal bar at the TOP of the slide, spanning full width, approximately 80-90px tall. The slide title goes INSIDE this red bar in WHITE BOLD text, LEFT-ALIGNED with ~40px left padding. Title font size EXACTLY 28pt bold.

COLOR SCHEME — Huawei corporate style:
- Primary Red: #CE0E2D (headers, key stats, emphasis, borders of important boxes)
- Black: #000000 (main body text)
- Dark Gray: #333333 (secondary text)
- Light Gray: #F5F5F5 (box backgrounds, alternating rows)
- White: #FFFFFF (slide background, text on red)

TYPOGRAPHY (STRICT):
- ALL Chinese text MUST use 微软雅黑 (Microsoft YaHei) font. No exceptions.
- ALL English text MUST also use Microsoft YaHei or Arial. No exceptions.
- Title: 28pt bold white on red bar, LEFT-ALIGNED.
- Body text: 14-16pt regular, black (#000000).
- Key stats/numbers: 24-32pt bold, red (#CE0E2D).

LAYOUT RULES (CRITICAL):
- DENSE, INFORMATION-PACKED. Every pixel carries information.
- Content in COLORED BOXES/CARDS in tight grids.
- Boxes have thin borders (1px #CCCCCC or #CE0E2D for emphasis).
- NO decorative elements, NO artistic flourishes, NO watermarks.
- NO page numbers.
- Pure CORPORATE DATA PRESENTATION. Huawei internal strategy deck style.`;

// ─── 5 SLIDE PROMPTS ────────────────────────────────────────────────
const slides = [
  `${HUAWEI_STYLE}

TITLE (in red bar): "华为加入AAIF战略建议 | Huawei AAIF Strategic Recommendation"

TOP — red-bordered box: Large bold "建议：华为应立即加入智能体AI基金会（AAIF）" with "⚡ 战略优先级：最高"

Four boxes in 2×2 grid:
BOX 1 "背景 Context": "2025年12月Linux基金会成立AAIF" "Anthropic捐赠MCP，OpenAI捐赠AGENTS.md" "Google、Microsoft、Amazon已加入" "标准正在被制定—缺席即被边缘化"
BOX 2 "紧迫性 Urgency": "标准窗口期：6-12个月" "MCP已成事实标准，3000+服务器" "HarmonyOS智能体需要标准兼容"
BOX 3 "核心收益 Benefits": "参与制定全球智能体协议标准" "将鸿蒙生态纳入标准考量" "获取最前沿技术洞察"
BOX 4 "风险评估 Risk": "不加入：标准排除，生态孤立" "加入：投入有限，收益巨大" "竞争对手已全部入局"

Bottom: "报告日期：2026年2月 | 目标受众：华为高管决策层"`,

  `${HUAWEI_STYLE}

TITLE (in red bar): "AAIF全景：智能体AI基金会 | The Agentic AI Foundation"

TOP: "Linux Foundation Agentic AI Foundation (AAIF)" "成立：2025年12月 | 托管：Linux基金会 | 定位：全球智能体AI标准制定"

Three columns:
COLUMN 1 "核心协议 Core Protocols" (3 founding projects):
"MCP (Model Context Protocol)" — "Anthropic捐赠，3000+服务器，已成事实标准"
"goose" — "Block捐赠，开源AI开发者智能体框架"
"AGENTS.md" — "OpenAI捐赠，项目级智能体指令规范"

COLUMN 2 "白金创始成员 8 Platinum Founding Members" (show all 8 in two sub-columns):
LEFT: "Anthropic — MCP发明者" "OpenAI — AGENTS.md发明者" "Google — Gemini, TPU" "Microsoft — Azure, Copilot"
RIGHT: "Amazon (AWS) — Bedrock" "Block — goose发明者" "Bloomberg — 金融AI" "Cloudflare — 边缘AI"
Red tag: "八大白金创始成员"

COLUMN 3 "标准化方向 Standardization":
"智能体通信协议" "工具调用规范" "安全与信任框架" "多智能体协作" "上下文管理" "可观测性"

Bottom red box: "关键洞察：AAIF正在定义智能体时代的TCP/IP — 谁制定标准，谁掌控生态"`,

  `${HUAWEI_STYLE}

TITLE (in red bar): "不加入的代价：战略风险分析 | Cost of Inaction"

TOP red alert banner: "⚠ 核心风险：标准排除 = 生态孤立 = 市场边缘化"

Five risk boxes vertically:
RISK 1 "协议不兼容 Protocol Incompatibility" Risk:极高 — "MCP成为全球标准后鸿蒙智能体无法与国际生态互通" "影响：鸿蒙智能体生态沦为孤岛"
RISK 2 "技术滞后 Technology Lag" Risk:高 — "无法获取最新智能体架构洞察" "影响：技术路线偏离主流，纠错成本极高"
RISK 3 "开发者流失 Developer Exodus" Risk:高 — "开发者选择MCP标准化平台" "影响：应用生态无法形成正循环"
RISK 4 "客户信任损失 Trust Loss" Risk:中高 — "企业客户要求标准兼容性" "影响：政企客户转向兼容标准的竞品"
RISK 5 "战略被动 Strategic Passivity" Risk:极高 — "标准由竞争对手主导，华为利益未被考虑" "影响：从标准制定者沦为标准跟随者"

Bottom: "历史教训：Android早期标准制定中的缺席，导致多年被动追赶"`,

  `${HUAWEI_STYLE}

TITLE (in red bar): "加入AAIF的战略收益 | Strategic Benefits of Joining"

TOP — three big red stat boxes:
"第1 标准话语权" "3000+ MCP生态" "6-12月 窗口期"

Four boxes in 2×2 grid:
BOX 1 "标准影响力": "将鸿蒙分布式能力纳入协议" "确保MCP支持华为硬件" "推动NPU优化的智能体标准" "参与安全框架制定"
BOX 2 "生态扩展": "鸿蒙应用获得MCP兼容性" "第三方智能体无缝运行在华为设备" "华为云获国际标准认证" "开发者工具链与全球接轨"
BOX 3 "技术洞察": "获取Anthropic/OpenAI最新架构" "参与多智能体协作标准" "提前了解协议演进方向"
BOX 4 "商业机会": "华为云MCP认证服务" "鸿蒙智能体平台国际推广" "主权AI方案的标准化输出"

Bottom comparison: Red "不加入：被动、孤立、追赶" vs Green "加入：主动、融合、引领"`,

  `${HUAWEI_STYLE}

TITLE (in red bar): "建议行动计划 | Recommended Action Plan"

Horizontal timeline with 4 phase boxes in red-to-black gradient:
PHASE 1 "立即(1-2周)": "高管批准加入" "指定AAIF负责人" "提交成员申请"
PHASE 2 "短期(1-3月)": "组建工作组5-8人" "参与MCP标准讨论" "鸿蒙MCP适配POC"
PHASE 3 "中期(3-6月)": "发布鸿蒙MCP SDK" "华为云智能体认证" "举办开发者大会"
PHASE 4 "长期(6-12月)": "成为AAIF核心贡献者" "生态全面标准化" "引领下一代协议"

Resource box: "人力~20人 | 资金$500K-1M/年 | 预期ROI：生态价值>>投入成本"

Bottom red decision box: "决策建议：立即批准加入AAIF，抢占智能体标准制定的关键窗口"
"签批：_____ 日期：_____"`,
];

// ─── DashScope OpenAI-compatible API with qwen-max ──────────────────
function callQwenMax(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "qwen-max",
      messages: [
        {
          role: "system",
          content: "You are an image generation assistant. Generate images based on user descriptions."
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt }
          ]
        }
      ],
      modalities: ["text", "image"],
      stream: false,
    });

    const req = https.request({
      hostname: "dashscope.aliyuncs.com",
      path: "/compatible-mode/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${QWEN_KEY}`,
        "Content-Length": Buffer.byteLength(body),
      },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("Parse error: " + data.slice(0, 500)));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ─── DashScope text2image API (fallback models) ─────────────────────
function callText2Image(model, prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model,
      input: { prompt },
      parameters: { size: "1664*928", n: 1 },
    });

    const req = https.request({
      hostname: "dashscope.aliyuncs.com",
      path: "/api/v1/services/aigc/text2image/image-synthesis",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${QWEN_KEY}`,
        "X-DashScope-Async": "enable",
        "Content-Length": Buffer.byteLength(body),
      },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("Parse: " + data.slice(0, 500)));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function pollTask(taskId) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: "dashscope.aliyuncs.com",
      path: `/api/v1/tasks/${taskId}`,
      method: "GET",
      headers: { "Authorization": `Bearer ${QWEN_KEY}` },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error("Poll: " + data.slice(0, 300))); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function downloadUrl(url, outFile) {
  return new Promise((resolve, reject) => {
    const get = (u) => {
      const mod = u.startsWith("https") ? https : require("http");
      mod.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(res.headers.location); return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          fs.writeFileSync(outFile, Buffer.concat(chunks));
          resolve(outFile);
        });
      }).on("error", reject);
    };
    get(url);
  });
}

// Extract image from various response formats
function extractImage(resp, outFile) {
  // OpenAI-compatible format: choices[].message.content with image_url
  const content = resp.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    for (const part of content) {
      if (part.type === "image_url" && part.image_url?.url) {
        const url = part.image_url.url;
        if (url.startsWith("data:")) {
          const b64 = url.replace(/^data:image\/\w+;base64,/, "");
          fs.writeFileSync(outFile, Buffer.from(b64, "base64"));
          return outFile;
        }
        return downloadUrl(url, outFile);
      }
      if (part.image) {
        return downloadUrl(part.image, outFile);
      }
    }
  }
  // text2image format: output.results[].url
  if (resp.output?.results?.[0]?.url) {
    return downloadUrl(resp.output.results[0].url, outFile);
  }
  // task-based format
  if (resp.output?.task_id) {
    return resp.output.task_id; // return task_id for polling
  }
  return null;
}

async function genSlide(idx) {
  const outFile = path.join(QWEN_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`[QW] Cached: slide ${idx + 1}`);
    return outFile;
  }

  const prompt = slides[idx];

  // Attempt 1: qwen-max via chat completions
  console.log(`[QW] Slide ${idx + 1}: trying qwen-max...`);
  try {
    const resp = await callQwenMax(prompt);
    const result = extractImage(resp, outFile);
    if (result && typeof result === "string" && result !== outFile) {
      // It's a download promise
      await result;
    }
    if (fs.existsSync(outFile) && fs.statSync(outFile).size > 5000) {
      console.log(`[QW] Slide ${idx + 1}: qwen-max OK (${(fs.statSync(outFile).size / 1024).toFixed(0)}KB)`);
      return outFile;
    }
    console.log(`[QW] Slide ${idx + 1}: qwen-max returned text, trying qwen-image-plus...`);
  } catch (err) {
    console.log(`[QW] Slide ${idx + 1}: qwen-max error — ${err.message?.slice(0, 150)}`);
  }

  // Attempt 2: qwen-image-plus via text2image
  const fallbackModels = ["qwen-image-max", "qwen-image-plus", "wanx2.1-t2i-plus"];
  for (const model of fallbackModels) {
    try {
      console.log(`[QW] Slide ${idx + 1}: trying ${model}...`);
      const resp = await callText2Image(model, prompt);

      if (resp.output?.task_id) {
        const taskId = resp.output.task_id;
        for (let poll = 0; poll < 60; poll++) {
          await new Promise(r => setTimeout(r, 3000));
          const status = await pollTask(taskId);
          if (status.output?.task_status === "SUCCEEDED") {
            const url = status.output?.results?.[0]?.url;
            if (url) {
              await downloadUrl(url, outFile);
              console.log(`[QW] Slide ${idx + 1}: ${model} OK (${(fs.statSync(outFile).size / 1024).toFixed(0)}KB)`);
              return outFile;
            }
          } else if (status.output?.task_status === "FAILED") {
            console.log(`[QW] Slide ${idx + 1}: ${model} task failed`);
            break;
          }
        }
      }
    } catch (err) {
      console.log(`[QW] Slide ${idx + 1}: ${model} error — ${err.message?.slice(0, 150)}`);
    }
  }

  console.log(`[QW] Slide ${idx + 1}: ALL MODELS FAILED`);
  return null;
}

async function main() {
  if (!QWEN_KEY) {
    console.error("Usage: node generate-huawei-qwen.js DASHSCOPE_API_KEY");
    process.exit(1);
  }

  if (!fs.existsSync(QWEN_DIR)) fs.mkdirSync(QWEN_DIR);

  console.log(`=== Generating 5 Huawei AAIF slides with Qwen ===\n`);
  const paths = [];
  for (let i = 0; i < slides.length; i++) {
    const p = await genSlide(i);
    paths.push(p);
    if (i < slides.length - 1) await new Promise(r => setTimeout(r, 2000));
  }

  const ok = paths.filter(Boolean).length;
  if (ok > 0) {
    console.log("\nBuilding PPTX...");
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
    await pptx.writeFile({ fileName: "Huawei_AAIF_Qwen.pptx" });
    console.log(`Done: Huawei_AAIF_Qwen.pptx (${ok}/5 slides)`);
  } else {
    console.log("\nNo slides generated. Qwen models may not support text-to-slide image generation.");
    console.log("NB Pro (Gemini) remains the recommended model for slide generation.");
  }
}

main().catch(err => console.error("Fatal:", err));
