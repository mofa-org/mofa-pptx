// Video Card style — animates static greeting cards into short videos with BGM
// Pipeline: static PNG → Gemini Veo animation → ffmpeg compositing → MP4
//
// Animation tags: shuimo (水墨), festive (喜庆), gentle (温柔), dynamic (动感)

const path = require("path");

const DEFAULT_BGM = path.join(__dirname, "..", "bgm-cny.mp3");

// --- Animation prompt templates (for Gemini Veo image-to-video) ---

const ANIM_SHUIMO = `Gentle animation of a Chinese ink wash painting. Subtle natural movements: leaves swaying gently in the breeze, steam rising slowly from tea cups, clouds drifting lazily across the sky, water rippling softly. Keep the ink wash painting style throughout — do NOT change the art style. Slow, peaceful, meditative motion. Camera stays still.`;

const ANIM_FESTIVE = `Festive animation of a Chinese painting. Cheerful subtle movements: lanterns swaying gently, firecrackers sparkling, plum blossoms fluttering down, steam rising from food, people gesturing warmly. Keep the original art style throughout — do NOT change to photorealistic. Lively but not chaotic motion. Camera stays still.`;

const ANIM_GENTLE = `Gentle, dreamy animation. Very subtle movements: hair and clothes swaying slightly in a soft breeze, petals drifting slowly, light flickering gently, soft particle effects like dust motes in sunlight. Keep the original art style throughout. Extremely slow, calming motion. Camera stays still.`;

const ANIM_DYNAMIC = `Lively animation of a painting scene. Noticeable movements: characters gesturing and interacting, animals moving naturally, water flowing, wind blowing through trees, birds flying in the background. Keep the original art style throughout — do NOT change to photorealistic. Moderate pace, energetic but graceful. Camera stays still.`;

const animStyles = {
  shuimo: ANIM_SHUIMO,
  festive: ANIM_FESTIVE,
  gentle: ANIM_GENTLE,
  dynamic: ANIM_DYNAMIC,
};

/**
 * Get animation prompt for Veo.
 * @param {string} tag - Animation style tag
 * @param {string} [sceneDesc] - Optional scene-specific description to append
 * @returns {string} Full animation prompt
 */
function getAnimPrompt(tag, sceneDesc) {
  const base = animStyles[tag] || animStyles.shuimo;
  if (!sceneDesc) return base;
  return base + "\n\nScene details: " + sceneDesc;
}

// --- Compositing config ---

const DEFAULT_CONFIG = {
  stillDuration: 2,     // seconds to hold original image at start
  crossfadeDur: 1,      // crossfade between still and animation
  fadeOutDur: 1.5,      // fade out at end
  musicVolume: 0.3,     // BGM volume (0-1)
  musicFadeIn: 2,       // music fade in duration (seconds)
  bgmPath: DEFAULT_BGM, // default background music
};

module.exports = {
  animStyles,
  getAnimPrompt,
  DEFAULT_CONFIG,
  DEFAULT_BGM,
  ANIM_SHUIMO,
  ANIM_FESTIVE,
  ANIM_GENTLE,
  ANIM_DYNAMIC,
};
