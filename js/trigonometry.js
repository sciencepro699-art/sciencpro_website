/* Trigonometry — Class 10 Maths
   1) Special right triangles: type one side, get the others from the ratio.
   2) Sin, cos, tan: give an angle and one side, get the other sides.  Plus a quiz. */

/* If anything ever breaks, show the reason on the page instead of staying blank. */
window.addEventListener("error", function (e) {
  var d = document.getElementById("trigErr");
  if (!d) {
    d = document.createElement("div"); d.id = "trigErr";
    d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99;background:#B91C1C;color:#fff;padding:10px 16px;font:14px monospace";
    document.body.appendChild(d);
  }
  d.textContent = "Trigonometry page error: " + e.message + " (" + (e.filename || "").split("/").pop() + ":" + e.lineno + ")";
});

/* ---------- shared helpers ---------- */
const TRIG = (function () {
  "use strict";
  const MINUS = "−";
  const NAVY = "#1F2A44", KNOWN = "#FFB03A", FOUND = "#A78BFA", INK = "#E8ECF5";

  function setupCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    const W = Math.max(280, r.width), H = r.height || 300;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, W, H };
  }
  const num = (x, d) => parseFloat(Number(x).toFixed(d == null ? 2 : d)).toString();

  function label(ctx, lines, x, y, color, align) {
    ctx.textAlign = align || "center";
    ctx.fillStyle = color;
    lines.forEach((ln, i) => {
      ctx.font = (i === 0 ? "600 14px " : "12px ") + "Inter, system-ui, sans-serif";
      ctx.globalAlpha = i === 0 ? 1 : 0.75;
      ctx.fillText(ln, x, y + i * 16);
    });
    ctx.globalAlpha = 1;
  }
  function rightAngleMark(ctx, x, y, dx, dy, s) {   // corner at (x,y); dx,dy = directions (+1/-1)
    ctx.beginPath();
    ctx.moveTo(x + dx * s, y); ctx.lineTo(x + dx * s, y + dy * s); ctx.lineTo(x, y + dy * s);
    ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.stroke();
  }
  function side(ctx, a, b, color) {
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.stroke();
  }
  return { MINUS, NAVY, KNOWN, FOUND, INK, setupCanvas, num, label, rightAngleMark, side };
})();

/* ============================================================
   1. Special right triangles
   ============================================================ */
