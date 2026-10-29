/* Circles and Angles — Class 10 Maths
   One simple simulation, six views: parts of a circle, angle at the centre, angle in a semicircle,
   angles in the same segment, cyclic quadrilateral, intersecting chords.  Drag the points on the circle.  Then a quiz. */

/* If anything ever breaks, show the reason on the page instead of staying blank. */
window.addEventListener("error", function (e) {
  var d = document.getElementById("ciErr");
  if (!d) {
    d = document.createElement("div"); d.id = "ciErr";
    d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99;background:#B91C1C;color:#fff;padding:10px 16px;font:14px monospace";
    document.body.appendChild(d);
  }
  d.textContent = "Circles page error: " + e.message + " (" + (e.filename || "").split("/").pop() + ":" + e.lineno + ")";
});

(function () {
  "use strict";
  const canvas = document.getElementById("ciCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const $ = (id) => document.getElementById(id);
  const modeBtns = document.querySelectorAll(".ci-mode"), partBtns = document.querySelectorAll(".ci-part");
  const hintEl = $("ciHint"), resEl = $("ciResult"), eqEl = $("ciEq"), partsRow = $("ciParts"), resetBtn = $("ciReset");

  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  const COL = { A: "#FFB03A", B: "#A78BFA", C: "#34D399", D: "#F472B6", W: "#E8ECF5", DIM: "rgba(232,236,245,0.45)", HOT: "#FB7185" };
  const KCOL = { A: COL.A, B: COL.B, C: COL.C, D: COL.D };
  const nd = (x) => ((x % 360) + 360) % 360;
  const snap = (a) => nd(Math.round(a / 10) * 10);
  const n$ = (v) => String(v).replace("-", "−");

  let W = 600, H = 400, cx = 300, cy = 200, R = 150;
  function resize() {
    const r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2; cy = H / 2; R = Math.min(W, H) / 2 - 40;
  }

  const DEF = {
    parts: { A: 20, B: 130 },
    centre: { A: 200, B: 340, C: 90 },
    semi: { C: { x: 0.342, y: 0.94 } },
    seg: { A: 210, B: 330, C: 110, D: 60 },
    cyc: { A: 100, B: 200, C: 290, D: 10 },
    chords: { A: 40, C: 150, B: 240, D: 330 },
  };
  const ORDER = { cyc: ["A", "B", "C", "D"], chords: ["A", "C", "B", "D"] };
  const MOVE = { parts: ["A", "B"], centre: ["A", "B", "C"], semi: ["C"], seg: ["A", "B", "C", "D"], cyc: ["A", "B", "C", "D"], chords: ["A", "B", "C", "D"] };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let S = clone(DEF), mode = "parts", part = "radius", drag = null;

  /* ---- geometry ---- */
  function pt(key) {
    if (mode === "semi" && key === "A") return { x: cx - R, y: cy };
    if (mode === "semi" && key === "B") return { x: cx + R, y: cy };
    if (mode === "semi" && key === "C") return { x: cx + R * S.semi.C.x, y: cy - R * S.semi.C.y };
    const a = S[mode][key] * D2R;
    return { x: cx + R * Math.cos(a), y: cy - R * Math.sin(a) };
  }
  const O = () => ({ x: cx, y: cy });
  const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
  const cm = (p, q) => dist(p, q) / R * 5;
  function angAt(v, x, y) {
    const a1 = Math.atan2(x.y - v.y, x.x - v.x), a2 = Math.atan2(y.y - v.y, y.x - v.x);
    let d = Math.abs(a1 - a2); if (d > Math.PI) d = TAU - d; return d / D2R;
  }
  const side = (a, b, p) => Math.sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x));
  function inter(p1, p2, p3, p4) {
    const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
    const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
    return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
  }

  /* ---- drawing helpers ---- */
  function line(p, q, color, w, dash) {
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
    ctx.strokeStyle = color; ctx.lineWidth = w || 2; ctx.setLineDash(dash || []); ctx.lineCap = "round"; ctx.stroke(); ctx.setLineDash([]);
  }
  function text(s, x, y, color, size, bold, align) {
    ctx.font = (bold ? "700 " : "500 ") + (size || 13) + "px Inter, system-ui, sans-serif";
    ctx.fillStyle = color || COL.W; ctx.textAlign = align || "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y);
  }
  function dot(p, color, r, label) {
    ctx.beginPath(); ctx.arc(p.x, p.y, r || 8, 0, TAU); ctx.fillStyle = color; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#1F2937"; ctx.stroke();
    if (label) {
      const dx = p.x - cx, dy = p.y - cy, l = Math.hypot(dx, dy) || 1;
      text(label, p.x + dx / l * 20, p.y + dy / l * 20, color, 15, true);
    }
  }
  function circle() {
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.strokeStyle = COL.W; ctx.lineWidth = 2.5; ctx.stroke();
  }
  /* small angle wedge at v between rays to x and y (the smaller angle); value label on the bisector */
  function wedge(v, x, y, r, color, label) {
    const a1 = Math.atan2(x.y - v.y, x.x - v.x), a2 = Math.atan2(y.y - v.y, y.x - v.x);
    const d = ((a2 - a1 + 3 * Math.PI) % TAU) - Math.PI;
    ctx.beginPath(); ctx.moveTo(v.x, v.y); ctx.arc(v.x, v.y, r, a1, a1 + d, d < 0); ctx.closePath();
    ctx.fillStyle = color + "55"; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
    if (label) { const m = a1 + d / 2; text(label, v.x + Math.cos(m) * (r + 18), v.y + Math.sin(m) * (r + 18), color, 13, true); }
  }
  /* wedge at the centre that goes the way that does NOT contain point c (can be bigger than 180) */
  function wedgeAvoid(v, x, y, c, r, color, label) {
    const sA = Math.atan2(x.y - v.y, x.x - v.x), sB = Math.atan2(y.y - v.y, y.x - v.x), sC = Math.atan2(c.y - v.y, c.x - v.x);
    const dl = ((sB - sA) % TAU + TAU) % TAU, inC = ((sC - sA) % TAU + TAU) % TAU < dl;
    ctx.beginPath(); ctx.moveTo(v.x, v.y); ctx.arc(v.x, v.y, r, sA, sB, inC); ctx.closePath();
    ctx.fillStyle = color + "44"; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
    const sweep = inC ? TAU - dl : dl, mid = inC ? sA - sweep / 2 : sA + sweep / 2;
    if (label) text(label, v.x + Math.cos(mid) * (r + 22), v.y + Math.sin(mid) * (r + 22), color, 13, true);
  }
  function minorArc(p, q) {
    const sA = Math.atan2(p.y - cy, p.x - cx), sB = Math.atan2(q.y - cy, q.x - cx);
    const dl = ((sB - sA) % TAU + TAU) % TAU;
    return dl <= Math.PI ? { s: sA, e: sB, ccw: false, mid: sA + dl / 2, deg: dl / D2R } : { s: sA, e: sB, ccw: true, mid: sA - (TAU - dl) / 2, deg: (TAU - dl) / D2R };
  }
  function rightBox(v, x, y, s) {
    const u1 = { x: x.x - v.x, y: x.y - v.y }, u2 = { x: y.x - v.x, y: y.y - v.y };
    const l1 = Math.hypot(u1.x, u1.y), l2 = Math.hypot(u2.x, u2.y);
    u1.x = u1.x / l1 * s; u1.y = u1.y / l1 * s; u2.x = u2.x / l2 * s; u2.y = u2.y / l2 * s;
    ctx.beginPath(); ctx.moveTo(v.x + u1.x, v.y + u1.y); ctx.lineTo(v.x + u1.x + u2.x, v.y + u1.y + u2.y); ctx.lineTo(v.x + u2.x, v.y + u2.y);
    ctx.strokeStyle = COL.C; ctx.lineWidth = 2; ctx.stroke();
  }

  /* ---- the six views ---- */
  const r0 = (v) => Math.round(v);
  function drawParts() {
    const A = pt("A"), B = pt("B"), o = O();
    const arc = minorArc(A, B), hot = COL.A;
    const opp = { x: 2 * cx - A.x, y: 2 * cy - A.y };
    if (part === "sector" || part === "segment") {
      ctx.beginPath();
      if (part === "sector") { ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, arc.s, arc.e, arc.ccw); }
      else { ctx.moveTo(A.x, A.y); ctx.arc(cx, cy, R, arc.s, arc.e, arc.ccw); }
      ctx.closePath(); ctx.fillStyle = hot + "55"; ctx.fill();
    }
    circle();
    if (part === "arc") { ctx.beginPath(); ctx.arc(cx, cy, R, arc.s, arc.e, arc.ccw); ctx.strokeStyle = hot; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.stroke(); }
    if (part === "radius") line(o, A, hot, 4);
    if (part === "diameter") line(A, opp, hot, 4);
    if (part === "chord") line(A, B, hot, 4);
    if (part === "sector") { line(o, A, hot, 3); line(o, B, hot, 3); }
    if (part === "segment") line(A, B, hot, 3);
    dot(o, COL.W, 5, "O");
    const names = { radius: "radius", diameter: "diameter", chord: "chord", arc: "arc", sector: "sector", segment: "segment" };
    let lp;
    if (part === "radius") lp = { x: (o.x + A.x) / 2, y: (o.y + A.y) / 2 - 14 };
    else if (part === "diameter") lp = { x: o.x, y: o.y + 22 };
    else if (part === "chord") { const my = (A.y + B.y) / 2; lp = { x: (A.x + B.x) / 2, y: my + (my < cy ? 16 : -16) }; }
    else if (part === "arc") lp = { x: cx + Math.cos(arc.mid) * (R + 26), y: cy + Math.sin(arc.mid) * (R + 26) };
    else if (part === "sector") lp = { x: cx + Math.cos(arc.mid) * R * 0.55, y: cy + Math.sin(arc.mid) * R * 0.55 };
    else lp = { x: cx + Math.cos(arc.mid) * R * 0.88, y: cy + Math.sin(arc.mid) * R * 0.88 };
    text(names[part], lp.x, lp.y, "#fff", 14, true);
    dot(A, COL.A, 8, "A");
    if (part !== "radius" && part !== "diameter") dot(B, COL.B, 8, "B");
  }
  function drawCentre() {
    const A = pt("A"), B = pt("B"), C = pt("C"), o = O();
    const insc = angAt(C, A, B), cen = 2 * r0(insc);
    circle();
    line(o, A, COL.A, 2.5); line(o, B, COL.A, 2.5); line(C, A, COL.C, 2.5); line(C, B, COL.C, 2.5);
    wedgeAvoid(o, A, B, C, 26, COL.A, cen + "°");
    wedge(C, A, B, 22, COL.C, r0(insc) + "°");
    dot(o, COL.W, 5, "O"); dot(A, COL.A, 8, "A"); dot(B, COL.B, 8, "B"); dot(C, COL.C, 8, "C");
  }
  function semiState() {
    const C = pt("C"), d = dist(C, O()) / R;
    return d > 1.01 ? "out" : d < 0.99 ? "in" : "on";
  }
  function drawSemi() {
    const A = pt("A"), B = pt("B"), C = pt("C"), o = O(), st = semiState();
    const col = st === "on" ? COL.C : st === "in" ? COL.A : COL.HOT, x = r0(angAt(C, A, B));
    circle();
    line(A, B, COL.W, 2.5); line(C, A, col, 2.5); line(C, B, col, 2.5);
    if (st === "on") rightBox(C, A, B, 14);
    wedge(C, A, B, 22, col, x + "°");
    dot(o, COL.W, 5, "O"); dot(A, COL.A, 8, "A"); dot(B, COL.B, 8, "B"); dot(C, col, 9, "C");
  }
  function drawSeg() {
    const A = pt("A"), B = pt("B"), C = pt("C"), D = pt("D");
    circle();
    line(A, B, COL.W, 2.5);
    line(C, A, COL.C, 2); line(C, B, COL.C, 2); line(D, A, COL.D, 2); line(D, B, COL.D, 2);
    wedge(C, A, B, 22, COL.C, r0(angAt(C, A, B)) + "°");
    wedge(D, A, B, 36, COL.D, r0(angAt(D, A, B)) + "°");
    dot(A, COL.A, 8, "A"); dot(B, COL.B, 8, "B"); dot(C, COL.C, 8, "C"); dot(D, COL.D, 8, "D");
  }
  function drawCyc() {
    const P = ["A", "B", "C", "D"].map(pt);
    circle();
    ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath();
    ctx.fillStyle = "rgba(167,139,250,0.14)"; ctx.fill(); ctx.strokeStyle = COL.W; ctx.lineWidth = 2.5; ctx.stroke();
    ["A", "B", "C", "D"].forEach((k, i) => {
      const v = P[i], prev = P[(i + 3) % 4], next = P[(i + 1) % 4];
      wedge(v, prev, next, 22, KCOL[k], r0(angAt(v, prev, next)) + "°");
    });
    const E = { x: P[2].x + (P[2].x - P[1].x) * 0.35, y: P[2].y + (P[2].y - P[1].y) * 0.35 };
    line(P[2], E, COL.HOT, 2, [5, 4]);
    wedge(P[2], E, P[3], 30, COL.HOT, r0(180 - angAt(P[2], P[1], P[3])) + "°");
    ["A", "B", "C", "D"].forEach((k, i) => dot(P[i], KCOL[k], 8, k));
  }
  function drawChords() {
    const A = pt("A"), B = pt("B"), C = pt("C"), D = pt("D"), P = inter(A, B, C, D);
    circle();
    line(A, B, COL.A, 3); line(C, D, COL.C, 3);
    dot(P, COL.W, 5);
    text("P", P.x + 14, P.y - 12, COL.W, 15, true);
    dot(A, COL.A, 8, "A"); dot(B, COL.A, 8, "B"); dot(C, COL.C, 8, "C"); dot(D, COL.C, 8, "D");
  }
  const DRAW = { parts: drawParts, centre: drawCentre, semi: drawSemi, seg: drawSeg, cyc: drawCyc, chords: drawChords };
  function draw() {
    ctx.clearRect(0, 0, W, H);
    DRAW[mode]();
    if (!drag) text("Drag the coloured points", W / 2, H - 14, COL.DIM, 12, false);
  }

  /* ---- words under the picture ---- */
  const L = (cls, t) => '<div class="line ' + cls + '">' + t + "</div>";
  const PART_TXT = {
    radius: ["Radius", "A line from the centre to the circle."],
    diameter: ["Diameter", "A line through the centre, from one side of the circle to the other. Diameter = 2 × radius."],
    chord: ["Chord", "A line joining two points on the circle. The diameter is the longest chord."],
    arc: ["Arc", "A part of the circle itself, between two points."],
    sector: ["Sector", "The slice between two radii and the arc, like a slice of pizza."],
    segment: ["Segment", "The part cut off by a chord, between the chord and the arc."],
  };
  const EQ = {
    parts: ["diameter = 2 × radius", "The diameter is the longest chord"],
    centre: ["Angle at the centre = 2 × angle at the circumference", "∠AOB = 2 × ∠ACB  (same arc AB)"],
    semi: ["Angle in a semicircle = 90°", "C on the circle: 90°   ·   C inside: more than 90°   ·   C outside: less than 90°"],
    seg: ["Angles in the same segment are equal", "∠ACB = ∠ADB  (C and D on the same side of AB)"],
    cyc: ["Opposite angles of a cyclic quadrilateral add up to 180°", "∠A + ∠C = 180°   and   ∠B + ∠D = 180°   ·   Outside angle = opposite inside angle"],
    chords: ["PA × PB = PC × PD", "Two chords cut at P inside the circle"],
  };
  const HINT = {
    parts: "Choose a part. Drag A and B to change its size.",
    centre: "Drag A, B or C. Look at the angle at the centre and the angle at C.",
    semi: "AB is a diameter. Drag C onto the circle, then inside it, then outside it. Watch the angle at C.",
    seg: "Drag C and D. When they are on the same side of AB, what do you notice?",
    cyc: "Drag the four points. Add up the opposite angles.",
    chords: "Drag the points. Multiply the two parts of each chord.",
  };
  function explain() {
    const r = [];
    if (mode === "parts") {
      const t = PART_TXT[part], A = pt("A"), B = pt("B");
      r.push(L("known", t[0] + ":  " + t[1]));
      r.push(L("note", "Radius = 5 cm,  diameter = 10 cm"));
      r.push(L("note", "More: a diameter cuts the circle into two equal halves, called semicircles."));
      if (part === "arc" || part === "sector") r.push(L("found", "Angle AOB = " + r0(minorArc(A, B).deg) + "°"));
      if (part === "chord") r.push(L("found", "Chord AB = " + cm(A, B).toFixed(1) + " cm"));
    } else if (mode === "centre") {
      const A = pt("A"), B = pt("B"), C = pt("C"), x = r0(angAt(C, A, B));
      r.push(L("known", "Angle at the circumference  ∠ACB = " + x + "°"));
      r.push(L("known", "Angle at the centre  ∠AOB = " + 2 * x + "°"));
      r.push(L("found", 2 * x + " = 2 × " + x + "   ✓"));
      r.push(L("note", "Move C along the same arc. ∠ACB does not change, because it stands on the same arc AB."));
      if (2 * x > 180) r.push(L("note", "More: C is on the small arc, so the angle at the centre (on the big arc) is more than 180°, and ∠ACB is more than 90°."));
      else if (2 * x === 180) r.push(L("note", "More: AB is a diameter here, so ∠AOB = 180° and ∠ACB = 90°."));
      else r.push(L("note", "More: when the angle at the centre is 180° (AB is a diameter), the angle at the circumference is 90°."));
    } else if (mode === "semi") {
      const A = pt("A"), B = pt("B"), C = pt("C"), st = semiState(), x = r0(angAt(C, A, B));
      if (st === "on") {
        const a = r0(angAt(A, B, C)), b = r0(angAt(B, A, C));
        r.push(L("found", "C is ON the circle:  ∠ACB = 90°  (always)"));
        r.push(L("known", "∠CAB = " + a + "°,   ∠CBA = " + b + "°"));
        r.push(L("note", a + " + " + b + " + 90 = 180   (angles of a triangle)"));
      } else if (st === "in") {
        r.push(L("found", "C is INSIDE the circle:  ∠ACB = " + x + "°,  more than 90°"));
        r.push(L("note", "The lines AC and BC stop before the circle, so they open out wider."));
      } else {
        r.push(L("found", "C is OUTSIDE the circle:  ∠ACB = " + x + "°,  less than 90°"));
        r.push(L("note", "The lines AC and BC reach out past the circle, so they close in narrower."));
      }
      r.push(L("note", "Drag C onto the circle again and the angle goes back to exactly 90°."));
    } else if (mode === "seg") {
      const A = pt("A"), B = pt("B"), C = pt("C"), D = pt("D"), x = r0(angAt(C, A, B)), y = r0(angAt(D, A, B));
      r.push(L("known", "∠ACB = " + x + "°,   ∠ADB = " + y + "°"));
      if (side(A, B, C) === side(A, B, D)) r.push(L("found", "C and D are on the same side of AB, so the angles are equal: " + x + "° = " + y + "°"));
      else r.push(L("found", "C and D are on opposite sides of AB, so the angles add up to 180°: " + x + " + " + y + " = " + (x + y)));
      r.push(L("note", "More: a point inside the circle sees AB at a bigger angle, a point outside sees it smaller."));
    } else if (mode === "cyc") {
      const P = ["A", "B", "C", "D"].map(pt), v = P.map((p, i) => r0(angAt(p, P[(i + 3) % 4], P[(i + 1) % 4])));
      r.push(L("known", "∠A = " + v[0] + "°,  ∠B = " + v[1] + "°,  ∠C = " + v[2] + "°,  ∠D = " + v[3] + "°"));
      r.push(L("found", "∠A + ∠C = " + v[0] + " + " + v[2] + " = " + (v[0] + v[2]) + "°"));
      r.push(L("found", "∠B + ∠D = " + v[1] + " + " + v[3] + " = " + (v[1] + v[3]) + "°"));
      r.push(L("note", "All four angles together = " + (v[0] + v[1] + v[2] + v[3]) + "°"));
      r.push(L("found", "More: extend BC beyond C. The outside angle at C = 180 − " + v[2] + " = " + (180 - v[2]) + "° = ∠A (the opposite inside angle)"));
    } else {
      const A = pt("A"), B = pt("B"), C = pt("C"), D = pt("D"), P = inter(A, B, C, D);
      const pa = cm(P, A), pb = cm(P, B), pc = cm(P, C), pd = cm(P, D), f = (v) => v.toFixed(1);
      r.push(L("known", "PA = " + f(pa) + ",  PB = " + f(pb) + ",  PC = " + f(pc) + ",  PD = " + f(pd) + "   (cm)"));
      r.push(L("found", "PA × PB = " + f(pa) + " × " + f(pb) + " = " + f(pa * pb)));
      r.push(L("found", "PC × PD = " + f(pc) + " × " + f(pd) + " = " + f(pc * pd)));
      r.push(L("note", "They are equal."));
      r.push(L("note", "More: if both chords pass through the centre, PA = PB = PC = PD = 5 cm, and 5 × 5 = 5 × 5."));
    }
    resEl.innerHTML = r.join("");
  }
  function update() {
    modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
    partBtns.forEach((b) => b.classList.toggle("active", b.dataset.part === part));
    partsRow.hidden = mode !== "parts";
    hintEl.textContent = HINT[mode];
    eqEl.innerHTML = '<div class="eq-title">Important equation</div><div class="eq1">' + EQ[mode][0] + '</div><div class="eq2">' + EQ[mode][1] + "</div>";
    draw(); explain();
  }

  /* ---- dragging ---- */
  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  canvas.addEventListener("pointerdown", (e) => {
    const p = pos(e); let best = null, bd = 30;
    MOVE[mode].forEach((k) => { const d = dist(p, pt(k)); if (d < bd) { bd = d; best = k; } });
    if (best) { drag = best; canvas.setPointerCapture(e.pointerId); }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const p = pos(e);
    if (mode === "semi") {
      let x = (p.x - cx) / R, y = (cy - p.y) / R, d = Math.hypot(x, y) || 1;
      if (Math.abs(d - 1) < 0.05) { x /= d; y /= d; d = 1; }
      if (d > 1.7) { x = x / d * 1.7; y = y / d * 1.7; }
      if (Math.abs(y) < 0.08) y = (y < 0 ? -1 : 1) * 0.08;
      S.semi.C = { x: x, y: y }; update(); return;
    }
    let a = snap(Math.atan2(cy - p.y, p.x - cx) / D2R);
    const ord = ORDER[mode];
    if (ord) {
      const i = ord.indexOf(drag), prev = ord[(i + 3) % 4], next = ord[(i + 1) % 4];
      const span = nd(S[mode][next] - S[mode][prev]); let off = nd(a - S[mode][prev]);
      if (span < 40) return;
      if (off > span) off = (360 - off) < (off - span) ? 20 : span - 20;
      off = Math.max(20, Math.min(span - 20, off));
      a = nd(S[mode][prev] + off);
    }
    S[mode][drag] = a; update();
  });
  const stop = () => { drag = null; draw(); };
  canvas.addEventListener("pointerup", stop); canvas.addEventListener("pointercancel", stop);

  modeBtns.forEach((b) => b.addEventListener("click", () => { mode = b.dataset.mode; update(); }));
  partBtns.forEach((b) => b.addEventListener("click", () => { part = b.dataset.part; update(); }));
  resetBtn.addEventListener("click", () => { S = clone(DEF); update(); });
  window.addEventListener("resize", () => { resize(); update(); });
  resize(); update();
  window.__ci = { mode: (m) => { mode = m; update(); }, part: (p) => { part = p; update(); }, set: (k, a) => { S[mode][k] = a; update(); }, semi: (x, y) => { S.semi.C = { x: x, y: y }; update(); }, text: () => resEl.textContent, pt };
})();

