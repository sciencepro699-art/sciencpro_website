/* Second Degree Equations — Class 10 Maths, Chapter 5
   Completing the square, shown with area tiles, step by step.
   Type b and c, or pick one of four examples. Equation form: x² + bx + c = 0.  Plus a quiz. */

(function () {
  "use strict";
  const canvas = document.getElementById("squareCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const inB = document.getElementById("inB");
  const inC = document.getElementById("inC");
  const presets = document.querySelectorAll(".eq-preset");
  const prevBtn = document.getElementById("stepPrev");
  const nextBtn = document.getElementById("stepNext");
  const resetBtn = document.getElementById("stepReset");
  const numEl = document.getElementById("stepNum");
  const titleEl = document.getElementById("stepTitle");
  const textEl = document.getElementById("stepText");
  const algEl = document.getElementById("algebra");
  const TOTAL = 6, H = 320, MINUS = "−", SUP = "²";

  let W = 600, step = 1;
  let B = 4, C = 3, valid = true;
  let m = 0, g = 0, mT = 0, gT = 0, running = false;

  /* ---------- number formatting ---------- */
  const isInt = (x) => Math.abs(x - Math.round(x)) < 1e-9;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const dec = (x) => parseFloat(Number(x).toFixed(3)).toString().replace("-", MINUS);
  function frac(n, d) {            // integer n over integer d
    if (d < 0) { n = -n; d = -d; }
    const k = gcd(n, d) || 1; n /= k; d /= k;
    return (d === 1 ? String(n) : n + "/" + d).replace("-", MINUS);
  }
  const half = (x) => (isInt(x) ? frac(Math.round(x), 2) : dec(x / 2));
  const sgn = (p) => (p < 0 ? " " + MINUS + " " : " + ");
  const absTxt = (s) => s.replace(MINUS, "");

  /* ---------- the maths ---------- */
  function work() {
    const p = B / 2;
    const q = -C + p * p;
    const w = { p, q, kind: q > 1e-9 ? "two" : Math.abs(q) <= 1e-9 ? "one" : "none" };
    const allInt = isInt(B) && isInt(C);
    const n = B * B - 4 * C;                         // q = n / 4
    w.pT = half(B);                                  // p as text
    w.p2T = allInt ? frac(Math.round(B * B), 4) : dec(p * p);
    w.qT = allInt ? frac(Math.round(n), 4) : dec(q);
    if (w.kind !== "none") {
      const s = Math.sqrt(Math.max(q, 0));
      const perfect = allInt && n >= 0 && isInt(Math.sqrt(n));
      w.sT = perfect ? frac(Math.round(Math.sqrt(n)), 2) : dec(s);
      const x1 = -p + s, x2 = -p - s;
      w.x = w.kind === "one" ? [perfect || allInt ? frac(Math.round(-B), 2) : dec(-p)]
        : [x1, x2].map((x, i) => (perfect ? frac(Math.round(-B + (i ? -1 : 1) * Math.sqrt(n)), 2) : dec(x)));
    }
    return w;
  }
  const xPlus = (pT, p) => (p === 0 ? "x" : "x" + sgn(p) + absTxt(pT));

  function algebraLines(w) {
    const lines = [];
    const eq = "x" + SUP + (B === 0 ? "" : (B < 0 ? " " + MINUS + " " : " + ") + (Math.abs(B) === 1 ? "" : absTxt(dec(B))) + "x")
      + (C === 0 ? "" : (C < 0 ? " " + MINUS + " " : " + ") + absTxt(dec(C)));
    lines.push({ from: 1, text: eq + " = 0" });
    const left = "x" + SUP + (B === 0 ? "" : (B < 0 ? " " + MINUS + " " : " + ") + (Math.abs(B) === 1 ? "" : absTxt(dec(B))) + "x");
    lines.push({ from: 2, text: left + " = " + dec(-C) });
    if (B !== 0) {
      lines.push({ from: 4, text: left + " + " + w.p2T + " = " + dec(-C) + " + " + w.p2T });
      lines.push({ from: 5, text: "(" + xPlus(w.pT, w.p) + ")" + SUP + " = " + w.qT });
    } else {
      lines.push({ from: 5, text: "x" + SUP + " = " + dec(-C) });
    }
    if (w.kind === "two") {
      lines.push({ from: 6, text: xPlus(w.pT, w.p) + " = " + w.sT + "   or   " + xPlus(w.pT, w.p) + " = " + MINUS + w.sT });
      lines.push({ from: 6, text: "x = " + w.x[0] + "   or   x = " + w.x[1], answer: true });
    } else if (w.kind === "one") {
      lines.push({ from: 6, text: xPlus(w.pT, w.p) + " = 0", });
      lines.push({ from: 6, text: "x = " + w.x[0], answer: true });
    } else {
      lines.push({ from: 6, text: "A square can never be negative, so there is no real solution.", answer: true });
    }
    return lines;
  }

  function stepInfo(w) {
    const t = [
      ["The equation", "x" + SUP + " is a square with side x. The bx part is a strip " + dec(Math.abs(B)) + " wide and x long" + (B < 0 ? " that we take away." : ".")],
      ["Move c to the right", "We get x" + SUP + " + bx on the left, and the number " + dec(-C) + " on the right. We only work with the tiles on the left."],
      ["Cut the bx strip in half", B === 0 ? "b is 0, so there is no strip to cut." : "Cut the strip into two equal halves, each " + half(Math.abs(B)) + " wide. Put one half on each side of the square."],
      ["Add the missing corner", B === 0 ? "Nothing is missing." : (B > 0 ? "A small corner square is missing. Its side is " + half(B) + ", so its area is " + w.p2T + ". Add it to both sides." : "The corner was taken away twice, so we add it back: " + w.p2T + ". Add it to both sides.")],
      ["Now it is a perfect square", "The left side is one big square. Its side is (" + xPlus(w.pT, w.p) + "), so it equals (" + xPlus(w.pT, w.p) + ")" + SUP + ". The right side is " + (B === 0 ? dec(-C) : w.qT) + "."],
      ["Take the square root", w.kind === "none" ? "The right side is negative. No number squared gives a negative answer." : "A square root can be positive or negative, so there are two answers" + (w.kind === "one" ? " (here both are the same)." : ".")],
    ];
    return t;
  }

  /* ---------- UI ---------- */
  function render() {
    presets.forEach((p) => p.classList.toggle("active", valid && +p.dataset.b === B && +p.dataset.c === C));
    if (!valid) {
      titleEl.textContent = "Enter b and c";
      textEl.textContent = "Type numbers for b (between −40 and 40) and c.";
      algEl.innerHTML = ""; numEl.textContent = "Step " + step + " of " + TOTAL;
      draw(); return;
    }
    const w = work();
    const info = stepInfo(w)[step - 1];
    numEl.textContent = "Step " + step + " of " + TOTAL;
    titleEl.textContent = info[0];
    textEl.textContent = info[1];
    algEl.innerHTML = "";
    algebraLines(w).forEach((l) => {
      if (l.from > step) return;
      const d = document.createElement("div");
      d.className = "alg-line" + (l.answer ? " answer" : "") + (l.from === step ? " new" : "");
      d.textContent = l.text;
      algEl.appendChild(d);
    });
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === TOTAL;
    mT = step >= 3 ? 1 : 0;
    gT = step >= 4 ? 1 : 0;
    animate();
  }
  function setStep(s) { step = Math.max(1, Math.min(TOTAL, s)); render(); }
  function typed() {
    const b = parseFloat(inB.value), c = parseFloat(inC.value);
    valid = isFinite(b) && isFinite(c) && Math.abs(b) <= 40 && Math.abs(c) <= 1000;
    if (valid) { B = b; C = c; }
    step = 1; m = 0; g = 0; render();
  }
  function choose(b, c) { inB.value = b; inC.value = c; typed(); }

  /* ---------- animation ---------- */
  function animate() {
    if (running) return;
    running = true;
    (function tick() {
      m += (mT - m) * 0.14; g += (gT - g) * 0.14;
      if (Math.abs(mT - m) < 0.004) m = mT;
      if (Math.abs(gT - g) < 0.004) g = gT;
      draw();
      if (m !== mT || g !== gT) requestAnimationFrame(tick); else running = false;
    })();
  }

  /* ---------- drawing ---------- */
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpR = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];

  // returns tile rectangles in "units": [x, y, w, h]
  function tiles() {
    const hh = Math.abs(B), h = hh / 2;
    if (B >= 0) {
      const X = Math.max(5, hh + 2);
      return {
        X, h, neg: false,
        main: [0, 0, X, X],
        s1: [X, 0, h, X],
        s2: lerpR([X + h, 0, h, X], [0, X, X, h], m),
        corner: [X, X, h, h],
        w: lerp(X + hh, X + h, m), hgt: lerp(X, X + h, m),
      };
    }
    const X = Math.max(5, hh + 3);
    return {
      X, h, neg: true,
      main: [0, 0, X, X],
      keep: lerpR([0, 0, X - hh, X], [0, 0, X - h, X - h], m),
      s1: [X - h, 0, h, X],
      s2: lerpR([X - hh, 0, h, X], [0, X - h, X, h], m),
      corner: [X - h, X - h, h, h],
      w: X, hgt: X,
    };
  }

  function rect(r, ox, oy, u, fill, stroke, dash) {
    ctx.fillStyle = fill;
    ctx.fillRect(ox + r[0] * u, oy + r[1] * u, r[2] * u, r[3] * u);
    if (stroke) {
      ctx.setLineDash(dash || []);
      ctx.strokeStyle = stroke; ctx.lineWidth = 1.5;
      ctx.strokeRect(ox + r[0] * u + 0.5, oy + r[1] * u + 0.5, r[2] * u - 1, r[3] * u - 1);
      ctx.setLineDash([]);
    }
  }
  function label(t, x, y, color, size) {
    ctx.fillStyle = color || "#FAF7F1";
    ctx.font = "700 " + (size || 13) + "px 'JetBrains Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(t, x, y);
  }

  function draw() {
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#10162E"; ctx.fillRect(0, 0, W, H);
    if (!valid) return;
    const T = tiles();
    const hh = Math.abs(B), h = hh / 2;
    const extra = 34;                                   // room for labels
    const u = Math.max(4, Math.min((W - 60) / (T.w + (T.neg ? 0 : 0)), (H - 2 * extra) / T.hgt, 34));
    const ox = (W - T.w * u) / 2, oy = (H - T.hgt * u) / 2;
    const VIOLET = "rgba(167,139,250,0.9)", ORANGE = "rgba(255,176,58,0.85)", GREEN = "rgba(52,211,153,0.95)";
    const pText = dec(h);

    if (!T.neg) {
      rect(T.main, ox, oy, u, VIOLET, "rgba(255,255,255,0.7)");
      label("x" + SUP, ox + T.X * u / 2, oy + T.X * u / 2, "#10162E", 18);
      rect(T.s1, ox, oy, u, ORANGE, "rgba(255,255,255,0.7)");
      rect(T.s2, ox, oy, u, ORANGE, "rgba(255,255,255,0.7)");
      if (B !== 0) {
        if (m < 0.05) label(dec(B) + "x", ox + (T.X + hh / 2) * u, oy + T.X * u / 2, "#10162E", 15);
        else {
          label(pText + "x", ox + (T.X + h / 2) * u, oy + T.X * u / 2, "#10162E", 13);
          label(pText + "x", ox + (T.s2[0] + T.s2[2] / 2) * u, oy + (T.s2[1] + T.s2[3] / 2) * u, "#10162E", 13);
        }
      }
      if (g > 0.01 && B !== 0) {
        const c = T.corner, k = g, cx = c[0] + c[2] / 2, cy = c[1] + c[3] / 2;
        rect([cx - c[2] * k / 2, cy - c[3] * k / 2, c[2] * k, c[3] * k], ox, oy, u, GREEN, "#fff");
        if (g > 0.8) label(frac2(h * h), ox + cx * u, oy + cy * u, "#10162E", 12);
        // outline of the big square
        ctx.setLineDash([6, 4]); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
        ctx.strokeRect(ox, oy, (T.X + h) * u, (T.X + h) * u); ctx.setLineDash([]);
        label("x + " + pText, ox + (T.X + h) * u / 2, oy - 14, "#fff", 13);
        ctx.save(); ctx.translate(ox - 16, oy + (T.X + h) * u / 2); ctx.rotate(-Math.PI / 2);
        label("x + " + pText, 0, 0, "#fff", 13); ctx.restore();
      } else {
        label("x", ox + T.X * u / 2, oy - 14, "#FAF7F1", 13);
        if (B !== 0) label(m < 0.05 ? dec(hh) : pText, ox + (T.X + (m < 0.05 ? hh : h) / 2) * u, oy - 14, "#FFB03A", 13);
      }
    } else {
      // negative b: big square, strips removed, corner added back
      rect(T.keep, ox, oy, u, VIOLET, null);
      ctx.setLineDash([5, 4]); ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 1.5;
      ctx.strokeRect(ox + 0.5, oy + 0.5, T.X * u - 1, T.X * u - 1); ctx.setLineDash([]);
      const a = ctx.globalAlpha;
      ctx.globalAlpha = 0.8; rect(T.s1, ox, oy, u, ORANGE, "rgba(255,255,255,0.7)", [4, 3]);
      rect(T.s2, ox, oy, u, ORANGE, "rgba(255,255,255,0.7)", [4, 3]); ctx.globalAlpha = a;
      if (m < 0.05) label(dec(hh) + "x", ox + (T.X - hh / 2) * u, oy + T.X * u / 2, "#10162E", 13);
      if (m < 0.05) label("x" + SUP + " " + MINUS + " " + dec(hh) + "x", ox + (T.X - hh) * u / 2, oy + T.X * u / 2, "#10162E", 13);
      else if (g > 0.5) label("(x " + MINUS + " " + pText + ")" + SUP, ox + (T.X - h) * u / 2, oy + (T.X - h) * u / 2, "#10162E", 15);
      if (m >= 0.95) {
        label(pText + "x", ox + (T.X - h / 2) * u, oy + (T.X - h) * u / 2, "#10162E", 12);
        label(pText + "x", ox + (T.X - h) * u / 2, oy + (T.X - h / 2) * u, "#10162E", 12);
      }
      if (g > 0.01) {
        const c = T.corner, k = g, cx = c[0] + c[2] / 2, cy = c[1] + c[3] / 2;
        rect([cx - c[2] * k / 2, cy - c[3] * k / 2, c[2] * k, c[3] * k], ox, oy, u, GREEN, "#fff");
        if (g > 0.8) label(frac2(h * h), ox + cx * u, oy + cy * u, "#10162E", 12);
        ctx.setLineDash([6, 4]); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
        ctx.strokeRect(ox, oy, (T.X - h) * u, (T.X - h) * u); ctx.setLineDash([]);
        label("x " + MINUS + " " + pText, ox + (T.X - h) * u / 2, oy - 14, "#fff", 13);
      } else {
        label("x", ox + T.X * u / 2, oy - 14, "#FAF7F1", 13);
      }
    }
  }
  const frac2 = (v) => (isInt(v) ? String(Math.round(v)) : isInt(v * 4) ? frac(Math.round(v * 4), 4) : dec(v));

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth || 600;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  [inB, inC].forEach((el) => el.addEventListener("input", typed));
  presets.forEach((p) => p.addEventListener("click", () => choose(+p.dataset.b, +p.dataset.c)));
  prevBtn.addEventListener("click", () => setStep(step - 1));
  nextBtn.addEventListener("click", () => setStep(step + 1));
  resetBtn.addEventListener("click", () => { step = 1; m = 0; g = 0; render(); });
  window.addEventListener("resize", resize);

  resize(); choose(+presets[0].dataset.b, +presets[0].dataset.c);
  window.__sq = { setStep, work, algebraLines: () => algebraLines(work()), jump: (s) => { step = s; m = s >= 3 ? 1 : 0; g = s >= 4 ? 1 : 0; render(); m = mT; g = gT; draw(); } };
})();

