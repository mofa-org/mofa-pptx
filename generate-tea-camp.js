const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-tea-camp";
const SW = 13.333, SH = 7.5;

// ═══════════════════════════════════════════════════════════════════════
// STYLE: COVER \u2014 Ink-wash mountain landscape, Phoenix Mountain silhouette
// ═══════════════════════════════════════════════════════════════════════
const STYLE_COVER = `Create a presentation slide image. 1920\u00d71080 pixels, 16:9 landscape format.

BACKGROUND: Traditional Chinese ink-wash painting (\u6c34\u58a8\u753b) style landscape. Misty mountains in layered silhouettes \u2014 from pale gray-blue at the back to deep indigo in the foreground. Phoenix Mountain (\u51e4\u51f0\u5c71) range with ancient tea terraces faintly visible on slopes. Morning mist rising between peaks. Subtle wash of warm golden light from one edge suggesting dawn.

COLOR PALETTE:
- Mountain ink: deep indigo #2C3E50 to pale blue-gray #B0C4D8
- Mist: white to pale cream #FFFAF0 with 40-60% transparency
- Tea garden accent: muted sage green #7D9B76
- Dawn warmth: pale gold #F5DEB3 at 20% opacity
- Text: warm charcoal #3C3226 on light areas, cream #FFFAF0 on dark areas

TYPOGRAPHY: Noto Serif SC (elegant Chinese serif) for titles, Noto Sans SC for body. ALL TEXT IN CHINESE. English only for proper nouns.
- Title: 700 weight, 44-52pt, warm charcoal or cream depending on background
- Subtitle: 300 weight, 20-24pt

ILLUSTRATION STYLE (CRITICAL):
Lingnan painting school (\u5cad\u5357\u753b\u6d3e) aesthetic \u2014 the Chaoshan regional variant:
- Traditional Chinese ink-wash brush strokes with wet-on-wet bleeding effects
- Botanical elements: tea leaves, phoenix dancong tea bushes, orchids, mountain flora painted in classical Chinese brush style
- Birds: occasionally a phoenix silhouette or mountain birds in ink
- NOT Western watercolor. NOT digital vector art. This is TRADITIONAL CHINESE PAINTING with bold brushwork, splashed ink (\u6cfc\u58a8), and the characteristic Lingnan "clash of water and powder" (\u649e\u6c34\u649e\u7c89) technique
- Generous empty space (\u7559\u767d) \u2014 the blank space IS part of the composition, like a classical Chinese painting scroll
- Premium, contemplative, scholarly atmosphere`;

// ═══════════════════════════════════════════════════════════════════════
// STYLE: DAY 1 \u2014 Sensory Awakening \u2014 Warm golden tones
// ═══════════════════════════════════════════════════════════════════════
const STYLE_DAY1 = `Create a presentation slide image. 1920\u00d71080 pixels, 16:9 landscape format.

BACKGROUND: Soft warm parchment (#FDF6EC) with very faint ink-wash tea plant watermark at 5-8% opacity in the bottom-right corner. Subtle texture like aged rice paper (\u5ba3\u7eb8).

COLOR PALETTE:
- Background: warm parchment #FDF6EC
- Primary accent: amber gold #C8973E (the color of dancong tea liquor)
- Secondary: warm brown #8B6914
- Card backgrounds: white #FFFFFF with very subtle warm shadow
- Card borders: thin left border in amber gold #C8973E or tea brown #6B4226
- Text title: deep warm brown #3C2415, 700 weight, 28-32pt
- Text body: warm gray #5D4E37, 300 weight, 16-18pt
- Stat numbers: amber gold #C8973E, 700 weight, 48-64pt

TYPOGRAPHY: Noto Serif SC for titles (elegant, traditional), Noto Sans SC for body text. ALL TEXT IN CHINESE. English only for proper nouns.

ILLUSTRATION STYLE (CRITICAL):
Lingnan painting school (\u5cad\u5357\u753b\u6d3e) ink-wash illustrations in warm amber/brown tones:
- Ink-wash brush stroke illustrations of: tea cups, tea leaves, aroma wisps, sensory organs, children exploring
- Warm amber (#C8973E) and brown (#6B4226) ink lines \u2014 like painting with strong tea
- Botanical sketches of Phoenix Dancong tea branches with leaves and buds in classical Chinese painting style
- Loose, expressive brush strokes but CLEAN and READABLE
- Cards are white with subtle warm shadow and thin tea-colored left border, rounded 12px
- Generous whitespace \u2014 Apple Keynote level spacing with the contemplative emptiness of Chinese painting
- Small decorative tea leaf or steam motifs as section dividers

Premium consulting deck meets traditional Chinese aesthetic. McKinsey quality layout with Lingnan painting illustrations.`;

// ═══════════════════════════════════════════════════════════════════════
// STYLE: DAY 2 \u2014 Craft Heritage \u2014 Deep tea garden greens
// ═══════════════════════════════════════════════════════════════════════
const STYLE_DAY2 = `Create a presentation slide image. 1920\u00d71080 pixels, 16:9 landscape format.

BACKGROUND: Soft sage (#F4F7F2) with very faint ink-wash mountain tea garden watermark at 5-8% opacity. Subtle rice paper texture.

COLOR PALETTE:
- Background: pale sage #F4F7F2
- Primary accent: deep tea green #4A7C59
- Secondary: forest green #2D5A3D
- Warm accent: fired clay #A0522D (the color of charcoal-roasted tea)
- Card backgrounds: white #FFFFFF with subtle green-tinted shadow
- Card borders: thin left border in tea green #4A7C59
- Text title: deep forest #1E3A2A, 700 weight, 28-32pt
- Text body: muted green-gray #4A5D50, 300 weight, 16-18pt
- Stat numbers: deep tea green #4A7C59, 700 weight, 48-64pt

TYPOGRAPHY: Noto Serif SC for titles, Noto Sans SC for body. ALL TEXT IN CHINESE. English only for proper nouns.

ILLUSTRATION STYLE (CRITICAL):
Lingnan painting school ink-wash illustrations in green/earth tones:
- Ink-wash brush stroke illustrations of: ancient tea trees, tea processing tools, mountain landscapes, artisan hands at work
- Green (#4A7C59) and earth brown (#A0522D) ink lines \u2014 like painting with mountain spring water and charcoal
- Classical Chinese painting of tea plants: Dancong varietal branches, thick trunks of ancient tea trees, terraced gardens
- Hand-drawn quality with bold, confident Lingnan brushwork \u2014 NOT timid, NOT Western botanical illustration
- Fire/roasting elements drawn with warm ember-like brush strokes in clay red
- Cards white with subtle shadow and thin green left border, rounded 12px
- Generous whitespace and Lingnan-style empty space (\u7559\u767d)

Premium consulting aesthetic with deep green tea-garden Lingnan painting. Earthy, artisanal, heritage-rich.`;