/* ---------- Quiz ---------- */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;
  const questions = [
    { q: "O is the centre of a circle. The angle at the circumference on an arc is 70°. What is the angle at the centre on the same arc?",
      options: ["35°", "70°", "140°", "110°"], answer: 2,
      explain: "The angle at the centre is twice the angle at the circumference: 2 × 70° = 140°." },
    { q: "The angle at the centre on an arc is 100°. What is the angle at the circumference on the same arc?",
      options: ["200°", "50°", "100°", "80°"], answer: 1,
      explain: "The angle at the circumference is half the angle at the centre: 100° ÷ 2 = 50°." },
    { q: "AB is a diameter of a circle and C is a point on the circle. What is the measure of angle ACB?",
      options: ["45°", "60°", "180°", "90°"], answer: 3,
      explain: "The angle in a semicircle is always 90°." },
    { q: "AB is a diameter and C is a point on the circle. If ∠CAB = 35°, what is ∠ABC?",
      options: ["55°", "35°", "90°", "145°"], answer: 0,
      explain: "∠ACB = 90° (semicircle). So ∠ABC = 180° − 90° − 35° = 55°." },
    { q: "C and D are on the same side of chord AB. If ∠ACB = 40°, what is ∠ADB?",
      options: ["80°", "140°", "20°", "40°"], answer: 3,
      explain: "Angles in the same segment are equal. So ∠ADB = 40°." },
    { q: "ABCD is a cyclic quadrilateral. If ∠C = 110°, what is ∠A?",
      options: ["70°", "110°", "90°", "250°"], answer: 0,
      explain: "Opposite angles of a cyclic quadrilateral add up to 180°. ∠A = 180° − 110° = 70°." },
    { q: "Chords AB and CD meet at P inside a circle. PA = 6, PB = 4 and PC = 3. What is PD?",
      options: ["8", "2", "12", "5"], answer: 0,
      explain: "PA × PB = PC × PD, so 6 × 4 = 3 × PD. PD = 24 ÷ 3 = 8." },
    { q: "AB is a diameter and C is a point INSIDE the circle. Which is true about angle ACB?",
      options: ["It is exactly 90°", "It is more than 90°", "It is less than 90°", "It is 180°"], answer: 1,
      explain: "On the circle the angle is 90°. Inside the circle the lines open out wider, so the angle is more than 90°. Outside, it is less than 90°." },
    { q: "ABCD is a cyclic quadrilateral with ∠A = 70°. The side BC is extended beyond C. What is the outside angle at C?",
      options: ["110°", "20°", "90°", "70°"], answer: 3,
      explain: "Outside angle at C = 180° − ∠C. And ∠C = 180° − ∠A = 110°. So the outside angle = 70°, the same as the opposite inside angle ∠A." },
    { q: "AB is a diameter of length 10 cm. C is on the circle and AC = 6 cm. What is BC?",
      options: ["4 cm", "8 cm", "6 cm", "16 cm"], answer: 1,
      explain: "∠ACB = 90°, so BC² = 10² − 6² = 64. BC = 8 cm." },

  ];
  let current = 0, score = 0, answered = false;
  function renderQuestion() {
    answered = false;
    const total = questions.length, q = questions[current];
    shell.innerHTML = `
      <div class="game-shell-header">
        <span class="score-pill">Question ${current + 1} / ${total}</span>
        <div class="progress-track"><div class="progress-fill" style="width:${Math.round((current / total) * 100)}%"></div></div>
        <span class="score-pill">Score: ${score}</span>
      </div>
      <div class="quiz-question"></div>
      <div class="quiz-options" id="optionsWrap"></div>
      <div class="quiz-feedback" id="feedback"></div>
      <div class="quiz-next" id="nextWrap"></div>`;
    shell.querySelector(".quiz-question").textContent = q.q;
    const wrap = document.getElementById("optionsWrap");
    q.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "quiz-option"; b.textContent = opt;
      b.addEventListener("click", () => selectAnswer(i));
      wrap.appendChild(b);
    });
  }
  function selectAnswer(i) {
    if (answered) return;
    answered = true;
    const q = questions[current], bs = document.querySelectorAll(".quiz-option");
    bs.forEach((b) => (b.disabled = true));
    if (i === q.answer) { score++; bs[i].classList.add("correct"); }
    else { bs[i].classList.add("wrong"); bs[q.answer].classList.add("correct"); }
    const fb = document.getElementById("feedback");
    fb.textContent = q.explain; fb.classList.add("show");
    const last = current === questions.length - 1;
    const nb = document.createElement("button");
    nb.className = "btn btn-primary"; nb.textContent = last ? "See results" : "Next question →";
    nb.addEventListener("click", () => { current++; if (current >= questions.length) renderResults(); else renderQuestion(); });
    document.getElementById("nextWrap").appendChild(nb);
  }
  function renderResults() {
    const total = questions.length, pct = Math.round((score / total) * 100);
    let v = "Nice start. Play with the simulation above again and retry.";
    if (pct >= 80) v = "Excellent! You can handle circles and angles.";
    else if (pct >= 50) v = "Good work. One more go with the sliders and you've got it.";
    shell.innerHTML = `
      <div class="result-screen">
        <span class="eyebrow" style="justify-content:center;">RESULTS</span>
        <div class="big-score">${score} / ${total}</div>
        <p>${v}</p>
        <div class="result-actions">
          <button class="btn btn-primary" id="retryBtn">Try again</button>
          <a class="btn btn-dark" href="subject.html?class=10&subject=maths">Back to Maths chapters</a>
        </div>
      </div>`;
    document.getElementById("retryBtn").addEventListener("click", () => { current = 0; score = 0; renderQuestion(); });
  }
  renderQuestion();
})();