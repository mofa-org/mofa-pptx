const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "\u751f\u547d\u662f\u4ec0\u4e48";

const W = 10, H = 5.625;

const C = {
  darkBg: "0B1929",
  medBg: "132F4C",
  lightBg: "F0F4F8",
  card: "FFFFFF",
  primary: "00B4D8",
  primaryDark: "0891B2",
  accent: "FFB703",
  light: "E8EDF2",
  dark: "1E293B",
  muted: "64748B",
  subtle: "CBD5E1",
  teal: "14B8A6",
  rose: "F43F5E",
};

const shadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.12 });

// ============================================================
// SLIDE 1: TITLE
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.darkBg };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.06, fill: { color: C.primary } });

  s.addText("\u751f\u547d\u662f\u4ec0\u4e48\uff1f", {
    x: 0.8, y: 1.2, w: 8.4, h: 1.2,
    fontSize: 48, fontFace: "Noto Sans SC", bold: true, color: C.light, margin: 0
  });

  s.addText("\u859b\u5b9a\u8c14\u300aWhat is Life?\u300b\u7814\u8bfb\u7b14\u8bb0", {
    x: 0.8, y: 2.4, w: 8.4, h: 0.6,
    fontSize: 20, fontFace: "Noto Sans SC", color: C.primary, margin: 0
  });

  s.addText([
    { text: "\u7269\u7406\u5b66\u5bb6\u5982\u4f55\u770b\u5f85\u751f\u547d\u7684\u5fae\u89c2\u79e9\u5e8f\uff1f", options: { breakLine: true } },
    { text: "\u4ece\u7edf\u8ba1\u529b\u5b66\u5230\u91cf\u5b50\u5316\u5b66\uff0c\u4ece\u9057\u4f20\u5bc6\u7801\u5230\u8d1f\u71b5\u2014\u2014", options: { breakLine: true } },
    { text: "\u4e00\u90e8\u8de8\u8d8a\u5b66\u79d1\u8fb9\u754c\u7684\u601d\u60f3\u5b9e\u9a8c\u3002" }
  ], {
    x: 0.8, y: 3.3, w: 6, h: 1.2,
    fontSize: 14, fontFace: "Noto Sans SC", color: C.muted, lineSpacingMultiple: 1.5, margin: 0
  });

  s.addShape(pres.shapes.OVAL, { x: 7.5, y: 2.8, w: 2, h: 2, fill: { color: C.primary, transparency: 85 }, line: { color: C.primary, width: 1.5 } });
  s.addShape(pres.shapes.OVAL, { x: 7.8, y: 3.1, w: 1.4, h: 1.4, fill: { color: C.accent, transparency: 90 }, line: { color: C.accent, width: 1 } });
  s.addShape(pres.shapes.OVAL, { x: 8.15, y: 3.45, w: 0.7, h: 0.7, fill: { color: C.primary, transparency: 70 } });
}

// ============================================================
// SLIDE 2: OVERVIEW / ROADMAP
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };

  s.addText("\u5168\u4e66\u8def\u7ebf\u56fe", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.6,
    fontSize: 32, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0
  });
  s.addText("\u4ece\u5929\u771f\u7269\u7406\u5b66\u5bb6\u7684\u76f4\u89c9\u51fa\u53d1\uff0c\u7ecf\u8fc7\u9057\u4f20\u5b66\u4e8b\u5b9e\u7684\u51b2\u51fb\uff0c\u9010\u6b65\u903c\u8fd1\u4e00\u4e2a\u65b0\u7684\u5fae\u89c2\u56fe\u666f", {
    x: 0.8, y: 1.0, w: 8.4, h: 0.4,
    fontSize: 13, fontFace: "Noto Sans SC", color: C.muted, margin: 0
  });

  const steps = [
    { num: "01", title: "\u8de8\u5b66\u79d1\u89c6\u89d2", desc: "\u7269\u7406\u5b66\u5bb6\u4e3a\u4f55\n\u8981\u7814\u7a76\u751f\u547d\uff1f" },
    { num: "02", title: "\u7edf\u8ba1\u5f8b\u6096\u8bba", desc: "\u5927\u6570\u5b9a\u5f8b vs\n\u5c11\u6570\u539f\u5b50\u63a7\u5236" },
    { num: "03", title: "\u9057\u4f20\u5bc6\u7801", desc: "\u67d3\u8272\u4f53\u4e2d\u7684\n\u56db\u7ef4\u56fe\u5f0f\u811a\u672c" },
    { num: "04", title: "\u7a81\u53d8\u4e0e\u8dc3\u8fc1", desc: "\u79bb\u6563\u7684\u91cf\u5b50\u5f0f\n\u6027\u72b6\u6539\u53d8" },
    { num: "05", title: "\u91cf\u5b50\u7a33\u5b9a\u6027", desc: "\u5316\u5b66\u952e\u4e3a\u57fa\u56e0\n\u63d0\u4f9b\u6301\u4e45\u7a33\u5b9a" },
    { num: "06", title: "\u975e\u5468\u671f\u6676\u4f53", desc: "\u5fae\u578b\u4ee3\u7801\u538b\u7f29\n\u7684\u7269\u8d28\u5f62\u6001" },
    { num: "07", title: "\u8d1f\u71b5\u4e0e\u79e9\u5e8f", desc: "\u751f\u547d\u5982\u4f55\u9006\u7740\n\u70ed\u529b\u5b66\u6d3b\u7740" },
    { num: "08", title: "\u65b0\u578b\u5b9a\u5f8b", desc: "\u811a\u672c\u590d\u5236 vs\n\u7edf\u8ba1\u5e73\u5747" },
  ];

  const cardW = 2.0, cardH = 1.4, gapX = 0.2, gapY = 0.2;
  const startX = 0.8, startY = 1.7;

  steps.forEach((step, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: cardH, fill: { color: C.card }, shadow: shadow() });
    s.addText(step.num, {
      x: x + 0.15, y: y + 0.1, w: 0.5, h: 0.35,
      fontSize: 18, fontFace: "Consolas", bold: true, color: C.primary, margin: 0
    });
    s.addText(step.title, {
      x: x + 0.15, y: y + 0.45, w: cardW - 0.3, h: 0.35,
      fontSize: 13, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0
    });
    s.addText(step.desc, {
      x: x + 0.15, y: y + 0.8, w: cardW - 0.3, h: 0.5,
      fontSize: 10, fontFace: "Noto Sans SC", color: C.muted, margin: 0
    });
  });
}

