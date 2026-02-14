const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-gongfu-tea";
const SW = 13.333, SH = 7.5;

// =======================================================================
// STYLE A: Full-scene illustration dominant (cover, emotional moments)
// =======================================================================
const STYLE_SCENE = `Create a presentation slide image. 1920\u00d71080 pixels, 16:9 landscape format.

ART STYLE (CRITICAL \u2014 this is the MOST important instruction):
Feng Zikai (\u4e30\u5b50\u607a) painting style. This is a SPECIFIC Chinese art tradition:
- Very simple, minimal brush strokes \u2014 just a few lines to suggest a figure
- Round-headed children with dot eyes and no detailed facial features
- Adults drawn with slightly more detail but still extremely minimal
- Light color washes: pale pink, soft amber, gentle green, muted blue \u2014 like watercolor thinned to 20-30% opacity
- Black or dark brown ink outlines, confident single brush strokes, never sketchy or tentative
- LOTS of empty white/cream space (\u7559\u767d) \u2014 at least 40% of the image should be blank
- Compositions feel like a page from a children's picture book or a scroll painting
- Warm, nostalgic, innocent, gentle \u2014 capturing everyday family moments
- Often includes a short line of calligraphic Chinese text as part of the painting (NOT separate)
- Objects are simplified to their essence: a teapot is just a round body + spout + handle in 3 strokes
- NO photorealism, NO digital art, NO detailed rendering \u2014 this must look HAND-PAINTED with brush and ink on rice paper

BACKGROUND: Warm off-white (#FFF8F0), like aged Chinese rice paper. Subtle paper texture. NO gradients, NO patterns.

TYPOGRAPHY: Noto Serif SC for any text overlays. ALL TEXT IN CHINESE ONLY.
- Title text: 700 weight, warm charcoal #3C3226
- Body text: 300 weight, warm gray #6B5E50
- Text should feel like handwritten annotations on a painting, not corporate text boxes

CRITICAL: This must look like an actual Feng Zikai painting \u2014 minimal, warm, with the naive charm of a master who draws with deliberate simplicity. Think of it as a painting first, a slide second.`;

// =======================================================================
// STYLE B: Text-forward with small illustrations (content, data slides)
// =======================================================================
const STYLE_CONTENT = `Create a presentation slide image. 1920\u00d71080 pixels, 16:9 landscape format.

ART STYLE (CRITICAL):
Feng Zikai (\u4e30\u5b50\u607a) painting style applied to an informational layout:
- Small ink-wash illustrations as accent elements (NOT the main focus)
- Simple brush-stroke icons: teapot, cup, child figure, steam wisps
- Light color wash backgrounds for content areas: very pale amber (#FFF5E8), pale green (#F0F7ED), soft pink (#FFF0F0)
- All illustrations are Feng Zikai style: minimal lines, round-headed figures, simplified objects
- Hand-painted feel throughout \u2014 even dividers and borders should look like single brush strokes, not clean geometric lines

BACKGROUND: Warm off-white (#FFF8F0), rice paper texture. Clean, airy.

TYPOGRAPHY: Noto Serif SC for headers, Noto Sans SC for body. ALL TEXT IN CHINESE ONLY.
- Section headers: 700 weight, 24-28pt, warm charcoal #3C3226
- Body: 300 weight, 16-18pt, warm gray #5D4E37
- Accent text/stats: 700 weight, soft ink black #2C2C2C or amber #B8860B
- Key quotes in calligraphic style, integrated with illustrations

LAYOUT: Generous whitespace. Content areas use very subtle pale color washes instead of hard-edged cards. NO corporate card borders \u2014 instead, group content with color washes and brush-stroke dividers. Each content area should breathe.

CRITICAL: This is NOT a corporate slide. It should feel like an illustrated page from a warm family guidebook, with Feng Zikai's gentle hand visible in every element.`;

