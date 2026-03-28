// Ocean Tech style — Octos mascot palette
// Pastel, friendly, flat design — cute but tech-dense
// Primary: Soft Teal #8EDDD6, Blue #7BB8D4, Coral #F4A98B, Yellow #F0D06B
// Background: Light mint-white, soft aquamarine gradients

const STYLE_NORMAL = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Very light mint-white to soft aquamarine gradient. Airy, bright, clean — like sunlit shallow tropical ocean water. Subtle underwater caustic light patterns at very low opacity (3-5%). Warm and inviting.

TYPOGRAPHY RULES:
- Titles: bold, large, dark teal-gray (NOT black, use warm dark teal), top-left aligned
- Section headers: bold, medium, dark teal
- Body text: medium weight, warm dark gray, left-aligned
- Stat numbers: very large, bold, soft teal or coral-salmon
- ALL TEXT IN ENGLISH.
- Rounded, friendly sans-serif font throughout (like Nunito, Quicksand, or Poppins style)

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text
- NEVER show font sizes, hex codes, pixel dimensions, or CSS-like notation on the slide
- If you see instructions like "bold" or "teal accent", apply them visually — do NOT print them as text
- NO PAGE NUMBERS anywhere on the slide

ILLUSTRATION STYLE — OCTOS MASCOT STYLE:
Every slide MUST have LARGE, CHARMING illustrations in the OCTOS MASCOT style:
- Cute, FLAT DESIGN sea creatures — soft pastel colors, NO outlines or minimal thin outlines
- The octopus character: round soft teal-cyan body, big friendly eyes, multicolored tentacles (teal, blue, coral-salmon, warm yellow)
- Other sea creatures in the same flat pastel style: jellyfish, seahorses, tropical fish, coral, starfish, sea turtles
- These cute creatures ARE tech elements — an octopus whose tentacles are API connections, a jellyfish that is a network node, coral that is a server rack, fish that are data packets
- Color palette MUST match: soft teal-cyan, sky blue, coral-salmon, warm yellow, mint green — ALL PASTEL, all friendly
- NO dark/cyberpunk/Blade Runner aesthetic. NO wireframes. NO hard edges.
- Think: Duolingo meets Notion meets Finding Nemo's coral reef scenes
- Cute AND technically meaningful — adorable creatures that clearly represent tech concepts
- Flat color fills, minimal shadows (soft drop shadow at most), rounded shapes everywhere

LAYOUT:
- Cards: white or very light teal backgrounds, thin rounded borders in soft teal or coral, gentle shadow
- Tables: white backgrounds, soft teal header rows, alternating white/very-light-mint rows
- 0.5 inch minimum margins. Generous spacing. Breathable.
- Overall feel: a beautiful children's science book about technology — approachable, warm, information-dense but never intimidating`;

const STYLE_COVER = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Soft gradient from light aquamarine at top to warm sandy-peach at bottom — like looking through tropical shallow water toward a sandy bottom. Bright, warm, inviting.

TYPOGRAPHY RULES:
- Title: very large, bold, dark teal, center-aligned
- Subtitle: medium, coral-salmon color
- ALL TEXT IN ENGLISH.

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text
- NO PAGE NUMBERS

ILLUSTRATION STYLE — OCTOS MASCOT STYLE:
- A LARGE, ADORABLE octopus in the exact style of the Octos mascot: round soft teal-cyan body, big friendly circular eyes with a warm smile, 8 multicolored tentacles in teal, blue, coral-salmon, and warm yellow
- FLAT DESIGN — solid pastel color fills, no gradients on the character, no outlines or very thin soft outlines only
- The octopus is CUTE and FRIENDLY — like a mascot character, not realistic
- Other sea creatures in the same flat pastel style swimming around: tropical fish, jellyfish, seahorses
- Coral reef at the bottom in pastel colors — soft pinks, lavenders, mint greens
- Floating bubbles and small particles of light
- NOT dark, NOT cyberpunk, NOT realistic — think: a high-quality app illustration or children's science book cover
- The overall feeling should be warm, smart, and delightful`;

const STYLE_DATA = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Clean white to very light mint-aqua. Bright, data-focused, professional but friendly.

TYPOGRAPHY RULES:
- Title: bold, large, dark teal, top-left aligned
- Table headers: bold, white text on soft teal background (rounded corners on header row)
- Table body: medium weight, warm dark gray
- Stat numbers: very large, bold, soft teal or coral-salmon
- ALL TEXT IN ENGLISH.
- Rounded friendly sans-serif font

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text
- NEVER show font sizes, hex codes, pixel dimensions
- NO PAGE NUMBERS

DATA DISPLAY:
- Tables: white cards with soft rounded borders, teal header rows with rounded top corners, alternating white/very-light-mint rows
- Comparison columns: Octos column accent in soft teal, OpenClaw column accent in coral-salmon
- Stat callouts: large pastel-colored numbers with small labels
- Cards: white with thin rounded teal or coral borders, subtle soft shadow

ILLUSTRATION STYLE — OCTOS MASCOT STYLE:
- Even data slides need CUTE PASTEL illustrations — flat design sea creatures as data visualization elements
- Small octopus mascot characters peeking from corners or margins
- Comparison slides: cute octopus (teal, 8 arms) vs cute lobster (coral, 2 claws) — both in flat pastel style
- Bar charts that look like coral growing from the seafloor
- Pastel color palette only: teal, blue, coral, yellow, mint — nothing dark or harsh`;

const STYLE_SECTION = `Create a presentation slide image. 3840×2160 pixels, 16:9 landscape format. HIGH RESOLUTION 4K.

BACKGROUND: Soft gradient — warm aquamarine to light teal-blue. Like looking up from underwater toward the bright surface. Warm, bright, expansive.

TYPOGRAPHY RULES:
- Category label: medium, coral-salmon, above title
- Section title: very large, bold, dark teal, center-aligned
- Section subtitle: medium, soft blue, below title
- ALL TEXT IN ENGLISH.

CRITICAL — NO PROMPT LEAK:
- NEVER render formatting instructions as visible text
- NO PAGE NUMBERS

ILLUSTRATION STYLE — OCTOS MASCOT STYLE:
- A large SCENE ILLUSTRATION in flat pastel style filling much of the background at low opacity
- Cute sea creatures in formation — a school of pastel fish, a friendly octopus, swaying coral
- Soft light rays coming from above (the surface)
- Everything in the Octos mascot color palette: soft teal, sky blue, coral-salmon, warm yellow
- Flat design, minimal shadows, rounded shapes
- Warm, inviting, like a chapter opening in a beautiful illustrated book
- NOT dark, NOT moody — bright and optimistic`;

const styles = { normal: STYLE_NORMAL, cover: STYLE_COVER, data: STYLE_DATA, section: STYLE_SECTION };
function getStyle(tag) { return styles[tag] || STYLE_NORMAL; }
module.exports = { styles, getStyle, STYLE_NORMAL, STYLE_COVER, STYLE_DATA, STYLE_SECTION };
