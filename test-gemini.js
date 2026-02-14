const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

async function test() {
  console.log("Testing image generation...");
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: [{
      role: "user",
      parts: [{ text: "Generate a minimalist wireframe sketch illustration for a presentation background. Thin purple mono-line art on a soft white-to-lavender gradient background. Abstract constellation of connected nodes and flowing circuit paths suggesting an AI agent network. Small circles connected by thin curved lines. 16:9 landscape aspect ratio. No text, no words, no letters." }]
    }],
    config: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  const reason = response.candidates?.[0]?.finishReason;
  console.log("Finish reason:", reason);

  for (const part of parts) {
    if (part.inlineData) {
      const buf = Buffer.from(part.inlineData.data, "base64");
      fs.writeFileSync("test-output.png", buf);
      console.log(`SUCCESS: ${part.inlineData.mimeType} (${(buf.length/1024).toFixed(0)}KB) saved to test-output.png`);
    } else if (part.text) {
      console.log("Text:", part.text.slice(0, 200));
    }
  }

  if (parts.length === 0) {
    console.log("No parts in response. Full response:", JSON.stringify(response.candidates?.[0], null, 2).slice(0, 500));
  }
}

test().catch(err => console.error("Error:", err.message?.slice(0, 300) || err));