// ═══════════════════════════════════════════════════════════════════════
// STYLE: DAY 3 \u2014 Creative Expression \u2014 Blossom pinks and warm whites
// ═══════════════════════════════════════════════════════════════════════
const STYLE_DAY3 = `Create a presentation slide image. 1920\u00d71080 pixels, 16:9 landscape format.

BACKGROUND: Warm white (#FFFBF5) with very faint ink-wash phoenix or orchid watermark at 5-8% opacity. Delicate rice paper texture.

COLOR PALETTE:
- Background: warm white #FFFBF5
- Primary accent: orchid pink #C1567D (Chaoshan embroidery color)
- Secondary: deep plum #7B2D4E
- Warm accent: golden amber #C8973E
- Card backgrounds: white #FFFFFF with subtle warm shadow
- Card borders: thin left border in orchid pink #C1567D or plum #7B2D4E
- Text title: deep plum-brown #4A2035, 700 weight, 28-32pt
- Text body: warm gray #5D4E55, 300 weight, 16-18pt
- Stat numbers: orchid pink #C1567D, 700 weight, 48-64pt

TYPOGRAPHY: Noto Serif SC for titles, Noto Sans SC for body. ALL TEXT IN CHINESE. English only for proper nouns.

ILLUSTRATION STYLE (CRITICAL):
Lingnan painting school ink-wash illustrations in pink/plum tones:
- Ink-wash brush stroke illustrations of: gongfu tea ceremony, tea ware (gaiwan, fairness cup, tasting cups), orchids, creative activities
- Orchid pink (#C1567D) and plum (#7B2D4E) ink lines \u2014 like painting with osmanthus and plum wine
- Lingnan school is famous for painting flowers \u2014 use orchids, plum blossoms, and phoenix imagery
- Elegant, celebratory brush strokes suggesting accomplishment and beauty
- Cards white with subtle warm shadow and thin pink left border, rounded 12px
- Generous whitespace

Premium consulting aesthetic with Lingnan floral painting elegance. Celebratory, creative, refined.`;

// ═══════════════════════════════════════════════════════════════════════
// STYLE: INFO \u2014 Clean data/overview slides with ink-wash accents
// ═══════════════════════════════════════════════════════════════════════
const STYLE_INFO = `Create a presentation slide image. 1920\u00d71080 pixels, 16:9 landscape format.

BACKGROUND: Clean warm white (#FEFCF8) with very subtle rice paper texture. No watermark or very faint tea leaf motif at 3-5% opacity.

COLOR PALETTE:
- Background: warm white #FEFCF8
- Primary: deep ink #2C2C2C
- Day 1 color: amber gold #C8973E
- Day 2 color: tea green #4A7C59
- Day 3 color: orchid pink #C1567D
- Card backgrounds: white #FFFFFF with subtle shadow
- Text title: deep ink #2C2C2C, 700 weight, 28-32pt
- Text body: warm gray #555555, 300 weight, 16-18pt

TYPOGRAPHY: Noto Serif SC for titles, Noto Sans SC for body. ALL TEXT IN CHINESE. English only for proper nouns.

ILLUSTRATION STYLE (CRITICAL):
Clean consulting layout with subtle Lingnan painting accents:
- Minimal ink-wash decorative elements \u2014 a brush stroke divider, a small tea branch corner ornament
- Data-forward: clean tables, stat callouts, comparison grids
- When illustrations appear, they are small refined ink-wash icons in gray or muted tones
- Cards white with thin colored left borders (using the day's accent color), rounded 12px
- Generous whitespace \u2014 Apple Keynote level
- This style prioritizes READABILITY and DATA over artistic illustration

Premium consulting aesthetic with understated Chinese painting touches. Clean, intellectual, authoritative.`;

// ═══════════════════════════════════════════════════════════════════════
// SLIDE PROMPTS
// ═══════════════════════════════════════════════════════════════════════
const slides = [

// \u2550\u2550\u2550 SLIDE 1: \u5c01\u9762 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "cover",
  prompt: `TITLE centered vertically on the LEFT 50%:
"\u5bfb\u8336\u8109" \u2014 bold, 52pt, cream #FFFAF0, Noto Serif SC
Below (20px gap): "3\u59292\u591c\u51e4\u51f0\u5355\u4e1b\u975e\u9057\u7814\u5b66\u8425" \u2014 24pt, light, cream #FFFAF0

NO other text. No date, no metadata, no English.

The RIGHT 50% should show a Lingnan ink-wash painting of Phoenix Mountain (\u51e4\u51f0\u5c71): misty peaks with ancient tea trees on terraced slopes, a few tea pickers as tiny silhouettes, morning mist rising. Painted in traditional Chinese brush style with splashed ink technique. A faint phoenix bird outline woven into the mountain mist.

The LEFT side should have generous empty space with just the title. Elegant, contemplative, like opening a classical painting scroll.`
},

// \u2550\u2550\u2550 SLIDE 2: \u7814\u5b66\u8425\u603b\u89c8 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "info",
  prompt: `TITLE (top-left, bold, deep ink): "\u7814\u5b66\u8425\u603b\u89c8"

FOUR WHITE CARDS in 2\u00d72 grid with generous spacing:

\u2500\u2500\u2500 CARD 1 (top-left): thin amber #C8973E left border \u2500\u2500\u2500
Small ink-wash icon: group of children silhouettes with tea cups
Header: "\u8425\u5458\u89c4\u6a21" (bold, #C8973E)
Body: "30\u4eba\uff086\u7ec4\u00d75\u4eba\uff09"
Subtitle: "9-15\u5c81\u9752\u5c11\u5e74 / \u4eb2\u5b50\u5bb6\u5ead\u7ec4" (small, gray)

\u2500\u2500\u2500 CARD 2 (top-right): thin green #4A7C59 left border \u2500\u2500\u2500
Small ink-wash icon: ancient tea tree with gnarled trunk
Header: "\u7814\u5b66\u5730\u70b9" (bold, #4A7C59)
Body: "\u6f6e\u5dde\u51e4\u51f0\u5c71"
Subtitle: "\u4e4c\u5cb4\u5c71\u53e4\u8336\u56ed\u00b7\u6d77\u62d41000\u7c73+" (small, gray)

\u2500\u2500\u2500 CARD 3 (bottom-left): thin pink #C1567D left border \u2500\u2500\u2500
Small ink-wash icon: three figures walking together (symbolizing \u4e09\u4eba\u884c)
Header: "\u5b66\u4e60\u6a21\u5f0f" (bold, #C1567D)
Body: "\u201c\u4e09\u4eba\u884c\u201d\u5c0f\u7ec4\u5408\u4f5c"
Subtitle: "80\u4e2a\u534f\u4f5c\u5f15\u5bfc\u8bdd\u672f\u00b7\u6c89\u6d78\u5f0f\u5b66\u4e60" (small, gray)

\u2500\u2500\u2500 CARD 4 (bottom-right): thin brown #6B4226 left border \u2500\u2500\u2500
Small ink-wash icon: three suns (sunrise, noon, sunset) representing 3 days
Header: "\u65f6\u95f4\u5b89\u6392" (bold, #6B4226)
Body: "3\u59292\u591c\u5168\u6d41\u7a0b"
Subtitle: "\u611f\u5b98\u89c9\u9192\u2192\u5de5\u827a\u63a2\u79d8\u2192\u521b\u610f\u8868\u8fbe" (small, gray)

Each card has its ink-wash icon in the top area. Cards are white with subtle warm shadow. LOTS of whitespace.`
},