// ============================================================
// SLIDE 3: STATISTICAL LAWS & SMALL NUMBER PARADOX
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.darkBg };

  s.addText("\u7edf\u8ba1\u5f8b\u4e0e\u539f\u5b50\u5c3a\u5ea6\u7684\u6096\u8bba", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Noto Sans SC", bold: true, color: C.light, margin: 0
  });

  // Big formula callout
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 3.5, h: 2.8, fill: { color: C.medBg }, shadow: shadow() });
  s.addText("1/\u221An", {
    x: 0.8, y: 1.5, w: 3.5, h: 1.2,
    fontSize: 56, fontFace: "Consolas", bold: true, color: C.accent, align: "center", margin: 0
  });
  s.addText("\u7edf\u8ba1\u8bef\u5dee\u5c3a\u5ea6", {
    x: 0.8, y: 2.6, w: 3.5, h: 0.4,
    fontSize: 14, fontFace: "Noto Sans SC", color: C.primary, align: "center", margin: 0
  });
  s.addText("n \u8d8a\u5927\uff0c\u5b8f\u89c2\u5b9a\u5f8b\u8d8a\u7cbe\u786e\n\u8fd9\u8981\u6c42\u751f\u547d\u4f53\u5fc5\u987b\u6781\u5176\u591a\u539f\u5b50", {
    x: 1.2, y: 3.1, w: 2.7, h: 0.8,
    fontSize: 11, fontFace: "Noto Sans SC", color: C.muted, align: "center", margin: 0
  });

  // Three examples
  const examples = [
    { title: "\u987a\u78c1\u6027", desc: "\u5355\u4e2a\u5206\u5b50\u5728\u70ed\u8fd0\u52a8\u4e2d\u4e71\u8f6c\uff0c\u5de8\u91cf\u5206\u5b50\u5e73\u5747\u540e\u51fa\u73b0\u4e0e\u5916\u573a\u6210\u6bd4\u4f8b\u7684\u78c1\u5316" },
    { title: "\u5e03\u6717\u8fd0\u52a8", desc: "\u5fae\u7c92\u88ab\u5355\u5206\u5b50\u649e\u51fb\u4f1a\u4e71\u8df3\uff0c\u53ea\u6709\u300c\u5e73\u5747\u300d\u624d\u5448\u73b0\u7a33\u5b9a\u4e0b\u6c89\u6216\u6d53\u5ea6\u62b9\u5e73" },
    { title: "\u6d4b\u91cf\u7cbe\u5ea6", desc: "\u4eea\u5668\u592a\u7075\u654f\u5c31\u4f1a\u88ab\u70ed\u566a\u58f0\u652f\u914d\uff0c\u5fc5\u987b\u9760\u91cd\u590d\u5e73\u5747\u624d\u80fd\u62bd\u51fa\u89c4\u5f8b" },
  ];

  examples.forEach((ex, i) => {
    const y = 1.3 + i * 0.95;
    s.addShape(pres.shapes.OVAL, { x: 4.8, y: y + 0.15, w: 0.2, h: 0.2, fill: { color: C.primary } });
    s.addText(ex.title, {
      x: 5.15, y: y, w: 2.0, h: 0.35,
      fontSize: 14, fontFace: "Noto Sans SC", bold: true, color: C.light, margin: 0
    });
    s.addText(ex.desc, {
      x: 5.15, y: y + 0.35, w: 4.2, h: 0.5,
      fontSize: 11, fontFace: "Noto Sans SC", color: C.muted, margin: 0
    });
  });

  // Bottom highlight
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.5, w: 8.4, h: 0.8,
    fill: { color: C.primary, transparency: 85 }, line: { color: C.primary, width: 1 }
  });
  s.addText("\u6096\u8bba\uff1a\u9057\u4f20\u4e0e\u53d1\u80b2\u7684\u5173\u952e\u63a7\u5236\uff0c\u4f9d\u8d56\u6781\u5c0f\u7684\u4e00\u7ec4\u539f\u5b50\u2014\u2014\u5c0f\u5230\u7edf\u8ba1\u5f8b\u4e0d\u8be5\u6210\u7acb\uff0c\u5374\u8868\u73b0\u51fa\u5c16\u9510\u7684\u751f\u7269\u5b66\u5b9a\u5f8b", {
    x: 1.1, y: 4.55, w: 7.8, h: 0.7,
    fontSize: 12, fontFace: "Noto Sans SC", color: C.light, margin: 0, valign: "middle"
  });
}

