// Industrial Agent style — investment-banking analysis × industrial tech, in WARM muted palette
// Combines structural rigor (cards, flow diagrams, mixed sketch+tech illustrations, 4K)
// with a warm taupe/beige/cream/muted-gold palette. NO dark navy. NO cool colors.
//
// Used for industrial / agentic / consulting decks where the audience expects
// premium analysis-paper feel without the cold tech-noir aesthetic.

// ─── PALETTE (warm, muted, modern) ──────────────────────────────────
// Background base:    soft taupe #B8A99A · warm beige #D4C4B0 · cream #F5EDE6 · soft warm beige #E8DDD4
// Accent gold:        muted gold #C9B896 · warm bronze #A68A5C
// Text primary:       warm charcoal #4A403A
// Text secondary:     warm gray #6B5D54 · #8B7D73
// Card surface:       cream #F5EDE6
// Borders / dividers: muted gold #C9B896
// NO bright colors, NO high saturation, NO cool blues/greens, NO neon

const STYLE_NORMAL = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Soft warm taupe (#B8A99A) blending into warm beige (#D4C4B0) — a sophisticated muted gradient evoking premium consulting paper, NOT bright, NOT saturated, NOT vintage. Subtle geometric or grid texture at 5-8% opacity in muted gold. Modern, minimalist, contemporary investment-research aesthetic.

TYPOGRAPHY RULES:
- Slide titles: LARGE bold warm charcoal (#4A403A), top-left or center-top
- Section headers: medium bold, warm bronze (#A68A5C) or muted gold (#C9B896)
- Body text: clean warm gray (#6B5D54), left-aligned
- Large stat numbers: bold warm bronze (#A68A5C), very large, with subtle muted-gold glow
- Table headers: muted gold (#C9B896) background with warm charcoal text
- Default: ALL TEXT IN ENGLISH for English-led decks; CHINESE allowed when content is Chinese-led. Do NOT mix unnecessarily.
- Do NOT repeat translations.

CRITICAL — NO PROMPT LEAK, NO PAGE NUMBERS, NO HEADERS/FOOTERS:
- NEVER render formatting instructions, hex codes, font sizes, or pixel dimensions on the slide
- ABSOLUTELY NO page numbers, slide numbers, or numbering anywhere on the slide
- NO header text, NO footer text, NO watermarks, NO breadcrumb labels, NO "PART X" tags
- NO extra decorative text that is not part of slide content

ILLUSTRATION STYLE:
Every slide MUST have a substantive illustration — NOT tiny icons.
- MIXED STYLE acceptable: warm pencil/charcoal sketch art for traditional or historical elements (machinery, factories, hands, artifacts) AND modern muted-gold tech illustrations for AI / digital elements (neural webs, agent nodes, data flows, server stacks, graphs)
- Hand-drawn elements: charcoal/sepia pencil sketch in warm tones (#6B5D54 to #4A403A line work on cream)
- Tech elements: warm bronze and muted gold glow (NEVER cyan, NEVER electric blue, NEVER neon), connected by soft luminous data flow lines in muted gold
- Illustrations should be LARGE, occupying 35-45% of the slide
- Think: Bain / McKinsey / The Economist long-form report meets a quietly luminous tech showcase, in warm tones

LAYOUT:
- Cards/boxes: cream (#F5EDE6) backgrounds with thin muted-gold (#C9B896) borders, soft drop shadow at low opacity
- Flow diagrams: rounded rectangles connected by warm bronze (#A68A5C) arrows
- Tables: muted-gold header row, alternating cream and slightly deeper warm beige rows, warm-charcoal text
- Bottom insight bars: muted-gold bordered cards holding the key takeaway
- Generous spacing, ≥0.5" margins
- NO logo watermarks, NO chart watermarks, NO corner decorations, NO bright stickers

Overall feeling: warm consulting research × industrial intelligence × contemporary minimalism. Premium and grown-up, not trendy.`;

const STYLE_COVER = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Elegant warm muted gradient — soft taupe (#B8A99A) at center, blending into warm beige (#D4C4B0) and a hint of muted gold (#C9B896) at the corners. Premium, bold, tech-forward, BUT warm — NOT dark, NOT cool, NOT neon.

TYPOGRAPHY RULES:
- Title: VERY LARGE bold warm charcoal (#4A403A), center-aligned (or center-top with left-aligned subtitle below)
- Subtitle: medium size, warm bronze (#A68A5C), centered or left-aligned beneath title
- Slogan / tagline: smaller, warm gray (#6B5D54), italic
- Date / version line at bottom in small warm gray
- Default English; Chinese allowed when contextually justified

CRITICAL — NO PROMPT LEAK, NO PAGE NUMBERS, NO BREADCRUMBS

ILLUSTRATION STYLE:
- LEFT SIDE (or background-left): warm hand-drawn pencil sketch of a traditional industrial element (engine, factory floor, machine tool, gears) in soft sepia/warm gray
- RIGHT SIDE: modern muted-tech illustration with agent / network nodes, data flows, attestation seals — rendered in warm bronze with subtle muted-gold glow (NOT cyan, NOT electric blue)
- CENTER: an arrow / timeline / DNA-helix-like motif connecting the two worlds (industrial → agentic), in muted gold
- Large, atmospheric, occupying 60-70% of the slide background
- No labels or watermarks at top-left

LAYOUT:
- Date and version info at bottom in small warm-gray text
- Premium investment-banking research / quietly modern industrial showcase aesthetic`;

const STYLE_DATA = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Soft warm beige (#D4C4B0 → #E8DDD4) gradient — slightly lighter than the normal style for data-readability. Muted, calm, professional. NO cool colors.

TYPOGRAPHY RULES:
- Slide titles: LARGE bold warm charcoal (#4A403A), top-left
- Table headers: muted gold (#C9B896) background with warm charcoal text
- Table body: alternating cream (#F5EDE6) and slightly deeper warm beige (#E2D4C2) rows, warm charcoal text
- Large stat numbers: bold warm bronze (#A68A5C), very large
- Key insight callouts: warm charcoal in cream-bordered cards with muted-gold left border
- Default English; Chinese acceptable when content is Chinese-led
- NO repeated translations

CRITICAL — NO PROMPT LEAK, NO PAGE NUMBERS, NO BREADCRUMBS

ILLUSTRATION STYLE:
- Data-focused slides may include small supporting illustrations
- Charts/diagrams in warm bronze (#A68A5C) and muted gold (#C9B896) palette ONLY (no cyan, no orange, no neon)
- Glowing connection lines in muted gold between data points
- Hand-drawn warm pencil-sketch decorations as accents (e.g. small factory, gear, machine in corner) at low opacity

LAYOUT:
- Tables: cream rows with muted-gold header, clean warm-charcoal text, generous cell padding
- Cards: cream backgrounds with muted-gold left or full borders
- Bottom insight bar with muted-gold border for the key takeaway
- Clean, professional, data-dense but immediately readable`;

const STYLE_SECTION = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Deep warm taupe (#9A8B7D) blending to a slightly richer warm bronze tone at edges, with subtle muted-gold glowing geometric patterns. Premium, atmospheric, elevated — but still warm, NOT dark, NOT cool.

TYPOGRAPHY RULES:
- Part / chapter label is FORBIDDEN — do NOT render any "PART X" / "CHAPTER" / "SECTION" tag
- Main title: VERY LARGE, bold, warm charcoal (#4A403A) on lighter card panel, OR cream (#F5EDE6) on deeper warm taupe
- Subtitle: medium, warm bronze (#A68A5C), centered or left below title

CRITICAL — NO PROMPT LEAK, NO BREADCRUMBS, NO ROMAN NUMERALS NEAR TITLE

ILLUSTRATION STYLE:
- Full-bleed atmospheric warm-toned background illustration
- Abstract glowing tech elements in muted gold: hexagonal nodes, data streams, helix arcs, neural-net suggestion
- Mixed with faint warm hand-drawn industrial sketches at low opacity (engines, hands, machines)
- Warm bronze (#A68A5C) and muted gold (#C9B896) glow accents only — NO cyan, NO neon
- Cinematic but warm. Section-divider energy without going dark.`;

const STYLE_WARM = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Soft warm cream (#F5EDE6) center transitioning into warm beige (#E8DDD4) at edges — the warmest, most human-feeling variant in this family. Subtle natural pattern (paper grain, light cloud) at <5% opacity. Modern, gentle, library-afternoon mood.

TYPOGRAPHY RULES:
- Slide titles: bold warm charcoal (#4A403A), generous size, top-center or top-left
- Subtitle: warm bronze (#A68A5C) italic, just below title
- Body: warm gray (#6B5D54), readable
- Quote callouts: italic warm charcoal in cream cards with muted-gold left border
- Default English; Chinese allowed when content is Chinese-led

CRITICAL — NO PROMPT LEAK, NO PAGE NUMBERS, NO BREADCRUMBS

ILLUSTRATION STYLE:
- Warm hand-drawn pencil sketch acceptable — figures, hands, small portraits, organic shapes
- Da-Vinci-manuscript-quality elegance: minimal line, contemporary, NOT florid, NOT illuminated
- Tech elements only when needed, in muted gold, very minimal
- Generous white space; this style breathes

LAYOUT:
- Cream cards with muted-gold borders, soft warm shadows
- 2×2 or 3×3 grids fine for human-story content
- Bottom italic quote in warm charcoal

Used for: human-centric, philosophical, narrative, chapter-opener style content within the warm-industrial family.`;

const styles = {
  normal: STYLE_NORMAL,
  cover: STYLE_COVER,
  data: STYLE_DATA,
  section: STYLE_SECTION,
  warm: STYLE_WARM,
};

function getStyle(name) {
  return styles[name] || styles.normal;
}

module.exports = { styles, getStyle };
