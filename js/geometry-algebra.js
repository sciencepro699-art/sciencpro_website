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

/* Geometry and Algebra - Class 10 Maths, Chapter 11.
   One grid, four modes: dividing a line, slope and line equation, circle equation, parallelogram.
   Tap or drag a point to move it. Points snap to whole numbers. */
(function () {
  "use strict";
  var cv = document.getElementById("gaCanvas");
  if (!cv) return;
  var ctx = cv.getContext("2d"), $ = function (id) { return document.getElementById(id); };
  var Z = 420, R = 7, U = Z / (2 * R);          // drawing is 420 units wide, grid shows -7 .. 7
  ctx.setTransform(2, 0, 0, 2, 0, 0);
  var MINUS = "−", PURPLE = "#7C5CE8", ORANGE = "#FF5A1F", INK = "#1a1a2e";

  /* ---------- number helpers ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function num(v) { v = Math.round(v * 100) / 100; return (v < 0 ? MINUS : "") + Math.abs(v); }
  function fr(n, d) {                              // n/d as a reduced fraction text
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d); n /= g; d /= g;
    return d === 1 ? num(n) : (n < 0 ? MINUS : "") + Math.abs(n) + "/" + d;
  }
  function pt(x, y) { return "(" + num(x) + ", " + num(y) + ")"; }
  function ptf(nx, ny, d) { return "(" + fr(nx, d) + ", " + fr(ny, d) + ")"; }
  function poly(terms) {                           // [[coef, "x"], ...] -> "2x − 3y + 4"
    var s = "";
    terms.forEach(function (t) {
      var c = t[0], v = t[1]; if (!c) return;
      var a = Math.abs(c), body = (a === 1 && v ? "" : a) + v;
      s += s ? (c < 0 ? " " + MINUS + " " : " + ") + body : (c < 0 ? MINUS : "") + body;
    });
    return s || "0";
  }
  function sgn(v, name) { return v === 0 ? name : "(" + name + " " + (v > 0 ? MINUS : "+") + " " + Math.abs(v) + ")"; }
  function sq(v, name) { return v === 0 ? name + "²" : sgn(v, name) + "²"; }

  /* ---------- state ---------- */
  var DEF = {
    div:    { pts: [[-4, -2], [5, 4]] },
    slope:  { pts: [[-3, -2], [3, 2]] },
    circle: { pts: [[1, 1]] },
    para:   { pts: [[-4, -1], [-1, 3], [4, 2]] }
  };
  var mode = "div", S = {}, drag = -1, m = 2, n = 1, rad = 3;
  Object.keys(DEF).forEach(function (k) { S[k] = DEF[k].pts.map(function (p) { return p.slice(); }); });
  var NAMES = ["A", "B", "C"];
  var HINT = {
    div: "Tap or drag A and B on the grid. Change m and n to move P along the line.",
    slope: "Tap or drag A and B. The line through them is drawn, with its rise and run.",
    circle: "Tap or drag to move the centre. Change the radius with the slider.",
    para: "Tap or drag A, B and C. The fourth vertex D is found for you."
  };
  var FORM = {
    div: ["x = x₁ + m/(m+n) × (x₂ − x₁)", "y = y₁ + m/(m+n) × (y₂ − y₁)"],
    slope: ["slope = (y₂ − y₁) ÷ (x₂ − x₁)", "line: y − y₁ = slope × (x − x₁)"],
    circle: ["(x − a)² + (y − b)² = r²", "x² + y² − px − qy + r = 0, centre (p/2, q/2)"],
    para: ["D = (x₁ + x₃ − x₂, y₁ + y₃ − y₂)", "centroid = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)"]
  };

  /* ---------- geometry per mode ---------- */
  function para() {
    var p = S.para; return { d: [p[0][0] + p[2][0] - p[1][0], p[0][1] + p[2][1] - p[1][1]] };
  }
  function valid(md, pts) {
    for (var i = 0; i < pts.length; i++) for (var j = i + 1; j < pts.length; j++)
      if (pts[i][0] === pts[j][0] && pts[i][1] === pts[j][1]) return false;
    if (md === "para") {
      var d = [pts[0][0] + pts[2][0] - pts[1][0], pts[0][1] + pts[2][1] - pts[1][1]];
      if (Math.abs(d[0]) > 6 || Math.abs(d[1]) > 6) return false;
    }
    return true;
  }

  /* ---------- drawing ---------- */
  function X(x) { return (x + R) * U; }
  function Y(y) { return (R - y) * U; }
  function dot(x, y, col, r) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X(x), Y(y), r || 7, 0, 6.2832); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke(); }
  function label(x, y, text, col, below) {
    ctx.font = "700 14px Inter, sans-serif";
    var px = X(x), py = Y(y), w = ctx.measureText(text).width, ox = 10, oy = below ? 20 : -10;
    var tx = px + ox; if (tx + w > Z - 4) tx = px - ox - w; if (tx < 4) tx = 4;
    var ty = py + oy; if (ty < 15) ty = py + 22; if (ty > Z - 6) ty = py - 12;
    ctx.textAlign = "left"; ctx.lineWidth = 4; ctx.strokeStyle = "#fff"; ctx.strokeText(text, tx, ty);
    ctx.fillStyle = col || INK; ctx.fillText(text, tx, ty);
  }
  function seg(a, b, col, w, dash) {
    ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []);
    ctx.beginPath(); ctx.moveTo(X(a[0]), Y(a[1])); ctx.lineTo(X(b[0]), Y(b[1])); ctx.stroke(); ctx.setLineDash([]);
  }
  function grid() {
    ctx.clearRect(0, 0, Z, Z); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, Z, Z);
    var i;
    ctx.lineWidth = 1; ctx.strokeStyle = "#ece7dc";
    for (i = -R + 1; i < R; i++) { ctx.beginPath(); ctx.moveTo(X(i), 0); ctx.lineTo(X(i), Z); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, Y(i)); ctx.lineTo(Z, Y(i)); ctx.stroke(); }
    ctx.strokeStyle = INK; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(Z, Y(0)); ctx.moveTo(X(0), 0); ctx.lineTo(X(0), Z); ctx.stroke();
    ctx.fillStyle = "#5b5b70"; ctx.font = "600 12px Inter, sans-serif"; ctx.textAlign = "center";
    for (i = -6; i <= 6; i += 2) if (i) { ctx.fillText(num(i), X(i), Y(0) + 15); ctx.textAlign = "right"; ctx.fillText(num(i), X(0) - 4, Y(i) + 4); ctx.textAlign = "center"; }
    ctx.font = "700 14px Inter, sans-serif"; ctx.fillStyle = INK; ctx.fillText("x", Z - 8, Y(0) - 6); ctx.fillText("y", X(0) + 10, 12);
  }
  function infLine(a, b) {                          // line through a, b across the whole grid
    var dx = b[0] - a[0], dy = b[1] - a[1], L = 30;
    seg([a[0] - dx * L, a[1] - dy * L], [a[0] + dx * L, a[1] + dy * L], PURPLE, 3);
  }

  function draw() {
    grid();
    var p = S[mode], i;
    if (mode === "div") {
      seg(p[0], p[1], PURPLE, 3.5);
      var q = P();
      dot(p[0][0], p[0][1], PURPLE); dot(p[1][0], p[1][1], PURPLE); dot(q[0], q[1], ORANGE, 8);
      label(p[0][0], p[0][1], "A" + pt(p[0][0], p[0][1]), INK); label(p[1][0], p[1][1], "B" + pt(p[1][0], p[1][1]), INK, true);
      label(q[0], q[1], (m === n ? "M" : "P") + pt(q[0], q[1]), "#c2410c", q[1] < p[0][1] && q[1] < p[1][1]);
    } else if (mode === "slope") {
      var A = p[0], B = p[1];
      infLine(A, B);
      seg(A, [B[0], A[1]], ORANGE, 2.5, [6, 5]); seg([B[0], A[1]], B, ORANGE, 2.5, [6, 5]);
      var dx = B[0] - A[0], dy = B[1] - A[1];
      ctx.font = "700 14px Inter, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#c2410c";
      if (dx) { ctx.lineWidth = 4; ctx.strokeStyle = "#fff"; ctx.strokeText("run " + num(dx), X(A[0] + dx / 2), Y(A[1]) + (dy >= 0 ? 17 : -8)); ctx.fillText("run " + num(dx), X(A[0] + dx / 2), Y(A[1]) + (dy >= 0 ? 17 : -8)); }
      if (dy) { var lx = X(B[0]) + (dx >= 0 ? 8 : -8); ctx.textAlign = dx >= 0 ? "left" : "right"; ctx.lineWidth = 4; ctx.strokeStyle = "#fff"; ctx.strokeText("rise " + num(dy), lx, Y(A[1] + dy / 2) + 5); ctx.fillText("rise " + num(dy), lx, Y(A[1] + dy / 2) + 5); }
      dot(A[0], A[1], PURPLE); dot(B[0], B[1], PURPLE);
      var nl = Math.sqrt(dx * dx + dy * dy) || 1, sd = dy > 0 ? 1 : -1;
      [[A, "A"], [B, "B"]].forEach(function (v) {
        var ox = sd * -dy / nl * 30, oy = -(sd * dx / nl) * 30, t = v[1] + pt(v[0][0], v[0][1]);
        ctx.font = "700 14px Inter, sans-serif"; ctx.textAlign = ox >= 0 ? "left" : "right";
        var tx = X(v[0][0]) + ox, ty = Y(v[0][1]) + oy + (oy < 0 ? -2 : 12);
        tx = ox >= 0 ? Math.min(tx, Z - 4 - ctx.measureText(t).width) : Math.max(tx, 4 + ctx.measureText(t).width);
        ctx.lineWidth = 4; ctx.strokeStyle = "#fff"; ctx.strokeText(t, tx, ty); ctx.fillStyle = INK; ctx.fillText(t, tx, ty);
      });
    } else if (mode === "circle") {
      var C = p[0];
      ctx.strokeStyle = PURPLE; ctx.lineWidth = 3.5; ctx.fillStyle = "rgba(167,139,250,.12)";
      ctx.beginPath(); ctx.arc(X(C[0]), Y(C[1]), rad * U, 0, 6.2832); ctx.fill(); ctx.stroke();
      seg(C, [C[0] + rad, C[1]], ORANGE, 2.5);
      dot(C[0], C[1], ORANGE, 8);
      label(C[0], C[1], "C" + pt(C[0], C[1]), "#c2410c", true);
      ctx.font = "700 14px Inter, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#c2410c";
      ctx.lineWidth = 4; ctx.strokeStyle = "#fff"; var rx = Math.min(Math.max(X(C[0] + rad / 2), 14), Z - 14);
      ctx.strokeText("r = " + rad, rx, Y(C[1]) - 8); ctx.fillText("r = " + rad, rx, Y(C[1]) - 8);
    } else {
      var a = p[0], b = p[1], c = p[2], d = para().d;
      ctx.fillStyle = "rgba(167,139,250,.14)"; ctx.beginPath();
      [a, b, c, d].forEach(function (v, k) { ctx[k ? "lineTo" : "moveTo"](X(v[0]), Y(v[1])); }); ctx.closePath(); ctx.fill();
      [[a, b], [b, c], [c, d], [d, a]].forEach(function (s) { seg(s[0], s[1], PURPLE, 3.5); });
      seg(a, c, ORANGE, 2, [6, 5]); seg(b, d, ORANGE, 2, [6, 5]);
      var mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2;
      dot(mx, my, ORANGE, 5);
      var gx = (a[0] + b[0] + c[0]) / 3, gy = (a[1] + b[1] + c[1]) / 3;
      ctx.fillStyle = "#0E9F8E"; ctx.beginPath(); ctx.arc(X(gx), Y(gy), 5.5, 0, 6.2832); ctx.fill();
      dot(a[0], a[1], PURPLE); dot(b[0], b[1], PURPLE); dot(c[0], c[1], PURPLE); dot(d[0], d[1], ORANGE, 8);
      label(a[0], a[1], "A" + pt(a[0], a[1]), INK); label(b[0], b[1], "B" + pt(b[0], b[1]), INK, true);
      label(c[0], c[1], "C" + pt(c[0], c[1]), INK); label(d[0], d[1], "D" + pt(d[0], d[1]), "#c2410c", true);
    }
  }
  function P() {
    var p = S.div, t = m + n;
    return [p[0][0] + m / t * (p[1][0] - p[0][0]), p[0][1] + m / t * (p[1][1] - p[0][1])];
  }

  /* ---------- result text ---------- */
  function line(t, cls) { return '<div class="line' + (cls ? " " + cls : "") + '">' + t + "</div>"; }
  function report() {
    var p = S[mode], h = "";
    if (mode === "div") {
      var A = p[0], B = p[1], t = m + n, nx = n * A[0] + m * B[0], ny = n * A[1] + m * B[1];
      h += line("A" + pt(A[0], A[1]) + ", B" + pt(B[0], B[1]) + ", ratio m : n = " + m + " : " + n);
      h += line("x = " + num(A[0]) + " + " + m + "/" + t + " × (" + num(B[0]) + " " + MINUS + " " + (A[0] < 0 ? "(" + num(A[0]) + ")" : A[0]) + ") = " + fr(nx, t));
      h += line("y = " + num(A[1]) + " + " + m + "/" + t + " × (" + num(B[1]) + " " + MINUS + " " + (A[1] < 0 ? "(" + num(A[1]) + ")" : A[1]) + ") = " + fr(ny, t));
      h += line((m === n ? "Midpoint M = " : "P = ") + ptf(nx, ny, t), "found");
      if (m === n) h += line("m = n, so P is exactly halfway: ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2).", "note");
    } else if (mode === "slope") {
      var a = p[0], b = p[1], dx = b[0] - a[0], dy = b[1] - a[1];
      h += line("A" + pt(a[0], a[1]) + ", B" + pt(b[0], b[1]));
      if (dx === 0) {
        h += line("Run = 0, so the line is vertical. The slope is not defined.");
        h += line("Equation: x = " + num(a[0]), "found");
      } else {
        var g = gcd(dx, dy);
        h += line("slope = " + num(dy) + " ÷ " + num(dx) + " = <b>" + fr(dy, dx) + "</b>", "found");
        if (dy === 0) h += line("Rise = 0, so the line is flat. Equation: y = " + num(a[1]), "found");
        else {
          var qa = dy / g, qb = -dx / g, qc = (dx * a[1] - dy * a[0]) / g;   // qa x + qb y + qc = 0
          if (qa < 0) { qa = -qa; qb = -qb; qc = -qc; }
          h += line("y " + MINUS + " " + (a[1] < 0 ? "(" + num(a[1]) + ")" : a[1]) + " = " + fr(dy, dx) + " (x " + MINUS + " " + (a[0] < 0 ? "(" + num(a[0]) + ")" : a[0]) + ")");
          h += line("Equation: " + poly([[qa, "x"], [qb, "y"], [qc, ""]]) + " = 0", "found");
        }
      }
    } else if (mode === "circle") {
      var C = p[0], pp = 2 * C[0], qq = 2 * C[1], rr = C[0] * C[0] + C[1] * C[1] - rad * rad;
      h += line("Centre (a, b) = " + pt(C[0], C[1]) + ", radius r = " + rad);
      h += line(sq(C[0], "x") + " + " + sq(C[1], "y") + " = " + rad * rad, "found");
      h += line("Opened out: " + poly([[1, "x²"], [1, "y²"], [-pp, "x"], [-qq, "y"], [rr, ""]]) + " = 0");
      h += line("Here p = " + num(pp) + ", q = " + num(qq) + ", r = " + num(rr) + ". Centre = (p/2, q/2) = " + pt(pp / 2, qq / 2), "note");
    } else {
      var a1 = p[0], b1 = p[1], c1 = p[2], d1 = para().d;
      h += line("A" + pt(a1[0], a1[1]) + ", B" + pt(b1[0], b1[1]) + ", C" + pt(c1[0], c1[1]));
      h += line("D = (" + num(a1[0]) + " + " + (c1[0] < 0 ? "(" + num(c1[0]) + ")" : c1[0]) + " " + MINUS + " " + (b1[0] < 0 ? "(" + num(b1[0]) + ")" : b1[0]) + ", " + num(a1[1]) + " + " + (c1[1] < 0 ? "(" + num(c1[1]) + ")" : c1[1]) + " " + MINUS + " " + (b1[1] < 0 ? "(" + num(b1[1]) + ")" : b1[1]) + ")");
      h += line("D = " + pt(d1[0], d1[1]), "found");
      h += line("Diagonals AC and BD meet at " + ptf(a1[0] + c1[0], a1[1] + c1[1], 2) + " (orange dot).");
      h += line("Centroid of triangle ABC = " + ptf(a1[0] + b1[0] + c1[0], a1[1] + b1[1] + c1[1], 3) + " (green dot).", "note");
      var cr = (b1[0] - a1[0]) * (c1[1] - a1[1]) - (b1[1] - a1[1]) * (c1[0] - a1[0]);
      if (!cr) h += line("A, B and C are on one line, so the parallelogram is flat. Move one point.", "note");
    }
    $("gaResult").innerHTML = h;
  }

  function setMode(md) {
    mode = md;
    document.querySelectorAll("#gaModes .preset-btn").forEach(function (b) { b.classList.toggle("active", b.dataset.m === md); });
    $("gaHint").textContent = HINT[md]; $("gaEq1").textContent = FORM[md][0]; $("gaEq2").textContent = FORM[md][1];
    $("gaSl-div").hidden = md !== "div"; $("gaSl-circle").hidden = md !== "circle"; $("gaTools").hidden = md !== "div";
    refresh();
  }
  function refresh() { draw(); report(); }

  /* ---------- input: tap or drag moves the nearest point ---------- */
  function cell(e) {
    var r = cv.getBoundingClientRect();
    var gx = (e.clientX - r.left) / r.width * 2 * R - R, gy = R - (e.clientY - r.top) / r.height * 2 * R;
    return [Math.max(-6, Math.min(6, Math.round(gx))), Math.max(-6, Math.min(6, Math.round(gy))), gx, gy];
  }
  function moveTo(i, c) {
    var pts = S[mode].map(function (p) { return p.slice(); });
    pts[i] = [c[0], c[1]];
    if (!valid(mode, pts)) return;
    S[mode][i] = [c[0], c[1]]; refresh();
  }
  cv.addEventListener("pointerdown", function (e) {
    var c = cell(e), best = 0, bd = 1e9;
    S[mode].forEach(function (p, i) { var d = Math.pow(p[0] - c[2], 2) + Math.pow(p[1] - c[3], 2); if (d < bd) { bd = d; best = i; } });
    drag = best; cv.setPointerCapture(e.pointerId); moveTo(drag, c); e.preventDefault();
  });
  cv.addEventListener("pointermove", function (e) { if (drag >= 0) moveTo(drag, cell(e)); });
  function up() { drag = -1; }
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);

  document.querySelectorAll("#gaModes .preset-btn").forEach(function (b) { b.addEventListener("click", function () { setMode(b.dataset.m); }); });
  function sl(id, vid, set) { $(id).addEventListener("input", function () { set(+this.value); $(vid).textContent = this.value; refresh(); }); }
  sl("gaM", "gaMv", function (v) { m = v; }); sl("gaN", "gaNv", function (v) { n = v; }); sl("gaR", "gaRv", function (v) { rad = v; });
  $("gaMid").addEventListener("click", function () { m = n = 1; $("gaM").value = $("gaN").value = 1; $("gaMv").textContent = $("gaNv").textContent = "1"; refresh(); });

  setMode("div");
  window.__ga = { S: S, setMode: setMode, setRad: function (v) { rad = v; refresh(); } };