// ============================================================
// SLIDE 4: GENETIC CODE SCRIPT & 4D PATTERN
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };

  s.addText("\u67d3\u8272\u4f53\u300c\u5bc6\u7801\u811a\u672c\u300d\u4e0e\u56db\u7ef4\u56fe\u5f0f", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0
  });

  // Left card
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 4.2, h: 3.6, fill: { color: C.card }, shadow: shadow() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 0.08, h: 3.6, fill: { color: C.accent } });

  s.addText("\u56db\u7ef4\u56fe\u5f0f", {
    x: 1.15, y: 1.5, w: 3.7, h: 0.4,
    fontSize: 18, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0
  });
  s.addText("\u9057\u4f20\u4e0d\u662f\u7167\u7247\uff0c\u800c\u662f\u7535\u5f71", {
    x: 1.15, y: 1.9, w: 3.7, h: 0.3,
    fontSize: 13, fontFace: "Noto Sans SC", color: C.primary, margin: 0
  });
  s.addText([
    { text: "\u751f\u7269\u4f53\u662f\u4ece\u53d7\u7cbe\u5375\u5230\u6210\u719f\u518d\u5230\u7e41\u6b96\u7684\u6574\u4e2a\u65f6\u7a7a\u5c55\u5f00\u8fc7\u7a0b\u3002", options: { breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "\u67d3\u8272\u4f53\u91cc\u7684\u300c\u5bc6\u7801\u811a\u672c\u300d\uff1a", options: { bold: true, breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "\u4e0d\u662f\u8c61\u5f81\u610f\u4e49\u7684\u4ee3\u7801\uff0c\u800c\u662f\u7269\u8d28\u610f\u4e49\u4e0a\u7684\u4ee3\u7801\u2014\u2014\u65e2\u8bb0\u5f55\u7ed3\u6784\uff0c\u4e5f\u53c2\u4e0e\u751f\u6210\u7ed3\u6784\u3002", options: { breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "\u4e00\u4e2a\u5168\u77e5\u7684\u62c9\u666e\u62c9\u65af\u9b54\u9b3c\u53ea\u8981\u8bfb\u61c2\u8fd9\u4e2a\u811a\u672c\uff0c\u5c31\u80fd\u9884\u8a00\u8fd9\u679a\u5375\u5c06\u957f\u6210\u54ea\u79cd\u751f\u7269\u3002" }
  ], {
    x: 1.15, y: 2.35, w: 3.6, h: 2.4,
    fontSize: 11, fontFace: "Noto Sans SC", color: C.dark, lineSpacingMultiple: 1.3, margin: 0
  });

  // Right: three mechanism cards
  const mechs = [
    { title: "\u6709\u4e1d\u5206\u88c2", sub: "\u9ad8\u4fdd\u771f\u590d\u5236", desc: "\u6bcf\u6761\u67d3\u8272\u4f53\u88ab\u7cbe\u786e\u590d\u5236\uff0c\u6bcf\u4e2a\u4f53\u7ec6\u80de\u90fd\u643a\u5e26\u53cc\u4efd\u5b8c\u6574\u811a\u672c", color: C.primary },
    { title: "\u51cf\u6570\u5206\u88c2", sub: "\u591a\u6837\u6027\u5236\u5ea6", desc: "\u53cc\u4efd\u811a\u672c\u62c6\u4e3a\u5355\u4efd\uff0c\u4ea4\u53c9\u4e92\u6362\u5236\u9020\u53ef\u9057\u4f20\u5dee\u5f02", color: C.teal },
    { title: "\u4fe1\u606f\u5de5\u7a0b", sub: "\u5197\u4f59 + \u91cd\u7ec4 + \u7a81\u53d8", desc: "\u5197\u4f59\u4fdd\u8bc1\u7a33\u5b9a\uff0c\u91cd\u7ec4\u4fdd\u8bc1\u63a2\u7d22\uff0c\u7a81\u53d8\u63d0\u4f9b\u521b\u65b0\u7684\u4f4e\u9891\u901a\u9053", color: C.accent },
  ];

  mechs.forEach((m, i) => {
    const y = 1.3 + i * 1.2;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y, w: 4.0, h: 1.05, fill: { color: C.card }, shadow: shadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y, w: 0.08, h: 1.05, fill: { color: m.color } });
    s.addText(m.title, {
      x: 5.65, y: y + 0.08, w: 1.5, h: 0.3,
      fontSize: 13, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0
    });
    s.addText(m.sub, {
      x: 7.1, y: y + 0.08, w: 2.0, h: 0.3,
      fontSize: 11, fontFace: "Noto Sans SC", color: m.color, margin: 0, align: "right"
    });
    s.addText(m.desc, {
      x: 5.65, y: y + 0.45, w: 3.5, h: 0.5,
      fontSize: 10, fontFace: "Noto Sans SC", color: C.muted, margin: 0
    });
  });
}

