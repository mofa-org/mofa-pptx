// Premium consulting style — premium consulting deck
// Deep navy + warm teal + gold accents, isometric 3D geometric illustrations

const STYLE_COVER = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: Deep navy gradient (#003A70 top → #001E3C bottom). Subtle abstract geometric pattern — isometric cubes, thin connecting lines, circular node networks in muted teal (#00A99D) at 8-10% opacity. A diagonal gradient strip of warm gold (#D4A843) at 15% opacity across the lower third.

TYPOGRAPHY:
- Title: Noto Sans SC, 700 weight, 42-48pt, WHITE
- Subtitle: Noto Sans SC, 300 weight, 22-26pt, #D4A843 (warm gold)
- Date/attribution: Noto Sans SC, 300 weight, 14pt, rgba(255,255,255,0.5)

ILLUSTRATION STYLE:
- Abstract isometric 3D geometric shapes: cubes, cylinders, hexagons, abstract building blocks in muted navy-teal tones
- Thin white connecting lines and dot grids at low opacity
- A subtle network of nodes and edges suggesting interconnection
- NO cartoons, NO photorealism — pure geometric abstraction
- Premium, confident, institutional feel like premium consulting cover pages

OVERALL: Clean, commanding, authoritative. Deep navy conveys trust. Gold accent conveys premium. Sparse but impactful. NO clutter. Generous whitespace around title.

ALL TEXT IN CHINESE. English only for proper nouns and acronyms.
Do NOT repeat English translations of Chinese text.`;

const STYLE_NORMAL = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: Clean white (#FFFFFF) with a very faint warm gray (#F8F7F5) tint. A thin navy (#003A70) horizontal line at top (y=60px, 2px weight, 80% width centered). Subtle isometric geometric shapes — cubes, building blocks, abstract data visualization elements — in VERY LIGHT gray (#E8E8E8 to #F0F0F0) at 8-12% opacity as watermark in bottom-right corner or side strip. Maximum 15-20% of slide area for these geometric accents.

TYPOGRAPHY:
- Slide title: Noto Sans SC, 700 weight, 28-32pt, #003A70 (deep navy). Top-left area.
- Section headers: Noto Sans SC, 700 weight, 18-20pt, #003A70
- Body text: Noto Sans SC, 300 weight, 14-16pt, #444444
- Stat numbers: Manrope, 700 weight, 48-64pt, #0080C6 (blue) or #00A99D (teal)
- Accent text: Noto Sans SC, 14pt, #D4A843 (gold) for key callouts
- Caption/source: Noto Sans SC, 300 weight, 10-11pt, #999999

LAYOUT PRINCIPLES:
- LEFT-ALIGNED text blocks, generous margins (min 0.7 inches from edges)
- Cards/boxes: white background with thin LEFT BORDER in navy or teal (3px), NO shadow, NO rounded corners — SHARP, FLAT consulting style
- Data callouts: large stat number + small label below, contained in a clean box
- Tables: thin 1px gray borders, navy header row with white text
- ALL boxes and content areas must be FLAT — no gradients, no shadows, no 3D effects on content

ILLUSTRATION STYLE:
- Isometric 3D shapes: cubes, cylinders, abstract building blocks in muted tones (#003A70, #0080C6, #00A99D, #E8E8E8, #D4A843)
- Gradient washes: soft blue-to-white or navy-to-teal horizontal gradients (ONLY as subtle background elements)
- Abstract dot grids, thin connecting lines, circular node networks
- VERY SUBTLE — decorative only, 15-25% of slide area, bottom edge or side strip or corner cluster
- NO cartoons, NO metaphors, NO photorealism — pure geometric abstraction
- Clean corporate vector-style diagrams for flowcharts and architectures

COLOR PALETTE:
- Deep navy: #003A70 (titles, borders, primary)
- Blue: #0080C6 (stats, highlights, secondary)
- Warm teal: #00A99D (success, accent)
- Gold: #D4A843 (premium accent, key callouts)
- Soft gray: #E8E8E8 (backgrounds, dividers)
- Text dark: #444444 (body)
- White: #FFFFFF (card backgrounds)

ALL TEXT IN CHINESE. English only for proper nouns and acronyms.
Do NOT repeat English translations of Chinese text.
Page numbers in format "NN" at bottom-right, 11pt, #999999.`;

const STYLE_DATA = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: Clean white (#FFFFFF). Very faint warm gray tint (#F8F7F5). Thin navy line at top. NO geometric watermarks — this is a data-dense slide that needs maximum clean space.

TYPOGRAPHY:
- Slide title: Noto Sans SC, 700 weight, 26-30pt, #003A70 (deep navy). Top-left.
- Table headers: Noto Sans SC, 700 weight, 14-16pt, WHITE on #003A70 navy background
- Table body: Noto Sans SC, 300 weight, 13-15pt, #444444
- Stat numbers: Manrope, 700 weight, 48-72pt, #0080C6 or #00A99D
- Column headers: Noto Sans SC, 700 weight, 16pt, #003A70

LAYOUT PRINCIPLES:
- Tables: thin 1px #DDDDDD borders, navy header row, alternating white/#F8F7F5 rows
- Comparison tables: clear column separation, color-coded highlights
- Timeline/roadmap: horizontal flow with milestone markers in navy/teal/gold
- Grid layouts: 2x2 or 3x2 stat cards with large numbers
- ALL FLAT — no shadows, no gradients on data elements

ALL TEXT IN CHINESE. English only for proper nouns, metrics, and acronyms.
Do NOT repeat English translations of Chinese text.
Page numbers in format "NN" at bottom-right, 11pt, #999999.`;

const STYLE_SECTION = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: Navy gradient (#003A70 left → #001E3C right). Abstract isometric geometric shapes — cubes, hexagons, connecting lines — in slightly lighter navy (#004A90) at 10-15% opacity as texture. A horizontal gold (#D4A843) accent line at 40% from top, thin (2px).

TYPOGRAPHY:
- Part number: Noto Sans SC, 300 weight, 18pt, #D4A843 (gold)
- Section title: Noto Sans SC, 700 weight, 40-48pt, WHITE
- Section subtitle: Noto Sans SC, 300 weight, 20-24pt, rgba(255,255,255,0.7)

LAYOUT: Center-left aligned. Part number above title. Generous vertical spacing. Subtitle below title with extra spacing. Premium, commanding, minimal.

NO illustrations except the background texture. This is a section divider — clean and confident.

ALL TEXT IN CHINESE. English only for proper nouns.
Do NOT repeat English translations of Chinese text.`;

const styles = {
  normal: STYLE_NORMAL,
  cover: STYLE_COVER,
  data: STYLE_DATA,
  section: STYLE_SECTION,
};

function getStyle(tag) {
  return styles[tag] || styles.normal;
}

module.exports = { styles, getStyle, STYLE_NORMAL, STYLE_COVER, STYLE_DATA, STYLE_SECTION };
