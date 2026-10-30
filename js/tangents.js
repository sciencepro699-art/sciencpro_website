/* Tangents — Class 10 Maths
   One simple simulation, five views: tangent and radius, two tangents from a point, PA × PB = PC²,
   a quadrilateral around a circle, a circle inside a triangle.  Drag the coloured points.  Then a quiz. */

/* If anything ever breaks, show the reason on the page instead of staying blank. */
window.addEventListener("error", function (e) {
  var d = document.getElementById("tgErr");
  if (!d) {
    d = document.createElement("div"); d.id = "tgErr";
    d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99;background:#B91C1C;color:#fff;padding:10px 16px;font:14px monospace";
    document.body.appendChild(d);
  }
  d.textContent = "Tangents page error: " + e.message + " (" + (e.filename || "").split("/").pop() + ":" + e.lineno + ")";
});

(function () {
  "use strict";
  const canvas = document.getElementById("tgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const $ = (id) => document.getElementById(id);
  const modeBtns = document.querySelectorAll(".tg-mode");
  const hintEl = $("tgHint"), resEl = $("tgResult"), eqEl = $("tgEq"), resetBtn = $("tgReset");

  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  const COL = { A: "#FFB03A", B: "#A78BFA", C: "#34D399", D: "#F472B6", W: "#E8ECF5", DIM: "rgba(232,236,245,0.45)", HOT: "#FB7185", TAN: "#38BDF8" };
  const nd = (x) => ((x % 360) + 360) % 360;
  const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, "");
  const r0 = (v) => Math.round(v);

  /* W, H = canvas size.  O = circle centre.  r = circle radius in pixels.  rcm = what that radius is in cm. */
  let W = 600, H = 400, cx = 300, cy = 200, r = 150, rcm = 5;
  function resize() {
    const b = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    W = b.width; H = b.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const m = () => Math.min(W, H);
  /* set the circle for the current mode */
  function layout() {
    if (mode === "perp") { cx = W / 2; cy = H / 2; r = m() / 2 - 60; rcm = 5; }
    else if (mode === "two" || mode === "sec") { r = m() * 0.2; rcm = 3; cy = H / 2; cx = Math.max(r + 40, m() * 0.32); }
    else if (mode === "quad") { cx = W / 2; cy = H / 2; r = m() * 0.22; rcm = 3; }
  }

  /* ---- state (angles in degrees, y up; P in units of r) ---- */
  const DEF = {
    perp: { T: 40 },
    two: { P: { x: 2.4, y: 0.0 } },
    sec: { P: { x: 2.6, y: 0.7 }, B: 168 },
    quad: { T: [20, 110, 200, 300] },
    inc: { A: { x: 1, y: 1 }, B: { x: 9, y: 1 }, C: { x: 1, y: 7 } },
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let S = clone(DEF), mode = "perp", drag = null;

  /* ---- geometry ---- */
  const O = () => ({ x: cx, y: cy });
  const onC = (deg) => ({ x: cx + r * Math.cos(deg * D2R), y: cy - r * Math.sin(deg * D2R) });
  const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
  const cmOf = (px) => px / r * rcm;
  function outPt(P) {
    /* S.two.P / S.sec.P stored in units of r; keep it on the canvas and outside the circle */
    let x = cx + P.x * r, y = cy - P.y * r;
    x = Math.max(20, Math.min(W - 20, x)); y = Math.max(20, Math.min(H - 20, y));
    let dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
    if (d < r * 1.25) { const k = r * 1.25 / (d || 1); dx = (d ? dx : 1) * k; dy *= k; x = cx + dx; y = cy + dy; }
    return { x: x, y: y };
  }
  /* the two tangent points from P */
  function tangPts(P) {
    const d = dist(P, O()), phi = Math.atan2(cy - P.y, P.x - cx) / D2R, al = Math.acos(r / d) / D2R;
    return { a: onC(phi + al), b: onC(phi - al), alpha: al, d: d };
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
  /* a dot; the label is pushed away from (ax, ay) */
  function dot(p, color, rad, label, ax, ay) {
    ctx.beginPath(); ctx.arc(p.x, p.y, rad || 8, 0, TAU); ctx.fillStyle = color; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#1F2937"; ctx.stroke();
    if (label) {
      const dx = p.x - (ax === undefined ? cx : ax), dy = p.y - (ay === undefined ? cy : ay), l = Math.hypot(dx, dy) || 1;
      text(label, p.x + dx / l * 20, p.y + dy / l * 20, color, 15, true);
    }
  }
  function circle() { ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.strokeStyle = COL.W; ctx.lineWidth = 2.5; ctx.stroke(); }
  function rightBox(v, x, y, s) {
    const u1 = { x: x.x - v.x, y: x.y - v.y }, u2 = { x: y.x - v.x, y: y.y - v.y };
    const l1 = Math.hypot(u1.x, u1.y), l2 = Math.hypot(u2.x, u2.y);
    u1.x = u1.x / l1 * s; u1.y = u1.y / l1 * s; u2.x = u2.x / l2 * s; u2.y = u2.y / l2 * s;
    ctx.beginPath(); ctx.moveTo(v.x + u1.x, v.y + u1.y); ctx.lineTo(v.x + u1.x + u2.x, v.y + u1.y + u2.y); ctx.lineTo(v.x + u2.x, v.y + u2.y);
    ctx.strokeStyle = COL.C; ctx.lineWidth = 2; ctx.stroke();
  }
  /* angle wedge at v between rays to x and y (the smaller angle) */
  function wedge(v, x, y, rad, color, label) {
    const a1 = Math.atan2(x.y - v.y, x.x - v.x), a2 = Math.atan2(y.y - v.y, y.x - v.x);
    const d = ((a2 - a1 + 3 * Math.PI) % TAU) - Math.PI;
    ctx.beginPath(); ctx.moveTo(v.x, v.y); ctx.arc(v.x, v.y, rad, a1, a1 + d, d < 0); ctx.closePath();
    ctx.fillStyle = color + "55"; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
    if (label) { const mm = a1 + d / 2; text(label, v.x + Math.cos(mm) * (rad + 20), v.y + Math.sin(mm) * (rad + 20), color, 13, true); }
  }
  /* two small tick marks across the middle of a segment (says "these two are equal") */
  function tick(p, q, color) {
    const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2, l = dist(p, q) || 1, nx = -(q.y - p.y) / l * 7, ny = (q.x - p.x) / l * 7, ux = (q.x - p.x) / l * 3, uy = (q.y - p.y) / l * 3;
    [-1, 1].forEach((s) => line({ x: mx + nx + ux * s, y: my + ny + uy * s }, { x: mx - nx + ux * s, y: my - ny + uy * s }, color, 2));
  }
  /* a long line through p and q (for tangents), clipped by the canvas itself */
  function longLine(p, q, color, w) {
    const l = dist(p, q) || 1, ux = (q.x - p.x) / l, uy = (q.y - p.y) / l, k = W + H;
    line({ x: p.x - ux * k, y: p.y - uy * k }, { x: p.x + ux * k, y: p.y + uy * k }, color, w || 2);
  }

  /* ---- the five views ---- */
  function drawPerp() {
    const T = onC(S.perp.T), o = O();
    const tx = -Math.sin(S.perp.T * D2R), ty = -Math.cos(S.perp.T * D2R);   /* direction of the tangent on screen */
    circle();
    longLine(T, { x: T.x + tx, y: T.y + ty }, COL.TAN, 3);
    line(o, T, COL.A, 4);
    rightBox(T, o, { x: T.x + tx * 40, y: T.y + ty * 40 }, 14);
    dot(o, COL.W, 5);
    text("O", cx - 16, cy + 14, COL.W, 14, true);
    dot(T, COL.A, 9, "T");
    text("tangent", T.x + tx * 70 + (tx > 0 ? 0 : 0), T.y + ty * 70, COL.TAN, 13, true);
    text("90°", T.x + (o.x - T.x) * 0.16 + tx * 28, T.y + (o.y - T.y) * 0.16 + ty * 28, COL.C, 13, true);
  }
  function drawTwo() {
    const P = outPt(S.two.P), t = tangPts(P), o = O();
    circle();
    line(o, P, COL.DIM, 1.5, [6, 5]);
    line(o, t.a, COL.W, 2); line(o, t.b, COL.W, 2);
    line(P, t.a, COL.TAN, 3.5); line(P, t.b, COL.TAN, 3.5);
    rightBox(t.a, o, P, 12); rightBox(t.b, o, P, 12);
    tick(P, t.a, COL.TAN); tick(P, t.b, COL.TAN);
    wedge(o, t.a, t.b, 28, COL.A, Math.round(2 * t.alpha) + "°");
    wedge(P, t.a, t.b, 34, COL.D, (180 - Math.round(2 * t.alpha)) + "°");
    dot(o, COL.W, 5); text("O", cx - 14, cy + 14, COL.W, 14, true);
    dot(t.a, COL.A, 7, "A"); dot(t.b, COL.B, 7, "B");
    dot(P, COL.D, 10, "P", cx, cy);
  }
  /* secant geometry: P, the tangent point C, and the two points where the secant cuts the circle */
  function secGeo() {
    const P = outPt(S.sec.P), t = tangPts(P), Bp = onC(S.sec.B);
    const C = t.a.y < t.b.y ? t.a : t.b;                       /* the upper tangent point */
    const l = dist(P, Bp) || 1, ux = (Bp.x - P.x) / l, uy = (Bp.y - P.y) / l;
    const t0 = (cx - P.x) * ux + (cy - P.y) * uy, disc = Math.max(0, t0 * t0 - (t.d * t.d - r * r));
    const n1 = t0 - Math.sqrt(disc), n2 = t0 + Math.sqrt(disc);
    return { P: P, C: C, d: t.d, near: { x: P.x + ux * n1, y: P.y + uy * n1 }, far: { x: P.x + ux * n2, y: P.y + uy * n2 }, pa: n1, pb: n2, pc: Math.sqrt(Math.max(0, t.d * t.d - r * r)), Bp: Bp };
  }
  function drawSec() {
    const g = secGeo(), o = O();
    circle();
    line(g.P, g.far, COL.A, 3.5);
    line(g.P, g.C, COL.TAN, 3.5);
    dot(o, COL.W, 5); text("O", cx - 14, cy + 14, COL.W, 14, true);
    dot(g.C, COL.C, 7, "C");
    dot(g.near, COL.A, 6, "A", g.P.x, g.P.y); dot(g.far, COL.A, 6, "B", g.P.x, g.P.y);
    dot(g.P, COL.D, 10, "P", cx, cy);
    /* ring on the point you drag */
    const hp = g.Bp; ctx.beginPath(); ctx.arc(hp.x, hp.y, 13, 0, TAU); ctx.strokeStyle = COL.HOT; ctx.lineWidth = 2; ctx.stroke();
  }
  /* quadrilateral around a circle */
  const QN = ["A", "B", "C", "D"], QCOL = [COL.A, COL.B, COL.C, COL.D];
  function quadGeo() {
    const T = S.quad.T, out = { V: [], len: [], gap: [] };
    /* vertex k sits between tangent points k-1 and k, so: A between T4,T1 ; B between T1,T2 ; C between T2,T3 ; D between T3,T4 */
    for (let k = 0; k < 4; k++) {
      const a0 = T[(k + 3) % 4], a1 = T[k], g = nd(a1 - a0), mid = a0 + g / 2;
      out.gap.push(g);
      out.V.push({ x: cx + r / Math.cos(g / 2 * D2R) * Math.cos(mid * D2R), y: cy - r / Math.cos(g / 2 * D2R) * Math.sin(mid * D2R) });
      out.len.push(rcm * Math.tan(g / 2 * D2R));
    }
    return out;
  }
  function drawQuad() {
    const q = quadGeo(), o = O();
    ctx.beginPath(); q.V.forEach((v, i) => (i ? ctx.lineTo(v.x, v.y) : ctx.moveTo(v.x, v.y))); ctx.closePath();
    ctx.fillStyle = "rgba(56,189,248,0.10)"; ctx.fill(); ctx.strokeStyle = COL.TAN; ctx.lineWidth = 3; ctx.stroke();
    circle();
    S.quad.T.forEach((a, i) => line(o, onC(a), COL.DIM, 1.2, [5, 5]));
    /* tangent lengths, written on both pieces from each corner */
    q.V.forEach((v, k) => {
      const tPrev = onC(S.quad.T[(k + 3) % 4]), tNext = onC(S.quad.T[k]), col = QCOL[k], L = f1(q.len[k]);
      [tPrev, tNext].forEach((tp) => {
        const mx = (v.x + tp.x) / 2, my = (v.y + tp.y) / 2, dx = mx - cx, dy = my - cy, l = Math.hypot(dx, dy) || 1;
        text(L, mx + dx / l * 13, my + dy / l * 13, col, 12, true);
      });
    });
    q.V.forEach((v, k) => dot(v, QCOL[k], 6, QN[k]));
    dot(o, COL.W, 4);
    S.quad.T.forEach((a) => dot(onC(a), COL.W, 8, null));
  }
  /* circle inside a triangle */
  const U = () => Math.min(W / 10.5, H / 8.6);
  const toPx = (p) => ({ x: (W - 8.8 * U()) / 2 + (p.x - 0.5) * U() + 0, y: H - 0.55 * U() - (p.y - 0.3) * U() - 12 });
  const fromPx = (p) => ({ x: (p.x - (W - 8.8 * U()) / 2) / U() + 0.5, y: (H - 12 - 0.55 * U() - p.y) / U() + 0.3 });
  function incGeo() {
    const A = S.inc.A, B = S.inc.B, C = S.inc.C;
    const a = Math.hypot(B.x - C.x, B.y - C.y), b = Math.hypot(C.x - A.x, C.y - A.y), c = Math.hypot(A.x - B.x, A.y - B.y);
    const s = (a + b + c) / 2, area = Math.abs((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) / 2;
    const ok = area > 0.4;
    const rr = ok ? area / s : 0;
    const I = ok ? { x: (a * A.x + b * B.x + c * C.x) / (a + b + c), y: (a * A.y + b * B.y + c * C.y) / (a + b + c) } : null;
    return { a: a, b: b, c: c, s: s, area: area, ok: ok, r: rr, I: I };
  }
  function foot(P, Q, I) {
    const dx = Q.x - P.x, dy = Q.y - P.y, t = ((I.x - P.x) * dx + (I.y - P.y) * dy) / (dx * dx + dy * dy);
    return { x: P.x + t * dx, y: P.y + t * dy };
  }
  function drawInc() {
    const g = incGeo(), u = U();
    /* a quiet dot grid, 1 cm apart */
    for (let i = 0; i <= 10; i++) for (let j = 0; j <= 8; j++) { const p = toPx({ x: i, y: j }); ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, TAU); ctx.fillStyle = "rgba(232,236,245,0.18)"; ctx.fill(); }
    const A = toPx(S.inc.A), B = toPx(S.inc.B), C = toPx(S.inc.C);
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath();
    ctx.fillStyle = "rgba(56,189,248,0.08)"; ctx.fill(); ctx.strokeStyle = COL.TAN; ctx.lineWidth = 3; ctx.stroke();
    if (g.ok) {
      const I = toPx(g.I), rp = g.r * u;
      ctx.beginPath(); ctx.arc(I.x, I.y, rp, 0, TAU); ctx.strokeStyle = COL.W; ctx.lineWidth = 2.5; ctx.stroke();
      const eA = foot(B, C, I), eB = foot(C, A, I), eC = foot(A, B, I);
      [eA, eB, eC].forEach((e) => line(I, e, COL.DIM, 1.3, [5, 5]));
      [eA, eB, eC].forEach((e) => dot(e, COL.W, 4));
      dot(I, COL.W, 4);
      /* tangent lengths from each corner: A → s−a, B → s−b, C → s−c  (written on the sides) */
      const tl = [[A, eC, eB, g.s - g.a, COL.A], [B, eA, eC, g.s - g.b, COL.B], [C, eB, eA, g.s - g.c, COL.C]];
      tl.forEach((t) => [t[1], t[2]].forEach((e) => {
        const mx = (t[0].x + e.x) / 2, my = (t[0].y + e.y) / 2, dx = mx - I.x, dy = my - I.y, l = Math.hypot(dx, dy) || 1;
        text(f1(t[3]), mx + dx / l * 13, my + dy / l * 13, t[4], 12, true);
      }));
    } else text("Move a point so the three points make a triangle", W / 2, 24, COL.HOT, 13, true);
    const cen = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
    dot(A, COL.A, 8, "A", cen.x, cen.y); dot(B, COL.B, 8, "B", cen.x, cen.y); dot(C, COL.C, 8, "C", cen.x, cen.y);
  }
  const DRAW = { perp: drawPerp, two: drawTwo, sec: drawSec, quad: drawQuad, inc: drawInc };

  function draw() {
    layout();
    ctx.clearRect(0, 0, W, H);
    DRAW[mode]();
    if (!drag) text("Drag the coloured points", W / 2, H - 14, COL.DIM, 12, false);
  }

  /* ---- words under the picture ---- */
  const L = (cls, t) => '<div class="line ' + cls + '">' + t + "</div>";
  const EQ = {
    perp: ["A tangent is at right angles to the radius at the point of contact", "∠OTP = 90°   ·   the tangent touches the circle at only one point"],
    two: ["Tangents from an outside point are equal:  PA = PB", "∠AOB + ∠APB = 180°"],
    sec: ["PA × PB = PC²", "P is outside the circle.  PC is the tangent, and P-A-B is a line cutting the circle"],
    quad: ["AB + CD = BC + DA", "The tangent lengths from one corner are equal, so write them as a, b, c, d"],
    inc: ["r = Area ÷ s", "s = (a + b + c) ÷ 2   ·   Area = √( s (s − a)(s − b)(s − c) )   ·   tangent length from a corner = s − (opposite side)"],
  };
  const HINT = {
    perp: "Drag T round the circle. Look at the angle between the radius and the tangent.",
    two: "Drag P. Look at PA and PB, and at the two angles.",
    sec: "Drag P, and drag the ringed point on the circle to turn the line PAB. Multiply PA × PB.",
    quad: "Drag the white points on the circle. The corners move, but the sides still touch the circle.",
    inc: "Drag the corners A, B, C. A circle fits inside the triangle every time.",
  };
  function explain() {
    const t = [];
    if (mode === "perp") {
      t.push(L("found", "∠OTP = 90°   (always)"));
      t.push(L("known", "Turn T all the way round. The angle between the radius OT and the tangent never changes."));
      t.push(L("note", "More: every other point on the tangent line is outside the circle, so the radius OT is the shortest line from O to the tangent."));
      t.push(L("note", "More: so if you know a tangent, draw the radius to the touching point and you get a right angle."));
    } else if (mode === "two") {
      const P = outPt(S.two.P), tg = tangPts(P), x = r0(2 * tg.alpha), dcm = cmOf(tg.d), pa = Math.sqrt(Math.max(0, dcm * dcm - rcm * rcm));
      t.push(L("known", "Radius = " + rcm + " cm,   OP = " + f1(dcm) + " cm"));
      t.push(L("found", "PA = " + f1(pa) + " cm,   PB = " + f1(pa) + " cm   →  equal"));
      t.push(L("found", "∠AOB = " + x + "°,   ∠APB = " + (180 - x) + "°   →   " + x + " + " + (180 - x) + " = 180"));
      t.push(L("note", "More: OA ⟂ PA and OB ⟂ PB. In the four-sided shape OAPB, 90 + 90 + " + x + " + " + (180 - x) + " = 360."));
      t.push(L("note", "More: bring P closer and the angle at P gets bigger. Take P far away and it gets smaller."));
    } else if (mode === "sec") {
      const g = secGeo(), pa = cmOf(g.pa), pb = cmOf(g.pb), pc = cmOf(g.pc);
      t.push(L("known", "PA = " + f1(pa) + ",   PB = " + f1(pb) + ",   PC = " + f1(pc) + "   (cm)"));
      t.push(L("found", "PA × PB = " + f1(pa) + " × " + f1(pb) + " ≈ " + f1(pa * pb)));
      t.push(L("found", "PC × PC = " + f1(pc) + " × " + f1(pc) + " ≈ " + f1(pc * pc)));
      t.push(L("note", "They are equal. Turn the line PAB and the answer stays the same. (Numbers are rounded to 1 decimal place.)"));
      t.push(L("note", "More: turn the line until A and B come together at C. Then PA = PB = PC, and the rule becomes PC × PC = PC²."));
    } else if (mode === "quad") {
      const q = quadGeo(), ab = q.len[0] + q.len[1], bc = q.len[1] + q.len[2], cd = q.len[2] + q.len[3], da = q.len[3] + q.len[0];
      t.push(L("known", "Tangent lengths:  a = " + f1(q.len[0]) + ",  b = " + f1(q.len[1]) + ",  c = " + f1(q.len[2]) + ",  d = " + f1(q.len[3]) + "  (cm)"));
      t.push(L("known", "AB = a + b = " + f1(ab) + ",   BC = b + c = " + f1(bc) + ",   CD = c + d = " + f1(cd) + ",   DA = d + a = " + f1(da)));
      t.push(L("found", "AB + CD = " + f1(ab) + " + " + f1(cd) + " ≈ " + f1(ab + cd)));
      t.push(L("found", "BC + DA = " + f1(bc) + " + " + f1(da) + " ≈ " + f1(bc + da)));
      t.push(L("note", "Opposite sides add up to the same total. Both are a + b + c + d. (Numbers are rounded to 1 decimal place.)"));
    } else {
      const g = incGeo();
      if (!g.ok) { t.push(L("warn", "Move a point so that A, B and C make a triangle.")); }
      else {
        t.push(L("known", "a = BC = " + f1(g.a) + ",   b = CA = " + f1(g.b) + ",   c = AB = " + f1(g.c) + "   (cm)"));
        t.push(L("known", "s = (a + b + c) ÷ 2 = " + f1(g.s)));
        t.push(L("known", "Area = √( s(s − a)(s − b)(s − c) ) = " + f1(g.area)));
        t.push(L("found", "r = Area ÷ s = " + f1(g.area) + " ÷ " + f1(g.s) + " = " + f1(g.r) + " cm"));
        t.push(L("note", "More: the numbers on the sides are the tangent lengths: from A it is s − a = " + f1(g.s - g.a) + ", from B it is s − b = " + f1(g.s - g.b) + ", from C it is s − c = " + f1(g.s - g.c) + "."));
      }
    }
    resEl.innerHTML = t.join("");
  }
  function update() {
    modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
    hintEl.textContent = HINT[mode];
    eqEl.innerHTML = '<div class="eq-title">Important equation</div><div class="eq1">' + EQ[mode][0] + '</div><div class="eq2">' + EQ[mode][1] + "</div>";
    draw(); explain();
  }

  /* ---- dragging ---- */
  function pos(e) { const b = canvas.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; }
  function handles() {
    layout();
    if (mode === "perp") return [{ k: "T", p: onC(S.perp.T) }];
    if (mode === "two") return [{ k: "P", p: outPt(S.two.P) }];
    if (mode === "sec") return [{ k: "P", p: outPt(S.sec.P) }, { k: "B", p: onC(S.sec.B) }];
    if (mode === "quad") return S.quad.T.map((a, i) => ({ k: i, p: onC(a) }));
    return ["A", "B", "C"].map((k) => ({ k: k, p: toPx(S.inc[k]) }));
  }
  canvas.addEventListener("pointerdown", (e) => {
    const p = pos(e); let best = null, bd = 32;
    handles().forEach((h) => { const d = dist(p, h.p); if (d < bd) { bd = d; best = h.k; } });
    if (best !== null) { drag = best; canvas.setPointerCapture(e.pointerId); }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (drag === null) return;
    layout();
    const p = pos(e), ang = Math.atan2(cy - p.y, p.x - cx) / D2R;
    if (mode === "perp") S.perp.T = nd(Math.round(ang / 10) * 10);
    else if (mode === "two") S.two.P = { x: (p.x - cx) / r, y: (cy - p.y) / r };
    else if (mode === "sec") { if (drag === "P") S.sec.P = { x: (p.x - cx) / r, y: (cy - p.y) / r }; else S.sec.B = nd(Math.round(ang)); }
    else if (mode === "quad") {
      const T = S.quad.T, i = drag, a = nd(Math.round(ang / 10) * 10);
      const g1 = nd(a - T[(i + 3) % 4]), g2 = nd(T[(i + 1) % 4] - a);
      if (g1 >= 40 && g1 <= 120 && g2 >= 40 && g2 <= 120) T[i] = a;
    } else {
      const q = fromPx(p), x = Math.max(0, Math.min(10, Math.round(q.x))), y = Math.max(0, Math.min(8, Math.round(q.y)));
      S.inc[drag] = { x: x, y: y };
    }
    update();
  });
  const stop = () => { drag = null; draw(); };
  canvas.addEventListener("pointerup", stop); canvas.addEventListener("pointercancel", stop);

  modeBtns.forEach((b) => b.addEventListener("click", () => { mode = b.dataset.mode; update(); }));
  resetBtn.addEventListener("click", () => { S = clone(DEF); update(); });
  window.addEventListener("resize", () => { resize(); update(); });
  resize(); update();
  window.__tg = { mode: (v) => { mode = v; update(); }, state: () => S, set: (v) => { S[mode] = v; update(); }, text: () => resEl.textContent };
})();

/* ---------- Quiz ---------- */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;
  const questions = [
    { q: "A tangent touches a circle at a point T. What is the angle between the tangent and the radius at T?",
      options: ["45°", "60°", "90°", "180°"], answer: 2,
      explain: "A tangent is always at right angles to the radius at the point of contact: 90°." },
    { q: "Two tangents PA and PB are drawn from an outside point P to a circle. If PA = 7 cm, what is PB?",
      options: ["14 cm", "7 cm", "3.5 cm", "Cannot say"], answer: 1,
      explain: "Tangents drawn from one outside point are equal in length. PB = PA = 7 cm." },
    { q: "Tangents at A and B meet at P. The angle AOB at the centre is 110°. What is angle APB?",
      options: ["70°", "110°", "55°", "90°"], answer: 0,
      explain: "∠AOB + ∠APB = 180°. So ∠APB = 180° − 110° = 70°." },
    { q: "Two tangents from P make an angle ∠APB = 50°. What is the angle AOB at the centre?",
      options: ["50°", "100°", "130°", "40°"], answer: 2,
      explain: "∠AOB = 180° − 50° = 130°." },
    { q: "A circle has radius 5 cm. P is 13 cm from the centre. What is the length of the tangent from P?",
      options: ["8 cm", "12 cm", "18 cm", "10 cm"], answer: 1,
      explain: "The tangent is at 90° to the radius. So PA² = 13² − 5² = 169 − 25 = 144. PA = 12 cm." },
    { q: "A tangent of length 8 cm is drawn from P to a circle of radius 6 cm. How far is P from the centre?",
      options: ["10 cm", "14 cm", "7 cm", "2 cm"], answer: 0,
      explain: "OP² = 8² + 6² = 64 + 36 = 100. OP = 10 cm." },
    { q: "From a point P, a tangent PC and a line PAB cutting the circle are drawn. PA = 4 and PB = 9. What is PC?",
      options: ["6", "13", "36", "5"], answer: 0,
      explain: "PC² = PA × PB = 4 × 9 = 36. So PC = 6." },
    { q: "PC is a tangent of length 10 cm. A line from P cuts the circle at A and B, and PA = 5 cm. What is PB?",
      options: ["15 cm", "2 cm", "20 cm", "50 cm"], answer: 2,
      explain: "PA × PB = PC². So 5 × PB = 100, and PB = 20 cm." },
    { q: "A quadrilateral ABCD has its sides touching a circle. AB = 9, CD = 6 and BC = 7. What is DA?",
      options: ["7", "10", "8", "22"], answer: 2,
      explain: "AB + CD = BC + DA. So 9 + 6 = 7 + DA, and DA = 15 − 7 = 8." },
    { q: "A triangle has sides 5 cm, 12 cm and 13 cm. What is the radius of the circle inside it (its area is 30 cm²)?",
      options: ["1 cm", "2 cm", "3 cm", "5 cm"], answer: 1,
      explain: "s = (5 + 12 + 13) ÷ 2 = 15. r = Area ÷ s = 30 ÷ 15 = 2 cm." },
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
    if (pct >= 80) v = "Excellent! You can handle tangents.";
    else if (pct >= 50) v = "Good work. One more go with the simulation and you've got it.";
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