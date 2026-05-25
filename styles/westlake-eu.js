// Westlake EU style — Bold Red meets EU Blue
// Primary: EU Blue #003399, Bold Red #C7000B, Azure #4A90D9, Gold #D4A843
// Background: Clean white/light, EU blue accents on section dividers

const STYLE_NORMAL = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Clean white to very light warm gray gradient. Professional, institutional, premium. Subtle watermark: faint geometric pattern inspired by European architecture (Bauhaus clean lines, Dutch De Stijl grid) at 3-5% opacity.

TYPOGRAPHY RULES:
- English text: use Manrope font (geometric, modern, rounded sans-serif)
- Chinese text: use Open Sans Simplified Chinese (思源黑体风格, clean sans-serif)
- Slide titles: bold, large, deep dark blue-gray, top-left aligned
- Section headers: bold, medium size, deep blue
- Body text: light weight, medium gray, left-aligned
- Large stat numbers: geometric sans-serif bold, very large, EU blue or bold red
- ALL TEXT IN CHINESE. English only for proper nouns, acronyms, and technical terms like API, Android, OHOS, Flutter, Skia, ART, JNI, MicroG, Oniro, Makepad, Rust, etc.
- Do NOT repeat English translations of Chinese text.

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text
- NEVER show font sizes, hex codes, pixel dimensions, or CSS-like notation on the slide
- If you see instructions like "bold" or "blue accent", apply them visually — do NOT print them as text
- NO PAGE NUMBERS anywhere on the slide

ILLUSTRATION STYLE:
Every slide MUST have LARGE, DETAILED WIREFRAME illustrations:
- WIREFRAME LINE ART style — clean outlines, no solid fills, no photo-realism
- Line color: deep blue-gray to warm charcoal, line weight about 1.5-2px
- TWO ACCENT COLORS: EU blue highlights on European/global elements, bold red highlights on tech/engine elements
- Illustrations should be LARGE SCENE COMPOSITIONS occupying about 35-40% of the slide
- Mix of tech elements (circuit traces, server racks, API nodes) and cultural elements (West Lake bridge silhouette, European landmarks as abstract wireframes, tulip/windmill geometric hints)
- Clean, premium, institutional — like an EU Commission tech report meets premium annual report
- NO solid color fills, NO gradients on illustrations — pure line art with blue and red accents

LAYOUT:
- Cards: white background, thin left border in EU blue or bold red, completely FLAT — no shadow, no rounded corners
- Tables: clean borders, alternating white/very-light-blue rows, EU blue header row
- 0.5 inch minimum margins. Clean spacing.
- Dual-accent aesthetic: red for tech/engine, blue for strategy/Europe.`;

const STYLE_COVER = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Rich gradient from deep EU blue at top to warm dark blue-charcoal at bottom. Premium, confident, international.

TYPOGRAPHY RULES:
- English: Manrope (geometric rounded sans-serif), Chinese: Open Sans SC (思源黑体风格)
- Title: very large, bold, pure white, center-aligned
- Subtitle: medium size, light weight, warm gold color
- ALL TEXT IN CHINESE except proper nouns.

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text on the slide
- NO PAGE NUMBERS

ILLUSTRATION STYLE:
- LARGE detailed WIREFRAME illustration at 15-20% opacity as atmospheric background
- West Lake bridge silhouette as central motif — abstract, geometric, not realistic
- Interconnected network nodes flowing across the bridge
- EU blue accent on one side, red accent on the other — bridging two worlds
- European architectural wireframe hints (arches, clean geometry) blended with tech elements
- Elegant, bold, international`;

const STYLE_DATA = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Very light warm gray to white. Clean, corporate, institutional.

TYPOGRAPHY RULES:
- English: Manrope (geometric rounded sans-serif), Chinese: Open Sans SC (思源黑体风格)
- Title: bold, large, deep blue-gray, top-left aligned
- Table headers: bold, white text on EU blue background
- Table body: light weight, medium gray
- Stat numbers: geometric sans-serif bold, very large, EU blue or bold red
- ALL TEXT IN CHINESE except proper nouns and technical terms.

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text
- NEVER show font sizes, hex codes, pixel dimensions
- NO PAGE NUMBERS

DATA DISPLAY:
- Tables: clean borders, alternating white/light blue rows, EU BLUE header row (not red)
- Stat callouts: large numbers with small labels below
- Cards with thin EU blue or red left border, completely FLAT
- Comparison: Octos/tech items in red accent, Europe/strategy items in blue accent

ILLUSTRATION STYLE:
Even data slides need PROMINENT WIREFRAME illustrations — tech diagrams with blue and red dual accents.`;

const STYLE_SECTION = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Soft gradient from EU blue to lighter azure blue. NOT dark/black — bright, confident European blue. Like looking at a clear Mediterranean sky.

TYPOGRAPHY RULES:
- Part number: medium size, warm gold color, above the title
- Section title: very large, bold, pure white
- Section subtitle: medium, lighter weight, semi-transparent white
- ALL TEXT IN CHINESE except proper nouns.

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text
- NO PAGE NUMBERS

ILLUSTRATION STYLE:
- Abstract wireframe scene at 10-15% opacity — blend of West Lake elements (bridge, pagoda, water ripple) and European elements (EU star ring, clean Bauhaus geometry, windmill)
- Warm gold accent stars or nodes scattered
- Bright, optimistic, international — NOT dark, NOT moody
- Like an EU Horizon Europe program cover — clean, blue, forward-looking`;

const styles = { normal: STYLE_NORMAL, cover: STYLE_COVER, data: STYLE_DATA, section: STYLE_SECTION };
function getStyle(tag) { return styles[tag] || STYLE_NORMAL; }
module.exports = { styles, getStyle, STYLE_NORMAL, STYLE_COVER, STYLE_DATA, STYLE_SECTION };