// ============================================================
// SLIDE 5: MUTATION
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.darkBg };

  s.addText("\u7a81\u53d8\uff1a\u8dc3\u8fc1\u5f0f\u6539\u53d8\u4e0e\u5c11\u6570\u539f\u5b50\u4e8b\u4ef6", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Noto Sans SC", bold: true, color: C.light, margin: 0
  });

  s.addText("\u9057\u4f20\u5dee\u5f02\u5982\u679c\u53ea\u9760\u91cd\u7ec4\u7ec8\u7a76\u6709\u9650\uff1b\u771f\u6b63\u63a8\u52a8\u7269\u79cd\u8fdc\u8ddd\u79bb\u8dc3\u8fc1\u7684\u662f\u7a81\u53d8", {
    x: 0.8, y: 1.0, w: 8.4, h: 0.4,
    fontSize: 12, fontFace: "Noto Sans SC", color: C.muted, margin: 0
  });

  // Two property cards
  const props = [
    { title: "\u8df3\u8dc3\u5f0f", desc: "\u6027\u72b6\u4e0d\u662f\u8fde\u7eed\u6f02\u79fb\uff0c\n\u800c\u662f\u7a81\u7136\u6362\u6321" },
    { title: "\u53ef\u9057\u4f20\u4e14\u7a33\u5b9a", desc: "\u4e00\u65e6\u51fa\u73b0\u4fbf\u88ab\u51c6\u786e\u590d\u5236\uff0c\n\u50cf\u5f00\u5173\u4e00\u6837 breed true" },
  ];

  props.forEach((p, i) => {
    const x = 0.8 + i * 4.4;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.6, w: 4.1, h: 1.3, fill: { color: C.medBg }, shadow: shadow() });
    s.addText(p.title, {
      x: x + 0.3, y: 1.7, w: 3.5, h: 0.4,
      fontSize: 16, fontFace: "Noto Sans SC", bold: true, color: C.accent, margin: 0
    });
    s.addText(p.desc, {
      x: x + 0.3, y: 2.15, w: 3.5, h: 0.6,
      fontSize: 12, fontFace: "Noto Sans SC", color: C.light, margin: 0
    });
  });

  // X-ray evidence
  s.addText("X \u5c04\u7ebf\u8bf1\u53d8\u5b9e\u9a8c\u7684\u4e24\u6761\u5f3a\u7ea6\u675f", {
    x: 0.8, y: 3.2, w: 8.4, h: 0.4,
    fontSize: 16, fontFace: "Noto Sans SC", bold: true, color: C.primary, margin: 0
  });

  const constraints = [
    { num: "1", text: "\u7a81\u53d8\u5e38\u5bf9\u5e94\u5355\u6b21\u7269\u7406\u4e8b\u4ef6\n\u2014\u2014\u4e00\u6b21\u7167\u5c04\u5373\u53ef\u89e6\u53d1" },
    { num: "2", text: "\u7a81\u53d8\u4f4d\u70b9\u5177\u6709\u5c40\u90e8\u6027\n\u2014\u2014\u4e0d\u662f\u5168\u5c40\u6563\u5f00" },
  ];

  constraints.forEach((c, i) => {
    const x = 0.8 + i * 4.4;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.7, w: 4.1, h: 0.9,
      fill: { color: C.primary, transparency: 85 }, line: { color: C.primary, width: 1 }
    });
    s.addText(c.num, {
      x: x + 0.2, y: 3.75, w: 0.4, h: 0.4,
      fontSize: 24, fontFace: "Consolas", bold: true, color: C.primary, margin: 0
    });
    s.addText(c.text, {
      x: x + 0.6, y: 3.8, w: 3.3, h: 0.7,
      fontSize: 11, fontFace: "Noto Sans SC", color: C.light, margin: 0
    });
  });

  // Conclusion
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.85, w: 8.4, h: 0.05, fill: { color: C.accent } });
  s.addText("\u7ed3\u8bba\uff1a\u9020\u6210\u6027\u72b6\u5f00\u5173\u53d8\u5316\u7684\uff0c\u662f\u67d3\u8272\u4f53\u4e2d\u6781\u5c11\u6570\u539f\u5b50\u7684\u91cd\u6392\u6216\u66ff\u6362", {
    x: 0.8, y: 4.95, w: 8.4, h: 0.4,
    fontSize: 12, fontFace: "Noto Sans SC", bold: true, color: C.accent, margin: 0
  });
}

