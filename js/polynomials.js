/* Polynomials and Equations — Class 10 Maths, Part II, Chapter 9
   Second-degree equation solver + graph, and a quiz. */

/* ---------- Solver + graph ---------- */
(function () {
  "use strict";
  const canvas = document.getElementById("graphCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const inA = document.getElementById("inA");
  const inB = document.getElementById("inB");
  const inC = document.getElementById("inC");
  const eqEl = document.getElementById("eqText");
  const kindEl = document.getElementById("kindText");
  const workEl = document.getElementById("workBox");
  const ansEl = document.getElementById("answerText");
  const factEl = document.getElementById("factorText");
  const presets = document.querySelectorAll(".eq-preset");
  const H = 320;
  let W = 600, model = null, pending = false;

  const SUP2 = "²", MINUS = "−";
  const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));
  const tidy = (x) => { const s = parseFloat(Number(x).toFixed(3)).toString(); return s.replace("-", MINUS); };
  const isInt = (x) => Math.abs(x - Math.round(x)) < 1e-9;

  // fraction text for (num / den) with integers, else decimal
  function frac(num, den) {
    if (den < 0) { num = -num; den = -den; }
    const g = gcd(num, den) || 1;
    num /= g; den /= g;
    const n = String(num).replace("-", MINUS);
    return den === 1 ? n : n + "/" + den;
  }

  function term(coef, power, first) {
    if (coef === 0) return "";
    const sign = coef < 0 ? (first ? MINUS : " " + MINUS + " ") : (first ? "" : " + ");
    const abs = Math.abs(coef);
    const num = abs === 1 && power > 0 ? "" : tidy(abs).replace(MINUS, "");
    const v = power === 0 ? "" : power === 1 ? "x" : "x" + SUP2;
    return sign + num + v;
  }
  function equationText(a, b, c) {
    let s = term(a, 2, true);
    const t2 = term(b, 1, s === ""), t3 = term(c, 0, s === "" && t2 === "");
    return (s + t2 + t3 || "0") + " = 0";
  }

  function solve(a, b, c) {
    const D = b * b - 4 * a * c;
    const m = { a, b, c, D: Math.abs(D) < 1e-9 ? 0 : D, roots: [], rootText: [] };
    const allInt = isInt(a) && isInt(b) && isInt(c);
    if (m.D < 0) { m.kind = "none"; return m; }
    const s = Math.sqrt(m.D);
    const r1 = (-b + s) / (2 * a), r2 = (-b - s) / (2 * a);
    if (m.D === 0) {
      m.kind = "one"; m.roots = [r1];
      m.rootText = [allInt ? frac(-b, 2 * a) : tidy(r1)];
    } else {
      m.kind = "two"; m.roots = [Math.min(r1, r2), Math.max(r1, r2)];
      const perfect = allInt && isInt(s);
      m.rootText = m.roots.map((r) => {
        if (!perfect) return tidy(r);
        // r = (-b ± s) / 2a, recover the numerator
        return frac(Math.round(r * 2 * a), 2 * a);
      });
    }
    return m;
  }

  function showWork(m) {
    const { a, b, c, D } = m;
    const lines = [];
    lines.push("a = " + tidy(a) + ",  b = " + tidy(b) + ",  c = " + tidy(c));
    lines.push("D = b" + SUP2 + " " + MINUS + " 4ac = " + tidy(D));
    if (m.kind === "two") lines.push("x = (" + MINUS + "b ± √D) ÷ 2a = (" + tidy(-b).replace("-", MINUS) + " ± " + tidy(Math.sqrt(D)) + ") ÷ " + tidy(2 * a));
    if (m.kind === "one") lines.push("D = 0, so x = " + MINUS + "b ÷ 2a");
    if (m.kind === "none") lines.push("D is negative, so √D is not a real number.");
    workEl.innerHTML = "";
    lines.forEach((t) => { const d = document.createElement("div"); d.textContent = t; workEl.appendChild(d); });
  }

  function update() {
    const a = parseFloat(inA.value), b = parseFloat(inB.value), c = parseFloat(inC.value);
    const ok = isFinite(a) && isFinite(b) && isFinite(c);
    presets.forEach((p) => p.classList.toggle("active", ok && +p.dataset.a === a && +p.dataset.b === b && +p.dataset.c === c));
    if (!ok) {
      model = null; eqEl.textContent = "Enter a, b and c";
      kindEl.textContent = ""; workEl.textContent = ""; ansEl.textContent = "—"; factEl.textContent = "";
      redraw(); return;
    }
    if (a === 0) {
      model = null; eqEl.textContent = equationText(a, b, c);
      kindEl.textContent = "a cannot be 0. If a = 0 it is not a second degree equation.";
      workEl.textContent = ""; ansEl.textContent = "—"; factEl.textContent = "";
      redraw(); return;
    }
    model = solve(a, b, c);
    eqEl.textContent = equationText(a, b, c);
    showWork(model);
    if (model.kind === "two") {
      kindEl.textContent = "Two solutions. The graph crosses the x-axis at two points.";
      ansEl.textContent = "x = " + model.rootText[0] + "   or   x = " + model.rootText[1];
      const f = (r, t) => (r === 0 ? "x" : "(x " + (r > 0 ? MINUS : "+") + " " + t.replace(MINUS, "") + ")");
      const exact = model.rootText.every((t) => t.indexOf(".") < 0);
      const lead = a === 1 ? "" : a === -1 ? MINUS : tidy(a);
      factEl.textContent = exact ? "Factors: " + lead + f(model.roots[0], model.rootText[0]) + f(model.roots[1], model.rootText[1]) : "";
    } else if (model.kind === "one") {
      kindEl.textContent = "One solution. The graph just touches the x-axis.";
      ansEl.textContent = "x = " + model.rootText[0];
      factEl.textContent = "";
    } else {
      kindEl.textContent = "No real solution. The graph never touches the x-axis.";
      ansEl.textContent = "No real solution";
      factEl.textContent = "";
    }
    redraw();
  }

  /* ---------- graph ---------- */
  function niceStep(span) {
    const raw = span / 7, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
    return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
  }
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth || 600;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }
  function redraw() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; draw(); });
  }

  function draw() {
    ctx.fillStyle = "#10162E"; ctx.fillRect(0, 0, W, H);
    // view window
    let a = 1, b = 0, c = -1;
    if (model) { a = model.a; b = model.b; c = model.c; }
    const vx = -b / (2 * a);
    const pts = [0, vx].concat(model ? model.roots : []);
    let xmin = Math.min.apply(null, pts), xmax = Math.max.apply(null, pts);
    let span = Math.max(xmax - xmin, 4);
    const mid = (xmin + xmax) / 2;
    xmin = mid - span * 0.75; xmax = mid + span * 0.75;
    const f = (x) => a * x * x + b * x + c;
    const ys = [0, f(vx), f(xmin), f(xmax)];
    let ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys);
    // keep the picture readable: limit height to about 1.6x the x-span
    const maxSpan = (xmax - xmin) * 0.55 * (H / (W * 0.55));
    if (ymax - ymin > maxSpan * 2.2) { // clip very steep curves around the axis
      const keep = maxSpan * 2.2;
      if (a > 0) { ymax = ymin + keep; } else { ymin = ymax - keep; }
    }
    if (ymax - ymin < 4) { const m2 = (ymax + ymin) / 2; ymin = m2 - 2; ymax = m2 + 2; }
    const padY = (ymax - ymin) * 0.12;
    ymin -= padY; ymax += padY;
    const X = (x) => ((x - xmin) / (xmax - xmin)) * W;
    const Y = (y) => H - ((y - ymin) / (ymax - ymin)) * H;

    // grid + ticks
    ctx.font = "500 10px 'JetBrains Mono', monospace";
    const sx = niceStep(xmax - xmin), sy = niceStep(ymax - ymin);
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xmin / sx) * sx; x <= xmax; x += sx) {
      ctx.strokeStyle = "rgba(250,247,241,0.08)"; ctx.beginPath(); ctx.moveTo(X(x), 0); ctx.lineTo(X(x), H); ctx.stroke();
    }
    for (let y = Math.ceil(ymin / sy) * sy; y <= ymax; y += sy) {
      ctx.strokeStyle = "rgba(250,247,241,0.08)"; ctx.beginPath(); ctx.moveTo(0, Y(y)); ctx.lineTo(W, Y(y)); ctx.stroke();
    }
    // axes
    const axY = Math.max(14, Math.min(H - 6, Y(0))), axX = Math.max(6, Math.min(W - 14, X(0)));
    ctx.strokeStyle = "rgba(250,247,241,0.6)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, axY); ctx.lineTo(W, axY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(axX, 0); ctx.lineTo(axX, H); ctx.stroke();
    ctx.fillStyle = "rgba(250,247,241,0.75)"; ctx.textAlign = "center";
    for (let x = Math.ceil(xmin / sx) * sx; x <= xmax; x += sx) {
      if (Math.abs(x) < sx / 2) continue;
      ctx.fillText(tidy(x).replace(MINUS, "-"), X(x), Math.min(H - 4, axY + 14));
    }
    ctx.textAlign = "left";
    for (let y = Math.ceil(ymin / sy) * sy; y <= ymax; y += sy) {
      if (Math.abs(y) < sy / 2) continue;
      ctx.fillText(tidy(y).replace(MINUS, "-"), Math.min(W - 40, axX + 6), Y(y) - 3);
    }
    ctx.font = "700 12px 'JetBrains Mono', monospace";
    ctx.fillText("y", Math.min(W - 14, axX + 8), 12);
    ctx.textAlign = "right"; ctx.fillText("x", W - 6, Math.max(14, axY - 8));

    if (!model) return;
    // curve (clipped)
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
    ctx.strokeStyle = "#A78BFA"; ctx.lineWidth = 2.6; ctx.beginPath();
    for (let px = 0; px <= W; px += 2) {
      const x = xmin + (px / W) * (xmax - xmin), y = Y(f(x));
      if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.restore();
    // roots
    ctx.textAlign = "center";
    model.roots.forEach((r, i) => {
      const x = X(r), y = Y(0);
      ctx.fillStyle = "#FFB03A"; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#FFB03A"; ctx.font = "700 11px 'JetBrains Mono', monospace";
      const t = "x = " + model.rootText[i];
      const above = i % 2 === 0 ? -14 : 22;
      ctx.fillText(t, Math.max(40, Math.min(W - 40, x)), Math.max(14, Math.min(H - 6, y + above)));
    });
  }

  [inA, inB, inC].forEach((el) => el.addEventListener("input", update));
  presets.forEach((p) => p.addEventListener("click", () => {
    inA.value = p.dataset.a; inB.value = p.dataset.b; inC.value = p.dataset.c; update();
  }));
  window.addEventListener("resize", resize);
  resize(); update();
  window.__poly = { solve, update };
})();

