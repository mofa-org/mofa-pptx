const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SW = 13.333, SH = 7.5;

/**
 * Generate a single slide image via Gemini.
 */
async function genSlide(ai, opts) {
  const { prompt, outFile, imageSize, aspectRatio, label } = opts;
  const tag = label || path.basename(outFile, ".png");

  // PNG caching — skip if file >10KB exists
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`Cached: ${tag}`);
    return outFile;
  }

  const config = { responseModalities: ["IMAGE", "TEXT"] };
  if (imageSize) {
    config.imageConfig = { aspectRatio: aspectRatio || "16:9", imageSize };
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

/**
 * Card pipeline: generate PNG greeting cards (no PPTX assembly).
 *
 * @param {Object}   config
 * @param {string}   config.cardDir       - Directory to store card PNGs
 * @param {Object[]} config.cards         - Array of { name, prompt, style? }
 * @param {Function} config.getStyle      - (tag) => style prefix string
 * @param {string}   [config.aspectRatio] - Gemini aspect ratio (default: "9:16")
 * @param {number}   [config.concurrency] - Parallel limit (default: 5)
 * @param {string}   [config.imageSize]   - "1K" | "2K" | "4K" | omit
 */
async function runCards(config) {
  const {
    cardDir,
    cards,
    getStyle,
    aspectRatio = "9:16",
    concurrency = 5,
    imageSize,
  } = config;

  if (!fs.existsSync(cardDir)) fs.mkdirSync(cardDir, { recursive: true });
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const total = cards.length;

  console.log(`Generating ${total} cards (${concurrency} parallel, ${aspectRatio})...`);
  const paths = new Array(total).fill(null);

  const queue = [...Array(total).keys()];
  async function worker() {
    while (queue.length > 0) {
      const idx = queue.shift();
      if (idx === undefined) break;
      const c = cards[idx];
      const prefix = getStyle(c.style || "front");
      const fullPrompt = prefix + "\n\n" + c.prompt;
      paths[idx] = await genSlide(ai, {
        prompt: fullPrompt,
        outFile: path.join(cardDir, `card-${c.name}.png`),
        imageSize,
        aspectRatio,
        label: c.name,
      });
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const ok = paths.filter(Boolean).length;
  console.log(`\nDone: ${ok}/${total} cards in ${cardDir}/`);
  return paths;
}

/**
 * Animate a single card image into a video with BGM.
 *
 * @param {Object}   ai          - GoogleGenAI instance
 * @param {Object}   opts
 * @param {string}   opts.imagePath    - Source PNG
 * @param {string}   opts.outPath      - Output MP4
 * @param {string}   opts.animPrompt   - Veo animation prompt
 * @param {string}   [opts.bgmPath]    - Background music file
 * @param {number}   [opts.stillDuration=2]
 * @param {number}   [opts.crossfadeDur=1]
 * @param {number}   [opts.fadeOutDur=1.5]
 * @param {number}   [opts.musicVolume=0.3]
 * @param {number}   [opts.musicFadeIn=2]
 * @param {string}   [opts.label]
 */
async function animateCard(ai, opts) {
  const {
    imagePath,
    outPath,
    animPrompt,
    bgmPath,
    stillDuration = 2,
    crossfadeDur = 1,
    fadeOutDur = 1.5,
    musicVolume = 0.3,
    musicFadeIn = 2,
    label,
  } = opts;

  const tag = label || path.basename(imagePath, path.extname(imagePath));
  const baseName = path.basename(imagePath, path.extname(imagePath));
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Step 1: Gemini Veo image → video
  const rawVideo = path.join(dir, `${baseName}-raw.mp4`);

  if (fs.existsSync(rawVideo) && fs.statSync(rawVideo).size > 10000) {
    console.log(`  [${tag}] Step 1: Using cached raw video`);
  } else {
    console.log(`  [${tag}] Step 1: Generating video with Veo...`);
    const imageBytes = fs.readFileSync(imagePath).toString("base64");

    let operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: animPrompt,
      image: { imageBytes, mimeType: "image/png" },
    });

    let dots = 0;
    while (!operation.done) {
      dots++;
      process.stdout.write(`\r  [${tag}] Generating${".".repeat(dots % 4).padEnd(3)} `);
      await new Promise((r) => setTimeout(r, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }
    console.log(`\n  [${tag}] Video generated!`);

    await ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: rawVideo,
    });
  }

  // Get raw video duration & dimensions
  const rawDur = parseFloat(
    execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${rawVideo}"`).toString().trim()
  );
  const totalDur = stillDuration + rawDur;
  const dims = execSync(
    `ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${rawVideo}"`
  ).toString().trim().split(",");
  const [width, height] = dims;

  console.log(`  [${tag}] Step 2: Compositing (${rawDur.toFixed(1)}s anim + ${stillDuration}s still)...`);

  const hasMusic = bgmPath && fs.existsSync(bgmPath);
  const fadeOutStart = totalDur - fadeOutDur;

  // Step 2a: Still image clip
  const stillClip = path.join(dir, `${baseName}-still.mp4`);
  execSync(
    `ffmpeg -y -loop 1 -i "${imagePath}" -t ${stillDuration} ` +
    `-vf "scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1" ` +
    `-c:v libx264 -preset medium -crf 20 -r 24 -pix_fmt yuv420p -an "${stillClip}"`,
    { stdio: "pipe" }
  );

  // Step 2b: Re-encode animation to matching format
  const animClip = path.join(dir, `${baseName}-anim.mp4`);
  execSync(
    `ffmpeg -y -i "${rawVideo}" -c:v libx264 -preset medium -crf 20 -r 24 -pix_fmt yuv420p -an "${animClip}"`,
    { stdio: "pipe" }
  );

  // Step 2c: Crossfade still → animation + fade out
  const noAudioPath = path.join(dir, `${baseName}-noaudio.mp4`);
  execSync(
    `ffmpeg -y -i "${stillClip}" -i "${animClip}" ` +
    `-filter_complex "[0:v][1:v]xfade=transition=fade:duration=${crossfadeDur}:offset=${stillDuration - crossfadeDur},fade=t=out:st=${fadeOutStart}:d=${fadeOutDur}[v]" ` +
    `-map "[v]" -c:v libx264 -preset medium -crf 20 -movflags +faststart -an "${noAudioPath}"`,
    { stdio: "pipe" }
  );

  // Step 2d: Add music
  if (hasMusic) {
    execSync(
      `ffmpeg -y -i "${noAudioPath}" -i "${bgmPath}" ` +
      `-filter_complex "[1:a]afade=t=in:d=${musicFadeIn},afade=t=out:st=${fadeOutStart}:d=${fadeOutDur},volume=${musicVolume}[a]" ` +
      `-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart "${outPath}"`,
      { stdio: "pipe" }
    );
    for (const f of [stillClip, animClip, noAudioPath]) {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  } else {
    fs.renameSync(noAudioPath, outPath);
    for (const f of [stillClip, animClip]) {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  }

  const stat = fs.statSync(outPath);
  console.log(`  [${tag}] Done: ${outPath} (${(stat.size / 1024 / 1024).toFixed(1)}MB)`);
  return outPath;
}

/**
 * Video card pipeline: generate PNG cards → animate each → MP4 with BGM.
 *
 * Each card in config.cards should have:
 *   { name, prompt, style?, animStyle?, animDesc? }
 *
 * @param {Object}   config
 * @param {string}   config.cardDir        - Directory for PNGs and MP4s
 * @param {Object[]} config.cards          - Array of card definitions
 * @param {Function} config.getStyle       - (tag) => image style prefix
 * @param {Function} config.getAnimPrompt  - (tag, desc?) => Veo animation prompt
 * @param {string}   [config.bgmPath]      - Background music file
 * @param {string}   [config.aspectRatio]  - Image aspect ratio (default: "9:16")
 * @param {string}   [config.imageSize]    - "1K" | "2K" | "4K"
 * @param {number}   [config.concurrency]  - Parallel limit for image gen (default: 3)
 * @param {number}   [config.stillDuration]
 * @param {number}   [config.crossfadeDur]
 * @param {number}   [config.fadeOutDur]
 * @param {number}   [config.musicVolume]
 * @param {number}   [config.musicFadeIn]
 */
async function runVideoCards(config) {
  const {
    cardDir,
    cards,
    getStyle,
    getAnimPrompt,
    bgmPath,
    aspectRatio = "9:16",
    imageSize,
    concurrency = 3,
    stillDuration = 2,
    crossfadeDur = 1,
    fadeOutDur = 1.5,
    musicVolume = 0.3,
    musicFadeIn = 2,
  } = config;

  if (!fs.existsSync(cardDir)) fs.mkdirSync(cardDir, { recursive: true });
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const total = cards.length;

  // Phase 1: Generate all card images
  console.log(`\n=== Phase 1: Generating ${total} card images ===`);
  const imgPaths = new Array(total).fill(null);

  const queue = [...Array(total).keys()];
  async function worker() {
    while (queue.length > 0) {
      const idx = queue.shift();
      if (idx === undefined) break;
      const c = cards[idx];
      const prefix = getStyle(c.style || "front");
      const fullPrompt = prefix + "\n\n" + c.prompt;
      imgPaths[idx] = await genSlide(ai, {
        prompt: fullPrompt,
        outFile: path.join(cardDir, `card-${c.name}.png`),
        imageSize,
        aspectRatio,
        label: c.name,
      });
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  // Phase 2: Animate each card (sequential — Veo has rate limits)
  console.log(`\n=== Phase 2: Animating ${total} cards ===`);
  const videoPaths = [];

  for (let i = 0; i < total; i++) {
    const c = cards[i];
    const imgPath = imgPaths[i];
    if (!imgPath) {
      console.log(`  [${c.name}] Skipped (no image)`);
      videoPaths.push(null);
      continue;
    }

    const animPrompt = getAnimPrompt(c.animStyle || "shuimo", c.animDesc);
    const outPath = path.join(cardDir, `card-${c.name}-animated.mp4`);

    const videoPath = await animateCard(ai, {
      imagePath: imgPath,
      outPath,
      animPrompt,
      bgmPath,
      stillDuration,
      crossfadeDur,
      fadeOutDur,
      musicVolume,
      musicFadeIn,
      label: c.name,
    });
    videoPaths.push(videoPath);
  }

  const okImg = imgPaths.filter(Boolean).length;
  const okVid = videoPaths.filter(Boolean).length;
  console.log(`\nDone: ${okImg}/${total} images, ${okVid}/${total} videos in ${cardDir}/`);
  return { images: imgPaths, videos: videoPaths };
}

module.exports = { genSlide, buildPptx, run, runCards, animateCard, runVideoCards, SW, SH };
