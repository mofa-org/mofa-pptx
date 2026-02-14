const PptxGenJS = require("pptxgenjs");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const SLIDE_DIR = "slides-tea-camp-v2";
const SW = 13.333, SH = 7.5;

// =======================================================================
// STYLE A: Full-scene illustration dominant (cover, emotional moments)
// =======================================================================
const STYLE_SCENE = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

ART STYLE (CRITICAL — this is the MOST important instruction):
Feng Zikai (丰子恺) painting style. This is a SPECIFIC Chinese art tradition:
- Very simple, minimal brush strokes — just a few lines to suggest a figure
- Round-headed children with dot eyes and no detailed facial features
- Adults drawn with slightly more detail but still extremely minimal
- Light color washes: pale pink, soft amber, gentle green, muted blue — like watercolor thinned to 20-30% opacity
- Black or dark brown ink outlines, confident single brush strokes, never sketchy or tentative
- LOTS of empty white/cream space (留白) — at least 40% of the image should be blank
- Compositions feel like a page from a children's picture book or a scroll painting
- Warm, nostalgic, innocent, gentle — capturing everyday family moments
- Often includes a short line of calligraphic Chinese text as part of the painting (NOT separate)
- Objects are simplified to their essence: a teapot is just a round body + spout + handle in 3 strokes
- Mountains are 2-3 ink wash strokes suggesting misty peaks
- Tea bushes are simple curved lines with a few leaf shapes
- NO photorealism, NO digital art, NO detailed rendering — this must look HAND-PAINTED with brush and ink on rice paper