// ============================================================
// SLIDE 6: QUANTUM STABILITY
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };

  s.addText("\u91cf\u5b50\u529b\u5b66\u8bc1\u636e\uff1a\u57fa\u56e0\u5fc5\u987b\u662f\u91cf\u5b50\u7a33\u5b9a\u4f53", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0
  });

  // Left: Classical problem
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 4.1, h: 3.5, fill: { color: C.card }, shadow: shadow() });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 4.1, h: 0.5, fill: { color: C.rose } });
  s.addText("\u7ecf\u5178\u70ed\u566a\u58f0\u4e0b\u7684\u56f0\u5883", {
    x: 0.8, y: 1.3, w: 4.1, h: 0.5,
    fontSize: 14, fontFace: "Noto Sans SC", bold: true, color: C.card, align: "center", valign: "middle", margin: 0
  });

  s.addText([
    { text: "\u82e5\u57fa\u56e0\u662f\u666e\u901a\u5206\u5b50\u96c6\u5408\uff1a", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "\u7ed3\u6784\u7684\u957f\u671f\u7a33\u5b9a\u6027\u4e0d\u53ef\u80fd", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "\u7a81\u53d8\u5e94\u662f\u8fde\u7eed\u6a21\u7cca\u7684", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "", options: { breakLine: true, fontSize: 8 } },
    { text: "\u4f46\u9057\u4f20\u4e8b\u5b9e\u8981\u6c42\uff1a", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "\u51e0\u5341\u5e74\u4e43\u81f3\u8de8\u4e16\u4ee3\u7a33\u5b9a", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "\u5076\u5c14\u4f46\u79bb\u6563\u7684\u8df3\u53d8", options: { bullet: true, fontSize: 11 } },
  ], {
    x: 1.1, y: 2.0, w: 3.5, h: 2.6,
    fontFace: "Noto Sans SC", color: C.dark, margin: 0
  });

  // Right: Quantum solution
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.1, h: 3.5, fill: { color: C.card }, shadow: shadow() });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.1, h: 0.5, fill: { color: C.primary } });
  s.addText("\u91cf\u5b50\u529b\u5b66\u7684\u81ea\u7136\u89e3\u91ca", {
    x: 5.2, y: 1.3, w: 4.1, h: 0.5,
    fontSize: 14, fontFace: "Noto Sans SC", bold: true, color: C.card, align: "center", valign: "middle", margin: 0
  });

  s.addText([
    { text: "\u5206\u5b50\u5904\u4e8e\u79bb\u6563\u80fd\u7ea7", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "\u5316\u5b66\u952e\u5bf9\u5e94\u7a33\u5b9a\u91cf\u5b50\u6001", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "\u6539\u53d8\u7ed3\u6784\u5fc5\u987b\u8de8\u8d8a\u80fd\u5792", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "", options: { breakLine: true, fontSize: 8 } },
    { text: "\u56e0\u800c\uff1a", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "\u5e73\u65f6\u6781\u7a33\u3001\u5076\u5c14\u8dc3\u8fc1", options: { breakLine: true, fontSize: 14, bold: true, color: C.primary } },
    { text: "", options: { breakLine: true, fontSize: 8 } },
    { text: "\u6070\u597d\u6620\u5c04\u300c\u57fa\u56e0\u957f\u671f\u7a33\u5b9a + \u7a81\u53d8\u8df3\u8dc3\u300d\u7684\u9057\u4f20\u4e8b\u5b9e", options: { fontSize: 11 } },
  ], {
    x: 5.5, y: 2.0, w: 3.5, h: 2.6,
    fontFace: "Noto Sans SC", color: C.dark, margin: 0
  });

  // Bottom insight
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 5.0, w: 8.4, h: 0.05, fill: { color: C.primaryDark } });
  s.addText("\u91cf\u5b50\u4e0d\u662f\u7ed9\u751f\u547d\u6dfb\u795e\u79d8\uff0c\u800c\u662f\u552f\u4e00\u80fd\u8ba9\u300c\u5c11\u6570\u539f\u5b50\u957f\u671f\u7cbe\u786e\u5de5\u4f5c\u300d\u6210\u4e3a\u53ef\u80fd\u7684\u7269\u7406\u57fa\u7840", {
    x: 0.8, y: 5.1, w: 8.4, h: 0.3,
    fontSize: 12, fontFace: "Noto Sans SC", bold: true, color: C.primaryDark, margin: 0
  });
}

