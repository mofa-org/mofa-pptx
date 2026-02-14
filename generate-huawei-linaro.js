const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const NB_DIR = "slides-huawei-linaro";
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
TITLE (in red bar): "华为加入Linaro核心会员战略建议 | Huawei Linaro Core Membership Recommendation"

MAIN CONTENT — organized in a clean executive summary layout:

TOP SECTION — One wide red-bordered box:
Large bold text: "建议：华为应加入Linaro Core Collective，深化Arm生态核心参与"
English below: "Recommendation: Huawei should join Linaro Core Collective to deepen Arm ecosystem engagement"
Urgency tag in red: "⚡ 战略优先级：高 | Strategic Priority: HIGH"

MIDDLE SECTION — Four equal boxes in a 2×2 grid:

BOX 1 (red left border): "背景 | Context"
"Linaro成立于2010年，是全球最重要的Arm开源协作组织"
"Linux内核Top 10贡献者，累计提交47,000+补丁"
"管理40+个Arm开源项目（OP-TEE、LAVA、工具链）"
"核心成员：Arm、Qualcomm等"

BOX 2 (red left border): "紧迫性 | Urgency"
"鲲鹏/昇腾需要上游Linux内核深度支持"
"HarmonyOS AOSP兼容层依赖Linaro Consumer Group"
"Arm服务器生态标准正在由Linaro Datacenter Group主导"
"竞争对手Qualcomm已是Core Member"

BOX 3 (red left border): "核心收益 | Key Benefits"
"董事会席位 + TSC双票决权"
"影响Linux内核Arm架构方向"
"OP-TEE安全标准参与制定"
"鲲鹏/昇腾上游支持加速"

BOX 4 (red left border): "投入评估 | Investment"
"Core会员年费（按营收比例）"
"派驻工程师5-10人"
"技术投入可直接服务鲲鹏/昇腾"
"投入产出比极高"

BOTTOM SECTION — slim black bar:
"报告日期：2026年2月 | 目标受众：华为高管决策层 | 机密等级：内部"`
},

// SLIDE 2: WHAT IS LINARO
{
  prompt: `
TITLE (in red bar): "Linaro全景：全球Arm开源协作中枢 | Linaro: The Arm Open Source Hub"

MAIN CONTENT:

TOP ROW — One full-width box with light gray background:
Bold: "Linaro Limited — 成立于2010年，总部Cambridge UK"
"定位：Arm生态最大的开源软件工程协作组织 | 使命：消除Arm Linux碎片化"
"Linux内核Top 10贡献者 | 47,000+补丁 | 40+项目 | 200+工程师"

MIDDLE SECTION — Three columns of boxes:

COLUMN 1: "核心项目 | Key Projects"
Red header bar on the box.
Five stacked items with bullet points:
"Linux Kernel — Arm架构核心维护，电源管理，调度器优化"
"OP-TEE — Arm TrustZone可信执行环境，安全启动标准"
"LAVA — 自动化硬件验证测试框架，CI/CD平台"
"工具链 — GCC/LLVM Arm后端优化，性能调优"
"QEMU — Arm虚拟化和仿真支持"

COLUMN 2: "会员层级 | Membership Tiers"
Red header bar.
Three tiers clearly separated:
"Core 核心会员" in bold red — "董事会席位" "TSC双票权" "所有活动全参与" "最高影响力"
"Club 俱乐部会员" — "TSC单票权" "Board选举代表" "广泛参与"
"Group 组别会员" — "特定领域参与" "组别指导委员会投票权"
Current Core members in bold: "Arm Ltd、Qualcomm (QuIC)"

COLUMN 3: "工作组 | Working Groups"
Red header bar.
Five items with descriptions:
"• Consumer Group — AOSP/Android生态维护"
"• Datacenter & Cloud — Arm服务器生态"
"• Edge & Fog (LEDGE) — 边缘计算，可信启动"
"• Windows on Arm — WoA开源生态"
"• IoT & Embedded — 物联网嵌入式"

