const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const DIR = "tectonic-assets";
const WHALE = path.join(DIR, "whale-sketch.png");

const SW = 13.333, SH = 7.5;

async function genSketch(ai, prompt, file) {
  const out = path.join(DIR, file);
  if (fs.existsSync(out) && fs.statSync(out).size > 5000) {
    console.log("Cached:", file);
    return out;
  }
  for (let a = 1; a <= 3; a++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseModalities: ["IMAGE", "TEXT"] },
      });
      for (const p of (res.candidates?.[0]?.content?.parts || [])) {
        if (p.inlineData) {
          const buf = Buffer.from(p.inlineData.data, "base64");
          fs.writeFileSync(out, buf);
          console.log(`OK: ${file} (${(buf.length / 1024).toFixed(0)}KB)`);
          return out;
        }
      }
      console.log(`No image, attempt ${a}/3`);
    } catch (err) {
      console.log(`Error ${a}/3: ${err.message?.slice(0, 200)}`);
      if (a < 3) await new Promise(r => setTimeout(r, 15000));
    }
  }
  return null;
}

async function makeBg() {
  const p = path.join(DIR, "bg-nearwhite.png");
  if (fs.existsSync(p)) return p;
  const w = 1920, h = 1080, buf = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = (x + y) / (w + h);
      const i = (y * w + x) * 3;
      buf[i]   = Math.round(250 - t * 6);   // R
      buf[i+1] = Math.round(248 - t * 6);   // G
      buf[i+2] = Math.round(253 - t * 3);   // B
    }
  }
  await sharp(buf, { raw: { width: w, height: h, channels: 3 } }).png().toFile(p);
  console.log("Background created");
  return p;
}

const STYLE = `Create a minimalist wireframe concept diagram on PURE WHITE (#FFFFFF) background.

STYLE RULES:
- Medium gray (#666666) thin lines ONLY. No black, no color, no fills, no gradients, no shading.
- Clean technical sketch look — like a whiteboard or architect's rough concept drawing.
- Simple geometric shapes: rectangles, circles, rounded rectangles, arrows.
- Small UPPERCASE labels in gray next to diagram elements.
- Generous white space. Do NOT overcrowd. Maximum 10-12 visual elements total.
- Size: 800×600 pixels. Landscape orientation.
- Icons should be simple wireframe outlines (phone = rectangle with rounded corners, brain = circle with small nodes, building = stacked rectangles, etc.)
- Arrows should be thin with simple arrowheads.`;

