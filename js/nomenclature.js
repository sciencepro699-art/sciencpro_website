/* =========================================================
   SCIENCE PRO — Chapter: Nomenclature of Organic Compounds
   (Class 10 Chemistry)
   -----------------------------------------------------------
   Self-contained, like js/soundwaves.js. Deliberately scoped to
   simple, straight-chain, exam-relevant compounds only:
   methane–butane, ethene–butene, ethyne–butyne, and the basic
   alcohol / carboxylic acid functional groups. No branching, no
   substituent numbering, no compounds beyond 4 carbons — those
   aren't what SSLC naming questions actually ask for.
   ========================================================= */

/* ---------------------------------------------------------
   1. COMPOUND NAME BUILDER
   --------------------------------------------------------- */
(function () {
  const carbonRow = document.getElementById("carbonRow");
  const typeRow = document.getElementById("typeRow");
  if (!carbonRow || !typeRow) return;

  const builtName = document.getElementById("builtName");
  const structuralFormula = document.getElementById("structuralFormula");
  const molecularFormula = document.getElementById("molecularFormula");
  const invalidNote = document.getElementById("invalidNote");

  const PREFIXES = { 1: "Meth", 2: "Eth", 3: "Prop", 4: "But" };

  // type -> { suffix, minCarbons, structural[carbon], molecular[carbon] }
  const TYPES = {
    ane: {
      suffix: "ane",
      minCarbons: 1,
      structural: { 1: "CH₄", 2: "CH₃-CH₃", 3: "CH₃-CH₂-CH₃", 4: "CH₃-CH₂-CH₂-CH₃" },
      molecular: { 1: "CH₄", 2: "C₂H₆", 3: "C₃H₈", 4: "C₄H₁₀" },
    },
    ene: {
      suffix: "ene",
      minCarbons: 2,
      structural: { 2: "CH₂=CH₂", 3: "CH₂=CH-CH₃", 4: "CH₂=CH-CH₂-CH₃" },
      molecular: { 2: "C₂H₄", 3: "C₃H₆", 4: "C₄H₈" },
    },
    yne: {
      suffix: "yne",
      minCarbons: 2,
      structural: { 2: "CH≡CH", 3: "CH≡C-CH₃", 4: "CH≡C-CH₂-CH₃" },
      molecular: { 2: "C₂H₂", 3: "C₃H₄", 4: "C₄H₆" },
    },
    ol: {
      suffix: "anol",
      minCarbons: 1,
      structural: { 1: "CH₃-OH", 2: "CH₃-CH₂-OH", 3: "CH₃-CH₂-CH₂-OH", 4: "CH₃-CH₂-CH₂-CH₂-OH" },
      molecular: { 1: "CH₄O", 2: "C₂H₆O", 3: "C₃H₈O", 4: "C₄H₁₀O" },
    },
    acid: {
      suffix: "anoic acid",
      minCarbons: 1,
      structural: { 1: "H-COOH", 2: "CH₃-COOH", 3: "CH₃-CH₂-COOH", 4: "CH₃-CH₂-CH₂-COOH" },
      molecular: { 1: "CH₂O₂", 2: "C₂H₄O₂", 3: "C₃H₆O₂", 4: "C₄H₈O₂" },
    },
  };

  let carbon = null;
  let type = null;

  function suffixLabel(t) {
    // "ane"/"ene"/"yne" attach directly to the prefix (Eth+ane -> Ethane).
    // "ol"/"acid" use their full attached form already ("anol", "anoic acid").
    return TYPES[t].suffix;
  }

  function render() {
    // Carbon button states
    carbonRow.querySelectorAll(".nomen-btn").forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.carbon) === carbon);
    });

    // Type button validity + state depends on chosen carbon count
    let autoCorrected = false;
    typeRow.querySelectorAll(".nomen-btn").forEach((btn) => {
      const t = btn.dataset.type;
      const valid = carbon === null || carbon >= TYPES[t].minCarbons;
      btn.disabled = !valid;
      if (!valid && type === t) {
        type = null; // the current selection just became impossible
        autoCorrected = true;
      }
      btn.classList.toggle("active", t === type);
    });

    invalidNote.classList.toggle("show", autoCorrected);

    if (carbon === null) {
      builtName.textContent = "Pick a carbon count to begin";
      structuralFormula.textContent = "—";
      molecularFormula.textContent = "—";
      return;
    }
    if (type === null) {
      builtName.innerHTML = `<span class="part-prefix">${PREFIXES[carbon]}-</span> … pick a type above`;
      structuralFormula.textContent = "—";
      molecularFormula.textContent = "—";
      return;
    }

    const prefix = PREFIXES[carbon];
    const suffix = suffixLabel(type);

    builtName.innerHTML = `<span class="part-prefix">${prefix}</span><span class="part-suffix">${suffix}</span>`;
    structuralFormula.textContent = TYPES[type].structural[carbon];
    molecularFormula.textContent = TYPES[type].molecular[carbon];
  }

  carbonRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".nomen-btn");
    if (!btn) return;
    carbon = Number(btn.dataset.carbon);
    render();
  });

  typeRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".nomen-btn");
    if (!btn || btn.disabled) return;
    type = btn.dataset.type;
    render();
  });

  render();
})();

