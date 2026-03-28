/**
 * Use Qwen qwen-image-edit-max to remove text from an image.
 * DashScope image editing API with text removal prompt.
 */
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com";

async function removeText(inputFile, outputFile) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) throw new Error("DASHSCOPE_API_KEY must be set");

  // Read source image as base64
  const imgBuf = fs.readFileSync(inputFile);
  const b64 = imgBuf.toString("base64");
  const mime = inputFile.endsWith(".jpg") || inputFile.endsWith(".jpeg") ? "image/jpeg" : "image/png";

  console.log(`Input: ${inputFile} (${(imgBuf.length / 1024).toFixed(0)}KB)`);
  console.log("Calling Qwen image edit API for text removal...");

  // Try the multimodal generation endpoint with image edit model
  const res = await fetch(
    `${BASE_URL}/api/v1/services/aigc/multimodal-generation/generation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-image-edit-max",
        input: {
          messages: [
            {
              role: "user",
              content: [
                { image: `data:${mime};base64,${b64}` },
                { text: "Remove all handwritten text, labels, numbers, letters, and Chinese characters from this image. Keep the original pen-on-paper style EXACTLY as is — same black ink lines on white paper, same line weight, same room layout, same wall positions. Do NOT add any color, watercolor, shading, or artistic effects. The result should look like the same hand-drawn floor plan sketch on white paper, just with all text erased. Keep it simple black lines on white background." },
              ],
            },
          ],
        },
        parameters: {
          size: "2048*1152",
          n: 1,
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error(`HTTP ${res.status}: ${errText.slice(0, 500)}`);

    // Fallback: try with image URL upload approach
    console.log("\nTrying alternative approach: regenerate without text using source as reference...");
    return await regenerateClean(inputFile, outputFile, apiKey);
  }

  const data = await res.json();
  if (data.code) {
    console.error(`API error ${data.code}: ${data.message}`);
    console.log("\nTrying alternative approach...");
    return await regenerateClean(inputFile, outputFile, apiKey);
  }

  // Extract image URL
  const choices = data.output?.choices || [];
  let imageUrl = null;
  for (const c of choices) {
    const content = c.message?.content || [];
    for (const item of content) {
      if (item.image) { imageUrl = item.image; break; }
    }
    if (imageUrl) break;
  }

  if (!imageUrl) {
    console.error("No image in response:", JSON.stringify(data).slice(0, 300));
    return null;
  }

  const imgRes = await fetch(imageUrl);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  fs.writeFileSync(outputFile, buf);
  console.log(`Done: ${outputFile} (${(buf.length / 1024).toFixed(0)}KB)`);
  return outputFile;
}

/**
 * Fallback: Use qwen-image-2.0-pro to regenerate the image
 * with the source as a reference, explicitly requesting no text.
 */
async function regenerateClean(inputFile, outputFile, apiKey) {
  const imgBuf = fs.readFileSync(inputFile);
  const b64 = imgBuf.toString("base64");
  const mime = inputFile.endsWith(".jpg") ? "image/jpeg" : "image/png";

  const res = await fetch(
    `${BASE_URL}/api/v1/services/aigc/multimodal-generation/generation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-image-2.0-pro",
        input: {
          messages: [
            {
              role: "user",
              content: [
                { image: `data:${mime};base64,${b64}` },
                { text: "Reproduce this exact watercolor architectural floor plan image but with ALL TEXT REMOVED. Remove every label, number, dimension, letter, and written character. Keep the exact same layout, colors, watercolor washes, ink lines, room shapes, door arcs, stair treads, and artistic style. The output should be identical to the input except with zero text anywhere." },
              ],
            },
          ],
        },
        parameters: {
          size: "2048*1152",
          n: 1,
          watermark: false,
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Fallback HTTP ${res.status}: ${errText.slice(0, 500)}`);
    return null;
  }

  const data = await res.json();
  if (data.code) {
    console.error(`Fallback API error ${data.code}: ${data.message}`);
    return null;
  }

  const choices = data.output?.choices || [];
  let imageUrl = null;
  for (const c of choices) {
    const content = c.message?.content || [];
    for (const item of content) {
      if (item.image) { imageUrl = item.image; break; }
    }
    if (imageUrl) break;
  }

  if (!imageUrl) {
    console.error("No image in fallback response:", JSON.stringify(data).slice(0, 300));
    return null;
  }

  const imgRes = await fetch(imageUrl);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  fs.writeFileSync(outputFile, buf);
  console.log(`Done (fallback): ${outputFile} (${(buf.length / 1024).toFixed(0)}KB)`);
  return outputFile;
}

// Main
const input = process.argv[2] || "yungang-blueprint.png";
const output = process.argv[3] || "yungang-blueprint-clean.png";

removeText(input, output).catch(err => {
  console.error(err);
  process.exit(1);
});