BOTTOM ROW — Red-bordered insight box:
Bold: "关键洞察：Linaro是Arm Linux的'标准制定工厂' — 内核补丁、安全标准、工具链方向都在这里决定"
English: "Linaro is the 'standards factory' for Arm Linux — kernel patches, security standards, toolchain direction are all decided here"`
},

// SLIDE 3: STRATEGIC RISKS OF NOT JOINING
{
  prompt: `
TITLE (in red bar): "不加入的代价：战略风险分析 | Cost of Inaction: Strategic Risk Analysis"

MAIN CONTENT:

TOP SECTION — Full-width red alert box:
Large bold white text on red background: "⚠ 核心风险：上游缺席 = 内核支持滞后 = 鲲鹏/昇腾生态受阻"

MIDDLE SECTION — Five risk boxes arranged vertically, each with red left border and risk level indicator:

RISK 1: "内核支持滞后 | Kernel Support Lag" — Risk: 极高
"鲲鹏920/昇腾310/910补丁合入上游Linux内核速度慢"
"缺乏Linaro核心维护者推动，补丁Review周期长"
"影响：鲲鹏服务器Linux发行版兼容性落后竞品6-12个月"

RISK 2: "安全标准边缘化 | Security Standard Exclusion" — Risk: 高
"OP-TEE/TrustZone标准由Linaro核心成员主导"
"华为安全芯片方案未纳入标准参考实现"
"影响：鲲鹏可信计算方案缺乏国际标准背书"

RISK 3: "工具链优化缺位 | Toolchain Gap" — Risk: 高
"GCC/LLVM Arm后端优化由Linaro工具链团队主导"
"鲲鹏/昇腾特有指令集优化未被上游优先支持"
"影响：编译器对华为芯片的优化落后于Qualcomm/Arm"

RISK 4: "服务器生态落后 | Server Ecosystem Lag" — Risk: 中高
"Linaro Datacenter Group定义Arm服务器参考架构"
"SBSA/SBBR标准合规由Linaro成员协调"
"影响：鲲鹏服务器在企业市场标准认证受阻"

RISK 5: "AOSP兼容性风险 | AOSP Compatibility Risk" — Risk: 高
"Linaro Consumer Group维护AOSP Arm参考实现"
"HarmonyOS AOSP兼容层需要与上游保持同步"
"影响：HarmonyOS Android应用兼容性问题增多"

BOTTOM — Bold black text:
"对比：Qualcomm作为Core Member，其骁龙芯片在上游Linux和AOSP中获得第一时间支持"`
},

// SLIDE 4: STRATEGIC BENEFITS OF JOINING
{
  prompt: `
TITLE (in red bar): "加入Linaro Core的战略收益 | Strategic Benefits of Core Membership"

MAIN CONTENT:

TOP ROW — Three large stat boxes in a row, each with big red number:

STAT 1: Red number "47K+" — "内核补丁" — "直接参与Arm Linux内核开发方向"
STAT 2: Red number "40+" — "开源项目" — "所有Linaro项目全权限参与"
STAT 3: Red number "1席" — "董事会" — "Board席位 + TSC双票决权"

MIDDLE SECTION — Four benefit boxes in 2×2 grid:

BOX 1: "内核与芯片支持 | Kernel & SoC Support"
Red header.
"• 鲲鹏920/930内核补丁获得Linaro维护者直接推动"
"• 昇腾AI芯片Linux驱动上游化加速"
"• Arm架构电源管理、调度器优化惠及华为全系芯片"
"• 内核安全补丁第一时间获取"

BOX 2: "安全与可信计算 | Security & Trust"
Red header.
"• 参与OP-TEE标准制定，将华为TEE方案纳入参考"
"• 可信启动(Trusted Substrate)标准影响力"
"• 鲲鹏可信计算获国际安全标准认证"
"• 安全漏洞早期预警与协同修复"

