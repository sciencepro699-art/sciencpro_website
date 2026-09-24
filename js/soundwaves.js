/* =========================================================
   SCIENCE PRO — Chapter: Sound Waves (Class 10 Physics)
   -----------------------------------------------------------
   This file is intentionally self-contained: the simulation and
   quiz content below belong only to this chapter. Other chapters
   (in other subjects, or other physics chapters) will each get
   their own HTML + JS pair like this one — nothing here is meant
   to be shared or reused as a generic "engine".
   ========================================================= */

/* ---------------------------------------------------------
   1. WAVE SIMULATION (canvas)
   --------------------------------------------------------- */
(function () {
  const canvas = document.getElementById("waveCanvas");
  const ctx = canvas.getContext("2d");

  const freqSlider = document.getElementById("freqSlider");
  const ampSlider = document.getElementById("ampSlider");
  const freqLabel = document.getElementById("freqLabel");
  const ampLabel = document.getElementById("ampLabel");

  const readFreq = document.getElementById("readFreq");
  const readPeriod = document.getElementById("readPeriod");
  const readWavelength = document.getElementById("readWavelength");
  const readAmp = document.getElementById("readAmp");

  const SPEED_OF_SOUND = 343; // m/s, in air

  let frequency = Number(freqSlider.value);
  let amplitudePct = Number(ampSlider.value);
  let phase = 0;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = 260 * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function updateReadouts() {
    const T = 1000 / frequency; // ms
    const wavelength = SPEED_OF_SOUND / frequency; // metres

    freqLabel.textContent = `${frequency} Hz`;
    ampLabel.textContent = `${amplitudePct}%`;
    readFreq.textContent = `${frequency} Hz`;
    readPeriod.textContent = `${T.toFixed(2)} ms`;
    readWavelength.textContent = `${wavelength.toFixed(2)} m`;
    readAmp.textContent = `${amplitudePct}%`;
  }

  function draw() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, w, h);

    const midY = h / 2;
    const amp = (amplitudePct / 100) * (h * 0.36);

    // Visual cycle count scales with frequency so higher pitch reads as a
    // "tighter" wave, while the real Hz/T/λ numbers stay scientifically
    // accurate and independent of this drawing choice.
    const visibleCycles = Math.max(1, frequency / 100);
    const cycleWidth = w / visibleCycles;

    // --- wave curve ---
    ctx.beginPath();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = "#4FC3F7";
    for (let x = 0; x <= w; x++) {
      const y = midY - amp * Math.sin((2 * Math.PI * x) / cycleWidth - phase);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // --- centre line ---
    ctx.beginPath();
    ctx.strokeStyle = "rgba(250,247,241,0.15)";
    ctx.lineWidth = 1;
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // --- amplitude marker (vertical arrow at x = cycleWidth * 0.25) ---
    const ax = cycleWidth * 0.25;
    const ayTop = midY - amp;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(250,247,241,0.55)";
    ctx.lineWidth = 1.4;
    ctx.moveTo(ax, midY);
    ctx.lineTo(ax, ayTop);
    ctx.stroke();
    ctx.fillStyle = "rgba(250,247,241,0.75)";
    ctx.font = "12px 'JetBrains Mono', monospace";
    ctx.fillText("A", ax + 6, (midY + ayTop) / 2);

    // --- wavelength marker (horizontal span between two crests) ---
    const wlY = 24;
    const wlStart = cycleWidth * 0.75;
    const wlEnd = wlStart + cycleWidth;
    if (wlEnd < w) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(250,247,241,0.55)";
      ctx.lineWidth = 1.4;
      ctx.moveTo(wlStart, wlY);
      ctx.lineTo(wlEnd, wlY);
      ctx.stroke();
      ctx.fillText("λ", (wlStart + wlEnd) / 2 - 4, wlY - 8);
    }

    phase += 0.045;
    requestAnimationFrame(draw);
  }

  freqSlider.addEventListener("input", () => {
    frequency = Number(freqSlider.value);
    updateReadouts();
    if (window.__soundWaveAudio) window.__soundWaveAudio.setFrequency(frequency);
    document.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active"));
  });

  ampSlider.addEventListener("input", () => {
    amplitudePct = Number(ampSlider.value);
    updateReadouts();
    if (window.__soundWaveAudio) window.__soundWaveAudio.setAmplitude(amplitudePct);
  });

  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = Number(btn.dataset.freq);
      freqSlider.value = f;
      frequency = f;
      updateReadouts();
      if (window.__soundWaveAudio) window.__soundWaveAudio.setFrequency(frequency);
      document.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  updateReadouts();
  requestAnimationFrame(draw);
})();

