/* Solids — Class 10 Maths (Chapter 12)
   One light 3D viewer, five solids: cone, square pyramid, sphere, hemisphere, hollow hemisphere (bowl).
   Drag to turn the solid.  Move the sliders.  Pick a surface to light it up and see its area.
   No 3D library — a tiny painter's-algorithm renderer on a 2D canvas keeps this page small. */

window.addEventListener("error", function (e) {
  var d = document.getElementById("soErr");
  if (!d) {
    d = document.createElement("div"); d.id = "soErr";
    d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99;background:#B91C1C;color:#fff;padding:10px 16px;font:14px monospace";
    document.body.appendChild(d);
  }
  d.textContent = "Solids page error: " + e.message + " (" + (e.filename || "").split("/").pop() + ":" + e.lineno + ")";
});

(function () {
  "use strict";
  const cv = document.getElementById("soCanvas");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const net = document.getElementById("soNet"), nctx = net.getContext("2d");
  const $ = (id) => document.getElementById(id);
  const PI = Math.PI, D = PI / 180;
  const fmt = (v) => (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, "");

  /* ---------- the five solids ---------- */
  const SOLIDS = {
    cone: { name: "Cone", sl: [["r", "Radius r", 1, 10, 0.5, 3], ["h", "Height h", 1, 20, 0.5, 4]],
      chips: [["all", "Whole solid"], ["curved", "Curved surface"], ["base", "Base"], ["vol", "Volume"]], cut: true },
    pyramid: { name: "Pyramid", sl: [["a", "Base side a", 2, 14, 1, 6], ["h", "Height h", 1, 20, 0.5, 4]],
      chips: [["all", "Whole solid"], ["curved", "Slanting faces"], ["base", "Base"], ["vol", "Volume"]], cut: true },
    sphere: { name: "Sphere", sl: [["r", "Radius r", 1, 10, 0.5, 3]],
      chips: [["all", "Surface"], ["vol", "Volume"]], cut: true },
    cyl: { name: "Cylinder", sl: [["r", "Radius r", 1, 10, 0.5, 3], ["h", "Height h", 1, 20, 0.5, 5]],
      chips: [["all", "Whole solid"], ["curved", "Curved surface"], ["base", "Two bases"], ["vol", "Volume"]], cut: true },
    hemi: { name: "Hemisphere", sl: [["r", "Radius r", 1, 10, 0.5, 3]],
      chips: [["all", "Whole solid"], ["curved", "Curved surface"], ["base", "Flat base"], ["vol", "Volume"]], cut: true },
    bowl: { name: "Hollow hemisphere", sl: [["R", "Outer radius R", 2, 10, 0.5, 6], ["q", "Inner radius r", 1, 9.5, 0.5, 5]],
      chips: [["all", "Whole bowl"], ["curved", "Outer surface"], ["inner", "Inner surface"], ["ring", "Top ring"], ["vol", "Material (volume)"]], cut: false },
  };
  const COL = { curved: [255, 176, 58], base: [56, 189, 248], inner: [244, 114, 182], ring: [52, 211, 153], cut: [196, 181, 253] };
  let kind = "cone", grp = "all", cutOn = false, sliceMode = "off", sliceF = 0.5, auto = true, yaw = -0.6, pitch = 0.5, drag = null, V = {};

  /* ---------- mesh builders: faces = {p:[[x,y,z]...], g:group}.  y is up. ---------- */
  const P = (x, y, z) => [x, y, z];
  const cs = (deg) => [Math.cos(deg * D), Math.sin(deg * D)];
  function build() {
    const F = [], add = (g, ...p) => F.push({ p: p, g: g }), wedge = cutOn && sliceMode === "off";
    const N = 36;
    if (kind === "cone") {
      const r = V.r, h = V.h;
      for (let i = 0; i < N; i++) {
        const [c0, s0] = cs(i * 10), [c1, s1] = cs(i * 10 + 10);
        add("curved", P(0, h, 0), P(r * c0, 0, r * s0), P(r * c1, 0, r * s1));
        add("base", P(0, 0, 0), P(r * c1, 0, r * s1), P(r * c0, 0, r * s0));
      }
      if (wedge) { add("cut", P(0, h, 0), P(0, 0, 0), P(0, 0, r)); add("cut", P(0, h, 0), P(0, 0, 0), P(r, 0, 0)); }
    } else if (kind === "cyl") {
      const r = V.r, h = V.h;
      for (let i = 0; i < N; i++) {
        const [c0, s0] = cs(i * 10), [c1, s1] = cs(i * 10 + 10);
        add("curved", P(r * c0, 0, r * s0), P(r * c1, 0, r * s1), P(r * c1, h, r * s1), P(r * c0, h, r * s0));
        add("base", P(0, 0, 0), P(r * c1, 0, r * s1), P(r * c0, 0, r * s0));
        add("base", P(0, h, 0), P(r * c0, h, r * s0), P(r * c1, h, r * s1));
      }
      if (wedge) { add("cut", P(0, 0, 0), P(0, 0, r), P(0, h, r), P(0, h, 0)); add("cut", P(0, 0, 0), P(r, 0, 0), P(r, h, 0), P(0, h, 0)); }
    } else if (kind === "pyramid") {
      const a = V.a / 2, h = V.h, T = P(0, h, 0);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dz]) => {
        const m = P(a * dx, 0, a * dz);
        const u = dx ? P(a * dx, 0, -a) : P(-a, 0, a * dz), w = dx ? P(a * dx, 0, a) : P(a, 0, a * dz);
        add("curved", T, u, m); add("curved", T, m, w);
      });
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz]) =>
        add("base", P(0, 0, 0), P(sx * a, 0, 0), P(sx * a, 0, sz * a), P(0, 0, sz * a)));
      if (wedge) { add("cut", T, P(0, 0, 0), P(0, 0, a)); add("cut", T, P(0, 0, 0), P(a, 0, 0)); }
    } else if (kind === "sphere" || kind === "hemi") {
      const r = V.r, lo = kind === "sphere" ? -90 : 0;
      for (let la = lo; la < 90; la += 15) {
        const y0 = r * Math.sin(la * D), y1 = r * Math.sin((la + 15) * D), r0 = r * Math.cos(la * D), r1 = r * Math.cos((la + 15) * D);
        for (let i = 0; i < N; i++) {
          const [c0, s0] = cs(i * 10), [c1, s1] = cs(i * 10 + 10);
          add("curved", P(r0 * c0, y0, r0 * s0), P(r0 * c1, y0, r0 * s1), P(r1 * c1, y1, r1 * s1), P(r1 * c0, y1, r1 * s0));
        }
      }
      if (kind === "hemi") for (let i = 0; i < N; i++) {
        const [c0, s0] = cs(i * 10), [c1, s1] = cs(i * 10 + 10);
        add("base", P(0, 0, 0), P(r * c1, 0, r * s1), P(r * c0, 0, r * s0));
      }
      if (wedge) {
        const q = (f) => { const pts = [P(0, 0, 0)]; for (let t = 0; t <= 90; t += 15) { const [c, s] = cs(t); pts.push(f(r * c, r * s)); } add("cut", ...pts); };
        q((c, s) => P(0, s, c)); q((c, s) => P(c, s, 0));
        if (kind === "sphere") q((c, s) => P(c, 0, s));
      }
    } else if (kind === "bowl") {
      const R = V.R, ri = V.q;
      [[R, "curved"], [ri, "inner"]].forEach(([rad, g]) => {
        for (let la = -90; la < 0; la += 15) {
          const y0 = rad * Math.sin(la * D), y1 = rad * Math.sin((la + 15) * D), r0 = rad * Math.cos(la * D), r1 = rad * Math.cos((la + 15) * D);
          for (let i = 0; i < N; i++) {
            const [c0, s0] = cs(i * 10), [c1, s1] = cs(i * 10 + 10);
            add(g, P(r0 * c0, y0, r0 * s0), P(r0 * c1, y0, r0 * s1), P(r1 * c1, y1, r1 * s1), P(r1 * c0, y1, r1 * s0));
          }
        }
      });
      for (let i = 0; i < N; i++) {
        const [c0, s0] = cs(i * 10), [c1, s1] = cs(i * 10 + 10);
        add("ring", P(ri * c0, 0, ri * s0), P(ri * c1, 0, ri * s1), P(R * c1, 0, R * s1), P(R * c0, 0, R * s0));
      }
    }
    if (sliceMode !== "off") return sliceFaces(F);
    if (wedge) return F.filter((f) => {
      if (f.g === "cut") return true;
      const n = f.p.length, c = f.p.reduce((t, p) => [t[0] + p[0] / n, t[1] + p[1] / n, t[2] + p[2] / n], [0, 0, 0]);
      return !(c[0] > 1e-6 && c[2] > 1e-6 && (kind !== "sphere" || c[1] > 1e-6));
    });
    return F;
  }

  /* ---------- slicing: cut the solid with a plane and show the cut face ---------- */
  function sliceT() {
    const f = sliceF;
    return kind === "sphere" ? -V.r + 2 * V.r * f : kind === "hemi" ? f * V.r : kind === "bowl" ? -f * V.R : f * V.h;
  }
  const ringPts = (rho, fn) => { const o = []; for (let i = 0; i < 36; i++) { const [c, s2] = cs(i * 10); o.push(fn(rho * c, rho * s2)); } return o; };
  function capPolys() {
    const t = sliceT(), r = V.r, h = V.h, a = V.a / 2;
    if (sliceMode === "across") {
      const at = (rho) => ringPts(rho, (x, z) => P(x, t, z));
      if (kind === "cone") return [at(r * (1 - t / h))];
      if (kind === "cyl") return [at(r)];
      if (kind === "pyramid") { const q = a * (1 - t / h); return [[P(-q, t, -q), P(q, t, -q), P(q, t, q), P(-q, t, q)]]; }
      if (kind === "sphere" || kind === "hemi") return [at(Math.sqrt(r * r - t * t))];
      const ro = Math.sqrt(V.R * V.R - t * t), ri = Math.abs(t) < V.q ? Math.sqrt(V.q * V.q - t * t) : 0;
      if (!ri) return [at(ro)];
      const o = [];
      for (let i = 0; i < 36; i++) { const [c0, s0] = cs(i * 10), [c1, s1] = cs(i * 10 + 10); o.push([P(ri * c0, t, ri * s0), P(ri * c1, t, ri * s1), P(ro * c1, t, ro * s1), P(ro * c0, t, ro * s0)]); }
      return o;
    }
    const xy = (rho, y0, y1) => { const o = []; for (let d = y0; d <= y1; d += 5) { const [c, s2] = cs(d); o.push(P(rho * c, rho * s2, 0)); } return o; };
    if (kind === "cone") return [[P(-r, 0, 0), P(r, 0, 0), P(0, h, 0)]];
    if (kind === "pyramid") return [[P(-a, 0, 0), P(a, 0, 0), P(0, h, 0)]];
    if (kind === "cyl") return [[P(-r, 0, 0), P(r, 0, 0), P(r, h, 0), P(-r, h, 0)]];
    if (kind === "sphere") return [xy(r, 0, 355)];
    if (kind === "hemi") return [xy(r, 0, 180)];
    return [xy(V.R, 180, 360).concat(xy(V.q, 180, 360).reverse())];
  }
  function sliceFaces(F) {
    const t = sliceT(), dist = sliceMode === "across" ? (p) => t - p[1] : (p) => -p[2], out = [];
    F.forEach((f) => {
      const poly = [];
      for (let i = 0; i < f.p.length; i++) {
        const A = f.p[i], B = f.p[(i + 1) % f.p.length], da = dist(A), db = dist(B);
        if (da >= 0) poly.push(A);
        if ((da > 0 && db < 0) || (da < 0 && db > 0)) { const k = da / (da - db); poly.push([A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k]); }
      }
      if (poly.length >= 3) out.push({ p: poly, g: f.g });
    });
    capPolys().forEach((c) => out.push({ p: c, g: "cut" }));
    return out;
  }
  function secInfo() {
    const t = sliceT(), r = V.r, h = V.h, pi = PI, a = V.a;
    if (sliceMode === "across") {
      const k = fmt(Math.abs(t)) + " cm";
      if (kind === "cone") { const rho = r * (1 - t / h); return ["Circle", "radius ρ = r (1 − t/h) = " + fmt(rho) + " cm  →  area π ρ² = " + fmt(pi * rho * rho) + " cm²", "The small cone on top is removed. The piece left is a frustum (a cone with its top cut off)."]; }
      if (kind === "pyramid") { const q = a * (1 - t / h); return ["Square", "side = a (1 − t/h) = " + fmt(q) + " cm  →  area = " + fmt(q * q) + " cm²", "Cut parallel to the base: the section is a smaller square. The piece left is a frustum of the pyramid."]; }
      if (kind === "cyl") return ["Circle", "same as the base: radius " + fmt(r) + " cm  →  area π r² = " + fmt(pi * r * r) + " cm²", "Every slice across a cylinder is the same circle. That is why volume = base area × h."];
      if (kind === "sphere" || kind === "hemi") { const rho = Math.sqrt(r * r - t * t); return ["Circle", "radius ρ = √(r² − d²) = " + fmt(rho) + " cm  →  area π ρ² = " + fmt(pi * rho * rho) + " cm²", "Any flat cut through a sphere is a circle. It is largest (radius r) when the cut passes through the centre."]; }
      const ro = Math.sqrt(V.R * V.R - t * t), ri = Math.abs(t) < V.q ? Math.sqrt(V.q * V.q - t * t) : 0;
      return [ri ? "Ring" : "Circle", ri ? "outer radius " + fmt(ro) + " cm, inner radius " + fmt(ri) + " cm  →  area π (ρ₁² − ρ₂²) = " + fmt(pi * (ro * ro - ri * ri)) + " cm²" : "radius " + fmt(ro) + " cm  →  area " + fmt(pi * ro * ro) + " cm² (below the inner bowl, so it is solid)", "A cut across the bowl shows the thickness of the wall as a ring."];
    }
    if (kind === "cone") return ["Triangle", "base 2r = " + fmt(2 * r) + " cm, height h = " + fmt(h) + " cm  →  area = r h = " + fmt(r * h) + " cm²", "Cut straight down through the axis: the section is an isosceles triangle with sides l, l and 2r."];
    if (kind === "pyramid") return ["Triangle", "base a = " + fmt(a) + " cm, height h = " + fmt(h) + " cm  →  area = ½ a h = " + fmt(a * h / 2) + " cm²", "Cut straight down through the middle, parallel to two faces."];
    if (kind === "cyl") return ["Rectangle", "2r × h = " + fmt(2 * r) + " × " + fmt(h) + "  →  area = 2 r h = " + fmt(2 * r * h) + " cm²", "Cut straight down through the axis: the section is a rectangle."];
    if (kind === "sphere") return ["Circle (great circle)", "radius r = " + fmt(r) + " cm  →  area π r² = " + fmt(pi * r * r) + " cm²", "A cut through the centre gives the biggest circle. It cuts the sphere into two equal hemispheres."];
    if (kind === "hemi") return ["Semicircle", "radius r = " + fmt(r) + " cm  →  area ½ π r² = " + fmt(pi * r * r / 2) + " cm²", "Cut straight down through the axis of a hemisphere."];
    return ["Half ring", "area = ½ π (R² − r²) = " + fmt(pi * (V.R * V.R - V.q * V.q) / 2) + " cm²", "Cut straight down: the wall of the bowl shows as a curved band of thickness R − r."];
  }
  function drawSec() {
    const c = $("soSec"), x = c.getContext("2d"), dpr = window.devicePixelRatio || 1, w = 150, h = 110;
    c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
    if (sliceMode === "off") return;
    const polys = capPolys().map((p) => p.map((q) => sliceMode === "across" ? [q[0], -q[2]] : [q[0], -q[1]]));
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    polys.forEach((p) => p.forEach((q) => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }));
    const k = Math.min((w - 20) / Math.max(x1 - x0, 1e-6), (h - 20) / Math.max(y1 - y0, 1e-6)), ox = (w - (x1 - x0) * k) / 2 - x0 * k, oy = (h - (y1 - y0) * k) / 2 - y0 * k;
    x.fillStyle = "rgba(167,139,250,0.85)"; x.strokeStyle = "rgba(167,139,250,0.85)"; x.lineWidth = 1;
    polys.forEach((p) => { x.beginPath(); p.forEach((q, i) => i ? x.lineTo(ox + q[0] * k, oy + q[1] * k) : x.moveTo(ox + q[0] * k, oy + q[1] * k)); x.closePath(); x.fill(); x.stroke(); });
  }
  /* centre of the solid so it spins about its middle */
  const midY = () => kind === "cone" || kind === "pyramid" || kind === "cyl" ? V.h / 2 : kind === "hemi" ? V.r / 2 : kind === "bowl" ? -V.R / 2 : 0;

  /* ---------- drawing ---------- */
  let W = 600, H = 440;
  function resize() {
    const b = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    W = b.width; H = b.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const nb = net.getBoundingClientRect(); net.width = Math.round(nb.width * dpr); net.height = Math.round(nb.height * dpr); nctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const sc = () => {
    const half = kind === "pyramid" ? Math.max(V.h / 2, V.a * 0.72) : kind === "bowl" ? V.R : kind === "sphere" || kind === "hemi" ? V.r : Math.max(V.h / 2, V.r);
    return Math.min(W, H) * 0.42 / Math.max(half, 5);
  };
  function proj(p, my) {
    const x = p[0], y = p[1] - my, z = p[2], cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const x1 = x * cyw - z * syw, z1 = x * syw + z * cyw;
    return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
  }
  const L = [-0.35, 0.6, 0.72];
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const s = sc(), my = midY(), ox = W / 2, oy = H / 2, hi = grp !== "all" && grp !== "vol";
    const faces = build().map((f) => {
      const q = f.p.map((p) => proj(p, my));
      let n = [0, 0, 0];
      const a = q[0], b = q[1], c = q[2];
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      n = [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
      if ((kind === "sphere" || kind === "hemi" || kind === "bowl") && (f.g === "curved" || f.g === "inner")) {
        const m = f.p.length, c = f.p.reduce((t, p) => [t[0] + p[0] / m, t[1] + p[1] / m, t[2] + p[2] / m], [0, 0, 0]), sn = proj(c, 0), sg = f.g === "inner" ? -1 : 1;
        n = [sn[0] * sg, sn[1] * sg, sn[2] * sg];
      }
      let l = Math.hypot(n[0], n[1], n[2]) || 1, back = false;
      if (n[2] < 0) { n = [-n[0], -n[1], -n[2]]; back = true; }
      const lam = Math.max(0, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / l);
      return { q: q, g: f.g, lam: lam, back: back, z: q.reduce((t, p) => t + p[2], 0) / q.length };
    }).sort((u, v) => u.z - v.z);
    faces.forEach((f) => {
      let col = COL[f.g], al = 1;
      if (grp === "vol") { col = [96, 165, 250]; al = f.g === "cut" ? 0.95 : 0.78; }
      else if (hi && f.g !== grp && f.g !== "cut") { col = [120, 130, 160]; al = 0.28; }
      const k = (0.5 + 0.5 * f.lam) * (f.back ? 0.82 : 1);
      const rgb = "rgba(" + Math.round(col[0] * k) + "," + Math.round(col[1] * k) + "," + Math.round(col[2] * k) + "," + al + ")";
      ctx.beginPath();
      f.q.forEach((p, i) => { const X = ox + p[0] * s, Y = oy - p[1] * s; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
      ctx.closePath(); ctx.fillStyle = rgb; ctx.fill();
      ctx.lineWidth = kind === "pyramid" ? 1.2 : 0.8; ctx.strokeStyle = kind === "pyramid" ? "rgba(16,22,46,0.55)" : rgb; ctx.stroke();
    });
    /* dimension lines on top */
    const pr = (p) => { const q = proj(p, my); return [ox + q[0] * s, oy - q[1] * s]; };
    const seg = (a, b, label, col) => {
      const A = pr(a), B = pr(b);
      ctx.save(); ctx.setLineDash([6, 4]); ctx.lineWidth = 2.5; ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.restore();
      const mx = (A[0] + B[0]) / 2, my2 = (B[1] + A[1]) / 2;
      ctx.font = "700 14px 'JetBrains Mono', monospace"; const w = ctx.measureText(label).width + 12;
      ctx.fillStyle = "rgba(16,22,46,0.88)"; ctx.fillRect(mx - w / 2, my2 - 11, w, 22);
      ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, mx, my2 + 1);
    };
    if (sliceMode === "across") return;
    const WH = "#E8ECF5", YL = "#FFE08A", PK = "#FBB6D9";
    if (kind === "cone") { seg(P(0, 0, 0), P(0, V.h, 0), "h", WH); seg(P(0, 0, 0), P(V.r, 0, 0), "r", YL); seg(P(0, V.h, 0), P(V.r, 0, 0), "l", PK); }
    else if (kind === "cyl") { seg(P(0, 0, 0), P(0, V.h, 0), "h", WH); seg(P(0, 0, 0), P(V.r, 0, 0), "r", YL); }
    else if (kind === "pyramid") { seg(P(0, 0, 0), P(0, V.h, 0), "h", WH); seg(P(0, 0, 0), P(V.a / 2, 0, 0), "a/2", YL); seg(P(0, V.h, 0), P(V.a / 2, 0, 0), "l", PK); }
    else if (kind === "sphere" || kind === "hemi") seg(P(0, 0, 0), P(V.r, 0, 0), "r", YL);
    else { seg(P(0, 0, 0), P(V.q, 0, 0), "r", PK); seg(P(V.q, 0, 0), P(V.R, 0, 0), "R−r", YL); }
  }

  /* ---------- numbers ---------- */
  function calc() {
    const o = [], r = V.r, h = V.h, pi = PI;
    const A = (id, t, v, u) => o.push({ id: id, t: t + " = " + fmt(v) + " " + (u || "cm²"), v: v });
    if (kind === "cone") {
      const l = Math.sqrt(r * r + h * h);
      o.push({ id: "l", t: "Slant height  l = √(r² + h²) = √(" + fmt(r * r) + " + " + fmt(h * h) + ") = " + fmt(l) + " cm" });
      o.push({ id: "x", t: "Sector angle  x° = 360 × r ÷ l = 360 × " + fmt(r) + " ÷ " + fmt(l) + " = " + fmt(360 * r / l) + "°  (r/l = x/360)" });
      A("curved", "Curved surface area = π r l", pi * r * l); A("base", "Base area = π r²", pi * r * r);
      A("all", "Total surface area = π r (l + r)", pi * r * (l + r)); A("vol", "Volume = ⅓ π r² h", pi * r * r * h / 3, "cm³");
      return { lines: o, eq: ["Cone", "Curved surface = π r l", "Total = π r (l + r)   ·   Volume = ⅓ π r² h"] };
    }
    if (kind === "pyramid") {
      const a = V.a, l = Math.sqrt(h * h + a * a / 4);
      o.push({ id: "l", t: "Slant height  l = √(h² + (a/2)²) = √(" + fmt(h * h) + " + " + fmt(a * a / 4) + ") = " + fmt(l) + " cm" });
      o.push({ id: "e", t: "Edge  e = √(l² + (a/2)²) = " + fmt(Math.sqrt(l * l + a * a / 4)) + " cm   ·   so  h = √(l² − (a/2)²)" });
      A("curved", "4 slanting faces = 4 × ½ a l = 2 a l", 2 * a * l); A("base", "Base area = a²", a * a);
      A("all", "Total surface area = a² + 2 a l", a * a + 2 * a * l); A("vol", "Volume = ⅓ a² h", a * a * h / 3, "cm³");
      return { lines: o, eq: ["Square pyramid", "Slanting faces = 2 a l", "Total = a² + 2 a l   ·   Volume = ⅓ × base area × h"] };
    }
    if (kind === "cyl") {
      A("curved", "Curved surface area = 2 π r h", 2 * pi * r * h); A("base", "Two bases = 2 π r²", 2 * pi * r * r);
      A("all", "Total surface area = 2 π r h + 2 π r²", 2 * pi * r * h + 2 * pi * r * r); A("vol", "Volume = π r² h", pi * r * r * h, "cm³");
      return { lines: o, eq: ["Cylinder", "Curved surface = 2 π r h   ·   Two bases = 2 π r²", "Total = 2 π r (h + r)   ·   Volume = π r² h"] };
    }
    if (kind === "sphere") {
      A("all", "Surface area = 4 π r²", 4 * pi * r * r); A("vol", "Volume = ⁴⁄₃ π r³", 4 * pi * r * r * r / 3, "cm³");
      return { lines: o, eq: ["Sphere", "Surface area = 4 π r²", "Volume = ⁴⁄₃ π r³"] };
    }
    if (kind === "hemi") {
      A("curved", "Curved surface area = 2 π r²", 2 * pi * r * r); A("base", "Flat base = π r²", pi * r * r);
      A("all", "Total surface area = 3 π r²", 3 * pi * r * r); A("vol", "Volume = ⅔ π r³", 2 * pi * r * r * r / 3, "cm³");
      return { lines: o, eq: ["Hemisphere", "Curved surface = 2 π r²   ·   Total = 3 π r²", "Volume = ⅔ π r³  (half of the sphere)"] };
    }
    const R = V.R, q = V.q;
    A("curved", "Outer surface = 2 π R²", 2 * pi * R * R); A("inner", "Inner surface = 2 π r²", 2 * pi * q * q);
    A("ring", "Top ring = π (R² − r²)", pi * (R * R - q * q)); A("all", "Total surface = 2πR² + 2πr² + π(R² − r²)", 2 * pi * R * R + 2 * pi * q * q + pi * (R * R - q * q));
    A("vol", "Material volume = ⅔ π (R³ − r³)", 2 * pi * (R * R * R - q * q * q) / 3, "cm³");
    return { lines: o, eq: ["Hollow hemisphere (bowl)", "Outer = 2πR²  ·  Inner = 2πr²  ·  Top ring = π(R² − r²)", "Material = ⅔ π (R³ − r³)"] };
  }
  function readout() {
    const c = calc();
    $("soResult").innerHTML = c.lines.map((l) => '<div class="line' + (l.id === grp ? " found" : (l.id === "l" || l.id === "x" || l.id === "e") ? " note" : "") + '">' + l.t + "</div>").join("") +
      '<div class="line note">(π = 3.1416 here. In the exam use the π given in the question.)</div>';
    $("soEq").innerHTML = '<div class="eq-title">' + c.eq[0] + '</div><div class="eq1">' + c.eq[1] + '</div><div class="eq2">' + c.eq[2] + "</div>";
  }

  /* ---------- the opened-out net ---------- */
  function drawNet() {
    const nb = net.getBoundingClientRect(), w = nb.width, h = nb.height; nctx.clearRect(0, 0, w, h);
    const t = (s, x, y, col, sz) => { nctx.font = "700 " + (sz || 13) + "px 'JetBrains Mono', monospace"; nctx.fillStyle = col || "#4A4F63"; nctx.textAlign = "center"; nctx.textBaseline = "middle"; nctx.fillText(s, x, y); };
    const rgb = (c, a) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a || 1) + ")";
    const circ = (x, y, rad, c, label) => { nctx.beginPath(); nctx.arc(x, y, rad, 0, 2 * PI); nctx.fillStyle = rgb(c, 0.85); nctx.fill(); nctx.strokeStyle = "#171B2C"; nctx.lineWidth = 1.5; nctx.stroke(); if (label) t(label, x, y, "#171B2C", 13); };
    let title = "";
    if (kind === "cone") {
      const r = V.r, l = Math.sqrt(r * r + V.h * V.h), phi = 360 * r / l;
      const leftCm = phi > 180 ? l * -Math.cos(phi / 2 * D) : 0, s = Math.min(22, (w - 24 - 36 - 12) / (leftCm + l + 2 * r), (h - 44) / (2 * l));
      const left = phi > 180 ? l * s * -Math.cos(phi / 2 * D) : 0, cx0 = 24 + left, cy0 = h / 2;
      nctx.beginPath(); nctx.moveTo(cx0, cy0); nctx.arc(cx0, cy0, l * s, -phi / 2 * D, phi / 2 * D); nctx.closePath();
      nctx.fillStyle = rgb(COL.curved, 0.85); nctx.fill(); nctx.strokeStyle = "#171B2C"; nctx.lineWidth = 1.5; nctx.stroke();
      nctx.save(); nctx.setLineDash([5, 4]); nctx.strokeStyle = "#171B2C"; nctx.beginPath(); nctx.moveTo(cx0, cy0); nctx.lineTo(cx0 + l * s, cy0); nctx.stroke(); nctx.restore();
      t("l = " + fmt(l), cx0 + l * s * 0.6, cy0 + 14, "#171B2C");
      t(Math.round(phi) + "°", cx0 + 30, cy0 - 14, "#171B2C");
      const bx = cx0 + l * s + 36 + r * s; circ(bx, cy0, r * s, COL.base, "base");
      t("arc = 2πr = " + fmt(2 * PI * r), cx0 + l * s * 0.72, cy0 + Math.min(h / 2 - 10, l * s * Math.sin(phi / 2 * D) + 14), "#6D4FD6", 12);
      title = "Cut the curved surface open: it is a sector of radius l (arc length 2πr), plus the base circle.";
    } else if (kind === "cyl") {
      const r = V.r, hh = V.h, W2 = 2 * PI * r, s = Math.min(22, (w - 40) / (W2 + 4 * r + 40), (h - 30) / Math.max(hh, 4 * r + 1));
      const x0 = (w - (W2 * s + 4 * r * s + 40)) / 2, cy0 = h / 2;
      nctx.fillStyle = rgb(COL.curved, 0.85); nctx.fillRect(x0, cy0 - hh * s / 2, W2 * s, hh * s); nctx.strokeStyle = "#171B2C"; nctx.lineWidth = 1.5; nctx.strokeRect(x0, cy0 - hh * s / 2, W2 * s, hh * s);
      t("2πr = " + fmt(W2) + "   ×   h = " + fmt(hh), x0 + W2 * s / 2, cy0, "#171B2C", 13);
      circ(x0 + W2 * s + 20 + r * s, cy0 - r * s - 4, r * s, COL.base, "πr²"); circ(x0 + W2 * s + 20 + r * s, cy0 + r * s + 4, r * s, COL.base, "πr²");
      title = "Open the cylinder out: a rectangle (2πr × h) for the curved surface, plus two circles for the bases.";
    } else if (kind === "pyramid") {
      const a = V.a, l = Math.sqrt(V.h * V.h + a * a / 4), s = Math.min(22, (w - 30) / (a + 2 * l), (h - 24) / (a + 2 * l)), cx0 = w / 2, cy0 = h / 2, hf = a * s / 2;
      const tri = (p, q, rr) => { nctx.beginPath(); nctx.moveTo(p[0], p[1]); nctx.lineTo(q[0], q[1]); nctx.lineTo(rr[0], rr[1]); nctx.closePath(); nctx.fillStyle = rgb(COL.curved, 0.85); nctx.fill(); nctx.stroke(); };
      nctx.strokeStyle = "#171B2C"; nctx.lineWidth = 1.5;
      tri([cx0 - hf, cy0 - hf], [cx0 + hf, cy0 - hf], [cx0, cy0 - hf - l * s]); tri([cx0 - hf, cy0 + hf], [cx0 + hf, cy0 + hf], [cx0, cy0 + hf + l * s]);
      tri([cx0 - hf, cy0 - hf], [cx0 - hf, cy0 + hf], [cx0 - hf - l * s, cy0]); tri([cx0 + hf, cy0 - hf], [cx0 + hf, cy0 + hf], [cx0 + hf + l * s, cy0]);
      nctx.fillStyle = rgb(COL.base, 0.85); nctx.fillRect(cx0 - hf, cy0 - hf, 2 * hf, 2 * hf); nctx.strokeRect(cx0 - hf, cy0 - hf, 2 * hf, 2 * hf);
      t("a² = " + fmt(a * a), cx0, cy0, "#171B2C"); t("½ a l", cx0, cy0 - hf - l * s * 0.4, "#171B2C"); t("l = " + fmt(l), cx0 + hf + l * s * 0.36, cy0, "#171B2C", 12);
      title = "Open the pyramid out: one square base and four triangles, each of area ½ a l.";
    } else if (kind === "sphere" || kind === "hemi") {
      const r = V.r, n = kind === "sphere" ? 4 : 3, s = Math.min(24, (w - 20 - 14 * n) / (2 * r * n), (h - 24) / (2 * r)), y0 = h / 2;
      let x = (w - (2 * r * s * n + 14 * (n - 1))) / 2 + r * s;
      for (let i = 0; i < n; i++) { const base = kind === "hemi" && i === 2; circ(x, y0, r * s, base ? COL.base : COL.curved, "πr²"); x += 2 * r * s + 14; }
      title = kind === "sphere" ? "Surface of a sphere = the area of 4 circles of the same radius: 4πr²." : "Curved surface = 2 circles (2πr²), flat base = 1 circle (πr²): total 3πr².";
    } else {
      const R = V.R, q = V.q, tot = 4 * R + 4 * q + 2 * R, s = Math.min(24, (w - 20 - 14 * 5) / tot, (h - 24) / (2 * R)), y0 = h / 2;
      let x = (w - (tot * s + 14 * 4)) / 2;
      [[R, COL.curved], [R, COL.curved], [q, COL.inner], [q, COL.inner]].forEach((c) => { circ(x + c[0] * s, y0, c[0] * s, c[1]); x += 2 * c[0] * s + 14; });
      nctx.beginPath(); nctx.arc(x + R * s, y0, R * s, 0, 2 * PI); nctx.arc(x + R * s, y0, q * s, 0, 2 * PI, true); nctx.fillStyle = rgb(COL.ring, 0.85); nctx.fill(); nctx.stroke();
      title = "Outer surface = 2 circles of radius R, inner surface = 2 circles of radius r, plus the flat ring on top.";
    }
    $("soNetTitle").textContent = title;
  }

  /* ---------- UI ---------- */
  function buildUI() {
    const S = SOLIDS[kind];
    $("soSliders").innerHTML = S.sl.map((s) =>
      '<label class="sl"><span>' + s[1] + ' &nbsp;<b id="so_' + s[0] + 'v">' + s[5] + '</b> cm</span><input type="range" id="so_' + s[0] + '" min="' + s[2] + '" max="' + s[3] + '" step="' + s[4] + '" value="' + s[5] + '" aria-label="' + s[1] + '" /></label>').join("");
    S.sl.forEach((s) => { V[s[0]] = s[5]; $("so_" + s[0]).addEventListener("input", (e) => { V[s[0]] = +e.target.value; if (kind === "bowl") fixBowl(s[0]); update(); }); });
    $("soChips").innerHTML = S.chips.map((c) => '<button class="preset-btn so-chip" type="button" data-g="' + c[0] + '">' + c[1] + "</button>").join("");
    document.querySelectorAll(".so-chip").forEach((b) => b.addEventListener("click", () => { grp = b.dataset.g; update(); }));
    $("soCut").hidden = !S.cut;
  }
  function fixBowl(changed) {
    if (V.q > V.R - 0.5) { if (changed === "R") V.q = Math.max(1, V.R - 0.5); else V.R = V.q + 0.5; }
    $("so_R").value = V.R; $("so_q").value = V.q;
  }
  function update() {
    SOLIDS[kind].sl.forEach((s) => { $("so_" + s[0] + "v").textContent = fmt(V[s[0]]); });
    document.querySelectorAll(".so-chip").forEach((b) => b.classList.toggle("active", b.dataset.g === grp));
    document.querySelectorAll(".so-kind").forEach((b) => b.classList.toggle("active", b.dataset.k === kind));
    $("soCut").classList.toggle("active", cutOn); $("soCut").textContent = cutOn ? "Cut-away: ON" : "Cut-away: see inside";
    $("soAuto").classList.toggle("active", auto); $("soAuto").textContent = auto ? "Auto-turn: ON" : "Auto-turn: OFF";
    document.querySelectorAll(".so-slice").forEach((b) => b.classList.toggle("active", b.dataset.m === sliceMode));
    $("soSliceF").hidden = sliceMode !== "across"; $("soSecBox").hidden = sliceMode === "off";
    if (sliceMode !== "off") { const i = secInfo(); $("soSecTitle").textContent = "Cross-section: " + i[0]; $("soSecLine").textContent = i[1]; $("soSecNote").textContent = i[2]; $("soSliceV").textContent = fmt(Math.round(sliceF * 100)) + "%"; drawSec(); }
    readout(); drawNet(); draw();
  }
  function setKind(k) { kind = k; grp = "all"; cutOn = false; sliceMode = "off"; buildUI(); update(); }
  document.querySelectorAll(".so-kind").forEach((b) => b.addEventListener("click", () => setKind(b.dataset.k)));
  $("soCut").addEventListener("click", () => { cutOn = !cutOn; if (cutOn) sliceMode = "off"; update(); });
  document.querySelectorAll(".so-slice").forEach((b) => b.addEventListener("click", () => { sliceMode = b.dataset.m; if (sliceMode !== "off") cutOn = false; update(); }));
  $("soSliceRange").addEventListener("input", (e) => { sliceF = +e.target.value / 100; update(); });
  $("soAuto").addEventListener("click", () => { auto = !auto; update(); });
  $("soReset").addEventListener("click", () => { yaw = -0.6; pitch = 0.5; setKind(kind); });

  /* drag to turn */
  cv.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); cv.style.cursor = "grabbing"; });
  cv.addEventListener("pointermove", (e) => { if (!drag) return; yaw += (e.clientX - drag.x) * 0.012; pitch = Math.max(-1.45, Math.min(1.45, pitch + (e.clientY - drag.y) * 0.012)); drag = { x: e.clientX, y: e.clientY }; draw(); });
  const up = () => { drag = null; cv.style.cursor = "grab"; };
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) auto = false;
  let last = 0;
  function tick(t) { if (auto && !drag && !document.hidden && t - last > 30) { yaw += 0.012; last = t; draw(); } requestAnimationFrame(tick); }
  window.addEventListener("resize", () => { resize(); update(); });
  resize(); buildUI(); update(); requestAnimationFrame(tick);
  window.__so = { slice: (m, f) => { sliceMode = m; if (f != null) sliceF = f; update(); }, set: (k) => setKind(k), grp: (g) => { grp = g; update(); }, cut: (v) => { cutOn = v; update(); }, auto: (v) => { auto = v; update(); }, view: (y, p) => { yaw = y; pitch = p; draw(); }, V: () => V, text: () => $("soResult").textContent };
})();

