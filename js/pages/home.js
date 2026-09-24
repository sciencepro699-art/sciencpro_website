/* =========================================================
   SCIENCE PRO — Home page script (index.html)
   Renders the Class 10 subject teasers and the class preview grid.
   Kept as an external file (not an inline <script>) so the site's
   Content-Security-Policy can use a strict script-src 'self' with
   no 'unsafe-inline' exception.
   ========================================================= */

const subjGrid = document.getElementById("homeSubjectGrid");
SITE_DATA.subjects.forEach((s, i) => {
  const a = document.createElement("a");
  a.href = `subject.html?class=10&subject=${s.id}`;
  a.className = `subject-card reveal ${s.color}`;
  a.style.transitionDelay = `${i * 0.08}s`;
  a.innerHTML = `
    <div>
      <span class="tag" style="font-family:var(--f-mono);font-size:0.7rem;opacity:.8;letter-spacing:.06em;">${s.shortTag} · CLASS 10</span>
      <h3>${s.name}</h3>
      <p>${s.tagline}</p>
    </div>
    <span class="go">Play now →</span>
  `;
  subjGrid.appendChild(a);
});

const classGrid = document.getElementById("homeClassGrid");
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
  classGrid.appendChild(el);
});
