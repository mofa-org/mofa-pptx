const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const SW = 13.333, SH = 7.5;

// DashScope API for Qwen image generation
const BASE_URL = process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com";

/**
 * Generate a single slide image via Qwen (DashScope API).
 */
async function genSlide(opts) {
  const {
    prompt,
    outFile,
    size = "2048*1152",
    model = "qwen-image-2.0-pro",
    label,
  } = opts;
  const tag = label || path.basename(outFile, ".png");
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) throw new Error("DASHSCOPE_API_KEY must be set");

  // PNG caching — skip if file >10KB exists
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`Cached: ${tag}`);
    return outFile;
  }

  for (let a = 1; a <= 3; a++) {
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/services/aigc/multimodal-generation/generation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            input: {
              messages: [
                { role: "user", content: [{ text: prompt }] },
              ],
            },
            parameters: {
              size,
              n: 1,
              prompt_extend: true,
              watermark: false,
            },
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 300)}`);
      }

      const data = await res.json();

      // Check for API-level errors
      if (data.code) {
        throw new Error(`API error ${data.code}: ${data.message}`);
      }

      // Extract image URL from response
      const choices = data.output?.choices || [];
      let imageUrl = null;
      for (const c of choices) {
        const content = c.message?.content || [];
        for (const item of content) {
          if (item.image) {
            imageUrl = item.image;
            break;
          }
        }
        if (imageUrl) break;
      }

      if (!imageUrl) {
        console.log(`${tag}: no image URL in response, attempt ${a}/3`);
        console.log(`  Response: ${JSON.stringify(data).slice(0, 300)}`);
        if (a < 3) await new Promise((r) => setTimeout(r, 30000));
        continue;
      }

      // Download the image
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`Download failed: HTTP ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(outFile, buf);
      console.log(`${tag}: ${(buf.length / 1024).toFixed(0)}KB`);
      return outFile;
    } catch (err) {
      console.log(`${tag}: error ${a}/3 — ${err.message?.slice(0, 200)}`);
      if (a < 3) await new Promise((r) => setTimeout(r, 30000));
    }
  }
  console.log(`${tag}: FAILED after 3 attempts`);
  return null;
}

/**
 * Build a PPTX from slide data (same as engine.js).
 */
async function buildPptx(slidesData, outFile) {
  console.log("Building PPTX...");
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: SW, height: SH });
  pptx.layout = "WIDE";

  for (const sd of slidesData) {
    const imgPath = typeof sd === "string" ? sd : sd?.path;
    const texts = typeof sd === "object" && sd !== null ? sd.texts : undefined;
    const slide = pptx.addSlide();

    if (imgPath && fs.existsSync(imgPath)) {
      const b64 = "data:image/png;base64," + fs.readFileSync(imgPath, "base64");
      slide.addImage({ data: b64, x: 0, y: 0, w: SW, h: SH });
    }

    if (texts && texts.length > 0) {
      for (const t of texts) {
        const opts = {
          x: t.x ?? 0.5,
          y: t.y ?? 0.5,
          w: t.w ?? 6,
          h: t.h ?? 1,
          fontFace: t.fontFace || "Arial",
          fontSize: t.fontSize || 18,
          color: t.color || "FFFFFF",
          bold: t.bold || false,
          italic: t.italic || false,
          align: t.align || "left",
          valign: t.valign || "top",
          isTextBox: true,
        };
        if (t.margin != null) opts.margin = t.margin;
        if (t.lineSpacing != null) opts.lineSpacing = t.lineSpacing;
        if (t.transparency != null) opts.transparency = t.transparency;
        if (t.rotate != null) opts.rotate = t.rotate;
        if (t.fill) opts.fill = JSON.parse(JSON.stringify(t.fill));
        if (t.shadow) opts.shadow = JSON.parse(JSON.stringify(t.shadow));

        if (t.runs) {
          const runs = t.runs.map((r) => ({
            text: r.text,
            options: {
              ...(r.fontSize != null && { fontSize: r.fontSize }),
              ...(r.color && { color: r.color }),
              ...(r.bold != null && { bold: r.bold }),
              ...(r.italic != null && { italic: r.italic }),
              ...(r.fontFace && { fontFace: r.fontFace }),
              ...(r.breakLine != null && { breakLine: r.breakLine }),
            },
          }));
          slide.addText(runs, opts);
        } else {
          slide.addText(t.text, opts);
        }
      }
    }
  }

  await pptx.writeFile({ fileName: outFile });
}

/**
 * Full pipeline: generate all slides + build PPTX.
 */
async function run(config) {
  const {
    slideDir,
    outFile,
    slides,
    getStyle,
    concurrency = 3,
    size = "2048*1152",
    model = "qwen-image-2.0-pro",
  } = config;

  if (!fs.existsSync(slideDir)) fs.mkdirSync(slideDir, { recursive: true });
  const total = slides.length;

  console.log(`Generating ${total} slides via Qwen ${model} (${concurrency} parallel)...`);
  const paths = new Array(total).fill(null);

  const queue = [...Array(total).keys()];
  async function worker() {
    while (queue.length > 0) {
      const idx = queue.shift();
      if (idx === undefined) break;
      const s = slides[idx];
      const prefix = getStyle(s.style || "normal");
      let fullPrompt = prefix + "\n\n" + s.prompt;
      if (s.texts) {
        fullPrompt +=
          "\n\nCRITICAL: DO NOT render any text, words, labels, numbers, or letters anywhere on the image. The image must be purely visual with no readable content whatsoever. Leave clean space where text would normally appear.";
      }
      const padded = String(idx + 1).padStart(2, "0");
      paths[idx] = await genSlide({
        prompt: fullPrompt,
        outFile: path.join(slideDir, `slide-${padded}.png`),
        size,
        model,
        label: `Slide ${idx + 1}`,
      });
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const slidesData = paths.map((p, i) => {
    const s = slides[i];
    if (s.texts) return { path: p, texts: s.texts };
    return p;
  });

  await buildPptx(slidesData, outFile);
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${total} slides)`);
}

module.exports = { genSlide, buildPptx, run, SW, SH };