(function () {
  "use strict";
  const canvas = document.getElementById("spCanvas");
  if (!canvas) return;
  const { NAVY, KNOWN, FOUND, INK, num, label, rightAngleMark, side } = TRIG;
  const btns = document.querySelectorAll(".sp-tri");
  const sidesWrap = document.getElementById("spSides");
  const valueEl = document.getElementById("spValue");
  const warnEl = document.getElementById("spWarn");
  const resEl = document.getElementById("spResult");

  /* each side: base / upright / hypotenuse. c·√n is its ratio. */
  const TRIS = {
    45: { angles: [45, 45], sides: [
      { name: "Leg",        ratio: "1",  c: 1, n: 1 },
      { name: "Other leg",  ratio: "1",  c: 1, n: 1 },
      { name: "Hypotenuse", ratio: "√2", c: 1, n: 2 } ],
      pick: [["Leg", 0], ["Hypotenuse", 2]] },
    30: { angles: [30, 60], sides: [
      { name: "Long side",  ratio: "√3", c: 1, n: 3 },
      { name: "Short side", ratio: "1",  c: 1, n: 1 },
      { name: "Hypotenuse", ratio: "2",  c: 2, n: 1 } ],
      pick: [["Short side (opposite 30°)", 1], ["Long side (opposite 60°)", 0], ["Hypotenuse", 2]] },
  };
  let tri = 45, known = 0, V = 5, ok = true;
  let out = [];                                   // per-side result: { txt, approx }

  function exact(v, s, k) {                        // v × (ratio of s) ÷ (ratio of k), neat form
    let coef = (v * s.c) / (k.c * k.n);
    let root = s.n * k.n;
    [2, 3].forEach((p) => { while (root % (p * p) === 0) { root /= p * p; coef *= p; } });
    const val = v * (s.c * Math.sqrt(s.n)) / (k.c * Math.sqrt(k.n));
    const cs = num(coef, 3);
    const txt = root > 1 ? (cs === "1" ? "" : cs) + "√" + root : cs;
    return { txt, val, approx: root > 1 ? " ≈ " + num(val, 2) : "" };
  }
  function ratioPart(s, k) {                       // "√3/2" or just "√2"
    return k.ratio === "1" ? s.ratio : s.ratio + "/" + k.ratio;
  }

  function buildPicks() {
    sidesWrap.innerHTML = "";
    TRIS[tri].pick.forEach(([name, idx]) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "preset-btn sp-side"; b.textContent = name; b.dataset.idx = idx;
      b.classList.toggle("active", idx === known);
      b.addEventListener("click", () => { known = idx; update(); });
      sidesWrap.appendChild(b);
    });
  }

  function compute() {
    const T = TRIS[tri], k = T.sides[known];
    out = T.sides.map((s, i) => (i === known ? { txt: num(V, 3), approx: "" } : exact(V, s, k)));
    // the two equal legs of the 45° triangle share one value
    if (tri === 45 && known === 2) out[1] = out[0];
  }

  function results() {
    const T = TRIS[tri], k = T.sides[known], rows = [];
    rows.push(`<div class="line note">Ratio  ${tri === 45 ? "1 : 1 : √2" : "1 : √3 : 2"}</div>`);
    rows.push(`<div class="line known">${k.name} = ${num(V, 3)} cm</div>`);
    const seen = [];
    T.sides.forEach((s, i) => {
      if (i === known) return;
      const lbl = tri === 45 && known === 2 ? "Each leg" : s.name;
      if (seen.indexOf(lbl) >= 0) return;
      seen.push(lbl);
      const o = out[i];
      rows.push(`<div class="line found">${lbl} = ${num(V, 3)} × ${ratioPart(s, k)} = ${o.txt}${o.approx} cm</div>`);
    });
    resEl.innerHTML = rows.join("");
  }

  function draw() {
    const { ctx, W, H } = TRIG.setupCanvas(canvas);
    ctx.fillStyle = NAVY; ctx.fillRect(0, 0, W, H);
    if (!ok) return;
    const T = TRIS[tri];
    const bw = tri === 45 ? 1 : Math.sqrt(3), th = 1;                // base and upright, in ratio units
    const narrow = W < 500;
    const s = Math.min((W - (narrow ? 190 : 190)) / bw, (H - 110) / th);
    const rx = narrow ? 88 : (W - bw * s) / 2 - 10, ry = H - 52;     // right-angle corner
    const R = [rx, ry], B = [rx + bw * s, ry], Tp = [rx, ry - th * s];
    const col = (i) => (i === known ? KNOWN : FOUND);
    ctx.beginPath(); ctx.moveTo(...R); ctx.lineTo(...B); ctx.lineTo(...Tp); ctx.closePath();
    ctx.fillStyle = "rgba(167,139,250,0.10)"; ctx.fill();
    side(ctx, R, B, col(0)); side(ctx, R, Tp, col(1)); side(ctx, B, Tp, col(2));
    rightAngleMark(ctx, rx, ry, 1, -1, 14);
    // angle names
    const a = T.angles;
    label(ctx, [a[0] + "°"], B[0] - 46, ry - 8, INK, "center");
    label(ctx, [a[1] + "°"], Tp[0] + 8, Tp[1] + 46, INK, "left");
    if (!narrow) label(ctx, ["90°"], rx + 8, ry - 20, INK, "left");
    // side labels: value + ratio
    const txt = (i) => [out[i].txt + (narrow ? "" : out[i].approx) + " cm", "ratio " + T.sides[i].ratio];
    label(ctx, txt(0), (R[0] + B[0]) / 2, ry + 24, col(0));
    label(ctx, txt(1), rx - 14, (R[1] + Tp[1]) / 2 - 4, col(1), "right");
    label(ctx, txt(2), (B[0] + Tp[0]) / 2 + 16, (B[1] + Tp[1]) / 2 - 12, col(2), "left");
  }

  function update() {
    const v = parseFloat(valueEl.value);
    ok = isFinite(v) && v > 0;
    warnEl.textContent = ok ? "" : "Type a length greater than 0.";
    if (ok) { V = v; compute(); results(); } else { resEl.innerHTML = ""; }
    btns.forEach((b) => b.classList.toggle("active", +b.dataset.tri === tri));
    buildPicks(); draw();
  }

  btns.forEach((b) => b.addEventListener("click", () => {
    tri = +b.dataset.tri; known = TRIS[tri].pick[TRIS[tri].pick.length - 1][1]; update();
  }));
  valueEl.addEventListener("input", update);
  window.addEventListener("resize", draw);
  update();
  window.__sp = { set: (t, k, v) => { tri = t; known = k; valueEl.value = v; update(); }, out: () => out.map((o) => o.txt + o.approx) };
})();

/* ============================================================
   2. Sin, cos, tan
   ============================================================ */
