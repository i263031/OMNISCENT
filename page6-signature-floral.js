(() => {
  const CART_KEY = "omniscent_cart";

  const catalog = [
    { name: "Signature Floral EDP", url: "page6-signature-floral.html", tags: "rose peony floral women" },
    { name: "Woody Amber Extrait", url: "page7-woody-amber.html", tags: "oud amber saffron unisex men" },
    { name: "Fragrance Quiz / Scents Finder", url: "page8-fragrance-quiz.html", tags: "quiz finder profile match" },
    { name: "Bleu de Chanel", url: "page7-woody-amber.html", tags: "citrus woods men" },
    { name: "Miss Dior", url: "page6-signature-floral.html", tags: "floral rose women" }
  ];

  const reviewsData = [
    { name: "Mahira S.", rating: 5, title: "Soft velvet petals that last all day", body: "Two sprays in the morning still linger on my scarf at night. The damask rose feels airy and modern rather than heavy.", verified: true },
    { name: "Zoya Tariq", rating: 5, title: "My new bridal & evening signature", body: "Ordered the 50 ml bottle and the silk coffer packaging alone feels couture. Compliments every single time I wear it.", verified: true },
    { name: "Hina A.", rating: 4, title: "Fresh lychee opening, cozy dry-down", body: "Bright and romantic for spring brunches. I layer it with a drop of amber oil when heading out for dinner.", verified: true }
  ];

  const state = {
    size: "50 ml",
    unitPrice: 22999,
    qty: 1,
    filter: "all",
    wishlist: false
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
    unitPriceDisplay: document.getElementById("unitPriceDisplay"),
    sizeNoteDisplay: document.getElementById("sizeNoteDisplay"),
    qtyValue: document.getElementById("qtyValue"),
    qtyMinus: document.getElementById("qtyMinus"),
    qtyPlus: document.getElementById("qtyPlus"),
    addToCartBtn: document.getElementById("addToCartBtn"),
    wishlistBtn: document.getElementById("wishlistBtn"),
    galleryCaption: document.getElementById("galleryCaption"),
    reviewsFeed: document.getElementById("reviewsFeed"),
    totalReviewCount: document.getElementById("totalReviewCount"),
    toggleReviewFormBtn: document.getElementById("toggleReviewFormBtn"),
    reviewForm: document.getElementById("reviewForm"),
    newsletterForm: document.getElementById("newsletterForm"),
    newsletterEmail: document.getElementById("newsletterEmail"),
    newsletterMsg: document.getElementById("newsletterMsg"),
    toast: document.getElementById("toast")
  };

  const formatRs = (num) => `Rs. ${Number(num).toLocaleString("en-PK")}`;
  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => els.toast.classList.remove("show"), 2600);
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

  function addItemToCart(name, size, price, qty = 1) {
    const cart = loadCart();
    const existing = cart.find((item) => item.name === name && item.size === size);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name, size, price, qty });
    }
    saveCart(cart);
    showToast(`Added ${qty} × ${name} (${size}) to your bag`);
  }

  function renderCart() {
    const cart = loadCart();
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    els.cartCountBadge.textContent = totalCount;
    els.cartSubtotalDisplay.textContent = formatRs(subtotal);

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

  // Dropdown & Search
  els.shopMenuBtn.addEventListener("click", () => {
    const isOpen = els.shopDropdown.classList.toggle("open");
    els.shopMenuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      els.shopDropdown.classList.remove("open");
      els.shopMenuBtn.setAttribute("aria-expanded", "false");
    }
  });

  function renderSearchResults() {
    const q = els.searchInput.value.trim().toLowerCase();
    const matches = q
      ? catalog.filter((c) => c.name.toLowerCase().includes(q) || c.tags.includes(q))
      : catalog;
    els.searchResults.innerHTML = matches
      .map((m) => `<a class="search-chip" href="${m.url}">${m.name} →</a>`)
      .join("");
  }

  els.searchToggleBtn.addEventListener("click", () => {
    els.searchDrawer.hidden = !els.searchDrawer.hidden;
    if (!els.searchDrawer.hidden) {
      renderSearchResults();
      els.searchInput.focus();
    }
  });

  els.searchInput.addEventListener("input", renderSearchResults);

  // Gallery Tabs
  document.querySelectorAll(".thumb-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".thumb-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      els.galleryCaption.textContent = btn.dataset.caption;
      const target = btn.dataset.target;
      document.querySelectorAll(".bottle-visual").forEach((view) => {
        view.hidden = view.dataset.view !== target;
      });
    });
  });

  // Size Selector
  document.querySelectorAll(".size-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.size = btn.dataset.size;
      state.unitPrice = Number(btn.dataset.price);
      els.unitPriceDisplay.textContent = formatRs(state.unitPrice);
      els.sizeNoteDisplay.textContent = btn.dataset.note;
    });
  });

  // Quantity Controls
  els.qtyMinus.addEventListener("click", () => {
    if (state.qty > 1) {
      state.qty -= 1;
      els.qtyValue.textContent = state.qty;
    }
  });
  els.qtyPlus.addEventListener("click", () => {
    if (state.qty < 10) {
      state.qty += 1;
      els.qtyValue.textContent = state.qty;
    }
  });

  // Add to Cart & Wishlist
  els.addToCartBtn.addEventListener("click", () => {
    addItemToCart("Signature Floral EDP", state.size, state.unitPrice, state.qty);
    toggleCartDrawer(true);
  });

  els.wishlistBtn.addEventListener("click", () => {
    state.wishlist = !state.wishlist;
    els.wishlistBtn.classList.toggle("saved", state.wishlist);
    els.wishlistBtn.textContent = state.wishlist ? "♥" : "♡";
    els.wishlistBtn.setAttribute("aria-pressed", String(state.wishlist));
    showToast(state.wishlist ? "Saved to your Wishlist" : "Removed from Wishlist");
  });

  // Quick Add on Pairings
  document.querySelectorAll(".quick-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      addItemToCart(btn.dataset.name, btn.dataset.size, Number(btn.dataset.price), 1);
    });
  });

  // Note Cards Interaction
  document.querySelectorAll(".note-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".note-card").forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
    });
  });

  // Reviews Rendering & Filtering
  function renderReviews() {
    const visible =
      state.filter === "all"
        ? reviewsData
        : reviewsData.filter((r) => String(r.rating) === state.filter);

    els.totalReviewCount.textContent = String(145 + reviewsData.length);
    els.reviewsFeed.innerHTML = visible
      .map(
        (r) => `
      <article class="review-item">
        <div class="review-top">
          <span class="review-author">${escapeHtml(r.name)}</span>
          <span class="review-verified">${r.verified ? "✓ Verified Purchase" : "Guest Review"}</span>
        </div>
        <div class="stars" aria-label="${r.rating} out of 5 stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <h4>${escapeHtml(r.title)}</h4>
        <p>${escapeHtml(r.body)}</p>
      </article>`
      )
      .join("");
  }

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.filter = chip.dataset.filter;
      renderReviews();
    });
  });

  els.toggleReviewFormBtn.addEventListener("click", () => {
    els.reviewForm.hidden = !els.reviewForm.hidden;
  });

  els.reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    reviewsData.unshift({
      name: document.getElementById("reviewerName").value.trim(),
      rating: Number(document.getElementById("reviewerRating").value),
      title: document.getElementById("reviewHeadline").value.trim(),
      body: document.getElementById("reviewBody").value.trim(),
      verified: false
    });
    els.reviewForm.reset();
    els.reviewForm.hidden = true;
    renderReviews();
    showToast("Thank you — your review is now live");
  });

  // Cart Drawer Events
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

  // Newsletter
  els.newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = els.newsletterEmail.value.trim();
    if (!email) return;
    els.newsletterMsg.textContent = `Welcome to Omniscent Inner Circle — ${email} is subscribed.`;
    els.newsletterForm.reset();
  });

  renderReviews();
  renderCart();
})();