/* ---------------------------------------------------------
   2. AUDIBLE TONE (Web Audio API)
   --------------------------------------------------------- */
(function () {
  const playBtn = document.getElementById("playToneBtn");
  const freqSlider = document.getElementById("freqSlider");
  const ampSlider = document.getElementById("ampSlider");

  let audioCtx = null;
  let oscillator = null;
  let gainNode = null;
  let isPlaying = false;

  function ensureContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function start() {
    ensureContext();
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = Number(freqSlider.value);
    gainNode.gain.value = (Number(ampSlider.value) / 100) * 0.18; // safe volume ceiling
    oscillator.connect(gainNode).connect(audioCtx.destination);
    oscillator.start();
    isPlaying = true;
    playBtn.textContent = "■ Stop tone";
  }

  function stop() {
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }
    isPlaying = false;
    playBtn.textContent = "▶ Play tone";
  }

  playBtn.addEventListener("click", () => {
    if (isPlaying) stop();
    else start();
  });

  // Exposed so the slider handlers above can update a *live* tone
  // without needing to know anything about Web Audio internals.
  window.__soundWaveAudio = {
    setFrequency(f) {
      if (isPlaying && oscillator) oscillator.frequency.setValueAtTime(f, audioCtx.currentTime);
    },
    setAmplitude(pct) {
      if (isPlaying && gainNode) gainNode.gain.setValueAtTime((pct / 100) * 0.18, audioCtx.currentTime);
    },
  };
})();

/* ---------------------------------------------------------
   3. PRACTICE QUIZ (content specific to this chapter)
   --------------------------------------------------------- */
(function () {
  const questions = [
    {
      q: "What is frequency the measure of?",
      options: [
        "How loud a sound is",
        "The number of oscillations per second",
        "The speed a wave travels at",
        "The distance a wave travels",
      ],
      answer: 1,
      explain: "Frequency counts how many complete oscillations happen every second, measured in Hertz (Hz).",
    },
    {
      q: "If you increase the frequency of a wave, what happens to its wavelength (at constant speed)?",
      options: ["It increases", "It decreases", "It stays the same", "It becomes zero"],
      answer: 1,
      explain: "Since λ = v / f, a higher frequency means a shorter wavelength when speed stays constant.",
    },
    {
      q: "What does increasing the amplitude of a sound wave change?",
      options: ["Its pitch", "Its loudness", "Its wavelength", "Its speed"],
      answer: 1,
      explain: "Amplitude controls loudness — a taller wave carries more energy and sounds louder, but pitch (frequency) is unaffected.",
    },
    {
      q: "Time period and frequency are related by:",
      options: ["T = f", "T = 1/f", "T = f²", "T = 2f"],
      answer: 1,
      explain: "Time period is the reciprocal of frequency: T = 1/f.",
    },
    {
      q: "A sound wave with a higher frequency will sound:",
      options: ["Louder", "Softer", "Higher-pitched", "Lower-pitched"],
      answer: 2,
      explain: "Higher frequency corresponds to a higher pitch — that's exactly what you heard in the simulation above.",
    },
  ];

  const shell = document.getElementById("quizShell");
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
    let verdict = "Nice start — replay the simulation above and try again.";
    if (pct >= 80) verdict = "Excellent! Frequency, time period, wavelength and amplitude have clicked.";
    else if (pct >= 50) verdict = "Good work — a little more time with the simulation and you've got it.";

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
