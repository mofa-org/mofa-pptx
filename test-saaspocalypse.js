const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const API_KEY = process.env.GEMINI_API_KEY;

const STYLE_DATA = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Light purple gradient — from pale lavender-white (#F8F5FC) at top-left to soft lavender (#EAE0F5) at bottom-right. Very subtle, clean. Minimal or NO whale watermark on this slide — keep the background clean for data readability.

TYPOGRAPHY: Manrope font (geometric modern sans-serif) for ALL English text. Noto Sans SC for ALL Chinese text. Clean, professional, highly legible.

TITLE RULES:
- Title font size MUST be ≤24pt. If the title is long, shrink to 20pt or 18pt to fit.
- If the Chinese translation is SHORT (≤8 characters), put English and Chinese on ONE line separated by " | "
- If the Chinese translation is LONG (>8 characters), use TWO lines: English title on line 1, Chinese title on line 2 in slightly smaller text.
- Title text color MUST be black or near-black (#1A1A1A).

DATA-DENSE SLIDE: This slide contains dense data tables or comparison matrices. PRIORITIZE data presentation clarity above all else. Reduce or remove decorative sketch elements. Use clean table layouts with maximum readability. Data > decoration. Tables should have clear headers, aligned columns, generous spacing, and alternating subtle row shading for readability. Only keep minimal wireframe accents that aid comprehension (small icons in table cells OK), never at the expense of data legibility.

Premium consulting deck aesthetic — clean, intellectual, data-forward.`;

const prompt = `
TITLE: "The February 2026 'SaaSpocalypse'"
Chinese (long, use line 2): "2026年2月'SaaS末日'"
Subtitle: "Claude Cowork demo triggers $285 billion single-day software stock wipeout"

MAIN CONTENT: One large white card spanning full width with a clean DATA TABLE:

Table header row (bold): Company | Sector | Stock Drop | Significance

Data rows:
Gartner | Research & Advisory | -21% | Advisory value questioned
LegalZoom | Legal Services | -20% | Legal automation threat
Thomson Reuters | Legal/Financial Data | -16% | Worst single-day drop on record
Novo Nordisk | Healthcare/Pharma | -15% | AI drug discovery fears
RELX (LexisNexis) | Legal Research | -14% | Legal research monopoly threatened
London Stock Exchange Group | Financial Data | -13% | Financial services disruption
WPP | Advertising | -12% | Creative automation fears
CS Disco | Legal Technology | -12% | Legal tech disruption
S&P Global | Financial Data | -11% | Financial data services
Equifax | Credit Reporting | -12% | Credit analysis automation
Intuit | Accounting Software | -10% | Accounting automation
Cognizant | IT Services | -10% | IT outsourcing at risk

Use alternating subtle lavender/white row shading. The percentage drops should be visually prominent (bold red text).

Below the table, two stat boxes side by side:
LEFT: "Goldman Sachs US Software Basket: -6%" — "Steepest daily loss since April 2025 tariff slump"
RIGHT: "Financial Services Index: -7% | Nasdaq-100: -2.4%"

Bottom-right: Quote — "We call it the 'SaaSpocalypse'" — Jeffrey Favuzza, Jefferies

PAGE: "3 / 35"`;

async function main() {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const fullPrompt = STYLE_DATA + "\n\n" + prompt;

  console.log("Generating SaaSpocalypse slide...");
  const res = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    config: { responseModalities: ["IMAGE", "TEXT"] },
  });

  for (const p of (res.candidates?.[0]?.content?.parts || [])) {
    if (p.inlineData) {
      const buf = Buffer.from(p.inlineData.data, "base64");
      const outFile = "test-saaspocalypse.png";
      fs.writeFileSync(outFile, buf);
      console.log(`Done: ${outFile} (${(buf.length / 1024).toFixed(0)}KB)`);
      return;
    }
  }
  console.log("No image returned");
}

main().catch(err => console.error("Error:", err));
