/* =========================================================
   SCIENCE PRO — Classes page script (classes.html)
   Renders the class picker grid (5–12).
   ========================================================= */

const grid = document.getElementById("classGrid");
SITE_DATA.classes.forEach((c, i) => {
  const el = document.createElement(c.active ? "a" : "div");
  if (c.active) el.href = "class10.html";
  el.className = `class-card reveal ${c.active ? "active" : "locked"}`;
  el.style.transitionDelay = `${i * 0.05}s`;
  el.innerHTML = `
    <span class="badge">${c.active ? "Live" : "Soon"}</span>
    <span class="num">${c.id}</span>
    <span class="label">${c.label}</span>
  `;
  grid.appendChild(el);
});