async function main() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const bgPath = await makeBg();

  // 3 sketch diagrams for SaaS Crisis slide
  const sketches = [
    {
      file: "sketch-vulnerability.png",
      prompt: `${STYLE}

DIAGRAM CONTENT — "Software's Fatal Vulnerability":

LEFT: Draw a tall elegant tower made of 4 stacked rectangular blocks. Inside each block, a tiny icon:
- Top block: cloud outline (labeled "SCALABLE")
- 2nd block: dollar sign (labeled "HIGH MARGIN")
- 3rd block: lightbulb (labeled "PURE IP")
- Bottom block: feather or leaf (labeled "LIGHT ASSET")

RIGHT: A large simple brain icon (circle with 3-4 connection nodes) with a bold arrow pointing LEFT at the tower's base.

Small crack/fracture lines appear at the tower base where the arrow meets it.

Label the brain icon: "AI"

The tower is elegant but visibly fragile. The brain/AI is simple but looks powerful.`
    },
    {
      file: "sketch-compression.png",
      prompt: `${STYLE}

DIAGRAM CONTENT — "Seat Compression":

TOP HALF — "BEFORE":
A row of 5 simple desk icons (rectangle desk + circle head above each). All drawn in solid gray lines. Label: "10 DEVELOPER SEATS"

A large downward arrow in the CENTER of the image.

BOTTOM HALF — "AFTER":
Only 2 desk+head icons on the left (solid gray). On the right, a simple robot/AI icon (rectangle body, antenna, two circle eyes). The other 3 desk positions are shown as faint DOTTED outlines only — ghost seats, fading away.

Label: "2 SEATS + AI AGENTS"

A small meter/gauge icon in bottom-right corner showing "COST" going down (needle pointing left/low).`
    },
    {
      file: "sketch-impact.png",
      prompt: `${STYLE}

DIAGRAM CONTENT — "The $3T Market at Risk":

TOP CENTER: A large circle with "$3T" written inside it. This represents the software market.

From this circle, 3 downward diagonal arrows fan out to 3 small icons below:
- LEFT: A simple enterprise building icon (stacked rectangles), labeled "ENTERPRISE"
- CENTER: A simple cloud icon, labeled "SaaS"
- RIGHT: A simple phone/mobile icon, labeled "MOBILE"

Each of these 3 icons has small zigzag "disruption" crack lines around them.

At the very bottom, a simple horizontal bar chart with 3 bars getting progressively shorter from left to right, suggesting decline. Label: "REVENUE COMPRESSION"

Overall feeling: the money flows down but the foundation is cracking.`
    }
  ];

  console.log("Generating sketch diagrams...");
  const paths = [];
  for (let i = 0; i < sketches.length; i++) {
    paths.push(await genSketch(ai, sketches[i].prompt, sketches[i].file));
    if (i < sketches.length - 1) await new Promise(r => setTimeout(r, 3000));
  }

  // === Assemble PPTX ===
  console.log("Assembling slide...");
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: SW, height: SH });
  pptx.layout = "WIDE";
  const slide = pptx.addSlide();

  // Background
  const bgB64 = "data:image/png;base64," + fs.readFileSync(bgPath, "base64");
  slide.addImage({ data: bgB64, x: 0, y: 0, w: SW, h: SH });

  // Whale watermark (very faint)
  if (fs.existsSync(WHALE)) {
    const whB64 = "data:image/png;base64," + fs.readFileSync(WHALE, "base64");
    slide.addImage({ data: whB64, x: 2.5, y: 0.8, w: 8.5, h: 5.5, transparency: 92 });
  }

  // Title row — English + Chinese inline
  slide.addText([
    { text: "SaaS Crisis & Seat Compression", options: { fontSize: 28, fontFace: "Georgia", color: "1A1A1A", bold: true } },
    { text: "SaaS危机与座位压缩", options: { fontSize: 14, fontFace: "Microsoft YaHei", color: "999999" } },
  ], { x: 0.5, y: 0.2, w: 12.3, h: 0.65, valign: "bottom" });

  // Thin separator line
  slide.addShape("line", {
    x: 0.5, y: 0.95, w: 12.3, h: 0,
    line: { color: "E0DCE8", width: 0.5 },
  });

  // 3 cards
  const cW = 3.9, cH = 5.3, cY = 1.15, gap = 0.22;
  const cX = [0.5, 0.5 + cW + gap, 0.5 + 2 * (cW + gap)];

  const titles = ["Fatal Vulnerability", "Seat Compression", "Market Impact"];
  const bodies = [
    "Traditional software's greatest strengths — pure intellectual capital, light-asset models, infinite scalability — become its fatal weakness when AI can replicate these at near-zero marginal cost.",
    "Per-seat SaaS pricing collapses when one AI agent replaces 3-5 developer seats. Revenue per customer drops 60-80%, forcing the entire industry to find new models.",
    "The $3 trillion software industry faces structural compression across enterprise, SaaS, and mobile. February 2026 marks the inflection where AI-native companies begin displacing incumbents.",
  ];

  for (let i = 0; i < 3; i++) {
    // Card shape
    slide.addShape("rect", {
      x: cX[i], y: cY, w: cW, h: cH,
      fill: { color: "FFFFFF" },
      line: { color: "E8E5ED", width: 0.5 },
      rectRadius: 0.12,
      shadow: { type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.06 },
    });

    // Card title
    slide.addText(titles[i], {
      x: cX[i] + 0.25, y: cY + 0.15, w: cW - 0.5, h: 0.45,
      fontSize: 17, fontFace: "Georgia", color: "1A1A1A", bold: true, valign: "middle",
    });

    // Sketch diagram image
    if (paths[i] && fs.existsSync(paths[i])) {
      const sB64 = "data:image/png;base64," + fs.readFileSync(paths[i], "base64");
      slide.addImage({
        data: sB64,
        x: cX[i] + 0.15, y: cY + 0.7, w: cW - 0.3, h: 2.9,
        sizing: { type: "contain", w: cW - 0.3, h: 2.9 },
      });
    }

    // Body paragraph
    slide.addText(bodies[i], {
      x: cX[i] + 0.25, y: cY + 3.7, w: cW - 0.5, h: 1.4,
      fontSize: 10.5, fontFace: "Calibri", color: "444444",
      valign: "top", lineSpacingMultiple: 1.35,
    });
  }

  // Page number
  slide.addText("2 / 30", {
    x: SW - 1.2, y: SH - 0.35, w: 0.85, h: 0.25,
    fontSize: 8, fontFace: "Calibri", color: "AAAAAA", align: "right",
  });

  await pptx.writeFile({ fileName: "test-slide.pptx" });
  console.log("Done: test-slide.pptx");
}

main().catch(err => console.error("Fatal:", err));