/* ---------------------------------------------------------
   2. PRACTICE QUIZ
   --------------------------------------------------------- */
(function () {
  const questions = [
    {
      q: "What is the IUPAC name of CH₄?",
      options: ["Methane", "Ethane", "Methanol", "Methanoic acid"],
      answer: 0,
      explain: "One carbon atom with only single bonds → prefix 'Meth-' + suffix '-ane' = Methane.",
    },
    {
      q: "Which suffix is used for a compound with one carbon–carbon triple bond?",
      options: ["-ane", "-ene", "-yne", "-ol"],
      answer: 2,
      explain: "'-yne' always indicates one triple bond between carbon atoms, e.g. Ethyne, Propyne.",
    },
    {
      q: "What is the IUPAC name of CH₃-CH₂-OH?",
      options: ["Ethane", "Ethanol", "Ethanoic acid", "Ethene"],
      answer: 1,
      explain: "Two carbons (Eth-) with an −OH group gives the suffix '-anol' → Ethanol.",
    },
    {
      q: "What is the molecular formula of propane?",
      options: ["C₃H₆", "C₃H₄", "C₃H₈", "C₄H₈"],
      answer: 2,
      explain: "Alkanes follow CₙH₂ₙ₊₂. For n = 3: C₃H₈.",
    },
    {
      q: "What is the IUPAC name of CH₃-COOH?",
      options: ["Methanoic acid", "Ethanoic acid", "Ethanol", "Propanoic acid"],
      answer: 1,
      explain: "Two carbons (Eth-) with a −COOH group gives the suffix '-anoic acid' → Ethanoic acid.",
    },
    {
      q: "Which prefix represents a chain of 3 carbon atoms?",
      options: ["Meth-", "Eth-", "Prop-", "But-"],
      answer: 2,
      explain: "Prop- always means 3 carbon atoms, as in Propane, Propene, Propyne.",
    },
    {
      q: "The suffix '-oic acid' tells you the compound has which functional group?",
      options: ["An alcohol group, −OH", "A carboxylic acid group, −COOH", "A double bond", "A triple bond"],
      answer: 1,
      explain: "'-oic acid' (from '-anoic acid') always indicates a carboxylic acid group, −COOH.",
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
    let verdict = "Nice start — try the builder above again and retake it.";
    if (pct >= 80) verdict = "Excellent! You've got the naming pattern down.";
    else if (pct >= 50) verdict = "Good work — a little more time with the builder and you've got it.";

    shell.innerHTML = `
      <div class="result-screen">
        <span class="eyebrow" style="justify-content:center;">RESULTS</span>
        <div class="big-score">${score} / ${total}</div>
        <p>${verdict}</p>
        <div class="result-actions">
          <button class="btn btn-primary" id="retryBtn">Try again</button>
          <a class="btn btn-dark" href="subject.html?class=10&subject=chemistry">Back to Chemistry chapters</a>
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
