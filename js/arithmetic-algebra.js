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

/* Arithmetic Sequences and Algebra - Class 10 Maths, Chapter 4.
   Three modes: algebraic form, form from two terms, sum of terms. */
(function () {
  "use strict";
  var cv = document.getElementById("aaCanvas");
  if (!cv) return;
  var ctx = cv.getContext("2d"), $ = function (id) { return document.getElementById(id); };
  var W = 420, H = 300; ctx.setTransform(2, 0, 0, 2, 0, 0);
  var MINUS = "−", PURPLE = "#A78BFA", ORANGE = "#FF5A1F", INK = "#1a1a2e";
  var SUB = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
  function sub(n) { return String(n).split("").map(function (c) { return SUB[+c]; }).join(""); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function num(v) { v = Math.round(v * 100) / 100; return (v < 0 ? MINUS : "") + Math.abs(v); }
  function fr(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); n /= g; d /= g; return d === 1 ? num(n) : (n < 0 ? MINUS : "") + Math.abs(n) + "/" + d; }
  /* "dn + c" for rational d = dn/dd and c = cn/cd */
  function rule(dn, dd, cn, cd) {
    var g = gcd(dn, dd); dn /= g; dd /= g; g = gcd(cn, cd); cn /= g; cd /= g;
    var a = Math.abs(dn), p1 = "";
    if (dn) p1 = (dn < 0 ? MINUS : "") + (a === dd ? "" : dd === 1 ? a : "(" + a + "/" + dd + ")") + "n";
    var p2 = cn ? (cd === 1 ? Math.abs(cn) : Math.abs(cn) + "/" + cd) : "";
    if (!p1) return p2 ? (cn < 0 ? MINUS : "") + p2 : "0";
    return p1 + (p2 ? (cn < 0 ? " " + MINUS + " " : " + ") + p2 : "");
  }

  var mode = "form", f = 5, d = 4, n = 8, cnt = 10, P = 5, Q = 9, vp = 17, vq = 29;
  var HINT = {
    form: "Pick the first term and the common difference. Then pick a position n to see its value.",
    two: "You know two terms of a sequence. Find the common difference and the rule.",
    sum: "Choose how many terms to add. See how first and last term give the sum."
  };
  var FORM = {
    form: ["xₙ = d × n + (f − d)", "xₙ = f + (n − 1) × d"],
    two: ["d = (xₙ − xₘ) ÷ (q − p)", "rule = d × n + c, and c = xₘ − d × p"],
    sum: ["Sum = (x₁ + xₙ) × n ÷ 2", "xₙ = f + (n − 1) × d"]
  };

  function terms(k) { var a = [], i; for (i = 1; i <= k; i++) a.push(f + (i - 1) * d); return a; }

  /* ---------- chart ---------- */
  function step(r) { var raw = r / 5, p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
  function chart(vals, bars, hl) {
    var L = 40, R = 12, T = 20, B = 26, pw = W - L - R, ph = H - T - B, k = vals.length;
    var lo = Math.min(0, Math.min.apply(null, vals)), hi = Math.max(0, Math.max.apply(null, vals));
    if (hi === lo) hi = lo + 1;
    var pad = (hi - lo) * 0.1; if (hi > 0) hi += pad; if (lo < 0) lo -= pad;
    var Y = function (v) { return T + (hi - v) / (hi - lo) * ph; }, X = function (i) { return L + (i + 0.5) / k * pw; };
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
    var s = step(hi - lo), v;
    ctx.font = "600 12px Inter, sans-serif"; ctx.textAlign = "right"; ctx.lineWidth = 1;
    for (v = Math.ceil(lo / s) * s; v <= hi + 1e-9; v += s) {
      ctx.strokeStyle = "#ece7dc"; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke();
      ctx.fillStyle = "#5b5b70"; ctx.fillText(num(Math.round(v * 100) / 100), L - 5, Y(v) + 4);
    }
    ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(W - R, Y(0)); ctx.moveTo(L, T - 6); ctx.lineTo(L, H - B); ctx.stroke();
    ctx.textAlign = "center"; ctx.fillStyle = "#5b5b70"; var every = k > 12 ? 2 : 1, i;
    for (i = 0; i < k; i++) if (!((i + 1) % every)) ctx.fillText(String(i + 1), X(i), H - 8);
    ctx.fillText("n", W - 8, H - 8);
    if (bars) {
      var bw = Math.min(pw / k * 0.7, 34);
      for (i = 0; i < k; i++) {
        ctx.fillStyle = PURPLE; var y0 = Y(0), y1 = Y(vals[i]);
        ctx.fillRect(X(i) - bw / 2, Math.min(y0, y1), bw, Math.abs(y1 - y0));
        if (k <= 10) { ctx.fillStyle = INK; ctx.font = "700 12px Inter, sans-serif"; ctx.fillText(num(vals[i]), X(i), vals[i] >= 0 ? y1 - 4 : y1 + 13); }
      }
    } else {
      ctx.strokeStyle = "#cfc6f5"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath();
      vals.forEach(function (val, j) { ctx[j ? "lineTo" : "moveTo"](X(j), Y(val)); }); ctx.stroke(); ctx.setLineDash([]);
      vals.forEach(function (val, j) {
        var on = hl.indexOf(j + 1) >= 0;
        ctx.fillStyle = on ? ORANGE : PURPLE; ctx.beginPath(); ctx.arc(X(j), Y(val), on ? 8 : 5.5, 0, 6.2832); ctx.fill();
        if (on) { ctx.fillStyle = "#c2410c"; ctx.font = "700 13px Inter, sans-serif"; ctx.fillText(num(val), X(j), Y(val) - 12); }
      });
    }
  }

  function tiles(vals, hl) {
    var h = "", show = vals.slice(0, 8);
    show.forEach(function (v, i) { h += '<span class="tile' + (hl.indexOf(i + 1) >= 0 ? " hl" : "") + '">' + num(v) + "</span>"; });
    if (vals.length > 8) h += '<span class="tile dots">…</span>';
    $("aaTiles").innerHTML = h;
  }
  function line(t, c) { return '<div class="line' + (c ? " " + c : "") + '">' + t + "</div>"; }

  function refresh() {
    var h = "", vals, hl = [];
    if (mode === "form") {
      vals = terms(10); hl = [n];
      var xn = f + (n - 1) * d, c = f - d;
      h += line("First term f = " + num(f) + ", common difference d = " + num(d));
      h += line("x" + sub(n) + " = " + num(f) + " + (" + n + " " + MINUS + " 1) × " + (d < 0 ? "(" + num(d) + ")" : d) + " = <b>" + num(xn) + "</b>", "found");
      h += line("Rule: xₙ = " + rule(d, 1, c, 1) + (d === 0 ? " (all terms are the same)" : ""));
      h += line("The number with n is d = " + num(d) + ". The number added is f " + MINUS + " d = " + num(c) + ".", "note");
      chart(vals, false, hl); tiles(vals, hl);
    } else if (mode === "two") {
      vals = []; var i, dn = vq - vp, dd = Q - P, cn = vp * dd - dn * P;
      for (i = 1; i <= 12; i++) vals.push((dn * i + cn) / dd);
      hl = [P, Q];
      h += line("Known: x" + sub(P) + " = " + num(vp) + ", x" + sub(Q) + " = " + num(vq));
      h += line("d = (" + num(vq) + " " + MINUS + " " + (vp < 0 ? "(" + num(vp) + ")" : vp) + ") ÷ (" + Q + " " + MINUS + " " + P + ") = <b>" + fr(dn, dd) + "</b>");
      h += line("c = " + num(vp) + " " + MINUS + " " + fr(dn, dd) + " × " + P + " = " + fr(cn, dd));
      h += line("Rule: xₙ = " + rule(dn, dd, cn, dd), "found");
      h += line("First term x₁ = " + fr(dn + cn, dd), "note");
      chart(vals, false, hl); tiles(vals, hl);
    } else {
      var N = cnt, a = terms(N), last = a[N - 1], s = (f + last) * N / 2;
      vals = a;
      h += line("First term x₁ = " + num(f) + ", last term x" + sub(N) + " = " + num(f) + " + " + (N - 1) + " × " + (d < 0 ? "(" + num(d) + ")" : d) + " = " + num(last));
      h += line("Sum = (" + num(f) + " + " + (last < 0 ? "(" + num(last) + ")" : last) + ") × " + N + " ÷ 2 = <b>" + num(s) + "</b>", "found");
      var chk = a.reduce(function (x, y) { return x + y; }, 0);
      h += line("Check: adding all " + N + " terms gives " + num(chk), "note");
      if (f === 1 && d === 1) h += line("First " + N + " numbers: n(n + 1) ÷ 2 = " + N + " × " + (N + 1) + " ÷ 2", "note");
      else if (f === 1 && d === 2) h += line("First " + N + " odd numbers: n² = " + N * N, "note");
      else if (f === 2 && d === 2) h += line("First " + N + " even numbers: n(n + 1) = " + N + " × " + (N + 1) + " = " + N * (N + 1), "note");
      chart(vals, true, []); tiles(vals, []);
    }
    $("aaResult").innerHTML = h;
  }

  function setMode(m) {
    mode = m;
    document.querySelectorAll("#aaModes .preset-btn").forEach(function (b) { b.classList.toggle("active", b.dataset.m === m); });
    $("aaHint").textContent = HINT[m]; $("aaEq1").textContent = FORM[m][0]; $("aaEq2").textContent = FORM[m][1];
    $("aaSl-form").hidden = m === "two"; $("aaSl-two").hidden = m !== "two"; $("aaPos").hidden = m !== "two";
    $("aaSl-sum").hidden = m !== "sum"; $("aaPre").hidden = m !== "sum";
    $("aaN").parentNode.hidden = m !== "form";
    refresh();
  }
  function bind(id, vid, set) { $(id).addEventListener("input", function () { set(+this.value); $(vid).textContent = this.value; refresh(); }); }
  bind("aaF", "aaFv", function (v) { f = v; }); bind("aaD", "aaDv", function (v) { d = v; }); bind("aaN", "aaNv", function (v) { n = v; });
  bind("aaP", "aaPv", function (v) { vp = v; }); bind("aaQ", "aaQv", function (v) { vq = v; }); bind("aaS", "aaSv", function (v) { cnt = v; });
  document.querySelectorAll("#aaModes .preset-btn").forEach(function (b) { b.addEventListener("click", function () { setMode(b.dataset.m); }); });
  document.querySelectorAll("#aaPos .preset-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      P = +b.dataset.p; Q = +b.dataset.q; $("aaPl").textContent = P; $("aaQl").textContent = Q;
      document.querySelectorAll("#aaPos .preset-btn").forEach(function (x) { x.classList.toggle("active", x === b); }); refresh();
    });
  });
  document.querySelectorAll("#aaPre .preset-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      f = +b.dataset.f; d = +b.dataset.d; $("aaF").value = f; $("aaD").value = d; $("aaFv").textContent = f; $("aaDv").textContent = d; refresh();
    });
  });
  setMode("form");
  window.__aa = { setMode: setMode, refresh: refresh };