BOX 3: "工具链与性能 | Toolchain & Performance"
Red header.
"• GCC/LLVM鲲鹏/昇腾后端优化优先级提升"
"• 编译器团队直接协作，定制优化"
"• QEMU虚拟化对鲲鹏的支持增强"
"• LAVA自动化测试框架集成华为硬件"

BOX 4: "生态与商业 | Ecosystem & Business"
Red header.
"• Arm Datacenter Group影响服务器参考架构"
"• AOSP Consumer Group加速HarmonyOS兼容"
"• 与Arm、Qualcomm、Google等核心成员直接协作"
"• 企业客户对鲲鹏Linux支持信心增强"

BOTTOM ROW — Bold comparison box:
LEFT (red background, white text): "不加入：补丁慢审、标准旁观、生态被动"
RIGHT (green/dark background, white text): "加入：上游主导、标准参与、生态引领"`
},

// SLIDE 5: RECOMMENDED ACTION PLAN
{
  prompt: `
TITLE (in red bar): "建议行动计划 | Recommended Action Plan"

MAIN CONTENT:

TOP SECTION — Timeline/Roadmap as a horizontal flow with 4 phases:

PHASE 1 (red box): "立即 | Immediate (1-2周)"
"• 高管层批准加入Linaro Core决策"
"• 与Linaro CEO/BD团队启动入会沟通"
"• 确定华为Linaro联络负责人"

PHASE 2 (dark red box): "短期 | Short-term (1-3月)"
"• 签署Core会员协议"
"• 派驻首批工程师（内核/安全/工具链各2-3人）"
"• 加入Datacenter & Consumer工作组"
"• 提交鲲鹏920内核支持增强提案"

PHASE 3 (dark gray box): "中期 | Medium-term (3-6月)"
"• 董事会席位正式就位，参与战略决策"
"• 推动昇腾AI芯片Linux驱动上游化"
"• 参与OP-TEE安全标准修订"
"• 争取Linaro Connect技术主题演讲"

PHASE 4 (black box): "长期 | Long-term (6-12月)"
"• 成为Arm Linux内核核心贡献者"
"• 鲲鹏LAVA测试实验室纳入Linaro CI"
"• 推动鲲鹏参考架构进入SBSA/SBBR标准"
"• 建立华为-Linaro联合创新实验室"

MIDDLE SECTION — Resource requirements box:
Three columns:
"人力投入 | Headcount": "派驻工程师8-12人（内核4+安全2+工具链3+管理1）"
"资金投入 | Budget": "Core会员年费 + 差旅 + 设备 ≈ $1-2M/年"
"预期回报 | Expected ROI": "鲲鹏上游支持加速50%+ | 安全标准话语权 | 生态价值远超投入"

BOTTOM SECTION — Red bordered decision box:
Large bold text: "决策建议：批准加入Linaro Core Collective，掌握Arm开源生态核心话语权"
English: "Decision: Approve Linaro Core membership to secure influence over the Arm open source ecosystem"
"签批：_____________ 日期：_____________"`
},

];

// ─── NB PRO GENERATION ─────────────────────────────────────────────
async function genSlide(ai, idx) {
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
  if (!fs.existsSync(NB_DIR)) fs.mkdirSync(NB_DIR);
  const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

  console.log(`\n=== Generating ${TOTAL} Huawei Linaro slides with NB Pro ===`);
  const paths = [];
  for (let i = 0; i < slides.length; i++) {
    const p = await genSlide(ai, i);
    paths.push(p);
    if (i < slides.length - 1) await new Promise(r => setTimeout(r, 3000));
  }

  console.log("\nBuilding PPTX...");
  await buildPptx(paths, "Huawei_Linaro_NB.pptx");
}

main().catch(err => console.error("Fatal:", err));