// \u2550\u2550\u2550 SLIDE 3: \u4e09\u4eba\u884c\u5408\u4f5c\u5b66\u4e60\u6a21\u578b \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "info",
  prompt: `TITLE (top-left, bold, deep ink): "\u201c\u4e09\u4eba\u884c\u201d\u5408\u4f5c\u5b66\u4e60\u6a21\u578b"

HERO SECTION \u2014 centered, large:
A Lingnan-style ink-wash illustration of three figures walking together on a mountain tea path. One leads with a notebook (observer), one carries a basket (practitioner), one points ahead (navigator). Painted in warm brown/amber ink strokes on light background. Below: "\u4e09\u4eba\u884c\uff0c\u5fc5\u6709\u6211\u5e08\u7109" (20pt, italic, #6B4226)

THREE ROLE CARDS below, side by side:

\u2500\u2500\u2500 CARD 1: amber #C8973E left border \u2500\u2500\u2500
Icon: ink-wash eye/magnifying glass
"\u89c2\u5bdf\u8005" (bold, #C8973E, 22pt)
"\u8bb0\u5f55\u7ec6\u8282\u3001\u53d1\u73b0\u89c4\u5f8b"
"\u4e13\u6ce8\u529b\u00b7\u89c2\u5bdf\u529b\u00b7\u6279\u5224\u6027\u601d\u7ef4"

\u2500\u2500\u2500 CARD 2: green #4A7C59 left border \u2500\u2500\u2500
Icon: ink-wash hands working
"\u64cd\u4f5c\u8005" (bold, #4A7C59, 22pt)
"\u52a8\u624b\u5b9e\u8df5\u3001\u4f53\u9a8c\u5de5\u827a"
"\u52a8\u624b\u80fd\u529b\u00b7\u7a7a\u95f4\u611f\u77e5\u00b7\u8010\u5fc3"

\u2500\u2500\u2500 CARD 3: pink #C1567D left border \u2500\u2500\u2500
Icon: ink-wash speech bubble / megaphone
"\u8868\u8fbe\u8005" (bold, #C1567D, 22pt)
"\u6574\u5408\u4fe1\u606f\u3001\u5206\u4eab\u5c55\u793a"
"\u8bed\u8a00\u8868\u8fbe\u00b7\u903b\u8f91\u7ec4\u7ec7\u00b7\u81ea\u4fe1\u5fc3"

BOTTOM callout (subtle warm card):
"\u6bcf\u4e2a\u6a21\u5757\u89d2\u8272\u8f6e\u6362 \u2014 \u6bcf\u4e2a\u5b69\u5b50\u90fd\u4f53\u9a8c\u5168\u90e8\u4e09\u79cd\u89d2\u8272" (bold, centered, 18pt)

Generous spacing. The ink-wash illustration should be the visual centerpiece.`
},

// \u2550\u2550\u2550 SLIDE 4: DAY 1 \u603b\u89c8 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day1",
  prompt: `TITLE (top-left, bold, deep brown): "\u7b2c\u4e00\u5929\uff1a\u611f\u5b98\u89c9\u9192"
Subtitle below: "\u8bdd\u672f #1\u2014#28 \u00b7 \u4ece\u5473\u89c9\u5f00\u59cb\u8ba4\u8bc6\u5355\u4e1b" (16pt, warm gray)

LEFT SIDE \u2014 Large Lingnan ink-wash painting:
A steaming gaiwan (lidded tea cup) with aromatic wisps rising, painted in warm amber/brown ink. Around it, five sensory icons painted in brush style: an eye, a nose, an ear, a tongue, a hand \u2014 each radiating outward from the tea cup. The composition suggests the five senses awakening through tea.

RIGHT SIDE \u2014 FIVE MODULE CARDS stacked vertically:

Card 1 (amber border): "08:30 \u5f00\u8425\u4eea\u5f0f" \u2014 \u76f2\u54c1\u5206\u7ec4\u00b7\u5305\u5c3d\u5c3e\u4e4b\u65c5
Card 2 (amber border): "10:00 \u535a\u7269\u9986\u63a2\u6848" \u2014 \u7ebf\u7d22\u89e3\u8c1c\u00b7\u975e\u9057\u5bc6\u7801
Card 3 (amber border): "14:00 \u8336\u5c71\u51a5\u60f3" \u2014 \u81ea\u7136\u58f0\u666f\u00b7\u95ed\u76ee\u611f\u77e5
Card 4 (amber border): "15:30 \u5c0f\u8336\u54c1\u5e08" \u2014 \u89c2\u00b7\u95fb\u00b7\u8d4f\u00b7\u54c1\u00b7\u5bdf\u4e94\u6b65\u6cd5
Card 5 (amber border): "19:00 \u9999\u6c14\u8bb0\u5fc6\u8d5b" \u2014 \u5341\u5927\u9999\u578b\u8fa8\u8bc6\u6311\u6218

Each card has time on the left in bold amber, activity name and description in regular weight. Clean, compact, professional.`
},

// \u2550\u2550\u2550 SLIDE 5: \u76f2\u54c1\u5206\u7ec4 + \u535a\u7269\u9986\u63a2\u6848 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day1",
  prompt: `TITLE (top-left, bold, deep brown): "\u76f2\u54c1\u5206\u7ec4 \u00b7 \u535a\u7269\u9986\u63a2\u6848"

TWO COLUMNS:

LEFT COLUMN \u2014 "\u6a21\u5757 1.1\uff1a\u667a\u6167\u5206\u7ec4" (bold, amber, 22pt):
Ink-wash illustration: Six small cups on a bamboo tray, each with differently colored tea liquor (pale gold, honey, dark amber). Children's hands reaching for cups.

Three content cards stacked:
Card 1: "\u76f2\u54c1\u5206\u7ec4\u673a\u5236" (bold)
"\u54c1\u5c1d3\u6b3e\u4e0d\u540c\u5355\u4e1b\uff0c\u559c\u597d\u76f8\u540c\u8005\u81ea\u7136\u7ec4\u961f" (light)

Card 2: "\u5305\u5c3d\u5c3e\u7684\u4f20\u8bf4" (bold)
"\u51e4\u51f0\u5c71\u8336\u6545\u4e8b\u00b7\u5c71\u6c34\u7075\u6c14\u00b7\u5355\u4e1b\u7f18\u8d77" (light)

Card 3 (stat callout): "6\u7ec4" (36pt, bold, amber) + "5\u4eba/\u7ec4" (light)

RIGHT COLUMN \u2014 "\u6a21\u5757 1.2\uff1a\u535a\u7269\u9986\u63a2\u6848\u8bfe" (bold, amber, 22pt):
Ink-wash illustration: A magnifying glass over ancient tea processing tools, with puzzle pieces scattered.

Three content cards stacked:
Card 1: "\u7ebf\u7d22\u89e3\u8c1c" (bold)
"\u975e\u9057\u5c55\u9986\u201c\u5bc6\u7801\u201d\u2014\u53e4\u65e7\u5236\u8336\u5668\u5177\u7684\u79d8\u5bc6" (light)

Card 2: "\u534f\u4f5c\u5f15\u5bfc" (bold)
"\u89c2\u5bdf\u8005\u2192\u7ed8\u5236\u7ebf\u7d22\u56fe / \u64cd\u4f5c\u8005\u2192\u6536\u96c6\u8bc1\u636e / \u8868\u8fbe\u8005\u2192\u9648\u8ff0\u63a8\u7406" (light)

Card 3: "\u5b66\u4e60\u76ee\u6807" (bold)
"\u4ece\u5668\u7269\u7406\u89e3\u975e\u9057\u00b7\u57f9\u517b\u8bc1\u636e\u610f\u8bc6" (light)

Generous spacing between columns. Clean, informational, with ink-wash illustrations as visual anchors.`
},