BACKGROUND: Warm off-white (#FFF8F0), like aged Chinese rice paper. Subtle paper texture. NO gradients, NO patterns.

TYPOGRAPHY: Noto Serif SC for any text overlays. ALL TEXT IN CHINESE ONLY. NO English anywhere.
- Title text: 700 weight, warm charcoal #3C3226
- Body text: 300 weight, warm gray #6B5E50
- Text should feel like handwritten annotations on a painting, not corporate text boxes

CRITICAL: This must look like an actual Feng Zikai painting — minimal, warm, with the naive charm of a master who draws with deliberate simplicity. Think of it as a painting first, a slide second.`;

// =======================================================================
// STYLE B: Text-forward with small illustrations (content, data slides)
// =======================================================================
const STYLE_CONTENT = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

ART STYLE (CRITICAL):
Feng Zikai (丰子恺) painting style applied to an informational layout:
- Small ink-wash illustrations as accent elements (NOT the main focus)
- Simple brush-stroke icons: teapot, cup, child figure, steam wisps, tea leaves, mountain silhouette
- Light color wash backgrounds for content areas: very pale amber (#FFF5E8), pale green (#F0F7ED), soft pink (#FFF0F0), pale blue (#F0F5FF)
- All illustrations are Feng Zikai style: minimal lines, round-headed figures, simplified objects
- Hand-painted feel throughout — even dividers and borders should look like single brush strokes, not clean geometric lines

BACKGROUND: Warm off-white (#FFF8F0), rice paper texture. Clean, airy.

TYPOGRAPHY: Noto Serif SC for headers, Noto Sans SC for body. ALL TEXT IN CHINESE ONLY. NO English anywhere.
- Section headers: 700 weight, 24-28pt, warm charcoal #3C3226
- Body: 300 weight, 16-18pt, warm gray #5D4E37
- Accent text/stats: 700 weight, soft ink black #2C2C2C or amber #B8860B
- Key quotes in calligraphic style, integrated with illustrations

LAYOUT: Generous whitespace. Content areas use very subtle pale color washes instead of hard-edged cards. NO corporate card borders — instead, group content with color washes and brush-stroke dividers. Each content area should breathe.

CRITICAL: This is NOT a corporate slide. It should feel like an illustrated page from a warm family guidebook, with Feng Zikai's gentle hand visible in every element.`;

// =======================================================================
// STYLE C: Quote/emotional (for philosophical moments)
// =======================================================================
const STYLE_EMOTION = `Create a presentation slide image. 1920×1080 pixels, 16:9 landscape format.

ART STYLE (CRITICAL):
Feng Zikai (丰子恺) painting at its most poetic and minimal:
- ONE central illustration, very simple, occupying about 30-40% of the space
- Surrounding empty space is PART of the composition — it conveys tranquility
- The illustration captures a single warm moment: a hand pouring tea, a child looking up, steam rising, a mountain path
- Light, almost transparent color wash — just a hint of amber or pink
- One or two lines of calligraphic text integrated INTO the painting composition
- This should feel like the most beautiful page in a Feng Zikai art book

BACKGROUND: Warm cream (#FFFAF2), pristine, like high-quality rice paper.

TYPOGRAPHY: Noto Serif SC, integrated with the painting. ALL TEXT IN CHINESE ONLY. NO English anywhere.
- Quote text: 700 weight, 28-36pt, warm charcoal #3C3226
- Attribution/subtitle: 300 weight, 16pt, warm gray #8B7D6B

CRITICAL: Extreme minimalism. Every brush stroke must earn its place. This is meditation in visual form.`;

// =======================================================================
// SLIDE PROMPTS
// =======================================================================
const slides = [

// === SLIDE 1: 封面 =====================================================
{
  style: "scene",
  prompt: `A Feng Zikai painting covering the full slide.

Scene: A group of round-headed children (ages 9-15, different heights) walking along a winding mountain tea path toward misty Phoenix Mountain peaks. The tallest child leads, pointing ahead. A small one at the back holds a parent's hand. Tea bushes line the path — drawn as simple curved green wash shapes. The mountain is 2-3 ink wash strokes suggesting misty peaks. A few tiny tea pickers (just dots and strokes) visible on distant slopes.

The scene is drawn with maybe 25-35 brush strokes total. Bodies are simple shapes, faces are circles with dot features. The tea bushes are light green washes. Morning mist is suggested by empty space between mountain layers.

Title text integrated into the composition (upper area, as if brushed by hand):
"寻茶脉" (44pt, bold, charcoal)
Below in smaller text: "3天2夜凤凰单丛非遗研学营" (20pt, light gray)

NO footer. NO page number. NO version. NO date. NO English.
The entire composition should feel like a single painting with title brushed on.`
},

// === SLIDE 2: 研学营总览 ================================================
{
  style: "content",
  prompt: `Layout: FOUR gentle areas arranged in a flowing 2×2 pattern (NOT rigid grid), each with a tiny Feng Zikai illustration.

Top center: "研学营总览" (bold, 32pt, charcoal) with a thin horizontal brush stroke underneath.

── Area 1 (top-left): Very pale amber wash background
Tiny illustration: round-headed children with tea cups, 3-4 brush strokes
"营员规模" (bold, 22pt, amber #B8860B)
"30人（6组×5人）"
"9-15岁青少年 / 亲子家庭组" (small, gray)

── Area 2 (top-right): Very pale green wash
Tiny illustration: a mountain with a tea tree, 3 brush strokes
"研学地点" (bold, 22pt, green #4A7C59)
"潮州凤凰山"
"乌岽山古茶园·海拔1000米+" (small, gray)

── Area 3 (bottom-left): Very pale pink wash
Tiny illustration: three small figures walking together (三人行)
"学习模式" (bold, 22pt, pink #C1567D)
""三人行"小组合作"
"80个协作引导话术·沉浸式学习" (small, gray)

── Area 4 (bottom-right): Very pale blue wash
Tiny illustration: three suns at different heights (dawn, noon, dusk)
"时间安排" (bold, 22pt, warm brown #6B4226)
"3天2夜全流程"
"感官觉醒→工艺探秘→创意表达" (small, gray)

The four areas should feel organic, slightly different sizes, with brush-stroke borders rather than geometric lines. Feng Zikai's hand visible in every small illustration. NO footer, NO page number.`
},

// === SLIDE 3: 三人行合作学习模型 =========================================
{
  style: "scene",
  prompt: `A Feng Zikai painting scene showing the "三人行" learning model.

Scene: Three round-headed children walking on a mountain tea garden path. Each child carries something different:
- First child (observer): holds a small notebook to their chest, looking carefully at a tea bush
- Second child (practitioner): crouches down touching tea leaves with both hands
- Third child (communicator): stands with mouth open, gesturing to the others, clearly explaining something

They are drawn in maybe 20 brush strokes total. Light amber wash on the path, green washes on the tea bushes.

Text integrated into the painting:
Upper area (calligraphic): "三人行，必有我师焉"
Below each figure, small labels:
Left: "观察者" (amber ink)
Center: "操作者" (green ink)
Right: "表达者" (pink ink)

Bottom area, small text: "每个模块角色轮换 — 每个孩子都体验全部三种角色"

Lots of empty space around the scene. The three children form a natural triangle composition.

NO footer. NO page number. NO English.`
},

// === SLIDE 4: 第一天总览 ================================================
{
  style: "content",
  prompt: `Layout: Illustration on the LEFT (35%), content list on the RIGHT (55%).

LEFT side — Feng Zikai illustration:
A steaming gaiwan (lidded tea cup) drawn in 5-6 brush strokes, with five wispy lines of steam rising, each curling differently (representing the five senses). Around the cup, five tiny icons in brush style: an eye, a nose, a tongue, a hand, an ear — each just 2-3 strokes. Light amber wash on the tea.

RIGHT side — content:

"第一天：感官觉醒" (bold, 28pt, warm brown #3C3226)
Below: "从味觉开始认识单丛" (16pt, gray)

Five module areas stacked, each with pale amber wash:

Brush-stroke bullet: "08:30 开营仪式" — 盲品分组·包尽尾之旅
Brush-stroke bullet: "10:00 博物馆探案" — 线索解谜·非遗密码
Brush-stroke bullet: "14:00 茶山冥想" — 自然声景·闭目感知
Brush-stroke bullet: "15:30 小茶品师" — 观·闻·赏·品·察五步法
Brush-stroke bullet: "19:00 香气记忆赛" — 十大香型辨识挑战

Each item has time in bold amber, activity and description in regular. Brush-stroke dividers (single wavy ink lines) between items.

NO footer. NO page number.`
},

// === SLIDE 5: 盲品分组 + 博物馆探案 =====================================
{
  style: "content",
  prompt: `Layout: TWO flowing sections side by side, with a brush-stroke vertical divider in the center.

LEFT section (pale amber wash):
"智慧分组" (bold, 24pt, amber #B8860B)
Tiny Feng Zikai illustration: round-headed children reaching for small tea cups on a bamboo tray, each cup with different colored tea (pale gold, honey, dark amber) — drawn as simple colored circles in cups.

Three content groups with brush-stroke separators:
"盲品分组" (bold, 18pt)
"品尝3款不同单丛，喜好相同者自然组队"

"包尽尾的传说" (bold, 18pt)
"凤凰山茶故事·山水灵气·单丛缘起"

Large stat (calligraphic style): "6组" (36pt, bold, amber) "× 5人" (18pt)

RIGHT section (pale green wash):
"博物馆探案课" (bold, 24pt, green #4A7C59)
Tiny Feng Zikai illustration: a round-headed child holding a magnifying glass over old tea tools

Three content groups:
"线索解谜" (bold, 18pt)
"非遗展馆'密码'—古旧制茶器具的秘密"

"协作引导" (bold, 18pt)
"观察者→绘制线索图 / 操作者→收集证据 / 表达者→陈述推理"

"学习目标" (bold, 18pt)
"从器物理解非遗·培养证据意识"

NO footer. NO page number. The two sections should feel like facing pages of a picture book.`
},

// === SLIDE 6: 茶山冥想 + 五感品茶 ======================================
{
  style: "content",
  prompt: `Layout: TOP section wide, BOTTOM section has FIVE flowing steps.

TOP section (pale blue-gray wash, wide):
Feng Zikai illustration centered: Children sitting cross-legged among tea bushes on a mountain slope, eyes closed, drawn in minimal strokes — round heads, simple bodies, peaceful. Floating around them: a bird (2 strokes), a leaf falling (1 stroke), wind lines. The mountain is a single ink wash in the background.

"茶山冥想：闭目听山" (bold, 24pt, center)
"问自己：这片土地想对你说什么？" (italic, 16pt, warm gray)

BOTTOM section — "小茶品师五步法":
FIVE areas flowing LEFT to RIGHT, each a different pale wash color, connected by thin brush-stroke lines (not arrows):

Step 1 (amber wash): Single brush-painted character "观" in a circle
"观察" (bold) / "汤色透亮度·叶底色泽"

Step 2 (green wash): Character "闻" in a circle
"闻香" (bold) / "干香·湿香·底香三层"

Step 3 (pink wash): Character "赏" in a circle
"赏汤" (bold) / "金黄·蜜绿·橙红色谱"

Step 4 (amber wash): Character "品" in a circle
"品味" (bold) / "入口回甘·舌头韵·山韵"

Step 5 (blue wash): Character "察" in a circle
"察叶" (bold) / "叶缘红印·绿叶红镶边"

Each step character is hand-painted in a brush-stroke circle. NO footer, NO page number.`
},

// === SLIDE 7: 香气记忆大赛 ==============================================
{
  style: "scene",
  prompt: `A playful Feng Zikai scene.

Scene: Round-headed children sitting in a semi-circle around a table with ten small aroma cups. One child (center) closes eyes and leans forward to sniff, face scrunched in concentration — drawn with just a curved line for the nose approaching the cup. Other children watch eagerly. One child raises a hand. A teacher figure stands behind, gently smiling.

Each cup has a different tiny wisp of steam — some swirling (floral), some straight (honey), some curling (fruity). The ten cups are in a gentle arc.

Text integrated into the painting:
Upper area: "晚间香气记忆大赛"
Below the scene: "凤凰单丛十大香型"

In two rows at the bottom, small calligraphic labels for the ten aromas:
"芝兰香 · 桂花香 · 蜂蜜香 · 杨梅香 · 姜花香"
"杨桃香 · 肉桂香 · 谷米香 · 火功香 · 山韵香"

Below: "认全者获封"小茶鼻子"称号" (small, warm brown, italic)

Color: amber wash on the tea cups, pink on the children's cheeks. Lots of empty cream space around the scene.

NO footer. NO page number.`
},

// === SLIDE 8: 第二天总览 ================================================
{
  style: "content",
  prompt: `Layout: Illustration on the LEFT (35%), content list on the RIGHT (55%).

LEFT side — Feng Zikai illustration:
An ancient tea tree with a thick gnarled trunk and spreading canopy — drawn in maybe 8 brush strokes. Dark ink for the trunk, green washes for leaves. A tiny round-headed child stands at the base looking up, dwarfed by the tree. The tree radiates a sense of age. A few birds perch on branches (2 strokes each).

RIGHT side — content:

"第二天：工艺探秘" (bold, 28pt, charcoal)
Below: "从叶到茶的陌生之旅" (16pt, gray)

Four module areas stacked, each with pale green wash:

Brush-stroke bullet: "08:00 古茶园探访" — 乌岽山千米茶园·古树认养
Brush-stroke bullet: "12:00 茶农午餐" — 茶香食谱·山泉泡茶
Brush-stroke bullet: "14:00 制茶工序" — 晒→凉→摇→杀→揉→烘 六步全流程
Brush-stroke bullet: "19:00 匠人对话" — 非遗传承人讲述·十万个为什么

Each item has time in bold green, activity and description in regular. Brush-stroke dividers between items.

NO footer. NO page number.`
},

// === SLIDE 9: 古茶园探访 ================================================
{
  style: "scene",
  prompt: `A Feng Zikai mountain landscape scene.

Scene: A winding mountain path through ancient tea terraces. Round-headed children in a line climbing the path, each at a different height on the slope. The smallest child at the back holds a parent's hand. The lead child touches an ancient tea tree trunk with wonder. Misty mountain peaks in the background — just 2 ink wash strokes suggesting peaks above clouds.

Tea bushes are simple green wash curves lining the terraces. The ancient tree is drawn with more detail — thick gnarled trunk in dark ink, spreading branches.

Text integrated into the painting (upper area):
"古茶园探访"
"乌岽山千米茶园"

Three small annotations scattered in the painting (as if handwritten notes):
"海拔1000米+" (near the mountain peak)
"600年+古茶树" (near the ancient tree)
"80+品种" (near a tea bush)

Color: green washes for vegetation, blue-gray for mountains, amber for the path. Lots of empty cream space for sky and mist.

NO footer. NO page number.`
},

// === SLIDE 10: 茶农午餐 =================================================
{
  style: "scene",
  prompt: `A warm Feng Zikai mealtime scene.

Scene: A rustic wooden table outdoors with a mountain backdrop. A tea farmer couple and several round-headed children sit around it. Simple dishes on the table — drawn as colored circles and ovals: green (vegetable stir-fry), brown (tea-smoked chicken), white (rice). Steam rises from everything. A clay kettle sits to the side. One child reaches across the table for food. The farmer, drawn in 4 strokes (hat, body, arms), pours tea from a small pot.

Light amber wash for the wooden table and warm atmosphere. Green wash for the mountain backdrop. The faces are simple dots and curves.

Text integrated (upper area, calligraphic):
"茶农家午餐"
"山泉与茶香"

Small annotation near the food: "茶熏鸡 · 茶叶小炒 · 山泉泡茶"
Near the bottom: "感受山居生活美学" (small, italic, warm gray)

The warmth of the scene comes from the amber washes and the animated gestures of the children reaching for food. Simple, joyful, family-like.

NO footer. NO page number.`
},

// === SLIDE 11: 制茶工序（前三步）========================================
{
  style: "content",
  prompt: `Layout: THREE flowing content areas arranged VERTICALLY, each with a small Feng Zikai illustration on the left and text on the right.

Top center: "制茶工序：从叶到茶（上）" (bold, 28pt, charcoal) with a thin brush stroke underneath.

── Area 1 (pale amber wash):
Tiny illustration: tea leaves spread on a bamboo tray under a brushstroke sun, 5-6 strokes total
"第一步：晒青" (bold, 22pt, warm brown)
"日光萎凋·叶内水分缓慢散失"
"观察者任务：记录叶片颜色与柔软度变化" (small, gray)

── Area 2 (pale green wash):
Tiny illustration: tea leaves on a round bamboo sieve in shade, cool breeze lines
"第二步：晾凉" (bold, 22pt, green)
"阴凉处摆放·叶片回软·均匀失水"
"操作者任务：触摸叶片，感受柔软度变化" (small, gray)

── Area 3 (pale blue wash):
Tiny illustration: a bamboo drum spinning with leaf shapes tumbling inside, dynamic brush strokes
"第三步：摇青/浪青" (bold, 22pt, deep teal)
"单丛的灵魂工序 — 磨叶缘促发香气物质"
""看青做青"—匠人凭经验判断摇青程度" (small, italic, gray)

The three areas flow like stepping stones. Brush-stroke connections link them. NO footer, NO page number.`
},

// === SLIDE 12: 制茶工序（后三步）========================================
{
  style: "content",
  prompt: `Layout: THREE flowing content areas arranged VERTICALLY, continuing from previous slide.

Top center: "制茶工序：从叶到茶（下）" (bold, 28pt, charcoal)

── Area 1 (pale amber wash, warm):
Tiny illustration: a wok over flame, hands tossing leaves, fire drawn as 3 amber strokes
"第四步：杀青" (bold, 22pt, clay red #A0522D)
"高温制止发酵·锁住香气·火候精准"
"表达者任务：描述火候与叶色的瞬间变化" (small, gray)

── Area 2 (pale green wash):
Tiny illustration: hands rolling tea leaves on a mat, curled leaves visible
"第五步：揉捻" (bold, 22pt, green)
"叶片卷曲成条·细胞破裂释放茶汁"
"操作者任务：亲手尝试揉捻，感受力度控制" (small, gray)

── Area 3 (pale pink-amber wash):
Tiny illustration: bamboo baskets over low charcoal, gentle smoke wisps rising
"第六步：烘焙" (bold, 22pt, clay red #A0522D)
"文火慢烘·发展火功香·可多次复烘"
""北风天，火功足"—单丛的终极风味密码" (small, italic, gray)

Bottom, a warm note: "全流程体验时间约 4 小时 — 非遗传承人全程指导" (centered, bold, 16pt, warm brown)

Brush-stroke connections between the three areas. NO footer, NO page number.`
},

// === SLIDE 13: 匠人对话 ================================================
{
  style: "emotion",
  prompt: `A deeply warm Feng Zikai painting — the most contemplative in the deck.

Scene: An elderly tea master (drawn in 6-7 strokes: round face with wrinkles suggested by 2 short lines, white hair as a bun, thin body in traditional clothes) sits by a small charcoal stove. A group of round-headed children sit in a semicircle before him, drawn as small round shapes at different heights. Between them, a single gaiwan with steam rising in one graceful line.

The master's posture suggests wisdom and patience. One child raises a tiny hand (2 strokes) to ask a question.

Calligraphic text integrated into the painting:
Upper area: "晚间匠人对话"
Near the master: "做茶这件事，悲伤的是没有年轻人愿意学"
Near the children: "十万个为什么"

Below the scene, three questions in small calligraphic text:
"为什么每棵树的茶味都不同？"
"为什么叫'单丛'而不是'多丛'？"
"最难的工序是哪一步？"

Almost no color — just the faintest amber wash on the stove glow and green on the tea. Everything else is ink and warm cream emptiness.

NO footer. NO page number.`
},

// === SLIDE 14: 第三天总览 ================================================
{
  style: "content",
  prompt: `Layout: Illustration on the LEFT (35%), content list on the RIGHT (55%).

LEFT side — Feng Zikai illustration:
An elegant tea ceremony setup — a small round table with a gaiwan, fairness cup, and three tiny cups. An orchid branch in a slim vase beside it. The whole setup is drawn in maybe 10 brush strokes. Light pink and amber washes. A round-headed child sits at the table, carefully pouring tea with both hands — the picture of concentration.

RIGHT side — content:

"第三天：创意表达" (bold, 28pt, charcoal)
Below: "从学习者到传播者" (16pt, gray)

Four module areas stacked, each with pale pink wash:

Brush-stroke bullet: "07:00 晨间冥想" — 给茶树写一封信
Brush-stroke bullet: "09:00 工夫茶艺" — 八步品茶法训练
Brush-stroke bullet: "14:00 品牌策划" — "我为凤凰茶代言"创意提案
Brush-stroke bullet: "16:00 结营茶会" — 提案展示·证书颁发·感恩茶会

Each item has time in bold pink-brown, activity and description in regular. Brush-stroke dividers between items.

NO footer. NO page number.`
},

// === SLIDE 15: 晨间冥想 + 工夫茶艺 ======================================
{
  style: "content",
  prompt: `Layout: TWO flowing sections side by side, each with a different pale wash.

LEFT section (pale blue wash):
"给茶树写一封信" (bold, 24pt, warm brown)

Tiny Feng Zikai illustration: A round-headed child sitting under an ancient tea tree, writing in a notebook. The tree canopy is a few green wash strokes. Morning light as a pale amber glow on one side.

Three guided prompts:
"闭上眼睛，感受这棵树的呼吸"
"如果它能说话，会对你说什么？"
"把你想说的话写成一封信"

RIGHT section (pale pink wash):
"八步品茶法" (bold, 24pt, warm brown)

EIGHT steps in a flowing 2×4 layout, each a small area with a numbered brush-stroke circle in orchid pink:

① "治器" — 温杯烫盏
② "纳茶" — 置茶入盖碗
③ "泡茶" — 高冲低斟
④ "刮沫" — 刮浮沫净汤
⑤ "浇淋" — 封壶提香
⑥ "烫杯" — 预热品杯
⑦ "斟茶" — 关公巡城
⑧ "品茶" — 先闻后啜

Each step has a pink numbered circle and compact text. The layout flows organically.

NO footer. NO page number. The two sections should feel like facing pages of a picture book.`
},

// === SLIDE 16: 品牌策划 ==================================================
{
  style: "content",
  prompt: `Layout: A large stat callout at top, then THREE content areas below, then a bottom annotation.

TOP callout area (pale amber wash):
Big stat calligraphic style: "6组" (42pt, bold, warm brown) "×" "1个品牌提案" (22pt)
Below: "从学习者到传播者的身份转变" (16pt, warm gray)

THREE areas in a flowing row, each with a different pale wash:

Area 1 (pale amber):
Tiny Feng Zikai illustration: a child drawing a logo on paper
"品牌设计" (bold, medium-large, amber)
"品牌名称与故事"
"视觉标识设计"
"口号与理念"

Area 2 (pale green):
Tiny illustration: three round-headed children presenting to an audience (audience = row of dots)
"路演展示" (bold, medium-large, green)
"三分钟品牌路演"
"角色分工展示"
"回答评审团提问"

Area 3 (pale pink):
Tiny illustration: a certificate/ribbon drawn in 3 strokes
"评价标准" (bold, medium-large, pink)
"文化理解深度"
"创意表达力"
"团队协作度"

Bottom annotation (brush-stroke divider above):
"协作引导：观察者→市场调研 / 操作者→产品设计 / 表达者→品牌路演" (centered, 16pt, warm gray)

NO footer. NO page number.`
},

// === SLIDE 17: 结营茶会 ==================================================
{
  style: "scene",
  prompt: `A warm, celebratory Feng Zikai painting — the emotional climax.

Scene: A round table viewed from slightly above. Round-headed children and adults (parents, teachers) sit in a circle around it. In the center, a complete tea ceremony setup. One child stands, carefully performing the tea ceremony — pouring with concentrated expression (tongue sticking out, one brush stroke). Other children hold small cups waiting. A parent wipes a tear (one dot). Small orchid branches and tea leaves scattered decoratively.

The circular composition suggests unity and completion. Each figure is drawn in 3-5 strokes. Warm amber and pink washes. Soft candlelight suggested by amber glow in the center.

Text integrated:
Upper area: "结营茶会：感恩与传承"

Three small badge-like circles scattered at the edges of the painting:
"小茶匠证书" (calligraphic, in a red seal stamp circle)
"古茶树认养" (calligraphic, in a green seal stamp)
"最佳合作奖" (calligraphic, in an amber seal stamp)

Bottom, flowing calligraphic text:
"一杯茶，一座山，一段传承"

The warmth radiates from the center outward. This is a celebration.

NO footer. NO page number.`
},

// === SLIDE 18: 80个话术体系 ==============================================
{
  style: "content",
  prompt: `Layout: THREE COLUMNS side by side, each representing one day.

Top center: "80个协作引导话术体系" (bold, 28pt, charcoal) with brush stroke underneath.

── Column 1 (pale amber wash):
Tiny illustration: a steaming teacup, 3 strokes
"第一天" (bold, 24pt, amber #B8860B)
"感官觉醒" (18pt, warm gray)
Large stat: "28个" (36pt, bold, amber) "话术"

Five module labels stacked:
"开营仪式 #1-6"
"博物馆探案 #7-12"
"茶山冥想 #13-16"
"五感品茶 #17-24"
"香气记忆 #25-28"

── Column 2 (pale green wash):
Tiny illustration: an ancient tea tree, 3 strokes
"第二天" (bold, 24pt, green #4A7C59)
"工艺探秘" (18pt, warm gray)
Large stat: "32个" (36pt, bold, green) "话术"

Four module labels:
"古茶园探访 #29-36"
"茶农午餐 #37-42"
"制茶工序 #43-54"
"匠人对话 #55-60"

── Column 3 (pale pink wash):
Tiny illustration: an orchid branch, 3 strokes
"第三天" (bold, 24pt, pink #C1567D)
"创意表达" (18pt, warm gray)
Large stat: "20个" (36pt, bold, pink) "话术"

Four module labels:
"晨间冥想 #61-64"
"工夫茶艺 #65-72"
"品牌策划 #73-76"
"结营茶会 #77-80"

Bottom area (darker warm wash):
"每个话术包含：协作目标 + 引导原文 + 教学意图 + 偏差预警 + 关联资源" (centered, 14pt)

Brush-stroke vertical dividers between columns. NO footer, NO page number.`
},

// === SLIDE 19: 安全与后勤 ================================================
{
  style: "content",
  prompt: `Layout: TWO flowing sections side by side.

Top center: "安全保障与后勤配置" (bold, 28pt, charcoal)

LEFT section (pale warm-pink wash):
"安全保障体系" (bold, 24pt, warm red-brown #8B4513)

Four content areas stacked, each with a tiny Feng Zikai icon:
Tiny shield icon: "山路安全" (bold)
"山地导师前导+后护 · 防滑装备 · 定位"

Tiny flame icon: "制茶安全" (bold)
"高温工序专人监护 · 儿童距离线 · 手套"

Tiny bowl icon: "饮食安全" (bold)
"过敏源排查 · 当地食材源头 · 应急药箱"

Tiny umbrella icon: "天气应急" (bold)
"雨天备案·高温备案·寒潮备案"

RIGHT section (pale blue wash):
"团队配置" (bold, 24pt, warm brown)

Five role areas, each with a tiny brush-stroke figure:
"营长" — "1人 · 全程统筹协调"
"三人行导师" — "2人 · 协作引导·话术执行"
"非遗工艺导师" — "3人 · 制茶教学·工艺指导"
"自然导师" — "3人 · 山地导览·生态讲解"
"后勤安全员" — "1人 · 医疗物资·应急处置"

Bottom stat bar (brush-stroke divider above):
"师生比 1:3" · "每组配备对讲机" · "24小时应急电话"
(three stats in a row, warm brown, bold)

NO footer. NO page number. Clean, trustworthy, but still with Feng Zikai warmth.`
},

// === SLIDE 20: 尾页 =====================================================
{
  style: "emotion",
  prompt: `The most poetic Feng Zikai painting in the deck — a closing meditation.

Scene: A family walking toward misty mountain peaks, seen from behind — just four simple silhouettes (father, mother, two children of different heights) on a winding path. The path leads toward Phoenix Mountain, drawn as layered ink wash peaks dissolving into cream emptiness. A single tea tree stands ahead on the path with a small red ribbon tied to a branch (their adopted tree).

The four figures are drawn in maybe 12 brush strokes total. Light amber wash on the path, blue-gray washes on the distant mountains, green on the tea tree. Everything else is warm cream emptiness — at least 50% of the image is blank.

Calligraphic text integrated into the sky area:
"一叶一世界" (32pt, bold, charcoal)
"一茶一传承" (32pt, bold, charcoal)

Below, smaller:
""寻茶脉"3天2夜凤凰单丛非遗研学营" (18pt, light, warm gray)

The overall feeling: journey complete, the mountain still waits, family together. Pure warmth and emptiness, like the last page of a beautiful story.

NO footer. NO page number. NO version. NO English. This is meditation in visual form.`
},

];

// --- STYLE RESOLVER -------------------------------------------------------
function getStyle(tag) {
  switch(tag) {
    case "scene": return STYLE_SCENE;
    case "content": return STYLE_CONTENT;
    case "emotion": return STYLE_EMOTION;
    default: return STYLE_CONTENT;
  }
}

// --- GENERATION ENGINE ----------------------------------------------------
async function genSlide(ai, idx) {
  const s = slides[idx];
  const outFile = path.join(SLIDE_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);

  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`Cached: slide ${idx + 1}`);
    return outFile;
  }

  const prefix = getStyle(s.style);
  const fullPrompt = prefix + "\n\n" + s.prompt;

  for (let a = 1; a <= 3; a++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        config: {
          responseModalities: ["IMAGE", "TEXT"],
          imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
        },
      });
      for (const p of (res.candidates?.[0]?.content?.parts || [])) {
        if (p.inlineData) {
          const buf = Buffer.from(p.inlineData.data, "base64");
          fs.writeFileSync(outFile, buf);
          console.log(`Slide ${idx + 1}: ${(buf.length / 1024).toFixed(0)}KB`);
          return outFile;
        }
      }
      console.log(`Slide ${idx + 1}: no image, attempt ${a}/3`);
    } catch (err) {
      console.log(`Slide ${idx + 1}: error ${a}/3 — ${err.message?.slice(0, 200)}`);
      if (a < 3) await new Promise(r => setTimeout(r, 15000));
    }
  }
  console.log(`Slide ${idx + 1}: FAILED after 3 attempts`);
  return null;
}

async function main() {
  if (!fs.existsSync(SLIDE_DIR)) fs.mkdirSync(SLIDE_DIR);
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const CONCURRENCY = 20;
  console.log(`Generating ${slides.length} slides (${CONCURRENCY} parallel)...`);
  const paths = new Array(slides.length).fill(null);

  for (let batch = 0; batch < slides.length; batch += CONCURRENCY) {
    const tasks = [];
    for (let i = batch; i < Math.min(batch + CONCURRENCY, slides.length); i++) {
      tasks.push(genSlide(ai, i).then(p => { paths[i] = p; }));
    }
    await Promise.all(tasks);
  }

  // Build PPTX
  console.log("Building PPTX...");
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: SW, height: SH });
  pptx.layout = "WIDE";

  for (const p of paths) {
    const slide = pptx.addSlide();
    if (p && fs.existsSync(p)) {
      const b64 = "data:image/png;base64," + fs.readFileSync(p, "base64");
      slide.addImage({ data: b64, x: 0, y: 0, w: SW, h: SH });
    }
  }

  const outFile = "寻茶脉-研学营执行手册-v2.pptx";
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nDone: ${outFile} (${paths.filter(Boolean).length}/${slides.length} slides)`);
}

main().catch(err => console.error("Fatal:", err));
