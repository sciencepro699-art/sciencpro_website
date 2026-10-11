/* Statistics — Class 10 Maths, Chapter 13 (simple version)
   Lab 1: drag one income, watch mean vs median.
   Lab 2: median from a class-interval table (textbook method).
   Quiz: 5 questions. */

function statIN(x) { return Math.round(x).toLocaleString("en-IN"); }
function statClean(x) { return parseFloat(Number(x).toFixed(2)).toString(); }
function statMedian(a) {
  const s = a.slice().sort((x, y) => x - y), n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

/* ---------- Lab 1: mean vs median ---------- */
(function () {
  "use strict";
  const canvas = document.getElementById("meanCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const BASE = [16500, 21700, 18600, 21050, 19500, 17000, 21000, 18000, 22000, 17500];
  const MIN_V = 10000, MAX_V = 200000, H = 230, PAD = 30;
  const slider = document.getElementById("outlierSlider");
  const label = document.getElementById("outlierLabel");
  const rMean = document.getElementById("readMean");
  const rMed = document.getElementById("readMedian");
  const note = document.getElementById("meanNote");
  const presets = document.querySelectorAll(".outlier-preset");
  let val = 20000, W = 600, dragging = false, pending = false;

  const xOf = (v) => PAD + ((v - MIN_V) / (MAX_V - MIN_V)) * (W - 2 * PAD);
  const vOf = (x) => MIN_V + ((x - PAD) / (W - 2 * PAD)) * (MAX_V - MIN_V);
  function stats() {
    const all = BASE.concat([val]);
    return { mean: all.reduce((a, b) => a + b, 0) / all.length, med: statMedian(all) };
  }
  function updateUI() {
    const s = stats();
    label.textContent = "Rs " + statIN(val);
    slider.value = String(val);
    rMean.textContent = "Rs " + statIN(s.mean);
    rMed.textContent = "Rs " + statIN(s.med);
    note.textContent = val > 60000
      ? "One very high income pulled the mean up a lot. The median hardly moved, so it is the better average here."
      : "The new income is close to the others, so mean and median are both near Rs 19,000. Drag the dot far to the right!";
    presets.forEach((b) => b.classList.toggle("active", Math.abs(+b.dataset.val - val) < 250));
  }
  function setVal(v) { val = Math.max(MIN_V, Math.min(MAX_V, v)); updateUI(); redraw(); }
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
    const axisY = H - 50;
    ctx.fillStyle = "#10162E"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(250,247,241,0.4)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD - 10, axisY); ctx.lineTo(W - PAD + 10, axisY); ctx.stroke();
    ctx.font = "500 10px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
    [10000, 50000, 100000, 150000, 200000].forEach((t) => {
      ctx.fillStyle = "rgba(250,247,241,0.6)";
      ctx.fillText(statIN(t / 1000) + "k", xOf(t), axisY + 18);
    });
    const all = BASE.map((v) => ({ v, out: false })).concat([{ v: val, out: true }]).sort((a, b) => a.v - b.v);
    const placed = [];
    all.forEach((d) => {
      const x = xOf(d.v); let lv = 0;
      placed.forEach((p) => { if (Math.abs(p - x) < 9) lv++; });
      placed.push(x); d.x = x; d.y = axisY - 11 - lv * 11;
    });
    const s = stats(), mx = xOf(s.mean), dx = xOf(s.med);
    ctx.setLineDash([5, 4]); ctx.lineWidth = 1.6;
    ctx.strokeStyle = "#FF7A29"; ctx.beginPath(); ctx.moveTo(mx, 26); ctx.lineTo(mx, axisY); ctx.stroke();
    ctx.strokeStyle = "#4FC3F7"; ctx.beginPath(); ctx.moveTo(dx, 42); ctx.lineTo(dx, axisY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "600 11px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#FF7A29"; ctx.textAlign = mx > W / 2 ? "right" : "left";
    ctx.fillText("mean " + statIN(s.mean), mx + (mx > W / 2 ? -6 : 6), 24);
    ctx.fillStyle = "#4FC3F7"; ctx.textAlign = dx > W / 2 ? "right" : "left";
    ctx.fillText("median " + statIN(s.med), dx + (dx > W / 2 ? -6 : 6), 40);
    all.forEach((d) => {
      ctx.beginPath(); ctx.arc(d.x, d.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = d.out ? "#FFB03A" : "#A78BFA"; ctx.fill();
      if (d.out) {
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(d.x, d.y, 9, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "rgba(250,247,241,0.8)"; ctx.font = "600 10px 'JetBrains Mono', monospace";
        ctx.textAlign = d.x > W - 90 ? "right" : "left";
        ctx.fillText("drag me", d.x + (d.x > W - 90 ? -14 : 14), d.y + 4);
      }
    });
  }
  const px = (e) => { const r = canvas.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * W; };
  canvas.addEventListener("pointerdown", (e) => { dragging = true; canvas.setPointerCapture(e.pointerId); setVal(vOf(px(e))); e.preventDefault(); });
  canvas.addEventListener("pointermove", (e) => { if (dragging) setVal(vOf(px(e))); });
  const end = (e) => { if (!dragging) return; dragging = false; try { canvas.releasePointerCapture(e.pointerId); } catch (_) {} };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
  slider.addEventListener("input", () => setVal(parseFloat(slider.value)));
  presets.forEach((b) => b.addEventListener("click", () => setVal(+b.dataset.val)));
  window.addEventListener("resize", resize);
  resize(); updateUI();
  window.__statMean = { stats, setVal };
})();

/* ---------- Lab 2: median from a class table ---------- */
(function () {
  "use strict";
  const canvas = document.getElementById("medianCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const SETS = {
    wages: { title: "41 workers sorted by daily wage (Rs)", rows: [[400, 500, 6], [500, 600, 7], [600, 700, 10], [700, 800, 9], [800, 900, 5], [900, 1000, 4]] },
    age:   { title: "46 employees sorted by age (years)", rows: [[25, 30, 4], [30, 35, 7], [35, 40, 8], [40, 45, 10], [45, 50, 9], [50, 55, 8]] },
    marks: { title: "40 children sorted by marks", rows: [[0, 10, 4], [10, 20, 7], [20, 30, 9], [30, 40, 12], [40, 50, 8]] },
  };
  const titleEl = document.getElementById("setTitle");
  const tbody = document.querySelector("#medTable tbody");
  const stepsEl = document.getElementById("medSteps");
  const answerEl = document.getElementById("medAnswer");
  const btns = document.querySelectorAll(".set-btn");
  let rows = [], res = null, W = 600, H = 220, pending = false;
  const ord = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };

  function solve() {
    const n = rows.reduce((a, r) => a + r[2], 0);
    const cum = []; rows.reduce((a, r) => { a += r[2]; cum.push(a); return a; }, 0);
    const out = { n, cum, items: [], boundary: -1, median: 0 };
    const pos = n % 2 ? [(n + 1) / 2] : [n / 2, n / 2 + 1];
    out.pos = pos;
    if (n % 2 === 0) {
      const b = cum.findIndex((c, i) => c === n / 2 && i < rows.length - 1);
      if (b >= 0) { out.boundary = b; out.median = rows[b][1]; return out; }
    }
    pos.forEach((p) => {
      const i = cum.findIndex((c) => c >= p);
      const before = i ? cum[i - 1] : 0, lo = rows[i][0], hi = rows[i][1], f = rows[i][2];
      const gap = (hi - lo) / f, first = lo + gap / 2, j = p - before;
      out.items.push({ p, i, before, lo, hi, f, gap, first, j, value: first + (j - 1) * gap });
    });
    out.median = out.items.reduce((a, b) => a + b.value, 0) / out.items.length;
    return out;
  }

  function steps(r) {
    const s = [];
    s.push(r.n % 2
      ? "n = " + r.n + " (odd), so the median is the " + ord(r.pos[0]) + " item."
      : "n = " + r.n + " (even), so take the " + ord(r.pos[0]) + " and " + ord(r.pos[1]) + " items and find their average.");
    if (r.boundary >= 0) {
      const b = r.boundary;
      s.push("'Below " + rows[b][1] + "' is exactly " + r.cum[b] + ", which is half of " + r.n + ".");
      s.push("So the median is " + rows[b][1] + " itself.");
      return s;
    }
    const a = r.items[0];
    s.push("Median class = " + a.lo + " – " + a.hi + " (" + a.before + " items come before it).");
    s.push("Gap = " + (a.hi - a.lo) + " ÷ " + a.f + " = " + statClean(a.gap) + ". First item in the class = " + a.lo + " + " + statClean(a.gap / 2) + " = " + statClean(a.first) + ".");
    r.items.forEach((it) => s.push("The " + ord(it.p) + " item is no. " + it.j + " in the class: " + statClean(it.first) + " + " + (it.j - 1) + " × " + statClean(it.gap) + " = " + statClean(it.value) + "."));
    if (r.items.length === 2) s.push("Median = (" + statClean(r.items[0].value) + " + " + statClean(r.items[1].value) + ") ÷ 2 = " + statClean(r.median) + ".");
    return s;
  }

  function render() {
    res = solve();
    const active = res.boundary >= 0 ? [res.boundary, res.boundary + 1] : res.items.map((i) => i.i);
    tbody.innerHTML = "";
    rows.forEach((r, i) => {
      const tr = document.createElement("tr");
      if (active.indexOf(i) >= 0) tr.className = "active";
      [r[0] + " – " + r[1], String(r[2]), "Below " + r[1] + ": " + res.cum[i]].forEach((t) => {
        const td = document.createElement("td"); td.textContent = t; tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    stepsEl.innerHTML = "";
    steps(res).forEach((t) => { const li = document.createElement("li"); li.textContent = t; stepsEl.appendChild(li); });
    answerEl.textContent = "Median = " + statClean(res.median);
    redraw();
  }
  function load(k) {
    rows = SETS[k].rows.map((r) => r.slice());
    titleEl.textContent = SETS[k].title;
    btns.forEach((b) => b.classList.toggle("active", b.dataset.set === k));
    render();
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
    if (!res) return;
    const padL = 14, padR = 14, padT = 30, padB = 30, k = rows.length;
    const lo = rows[0][0], hi = rows[k - 1][1], maxF = Math.max.apply(null, rows.map((r) => r[2]));
    const pw = W - padL - padR, ph = H - padT - padB, base = padT + ph;
    const xv = (v) => padL + ((v - lo) / (hi - lo)) * pw;
    const yv = (f) => base - (f / (maxF + 1)) * ph;
    let mx;
    if (res.boundary >= 0) mx = res.median;
    else {
      const half = res.n / 2, i = res.cum.findIndex((c) => c >= half), before = i ? res.cum[i - 1] : 0;
      mx = rows[i][0] + ((half - before) / rows[i][2]) * (rows[i][1] - rows[i][0]);
    }
    const xm = xv(mx);
    rows.forEach((r) => {
      const x1 = xv(r[0]), x2 = xv(r[1]), y = yv(r[2]);
      ctx.fillStyle = "rgba(167,139,250,0.8)";
      if (Math.min(x2, xm) > x1) ctx.fillRect(x1, y, Math.min(x2, xm) - x1, base - y);
      ctx.fillStyle = "rgba(255,176,58,0.8)";
      if (x2 > Math.max(x1, xm)) ctx.fillRect(Math.max(x1, xm), y, x2 - Math.max(x1, xm), base - y);
      ctx.strokeStyle = "rgba(250,247,241,0.55)"; ctx.lineWidth = 1;
      ctx.strokeRect(x1 + 0.5, y + 0.5, x2 - x1 - 1, base - y - 1);
      ctx.fillStyle = "#FAF7F1"; ctx.font = "600 11px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
      ctx.fillText(String(r[2]), (x1 + x2) / 2, y - 6);
    });
    ctx.font = "500 10px 'JetBrains Mono', monospace"; ctx.fillStyle = "rgba(250,247,241,0.7)";
    const every = W < 480 && k > 6 ? 2 : 1;
    rows.forEach((r, i) => { if (i % every === 0) ctx.fillText(String(r[0]), xv(r[0]), base + 16); });
    ctx.fillText(String(hi), xv(hi), base + 16);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(xm, padT - 8); ctx.lineTo(xm, base); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#fff"; ctx.font = "700 11px 'JetBrains Mono', monospace";
    ctx.textAlign = xm > W - 100 ? "right" : "left";
    ctx.fillText("median = " + statClean(res.median), xm + (xm > W - 100 ? -6 : 6), padT - 12);
  }
  btns.forEach((b) => b.addEventListener("click", () => load(b.dataset.set)));
  window.addEventListener("resize", resize);
  resize(); load("wages");
  window.__statMedian = { load, getResult: () => res };
})();

/* ---------- Quiz ---------- */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;
  const questions = [
    { q: "One household with a very high income moves in. Which average changes more?",
      options: ["The mean", "The median", "Both equally", "Neither"], answer: 0,
      explain: "A very large value pulls the mean a lot. The median depends only on the middle position." },
    { q: "10 incomes in order have 18600 and 19500 in the middle. What is the median?",
      options: ["18,600", "19,500", "19,050", "38,100"], answer: 2,
      explain: "n is even, so take half the sum of the two middle values: (18600 + 19500) ÷ 2 = 19050." },
    { q: "A table has 41 workers. The median is the value of which worker?",
      options: ["20th", "21st", "41st", "Average of 20th and 21st"], answer: 1,
      explain: "For odd n the median is the (n + 1) ÷ 2 th item: (41 + 1) ÷ 2 = 21st." },
    { q: "Wages table (41 workers): median class 600–700, 13 workers before it, 10 in the class. What is the median wage?",
      options: ["650", "675", "700", "605"], answer: 1,
      explain: "Gap = 100 ÷ 10 = 10. The 14th worker earns 605. The 21st is 7 steps later: 605 + 7 × 10 = 675." },
    { q: "In a table of 40 children, 'Below 30' is exactly 20. What is the median mark?",
      options: ["25", "29", "30", "35"], answer: 2,
      explain: "20 is exactly half of 40, so half the children are below 30. The median is 30 itself." },
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
    let v = "Nice start. Try the labs again and retry.";
    if (pct >= 80) v = "Excellent! You've got mean and median.";
    else if (pct >= 50) v = "Good work. One more look at the steps and you've got it.";
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