/* ---------- Quiz ---------- */
(function () {
  "use strict";
  const shell = document.getElementById("quizShell");
  if (!shell) return;
  const questions = [
    { q: "A cone has radius 6 cm and height 8 cm. What is its slant height?", options: ["14 cm", "10 cm", "12 cm", "7 cm"], answer: 1, explain: "l² = r² + h² = 36 + 64 = 100, so l = 10 cm." },
    { q: "A cone has radius 7 cm and slant height 25 cm. What is its curved surface area? (π = 22/7)", options: ["154 cm²", "275 cm²", "550 cm²", "1100 cm²"], answer: 2, explain: "Curved surface = π r l = 22/7 × 7 × 25 = 550 cm²." },
    { q: "A cone has radius 3 cm and height 7 cm. What is its volume? (π = 22/7)", options: ["66 cm³", "198 cm³", "22 cm³", "132 cm³"], answer: 0, explain: "V = ⅓ π r² h = ⅓ × 22/7 × 9 × 7 = 66 cm³." },
    { q: "The sides of a square pyramid's base are 6 cm. Its height is 4 cm. What is its volume?", options: ["144 cm³", "72 cm³", "48 cm³", "24 cm³"], answer: 2, explain: "V = ⅓ × base area × height = ⅓ × 36 × 4 = 48 cm³." },
    { q: "A square pyramid has base side 6 cm and the slant height of each face is 5 cm. What is the area of its 4 slanting faces?", options: ["30 cm²", "60 cm²", "90 cm²", "120 cm²"], answer: 1, explain: "Each face = ½ × 6 × 5 = 15 cm². Four faces = 60 cm²." },
    { q: "What is the surface area of a sphere of radius 7 cm? (π = 22/7)", options: ["154 cm²", "308 cm²", "616 cm²", "1232 cm²"], answer: 2, explain: "4 π r² = 4 × 22/7 × 49 = 616 cm²." },
    { q: "What is the volume of a sphere of radius 3 cm?", options: ["12π cm³", "27π cm³", "36π cm³", "108π cm³"], answer: 2, explain: "V = ⁴⁄₃ π r³ = ⁴⁄₃ × π × 27 = 36π cm³." },
    { q: "What is the curved surface area of a hemisphere of radius 7 cm? (π = 22/7)", options: ["154 cm²", "308 cm²", "462 cm²", "616 cm²"], answer: 1, explain: "Curved surface = 2 π r² = 2 × 22/7 × 49 = 308 cm²." },
    { q: "What is the total surface area of a solid hemisphere of radius 7 cm? (π = 22/7)", options: ["308 cm²", "462 cm²", "616 cm²", "154 cm²"], answer: 1, explain: "Total = curved surface + flat base = 2 π r² + π r² = 3 π r² = 3 × 22/7 × 49 = 462 cm²." },
    { q: "A cone and a hemisphere have the same radius r. The height of the cone is also r. What is the ratio of their volumes (cone : hemisphere)?", options: ["1 : 2", "2 : 1", "1 : 1", "1 : 3"], answer: 0, explain: "Cone = ⅓ π r³. Hemisphere = ⅔ π r³. The ratio is ⅓ : ⅔ = 1 : 2." },
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
    let v = "Nice start. Turn the solids above again and retry.";
    if (pct >= 80) v = "Excellent! You know your solids.";
    else if (pct >= 50) v = "Good work. One more go with the 3D solids and you've got it.";
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