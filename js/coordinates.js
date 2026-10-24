/* Coordinates — Class 10 Maths
   One grid, eight views: mark points, rectangle corners, distance, midpoint, dividing a line, circle, circle on a diameter, and a straight line (slope and equation).
   Tap the grid to place points A and B, drag to move them.  Plus a quiz. */

/* If anything ever breaks, show the reason on the page instead of staying blank. */
window.addEventListener("error", function (e) {
  var d = document.getElementById("coErr");
  if (!d) {
    d = document.createElement("div"); d.id = "coErr";
    d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99;background:#B91C1C;color:#fff;padding:10px 16px;font:14px monospace";
    document.body.appendChild(d);
  }
  d.textContent = "Coordinates page error: " + e.message + " (" + (e.filename || "").split("/").pop() + ":" + e.lineno + ")";
});

(function () {
  "use strict";
  const canvas = document.getElementById("coCanvas");
  if (!canvas) return;
  const MINUS = "−";
  const COL = { A: "#FFB03A", B: "#A78BFA", G: "#34D399", W: "#E8ECF5", GRID: "rgba(255,255,255,0.09)", AX: "rgba(255,255,255,0.7)" };
  const modeBtns = document.querySelectorAll(".co-mode");
  const hintEl = document.getElementById("coHint");
  const resEl = document.getElementById("coResult");
  const ratioRow = document.getElementById("coRatio");
  const mIn = document.getElementById("coM"), nIn = document.getElementById("coN");
  const practiceEl = document.getElementById("coPractice");
  const giveBtn = document.getElementById("coGive"), resetBtn = document.getElementById("coReset"), msgEl = document.getElementById("coMsg");

  const DEFAULT = () => [{ x: 1, y: 2 }, { x: 5, y: 5 }];
  let mode = "mark", pts = DEFAULT(), next = 0, drag = -1;
  let target = null, streak = 0;
  let W = 600, H = 380, u = 30, ox = 300, oy = 190, xmax = 8, ymax = 5;

  /* ---------- number formatting ---------- */
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const n$ = (x) => String(x).replace("-", MINUS);
  function frac(n, d) {                       // n/d as a mixed number, e.g. 4 3/4
    if (d < 0) { n = -n; d = -d; }
    const k = gcd(n, d) || 1; n /= k; d /= k;
    const neg = n < 0, a = Math.abs(n), whole = Math.floor(a / d), rem = a % d;
    let s;
    if (rem === 0) s = String(whole);
    else if (whole === 0) s = rem + "/" + d;
    else s = whole + " " + rem + "/" + d;
    return (neg ? MINUS : "") + s;
  }
  function root(N) {                           // √N in simplest form
    let k = 1, m = N;
    for (let i = Math.floor(Math.sqrt(N)); i > 1; i--) { if (m % (i * i) === 0) { k *= i; m /= i * i; break; } }
    if (m === 1) return String(k);
    return (k === 1 ? "" : k) + "√" + m;
  }
  function fr(n, d) {                          // n/d as a plain fraction, e.g. 7/2 (used in equations)
    if (d < 0) { n = -n; d = -d; }
    const k = gcd(n, d) || 1; n /= k; d /= k;
    return (n < 0 ? MINUS : "") + (d === 1 ? String(Math.abs(n)) : Math.abs(n) + "/" + d);
  }
  function sq(n, d, name) {                    // (x - n/d)² written nicely
    const k = gcd(n, d) || 1; n /= k; d /= k;
    if (n === 0) return name + "²";
    return n > 0 ? "(" + name + " − " + fr(n, d) + ")²" : "(" + name + " + " + fr(-n, d) + ")²";
  }
  function lineEq(dx, dy, x1, y1) {            // y = mx + c  (dx != 0)
    const q = dx < 0 ? -dx : dx, p = dx < 0 ? -dy : dy;          // slope p/q, q > 0
    const k = gcd(p, q) || 1, mp = p / k, mq = q / k;
    const cn = y1 * dx - dy * x1;                                    // c = cn / dx
    let mx = "";
    if (mp !== 0) mx = (mq === 1 ? (mp === 1 ? "" : mp === -1 ? MINUS : n$(mp)) : "(" + fr(mp, mq) + ")") + "x";
    let c = "";
    if (cn !== 0) c = (mx ? (cn / dx > 0 ? " + " : " − ") + fr(Math.abs(cn), Math.abs(dx)) : fr(cn, dx));
    return "y = " + (mx + c || "0");
  }
  const sub = (v) => (v < 0 ? " + " + Math.abs(v) : " − " + v);     // " − 3" or " + 3"
  const par = (v) => (v < 0 ? "(" + n$(v) + ")" : String(v));
  const pair = (x, y) => "(" + x + ", " + y + ")";
  const P = (p) => pair(n$(p.x), n$(p.y));
  const add = (t) => (t.charAt(0) === MINUS ? " " + MINUS + " " + t.slice(1) : " + " + t);   // " + 3" or " − 3"

  /* ---------- grid <-> pixels ---------- */
  const px = (x) => ox + x * u, py = (y) => oy - y * u;
  function toGrid(e) {
    const r = canvas.getBoundingClientRect();
    const gx = Math.round((e.clientX - r.left - ox) / u), gy = Math.round((oy - (e.clientY - r.top)) / u);
    return { x: Math.max(-xmax, Math.min(xmax, gx)), y: Math.max(-ymax, Math.min(ymax, gy)) };
  }

  /* ---------- drawing ---------- */
  function setup() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = Math.max(280, r.width); H = r.height || 380;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    u = Math.min(W / 17, H / 15);
    xmax = Math.floor(W / (2 * u) - 0.3); ymax = Math.floor(H / (2 * u) - 0.3);
    ox = W / 2; oy = H / 2;
    pts.forEach((p) => { p.x = Math.max(-xmax, Math.min(xmax, p.x)); p.y = Math.max(-ymax, Math.min(ymax, p.y)); });
    return ctx;
  }
  function text(ctx, s, x, y, color, align, size, bold) {
    ctx.font = (bold ? "700 " : "500 ") + (size || 13) + "px Inter, system-ui, sans-serif";
    ctx.fillStyle = color || COL.W; ctx.textAlign = align || "center"; ctx.textBaseline = "middle";
    ctx.fillText(s, x, y);
  }
  function line(ctx, x1, y1, x2, y2, color, w, dash) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = color; ctx.lineWidth = w || 1; ctx.setLineDash(dash || []); ctx.lineCap = "round"; ctx.stroke(); ctx.setLineDash([]);
  }
  function grid(ctx) {
    for (let i = -xmax; i <= xmax; i++) line(ctx, px(i), py(-ymax) + u * 0.5, px(i), py(ymax) - u * 0.5, COL.GRID, 1);
    for (let j = -ymax; j <= ymax; j++) line(ctx, px(-xmax) - u * 0.5, py(j), px(xmax) + u * 0.5, py(j), COL.GRID, 1);
    line(ctx, px(-xmax) - u * 0.5, oy, px(xmax) + u * 0.5, oy, COL.AX, 2);
    line(ctx, ox, py(-ymax) + u * 0.5, ox, py(ymax) - u * 0.5, COL.AX, 2);
    text(ctx, "x", px(xmax) + u * 0.35, oy - 12, COL.AX, "center", 14, true);
    text(ctx, "y", ox + 12, py(ymax) - u * 0.35, COL.AX, "center", 14, true);
    const step = u >= 22 ? 1 : 2;
    for (let i = -xmax; i <= xmax; i += 1) if (i !== 0 && i % step === 0) text(ctx, n$(i), px(i), oy + 13, "rgba(232,236,245,0.6)", "center", 11);
    for (let j = -ymax; j <= ymax; j += 1) if (j !== 0 && j % step === 0) text(ctx, n$(j), ox - 12, py(j), "rgba(232,236,245,0.6)", "center", 11);
    text(ctx, "O", ox - 11, oy + 13, "rgba(232,236,245,0.8)", "center", 12, true);
  }
  function dot(ctx, x, y, color, r) {
    ctx.beginPath(); ctx.arc(px(x), py(y), r || 7, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#1F2A44"; ctx.stroke();
  }
  const unit = (vx, vy, dx, dy) => { const l = Math.hypot(vx, vy); return l < 1e-6 ? [dx, dy] : [vx / l, vy / l]; };
  function tag(ctx, label, x, y, color, dir) {      // label placed along dir (a unit vector in pixels), kept inside the canvas
    const d = dir || [0.7, -0.7];
    ctx.font = "700 13px Inter, system-ui, sans-serif";
    const w = ctx.measureText(label).width;
    let lx = px(x) + d[0] * (Math.abs(d[0]) > 0.6 ? 14 + w / 2 : 18), ly = py(y) + d[1] * 18;
    lx = Math.max(w / 2 + 4, Math.min(W - w / 2 - 4, lx)); ly = Math.max(10, Math.min(H - 10, ly));
    text(ctx, label, lx, ly, color, "center", 13, true);
  }
  function awayFrom(p, q, dx, dy) { return unit(px(p.x) - px(q.x), py(p.y) - py(q.y), dx, dy); }
  function above(p, q) {                              // label direction: beside the line pq, on the upper side
    let nx = -(py(q.y) - py(p.y)), ny = px(q.x) - px(p.x);
    const n = unit(nx, ny, 0, -1);
    return n[1] > 0 ? [-n[0], -n[1]] : n;
  }
  function drawA(ctx, p, color, name, other, dx, dy) {
    dot(ctx, p.x, p.y, color, 8);
    tag(ctx, name + P(p), p.x, p.y, color, awayFrom(p, other, dx, dy));
  }

  function draw() {
    const ctx = setup();
    ctx.fillStyle = "#1F2A44"; ctx.fillRect(0, 0, W, H);
    grid(ctx);
    const A = pts[0], B = pts[1];
    if (mode === "mark") {
      pts.forEach((p, i) => {
        const c = i ? COL.B : COL.A;
        line(ctx, px(p.x), py(p.y), px(p.x), oy, c, 1.5, [5, 4]);
        line(ctx, px(p.x), py(p.y), ox, py(p.y), c, 1.5, [5, 4]);
        if (p.x !== 0) text(ctx, "x = " + n$(p.x), px(p.x), oy + (p.y >= 0 ? 28 : -28), c, "center", 12, true);
        if (p.y !== 0) text(ctx, "y = " + n$(p.y), ox + (p.x >= 0 ? -34 : 34), py(p.y) - 11, c, "center", 12, true);
      });
    } else if (mode === "rect") {
      if (A.x !== B.x && A.y !== B.y) {
        const C = { x: A.x, y: B.y }, D = { x: B.x, y: A.y };
        ctx.fillStyle = "rgba(52,211,153,0.12)";
        ctx.fillRect(Math.min(px(A.x), px(B.x)), Math.min(py(A.y), py(B.y)), Math.abs(px(B.x) - px(A.x)), Math.abs(py(B.y) - py(A.y)));
        [[A, D], [D, B], [B, C], [C, A]].forEach(([p, q]) => line(ctx, px(p.x), py(p.y), px(q.x), py(q.y), COL.W, 2));
        dot(ctx, C.x, C.y, COL.G); dot(ctx, D.x, D.y, COL.G);
        const cm = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
        tag(ctx, "C" + P(C), C.x, C.y, COL.G, awayFrom(C, cm, 0, -1)); tag(ctx, "D" + P(D), D.x, D.y, COL.G, awayFrom(D, cm, 0, 1));
        const mx = (px(A.x) + px(B.x)) / 2, my = (py(A.y) + py(B.y)) / 2;
        text(ctx, String(Math.abs(A.x - B.x)), mx, py(A.y) + (B.y > A.y ? 15 : -15), COL.W, "center", 13, true);
        text(ctx, String(Math.abs(A.y - B.y)), px(A.x) + (B.x > A.x ? -14 : 14), my, COL.W, "center", 13, true);
      } else {
        line(ctx, px(A.x), py(A.y), px(B.x), py(B.y), "#F87171", 2, [6, 5]);
      }
    } else if (mode === "dist") {
      const E = { x: B.x, y: A.y };
      line(ctx, px(A.x), py(A.y), px(E.x), py(E.y), COL.W, 1.5, [5, 4]);
      line(ctx, px(E.x), py(E.y), px(B.x), py(B.y), COL.W, 1.5, [5, 4]);
      line(ctx, px(A.x), py(A.y), px(B.x), py(B.y), COL.G, 3);
      const dx = Math.abs(A.x - B.x), dy = Math.abs(A.y - B.y);
      if (dx) text(ctx, String(dx), (px(A.x) + px(E.x)) / 2, py(A.y) + (B.y > A.y ? 15 : -15), COL.W, "center", 13, true);
      if (dy) text(ctx, String(dy), px(E.x) + (B.x > A.x ? 14 : -14), (py(E.y) + py(B.y)) / 2, COL.W, "center", 13, true);
    } else if (mode === "mid") {
      const M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
      line(ctx, px(A.x), py(A.y), px(B.x), py(B.y), COL.W, 2.5);
      line(ctx, px(A.x), py(A.y), px(M.x), py(A.y), COL.A, 1.5, [5, 4]);
      line(ctx, px(M.x), py(A.y), px(M.x), py(M.y), COL.A, 1.5, [5, 4]);
      line(ctx, px(M.x), py(M.y), px(B.x), py(M.y), COL.B, 1.5, [5, 4]);
      line(ctx, px(B.x), py(M.y), px(B.x), py(B.y), COL.B, 1.5, [5, 4]);
      dot(ctx, M.x, M.y, COL.G, 8);
      tag(ctx, "M(" + frac(A.x + B.x, 2) + ", " + frac(A.y + B.y, 2) + ")", M.x, M.y, COL.G, above(A, B));
    } else if (mode === "div") {
      const r = ratio();
      if (r) {
        const t = r.m / (r.m + r.n), Q = { x: A.x + t * (B.x - A.x), y: A.y + t * (B.y - A.y) };
        line(ctx, px(A.x), py(A.y), px(Q.x), py(Q.y), COL.A, 4);
        line(ctx, px(Q.x), py(Q.y), px(B.x), py(B.y), COL.B, 4);
        dot(ctx, Q.x, Q.y, COL.G, 8);
        const ps = pointFor(r);
        tag(ctx, "P(" + ps.x + ", " + ps.y + ")", Q.x, Q.y, COL.G, above(A, B));
      } else line(ctx, px(A.x), py(A.y), px(B.x), py(B.y), COL.W, 2.5);
    } else if (mode === "circ") {
      const R = Math.hypot(B.x - A.x, B.y - A.y);
      if (R > 0) {
        ctx.beginPath(); ctx.arc(px(A.x), py(A.y), R * u, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(52,211,153,0.10)"; ctx.fill(); ctx.strokeStyle = COL.G; ctx.lineWidth = 3; ctx.stroke();
        line(ctx, px(A.x), py(A.y), px(B.x), py(B.y), COL.W, 2, [6, 5]);
        const C = { x: 2 * A.x - B.x, y: 2 * A.y - B.y };
        if (Math.abs(C.x) <= xmax && Math.abs(C.y) <= ymax) {
          line(ctx, px(B.x), py(B.y), px(C.x), py(C.y), "rgba(232,236,245,0.35)", 1.5, [3, 5]);
          dot(ctx, C.x, C.y, COL.G, 6); tag(ctx, "C" + P(C), C.x, C.y, COL.G, awayFrom(C, A, 0, 1));
        }
      }
    } else if (mode === "dia") {
      const M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }, R = Math.hypot(B.x - A.x, B.y - A.y) / 2;
      if (R > 0) {
        ctx.beginPath(); ctx.arc(px(M.x), py(M.y), R * u, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(52,211,153,0.10)"; ctx.fill(); ctx.strokeStyle = COL.G; ctx.lineWidth = 3; ctx.stroke();
      }
      line(ctx, px(A.x), py(A.y), px(B.x), py(B.y), COL.W, 2);
      dot(ctx, M.x, M.y, COL.G, 7);
      tag(ctx, "O(" + frac(A.x + B.x, 2) + ", " + frac(A.y + B.y, 2) + ")", M.x, M.y, COL.G, above(A, B));
    } else if (mode === "lin") {
      const ex = xmax + 2;
      if (A.x === B.x && A.y === B.y) { /* same point: nothing to draw */ }
      else if (A.x === B.x) line(ctx, px(A.x), py(-ymax - 1), px(A.x), py(ymax + 1), COL.G, 3);
      else {
        const m = (B.y - A.y) / (B.x - A.x), yy = (x) => A.y + m * (x - A.x);
        line(ctx, px(-ex), py(yy(-ex)), px(ex), py(yy(ex)), COL.G, 3);
        const dx = B.x - A.x, dy = B.y - A.y, c = yy(0);
        if (Math.abs(c) <= ymax && A.x !== 0) { dot(ctx, 0, c, COL.G, 5); text(ctx, "(0, " + fr(A.y * dx - dy * A.x, dx) + ")", ox + 10, py(c) + (m >= 0 ? 16 : -16), COL.G, "left", 12, true); }
        if (A.y !== B.y) {
          const xi = A.x - A.y / m;
          if (Math.abs(xi) <= xmax && !(Math.abs(xi) < 1e-9 && Math.abs(c) < 1e-9)) { dot(ctx, xi, 0, COL.G, 5); text(ctx, "(" + fr(A.x * dy - A.y * dx, dy) + ", 0)", px(xi), oy + (m >= 0 ? 28 : -22), COL.G, "center", 12, true); }
        }
      }
    }
    drawA(ctx, A, COL.A, mode === "circ" ? "A(centre) " : "A", B, -0.7, 0.7); drawA(ctx, B, COL.B, "B", A, 0.7, -0.7);
    if (target && mode === "mark") {
      ctx.beginPath(); ctx.arc(px(target.x), py(target.y), 11, 0, Math.PI * 2);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = COL.G; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
    }
  }

  /* ---------- ratio helpers ---------- */
  function ratio() {
    const m = Number(mIn.value), n = Number(nIn.value);
    if (!(Number.isInteger(m) && Number.isInteger(n) && m >= 1 && n >= 1 && m <= 9 && n <= 9)) return null;
    return { m, n };
  }
  function pointFor(r) {                           // exact coordinates of P as text
    const A = pts[0], B = pts[1], s = r.m + r.n;
    return { x: frac(A.x * s + r.m * (B.x - A.x), s), y: frac(A.y * s + r.m * (B.y - A.y), s) };
  }

  /* ---------- explanations ---------- */
  const L = (cls, html) => '<div class="line ' + cls + '">' + html + "</div>";
  const way = (v, pos, neg, zero) => (v > 0 ? v + " " + pos : v < 0 ? Math.abs(v) + " " + neg : zero);
  function explain() {
    const A = pts[0], B = pts[1], rows = [];
    const dx = B.x - A.x, dy = B.y - A.y;
    if (mode === "mark") {
      rows.push(L("note", "A point is (x, y): first sideways, then up or down."));
      [["A", A, "known"], ["B", B, "found"]].forEach(([nm, p, c]) => {
        rows.push(L(c, nm + " = " + P(p) + " : " + way(p.x, "right", "left", "0 sideways") + ", " + way(p.y, "up", "down", "0 up or down")));
        if (p.y === 0 && p.x !== 0) rows.push(L("note", nm + " is on the x-axis, so its y-coordinate is 0."));
        if (p.x === 0 && p.y !== 0) rows.push(L("note", nm + " is on the y-axis, so its x-coordinate is 0."));
        if (p.x === 0 && p.y === 0) rows.push(L("note", nm + " is the origin."));
      });
    } else if (mode === "rect") {
      if (A.x === B.x) rows.push(L("warn", "A and B have the same x-coordinate, so the line AB is parallel to the y-axis. They cannot be opposite corners of a rectangle with sides parallel to the axes."));
      else if (A.y === B.y) rows.push(L("warn", "A and B have the same y-coordinate, so the line AB is parallel to the x-axis. They cannot be opposite corners of a rectangle with sides parallel to the axes."));
      else {
        rows.push(L("known", "A" + P(A) + " and B" + P(B) + " are opposite corners."));
        rows.push(L("note", "Moving along the x-axis does not change y. Moving along the y-axis does not change x."));
        rows.push(L("found", "C = (x₁, y₂) = " + P({ x: A.x, y: B.y })));
        rows.push(L("found", "D = (x₂, y₁) = " + P({ x: B.x, y: A.y })));
        rows.push(L("found", "Sides: |x₁ − x₂| = |" + n$(A.x) + " − " + (B.x < 0 ? "(" + n$(B.x) + ")" : B.x) + "| = " + Math.abs(dx) + "   and   |y₁ − y₂| = |" + n$(A.y) + " − " + (B.y < 0 ? "(" + n$(B.y) + ")" : B.y) + "| = " + Math.abs(dy)));
      }
    } else if (mode === "dist") {
      const a = Math.abs(dx), b = Math.abs(dy), N = a * a + b * b;
      rows.push(L("known", "A" + P(A) + ", B" + P(B)));
      rows.push(L("note", "Sideways gap |x₁ − x₂| = " + a + ".   Up/down gap |y₁ − y₂| = " + b + "."));
      if (N === 0) rows.push(L("warn", "A and B are the same point, so the distance is 0."));
      else {
        rows.push(L("found", "AB = √(" + a + "² + " + b + "²) = √(" + a * a + " + " + b * b + ") = √" + N));
        const rt = root(N), approx = Math.sqrt(N);
        rows.push(L("found", "AB = " + (rt === "√" + N ? "√" + N : rt) + (Number.isInteger(approx) ? "" : "  ≈ " + approx.toFixed(2))));
        if (a === 0 || b === 0) rows.push(L("note", "One gap is 0, so AB is just the other gap: " + Math.max(a, b) + "."));
      }
    } else if (mode === "mid") {
      rows.push(L("known", "A" + P(A) + ", B" + P(B)));
      rows.push(L("note", "From A to B: x changes by " + n$(dx) + ", y changes by " + n$(dy) + "."));
      rows.push(L("note", "Half of that: x by " + frac(dx, 2) + ", y by " + frac(dy, 2) + "."));
      rows.push(L("found", "M = (" + n$(A.x) + add(frac(dx, 2)) + ", " + n$(A.y) + add(frac(dy, 2)) + ") = (" + frac(A.x + B.x, 2) + ", " + frac(A.y + B.y, 2) + ")"));
      rows.push(L("note", "Short way: M = (½(x₁ + x₂), ½(y₁ + y₂))."));
    } else if (mode === "div") {
      const r = ratio();
      if (!r) rows.push(L("warn", "Type whole numbers from 1 to 9 for the ratio."));
      else {
        const s = r.m + r.n, ps = pointFor(r);
        rows.push(L("known", "A" + P(A) + ", B" + P(B) + ".  AP : PB = " + r.m + " : " + r.n));
        rows.push(L("note", "1) AP is " + r.m + "/" + s + " of AB."));
        rows.push(L("note", "2) From A to B: x changes by " + n$(dx) + ", y changes by " + n$(dy) + "."));
        rows.push(L("note", "3) From A to P: x changes by " + r.m + "/" + s + " × " + n$(dx) + " = " + frac(r.m * dx, s) + ", y changes by " + r.m + "/" + s + " × " + n$(dy) + " = " + frac(r.m * dy, s) + "."));
        rows.push(L("found", "4) P = (" + n$(A.x) + add(frac(r.m * dx, s)) + ", " + n$(A.y) + add(frac(r.m * dy, s)) + ") = (" + ps.x + ", " + ps.y + ")"));
      }
    }
    else if (mode === "circ") {
      const N = dx * dx + dy * dy;
      rows.push(L("known", "Centre A" + P(A) + ".  B" + P(B) + " is a point on the circle."));
      if (N === 0) rows.push(L("warn", "B is the same as the centre, so the radius is 0. Move B away from A."));
      else {
        const a = Math.abs(dx), b = Math.abs(dy), rt = root(N);
        rows.push(L("note", "The radius is the distance from the centre to a point on the circle."));
        rows.push(L("found", "r = √(" + a + "² + " + b + "²) = √" + N + (rt === "√" + N ? "" : " = " + rt)));
        rows.push(L("note", "Equation of a circle with centre (a, b) and radius r:   (x − a)² + (y − b)² = r²"));
        rows.push(L("found", sq(A.x, 1, "x") + " + " + sq(A.y, 1, "y") + " = " + N + "      ( r² = " + N + " )"));
        if (A.x === 0 && A.y === 0) rows.push(L("note", "Centre is the origin, so it is simply x² + y² = " + N + "."));
        rows.push(L("found", "Other end of the diameter through B: (2a − x, 2b − y) = " + P({ x: 2 * A.x - B.x, y: 2 * A.y - B.y })));
        rows.push(L("note", "A point is on the circle only if it fits the equation. Given its x, put it in the equation and find y."));
      }
    } else if (mode === "dia") {
      const N = dx * dx + dy * dy;
      rows.push(L("known", "A" + P(A) + " and B" + P(B) + " are the two ends of a diameter."));
      if (N === 0) rows.push(L("warn", "A and B are the same point. Move B away from A."));
      else {
        rows.push(L("note", "1) The centre is the midpoint of the diameter."));
        rows.push(L("found", "Centre O = (" + frac(A.x + B.x, 2) + ", " + frac(A.y + B.y, 2) + ")"));
        const rt = root(N), whole = Math.sqrt(N);
        rows.push(L("note", "2) Radius = half of the diameter AB.   AB = √(" + Math.abs(dx) + "² + " + Math.abs(dy) + "²) = √" + N + (rt === "√" + N ? "" : " = " + rt)));
        rows.push(L("found", "r = " + (Number.isInteger(whole) ? fr(whole, 2) : "½ × " + rt) + "      r² = " + fr(N, 4)));
        rows.push(L("found", "3) " + sq(A.x + B.x, 2, "x") + " + " + sq(A.y + B.y, 2, "y") + " = " + fr(N, 4)));
        rows.push(L("note", "Know the centre and one end? The other end is (2a − x₁, 2b − y₁)."));
      }
    } else if (mode === "lin") {
      rows.push(L("known", "A" + P(A) + " and B" + P(B) + " are two points on the line."));
      if (dx === 0 && dy === 0) rows.push(L("warn", "A and B are the same point. Move B away from A."));
      else if (dx === 0) {
        rows.push(L("found", "The line is parallel to the y-axis. Every point on it has x = " + n$(A.x) + "."));
        rows.push(L("found", "Equation: x = " + n$(A.x) + "      Slope: not defined"));
      } else {
        rows.push(L("note", "1) Slope m = (y₂ − y₁) ÷ (x₂ − x₁) = (" + n$(B.y) + sub(A.y) + ") ÷ (" + n$(B.x) + sub(A.x) + ")"));
        rows.push(L("found", "m = " + par(dy) + " ÷ " + par(dx) + " = " + fr(dy, dx)));
        rows.push(L("note", "2) Line through A with slope m:   y − y₁ = m (x − x₁)"));
        rows.push(L("found", "y " + (A.y < 0 ? "+ " + Math.abs(A.y) : "− " + A.y).replace("- 0", "− 0") + " = " + (dy === 0 ? "0" : (fr(dy, dx).indexOf("/") > 0 ? "(" + fr(dy, dx) + ")" : fr(dy, dx))) + " (x " + (A.x < 0 ? "+ " + Math.abs(A.x) : "− " + A.x) + ")"));
        rows.push(L("found", "3) " + lineEq(dx, dy, A.x, A.y)));
        const cn = A.y * dx - dy * A.x;
        rows.push(L("found", "Cuts the y-axis at (0, " + fr(cn, dx) + ")" + (dy !== 0 ? "   and the x-axis at (" + fr(A.x * dy - A.y * dx, dy) + ", 0)" : "   (it never meets the x-axis)")));
        rows.push(L("note", "To check a point, put its x and y in the equation. If both sides are equal, the point is on the line."));
      }
    }
    resEl.innerHTML = rows.join("");
  }

  /* ---------- practice: mark a given point ---------- */
  function newTarget() {
    let t;
    do { t = { x: Math.floor(Math.random() * 11) - 5, y: Math.floor(Math.random() * 9) - 4 }; } while ((t.x === 0 && t.y === 0) || Math.abs(t.x) > xmax || Math.abs(t.y) > ymax);
    target = t; msgEl.className = "msg";
    msgEl.textContent = "Tap to mark the point " + P(t);
  }
  function checkTarget() {
    if (!target) return;
    const A = pts[0];
    if (A.x === target.x && A.y === target.y) {
      streak++; msgEl.className = "msg ok"; msgEl.textContent = "Correct! " + P(target) + " — " + streak + " in a row. Tap the button for another.";
      target = null;
    } else {
      streak = 0; msgEl.className = "msg no";
      msgEl.textContent = "That is " + P(A) + ". For " + P(target) + " go " + way(target.x, "right", "left", "0 sideways") + ", then " + way(target.y, "up", "down", "0 up or down") + ".";
    }
  }

  /* ---------- interaction ---------- */
  function down(e) {
    e.preventDefault();
    const p = toGrid(e);
    if (target && mode === "mark") { pts[0] = p; drag = 0; canvas.setPointerCapture(e.pointerId); update(); return; }
    let best = -1, bd = 22;
    pts.forEach((q, i) => {
      const r = canvas.getBoundingClientRect();
      const d = Math.hypot(e.clientX - r.left - px(q.x), e.clientY - r.top - py(q.y));
      if (d < bd) { bd = d; best = i; }
    });
    if (best >= 0) drag = best;
    else { pts[next] = p; drag = next; next = 1 - next; }
    canvas.setPointerCapture(e.pointerId); update();
  }
  function move(e) {
    if (drag < 0) return;
    const p = toGrid(e);
    if (p.x !== pts[drag].x || p.y !== pts[drag].y) { pts[drag] = p; update(); }
  }
  function up() {
    if (drag === 0 && target && mode === "mark") checkTarget();
    drag = -1; update();
  }
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", () => { drag = -1; });

  const HINT = {
    mark: "Tap the grid to place points A and B, and drag them to move. Watch how x and y are read.",
    rect: "A and B are opposite corners of a rectangle with sides parallel to the axes. Move them and watch the other two corners.",
    dist: "The line AB is the diagonal of a rectangle. Move the points and see the distance change.",
    mid: "M is halfway from A to B. Move the points and watch M.",
    circ: "A is the centre. B is a point on the circle. Move B and watch the radius and the equation.",
    dia: "A and B are the two ends of a diameter. The centre is the midpoint. Move the points and watch the equation.",
    lin: "A and B are two points on a line. Move them and watch the slope and the equation.",
    div: "P divides AB in the ratio you type. Try 1 : 1, then 1 : 2, then 3 : 2.",
  };
  function update() {
    modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
    hintEl.textContent = HINT[mode];
    ratioRow.hidden = mode !== "div";
    practiceEl.hidden = mode !== "mark";
    explain(); draw();
  }
  modeBtns.forEach((b) => b.addEventListener("click", () => { mode = b.dataset.mode; update(); }));
  mIn.addEventListener("input", update); nIn.addEventListener("input", update);
  giveBtn.addEventListener("click", () => { newTarget(); update(); });
  resetBtn.addEventListener("click", () => { pts = DEFAULT(); next = 0; target = null; msgEl.className = "msg"; msgEl.textContent = ""; update(); });
  window.addEventListener("resize", draw);
  update();
  window.__co = { set: (a, b, m) => { pts = [a, b]; if (m) mode = m; update(); }, mode: (m) => { mode = m; update(); }, text: () => resEl.textContent, ratio: (m, n) => { mIn.value = m; nIn.value = n; update(); }, bounds: () => ({ xmax, ymax }) };
})();

