/* =========================================================
   SCIENCE PRO — Chapter: Genetics of Life (Class 10 Biology)
   -----------------------------------------------------------
   Self-contained, like js/soundwaves.js and js/nomenclature.js.
   Deliberately scoped to the basics: what a gene, chromosome, and
   DNA molecule actually are, how they relate to each other by
   scale, and the A–T / G–C base-pairing rule. No mitosis, no
   transcription/translation, no molecular chemistry — those are
   later-chapter territory, not "the basics".
   ========================================================= */

/* ---------------------------------------------------------
   1. ZOOM EXPLORER (Cell → Nucleus → Chromosome → DNA → Gene)
   --------------------------------------------------------- */
(function () {
  const nav = document.getElementById("zoomNav");
  if (!nav) return;

  const visual = document.getElementById("zoomVisual");
  const titleEl = document.getElementById("zoomTitle");
  const textEl = document.getElementById("zoomText");
  const scaleEl = document.getElementById("zoomScale");

  // Every SVG below uses currentColor-free, fully explicit fills/strokes
  // so it renders identically regardless of what CSS is loaded — no
  // dependency on custom properties resolving correctly inside an SVG
  // that might get inlined or copied elsewhere later.
  const STAGES = {
    cell: {
      title: "Cell",
      scale: "≈ 0.01 mm across",
      text: "Every living thing is built from cells. Each one is like a tiny factory, and floating near its centre is the nucleus — the part that stores all of the cell's genetic instructions.",
      svg: `
        <svg viewBox="0 0 200 200" width="170" height="170" aria-label="Diagram of a cell with a nucleus">
          <circle cx="100" cy="100" r="85" fill="rgba(52,211,153,0.12)" stroke="#34D399" stroke-width="3"/>
          <circle cx="100" cy="100" r="38" fill="rgba(52,211,153,0.4)" stroke="#34D399" stroke-width="2.5"/>
          <circle cx="55" cy="60" r="6" fill="#FF7A29" opacity="0.75"/>
          <circle cx="148" cy="72" r="5" fill="#FF7A29" opacity="0.75"/>
          <circle cx="128" cy="152" r="7" fill="#FF7A29" opacity="0.75"/>
          <circle cx="58" cy="148" r="4" fill="#FF7A29" opacity="0.75"/>
        </svg>`,
    },
    nucleus: {
      title: "Nucleus",
      scale: "≈ 0.006 mm across",
      text: "Inside the nucleus, genetic material floats as loosely coiled threads called chromatin. When the cell is about to divide, this chromatin coils up tightly into chromosomes.",
      svg: `
        <svg viewBox="0 0 200 200" width="170" height="170" aria-label="Diagram of a nucleus with chromatin">
          <circle cx="100" cy="100" r="82" fill="rgba(52,211,153,0.15)" stroke="#34D399" stroke-width="3"/>
          <circle cx="100" cy="100" r="72" fill="none" stroke="#34D399" stroke-width="1.5" opacity="0.5"/>
          <path d="M55 65 Q75 45 95 65 T135 65" fill="none" stroke="#1f8f68" stroke-width="4" stroke-linecap="round"/>
          <path d="M65 105 Q85 88 105 105 T145 105" fill="none" stroke="#1f8f68" stroke-width="4" stroke-linecap="round"/>
          <path d="M50 140 Q70 123 90 140 T130 140" fill="none" stroke="#1f8f68" stroke-width="4" stroke-linecap="round"/>
        </svg>`,
    },
    chromosome: {
      title: "Chromosome",
      scale: "≈ 0.000005 mm wide",
      text: "DNA winds around a cluster of 8 histone proteins (a histone octamer), forming a bead-like unit called a nucleosome. Chromosomes form by packing and coiling many nucleosomes together. Each half of the finished X-shape is a chromatid, and the two chromatids are joined at the centromere.",
      svg: `
        <svg viewBox="0 0 220 170" width="190" height="147" aria-label="Diagram showing DNA wrapped around histone proteins forming a nucleosome, which packs into a chromosome">
          <path d="M8 45 Q2 30 5 12" fill="none" stroke="#34D399" stroke-width="3" stroke-linecap="round"/>
          <path d="M8 45 Q35 18 62 42 Q82 58 60 80 Q38 102 12 85 Q0 68 8 45"
                fill="none" stroke="#34D399" stroke-width="3"/>
          <circle cx="35" cy="65" r="13" fill="#FF7A29" opacity="0.85"/>
          <circle cx="58" cy="55" r="13" fill="#FF7A29" opacity="0.85"/>
          <circle cx="52" cy="82" r="13" fill="#FF7A29" opacity="0.85"/>
          <g transform="translate(95,10) scale(0.5)">
            <path d="M100 90 Q78 58 55 25" fill="none" stroke="#34D399" stroke-width="15" stroke-linecap="round"/>
            <path d="M100 90 Q122 58 145 25" fill="none" stroke="#34D399" stroke-width="15" stroke-linecap="round"/>
            <path d="M100 90 Q78 122 55 175" fill="none" stroke="#34D399" stroke-width="15" stroke-linecap="round"/>
            <path d="M100 90 Q122 122 145 175" fill="none" stroke="#34D399" stroke-width="15" stroke-linecap="round"/>
            <circle cx="100" cy="90" r="11" fill="#FF7A29"/>
          </g>
        </svg>`,
    },
    dna: {
      title: "DNA",
      scale: "≈ 0.000002 mm wide",
      text: "Unwind a chromosome fully and you get a single, very long DNA molecule — two sugar-phosphate strands, held together by rungs made of paired nitrogen bases: A always with T, G always with C.",
      svg: `
        <svg viewBox="0 0 140 190" width="120" height="163" aria-label="Diagram of DNA showing paired bases A-T and G-C">
          <line x1="30" y1="15" x2="30" y2="175" stroke="#34D399" stroke-width="6" stroke-linecap="round"/>
          <line x1="110" y1="15" x2="110" y2="175" stroke="#1f8f68" stroke-width="6" stroke-linecap="round"/>
          <line x1="30" y1="35" x2="110" y2="35" stroke="#cbd5c8" stroke-width="3"/>
          <circle cx="30" cy="35" r="11" fill="#A78BFA"/><text x="30" y="39" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">G</text>
          <circle cx="110" cy="35" r="11" fill="#FFB03A"/><text x="110" y="39" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">C</text>
          <line x1="30" y1="75" x2="110" y2="75" stroke="#cbd5c8" stroke-width="3"/>
          <circle cx="30" cy="75" r="11" fill="#4FC3F7"/><text x="30" y="79" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">A</text>
          <circle cx="110" cy="75" r="11" fill="#E4574C"/><text x="110" y="79" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">T</text>
          <line x1="30" y1="115" x2="110" y2="115" stroke="#cbd5c8" stroke-width="3"/>
          <circle cx="30" cy="115" r="11" fill="#FFB03A"/><text x="30" y="119" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">C</text>
          <circle cx="110" cy="115" r="11" fill="#A78BFA"/><text x="110" y="119" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">G</text>
          <line x1="30" y1="155" x2="110" y2="155" stroke="#cbd5c8" stroke-width="3"/>
          <circle cx="30" cy="155" r="11" fill="#4FC3F7"/><text x="30" y="159" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">A</text>
          <circle cx="110" cy="155" r="11" fill="#E4574C"/><text x="110" y="159" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">T</text>
        </svg>`,
    },
    gene: {
      title: "Gene",
      scale: "A specific sequence of nucleotides",
      text: "Gene is a specific sequence of nucleotides in DNA. Proteins, made according to a gene's instructions, are what actually produce a characteristic feature or control an activity in the body. One DNA strand contains many genes, one after another.",
      svg: `
        <svg viewBox="0 0 140 190" width="120" height="163" aria-label="Diagram of a gene as a bracketed sequence of bases on DNA">
          <line x1="30" y1="15" x2="30" y2="175" stroke="#34D399" stroke-width="6" stroke-linecap="round"/>
          <line x1="110" y1="15" x2="110" y2="175" stroke="#1f8f68" stroke-width="6" stroke-linecap="round"/>
          <line x1="30" y1="35" x2="110" y2="35" stroke="#cbd5c8" stroke-width="3"/>
          <circle cx="30" cy="35" r="11" fill="#A78BFA"/><text x="30" y="39" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">G</text>
          <circle cx="110" cy="35" r="11" fill="#FFB03A"/><text x="110" y="39" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">C</text>
          <line x1="30" y1="75" x2="110" y2="75" stroke="#cbd5c8" stroke-width="3"/>
          <circle cx="30" cy="75" r="11" fill="#4FC3F7"/><text x="30" y="79" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">A</text>
          <circle cx="110" cy="75" r="11" fill="#E4574C"/><text x="110" y="79" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">T</text>
          <line x1="30" y1="115" x2="110" y2="115" stroke="#cbd5c8" stroke-width="3"/>
          <circle cx="30" cy="115" r="11" fill="#FFB03A"/><text x="30" y="119" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">C</text>
          <circle cx="110" cy="115" r="11" fill="#A78BFA"/><text x="110" y="119" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">G</text>
          <line x1="30" y1="155" x2="110" y2="155" stroke="#cbd5c8" stroke-width="3"/>
          <circle cx="30" cy="155" r="11" fill="#4FC3F7"/><text x="30" y="159" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">A</text>
          <circle cx="110" cy="155" r="11" fill="#E4574C"/><text x="110" y="159" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle">T</text>
          <rect x="10" y="58" width="120" height="40" rx="10" fill="none" stroke="#FF7A29" stroke-width="3" stroke-dasharray="6 4"/>
        </svg>`,
    },
  };

  const ORDER = ["cell", "nucleus", "chromosome", "dna", "gene"];

  function showStage(stage) {
    const data = STAGES[stage];
    if (!data) return;

    nav.querySelectorAll(".zoom-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.stage === stage);
    });

    visual.innerHTML = data.svg;
    titleEl.textContent = data.title;
    textEl.textContent = data.text;
    scaleEl.textContent = data.scale;
  }

  nav.addEventListener("click", (e) => {
    const btn = e.target.closest(".zoom-btn");
    if (!btn) return;
    showStage(btn.dataset.stage);
  });

  showStage(ORDER[0]);
})();