// \u2550\u2550\u2550 SLIDE 6: \u8336\u5c71\u51a5\u60f3 + \u5c0f\u8336\u54c1\u5e08 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day1",
  prompt: `TITLE (top-left, bold, deep brown): "\u8336\u5c71\u51a5\u60f3 \u00b7 \u4e94\u611f\u54c1\u8336"

TWO SECTIONS:

TOP SECTION \u2014 wide card with pale amber background:
Center illustration: Lingnan ink-wash landscape of a tea mountain path. Children sitting in meditation among tea bushes, eyes closed, surrounded by floating sound symbols (birds, wind, rustling leaves). Painted in soft amber/gray ink tones.
"\u8336\u5c71\u51a5\u60f3\uff1a\u95ed\u76ee\u542c\u5c71\u00b7\u81ea\u7136\u58f0\u666f\u611f\u77e5" (bold, centered, 20pt, brown)
"\u95ee\u81ea\u5df1\uff1a\u8fd9\u7247\u571f\u5730\u60f3\u5bf9\u4f60\u8bf4\u4ec0\u4e48\uff1f" (italic, 16pt, warm gray)

BOTTOM SECTION \u2014 "\u5c0f\u8336\u54c1\u5e08\u4e94\u6b65\u6cd5":
FIVE STEP CARDS in a horizontal row, connected by thin amber arrows:

Step 1: amber circle with "\u89c2" character
"\u89c2\u5bdf" (bold) / "\u6e64\u8272\u900f\u4eae\u5ea6\u00b7\u53f6\u5e95\u8272\u6cfd" (small)

Step 2: amber circle with "\u95fb" character
"\u95fb\u9999" (bold) / "\u5e72\u9999\u00b7\u6e7f\u9999\u00b7\u5e95\u9999\u4e09\u5c42" (small)

Step 3: amber circle with "\u8d4f" character
"\u8d4f\u6c64" (bold) / "\u91d1\u9ec4\u00b7\u871c\u7eff\u00b7\u6a59\u7ea2\u8272\u8c31" (small)

Step 4: amber circle with "\u54c1" character
"\u54c1\u5473" (bold) / "\u5165\u53e3\u56de\u7518\u00b7\u8236\u5934\u97f5\u00b7\u5c71\u97f5" (small)

Step 5: amber circle with "\u5bdf" character
"\u5bdf\u53f6" (bold) / "\u53f6\u7f18\u7ea2\u5370\u00b7\u7eff\u53f6\u7ea2\u9576\u8fb9" (small)

Each step card has the single Chinese character in a hand-painted amber ink circle. Clean, sequential, educational.`
},

// \u2550\u2550\u2550 SLIDE 7: \u9999\u6c14\u8bb0\u5fc6\u8d5b \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day1",
  prompt: `TITLE (top-left, bold, deep brown): "\u665a\u95f4\u9999\u6c14\u8bb0\u5fc6\u5927\u8d5b"

HERO ILLUSTRATION (top center, large):
Lingnan ink-wash painting of ten small aroma cups arranged in a gentle arc, each emitting different colored wisps of steam/aroma. Painted in warm amber and brown ink tones. The aromas visualized as different brush stroke patterns: swirling (floral), straight rising (honey), curling (fruity).

TEN AROMA CARDS in 2\u00d75 grid below:

Row 1:
"\u829d\u5170\u9999" (amber icon: orchid) | "\u6842\u82b1\u9999" (amber icon: osmanthus blossom) | "\u8702\u871c\u9999" (amber icon: honeycomb) | "\u6768\u6885\u9999" (amber icon: plum) | "\u59dc\u82b1\u9999" (amber icon: ginger flower)

Row 2:
"\u6768\u6843\u9999" (amber icon: peach) | "\u8089\u6842\u9999" (amber icon: cinnamon bark) | "\u8c37\u7c73\u9999" (amber icon: grain) | "\u706b\u529f\u9999" (amber icon: flame) | "\u5c71\u97f5\u9999" (amber icon: mountain)

Each card is small, compact, with a tiny ink-wash icon and the aroma name. White cards with subtle shadow.

BOTTOM callout card:
"\u51e4\u51f0\u5355\u4e1b\u5341\u5927\u9999\u578b \u2014 \u8ba4\u5168\u8005\u83b7\u5c01\u201c\u5c0f\u8336\u9f3b\u5b50\u201d\u79f0\u53f7" (bold, centered, 18pt, amber)

Fun, educational, competitive atmosphere. Clean grid layout with playful ink-wash illustrations.`
},

// \u2550\u2550\u2550 SLIDE 8: DAY 2 \u603b\u89c8 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day2",
  prompt: `TITLE (top-left, bold, deep forest): "\u7b2c\u4e8c\u5929\uff1a\u5de5\u827a\u63a2\u79d8"
Subtitle: "\u8bdd\u672f #29\u2014#60 \u00b7 \u4ece\u53f6\u5230\u8336\u7684\u964c\u751f\u4e4b\u65c5" (16pt, muted green-gray)

LEFT SIDE \u2014 Large Lingnan ink-wash painting:
An ancient tea tree with thick, gnarled trunk and spreading canopy on a misty mountain slope. Deep green and earth-brown ink tones. A stone path winding upward. The tree radiates a sense of age and wisdom \u2014 this is a 600+ year old Dancong mother tree. Small tea leaves and branches rendered in detailed botanical brush style.

RIGHT SIDE \u2014 FOUR MODULE CARDS stacked vertically:

Card 1 (green border): "08:00 \u53e4\u8336\u56ed\u63a2\u8bbf" \u2014 \u4e4c\u5cb4\u5c71\u5343\u7c73\u8336\u56ed\u00b7\u53e4\u6811\u8ba4\u517b
Card 2 (green border): "12:00 \u8336\u519c\u5348\u9910" \u2014 \u8336\u9999\u98df\u8c31\u00b7\u5c71\u6cc9\u6ce1\u8336
Card 3 (green border): "14:00 \u5236\u8336\u5de5\u5e8f" \u2014 \u6652\u2192\u51c9\u2192\u6447\u2192\u6740\u2192\u63c9\u2192\u70d8 \u516d\u6b65\u5168\u6d41\u7a0b
Card 4 (green border): "19:00 \u5320\u4eba\u5bf9\u8bdd" \u2014 \u975e\u9057\u4f20\u627f\u4eba\u8bb2\u8ff0\u00b7\u5341\u4e07\u4e2a\u4e3a\u4ec0\u4e48

Each card has time in bold green on left, description in regular weight. Deep green earth tones throughout.`
},

// \u2550\u2550\u2550 SLIDE 9: \u53e4\u8336\u56ed\u63a2\u8bbf \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day2",
  prompt: `TITLE (top-left, bold, deep forest): "\u53e4\u8336\u56ed\u63a2\u8bbf\uff1a\u4e4c\u5cb4\u5c71\u5343\u7c73\u8336\u56ed"

THREE STAT CARDS in a row at top, each with deep green gradient background and white text:

Card 1 \u2014 ink-wash mountain icon:
"\u6d77\u62d41000\u7c73+" (42pt, bold, white)
"\u4e91\u96fe\u9ad8\u5c71\u8336\u56ed" (light, white)

Card 2 \u2014 ink-wash ancient tree icon:
"600\u5e74+" (42pt, bold, white)
"\u53e4\u8336\u6811\u6811\u9f84" (light, white)

Card 3 \u2014 ink-wash leaf varietals icon:
"80+\u54c1\u79cd" (42pt, bold, white)
"\u51e4\u51f0\u5355\u4e1b\u54c1\u7c7b" (light, white)

MAIN SECTION \u2014 large white card:
Lingnan ink-wash painting spanning the card: a panoramic mountain tea garden scene. Terraced rows of tea bushes climbing steep slopes, ancient trees with numbered tags, stone paths between gardens, mist drifting through. Painted in deep green and earth tones with characteristic Lingnan bold brushwork.

Below the painting, THREE ACTIVITY POINTS:
\u2022 "\u53e4\u6811\u8ba4\u517b\uff1a\u6bcf\u7ec4\u8ba4\u517b\u4e00\u68f5\u53e4\u8336\u6811\uff0c\u8bb0\u5f55\u5176\u6545\u4e8b\u4e0e\u7279\u5f81" (green bullet)
\u2022 "\u751f\u6001\u89c2\u5bdf\uff1a\u5171\u751f\u82d4\u85d3\u00b7\u571f\u58e4\u5fae\u751f\u7269\u00b7\u5c71\u6cc9\u6c34\u8d28" (green bullet)
\u2022 "\u5730\u7406\u611f\u77e5\uff1a\u6d77\u62d4\u00b7\u5411\u9633\u00b7\u571f\u8d28\u5982\u4f55\u5851\u9020\u8336\u5473" (green bullet)

Clean, nature-forward, educational. The mountain painting is the visual star.`
},

