// 班规主题 — 清新明亮，可爱卡通学生风格
// Fresh pastel classroom style with cute cartoon students

const STYLE_COVER = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: Soft gradient from light sky blue (#E3F2FD) at top to mint green (#E8F5E9) at bottom. Subtle paper texture overlay.

ILLUSTRATION STYLE (CRITICAL):
- Cute, round-headed cartoon children (similar to Japanese kawaii school illustrations)
- Simple line art with soft pastel fills: sky blue, mint green, warm peach, soft yellow
- Characters have dot eyes, rosy cheeks, wearing school uniforms
- Friendly, warm, inviting — like a children's picture book
- Scattered small decorative elements: stars, hearts, music notes, pencils, books
- Clean vector-style illustration, NOT photorealistic
- Cheerful classroom atmosphere with desks, chalkboard, plants

LAYOUT: Leave the LEFT 55% of the slide mostly clean (for title text overlay). Place main illustration cluster on the RIGHT 45%. Keep a clean horizontal band across the upper-center for title placement.

CRITICAL: Do NOT render any text. Pure illustration only. Leave clean space for text overlays.`;

const STYLE_CONTENT = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: Very light warm cream (#FFFDF7) with subtle soft blue (#E8F4FD) gradient at edges. Clean and airy.

ILLUSTRATION STYLE (CRITICAL):
- Small cute cartoon accent illustrations — NOT the main focus
- Tiny cartoon students, school items (pencils, books, stars, checkmarks) as decorative corner elements
- Soft pastel color palette: sky blue (#89CFF0), mint (#98D8C8), peach (#FFDAB9), lavender (#E6E6FA), warm yellow (#FFF3CD)
- Rounded rectangle content areas with very subtle pastel fills and thin borders
- Clean, organized layout feel — like a well-designed school handout
- Small icons in pastel circles as bullet markers

LAYOUT: Leave generous clean space for text. Place small decorative illustrations in corners or margins only. The slide should feel 80% clean space, 20% decoration.

CRITICAL: Do NOT render any text, words, labels, or numbers. Pure visual decoration only.`;

const STYLE_TABLE = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: Very light cream (#FFFDF7). Clean and minimal.

ILLUSTRATION STYLE (CRITICAL):
- Minimal decoration — this is a data/table slide
- Soft pastel colored bands for table rows: alternating light blue (#EBF5FB) and white
- Rounded rectangle table frame with soft shadow
- Small cute icons in the header area only: a student icon, a checkmark, a star
- Very subtle school-themed border decoration (pencils, rulers) at the bottom edge only
- Soft pastel palette throughout

LAYOUT: Large clean central area for a table. Thin decorative border at top and bottom edges. Leave 85% of slide as clean structured space.

CRITICAL: Do NOT render any text. Pure visual structure only.`;

const STYLE_END = `Create a presentation slide image. 1920x1080 pixels, 16:9 landscape format.

BACKGROUND: Warm gradient from soft peach (#FFE5D0) at top to light sky blue (#E3F2FD) at bottom. Soft, warm, celebratory.

ILLUSTRATION STYLE (CRITICAL):
- Central cute cartoon scene: group of happy cartoon students with arms raised, celebrating together
- Round-headed characters with rosy cheeks, big smiles, school uniforms
- Scattered confetti, stars, hearts floating around them
- Warm, positive, uplifting mood — "we can do this together!"
- Soft pastel colors: peach, sky blue, mint, lavender, warm yellow
- Clean vector-style, children's book quality

LAYOUT: Place the illustration group in the LOWER 60% of the slide. Leave the TOP 40% clean for closing text. Center composition.

CRITICAL: Do NOT render any text. Pure illustration only.`;

const styles = {
  cover: STYLE_COVER,
  content: STYLE_CONTENT,
  table: STYLE_TABLE,
  end: STYLE_END,
};

function getStyle(tag) {
  return styles[tag] || styles.content;
}

module.exports = { styles, getStyle, STYLE_COVER, STYLE_CONTENT, STYLE_TABLE, STYLE_END };
