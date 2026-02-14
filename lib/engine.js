const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const SW = 13.333, SH = 7.5;

/**
 * Generate a single slide image via Gemini.
 */
async function genSlide(ai, opts) {
  const { prompt, outFile, imageSize, label } = opts;
  const tag = label || path.basename(outFile, ".png");

  // PNG caching — skip if file >10KB exists
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`Cached: ${tag}`);
    return outFile;
  }

  const config = { responseModalities: ["IMAGE", "TEXT"] };
  if (imageSize) {
    config.imageConfig = { aspectRatio: "16:9", imageSize };
  }

  for (let a = 1; a <= 3; a++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config,
      });
      for (const p of (res.candidates?.[0]?.content?.parts || [])) {
        if (p.inlineData) {
          const buf = Buffer.from(p.inlineData.data, "base64");
          fs.writeFileSync(outFile, buf);
          console.log(`${tag}: ${(buf.length / 1024).toFixed(0)}KB`);
          return outFile;
        }
      }
      console.log(`${tag}: no image, attempt ${a}/3`);
    } catch (err) {
      console.log(`${tag}: error ${a}/3 — ${err.message?.slice(0, 200)}`);
      if (a < 3) await new Promise(r => setTimeout(r, 15000));
    }
  }
  console.log(`${tag}: FAILED after 3 attempts`);
  return null;
}

/**
 * Build a PPTX from an ordered array of PNG paths.
 */
async function buildPptx(paths, outFile) {
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

  await pptx.writeFile({ fileName: outFile });
}

/**
 * Full pipeline: generate all slides + build PPTX.
 *
 * @param {Object}   config
 * @param {string}   config.slideDir      - Directory to store PNGs
 * @param {string}   config.outFile       - Output PPTX filename
 * @param {Object[]} config.slides        - Array of { prompt, style? }
 * @param {Function} config.getStyle      - (tag) => style prefix string
 * @param {number}   [config.concurrency] - Parallel limit (default: 5)
 * @param {string}   [config.imageSize]   - "2K" | "4K" | omit
 */
async function run(config) {
  const {
    slideDir,
    outFile,
    slides,
    getStyle,
    concurrency = 5,
    imageSize,
  } = config;

  if (!fs.existsSync(slideDir)) fs.mkdirSync(slideDir, { recursive: true });
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const total = slides.length;

  console.log(`Generating ${total} slides (${concurrency} parallel)...`);
  const paths = new Array(total).fill(null);

  // Worker-pool concurrency
  const queue = [...Array(total).keys()];
  async function worker() {
    while (queue.length > 0) {
      const idx = queue.shift();
      if (idx === undefined) break;
      const s = slides[idx];
      const prefix = getStyle(s.style || "normal");
      const fullPrompt = prefix + "\n\n" + s.prompt;
      const padded = String(idx + 1).padStart(2, "0");
      paths[idx] = await genSlide(ai, {
        prompt: fullPrompt,
        outFile: path.join(slideDir, `slide-${padded}.png`),
        imageSize,
        label: `Slide ${idx + 1}`,
      });
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  await buildPptx(paths, outFile);
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${total} slides)`);
}

module.exports = { genSlide, buildPptx, run, SW, SH };
