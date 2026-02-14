const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const API_KEY = process.env.GEMINI_API_KEY;
const OUT = "tectonic-assets/whale-sketch.png";

async function main() {
  if (fs.existsSync(OUT) && fs.statSync(OUT).size > 10000) {
    console.log("Cached:", OUT);
    return;
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `Create a minimalist sketch illustration for a presentation cover. The concept is "一鲸落万物生" (When a whale falls, all things flourish) — a metaphor for the $3 trillion software industry being disrupted by AI.

CANVAS: 1920×1080 pixels, 16:9 landscape.

BACKGROUND: Dark purple gradient from #1A0F40 (top-left) to #3D2580 (bottom-right). Rich, deep, elegant.

ILLUSTRATION STYLE: Monochrome purple wireframe / line-art sketch. NOT photorealistic. Think architectural blueprint meets gentle ink illustration. Thin clean lines only. Minimal, elegant, sparse.

MAIN ELEMENT — THE WHALE: A large whale silhouette (blue whale shape) in the RIGHT HALF of the image, oriented diagonally with head pointing down-left — it is "falling" gracefully through space. The whale is drawn using thin wireframe lines in light purple (#C4B5D9) and lavender (#E8DFF5). The body outline is a single flowing contour. Internal details are minimal — just a few anatomical guide lines (baleen, fin structure, eye). The whale should feel like a technical sketch or architectural drawing.

SECONDARY ELEMENTS — "ALL THINGS FLOURISH": Below and around the falling whale, small particles, dots, and tiny organic shapes are RISING UPWARD — like an ecosystem being born from the whale's descent. These are drawn as small circles (3-8px), short line segments, and tiny asterisk shapes in lighter purple (#D4C8E8, #E8DFF5). They create a sense of upward movement and renewal. Some are connected by very faint thin lines forming a loose constellation pattern.

COMPOSITION: The whale occupies roughly the right 60% of the image. The LEFT 40% should be relatively EMPTY (just the dark purple gradient with perhaps a few very faint floating particles) — this is where presentation text will be placed. The overall illustration should feel like it lives in the background — elegant, subtle, not overwhelming.

NO TEXT of any kind. Pure illustration only.`;

  console.log("Generating whale sketch...");

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseModalities: ["IMAGE", "TEXT"] },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(OUT, buf);
          console.log(`OK: ${(buf.length / 1024).toFixed(0)}KB`);
          return;
        }
      }
      console.log(`No image returned, attempt ${attempt}/3`);
    } catch (err) {
      console.log(`Error attempt ${attempt}/3: ${err.message?.slice(0, 200)}`);
      if (attempt < 3) await new Promise(r => setTimeout(r, 15000));
    }
  }
  console.log("FAILED after 3 attempts");
}

main().catch(err => console.error("Fatal:", err));
