/* Science Pro shared quiz engine. One copy for every chapter.
   Usage: SPQuiz.init({ questions:[{q,options,answer,explain}], msgs:[low, mid, high] }) */
(function () {
  "use strict";
  window.SPQuiz = {
    init: function (o) {
      var shell = document.getElementById(o.shell || "quizShell");
      if (!shell) return;
      var qs = o.questions, cur = 0, score = 0, done = false;
      var back = o.back || "subject.html?class=10&subject=maths";
      var msgs = o.msgs || ["Nice start. Try the lab above and retry.", "Good work. One more go and you've got it.", "Excellent!"];
      function ask() {
        done = false;
        var q = qs[cur], n = qs.length;
        shell.innerHTML = '<div class="game-shell-header"><span class="score-pill">Question ' + (cur + 1) + " / " + n + '</span><div class="progress-track"><div class="progress-fill" style="width:' + Math.round((cur / n) * 100) + '%"></div></div><span class="score-pill">Score: ' + score + '</span></div><div class="quiz-question"></div><div class="quiz-options"></div><div class="quiz-feedback"></div><div class="quiz-next"></div>';
        shell.querySelector(".quiz-question").textContent = q.q;
        var wrap = shell.querySelector(".quiz-options");
        q.options.forEach(function (t, i) {
          var b = document.createElement("button");
          b.className = "quiz-option"; b.textContent = t;
          b.addEventListener("click", function () { pick(i); });
          wrap.appendChild(b);
        });
      }
      function pick(i) {
        if (done) return;
        done = true;
        var q = qs[cur], bs = shell.querySelectorAll(".quiz-option");
        bs.forEach(function (b) { b.disabled = true; });
        if (i === q.answer) { score++; bs[i].classList.add("correct"); } else { bs[i].classList.add("wrong"); bs[q.answer].classList.add("correct"); }
        var fb = shell.querySelector(".quiz-feedback"); fb.textContent = q.explain; fb.classList.add("show");
        var last = cur === qs.length - 1, nb = document.createElement("button");
        nb.className = "btn btn-primary"; nb.textContent = last ? "See results" : "Next question →";
        nb.addEventListener("click", function () { cur++; if (cur >= qs.length) end(); else ask(); });
        shell.querySelector(".quiz-next").appendChild(nb);
      }
      function end() {
        var n = qs.length, pct = Math.round((score / n) * 100), v = pct >= 80 ? msgs[2] : pct >= 50 ? msgs[1] : msgs[0];
        shell.innerHTML = '<div class="result-screen"><span class="eyebrow" style="justify-content:center;">RESULTS</span><div class="big-score">' + score + " / " + n + "</div><p>" + v + '</p><div class="result-actions"><button class="btn btn-primary" id="retryBtn">Try again</button><a class="btn btn-dark" href="' + back + '">Back to Maths chapters</a></div></div>';
        document.getElementById("retryBtn").addEventListener("click", function () { cur = 0; score = 0; ask(); });
      }
      ask();
    }
  };
})();