// ============================================================
// SLIDE 7: APERIODIC CRYSTAL
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.darkBg };

  s.addText("\u975e\u5468\u671f\u6676\u4f53\uff1a\u751f\u547d\u811a\u672c\u7684\u7269\u8d28\u5f62\u6001", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Noto Sans SC", bold: true, color: C.light, margin: 0
  });

  // Central quote
  s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: 1.2, w: 7.0, h: 0.8, fill: { color: C.medBg } });
  s.addText("\u57fa\u56e0\u4e0d\u662f\u300c\u6db2\u4f53\u5316\u5b66\u53cd\u5e94\u300d\uff0c\u800c\u662f\u300c\u56fa\u4f53\u7269\u7406\u5bf9\u8c61\u300d", {
    x: 1.5, y: 1.2, w: 7.0, h: 0.8,
    fontSize: 16, fontFace: "Noto Sans SC", italic: true,
    color: C.accent, align: "center", valign: "middle", margin: 0
  });

  // Left: Periodic crystal
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.3, w: 4.1, h: 2.5, fill: { color: C.medBg }, shadow: shadow() });
  s.addText("\u5468\u671f\u6676\u4f53", {
    x: 0.8, y: 2.35, w: 4.1, h: 0.45,
    fontSize: 16, fontFace: "Noto Sans SC", bold: true, color: C.subtle, align: "center", valign: "middle", margin: 0
  });
  s.addText("\u76d0\u3001\u91d1\u5c5e\u7b49", {
    x: 0.8, y: 2.8, w: 4.1, h: 0.3,
    fontSize: 11, fontFace: "Noto Sans SC", color: C.muted, align: "center", margin: 0
  });
  s.addText("0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0", {
    x: 1.3, y: 3.15, w: 3.1, h: 0.9,
    fontSize: 14, fontFace: "Consolas", color: C.subtle, align: "center", margin: 0, lineSpacingMultiple: 1.2
  });
  s.addText("\u91cd\u590d\u5355\u5143 \u2192 \u7a33\u5b9a\n\u4fe1\u606f\u5bc6\u5ea6\u6781\u4f4e", {
    x: 1.1, y: 4.1, w: 3.5, h: 0.5,
    fontSize: 11, fontFace: "Noto Sans SC", color: C.muted, align: "center", margin: 0
  });

  // Right: Aperiodic crystal
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 2.3, w: 4.1, h: 2.5,
    fill: { color: C.primary, transparency: 80 }, line: { color: C.primary, width: 1.5 }, shadow: shadow()
  });
  s.addText("\u975e\u5468\u671f\u6676\u4f53", {
    x: 5.2, y: 2.35, w: 4.1, h: 0.45,
    fontSize: 16, fontFace: "Noto Sans SC", bold: true, color: C.primary, align: "center", valign: "middle", margin: 0
  });
  s.addText("\u9057\u4f20\u7269\u8d28 (DNA)", {
    x: 5.2, y: 2.8, w: 4.1, h: 0.3,
    fontSize: 11, fontFace: "Noto Sans SC", color: C.light, align: "center", margin: 0
  });
  s.addText("A T G C C A T G\nG C A T T G C A\nT A C G A T G C", {
    x: 5.7, y: 3.15, w: 3.1, h: 0.9,
    fontSize: 14, fontFace: "Consolas", color: C.accent, align: "center", margin: 0, lineSpacingMultiple: 1.2
  });
  s.addText("\u4e0d\u91cd\u590d\u5e8f\u5217 \u2192 \u6709\u5e8f\n\u6781\u9ad8\u4fe1\u606f\u5bc6\u5ea6", {
    x: 5.5, y: 4.1, w: 3.5, h: 0.5,
    fontSize: 11, fontFace: "Noto Sans SC", color: C.light, align: "center", margin: 0
  });

  // Bottom insight
  s.addText("\u67d3\u8272\u4f53\u5728\u5fae\u578b\u5c3a\u5ea6\u4e0a\u538b\u7f29\u4e86\u6781\u4e30\u5bcc\u7684\u5185\u5bb9\u2014\u2014\u5c11\u6570\u539f\u5b50\u63a7\u5236\u56db\u7ef4\u56fe\u5f0f", {
    x: 0.8, y: 5.05, w: 8.4, h: 0.4,
    fontSize: 12, fontFace: "Noto Sans SC", color: C.accent, margin: 0, align: "center"
  });
}

// ============================================================
// SLIDE 8: NEGATIVE ENTROPY
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };

  s.addText("\u8d1f\u71b5\uff1a\u751f\u547d\u5982\u4f55\u9006\u7740\u70ed\u529b\u5b66\u300c\u6d3b\u7740\u300d", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0
  });

  // Three-step process
  const flow = [
    { title: "\u6096\u8bba\u8868\u8c61", desc: "\u65e0\u751f\u547d\u7269\u8d28\u8d70\u5411\u70ed\u5e73\u8861\u3001\n\u7ed3\u6784\u8d8b\u4e8e\u65e0\u5e8f\uff1b\n\u751f\u547d\u5374\u7ef4\u6301\u9ad8\u5ea6\u6709\u5e8f\u7ed3\u6784", color: C.rose },
    { title: "\u8d1f\u71b5\u89e3\u7b54", desc: "\u751f\u547d\u4f53\u4ece\u73af\u5883\u6c72\u53d6\n\u300c\u8d1f\u71b5/\u79e9\u5e8f\u6d41\u300d\u6765\n\u7ef4\u6301\u81ea\u8eab\u7ec4\u7ec7", color: C.primary },
    { title: "\u70ed\u529b\u5b66\u8c03\u548c", desc: "\u5c40\u90e8\u71b5\u51cf\u4f9d\u8d56\u4e8e\n\u66f4\u5927\u73af\u5883\u7684\u71b5\u589e\u2014\u2014\n\u6709\u5e8f\u662f\u88ab\u300c\u4ed8\u8d39\u8d2d\u4e70\u300d\u7684", color: C.teal },
  ];

  flow.forEach((f, i) => {
    const x = 0.8 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.3, w: 2.8, h: 2.2, fill: { color: C.card }, shadow: shadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.3, w: 2.8, h: 0.06, fill: { color: f.color } });
    s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: 1.55, w: 0.45, h: 0.45, fill: { color: f.color } });
    s.addText(String(i + 1), {
      x: x + 0.2, y: 1.55, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: "Noto Sans SC", bold: true, color: C.card, align: "center", valign: "middle", margin: 0
    });
    s.addText(f.title, {
      x: x + 0.8, y: 1.55, w: 1.8, h: 0.45,
      fontSize: 14, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0, valign: "middle"
    });
    s.addText(f.desc, {
      x: x + 0.2, y: 2.2, w: 2.4, h: 1.1,
      fontSize: 11, fontFace: "Noto Sans SC", color: C.muted, margin: 0
    });
    if (i < 2) {
      s.addText("\u2192", {
        x: x + 2.8, y: 2.0, w: 0.3, h: 0.5,
        fontSize: 24, fontFace: "Arial", color: C.subtle, align: "center", valign: "middle", margin: 0
      });
    }
  });

  // Bottom: two types of order
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.8, w: 8.4, h: 1.5, fill: { color: C.card }, shadow: shadow() });
  s.addText("\u4e24\u79cd\u79e9\u5e8f\u6765\u6e90", {
    x: 1.1, y: 3.9, w: 8.0, h: 0.4,
    fontSize: 14, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 1.1, y: 4.4, w: 3.8, h: 0.7, fill: { color: C.lightBg } });
  s.addText("Order-from-Disorder", {
    x: 1.2, y: 4.4, w: 3.6, h: 0.3,
    fontSize: 12, fontFace: "Consolas", bold: true, color: C.muted, margin: 0
  });
  s.addText("\u4ece\u65e0\u5e8f\u4e2d\u901a\u8fc7\u7edf\u8ba1\u5e73\u5747\u6d8c\u73b0\uff08\u65e0\u751f\u547d\u4e16\u754c\uff09", {
    x: 1.2, y: 4.7, w: 3.6, h: 0.3,
    fontSize: 10, fontFace: "Noto Sans SC", color: C.muted, margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.4, w: 3.8, h: 0.7, fill: { color: C.primary, transparency: 90 } });
  s.addText("Order-from-Order", {
    x: 5.3, y: 4.4, w: 3.6, h: 0.3,
    fontSize: 12, fontFace: "Consolas", bold: true, color: C.primary, margin: 0
  });
  s.addText("\u5df2\u6709\u79e9\u5e8f\u7684\u590d\u5236\u4e0e\u5c55\u5f00\uff08\u751f\u547d\u4f53\u7cfb\uff09", {
    x: 5.3, y: 4.7, w: 3.6, h: 0.3,
    fontSize: 10, fontFace: "Noto Sans SC", color: C.primaryDark, margin: 0
  });
}

