/* Mathematics of Chance - Science Pro. Pure front-end, no libraries. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const frac = (a, b) => {
    if (!b) return "-";
    if (!a) return "0";
    const g = gcd(a, b), n = a / g, d = b / g;
    return d === 1 ? String(n) : n + "/" + d;
  };
  const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const isSq = (n) => Math.sqrt(n) % 1 === 0;
  const dec = (p) => (Math.round(p * 1000) / 1000).toString();
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- experiments ---------- */
  const MODES = {
    beads: {
      sliders: [{ k: "black", t: "Black beads", min: 0, max: 10, val: 3 }, { k: "white", t: "White beads", min: 0, max: 10, val: 2 }],
      go: "Take one bead", many: "Take 100 beads",
      events: () => [{ k: "black", t: "getting a black bead", f: (it) => it.c === "black" }, { k: "white", t: "getting a white bead", f: (it) => it.c === "white" }],
      items: (p) => shuffle([].concat(Array(p.black).fill(0).map(() => ({ c: "black", l: "", out: "black bead" })), Array(p.white).fill(0).map(() => ({ c: "white", l: "", out: "white bead" })))),
      kind: "bead"
    },
    cards: {
      sliders: [{ k: "n", t: "Cards numbered 1 to", min: 5, max: 30, val: 10 }],
      go: "Take a card", many: "Take 100 cards",
      events: () => [
        { k: "even", t: "an even number", f: (it) => it.n % 2 === 0 },
        { k: "odd", t: "an odd number", f: (it) => it.n % 2 === 1 },
        { k: "prime", t: "a prime number", f: (it) => isPrime(it.n) },
        { k: "sq", t: "a perfect square", f: (it) => isSq(it.n) },
        { k: "m3", t: "a multiple of 3", f: (it) => it.n % 3 === 0 },
        { k: "m23", t: "a multiple of both 2 and 3", f: (it) => it.n % 6 === 0 }
      ],
      items: (p) => Array.from({ length: p.n }, (_, i) => ({ n: i + 1, l: String(i + 1), out: "card " + (i + 1) })),
      kind: "tile"
    },
    die: {
      sliders: [],
      go: "Roll once", many: "Roll 100 times",
      events: () => [
        { k: "even", t: "an even number", f: (it) => it.n % 2 === 0 },
        { k: "odd", t: "an odd number", f: (it) => it.n % 2 === 1 },
        { k: "prime", t: "a prime number", f: (it) => isPrime(it.n) },
        { k: "np", t: "not a prime number", f: (it) => !isPrime(it.n) },
        { k: "lt4", t: "a number less than 4", f: (it) => it.n < 4 },
        { k: "m23", t: "a multiple of both 2 and 3", f: (it) => it.n % 6 === 0 }
      ],
      items: () => Array.from({ length: 6 }, (_, i) => ({ n: i + 1, l: String(i + 1), out: "rolled " + (i + 1) })),
      kind: "tile"
    },
    boxes: {
      sliders: [
        { k: "a", t: "Box A has slips 1 to", min: 2, max: 6, val: 4 },
        { k: "b", t: "Box B has how many slips", min: 2, max: 6, val: 5 },
        { k: "s", t: "Box B starts at", min: 1, max: 5, val: 1 },
        { k: "sum", t: "Target sum", min: 2, max: 14, val: 6 }
      ],
      go: "Take a slip from each box", many: "Do it 100 times",
      events: (p) => [
        { k: "odd", t: "both numbers odd", f: (it) => it.x % 2 === 1 && it.y % 2 === 1 },
        { k: "same", t: "both numbers the same", f: (it) => it.x === it.y },
        { k: "sum", t: "the sum is " + p.sum, f: (it) => it.x + it.y === p.sum },
        { k: "even", t: "the product is even", f: (it) => (it.x * it.y) % 2 === 0 }
      ],
      items: (p) => { const r = []; for (let x = 1; x <= p.a; x++) for (let j = 0; j < p.b; j++) { const y = p.s + j; r.push({ x, y, l: x + "," + y, out: "A: " + x + "   B: " + y }); } return r; },
      kind: "pair"
    }
  };

  const AREAS = {
    strip: { t: "Strip in a square", sliders: [{ k: "w", t: "Strip width (cm)", min: 0.5, max: 5, step: 0.5, val: 2 }] },
    sector: { t: "Sector in a circle", sliders: [{ k: "ang", t: "Shaded angle", min: 0, max: 360, step: 10, val: 240 }] },
    insq: { t: "Square in a circle", sliders: [] },
    csq: { t: "Circle in a square", sliders: [] },
    rect: { t: "Rectangle on a board", sliders: [{ k: "rw", t: "Shaded width (cm)", min: 1, max: 10, step: 1, val: 5 }, { k: "rh", t: "Shaded height (cm)", min: 1, max: 6, step: 1, val: 3 }] },
    tri: { t: "Triangle in a rectangle", sliders: [{ k: "pos", t: "Where P sits on DC (%)", min: 5, max: 95, step: 5, val: 50 }] }
  };

  /* ---------- state ---------- */
  let mode = "beads", ev = "black", areaKey = "strip";
  const params = {};
  Object.keys(MODES).forEach((m) => MODES[m].sliders.forEach((s) => (params[s.k] = s.val)));
  Object.keys(AREAS).forEach((a) => AREAS[a].sliders.forEach((s) => (params[s.k] = s.val)));
  let items = [], counts = [], trials = 0, pickIdx = -1, dots = [], pickTimer = 0;

  const cv = $("chArea"), cx = cv.getContext("2d");

  function setMode(m) {
    mode = m;
    document.querySelectorAll("#chModes .preset-btn").forEach((b) => b.classList.toggle("active", b.dataset.m === m));
    if (m === "area") { ev = areaKey; } else { ev = MODES[m].events(params)[0].k; }
    rebuild(true);
  }

  function rebuild(full) {
    const isArea = mode === "area";
    $("chTiles").hidden = isArea || MODES[mode].kind === "pair";
    $("chPairs").hidden = isArea || MODES[mode].kind !== "pair";
    cv.hidden = !isArea;
    if (full) renderSliders();
    if (isArea) { dots = []; trials = 0; hitsA = 0; hitsD = 0; renderChips(); renderTools(); drawArea(); report(); return; }
    items = MODES[mode].items(params);
    counts = items.map(() => 0); trials = 0; pickIdx = -1;
    if (!MODES[mode].events(params).some((e) => e.k === ev)) ev = MODES[mode].events(params)[0].k;
    renderChips(); renderTools(); renderItems(); report();
  }

  function renderSliders() {
    const box = $("chSliders");
    const list = mode === "area" ? AREAS[areaKey].sliders : MODES[mode].sliders;
    box.innerHTML = "";
    box.hidden = !list.length;
    list.forEach((s) => {
      const l = document.createElement("label");
      l.className = "sl";
      l.innerHTML = '<span>' + s.t + ' &nbsp;<b id="v_' + s.k + '"></b></span><input type="range" id="r_' + s.k + '" min="' + s.min + '" max="' + s.max + '" step="' + (s.step || 1) + '" value="' + params[s.k] + '" aria-label="' + s.t + '">';
      box.appendChild(l);
      const inp = l.querySelector("input"), out = l.querySelector("b");
      out.textContent = params[s.k];
      inp.addEventListener("input", () => { params[s.k] = parseFloat(inp.value); out.textContent = params[s.k]; rebuild(false); });
    });
  }

  function renderChips() {
    const box = $("chEvents");
    box.innerHTML = "";
    const lab = document.createElement("span");
    lab.className = "evt-label";
    lab.textContent = mode === "area" ? "Choose a shape:" : "Event - we want:";
    box.appendChild(lab);
    const list = mode === "area" ? Object.keys(AREAS).map((k) => ({ k, t: AREAS[k].t })) : MODES[mode].events(params);
    list.forEach((e) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "preset-btn" + (e.k === ev ? " active" : ""); b.textContent = e.t;
      b.addEventListener("click", () => {
        ev = e.k;
        if (mode === "area") { areaKey = e.k; rebuild(true); return; }
        renderChips(); renderItems(); report();
      });
      box.appendChild(b);
    });
  }

  function renderTools() {
    const box = $("chTools");
    box.innerHTML = "";
    const defs = mode === "area"
      ? [["Throw a dot", () => throwDots(1), true], ["Clear", () => { dots = []; trials = 0; hitsA = 0; hitsD = 0; drawArea(); report(); }]]
      : [[MODES[mode].go, () => pick(1), true], ["Clear tries", () => { counts = items.map(() => 0); trials = 0; pickIdx = -1; $("chOut").textContent = ""; renderItems(); report(); }]];
    defs.forEach((d) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "preset-btn" + (d[2] ? " go" : ""); b.textContent = d[0];
      b.addEventListener("click", d[1]);
      box.appendChild(b);
    });
  }

  const curEvent = () => MODES[mode].events(params).find((e) => e.k === ev);

  function renderItems() {
    const e = curEvent(), M = MODES[mode];
    const host = M.kind === "pair" ? $("chPairs") : $("chTiles");
    host.innerHTML = "";
    if (M.kind === "pair") host.style.gridTemplateColumns = "repeat(" + params.b + ", minmax(0, 54px))";
    if (!items.length) { host.textContent = "Add at least one bead."; return; }
    items.forEach((it, i) => {
      const d = document.createElement("div");
      d.className = "tile" + (M.kind === "bead" ? " bead " + it.c : "") + (M.kind === "pair" ? " pair" : "") + (e.f(it) ? " fav" : "") + (i === pickIdx ? " pick" : "");
      d.textContent = it.l;
      host.appendChild(d);
    });
  }

  function pick(times) {
    if (!items.length) return;
    let last = 0;
    for (let i = 0; i < times; i++) { last = (Math.random() * items.length) | 0; counts[last]++; trials++; }
    pickIdx = times === 1 ? last : -1;
    $("chOut").textContent = times === 1 ? items[last].out : times + " tries done";
    renderItems(); report();
    clearTimeout(pickTimer);
    if (times === 1) pickTimer = setTimeout(() => { pickIdx = -1; renderItems(); }, 700);
  }

  /* ---------- area experiments ---------- */
  let hitsA = 0, hitsD = 0;
  const SQ = { x: 60, y: 60, s: 300 }, CC = { x: 210, y: 210, r: 170 }, RC = { x: 30, y: 110, w: 360, h: 200 }, RB = { x: 30, y: 102, w: 360, h: 216 };

  function areaTest(px, py) {
    if (areaKey === "strip") {
      const sw = (params.w / 5) * SQ.s, x0 = SQ.x + (SQ.s - sw) / 2;
      return { in1: px >= x0 && px <= x0 + sw };
    }
    if (areaKey === "sector") {
      const u = 360 - params.ang;
      const a = (Math.atan2(py - CC.y, px - CC.x) * 180) / Math.PI;
      const diff = ((a - 90 + 540) % 360) - 180;
      return { in1: !(Math.abs(diff) < u / 2) };
    }
    if (areaKey === "csq") return { in1: (px - SQ.x - SQ.s / 2) ** 2 + (py - SQ.y - SQ.s / 2) ** 2 <= (SQ.s / 2) ** 2 };
    if (areaKey === "rect") { const w = params.rw * 36, h = params.rh * 36, x0 = RB.x + (RB.w - w) / 2, y0 = RB.y + (RB.h - h) / 2; return { in1: px >= x0 && px <= x0 + w && py >= y0 && py <= y0 + h }; }
    if (areaKey === "insq") { const h = CC.r / Math.SQRT2; return { in1: Math.abs(px - CC.x) <= h && Math.abs(py - CC.y) <= h }; }
    const px0 = RC.x + (params.pos / 100) * RC.w, ty = (py - RC.y) / RC.h;
    const inRect = true;
    // APB: below lines PA and PB. ADP: left of line PA (inside rectangle).
    const aX = RC.x, bX = RC.x + RC.w, pX = px0;
    const yFromTop = py - RC.y;
    const lineA = RC.h * (1 - (px - aX) / (pX - aX || 1e-9)); // PA: y offset from top at x on A..P  (A bottom, P top)
    const lineB = RC.h * (1 - (bX - px) / (bX - pX || 1e-9));
    const inAPB = px <= pX ? yFromTop >= lineA : yFromTop >= lineB;
    const inADP = px <= pX && yFromTop < lineA;
    return { in1: inAPB, in2: inADP, inRect, ty };
  }

  function throwDots(n) {
    for (let i = 0; i < n; i++) {
      let x, y;
      if (areaKey === "strip" || areaKey === "csq") { x = SQ.x + Math.random() * SQ.s; y = SQ.y + Math.random() * SQ.s; }
      else if (areaKey === "tri") { x = RC.x + Math.random() * RC.w; y = RC.y + Math.random() * RC.h; }
      else if (areaKey === "rect") { x = RB.x + Math.random() * RB.w; y = RB.y + Math.random() * RB.h; }
      else { do { x = CC.x + (Math.random() * 2 - 1) * CC.r; y = CC.y + (Math.random() * 2 - 1) * CC.r; } while ((x - CC.x) ** 2 + (y - CC.y) ** 2 > CC.r * CC.r); }
      const r = areaTest(x, y);
      trials++; if (r.in1) hitsA++; if (r.in2) hitsD++;
      if (dots.length < 1500) dots.push({ x, y, c: r.in1 ? 1 : r.in2 ? 2 : 0 });
    }
    $("chOut").textContent = n === 1 ? (dots.length && dots[dots.length - 1].c ? "Inside the shaded part" : "Outside the shaded part") : n + " dots thrown";
    drawArea(); report();
  }

  function drawArea() {
    cx.clearRect(0, 0, 420, 420);
    cx.lineWidth = 2.5; cx.strokeStyle = "#1f2937"; cx.font = "600 16px Inter, sans-serif"; cx.fillStyle = "#1f2937";
    const SH = "rgba(124,92,232,.35)", SH2 = "rgba(255,160,60,.35)";
    if (areaKey === "strip") {
      const sw = (params.w / 5) * SQ.s, x0 = SQ.x + (SQ.s - sw) / 2;
      cx.fillStyle = SH; cx.fillRect(x0, SQ.y, sw, SQ.s);
      cx.strokeRect(SQ.x, SQ.y, SQ.s, SQ.s);
      cx.strokeRect(x0, SQ.y, sw, SQ.s);
      cx.fillStyle = "#1f2937"; cx.textAlign = "center";
      cx.fillText(String(params.w), x0 + sw / 2, SQ.y - 10);
      cx.textAlign = "left"; cx.fillText("5", SQ.x + SQ.s + 8, SQ.y + SQ.s / 2);
    } else if (areaKey === "csq") {
      cx.strokeRect(SQ.x, SQ.y, SQ.s, SQ.s);
      cx.fillStyle = SH; cx.beginPath(); cx.arc(SQ.x + SQ.s / 2, SQ.y + SQ.s / 2, SQ.s / 2, 0, 2 * Math.PI); cx.fill(); cx.stroke();
    } else if (areaKey === "rect") {
      const w = params.rw * 36, h = params.rh * 36, x0 = RB.x + (RB.w - w) / 2, y0 = RB.y + (RB.h - h) / 2;
      cx.fillStyle = SH; cx.fillRect(x0, y0, w, h); cx.strokeRect(RB.x, RB.y, RB.w, RB.h); cx.strokeRect(x0, y0, w, h);
      cx.fillStyle = "#1f2937"; cx.textAlign = "center"; cx.fillText("10", RB.x + RB.w / 2, RB.y - 10);
      cx.textAlign = "left"; cx.fillText("6", RB.x + RB.w + 6, RB.y + RB.h / 2);
      cx.textAlign = "center"; cx.fillText(params.rw + " × " + params.rh, RB.x + RB.w / 2, y0 + h / 2 + 5);
    } else if (areaKey === "sector" || areaKey === "insq") {
      cx.beginPath(); cx.arc(CC.x, CC.y, CC.r, 0, 2 * Math.PI); cx.stroke();
      if (areaKey === "sector") {
        const u = 360 - params.ang, rad = Math.PI / 180;
        cx.fillStyle = SH; cx.beginPath();
        if (params.ang >= 360) { cx.arc(CC.x, CC.y, CC.r, 0, 2 * Math.PI); }
        else if (params.ang > 0) { cx.moveTo(CC.x, CC.y); cx.arc(CC.x, CC.y, CC.r, (90 + u / 2) * rad, (90 - u / 2 + 360) * rad); cx.closePath(); }
        cx.fill();
        if (params.ang > 0 && params.ang < 360) {
          cx.beginPath(); cx.moveTo(CC.x + CC.r * Math.cos((90 + u / 2) * rad), CC.y + CC.r * Math.sin((90 + u / 2) * rad));
          cx.lineTo(CC.x, CC.y); cx.lineTo(CC.x + CC.r * Math.cos((90 - u / 2) * rad), CC.y + CC.r * Math.sin((90 - u / 2) * rad)); cx.stroke();
        }
        cx.fillStyle = "#1f2937"; cx.textAlign = "center";
        cx.fillText(u + "° unshaded", CC.x, CC.y + CC.r * 0.62);
      } else {
        const h = CC.r / Math.SQRT2;
        cx.fillStyle = SH; cx.fillRect(CC.x - h, CC.y - h, 2 * h, 2 * h); cx.strokeRect(CC.x - h, CC.y - h, 2 * h, 2 * h);
      }
    } else {
      const px0 = RC.x + (params.pos / 100) * RC.w, yT = RC.y, yB = RC.y + RC.h, xL = RC.x, xR = RC.x + RC.w;
      cx.fillStyle = SH; cx.beginPath(); cx.moveTo(xL, yB); cx.lineTo(xR, yB); cx.lineTo(px0, yT); cx.closePath(); cx.fill();
      cx.fillStyle = SH2; cx.beginPath(); cx.moveTo(xL, yB); cx.lineTo(px0, yT); cx.lineTo(xL, yT); cx.closePath(); cx.fill();
      cx.strokeRect(xL, yT, RC.w, RC.h);
      cx.beginPath(); cx.moveTo(xL, yB); cx.lineTo(px0, yT); cx.lineTo(xR, yB); cx.stroke();
      cx.fillStyle = "#1f2937"; cx.textAlign = "center";
      cx.fillText("D", xL - 4, yT - 8); cx.fillText("C", xR + 4, yT - 8); cx.fillText("P", px0, yT - 8);
      cx.fillText("A", xL - 4, yB + 22); cx.fillText("B", xR + 4, yB + 22);
    }
    dots.forEach((d) => { cx.fillStyle = d.c === 1 ? "#FF5A1F" : d.c === 2 ? "#d97706" : "#1f2937"; cx.beginPath(); cx.arc(d.x, d.y, d.m ? 6 : 2.6, 0, 7); cx.fill(); if (d.m) { cx.lineWidth = 2; cx.strokeStyle = "#fff"; cx.stroke(); cx.lineWidth = 2.5; cx.strokeStyle = "#1f2937"; } });
  }

  function inFigure(x, y) {
    if (areaKey === "strip" || areaKey === "csq") return x >= SQ.x && x <= SQ.x + SQ.s && y >= SQ.y && y <= SQ.y + SQ.s;
    if (areaKey === "tri") return x >= RC.x && x <= RC.x + RC.w && y >= RC.y && y <= RC.y + RC.h;
    if (areaKey === "rect") return x >= RB.x && x <= RB.x + RB.w && y >= RB.y && y <= RB.y + RB.h;
    return (x - CC.x) ** 2 + (y - CC.y) ** 2 <= CC.r * CC.r;
  }
  cv.addEventListener("pointerdown", (e) => {
    const r = cv.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * 420, y = ((e.clientY - r.top) / r.height) * 420;
    if (!inFigure(x, y)) { $("chOut").textContent = "Tap inside the figure"; return; }
    const t = areaTest(x, y);
    trials++; if (t.in1) hitsA++; if (t.in2) hitsD++;
    dots.push({ x, y, c: t.in1 ? 1 : t.in2 ? 2 : 0, m: true });
    $("chOut").textContent = t.in1 ? "Your dot is in the shaded part" : t.in2 ? "Your dot is in the orange triangle" : "Your dot is outside the shaded part";
    drawArea(); report();
  });
  cv.style.cursor = "crosshair"; cv.style.touchAction = "manipulation";

  /* ---------- report ---------- */
  function line(cls, t) { return '<div class="line ' + cls + '">' + t + "</div>"; }
  function bars(theory, hits, n) {
    const tp = Math.min(100, theory * 100), ep = n ? Math.min(100, (hits / n) * 100) : 0;
    $("chBars").innerHTML =
      '<div class="bar-row"><span style="min-width:96px">Theory</span><div class="bar-track"><div class="bar-fill" style="width:' + tp + '%"></div></div><span>' + dec(theory) + '</span></div>' +
      '<div class="bar-row"><span style="min-width:96px">Your ' + n + ' tries</span><div class="bar-track"><div class="bar-fill" style="width:' + ep + '%;background:#FF5A1F"></div><div class="bar-theory" style="left:' + tp + '%"></div></div><span>' + (n ? dec(hits / n) : "-") + '</span></div>' +
      '<div class="eq2" style="font-size:.85rem">' + (n ? "The more times you try, the closer your bar gets to the theory." : "Press the button to start. The orange mark is where theory says the bar should end up.") + '</div>';
  }

  function report() {
    const res = $("chResult"), eq = $("chEq");
    if (mode === "area") {
      let expr, p, name, p2 = null;
      if (areaKey === "strip") { p = params.w / 5; name = "the dot is in the shaded strip"; expr = "(5 × " + params.w + ") / (5 × 5) = " + frac(Math.round(params.w * 2), 10); }
      else if (areaKey === "sector") { p = params.ang / 360; name = "the dot is in the shaded part"; expr = params.ang + "° / 360° = " + frac(params.ang, 360); }
      else if (areaKey === "csq") { p = Math.PI / 4; name = "the dot is inside the circle"; expr = "πr² / (2r)² = π/4 ≈ " + dec(p); }
      else if (areaKey === "rect") { p = (params.rw * params.rh) / 60; name = "the dot is in the shaded rectangle"; expr = "(" + params.rw + " × " + params.rh + ") / (10 × 6) = " + frac(params.rw * params.rh, 60); }
      else if (areaKey === "insq") { p = 2 / Math.PI; name = "the dot is inside the square"; expr = "2r² / πr² = 2/π ≈ " + dec(p); }
      else { p = 0.5; p2 = params.pos / 200; name = "the dot is inside triangle APB"; expr = "(½ × AB × h) / (AB × h) = 1/2"; }
      const hits = hitsA;
      res.innerHTML = line("found", "P(" + name + ") = shaded area / whole area") + line("", expr) + line("note", "P(not) = 1 − " + dec(p) + " = " + dec(1 - p)) +
        (p2 !== null ? line("found", "P(inside triangle ADP) = " + frac(Math.round(params.pos), 200) + " ≈ " + dec(p2) + (n0() ? " (tries: " + hitsD + "/" + trials + ")" : "")) : "") +
        line("note", "Dots thrown: " + trials + " · inside: " + hits);
      eq.innerHTML = '<div class="eq-title">Probability from area</div><div class="eq1">P = ' + (areaKey === "insq" ? "2/π ≈ " + dec(p) : areaKey === "csq" ? "π/4 ≈ " + dec(p) : areaKey === "rect" ? frac(params.rw * params.rh, 60) : areaKey === "tri" ? "1/2" : frac(Math.round(p * 360), 360)) + '</div><div class="eq2">' + (areaKey === "tri" ? "Whatever P's position, triangle APB is always half of the rectangle. Move P to see ADP change." : "The bigger the shaded part, the more likely the dot lands in it.") + "</div>";
      bars(p, hits, trials);
      return;
    }
    if (!items.length) { res.innerHTML = line("note", "Add at least one bead."); eq.innerHTML = ""; $("chBars").innerHTML = ""; return; }
    const e = curEvent(), fav = items.filter(e.f), total = items.length, x = fav.length;
    const favList = MODES[mode].kind === "bead" ? x + " bead" + (x === 1 ? "" : "s") : x <= 14 ? fav.map((i) => (MODES[mode].kind === "pair" ? "(" + i.l + ")" : i.l)).join(", ") : x + " outcomes";
    let hits = 0; items.forEach((it, i) => { if (e.f(it)) hits += counts[i]; });
    const totalText = mode === "boxes" ? params.a + " × " + params.b + " = " + total : String(total);
    res.innerHTML =
      line("note", "Possible outcomes: " + totalText) +
      line("note", "Favourable outcomes: " + (x ? favList : "none")) +
      line("found", "P(" + e.t + ") = " + x + " / " + total + " = " + frac(x, total)) +
      line("note", "P(not) = 1 − " + frac(x, total) + " = " + frac(total - x, total));
    eq.innerHTML = '<div class="eq-title">Probability of ' + e.t + '</div><div class="eq1">P = ' + x + " / " + total + (x && x !== total ? " = " + frac(x, total) : "") + '</div><div class="eq2">' + (x === 0 ? "No favourable outcome. This event is impossible, so P = 0." : x === total ? "Every outcome is favourable. This event is sure, so P = 1." : "≈ " + dec(x / total) + " (about " + Math.round((x / total) * 100) + " in every 100 tries)") + "</div>";
    bars(x / total, hits, trials);
  }
  function n0() { return trials > 0; }

  document.querySelectorAll("#chModes .preset-btn").forEach((b) => b.addEventListener("click", () => { $("chOut").textContent = ""; setMode(b.dataset.m); }));
  setMode("beads");

  /* test hook */
  window.__ch = { setMode, params, pick, throwDots, get state() { return { mode, ev, trials, total: items.length }; } };

  /* ---------- Quiz ---------- */
  const shell = $("quizShell");
  if (!shell) return;
  const questions = [
    { q: "A bag has 3 black beads and 2 white beads. One bead is taken without looking. What is the probability that it is white?", options: ["2/5", "3/5", "2/3", "1/2"], answer: 0, explain: "2 white out of 5 beads in all, so P = 2/5." },
    { q: "Cards numbered 1 to 10 are in a box. One card is taken. What is the probability that it is a prime number?", options: ["1/10", "3/10", "2/5", "1/2"], answer: 2, explain: "Primes are 2, 3, 5, 7. That is 4 out of 10, so P = 4/10 = 2/5." },
    { q: "A die numbered 1 to 6 is thrown. What is the probability of getting a multiple of both 2 and 3?", options: ["1/6", "1/3", "1/2", "0"], answer: 0, explain: "Multiples of both 2 and 3 are multiples of 6. Only 6 qualifies, so P = 1/6." },
    { q: "A die numbered 1 to 6 is thrown. What is the probability of not getting a prime number?", options: ["1/2", "1/3", "2/3", "1/6"], answer: 1, explain: "Primes: 2, 3, 5 (3 outcomes). Not prime: 1, 4, 6, so P = 3/6 = 1/2. Check: 1 − 1/2 = 1/2." },
    { q: "Two-digit numbers are written on paper pieces (10 to 99). One is taken. What is the probability that it is a multiple of 5?", options: ["1/5", "1/9", "18/100", "1/10"], answer: 0, explain: "There are 90 two-digit numbers. Multiples of 5: 10, 15, ..., 95 is 18 numbers. 18/90 = 1/5." },
    { q: "A box has slips 1, 2, 3, 4 and another box has slips 1, 2, 3, 4, 5. One slip is taken from each box. In how many ways can the slips be chosen?", options: ["9", "20", "10", "24"], answer: 1, explain: "4 choices from the first box and 5 from the second: 4 × 5 = 20." },
    { q: "In the same experiment (slips 1 to 4 and 1 to 5), what is the probability that both numbers are odd?", options: ["3/10", "1/4", "2/5", "1/2"], answer: 0, explain: "Odd slips: 1, 3 in the first box and 1, 3, 5 in the second. 2 × 3 = 6 pairs out of 20. P = 6/20 = 3/10." },
    { q: "A circle has a 120° sector left unshaded. A dot is put in the circle without looking. What is the probability that it is in the shaded part?", options: ["1/3", "1/2", "2/3", "3/4"], answer: 2, explain: "Shaded angle = 360° − 120° = 240°. P = 240/360 = 2/3." },
    { q: "A square of side 5 cm has a shaded strip 2 cm wide running from top to bottom. A dot is put in the square. What is the probability that it is in the strip?", options: ["2/5", "2/25", "1/5", "4/25"], answer: 0, explain: "Strip area = 2 × 5 = 10. Square area = 25. P = 10/25 = 2/5." },
    { q: "A box has red and blue beads. The probability of a red bead is 2/3. What is the probability of a blue bead?", options: ["2/3", "1/2", "1/3", "3/2"], answer: 2, explain: "Not red = blue, so P = 1 − 2/3 = 1/3." }
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
    let v = "Nice start. Run the experiments above again and retry.";
    if (pct >= 80) v = "Excellent! You have a good feel for chance."; else if (pct >= 50) v = "Good work. One more look at the lab and you've got it.";
    shell.innerHTML = '<div class="result-screen"><span class="eyebrow" style="justify-content:center;">RESULTS</span><div class="big-score">' + score + " / " + total + "</div><p>" + v + '</p><div class="result-actions"><button class="btn btn-primary" id="retryBtn">Try again</button><a class="btn btn-dark" href="subject.html?class=10&subject=maths">Back to Maths chapters</a></div></div>';
    $("retryBtn").addEventListener("click", () => { current = 0; score = 0; renderQuestion(); });
  }
  renderQuestion();
})();