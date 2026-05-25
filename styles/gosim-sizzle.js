// GOSIM Paris 2026 — Master Stage Sizzle Reel style module.
// 9 hero scenes, three-act emotional arc:
//   Act I (dark, tense)   — challenges, AI duality
//   Act II (bright, clean) — value, harness, factory
//   Act III (warm, golden) — collaboration, GOSIM
//
// Image styles: act1-dark, act2-bright, act3-warm
// Anim styles : tense, hopeful, clean, inspiring

// ---------- IMAGE STYLES ----------

const STYLE_ACT1 = `Cinematic editorial still frame, 16:9 widescreen, photographic realism with subtle painterly grading. Resolution and detail of a high-end documentary or feature-film opening shot.

MOOD — ACT I (CHALLENGES):
- Tense, contemplative, slightly anxious. The "we are at a crossroads" feeling.
- Desaturated palette: deep teal, charcoal, slate gray, dim white. Selective amber/red accents only on critical focal points (warning lights, alert glows, single highlight zones).
- Strong directional light — single light source from one side, deep shadows on the other. High contrast.
- Atmospheric haze, soft volumetric light shafts, subtle film grain.

COMPOSITION:
- Wide cinematic framing. Negative space matters — leave room around the subject.
- Eye-level or slightly low angle. No drone shots in this act.
- The visual carries TENSION and AMBIGUITY. The viewer should feel that something important is being asked, but not yet answered.

CRITICAL RULES:
- DO NOT render any text, words, headlines, captions, watermarks, logos, UI labels, numbers, or letters anywhere in the image. Pure visuals only. Leave any "headline" space empty.
- Photographic realism, NOT illustration, NOT 3D render. Should look like a still from a $50M-budget tech documentary.
- No clichés: no glowing brain icons, no robot-shaking-hands-with-human, no binary code waterfalls. We want grounded, real-world imagery with subtle technological elements.`;

const STYLE_ACT2 = `Cinematic editorial still frame, 16:9 widescreen. Clean, modern, optimistic. Architectural visualization quality crossed with documentary photography.

MOOD — ACT II (VALUE):
- Confident, clear, forward-moving. The "we have answers, here is how it works" feeling.
- Brighter palette: cool whites, soft blues (#3B82F6 family), teals (#14B8A6 family), warm accent gold (#F59E0B) used sparingly. Clean and modern.
- Even, diffuse lighting like a high-end product shoot or architectural render. Subtle ambient occlusion. Crisp edges.
- Slight depth of field. Smooth gradients. Premium tech aesthetic.

COMPOSITION:
- Confident framing. Subject clearly placed, environment supports it.
- Diagrammatic clarity when showing systems — but rendered as physical/spatial scenes, not flat infographics.
- Symmetry or thirds. Stable, balanced.

CRITICAL RULES:
- DO NOT render any text, words, headlines, captions, watermarks, logos, UI labels, numbers, or letters anywhere in the image. Pure visuals only.
- Photographic or rendered-architectural quality. Premium consulting / Apple-keynote aesthetic.
- Avoid overused tech tropes: no holographic cubes floating in dark rooms, no stock-photo CEOs in suits, no cliché "AI brain" visuals.`;

const STYLE_ACT3 = `Cinematic editorial still frame, 16:9 widescreen. Warm, expansive, inspiring. The "golden hour" feeling — light, hope, gathering, possibility.

MOOD — ACT III (COLLABORATION & FUTURE):
- Inspiring, generous, communal. The "we build this together" feeling.
- Warm palette: golden hour amber, soft peach, dawn rose, deep blue sky. Rich saturation.
- Long warm light, low sun, soft golden glow. Atmospheric depth — slight haze, light bloom on highlights.
- Cinematic anamorphic feel. Slight lens flare on key highlights is acceptable.

COMPOSITION:
- Wide, expansive. Aerial or elevated wide shots are encouraged here.
- Many people, many places, many connections. Sense of scale.
- Camera tends to pull back, sky tends to open up.

CRITICAL RULES:
- DO NOT render any text, words, headlines, captions, watermarks, logos, UI labels, numbers, or letters anywhere in the image. Pure visuals only.
- Photographic realism with cinematic grading. Should feel like the closing shot of an inspiring documentary.
- Avoid: flag-waving, overt propaganda imagery, kitschy "diverse hands together" stock-photo clichés.`;

const styles = {
  "act1-dark": STYLE_ACT1,
  "act2-bright": STYLE_ACT2,
  "act3-warm": STYLE_ACT3,
};

function getStyle(tag) {
  return styles[tag] || styles["act1-dark"];
}

// ---------- ANIMATION STYLES (for Veo image-to-video) ----------

const ANIM_TENSE = `Subtle cinematic motion. Slow camera push-in (very gentle, ~5% zoom over the clip). Atmospheric particles drift slowly — dust motes in light shafts, faint smoke or haze moving laterally. Any human figures shift weight subtly, blink, breathe. Any screens or indicators flicker gently. Tense, contemplative pace. Keep the photographic realism — DO NOT change to cartoon, anime, or 3D render style. Camera move is minimal.`;

const ANIM_HOPEFUL = `Gentle warm motion. Slow push-in or slight upward tilt. Soft light shifts — sun moving subtly behind clouds, warm light filtering through. Any people present make small natural gestures (nod, hand movement, slight smile). Hair and fabric move very gently in a soft breeze. Hopeful, calm pace. Keep the photographic realism — DO NOT change art style. Camera move is minimal.`;

const ANIM_CLEAN = `Smooth modern motion. Slow orbit or parallax shift around the subject (~10° at most). If diagrammatic elements are present, they assemble or pulse subtly with light. Particles or light traces flow along connection lines. Clean, confident pace. Crisp focus throughout. Keep the architectural-render quality — DO NOT change to cartoon or stylized. Camera move is smooth and controlled.`;

const ANIM_INSPIRING = `Cinematic uplift motion. Slow aerial pull-back or rising crane move revealing more of the scene. Golden hour light shifts over the clip — sun moving, warm rays sweeping across. Any people walk or move naturally with quiet purpose. Distant scale elements (skyline, crowd) animate subtly. Inspiring, building, expansive pace. Keep the photographic realism — DO NOT change art style. Camera move is graceful and revealing.`;

const animStyles = {
  tense: ANIM_TENSE,
  hopeful: ANIM_HOPEFUL,
  clean: ANIM_CLEAN,
  inspiring: ANIM_INSPIRING,
};

function getAnimPrompt(tag, sceneDesc) {
  const base = animStyles[tag] || animStyles.tense;
  if (!sceneDesc) return base;
  return base + "\n\nScene-specific motion: " + sceneDesc;
}

module.exports = {
  styles, getStyle,
  animStyles, getAnimPrompt,
  STYLE_ACT1, STYLE_ACT2, STYLE_ACT3,
  ANIM_TENSE, ANIM_HOPEFUL, ANIM_CLEAN, ANIM_INSPIRING,
};