// ============================================================
// SLIDE 9: FIVE CONCLUSIONS
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.darkBg };

  s.addText("\u751f\u547d\u7684\u7269\u7406\u7b54\u6848\uff1a\u4e94\u6761\u6536\u675f", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Noto Sans SC", bold: true, color: C.light, margin: 0
  });

  s.addText("\u859b\u5b9a\u8c14\u5c06\u300c\u751f\u547d\u662f\u4ec0\u4e48\u300d\u7684\u7b54\u6848\u6536\u675f\u4e3a\u4e00\u4e2a\u5e72\u51c0\u7684\u56fe\u666f", {
    x: 0.8, y: 1.0, w: 8.4, h: 0.4,
    fontSize: 13, fontFace: "Noto Sans SC", color: C.muted, margin: 0
  });

  const conclusions = [
    { num: "1", text: "\u9057\u4f20\u7269\u8d28\u662f\u91cf\u5b50\u7a33\u5b9a\u7684\u975e\u5468\u671f\u6676\u4f53", color: C.primary },
    { num: "2", text: "\u5b83\u5728\u5fae\u578b\u533a\u57df\u5b58\u653e\u53ef\u590d\u5236\u7684\u56db\u7ef4\u56fe\u5f0f", color: C.teal },
    { num: "3", text: "\u751f\u547d\u4f5c\u4e3a\u5f00\u653e\u7cfb\u7edf\u4ece\u73af\u5883\u6444\u53d6\u8d1f\u71b5", color: C.accent },
    { num: "4", text: "\u901a\u8fc7 order-from-order \u628a\u79e9\u5e8f\u8de8\u4ee3\u4f20\u9012", color: C.primary },
    { num: "5", text: "\u8fd9\u7c7b\u6784\u9020\u53ef\u80fd\u5bf9\u5e94\u5c1a\u672a\u88ab\u5145\u5206\u5f62\u5f0f\u5316\u7684\u65b0\u578b\u539f\u5219", color: C.rose },
  ];

  conclusions.forEach((c, i) => {
    const y = 1.6 + i * 0.75;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 0.6, fill: { color: C.medBg } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.08, h: 0.6, fill: { color: c.color } });
    s.addText(c.num, {
      x: 1.2, y, w: 0.5, h: 0.6,
      fontSize: 22, fontFace: "Consolas", bold: true, color: c.color, valign: "middle", margin: 0
    });
    s.addText(c.text, {
      x: 1.8, y, w: 7.2, h: 0.6,
      fontSize: 15, fontFace: "Noto Sans SC", color: C.light, valign: "middle", margin: 0
    });
  });

  s.addText("\u7c7b\u6bd4\uff1a\u4e00\u4e2a\u53ea\u61c2\u70ed\u673a\u7684\u5de5\u7a0b\u5e08\u770b\u5230\u7535\u673a\uff0c\u4f1a\u9884\u671f\u5b8c\u5168\u4e0d\u540c\u7684\u5de5\u4f5c\u539f\u7406\u2014\u2014\u4f46\u4e0d\u4f1a\u56e0\u6b64\u76f8\u4fe1\u7535\u673a\u88ab\u9b3c\u9b42\u9a71\u52a8\u3002", {
    x: 0.8, y: 5.1, w: 8.4, h: 0.3,
    fontSize: 11, fontFace: "Noto Sans SC", italic: true, color: C.muted, margin: 0
  });
}

