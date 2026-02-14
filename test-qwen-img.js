const https = require("https");
const KEY = process.argv[2] || "";

const models = [
  "qwen-image-plus",
  "qwen-image-2512",
  "wanx2.1-t2i-plus",
  "wanx-v2",
  "flux-dev",
  "flux-schnell",
];

function tryModel(model, prompt) {
  return new Promise((resolve) => {
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
        "Authorization": `Bearer ${KEY}`,
        "X-DashScope-Async": "enable",
        "Content-Length": Buffer.byteLength(body),
      },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ model, status: res.statusCode, body: data.slice(0, 400) }));
    });
    req.on("error", (e) => resolve({ model, status: "error", body: e.message }));
    req.write(body);
    req.end();
  });
}

// Also try OpenAI-compatible endpoint
function tryChat(model) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      model,
      messages: [{ role: "user", content: "Generate a red corporate presentation slide with title 华为战略 in Chinese" }],
      modalities: ["image", "text"],
    });

    const req = https.request({
      hostname: "dashscope.aliyuncs.com",
      path: "/compatible-mode/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${KEY}`,
        "Content-Length": Buffer.byteLength(body),
      },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ model: model + " (chat)", status: res.statusCode, body: data.slice(0, 400) }));
    });
    req.on("error", (e) => resolve({ model: model + " (chat)", status: "error", body: e.message }));
    req.write(body);
    req.end();
  });
}

async function main() {
  if (!KEY) { console.log("Usage: node test-qwen-img.js DASHSCOPE_KEY"); return; }
  console.log("Probing DashScope image models...\n");

  const testPrompt = "Corporate presentation slide, red header bar with white text 华为战略建议, white background, information boxes";
  const results = await Promise.all([
    ...models.map(m => tryModel(m, testPrompt)),
    tryChat("qwen-vl-max"),
    tryChat("qwen2.5-vl-max"),
    tryChat("qwen-image-plus"),
  ]);

  for (const r of results) {
    const ok = r.body.includes("task_id") || r.body.includes("image");
    console.log(`${ok ? "✓" : "✗"} ${r.model} — ${r.status} — ${r.body.slice(0, 200)}`);
    console.log();
  }
}

main();
