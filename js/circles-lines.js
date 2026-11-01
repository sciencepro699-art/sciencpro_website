/* Circles and Lines - Science Pro. Plain JS, no libraries. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const cv = $("clCanvas"), cx = cv.getContext("2d");
  const R = 5, D2R = Math.PI / 180;
  const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);

  const SL = {
    in: [{ k: "d", t: "P's distance from the centre (cm)", min: 0, max: 4, step: 0.5, val: 2 }, { k: "a1", t: "Turn chord AB", min: 5, max: 175, step: 5, val: 60 }, { k: "a2", t: "Turn chord CD", min: 5, max: 175, step: 5, val: 125 }],
    out: [{ k: "d", t: "P's distance from the centre (cm)", min: 6, max: 9, step: 0.5, val: 8 }, { k: "t1", t: "Tilt of secant PAB", min: -80, max: 80, step: 5, val: 40 }, { k: "t2", t: "Tilt of secant PCD", min: -80, max: 80, step: 5, val: -45 }],
    tan: [{ k: "d", t: "P's distance from the centre (cm)", min: 6, max: 9, step: 0.5, val: 8 }, { k: "t1", t: "Tilt of secant PAB", min: -80, max: 80, step: 5, val: -40 }]
  };
  const P = {};
  Object.keys(SL).forEach((m) => SL[m].forEach((s) => (P[m + s.k] = s.val)));
  let mode = "in", hidden = false, shown = false;

  /* line through (px,py) with unit direction (dx,dy) meets the circle at t1<=t2 */
  function hit(px, py, dx, dy) {
    const b = px * dx + py * dy, c = px * px + py * py - R * R, disc = b * b - c;
    if (disc < 0) return null;
    const s = Math.sqrt(disc);
    return [-b - s, -b + s];
  }

  function compute() {
    const d = P[mode + "d"], r = { d };
    if (mode === "in") {
      r.px = -d; r.py = 0;
      [["1", "a1"], ["2", "a2"]].forEach(([n, k]) => {
        const a = P[mode + k] * D2R, dx = Math.cos(a), dy = Math.sin(a), h = hit(r.px, r.py, dx, dy);
        r["n" + n] = -h[0]; r["f" + n] = h[1];
        r["p" + n] = [r.px + h[0] * dx, r.py + h[0] * dy]; r["q" + n] = [r.px + h[1] * dx, r.py + h[1] * dy];
      });
    } else {
      r.px = -d; r.py = 0;
      const base = 0, maxd = Math.asin(R / d) * 0.97;
      const lines = mode === "out" ? [["1", "t1"], ["2", "t2"]] : [["1", "t1"]];
      lines.forEach(([n, k]) => {
        const a = base + (P[mode + k] / 100) * maxd, dx = Math.cos(a), dy = Math.sin(a), h = hit(r.px, r.py, dx, dy);
        r["n" + n] = h[0]; r["f" + n] = h[1];
        r["p" + n] = [r.px + h[0] * dx, r.py + h[0] * dy]; r["q" + n] = [r.px + h[1] * dx, r.py + h[1] * dy];
      });
      if (mode === "tan") {
        const L = Math.sqrt(d * d - R * R), a = Math.asin(R / d) * (P.tant1 >= 0 ? -1 : 1), dx = Math.cos(a), dy = Math.sin(a);
        r.tl = L; r.T = [r.px + L * dx, r.py + L * dy];
      }
    }
    return r;
  }

  /* ---- drawing ---- */
  function view() { return mode === "in" ? { cx: 210, s: 34 } : { cx: 300, s: 22 }; }
  function X(x, v) { return v.cx + x * v.s; }
  function Y(y, v) { return 210 - y * v.s; }

  function seg(a, b, col, v, w) { cx.strokeStyle = col; cx.lineWidth = w || 3; cx.beginPath(); cx.moveTo(X(a[0], v), Y(a[1], v)); cx.lineTo(X(b[0], v), Y(b[1], v)); cx.stroke(); }
  function dot(p, v, col, r) { cx.fillStyle = col; cx.beginPath(); cx.arc(X(p[0], v), Y(p[1], v), r || 4.5, 0, 7); cx.fill(); }
  function lab(txt, p, v, ox, oy, col) { cx.fillStyle = col || "#1f2937"; cx.font = "700 19px Inter, sans-serif"; cx.textAlign = "center"; cx.lineWidth = 4; cx.strokeStyle = "#fff"; cx.strokeText(txt, X(p[0], v) + ox, Y(p[1], v) + oy + 5); cx.fillText(txt, X(p[0], v) + ox, Y(p[1], v) + oy + 5); }
  function mid(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
  function val(n) { return f1(n); }

  function draw(r) {
    const v = view(), PUR = "#7C5CE8", ORG = "#FF5A1F", hide = hidden && !shown;
    cx.clearRect(0, 0, 420, 420);
    cx.lineWidth = 2.5; cx.strokeStyle = "#1f2937";
    cx.beginPath(); cx.arc(X(0, v), Y(0, v), R * v.s, 0, 7); cx.stroke();
    dot([0, 0], v, "#9ca3af", 3); lab("O", [0, 0], v, 10, -10, "#6b7280");
    const P0 = [r.px, r.py];
    if (mode === "in") {
      seg(r.p1, r.q1, PUR, v); seg(r.p2, r.q2, ORG, v);
      [[r.p1, "A"], [r.q1, "B"], [r.p2, "C"], [r.q2, "D"]].forEach(([p, t]) => { dot(p, v, "#1f2937"); const dx = p[0], dy = p[1], L = Math.hypot(dx, dy) || 1; lab(t, p, v, (dx / L) * 16, -(dy / L) * 16); });
    } else {
      seg(P0, r.q1, PUR, v);
      dot(r.p1, v, "#1f2937"); dot(r.q1, v, "#1f2937");
      lab("A", r.p1, v, 0, -16); lab("B", r.q1, v, 10, 16);
      if (mode === "out") { seg(P0, r.q2, ORG, v); dot(r.p2, v, "#1f2937"); dot(r.q2, v, "#1f2937"); lab("C", r.p2, v, 0, 18); lab("D", r.q2, v, 12, -12); }
      else { seg(P0, r.T, ORG, v); dot(r.T, v, "#1f2937"); lab("T", r.T, v, 6, -16); }
    }
    dot(P0, v, "#16a34a", 5.5); lab("P", P0, v, -2, 20, "#16a34a");
    /* length labels */
    const tag = (a, b, name, value, col, side) => {
      const m = mid(a, b), ux = (X(b[0], v) - X(a[0], v)), uy = (Y(b[1], v) - Y(a[1], v)), L = Math.hypot(ux, uy) || 1;
      const nx = -uy / L * side, ny = ux / L * side, gap = 17;
      cx.font = "700 17px Inter, sans-serif"; cx.textAlign = "center"; cx.lineJoin = "round"; cx.lineWidth = 5; cx.strokeStyle = "#fff"; cx.fillStyle = col;
      const x = X(m[0], v) + nx * gap, y = Y(m[1], v) + ny * gap + 6, t = name + " " + value;
      cx.strokeText(t, x, y); cx.fillText(t, x, y);
    };
    if (mode === "in") {
      tag(r.p1, P0, "PA", val(r.n1), PUR, 1); tag(P0, r.q1, "PB", val(r.f1), PUR, 1);
      tag(r.p2, P0, "PC", val(r.n2), ORG, -1); tag(P0, r.q2, "PD", hide ? "?" : val(r.f2), ORG, -1);
    } else if (mode === "out") {
      tag(P0, r.p1, "PA", val(r.n1), PUR, 1); tag(r.p1, r.q1, "AB", val(r.f1 - r.n1), PUR, 1);
      tag(P0, r.p2, "PC", val(r.n2), ORG, -1); tag(r.p2, r.q2, "CD", hide ? "?" : val(r.f2 - r.n2), ORG, -1);
    } else {
      tag(P0, r.p1, "PA", val(r.n1), PUR, 1); tag(r.p1, r.q1, "AB", val(r.f1 - r.n1), PUR, 1);
      tag(P0, r.T, "PT", hide ? "?" : val(r.tl), ORG, -1);
    }
  }

  /* ---- readout ---- */
  const line = (c, t) => '<div class="line ' + c + '">' + t + "</div>";
  function report(r) {
    const hide = hidden && !shown, res = $("clResult"), eq = $("clEq");
    let html = "", title, f, work;
    if (mode === "in") {
      title = "Two chords meet inside the circle"; f = "PA × PB = PC × PD";
      const p1 = r.n1 * r.f1, p2 = r.n2 * r.f2;
      html = line("", "Chord AB:  PA × PB = " + val(r.n1) + " × " + val(r.f1) + " = " + f1(p1)) +
        (hide ? line("", "Chord CD:  PC × PD = " + val(r.n2) + " × ?") : line("", "Chord CD:  PC × PD = " + val(r.n2) + " × " + val(r.f2) + " = " + f1(p2))) +
        (hide ? line("note", "Hint: PD = (PA × PB) ÷ PC") : line("found", "The two products are equal: " + f1(p1) + " = " + f1(p2))) + line("note", "Lengths are rounded to 1 decimal place.");
      work = hide ? "Find PD from the other three lengths." : "Both products are " + f1(p1) + ". Move P or turn a chord and they stay equal.";
    } else if (mode === "out") {
      title = "Two secants from the outside point P"; f = "PA × PB = PC × PD";
      const p1 = r.n1 * r.f1, p2 = r.n2 * r.f2;
      html = line("", "PA = " + val(r.n1) + ", AB = " + val(r.f1 - r.n1) + ", so PB = PA + AB = " + val(r.f1)) +
        line("", "Secant 1:  PA × PB = " + val(r.n1) + " × " + val(r.f1) + " = " + f1(p1)) +
        (hide ? line("", "Secant 2:  PC × PD = " + val(r.n2) + " × ?") : line("", "Secant 2:  PC × PD = " + val(r.n2) + " × " + val(r.f2) + " = " + f1(p2))) +
        (hide ? line("note", "Hint: PD = (PA × PB) ÷ PC. Then CD = PD − PC.") : line("found", "The two products are equal: " + f1(p1) + " = " + f1(p2))) + line("note", "PB means the whole length from P to B, not just AB.");
      work = hide ? "Find PD, then CD = PD − PC." : "Both products are " + f1(p1) + ". The far point D is on the same line, so PD = PC + CD.";
    } else {
      title = "Tangent and secant from P"; f = "PT² = PA × PB";
      const p1 = r.n1 * r.f1, t2 = r.tl * r.tl;
      html = line("", "PA = " + val(r.n1) + ", AB = " + val(r.f1 - r.n1) + ", so PB = " + val(r.f1)) +
        line("", "Secant:  PA × PB = " + val(r.n1) + " × " + val(r.f1) + " = " + f1(p1)) +
        (hide ? line("", "Tangent:  PT² = ?") : line("", "Tangent:  PT² = " + val(r.tl) + " × " + val(r.tl) + " = " + f1(t2))) +
        (hide ? line("note", "Hint: PT² = PA × PB, so PT is the square root of " + f1(p1)) : line("found", "PT² = PA × PB: " + f1(t2) + " = " + f1(p1))) + line("note", "PT is the tangent. T is where it touches the circle.");
      work = hide ? "Find PT by taking the square root." : "PT² and PA × PB are both " + f1(p1) + ".";
    }
    res.innerHTML = html;
    eq.innerHTML = '<div class="eq-title">' + title + '</div><div class="eq1">' + f + '</div><div class="eq2">' + work + "</div>";
  }

  function update() { const r = compute(); draw(r); report(r); }

  function buildSliders() {
    const box = $("clSliders"); box.innerHTML = "";
    SL[mode].forEach((s) => {
      const l = document.createElement("label");
      l.className = "sl";
      l.innerHTML = "<span>" + s.t + ' &nbsp;<b></b></span><input type="range" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="' + P[mode + s.k] + '" aria-label="' + s.t + '">';
      const inp = l.querySelector("input"), b = l.querySelector("b");
      const show = () => { b.textContent = P[mode + s.k] + (s.k.charAt(0) === "a" ? "°" : s.k.charAt(0) === "t" ? "" : ""); };
      show();
      inp.addEventListener("input", () => { P[mode + s.k] = parseFloat(inp.value); show(); shown = false; $("clShow").hidden = !hidden; update(); });
      box.appendChild(l);
    });
  }

  document.querySelectorAll("#clModes .preset-btn").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m;
    document.querySelectorAll("#clModes .preset-btn").forEach((x) => x.classList.toggle("active", x === b));
    hidden = false; shown = false; $("clHide").textContent = "Hide one length. I will find it"; $("clShow").hidden = true;
    buildSliders(); update();
  }));
  $("clHide").addEventListener("click", () => {
    hidden = !hidden; shown = false;
    $("clHide").textContent = hidden ? "Show all lengths again" : "Hide one length. I will find it";
    $("clShow").hidden = !hidden; update();
  });
  $("clShow").addEventListener("click", () => { shown = true; update(); });
  buildSliders(); update();
  window.__cl = { P, setMode: (m) => document.querySelector('#clModes [data-m="' + m + '"]').click(), compute };

  /* ---------- Quiz ---------- */
  const shell = $("quizShell");
  if (!shell) return;
  const questions = [
    { q: "Two chords AB and CD meet at P inside a circle. PA = 6 cm, PB = 4 cm, PC = 3 cm. What is PD?", options: ["2 cm", "8 cm", "4.5 cm", "13 cm"], answer: 1, explain: "PA × PB = PC × PD. 6 × 4 = 3 × PD, so PD = 24 ÷ 3 = 8 cm." },
    { q: "Chords AB and CD cross at P. PA = 5, PB = 8, PC = PD. What is PC?", options: ["4", "13", "2√10", "40"], answer: 2, explain: "PC × PD = PC² = 5 × 8 = 40, so PC = √40 = 2√10." },
    { q: "Chords AB and CD cross at P. AB = 15 cm, PA = 12 cm, PD = 8 cm (PA is the longer part). What is PC?", options: ["4.5 cm", "2 cm", "3 cm", "4 cm"], answer: 0, explain: "PB = 15 − 12 = 3. PA × PB = 36. PC × PD = 36, so PC = 36 ÷ 8 = 4.5 cm." },
    { q: "From a point P outside a circle, a secant cuts the circle at A and B with PA = 4 cm and AB = 5 cm. What is PB?", options: ["1 cm", "5 cm", "9 cm", "20 cm"], answer: 2, explain: "PB runs from P all the way to B: PB = PA + AB = 4 + 5 = 9 cm." },
    { q: "In the same figure PC is a tangent to the circle. PA = 4 cm, AB = 5 cm. What is PC?", options: ["6 cm", "9 cm", "4.5 cm", "36 cm"], answer: 0, explain: "PC² = PA × PB = 4 × 9 = 36, so PC = 6 cm." },
    { q: "The tangent from P has length 8 cm. A secant from P cuts the circle at A and B, with PA = 4 cm. What is PB?", options: ["2 cm", "12 cm", "16 cm", "32 cm"], answer: 2, explain: "PT² = PA × PB. 64 = 4 × PB, so PB = 16 cm." },
    { q: "In that figure (PT = 8, PA = 4, PB = 16), what is the length of the chord AB?", options: ["12 cm", "20 cm", "4 cm", "16 cm"], answer: 0, explain: "AB = PB − PA = 16 − 4 = 12 cm." },
    { q: "Two secants from P: PA = 3, PB = 12 on one, and PC = 4 on the other. What is PD?", options: ["9", "6", "16", "5"], answer: 0, explain: "PA × PB = 36 = PC × PD, so PD = 36 ÷ 4 = 9." },
    { q: "Which rule is true for two chords that cross inside a circle?", options: ["PA + PB = PC + PD", "PA × PB = PC × PD", "PA × PC = PB × PD", "PA = PC"], answer: 1, explain: "The two parts of one chord multiplied equal the two parts of the other chord multiplied." },
    { q: "A tangent PT and a secant PAB are drawn from P. Which is correct?", options: ["PT = PA × PB", "PT² = PA × PB", "PT² = PA + PB", "PT = PA + PB"], answer: 1, explain: "The tangent length squared equals PA × PB." }
  ];
  let current = 0, score = 0, answered = false;
  function renderQuestion() {
    answered = false;
    const total = questions.length, q = questions[current];
    shell.innerHTML = '<div class="game-shell-header"><span class="score-pill">Question ' + (current + 1) + " / " + total + '</span><div class="progress-track"><div class="progress-fill" style="width:' + Math.round((current / total) * 100) + '%"></div></div><span class="score-pill">Score: ' + score + '</span></div><div class="quiz-question"></div><div class="quiz-options" id="optionsWrap"></div><div class="quiz-feedback" id="feedback"></div><div class="quiz-next" id="nextWrap"></div>';
    shell.querySelector(".quiz-question").textContent = q.q;
    const wrap = $("optionsWrap");
    q.options.forEach((opt, i) => { const b = document.createElement("button"); b.className = "quiz-option"; b.textContent = opt; b.addEventListener("click", () => selectAnswer(i)); wrap.appendChild(b); });
  }
  function selectAnswer(i) {
    if (answered) return;
    answered = true;
    const q = questions[current], bs = document.querySelectorAll(".quiz-option");
    bs.forEach((b) => (b.disabled = true));
    if (i === q.answer) { score++; bs[i].classList.add("correct"); } else { bs[i].classList.add("wrong"); bs[q.answer].classList.add("correct"); }
    const fb = $("feedback"); fb.textContent = q.explain; fb.classList.add("show");
    const last = current === questions.length - 1;
    const nb = document.createElement("button");
    nb.className = "btn btn-primary"; nb.textContent = last ? "See results" : "Next question →";
    nb.addEventListener("click", () => { current++; if (current >= questions.length) renderResults(); else renderQuestion(); });
    $("nextWrap").appendChild(nb);
  }
  function renderResults() {
    const total = questions.length, pct = Math.round((score / total) * 100);
    let v = "Nice start. Play with the lab above and retry.";
    if (pct >= 80) v = "Excellent! You have mastered chords, secants and tangents."; else if (pct >= 50) v = "Good work. One more go with the lab and you've got it.";
    shell.innerHTML = '<div class="result-screen"><span class="eyebrow" style="justify-content:center;">RESULTS</span><div class="big-score">' + score + " / " + total + "</div><p>" + v + '</p><div class="result-actions"><button class="btn btn-primary" id="retryBtn">Try again</button><a class="btn btn-dark" href="subject.html?class=10&subject=maths">Back to Maths chapters</a></div></div>';
    $("retryBtn").addEventListener("click", () => { current = 0; score = 0; renderQuestion(); });
  }
  renderQuestion();
})();