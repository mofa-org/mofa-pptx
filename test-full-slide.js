const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const API_KEY = process.env.GEMINI_API_KEY;
const OUT_IMG = "tectonic-assets/test-slide2-v3.png";

const prompt = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Light purple gradient — from pale lavender-white (#F8F5FC) at top-left to soft lavender (#EAE0F5) at bottom-right. Elegant, soft, not too saturated — think frosted lilac glass. In the background, VERY FAINTLY visible (like a ghosted watermark at 5-8% opacity), include a gentle sketch outline of a large whale silhouette — positioned in the right half of the slide. Just barely-visible faint purple-gray pencil lines, like a watermark printed on fine paper. The whale should NOT compete with the content.

═══ TITLE AREA (top 20% of slide) ═══

Line 1 — LARGE BOLD TITLE:
"SaaS Crisis & Seat Compression | SaaS危机与座位压缩"
Near-black (#1A1A1A), bold, approximately 42-48pt equivalent. The pipe "|" separates English and Chinese. Both same weight and size. Centered horizontally.
English text uses Manrope font (geometric modern sans-serif, clean and rounded).
Chinese text uses Noto Sans SC font (clean Chinese sans-serif, matching weight).

Line 2 — SUBTITLE (below title, smaller):
"Traditional Software's Structural Vulnerability to AI Disruption"
Medium gray (#777777), regular weight Manrope, approximately 18-20pt equivalent. Centered.

═══ MAIN CONTENT: THREE WHITE CARDS ═══

Three equally-sized white (#FFFFFF) cards arranged horizontally across the full width, with small gaps. Cards have subtle rounded corners (~8px radius) and very faint lavender-gray borders (#DDD8E8) with barely-visible drop shadows. Small gaps (~20px) between cards. Cards fill from left edge margin to right edge margin.

Each card has: BOLD TITLE at top → WIREFRAME SKETCH DIAGRAM in middle → BODY PARAGRAPH at bottom.

─── CARD 1: "Fatal Vulnerability" ───

Title: "Fatal Vulnerability" — bold Manrope, ~18pt, top-left of card.

Diagram (center of card):
Draw a tall elegant TOWER made of 4 stacked blocks, each with a detailed icon inside:
• Top block: a CLOUD icon with connection nodes (labeled "SCALABLE")
• 2nd block: a DOLLAR SIGN with radiating lines (labeled "HIGH MARGIN")
• 3rd block: a LIGHTBULB with filament detail (labeled "PURE IP")
• Bottom block: a FEATHER or leaf icon (labeled "LIGHT ASSET")
The tower has hairline fracture lines spreading up from the base.
A bold ARROW from the right points at the tower base. At the arrow's origin: a detailed BRAIN icon with gear-cog teeth around it, labeled "AI DISRUPTION".
The brain-gear icon is drawn with detail — visible teeth on the gear, neural connection lines inside.

Body text (bottom of card, Manrope regular):
"Traditional software's greatest strengths — pure intellectual capital, light-asset models, infinite scalability — become its fatal weakness when AI replicates them at near-zero marginal cost."

─── CARD 2: "Seat Compression" ───

Title: "Seat Compression" — bold Manrope, ~18pt, top-left of card.

Diagram (center of card):
PROMINENT BIG STATISTIC at the top of diagram area:
"60-80%" in VERY LARGE bold Manrope (~36pt), with "Revenue Drop Per Customer" in smaller text beside it.

Below the stat, a FLOW DIAGRAM:
LEFT: A row of small desk-and-person icons (5 figures at desks), drawn with detail — monitor on desk, stick figure with head. Labeled "TRADITIONAL: PER-SEAT"
CENTER: A bold right-pointing arrow
RIGHT: Just 2 desk-and-person icons PLUS a detailed robot/AI icon (rectangular body with antenna, screen face with simple eyes). Labeled "AI ERA: 2 + AGENTS"
The 3 missing desk positions shown as DOTTED OUTLINES (ghost seats fading away).

Below: a small declining STAIRCASE chart (4 steps going down left to right), labeled "SaaS REVENUE"

Body text (bottom of card, Manrope regular):
"Per-seat SaaS pricing collapses when one AI agent replaces 3-5 developer seats. Revenue per customer drops 60-80%, forcing the entire industry to find new monetization models."

─── CARD 3: "The $3T Reset" ───

Title: "The $3T Reset" — bold Manrope, ~18pt, top-left of card.

Diagram (center of card):
THREE ICONS arranged in a row at the top, connected by arrows flowing DOWN to a central element:
• LEFT icon: A detailed ENTERPRISE BUILDING (columns, triangular roof, windows grid), labeled "ENTERPRISE"
• CENTER icon: A CLOUD with horizontal lines inside (representing SaaS), labeled "SaaS"
• RIGHT icon: A SMARTPHONE outline with app grid on screen, labeled "MOBILE"

All three have small CRACK/DISRUPTION lines radiating outward.

Below them, arrows converge down to a large CIRCLE containing "$3T" in bold text. The circle has a visible crack running through it.

Below the circle: "FEBRUARY 2026" with a small calendar icon, labeled "INFLECTION POINT"

Body text (bottom of card, Manrope regular):
"The $3 trillion software industry faces structural compression across enterprise, SaaS, and mobile. February 2026 marks the inflection where AI-native companies displace incumbents."

═══ ILLUSTRATION STYLE (CRITICAL) ═══

ALL diagrams use sophisticated MONOCHROME WIREFRAME SKETCH illustration:
- Medium gray (#666666 to #888888) line art ONLY — NO color fills, NO heavy gradients
- DETAILED icons with character: gear teeth clearly drawn, building columns visible, brain with neural connections, shield emblems detailed, screens show content
- Consistent line weight throughout (~1.5-2px equivalent)
- Hand-drawn/sketch quality but CLEAN and READABLE — like a senior designer's concept whiteboard sketch
- Arrows are clean with proper arrowheads
- Labels in clean UPPERCASE Manrope gray text, positioned near their icons
- Generous white space inside each card — diagrams should breathe, not feel cramped

TYPOGRAPHY throughout: Manrope (geometric modern sans-serif) for all English text. Noto Sans SC for all Chinese text. Clean, professional, highly legible.

The light purple gradient background should be VISIBLE — the cards are white so they contrast against the soft lavender background. The overall color feeling is elegant purple/lavender, not gray.

PAGE NUMBER: "2 / 30" in small light gray text (~10pt), bottom right corner.

CRITICAL: Premium consulting deck aesthetic (McKinsey / Bain style) with hand-drawn concept sketches — intellectual, sophisticated, monochrome diagrams on elegant light purple background.`;

async function main() {
  if (!fs.existsSync("tectonic-assets")) fs.mkdirSync("tectonic-assets");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  console.log("Generating slide with light purple gradient + Manrope/Noto Sans SC...");

  let imgBuf = null;
  for (let a = 1; a <= 3; a++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseModalities: ["IMAGE", "TEXT"] },
      });
      for (const p of (res.candidates?.[0]?.content?.parts || [])) {
        if (p.inlineData) {
          imgBuf = Buffer.from(p.inlineData.data, "base64");
          fs.writeFileSync(OUT_IMG, imgBuf);
          console.log(`Image: ${(imgBuf.length / 1024).toFixed(0)}KB`);
          break;
        }
      }
      if (imgBuf) break;
      console.log(`No image, attempt ${a}/3`);
    } catch (err) {
      console.log(`Error ${a}/3: ${err.message?.slice(0, 200)}`);
      if (a < 3) await new Promise(r => setTimeout(r, 15000));
    }
  }
  if (!imgBuf) { console.log("FAILED"); return; }

  // Wrap in PPTX
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "WIDE";
  const slide = pptx.addSlide();
  slide.addImage({ data: "data:image/png;base64," + imgBuf.toString("base64"), x: 0, y: 0, w: 13.333, h: 7.5 });

  await pptx.writeFile({ fileName: "test-slide-v3.pptx" });
  console.log("Done: test-slide-v3.pptx");
}

main().catch(err => console.error("Fatal:", err));
