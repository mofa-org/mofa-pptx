// Ocean Tech style — Octos mascot palette — CHINESE version
// Same visual style, ALL TEXT IN CHINESE except proper nouns/technical terms

const STYLE_NORMAL = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Very light mint-white to soft aquamarine gradient. Airy, bright, clean — like sunlit shallow tropical ocean water. Subtle underwater caustic light patterns at very low opacity (3-5%). Warm and inviting.

TYPOGRAPHY RULES:
- Titles: bold, large, dark teal-gray, top-left aligned
- Section headers: bold, medium, dark teal
- Body text: medium weight, warm dark gray, left-aligned
- Stat numbers: very large, bold, soft teal or coral-salmon
- ALL TEXT IN CHINESE. English only for proper nouns (Octos, OpenClaw, Rust, TypeScript, Docker, API, REST, SSE, DOT, LLM, MCP, Prometheus, GitHub, etc.) and technical terms.
- Do NOT repeat English translations of Chinese text.
- Rounded, friendly sans-serif font throughout

CRITICAL — NO PROMPT LEAK (STRICT):
- NEVER render formatting instructions as visible text
- NEVER show font sizes, hex codes, pixel dimensions, CSS notation, or layout keywords on the slide
- If you see instructions like "bold", "teal accent", "top-left", apply them visually — do NOT print them as text
- NO PAGE NUMBERS anywhere on the slide
- Do NOT render words like "TITLE", "SUBTITLE", "LAYOUT", "ILLUSTRATION", "Row", "Card", "AREA" as visible text
- Do NOT render parenthetical instructions like "(installable)" or "(default)" as visible text — these are notes for you, not slide content

ILLUSTRATION STYLE — OCTOS MASCOT STYLE:
Every slide MUST have LARGE, CHARMING illustrations in the OCTOS MASCOT style:
- Cute, FLAT DESIGN sea creatures — soft pastel colors, NO outlines or minimal thin outlines
- The octopus character: round soft teal-cyan body, big friendly eyes, EXACTLY 8 tentacles in multicolored pastels (teal, blue, coral-salmon, warm yellow). ALWAYS 8 TENTACLES — count them
- These cute creatures ARE tech elements — an octopus whose tentacles are API connections, a jellyfish that is a network node, coral that is a server rack
- Color palette: soft teal-cyan, sky blue, coral-salmon, warm yellow, mint green — ALL PASTEL
- NO dark/cyberpunk aesthetic. Flat color fills, minimal shadows, rounded shapes.
- Think: Duolingo meets Notion meets Finding Nemo coral reef

LAYOUT:
- Cards: white or very light teal backgrounds, thin rounded borders in soft teal or coral, gentle shadow
- Tables: white backgrounds, soft teal header rows, alternating white/very-light-mint rows
- 0.5 inch minimum margins. Generous spacing.`;

const STYLE_COVER = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Soft gradient from light aquamarine at top to warm sandy-peach at bottom — like looking through tropical shallow water.

TYPOGRAPHY RULES:
- Title: very large, bold, dark teal, center-aligned
- Subtitle: medium, coral-salmon color
- ALL TEXT IN CHINESE except proper nouns.

CRITICAL — NO PROMPT LEAK (STRICT):
- NEVER render formatting instructions, layout keywords, or parenthetical notes as visible text
- NO PAGE NUMBERS. No "TITLE", "SUBTITLE", "Row", "Card", "AREA" as text

ILLUSTRATION STYLE — OCTOS MASCOT STYLE:
- A LARGE, ADORABLE octopus matching the reference image provided: round soft teal-cyan body, big friendly eyes, warm smile, EXACTLY 8 tentacles — count them: 4 on each side
- FLAT DESIGN — solid pastel colors, no outlines or very thin soft outlines
- CUTE and FRIENDLY — like a mascot character
- Other pastel sea creatures swimming around
- NOT dark, NOT realistic — warm, smart, delightful`;

const STYLE_DATA = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Clean white to very light mint-aqua. Bright, data-focused, professional but friendly.

TYPOGRAPHY RULES:
- Title: bold, large, dark teal, top-left aligned
- Table headers: bold, white text on soft teal background (rounded corners)
- Table body: medium weight, warm dark gray
- Stat numbers: very large, bold, soft teal or coral-salmon
- ALL TEXT IN CHINESE except proper nouns and technical terms.
- Rounded friendly sans-serif font

CRITICAL — NO PROMPT LEAK (STRICT):
- NEVER render formatting instructions, layout keywords, or parenthetical notes as visible text
- NO PAGE NUMBERS. No "TITLE", "SUBTITLE", "Row", "Card", "AREA" as text

DATA DISPLAY:
- Tables: white cards with soft rounded borders, teal header rows, alternating white/very-light-mint rows
- Octos column accent in soft teal, OpenClaw column accent in coral-salmon
- Cards: white with thin rounded teal or coral borders, subtle soft shadow

ILLUSTRATION STYLE — OCTOS MASCOT STYLE:
- Cute PASTEL sea creatures as data visualization elements
- Small octopus mascot characters peeking from corners
- Pastel colors only: teal, blue, coral, yellow, mint`;

const STYLE_SECTION = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Soft gradient — warm aquamarine to light teal-blue. Like looking up from underwater toward the bright surface.

TYPOGRAPHY RULES:
- Category label: medium, coral-salmon, above title
- Section title: very large, bold, dark teal, center-aligned
- Section subtitle: medium, soft blue, below title
- ALL TEXT IN CHINESE except proper nouns.

CRITICAL — NO PROMPT LEAK (STRICT):
- NEVER render formatting instructions, layout keywords, or parenthetical notes as visible text
- NO PAGE NUMBERS. No "TITLE", "SUBTITLE", "Row", "Card", "AREA" as text

ILLUSTRATION STYLE — OCTOS MASCOT STYLE:
- Large scene illustration in flat pastel style at low opacity
- Cute sea creatures, soft light rays from above
- Octos mascot palette: soft teal, sky blue, coral-salmon, warm yellow
- Flat design, minimal shadows, rounded shapes`;

const styles = { normal: STYLE_NORMAL, cover: STYLE_COVER, data: STYLE_DATA, section: STYLE_SECTION };
function getStyle(tag) { return styles[tag] || STYLE_NORMAL; }
module.exports = { styles, getStyle, STYLE_NORMAL, STYLE_COVER, STYLE_DATA, STYLE_SECTION };
