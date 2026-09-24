/* =========================================================
   SCIENCE PRO — Class 10 page script (class10.html)
   Renders the subject grid (Physics / Chemistry / Maths / Biology)
   with a live count of how many chapters are currently available.
   ========================================================= */

const grid = document.getElementById("subjectGrid");
SITE_DATA.subjects.forEach((s, i) => {
  const a = document.createElement("a");
  a.href = `subject.html?class=10&subject=${s.id}`;
  a.className = `subject-card reveal ${s.color}`;
  a.style.transitionDelay = `${i * 0.08}s`;
  const liveCount = (SITE_DATA.topics[s.id] || []).filter((t) => t.status === "live").length;
  a.innerHTML = `
    <div>
      <span style="font-family:var(--f-mono);font-size:0.7rem;opacity:.8;letter-spacing:.06em;">${s.shortTag} · ${liveCount} CHAPTER${liveCount === 1 ? "" : "S"} LIVE</span>
      <h3>${s.name}</h3>
      <p>${s.tagline}</p>
    </div>
    <span class="go">Explore →</span>
  `;
  grid.appendChild(a);
});