/* Arithmetic Sequences - Class 10 Maths, Chapter 1.
   Three modes: find a term, find terms from two known terms, add the terms by pairing. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var MINUS = "−", SUB = "₀₁₂₃₄₅₆₇₈₉";
  function sub(n) { return String(n).split("").map(function (c) { return SUB[+c]; }).join(""); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function num(v) { v = Math.round(v * 100) / 100; return (v < 0 ? MINUS : "") + Math.abs(v); }
  function par(v) { return v < 0 ? "(" + num(v) + ")" : String(v); }
  function fr(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); n /= g; d /= g; return d === 1 ? num(n) : (n < 0 ? MINUS : "") + Math.abs(n) + "/" + d; }
  function line(t, c) { return '<div class="line' + (c ? " " + c : "") + '">' + t + "</div>"; }
  function tile(i, v, hl, style) { return '<span class="tile' + (hl ? " hl" : "") + '"' + (style ? ' style="' + style + '"' : "") + "><small>x" + sub(i) + "</small><b>" + num(v) + "</b></span>"; }
  function jump(t) { return '<span class="jump">' + t + "</span>"; }
  var DOTS = '<span class="tile dots"><b>…</b></span>';

  var mode = "term", f = 5, d = 3, n = 6, P = 5, Q = 9, vp = 17, vq = 29, M = 12, cnt = 6;
  var HINT = {
    term: "Pick the first term and the common difference. Slide n to find any term by making jumps.",
    two: "You know two terms. Find the common difference, then find any other term.",
    sum: "Terms at the two ends add to the same number. Pairs have the same colour."
  };
  var FORM = {
    term: ["xₙ = f + (n − 1) × d", "d = x₂ − x₁"],
    two: ["d = (xₙ − xₘ) ÷ (n − m)", "xₙ = xₘ + (n − m) × d"],
    sum: ["Sum = (first + last) × n ÷ 2", "odd n: Sum = middle term × n"]
  };
  var COL = ["#A78BFA", "#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#06B6D4"];

  function render() {
    var h = "", seq = "", i, v;
    if (mode === "term") {
      var xn = f + (n - 1) * d;
      if (n <= 6) { for (i = 1; i <= 6; i++) { seq += (i > 1 ? jump((d < 0 ? MINUS : "+") + Math.abs(d)) : "") + tile(i, f + (i - 1) * d, i === n); } }
      else {
        for (i = 1; i <= 4; i++) seq += (i > 1 ? jump((d < 0 ? MINUS : "+") + Math.abs(d)) : "") + tile(i, f + (i - 1) * d, false);
        seq += DOTS + tile(n, xn, true);
      }
      h += line("From x₁ to x" + sub(n) + " there are " + (n - 1) + " jump" + (n === 2 ? "" : "s") + " of " + num(d));
      h += line("x" + sub(n) + " = " + num(f) + " + " + (n - 1) + " × " + par(d) + " = <b>" + num(xn) + "</b>", "found");
      h += line("Common difference d = " + num(f + d) + " " + MINUS + " " + par(f) + " = " + num(d), "note");
    } else if (mode === "two") {
      var dn = vq - vp, dd = Q - P, xm = vp * dd + (M - P) * dn;
      seq = tile(P, vp, false) + jump(Q - P + " jumps") + tile(Q, vq, false) + jump("…") + tile(M, xm / dd, true);
      h += line("Known: x" + sub(P) + " = " + num(vp) + " and x" + sub(Q) + " = " + num(vq));
      h += line("Jumps between them: " + Q + " " + MINUS + " " + P + " = " + dd + ". Change: " + num(vq) + " " + MINUS + " " + par(vp) + " = " + num(dn));
      h += line("d = " + num(dn) + " ÷ " + dd + " = <b>" + fr(dn, dd) + "</b>");
      h += line("x" + sub(M) + " = x" + sub(Q) + " + (" + M + " " + MINUS + " " + Q + ") × " + fr(dn, dd) + " = <b>" + fr(xm, dd) + "</b>", "found");
    } else {
      var N = cnt, last = f + (N - 1) * d, s = (f + last) * N / 2, pair = f + last, odd = N % 2 === 1, mid = pair / 2;
      for (i = 1; i <= N; i++) {
        v = f + (i - 1) * d; var k = Math.min(i - 1, N - i);
        var isMid = odd && i - 1 === N - i;
        seq += tile(i, v, isMid, isMid ? "" : "border-color:" + COL[k % COL.length] + ";background:" + COL[k % COL.length] + "22");
      }
      h += line("First + last = " + num(f) + " + " + par(last) + " = " + num(pair));
      h += line("Every pair of ends adds to " + num(pair) + (odd ? ", and the middle term is " + num(mid) : "") + ".");
      h += line("Sum = " + num(pair) + " × " + N + " ÷ 2 = <b>" + num(s) + "</b>", "found");
      if (odd) h += line("Or: middle term × n = " + num(mid) + " × " + N + " = " + num(mid * N), "note");
      else h += line("Or: " + N / 2 + " pairs × " + num(pair) + " = " + num(s), "note");
    }
    $("aSeq").innerHTML = seq; $("aResult").innerHTML = h;
  }

  function setMode(m) {
    mode = m;
    document.querySelectorAll("#aModes .preset-btn").forEach(function (b) { b.classList.toggle("active", b.dataset.m === m); });
    $("aHint").textContent = HINT[m]; $("aEq1").textContent = FORM[m][0]; $("aEq2").textContent = FORM[m][1];
    $("aSl-fd").hidden = m === "two"; $("aSl-n").hidden = m !== "term"; $("aSl-two").hidden = m !== "two"; $("aPos").hidden = m !== "two"; $("aSl-sum").hidden = m !== "sum";
    render();
  }
  function bind(id, vid, set) { $(id).addEventListener("input", function () { set(+this.value); $(vid).textContent = this.value; render(); }); }
  bind("aF", "aFv", function (v) { f = v; }); bind("aD", "aDv", function (v) { d = v; }); bind("aN", "aNv", function (v) { n = v; });
  bind("aP", "aPv", function (v) { vp = v; }); bind("aQ", "aQv", function (v) { vq = v; }); bind("aM", "aMv", function (v) { M = v; }); bind("aS", "aSv", function (v) { cnt = v; });
  document.querySelectorAll("#aModes .preset-btn").forEach(function (b) { b.addEventListener("click", function () { setMode(b.dataset.m); }); });
  document.querySelectorAll("#aPos .preset-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      P = +b.dataset.p; Q = +b.dataset.q; $("aPl").textContent = P; $("aQl").textContent = Q;
      document.querySelectorAll("#aPos .preset-btn").forEach(function (x) { x.classList.toggle("active", x === b); }); render();
    });
  });
  setMode("term");

SPQuiz.init({
  questions: [
    { q: "Which one is an arithmetic sequence?", options: ["5, 8, 11, 14, …", "1, 4, 9, 16, …", "2, 4, 8, 16, …", "1, 1/2, 1/3, 1/4, …"], answer: 0, explain: "Only 5, 8, 11, 14 adds the same number (3) every time. The others add different amounts each step." },
    { q: "The first term of an arithmetic sequence is 7 and the common difference is 4. What is the 10th term?", options: ["47", "43", "40", "11"], answer: 1, explain: "To reach the 10th term, add d nine times: 7 + 9 × 4 = 7 + 36 = 43." },
    { q: "The 5th term of an arithmetic sequence is 17 and the 9th term is 33. What is the common difference?", options: ["16", "8", "4", "2"], answer: 2, explain: "Term gap = 33 − 17 = 16. Position gap = 9 − 5 = 4. So d = 16 ÷ 4 = 4." },
    { q: "What is the algebraic form of the sequence 5, 8, 11, 14, …?", options: ["5n + 3", "3n + 5", "3n + 2", "n + 3"], answer: 2, explain: "d = 3, so xₙ = 3n + (f − d) = 3n + (5 − 3) = 3n + 2. Check n = 1: 3 + 2 = 5." },
    { q: "In an arithmetic sequence the 3rd term is 11. What is the sum of its first 5 terms?", options: ["44", "55", "66", "11"], answer: 1, explain: "For an odd number of terms the sum = number of terms × middle term. The middle (3rd) term is 11, so 5 × 11 = 55." },
    { q: "An arithmetic sequence has 6 terms. The first term plus the last term is 22. What is the sum of all 6 terms?", options: ["132", "22", "66", "44"], answer: 2, explain: "Pairs x₁ + x₆, x₂ + x₅, x₃ + x₄ each make 22. There are 3 pairs, so 3 × 22 = 66." },
    { q: "What is the sum of the first 20 natural numbers 1 + 2 + 3 + … + 20?", options: ["200", "400", "420", "210"], answer: 3, explain: "½ × n × (first + last) = ½ × 20 × (1 + 20) = 10 × 21 = 210." },
    { q: "What is the sum of the first 10 terms of 3, 5, 7, 9, …?", options: ["120", "100", "130", "60"], answer: 0, explain: "The 10th term is 3 + 9 × 2 = 21. Sum = ½ × 10 × (3 + 21) = 5 × 24 = 120." }
  ],
  msgs: ["Nice start. Play with the lab above and retry.", "Good work. One more go with the sequences and you've got it.", "Excellent! You know your arithmetic sequences."]
});
})();