// \u2550\u2550\u2550 SLIDE 10: \u8336\u519c\u5348\u9910 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day2",
  prompt: `TITLE (top-left, bold, deep forest): "\u8336\u519c\u5bb6\u5348\u9910\uff1a\u5c71\u6cc9\u4e0e\u8336\u9999"

TWO SECTIONS side by side:

LEFT \u2014 Large Lingnan ink-wash illustration:
A rustic tea farmer's kitchen table. Dishes painted in vivid Lingnan style (the school is known for bold food painting): steaming tea-smoked chicken, tea leaf stir-fry, mountain vegetables, a clay pot of rice. A kettle boiling on a charcoal stove. Mountain spring water pouring into a gaiwan. Warm, inviting, appetizing. Painted with the Lingnan school's characteristic bold color-ink fusion \u2014 slightly more colorful than pure ink-wash, with warm amber and green tints.

RIGHT \u2014 Content cards stacked:

Card 1 (green border):
"\u8336\u9999\u98df\u8c31" (bold, green, 22pt)
\u2022 "\u8336\u718f\u9e21\uff1a\u5355\u4e1b\u8336\u53f6\u718f\u5236\u5c71\u5730\u9e21"
\u2022 "\u8336\u53f6\u5c0f\u7092\uff1a\u5f53\u5b63\u5ae9\u82bd\u5165\u83dc"
\u2022 "\u5c71\u6cc9\u6ce1\u8336\uff1a\u611f\u53d7\u6c34\u8d28\u5bf9\u8336\u5473\u7684\u5f71\u54cd"

Card 2 (green border):
"\u534f\u4f5c\u4efb\u52a1" (bold, green, 22pt)
"\u89c2\u5bdf\u8005\uff1a\u8bb0\u5f55\u98df\u6750\u4e0e\u8336\u7684\u642d\u914d\u5173\u7cfb"
"\u64cd\u4f5c\u8005\uff1a\u53c2\u4e0e\u7b80\u5355\u4e0a\u8336\u670d\u52a1"
"\u8868\u8fbe\u8005\uff1a\u91c7\u8bbf\u8336\u519c\uff0c\u8bb0\u5f55\u5c71\u5c45\u751f\u6d3b\u667a\u6167"

Card 3 (warm callout):
"\u5b66\u4e60\u76ee\u6807" (bold)
"\u7406\u89e3\u8336\u4e0e\u98df\u7684\u5171\u751f\u5173\u7cfb\u00b7\u611f\u53d7\u5c71\u5c45\u751f\u6d3b\u7f8e\u5b66" (light)

Warm, appetizing, celebrating the connection between tea and mountain life.`
},

// \u2550\u2550\u2550 SLIDE 11: \u5236\u8336\u5de5\u5e8f\uff08\u524d\u4e09\u6b65\uff09 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day2",
  prompt: `TITLE (top-left, bold, deep forest): "\u5236\u8336\u5de5\u5e8f\uff1a\u4ece\u53f6\u5230\u8336\uff08\u4e0a\uff09"

THREE LARGE PROCESS CARDS stacked vertically, each with a Lingnan ink-wash illustration on the left and text on the right:

\u2500\u2500\u2500 STEP 1: "\u6652\u9752" \u2500\u2500\u2500
Left illustration: Ink-wash painting of fresh tea leaves spread on bamboo trays under warm sunlight. Golden sun rays painted in splashed ink style. The leaves are vivid green, slowly releasing moisture.
Right text:
"\u7b2c\u4e00\u6b65\uff1a\u6652\u9752" (bold, green, 22pt)
"\u65e5\u5149\u8431\u51cb\u00b7\u53f6\u5185\u6c34\u5206\u7f13\u6162\u6563\u5931"
"\u89c2\u5bdf\u8005\u4efb\u52a1\uff1a\u8bb0\u5f55\u53f6\u7247\u989c\u8272\u4e0e\u67d4\u8f6f\u5ea6\u53d8\u5316" (small, gray)

\u2500\u2500\u2500 STEP 2: "\u6652\u51c9" \u2500\u2500\u2500
Left illustration: Tea leaves on a large round bamboo sieve in a shaded room. Cool breeze suggested by gentle brush strokes. Leaves starting to soften.
Right text:
"\u7b2c\u4e8c\u6b65\uff1a\u6652\u51c9" (bold, green, 22pt)
"\u9634\u51c9\u5904\u6446\u653e\u00b7\u53f6\u7247\u56de\u8f6f\u00b7\u5747\u5300\u5931\u6c34"
"\u64cd\u4f5c\u8005\u4efb\u52a1\uff1a\u89e6\u6478\u53f6\u7247\uff0c\u611f\u53d7\u67d4\u8f6f\u5ea6\u53d8\u5316" (small, gray)

\u2500\u2500\u2500 STEP 3: "\u6447\u9752/\u6d6a\u9752" \u2500\u2500\u2500
Left illustration: Dynamic ink-wash painting of a bamboo drum being rotated, tea leaves tumbling inside. Movement lines suggesting the rhythmic shaking. This is the most critical step \u2014 the illustration should show energy and precision.
Right text:
"\u7b2c\u4e09\u6b65\uff1a\u6447\u9752/\u6d6a\u9752" (bold, green, 22pt)
"\u5355\u4e1b\u7684\u7075\u9b42\u5de5\u5e8f \u2014 \u78e8\u53f6\u7f18\u4fc3\u53d1\u9999\u6c14\u7269\u8d28"
"\u201c\u770b\u9752\u505a\u9752\u201d\u2014\u5320\u4eba\u51ed\u7ecf\u9a8c\u5224\u65ad\u6447\u9752\u7a0b\u5ea6" (small, italic, gray)

Each step card has generous horizontal space. The ink-wash illustrations should be the visual focus. Green arrows connect the three steps vertically.`
},