/* ---------- Quiz ---------- */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;
  const questions = [
    { q: "What is the degree of the polynomial x² + 3x + 2?",
      options: ["1", "2", "3", "5"], answer: 1,
      explain: "The degree is the highest power of x. Here it is 2, so this is a second degree polynomial." },
    { q: "(x + 4)(x − 1) = ?",
      options: ["x² + 3x − 4", "x² − 3x − 4", "x² + 5x − 4", "x² + 3x + 4"], answer: 0,
      explain: "(x + a)(x + b) = x² + (a + b)x + ab with a = 4 and b = −1: x² + 3x − 4." },
    { q: "Write x² − 5x + 6 as a product of two first degree polynomials.",
      options: ["(x + 2)(x + 3)", "(x − 2)(x − 3)", "(x − 1)(x − 6)", "(x + 1)(x − 6)"], answer: 1,
      explain: "We need two numbers with sum −5 and product 6. They are −2 and −3, so (x − 2)(x − 3)." },
    { q: "What are the solutions of (x − 1)(x − 3) = 0?",
      options: ["x = −1 or x = −3", "x = 1 or x = 3", "x = 3 only", "x = 4"], answer: 1,
      explain: "A product is zero when one factor is zero: x − 1 = 0 or x − 3 = 0, so x = 1 or x = 3." },
    { q: "Solve x² + x − 6 = 0.",
      options: ["x = 2 or x = −3", "x = −2 or x = 3", "x = 1 or x = −6", "x = 6 or x = −1"], answer: 0,
      explain: "Sum 1, product −6 gives the numbers 3 and −2, so (x + 3)(x − 2) = 0 and x = −3 or x = 2." },
    { q: "Where does the graph of 2x² + 3x − 2 cross the x-axis?",
      options: ["(2, 0) and (−1/2, 0)", "(−2, 0) and (1/2, 0)", "(1, 0) and (−2, 0)", "(−2, 0) only"], answer: 1,
      explain: "With a = 2, b = 3, c = −2: x = (−3 ± √25) ÷ 4, so x = 1/2 or x = −2. The points are (−2, 0) and (1/2, 0)." },
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
    let v = "Nice start. Try the solver above and retry.";
    if (pct >= 80) v = "Excellent! You can factorise and solve second degree equations.";
    else if (pct >= 50) v = "Good work. A few more tries in the solver and you've got it.";
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