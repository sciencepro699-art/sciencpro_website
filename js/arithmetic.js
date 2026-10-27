/* Arithmetic Sequences — Class 10 Maths
   Part 1: nth term with a jumping diagram.   Part 2: sum of terms (odd count, even count, general formula).   Then a quiz. */

/* If anything ever breaks, show the reason on the page instead of staying blank. */
window.addEventListener("error", function (e) {
  var d = document.getElementById("arErr");
  if (!d) {
    d = document.createElement("div"); d.id = "arErr";
    d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99;background:#B91C1C;color:#fff;padding:10px 16px;font:14px monospace";
    document.body.appendChild(d);
  }
  d.textContent = "Arithmetic Sequences page error: " + e.message + " (" + (e.filename || "").split("/").pop() + ":" + e.lineno + ")";
});

/* ---------- shared helpers ---------- */
const AR = (function () {
  const SUBS = "₀₁₂₃₄₅₆₇₈₉";
  const sub = (i) => String(i).split("").map((c) => SUBS[+c]).join("");
  const n$ = (v) => String(v).replace("-", "−");
  const par = (v) => (v < 0 ? "(" + n$(v) + ")" : String(v));
  const plus = (v) => (v < 0 ? " − " + Math.abs(v) : " + " + v);      // " + 5" or " − 5"
  const L = (cls, t) => '<div class="line ' + cls + '">' + t + "</div>";
  function algebra(d, c) {                                              // d·n + c   ->  "3n + 2"
    if (d === 0) return n$(c);
    let s = d === 1 ? "n" : d === -1 ? "−n" : n$(d) + "n";
    if (c !== 0) s += plus(c);
    return s;
  }
  /* draw the row of 12 boxes. cls(i) -> "on" | "pick" | "off".  hot(i) -> is the jump after box i highlighted (null = no jumps shown) */
  function chips(el, term, d, cls, hot) {
    el.textContent = "";
    for (let i = 1; i <= 12; i++) {
      const cell = document.createElement("div"); cell.className = "cell";
      const c = document.createElement("div"); c.className = "chip " + cls(i);
      const v = document.createElement("b"); v.textContent = n$(term(i));
      const s = document.createElement("span"); s.textContent = "x" + sub(i);
      c.appendChild(v); c.appendChild(s); cell.appendChild(c);
      if (hot && i < 12) {
        const j = document.createElement("div"); j.className = "jump" + (hot(i) ? " hot" : "");
        j.textContent = (d >= 0 ? "+" : "−") + Math.abs(d); cell.appendChild(j);
      }
      el.appendChild(cell);
    }
  }
  return { sub, n$, par, plus, L, algebra, chips };
})();

/* ---------- Part 1: nth term ---------- */
(function () {
  "use strict";
  const chipsEl = document.getElementById("arChips");
  if (!chipsEl) return;
  const { sub, n$, par, plus, L, algebra, chips } = AR;
  const $ = (id) => document.getElementById(id);
  const fIn = $("arF"), dIn = $("arD"), mIn = $("arM"), nIn = $("arN"), resEl = $("arResult"), resetBtn = $("arReset");
  const fV = $("arFv"), dV = $("arDv"), mV = $("arMv"), nV = $("arNv");
  let f = 5, d = 3, m = 1, n = 6;
  const term = (i) => f + (i - 1) * d;

  function explain() {
    const r = [], vm = term(m), vn = term(n), k = n - m, lo = Math.min(m, n), hi = Math.max(m, n);
    r.push(L("known", "Start: x" + sub(m) + " = " + n$(vm) + (m === 1 ? "  (the first term)" : "") + "      Find: x" + sub(n) + (n === 1 ? "  (the first term)" : "")));
    if (k === 0) {
      r.push(L("note", "Start and target are the same box. No jump needed."));
      r.push(L("found", "x" + sub(n) + " = " + n$(vn)));
    } else {
      r.push(L("known", "Jumps from x" + sub(m) + " to x" + sub(n) + " = n − m = " + n + " − " + m + " = " + n$(k) + (k < 0 ? "   (going backwards)" : "")));
      r.push(L("found", "x" + sub(n) + " = x" + sub(m) + " + (n − m) × d = " + n$(vm) + plus(k * d) + " = " + n$(vn)));
    }
    const c = vm - m * d;
    r.push(L("found", "Expression for any term:  xₙ = d·n + (x" + sub(m) + " − m·d) = " + n$(d) + "n + (" + n$(vm) + " − " + m + " × " + par(d) + ")  →  xₙ = " + algebra(d, c)));
    resEl.innerHTML = r.join("");
  }
  function update() {
    f = +fIn.value; d = +dIn.value; m = +mIn.value; n = +nIn.value;
    fV.textContent = n$(f); dV.textContent = n$(d); mV.textContent = m === 1 ? "x₁ (first term)" : "x" + sub(m); nV.textContent = "x" + sub(n);
    const lo = Math.min(m, n), hi = Math.max(m, n);
    chips(chipsEl, term, d,
      (i) => (i === n ? "pick" : i === m ? "on" : "off"),
      (i) => i >= lo && i < hi);
    explain();
  }
  [fIn, dIn, mIn, nIn].forEach((el) => el.addEventListener("input", update));
  resetBtn.addEventListener("click", () => { fIn.value = 5; dIn.value = 3; mIn.value = 1; nIn.value = 6; update(); });
  update();
  window.__ar1 = { set: (a, b, c, e) => { fIn.value = a; dIn.value = b; mIn.value = c; nIn.value = e; update(); }, text: () => resEl.textContent };
})();