// \u2550\u2550\u2550 SLIDE 12: \u5236\u8336\u5de5\u5e8f\uff08\u540e\u4e09\u6b65\uff09 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day2",
  prompt: `TITLE (top-left, bold, deep forest): "\u5236\u8336\u5de5\u5e8f\uff1a\u4ece\u53f6\u5230\u8336\uff08\u4e0b\uff09"

THREE LARGE PROCESS CARDS stacked vertically, continuing from the previous slide:

\u2500\u2500\u2500 STEP 4: "\u6740\u9752" \u2500\u2500\u2500
Left illustration: Dramatic ink-wash painting of a large wok over high flame, artisan's hands tossing tea leaves rapidly. Fire painted in bold amber and red ink strokes. Steam and heat visible. This is the most dramatic visual moment.
Right text:
"\u7b2c\u56db\u6b65\uff1a\u6740\u9752" (bold, #A0522D clay red, 22pt)
"\u9ad8\u6e29\u5236\u6b62\u53d1\u9175\u00b7\u9501\u4f4f\u9999\u6c14\u00b7\u706b\u5019\u7cbe\u51c6"
"\u8868\u8fbe\u8005\u4efb\u52a1\uff1a\u63cf\u8ff0\u706b\u5019\u4e0e\u53f6\u8272\u7684\u77ac\u95f4\u53d8\u5316" (small, gray)

\u2500\u2500\u2500 STEP 5: "\u63c9\u634e" \u2500\u2500\u2500
Left illustration: Ink-wash painting of tea leaves being rolled and shaped on a bamboo mat. Artisan's experienced hands pressing and rolling in rhythmic motions. The leaves start forming tight curls.
Right text:
"\u7b2c\u4e94\u6b65\uff1a\u63c9\u634e" (bold, green, 22pt)
"\u53f6\u7247\u5377\u66f2\u6210\u6761\u00b7\u7ec6\u80de\u7834\u88c2\u91ca\u653e\u8336\u6c41"
"\u64cd\u4f5c\u8005\u4efb\u52a1\uff1a\u4eb2\u624b\u5c1d\u8bd5\u63c9\u634e\uff0c\u611f\u53d7\u529b\u5ea6\u63a7\u5236" (small, gray)

\u2500\u2500\u2500 STEP 6: "\u70d8\u7126" \u2500\u2500\u2500
Left illustration: Ink-wash painting of a traditional charcoal roasting scene. Bamboo baskets over low charcoal heat, aromatic wisps rising gently. Warm ember glow painted in subtle amber. Peaceful, patient atmosphere contrasting with the dramatic \u6740\u9752.
Right text:
"\u7b2c\u516d\u6b65\uff1a\u70d8\u7126" (bold, #A0522D clay red, 22pt)
"\u6587\u706b\u6162\u70d8\u00b7\u53d1\u5c55\u706b\u529f\u9999\u00b7\u53ef\u591a\u6b21\u590d\u70d8"
"\u201c\u5317\u98ce\u5929\uff0c\u706b\u529f\u8db3\u201d\u2014\u5355\u4e1b\u7684\u7ec8\u6781\u98ce\u5473\u5bc6\u7801" (small, italic, gray)

BOTTOM callout: "\u5168\u6d41\u7a0b\u4f53\u9a8c\u65f6\u95f4\u7ea6 4 \u5c0f\u65f6 \u2014 \u975e\u9057\u4f20\u627f\u4eba\u5168\u7a0b\u6307\u5bfc" (centered, bold, 16pt, green)

Dramatic, artisanal. Fire and earth tones for the roasting steps. The \u6740\u9752 illustration should be the most dynamic.`
},

// \u2550\u2550\u2550 SLIDE 13: \u5320\u4eba\u5bf9\u8bdd \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day2",
  prompt: `TITLE (top-left, bold, deep forest): "\u665a\u95f4\u5320\u4eba\u5bf9\u8bdd"

HERO ILLUSTRATION (top, wide):
Lingnan ink-wash portrait scene: An elderly tea master sitting cross-legged beside a traditional charcoal roasting setup. Deep wrinkles, weathered hands, calm expression. Around him, attentive young faces in silhouette. A single gaiwan of tea between them, steam rising. Painted in deep earth tones \u2014 the master rendered in more detail, the children as impressionistic brushwork. Warm lamplight suggested by amber ink wash. The atmosphere is reverential, intimate, knowledge-passing.

TWO CARDS below:

\u2500\u2500\u2500 LEFT CARD: pale green background \u2500\u2500\u2500
"\u5320\u4eba\u4e4b\u58f0" (bold, green, 22pt)
\u2022 "\u505a\u8336\u8fd9\u4ef6\u4e8b\uff0c\u60b2\u4f24\u7684\u662f\u6ca1\u6709\u5e74\u8f7b\u4eba\u613f\u610f\u5b66"
\u2022 "\u6bcf\u4e00\u6ce1\u8336\u90fd\u662f\u4e00\u6b21\u5bf9\u8bdd\uff0c\u4e0e\u5c71\u3001\u4e0e\u706b\u3001\u4e0e\u65f6\u95f4"
\u2022 "\u770b\u9752\u505a\u9752\u2014\u6ca1\u6709\u516c\u5f0f\uff0c\u53ea\u6709\u4e00\u4e07\u904d\u7684\u7ec3\u4e60"

\u2500\u2500\u2500 RIGHT CARD: pale amber background \u2500\u2500\u2500
"\u5341\u4e07\u4e2a\u4e3a\u4ec0\u4e48" (bold, amber, 22pt)
"\u5b69\u5b50\u4eec\u5411\u5320\u4eba\u63d0\u95ee\u7684\u73af\u8282" (light, 16pt)
\u2022 "\u4e3a\u4ec0\u4e48\u6bcf\u68f5\u6811\u7684\u8336\u5473\u90fd\u4e0d\u540c\uff1f"
\u2022 "\u4e3a\u4ec0\u4e48\u53eb\u201c\u5355\u4e1b\u201d\u800c\u4e0d\u662f\u201c\u591a\u4e1b\u201d\uff1f"
\u2022 "\u6700\u96be\u7684\u5de5\u5e8f\u662f\u54ea\u4e00\u6b65\uff1f"

BOTTOM: subtle card with quote marks:
"\u201c\u4e09\u4eba\u884c\u201d\u53cd\u601d\u65f6\u523b\uff1a\u6bcf\u7ec4\u5199\u4e0b\u4eca\u665a\u6700\u89e6\u52a8\u7684\u4e00\u53e5\u8bdd" (italic, centered, 16pt)

Warm, intimate, heritage-focused. The portrait should feel like a painting in a museum.`
},

// \u2550\u2550\u2550 SLIDE 14: DAY 3 \u603b\u89c8 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day3",
  prompt: `TITLE (top-left, bold, deep plum): "\u7b2c\u4e09\u5929\uff1a\u521b\u610f\u8868\u8fbe"
Subtitle: "\u8bdd\u672f #61\u2014#80 \u00b7 \u4ece\u5b66\u4e60\u8005\u5230\u4f20\u64ad\u8005" (16pt, warm gray)

LEFT SIDE \u2014 Large Lingnan ink-wash painting:
An elegant gongfu tea ceremony setup. A complete tea tray with gaiwan, fairness cup, six tasting cups, tea towel, tea picks, and a small vase with an orchid branch. Painted in orchid pink and plum tones with Lingnan school's famous flower painting technique. Soft, refined, ceremonial. Steam rising from the cups in graceful wisps.

RIGHT SIDE \u2014 FOUR MODULE CARDS stacked vertically:

Card 1 (pink border): "07:00 \u6668\u95f4\u51a5\u60f3" \u2014 \u7ed9\u8336\u6811\u5199\u4e00\u5c01\u4fe1
Card 2 (pink border): "09:00 \u5de5\u592b\u8336\u827a" \u2014 \u516b\u6b65\u54c1\u8336\u6cd5\u8bad\u7ec3
Card 3 (pink border): "14:00 \u54c1\u724c\u7b56\u5212" \u2014 \u201c\u6211\u4e3a\u51e4\u51f0\u8336\u4ee3\u8a00\u201d\u521b\u610f\u63d0\u6848
Card 4 (pink border): "16:00 \u7ed3\u8425\u8336\u4f1a" \u2014 \u63d0\u6848\u5c55\u793a\u00b7\u8bc1\u4e66\u9881\u53d1\u00b7\u611f\u6069\u8336\u4f1a

Each card: time in bold pink on left, description in regular weight. Orchid pink and plum tones.`
},

