(() => {
  const CART_KEY = "omniscent_cart";

  const catalog = [
    { name: "Signature Floral EDP", url: "page6-signature-floral.html", tags: "floral rose women" },
    { name: "Woody Amber Extrait", url: "page7-woody-amber.html", tags: "woody amber oud unisex" },
    { name: "Fragrance Quiz / Scents Finder", url: "page8-fragrance-quiz.html", tags: "quiz finder" }
  ];

  const questions = [
    {
      badge: "QUESTION 01",
      prompt: "When do you reach for fragrance most?",
      hint: "Choose the setting that feels most natural to your lifestyle.",
      options: [
        { id: "brunch", title: "Sunlit Garden & Daytime", sub: "Airy, luminous, effortless elegance", weights: { floral: 3, fresh: 2 } },
        { id: "gala", title: "Candlelit Evening Gala", sub: "Velvet silhouettes and warm allure", weights: { amber: 3, floral: 1 } },
        { id: "tailored", title: "Crisp Daily Tailoring", sub: "Structured, clean, quietly confident", weights: { fresh: 3, woody: 2 } },
        { id: "lounge", title: "Midnight Velvet Lounge", sub: "Smoked woods and unforgettable depth", weights: { amber: 2, woody: 3 } }
      ]
    },
    {
      badge: "QUESTION 02",
      prompt: "Which raw accord draws you in?",
      hint: "Select the scent family you naturally gravitate toward.",
      options: [
        { id: "rose", title: "Damask Rose & Peony", sub: "Velvet petals with soft citrus lift", weights: { floral: 4 } },
        { id: "oud", title: "Smoked Amber & Oud", sub: "Resinous warmth and Kashmiri saffron", weights: { amber: 3, woody: 2 } },
        { id: "citrus", title: "Bergamot & Cedarwood", sub: "Sparkling mineral freshness", weights: { fresh: 4, woody: 1 } },
        { id: "vanilla", title: "Cashmere & Spiced Musk", sub: "Skin-hugging creamy sophistication", weights: { floral: 2, amber: 2 } }
      ]
    },
    {
      badge: "QUESTION 03",
      prompt: "How should your scent enter a room?",
      hint: "Define your preferred sillage and projection.",
      options: [
        { id: "whisper", title: "Intimate Skin Whisper", sub: "Discovered only up close", weights: { floral: 2, fresh: 2 } },
        { id: "balanced", title: "Graceful Aura", sub: "A polished trail that turns heads", weights: { floral: 3, fresh: 1 } },
        { id: "statement", title: "Commanding Extrait", sub: "Rich presence lasting 14+ hours", weights: { amber: 4, woody: 2 } },
        { id: "crisp", title: "Clean & Modern", sub: "Energizing lift from morning to dusk", weights: { fresh: 3, woody: 1 } }
      ]
    },
    {
      badge: "QUESTION 04",
      prompt: "Pick your ideal season & atmosphere:",
      hint: "Temperature shapes how top and base notes bloom.",
      options: [
        { id: "spring", title: "Spring Blossom Terrace", sub: "Dewy mornings and soft pink light", weights: { floral: 3, fresh: 1 } },
        { id: "autumn", title: "Golden Autumn Library", sub: "Leather, warm amber, and cedar", weights: { woody: 3, amber: 2 } },
        { id: "winter", title: "Deep Winter Velvet", sub: "Fireside spices and rich resin", weights: { amber: 4 } },
        { id: "summer", title: "Endless Coastal Breeze", sub: "Sunlit bergamot and cool woods", weights: { fresh: 4 } }
      ]
    },
    {
      badge: "QUESTION 05",
      prompt: "What memory should linger hours later?",
      hint: "Choose the dry-down finish you love on your scarf or collar.",
      options: [
        { id: "petals", title: "Silk Petals & White Musk", sub: "Romantic, powdery, sunlit warmth", weights: { floral: 4 } },
        { id: "sandal", title: "Sandalwood & Golden Resin", sub: "Smoldering, luxurious, magnetic", weights: { amber: 3, woody: 3 } },
        { id: "mineral", title: "Dry Cedar & Vetiver", sub: "Crisp, architectural, timeless", weights: { fresh: 3, woody: 2 } },
        { id: "nectar", title: "Blackcurrant & Warm Vanilla", sub: "Chic, poised, luminous sweetness", weights: { floral: 2, amber: 2 } }
      ]
    }
  ];

  const profiles = {
    floral: {
      name: "Signature Floral EDP",
      styledTitle: "Signature <em>Floral</em> EDP",
      archetype: "THE LUMINOUS ROMANTIC",
      price: 22999,
      size: "50 ml",
      url: "page6-signature-floral.html",
      accent: "#E59D96",
      notes: ["Calabrian Bergamot", "Grasse Damask Rose", "White Peony", "Cashmere Musk"],
      summary:
        "You gravitate toward radiant, modern elegance. Signature Floral EDP wraps dewy rose and crushed peony over soft white musk — ideal for luminous daytime wear and romantic evenings.",
      runner: { name: "Si Eau de Parfum", meta: "Rs. 20,999 · 50 ml", url: "page6-signature-floral.html" }
    },
    amber: {
      name: "Woody Amber Extrait",
      styledTitle: "Woody <em>Amber</em> Extrait",
      archetype: "THE NOCTURNAL SOVEREIGN",
      price: 26499,
      size: "50 ml",
      url: "page7-woody-amber.html",
      accent: "#C97B6B",
      notes: ["Kashmiri Saffron", "Smoked Labdanum", "Aged Agarwood", "Mysore Sandalwood"],
      summary:
        "You favor rich, architectural depth that commands attention without shouting. Blended at 30% extrait oil, Woody Amber Extrait unfolds from spiced saffron into smoldering resin and creamy sandalwood.",
      runner: { name: "Signature Floral EDP", meta: "Rs. 22,999 · 50 ml (Layering Match)", url: "page6-signature-floral.html" }
    },
    fresh: {
      name: "Bleu de Chanel",
      styledTitle: "Bleu de <em>Chanel</em>",
      archetype: "THE TAILORED MINIMALIST",
      price: 24999,
      size: "100 ml",
      url: "page7-woody-amber.html",
      accent: "#9AB0BA",
      notes: ["Zesty Grapefruit", "Crushed Mint", "Dry Cedarwood", "Incense"],
      summary:
        "Clean structure and effortless poise define your signature. Crisp citrus meets dry cedarwood and subtle incense for an unmistakable everyday classic.",
      runner: { name: "Woody Amber Extrait", meta: "Rs. 26,499 · 50 ml", url: "page7-woody-amber.html" }
    },
    woody: {
      name: "Woody Amber Extrait",
      styledTitle: "Woody <em>Amber</em> Extrait",
      archetype: "THE VELVET CONNOISSEUR",
      price: 26499,
      size: "50 ml",
      url: "page7-woody-amber.html",
      accent: "#C97B6B",
      notes: ["Black Cardamom", "Assam Agarwood", "Golden Amber", "Mysore Sandalwood"],
      summary:
        "Grounded in rare woods and warm balsams, your profile thrives on longevity and tactile richness. Woody Amber Extrait delivers 14+ hours of refined wood-and-resin depth.",
      runner: { name: "Sauvage Elixir", meta: "Rs. 26,499 · 60 ml", url: "page7-woody-amber.html" }
    }
  };

  const state = {
    step: 0,
    answers: Array(questions.length).fill(null),
    matchedProfile: null
  };

  const els = {
    shopMenuBtn: document.getElementById("shopMenuBtn"),
    shopDropdown: document.getElementById("shopDropdown"),
    searchToggleBtn: document.getElementById("searchToggleBtn"),
    searchDrawer: document.getElementById("searchDrawer"),
    searchInput: document.getElementById("searchInput"),
    searchResults: document.getElementById("searchResults"),
    cartToggleBtn: document.getElementById("cartToggleBtn"),
    cartDrawer: document.getElementById("cartDrawer"),
    cartBackdrop: document.getElementById("cartBackdrop"),
    closeCartBtn: document.getElementById("closeCartBtn"),
    cartCountBadge: document.getElementById("cartCountBadge"),
    cartItemsList: document.getElementById("cartItemsList"),
    cartSubtotalDisplay: document.getElementById("cartSubtotalDisplay"),
    checkoutStubBtn: document.getElementById("checkoutStubBtn"),
    quizStage: document.getElementById("quizStage"),
    stepCounter: document.getElementById("stepCounter"),
    prevStepBtn: document.getElementById("prevStepBtn"),
    nextStepBtn: document.getElementById("nextStepBtn"),
    progressFill: document.getElementById("progressFill"),
    questionBadge: document.getElementById("questionBadge"),
    questionPrompt: document.getElementById("questionPrompt"),
    questionHint: document.getElementById("questionHint"),
    optionsGrid: document.getElementById("optionsGrid"),
    skipQuizBtn: document.getElementById("skipQuizBtn"),
    continueBtn: document.getElementById("continueBtn"),
    continueLabel: document.getElementById("continueLabel"),
    resultSection: document.getElementById("resultSection"),
    matchPercentBadge: document.getElementById("matchPercentBadge"),
    resultBottleArt: document.getElementById("resultBottleArt"),
    archetypeLabel: document.getElementById("archetypeLabel"),
    matchedProductName: document.getElementById("matchedProductName"),
    matchedPrice: document.getElementById("matchedPrice"),
    resultSummary: document.getElementById("resultSummary"),
    resultNotesRow: document.getElementById("resultNotesRow"),
    dnaBars: document.getElementById("dnaBars"),
    addMatchCartBtn: document.getElementById("addMatchCartBtn"),
    viewMatchLink: document.getElementById("viewMatchLink"),
    retakeQuizBtn: document.getElementById("retakeQuizBtn"),
    runnerUpName: document.getElementById("runnerUpName"),
    runnerUpMeta: document.getElementById("runnerUpMeta"),
    runnerUpLink: document.getElementById("runnerUpLink"),
    newsletterForm: document.getElementById("newsletterForm"),
    newsletterEmail: document.getElementById("newsletterEmail"),
    newsletterMsg: document.getElementById("newsletterMsg"),
    toast: document.getElementById("toast")
  };

  const formatRs = (n) => `Rs. ${Number(n).toLocaleString("en-PK")}`;
  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => els.toast.classList.remove("show"), 2600);
  }

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }

  function renderCart() {
    const cart = loadCart();
    els.cartCountBadge.textContent = cart.reduce((s, i) => s + i.qty, 0);
    els.cartSubtotalDisplay.textContent = formatRs(cart.reduce((s, i) => s + i.price * i.qty, 0));

    if (!cart.length) {
      els.cartItemsList.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;">Your shopping bag is currently empty.</p>`;
      return;
    }

    els.cartItemsList.innerHTML = cart
      .map(
        (item, idx) => `
      <div class="cart-item">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.size)} · Qty ${item.qty} · ${formatRs(item.price * item.qty)}</span>
        </div>
        <button type="button" class="remove-item-btn" data-remove-idx="${idx}">Remove</button>
      </div>`
      )
      .join("");
  }

  function toggleCartDrawer(open) {
    els.cartDrawer.classList.toggle("open", open);
    els.cartDrawer.setAttribute("aria-hidden", String(!open));
  }

  function renderStep() {
    const q = questions[state.step];
    const selectedId = state.answers[state.step];
    const stepNum = String(state.step + 1).padStart(2, "0");

    els.stepCounter.innerHTML = `<strong>${stepNum}</strong> / 0${questions.length}`;
    els.progressFill.style.width = `${((state.step + 1) / questions.length) * 100}%`;
    els.questionBadge.textContent = q.badge;
    els.questionPrompt.textContent = q.prompt;
    els.questionHint.textContent = q.hint;

    els.prevStepBtn.disabled = state.step === 0;
    els.nextStepBtn.disabled = !selectedId;
    els.continueBtn.disabled = !selectedId;
    els.continueLabel.textContent = state.step === questions.length - 1 ? "Reveal My Scent Profile" : "Next Question";

    els.optionsGrid.innerHTML = q.options
      .map(
        (opt) => `
      <button type="button" class="option-tile ${selectedId === opt.id ? "selected" : ""}" data-option-id="${opt.id}" role="radio" aria-checked="${selectedId === opt.id}">
        <strong>${opt.title}</strong>
        <span>${opt.sub}</span>
      </button>`
      )
      .join("");
  }

  function buildBottleSvg(accentColor, label) {
    return `
      <svg viewBox="0 0 160 190" width="150" height="178" role="img" aria-label="${escapeHtml(label)} bottle preview">
        <rect x="60" y="16" width="40" height="24" rx="4" fill="${accentColor}" />
        <rect x="55" y="40" width="50" height="8" rx="3" fill="#F2D2C9" />
        <rect x="34" y="48" width="92" height="122" rx="14" fill="${accentColor}" fill-opacity="0.28" stroke="${accentColor}" stroke-width="1.6" />
        <rect x="48" y="82" width="64" height="54" rx="6" fill="#FBF4EF" />
        <text x="80" y="104" text-anchor="middle" font-family="Playfair Display, serif" font-size="8" letter-spacing="2" fill="#231715">OMNISCENT</text>
        <text x="80" y="121" text-anchor="middle" font-family="Playfair Display, serif" font-style="italic" font-size="9.5" fill="#CC6E68">${escapeHtml(label)}</text>
      </svg>`;
  }

  function computeResult() {
    const totals = { floral: 0, amber: 0, fresh: 0, woody: 0 };
    state.answers.forEach((ansId, idx) => {
      const opt = questions[idx].options.find((o) => o.id === ansId);
      if (!opt) return;
      Object.entries(opt.weights).forEach(([k, v]) => {
        totals[k] += v;
      });
    });

    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const winnerKey = sorted[0][0];
    const profile = profiles[winnerKey];
    state.matchedProfile = profile;

    const maxScore = Math.max(12, sorted[0][1] + 2);
    const matchPct = Math.min(98, Math.max(84, Math.round((sorted[0][1] / maxScore) * 100) + 18));

    els.matchPercentBadge.textContent = `${matchPct}% SCENT MATCH`;
    els.resultBottleArt.innerHTML = buildBottleSvg(profile.accent, profile.name);
    els.archetypeLabel.textContent = profile.archetype;
    els.matchedProductName.innerHTML = profile.styledTitle;
    els.matchedPrice.textContent = `${formatRs(profile.price)} · ${profile.size}`;
    els.resultSummary.textContent = profile.summary;
    els.resultNotesRow.innerHTML = profile.notes.map((n) => `<span>${n}</span>`).join("");

    const peak = Math.max(1, sorted[0][1]);
    const labels = { floral: "Floral", amber: "Amber", woody: "Woody", fresh: "Fresh" };
    els.dnaBars.innerHTML = Object.entries(labels)
      .map(([key, label]) => {
        const pct = Math.min(96, Math.max(8, Math.round((totals[key] / peak) * 94)));
        return `
        <div class="dna-row">
          <span>${label}</span>
          <div class="dna-track"><i style="width:${pct}%"></i></div>
          <span>${pct}%</span>
        </div>`;
      })
      .join("");

    els.viewMatchLink.href = profile.url;
    els.runnerUpName.textContent = profile.runner.name;
    els.runnerUpMeta.textContent = profile.runner.meta;
    els.runnerUpLink.href = profile.runner.url;

    els.quizStage.hidden = true;
    els.resultSection.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Quiz Events
  els.optionsGrid.addEventListener("click", (e) => {
    const tile = e.target.closest(".option-tile");
    if (!tile) return;
    state.answers[state.step] = tile.dataset.optionId;
    renderStep();
  });

  function goNext() {
    if (!state.answers[state.step]) return;
    if (state.step < questions.length - 1) {
      state.step += 1;
      renderStep();
    } else {
      computeResult();
    }
  }

  function goPrev() {
    if (state.step > 0) {
      state.step -= 1;
      renderStep();
    }
  }

  els.continueBtn.addEventListener("click", goNext);
  els.nextStepBtn.addEventListener("click", goNext);
  els.prevStepBtn.addEventListener("click", goPrev);

  function resetQuiz() {
    state.step = 0;
    state.answers = Array(questions.length).fill(null);
    els.resultSection.hidden = true;
    els.quizStage.hidden = false;
    renderStep();
  }

  els.skipQuizBtn.addEventListener("click", resetQuiz);
  els.retakeQuizBtn.addEventListener("click", resetQuiz);

  els.addMatchCartBtn.addEventListener("click", () => {
    if (!state.matchedProfile) return;
    const cart = loadCart();
    const { name, size, price } = state.matchedProfile;
    const existing = cart.find((i) => i.name === name && i.size === size);
    if (existing) existing.qty += 1;
    else cart.push({ name, size, price, qty: 1 });
    saveCart(cart);
    showToast(`Added ${name} (${size}) to your bag`);
    toggleCartDrawer(true);
  });

  // Nav, Search & Cart Drawer
  els.shopMenuBtn.addEventListener("click", () => {
    const open = els.shopDropdown.classList.toggle("open");
    els.shopMenuBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      els.shopDropdown.classList.remove("open");
      els.shopMenuBtn.setAttribute("aria-expanded", "false");
    }
  });
  function renderSearchResults() {
    const q = els.searchInput.value.trim().toLowerCase();
    const list = q ? catalog.filter((c) => c.name.toLowerCase().includes(q) || c.tags.includes(q)) : catalog;
    els.searchResults.innerHTML = list.map((m) => `<a class="search-chip" href="${m.url}">${m.name} →</a>`).join("");
  }

  els.searchToggleBtn.addEventListener("click", () => {
    els.searchDrawer.hidden = !els.searchDrawer.hidden;
    if (!els.searchDrawer.hidden) {
      renderSearchResults();
      els.searchInput.focus();
    }
  });
  els.searchInput.addEventListener("input", renderSearchResults);

  els.cartToggleBtn.addEventListener("click", () => toggleCartDrawer(true));
  els.closeCartBtn.addEventListener("click", () => toggleCartDrawer(false));
  els.cartBackdrop.addEventListener("click", () => toggleCartDrawer(false));
  els.cartItemsList.addEventListener("click", (e) => {
    const idx = e.target.dataset.removeIdx;
    if (idx !== undefined) {
      const cart = loadCart();
      cart.splice(Number(idx), 1);
      saveCart(cart);
    }
  });
  els.checkoutStubBtn.addEventListener("click", () => {
    showToast("Proceeding with your Omniscent Atelier order...");
  });

  els.newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = els.newsletterEmail.value.trim();
    if (!email) return;
    els.newsletterMsg.textContent = `Welcome to Omniscent Inner Circle — ${email} is subscribed.`;
    els.newsletterForm.reset();
  });

  renderStep();
  renderCart();
})();