/* ---------- Part 2: sum of terms ---------- */
(function () {
  "use strict";
  const chipsEl = document.getElementById("sChips");
  if (!chipsEl) return;
  const { sub, n$, par, plus, L, chips } = AR;
  const $ = (id) => document.getElementById(id);
  const fIn = $("sF"), dIn = $("sD"), nIn = $("sN"), resEl = $("sResult"), eqEl = $("sEq"), hintEl = $("sHint"), nLabel = $("sNlabel");
  const fV = $("sFv"), dV = $("sDv"), nV = $("sNv");
  const btns = document.querySelectorAll(".sm-mode");
  let mode = "odd", f = 5, d = 3, n = 5;
  const term = (i) => f + (i - 1) * d;
  const X = (i) => "x" + sub(i);
  const HINT = {
    odd: "An odd number of terms, like x₁ to x₅. Pairs from both ends add up to the same number.",
    even: "An even number of terms, like x₁ to x₆. Pairs from both ends add up to the same number.",
    gen: "Any number of terms. Use the formula.",
  };
  const NLAB = { odd: "Number of terms (odd)", even: "Number of terms (even)", gen: "Number of terms (n)" };
  const EQ = {
    odd: ["Sum = n × middle term", "x₁ + xₙ = 2 × middle term"],
    even: ["Sum = (n ÷ 2) × (x₁ + xₙ)", "Pairs x₁ + xₙ, x₂ + xₙ₋₁ … are all equal"],
    gen: ["S = ½ × n × (x₁ + xₙ)", "S = ½ × n × [ 2f + (n − 1)d ]"],
  };
  function explain() {
    const r = [];
    if (mode === "odd") {
      const mm = (n + 1) / 2, mid = term(mm), pairs = (n - 1) / 2;
      r.push(L("known", "Terms: " + Array.from({ length: n }, (_, k) => n$(term(k + 1))).join(", ")));
      for (let i = 1; i <= Math.min(pairs, 3); i++) r.push(L("note", X(i) + " + " + X(n + 1 - i) + " = " + n$(term(i)) + plus(term(n + 1 - i)) + " = " + n$(2 * mid)));
      if (pairs > 3) r.push(L("note", "… every pair makes " + n$(2 * mid)));
      r.push(L("known", "Middle term = " + X(mm) + " = " + n$(mid)));
      r.push(L("found", "Sum = n × middle term = " + n + " × " + par(mid) + " = " + n$(n * mid)));
    } else if (mode === "even") {
      const k = n / 2, ps = term(1) + term(n);
      r.push(L("known", "Terms: " + Array.from({ length: n }, (_, j) => n$(term(j + 1))).join(", ")));
      for (let i = 1; i <= Math.min(k, 3); i++) r.push(L("note", X(i) + " + " + X(n + 1 - i) + " = " + n$(term(i)) + plus(term(n + 1 - i)) + " = " + n$(ps)));
      if (k > 3) r.push(L("note", "… every pair makes " + n$(ps)));
      r.push(L("known", "Number of pairs = n ÷ 2 = " + n + " ÷ 2 = " + k));
      r.push(L("found", "Sum = " + k + " × " + par(ps) + " = " + n$(k * ps)));
    } else {
      const last = term(n), S = n * (f + last) / 2, inside = 2 * f + (n - 1) * d;
      r.push(L("known", "First term = " + n$(f) + ",   last term " + X(n) + " = " + n$(last) + ",   n = " + n));
      r.push(L("found", "S = ½ × n × (x₁ + xₙ) = ½ × " + n + " × (" + n$(f) + plus(last) + ") = " + n$(S)));
      r.push(L("found", "S = ½ × n × [2f + (n − 1)d] = ½ × " + n + " × [2 × " + par(f) + " + " + (n - 1) + " × " + par(d) + "] = ½ × " + n + " × " + par(inside) + " = " + n$(S)));
    }
    resEl.innerHTML = r.join("");
  }
  function fitN() {
    let v = +nIn.value;
    if (mode === "odd") { if (v % 2 === 0) v = v > 3 ? v - 1 : 3; nIn.min = 3; nIn.max = 11; nIn.step = 2; nIn.value = Math.max(3, Math.min(11, v)); }
    else if (mode === "even") { if (v % 2 === 1) v = v > 2 ? v - 1 : 2; nIn.min = 2; nIn.max = 12; nIn.step = 2; nIn.value = Math.max(2, Math.min(12, v)); }
    else { nIn.min = 2; nIn.max = 12; nIn.step = 1; nIn.value = Math.max(2, Math.min(12, v)); }
  }
  function update() {
    f = +fIn.value; d = +dIn.value; n = +nIn.value;
    fV.textContent = n$(f); dV.textContent = n$(d); nV.textContent = n;
    btns.forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
    hintEl.textContent = HINT[mode]; nLabel.textContent = NLAB[mode];
    eqEl.innerHTML = EQ[mode].map((t, i) => '<div class="' + (i ? "eq2" : "eq1") + '">' + t + "</div>").join("");
    chips(chipsEl, term, d, (i) => (i <= n ? "on" : "off"), null);
    explain();
  }
  btns.forEach((b) => b.addEventListener("click", () => { mode = b.dataset.mode; fitN(); update(); }));
  [fIn, dIn, nIn].forEach((el) => el.addEventListener("input", update));
  fitN(); update();
  window.__ar2 = { set: (a, b, c, e) => { fIn.value = a; dIn.value = b; mode = e || mode; fitN(); nIn.value = c; update(); }, text: () => resEl.textContent };
})();

