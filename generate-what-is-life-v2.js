const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-what-is-life";
const SW = 13.333, SH = 7.5;
const TOTAL = 10;

// ─── STYLE: COVER ──────────────────────────────────────────────────
const STYLE_COVER = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: Medium lavender/purple gradient \u2014 from #C8B8E0 (medium lavender) at top-left to #D8CCE8 (soft purple) at bottom-right. Richer purple than pastel, elegant and premium.

In the right half, include VERY FAINT wireframe sketches (at 10-15% opacity) of four iconic science shapes: a DNA double helix, an atom with electron orbits, a crystal lattice structure, and a Boltzmann entropy equation \u2014 overlapping subtly like a collage watermark. Drawn in faint purple lines (#A090C0). They should NOT compete with the text.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY \u2014 absolutely NO English anywhere on the slide except proper nouns like "What is Life?".
- Main title: font-weight 700, color #1A1A2E (very dark navy/black), 48-54pt
- Subtitle: font-weight 300, color #4A3A6E (muted purple), 20-24pt

The LEFT 50% should be clear for the title. Minimal, elegant, dramatic.`;

// ─── STYLE: PHYSICS DARK ───────────────────────────────────────────
const STYLE_PHYSICS_DARK = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: Dark navy (#0B1929), solid, elegant, premium.

TYPOGRAPHY: Noto Sans SC font (clean Chinese sans-serif) for ALL text. ALL text in Chinese ONLY \u2014 absolutely NO English anywhere on the slide.
- Title: font-weight 700, color #00B4D8 (bright cyan), size 28-32pt, top-left aligned
- Body: font-weight 300, color #CCCCCC (light gray), size 16-18pt
- Stat numbers: font-weight 700, color #FFB703 (amber gold), size 48-64pt

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration in CYAN/TEAL tones:
- Cyan (#00B4D8) line art on dark backgrounds \u2014 thin, elegant lines (~1.5-2px)
- DETAILED icons with character: atoms with orbital shells, wave functions, crystal lattice nodes, Boltzmann distribution curves, quantum energy level diagrams
- Hand-drawn/sketch quality but CLEAN and READABLE \u2014 like a senior physicist's concept whiteboard on a dark canvas
- Arrows are clean with proper arrowheads in cyan
- Labels in clean Noto Sans SC near their icons
- Cards use dark card backgrounds (#132F4C) with thin cyan left border, rounded corners (12px)
- Generous white space inside each card \u2014 diagrams breathe, never cramped

CRITICAL: Premium consulting deck aesthetic (McKinsey / BCG quality) with hand-drawn wireframe concept sketches in cyan on dark navy. Apple Keynote level whitespace and typography. Intellectual, sophisticated, scientific.`;

// ─── STYLE: BIOLOGY LIGHT ──────────────────────────────────────────
const STYLE_BIOLOGY_LIGHT = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: White (#FFFFFF) to very light warm gray (#F8F9FA), clean, airy.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: font-weight 700, color #1E293B (dark slate), size 28-32pt, top-left aligned
- Body: font-weight 300, color #555555, size 16-18pt
- Stat numbers: font-weight 700, color #14B8A6 (teal), size 48-64pt

ILLUSTRATION STYLE (CRITICAL):
ALL diagrams use sophisticated WIREFRAME SKETCH illustration in TEAL/GREEN tones:
- Teal (#14B8A6) and complementary colors (#00B4D8 cyan, #FFB703 amber) line art
- DETAILED icons: DNA double helix with base pair rungs, chromosome X-shapes, cell membranes with phospholipid bilayers, mitosis spindle fibers, enzyme lock-and-key shapes
- Hand-drawn/sketch quality but CLEAN and PROFESSIONAL
- Stat cards use dark navy (#0B1929) background with amber numbers for dramatic contrast
- Regular cards are white with subtle shadow and thin teal left border
- Generous whitespace \u2014 Apple Keynote level spacing

Premium consulting aesthetic with teal/green wireframe sketches on white. Clean, intellectual, data-forward.`;

// ─── STYLE: OVERVIEW ───────────────────────────────────────────────
const STYLE_OVERVIEW = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: White (#FFFFFF) or very light gray (#F0F4F8), clean, neutral.

TYPOGRAPHY: Noto Sans SC font for ALL text. ALL text in Chinese ONLY.
- Title: font-weight 700, color #1E293B (dark slate), size 28-32pt
- Body: font-weight 300, color #555555, size 16-18pt
- Stat numbers: font-weight 700, size 48-64pt

ILLUSTRATION STYLE (CRITICAL):
Use thematic colors for different science domains:
- Physics: Cyan #00B4D8 wireframe icons (atoms, wave functions, energy levels)
- Biology: Teal #14B8A6 wireframe icons (DNA, chromosomes, cells)
- Chemistry: Amber #FFB703 wireframe icons (molecular bonds, crystal structures)
- Thermodynamics: Rose #F43F5E wireframe icons (entropy arrows, heat flow)
- DETAILED icons with character \u2014 each domain should feel visually distinct through color
- Cards are white with domain-colored left borders, rounded 12px, subtle shadow
- Generous whitespace \u2014 Apple Keynote level

Premium multi-domain scientific consulting aesthetic. Clean, comparative, authoritative.`;

// ─── SLIDE PROMPTS ─────────────────────────────────────────────────
const slides = [

// === SLIDE 1: COVER ================================================
{
  style: "cover",
  prompt: `
TITLE ONLY \u2014 centered vertically on the left half:
Line 1: "\u751f\u547d\u662f\u4ec0\u4e48\uff1f" \u2014 bold, 54pt, very dark navy (#1A1A2E), Noto Sans SC
Line 2 (below, 20pt gap): "\u859b\u5b9a\u8c14\u300aWhat is Life?\u300b\u7814\u8bfb\u7b14\u8bb0" \u2014 light weight, 24pt, muted purple (#4A3A6E)

NO other text. No date, no metadata. ONLY the two lines above.

The faint wireframe science watermarks in the right half should be barely visible \u2014 DNA double helix, atom with electron orbits, crystal lattice, entropy equation.
Generous empty space with elegant centered typography. Pure typographic impact.`
},

// === SLIDE 2: ROADMAP ==============================================
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, dark slate): "\u5168\u4e66\u8def\u7ebf\u56fe"
SUBTITLE (below title, light gray): "\u4ece\u5929\u771f\u7269\u7406\u5b66\u5bb6\u7684\u76f4\u89c9\u51fa\u53d1\uff0c\u7ecf\u8fc7\u9057\u4f20\u5b66\u4e8b\u5b9e\u7684\u51b2\u51fb\uff0c\u9010\u6b65\u903c\u8fd1\u4e00\u4e2a\u65b0\u7684\u5fae\u89c2\u56fe\u666f"

EIGHT WHITE CARDS in 2x4 grid with generous spacing. Each card has a colored left border and a small wireframe icon:

Card 01 \u2014 cyan left border, wireframe telescope icon:
"01" (bold, cyan) / "\u8de8\u5b66\u79d1\u89c6\u89d2" (bold) / "\u7269\u7406\u5b66\u5bb6\u4e3a\u4f55\u8981\u7814\u7a76\u751f\u547d\uff1f" (light gray)

Card 02 \u2014 amber left border, wireframe bell curve icon:
"02" (bold, amber) / "\u7edf\u8ba1\u5f8b\u6096\u8bba" (bold) / "\u5927\u6570\u5b9a\u5f8b vs \u5c11\u6570\u539f\u5b50\u63a7\u5236" (light gray)

Card 03 \u2014 teal left border, wireframe chromosome icon:
"03" (bold, teal) / "\u9057\u4f20\u5bc6\u7801" (bold) / "\u67d3\u8272\u4f53\u4e2d\u7684\u56db\u7ef4\u56fe\u5f0f\u811a\u672c" (light gray)

Card 04 \u2014 rose left border, wireframe lightning/mutation icon:
"04" (bold, rose) / "\u7a81\u53d8\u4e0e\u8dc3\u8fc1" (bold) / "\u79bb\u6563\u7684\u91cf\u5b50\u5f0f\u6027\u72b6\u6539\u53d8" (light gray)

Card 05 \u2014 cyan left border, wireframe quantum energy levels icon:
"05" (bold, cyan) / "\u91cf\u5b50\u7a33\u5b9a\u6027" (bold) / "\u5316\u5b66\u952e\u4e3a\u57fa\u56e0\u63d0\u4f9b\u6301\u4e45\u7a33\u5b9a" (light gray)

Card 06 \u2014 amber left border, wireframe crystal lattice icon:
"06" (bold, amber) / "\u975e\u5468\u671f\u6676\u4f53" (bold) / "\u5fae\u578b\u4ee3\u7801\u538b\u7f29\u7684\u7269\u8d28\u5f62\u6001" (light gray)

Card 07 \u2014 teal left border, wireframe entropy flow icon:
"07" (bold, teal) / "\u8d1f\u71b5\u4e0e\u79e9\u5e8f" (bold) / "\u751f\u547d\u5982\u4f55\u9006\u7740\u70ed\u529b\u5b66\u6d3b\u7740" (light gray)

Card 08 \u2014 rose left border, wireframe clockwork/gear icon:
"08" (bold, rose) / "\u65b0\u578b\u5b9a\u5f8b" (bold) / "\u811a\u672c\u590d\u5236 vs \u7edf\u8ba1\u5e73\u5747" (light gray)

Each card has its wireframe icon in the top-right corner. Clean grid, generous spacing, Apple Keynote aesthetic.`
},

// === SLIDE 3: STATISTICAL LAWS =====================================
{
  style: "physics_dark",
  prompt: `
TITLE (top-left, bold, cyan #00B4D8): "\u7edf\u8ba1\u5f8b\u4e0e\u539f\u5b50\u5c3a\u5ea6\u7684\u6096\u8bba"

LEFT HERO SECTION \u2014 large dark card (#132F4C) taking ~35% width:
Diagram: Wireframe Gaussian bell curve with "n" particles scattered below it, in cyan lines. Some particles glow amber where the formula appears.
Huge stat overlay: "1/\u221an" (72pt, bold, #FFB703 amber)
Below stat: "\u7edf\u8ba1\u8bef\u5dee\u5c3a\u5ea6" (16pt, cyan)
Bottom of card: "n \u8d8a\u5927\uff0c\u5b8f\u89c2\u5b9a\u5f8b\u8d8a\u7cbe\u786e" (14pt, light gray)

RIGHT COLUMN \u2014 three stacked dark cards with cyan left borders and wireframe icons:

Card 1 \u2014 icon: wireframe bar magnet with scattered magnetic dipoles aligning:
"\u987a\u78c1\u6027" (bold, cyan)
"\u5355\u4e2a\u5206\u5b50\u5728\u70ed\u8fd0\u52a8\u4e2d\u4e71\u8f6c\uff0c\u5de8\u91cf\u5206\u5b50\u5e73\u5747\u540e\u51fa\u73b0\u4e0e\u5916\u573a\u6210\u6bd4\u4f8b\u7684\u78c1\u5316" (light gray)

Card 2 \u2014 icon: wireframe particle zigzagging randomly (Brownian motion path):
"\u5e03\u6717\u8fd0\u52a8" (bold, cyan)
"\u5fae\u7c92\u88ab\u5355\u5206\u5b50\u649e\u51fb\u4f1a\u4e71\u8df3\uff0c\u53ea\u6709\u5e73\u5747\u624d\u5448\u73b0\u7a33\u5b9a\u89c4\u5f8b" (light gray)

Card 3 \u2014 icon: wireframe precision gauge/thermometer with noise squiggles:
"\u6d4b\u91cf\u7cbe\u5ea6" (bold, cyan)
"\u4eea\u5668\u592a\u7075\u654f\u5c31\u88ab\u70ed\u566a\u58f0\u652f\u914d\uff0c\u5fc5\u987b\u9760\u91cd\u590d\u5e73\u5747\u62bd\u51fa\u89c4\u5f8b" (light gray)

BOTTOM \u2014 full-width accent card with subtle cyan border glow:
"\u6096\u8bba\uff1a\u9057\u4f20\u4e0e\u53d1\u80b2\u7684\u5173\u952e\u63a7\u5236\uff0c\u4f9d\u8d56\u6781\u5c0f\u7684\u4e00\u7ec4\u539f\u5b50\u2014\u2014\u5c0f\u5230\u7edf\u8ba1\u5f8b\u4e0d\u8be5\u6210\u7acb\uff0c\u5374\u8868\u73b0\u51fa\u5c16\u9510\u7684\u751f\u7269\u5b66\u5b9a\u5f8b" (light, 16pt)`
},

// === SLIDE 4: GENETIC CODE =========================================
{
  style: "biology_light",
  prompt: `
TITLE (top-left, bold, dark slate): "\u67d3\u8272\u4f53\u5bc6\u7801\u811a\u672c\u4e0e\u56db\u7ef4\u56fe\u5f0f"

LEFT LARGE CARD (~45% width) \u2014 white, subtle shadow, amber left border (4px):
Diagram: Wireframe film reel unspooling from a fertilized egg cell, showing developmental stages (egg \u2192 embryo \u2192 organism), in teal lines. The film strip represents the "4D pattern" \u2014 not a photo but a movie.

Header: "\u56db\u7ef4\u56fe\u5f0f" (bold, teal, 24pt)
Subheader: "\u9057\u4f20\u4e0d\u662f\u7167\u7247\uff0c\u800c\u662f\u7535\u5f71" (cyan, 16pt)

Body text:
"\u751f\u7269\u4f53\u662f\u4ece\u53d7\u7cbe\u5375\u5230\u6210\u719f\u518d\u5230\u7e41\u6b96\u7684\u6574\u4e2a\u65f6\u7a7a\u5c55\u5f00\u8fc7\u7a0b\u3002"
"\u67d3\u8272\u4f53\u91cc\u7684\u5bc6\u7801\u811a\u672c\u2014\u2014\u4e0d\u662f\u8c61\u5f81\u610f\u4e49\u7684\u4ee3\u7801\uff0c\u800c\u662f\u7269\u8d28\u610f\u4e49\u4e0a\u7684\u4ee3\u7801\uff0c\u65e2\u8bb0\u5f55\u7ed3\u6784\uff0c\u4e5f\u53c2\u4e0e\u751f\u6210\u7ed3\u6784\u3002"

RIGHT COLUMN \u2014 three stacked white cards with colored left borders:

Card 1 \u2014 cyan border, wireframe cell dividing with chromosome copies visible:
"\u6709\u4e1d\u5206\u88c2" (bold, dark) / "\u9ad8\u4fdd\u771f\u590d\u5236" (light, cyan)
"\u6bcf\u6761\u67d3\u8272\u4f53\u88ab\u7cbe\u786e\u590d\u5236\uff0c\u6bcf\u4e2a\u4f53\u7ec6\u80de\u90fd\u643a\u5e26\u53cc\u4efd\u5b8c\u6574\u811a\u672c" (gray)

Card 2 \u2014 teal border, wireframe crossover event between two chromosomes:
"\u51cf\u6570\u5206\u88c2" (bold, dark) / "\u591a\u6837\u6027\u5236\u5ea6" (light, teal)
"\u53cc\u4efd\u811a\u672c\u62c6\u4e3a\u5355\u4efd\uff0c\u4ea4\u53c9\u4e92\u6362\u5236\u9020\u53ef\u9057\u4f20\u5dee\u5f02" (gray)

Card 3 \u2014 amber border, wireframe engineering diagram (redundancy + recombination + mutation):
"\u4fe1\u606f\u5de5\u7a0b" (bold, dark) / "\u5197\u4f59 + \u91cd\u7ec4 + \u7a81\u53d8" (light, amber)
"\u5197\u4f59\u4fdd\u8bc1\u7a33\u5b9a\uff0c\u91cd\u7ec4\u4fdd\u8bc1\u63a2\u7d22\uff0c\u7a81\u53d8\u63d0\u4f9b\u521b\u65b0\u7684\u4f4e\u9891\u901a\u9053" (gray)

Clean, airy, each card's wireframe icon is detailed and recognizable.`
},

// === SLIDE 5: MUTATION =============================================
{
  style: "physics_dark",
  prompt: `
TITLE (top-left, bold, cyan #00B4D8): "\u7a81\u53d8\uff1a\u8dc3\u8fc1\u5f0f\u6539\u53d8\u4e0e\u5c11\u6570\u539f\u5b50\u4e8b\u4ef6"
SUBTITLE (below, light gray): "\u9057\u4f20\u5dee\u5f02\u5982\u679c\u53ea\u9760\u91cd\u7ec4\u7ec8\u7a76\u6709\u9650\uff1b\u771f\u6b63\u63a8\u52a8\u7269\u79cd\u8fdc\u8ddd\u79bb\u8dc3\u8fc1\u7684\u662f\u7a81\u53d8"

TWO PROPERTY CARDS side by side at top (~40% height):

Card LEFT \u2014 dark card (#132F4C), amber top accent line:
Diagram: Wireframe showing a discontinuous jump \u2014 an organism's trait curve with a sharp step function (not smooth), in amber lines. An arrow marks the sudden jump point.
"\u8df3\u8dc3\u5f0f" (bold, #FFB703, 24pt)
"\u6027\u72b6\u4e0d\u662f\u8fde\u7eed\u6f02\u79fb\uff0c\u800c\u662f\u7a81\u7136\u6362\u6321" (light gray)

Card RIGHT \u2014 dark card (#132F4C), amber top accent line:
Diagram: Wireframe showing a switch/toggle being flipped, with identical copies radiating from it (showing faithful reproduction), in amber lines.
"\u53ef\u9057\u4f20\u4e14\u7a33\u5b9a" (bold, #FFB703, 24pt)
"\u4e00\u65e6\u51fa\u73b0\u4fbf\u88ab\u51c6\u786e\u590d\u5236\uff0c\u50cf\u5f00\u5173\u4e00\u6837" (light gray)

MIDDLE SECTION:
Header: "X\u5c04\u7ebf\u8bf1\u53d8\u5b9e\u9a8c\u7684\u4e24\u6761\u5f3a\u7ea6\u675f" (bold, cyan, 20pt)

Two constraint cards side by side with subtle cyan border glow:
Card 1 \u2014 wireframe X-ray beam hitting a single point on a chromosome:
"\u2460 \u7a81\u53d8\u5e38\u5bf9\u5e94\u5355\u6b21\u7269\u7406\u4e8b\u4ef6\u2014\u2014\u4e00\u6b21\u7167\u5c04\u5373\u53ef\u89e6\u53d1" (light)

Card 2 \u2014 wireframe chromosome with one localized point mutation marker:
"\u2461 \u7a81\u53d8\u4f4d\u70b9\u5177\u6709\u5c40\u90e8\u6027\u2014\u2014\u4e0d\u662f\u5168\u5c40\u6563\u5f00" (light)

BOTTOM \u2014 accent bar with amber line:
"\u7ed3\u8bba\uff1a\u9020\u6210\u6027\u72b6\u5f00\u5173\u53d8\u5316\u7684\uff0c\u662f\u67d3\u8272\u4f53\u4e2d\u6781\u5c11\u6570\u539f\u5b50\u7684\u91cd\u6392\u6216\u66ff\u6362" (bold, amber, 16pt)`
},

// === SLIDE 6: QUANTUM STABILITY ====================================
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, dark slate): "\u91cf\u5b50\u529b\u5b66\u8bc1\u636e\uff1a\u57fa\u56e0\u5fc5\u987b\u662f\u91cf\u5b50\u7a33\u5b9a\u4f53"

TWO LARGE COMPARISON CARDS side by side:

LEFT CARD \u2014 white, rose #F43F5E top header bar:
Header in white on rose bg: "\u7ecf\u5178\u70ed\u566a\u58f0\u4e0b\u7684\u56f0\u5883" (bold, white)
Diagram: Wireframe showing a molecule being shaken apart by thermal vibrations \u2014 wavy red/rose lines representing heat, structure crumbling into disorder.

Body:
"\u82e5\u57fa\u56e0\u662f\u666e\u901a\u5206\u5b50\u96c6\u5408\uff1a" (bold)
\u2022 "\u7ed3\u6784\u7684\u957f\u671f\u7a33\u5b9a\u6027\u4e0d\u53ef\u80fd"
\u2022 "\u7a81\u53d8\u5e94\u662f\u8fde\u7eed\u6a21\u7cca\u7684"

"\u4f46\u9057\u4f20\u4e8b\u5b9e\u8981\u6c42\uff1a" (bold)
\u2022 "\u51e0\u5341\u5e74\u4e43\u81f3\u8de8\u4e16\u4ee3\u7a33\u5b9a"
\u2022 "\u5076\u5c14\u4f46\u79bb\u6563\u7684\u8df3\u53d8"

RIGHT CARD \u2014 white, cyan #00B4D8 top header bar:
Header in white on cyan bg: "\u91cf\u5b50\u529b\u5b66\u7684\u81ea\u7136\u89e3\u91ca" (bold, white)
Diagram: Wireframe showing discrete quantum energy levels \u2014 horizontal lines at different heights with an electron dot sitting in a stable well. A dotted arrow shows "quantum jump" between levels. Drawn in cyan lines.

Body:
\u2022 "\u5206\u5b50\u5904\u4e8e\u79bb\u6563\u80fd\u7ea7"
\u2022 "\u5316\u5b66\u952e\u5bf9\u5e94\u7a33\u5b9a\u91cf\u5b50\u6001"
\u2022 "\u6539\u53d8\u7ed3\u6784\u5fc5\u987b\u8de8\u8d8a\u80fd\u5792"

Highlighted conclusion: "\u5e73\u65f6\u6781\u7a33\u3001\u5076\u5c14\u8dc3\u8fc1" (bold, cyan, 20pt)

BOTTOM \u2014 full-width dark card (#0B1929):
"\u91cf\u5b50\u4e0d\u662f\u7ed9\u751f\u547d\u6dfb\u795e\u79d8\uff0c\u800c\u662f\u552f\u4e00\u80fd\u8ba9\u5c11\u6570\u539f\u5b50\u957f\u671f\u7cbe\u786e\u5de5\u4f5c\u6210\u4e3a\u53ef\u80fd\u7684\u7269\u7406\u57fa\u7840" (bold, white, 16pt)`
},

// === SLIDE 7: APERIODIC CRYSTAL ====================================
{
  style: "physics_dark",
  prompt: `
TITLE (top-left, bold, cyan #00B4D8): "\u975e\u5468\u671f\u6676\u4f53\uff1a\u751f\u547d\u811a\u672c\u7684\u7269\u8d28\u5f62\u6001"

TOP QUOTE BAR \u2014 dark card (#132F4C) full width:
"\u57fa\u56e0\u4e0d\u662f\u6db2\u4f53\u5316\u5b66\u53cd\u5e94\uff0c\u800c\u662f\u56fa\u4f53\u7269\u7406\u5bf9\u8c61" (italic, #FFB703 amber, centered, 20pt)

MAIN \u2014 TWO LARGE COMPARISON CARDS side by side:

LEFT CARD \u2014 dark card (#132F4C), muted gray border:
Header: "\u5468\u671f\u6676\u4f53" (bold, #CBD5E1 muted, 24pt, centered)
Subheader: "\u76d0\u3001\u91d1\u5c5e\u7b49" (light gray, centered)

Diagram: Wireframe crystal lattice with IDENTICAL repeating unit cells in a perfect grid pattern, drawn in muted gray lines. All cells are the same \u2014 emphasizing monotonous repetition. Like a tiled floor.

Below diagram in monospace style: "0 0 0 0 0 0 0 0 / 0 0 0 0 0 0 0 0 / 0 0 0 0 0 0 0 0" (gray)
"\u91cd\u590d\u5355\u5143 \u2192 \u7a33\u5b9a / \u4fe1\u606f\u5bc6\u5ea6\u6781\u4f4e" (small, gray)

RIGHT CARD \u2014 dark card with GLOWING cyan border (#00B4D8), elevated:
Header: "\u975e\u5468\u671f\u6676\u4f53" (bold, #00B4D8, 24pt, centered)
Subheader: "\u9057\u4f20\u7269\u8d28 (DNA)" (light, cyan, centered)

Diagram: Wireframe DNA double helix with DIFFERENT base pairs at each rung (A-T, G-C, T-A, C-G...), drawn in cyan and amber lines. Each rung is slightly different \u2014 emphasizing non-repeating, information-rich structure. Like a unique tapestry.

Below diagram: "A T G C C A T G / G C A T T G C A / T A C G A T G C" (amber, monospace)
"\u4e0d\u91cd\u590d\u5e8f\u5217 \u2192 \u6709\u5e8f / \u6781\u9ad8\u4fe1\u606f\u5bc6\u5ea6" (small, cyan)

BOTTOM \u2014 accent text centered:
"\u67d3\u8272\u4f53\u5728\u5fae\u578b\u5c3a\u5ea6\u4e0a\u538b\u7f29\u4e86\u6781\u4e30\u5bcc\u7684\u5185\u5bb9\u2014\u2014\u5c11\u6570\u539f\u5b50\u63a7\u5236\u56db\u7ef4\u56fe\u5f0f" (amber, 16pt)

The visual contrast between the boring periodic grid and the rich aperiodic helix should be DRAMATIC.`
},

// === SLIDE 8: NEGATIVE ENTROPY =====================================
{
  style: "biology_light",
  prompt: `
TITLE (top-left, bold, dark slate): "\u8d1f\u71b5\uff1a\u751f\u547d\u5982\u4f55\u9006\u7740\u70ed\u529b\u5b66\u6d3b\u7740"

THREE-STEP PROCESS FLOW at top \u2014 three white cards in a row connected by arrows:

Card 1 \u2014 rose #F43F5E top accent bar, number circle "1":
Diagram: Wireframe showing particles scattering into disorder (entropy increasing), drawn in rose lines.
"\u6096\u8bba\u8868\u8c61" (bold)
"\u65e0\u751f\u547d\u7269\u8d28\u8d70\u5411\u70ed\u5e73\u8861\uff0c\u7ed3\u6784\u8d8b\u4e8e\u65e0\u5e8f\uff1b\u751f\u547d\u5374\u7ef4\u6301\u9ad8\u5ea6\u6709\u5e8f\u7ed3\u6784" (gray)

\u2192 arrow

Card 2 \u2014 cyan #00B4D8 top accent bar, number circle "2":
Diagram: Wireframe showing organism absorbing ordered energy (food) and expelling disordered waste (heat), in cyan lines. An arrow labeled "\u8d1f\u71b5\u6d41" points into the organism.
"\u8d1f\u71b5\u89e3\u7b54" (bold)
"\u751f\u547d\u4f53\u4ece\u73af\u5883\u6c72\u53d6\u8d1f\u71b5/\u79e9\u5e8f\u6d41\u6765\u7ef4\u6301\u81ea\u8eab\u7ec4\u7ec7" (gray)

\u2192 arrow

Card 3 \u2014 teal #14B8A6 top accent bar, number circle "3":
Diagram: Wireframe showing a balanced equation \u2014 small area of order (organism) surrounded by larger area of disorder (environment), in teal lines. A scale tips showing local entropy decrease paid by global increase.
"\u70ed\u529b\u5b66\u8c03\u548c" (bold)
"\u5c40\u90e8\u71b5\u51cf\u4f9d\u8d56\u4e8e\u66f4\u5927\u73af\u5883\u7684\u71b5\u589e\u2014\u2014\u6709\u5e8f\u662f\u88ab\u4ed8\u8d39\u8d2d\u4e70\u7684" (gray)

BOTTOM SECTION \u2014 wide white card comparing two types of order:

LEFT half \u2014 light gray (#F0F4F8) background:
"Order-from-Disorder" (bold, monospace, gray)
"\u4ece\u65e0\u5e8f\u4e2d\u901a\u8fc7\u7edf\u8ba1\u5e73\u5747\u6d8c\u73b0\uff08\u65e0\u751f\u547d\u4e16\u754c\uff09" (light)

RIGHT half \u2014 light teal tinted background:
"Order-from-Order" (bold, monospace, teal)
"\u5df2\u6709\u79e9\u5e8f\u7684\u590d\u5236\u4e0e\u5c55\u5f00\uff08\u751f\u547d\u4f53\u7cfb\uff09" (light)

Wireframe divider between the two halves \u2014 a thin vertical line with a double-headed arrow.`
},

// === SLIDE 9: FIVE CONCLUSIONS =====================================
{
  style: "physics_dark",
  prompt: `
TITLE (top-left, bold, cyan #00B4D8): "\u751f\u547d\u7684\u7269\u7406\u7b54\u6848\uff1a\u4e94\u6761\u6536\u675f"
SUBTITLE (below, light gray): "\u859b\u5b9a\u8c14\u5c06\u751f\u547d\u662f\u4ec0\u4e48\u7684\u7b54\u6848\u6536\u675f\u4e3a\u4e00\u4e2a\u5e72\u51c0\u7684\u56fe\u666f"

FIVE HORIZONTAL BARS stacked vertically, full width, each with a colored left accent bar (4px) and a small wireframe icon on the left:

Bar 1 \u2014 cyan #00B4D8 accent, wireframe crystal lattice icon:
"\u2460 \u9057\u4f20\u7269\u8d28\u662f\u91cf\u5b50\u7a33\u5b9a\u7684\u975e\u5468\u671f\u6676\u4f53" (18pt, light)

Bar 2 \u2014 teal #14B8A6 accent, wireframe miniature blueprint icon:
"\u2461 \u5b83\u5728\u5fae\u578b\u533a\u57df\u5b58\u653e\u53ef\u590d\u5236\u7684\u56db\u7ef4\u56fe\u5f0f" (18pt, light)

Bar 3 \u2014 amber #FFB703 accent, wireframe organism absorbing energy icon:
"\u2462 \u751f\u547d\u4f5c\u4e3a\u5f00\u653e\u7cfb\u7edf\u4ece\u73af\u5883\u6444\u53d6\u8d1f\u71b5" (18pt, light)

Bar 4 \u2014 cyan #00B4D8 accent, wireframe DNA replication fork icon:
"\u2463 \u901a\u8fc7 order-from-order \u628a\u79e9\u5e8f\u8de8\u4ee3\u4f20\u9012" (18pt, light)

Bar 5 \u2014 rose #F43F5E accent, wireframe lightbulb/new-law icon:
"\u2464 \u8fd9\u7c7b\u6784\u9020\u53ef\u80fd\u5bf9\u5e94\u5c1a\u672a\u88ab\u5145\u5206\u5f62\u5f0f\u5316\u7684\u65b0\u578b\u539f\u5219" (18pt, light)

Each bar has dark background (#132F4C), generous height (~0.8in), the wireframe icon on the left edge (inside a circle), and text flowing to the right. The bars should feel like a clean numbered list with strong visual rhythm.

BOTTOM \u2014 subtle italic footer in muted gray:
"\u7c7b\u6bd4\uff1a\u4e00\u4e2a\u53ea\u61c2\u70ed\u673a\u7684\u5de5\u7a0b\u5e08\u770b\u5230\u7535\u673a\uff0c\u4f1a\u9884\u671f\u5b8c\u5168\u4e0d\u540c\u7684\u5de5\u4f5c\u539f\u7406\u2014\u2014\u4f46\u4e0d\u4f1a\u56e0\u6b64\u76f8\u4fe1\u7535\u673a\u88ab\u9b3c\u9b42\u9a71\u52a8" (italic, 14pt)`
},

// === SLIDE 10: MODERN ECHOES =======================================
{
  style: "overview",
  prompt: `
TITLE (top-left, bold, dark slate): "\u73b0\u4ee3\u56de\u54cd\u4e0e\u672a\u6765\u5c55\u671b"
SUBTITLE (below, gray): "\u859b\u5b9a\u8c14 1944 \u5e74\u7684\u9884\u8a00\uff0c\u5728\u73b0\u4ee3\u79d1\u5b66\u4e2d\u5f97\u5230\u4e86\u54ea\u4e9b\u5370\u8bc1\uff1f"

FOUR WHITE CARDS in 2x2 grid with colored top accent bars and wireframe icons:

Card 1 (top-left) \u2014 cyan #00B4D8 top bar:
Year badge: "1953" (monospace, bold, cyan, in small rounded rectangle)
Diagram: Wireframe DNA double helix being revealed/discovered, in cyan lines.
"DNA \u53cc\u87ba\u65cb" (bold, dark, 20pt)
"\u6c83\u68ee-\u514b\u91cc\u514b\u53d1\u73b0\u53cc\u87ba\u65cb\uff0c\u7cbe\u51c6\u5b9e\u73b0\u859b\u5b9a\u8c14\u9884\u8a00\uff1a\u4e3b\u94fe\u63d0\u4f9b\u7a33\u5b9a\uff0c\u78b1\u57fa\u5e8f\u5217\u63d0\u4f9b\u975e\u5468\u671f\u4fe1\u606f\uff0c\u590d\u5236\u673a\u5236\u63d0\u4f9b order-from-order" (10pt, gray)

Card 2 (top-right) \u2014 teal #14B8A6 top bar:
Year badge: "1960s+"
Diagram: Wireframe polymerase reading/writing DNA tape like a read/write head, in teal lines.
"\u4fe1\u606f\u8bba\u5316\u5b66" (bold, dark, 20pt)
"\u9057\u4f20\u8fc7\u7a0b\u4f5c\u4e3a\u4fe1\u606f\u5de5\u7a0b\uff1a\u7f16\u7801\u3001\u7ea0\u9519\u3001\u5197\u4f59\u3001\u538b\u7f29\u3001\u8bfb\u5199\u5934\u2014\u2014\u859b\u5b9a\u8c14\u5df2\u628a\u811a\u672c\u6982\u5ff5\u653e\u5230\u4e86\u53f0\u524d" (10pt, gray)

Card 3 (bottom-left) \u2014 amber #FFB703 top bar:
Year badge: "1970s+"
Diagram: Wireframe dissipative structure (Prigogine style) \u2014 an ordered vortex maintained by energy flow, in amber lines.
"\u975e\u5e73\u8861\u7edf\u8ba1\u7269\u7406" (bold, dark, 20pt)
"\u666e\u91cc\u9ad8\u6d25\u4e0e\u590d\u6742\u7cfb\u7edf\u7406\u8bba\u8ba9\u5f00\u653e\u7cfb\u7edf\u7ef4\u6301\u4f4e\u71b5\u7ed3\u6784\u6210\u4e3a\u53ef\u8ba1\u7b97\u6846\u67b6\uff0c\u8d1f\u71b5\u4e0d\u4ec5\u662f\u6bd4\u55bb" (10pt, gray)

Card 4 (bottom-right) \u2014 rose #F43F5E top bar:
Year badge: "2012+"
Diagram: Wireframe CRISPR scissors cutting a DNA strand at a precise location, in rose lines.
"CRISPR \u57fa\u56e0\u7f16\u8f91" (bold, dark, 20pt)
"\u5c11\u6570\u539f\u5b50\u63a7\u5236\u5927\u5c3a\u5ea6\u79e9\u5e8f\u53d8\u5f97\u53ef\u64cd\u4f5c\u2014\u2014\u6211\u4eec\u4e0d\u4ec5\u80fd\u8bfb\u61c2\u9057\u4f20\u5bc6\u7801\uff0c\u8fd8\u80fd\u6539\u5199\u5b83" (10pt, gray)

FOOTER (centered, italic, muted):
"\u751f\u547d\u7684\u5965\u79d8\u8fdc\u672a\u88ab\u5b8c\u5168\u63ed\u793a\uff0c\u4f46\u859b\u5b9a\u8c14\u63d0\u4f9b\u7684\u7269\u7406-\u751f\u7269\u5b66\u6865\u6881\u601d\u7ef4\uff0c\u5c06\u7ee7\u7eed\u6307\u5bfc\u6211\u4eec\u63a2\u7d22\u8fd9\u4e2a\u590d\u6742\u800c\u7f8e\u5999\u7684\u9886\u57df"

Each card has its wireframe diagram in the upper portion, text below. Clean 2x2 grid, generous spacing.`
},

];

// ─── STYLE RESOLVER ────────────────────────────────────────────────
function getStyle(tag) {
  switch(tag) {
    case "cover": return STYLE_COVER;
    case "physics_dark": return STYLE_PHYSICS_DARK;
    case "biology_light": return STYLE_BIOLOGY_LIGHT;
    case "overview": return STYLE_OVERVIEW;
    default: return STYLE_OVERVIEW;
  }
}

// ─── GENERATION ENGINE ─────────────────────────────────────────────
async function genSlide(ai, idx) {
  const s = slides[idx];
  const outFile = path.join(SLIDE_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);

  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`Cached: slide ${idx + 1}`);
    return outFile;
  }

  const prefix = getStyle(s.style);
  const fullPrompt = prefix + "\n\n" + s.prompt;

  for (let a = 1; a <= 3; a++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        config: {
          responseModalities: ["IMAGE", "TEXT"],
          imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
        },
      });
      for (const p of (res.candidates?.[0]?.content?.parts || [])) {
        if (p.inlineData) {
          const buf = Buffer.from(p.inlineData.data, "base64");
          fs.writeFileSync(outFile, buf);
          console.log(`Slide ${idx + 1}: ${(buf.length / 1024).toFixed(0)}KB`);
          return outFile;
        }
      }
      console.log(`Slide ${idx + 1}: no image, attempt ${a}/3`);
    } catch (err) {
      console.log(`Slide ${idx + 1}: error ${a}/3 \u2014 ${err.message?.slice(0, 200)}`);
      if (a < 3) await new Promise(r => setTimeout(r, 15000));
    }
  }
  console.log(`Slide ${idx + 1}: FAILED after 3 attempts`);
  return null;
}

async function main() {
  if (!fs.existsSync(SLIDE_DIR)) fs.mkdirSync(SLIDE_DIR);
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const CONCURRENCY = 5;
  console.log(`Generating ${TOTAL} slides (${CONCURRENCY} parallel)...`);
  const paths = new Array(slides.length).fill(null);

  for (let batch = 0; batch < slides.length; batch += CONCURRENCY) {
    const tasks = [];
    for (let i = batch; i < Math.min(batch + CONCURRENCY, slides.length); i++) {
      tasks.push(genSlide(ai, i).then(p => { paths[i] = p; }));
    }
    await Promise.all(tasks);
  }

  // Build PPTX
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

  const outFile = "\u751f\u547d\u662f\u4ec0\u4e48-\u7814\u8bfb\u7b14\u8bb0.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${TOTAL} slides)`);
}

main().catch(err => console.error("Fatal:", err));