SPQuiz.init({
  questions: [
    { q: "What is the algebraic form of the sequence 5, 9, 13, 17, ...?", options: ["4n + 5", "4n − 1", "4n + 1", "5n"], answer: 2, explain: "The common difference is 4, so the rule starts 4n. The first term is 5, so we add 5 − 4 = 1. The rule is 4n + 1." },
    { q: "The algebraic form of a sequence is 5n − 4. What is its 10th term?", options: ["46", "50", "54", "41"], answer: 0, explain: "Put n = 10: 5 × 10 − 4 = 46." },
    { q: "The algebraic form of an arithmetic sequence is 3n + 2. What is its common difference?", options: ["2", "3", "5", "6"], answer: 1, explain: "The number multiplied by n is the common difference. Here it is 3." },
    { q: "The 2nd term of an arithmetic sequence is 8 and the 5th term is 17. What is its algebraic form?", options: ["3n + 2", "3n + 5", "9n − 10", "2n + 4"], answer: 0, explain: "d = (17 − 8) ÷ (5 − 2) = 3. The 2nd term is 3 × 2 + c = 8, so c = 2. The rule is 3n + 2." },
    { q: "What is the sum of the first 20 natural numbers?", options: ["200", "210", "220", "420"], answer: 1, explain: "(1 + 20) × 20 ÷ 2 = 210." },
    { q: "What is the sum of the first 10 odd numbers?", options: ["55", "90", "100", "110"], answer: 2, explain: "The sum of the first n odd numbers is n². So 10² = 100." },
    { q: "What is the sum of the first 25 terms of 15, 21, 27, ... ?", options: ["2175", "2200", "1950", "4350"], answer: 0, explain: "The 25th term is 15 + 24 × 6 = 159. Sum = (15 + 159) × 25 ÷ 2 = 2175." },
    { q: "The sum of the first n terms of a sequence is n² + 2n. What is the first term?", options: ["1", "2", "3", "4"], answer: 2, explain: "The sum of the first 1 term is the first term. Put n = 1: 1 + 2 = 3." },
    { q: "The sum of the first n terms of an arithmetic sequence is 2n² + n. What is its common difference?", options: ["2", "3", "4", "1"], answer: 2, explain: "The coefficient of n² is half the common difference. So d = 2 × 2 = 4." },
    { q: "Which of these numbers is a term of the sequence 5, 8, 11, ... ?", options: ["100", "102", "103", "104"], answer: 3, explain: "The rule is 3n + 2. For 104: 3n + 2 = 104, so n = 34. The others do not give a whole number." }
  ],
  msgs: ["Nice start. Play with the lab above and retry.", "Good work. One more go with the sequences and you've got it.", "Excellent! You know your arithmetic sequences."]
});
})();