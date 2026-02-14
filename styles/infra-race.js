// AI Infrastructure Race / 智能体产业洞察 — multi-company branded wireframe sketches

const STYLE_AMAZON_DARK = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Dark navy (#232F3E), solid, elegant, premium.

TYPOGRAPHY: Noto Sans SC font (clean Chinese sans-serif) for ALL text. ALL text in Chinese ONLY — absolutely NO English anywhere on the slide.
- Title: bold, Amazon orange, large heading, top-left aligned
- Body: light weight, light gray, standard body size
- Stat numbers: bold, Amazon orange, very large display size

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration in ORANGE tones:
- Orange (#FF9900) line art on dark backgrounds — thin, elegant lines (~1.5-2px)
- DETAILED icons with character: rocket engines with flame details, server racks with blinking lights, chip dies with pin grids, robot arms with joints visible
- Hand-drawn/sketch quality but CLEAN and READABLE — like a senior designer's concept whiteboard on a dark canvas
- Arrows are clean with proper arrowheads in orange
- Labels in clean Noto Sans SC near their icons
- Cards use dark card backgrounds (#2C3849) with thin orange left border, rounded corners (12px)
- Generous white space inside each card — diagrams breathe, never cramped

CRITICAL: Premium consulting deck aesthetic (McKinsey / BCG quality) with hand-drawn wireframe concept sketches in orange on dark navy. Apple Keynote level whitespace and typography. Intellectual, sophisticated, dramatic.`;

const STYLE_AMAZON_LIGHT = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: White (#FFFFFF), clean, minimal.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, black, large heading. The word "Amazon" (if present) in Amazon orange.
- Body: light weight, medium gray, standard body size
- Stat numbers: bold, Amazon orange, very large display size

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration:
- Medium gray (#666666 to #888888) line art with orange (#FF9900) accent highlights
- DETAILED icons: server racks, chip dies, rocket shapes, warehouse robots — each with recognizable detail
- Hand-drawn/sketch quality but clean and professional
- Stat cards use dark navy (#232F3E) background with orange numbers for dramatic contrast
- Regular cards are white with subtle shadow and thin orange left border
- Generous whitespace — Apple Keynote level spacing

Premium consulting aesthetic with orange accent wireframes on white. Clean, intellectual, data-forward.`;

const STYLE_GOOGLE = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Very light warm gray (#F8F9FA) to white, clean, airy.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, near-black, large heading. Company name in Google blue.
- Body: light weight, medium gray, standard body size
- Stat numbers: bold, very large display size, using Google's four brand colors for different stats

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration in Google's four colors:
- Blue (#4285F4), Red (#EA4335), Yellow (#FBBC05), Green (#34A853) line art — thin, elegant
- Different sections/layers use different Google colors for visual separation
- DETAILED icons: TPU chip with heat sink fins, optical fiber cables with light beams, self-driving car with sensor array, satellite dish, neural network nodes
- Hand-drawn/sketch quality but CLEAN — like a Google design team's concept whiteboard
- Cards are white with colored left borders matching their section color, rounded 12px, subtle shadow
- Generous whitespace — Apple Keynote level

Premium consulting aesthetic with Google's four-color wireframe sketches on light gray. Fresh, intellectual, optimistic.`;

const STYLE_MICROSOFT = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: White (#FFFFFF), pristine, corporate-clean.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, black, large heading. Company name in Microsoft blue.
- Body: light weight, medium gray, standard body size
- Stat numbers: bold, very large display size

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration in Microsoft blue tones:
- Blue (#0078D4) and complementary colors (#7FBA00 green, #00A4EF cyan, #F25022 red, #FFB900 yellow) line art
- DETAILED icons: Windows laptop screen with UI elements, Office document icons, cloud server with Azure logo shape, identity shield with keyhole, code editor with syntax lines
- Hand-drawn/sketch quality but CLEAN and CORPORATE — precise, structured, trustworthy
- Cards are white with thin blue (#0078D4) left border or blue header bar, rounded 12px
- Generous whitespace — Apple Keynote level

Premium enterprise consulting aesthetic with blue wireframe sketches. Structured, trustworthy, enterprise-grade.`;

const STYLE_NVIDIA_DARK = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Pure black (#000000) to very dark (#0A0A0A), dramatic, premium.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, NVIDIA green, large heading
- Body: light weight, light gray, standard body size
- Stat numbers: bold, NVIDIA green, very large display size

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration in NVIDIA green:
- Green (#76B900) line art on black — glowing, tech-forward, like circuit board traces
- DETAILED icons: GPU die with thousands of cores visualized, server rack with NVLink connections, robotic arm with joint motors, factory floor with conveyor belts, autonomous car with sensor rays
- Thin elegant lines (~1.5-2px) with slight green glow effect
- Hand-drawn/sketch quality but CLEAN — like a hardware engineer's concept sketch on black paper with green pencil
- Cards use dark (#1A1A1A) background with thin green border, rounded 12px
- Generous whitespace — Apple Keynote level, lots of black breathing room

Premium hardware/silicon consulting aesthetic with green wireframe on black. Dramatic, technical, powerful.`;

const STYLE_NVIDIA_LIGHT = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: White (#FFFFFF), clean.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, black, large heading
- Body: light weight, medium gray, standard body size
- Stat numbers: bold, NVIDIA green, very large display size

ILLUSTRATION STYLE (CRITICAL):
Wireframe sketches in dark gray with NVIDIA green (#76B900) accent highlights.
- Dark stat cards (#1A1A1A) with green numbers for dramatic callouts
- Regular cards white with green left border
- DETAILED wireframe icons of GPU hardware, CUDA code blocks, developer silhouettes
- Generous whitespace — Apple Keynote level

Premium consulting aesthetic with green accent wireframes on white.`;

const STYLE_OVERVIEW = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: White (#FFFFFF) or very light gray (#F8F9FA), clean, neutral.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: bold, black, large heading
- Body: light weight, medium gray, standard body size
- Stat numbers: bold, very large display size

ILLUSTRATION STYLE (CRITICAL):
Use each company's brand color for their respective sections:
- Amazon: Orange #FF9900 wireframe icons (rocket, warehouse robot)
- Google: Blue #4285F4 wireframe icons (TPU chip, self-driving car)
- Microsoft: Blue #0078D4 wireframe icons (laptop, cloud)
- NVIDIA: Green #76B900 wireframe icons (GPU, factory)
- DETAILED icons with character — each company's section should feel branded through color
- Cards are white with company-colored left borders, rounded 12px, subtle shadow
- Generous whitespace — Apple Keynote level

Premium multi-brand consulting aesthetic. Clean, comparative, authoritative.`;

const STYLE_COVER = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Medium lavender/purple gradient — from #C8B8E0 (medium lavender) at top-left to #D8CCE8 (soft purple) at bottom-right. Richer purple than pastel, elegant and premium.

In the right half, include VERY FAINT wireframe sketches (at 10-15% opacity) of four iconic tech shapes: a GPU chip die, a TPU wafer, a self-driving car outline, and a server rack — overlapping subtly like a collage watermark. Drawn in faint purple lines (#A090C0). They should NOT compete with the text.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Main title: bold, very dark navy, extra-large heading
- ALL other text: OMIT — no subtitle, no metadata, no date. ONLY the main title.

The LEFT 50% should be clear for the title. Minimal, elegant, dramatic.`;

const styles = {
  cover: STYLE_COVER,
  amazon_dark: STYLE_AMAZON_DARK,
  amazon_light: STYLE_AMAZON_LIGHT,
  google: STYLE_GOOGLE,
  microsoft: STYLE_MICROSOFT,
  nvidia_dark: STYLE_NVIDIA_DARK,
  nvidia_light: STYLE_NVIDIA_LIGHT,
  overview: STYLE_OVERVIEW,
};

function getStyle(tag) {
  return styles[tag] || styles.overview;
}

module.exports = {
  styles, getStyle,
  STYLE_COVER, STYLE_AMAZON_DARK, STYLE_AMAZON_LIGHT, STYLE_GOOGLE,
  STYLE_MICROSOFT, STYLE_NVIDIA_DARK, STYLE_NVIDIA_LIGHT, STYLE_OVERVIEW,
};
