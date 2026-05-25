// Harmony Red style — bold red corporate wireframe aesthetic
// Primary: Red #C7000B, Deep Black #1A1A1A, Gold #D4A843, Teal #00A99D

const STYLE_NORMAL = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Clean white to warm light gray. Professional, institutional, premium.

TYPOGRAPHY RULES:
- English text: use a geometric modern sans-serif font
- Chinese text: use a clean Chinese sans-serif font
- Slide titles: bold, large, deep black, top-left aligned
- Section headers: bold, medium size, deep black
- Body text: light weight, medium gray, left-aligned
- Large stat numbers: geometric sans-serif bold, very large, bold red or deep black
- ALL TEXT IN CHINESE. English only for proper nouns, acronyms, and technical terms like AI, Agent, DTU, Spec, Swarm, API, MCP, L0-L5, HarmonyOS, SaaS, CI/CD.
- Do NOT repeat English translations of Chinese text.

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text
- NEVER show font sizes, hex codes, pixel dimensions, or CSS-like notation on the slide
- If you see instructions like "bold" or "red accent", apply them visually — do NOT print them as text

ILLUSTRATION STYLE:
Every slide MUST have LARGE, DETAILED WIREFRAME illustrations — not tiny icons.
- WIREFRAME LINE ART style — clean outlines, no solid fills, no photo-realism
- Line color: dark gray to warm charcoal, line weight about 1.5-2px
- RED accent lines on key elements — highlights, borders, important nodes
- Illustrations should be LARGE SCENE COMPOSITIONS occupying about 35-40% of the slide
- Detailed wireframe: network nodes, server racks, circuit patterns, connected devices, brain outlines
- Think: premium annual report, tech keynote deck — bold, tech-forward, confident
- NO solid color fills, NO gradients on illustrations — pure line art with red accents

LAYOUT:
- Cards: white background, thin RED left border, completely FLAT — no shadow, no rounded corners
- 0.5 inch minimum margins. Clean spacing.
- Bold corporate aesthetic. Bold, tech-forward, confident.`;

const STYLE_COVER = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Deep black to dark charcoal. Premium, bold, tech-forward.

TYPOGRAPHY RULES:
- English: geometric sans-serif, Chinese: clean sans-serif
- Title: very large, bold, pure white, center-aligned
- Subtitle: medium size, light weight, warm gold color
- ALL TEXT IN CHINESE except proper nouns.
- Do NOT repeat English translations.

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text on the slide
- NEVER show font sizes, hex codes, pixel dimensions anywhere

ILLUSTRATION STYLE:
- LARGE detailed WIREFRAME illustration at 15-20% opacity as atmospheric background
- Interconnected nodes, network patterns, petal/flower geometric motifs — all in wireframe line art
- Red accent lines on key nodes, white/gray lines for the rest
- Circuit board traces, connected device silhouettes
- Elegant, bold — like a premium tech keynote cover`;

const STYLE_DATA = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Very light warm gray to white. Clean, corporate, institutional.

TYPOGRAPHY RULES:
- English: geometric sans-serif, Chinese: clean sans-serif
- Title: bold, large, deep black, top-left aligned
- Table headers: bold, white text on bold red background
- Table body: light weight, medium gray
- Stat numbers: geometric sans-serif bold, very large, bold red or deep black
- ALL TEXT IN CHINESE except proper nouns and technical terms.
- Do NOT repeat English translations.

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text
- NEVER show font sizes, hex codes, pixel dimensions

DATA DISPLAY:
- Tables: clean borders, alternating white/light gray rows, RED header row
- Stat callouts: large numbers with small labels below
- Cards with thin red left border, completely FLAT — no shadow

ILLUSTRATION STYLE:
Even data slides need PROMINENT WIREFRAME illustrations — detailed line art with red accents.`;

const STYLE_SECTION = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Deep black to very dark charcoal. A subtle red gradient strip across the lower third at 15% opacity.

TYPOGRAPHY RULES:
- Part number: medium size, warm gold color, above the title
- Section title: very large, bold, pure white
- Section subtitle: medium, lighter weight, semi-transparent white
- ALL TEXT IN CHINESE except proper nouns.

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text

ILLUSTRATION STYLE:
- Abstract wireframe network in dark gray at 10% opacity as texture
- Red accent nodes scattered across the network
- Minimal, commanding, like a premium keynote section divider
- NO content — pure atmospheric visual with just the title text`;

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
