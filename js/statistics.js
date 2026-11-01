/* Statistics — Class 10 Maths, Chapter 13 (student heights).
   Lab 1: a class lined up by height; a new student joins; mean vs median.
   Lab 2: median from a height table (textbook method).
   Quiz: 5 questions. */

function statOrd(n) { const t = n % 100, d = n % 10; return n + (t > 10 && t < 14 ? "th" : d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th"); }
function statClean(x) { return parseFloat(Number(x).toFixed(2)).toString(); }
function statSizeCanvas(c) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2), W = c.clientWidth, H = c.clientHeight;
  c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
  const x = c.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx: x, W: W, H: H };
}

/* ---------- Lab 1: line up the class ---------- */
(function () {
  "use strict";
  const canvas = document.getElementById("hCanvas");
  if (!canvas) return;
  const BASE = [138, 142, 145, 147, 150, 152, 155, 158, 160];
  const slider = document.getElementById("hSlider"), val = document.getElementById("hVal");
  const resEl = document.getElementById("hResult"), noteEl = document.getElementById("hNote");
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  const MEAN0 = sum(BASE) / BASE.length, MED0 = BASE[4];
  let size = null;

  function calc(h) {
    const list = BASE.map((v) => ({ v: v, isNew: false }));
    list.push({ v: h, isNew: true });
    list.sort((a, b) => a.v - b.v || (a.isNew ? 1 : -1));
    const n = list.length, mean = sum(list.map((s) => s.v)) / n;
    const mid = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2];
    const median = mid.reduce((s, i) => s + list[i].v, 0) / mid.length;
    return { list: list, n: n, mean: mean, median: median, mid: mid };
  }

  function draw(r) {
    if (!size) return;
    const ctx = size.ctx, W = size.W, H = size.H, n = r.n;
    const top = 34, base = H - 30, slot = W / n;
    const hs = (v) => (v - 100) / 100 * (base - top - 30) + 36; // body height in px
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#d9d3c7"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, base); ctx.lineTo(W, base); ctx.stroke();
    ctx.textAlign = "center";
    r.list.forEach((s, i) => {
      const cx = slot * (i + 0.5), bw = Math.min(slot * 0.62, 34), bh = hs(s.v), headR = Math.min(bw * 0.42, 11);
      const isMid = r.mid.indexOf(i) >= 0;
      ctx.fillStyle = isMid ? "#FF5A1F" : s.isNew ? "#1a1a2e" : "#A78BFA";
      const by = base - bh + headR * 2 + 3;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(cx - bw / 2, by, bw, base - by, 6); else ctx.rect(cx - bw / 2, by, bw, base - by);
      ctx.fill();
      ctx.beginPath(); ctx.arc(cx, base - bh + headR, headR, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#1a1a2e"; ctx.font = "700 " + (slot < 36 ? 11 : 13) + "px Inter, sans-serif";
      ctx.fillText(String(s.v), cx, base + 18);
      if (s.isNew) { ctx.font = "700 11px Inter, sans-serif"; ctx.fillText("NEW", Math.min(Math.max(cx, 16), W - 16), base - bh - 8); }
    });
    // mean line
    const my = base - hs(r.mean) + 0;
    ctx.strokeStyle = "#1a1a2e"; ctx.lineWidth = 1.8; ctx.setLineDash([7, 5]);
    ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(W, my); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = "700 12px Inter, sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = "#1a1a2e";
    ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(6, 12); ctx.lineTo(26, 12); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillText("mean " + statClean(Math.round(r.mean * 10) / 10), 31, 16);
    ctx.textAlign = "right"; ctx.fillStyle = "#c2410c";
    ctx.fillText("middle", W - 6, 16);
    ctx.fillStyle = "#FF5A1F"; ctx.fillRect(W - 6 - ctx.measureText("middle").width - 16, 6, 11, 11);
  }

  function update() {
    const h = +slider.value; val.textContent = h + " cm";
    const r = calc(h), n = r.n, tot = sum(r.list.map((s) => s.v));
    const m = Math.round(r.mean * 10) / 10;
    const a = r.list[r.mid[0]].v, b = r.list[r.mid[1]].v;
    resEl.innerHTML =
      '<div class="line">Mean = ' + tot + ' ÷ ' + n + ' = <b>' + statClean(m) + ' cm</b></div>' +
      '<div class="line found">Median = (' + a + ' + ' + b + ') ÷ 2 = <b>' + statClean(r.median) + ' cm</b></div>' +
      '<div class="line note">10 students: the middle is the 5th and 6th (orange).</div>';
    const dMean = r.mean - MEAN0, dMed = r.median - MED0;
    noteEl.textContent = Math.abs(dMean) >= 1.5
      ? "Without the new student: mean " + statClean(Math.round(MEAN0 * 10) / 10) + ", median " + MED0 + ". The mean moved " + statClean(Math.round(Math.abs(dMean) * 10) / 10) + " cm, the median only " + statClean(Math.abs(dMed)) + " cm."
      : "The new student is close to the others, so both averages stay near 150 cm. Try Very tall!";
    draw(r);
  }

  function resize() { size = statSizeCanvas(canvas); update(); }
  slider.addEventListener("input", update);
  document.querySelectorAll("[data-h]").forEach((b) => b.addEventListener("click", () => { slider.value = b.dataset.h; update(); }));
  window.addEventListener("resize", resize);
  resize();
  window.__statH = { calc: calc };
})();

