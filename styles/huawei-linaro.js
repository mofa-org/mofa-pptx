// Huawei Linaro — Huawei corporate red-bar executive briefing style

const STYLE_NORMAL = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

BACKGROUND: Clean white (#FFFFFF) background.

HEADER: A bold red (#CE0E2D) horizontal bar at the TOP of the slide, spanning full width, approximately 80-90px tall. The slide title goes INSIDE this red bar in WHITE BOLD text, LEFT-ALIGNED with ~40px left padding. Title font size EXACTLY 28pt bold.

COLOR SCHEME — Huawei corporate style:
- Primary Red: #CE0E2D (headers, key stats, emphasis, borders of important boxes)
- Black: #000000 (main body text)
- Dark Gray: #333333 (secondary text)
- Light Gray: #F5F5F5 (box backgrounds, alternating rows)
- White: #FFFFFF (slide background, text on red)
- Accent Red: #E60012 (for highlights, arrows, urgent items)

TYPOGRAPHY (STRICT):
- ALL Chinese text MUST use 微软雅黑 (Microsoft YaHei) font. No exceptions.
- ALL English text MUST also use Microsoft YaHei or a clean sans-serif like Arial. No exceptions.
- Title: 28pt bold white on red bar, LEFT-ALIGNED.
- Body text: 14-16pt regular, black (#000000).
- Key stats/numbers: 24-32pt bold, red (#CE0E2D).
- Labels/captions: 12pt, dark gray (#333333).

LAYOUT RULES (CRITICAL):
- DENSE, INFORMATION-PACKED. Every pixel should carry information.
- Content organized in COLORED BOXES/CARDS arranged in tight grids.
- Boxes have thin borders (1px #CCCCCC or #CE0E2D for emphasis).
- Use alternating white/light-gray (#F5F5F5) for rows and sections.
- NO wasted white space. Executive briefing style.
- NO decorative elements, NO artistic flourishes, NO watermarks, NO illustrations.
- NO page numbers.
- Pure CORPORATE DATA PRESENTATION. Think Huawei internal strategy deck.

CRITICAL: This is a Huawei-style executive briefing. Bold, direct, data-rich, red-and-black corporate aesthetic. Information density is paramount.`;

const styles = {
  normal: STYLE_NORMAL,
};

function getStyle(tag) {
  return styles[tag] || styles.normal;
}

module.exports = {
  styles, getStyle,
  STYLE_NORMAL,
};
