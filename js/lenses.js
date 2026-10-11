/* =========================================================
   Lenses — Class 10 Physics, Chapter 2
   Convex lens simulation: drag the candle along the principal
   axis and see where / what kind of image forms.
   Cartesian sign convention, lens formula 1/f = 1/v - 1/u.
   (Simulation + quiz are specific to this chapter.)
   ========================================================= */
(function () {
  "use strict";

  const canvas = document.getElementById("lensCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // ---------- physical constants (centimetres) ----------
  const F_CM = 10;          // focal length of the lens
  const OBJECT_H_CM = 4;    // candle height
  const MIN_DIST_CM = 2.5;  // closest the candle can get to the lens
  const MAX_DIST_CM = 32;   // farthest
  const STAGE_H = 320;

  // ---------- DOM ----------
  const slider = document.getElementById("objectDistSlider");
  const distLabel = document.getElementById("distLabel");
  const banner = document.getElementById("caseBanner");
  const readU = document.getElementById("readU");
  const readV = document.getElementById("readV");
  const readM = document.getElementById("readM");
  const readNature = document.getElementById("readNature");
  const readOrientation = document.getElementById("readOrientation");
  const readSize = document.getElementById("readSize");
  const presets = document.querySelectorAll(".lens-preset");
  const caseRows = document.querySelectorAll("#caseTable tbody tr");

  // ---------- state ----------
  let dist = 30;            // object distance from lens (cm, positive number)
  let pxPerCm = 8;
  let W = 600;
  let dragging = false;
  let rafPending = false;

  // ---------- optics ----------
  // Cartesian convention: object on the left => u negative.
  function optics(d) {
    const u = -d;
    const atFocus = Math.abs(d - F_CM) < 0.15;
    if (atFocus) return { u, v: Infinity, m: -Infinity, atFocus: true };
    const v = 1 / (1 / F_CM + 1 / u); // 1/v = 1/f + 1/u
    const m = v / u;
    return { u, v, m, atFocus: false };
  }

  function caseKey(d) {
    if (Math.abs(d - F_CM) < 0.15) return "atf";
    if (Math.abs(d - 2 * F_CM) < 0.4) return "at2f";
    if (d > 2 * F_CM) return "beyond2f";
    if (d > F_CM) return "between";
    return "inside";
  }

  const CASE_TEXT = {
    beyond2f: "Object beyond 2F → image between F and 2F: real, inverted, diminished.",
    at2f: "Object at 2F → image at 2F: real, inverted, same size.",
    between: "Object between F and 2F → image beyond 2F: real, inverted, enlarged.",
    atf: "Object at F → image at infinity: real, inverted, highly enlarged. (Rays come out parallel.)",
    inside: "Object between F and the lens → image on the same side: virtual, erect, enlarged.",
  };

  const fmt = (x, n) => (Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n);

  function updateUI() {
    const o = optics(dist);
    const key = caseKey(dist);

    distLabel.textContent = fmt(dist, 1) + " cm";
    slider.value = String(dist);
    slider.setAttribute("aria-valuetext", fmt(dist, 1) + " centimetres from the lens");
    banner.textContent = CASE_TEXT[key];

    readU.textContent = "−" + fmt(dist, 1) + " cm";
    if (o.atFocus) {
      readV.textContent = "At infinity";
      readM.textContent = "Very large";
      readNature.textContent = "Real";
      readOrientation.textContent = "Inverted";
      readSize.textContent = "Highly enlarged";
    } else {
      const absM = Math.abs(o.m);
      readV.textContent = (o.v > 0 ? "+" : "−") + fmt(Math.abs(o.v), 1) + " cm";
      readM.textContent = (o.m > 0 ? "+" : "−") + fmt(absM, 2);
      readNature.textContent = o.v > 0 ? "Real" : "Virtual";
      readOrientation.textContent = o.m < 0 ? "Inverted" : "Erect";
      readSize.textContent =
        Math.abs(absM - 1) < 0.05 ? "Same size" : absM > 1 ? "Enlarged" : "Diminished";
    }

    caseRows.forEach((r) => r.classList.toggle("active", r.dataset.case === key));
    presets.forEach((b) =>
      b.classList.toggle("active", Math.abs(parseFloat(b.dataset.dist) - dist) < 0.05)
    );
  }

  function setDistance(cm) {
    dist = Math.max(MIN_DIST_CM, Math.min(MAX_DIST_CM, cm));
    updateUI();
    requestRedraw();
  }

  // ---------- canvas ----------
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth || 600;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(STAGE_H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pxPerCm = Math.min(9, (W / 2 - 28) / (MAX_DIST_CM + 1));
    requestRedraw();
  }

  function requestRedraw() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      draw();
    });
  }

  function line(x1, y1, x2, y2, color, width, dash) {
    ctx.beginPath();
    ctx.setLineDash(dash || []);
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 1;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function arrowHead(x, y, dir, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - dir * 8, y - 3.5);
    ctx.lineTo(x - dir * 8, y + 3.5);
    ctx.closePath();
    ctx.fill();
  }

  function drawCandle(x, baseY, hPx, color, dashed, erect) {
    // erect = true: candle stands up from the axis; false: hangs down (inverted)
    const s = erect ? -1 : 1;
    const tipY = baseY + s * hPx;
    const w = Math.max(5, Math.min(14, Math.abs(hPx) * 0.22));
    ctx.save();
    if (dashed) ctx.globalAlpha = 0.75;
    // body
    ctx.fillStyle = color;
    const top = Math.min(baseY, tipY);
    const h = Math.abs(hPx);
    ctx.fillRect(x - w / 2, top, w, h);
    // flame (at the free end)
    const fl = Math.max(4, h * 0.2);
    ctx.fillStyle = "#FFB03A";
    ctx.beginPath();
    const fy = tipY;
    const dirF = erect ? -1 : 1;
    ctx.moveTo(x, fy + dirF * fl * 1.5);
    ctx.quadraticCurveTo(x + w * 0.9, fy + dirF * fl * 0.4, x, fy);
    ctx.quadraticCurveTo(x - w * 0.9, fy + dirF * fl * 0.4, x, fy + dirF * fl * 1.5);
    ctx.fill();
    if (dashed) {
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - w / 2, top, w, h);
      ctx.setLineDash([]);
    }
    ctx.restore();
    return tipY;
  }

  function geometry() {
    const cx = W / 2;
    const ay = STAGE_H / 2;
    const objX = cx - dist * pxPerCm;
    const objH = OBJECT_H_CM * pxPerCm;
    return { cx, ay, objX, objH, tipY: ay - objH, fPx: F_CM * pxPerCm };
  }

  function draw() {
    const g = geometry();
    const { cx, ay, objX, objH, tipY, fPx } = g;
    const o = optics(dist);
    const real = !o.atFocus && o.v > 0;
    const virtual = !o.atFocus && o.v < 0;

    ctx.clearRect(0, 0, W, STAGE_H);
    // background
    ctx.fillStyle = "#10162E";
    ctx.fillRect(0, 0, W, STAGE_H);

    // principal axis
    line(8, ay, W - 8, ay, "rgba(250,247,241,0.35)", 1);

    // F and 2F ticks (both sides)
    ctx.font = "600 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    [-2, -1, 1, 2].forEach((k) => {
      const x = cx + k * fPx;
      line(x, ay - 6, x, ay + 6, "rgba(250,247,241,0.6)", 1.5);
      ctx.fillStyle = "rgba(250,247,241,0.75)";
      ctx.fillText(Math.abs(k) === 1 ? "F" : "2F", x, ay + 20);
    });
    ctx.fillStyle = "rgba(250,247,241,0.75)";
    ctx.fillText("O", cx, ay + 20);

    // lens (biconvex shape)
    const lensH = STAGE_H * 0.78;
    const lensW = 16;
    ctx.beginPath();
    ctx.moveTo(cx, ay - lensH / 2);
    ctx.quadraticCurveTo(cx + lensW, ay, cx, ay + lensH / 2);
    ctx.quadraticCurveTo(cx - lensW, ay, cx, ay - lensH / 2);
    ctx.closePath();
    ctx.fillStyle = "rgba(79,195,247,0.22)";
    ctx.fill();
    ctx.strokeStyle = "#4FC3F7";
    ctx.lineWidth = 2;
    ctx.stroke();

    // ---------- rays ----------
    const rayCol = "#FFB03A";
    const farEdge = W - 8;

    // Ray 1: parallel to axis -> through far focus (right F)
    ctx.lineWidth = 1.6;
    line(objX, tipY, cx, tipY, rayCol, 1.6);
    {
      // after lens: passes through (cx + fPx, ay)
      const slope = (ay - tipY) / fPx;
      line(cx, tipY, farEdge, tipY + slope * (farEdge - cx), rayCol, 1.6);
      if (virtual) {
        // backward extension to the left of lens (dashed)
        line(cx, tipY, objX - 40, tipY + slope * (objX - 40 - cx), "rgba(255,176,58,0.55)", 1.2, [5, 4]);
      }
    }

    // Ray 2: through optic centre -> straight
    {
      const slope = (ay - tipY) / (cx - objX);
      line(objX, tipY, farEdge, tipY + slope * (farEdge - objX), "#FF7A29", 1.6);
    }

    // Ray 3: through near focus (left F) -> emerges parallel
    // Only when object is not exactly at F (ray would be parallel already).
    const den3 = cx - fPx - objX; // horizontal distance object -> left F
    if (Math.abs(den3) > 0.5) {
      const slope3 = (ay - tipY) / den3;
      const y3 = tipY + slope3 * (cx - objX); // height where the ray meets the lens
      if (den3 > 0) {
        // object is beyond F: ray travels toward F, hits the lens, goes parallel
        line(objX, tipY, cx, y3, "#F472B6", 1.6);
        line(cx, y3, farEdge, y3, "#F472B6", 1.6);
        if (virtual) line(cx, y3, objX - 40, y3, "rgba(244,114,182,0.5)", 1.2, [5, 4]);
      } else {
        // object is inside F: the ray is drawn as if it came from F (line from F through tip)
        // then continues parallel after the lens
        line(objX, tipY, cx, y3, "#F472B6", 1.6);
        line(cx, y3, farEdge, y3, "#F472B6", 1.6);
        // backward extension from tip toward F (dashed)
        line(objX, tipY, cx - fPx, ay, "rgba(244,114,182,0.5)", 1.2, [5, 4]);
        line(cx, y3, objX - 40, y3, "rgba(244,114,182,0.5)", 1.2, [5, 4]);
      }
    } else {
      // object at F: this ray is the one that goes parallel after the lens
      line(objX, tipY, cx, tipY, "#F472B6", 1.6);
    }

    // ---------- image ----------
    if (!o.atFocus) {
      const imgX = cx + o.v * pxPerCm;
      const imgH = o.m * OBJECT_H_CM * pxPerCm; // negative => inverted (downwards)
      const visible = imgX > 10 && imgX < W - 10 && Math.abs(imgH) < STAGE_H * 1.4;
      if (visible) {
        const imgTipY = ay - imgH; // m<0 => tip below axis
        // clamp drawing height so huge images stay on screen
        const maxPx = STAGE_H / 2 - 6;
        const hPx = Math.min(Math.abs(imgH), maxPx);
        const erect = o.m > 0;
        drawCandle(imgX, ay, hPx, real ? "#34D399" : "#F472B6", virtual, erect);
        // dot where rays meet
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(imgX, Math.max(6, Math.min(STAGE_H - 6, imgTipY)), 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = real ? "#34D399" : "#F472B6";
        ctx.textAlign = "center";
        ctx.font = "600 11px 'JetBrains Mono', monospace";
        ctx.fillText(real ? "real image" : "virtual image", imgX, real ? ay - 12 : ay + 20);
      } else {
        ctx.fillStyle = "#34D399";
        ctx.font = "600 12px 'JetBrains Mono', monospace";
        ctx.textAlign = "right";
        ctx.fillText("image far off-screen →", W - 14, STAGE_H - 30);
      }
    } else {
      ctx.fillStyle = "#34D399";
      ctx.font = "600 12px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText("image at infinity →", W - 14, STAGE_H - 30);
    }

    // ---------- object candle ----------
    drawCandle(objX, ay, objH, "#FAF7F1", false, true);
    ctx.fillStyle = "rgba(250,247,241,0.7)";
    ctx.font = "600 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("drag me", objX, ay + objH + 14 > STAGE_H - 4 ? STAGE_H - 4 : ay + 38);
    // drag handle ring
    ctx.strokeStyle = dragging ? "#FFB03A" : "rgba(255,176,58,0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(objX - 14, tipY - 20, 28, objH + 22);
    ctx.setLineDash([]);
  }

  // ---------- dragging ----------
  function pointerPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width };
  }

  function hitCandle(p) {
    const g = geometry();
    const scale = canvas.clientWidth ? W / canvas.clientWidth : 1;
    const x = p.x * scale;
    const y = p.y * scale;
    return Math.abs(x - g.objX) < 30 && y > g.tipY - 28 && y < g.ay + 28;
  }

  canvas.addEventListener("pointerdown", (e) => {
    const p = pointerPos(e);
    // allow grabbing the candle OR tapping anywhere left of the lens
    if (hitCandle(p) || p.x < p.w / 2 - 10) {
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      setDistance(((p.w / 2) - p.x) / pxPerCm);
      e.preventDefault();
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    const p = pointerPos(e);
    if (dragging) {
      setDistance(((p.w / 2) - p.x) / pxPerCm);
    } else {
      canvas.style.cursor = hitCandle(p) ? "grab" : "default";
    }
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    requestRedraw();
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  slider.addEventListener("input", () => setDistance(parseFloat(slider.value)));
  presets.forEach((b) =>
    b.addEventListener("click", () => setDistance(parseFloat(b.dataset.dist)))
  );
  window.addEventListener("resize", resizeCanvas);

  slider.min = String(MIN_DIST_CM);
  slider.max = String(MAX_DIST_CM);
  slider.step = "0.1";
  resizeCanvas();
  updateUI();
  requestRedraw();

  // expose for tests only (harmless)
  window.__lensTest = { optics, caseKey, setDistance, draw };
})();

/* =========================================================
   Quiz
   ========================================================= */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;

  const questions = [
    {
      q: "A candle is placed beyond 2F of a convex lens. The image is formed:",
      options: [
        "Between F and 2F, real, inverted and diminished",
        "At 2F, real, inverted and same size",
        "Beyond 2F, real, inverted and enlarged",
        "On the same side, virtual and erect",
      ],
      answer: 0,
      explain: "For an object beyond 2F, the image forms between F and 2F on the other side — real, inverted and smaller than the object.",
    },
    {
      q: "Where must the object be so that a convex lens forms a real, inverted image of the SAME size?",
      options: ["At F", "At 2F", "Between F and 2F", "Beyond 2F"],
      answer: 1,
      explain: "At 2F the image is also at 2F, real, inverted and exactly as big as the object (m = −1).",
    },
    {
      q: "When the object is between F and 2F, the image is:",
      options: [
        "Between F and 2F, diminished",
        "At infinity",
        "Beyond 2F, real, inverted and enlarged",
        "Virtual, erect and enlarged",
      ],
      answer: 2,
      explain: "Between F and 2F the image moves beyond 2F and becomes larger than the object — this is how a projector works.",
    },
    {
      q: "The object is placed exactly at the focus F of a convex lens. The image is formed:",
      options: [
        "At 2F",
        "At infinity, real, inverted, highly enlarged",
        "Between the lens and F",
        "At the optic centre",
      ],
      answer: 1,
      explain: "Rays from a point at F leave the lens parallel to each other, so they meet only at infinity.",
    },
    {
      q: "The object is between F and the optic centre of a convex lens. The image is:",
      options: [
        "Real and inverted",
        "Virtual, erect and enlarged, on the same side as the object",
        "Real and diminished",
        "Virtual, inverted and diminished",
      ],
      answer: 1,
      explain: "Inside F the refracted rays diverge, so they only appear to come from a point behind the object — a virtual, erect, magnified image. This is how a magnifying glass works.",
    },
    {
      q: "A ray of light passing through the principal focus on the object side of a convex lens will, after refraction:",
      options: [
        "Pass through the other focus",
        "Go straight without bending",
        "Emerge parallel to the principal axis",
        "Retrace its path",
      ],
      answer: 2,
      explain: "A ray through the first focus emerges parallel to the principal axis — the reverse of the 'parallel ray goes through the focus' rule.",
    },
    {
      q: "A convex lens has f = +10 cm and the object is at u = −30 cm. Using 1/f = 1/v − 1/u, the image distance v is:",
      options: ["+7.5 cm", "+15 cm", "−15 cm", "+30 cm"],
      answer: 1,
      explain: "1/v = 1/f + 1/u = 1/10 − 1/30 = 2/30, so v = +15 cm — a real image between F and 2F.",
    },
    {
      q: "The magnification m of a lens is negative. This means the image is:",
      options: ["Erect and virtual", "Inverted and real", "Erect and real", "Inverted and virtual"],
      answer: 1,
      explain: "Negative m (m = v/u with u negative and v positive) means the image is inverted, and a real image is formed on the opposite side.",
    },
  ];

  let current = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    answered = false;
    const total = questions.length;
    const q = questions[current];
    const pct = Math.round((current / total) * 100);

    shell.innerHTML = `
      <div class="game-shell-header">
        <span class="score-pill">Question ${current + 1} / ${total}</span>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="score-pill">Score: ${score}</span>
      </div>
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options" id="optionsWrap"></div>
      <div class="quiz-feedback" id="feedback"></div>
      <div class="quiz-next" id="nextWrap"></div>
    `;

    const wrap = document.getElementById("optionsWrap");
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.textContent = opt;
      btn.addEventListener("click", () => selectAnswer(i));
      wrap.appendChild(btn);
    });
  }

  function selectAnswer(i) {
    if (answered) return;
    answered = true;
    const q = questions[current];
    const buttons = document.querySelectorAll(".quiz-option");
    buttons.forEach((b) => (b.disabled = true));

    if (i === q.answer) {
      score++;
      buttons[i].classList.add("correct");
    } else {
      buttons[i].classList.add("wrong");
      buttons[q.answer].classList.add("correct");
    }

    const feedback = document.getElementById("feedback");
    feedback.textContent = q.explain;
    feedback.classList.add("show");

    const isLast = current === questions.length - 1;
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-primary";
    nextBtn.textContent = isLast ? "See results" : "Next question →";
    nextBtn.addEventListener("click", () => {
      current++;
      if (current >= questions.length) renderResults();
      else renderQuestion();
    });
    document.getElementById("nextWrap").appendChild(nextBtn);
  }

  function renderResults() {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    let verdict = "Nice start — drag the candle around again and retry.";
    if (pct >= 80) verdict = "Excellent! You know where every image forms.";
    else if (pct >= 50) verdict = "Good work — a few more drags of the candle and it will click.";

    shell.innerHTML = `
      <div class="result-screen">
        <span class="eyebrow" style="justify-content:center;">RESULTS</span>
        <div class="big-score">${score} / ${total}</div>
        <p>${verdict}</p>
        <div class="result-actions">
          <button class="btn btn-primary" id="retryBtn">Try again</button>
          <a class="btn btn-dark" href="subject.html?class=10&subject=physics">Back to Physics chapters</a>
        </div>
      </div>
    `;
    document.getElementById("retryBtn").addEventListener("click", () => {
      current = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
})();