// ============================================================
// SLIDE 10: MODERN ECHOES & FUTURE
// ============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };

  s.addText("\u73b0\u4ee3\u56de\u54cd\u4e0e\u672a\u6765\u5c55\u671b", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0
  });

  s.addText("\u859b\u5b9a\u8c14 1944 \u5e74\u7684\u9884\u8a00\uff0c\u5728\u73b0\u4ee3\u79d1\u5b66\u4e2d\u5f97\u5230\u4e86\u54ea\u4e9b\u5370\u8bc1\uff1f", {
    x: 0.8, y: 1.0, w: 8.4, h: 0.4,
    fontSize: 13, fontFace: "Noto Sans SC", color: C.muted, margin: 0
  });

  const echoes = [
    {
      title: "DNA \u53cc\u87ba\u65cb", year: "1953",
      desc: "\u6c83\u68ee-\u514b\u91cc\u514b\u53d1\u73b0\u53cc\u87ba\u65cb\uff0c\u7cbe\u51c6\u5b9e\u73b0\u859b\u5b9a\u8c14\u9884\u8a00\uff1a\u4e3b\u94fe\u63d0\u4f9b\u7a33\u5b9a\uff0c\u78b1\u57fa\u5e8f\u5217\u63d0\u4f9b\u975e\u5468\u671f\u4fe1\u606f\uff0c\u590d\u5236\u673a\u5236\u63d0\u4f9b order-from-order",
      color: C.primary
    },
    {
      title: "\u4fe1\u606f\u8bba\u5316\u5b66", year: "1960s+",
      desc: "\u9057\u4f20\u8fc7\u7a0b\u4f5c\u4e3a\u4fe1\u606f\u5de5\u7a0b\uff1a\u7f16\u7801\u3001\u7ea0\u9519\u3001\u5197\u4f59\u3001\u538b\u7f29\u3001\u8bfb\u5199\u5934\uff08\u805a\u5408\u9176\uff09\u2014\u2014\u859b\u5b9a\u8c14\u5df2\u628a\u300c\u811a\u672c\u300d\u6982\u5ff5\u653e\u5230\u4e86\u53f0\u524d",
      color: C.teal
    },
    {
      title: "\u975e\u5e73\u8861\u7edf\u8ba1\u7269\u7406", year: "1970s+",
      desc: "\u666e\u91cc\u9ad8\u6d25\u4e0e\u590d\u6742\u7cfb\u7edf\u7406\u8bba\u8ba9\u300c\u5f00\u653e\u7cfb\u7edf\u7ef4\u6301\u4f4e\u71b5\u7ed3\u6784\u300d\u6210\u4e3a\u53ef\u8ba1\u7b97\u6846\u67b6\uff0c\u8d1f\u71b5\u4e0d\u4ec5\u662f\u6bd4\u55bb",
      color: C.accent
    },
    {
      title: "CRISPR \u57fa\u56e0\u7f16\u8f91", year: "2012+",
      desc: "\u300c\u5c11\u6570\u539f\u5b50\u63a7\u5236\u5927\u5c3a\u5ea6\u79e9\u5e8f\u300d\u53d8\u5f97\u53ef\u64cd\u4f5c\u2014\u2014\u6211\u4eec\u4e0d\u4ec5\u80fd\u8bfb\u61c2\u9057\u4f20\u5bc6\u7801\uff0c\u8fd8\u80fd\u6539\u5199\u5b83",
      color: C.rose
    },
  ];

  echoes.forEach((e, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.8 + col * 4.4;
    const y = 1.5 + row * 1.85;

    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.1, h: 1.7, fill: { color: C.card }, shadow: shadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.1, h: 0.06, fill: { color: e.color } });
    // Year badge
    s.addShape(pres.shapes.RECTANGLE, { x: x + 3.0, y: y + 0.15, w: 0.9, h: 0.3, fill: { color: e.color, transparency: 80 } });
    s.addText(e.year, {
      x: x + 3.0, y: y + 0.15, w: 0.9, h: 0.3,
      fontSize: 10, fontFace: "Consolas", bold: true, color: e.color, align: "center", valign: "middle", margin: 0
    });
    s.addText(e.title, {
      x: x + 0.2, y: y + 0.15, w: 2.8, h: 0.35,
      fontSize: 15, fontFace: "Noto Sans SC", bold: true, color: C.dark, margin: 0
    });
    s.addText(e.desc, {
      x: x + 0.2, y: y + 0.6, w: 3.7, h: 1.0,
      fontSize: 10, fontFace: "Noto Sans SC", color: C.muted, lineSpacingMultiple: 1.3, margin: 0
    });
  });

  // Footer
  s.addText("\u751f\u547d\u7684\u5965\u79d8\u8fdc\u672a\u88ab\u5b8c\u5168\u63ed\u793a\uff0c\u4f46\u859b\u5b9a\u8c14\u63d0\u4f9b\u7684\u7269\u7406-\u751f\u7269\u5b66\u6865\u6881\u601d\u7ef4\uff0c\u5c06\u7ee7\u7eed\u6307\u5bfc\u6211\u4eec\u63a2\u7d22\u8fd9\u4e2a\u590d\u6742\u800c\u7f8e\u5999\u7684\u9886\u57df\u3002", {
    x: 0.8, y: 5.2, w: 8.4, h: 0.3,
    fontSize: 10, fontFace: "Noto Sans SC", italic: true, color: C.muted, margin: 0
  });
}

// Write file
pres.writeFile({ fileName: "/Users/yuechen/home/cc-ppt/what-is-life.pptx" })
  .then(() => console.log("Done: what-is-life.pptx"))
  .catch(err => console.error(err));