// \u2550\u2550\u2550 SLIDE 15: \u7ed9\u8336\u6811\u5199\u4fe1 + \u5de5\u592b\u8336 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day3",
  prompt: `TITLE (top-left, bold, deep plum): "\u6668\u95f4\u51a5\u60f3 \u00b7 \u5de5\u592b\u8336\u827a"

TWO SECTIONS side by side:

LEFT \u2014 "\u7ed9\u8336\u6811\u5199\u4e00\u5c01\u4fe1" (bold, plum, 22pt):
Ink-wash illustration: A child sitting under an ancient tea tree, writing in a notebook. The tree's canopy is painted in Lingnan floral style with detailed leaves. Small birds perch on branches. Morning light filtering through. Poetic, contemplative.

Content card below:
"\u6668\u95f4\u51a5\u60f3\u5f15\u5bfc" (bold)
\u2022 "\u95ed\u4e0a\u773c\u775b\uff0c\u611f\u53d7\u8fd9\u68f5\u6811\u7684\u547c\u5438"
\u2022 "\u5982\u679c\u5b83\u80fd\u8bf4\u8bdd\uff0c\u4f1a\u5bf9\u4f60\u8bf4\u4ec0\u4e48\uff1f"
\u2022 "\u628a\u4f60\u60f3\u8bf4\u7684\u8bdd\u5199\u6210\u4e00\u5c01\u4fe1"

RIGHT \u2014 "\u516b\u6b65\u54c1\u8336\u6cd5" (bold, plum, 22pt):
EIGHT STEPS in a 2\u00d74 grid, each a small card with a numbered circle in orchid pink:

\u2460 "\u6cbb\u5668" \u2014 \u6e29\u676f\u70eb\u76cf
\u2461 "\u7eb3\u8336" \u2014 \u7f6e\u8336\u5165\u76d6\u7897
\u2462 "\u6ce1\u8336" \u2014 \u9ad8\u51b2\u4f4e\u659b
\u2463 "\u5211\u6cab" \u2014 \u522e\u6d6e\u6cab\u51c0\u6c64
\u2464 "\u6d47\u6dcb" \u2014 \u5c01\u58f6\u63d0\u9999
\u2465 "\u70eb\u676f" \u2014 \u201c\u6ee9\u676f\u201d\u9884\u70ed
\u2466 "\u659b\u8336" \u2014 \u97e9\u4fe1\u70b9\u5175
\u2467 "\u54c1\u8336" \u2014 \u5148\u95fb\u540e\u5561

Each step has elegant pink numbered circle and compact text. Clean, ceremonial layout.`
},

// \u2550\u2550\u2550 SLIDE 16: \u54c1\u724c\u7b56\u5212 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day3",
  prompt: `TITLE (top-left, bold, deep plum): "\u201c\u6211\u4e3a\u51e4\u51f0\u8336\u4ee3\u8a00\u201d\u54c1\u724c\u7b56\u5212"

HERO CALLOUT (top, wide):
Big stat: "6\u7ec4" (48pt, bold, #C1567D) + "\u00d7" + "1\u4e2a\u54c1\u724c\u63d0\u6848" (24pt, bold)
Below: "\u4ece\u5b66\u4e60\u8005\u5230\u4f20\u64ad\u8005\u7684\u8eab\u4efd\u8f6c\u53d8" (16pt, warm gray)

THREE DELIVERABLE CARDS in a row:

\u2500\u2500\u2500 CARD 1: pink border, white bg \u2500\u2500\u2500
Ink-wash icon: a small tea package/logo sketch
"\u54c1\u724c\u8bbe\u8ba1" (bold, pink, 20pt)
\u2022 "\u54c1\u724c\u540d\u79f0\u4e0e\u6545\u4e8b"
\u2022 "\u89c6\u89c9\u6807\u8bc6\u8bbe\u8ba1"
\u2022 "\u53e3\u53f7\u4e0e\u7406\u5ff5"

\u2500\u2500\u2500 CARD 2: pink border, white bg \u2500\u2500\u2500
Ink-wash icon: a presentation screen with an audience
"\u8def\u6f14\u5c55\u793a" (bold, pink, 20pt)
\u2022 "\u4e09\u5206\u949f\u54c1\u724c\u8def\u6f14"
\u2022 "\u89d2\u8272\u5206\u5de5\u5c55\u793a"
\u2022 "\u56de\u7b54\u8bc4\u5ba1\u56e2\u63d0\u95ee"

\u2500\u2500\u2500 CARD 3: pink border, white bg \u2500\u2500\u2500
Ink-wash icon: a certificate/award ribbon
"\u8bc4\u4ef7\u6807\u51c6" (bold, pink, 20pt)
\u2022 "\u6587\u5316\u7406\u89e3\u6df1\u5ea6"
\u2022 "\u521b\u610f\u8868\u8fbe\u529b"
\u2022 "\u56e2\u961f\u534f\u4f5c\u5ea6"

BOTTOM \u2014 wide pale pink card:
"\u534f\u4f5c\u5f15\u5bfc\uff1a\u89c2\u5bdf\u8005\u2192\u5e02\u573a\u8c03\u7814 / \u64cd\u4f5c\u8005\u2192\u4ea7\u54c1\u8bbe\u8ba1 / \u8868\u8fbe\u8005\u2192\u54c1\u724c\u8def\u6f14" (centered, 16pt)

Creative, celebratory, youth-oriented. Clean consulting layout.`
},

// \u2550\u2550\u2550 SLIDE 17: \u7ed3\u8425\u8336\u4f1a \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "day3",
  prompt: `TITLE (top-left, bold, deep plum): "\u7ed3\u8425\u8336\u4f1a\uff1a\u611f\u6069\u4e0e\u4f20\u627f"

HERO ILLUSTRATION (top, wide):
Lingnan ink-wash painting of a gongfu tea ceremony scene. A circular table with children and mentors seated around it. Each child performs a different step of the tea ceremony. Orchids and plum blossoms frame the scene. Warm candlelight atmosphere. Painted in orchid pink and plum with golden amber accents. The composition is circular, suggesting unity and completion.

THREE EVENT CARDS below:

\u2500\u2500\u2500 CARD 1: gradient pink to plum background, white text \u2500\u2500\u2500
"\u54c1\u724c\u63d0\u6848\u5c55\u793a" (bold, 22pt)
"\u6bcf\u7ec4\u4e09\u5206\u949f\u8def\u6f14 \u00b7 \u5168\u8425\u8bc4\u5ba1\u56e2\u6253\u5206" (light)

\u2500\u2500\u2500 CARD 2: gradient amber to gold background, white text \u2500\u2500\u2500
"\u8bc1\u4e66\u9881\u53d1" (bold, 22pt)
"\u201c\u5c0f\u8336\u5320\u201d\u8bc1\u4e66 \u00b7 \u53e4\u8336\u6811\u8ba4\u517b\u51ed\u8bc1 \u00b7 \u6700\u4f73\u5408\u4f5c\u5956" (light)

\u2500\u2500\u2500 CARD 3: gradient green to sage background, white text \u2500\u2500\u2500
"\u611f\u6069\u8336\u4f1a" (bold, 22pt)
"\u4e3a\u7236\u6bcd/\u5e08\u957f\u6ce1\u4e00\u676f\u611f\u6069\u8336 \u00b7 \u5206\u4eab\u4e09\u5929\u6700\u89e6\u52a8\u7684\u77ac\u95f4" (light)

BOTTOM quote card:
"\u4e00\u676f\u8336\uff0c\u4e00\u5ea7\u5c71\uff0c\u4e00\u6bb5\u4f20\u627f" (24pt, italic, plum, centered)

Warm, emotional, celebratory closing atmosphere.`
},