/* ---------------------------------------------------------
   2. PRACTICE QUIZ
   --------------------------------------------------------- */
(function () {
  const questions = [
    {
      q: "What is a gene, precisely?",
      options: [
        "A whole chromosome",
        "A specific sequence of nucleotides in DNA",
        "The membrane around a cell",
        "A cluster of histone proteins",
      ],
      answer: 1,
      explain: "Gene is a specific sequence of nucleotides in DNA. Proteins made from its instructions produce a trait or control an activity.",
    },
    {
      q: "What is a chromosome mainly made of?",
      options: ["Water and salt", "DNA and histone proteins", "Sugar only", "Fat molecules"],
      answer: 1,
      explain: "DNA and histone proteins are the primary components of a chromosome — DNA winds around histones, and the whole thing packs and coils up.",
    },
    {
      q: "What is a nucleosome?",
      options: [
        "A type of chromosome found only in the nucleus",
        "DNA wound around a histone octamer",
        "The centromere of a chromosome",
        "A single nucleotide",
      ],
      answer: 1,
      explain: "Eight histone proteins join to form a histone octamer. DNA winding around this octamer forms a nucleosome — chromosomes are built by packing many nucleosomes together.",
    },
    {
      q: "A nucleotide, the basic building block of DNA, is made of which three parts?",
      options: [
        "A histone, a centromere, and a chromatid",
        "A deoxyribose sugar, a phosphate group, and a nitrogen base",
        "Two nitrogen bases and one sugar",
        "A gene, a chromosome, and a cell",
      ],
      answer: 1,
      explain: "Each nucleotide is composed of a deoxyribose sugar, a phosphate group, and a nitrogen base — the phosphate links nucleotides together into a strand.",
    },
    {
      q: "In DNA, which base does Adenine always pair with?",
      options: ["Guanine", "Cytosine", "Thymine", "Another Adenine"],
      answer: 2,
      explain: "Adenine (A) always pairs with Thymine (T) — this is a fixed rule in DNA's structure.",
    },
    {
      q: "Which base does Guanine always pair with?",
      options: ["Adenine", "Cytosine", "Thymine", "Another Guanine"],
      answer: 1,
      explain: "Guanine (G) always pairs with Cytosine (C).",
    },
    {
      q: "What shape does a DNA molecule have?",
      options: ["A single straight line", "A flat sheet", "A double helix", "A perfect circle"],
      answer: 2,
      explain: "DNA is a double helix — two strands twisted around each other like a spiral ladder.",
    },
    {
      q: "Where in a cell is most of the DNA found?",
      options: ["In the nucleus", "In the cell membrane", "Outside the cell", "In the cytoplasm only"],
      answer: 0,
      explain: "DNA is packed into chromosomes and stored inside the nucleus.",
    },
    {
      q: "How many chromosomes are present in a normal human cell?",
      options: ["23", "46", "92", "12"],
      answer: 1,
      explain: "Human cells have 46 chromosomes in total, arranged as 23 pairs — 22 pairs of somatic chromosomes plus one pair of sex chromosomes (XX or XY).",
    },
  ];

  const shell = document.getElementById("quizShell");
  if (!shell) return;

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

    const nextWrap = document.getElementById("nextWrap");
    const isLast = current === questions.length - 1;
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-primary";
    nextBtn.textContent = isLast ? "See results" : "Next question →";
    nextBtn.addEventListener("click", () => {
      current++;
      if (current >= questions.length) renderResults();
      else renderQuestion();
    });
    nextWrap.appendChild(nextBtn);
  }

  function renderResults() {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    let verdict = "Nice start — step through the zoom levels again and retake it.";
    if (pct >= 80) verdict = "Excellent! Genes, chromosomes and DNA are clear now.";
    else if (pct >= 50) verdict = "Good work — a little more time with the diagram and you've got it.";

    shell.innerHTML = `
      <div class="result-screen">
        <span class="eyebrow" style="justify-content:center;">RESULTS</span>
        <div class="big-score">${score} / ${total}</div>
        <p>${verdict}</p>
        <div class="result-actions">
          <button class="btn btn-primary" id="retryBtn">Try again</button>
          <a class="btn btn-dark" href="subject.html?class=10&subject=biology">Back to Biology chapters</a>
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