SPQuiz.init({
  questions: [
    { q: "What is the midpoint of the points (2, 4) and (6, 10)?", options: ["(4, 7)", "(8, 14)", "(4, 6)", "(2, 3)"], answer: 0, explain: "Add the x values and halve: (2 + 6) ÷ 2 = 4. Add the y values and halve: (4 + 10) ÷ 2 = 7." },
    { q: "P divides the line joining (1, 2) and (7, 5) in the ratio 2 : 1. What are the coordinates of P?", options: ["(4, 3.5)", "(5, 4)", "(3, 3)", "(6, 4.5)"], answer: 1, explain: "x = 1 + 2/3 × (7 − 1) = 5. y = 2 + 2/3 × (5 − 2) = 4. So P is (5, 4)." },
    { q: "What is the slope of the line through (2, 5) and (3, 7)?", options: ["1", "2", "3", "½"], answer: 1, explain: "Slope = (7 − 5) ÷ (3 − 2) = 2 ÷ 1 = 2." },
    { q: "(4, 5) and (8, 11) are two points on a line. What is its slope?", options: ["3/2", "2/3", "6", "4"], answer: 0, explain: "Rise = 11 − 5 = 6. Run = 8 − 4 = 4. Slope = 6/4 = 3/2." },
    { q: "A point on the line 2x + y = 5 has x = 2. What is its y?", options: ["0", "1", "−1", "2"], answer: 1, explain: "2 × 2 + y = 5, so 4 + y = 5 and y = 1." },
    { q: "Where does the line 2x − y − 2 = 0 cut the x axis?", options: ["(0, −2)", "(2, 0)", "(1, 0)", "(0, 1)"], answer: 2, explain: "On the x axis y = 0. Then 2x − 2 = 0, so x = 1. The point is (1, 0)." },
    { q: "A circle has centre (3, 2) and radius 4. What is its equation?", options: ["(x + 3)² + (y + 2)² = 16", "(x − 3)² + (y − 2)² = 16", "(x − 3)² + (y − 2)² = 4", "x² + y² = 16"], answer: 1, explain: "The equation is (x − a)² + (y − b)² = r² with a = 3, b = 2 and r² = 16." },
    { q: "A circle has the line joining (3, 5) and (5, 9) as a diameter. What is its centre?", options: ["(4, 7)", "(8, 14)", "(1, 2)", "(4, 4)"], answer: 0, explain: "The centre is the midpoint of the diameter: (3 + 5) ÷ 2 = 4 and (5 + 9) ÷ 2 = 7." },
    { q: "A(2, 2), B(8, 4) and C(10, 9) are three vertices of parallelogram ABCD. What is D?", options: ["(4, 7)", "(0, −3)", "(16, 11)", "(6, 5)"], answer: 0, explain: "D = (x₁ + x₃ − x₂, y₁ + y₃ − y₂) = (2 + 10 − 8, 2 + 9 − 4) = (4, 7)." },
    { q: "What is the centroid of the triangle with vertices (0, 0), (6, 0) and (0, 9)?", options: ["(3, 4.5)", "(2, 3)", "(6, 9)", "(1, 1.5)"], answer: 1, explain: "Add the x values and divide by 3: 6 ÷ 3 = 2. Add the y values and divide by 3: 9 ÷ 3 = 3." }
  ],
  msgs: ["Nice start. Move the points in the lab above and retry.", "Good work. One more go with the grid and you've got it.", "Excellent! You know your coordinates."]
});
})();