// \u2550\u2550\u2550 SLIDE 18: 80\u4e2a\u8bdd\u672f\u4f53\u7cfb \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "info",
  prompt: `TITLE (top-left, bold, deep ink): "80\u4e2a\u534f\u4f5c\u5f15\u5bfc\u8bdd\u672f\u4f53\u7cfb"

THREE COLUMN LAYOUT \u2014 one per day:

\u2500\u2500\u2500 COLUMN 1: amber #C8973E header border \u2500\u2500\u2500
Header: "\u7b2c\u4e00\u5929" (bold, amber) / "\u611f\u5b98\u89c9\u9192" (light)
Stat: "28\u4e2a" (36pt, bold, amber) / "\u8bdd\u672f" (light)

Five module tags stacked:
"\u5f00\u8425\u4eea\u5f0f #1-6"
"\u535a\u7269\u9986\u63a2\u6848 #7-12"
"\u8336\u5c71\u51a5\u60f3 #13-16"
"\u4e94\u611f\u54c1\u8336 #17-24"
"\u9999\u6c14\u8bb0\u5fc6 #25-28"

\u2500\u2500\u2500 COLUMN 2: green #4A7C59 header border \u2500\u2500\u2500
Header: "\u7b2c\u4e8c\u5929" (bold, green) / "\u5de5\u827a\u63a2\u79d8" (light)
Stat: "32\u4e2a" (36pt, bold, green) / "\u8bdd\u672f" (light)

Four module tags stacked:
"\u53e4\u8336\u56ed\u63a2\u8bbf #29-36"
"\u8336\u519c\u5348\u9910 #37-42"
"\u5236\u8336\u5de5\u5e8f #43-54"
"\u5320\u4eba\u5bf9\u8bdd #55-60"

\u2500\u2500\u2500 COLUMN 3: pink #C1567D header border \u2500\u2500\u2500
Header: "\u7b2c\u4e09\u5929" (bold, pink) / "\u521b\u610f\u8868\u8fbe" (light)
Stat: "20\u4e2a" (36pt, bold, pink) / "\u8bdd\u672f" (light)

Four module tags stacked:
"\u6668\u95f4\u51a5\u60f3 #61-64"
"\u5de5\u592b\u8336\u827a #65-72"
"\u54c1\u724c\u7b56\u5212 #73-76"
"\u7ed3\u8425\u8336\u4f1a #77-80"

BOTTOM callout (dark card, white text):
"\u6bcf\u4e2a\u8bdd\u672f\u5305\u542b\uff1a\u534f\u4f5c\u76ee\u6807 + \u5f15\u5bfc\u539f\u6587 + \u6559\u5b66\u610f\u56fe + \u504f\u5dee\u9884\u8b66 + \u5173\u8054\u8d44\u6e90" (centered, 14pt)

Data-forward, clean grid, professional curriculum overview.`
},

// \u2550\u2550\u2550 SLIDE 19: \u5b89\u5168\u4e0e\u540e\u52e4 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "info",
  prompt: `TITLE (top-left, bold, deep ink): "\u5b89\u5168\u4fdd\u969c\u4e0e\u540e\u52e4\u914d\u7f6e"

TWO COLUMNS:

LEFT COLUMN \u2014 "\u5b89\u5168\u4fdd\u969c\u4f53\u7cfb" (bold, #C0392B, 22pt):

Four stacked cards with pale red-warm (#FFF5F5) background:

Card 1: "\u5c71\u8def\u5b89\u5168" (bold)
"\u5c71\u5730\u5bfc\u5e08\u524d\u5bfc + \u540e\u62a4 \u00b7 \u9632\u6ed1\u88c5\u5907 \u00b7 GPS\u5b9a\u4f4d" (light)

Card 2: "\u5236\u8336\u5b89\u5168" (bold)
"\u9ad8\u6e29\u5de5\u5e8f\u4e13\u4eba\u76d1\u62a4 \u00b7 \u513f\u7ae5\u8ddd\u79bb\u7ebf \u00b7 \u7ebb\u5e26\u624b\u5957" (light)

Card 3: "\u996e\u98df\u5b89\u5168" (bold)
"\u8fc7\u654f\u6e90\u6392\u67e5 \u00b7 \u5f53\u5730\u98df\u6750\u6e90\u5934 \u00b7 \u5e94\u6025\u836f\u7bb1" (light)

Card 4: "\u5929\u6c14\u5e94\u6025" (bold)
"\u96e8\u5929\u5907\u6848\u00b7\u9ad8\u6e29\u5907\u6848\u00b7\u5bd2\u6f6e\u5907\u6848" (light)

RIGHT COLUMN \u2014 "\u56e2\u961f\u914d\u7f6e" (bold, #2C3E50, 22pt):

FIVE role cards with subtle borders:

"\u8425\u957f" (bold) \u2014 "1\u4eba \u00b7 \u5168\u7a0b\u7edf\u7b79\u534f\u8c03" (ink icon: compass)
"\u4e09\u4eba\u884c\u5bfc\u5e08" (bold) \u2014 "2\u4eba \u00b7 \u534f\u4f5c\u5f15\u5bfc\u00b7\u8bdd\u672f\u6267\u884c" (ink icon: book)
"\u975e\u9057\u5de5\u827a\u5bfc\u5e08" (bold) \u2014 "3\u4eba \u00b7 \u5236\u8336\u6559\u5b66\u00b7\u5de5\u827a\u6307\u5bfc" (ink icon: tea leaf)
"\u81ea\u7136\u5bfc\u5e08" (bold) \u2014 "3\u4eba \u00b7 \u5c71\u5730\u5bfc\u89c8\u00b7\u751f\u6001\u8bb2\u89e3" (ink icon: mountain)
"\u540e\u52e4\u5b89\u5168\u5458" (bold) \u2014 "1\u4eba \u00b7 \u533b\u7597\u7269\u8d44\u00b7\u5e94\u6025\u5904\u7f6e" (ink icon: shield)

BOTTOM stat bar:
"\u5e08\u751f\u6bd4 1:3" (bold) + "\u6bcf\u7ec4\u914d\u5907\u5bf9\u8bb2\u673a" + "24\u5c0f\u65f6\u5e94\u6025\u7535\u8bdd" (three stats in a row, separated by dividers)

Clean, professional, safety-focused. Trustworthy institutional aesthetic.`
},

// \u2550\u2550\u2550 SLIDE 20: \u5c3e\u9875 \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
{
  style: "cover",
  prompt: `A closing slide with the same mountain ink-wash landscape as the cover, but now showing SUNSET instead of dawn \u2014 warm golden-amber tones washing over the Phoenix Mountain peaks. The tea terraces now have tiny warm lights suggesting evening. The mist has a golden glow.

CENTER text (vertically centered):
"\u4e00\u53f6\u4e00\u4e16\u754c" \u2014 36pt, bold, cream #FFFAF0, Noto Serif SC
Below (12px gap): "\u4e00\u8336\u4e00\u4f20\u627f" \u2014 36pt, bold, cream #FFFAF0

Below (40px gap), smaller:
"\u201c\u5bfb\u8336\u8109\u201d3\u59292\u591c\u51e4\u51f0\u5355\u4e1b\u975e\u9057\u7814\u5b66\u8425" \u2014 18pt, light, cream
"\u57fa\u4e8e\u201c\u4e09\u4eba\u884c\u201d\u5c0f\u7ec4\u5408\u4f5c\u5b66\u4e60\u6a21\u578b" \u2014 14pt, light, pale gold

NO other text. The landscape painting should be the full background with text overlaid. Sunset warmth, completion, beauty.

VERY BOTTOM (subtle): "\u7248\u672c V3.0 | 2026\u5e742\u6708" (12pt, faint cream, bottom center)

Dramatic, cinematic, peaceful closing. Like the last page of a beautiful painting album.`
},

];

// \u2500\u2500\u2500 STYLE RESOLVER \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function getStyle(tag) {
  switch(tag) {
    case "cover": return STYLE_COVER;
    case "day1": return STYLE_DAY1;
    case "day2": return STYLE_DAY2;
    case "day3": return STYLE_DAY3;
    case "info": return STYLE_INFO;
    default: return STYLE_INFO;
  }
}

// \u2500\u2500\u2500 GENERATION ENGINE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

  const CONCURRENCY = 20;
  console.log(`Generating ${slides.length} slides (${CONCURRENCY} parallel)...`);
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

  const outFile = "\u5bfb\u8336\u8109-\u7814\u5b66\u8425\u6267\u884c\u624b\u518c.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${slides.length} slides)`);
}

main().catch(err => console.error("Fatal:", err));