(function () {
  "use strict";
  const canvas = document.getElementById("trCanvas");
  if (!canvas) return;
  const { NAVY, KNOWN, FOUND, INK, num, label, rightAngleMark, side } = TRIG;
  const angEl = document.getElementById("trAngle");
  const slideEl = document.getElementById("trSlider");
  const valEl = document.getElementById("trValue");
  const warnEl = document.getElementById("trWarn");
  const resEl = document.getElementById("trResult");
  const btns = document.querySelectorAll(".tr-side");
  const rSin = document.getElementById("rSin"), rCos = document.getElementById("rCos"), rTan = document.getElementById("rTan");

  let known = "hyp", ang = 30, V = 10, ok = true;
  let S = { opp: 0, adj: 0, hyp: 0 };
  const NAME = { opp: "Opposite", adj: "Adjacent", hyp: "Hypotenuse" };

  function compute() {
    const t = (ang * Math.PI) / 180, sn = Math.sin(t), cs = Math.cos(t), tn = Math.tan(t);
    if (known === "hyp") S = { hyp: V, opp: V * sn, adj: V * cs };
    else if (known === "opp") S = { opp: V, hyp: V / sn, adj: V / tn };
    else S = { adj: V, opp: V * tn, hyp: V / cs };
    return { sn, cs, tn };
  }

  function results(r) {
    const A = num(ang, 2) + "°", n = (x) => num(x, 4);
    const rows = [`<div class="line known">${NAME[known]} = ${num(V, 3)} cm</div>`];
    if (known === "hyp") {
      rows.push(`<div class="line found">Opposite: sin ${A} = opp ÷ hyp, so opp = ${num(V, 3)} × ${n(r.sn)} = ${num(S.opp)} cm</div>`);
      rows.push(`<div class="line found">Adjacent: cos ${A} = adj ÷ hyp, so adj = ${num(V, 3)} × ${n(r.cs)} = ${num(S.adj)} cm</div>`);
    } else if (known === "opp") {
      rows.push(`<div class="line found">Hypotenuse: sin ${A} = opp ÷ hyp, so hyp = ${num(V, 3)} ÷ ${n(r.sn)} = ${num(S.hyp)} cm</div>`);
      rows.push(`<div class="line found">Adjacent: tan ${A} = opp ÷ adj, so adj = ${num(V, 3)} ÷ ${n(r.tn)} = ${num(S.adj)} cm</div>`);
    } else {
      rows.push(`<div class="line found">Opposite: tan ${A} = opp ÷ adj, so opp = ${num(V, 3)} × ${n(r.tn)} = ${num(S.opp)} cm</div>`);
      rows.push(`<div class="line found">Hypotenuse: cos ${A} = adj ÷ hyp, so hyp = ${num(V, 3)} ÷ ${n(r.cs)} = ${num(S.hyp)} cm</div>`);
    }
    resEl.innerHTML = rows.join("");
  }

  function draw() {
    const { ctx, W, H } = TRIG.setupCanvas(canvas);
    ctx.fillStyle = NAVY; ctx.fillRect(0, 0, W, H);
    if (!ok) return;
    const t = (ang * Math.PI) / 180;
    const narrow = W < 500, nm = narrow ? { opp: "Opp.", adj: "Adj.", hyp: "Hyp." } : NAME;
    const L = Math.min((W - (narrow ? 118 : 170)) / Math.cos(t), (H - 100) / Math.sin(t), 420);
    const aw = L * Math.cos(t), oh = L * Math.sin(t);
    const ax = narrow ? 22 : (W - aw) / 2 - 20, ay = H - 52;
    const A = [ax, ay], C = [ax + aw, ay], Bp = [ax + aw, ay - oh];
    const col = (k) => (k === known ? KNOWN : FOUND);
    ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...C); ctx.lineTo(...Bp); ctx.closePath();
    ctx.fillStyle = "rgba(167,139,250,0.10)"; ctx.fill();
    side(ctx, A, C, col("adj")); side(ctx, C, Bp, col("opp")); side(ctx, A, Bp, col("hyp"));
    rightAngleMark(ctx, C[0], C[1], -1, -1, 14);
    // angle arc + name
    const ar = Math.min(46, aw * 0.4);
    ctx.beginPath(); ctx.arc(ax, ay, ar, -t, 0); ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.stroke();
    label(ctx, [num(ang, 2) + "°"], ax + ar + 8, ay - 6 - Math.min(ar * 0.2, 6), INK, "left");
    label(ctx, [nm.adj + " " + num(S.adj) + " cm"], (A[0] + C[0]) / 2, ay + 26, col("adj"));
    label(ctx, [nm.opp + " " + num(S.opp) + " cm"], C[0] + 14, (C[1] + Bp[1]) / 2 + 4, col("opp"), "left");
    // hypotenuse label sits above the slanted side
    const mx = (A[0] + Bp[0]) / 2, my = (A[1] + Bp[1]) / 2;
    const hy = nm.hyp + " " + num(S.hyp) + " cm";
    ctx.font = "600 14px Inter, system-ui, sans-serif";
    const hx = Math.max(mx - 12 - Math.sin(t) * 10, ctx.measureText(hy).width + 8);
    label(ctx, [hy], hx, my - 12 - Math.cos(t) * 10, col("hyp"), "right");
  }

  function update(src) {
    let a = parseFloat(angEl.value);
    if (src === "slider") { a = parseFloat(slideEl.value); angEl.value = a; }
    const v = parseFloat(valEl.value);
    ok = isFinite(a) && a >= 1 && a <= 89 && isFinite(v) && v > 0;
    warnEl.textContent = ok ? "" : (isFinite(a) && a >= 1 && a <= 89 ? "Type a length greater than 0." : "Type an angle between 1 and 89.");
    btns.forEach((b) => b.classList.toggle("active", b.dataset.side === known));
    if (ok) {
      ang = a; V = v; if (src !== "slider") slideEl.value = Math.round(a);
      const r = compute();
      rSin.textContent = num(r.sn, 4); rCos.textContent = num(r.cs, 4); rTan.textContent = num(r.tn, 4);
      results(r);
    } else {
      rSin.textContent = rCos.textContent = rTan.textContent = "–"; resEl.innerHTML = "";
    }
    draw();
  }

  btns.forEach((b) => b.addEventListener("click", () => { known = b.dataset.side; update(); }));
  angEl.addEventListener("input", () => update());
  slideEl.addEventListener("input", () => update("slider"));
  valEl.addEventListener("input", () => update());
  window.addEventListener("resize", draw);
  update();
  window.__tr = { set: (a, k, v) => { angEl.value = a; known = k; valEl.value = v; update(); }, sides: () => S };
})();

