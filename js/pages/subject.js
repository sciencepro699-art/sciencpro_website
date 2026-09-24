/* =========================================================
   SCIENCE PRO — Subject page script (subject.html)
   Reads ?class=&subject= from the URL and renders that subject's
   chapter list (live chapters link out, others show "Coming soon").
   ========================================================= */

const classId = getParam("class") || "10";
const subjectId = getParam("subject");
const subject = SITE_DATA.subjects.find((s) => s.id === subjectId);

if (!subject) {
  document.getElementById("subjectHeading").textContent = "Subject not found";
  document.getElementById("subjectTagline").textContent = "Head back and pick a subject from the list.";
} else {
  document.title = `${subject.name} — Class ${classId} — Science Pro`;
  document.getElementById("pageTitle").textContent = document.title;
  document.getElementById("subjectHeading").textContent = `Class ${classId} ${subject.name}`;
  document.getElementById("subjectTagline").textContent = subject.tagline;
  document.getElementById("crumbBar").innerHTML = `
    <a href="classes.html">Classes</a><span class="sep">/</span>
    <a href="class${classId}.html">Class ${classId}</a><span class="sep">/</span>
    <span>${subject.name}</span>
  `;

  const topics = SITE_DATA.topics[subjectId] || [];
  const grid = document.getElementById("gameGrid");

  if (topics.length === 0) {
    grid.innerHTML = `<p style="color:var(--c-ink-soft);">Chapters for this subject are coming soon — check back shortly.</p>`;
  }

  topics.forEach((t, i) => {
    const isLive = t.status === "live";
    const card = document.createElement(isLive ? "a" : "div");
    if (isLive) card.href = t.page;
    card.className = "game-card reveal" + (isLive ? "" : " locked");
    card.style.transitionDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <span class="tag" style="background: color-mix(in srgb, var(--c-${subject.color}) 18%, white); color: var(--c-ink);">${t.tag}</span>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
      <span class="go" style="color: ${isLive ? `var(--c-${subject.color})` : "var(--c-ink-soft)"}; font-family:var(--f-mono); font-size:.8rem; text-transform:uppercase; letter-spacing:.05em;">
        ${isLive ? "Open chapter →" : "Coming soon"}
      </span>
    `;
    grid.appendChild(card);
  });

  // Prefetch this subject's first live chapter — most likely next click
  // from here. Dynamic (rather than a static <link> in the HTML) because
  // subject.html is shared by every subject, and each one's live chapter
  // is different.
  const firstLive = topics.find((t) => t.status === "live");
  if (firstLive) {
    const prefetchLink = document.createElement("link");
    prefetchLink.rel = "prefetch";
    prefetchLink.href = firstLive.page;
    document.head.appendChild(prefetchLink);
  }
}