/* ---------- Lab 2: median from a height table ---------- */
(function () {
  "use strict";
  const canvas = document.getElementById("tCanvas");
  if (!canvas) return;
  const ROWS = [[130, 140, 3], [140, 150, 10], [150, 160, 10], [160, 170, 12], [170, 180, 6]];
  const body = document.querySelector("#medTable tbody"), btn = document.getElementById("medBtn");
  const box = document.getElementById("medBox"), stepsEl = document.getElementById("medSteps"), ansEl = document.getElementById("medAnswer");
  const n = ROWS.reduce((s, r) => s + r[2], 0), pos = (n + 1) / 2;
  let cum = 0, before = 0, mc = -1;
  const cums = ROWS.map((r) => (cum += r[2]));
  for (let i = 0; i < ROWS.length; i++) if (cums[i] >= pos) { mc = i; break; }
  before = mc ? cums[mc - 1] : 0;
  const lo = ROWS[mc][0], w = ROWS[mc][1] - lo, f = ROWS[mc][2], gap = w / f;
  const first = lo + gap / 2, k = pos - before - 1, median = first + k * gap;
  let shown = false, size = null;

  body.innerHTML = ROWS.map((r, i) => "<tr><td>" + r[0] + " – " + r[1] + "</td><td>" + r[2] + "</td><td>" + cums[i] + "</td></tr>").join("");

  function draw() {
    if (!size) return;
    const ctx = size.ctx, W = size.W, H = size.H, pad = 14, base = H - 26, top = 24;
    const slot = (W - pad * 2) / ROWS.length, mx = Math.max.apply(null, ROWS.map((r) => r[2]));
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.font = "700 12px Inter, sans-serif";
    ROWS.forEach((r, i) => {
      const x = pad + slot * i, bh = r[2] / mx * (base - top);
      ctx.fillStyle = shown && i === mc ? "#FF5A1F" : "#A78BFA";
      ctx.fillRect(x + 3, base - bh, slot - 6, bh);
      ctx.fillStyle = "#1a1a2e"; ctx.fillText(String(r[2]), x + slot / 2, base - bh - 6);
      ctx.fillText(String(r[0]), x, base + 16);
    });
    ctx.fillText(String(ROWS[ROWS.length - 1][1]), pad + slot * ROWS.length, base + 16);
    if (shown) {
      const x = pad + slot * mc + (median - lo) / w * slot;
      ctx.strokeStyle = "#1a1a2e"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(x, top - 4); ctx.lineTo(x, base); ctx.stroke(); ctx.setLineDash([]);
      const t = "median " + statClean(median), tw = ctx.measureText(t).width;
      ctx.fillStyle = "#1a1a2e"; ctx.textAlign = x + tw > W - 4 ? "right" : "left";
      ctx.fillText(t, x + (ctx.textAlign === "left" ? 6 : -6), 14);
    }
  }

  function show() {
    shown = true; btn.hidden = true; box.hidden = false;
    const s = [
      "n = " + n + " students (odd), so the median is the (" + n + " + 1) ÷ 2 = " + statOrd(pos) + " student.",
      "Totals so far: " + cums.join(", ") + ". The " + statOrd(pos) + " student is in " + lo + " – " + (lo + w) + " cm. " + before + " students are before this group.",
      f + " students share " + w + " cm, so the gap is " + w + " ÷ " + f + " = " + statClean(gap) + " cm. The first of them (the " + statOrd(before + 1) + " student) is at " + lo + " + " + statClean(gap / 2) + " = " + statClean(first) + " cm.",
      "The " + statOrd(pos) + " student is " + k + " steps later: " + statClean(first) + " + " + k + " × " + statClean(gap) + " = " + statClean(median) + " cm."
    ];
    stepsEl.innerHTML = s.map((t) => "<li></li>").join("");
    stepsEl.querySelectorAll("li").forEach((li, i) => (li.textContent = s[i]));
    ansEl.textContent = "Median = " + statClean(median) + " cm";
    body.children[mc].className = "active";
    draw();
  }

  btn.addEventListener("click", show);
  window.addEventListener("resize", () => { size = statSizeCanvas(canvas); draw(); });
  size = statSizeCanvas(canvas); draw();
  window.__statT = { median: median };
})();

/* ---------- Quiz ---------- */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;
  const questions = [
    { q: "A very tall student joins a class. Which average changes more?",
      options: ["The mean", "The median", "Both equally", "Neither"], answer: 0,
      explain: "A very tall height pulls the mean up. The median depends only on the middle position." },
    { q: "9 students stand in order of height. Which student gives the median?",
      options: ["4th", "5th", "9th", "The tallest"], answer: 1,
      explain: "For odd n the median is the (n + 1) ÷ 2 th item: (9 + 1) ÷ 2 = 5th." },
    { q: "10 students in order. The 5th is 150 cm and the 6th is 152 cm. What is the median height?",
      options: ["150 cm", "151 cm", "152 cm", "302 cm"], answer: 1,
      explain: "n is even, so take half the sum of the two middle values: (150 + 152) ÷ 2 = 151." },
    { q: "41 students. The median class is 150 – 160 cm with 10 students and 13 students before it. What is the median height?",
      options: ["155 cm", "157.5 cm", "160 cm", "150.5 cm"], answer: 1,
      explain: "Gap = 10 ÷ 10 = 1. The 14th student is at 150.5. The 21st is 7 steps later: 150.5 + 7 = 157.5." },
    { q: "In a table of 40 students, exactly 20 are below 150 cm. What is the median height?",
      options: ["145 cm", "149 cm", "150 cm", "155 cm"], answer: 2,
      explain: "20 is exactly half of 40, so half the students are below 150. The median is 150 itself." },
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
    let v = "Nice start. Play with the labs again and retry.";
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