/* ---------- Quiz ---------- */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;
  const questions = [
    { q: "What must be added to x² + 6x to make it a perfect square?",
      options: ["3", "6", "9", "36"], answer: 2,
      explain: "Half of 6 is 3, and 3² = 9. So x² + 6x + 9 = (x + 3)²." },
    { q: "x² − 4x + ___ = (x − 2)². What goes in the blank?",
      options: ["2", "4", "8", "16"], answer: 1,
      explain: "Half of 4 is 2, and 2² = 4. So x² − 4x + 4 = (x − 2)²." },
    { q: "What must be added to x² + 3x to complete the square?",
      options: ["3/2", "3", "9/4", "9"], answer: 2,
      explain: "Half of 3 is 3/2, and (3/2)² = 9/4." },
    { q: "Solve x² − 4x + 3 = 0 by completing the square.",
      options: ["x = 1 or x = 3", "x = −1 or x = −3", "x = 2 only", "x = 4 or x = −1"], answer: 0,
      explain: "x² − 4x = −3, add 4 to both sides: (x − 2)² = 1. So x − 2 = 1 or x − 2 = −1, giving x = 3 or x = 1." },
    { q: "Solve x² + 6x + 8 = 0.",
      options: ["x = 2 or x = 4", "x = −2 or x = −4", "x = −1 or x = −8", "x = 3 or x = −1"], answer: 1,
      explain: "x² + 6x = −8, add 9: (x + 3)² = 1. So x + 3 = 1 or −1, giving x = −2 or x = −4." },
    { q: "After completing the square you get (x + 3)² = −4. How many real solutions are there?",
      options: ["Two", "One", "None", "Four"], answer: 2,
      explain: "A square can never be negative, so no real number x satisfies this equation." },
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
    let v = "Nice start. Step through the tiles above again and retry.";
    if (pct >= 80) v = "Excellent! You can complete the square.";
    else if (pct >= 50) v = "Good work. One more run through the steps and you've got it.";
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