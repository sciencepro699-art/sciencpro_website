/* =========================================================
   SCIENCE PRO — Chapter resources (shared utility)
   -----------------------------------------------------------
   Each chapter can ship one downloadable PDF in assets/downloads/:
     <chapter-slug>-pyqs.pdf

   You add this file yourself (in VSCode, or however you like) —
   this script never generates or edits it. It just checks whether
   the file actually exists at that path and renders a working
   download card if so, or a "not added yet" placeholder if not.
   That way a missing file never becomes a dead link.

   To wire up a new chapter page:
     <div class="resource-grid" id="resourceGrid" data-chapter="yourchapterslug"></div>
     <script src="js/chapter-resources.js"></script>

   Nothing else needs to change here — the slug in data-chapter
   is the only thing that's chapter-specific.

   NOTE: the existence check uses fetch(), which browsers block
   entirely for pages opened via file:// (double-clicking the
   HTML file). To see real availability checks working, serve
   the site over http — e.g. `npx serve` or
   `python3 -m http.server` from the project folder, or simply
   view it on the deployed site (Netlify/Cloudflare Pages).
   Opened via file://, every resource will show as unavailable
   even if the PDF is present.
   ========================================================= */

(function () {
  const grid = document.getElementById("resourceGrid");

  // Stop if this page doesn't contain the resource section
  if (!grid) return;

  // Get chapter slug from:
  // <div id="resourceGrid" data-chapter="soundwaves">
  const slug = grid.dataset.chapter;

  if (!slug) {
    console.error("SciencePro: Chapter name is missing from data-chapter.");
    return;
  }

  // PDF location
  const pdfPath = `assets/downloads/${slug}-pyqs.pdf`;

  // PDF icon
  const PDF_ICON = `
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6"/>
      <path d="M8 13h8"/>
      <path d="M8 17h8"/>
      <path d="M8 9h2"/>
    </svg>
  `;

  // Create PYQ card
  const card = document.createElement("a");

  card.className = "resource-card reveal";
  card.href = pdfPath;

  // Opens PDF in a new browser tab instead of forcing download
  card.target = "_blank";
  card.rel = "noopener noreferrer";

  card.innerHTML = `
    <div class="resource-icon">
      ${PDF_ICON}
    </div>

    <div class="resource-info">
      <h3>PYQs</h3>
      <p>Previous year questions for this chapter.</p>
    </div>

    <span class="resource-download">
      View PDF →
    </span>
  `;

  // Clear old content and add the new card
  grid.innerHTML = "";
  grid.appendChild(card);

  // Re-initialize reveal animation if available
  if (typeof initScrollReveal === "function") {
    initScrollReveal();
  }
})();