// =======================================================================
// STYLE C: Quote/emotional (for philosophical moments)
// =======================================================================
const STYLE_EMOTION = `Create a presentation slide image. 1920\u00d71080 pixels, 16:9 landscape format.

ART STYLE (CRITICAL):
Feng Zikai (\u4e30\u5b50\u607a) painting at its most poetic and minimal:
- ONE central illustration, very simple, occupying about 30-40% of the space
- Surrounding empty space is PART of the composition \u2014 it conveys tranquility
- The illustration captures a single warm moment: a hand pouring tea, a child's face looking up, steam rising from a cup
- Light, almost transparent color wash \u2014 just a hint of amber or pink
- One or two lines of calligraphic text integrated INTO the painting composition
- This should feel like the most beautiful page in a Feng Zikai art book

BACKGROUND: Warm cream (#FFFAF2), pristine, like high-quality rice paper.

TYPOGRAPHY: Noto Serif SC, integrated with the painting.
- Quote text: 700 weight, 28-36pt, warm charcoal #3C3226
- Attribution/subtitle: 300 weight, 16pt, warm gray #8B7D6B

CRITICAL: Extreme minimalism. Every brush stroke must earn its place. This is meditation in visual form.`;

// =======================================================================
// SLIDE PROMPTS
// =======================================================================
const slides = [

// === SLIDE 1: COVER =====================================================
{
  style: "scene",
  prompt: `A Feng Zikai painting covering the full slide.

Scene: A family of three at a small wooden table. Father sits cross-legged, pouring tea from a small clay pot. A round-headed little girl (about 8 years old) kneels on a cushion, watching with wide dot-eyes, hands cupped together waiting for her cup. Mother sits behind, smiling gently. Steam rises from the pot in a single graceful brushstroke. A small cat curls at the table's edge.

The scene is drawn with maybe 20-30 brush strokes total. Bodies are simple shapes, faces are circles with dot features. The tea set is just a few curved lines. Light amber wash on the tea, pale pink on the girl's cheeks.

Title text integrated into the composition (top-left or top area, as if written by hand):
"\u6f6e\u5dde\u5de5\u592b\u8336\u00b7\u751f\u6d3b\u56db\u5f0f" (28pt, bold, charcoal)
Below in smaller text: "\u5bb6\u5ead\u6559\u5b66\u89c6\u9891\u811a\u672c" (16pt, light gray)

NO footer. NO page number. NO version. NO date. NO English.
The entire composition should feel like a single painting with title brushed on.`
},

// === SLIDE 2: PHILOSOPHY =================================================
{
  style: "emotion",
  prompt: `Extremely minimal Feng Zikai painting.

Scene: Just a single clay teapot in the center, drawn in about 5 brush strokes. Hot water is being poured onto it from above (a thin stream of ink). The pot's surface glistens with steam drawn as two wispy lines rising upward.

Above the pot, calligraphic text (as if handwritten on the painting):
"\u6f6e\u5dde\u4eba\u559d\u8336"
"\u7b2c\u4e00\u4ef6\u4e8b\u4e0d\u662f\u6295\u8336\uff0c\u662f\u201c\u6696\u58f6\u201d"

Below the pot, smaller:
"\u8fd9\u4e00\u6696\uff0c\u6696\u7684\u662f\u5668\uff0c\u4e5f\u662f\u4eba\u60c5"

Lots of empty space. The pot sits in the lower third, text in the upper third. Middle is pure emptiness \u2014 the silence between pouring and waiting.

NO footer. NO page number. Color: only the faintest amber wash on the pot and a warm glow around the water stream.`
},

// === SLIDE 3: FOUR STEPS OVERVIEW ========================================
{
  style: "content",
  prompt: `Layout: FOUR gentle areas arranged in a flowing 2\u00d72 pattern (NOT rigid grid), each with a tiny Feng Zikai illustration.

Top center: "\u751f\u6d3b\u56db\u5f0f" (bold, 32pt, charcoal) with a thin horizontal brush stroke underneath.

\u2500\u2500 Area 1 (top-left): Very pale amber wash background
Tiny illustration: a round teapot with water splashing, 3 brush strokes
"\u7b2c\u4e00\u5f0f\u00b7\u6e29\u676f" (bold, 22pt)
"\u5b5f\u81e3\u6dcb\u9716" (calligraphic, amber)
"\u9884\u70ed\u5373\u5c0a\u91cd" (small, gray)

\u2500\u2500 Area 2 (top-right): Very pale green wash
Tiny illustration: tea leaves falling into a pot, like leaves in autumn wind
"\u7b2c\u4e8c\u5f0f\u00b7\u7eb3\u8336" (bold, 22pt)
"\u4e4c\u9f99\u5165\u5bab" (calligraphic, green)
"\u4ece\u5bb9\u5373\u4fee\u517b" (small, gray)

\u2500\u2500 Area 3 (bottom-left): Very pale blue wash
Tiny illustration: a hand with a small tool skimming the surface of a pot
"\u7b2c\u4e09\u5f0f\u00b7\u522e\u6cab" (bold, 22pt)
"\u6625\u98ce\u62c2\u9762" (calligraphic, blue)
"\u6d01\u51c0\u5373\u656c\u610f" (small, gray)

\u2500\u2500 Area 4 (bottom-right): Very pale pink wash
Tiny illustration: three small cups being filled in sequence, tea stream flowing
"\u7b2c\u56db\u5f0f\u00b7\u5206\u8336" (bold, 22pt)
"\u5173\u516c\u5de1\u57ce" (calligraphic, pink-brown)
"\u516c\u5e73\u5373\u5f85\u5ba2" (small, gray)

The four areas should feel organic, slightly different sizes, with brush-stroke borders rather than geometric lines. Feng Zikai's hand visible in every small illustration. NO footer, NO page number.`
},

// === SLIDE 4: WEN BEI \u2014 CULTURAL SCENE ================================
{
  style: "scene",
  prompt: `A Feng Zikai painting scene.

Scene: A Chaozhou old house (\u8001\u5b85) at night. An elderly man sits by a red clay stove (\u7ea2\u6ce5\u7089), fanning the charcoal. A small clay pot (Mengchen pot) sits on the stove, white steam curling upward. The scene is drawn in just ink + warm amber wash for the fire glow. The old man is simplified: round head, thin body in traditional clothes, a few brushstrokes for the stove.

A small child peeks from behind a doorframe, curious, round-headed, dot eyes.

Text integrated into the painting (brushed calligraphic style, upper area):
"\u7b2c\u4e00\u5f0f\u00b7\u6e29\u676f"
Below in smaller text: "\u5b5f\u81e3\u6dcb\u9716"

The warm glow from the stove is the ONLY color \u2014 everything else is ink on cream paper. The emptiness of the night house is palpable.

NO footer. NO page number.`
},

// === SLIDE 5: WEN BEI \u2014 FAMILY COLLABORATION ==========================
{
  style: "content",
  prompt: `Layout: Asymmetric, illustration on the RIGHT (40%), content on the LEFT (50%), gap between.

LEFT side \u2014 content areas with pale amber wash:

Area 1: "\u5bb6\u5ead\u534f\u4f5c\uff1a15\u79d2\u6e29\u676f\u6311\u6218" (bold, 24pt)

Four step annotations, each with a tiny brush-stroke icon:
\u2776 "\u6cb8\u6c34\u5165\u58f6\uff0c\u4e09\u6210\u6ee1\uff0c\u52a0\u76d6\u6447\u8361" \u2014 3\u79d2 (tiny pot icon)
\u2777 "\u6c34\u5165\u8336\u6d77" \u2014 2\u79d2 (tiny pitcher icon)
\u2778 "\u8336\u6d77\u6c34\u5206\u5165\u676f" \u2014 \u6bcf\u676f3\u79d2 (tiny cups icon)
\u2779 "\u5f03\u6c34\uff0c\u676f\u53e3\u671d\u9634\u6670\u5e72" \u2014 7\u79d2 (tiny inverted cup icon)

Below, a warm quote callout:
"\u6e29\u8fc7\u7684\u676f\u5b50\uff0c\u6709\u592a\u9633\u7684\u5473\u9053" (italic, 18pt, amber)
\u2014 \u5c0f\u6708\uff0c8\u5c81

RIGHT side \u2014 Feng Zikai illustration:
A little girl (round head, pigtails, dot eyes) stands on tiptoe pouring water from a small kettle into a teapot. Her father crouches beside her, steadying the pot. Water splashes a tiny bit. The girl's expression is concentrated. Mother holds a phone, filming (drawn as just a rectangle in her hand). Light amber wash on the tea setup.

NO footer. NO page number. The illustration and text should feel like facing pages of a picture book.`
},

// === SLIDE 6: NA CHA \u2014 BROTHERS SCENE ================================
{
  style: "scene",
  prompt: `A Feng Zikai painting scene, slightly humorous.

Scene: Two brothers at a table. The older one (10, taller, round head with short spiky hair suggested by 3 lines) holds a ruler measuring the inside of a teapot. The younger one (6, smaller, completely round head) is carefully picking up tea leaves one by one with chubby fingers and placing them into the pot like tucking them into bed. A small scale and a measuring spoon sit on the table.

The moment captured: the little brother has his tongue sticking out slightly (one brush stroke) in concentration. Tea leaves are scattered on the table \u2014 some have "escaped."

Mother watches from behind, hand on chin, amused.

Text integrated into the upper part:
"\u7b2c\u4e8c\u5f0f\u00b7\u7eb3\u8336"
"\u4e4c\u9f99\u5165\u5bab"

Below the scene (as if handwritten):
"\u6211\u7ed9\u8336\u53f6\u76d6\u597d\u88ab\u5b50\u4e86" \u2014 \u5f1f\u5f1f\uff0c6\u5c81

Color: very pale green wash on the tea leaves, light amber on the pot. Everything else is ink on cream.

NO footer. NO page number.`
},

// === SLIDE 7: NA CHA \u2014 MATH + TECHNIQUE ===============================
{
  style: "content",
  prompt: `Layout: THREE flowing content areas arranged DIAGONALLY from top-left to bottom-right, each slightly overlapping, with Feng Zikai illustrations sprinkled between.

Area 1 (top-left, pale green wash):
"\u6295\u8336\u91cf\u8ba1\u7b97" (bold, 24pt)
Tiny illustration: a round-headed boy with a ruler next to a teapot
"\u58f6\u5bb9\u91cf \u00f7 20 = \u6295\u8336\u514b\u6570"
"\u4f8b\uff1a110ml \u00f7 20 = 5.5g" (bold stat style)

Area 2 (center, pale amber wash):
"\u6761\u7d22\u8336\u5165\u58f6\u6cd5" (bold, 24pt)
Tiny illustration: tea leaves lying horizontally in a pot like people in bed
"\u6761\u7d22\u957f\u7684\u8eba\u4e0b\uff0c\u788e\u672b\u7684\u57ab\u5e95"
"\u5982\u541b\u5b50\u843d\u5ea7\u2014\u4ece\u5bb9\u3001\u8212\u5c55" (italic, calligraphic)

Area 3 (bottom-right, pale pink wash):
"\u5931\u8bef\u4e0e\u6210\u957f" (bold, 24pt)
Tiny illustration: a small boy with tears (two dots), bigger brother patting his head
"\u5012\u51fa\u6765\u91cd\u65b0\u6446\u3002\u53cd\u6b63\u53c8\u6ca1\u6cbe\u6c34\u3002"
\u2014 \u54e5\u54e5\uff0c10\u5c81

The three areas flow like stepping stones. Brush-stroke connections (not arrows) link them. NO footer, NO page number.`
},

// === SLIDE 8: GUA MO \u2014 GRANDMA SCENE ================================
{
  style: "scene",
  prompt: `A Feng Zikai painting, deeply warm and intergenerational.

Scene: A traditional Chaozhou courtyard (\u5929\u4e95). Grandmother sits on a low wooden stool, pouring tea with practiced ease \u2014 drawn in just 5-6 strokes, her posture upright and graceful despite her age. Her hair is a white bun (one oval stroke).

A tiny granddaughter (7, round face, two small braids) kneels beside her, holding a small silicone scraping tool, waiting eagerly. She's drawn leaning forward on her knees, body language full of anticipation.

The pot is between them, foam visible on the surface as tiny white circles. A shaft of courtyard sunlight falls diagonally (one pale yellow wash stroke) across the scene.

Text integrated (upper right, calligraphic):
"\u7b2c\u4e09\u5f0f\u00b7\u522e\u6cab"
"\u6625\u98ce\u62c2\u9762"

Below the scene:
"\u5934\u51b2\u8336\uff0c\u6709\u6cab\u3002\u8001\u4eba\u8bf4\uff0c\u90a3\u662f\u8336\u53f6\u5728\u547c\u5438\u3002"

Color: amber wash for sunlight, pale green for the courtyard plant in the corner. Ink for everything else.

NO footer. NO page number.`
},

// === SLIDE 9: THREE GENERATIONS ==========================================
{
  style: "emotion",
  prompt: `Extremely poetic Feng Zikai moment.

Scene: Three figures around a single small teapot. Grandmother, grandfather (who just walked in), and granddaughter. Each has just finished scraping the foam \u2014 the pot surface is clean as a mirror. They are drawn in absolute minimum strokes: three round/oval heads at different heights, three pairs of hands visible, the pot in the center.

Grandpa is the tallest silhouette, grandma slightly shorter, the girl very small. They form a gentle triangle composition.

Calligraphic text (as part of the painting, positioned artistically):
"\u4e00\u522e\u662f\u656c\u610f"
"\u4e8c\u522e\u662f\u4f20\u627f"
"\u4e09\u522e\u662f\u56e2\u5706"

The three lines of text are placed at three different heights, echoing the three figures. This is the emotional climax of the third episode.

Almost no color \u2014 just the faintest pink wash on the granddaughter's cheeks and the lightest amber on the pot. Everything else is ink and emptiness.

NO footer. NO page number.`
},

// === SLIDE 10: FEN CHA \u2014 TWINS SCENE ================================
{
  style: "scene",
  prompt: `A Feng Zikai scene, playful and lively.

Scene: Twin sisters (9 years old, identical round heads with short bobs, dot eyes, drawn as mirror images of each other) each hold a small white teacup. They're looking at each other, comparing the color of their tea. Between them, father holds a small teapot mid-pour, doing the "Guan Gong patrol" \u2014 moving the pot back and forth over three cups.

The cups are in a row on the table. The tea stream is drawn as a single flowing ink line that goes back and forth (left-right-left pattern), showing the even pouring technique.

One twin points at the cups and says (speech text integrated):
"\u59d0\u59d0\uff0c\u90a3\u676f\u989c\u8272\u6d45\u4e86\uff01"

Mother sits to the side, arms crossed, smiling.

Text at top:
"\u7b2c\u56db\u5f0f\u00b7\u5206\u8336"
"\u5173\u516c\u5de1\u57ce"

Color: amber wash for the tea liquid in the cups (three identical amber circles). Pale pink on the twins' cheeks. Ink for everything else.

NO footer. NO page number.`
},

// === SLIDE 11: FEN CHA \u2014 FAIRNESS PHILOSOPHY =========================
{
  style: "content",
  prompt: `Layout: LEFT side has a vertical column of content (55%), RIGHT side has a Feng Zikai illustration (35%).

LEFT side \u2014 flowing content with brush-stroke dividers:

"\u4e09\u5de1\u5b9a\u5f0f" (bold, 28pt, charcoal)

Three steps, each with a DIFFERENT pale wash color background:

Step 1 (pale amber):
"\u7b2c\u4e00\u5de1\uff1a\u4ece\u5de6\u5230\u53f3" (bold)
"\u6bcf\u676f\u5148\u6ce81/3" (regular)
Tiny illustration: three cups, each with a low tea line

Step 2 (pale green):
"\u7b2c\u4e8c\u5de1\uff1a\u4ece\u53f3\u5230\u5de6" (bold)
"\u6bcf\u676f\u52a0\u81f3\u4e03\u5206\u6ee1" (regular)
Tiny illustration: three cups with medium tea line

Step 3 (pale pink):
"\u7b2c\u4e09\u5de1\uff1a\u89c2\u5bdf\u8865\u5dee" (bold)
"\u4e09\u676f\u6c64\u8272\u4e00\u81f4" (regular)
Tiny illustration: three cups with equal tea lines, a checkmark drawn in ink

Below, a philosophical line:
"\u5206\u8336\u7684\u7ec8\u70b9\uff0c\u4e0d\u662f\u8336\u6c64\u3002"
"\u662f\u6bcf\u4e2a\u4eba\u90fd\u89c9\u5f97\uff0c\u81ea\u5df1\u6536\u5230\u4e86\u521a\u521a\u597d\u7684\u90a3\u4e00\u676f\u3002" (italic, 18pt, warm gray)

RIGHT side \u2014 Feng Zikai illustration:
Twin girls holding their cups up to the light (drawn as a window rectangle). The tea glows amber through the translucent cups. One girl has a satisfied expression (upturned line for mouth). Simple, warm.

NO footer. NO page number.`
},

// === SLIDE 12: CREATIVE EXTENSION ========================================
{
  style: "emotion",
  prompt: `A gentle Feng Zikai observation scene.

Scene: Three teacups in a row \u2014 one white porcelain, one rough wood-fired clay, one clear glass. The SAME tea is in all three, but it appears different colors: pale gold in white, dark amber in clay, warm honey in glass.

The three cups are drawn as three simple shapes (half-circle, rough rectangle, transparent outline) with color washes inside showing the different appearances.

Above, a child's voice (calligraphic text):
"\u540c\u6837\u7684\u8336\u6c64\uff0c\u770b\u8d77\u6765\u989c\u8272\u4e0d\u4e00\u6837\uff01"

Below:
"\u4e0d\u540c\u7684\u5668\uff0c\u4f1a\u8bb2\u4e0d\u540c\u7684\u6545\u4e8b"

A tiny twin figure stands beside the cups, hand on chin in wonder, drawn in just 4-5 strokes.

Extreme simplicity. The three cups + one figure + two lines of text. Everything else is warm cream emptiness.

NO footer. NO page number.`
},

// === SLIDE 13: TEACHING TOOLS ============================================
{
  style: "content",
  prompt: `Layout: A gentle FOUR-COLUMN layout flowing left to right, each column a different pale wash, with tiny Feng Zikai illustrations as headers.

Title centered at top: "\u5bb6\u5ead\u6559\u5b66\u914d\u5957" (bold, 28pt, charcoal)

Column 1 (pale amber wash):
Tiny illustration: a small pot being warmed
"\u6e29\u676f" (bold, 20pt, amber)
"\u4fa7\u628a\u58f6\u00b7\u6e29\u5ea6\u8d34\u7eb8"
"\u5b69\u5b50\u6ce8\u6c34/\u5bb6\u957f\u6447\u58f6"
"AI\u8bc4\u5206\uff1a\u603b\u65f6\u957f\u226415\u79d2"

Column 2 (pale green wash):
Tiny illustration: tea leaves on a spoon
"\u7eb3\u8336" (bold, 20pt, green)
"5g\u91cf\u52fa\u00b7\u8336\u53f6\u8ba1\u7b97\u5361"
"\u54e5\u54e5\u7b97\u91cf/\u5f1f\u5f1f\u6446\u8336"
"AI\u8bc4\u5206\uff1a\u8bef\u5dee\u22640.3g"

Column 3 (pale blue wash):
Tiny illustration: a hand scraping across a pot top
"\u522e\u6cab" (bold, 20pt, blue)
"\u9e70\u5634\u58f6\u00b7\u7845\u80f6\u522e\u6cab\u677f"
"\u5976\u5976\u51b2/\u5b69\u5b50\u522e"
"AI\u8bc4\u5206\uff1a\u4e00\u6b21\u5b8c\u6210"

Column 4 (pale pink wash):
Tiny illustration: three cups with even tea lines
"\u5206\u8336" (bold, 20pt, pink-brown)
"\u900f\u660e\u516c\u5e73\u676f\u00b7\u540c\u6b3e\u54c1\u676f"
"\u8f6e\u6d41\u5de1\u57ce/\u4e92\u76f8\u8d28\u68c0"
"AI\u8bc4\u5206\uff1a\u8272\u5deeSE<3"

Brush-stroke dividers between columns (single vertical ink lines, slightly wavy). Each column's illustration is tiny (think 1\u00d71 inch equivalent) and absolutely Feng Zikai minimal.

NO footer. NO page number.`
},

// === SLIDE 14: CULTURAL VALUES ==========================================
{
  style: "emotion",
  prompt: `A contemplative Feng Zikai composition.

FOUR small scenes arranged in a gentle arc or scattered pattern (NOT a grid), each showing a parent-child moment with a single value word:

Scene 1 (top-left): Father and daughter warming cups together. Above them: "\u9884\u70ed\u5373\u5c0a\u91cd" (calligraphic, amber ink)

Scene 2 (upper-right): Two brothers carefully placing tea leaves. Above: "\u4ece\u5bb9\u5373\u4fee\u517b" (calligraphic, green ink)

Scene 3 (lower-left): Grandmother and granddaughter, clean pot surface. Above: "\u6d01\u51c0\u5373\u656c\u610f" (calligraphic, blue-gray ink)

Scene 4 (lower-right): Twin sisters with equal cups. Above: "\u516c\u5e73\u5373\u5f85\u5ba2" (calligraphic, warm brown ink)

Each scene is EXTREMELY minimal \u2014 just 3-4 brush strokes per figure. The four value phrases are the visual anchors, the figures are supporting illustrations. Lots of empty cream space between scenes.

Center (if space allows): a tiny teapot drawn in a single continuous brush stroke, connecting all four scenes conceptually.

NO footer. NO page number. NO corporate elements whatsoever.`
},

// === SLIDE 15: CLOSING ===================================================
{
  style: "scene",
  prompt: `The warmest Feng Zikai painting in the deck.

Scene: A family of four walking along a mountain path toward Phoenix Mountain (\u51e4\u51f0\u5c71), seen from behind. Father carries a backpack, mother holds the smaller child's hand, the older child runs slightly ahead pointing at something in the distance. A tea tree is visible ahead with a small red ribbon tied to it (their adopted tree).

The mountain is just a few ink wash strokes suggesting misty peaks. The path is one curved line. The family are four simple silhouettes of different heights, drawn in ink with the lightest color washes (pink for the children, amber for the adults).

A small speech bubble (hand-drawn, not digital) from the smaller child:
"\u5988\u5988\uff0c\u6211\u4eec\u53ef\u4ee5\u53bb\u51e4\u51f0\u5c71\u4e86\u5417\uff1f"

Mother's gentle reply (another small speech):
"\u5636\uff0c\u53bb\u770b\u6211\u4eec\u8ba4\u517b\u7684\u90a3\u68f5\u6811\u3002"

In the sky area, four small circular badges float like stars \u2014 the four collected badges (\u6e29\u676f, \u7eb3\u8336, \u522e\u6cab, \u5206\u8336), each drawn as a tiny circular seal stamp in red ink.

The overall feeling: journey complete, family together, the mountain awaits. Pure warmth.

NO footer. NO page number. NO version. This is the final page of a beautiful story.`
},

];

// --- STYLE RESOLVER -------------------------------------------------------
function getStyle(tag) {
  switch(tag) {
    case "scene": return STYLE_SCENE;
    case "content": return STYLE_CONTENT;
    case "emotion": return STYLE_EMOTION;
    default: return STYLE_CONTENT;
  }
}

// --- GENERATION ENGINE ----------------------------------------------------
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

  const CONCURRENCY = 15;
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

  const outFile = "\u6f6e\u5dde\u5de5\u592b\u8336-\u751f\u6d3b\u56db\u5f0f.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${slides.length} slides)`);
}

main().catch(err => console.error("Fatal:", err));