/* ---------- Quiz ---------- */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;
  const questions = [
    { q: "In a right triangle, sin of an angle is…",
      options: ["adjacent ÷ hypotenuse", "opposite ÷ hypotenuse", "opposite ÷ adjacent", "hypotenuse ÷ opposite"], answer: 1,
      explain: "sin = opposite ÷ hypotenuse. cos uses the adjacent side, and tan = opposite ÷ adjacent." },
    { q: "tan θ is equal to…",
      options: ["adjacent ÷ hypotenuse", "opposite ÷ hypotenuse", "opposite ÷ adjacent", "adjacent ÷ opposite"], answer: 2,
      explain: "tan θ = opposite ÷ adjacent. It does not use the hypotenuse." },
    { q: "The sides of a 45° – 45° – 90° triangle are in the ratio…",
      options: ["1 : 1 : √2", "1 : 1 : 2", "1 : √2 : √3", "1 : 2 : 3"], answer: 0,
      explain: "Two equal legs of 1 give a hypotenuse of √(1² + 1²) = √2." },
    { q: "The sides of a 30° – 60° – 90° triangle are in the ratio…",
      options: ["1 : 1 : √2", "1 : 2 : 3", "√3 : 1 : 2", "1 : √3 : 2"], answer: 3,
      explain: "Short side 1, long side √3, hypotenuse 2. Check: 1² + (√3)² = 4 = 2²." },
    { q: "In a 30° – 60° – 90° triangle the hypotenuse is 10 cm. How long is the side opposite 30°?",
      options: ["10 cm", "5√3 cm", "5 cm", "20 cm"], answer: 2,
      explain: "The short side is half the hypotenuse: 10 × 1/2 = 5 cm." },
    { q: "In a 45° – 45° – 90° triangle each leg is 4 cm. How long is the hypotenuse?",
      options: ["4 cm", "8 cm", "4√2 cm", "2√2 cm"], answer: 2,
      explain: "Hypotenuse = leg × √2 = 4√2 cm." },
    { q: "What is sin 30°?",
      options: ["√3/2", "1/2", "1", "1/√2"], answer: 1,
      explain: "In the 30-60-90 triangle, the side opposite 30° is 1 and the hypotenuse is 2. So sin 30° = 1/2." },
    { q: "A right triangle has an angle of 45° and an adjacent side of 7 cm. How long is the opposite side?",
      options: ["7√2 cm", "7 cm", "14 cm", "3.5 cm"], answer: 1,
      explain: "tan 45° = 1, so opposite = 7 × 1 = 7 cm. The two legs are equal." },
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
    let v = "Nice start. Play with the triangles above again and retry.";
    if (pct >= 80) v = "Excellent! You know your triangles.";
    else if (pct >= 50) v = "Good work. One more look at the ratios and you've got it.";
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