/* ---------- Quiz ---------- */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;
  const questions = [
    { q: "Which one is an arithmetic sequence?",
      options: ["5, 8, 11, 14, …", "1, 4, 9, 16, …", "2, 4, 8, 16, …", "1, 1/2, 1/3, 1/4, …"], answer: 0,
      explain: "Only 5, 8, 11, 14 adds the same number (3) every time. The others add different amounts each step." },
    { q: "The first term of an arithmetic sequence is 7 and the common difference is 4. What is the 10th term?",
      options: ["47", "43", "40", "11"], answer: 1,
      explain: "To reach the 10th term, add d nine times: 7 + 9 × 4 = 7 + 36 = 43." },
    { q: "The 5th term of an arithmetic sequence is 17 and the 9th term is 33. What is the common difference?",
      options: ["16", "8", "4", "2"], answer: 2,
      explain: "Term gap = 33 − 17 = 16. Position gap = 9 − 5 = 4. So d = 16 ÷ 4 = 4." },
    { q: "What is the algebraic form of the sequence 5, 8, 11, 14, …?",
      options: ["5n + 3", "3n + 5", "3n + 2", "n + 3"], answer: 2,
      explain: "d = 3, so xₙ = 3n + (f − d) = 3n + (5 − 3) = 3n + 2. Check n = 1: 3 + 2 = 5." },
    { q: "In an arithmetic sequence the 3rd term is 11. What is the sum of its first 5 terms?",
      options: ["44", "55", "66", "11"], answer: 1,
      explain: "For an odd number of terms the sum = number of terms × middle term. The middle (3rd) term is 11, so 5 × 11 = 55." },
    { q: "An arithmetic sequence has 6 terms. The first term plus the last term is 22. What is the sum of all 6 terms?",
      options: ["132", "22", "66", "44"], answer: 2,
      explain: "Pairs x₁ + x₆, x₂ + x₅, x₃ + x₄ each make 22. There are 3 pairs, so 3 × 22 = 66." },
    { q: "What is the sum of the first 20 natural numbers 1 + 2 + 3 + … + 20?",
      options: ["200", "400", "420", "210"], answer: 3,
      explain: "½ × n × (first + last) = ½ × 20 × (1 + 20) = 10 × 21 = 210." },
    { q: "What is the sum of the first 10 terms of 3, 5, 7, 9, …?",
      options: ["120", "100", "130", "60"], answer: 0,
      explain: "The 10th term is 3 + 9 × 2 = 21. Sum = ½ × 10 × (3 + 21) = 5 × 24 = 120." },
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
    if (pct >= 80) v = "Excellent! You can handle arithmetic sequences.";
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