/* ---------- Quiz ---------- */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;
  const questions = [
    { q: "What are the coordinates of a point 3 steps to the left of the origin and 2 steps up?",
      options: ["(3, 2)", "(−3, 2)", "(2, −3)", "(−2, 3)"], answer: 1,
      explain: "x comes first. 3 steps left makes x = −3, and 2 steps up makes y = 2. So the point is (−3, 2)." },
    { q: "A point lies on the x-axis. What is its y-coordinate?",
      options: ["1", "It can be any number", "0", "Same as x"], answer: 2,
      explain: "Every point on the x-axis has height 0 above it, so y = 0. For example, (4, 0)." },
    { q: "A(2, 4) and C(6, 12) are opposite corners of a rectangle with sides parallel to the axes. What are the other two corners?",
      options: ["(2, 12) and (6, 4)", "(4, 2) and (12, 6)", "(2, 6) and (4, 12)", "(6, 2) and (12, 4)"], answer: 0,
      explain: "The other corners are (x₁, y₂) and (x₂, y₁), which is (2, 12) and (6, 4)." },
    { q: "Why can't (3, 1) and (3, 5) be opposite corners of a rectangle with sides parallel to the axes?",
      options: ["Their y-coordinates are different", "They have the same x-coordinate", "They are too close", "Both are positive"], answer: 1,
      explain: "Same x means the line joining them is parallel to the y-axis, so it can never be a diagonal of such a rectangle." },
    { q: "What is the distance between (0, 0) and (3, 4)?",
      options: ["7", "5", "√7", "12"], answer: 1,
      explain: "√(3² + 4²) = √(9 + 16) = √25 = 5." },
    { q: "What is the distance between (2, 5) and (6, 6)?",
      options: ["√17", "5", "√5", "17"], answer: 0,
      explain: "The gaps are 4 and 1. So the distance is √(4² + 1²) = √17." },
    { q: "What is the midpoint of the line joining (2, 3) and (8, 5)?",
      options: ["(10, 8)", "(4, 2)", "(6, 4)", "(5, 4)"], answer: 3,
      explain: "Half of each change: x goes from 2 to 8, so 2 + 3 = 5. y goes from 3 to 5, so 3 + 1 = 4. M = (5, 4)." },
    { q: "P divides the line joining A(2, 4) and B(8, 7) in the ratio 1 : 2. What are the coordinates of P?",
      options: ["(4, 5)", "(5, 6)", "(6, 6)", "(3, 5)"], answer: 0,
      explain: "AP is 1/3 of AB. From A to B, x increases by 6 and y by 3. One third is 2 and 1. So P = (2 + 2, 4 + 1) = (4, 5)." },
    { q: "What is the equation of a circle with centre (0, 0) and radius 3?",
      options: ["x² + y² = 3", "x² + y² = 9", "x + y = 9", "(x − 3)² + (y − 3)² = 9"], answer: 1,
      explain: "With centre (0, 0) the equation is x² + y² = r². Here r = 3, so r² = 9." },
    { q: "The ends of a diameter of a circle are (1, 2) and (5, 6). What is the centre?",
      options: ["(6, 8)", "(2, 2)", "(4, 4)", "(3, 4)"], answer: 3,
      explain: "The centre is the midpoint of the diameter: ((1 + 5) ÷ 2, (2 + 6) ÷ 2) = (3, 4)." },
    { q: "What is the slope of the line through (1, 2) and (3, 8)?",
      options: ["2", "3", "6", "1/3"], answer: 1,
      explain: "Slope = change in y ÷ change in x = (8 − 2) ÷ (3 − 1) = 6 ÷ 2 = 3." },
    { q: "A line has slope 2 and cuts the y-axis at (0, 3). What is its equation?",
      options: ["y = 3x + 2", "y = 2x + 3", "y = 2x − 3", "y = x + 5"], answer: 1,
      explain: "A line with slope m cutting the y-axis at (0, c) is y = mx + c. Here m = 2 and c = 3." },
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
    let v = "Nice start. Play with the grid above again and retry.";
    if (pct >= 80) v = "Excellent! You can read and use coordinates.";
    else if (pct >= 50) v = "Good work. One more go on the grid and you've got it.";
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